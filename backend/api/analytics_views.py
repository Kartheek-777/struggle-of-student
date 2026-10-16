import csv
import datetime
from django.utils import timezone
from django.db.models import Count, Q, Avg
from django.db.models.functions import TruncDate
from django.http import HttpResponse
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from rest_framework.response import Response
from rest_framework import status

from .models import (
    User, StudentProfile, Opportunity, OpportunityApplication,
    Event, EventRegistration, VolunteerApplication, SSService,
    ServiceEnquiry, SupportRequest, Placement, StudentProject,
    TalentProfile, StudentStory, CommunityStat
)
from .permissions import IsAdminUserOrStaff, has_module_permission


def get_date_range(period_str, start_date_param=None, end_date_param=None):
    now = timezone.now()
    if period_str == '7d':
        start_date = now - datetime.timedelta(days=7)
    elif period_str == '30d':
        start_date = now - datetime.timedelta(days=30)
    elif period_str == '90d':
        start_date = now - datetime.timedelta(days=90)
    elif period_str == '6m':
        start_date = now - datetime.timedelta(days=180)
    elif period_str == '1y':
        start_date = now - datetime.timedelta(days=365)
    elif period_str == 'custom' and start_date_param and end_date_param:
        try:
            start_date = timezone.make_aware(datetime.datetime.strptime(start_date_param, '%Y-%m-%d'))
            now = timezone.make_aware(datetime.datetime.strptime(end_date_param, '%Y-%m-%d'))
        except ValueError:
            start_date = now - datetime.timedelta(days=30)
    else:
        start_date = now - datetime.timedelta(days=30)
    return start_date, now


@api_view(['GET'])
@permission_classes([IsAdminUserOrStaff])
def admin_analytics_overview(request):
    """
    GET /api/admin/analytics/
    Returns real database metrics aggregated over the selected period.
    Query params: ?period=7d|30d|90d|6m|1y|custom &start_date=YYYY-MM-DD &end_date=YYYY-MM-DD
    """
    if not has_module_permission(request.user, 'REPORTS', read_only_action=True):
        return Response({"success": False, "message": "Permission denied to view analytics."}, status=status.HTTP_403_FORBIDDEN)

    period = request.query_params.get('period', '30d')
    start_param = request.query_params.get('start_date')
    end_param = request.query_params.get('end_date')

    start_date, end_date = get_date_range(period, start_param, end_param)

    # 1. User & Student Metrics
    total_students = User.objects.filter(is_staff=False).count()
    new_registrations = User.objects.filter(is_staff=False, date_joined__gte=start_date, date_joined__lte=end_date).count()
    active_community_members = StudentProfile.objects.exclude(full_name='').count()

    # Daily student registration trend
    daily_registrations = list(
        User.objects.filter(is_staff=False, date_joined__gte=start_date, date_joined__lte=end_date)
        .annotate(date=TruncDate('date_joined'))
        .values('date')
        .annotate(count=Count('id'))
        .order_by('date')
    )
    daily_reg_map = {item['date'].strftime('%Y-%m-%d'): item['count'] for item in daily_registrations if item['date']}

    # 2. Opportunity & Application Metrics
    active_opportunities = Opportunity.objects.filter(status__in=['OPEN', 'CLOSING_SOON']).count()
    total_applications = OpportunityApplication.objects.count()
    period_applications = OpportunityApplication.objects.filter(applied_at__gte=start_date, applied_at__lte=end_date).count()
    shortlisted_apps = OpportunityApplication.objects.filter(status='SHORTLISTED').count()
    accepted_apps = OpportunityApplication.objects.filter(status='ACCEPTED').count()

    app_conversion_rate = round((accepted_apps / total_applications * 100), 1) if total_applications > 0 else 0.0

    # Application status breakdown
    app_status_breakdown = list(
        OpportunityApplication.objects.values('status')
        .annotate(count=Count('id'))
    )

    # 3. Events & Session Metrics
    upcoming_events = Event.objects.filter(event_type='EVENT', start_time__gte=timezone.now()).count()
    upcoming_sessions = Event.objects.filter(event_type__in=['SESSION', 'WORKSHOP'], start_time__gte=timezone.now()).count()

    total_event_regs = EventRegistration.objects.filter(status='REGISTERED').count()
    period_event_regs = EventRegistration.objects.filter(status='REGISTERED', registered_at__gte=start_date).count()
    attended_regs = EventRegistration.objects.filter(attended=True).count()

    attendance_rate = round((attended_regs / total_event_regs * 100), 1) if total_event_regs > 0 else 0.0

    # 4. Volunteer Metrics
    total_volunteers_applied = VolunteerApplication.objects.count()
    approved_volunteers = VolunteerApplication.objects.filter(status='APPROVED').count()

    # 5. Content Showcase Metrics
    submitted_projects = StudentProject.objects.count()
    approved_projects = StudentProject.objects.filter(is_approved=True).count()
    talent_submissions = TalentProfile.objects.filter(is_approved=True).count()

    # 6. Support & Enquiry Metrics
    total_support_requests = SupportRequest.objects.count()
    open_support_requests = SupportRequest.objects.filter(status__in=['OPEN', 'IN_PROGRESS']).count()
    service_enquiries_count = ServiceEnquiry.objects.count()

    # 7. Placement Impact Metrics
    placed_students_count = Placement.objects.filter(is_verified=True).count()
    placement_companies_count = Placement.objects.filter(is_verified=True).values('company_name').distinct().count()
    avg_package = Placement.objects.filter(is_verified=True).aggregate(Avg('package_lpa'))['package_lpa__avg'] or 0.0

    # Growth Chart Data Points (Last 7 intervals)
    chart_dates = []
    temp_d = start_date.date()
    end_d = end_date.date()
    step_days = max(1, (end_d - temp_d).days // 7)

    curr = temp_d
    while curr <= end_d:
        date_str = curr.strftime('%Y-%m-%d')
        chart_dates.append({
            'date': date_str,
            'registrations': daily_reg_map.get(date_str, 0),
            'applications': OpportunityApplication.objects.filter(applied_at__date=curr).count(),
            'event_registrations': EventRegistration.objects.filter(registered_at__date=curr).count()
        })
        curr += datetime.timedelta(days=step_days)

    return Response({
        "success": True,
        "period": period,
        "date_range": {
            "start": start_date.strftime('%Y-%m-%d'),
            "end": end_date.strftime('%Y-%m-%d')
        },
        "kpis": {
            "total_students": total_students,
            "new_registrations": new_registrations,
            "active_community_members": active_community_members,
            "active_opportunities": active_opportunities,
            "total_applications": total_applications,
            "period_applications": period_applications,
            "app_conversion_rate": app_conversion_rate,
            "upcoming_events": upcoming_events,
            "upcoming_sessions": upcoming_sessions,
            "event_registrations": total_event_regs,
            "attendance_rate": attendance_rate,
            "approved_volunteers": approved_volunteers,
            "approved_projects": approved_projects,
            "talent_submissions": talent_submissions,
            "total_support_requests": total_support_requests,
            "open_support_requests": open_support_requests,
            "service_enquiries": service_enquiries_count,
            "placed_students": placed_students_count,
            "placement_companies": placement_companies_count,
            "avg_package_lpa": round(avg_package, 2)
        },
        "breakdowns": {
            "application_status": app_status_breakdown,
        },
        "charts": {
            "timeline": chart_dates
        }
    }, status=status.HTTP_200_OK)


@api_view(['GET'])
@permission_classes([IsAdminUserOrStaff])
def export_analytics_csv(request):
    """
    GET /api/admin/analytics/export/
    Generates and downloads a CSV report of real SS database analytics.
    """
    if not has_module_permission(request.user, 'REPORTS', read_only_action=True):
        return Response({"success": False, "message": "Permission denied to export reports."}, status=status.HTTP_403_FORBIDDEN)

    response = HttpResponse(content_type='text/csv')
    response['Content-Disposition'] = f'attachment; filename="ss_analytics_report_{timezone.now().strftime("%Y%m%d_%H%M")}.csv"'

    writer = csv.writer(response)
    writer.writerow(['STRUGGLE OF STUDENT (SS) - PLATFORM ANALYTICS REPORT'])
    writer.writerow(['Generated At', timezone.now().strftime('%Y-%m-%d %H:%M:%S')])
    writer.writerow(['Generated By', request.user.email])
    writer.writerow([])

    writer.writerow(['METRIC CATEGORY', 'METRIC NAME', 'VALUE'])

    # Student Stats
    writer.writerow(['Students', 'Total Student Users', User.objects.filter(is_staff=False).count()])
    writer.writerow(['Students', 'Completed Profiles', StudentProfile.objects.exclude(full_name='').count()])
    writer.writerow(['Students', 'Ambassador Applications', User.objects.filter(ambassador_application__isnull=False).distinct().count()])

    # Opportunities & Applications
    writer.writerow(['Opportunities', 'Published Opportunities', Opportunity.objects.filter(status__in=['OPEN', 'CLOSING_SOON']).count()])
    writer.writerow(['Opportunities', 'Total Applications', OpportunityApplication.objects.count()])
    writer.writerow(['Opportunities', 'Under Review Applications', OpportunityApplication.objects.filter(status='UNDER_REVIEW').count()])
    writer.writerow(['Opportunities', 'Shortlisted Applications', OpportunityApplication.objects.filter(status='SHORTLISTED').count()])
    writer.writerow(['Opportunities', 'Accepted Applications', OpportunityApplication.objects.filter(status='ACCEPTED').count()])

    # Events & Sessions
    writer.writerow(['Events & Sessions', 'Total Published Events/Sessions', Event.objects.filter(is_published=True).count()])
    writer.writerow(['Events & Sessions', 'Total Registrations', EventRegistration.objects.filter(status='REGISTERED').count()])
    writer.writerow(['Events & Sessions', 'Verified Attendances', EventRegistration.objects.filter(attended=True).count()])

    # Volunteers
    writer.writerow(['Volunteers', 'Total Volunteer Applications', VolunteerApplication.objects.count()])
    writer.writerow(['Volunteers', 'Approved Volunteers', VolunteerApplication.objects.filter(status='APPROVED').count()])

    # Placements
    writer.writerow(['Placements', 'Verified Placed Students', Placement.objects.filter(is_verified=True).count()])

    # Support & Services
    writer.writerow(['Support & Enquiries', 'Total Support Tickets', SupportRequest.objects.count()])
    writer.writerow(['Support & Enquiries', 'Total Service Enquiries', ServiceEnquiry.objects.count()])

    return response
