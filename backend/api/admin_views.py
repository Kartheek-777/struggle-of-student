import datetime
from django.utils import timezone
from django.db import transaction
from django.db.models import Q, Count, Sum
from django.contrib.auth.models import User
from rest_framework import status, permissions
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response

from .models import (
    StudentProfile, StudentResume, Skill, Interest,
    OpportunityCategory, Opportunity, SavedOpportunity, OpportunityApplication,
    EventCategory, Event, MeetingInfo, EventRegistration, WaitlistEntry, SessionFeedback,
    VolunteerRole, VolunteerApplication, SSService, ServiceCategory, ServiceFAQ,
    ServicePortfolioItem, ServiceEnquiry, SupportRequest, SupportUpdate, ContactMessage,
    AboutSection, LeadershipMember, TeamMember, Placement, SuccessStory,
    Partner, Testimonial, OrganizationMilestone, ImpactMetric,
    TalentProfile, StudentProject, StudentStory, CampusAmbassadorApplication, StudentAchievement,
    SessionSpeaker, AuditLog, ContentRevision, SiteSetting
)
from .serializers import (
    StudentProfileSerializer, AdminUserDetailSerializer, OpportunitySerializer,
    OpportunityApplicationSerializer, EventSerializer, EventRegistrationSerializer,
    VolunteerApplicationSerializer, VolunteerRoleSerializer, SSServiceSerializer,
    ServiceEnquirySerializer, SupportRequestSerializer, SupportUpdateSerializer,
    TalentProfileSerializer, StudentProjectSerializer, StudentStorySerializer,
    CampusAmbassadorApplicationSerializer, StudentAchievementSerializer,
    PlacementSerializer, LeadershipMemberSerializer, TeamMemberSerializer,
    PartnerSerializer, TestimonialSerializer, ImpactMetricSerializer,
    AboutSectionSerializer, OrganizationMilestoneSerializer, AuditLogSerializer,
    ContentRevisionSerializer, SiteSettingSerializer, SessionSpeakerSerializer
)
from .permissions import get_user_admin_role, has_module_permission, IsAdminUserOrStaff
from .notification_service import NotificationService



def log_admin_action(user, action, module, record_id="", record_repr="", previous_value="", new_value="", request=None):
    """Utility function to log all administrative actions to AuditLog."""
    admin_name = 'System Admin'
    admin_role = 'ADMIN'
    
    if user and user.is_authenticated:
        prof = getattr(user, 'student_profile', None)
        admin_name = prof.full_name if (prof and prof.full_name) else (user.get_full_name() or user.email or user.username)
        admin_role = get_user_admin_role(user) or 'ADMIN'

    ip_address = None
    if request:
        x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
        if x_forwarded_for:
            ip_address = x_forwarded_for.split(',')[0].strip()
        else:
            ip_address = request.META.get('REMOTE_ADDR')

    AuditLog.objects.create(
        user=user if (user and user.is_authenticated) else None,
        admin_name=admin_name,
        admin_role=admin_role,
        action=action,
        module=module,
        record_id=str(record_id),
        record_repr=str(record_repr)[:250],
        previous_value=str(previous_value)[:500],
        new_value=str(new_value)[:500],
        ip_address=ip_address
    )


# 1. ADMIN DASHBOARD OVERVIEW
@api_view(['GET'])
@permission_classes([IsAdminUserOrStaff])
def admin_dashboard_overview(request):
    now = timezone.now()
    today = datetime.date.today()

    # Real DB statistics
    total_students = StudentProfile.objects.filter(role='STUDENT').count()
    active_members = User.objects.filter(is_active=True).count()
    active_opportunities = Opportunity.objects.filter(status='OPEN').count()
    upcoming_events = Event.objects.filter(start_datetime__gte=now, is_published=True).count()
    upcoming_sessions = Event.objects.filter(
        session_type__in=['ONLINE_SESSION', 'WEBINAR', 'TECHNICAL_SESSION', 'CAREER_SESSION'],
        start_datetime__gte=now,
        is_published=True
    ).count()

    pending_applications = OpportunityApplication.objects.filter(status__in=['APPLIED', 'UNDER_REVIEW']).count()
    volunteer_registrations = VolunteerApplication.objects.filter(status__in=['APPLIED', 'UNDER_REVIEW']).count()
    open_support_requests = SupportRequest.objects.filter(status__in=['OPEN', 'ACKNOWLEDGED', 'IN_PROGRESS']).count()
    new_enquiries = ServiceEnquiry.objects.filter(status='NEW').count()

    # Placements
    placed_aggregate = Placement.objects.aggregate(total=Sum('number_of_students'))
    students_placed = placed_aggregate['total'] or 0

    published_projects = StudentProject.objects.filter(status='PUBLISHED').count()

    # Moderation items
    pending_talents = TalentProfile.objects.filter(status='PENDING_REVIEW').count()
    pending_projects = StudentProject.objects.filter(status='PENDING_REVIEW').count()
    pending_stories = StudentStory.objects.filter(status='PENDING_REVIEW').count()
    pending_achievements = StudentAchievement.objects.filter(status='PENDING_REVIEW').count()
    pending_testimonials = Testimonial.objects.filter(verification_status='PENDING_REVIEW').count()
    pending_placements = Placement.objects.filter(verification_status='PENDING_VERIFICATION').count()

    pending_moderation_total = pending_talents + pending_projects + pending_stories + pending_achievements + pending_testimonials

    # Recent Audit Activity
    recent_activity = AuditLog.objects.all().order_by('-created_at')[:10]
    recent_activity_data = AuditLogSerializer(recent_activity, many=True).data

    current_role = get_user_admin_role(request.user)

    return Response({
        "success": True,
        "role": current_role,
        "stats": {
            "total_students": total_students,
            "active_members": active_members,
            "active_opportunities": active_opportunities,
            "upcoming_events": upcoming_events,
            "upcoming_sessions": upcoming_sessions,
            "pending_applications": pending_applications,
            "volunteer_registrations": volunteer_registrations,
            "open_support_requests": open_support_requests,
            "new_enquiries": new_enquiries,
            "students_placed": students_placed,
            "published_projects": published_projects,
            "pending_moderation": pending_moderation_total,
            "pending_placements": pending_placements
        },
        "pending_actions": {
            "pending_applications": pending_applications,
            "pending_moderation": pending_moderation_total,
            "open_support_requests": open_support_requests,
            "new_enquiries": new_enquiries,
            "pending_placement_verification": pending_placements
        },
        "recent_activity": recent_activity_data
    }, status=status.HTTP_200_OK)


# 2. USER MANAGEMENT
@api_view(['GET'])
@permission_classes([IsAdminUserOrStaff])
def admin_user_list(request):
    if not has_module_permission(request.user, 'USERS', read_only_action=True):
        return Response({"success": False, "message": "Permission denied. Cannot access user management."}, status=status.HTTP_403_FORBIDDEN)

    queryset = User.objects.all().select_related('student_profile').order_by('-date_joined')

    search = request.GET.get('search', '').strip()
    if search:
        queryset = queryset.filter(
            Q(email__icontains=search) |
            Q(first_name__icontains=search) |
            Q(last_name__icontains=search) |
            Q(student_profile__full_name__icontains=search) |
            Q(student_profile__college__icontains=search)
        )

    role_filter = request.GET.get('role', '').strip()
    if role_filter and role_filter.lower() != 'all':
        if role_filter == 'ADMIN':
            queryset = queryset.filter(Q(is_staff=True) | Q(is_superuser=True) | Q(student_profile__role__in=['ADMIN', 'SUPER_ADMIN']))
        else:
            queryset = queryset.filter(student_profile__role__iexact=role_filter)

    status_filter = request.GET.get('status', '').strip()
    if status_filter:
        if status_filter == 'active':
            queryset = queryset.filter(is_active=True)
        elif status_filter == 'inactive' or status_filter == 'suspended':
            queryset = queryset.filter(is_active=False)

    college = request.GET.get('college', '').strip()
    if college and college.lower() != 'all':
        queryset = queryset.filter(student_profile__college__icontains=college)

    try:
        page = int(request.GET.get('page', 1))
        page_size = int(request.GET.get('page_size', 20))
    except ValueError:
        page = 1
        page_size = 20

    total_count = queryset.count()
    start = (page - 1) * page_size
    end = start + page_size
    paginated = queryset[start:end]

    serializer = AdminUserDetailSerializer(paginated, many=True)
    return Response({
        "success": True,
        "total_count": total_count,
        "page": page,
        "page_size": page_size,
        "total_pages": (total_count + page_size - 1) // page_size if total_count > 0 else 1,
        "users": serializer.data
    }, status=status.HTTP_200_OK)


@api_view(['GET'])
@permission_classes([IsAdminUserOrStaff])
def admin_user_detail(request, pk):
    if not has_module_permission(request.user, 'USERS', read_only_action=True):
        return Response({"success": False, "message": "Permission denied."}, status=status.HTTP_403_FORBIDDEN)

    try:
        target_user = User.objects.select_related('student_profile').get(pk=pk)
    except User.DoesNotExist:
        return Response({"success": False, "message": "User not found."}, status=status.HTTP_404_NOT_FOUND)

    user_data = AdminUserDetailSerializer(target_user).data

    # Related activity summary
    applications = OpportunityApplication.objects.filter(user=target_user).select_related('opportunity').order_by('-applied_at')
    events = EventRegistration.objects.filter(user=target_user).select_related('event').order_by('-registered_at')
    volunteers = VolunteerApplication.objects.filter(user=target_user).select_related('event', 'role').order_by('-applied_at')
    projects = StudentProject.objects.filter(user=target_user).order_by('-created_at')
    talents = TalentProfile.objects.filter(user=target_user).order_by('-created_at')
    support = SupportRequest.objects.filter(user=target_user).order_by('-created_at')

    return Response({
        "success": True,
        "user": user_data,
        "activity_summary": {
            "applications": OpportunityApplicationSerializer(applications, many=True).data,
            "events": EventRegistrationSerializer(events, many=True).data,
            "volunteers": VolunteerApplicationSerializer(volunteers, many=True).data,
            "projects": StudentProjectSerializer(projects, many=True).data,
            "talents": TalentProfileSerializer(talents, many=True).data,
            "support_requests": SupportRequestSerializer(support, many=True).data
        }
    }, status=status.HTTP_200_OK)


@api_view(['PATCH'])
@permission_classes([IsAdminUserOrStaff])
def admin_user_action(request, pk):
    if not has_module_permission(request.user, 'USERS', read_only_action=False):
        return Response({"success": False, "message": "Permission denied to perform user actions."}, status=status.HTTP_403_FORBIDDEN)

    try:
        target_user = User.objects.get(pk=pk)
    except User.DoesNotExist:
        return Response({"success": False, "message": "User not found."}, status=status.HTTP_404_NOT_FOUND)

    # Super Admin protection
    current_role = get_user_admin_role(request.user)
    if target_user.is_superuser and current_role != 'SUPER_ADMIN':
        return Response({"success": False, "message": "Only Super Admins can manage Super Admin accounts."}, status=status.HTTP_403_FORBIDDEN)

    action = request.data.get('action', '').strip().lower()
    new_role = request.data.get('role', '').strip()

    prev_status = "Active" if target_user.is_active else "Inactive/Suspended"

    if action == 'activate' or action == 'restore':
        target_user.is_active = True
        target_user.save()
        log_admin_action(request.user, f"Activated user account {target_user.email}", "USERS", target_user.id, target_user.email, prev_status, "Active", request)
        return Response({"success": True, "message": f"User {target_user.email} activated successfully."}, status=status.HTTP_200_OK)

    elif action == 'deactivate' or action == 'suspend':
        target_user.is_active = False
        target_user.save()
        log_admin_action(request.user, f"Suspended user account {target_user.email}", "USERS", target_user.id, target_user.email, prev_status, "Suspended", request)
        return Response({"success": True, "message": f"User {target_user.email} suspended successfully."}, status=status.HTTP_200_OK)

    elif action == 'assign_role' and new_role:
        prof, _ = StudentProfile.objects.get_or_create(user=target_user)
        prev_role = prof.role
        prof.role = new_role
        prof.save()

        if new_role in ['ADMIN', 'SUPER_ADMIN', 'CONTENT_MANAGER', 'EVENT_MANAGER', 'OPPORTUNITY_MANAGER', 'COMMUNITY_MANAGER', 'SUPPORT_MANAGER', 'HR_TEAM', 'MODERATOR']:
            target_user.is_staff = True
        else:
            target_user.is_staff = False
        target_user.save()

        log_admin_action(request.user, f"Assigned role {new_role} to {target_user.email}", "USERS", target_user.id, target_user.email, prev_role, new_role, request)
        return Response({"success": True, "message": f"Role updated to {new_role} for {target_user.email}."}, status=status.HTTP_200_OK)

    return Response({"success": False, "message": "Invalid user action requested."}, status=status.HTTP_400_BAD_REQUEST)


# 3. OPPORTUNITY MANAGEMENT
@api_view(['GET', 'POST'])
@permission_classes([IsAdminUserOrStaff])
def admin_opportunity_list_create(request):
    if request.method == 'GET':
        if not has_module_permission(request.user, 'OPPORTUNITIES', read_only_action=True):
            return Response({"success": False, "message": "Permission denied."}, status=status.HTTP_403_FORBIDDEN)

        queryset = Opportunity.objects.all().order_by('-created_at')

        search = request.GET.get('search', '').strip()
        if search:
            queryset = queryset.filter(
                Q(title__icontains=search) |
                Q(organization_name__icontains=search) |
                Q(category__icontains=search)
            )

        status_filter = request.GET.get('status', '').strip()
        if status_filter and status_filter.lower() != 'all':
            queryset = queryset.filter(status__iexact=status_filter)

        try:
            page = int(request.GET.get('page', 1))
            page_size = int(request.GET.get('page_size', 20))
        except ValueError:
            page = 1
            page_size = 20

        total_count = queryset.count()
        start = (page - 1) * page_size
        end = start + page_size
        paginated = queryset[start:end]

        serializer = OpportunitySerializer(paginated, many=True, context={'request': request})
        return Response({
            "success": True,
            "total_count": total_count,
            "page": page,
            "page_size": page_size,
            "total_pages": (total_count + page_size - 1) // page_size if total_count > 0 else 1,
            "opportunities": serializer.data
        }, status=status.HTTP_200_OK)

    # POST - Create
    if not has_module_permission(request.user, 'OPPORTUNITIES', read_only_action=False):
        return Response({"success": False, "message": "Permission denied to create opportunities."}, status=status.HTTP_403_FORBIDDEN)

    serializer = OpportunitySerializer(data=request.data, context={'request': request})
    if serializer.is_valid():
        opp = serializer.save()
        try:
            NotificationService.notify_new_opportunity_published(opp)
        except Exception:
            pass
        log_admin_action(request.user, f"Created opportunity {opp.title}", "OPPORTUNITIES", opp.id, opp.title, "", opp.status, request)
        return Response({"success": True, "message": "Opportunity created successfully.", "data": serializer.data}, status=status.HTTP_201_CREATED)
    return Response({"success": False, "message": "Validation error", "errors": serializer.errors}, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET', 'PUT', 'PATCH', 'DELETE'])
@permission_classes([IsAdminUserOrStaff])
def admin_opportunity_detail_action(request, pk):
    try:
        opp = Opportunity.objects.get(pk=pk)
    except Opportunity.DoesNotExist:
        return Response({"success": False, "message": "Opportunity not found."}, status=status.HTTP_404_NOT_FOUND)

    if request.method == 'GET':
        if not has_module_permission(request.user, 'OPPORTUNITIES', read_only_action=True):
            return Response({"success": False, "message": "Permission denied."}, status=status.HTTP_403_FORBIDDEN)
        serializer = OpportunitySerializer(opp, context={'request': request})
        return Response({"success": True, "data": serializer.data}, status=status.HTTP_200_OK)

    if request.method == 'DELETE':
        if not has_module_permission(request.user, 'OPPORTUNITIES', read_only_action=False):
            return Response({"success": False, "message": "Permission denied."}, status=status.HTTP_403_FORBIDDEN)
        
        # Check if referenced by applications before deletion
        app_count = OpportunityApplication.objects.filter(opportunity=opp).count()
        if app_count > 0:
            opp.status = 'CLOSED'
            opp.save()
            log_admin_action(request.user, f"Archived opportunity {opp.title} (had {app_count} applications)", "OPPORTUNITIES", opp.id, opp.title, "OPEN", "CLOSED", request)
            return Response({"success": True, "message": f"Opportunity has {app_count} existing applications. Safely archived/closed instead of hard deleting."}, status=status.HTTP_200_OK)

        title = opp.title
        opp.delete()
        log_admin_action(request.user, f"Deleted opportunity {title}", "OPPORTUNITIES", pk, title, "", "Deleted", request)
        return Response({"success": True, "message": "Opportunity deleted successfully."}, status=status.HTTP_200_OK)

    # PUT/PATCH - Update status or full record
    if not has_module_permission(request.user, 'OPPORTUNITIES', read_only_action=False):
        return Response({"success": False, "message": "Permission denied."}, status=status.HTTP_403_FORBIDDEN)

    prev_status = opp.status
    serializer = OpportunitySerializer(opp, data=request.data, partial=True, context={'request': request})
    if serializer.is_valid():
        updated_opp = serializer.save()
        log_admin_action(request.user, f"Updated opportunity {updated_opp.title}", "OPPORTUNITIES", updated_opp.id, updated_opp.title, prev_status, updated_opp.status, request)
        return Response({"success": True, "message": "Opportunity updated successfully.", "data": serializer.data}, status=status.HTTP_200_OK)
    return Response({"success": False, "message": "Validation error", "errors": serializer.errors}, status=status.HTTP_400_BAD_REQUEST)


# 4. APPLICATION MANAGEMENT
@api_view(['GET'])
@permission_classes([IsAdminUserOrStaff])
def admin_application_list(request):
    if not has_module_permission(request.user, 'APPLICATIONS', read_only_action=True):
        return Response({"success": False, "message": "Permission denied."}, status=status.HTTP_403_FORBIDDEN)

    queryset = OpportunityApplication.objects.all().select_related('user', 'opportunity', 'user__student_profile').order_by('-applied_at')

    search = request.GET.get('search', '').strip()
    if search:
        queryset = queryset.filter(
            Q(user__email__icontains=search) |
            Q(user__student_profile__full_name__icontains=search) |
            Q(opportunity__title__icontains=search)
        )

    status_filter = request.GET.get('status', '').strip()
    if status_filter and status_filter.lower() != 'all':
        queryset = queryset.filter(status__iexact=status_filter)

    opp_id = request.GET.get('opportunity_id', '').strip()
    if opp_id:
        queryset = queryset.filter(opportunity_id=opp_id)

    try:
        page = int(request.GET.get('page', 1))
        page_size = int(request.GET.get('page_size', 20))
    except ValueError:
        page = 1
        page_size = 20

    total_count = queryset.count()
    start = (page - 1) * page_size
    end = start + page_size
    paginated = queryset[start:end]

    serializer = OpportunityApplicationSerializer(paginated, many=True)
    return Response({
        "success": True,
        "total_count": total_count,
        "page": page,
        "page_size": page_size,
        "total_pages": (total_count + page_size - 1) // page_size if total_count > 0 else 1,
        "applications": serializer.data
    }, status=status.HTTP_200_OK)


@api_view(['PATCH'])
@permission_classes([IsAdminUserOrStaff])
def admin_application_update_status(request, pk):
    if not has_module_permission(request.user, 'APPLICATIONS', read_only_action=False):
        return Response({"success": False, "message": "Permission denied."}, status=status.HTTP_403_FORBIDDEN)

    try:
        app = OpportunityApplication.objects.select_related('user', 'opportunity').get(pk=pk)
    except OpportunityApplication.DoesNotExist:
        return Response({"success": False, "message": "Application not found."}, status=status.HTTP_404_NOT_FOUND)

    new_status = request.data.get('status', '').strip()
    if not new_status:
        return Response({"success": False, "message": "Status is required."}, status=status.HTTP_400_BAD_REQUEST)

    prev_status = app.status
    app.status = new_status
    app.save()

    # Phase 10 Notification
    try:
        NotificationService.notify_application_status_changed(app, prev_status)
    except Exception as notif_err:
        pass

    log_admin_action(
        request.user,
        f"Changed application status for {app.user.email} on {app.opportunity.title}",
        "APPLICATIONS",
        app.id,
        f"{app.user.email} -> {app.opportunity.title}",
        prev_status,
        new_status,
        request
    )

    return Response({
        "success": True,
        "message": f"Application status updated to {new_status}.",
        "data": OpportunityApplicationSerializer(app).data
    }, status=status.HTTP_200_OK)


# 5. EVENT MANAGEMENT
@api_view(['GET', 'POST'])
@permission_classes([IsAdminUserOrStaff])
def admin_event_list_create(request):
    if request.method == 'GET':
        if not has_module_permission(request.user, 'EVENTS', read_only_action=True):
            return Response({"success": False, "message": "Permission denied."}, status=status.HTTP_403_FORBIDDEN)

        queryset = Event.objects.all().order_by('-start_datetime')

        search = request.GET.get('search', '').strip()
        if search:
            queryset = queryset.filter(
                Q(title__icontains=search) |
                Q(organizer__icontains=search) |
                Q(category__icontains=search)
            )

        type_filter = request.GET.get('session_type', '').strip()
        if type_filter and type_filter.lower() != 'all':
            queryset = queryset.filter(session_type__iexact=type_filter)

        status_filter = request.GET.get('status', '').strip()
        if status_filter and status_filter.lower() != 'all':
            queryset = queryset.filter(status__iexact=status_filter)

        try:
            page = int(request.GET.get('page', 1))
            page_size = int(request.GET.get('page_size', 20))
        except ValueError:
            page = 1
            page_size = 20

        total_count = queryset.count()
        start = (page - 1) * page_size
        end = start + page_size
        paginated = queryset[start:end]

        serializer = EventSerializer(paginated, many=True, context={'request': request})
        return Response({
            "success": True,
            "total_count": total_count,
            "page": page,
            "page_size": page_size,
            "total_pages": (total_count + page_size - 1) // page_size if total_count > 0 else 1,
            "events": serializer.data
        }, status=status.HTTP_200_OK)

    # POST - Create
    if not has_module_permission(request.user, 'EVENTS', read_only_action=False):
        return Response({"success": False, "message": "Permission denied to create events."}, status=status.HTTP_403_FORBIDDEN)

    serializer = EventSerializer(data=request.data, context={'request': request})
    if serializer.is_valid():
        ev = serializer.save()
        try:
            NotificationService.notify_new_event_published(ev)
        except Exception:
            pass
        log_admin_action(request.user, f"Created event/session {ev.title}", "EVENTS", ev.id, ev.title, "", ev.status, request)
        return Response({"success": True, "message": "Event created successfully.", "data": serializer.data}, status=status.HTTP_201_CREATED)
    return Response({"success": False, "message": "Validation error", "errors": serializer.errors}, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET', 'PUT', 'PATCH', 'DELETE'])
@permission_classes([IsAdminUserOrStaff])
def admin_event_detail_action(request, pk):
    try:
        ev = Event.objects.get(pk=pk)
    except Event.DoesNotExist:
        return Response({"success": False, "message": "Event not found."}, status=status.HTTP_404_NOT_FOUND)

    if request.method == 'GET':
        if not has_module_permission(request.user, 'EVENTS', read_only_action=True):
            return Response({"success": False, "message": "Permission denied."}, status=status.HTTP_403_FORBIDDEN)
        serializer = EventSerializer(ev, context={'request': request})
        return Response({"success": True, "data": serializer.data}, status=status.HTTP_200_OK)

    if request.method == 'DELETE':
        if not has_module_permission(request.user, 'EVENTS', read_only_action=False):
            return Response({"success": False, "message": "Permission denied."}, status=status.HTTP_403_FORBIDDEN)
        
        reg_count = ev.get_registered_count()
        if reg_count > 0:
            ev.status = 'CANCELLED'
            ev.save()

            # Phase 10 Notification
            try:
                NotificationService.notify_session_cancelled(ev, reason="Schedule adjustment by administration")
            except Exception as notif_err:
                pass

            log_admin_action(request.user, f"Cancelled event {ev.title} (had {reg_count} registrations)", "EVENTS", ev.id, ev.title, "PUBLISHED", "CANCELLED", request)
            return Response({"success": True, "message": f"Event has {reg_count} registrations. Safely marked as CANCELLED instead of deleting."}, status=status.HTTP_200_OK)

        title = ev.title
        ev.delete()
        log_admin_action(request.user, f"Deleted event {title}", "EVENTS", pk, title, "", "Deleted", request)
        return Response({"success": True, "message": "Event deleted successfully."}, status=status.HTTP_200_OK)

    # Update
    if not has_module_permission(request.user, 'EVENTS', read_only_action=False):
        return Response({"success": False, "message": "Permission denied."}, status=status.HTTP_403_FORBIDDEN)

    prev_status = ev.status
    serializer = EventSerializer(ev, data=request.data, partial=True, context={'request': request})
    if serializer.is_valid():
        updated_ev = serializer.save()
        log_admin_action(request.user, f"Updated event {updated_ev.title}", "EVENTS", updated_ev.id, updated_ev.title, prev_status, updated_ev.status, request)
        return Response({"success": True, "message": "Event updated successfully.", "data": serializer.data}, status=status.HTTP_200_OK)
    return Response({"success": False, "message": "Validation error", "errors": serializer.errors}, status=status.HTTP_400_BAD_REQUEST)


# 6. VOLUNTEER MANAGEMENT
@api_view(['GET'])
@permission_classes([IsAdminUserOrStaff])
def admin_volunteer_list(request):
    if not has_module_permission(request.user, 'VOLUNTEERS', read_only_action=True):
        return Response({"success": False, "message": "Permission denied."}, status=status.HTTP_403_FORBIDDEN)

    queryset = VolunteerApplication.objects.all().select_related('user', 'event', 'role', 'user__student_profile').order_by('-applied_at')

    search = request.GET.get('search', '').strip()
    if search:
        queryset = queryset.filter(
            Q(user__email__icontains=search) |
            Q(user__student_profile__full_name__icontains=search) |
            Q(event__title__icontains=search) |
            Q(role__title__icontains=search)
        )

    status_filter = request.GET.get('status', '').strip()
    if status_filter and status_filter.lower() != 'all':
        queryset = queryset.filter(status__iexact=status_filter)

    try:
        page = int(request.GET.get('page', 1))
        page_size = int(request.GET.get('page_size', 20))
    except ValueError:
        page = 1
        page_size = 20

    total_count = queryset.count()
    start = (page - 1) * page_size
    end = start + page_size
    paginated = queryset[start:end]

    serializer = VolunteerApplicationSerializer(paginated, many=True)
    return Response({
        "success": True,
        "total_count": total_count,
        "page": page,
        "page_size": page_size,
        "total_pages": (total_count + page_size - 1) // page_size if total_count > 0 else 1,
        "volunteers": serializer.data
    }, status=status.HTTP_200_OK)


@api_view(['PATCH'])
@permission_classes([IsAdminUserOrStaff])
def admin_volunteer_update_status(request, pk):
    if not has_module_permission(request.user, 'VOLUNTEERS', read_only_action=False):
        return Response({"success": False, "message": "Permission denied."}, status=status.HTTP_403_FORBIDDEN)

    try:
        v_app = VolunteerApplication.objects.select_related('user', 'event', 'role').get(pk=pk)
    except VolunteerApplication.DoesNotExist:
        return Response({"success": False, "message": "Volunteer application not found."}, status=status.HTTP_404_NOT_FOUND)

    new_status = request.data.get('status', '').strip()
    if not new_status:
        return Response({"success": False, "message": "Status is required."}, status=status.HTTP_400_BAD_REQUEST)

    prev_status = v_app.status
    v_app.status = new_status
    v_app.save()

    # Phase 10 Notification
    try:
        NotificationService.notify_volunteer_status_changed(v_app, prev_status)
    except Exception as notif_err:
        pass

    log_admin_action(
        request.user,
        f"Updated volunteer status to {new_status} for {v_app.user.email} on {v_app.event.title}",
        "VOLUNTEERS",
        v_app.id,
        f"{v_app.user.email} -> {v_app.role.title}",
        prev_status,
        new_status,
        request
    )

    return Response({
        "success": True,
        "message": f"Volunteer application updated to {new_status}.",
        "data": VolunteerApplicationSerializer(v_app).data
    }, status=status.HTTP_200_OK)


# 7. SERVICE & ENQUIRY MANAGEMENT
@api_view(['GET', 'POST'])
@permission_classes([IsAdminUserOrStaff])
def admin_service_list_create(request):
    if request.method == 'GET':
        if not has_module_permission(request.user, 'SERVICES', read_only_action=True):
            return Response({"success": False, "message": "Permission denied."}, status=status.HTTP_403_FORBIDDEN)

        services = SSService.objects.all().order_by('order', 'title')
        serializer = SSServiceSerializer(services, many=True)
        return Response({"success": True, "services": serializer.data}, status=status.HTTP_200_OK)

    # POST - Create
    if not has_module_permission(request.user, 'SERVICES', read_only_action=False):
        return Response({"success": False, "message": "Permission denied."}, status=status.HTTP_403_FORBIDDEN)

    serializer = SSServiceSerializer(data=request.data)
    if serializer.is_valid():
        srv = serializer.save()
        log_admin_action(request.user, f"Created service {srv.title}", "SERVICES", srv.id, srv.title, "", "Active", request)
        return Response({"success": True, "message": "Service created successfully.", "data": serializer.data}, status=status.HTTP_201_CREATED)
    return Response({"success": False, "message": "Validation error", "errors": serializer.errors}, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET', 'PATCH', 'DELETE'])
@permission_classes([IsAdminUserOrStaff])
def admin_service_detail_action(request, pk):
    try:
        srv = SSService.objects.get(pk=pk)
    except SSService.DoesNotExist:
        return Response({"success": False, "message": "Service not found."}, status=status.HTTP_404_NOT_FOUND)

    if request.method == 'GET':
        return Response({"success": True, "data": SSServiceSerializer(srv).data}, status=status.HTTP_200_OK)

    if request.method == 'DELETE':
        if not has_module_permission(request.user, 'SERVICES', read_only_action=False):
            return Response({"success": False, "message": "Permission denied."}, status=status.HTTP_403_FORBIDDEN)
        title = srv.title
        srv.delete()
        log_admin_action(request.user, f"Deleted service {title}", "SERVICES", pk, title, "", "Deleted", request)
        return Response({"success": True, "message": "Service deleted successfully."}, status=status.HTTP_200_OK)

    if not has_module_permission(request.user, 'SERVICES', read_only_action=False):
        return Response({"success": False, "message": "Permission denied."}, status=status.HTTP_403_FORBIDDEN)

    serializer = SSServiceSerializer(srv, data=request.data, partial=True)
    if serializer.is_valid():
        updated_srv = serializer.save()
        log_admin_action(request.user, f"Updated service {updated_srv.title}", "SERVICES", updated_srv.id, updated_srv.title, "", "Updated", request)
        return Response({"success": True, "message": "Service updated successfully.", "data": serializer.data}, status=status.HTTP_200_OK)
    return Response({"success": False, "message": "Validation error", "errors": serializer.errors}, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
@permission_classes([IsAdminUserOrStaff])
def admin_enquiry_list(request):
    if not has_module_permission(request.user, 'ENQUIRIES', read_only_action=True):
        return Response({"success": False, "message": "Permission denied."}, status=status.HTTP_403_FORBIDDEN)

    queryset = ServiceEnquiry.objects.all().order_by('-created_at')

    search = request.GET.get('search', '').strip()
    if search:
        queryset = queryset.filter(
            Q(reference_number__icontains=search) |
            Q(full_name__icontains=search) |
            Q(email__icontains=search) |
            Q(service_name__icontains=search)
        )

    status_filter = request.GET.get('status', '').strip()
    if status_filter and status_filter.lower() != 'all':
        queryset = queryset.filter(status__iexact=status_filter)

    try:
        page = int(request.GET.get('page', 1))
        page_size = int(request.GET.get('page_size', 20))
    except ValueError:
        page = 1
        page_size = 20

    total_count = queryset.count()
    start = (page - 1) * page_size
    end = start + page_size
    paginated = queryset[start:end]

    serializer = ServiceEnquirySerializer(paginated, many=True)
    return Response({
        "success": True,
        "total_count": total_count,
        "page": page,
        "page_size": page_size,
        "total_pages": (total_count + page_size - 1) // page_size if total_count > 0 else 1,
        "enquiries": serializer.data
    }, status=status.HTTP_200_OK)


@api_view(['PATCH'])
@permission_classes([IsAdminUserOrStaff])
def admin_enquiry_update_status(request, pk):
    if not has_module_permission(request.user, 'ENQUIRIES', read_only_action=False):
        return Response({"success": False, "message": "Permission denied."}, status=status.HTTP_403_FORBIDDEN)

    try:
        enq = ServiceEnquiry.objects.get(pk=pk)
    except ServiceEnquiry.DoesNotExist:
        return Response({"success": False, "message": "Enquiry not found."}, status=status.HTTP_404_NOT_FOUND)

    new_status = request.data.get('status', enq.status).strip()
    prev_status = enq.status
    enq.status = new_status
    enq.save()

    log_admin_action(request.user, f"Updated enquiry {enq.reference_number} status to {new_status}", "ENQUIRIES", enq.id, enq.reference_number, prev_status, new_status, request)

    return Response({"success": True, "message": f"Enquiry status updated to {new_status}.", "data": ServiceEnquirySerializer(enq).data}, status=status.HTTP_200_OK)


# 8. SUPPORT MANAGEMENT
@api_view(['GET'])
@permission_classes([IsAdminUserOrStaff])
def admin_support_list(request):
    if not has_module_permission(request.user, 'SUPPORT', read_only_action=True):
        return Response({"success": False, "message": "Permission denied."}, status=status.HTTP_403_FORBIDDEN)

    queryset = SupportRequest.objects.all().select_related('user', 'user__student_profile').order_by('-created_at')

    search = request.GET.get('search', '').strip()
    if search:
        queryset = queryset.filter(
            Q(reference_number__icontains=search) |
            Q(subject__icontains=search) |
            Q(user__email__icontains=search) |
            Q(user__student_profile__full_name__icontains=search)
        )

    status_filter = request.GET.get('status', '').strip()
    if status_filter and status_filter.lower() != 'all':
        queryset = queryset.filter(status__iexact=status_filter)

    priority_filter = request.GET.get('priority', '').strip()
    if priority_filter and priority_filter.lower() != 'all':
        queryset = queryset.filter(priority__iexact=priority_filter)

    try:
        page = int(request.GET.get('page', 1))
        page_size = int(request.GET.get('page_size', 20))
    except ValueError:
        page = 1
        page_size = 20

    total_count = queryset.count()
    start = (page - 1) * page_size
    end = start + page_size
    paginated = queryset[start:end]

    serializer = SupportRequestSerializer(paginated, many=True)
    return Response({
        "success": True,
        "total_count": total_count,
        "page": page,
        "page_size": page_size,
        "total_pages": (total_count + page_size - 1) // page_size if total_count > 0 else 1,
        "requests": serializer.data
    }, status=status.HTTP_200_OK)


@api_view(['PATCH', 'POST'])
@permission_classes([IsAdminUserOrStaff])
def admin_support_action(request, pk):
    if not has_module_permission(request.user, 'SUPPORT', read_only_action=False):
        return Response({"success": False, "message": "Permission denied."}, status=status.HTTP_403_FORBIDDEN)

    try:
        s_req = SupportRequest.objects.get(pk=pk)
    except SupportRequest.DoesNotExist:
        return Response({"success": False, "message": "Support request not found."}, status=status.HTTP_404_NOT_FOUND)

    # POST - Add Staff Reply or Internal Note
    if request.method == 'POST':
        message = str(request.data.get('message', '')).strip()
        is_internal_note = request.data.get('is_internal_note', False)

        if not message:
            return Response({"success": False, "message": "Reply message is required."}, status=status.HTTP_400_BAD_REQUEST)

        # Distinguish internal notes from student-visible updates
        if not is_internal_note:
            s_req.status = 'IN_PROGRESS'
            s_req.save()

        update = SupportUpdate.objects.create(
            support_request=s_req,
            author=request.user,
            is_staff_reply=True,
            message=f"[INTERNAL NOTE] {message}" if is_internal_note else message
        )

        log_admin_action(request.user, f"Added {'internal note' if is_internal_note else 'staff reply'} to support request {s_req.reference_number}", "SUPPORT", s_req.id, s_req.reference_number, "", message[:100], request)
        return Response({"success": True, "message": "Support reply submitted.", "data": SupportUpdateSerializer(update).data}, status=status.HTTP_201_CREATED)

    # PATCH - Update priority / status
    prev_status = s_req.status
    new_status = request.data.get('status', s_req.status).strip()
    new_priority = request.data.get('priority', s_req.priority).strip()

    s_req.status = new_status
    s_req.priority = new_priority
    if new_status == 'RESOLVED' and not s_req.resolved_at:
        s_req.resolved_at = timezone.now()
    s_req.save()

    log_admin_action(request.user, f"Updated support request {s_req.reference_number} status to {new_status}", "SUPPORT", s_req.id, s_req.reference_number, prev_status, new_status, request)
    return Response({"success": True, "message": "Support request updated.", "data": SupportRequestSerializer(s_req).data}, status=status.HTTP_200_OK)


# 9. CENTRAL COMMUNITY MODERATION QUEUE
@api_view(['GET'])
@permission_classes([IsAdminUserOrStaff])
def admin_moderation_queue(request):
    if not has_module_permission(request.user, 'MODERATION', read_only_action=True):
        return Response({"success": False, "message": "Permission denied."}, status=status.HTTP_403_FORBIDDEN)

    module_type = request.GET.get('type', 'all').strip().lower()
    status_filter = request.GET.get('status', 'PENDING_REVIEW').strip()

    result = {
        "talents": [],
        "projects": [],
        "stories": [],
        "achievements": [],
        "testimonials": []
    }

    if module_type in ['all', 'talent']:
        t_qs = TalentProfile.objects.all().order_by('-created_at')
        if status_filter != 'all':
            t_qs = t_qs.filter(status=status_filter)
        result["talents"] = TalentProfileSerializer(t_qs[:50], many=True, context={'request': request}).data

    if module_type in ['all', 'project']:
        p_qs = StudentProject.objects.all().order_by('-created_at')
        if status_filter != 'all':
            p_qs = p_qs.filter(status=status_filter)
        result["projects"] = StudentProjectSerializer(p_qs[:50], many=True, context={'request': request}).data

    if module_type in ['all', 'story']:
        st_qs = StudentStory.objects.all().order_by('-created_at')
        if status_filter != 'all':
            st_qs = st_qs.filter(status=status_filter)
        result["stories"] = StudentStorySerializer(st_qs[:50], many=True, context={'request': request}).data

    if module_type in ['all', 'achievement']:
        ac_qs = StudentAchievement.objects.all().order_by('-created_at')
        if status_filter != 'all':
            ac_qs = ac_qs.filter(status=status_filter)
        result["achievements"] = StudentAchievementSerializer(ac_qs[:50], many=True).data

    if module_type in ['all', 'testimonial']:
        tm_qs = Testimonial.objects.all().order_by('-created_at')
        if status_filter != 'all':
            tm_qs = tm_qs.filter(verification_status=status_filter)
        result["testimonials"] = TestimonialSerializer(tm_qs[:50], many=True).data

    return Response({
        "success": True,
        "moderation_queue": result
    }, status=status.HTTP_200_OK)


@api_view(['POST'])
@permission_classes([IsAdminUserOrStaff])
def admin_moderation_action(request):
    if not has_module_permission(request.user, 'MODERATION', read_only_action=False):
        return Response({"success": False, "message": "Permission denied."}, status=status.HTTP_403_FORBIDDEN)

    content_type = request.data.get('content_type', '').strip().lower() # talent, project, story, achievement, testimonial
    record_id = request.data.get('record_id')
    new_status = request.data.get('status', '').strip() # PUBLISHED, REJECTED, ARCHIVED, APPROVED

    if not content_type or not record_id or not new_status:
        return Response({"success": False, "message": "content_type, record_id, and status are required."}, status=status.HTTP_400_BAD_REQUEST)

    target_repr = ""

    if content_type == 'talent':
        obj = TalentProfile.objects.get(pk=record_id)
        obj.status = new_status
        obj.save()
        target_repr = obj.title
    elif content_type == 'project':
        obj = StudentProject.objects.get(pk=record_id)
        obj.status = new_status
        obj.save()
        target_repr = obj.title
    elif content_type == 'story':
        obj = StudentStory.objects.get(pk=record_id)
        obj.status = new_status
        if new_status == 'PUBLISHED' and not obj.published_at:
            obj.published_at = timezone.now()
        obj.save()
        target_repr = obj.title
    elif content_type == 'achievement':
        obj = StudentAchievement.objects.get(pk=record_id)
        obj.status = new_status
        obj.save()
        target_repr = obj.title
    elif content_type == 'testimonial':
        obj = Testimonial.objects.get(pk=record_id)
        obj.verification_status = new_status
        obj.save()
        target_repr = f"Testimonial from {obj.author_name}"
    else:
        return Response({"success": False, "message": f"Unsupported content_type {content_type}."}, status=status.HTTP_400_BAD_REQUEST)

    log_admin_action(request.user, f"Moderated {content_type} '{target_repr}' to {new_status}", "MODERATION", record_id, target_repr, "PENDING_REVIEW", new_status, request)
    return Response({"success": True, "message": f"Content item updated to {new_status}."}, status=status.HTTP_200_OK)


# 10. PLACEMENTS, TEAM, PARTNERS, TESTIMONIALS, IMPACT
@api_view(['GET', 'POST'])
@permission_classes([IsAdminUserOrStaff])
def admin_placement_list_create(request):
    if request.method == 'GET':
        placements = Placement.objects.all().order_by('-created_at')
        serializer = PlacementSerializer(placements, many=True)
        return Response({"success": True, "placements": serializer.data}, status=status.HTTP_200_OK)

    if not has_module_permission(request.user, 'PLACEMENTS', read_only_action=False):
        return Response({"success": False, "message": "Permission denied."}, status=status.HTTP_403_FORBIDDEN)

    serializer = PlacementSerializer(data=request.data)
    if serializer.is_valid():
        plc = serializer.save()
        log_admin_action(request.user, f"Added placement record for {plc.company_name}", "PLACEMENTS", plc.id, plc.company_name, "", plc.verification_status, request)
        return Response({"success": True, "message": "Placement record created.", "data": serializer.data}, status=status.HTTP_201_CREATED)
    return Response({"success": False, "message": "Validation error", "errors": serializer.errors}, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET', 'PUT', 'PATCH', 'DELETE'])
@permission_classes([IsAdminUserOrStaff])
def admin_placement_detail_action(request, pk):
    try:
        plc = Placement.objects.get(pk=pk)
    except Placement.DoesNotExist:
        return Response({"success": False, "message": "Placement record not found."}, status=status.HTTP_404_NOT_FOUND)

    if request.method == 'GET':
        return Response({"success": True, "data": PlacementSerializer(plc).data}, status=status.HTTP_200_OK)

    if request.method == 'DELETE':
        if not has_module_permission(request.user, 'PLACEMENTS', read_only_action=False):
            return Response({"success": False, "message": "Permission denied."}, status=status.HTTP_403_FORBIDDEN)
        name = plc.company_name
        plc.delete()
        log_admin_action(request.user, f"Deleted placement record {name}", "PLACEMENTS", pk, name, "", "Deleted", request)
        return Response({"success": True, "message": "Placement record deleted."}, status=status.HTTP_200_OK)

    if not has_module_permission(request.user, 'PLACEMENTS', read_only_action=False):
        return Response({"success": False, "message": "Permission denied."}, status=status.HTTP_403_FORBIDDEN)

    serializer = PlacementSerializer(plc, data=request.data, partial=True)
    if serializer.is_valid():
        updated_plc = serializer.save()
        log_admin_action(request.user, f"Updated placement record {updated_plc.company_name}", "PLACEMENTS", updated_plc.id, updated_plc.company_name, "", updated_plc.verification_status, request)
        return Response({"success": True, "message": "Placement updated.", "data": serializer.data}, status=status.HTTP_200_OK)
    return Response({"success": False, "message": "Validation error", "errors": serializer.errors}, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET', 'POST'])
@permission_classes([IsAdminUserOrStaff])
def admin_team_list_create(request):
    if request.method == 'GET':
        members = TeamMember.objects.all().order_by('display_order', 'name')
        leadership = LeadershipMember.objects.all().order_by('display_order', 'name')
        return Response({
            "success": True,
            "team": TeamMemberSerializer(members, many=True).data,
            "leadership": LeadershipMemberSerializer(leadership, many=True).data
        }, status=status.HTTP_200_OK)

    if not has_module_permission(request.user, 'TEAM', read_only_action=False):
        return Response({"success": False, "message": "Permission denied."}, status=status.HTTP_403_FORBIDDEN)

    is_leadership = request.data.get('is_leadership', False)
    if is_leadership:
        serializer = LeadershipMemberSerializer(data=request.data)
        if serializer.is_valid():
            l_mb = serializer.save()
            log_admin_action(request.user, f"Created leadership member {l_mb.name}", "TEAM", l_mb.id, l_mb.name, "", l_mb.designation, request)
            return Response({"success": True, "message": "Leadership member created.", "data": serializer.data}, status=status.HTTP_201_CREATED)
    else:
        serializer = TeamMemberSerializer(data=request.data)
        if serializer.is_valid():
            mb = serializer.save()
            log_admin_action(request.user, f"Created team member {mb.name}", "TEAM", mb.id, mb.name, "", mb.role, request)
            return Response({"success": True, "message": "Team member created.", "data": serializer.data}, status=status.HTTP_201_CREATED)
    return Response({"success": False, "message": "Validation error", "errors": serializer.errors}, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET', 'POST'])
@permission_classes([IsAdminUserOrStaff])
def admin_partner_list_create(request):
    if request.method == 'GET':
        partners = Partner.objects.all().order_by('display_order', 'name')
        return Response({"success": True, "partners": PartnerSerializer(partners, many=True).data}, status=status.HTTP_200_OK)

    if not has_module_permission(request.user, 'PARTNERS', read_only_action=False):
        return Response({"success": False, "message": "Permission denied."}, status=status.HTTP_403_FORBIDDEN)

    serializer = PartnerSerializer(data=request.data)
    if serializer.is_valid():
        pt = serializer.save()
        log_admin_action(request.user, f"Created partner {pt.name}", "PARTNERS", pt.id, pt.name, "", pt.partnership_type, request)
        return Response({"success": True, "message": "Partner organization added.", "data": serializer.data}, status=status.HTTP_201_CREATED)
    return Response({"success": False, "message": "Validation error", "errors": serializer.errors}, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET', 'POST'])
@permission_classes([IsAdminUserOrStaff])
def admin_testimonial_list_create(request):
    if request.method == 'GET':
        testimonials = Testimonial.objects.all().order_by('-created_at')
        return Response({"success": True, "testimonials": TestimonialSerializer(testimonials, many=True).data}, status=status.HTTP_200_OK)

    if not has_module_permission(request.user, 'TESTIMONIALS', read_only_action=False):
        return Response({"success": False, "message": "Permission denied."}, status=status.HTTP_403_FORBIDDEN)

    serializer = TestimonialSerializer(data=request.data)
    if serializer.is_valid():
        tm = serializer.save()
        log_admin_action(request.user, f"Created testimonial from {tm.author_name}", "TESTIMONIALS", tm.id, tm.author_name, "", tm.verification_status, request)
        return Response({"success": True, "message": "Testimonial created.", "data": serializer.data}, status=status.HTTP_201_CREATED)
    return Response({"success": False, "message": "Validation error", "errors": serializer.errors}, status=status.HTTP_400_BAD_REQUEST)


# 11. ADMIN REPORTS
@api_view(['GET'])
@permission_classes([IsAdminUserOrStaff])
def admin_reports(request):
    if not has_module_permission(request.user, 'REPORTS', read_only_action=True):
        return Response({"success": False, "message": "Permission denied."}, status=status.HTTP_403_FORBIDDEN)

    days = int(request.GET.get('days', 30))
    start_date = timezone.now() - datetime.timedelta(days=days)

    user_growth = User.objects.filter(date_joined__gte=start_date).extra(select={'day': "date(date_joined)"}).values('day').annotate(count=Count('id')).order_by('day')
    applications = OpportunityApplication.objects.filter(applied_at__gte=start_date).extra(select={'day': "date(applied_at)"}).values('day').annotate(count=Count('id')).order_by('day')
    registrations = EventRegistration.objects.filter(registered_at__gte=start_date).extra(select={'day': "date(registered_at)"}).values('day').annotate(count=Count('id')).order_by('day')

    # Category breakdowns
    opp_categories = Opportunity.objects.values('category').annotate(count=Count('id')).order_by('-count')
    event_types = Event.objects.values('session_type').annotate(count=Count('id')).order_by('-count')
    support_categories = SupportRequest.objects.values('category').annotate(count=Count('id')).order_by('-count')

    return Response({
        "success": True,
        "days": days,
        "user_growth": list(user_growth),
        "applications_trend": list(applications),
        "registrations_trend": list(registrations),
        "opportunity_categories": list(opp_categories),
        "event_type_breakdown": list(event_types),
        "support_category_breakdown": list(support_categories)
    }, status=status.HTTP_200_OK)


# 12. AUDIT LOGS
@api_view(['GET'])
@permission_classes([IsAdminUserOrStaff])
def admin_audit_logs(request):
    # Only append-only viewable for authorized staff, Super Admin full
    if not has_module_permission(request.user, 'DASHBOARD', read_only_action=True):
        return Response({"success": False, "message": "Permission denied."}, status=status.HTTP_403_FORBIDDEN)

    queryset = AuditLog.objects.all().order_by('-created_at')

    module = request.GET.get('module', '').strip()
    if module and module.lower() != 'all':
        queryset = queryset.filter(module__iexact=module)

    search = request.GET.get('search', '').strip()
    if search:
        queryset = queryset.filter(
            Q(action__icontains=search) |
            Q(admin_name__icontains=search) |
            Q(record_repr__icontains=search)
        )

    try:
        page = int(request.GET.get('page', 1))
        page_size = int(request.GET.get('page_size', 25))
    except ValueError:
        page = 1
        page_size = 25

    total_count = queryset.count()
    start = (page - 1) * page_size
    end = start + page_size
    paginated = queryset[start:end]

    serializer = AuditLogSerializer(paginated, many=True)
    return Response({
        "success": True,
        "total_count": total_count,
        "page": page,
        "page_size": page_size,
        "total_pages": (total_count + page_size - 1) // page_size if total_count > 0 else 1,
        "logs": serializer.data
    }, status=status.HTTP_200_OK)


# 13. GLOBAL ADMIN SEARCH
@api_view(['GET'])
@permission_classes([IsAdminUserOrStaff])
def admin_global_search(request):
    query = request.GET.get('q', '').strip()
    if not query or len(query) < 2:
        return Response({"success": True, "results": {}}, status=status.HTTP_200_OK)

    results = {}
    user = request.user

    if has_module_permission(user, 'USERS', read_only_action=True):
        users = User.objects.filter(
            Q(email__icontains=query) | Q(first_name__icontains=query) | Q(student_profile__full_name__icontains=query)
        )[:5]
        results['users'] = AdminUserDetailSerializer(users, many=True).data

    if has_module_permission(user, 'OPPORTUNITIES', read_only_action=True):
        opps = Opportunity.objects.filter(Q(title__icontains=query) | Q(organization_name__icontains=query))[:5]
        results['opportunities'] = OpportunitySerializer(opps, many=True, context={'request': request}).data

    if has_module_permission(user, 'EVENTS', read_only_action=True):
        events = Event.objects.filter(Q(title__icontains=query) | Q(organizer__icontains=query))[:5]
        results['events'] = EventSerializer(events, many=True, context={'request': request}).data

    if has_module_permission(user, 'SUPPORT', read_only_action=True):
        support = SupportRequest.objects.filter(Q(reference_number__icontains=query) | Q(subject__icontains=query))[:5]
        results['support'] = SupportRequestSerializer(support, many=True).data

    if has_module_permission(user, 'ENQUIRIES', read_only_action=True):
        enquiries = ServiceEnquiry.objects.filter(Q(reference_number__icontains=query) | Q(full_name__icontains=query))[:5]
        results['enquiries'] = ServiceEnquirySerializer(enquiries, many=True).data

    return Response({"success": True, "query": query, "results": results}, status=status.HTTP_200_OK)


# 14. ADMIN PROFILE & SETTINGS
@api_view(['GET', 'PATCH'])
@permission_classes([IsAdminUserOrStaff])
def admin_site_settings(request):
    setting = SiteSetting.objects.first()
    if not setting:
        setting = SiteSetting.objects.create()

    if request.method == 'GET':
        return Response({"success": True, "data": SiteSettingSerializer(setting).data}, status=status.HTTP_200_OK)

    if not has_module_permission(request.user, 'SUPER_ADMIN', read_only_action=False) and get_user_admin_role(request.user) != 'ADMIN':
        return Response({"success": False, "message": "Only Administrators can modify platform settings."}, status=status.HTTP_403_FORBIDDEN)

    serializer = SiteSettingSerializer(setting, data=request.data, partial=True)
    if serializer.is_valid():
        updated_s = serializer.save()
        log_admin_action(request.user, "Updated site settings", "SETTINGS", updated_s.id, "SiteSetting", "", "Updated", request)
        return Response({"success": True, "message": "Site settings saved successfully.", "data": serializer.data}, status=status.HTTP_200_OK)
    return Response({"success": False, "message": "Validation error", "errors": serializer.errors}, status=status.HTTP_400_BAD_REQUEST)
