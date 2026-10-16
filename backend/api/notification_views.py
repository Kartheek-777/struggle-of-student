from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from rest_framework.response import Response
from rest_framework import status
from django.utils import timezone
from django.db.models import Count, Q
from django.shortcuts import get_object_or_404

from .models import Notification, NotificationPreference, EmailLog
from .serializers import NotificationSerializer, NotificationPreferenceSerializer, EmailLogSerializer
from .notification_service import NotificationService


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def list_notifications(request):
    """
    GET /api/notifications/
    Fetch notifications for the authenticated user with optional filter.
    Filter params: ?filter=all|unread|important|archived
    Security: User can ONLY see their own notifications derived from request.user.
    """
    user = request.user
    filter_type = request.query_params.get('filter', 'all')

    queryset = Notification.objects.filter(recipient=user)

    if filter_type == 'unread':
        queryset = queryset.filter(status='UNREAD')
    elif filter_type == 'important':
        queryset = queryset.filter(priority__in=['HIGH', 'URGENT'])
    elif filter_type == 'archived':
        queryset = queryset.filter(status='ARCHIVED')
    else:
        # 'all' excludes archived unless requested
        queryset = queryset.exclude(status='ARCHIVED')

    queryset = queryset.order_by('-created_at')[:50]
    serializer = NotificationSerializer(queryset, many=True)
    return Response(serializer.data)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def unread_count(request):
    """
    GET /api/notifications/unread-count/
    Returns count of unread notifications for current user.
    """
    count = Notification.objects.filter(recipient=request.user, status='UNREAD').count()
    return Response({'unread_count': count})


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def mark_notification_read(request, pk):
    """
    POST /api/notifications/<id>/read/
    Marks a specific notification as READ if owned by request.user.
    """
    notification = get_object_or_404(Notification, id=pk, recipient=request.user)
    if notification.status == 'UNREAD':
        notification.status = 'READ'
        notification.is_read = True
        notification.read_at = timezone.now()
        notification.save(update_fields=['status', 'is_read', 'read_at'])

    return Response({'message': 'Notification marked as read.', 'id': notification.id})


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def mark_all_notifications_read(request):
    """
    POST /api/notifications/read-all/
    Marks all unread notifications for current user as READ.
    """
    updated = Notification.objects.filter(recipient=request.user, status='UNREAD').update(
        status='READ',
        is_read=True,
        read_at=timezone.now()
    )
    return Response({'message': 'All notifications marked as read.', 'updated_count': updated})


@api_view(['GET', 'PUT', 'PATCH'])
@permission_classes([IsAuthenticated])
def notification_preferences(request):
    """
    GET/PUT/PATCH /api/notification-preferences/
    Manage student notification settings.
    """
    pref, _ = NotificationPreference.objects.get_or_create(user=request.user)

    if request.method == 'GET':
        serializer = NotificationPreferenceSerializer(pref)
        return Response(serializer.data)

    elif request.method in ['PUT', 'PATCH']:
        serializer = NotificationPreferenceSerializer(pref, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# ==========================================
# ADMIN COMMUNICATION APIS
# ==========================================

@api_view(['GET'])
@permission_classes([IsAuthenticated, IsAdminUser])
def admin_communications_dashboard(request):
    """
    GET /api/admin/communications/
    Overview dashboard metrics for admin communications.
    """
    total_emails = EmailLog.objects.count()
    sent_emails = EmailLog.objects.filter(status='SENT').count()
    failed_emails = EmailLog.objects.filter(status='FAILED').count()
    queued_emails = EmailLog.objects.filter(status__in=['QUEUED', 'SENDING', 'RETRYING']).count()

    recent_failures = EmailLog.objects.filter(status='FAILED').order_by('-created_at')[:10]
    recent_notifications = Notification.objects.select_related('recipient').order_by('-created_at')[:10]

    failure_serializer = EmailLogSerializer(recent_failures, many=True)
    notification_serializer = NotificationSerializer(recent_notifications, many=True)

    return Response({
        'stats': {
            'total_emails': total_emails,
            'sent_emails': sent_emails,
            'failed_emails': failed_emails,
            'queued_emails': queued_emails
        },
        'recent_failures': failure_serializer.data,
        'recent_notifications': notification_serializer.data
    })


@api_view(['GET'])
@permission_classes([IsAuthenticated, IsAdminUser])
def admin_email_logs(request):
    """
    GET /api/admin/email-logs/
    Filterable list of email logs.
    Query params: ?status=SENT|FAILED|QUEUED &channel=EMAIL &search=recipient/subject
    """
    logs = EmailLog.objects.all().order_by('-created_at')

    status_filter = request.query_params.get('status')
    if status_filter:
        logs = logs.filter(status=status_filter)

    channel_filter = request.query_params.get('channel')
    if channel_filter:
        logs = logs.filter(channel=channel_filter)

    type_filter = request.query_params.get('type')
    if type_filter:
        logs = logs.filter(email_type=type_filter)

    search = request.query_params.get('search')
    if search:
        logs = logs.filter(Q(recipient__email__icontains=search) | Q(subject__icontains=search))

    logs = logs[:100]
    serializer = EmailLogSerializer(logs, many=True)
    return Response(serializer.data)


@api_view(['POST'])
@permission_classes([IsAuthenticated, IsAdminUser])
def admin_retry_email(request, pk):
    """
    POST /api/admin/email-logs/<id>/retry/
    Allows admin to safely retry a failed email.
    """
    email_log = get_object_or_404(EmailLog, id=pk)

    if email_log.status == 'SENT':
        return Response({'message': 'This email has already been sent successfully.'}, status=status.HTTP_400_BAD_REQUEST)

    if email_log.attempt_count >= 5:
        return Response({'error': 'Maximum retry attempts (5) reached for this log.'}, status=status.HTTP_400_BAD_REQUEST)

    # Attempt retry
    success = NotificationService.retry_email_log(email_log)

    if success:
        return Response({'message': 'Email re-sent successfully.', 'status': 'SENT'})
    else:
        return Response({
            'message': 'Retry failed. Error logged.',
            'status': 'FAILED',
            'error_message': email_log.error_message
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
