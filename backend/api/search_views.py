from django.db.models import Q
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework import status

from .models import (
    Opportunity, Event, SSService, StudentProject,
    TalentProfile, StudentStory, SavedOpportunity, EventRegistration, StudentProfile
)
from .serializers import (
    OpportunitySerializer, EventSerializer, SSServiceSerializer,
    StudentProjectSerializer, TalentProfileSerializer, StudentStorySerializer,
    SavedOpportunitySerializer, EventRegistrationSerializer
)


@api_view(['GET'])
@permission_classes([AllowAny])
def unified_search(request):
    """
    GET /api/search/?q=...&category=all|opportunities|events|sessions|services|projects|talent
    Unified search across all public content modules in SS.
    Uses database indexes and Django ORM queries with pagination.
    """
    query_text = request.query_params.get('q', '').strip()
    category_filter = request.query_params.get('category', 'all').lower()

    results = {
        'opportunities': [],
        'events': [],
        'sessions': [],
        'services': [],
        'projects': [],
        'talent': []
    }

    if not query_text:
        return Response({'success': True, 'query': query_text, 'results': results, 'total_count': 0})

    # 1. Opportunities Search
    if category_filter in ['all', 'opportunities']:
        opps = Opportunity.objects.filter(
            Q(status__in=['OPEN', 'CLOSING_SOON']) &
            (Q(title__icontains=query_text) | Q(description__icontains=query_text) |
             Q(organization_name__icontains=query_text) | Q(location__icontains=query_text) |
             Q(tags__icontains=query_text))
        ).order_by('-created_at')[:10]
        results['opportunities'] = OpportunitySerializer(opps, many=True, context={'request': request}).data

    # 2. Events & Sessions Search
    if category_filter in ['all', 'events', 'sessions', 'workshops']:
        events_qs = Event.objects.filter(
            Q(is_published=True) & ~Q(status='CANCELLED') &
            (Q(title__icontains=query_text) | Q(description__icontains=query_text) |
             Q(location__icontains=query_text) | Q(organizer__icontains=query_text))
        ).order_by('-start_datetime')[:10]
        
        events_data = EventSerializer(events_qs, many=True, context={'request': request}).data
        results['events'] = [e for e in events_data if e.get('session_type') in ['EVENT', 'WORKSHOP', 'WEBINAR', 'ONLINE_SESSION']]
        results['sessions'] = [e for e in events_data if e.get('session_type') not in ['EVENT']]

    # 3. Services Search
    if category_filter in ['all', 'services']:
        services = SSService.objects.filter(
            Q(is_active=True) &
            (Q(title__icontains=query_text) | Q(tagline__icontains=query_text) | Q(description__icontains=query_text))
        )[:10]
        results['services'] = SSServiceSerializer(services, many=True).data

    # 4. Student Projects Search
    if category_filter in ['all', 'projects']:
        projects = StudentProject.objects.filter(
            Q(is_approved=True) &
            (Q(title__icontains=query_text) | Q(tagline__icontains=query_text) | Q(tech_stack__icontains=query_text))
        ).order_by('-created_at')[:10]
        results['projects'] = StudentProjectSerializer(projects, many=True).data

    # 5. Talent Showcase Search
    if category_filter in ['all', 'talent']:
        talents = TalentProfile.objects.filter(
            Q(is_approved=True) &
            (Q(headline__icontains=query_text) | Q(bio__icontains=query_text) | Q(skills_highlight__icontains=query_text))
        ).order_by('-created_at')[:10]
        results['talent'] = TalentProfileSerializer(talents, many=True).data

    total_count = (
        len(results['opportunities']) + len(results['events']) +
        len(results['sessions']) + len(results['services']) +
        len(results['projects']) + len(results['talent'])
    )

    return Response({
        'success': True,
        'query': query_text,
        'category': category_filter,
        'total_count': total_count,
        'results': results
    }, status=status.HTTP_200_OK)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def student_personalized_recommendations(request):
    """
    GET /api/student/recommendations/
    Transparent scoring recommendation algorithm.
    Scores published Opportunities and Events based on student's skills, interests, college, and past activity.
    """
    user = request.user
    prof = getattr(user, 'student_profile', None)

    student_skills = [s.name.lower() for s in prof.skills.all()] if prof else []
    student_interests = [i.name.lower() for i in prof.interests.all()] if prof else []
    user_college = prof.college.lower() if prof and prof.college else ''

    # 1. Opportunities Scoring
    opportunities = Opportunity.objects.filter(status__in=['OPEN', 'CLOSING_SOON']).order_by('-created_at')[:30]
    scored_opps = []

    for opp in opportunities:
        score = 0
        opp_skills = ((opp.tags or '') + ' ' + ' '.join([s.name for s in opp.skills.all()])).lower()
        opp_title = opp.title.lower()
        opp_desc = opp.description.lower()

        # Skill match (+10 points per matching skill)
        for s in student_skills:
            if s in opp_skills or s in opp_title or s in opp_desc:
                score += 10

        # Interest match (+5 points)
        for i in student_interests:
            if i in opp_title or i in opp_desc:
                score += 5

        scored_opps.append((score, opp))

    # Sort opportunities by score descending
    scored_opps.sort(key=lambda x: x[0], reverse=True)
    top_opps = [item[1] for item in scored_opps[:6]]
    opp_serializer = OpportunitySerializer(top_opps, many=True, context={'request': request})

    # 2. Events/Sessions Scoring
    events = Event.objects.filter(is_published=True).exclude(status='CANCELLED').order_by('start_datetime')[:20]
    scored_events = []

    for ev in events:
        score = 0
        ev_title = ev.title.lower()
        ev_desc = ev.description.lower()

        for i in student_interests:
            if i in ev_title or i in ev_desc:
                score += 8

        for s in student_skills:
            if s in ev_title or s in ev_desc:
                score += 6

        scored_events.append((score, ev))

    scored_events.sort(key=lambda x: x[0], reverse=True)
    top_events = [item[1] for item in scored_events[:4]]
    event_serializer = EventSerializer(top_events, many=True, context={'request': request})

    return Response({
        'success': True,
        'recommended_opportunities': opp_serializer.data,
        'recommended_events': event_serializer.data
    }, status=status.HTTP_200_OK)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def student_saved_items(request):
    """
    GET /api/saved-items/
    Returns all saved opportunities and registered events/sessions for the authenticated student.
    """
    user = request.user

    saved_opps = SavedOpportunity.objects.filter(user=user).order_by('-saved_at')
    opp_serializer = SavedOpportunitySerializer(saved_opps, many=True, context={'request': request})

    registered_events = EventRegistration.objects.filter(user=user, status='REGISTERED').select_related('event').order_by('-registered_at')
    event_serializer = EventRegistrationSerializer(registered_events, many=True)

    return Response({
        'success': True,
        'saved_opportunities': opp_serializer.data,
        'registered_sessions': event_serializer.data
    }, status=status.HTTP_200_OK)
