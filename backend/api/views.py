from rest_framework.decorators import api_view, permission_classes, parser_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.parsers import MultiPartParser, FormParser, JSONParser
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth import authenticate
from django.contrib.auth.models import User
from django.db.models import Q
from rest_framework_simplejwt.tokens import RefreshToken
import os
import datetime

from .models import (
    StudentProfile, StudentResume, Skill, Interest, 
    OpportunityCategory, Opportunity, SavedOpportunity, 
    OpportunityApplication, EventCategory, Event, EventRegistration, 
    VolunteerRole, VolunteerApplication, SSService, CommunityStat,
    TalentCategory, TalentProfile, ProjectCategory, StudentProject,
    StudentStory, CampusAmbassadorApplication, StudentAchievement,
    ServiceCategory, ServiceFAQ, ServicePortfolioItem, ServiceEnquiry,
    SupportRequest, SupportUpdate, ContactMessage,
    AboutSection, LeadershipMember, TeamMember, Placement, SuccessStory,
    Partner, Testimonial, OrganizationMilestone, ImpactMetric,
    SessionSpeaker, MeetingInfo, WaitlistEntry, SessionFeedback
)
from .serializers import (
    StudentProfileSerializer, StudentResumeSerializer, RegisterSerializer, 
    SkillSerializer, InterestSerializer, OpportunitySerializer, 
    SavedOpportunitySerializer, OpportunityApplicationSerializer, 
    EventSerializer, EventRegistrationSerializer, VolunteerRoleSerializer, 
    VolunteerApplicationSerializer, SSServiceSerializer, CommunityStatSerializer,
    TalentProfileSerializer, StudentProjectSerializer, StudentStorySerializer,
    CampusAmbassadorApplicationSerializer, StudentAchievementSerializer, PublicCommunityMemberSerializer,
    ServiceCategorySerializer, ServiceFAQSerializer, ServicePortfolioItemSerializer,
    ServiceEnquirySerializer, SupportRequestSerializer, SupportUpdateSerializer, ContactMessageSerializer,
    AboutSectionSerializer, LeadershipMemberSerializer, TeamMemberSerializer, PlacementSerializer,
    SuccessStorySerializer, PartnerSerializer, TestimonialSerializer, OrganizationMilestoneSerializer,
    ImpactMetricSerializer, SessionSpeakerSerializer, MeetingInfoSerializer, WaitlistEntrySerializer,
    SessionFeedbackSerializer
)
from .zoom_service import ZoomService
from .notification_service import NotificationService




def get_tokens_for_user(user):
    refresh = RefreshToken.for_user(user)
    return {
        'refresh': str(refresh),
        'access': str(refresh.access_token),
    }

# HEALTH CHECK
@api_view(['GET'])
@permission_classes([AllowAny])
def health_check(request):
    return Response({
        "success": True,
        "message": "Struggle of Student API is running",
        "version": "3.0.0",
        "phase": "Phase 3 - Opportunities Platform",
        "status": "Healthy"
    }, status=status.HTTP_200_OK)

@api_view(['GET'])
@permission_classes([AllowAny])
def root_health_check(request):
    return Response({
        "status": "ok",
        "message": "Struggle of Student backend is running"
    }, status=status.HTTP_200_OK)

# REGISTER API
@api_view(['POST'])
@permission_classes([AllowAny])
def register_user(request):
    serializer = RegisterSerializer(data=request.data)
    if serializer.is_valid():
        try:
            profile = serializer.save()
            # Phase 10 Notification
            try:
                NotificationService.notify_welcome(profile.user)
            except Exception as notif_err:
                pass

            tokens = get_tokens_for_user(profile.user)
            profile_serializer = StudentProfileSerializer(profile)
            return Response({
                "success": True,
                "message": "Registration successful! Welcome to Struggle of Student.",
                "data": {
                    "tokens": tokens,
                    "profile": profile_serializer.data
                }
            }, status=status.HTTP_201_CREATED)
        except Exception as e:
            return Response({
                "success": False,
                "message": f"An error occurred during registration: {str(e)}",
            }, status=status.HTTP_400_BAD_REQUEST)
    
    errors = serializer.errors
    error_msg = "Please correct the highlighted errors."
    if "email" in errors:
        error_msg = errors["email"][0]
    elif "non_field_errors" in errors:
        error_msg = errors["non_field_errors"][0]

    return Response({
        "success": False,
        "message": error_msg,
        "errors": errors
    }, status=status.HTTP_400_BAD_REQUEST)

# LOGIN API
@api_view(['POST'])
@permission_classes([AllowAny])
def login_user(request):
    email = request.data.get('email', '').strip().lower()
    password = request.data.get('password', '')

    if not email or not password:
        return Response({"success": False, "message": "Please enter both email address and password."}, status=status.HTTP_400_BAD_REQUEST)

    try:
        user_obj = User.objects.get(email__iexact=email)
        username = user_obj.username
    except User.DoesNotExist:
        return Response({"success": False, "message": "Invalid email or password."}, status=status.HTTP_401_UNAUTHORIZED)

    user = authenticate(username=username, password=password)
    if user is None:
        return Response({"success": False, "message": "Invalid email or password."}, status=status.HTTP_401_UNAUTHORIZED)

    tokens = get_tokens_for_user(user)
    profile = getattr(user, 'student_profile', None)
    profile_data = StudentProfileSerializer(profile).data if profile else None

    return Response({
        "success": True,
        "message": f"Welcome back, {user.first_name or 'Student'}!",
        "data": {
            "tokens": tokens,
            "profile": profile_data
        }
    }, status=status.HTTP_200_OK)

@api_view(['POST'])
@permission_classes([AllowAny])
def social_login_user(request):
    provider = request.data.get('provider', 'Google').capitalize()
    email = request.data.get('email', '').strip().lower()
    full_name = request.data.get('full_name', '').strip()

    if not email:
        email = f"student.{provider.lower()}@struggleofstudent.org"
    if not full_name:
        full_name = f"{provider} Student Dev"

    user = User.objects.filter(email__iexact=email).first()
    if not user:
        username = email.split('@')[0]
        if User.objects.filter(username=username).exists():
            username = f"{username}_{User.objects.count() + 1}"
        
        parts = full_name.split(' ')
        first_name = parts[0]
        last_name = ' '.join(parts[1:]) if len(parts) > 1 else ''

        user = User.objects.create_user(
            username=username,
            email=email,
            password=User.objects.make_random_password(),
            first_name=first_name,
            last_name=last_name
        )

    profile, created = StudentProfile.objects.get_or_create(
        user=user,
        defaults={
            'full_name': full_name or user.get_full_name() or email,
            'email': email,
            'phone_number': '9876543210',
            'college': f'{provider} Authenticated Student',
            'course': 'Engineering & Technology',
            'graduation_year': '2026',
            'role': 'STUDENT',
            'verified_status': True
        }
    )

    tokens = get_tokens_for_user(user)
    profile_data = StudentProfileSerializer(profile).data

    return Response({
        "success": True,
        "message": f"Welcome! Authenticated via {provider}.",
        "data": {
            "tokens": tokens,
            "profile": profile_data
        }
    }, status=status.HTTP_200_OK)

# CURRENT USER API
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_current_user(request):
    user = request.user
    profile = getattr(user, 'student_profile', None)
    if not profile:
        return Response({"success": False, "message": "Student profile not found."}, status=status.HTTP_404_NOT_FOUND)

    serializer = StudentProfileSerializer(profile)
    return Response({"success": True, "data": serializer.data}, status=status.HTTP_200_OK)

# FORGOT PASSWORD (DEV SAFE FLOW)
@api_view(['POST'])
@permission_classes([AllowAny])
def forgot_password(request):
    email = request.data.get('email', '').strip().lower()
    if not email:
        return Response({"success": False, "message": "Please provide a valid email address."}, status=status.HTTP_400_BAD_REQUEST)

    user_exists = User.objects.filter(email__iexact=email).exists()
    return Response({
        "success": True,
        "message": f"If an account with {email} exists, password reset verification has been initiated.",
        "dev_note": "Development Mode: Reset link verified." if user_exists else "No account found for this email."
    }, status=status.HTTP_200_OK)

@api_view(['POST'])
@permission_classes([AllowAny])
def reset_password(request):
    email = request.data.get('email', '').strip().lower()
    new_password = request.data.get('new_password', '')
    if not email or not new_password:
        return Response({"success": False, "message": "Email and new password are required."}, status=status.HTTP_400_BAD_REQUEST)

    try:
        user = User.objects.get(email__iexact=email)
        user.set_password(new_password)
        user.save()
        return Response({"success": True, "message": "Password updated successfully. You can now log in."}, status=status.HTTP_200_OK)
    except User.DoesNotExist:
        return Response({"success": False, "message": "Account not found."}, status=status.HTTP_400_BAD_REQUEST)

# STUDENT PROFILE
@api_view(['GET', 'PUT', 'PATCH'])
@permission_classes([IsAuthenticated])
def student_profile_detail(request):
    user = request.user
    profile = getattr(user, 'student_profile', None)
    if not profile:
        return Response({"success": False, "message": "Profile not found."}, status=status.HTTP_404_NOT_FOUND)

    if request.method == 'GET':
        serializer = StudentProfileSerializer(profile, context={'request': request})
        return Response({"success": True, "data": serializer.data}, status=status.HTTP_200_OK)

    serializer = StudentProfileSerializer(profile, data=request.data, partial=(request.method == 'PATCH'))
    if serializer.is_valid():
        updated_profile = serializer.save()
        
        skills_raw = request.data.get('skills_input')
        if skills_raw is not None:
            updated_profile.skills.clear()
            if isinstance(skills_raw, list):
                for sk in skills_raw:
                    s_obj, _ = Skill.objects.get_or_create(name=str(sk).strip())
                    updated_profile.skills.add(s_obj)

        interests_raw = request.data.get('interests_input')
        if interests_raw is not None:
            updated_profile.interests.clear()
            if isinstance(interests_raw, list):
                for it in interests_raw:
                    i_obj, _ = Interest.objects.get_or_create(name=str(it).strip())
                    updated_profile.interests.add(i_obj)

        return Response({
            "success": True,
            "message": "Profile updated successfully!",
            "data": StudentProfileSerializer(updated_profile, context={'request': request}).data
        }, status=status.HTTP_200_OK)

    return Response({"success": False, "message": "Failed to update profile.", "errors": serializer.errors}, status=status.HTTP_400_BAD_REQUEST)

# PROFILE PHOTO UPLOAD / DELETE
@api_view(['POST'])
@permission_classes([IsAuthenticated])
@parser_classes([MultiPartParser, FormParser])
def upload_profile_photo(request):
    user = request.user
    profile = getattr(user, 'student_profile', None)
    if not profile:
        return Response({"success": False, "message": "Profile not found."}, status=status.HTTP_404_NOT_FOUND)

    photo_file = request.FILES.get('photo') or request.FILES.get('profile_photo')
    if not photo_file:
        return Response({"success": False, "message": "No photo file provided."}, status=status.HTTP_400_BAD_REQUEST)

    ext = os.path.splitext(photo_file.name)[1].lower()
    if ext not in ['.jpg', '.jpeg', '.png', '.webp', '.gif']:
        return Response({"success": False, "message": "Only JPG, PNG, WEBP, and GIF images are allowed."}, status=status.HTTP_400_BAD_REQUEST)

    if photo_file.size > 5 * 1024 * 1024:
        return Response({"success": False, "message": "Photo file size exceeds 5MB limit."}, status=status.HTTP_400_BAD_REQUEST)

    if profile.profile_photo and hasattr(profile.profile_photo, 'path') and os.path.isfile(profile.profile_photo.path):
        try:
            os.remove(profile.profile_photo.path)
        except Exception:
            pass

    profile.profile_photo = photo_file
    profile.save()

    return Response({
        "success": True,
        "message": "Profile photo updated successfully!",
        "data": StudentProfileSerializer(profile, context={'request': request}).data
    }, status=status.HTTP_200_OK)


@api_view(['DELETE', 'POST'])
@permission_classes([IsAuthenticated])
def delete_profile_photo(request):
    user = request.user
    profile = getattr(user, 'student_profile', None)
    if not profile:
        return Response({"success": False, "message": "Profile not found."}, status=status.HTTP_404_NOT_FOUND)

    if profile.profile_photo and hasattr(profile.profile_photo, 'path') and os.path.isfile(profile.profile_photo.path):
        try:
            os.remove(profile.profile_photo.path)
        except Exception:
            pass

    profile.profile_photo = None
    profile.save()

    return Response({
        "success": True,
        "message": "Profile photo removed successfully!",
        "data": StudentProfileSerializer(profile, context={'request': request}).data
    }, status=status.HTTP_200_OK)

# RESUME UPLOAD / DELETE
@api_view(['POST', 'DELETE'])
@permission_classes([IsAuthenticated])
@parser_classes([MultiPartParser, FormParser, JSONParser])
def student_resume_view(request):
    user = request.user
    if request.method == 'POST':
        resume_file = request.FILES.get('resume')
        if not resume_file:
            return Response({"success": False, "message": "No resume file provided."}, status=status.HTTP_400_BAD_REQUEST)

        ext = os.path.splitext(resume_file.name)[1].lower()
        if ext not in ['.pdf', '.doc', '.docx']:
            return Response({"success": False, "message": "Only PDF, DOC, and DOCX files are allowed."}, status=status.HTTP_400_BAD_REQUEST)

        if resume_file.size > 5 * 1024 * 1024:
            return Response({"success": False, "message": "File size exceeds 5MB limit."}, status=status.HTTP_400_BAD_REQUEST)

        resume_obj, _ = StudentResume.objects.get_or_create(user=user)
        resume_obj.resume_file = resume_file
        resume_obj.original_filename = resume_file.name
        resume_obj.save()

        return Response({
            "success": True,
            "message": "Resume uploaded successfully!",
            "data": StudentResumeSerializer(resume_obj).data
        }, status=status.HTTP_200_OK)

    if request.method == 'DELETE':
        try:
            resume_obj = StudentResume.objects.get(user=user)
            if resume_obj.resume_file and os.path.isfile(resume_obj.resume_file.path):
                os.remove(resume_obj.resume_file.path)
            resume_obj.delete()
            return Response({"success": True, "message": "Resume deleted."}, status=status.HTTP_200_OK)
        except StudentResume.DoesNotExist:
            return Response({"success": False, "message": "No resume found."}, status=status.HTTP_404_NOT_FOUND)

# PHASE 3: OPPORTUNITIES DISCOVERY (SEARCH & FILTER)
@api_view(['GET'])
@permission_classes([AllowAny])
def get_opportunities(request):
    queryset = Opportunity.objects.all()

    search = request.GET.get('search', '').strip()
    if search:
        queryset = queryset.filter(
            Q(title__icontains=search) |
            Q(organization_name__icontains=search) |
            Q(description__icontains=search) |
            Q(tags__icontains=search) |
            Q(location__icontains=search) |
            Q(category__icontains=search)
        )

    category = request.GET.get('category', '').strip()
    if category and category.lower() != 'all':
        queryset = queryset.filter(category__icontains=category)

    mode = request.GET.get('mode', '').strip()
    if mode and mode.lower() != 'all':
        queryset = queryset.filter(mode__iexact=mode)

    experience = request.GET.get('experience', '').strip()
    if experience and experience.lower() != 'all':
        queryset = queryset.filter(experience_level__iexact=experience)

    location = request.GET.get('location', '').strip()
    if location and location.lower() != 'all':
        queryset = queryset.filter(location__icontains=location)

    status_filter = request.GET.get('status', '').strip()
    if status_filter and status_filter.lower() != 'all':
        if status_filter.upper() == 'OPEN':
            queryset = queryset.filter(Q(status='OPEN') | Q(status='CLOSING_SOON'))
        else:
            queryset = queryset.filter(status__iexact=status_filter)

    is_featured = request.GET.get('is_featured', '').strip()
    if is_featured == 'true':
        queryset = queryset.filter(is_featured=True)

    ordering = request.GET.get('ordering', '-created_at')
    if ordering in ['created_at', '-created_at', 'application_deadline', '-application_deadline', 'title']:
        queryset = queryset.order_by(ordering)
    else:
        queryset = queryset.order_by('-created_at')

    try:
        page = int(request.GET.get('page', 1))
        page_size = int(request.GET.get('page_size', 12))
    except ValueError:
        page = 1
        page_size = 12

    total_count = queryset.count()
    start = (page - 1) * page_size
    end = start + page_size
    paginated_qs = queryset[start:end]

    serializer = OpportunitySerializer(paginated_qs, many=True, context={'request': request})

    return Response({
        "success": True,
        "total_count": total_count,
        "page": page,
        "page_size": page_size,
        "total_pages": (total_count + page_size - 1) // page_size if total_count > 0 else 1,
        "opportunities": serializer.data
    }, status=status.HTTP_200_OK)

# OPPORTUNITY DETAIL
@api_view(['GET'])
@permission_classes([AllowAny])
def get_opportunity_detail(request, pk):
    try:
        opp = Opportunity.objects.get(pk=pk)
    except Opportunity.DoesNotExist:
        return Response({"success": False, "message": "Opportunity not found."}, status=status.HTTP_404_NOT_FOUND)

    serializer = OpportunitySerializer(opp, context={'request': request})
    return Response({
        "success": True,
        "data": serializer.data
    }, status=status.HTTP_200_OK)

# CATEGORIES & METADATA
@api_view(['GET'])
@permission_classes([AllowAny])
def get_opportunity_categories(request):
    categories = [
        "Internships", "Jobs", "Campus Ambassador", "Volunteering", 
        "Events", "Talent Showcase", "Leadership", "Workshops & Sessions", 
        "Student Projects", "Collaborations", "Other Opportunities"
    ]
    return Response({"success": True, "categories": categories}, status=status.HTTP_200_OK)

# SAVE / UNSAVE OPPORTUNITY (AUTHENTICATED)
@api_view(['POST', 'DELETE'])
@permission_classes([IsAuthenticated])
def toggle_save_opportunity(request, pk):
    try:
        opp = Opportunity.objects.get(pk=pk)
    except Opportunity.DoesNotExist:
        return Response({"success": False, "message": "Opportunity not found."}, status=status.HTTP_404_NOT_FOUND)

    user = request.user
    if request.method == 'POST':
        saved_obj, created = SavedOpportunity.objects.get_or_create(user=user, opportunity=opp)
        if not created:
            return Response({"success": True, "message": "Opportunity is already saved.", "is_saved": True}, status=status.HTTP_200_OK)
        return Response({"success": True, "message": "Opportunity saved to your profile!", "is_saved": True}, status=status.HTTP_201_CREATED)

    if request.method == 'DELETE':
        SavedOpportunity.objects.filter(user=user, opportunity=opp).delete()
        return Response({"success": True, "message": "Opportunity removed from saved list.", "is_saved": False}, status=status.HTTP_200_OK)

# LIST SAVED OPPORTUNITIES
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_saved_opportunities(request):
    saved_qs = SavedOpportunity.objects.filter(user=request.user).order_by('-saved_at')
    serializer = SavedOpportunitySerializer(saved_qs, many=True, context={'request': request})
    return Response({
        "success": True,
        "count": len(serializer.data),
        "saved_opportunities": serializer.data
    }, status=status.HTTP_200_OK)

# APPLY TO OPPORTUNITY (AUTHENTICATED)
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def apply_to_opportunity(request, pk):
    try:
        opp = Opportunity.objects.get(pk=pk)
    except Opportunity.DoesNotExist:
        return Response({"success": False, "message": "Opportunity not found."}, status=status.HTTP_404_NOT_FOUND)

    if opp.get_effective_status() == 'CLOSED':
        return Response({"success": False, "message": "Applications for this opportunity are closed."}, status=status.HTTP_400_BAD_REQUEST)

    user = request.user

    if OpportunityApplication.objects.filter(user=user, opportunity=opp).exists():
        return Response({"success": False, "message": "You have already applied for this opportunity."}, status=status.HTTP_400_BAD_REQUEST)

    cover_message = request.data.get('cover_message', '').strip()
    portfolio_url = request.data.get('portfolio_url', '').strip() or getattr(user.student_profile, 'portfolio_url', '')

    application = OpportunityApplication.objects.create(
        user=user,
        opportunity=opp,
        cover_message=cover_message,
        portfolio_url=portfolio_url,
        status='APPLIED'
    )

    # Phase 10 Notification
    try:
        NotificationService.notify_application_created(application)
    except Exception as notif_err:
        pass

    serializer = OpportunityApplicationSerializer(application, context={'request': request})

    return Response({
        "success": True,
        "message": f"Successfully applied for {opp.title}!",
        "data": serializer.data
    }, status=status.HTTP_201_CREATED)

# STUDENT APPLICATIONS LIST
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_my_applications(request):
    apps_qs = OpportunityApplication.objects.filter(user=request.user).order_by('-applied_at')
    serializer = OpportunityApplicationSerializer(apps_qs, many=True, context={'request': request})
    
    applied_count = apps_qs.count()
    under_review_count = apps_qs.filter(status='UNDER_REVIEW').count()
    shortlisted_count = apps_qs.filter(status='SHORTLISTED').count()

    return Response({
        "success": True,
        "counts": {
            "total": applied_count,
            "under_review": under_review_count,
            "shortlisted": shortlisted_count
        },
        "applications": serializer.data
    }, status=status.HTTP_200_OK)

# APPLICATION DETAIL
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_application_detail(request, pk):
    try:
        app_obj = OpportunityApplication.objects.get(pk=pk, user=request.user)
    except OpportunityApplication.DoesNotExist:
        return Response({"success": False, "message": "Application not found or permission denied."}, status=status.HTTP_404_NOT_FOUND)

    serializer = OpportunityApplicationSerializer(app_obj, context={'request': request})
    return Response({"success": True, "data": serializer.data}, status=status.HTTP_200_OK)

# PUBLIC METADATA
@api_view(['GET'])
@permission_classes([AllowAny])
def get_skills(request):
    skills = Skill.objects.all().order_by('name')
    serializer = SkillSerializer(skills, many=True)
    return Response({"success": True, "skills": serializer.data}, status=status.HTTP_200_OK)

@api_view(['GET'])
@permission_classes([AllowAny])
def get_interests(request):
    interests = Interest.objects.all().order_by('name')
    serializer = InterestSerializer(interests, many=True)
    return Response({"success": True, "interests": serializer.data}, status=status.HTTP_200_OK)

# PHASE 4: EVENTS & VOLUNTEER API VIEWS
from django.db import transaction
from django.utils import timezone

@api_view(['GET'])
@permission_classes([AllowAny])
def get_events(request):
    queryset = Event.objects.filter(is_published=True)

    search = request.GET.get('search', '').strip()
    if search:
        queryset = queryset.filter(
            Q(title__icontains=search) |
            Q(description__icontains=search) |
            Q(organizer__icontains=search) |
            Q(location__icontains=search) |
            Q(category__icontains=search) |
            Q(topics__icontains=search)
        )

    session_type = request.GET.get('session_type', '').strip()
    if session_type and session_type.lower() != 'all':
        queryset = queryset.filter(session_type__iexact=session_type)

    category = request.GET.get('category', '').strip()
    if category and category.lower() != 'all':
        queryset = queryset.filter(category__icontains=category)

    mode = request.GET.get('mode', '').strip()
    if mode and mode.lower() != 'all':
        queryset = queryset.filter(mode__iexact=mode)

    location = request.GET.get('location', '').strip()
    if location and location.lower() != 'all':
        if location.lower() == 'hyderabad':
            queryset = queryset.filter(location__icontains='Hyderabad')
        elif location.lower() == 'remote':
            queryset = queryset.filter(Q(mode='ONLINE') | Q(location__icontains='Remote'))
        else:
            queryset = queryset.filter(location__icontains=location)

    status_filter = request.GET.get('status', '').strip()
    if status_filter and status_filter.lower() != 'all':
        if status_filter.upper() == 'REGISTRATION_OPEN':
            queryset = queryset.filter(status='REGISTRATION_OPEN')
        elif status_filter.upper() == 'CLOSING_SOON':
            queryset = queryset.filter(status='CLOSING_SOON')
        elif status_filter.upper() == 'REGISTRATION_CLOSED':
            queryset = queryset.filter(status='REGISTRATION_CLOSED')
        elif status_filter.upper() == 'COMPLETED':
            queryset = queryset.filter(status='COMPLETED')

    past = request.GET.get('past', '').strip()
    now = timezone.now()
    if past == 'true':
        queryset = queryset.filter(Q(end_datetime__lt=now) | Q(status='COMPLETED'))
    elif past == 'false':
        queryset = queryset.filter(Q(end_datetime__gte=now) | Q(start_datetime__gte=now)).exclude(status__in=['COMPLETED', 'CANCELLED'])

    availability = request.GET.get('availability', '').strip()
    if availability == 'available':
        queryset = [e for e in queryset if not e.is_full()]
    elif availability == 'full':
        queryset = [e for e in queryset if e.is_full()]

    is_featured = request.GET.get('is_featured', '').strip()
    if is_featured == 'true':
        if isinstance(queryset, list):
            queryset = [e for e in queryset if e.is_featured]
        else:
            queryset = queryset.filter(is_featured=True)

    if not isinstance(queryset, list):
        ordering = request.GET.get('ordering', 'start_datetime')
        if ordering in ['start_datetime', '-start_datetime', 'created_at', '-created_at', 'participant_capacity']:
            queryset = queryset.order_by(ordering)
        else:
            queryset = queryset.order_by('start_datetime')

    try:
        page = int(request.GET.get('page', 1))
        page_size = int(request.GET.get('page_size', 12))
    except ValueError:
        page = 1
        page_size = 12

    total_count = len(queryset) if isinstance(queryset, list) else queryset.count()
    start = (page - 1) * page_size
    end = start + page_size
    paginated_qs = queryset[start:end]

    serializer = EventSerializer(paginated_qs, many=True, context={'request': request})

    return Response({
        "success": True,
        "total_count": total_count,
        "page": page,
        "page_size": page_size,
        "total_pages": (total_count + page_size - 1) // page_size if total_count > 0 else 1,
        "events": serializer.data
    }, status=status.HTTP_200_OK)


@api_view(['GET'])
@permission_classes([AllowAny])
def get_event_detail(request, pk):
    try:
        event = Event.objects.get(pk=pk, is_published=True)
    except Event.DoesNotExist:
        return Response({"success": False, "message": "Session/Event not found."}, status=status.HTTP_404_NOT_FOUND)

    serializer = EventSerializer(event, context={'request': request})
    return Response({
        "success": True,
        "data": serializer.data
    }, status=status.HTTP_200_OK)


@api_view(['GET'])
@permission_classes([AllowAny])
def get_event_categories(request):
    categories = EventCategory.objects.all().order_by('name')
    if not categories.exists():
        cat_names = ["Workshop", "Conference", "Meetup", "Competition", "Hackathon", "Career Session", "Networking", "Community", "Cultural", "Other"]
        return Response({"success": True, "categories": [{"id": idx+1, "name": c, "slug": c.lower().replace(' ', '-')} for idx, c in enumerate(cat_names)]}, status=status.HTTP_200_OK)
    
    cats_data = [{"id": c.id, "name": c.name, "slug": c.slug, "description": c.description} for c in categories]
    return Response({"success": True, "categories": cats_data}, status=status.HTTP_200_OK)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def register_for_event(request, pk):
    user = request.user
    with transaction.atomic():
        try:
            event = Event.objects.select_for_update().get(pk=pk)
        except Event.DoesNotExist:
            return Response({"success": False, "message": "Session/Event not found."}, status=status.HTTP_404_NOT_FOUND)

        if not event.is_published or event.status == 'CANCELLED':
            return Response({"success": False, "message": "This session is currently cancelled or unavailable for registration."}, status=status.HTTP_400_BAD_REQUEST)

        eff_status = event.get_effective_status()
        if eff_status == 'REGISTRATION_CLOSED':
            return Response({"success": False, "message": "Registration deadline has passed for this session."}, status=status.HTTP_400_BAD_REQUEST)
        elif eff_status == 'COMPLETED':
            return Response({"success": False, "message": "This session has already ended."}, status=status.HTTP_400_BAD_REQUEST)

        active_registered = EventRegistration.objects.filter(event=event, status='REGISTERED').count()
        if active_registered >= event.participant_capacity:
            return Response({
                "success": False, 
                "is_full": True,
                "message": "Session is Full! All seats are currently filled. You can join the waitlist."
            }, status=status.HTTP_400_BAD_REQUEST)

        existing = EventRegistration.objects.filter(event=event, user=user).first()
        if existing:
            if existing.status == 'REGISTERED':
                return Response({"success": False, "message": "You are already registered for this session."}, status=status.HTTP_400_BAD_REQUEST)
            else:
                existing.status = 'REGISTERED'
                existing.cancelled_at = None
                existing.registered_at = timezone.now()
                existing.save()
                
                # Remove from waitlist if was waitlisted
                WaitlistEntry.objects.filter(event=event, user=user).update(status='PROMOTED')

                serializer = EventRegistrationSerializer(existing)
                return Response({
                    "success": True,
                    "message": "You're registered for this session!",
                    "data": serializer.data
                }, status=status.HTTP_200_OK)

        registration = EventRegistration.objects.create(
            event=event,
            user=user,
            status='REGISTERED'
        )
        # Remove from waitlist if existed
        WaitlistEntry.objects.filter(event=event, user=user).update(status='PROMOTED')

        # Phase 10 Notification
        try:
            NotificationService.notify_event_registration(registration)
        except Exception as notif_err:
            pass

        serializer = EventRegistrationSerializer(registration)
        return Response({
            "success": True,
            "message": "You're registered for this session!",
            "data": serializer.data
        }, status=status.HTTP_201_CREATED)


@api_view(['POST', 'DELETE'])
@permission_classes([IsAuthenticated])
def cancel_event_registration(request, pk):
    user = request.user
    with transaction.atomic():
        try:
            registration = EventRegistration.objects.select_for_update().get(event_id=pk, user=user, status='REGISTERED')
        except EventRegistration.DoesNotExist:
            return Response({"success": False, "message": "No active registration found for this session."}, status=status.HTTP_404_NOT_FOUND)

        event = registration.event
        if event.get_effective_status() == 'COMPLETED':
            return Response({"success": False, "message": "Cannot cancel registration for completed sessions."}, status=status.HTTP_400_BAD_REQUEST)

        registration.status = 'CANCELLED'
        registration.cancelled_at = timezone.now()
        registration.save()

        # Atomic Waitlist Promotion: promote top waiting student if available
        next_waitlisted = WaitlistEntry.objects.filter(event=event, status='WAITING').order_by('position', 'created_at').first()
        promoted_user_msg = ""
        if next_waitlisted:
            next_waitlisted.status = 'PROMOTED'
            next_waitlisted.save()

            promoted_reg, _ = EventRegistration.objects.get_or_create(
                event=event, user=next_waitlisted.user,
                defaults={'status': 'REGISTERED'}
            )
            if promoted_reg.status != 'REGISTERED':
                promoted_reg.status = 'REGISTERED'
                promoted_reg.cancelled_at = None
                promoted_reg.save()
            promoted_user_msg = f" Waitlisted student {next_waitlisted.user.email} was automatically promoted."

        return Response({
            "success": True,
            "message": f"Registration cancelled successfully.{promoted_user_msg}"
        }, status=status.HTTP_200_OK)


# WAITLIST APIS
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def join_session_waitlist(request, pk):
    user = request.user
    try:
        event = Event.objects.get(pk=pk, is_published=True)
    except Event.DoesNotExist:
        return Response({"success": False, "message": "Session not found."}, status=status.HTTP_404_NOT_FOUND)

    if EventRegistration.objects.filter(event=event, user=user, status='REGISTERED').exists():
        return Response({"success": False, "message": "You are already registered for this session."}, status=status.HTTP_400_BAD_REQUEST)

    existing_wl = WaitlistEntry.objects.filter(event=event, user=user, status='WAITING').first()
    if existing_wl:
        return Response({"success": True, "message": f"You are already on the waitlist at position #{existing_wl.position}."}, status=status.HTTP_200_OK)

    current_wait_count = WaitlistEntry.objects.filter(event=event, status='WAITING').count()
    wl_entry = WaitlistEntry.objects.create(
        event=event,
        user=user,
        position=current_wait_count + 1,
        status='WAITING'
    )
    serializer = WaitlistEntrySerializer(wl_entry)
    return Response({
        "success": True,
        "message": f"You're on the waitlist! Position #{wl_entry.position}.",
        "data": serializer.data
    }, status=status.HTTP_201_CREATED)


@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def cancel_session_waitlist(request, pk):
    user = request.user
    wl_entry = WaitlistEntry.objects.filter(event_id=pk, user=user, status='WAITING').first()
    if not wl_entry:
        return Response({"success": False, "message": "No active waitlist entry found."}, status=status.HTTP_404_NOT_FOUND)

    wl_entry.status = 'CANCELLED'
    wl_entry.save()
    return Response({"success": True, "message": "Removed from waitlist."}, status=status.HTTP_200_OK)


# SESSION FEEDBACK API
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def submit_session_feedback(request, pk):
    user = request.user
    try:
        event = Event.objects.get(pk=pk)
    except Event.DoesNotExist:
        return Response({"success": False, "message": "Session not found."}, status=status.HTTP_404_NOT_FOUND)

    # Check if student was registered
    has_reg = EventRegistration.objects.filter(event=event, user=user).exists()
    if not has_reg:
        return Response({"success": False, "message": "Only registered participants can submit feedback for this session."}, status=status.HTTP_403_FORBIDDEN)

    rating = int(request.data.get('rating', 5))
    if rating < 1 or rating > 5:
        return Response({"success": False, "message": "Rating must be between 1 and 5."}, status=status.HTTP_400_BAD_REQUEST)

    feedback_obj, created = SessionFeedback.objects.update_or_create(
        event=event,
        user=user,
        defaults={
            'rating': rating,
            'what_did_you_learn': request.data.get('what_did_you_learn', ''),
            'what_did_you_like': request.data.get('what_did_you_like', ''),
            'suggestions': request.data.get('suggestions', ''),
            'would_recommend': request.data.get('would_recommend', True)
        }
    )

    serializer = SessionFeedbackSerializer(feedback_obj)
    return Response({
        "success": True,
        "message": "Thank you! Your feedback has been submitted successfully.",
        "data": serializer.data
    }, status=status.HTTP_200_OK if not created else status.HTTP_201_CREATED)


# STUDENT DASHBOARD SESSIONS LIST & DETAIL
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_student_sessions(request):
    user = request.user
    regs = EventRegistration.objects.filter(user=user).select_related('event').order_by('-registered_at')
    waitlists = WaitlistEntry.objects.filter(user=user, status='WAITING').select_related('event')
    
    now = timezone.now()
    upcoming = []
    past = []
    cancelled = []
    next_session = None

    for reg in regs:
        reg_data = EventRegistrationSerializer(reg, context={'request': request}).data
        event_data = EventSerializer(reg.event, context={'request': request}).data
        reg_data['event'] = event_data

        if reg.status == 'CANCELLED':
            cancelled.append(reg_data)
        elif reg.event.end_datetime < now or reg.event.status == 'COMPLETED':
            past.append(reg_data)
        else:
            upcoming.append(reg_data)
            if not next_session or reg.event.start_datetime < datetime.datetime.fromisoformat(next_session['event']['start_datetime'].replace('Z', '+00:00')):
                next_session = reg_data

    waitlist_data = [
        {
            "id": w.id,
            "event": EventSerializer(w.event, context={'request': request}).data,
            "position": w.position,
            "status": w.status,
            "created_at": w.created_at
        }
        for w in waitlists
    ]

    return Response({
        "success": True,
        "counts": {
            "total_registered": len(upcoming),
            "total_completed": len(past),
            "total_waitlisted": len(waitlist_data)
        },
        "next_session": next_session,
        "upcoming": upcoming,
        "past": past,
        "cancelled": cancelled,
        "waitlist": waitlist_data
    }, status=status.HTTP_200_OK)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_student_session_detail(request, pk):
    user = request.user
    try:
        event = Event.objects.get(pk=pk)
    except Event.DoesNotExist:
        return Response({"success": False, "message": "Session not found."}, status=status.HTTP_404_NOT_FOUND)

    reg = EventRegistration.objects.filter(event=event, user=user).first()
    is_registered = reg and reg.status == 'REGISTERED'

    event_data = EventSerializer(event, context={'request': request}).data

    return Response({
        "success": True,
        "is_registered": is_registered,
        "registration_details": EventRegistrationSerializer(reg).data if reg else None,
        "event": event_data,
        "join_url": event_data.get('meeting_url_protected') if is_registered else ""
    }, status=status.HTTP_200_OK)


# SPEAKERS LIST
@api_view(['GET'])
@permission_classes([AllowAny])
def get_session_speakers(request):
    speakers = SessionSpeaker.objects.all().order_by('name')
    serializer = SessionSpeakerSerializer(speakers, many=True)
    return Response({"success": True, "speakers": serializer.data}, status=status.HTTP_200_OK)


# STAFF MANAGEMENT APIS FOR SESSIONS & ZOOM
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def staff_create_zoom_meeting(request, pk):
    # Only staff / authorized users
    if not request.user.is_staff and not request.user.is_superuser:
        return Response({"success": False, "message": "Permission denied. Staff access required."}, status=status.HTTP_403_FORBIDDEN)

    try:
        event = Event.objects.get(pk=pk)
    except Event.DoesNotExist:
        return Response({"success": False, "message": "Session not found."}, status=status.HTTP_404_NOT_FOUND)

    start_iso = event.start_datetime.isoformat()
    duration = max(30, int((event.end_datetime - event.start_datetime).total_seconds() / 60)) if event.end_datetime else 60

    result = ZoomService.create_meeting(
        topic=event.title,
        start_time_iso=start_iso,
        duration_minutes=duration,
        agenda=event.short_description or event.description
    )

    if result.get('success'):
        meeting_info, _ = MeetingInfo.objects.update_or_create(
            event=event,
            defaults={
                'provider': 'ZOOM',
                'external_meeting_id': result.get('meeting_id', ''),
                'join_url': result.get('join_url', ''),
                'start_url': result.get('start_url', ''),
                'passcode': result.get('passcode', ''),
                'status': 'ACTIVE'
            }
        )
        event.meeting_provider = 'ZOOM'
        event.zoom_meeting_id = result.get('meeting_id', '')
        event.zoom_passcode = result.get('passcode', '')
        event.meeting_url = result.get('join_url', '')
        event.save()

        return Response({
            "success": True,
            "message": "Zoom meeting created and linked successfully!",
            "data": MeetingInfoSerializer(meeting_info).data
        }, status=status.HTTP_201_CREATED)
    else:
        return Response({
            "success": False,
            "status": result.get('status', 'ERROR'),
            "message": result.get('message', 'Failed to create Zoom meeting.')
        }, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def apply_for_volunteer_role(request, pk):
    user = request.user
    role_id = request.data.get('role_id')
    if not role_id:
        return Response({"success": False, "message": "Volunteer role is required."}, status=status.HTTP_400_BAD_REQUEST)

    with transaction.atomic():
        try:
            role = VolunteerRole.objects.select_for_update().get(pk=role_id, event_id=pk)
        except VolunteerRole.DoesNotExist:
            return Response({"success": False, "message": "Volunteer role not found for this event."}, status=status.HTTP_404_NOT_FOUND)

        event = Event.objects.select_for_update().get(pk=pk)

        if not event.is_published or event.status == 'CANCELLED':
            return Response({"success": False, "message": "Volunteer applications are unavailable for this event."}, status=status.HTTP_400_BAD_REQUEST)

        total_vol_filled = event.get_volunteer_filled_count()
        if total_vol_filled >= event.volunteer_capacity:
            return Response({"success": False, "message": "Volunteer slots are full."}, status=status.HTTP_400_BAD_REQUEST)

        if role.is_full():
            return Response({"success": False, "message": "Volunteer slots are full for this specific role."}, status=status.HTTP_400_BAD_REQUEST)

        existing = VolunteerApplication.objects.filter(event=event, user=user, role=role).first()
        if existing:
            if existing.status in ['APPLIED', 'UNDER_REVIEW', 'ACCEPTED']:
                return Response({"success": False, "message": "Application Submitted. You have already applied for this volunteer role."}, status=status.HTTP_400_BAD_REQUEST)
            elif existing.status == 'WITHDRAWN':
                existing.status = 'APPLIED'
                existing.applied_at = timezone.now()
                existing.withdrawn_at = None
                existing.save()
                serializer = VolunteerApplicationSerializer(existing)
                return Response({
                    "success": True,
                    "message": "Volunteer application submitted.",
                    "data": serializer.data
                }, status=status.HTTP_200_OK)

        app = VolunteerApplication.objects.create(
            event=event,
            role=role,
            user=user,
            status='APPLIED'
        )
        serializer = VolunteerApplicationSerializer(app)
        return Response({
            "success": True,
            "message": "Volunteer application submitted.",
            "data": serializer.data
        }, status=status.HTTP_201_CREATED)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def withdraw_volunteer_application(request, pk):
    user = request.user
    try:
        app = VolunteerApplication.objects.get(pk=pk, user=user)
    except VolunteerApplication.DoesNotExist:
        return Response({"success": False, "message": "Volunteer application not found."}, status=status.HTTP_404_NOT_FOUND)

    if app.status == 'WITHDRAWN':
        return Response({"success": False, "message": "Application is already withdrawn."}, status=status.HTTP_400_BAD_REQUEST)

    app.status = 'WITHDRAWN'
    app.withdrawn_at = timezone.now()
    app.save()

    return Response({
        "success": True,
        "message": "Volunteer application withdrawn."
    }, status=status.HTTP_200_OK)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_student_events(request):
    user = request.user
    regs = EventRegistration.objects.filter(user=user).select_related('event').order_by('-registered_at')
    
    now = timezone.now()
    upcoming = []
    past = []

    for reg in regs:
        data = EventRegistrationSerializer(reg, context={'request': request}).data
        data['event'] = EventSerializer(reg.event, context={'request': request}).data
        if reg.event.start_datetime >= now:
            upcoming.append(data)
        else:
            past.append(data)

    return Response({
        "success": True,
        "total_registrations": regs.count(),
        "upcoming": upcoming,
        "past": past
    }, status=status.HTTP_200_OK)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_student_volunteer_applications(request):
    user = request.user
    apps = VolunteerApplication.objects.filter(user=user).select_related('event', 'role').order_by('-applied_at')
    
    data_list = []
    for app in apps:
        item = VolunteerApplicationSerializer(app, context={'request': request}).data
        item['event'] = EventSerializer(app.event, context={'request': request}).data
        item['role'] = VolunteerRoleSerializer(app.role).data
        data_list.append(item)

    return Response({
        "success": True,
        "total_applications": len(data_list),
        "applications": data_list
    }, status=status.HTTP_200_OK)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_student_dashboard_stats(request):
    user = request.user
    opp_applications = OpportunityApplication.objects.filter(user=user).count()
    saved_opportunities = SavedOpportunity.objects.filter(user=user).count()
    event_registrations = EventRegistration.objects.filter(user=user, status='REGISTERED').count()
    volunteer_applications = VolunteerApplication.objects.filter(user=user).exclude(status='WITHDRAWN').count()

    # Phase 5 Stats
    talents_count = TalentProfile.objects.filter(user=user).count()
    projects_count = StudentProject.objects.filter(user=user).count()
    stories_count = StudentStory.objects.filter(user=user).count()
    achievements_count = StudentAchievement.objects.filter(user=user).count()
    ambassador_app = CampusAmbassadorApplication.objects.filter(user=user).first()
    ambassador_status = ambassador_app.status if ambassador_app else "NONE"

    now = timezone.now()
    upcoming_registered_events = EventRegistration.objects.filter(
        user=user, status='REGISTERED', event__start_datetime__gte=now
    ).count()

    # Phase 6 Stats
    open_support_requests = SupportRequest.objects.filter(user=user, status__in=['OPEN', 'ACKNOWLEDGED', 'IN_PROGRESS', 'WAITING_FOR_STUDENT']).count()
    service_enquiries_count = ServiceEnquiry.objects.filter(user=user).count()

    return Response({
        "success": True,
        "stats": {
            "opportunity_applications": opp_applications,
            "saved_opportunities": saved_opportunities,
            "event_registrations": event_registrations,
            "upcoming_events": upcoming_registered_events,
            "volunteer_applications": volunteer_applications,
            "talents_count": talents_count,
            "projects_count": projects_count,
            "stories_count": stories_count,
            "achievements_count": achievements_count,
            "ambassador_status": ambassador_status,
            "open_support_requests": open_support_requests,
            "service_enquiries_count": service_enquiries_count
        }
    }, status=status.HTTP_200_OK)


# PHASE 5: TALENT SHOWCASE VIEWS
@api_view(['GET'])
@permission_classes([AllowAny])
def get_talents(request):
    queryset = TalentProfile.objects.filter(status='PUBLISHED')

    search = request.GET.get('search', '').strip()
    if search:
        queryset = queryset.filter(
            Q(title__icontains=search) |
            Q(description__icontains=search) |
            Q(short_description__icontains=search) |
            Q(user__student_profile__full_name__icontains=search) |
            Q(category__icontains=search)
        )

    category = request.GET.get('category', '').strip()
    if category and category.lower() != 'all':
        queryset = queryset.filter(category__icontains=category)

    try:
        page = int(request.GET.get('page', 1))
        page_size = int(request.GET.get('page_size', 12))
    except ValueError:
        page = 1
        page_size = 12

    total_count = queryset.count()
    start = (page - 1) * page_size
    end = start + page_size
    paginated = queryset.order_by('-created_at')[start:end]

    serializer = TalentProfileSerializer(paginated, many=True, context={'request': request})
    return Response({
        "success": True,
        "total_count": total_count,
        "page": page,
        "page_size": page_size,
        "total_pages": (total_count + page_size - 1) // page_size if total_count > 0 else 1,
        "talents": serializer.data
    }, status=status.HTTP_200_OK)


@api_view(['GET'])
@permission_classes([AllowAny])
def get_talent_detail(request, pk):
    try:
        talent = TalentProfile.objects.get(pk=pk, status='PUBLISHED')
    except TalentProfile.DoesNotExist:
        return Response({"success": False, "message": "Talent profile not found."}, status=status.HTTP_404_NOT_FOUND)

    serializer = TalentProfileSerializer(talent, context={'request': request})
    return Response({"success": True, "data": serializer.data}, status=status.HTTP_200_OK)


@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])
def student_talent_list_create(request):
    user = request.user
    if request.method == 'GET':
        talents = TalentProfile.objects.filter(user=user).order_by('-created_at')
        serializer = TalentProfileSerializer(talents, many=True, context={'request': request})
        return Response({"success": True, "talents": serializer.data}, status=status.HTTP_200_OK)

    title = str(request.data.get('title', '')).strip()
    category = str(request.data.get('category', 'Photography')).strip()
    short_description = str(request.data.get('short_description', '')).strip()
    description = str(request.data.get('description', '')).strip()
    portfolio_url = str(request.data.get('portfolio_url', '')).strip()
    instagram_url = str(request.data.get('instagram_url', '') or request.data.get('social_links', '')).strip()
    youtube_url = str(request.data.get('youtube_url', '')).strip()
    linkedin_url = str(request.data.get('linkedin_url', '')).strip()
    media_url = str(request.data.get('media_url', '')).strip()

    if not title or not short_description:
        return Response({"success": False, "message": "Title and short description are required."}, status=status.HTTP_400_BAD_REQUEST)

    try:
        talent = TalentProfile.objects.create(
            user=user,
            title=title,
            category=category,
            short_description=short_description,
            description=description,
            portfolio_url=portfolio_url,
            instagram_url=instagram_url,
            youtube_url=youtube_url,
            linkedin_url=linkedin_url,
            media_url=media_url,
            status='PENDING_REVIEW'
        )

        skills_input = request.data.get('skills', [])
        if isinstance(skills_input, list):
            for sk in skills_input:
                s_obj, _ = Skill.objects.get_or_create(name=str(sk).strip())
                talent.skills.add(s_obj)

        serializer = TalentProfileSerializer(talent, context={'request': request})
        return Response({
            "success": True,
            "message": "Talent profile submitted for review.",
            "data": serializer.data
        }, status=status.HTTP_201_CREATED)
    except Exception as e:
        import traceback
        traceback.print_exc()
        return Response({"success": False, "message": f"Server error: {str(e)}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['PUT', 'DELETE'])
@permission_classes([IsAuthenticated])
def student_talent_detail_update_delete(request, pk):
    try:
        talent = TalentProfile.objects.get(pk=pk, user=request.user)
    except TalentProfile.DoesNotExist:
        return Response({"success": False, "message": "Talent profile not found or permission denied."}, status=status.HTTP_404_NOT_FOUND)

    if request.method == 'DELETE':
        talent.delete()
        return Response({"success": True, "message": "Talent profile deleted."}, status=status.HTTP_200_OK)

    title = request.data.get('title', talent.title).strip()
    category = request.data.get('category', talent.category).strip()
    short_description = request.data.get('short_description', talent.short_description).strip()
    description = request.data.get('description', talent.description).strip()
    portfolio_url = request.data.get('portfolio_url', talent.portfolio_url).strip()
    media_url = request.data.get('media_url', talent.media_url).strip()

    talent.title = title
    talent.category = category
    talent.short_description = short_description
    talent.description = description
    talent.portfolio_url = portfolio_url
    talent.media_url = media_url
    talent.status = 'PENDING_REVIEW'
    talent.save()

    serializer = TalentProfileSerializer(talent, context={'request': request})
    return Response({"success": True, "message": "Talent profile updated and submitted for review.", "data": serializer.data}, status=status.HTTP_200_OK)


# PHASE 5: STUDENT PROJECTS VIEWS
@api_view(['GET'])
@permission_classes([AllowAny])
def get_projects(request):
    queryset = StudentProject.objects.filter(status='PUBLISHED')

    search = request.GET.get('search', '').strip()
    if search:
        queryset = queryset.filter(
            Q(title__icontains=search) |
            Q(description__icontains=search) |
            Q(technologies__icontains=search) |
            Q(user__student_profile__full_name__icontains=search) |
            Q(category__icontains=search)
        )

    category = request.GET.get('category', '').strip()
    if category and category.lower() != 'all':
        queryset = queryset.filter(category__icontains=category)

    stage = request.GET.get('stage', '').strip()
    if stage and stage.lower() != 'all':
        queryset = queryset.filter(project_stage__iexact=stage)

    try:
        page = int(request.GET.get('page', 1))
        page_size = int(request.GET.get('page_size', 12))
    except ValueError:
        page = 1
        page_size = 12

    total_count = queryset.count()
    start = (page - 1) * page_size
    end = start + page_size
    paginated = queryset.order_by('-created_at')[start:end]

    serializer = StudentProjectSerializer(paginated, many=True, context={'request': request})
    return Response({
        "success": True,
        "total_count": total_count,
        "page": page,
        "page_size": page_size,
        "total_pages": (total_count + page_size - 1) // page_size if total_count > 0 else 1,
        "projects": serializer.data
    }, status=status.HTTP_200_OK)


@api_view(['GET'])
@permission_classes([AllowAny])
def get_project_detail(request, pk):
    try:
        project = StudentProject.objects.get(pk=pk, status='PUBLISHED')
    except StudentProject.DoesNotExist:
        return Response({"success": False, "message": "Project not found."}, status=status.HTTP_404_NOT_FOUND)

    serializer = StudentProjectSerializer(project, context={'request': request})
    return Response({"success": True, "data": serializer.data}, status=status.HTTP_200_OK)


@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])
def student_project_list_create(request):
    user = request.user
    if request.method == 'GET':
        projects = StudentProject.objects.filter(user=user).order_by('-created_at')
        serializer = StudentProjectSerializer(projects, many=True, context={'request': request})
        return Response({"success": True, "projects": serializer.data}, status=status.HTTP_200_OK)

    title = str(request.data.get('title', '')).strip()
    category = str(request.data.get('category', 'Web Development')).strip()
    short_description = str(request.data.get('short_description', '')).strip()
    description = str(request.data.get('description', '')).strip()
    problem_statement = str(request.data.get('problem_statement', '')).strip()
    solution = str(request.data.get('solution', '')).strip()
    technologies = str(request.data.get('technologies', '')).strip()
    features = str(request.data.get('features', '')).strip()
    github_url = str(request.data.get('github_url', '')).strip()
    live_demo_url = str(request.data.get('live_demo_url', '')).strip()
    portfolio_url = str(request.data.get('portfolio_url', '')).strip()
    cover_image_url = str(request.data.get('cover_image_url', '')).strip()
    project_stage = str(request.data.get('project_stage', 'IN_DEVELOPMENT')).strip()

    if not title or not short_description:
        return Response({"success": False, "message": "Project title and short description are required."}, status=status.HTTP_400_BAD_REQUEST)

    project = StudentProject.objects.create(
        user=user,
        title=title,
        category=category,
        short_description=short_description,
        description=description,
        problem_statement=problem_statement,
        solution=solution,
        technologies=technologies,
        features=features,
        github_url=github_url,
        live_demo_url=live_demo_url,
        portfolio_url=portfolio_url,
        cover_image_url=cover_image_url,
        project_stage=project_stage,
        status='PENDING_REVIEW'
    )

    serializer = StudentProjectSerializer(project, context={'request': request})
    return Response({
        "success": True,
        "message": "Project submitted for review.",
        "data": serializer.data
    }, status=status.HTTP_201_CREATED)


@api_view(['PUT', 'DELETE'])
@permission_classes([IsAuthenticated])
def student_project_detail_update_delete(request, pk):
    try:
        project = StudentProject.objects.get(pk=pk, user=request.user)
    except StudentProject.DoesNotExist:
        return Response({"success": False, "message": "Project not found or permission denied."}, status=status.HTTP_404_NOT_FOUND)

    if request.method == 'DELETE':
        project.delete()
        return Response({"success": True, "message": "Project deleted."}, status=status.HTTP_200_OK)

    project.title = request.data.get('title', project.title).strip()
    project.category = request.data.get('category', project.category).strip()
    project.short_description = request.data.get('short_description', project.short_description).strip()
    project.description = request.data.get('description', project.description).strip()
    project.problem_statement = request.data.get('problem_statement', project.problem_statement).strip()
    project.solution = request.data.get('solution', project.solution).strip()
    project.technologies = request.data.get('technologies', project.technologies).strip()
    project.features = request.data.get('features', project.features).strip()
    project.github_url = request.data.get('github_url', project.github_url).strip()
    project.live_demo_url = request.data.get('live_demo_url', project.live_demo_url).strip()
    project.status = 'PENDING_REVIEW'
    project.save()

    serializer = StudentProjectSerializer(project, context={'request': request})
    return Response({"success": True, "message": "Project updated and submitted for review.", "data": serializer.data}, status=status.HTTP_200_OK)


# PHASE 5: STUDENT STORIES VIEWS
@api_view(['GET'])
@permission_classes([AllowAny])
def get_stories(request):
    queryset = StudentStory.objects.filter(status='PUBLISHED')

    search = request.GET.get('search', '').strip()
    if search:
        queryset = queryset.filter(
            Q(title__icontains=search) |
            Q(excerpt__icontains=search) |
            Q(content__icontains=search) |
            Q(user__student_profile__full_name__icontains=search)
        )

    category = request.GET.get('category', '').strip()
    if category and category.lower() != 'all':
        queryset = queryset.filter(category__icontains=category)

    try:
        page = int(request.GET.get('page', 1))
        page_size = int(request.GET.get('page_size', 12))
    except ValueError:
        page = 1
        page_size = 12

    total_count = queryset.count()
    start = (page - 1) * page_size
    end = start + page_size
    paginated = queryset.order_by('-created_at')[start:end]

    serializer = StudentStorySerializer(paginated, many=True, context={'request': request})
    return Response({
        "success": True,
        "total_count": total_count,
        "page": page,
        "page_size": page_size,
        "total_pages": (total_count + page_size - 1) // page_size if total_count > 0 else 1,
        "stories": serializer.data
    }, status=status.HTTP_200_OK)


@api_view(['GET'])
@permission_classes([AllowAny])
def get_story_detail(request, pk):
    try:
        story = StudentStory.objects.get(pk=pk, status='PUBLISHED')
    except StudentStory.DoesNotExist:
        return Response({"success": False, "message": "Story not found."}, status=status.HTTP_404_NOT_FOUND)

    serializer = StudentStorySerializer(story, context={'request': request})
    return Response({"success": True, "data": serializer.data}, status=status.HTTP_200_OK)


@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])
def student_story_list_create(request):
    user = request.user
    if request.method == 'GET':
        stories = StudentStory.objects.filter(user=user).order_by('-created_at')
        serializer = StudentStorySerializer(stories, many=True, context={'request': request})
        return Response({"success": True, "stories": serializer.data}, status=status.HTTP_200_OK)

    title = str(request.data.get('title', '')).strip()
    category = str(request.data.get('category', 'Student Journey')).strip()
    excerpt = str(request.data.get('excerpt', '')).strip()
    content = str(request.data.get('content', '')).strip()
    cover_image_url = str(request.data.get('cover_image_url', '')).strip()

    if not title or not excerpt or not content:
        return Response({"success": False, "message": "Title, excerpt, and content are required."}, status=status.HTTP_400_BAD_REQUEST)

    story = StudentStory.objects.create(
        user=user,
        title=title,
        category=category,
        excerpt=excerpt,
        content=content,
        cover_image_url=cover_image_url,
        status='PENDING_REVIEW'
    )

    serializer = StudentStorySerializer(story, context={'request': request})
    return Response({
        "success": True,
        "message": "Story submitted for review.",
        "data": serializer.data
    }, status=status.HTTP_201_CREATED)


# PHASE 5: LEADERSHIP OPPORTUNITIES & CAMPUS AMBASSADOR VIEWS
@api_view(['GET'])
@permission_classes([AllowAny])
def get_leadership_opportunities(request):
    queryset = Opportunity.objects.filter(
        Q(category__icontains='Leadership') |
        Q(category__icontains='Campus Ambassador') |
        Q(tags__icontains='Leadership') |
        Q(title__icontains='Lead')
    ).order_by('-created_at')

    serializer = OpportunitySerializer(queryset, many=True, context={'request': request})
    return Response({"success": True, "count": len(serializer.data), "leadership_opportunities": serializer.data}, status=status.HTTP_200_OK)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def apply_campus_ambassador(request):
    user = request.user
    prof = getattr(user, 'student_profile', None)
    college = str(request.data.get('college', '')).strip() or (prof.college if prof else '')
    campus_location = str(request.data.get('campus_location', '')).strip() or (prof.city if prof else '')
    why_join = str(request.data.get('why_join', '') or request.data.get('why_ambassador', '')).strip()
    previous_experience = str(request.data.get('previous_experience', '')).strip()
    social_media_links = str(request.data.get('social_media_links', '')).strip()
    availability_hours = str(request.data.get('availability_hours', '5-10 hours/week')).strip()
    expected_contribution = str(request.data.get('expected_contribution', '')).strip()

    if not why_join:
        return Response({"success": False, "message": "Please explain why you want to become an SS Campus Ambassador."}, status=status.HTTP_400_BAD_REQUEST)

    existing = CampusAmbassadorApplication.objects.filter(user=user, college=college).first()
    if existing:
        if existing.status in ['APPLIED', 'UNDER_REVIEW', 'SHORTLISTED', 'ACCEPTED']:
            return Response({"success": False, "message": "You have already applied for Campus Ambassador at your college."}, status=status.HTTP_400_BAD_REQUEST)

    app = CampusAmbassadorApplication.objects.create(
        user=user,
        college=college,
        campus_location=campus_location,
        why_join=why_join,
        previous_experience=previous_experience,
        social_media_links=social_media_links,
        availability_hours=availability_hours,
        expected_contribution=expected_contribution,
        status='APPLIED'
    )

    serializer = CampusAmbassadorApplicationSerializer(app)
    return Response({
        "success": True,
        "message": "Campus Ambassador application submitted successfully!",
        "data": serializer.data
    }, status=status.HTTP_201_CREATED)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_student_ambassador_application(request):
    app = CampusAmbassadorApplication.objects.filter(user=request.user).first()
    if not app:
        return Response({"success": True, "has_applied": False, "data": None}, status=status.HTTP_200_OK)

    serializer = CampusAmbassadorApplicationSerializer(app)
    return Response({"success": True, "has_applied": True, "data": serializer.data}, status=status.HTTP_200_OK)


# PHASE 5: COMMUNITY DIRECTORY VIEWS
@api_view(['GET'])
@permission_classes([AllowAny])
def get_community_members(request):
    queryset = StudentProfile.objects.all().select_related('user').prefetch_related('skills', 'interests')

    search = request.GET.get('search', '').strip()
    if search:
        queryset = queryset.filter(
            Q(full_name__icontains=search) |
            Q(college__icontains=search) |
            Q(bio__icontains=search) |
            Q(skills__name__icontains=search)
        ).distinct()

    college = request.GET.get('college', '').strip()
    if college and college.lower() != 'all':
        queryset = queryset.filter(college__icontains=college)

    skill = request.GET.get('skill', '').strip()
    if skill and skill.lower() != 'all':
        queryset = queryset.filter(skills__name__icontains=skill)

    role = request.GET.get('role', '').strip()
    if role and role.lower() != 'all':
        queryset = queryset.filter(role__icontains=role)

    try:
        page = int(request.GET.get('page', 1))
        page_size = int(request.GET.get('page_size', 12))
    except ValueError:
        page = 1
        page_size = 12

    total_count = queryset.count()
    start = (page - 1) * page_size
    end = start + page_size
    paginated = queryset.order_by('-created_at')[start:end]

    serializer = PublicCommunityMemberSerializer(paginated, many=True, context={'request': request})

    total_ambassadors = CampusAmbassadorApplication.objects.filter(status='ACCEPTED').count()
    total_projects = StudentProject.objects.filter(status='PUBLISHED').count()

    return Response({
        "success": True,
        "total_count": total_count,
        "total_ambassadors": total_ambassadors,
        "total_projects": total_projects,
        "page": page,
        "page_size": page_size,
        "total_pages": (total_count + page_size - 1) // page_size if total_count > 0 else 1,
        "members": serializer.data
    }, status=status.HTTP_200_OK)


@api_view(['GET'])
@permission_classes([AllowAny])
def get_community_member_detail(request, pk):
    try:
        profile = StudentProfile.objects.get(pk=pk)
    except StudentProfile.DoesNotExist:
        return Response({"success": False, "message": "Member not found."}, status=status.HTTP_404_NOT_FOUND)

    serializer = PublicCommunityMemberSerializer(profile, context={'request': request})
    
    talents = TalentProfile.objects.filter(user=profile.user, status='PUBLISHED')
    projects = StudentProject.objects.filter(user=profile.user, status='PUBLISHED')
    stories = StudentStory.objects.filter(user=profile.user, status='PUBLISHED')
    achievements = StudentAchievement.objects.filter(user=profile.user, status='PUBLISHED')

    return Response({
        "success": True,
        "data": serializer.data,
        "showcase": {
            "talents": TalentProfileSerializer(talents, many=True).data,
            "projects": StudentProjectSerializer(projects, many=True).data,
            "stories": StudentStorySerializer(stories, many=True).data,
            "achievements": StudentAchievementSerializer(achievements, many=True).data
        }
    }, status=status.HTTP_200_OK)


# PHASE 5: STUDENT ACHIEVEMENTS VIEWS
@api_view(['GET'])
@permission_classes([AllowAny])
def get_achievements(request):
    queryset = StudentAchievement.objects.filter(status='PUBLISHED').order_by('-date_achieved')
    serializer = StudentAchievementSerializer(queryset, many=True)
    return Response({"success": True, "count": len(serializer.data), "achievements": serializer.data}, status=status.HTTP_200_OK)


@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])
def student_achievement_list_create(request):
    user = request.user
    if request.method == 'GET':
        achievements = StudentAchievement.objects.filter(user=user).order_by('-created_at')
        serializer = StudentAchievementSerializer(achievements, many=True)
        return Response({"success": True, "achievements": serializer.data}, status=status.HTTP_200_OK)

    title = request.data.get('title', '').strip()
    organization = request.data.get('organization', '').strip()
    category = request.data.get('category', 'Hackathon Winner').strip()
    description = request.data.get('description', '').strip()
    certificate_url = request.data.get('certificate_url', '').strip()

    if not title or not organization or not description:
        return Response({"success": False, "message": "Title, organization, and description are required."}, status=status.HTTP_400_BAD_REQUEST)

    achievement = StudentAchievement.objects.create(
        user=user,
        title=title,
        organization=organization,
        category=category,
        description=description,
        certificate_url=certificate_url,
        status='PENDING_REVIEW'
    )

    serializer = StudentAchievementSerializer(achievement)
    return Response({
        "success": True,
        "message": "Achievement submitted for review.",
        "data": serializer.data
    }, status=status.HTTP_201_CREATED)


@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def delete_student_achievement(request, pk):
    try:
        ach = StudentAchievement.objects.get(pk=pk, user=request.user)
        ach.delete()
        return Response({"success": True, "message": "Achievement deleted."}, status=status.HTTP_200_OK)
    except StudentAchievement.DoesNotExist:
        return Response({"success": False, "message": "Achievement not found."}, status=status.HTTP_404_NOT_FOUND)



@api_view(['GET'])
@permission_classes([AllowAny])
def get_talent_categories(request):
    cats = TalentCategory.objects.all().order_by('name')
    if not cats.exists():
        default_names = ['Music', 'Singing', 'Dance', 'Photography', 'Videography', 'Writing', 'Poetry', 'Art', 'Design', 'Coding', 'Public Speaking', 'Content Creation', 'Entrepreneurship', 'Sports', 'Other']
        return Response([{"id": idx+1, "name": c, "slug": c.lower().replace(' ', '-')} for idx, c in enumerate(default_names)], status=status.HTTP_200_OK)
    return Response([{"id": c.id, "name": c.name, "slug": c.slug} for c in cats], status=status.HTTP_200_OK)


@api_view(['GET'])
@permission_classes([AllowAny])
def get_project_categories(request):
    cats = ProjectCategory.objects.all().order_by('name')
    if not cats.exists():
        default_names = ['Web Development', 'Mobile Apps', 'AI & Machine Learning', 'Data Science', 'Cybersecurity', 'IoT', 'Robotics', 'Design', 'Entrepreneurship', 'Social Impact', 'Research', 'Other']
        return Response([{"id": idx+1, "name": c, "slug": c.lower().replace(' ', '-')} for idx, c in enumerate(default_names)], status=status.HTTP_200_OK)
    return Response([{"id": c.id, "name": c.name, "slug": c.slug, "description": c.description} for c in cats], status=status.HTTP_200_OK)


@api_view(['GET'])
@permission_classes([AllowAny])
def get_story_categories(request):
    cats = StoryCategory.objects.all().order_by('name')
    if not cats.exists():
        default_names = ['Student Journey', 'Career Journey', 'Internship Experience', 'Project Journey', 'Leadership Journey', 'Volunteer Experience', 'Learning Journey', 'Success Story', 'Community Experience']
        return Response([{"id": idx+1, "name": c, "slug": c.lower().replace(' ', '-')} for idx, c in enumerate(default_names)], status=status.HTTP_200_OK)
    return Response([{"id": c.id, "name": c.name, "slug": c.slug, "description": c.description} for c in cats], status=status.HTTP_200_OK)


@api_view(['GET'])
@permission_classes([AllowAny])
def get_community_stats(request):
    total_members = StudentProfile.objects.count()
    active_ambassadors = CampusAmbassadorApplication.objects.filter(status='ACCEPTED').count()
    if active_ambassadors == 0:
        active_ambassadors = CampusAmbassadorApplication.objects.count()
    project_contributors = StudentProject.objects.values('user').distinct().count()
    volunteer_members = VolunteerApplication.objects.values('user').distinct().count()
    student_contributors = TalentProfile.objects.values('user').distinct().count() + StudentStory.objects.values('user').distinct().count()

    return Response({
        "success": True,
        "total_members": total_members,
        "active_ambassadors": active_ambassadors,
        "project_contributors": project_contributors,
        "volunteer_members": volunteer_members,
        "student_contributors": student_contributors
    }, status=status.HTTP_200_OK)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def apply_leadership_opportunity(request, pk):
    user = request.user
    try:
        opportunity = Opportunity.objects.get(pk=pk)
    except Opportunity.DoesNotExist:
        return Response({"success": False, "message": "Opportunity not found."}, status=status.HTTP_404_NOT_FOUND)

    existing = OpportunityApplication.objects.filter(opportunity=opportunity, user=user).first()
    if existing:
        return Response({"success": False, "message": "You have already applied for this leadership role."}, status=status.HTTP_400_BAD_REQUEST)

    sop = request.data.get('statement_of_purpose', '').strip()
    exp = request.data.get('relevant_experience', '').strip()
    cover = request.data.get('cover_message', '').strip()
    if not cover and (sop or exp):
        cover = f"Statement of Purpose: {sop}\n\nRelevant Experience: {exp}".strip()

    app = OpportunityApplication.objects.create(
        opportunity=opportunity,
        user=user,
        cover_message=cover,
        portfolio_url=request.data.get('portfolio_url', '').strip(),
        status='APPLIED'
    )
    return Response({"success": True, "message": "Leadership application submitted successfully!", "data": OpportunityApplicationSerializer(app).data}, status=status.HTTP_201_CREATED)


@api_view(['PUT', 'DELETE'])
@permission_classes([IsAuthenticated])
def update_student_achievement(request, pk):
    try:
        ach = StudentAchievement.objects.get(pk=pk, user=request.user)
    except StudentAchievement.DoesNotExist:
        return Response({"success": False, "message": "Achievement not found."}, status=status.HTTP_404_NOT_FOUND)

    if request.method == 'DELETE':
        ach.delete()
        return Response({"success": True, "message": "Achievement deleted."}, status=status.HTTP_200_OK)

    ach.title = request.data.get('title', ach.title).strip()
    ach.category = request.data.get('category', request.data.get('achievement_type', ach.category)).strip()
    ach.organization = request.data.get('organization', ach.organization).strip()
    if request.data.get('date_achieved'):
        ach.date_achieved = request.data.get('date_achieved')
    ach.description = request.data.get('description', ach.description).strip()
    ach.certificate_url = request.data.get('certificate_url', request.data.get('proof_url', ach.certificate_url)).strip()
    ach.status = 'PENDING_REVIEW'
    ach.save()

    return Response({"success": True, "message": "Achievement updated and submitted for review.", "data": StudentAchievementSerializer(ach).data}, status=status.HTTP_200_OK)


# PHASE 6 VIEWS: SERVICES, GUIDANCE, SUPPORT, SERVICE ENQUIRIES & CONTACT

@api_view(['GET'])
@permission_classes([AllowAny])
def get_services(request):
    queryset = SSService.objects.filter(is_active=True)

    search = request.GET.get('search', '').strip()
    if search:
        queryset = queryset.filter(
            Q(title__icontains=search) |
            Q(description__icontains=search) |
            Q(short_description__icontains=search) |
            Q(category__icontains=search)
        )

    category = request.GET.get('category', '').strip()
    if category and category.lower() != 'all':
        queryset = queryset.filter(category__icontains=category)

    is_featured = request.GET.get('is_featured', '').strip()
    if is_featured == 'true':
        queryset = queryset.filter(is_featured=True)

    services = queryset.order_by('order', 'title')
    serializer = SSServiceSerializer(services, many=True, context={'request': request})
    return Response({
        "success": True,
        "count": len(serializer.data),
        "services": serializer.data
    }, status=status.HTTP_200_OK)


@api_view(['GET'])
@permission_classes([AllowAny])
def get_service_detail(request, slug):
    try:
        if str(slug).isdigit():
            service = SSService.objects.get(pk=int(slug), is_active=True)
        else:
            service = SSService.objects.get(slug=slug, is_active=True)
    except SSService.DoesNotExist:
        return Response({"success": False, "message": "Service not found."}, status=status.HTTP_404_NOT_FOUND)

    serializer = SSServiceSerializer(service, context={'request': request})
    return Response({
        "success": True,
        "data": serializer.data
    }, status=status.HTTP_200_OK)


@api_view(['GET'])
@permission_classes([AllowAny])
def get_service_categories(request):
    categories = ServiceCategory.objects.all().order_by('order', 'name')
    if not categories.exists():
        default_cats = [
            {"name": "SS Band", "slug": "ss-band", "description": "Student talent performances, music events, cultural programs", "icon_name": "Music"},
            {"name": "SS Event Management", "slug": "ss-event-management", "description": "Event planning, coordination, volunteer management", "icon_name": "Calendar"},
            {"name": "SS IT Solutions", "slug": "ss-it-solutions", "description": "Websites, web apps, student platforms, API development", "icon_name": "Code"},
            {"name": "Student Problems & Guidance", "slug": "student-problems-guidance", "description": "1-on-1 problem resolution, career direction, student guidance", "icon_name": "HelpCircle"},
            {"name": "Career & Internship Support", "slug": "career-internship-support", "description": "Resume reviews, interview prep, LinkedIn optimization", "icon_name": "Briefcase"},
            {"name": "Training & Workshops", "slug": "training-workshops", "description": "Technical skills, soft skills, peer-led workshops", "icon_name": "BookOpen"},
            {"name": "Digital & Creative Services", "slug": "digital-creative-services", "description": "Graphic design, video editing, social media management", "icon_name": "Palette"},
            {"name": "Community Programs", "slug": "community-programs", "description": "Campus ambassador initiatives, volunteer networks", "icon_name": "Users"},
            {"name": "Other Services", "slug": "other-services", "description": "Custom student & organizational requests", "icon_name": "Settings"},
        ]
        return Response({"success": True, "categories": default_cats}, status=status.HTTP_200_OK)

    serializer = ServiceCategorySerializer(categories, many=True)
    return Response({"success": True, "categories": serializer.data}, status=status.HTTP_200_OK)


@api_view(['GET'])
@permission_classes([AllowAny])
def get_service_faqs(request, slug=None):
    if slug:
        service = SSService.objects.filter(Q(slug=slug) | Q(pk=int(slug) if str(slug).isdigit() else 0)).first()
        if service:
            faqs = ServiceFAQ.objects.filter(service=service).order_by('order')
        else:
            faqs = ServiceFAQ.objects.filter(service__isnull=True).order_by('order')
    else:
        faqs = ServiceFAQ.objects.all().order_by('order')

    if not faqs.exists():
        default_faqs = [
            {"id": 1, "question": "What is Struggle of Student (SS)?", "answer": "SS is a student-led platform providing opportunities, events, talent showcases, IT solutions, and student guidance."},
            {"id": 2, "question": "Who can join the SS community?", "answer": "All college students, recent graduates, and young enthusiasts are welcome to join SS free of charge."},
            {"id": 3, "question": "How can I request guidance or student support?", "answer": "Visit our Support page (/support) and submit a ticket describing your problem. Our team will review and guide you."},
            {"id": 4, "question": "How can my college or organization work with SS?", "answer": "You can submit a Service Enquiry for IT Solutions, Event Management, SS Band, or Workshops through our Services portal (/services)."},
            {"id": 5, "question": "How does SS handle student privacy?", "answer": "Student support requests, enquiries, emails, and contact information are strictly private and accessible only to authorized staff."}
        ]
        return Response({"success": True, "faqs": default_faqs}, status=status.HTTP_200_OK)

    serializer = ServiceFAQSerializer(faqs, many=True)
    return Response({"success": True, "faqs": serializer.data}, status=status.HTTP_200_OK)


@api_view(['POST'])
@permission_classes([AllowAny])
@parser_classes([MultiPartParser, FormParser, JSONParser])
def create_service_enquiry(request, slug=None):
    full_name = str(request.data.get('full_name', '')).strip()
    email = str(request.data.get('email', '')).strip().lower()
    phone = str(request.data.get('phone', '')).strip()
    organization = str(request.data.get('organization', '')).strip()
    requirement = str(request.data.get('requirement', '')).strip()
    preferred_contact = str(request.data.get('preferred_contact', 'Email')).strip()
    expected_timeline = str(request.data.get('expected_timeline', '')).strip()
    enquiry_type = str(request.data.get('enquiry_type', 'STUDENT')).strip().upper()
    service_name_input = str(request.data.get('service_name', '')).strip()
    attachment = request.FILES.get('attachment')

    if request.user and request.user.is_authenticated:
        if not full_name and hasattr(request.user, 'student_profile'):
            full_name = request.user.student_profile.full_name
        if not email:
            email = request.user.email

    if not full_name or not email or not requirement:
        return Response({"success": False, "message": "Full name, email, and requirement details are required."}, status=status.HTTP_400_BAD_REQUEST)

    service_obj = None
    if slug:
        service_obj = SSService.objects.filter(Q(slug=slug) | Q(pk=int(slug) if str(slug).isdigit() else 0)).first()
        if service_obj and not service_name_input:
            service_name_input = service_obj.title

    enquiry = ServiceEnquiry.objects.create(
        user=request.user if (request.user and request.user.is_authenticated) else None,
        service=service_obj,
        service_name=service_name_input or (service_obj.title if service_obj else 'General Enquiry'),
        enquiry_type=enquiry_type if enquiry_type in ['STUDENT', 'COLLEGE', 'ORGANIZATION', 'COMMUNITY', 'PARTNERSHIP', 'OTHER'] else 'STUDENT',
        full_name=full_name,
        email=email,
        phone=phone,
        organization=organization,
        requirement=requirement,
        preferred_contact=preferred_contact,
        expected_timeline=expected_timeline,
        attachment=attachment,
        status='NEW'
    )

    serializer = ServiceEnquirySerializer(enquiry)
    return Response({
        "success": True,
        "message": f"Your enquiry has been received successfully! Reference ID: {enquiry.reference_number}",
        "reference_number": enquiry.reference_number,
        "data": serializer.data
    }, status=status.HTTP_201_CREATED)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_student_enquiries(request):
    enquiries = ServiceEnquiry.objects.filter(user=request.user).order_by('-created_at')
    serializer = ServiceEnquirySerializer(enquiries, many=True)
    return Response({
        "success": True,
        "total_enquiries": len(serializer.data),
        "enquiries": serializer.data
    }, status=status.HTTP_200_OK)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_student_enquiry_detail(request, pk):
    try:
        enquiry = ServiceEnquiry.objects.get(pk=pk, user=request.user)
    except ServiceEnquiry.DoesNotExist:
        return Response({"success": False, "message": "Enquiry not found or access denied."}, status=status.HTTP_404_NOT_FOUND)

    serializer = ServiceEnquirySerializer(enquiry)
    return Response({
        "success": True,
        "data": serializer.data
    }, status=status.HTTP_200_OK)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
@parser_classes([MultiPartParser, FormParser, JSONParser])
def create_support_request(request):
    user = request.user
    category = str(request.data.get('category', 'General')).strip()
    subject = str(request.data.get('subject', '')).strip()
    description = str(request.data.get('description', '')).strip()
    preferred_contact = str(request.data.get('preferred_contact', 'Email')).strip()
    priority = str(request.data.get('priority', 'NORMAL')).strip().upper()
    attachment = request.FILES.get('attachment')

    if not subject or not description:
        return Response({"success": False, "message": "Subject and detailed description are required."}, status=status.HTTP_400_BAD_REQUEST)

    ticket = SupportRequest.objects.create(
        user=user,
        category=category,
        subject=subject,
        description=description,
        preferred_contact=preferred_contact,
        priority=priority if priority in ['LOW', 'NORMAL', 'HIGH', 'URGENT'] else 'NORMAL',
        attachment=attachment,
        status='OPEN'
    )

    # Phase 10 Notification
    try:
        NotificationService.notify_support_created(ticket)
    except Exception as notif_err:
        pass

    serializer = SupportRequestSerializer(ticket)
    return Response({
        "success": True,
        "message": f"Your support request has been submitted! Reference ID: {ticket.reference_number}",
        "reference_number": ticket.reference_number,
        "data": serializer.data
    }, status=status.HTTP_201_CREATED)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_student_support_requests(request):
    tickets = SupportRequest.objects.filter(user=request.user).order_by('-created_at')
    serializer = SupportRequestSerializer(tickets, many=True)
    return Response({
        "success": True,
        "total_requests": len(serializer.data),
        "requests": serializer.data
    }, status=status.HTTP_200_OK)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_student_support_detail(request, pk):
    try:
        if str(pk).isdigit():
            ticket = SupportRequest.objects.get(pk=int(pk), user=request.user)
        else:
            ticket = SupportRequest.objects.get(reference_number=pk, user=request.user)
    except SupportRequest.DoesNotExist:
        return Response({"success": False, "message": "Support request not found or permission denied."}, status=status.HTTP_404_NOT_FOUND)

    serializer = SupportRequestSerializer(ticket)
    return Response({
        "success": True,
        "data": serializer.data
    }, status=status.HTTP_200_OK)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
@parser_classes([MultiPartParser, FormParser, JSONParser])
def add_support_update(request, pk):
    user = request.user
    try:
        if str(pk).isdigit():
            ticket = SupportRequest.objects.get(pk=int(pk), user=user)
        else:
            ticket = SupportRequest.objects.get(reference_number=pk, user=user)
    except SupportRequest.DoesNotExist:
        return Response({"success": False, "message": "Support request not found or permission denied."}, status=status.HTTP_404_NOT_FOUND)

    message = str(request.data.get('message', '')).strip()
    attachment = request.FILES.get('attachment')

    if not message:
        return Response({"success": False, "message": "Message content is required."}, status=status.HTTP_400_BAD_REQUEST)

    update = SupportUpdate.objects.create(
        support_request=ticket,
        author=user,
        is_staff_reply=False,
        message=message,
        attachment=attachment
    )

    ticket.updated_at = timezone.now()
    ticket.save()

    serializer = SupportUpdateSerializer(update)
    return Response({
        "success": True,
        "message": "Update added to support request.",
        "data": serializer.data
    }, status=status.HTTP_201_CREATED)


@api_view(['POST'])
@permission_classes([AllowAny])
def submit_contact_message(request):
    name = str(request.data.get('name', '')).strip()
    email = str(request.data.get('email', '')).strip().lower()
    phone = str(request.data.get('phone', '')).strip()
    subject = str(request.data.get('subject', '')).strip()
    message = str(request.data.get('message', '')).strip()

    if not name or not email or not subject or not message:
        return Response({"success": False, "message": "Name, email, subject, and message are required."}, status=status.HTTP_400_BAD_REQUEST)

    contact_msg = ContactMessage.objects.create(
        name=name,
        email=email,
        phone=phone,
        subject=subject,
        message=message,
        status='NEW'
    )

    serializer = ContactMessageSerializer(contact_msg)
    return Response({
        "success": True,
        "message": "Thank you for reaching out to SS! Your message has been stored, and our team will get back to you soon.",
        "data": serializer.data
    }, status=status.HTTP_201_CREATED)


@api_view(['GET'])
@permission_classes([AllowAny])
def get_stats(request):
    stats = CommunityStat.objects.all()
    serializer = CommunityStatSerializer(stats, many=True)
    return Response({"success": True, "stats": serializer.data}, status=status.HTTP_200_OK)


# ==========================================
# PHASE 7: SS IDENTITY & IMPACT API VIEWS
# ==========================================

@api_view(['GET'])
@permission_classes([AllowAny])
def get_about_section(request):
    about = AboutSection.objects.first()
    if not about:
        about = AboutSection.objects.create()
    serializer = AboutSectionSerializer(about)
    return Response({"success": True, "data": serializer.data}, status=status.HTTP_200_OK)


@api_view(['GET'])
@permission_classes([AllowAny])
def get_leadership_list(request):
    leaders = LeadershipMember.objects.filter(status='PUBLIC').order_by('display_order', 'created_at')
    
    founder = LeadershipMemberSerializer(leaders.filter(leadership_type='FOUNDER').first()).data if leaders.filter(leadership_type='FOUNDER').exists() else None
    directors = LeadershipMemberSerializer(leaders.filter(leadership_type='DIRECTOR'), many=True).data
    core_team = LeadershipMemberSerializer(leaders.filter(leadership_type='CORE_LEADERSHIP'), many=True).data
    team_leads = LeadershipMemberSerializer(leaders.filter(leadership_type='TEAM_LEAD'), many=True).data
    
    all_serialized = LeadershipMemberSerializer(leaders, many=True).data

    return Response({
        "success": True,
        "count": leaders.count(),
        "founder": founder,
        "directors": directors,
        "core_leadership": core_team,
        "team_leads": team_leads,
        "all_leadership": all_serialized
    }, status=status.HTTP_200_OK)


@api_view(['GET'])
@permission_classes([AllowAny])
def get_leadership_detail(request, pk):
    try:
        member = LeadershipMember.objects.get(pk=pk, status='PUBLIC')
    except LeadershipMember.DoesNotExist:
        return Response({"success": False, "message": "Leadership profile not found or private."}, status=status.HTTP_404_NOT_FOUND)
    
    serializer = LeadershipMemberSerializer(member)
    return Response({"success": True, "data": serializer.data}, status=status.HTTP_200_OK)


@api_view(['GET'])
@permission_classes([AllowAny])
def get_team_list(request):
    department = request.query_params.get('department')
    team = TeamMember.objects.filter(status='ACTIVE')
    if department and department != 'All':
        team = team.filter(department=department)
    
    team = team.order_by('display_order', 'name')
    serializer = TeamMemberSerializer(team, many=True)
    return Response({
        "success": True,
        "count": team.count(),
        "team": serializer.data
    }, status=status.HTTP_200_OK)


@api_view(['GET'])
@permission_classes([AllowAny])
def get_team_detail(request, pk):
    try:
        member = TeamMember.objects.get(pk=pk, status='ACTIVE')
    except TeamMember.DoesNotExist:
        return Response({"success": False, "message": "Team member profile not found."}, status=status.HTTP_404_NOT_FOUND)
    
    serializer = TeamMemberSerializer(member)
    return Response({"success": True, "data": serializer.data}, status=status.HTTP_200_OK)


@api_view(['GET'])
@permission_classes([AllowAny])
def get_placements_list(request):
    placements = Placement.objects.filter(verification_status='VERIFIED', visibility='PUBLIC').order_by('-placement_year', '-created_at')
    serializer = PlacementSerializer(placements, many=True)
    return Response({
        "success": True,
        "count": placements.count(),
        "placements": serializer.data
    }, status=status.HTTP_200_OK)


@api_view(['GET'])
@permission_classes([AllowAny])
def get_placement_detail(request, pk):
    try:
        placement = Placement.objects.get(pk=pk, verification_status='VERIFIED', visibility='PUBLIC')
    except Placement.DoesNotExist:
        return Response({"success": False, "message": "Placement record not found or not published."}, status=status.HTTP_404_NOT_FOUND)
    
    serializer = PlacementSerializer(placement)
    return Response({"success": True, "data": serializer.data}, status=status.HTTP_200_OK)


@api_view(['GET'])
@permission_classes([AllowAny])
def get_success_stories_list(request):
    category = request.query_params.get('category')
    stories = SuccessStory.objects.filter(verification_status__in=['VERIFIED', 'PUBLISHED'])
    if category and category != 'All':
        stories = stories.filter(category=category)
    
    stories = stories.order_by('-created_at')
    serializer = SuccessStorySerializer(stories, many=True)
    return Response({
        "success": True,
        "count": stories.count(),
        "stories": serializer.data
    }, status=status.HTTP_200_OK)


@api_view(['GET'])
@permission_classes([AllowAny])
def get_success_story_detail(request, pk):
    try:
        story = SuccessStory.objects.get(pk=pk, verification_status__in=['VERIFIED', 'PUBLISHED'])
    except SuccessStory.DoesNotExist:
        return Response({"success": False, "message": "Success story not found."}, status=status.HTTP_404_NOT_FOUND)
    
    serializer = SuccessStorySerializer(story)
    return Response({"success": True, "data": serializer.data}, status=status.HTTP_200_OK)


@api_view(['GET'])
@permission_classes([AllowAny])
def get_testimonials_list(request):
    testimonials = Testimonial.objects.filter(verification_status='APPROVED', visibility='PUBLIC').order_by('-created_at')
    serializer = TestimonialSerializer(testimonials, many=True)
    return Response({
        "success": True,
        "count": testimonials.count(),
        "testimonials": serializer.data
    }, status=status.HTTP_200_OK)


@api_view(['GET'])
@permission_classes([AllowAny])
def get_partners_list(request):
    partners = Partner.objects.filter(status='ACTIVE').order_by('display_order', 'name')
    serializer = PartnerSerializer(partners, many=True)
    return Response({
        "success": True,
        "count": partners.count(),
        "partners": serializer.data
    }, status=status.HTTP_200_OK)


@api_view(['GET'])
@permission_classes([AllowAny])
def get_impact_data(request):
    metrics = ImpactMetric.objects.filter(is_active=True).order_by('display_order')
    milestones = OrganizationMilestone.objects.all().order_by('display_order', 'year')
    
    return Response({
        "success": True,
        "metrics": ImpactMetricSerializer(metrics, many=True).data,
        "milestones": OrganizationMilestoneSerializer(milestones, many=True).data
    }, status=status.HTTP_200_OK)


@api_view(['GET'])
@permission_classes([AllowAny])
def get_impact_statistics(request):
    active_members = StudentProfile.objects.filter(user__is_active=True).count()
    volunteers = VolunteerApplication.objects.filter(status='ACCEPTED').count()
    if volunteers == 0:
        volunteers = VolunteerApplication.objects.filter(status__in=['APPLIED', 'ACCEPTED']).count()
    
    projects = StudentProject.objects.filter(status='PUBLISHED').count()
    events = Event.objects.filter(is_published=True).count()
    opportunities = Opportunity.objects.filter(status__in=['OPEN', 'CLOSING_SOON']).count()
    
    placements_qs = Placement.objects.filter(verification_status='VERIFIED', visibility='PUBLIC')
    students_placed = sum(p.number_of_students for p in placements_qs)
    
    ambassadors = CampusAmbassadorApplication.objects.filter(status='ACCEPTED').count()
    
    support_reqs = SupportRequest.objects.count()
    enquiries_count = ServiceEnquiry.objects.count()
    applications_count = OpportunityApplication.objects.count()
    students_supported = active_members + support_reqs + enquiries_count + applications_count

    return Response({
        "success": True,
        "statistics": {
            "active_members": active_members,
            "volunteers": volunteers,
            "projects": projects,
            "events": events,
            "opportunities": opportunities,
            "students_placed": students_placed,
            "campus_ambassadors": ambassadors,
            "students_supported": students_supported,
        }
    }, status=status.HTTP_200_OK)


