from django.utils import timezone
from django.core.mail import EmailMultiAlternatives
from django.conf import settings
from django.db.models import Q
from django.contrib.auth.models import User

from .models import (
    Notification, NotificationPreference, EmailLog, ScheduledReminder,
    EventRegistration, VolunteerApplication, OpportunityApplication,
    SupportRequest, ServiceEnquiry, Event
)
from .email_templates import (
    render_welcome_email, render_application_received_email,
    render_application_status_email, render_event_confirmation_email,
    render_volunteer_status_email, render_support_received_email,
    render_session_cancelled_email
)
from .permissions import ADMIN_ROLES, ROLE_MODULE_PERMISSIONS


class NotificationService:
    @staticmethod
    def get_or_create_preference(user):
        pref, _ = NotificationPreference.objects.get_or_create(user=user)
        return pref

    @staticmethod
    def create_in_app_notification(recipient, title, message, notification_type='SYSTEM', priority='NORMAL', cta_url='', related_object_type='', related_object_id=''):
        if not recipient or not recipient.is_authenticated:
            return None

        # Check preferences for optional notification types
        pref = NotificationService.get_or_create_preference(recipient)
        if notification_type == 'OPPORTUNITY' and not pref.opportunity_alerts:
            return None
        if notification_type in ['EVENT', 'SESSION', 'WORKSHOP'] and not pref.event_updates and not pref.session_updates:
            return None
        if notification_type == 'APPLICATION' and not pref.application_updates:
            return None
        if notification_type == 'COMMUNITY' and not pref.community_updates:
            return None

        notif = Notification.objects.create(
            recipient=recipient,
            notification_type=notification_type,
            title=title,
            message=message,
            priority=priority,
            status='UNREAD',
            cta_url=cta_url,
            related_object_type=related_object_type,
            related_object_id=str(related_object_id)
        )
        return notif

    @staticmethod
    def send_email_notification(recipient_email, subject, body_html, template_name='general_email', recipient_user=None):
        if not recipient_email:
            return None

        # Check user email preference if provided
        if recipient_user:
            pref = NotificationService.get_or_create_preference(recipient_user)
            if not pref.email_enabled and template_name not in ['password_reset', 'application_status', 'session_cancelled']:
                # Optional email disabled by user preference
                return None

        log_entry = EmailLog.objects.create(
            recipient=recipient_user if (recipient_user and recipient_user.is_authenticated) else None,
            recipient_email=recipient_email,
            channel='EMAIL',
            template_name=template_name,
            subject=subject,
            status='SENDING',
            attempt_count=1
        )

        try:
            from_email = getattr(settings, 'DEFAULT_FROM_EMAIL', 'support@struggleofstudent.org')
            msg = EmailMultiAlternatives(
                subject=subject,
                body=subject, # Plain text fallback
                from_email=from_email,
                to=[recipient_email]
            )
            msg.attach_alternative(body_html, "text/html")
            
            # Send (fail_silently=True ensures user API requests never crash if SMTP server is down/unconfigured)
            sent = msg.send(fail_silently=True)
            
            if sent:
                log_entry.status = 'SENT'
                log_entry.sent_at = timezone.now()
            else:
                log_entry.status = 'FAILED'
                log_entry.error_message = "SMTP provider failed to send message or credentials not configured."
            log_entry.save()

        except Exception as e:
            log_entry.status = 'FAILED'
            log_entry.error_message = str(e)
            log_entry.save()

        return log_entry

    @staticmethod
    def notify_role_admins(required_modules, title, message, cta_url='', notification_type='SYSTEM'):
        """Dispatch in-app notifications to admins authorized for specific modules."""
        admin_users = User.objects.filter(
            Q(is_superuser=True) |
            Q(is_staff=True) |
            Q(student_profile__role__in=ADMIN_ROLES)
        ).distinct()

        for admin_usr in admin_users:
            prof = getattr(admin_usr, 'student_profile', None)
            role = 'SUPER_ADMIN' if admin_usr.is_superuser else (prof.role if (prof and prof.role in ADMIN_ROLES) else 'ADMIN')
            
            allowed = False
            if role in ['SUPER_ADMIN', 'ADMIN']:
                allowed = True
            else:
                user_mods = ROLE_MODULE_PERMISSIONS.get(role, [])
                if any(m in user_mods for m in required_modules):
                    allowed = True

            if allowed:
                NotificationService.create_in_app_notification(
                    recipient=admin_usr,
                    title=title,
                    message=message,
                    notification_type=notification_type,
                    priority='HIGH',
                    cta_url=cta_url
                )

    # DOMAIN EVENT HANDLERS

    @staticmethod
    def notify_welcome(user):
        if not user or not user.email:
            return
        prof = getattr(user, 'student_profile', None)
        user_name = prof.full_name if (prof and prof.full_name) else (user.get_full_name() or user.username)

        # In-App Notification
        NotificationService.create_in_app_notification(
            recipient=user,
            title="Welcome to Struggle of Student",
            message="Your SS community account is active! Explore opportunities, workshops, and student projects.",
            notification_type="SYSTEM",
            priority="NORMAL",
            cta_url="/student/dashboard"
        )

        # Email Notification
        subject, body_html = render_welcome_email(user_name)
        NotificationService.send_email_notification(
            recipient_email=user.email,
            subject=subject,
            body_html=body_html,
            template_name="welcome_email",
            recipient_user=user
        )

    @staticmethod
    def notify_application_created(app):
        if not app or not app.user:
            return
        user = app.user
        prof = getattr(user, 'student_profile', None)
        user_name = prof.full_name if (prof and prof.full_name) else (user.get_full_name() or user.username)
        opp_title = app.opportunity.title
        org_name = app.opportunity.organization_name
        applied_at_str = app.applied_at.strftime('%Y-%m-%d %H:%M')

        # Student In-App
        NotificationService.create_in_app_notification(
            recipient=user,
            title="Application Received",
            message=f"Your application for {opp_title} at {org_name} was received.",
            notification_type="APPLICATION",
            priority="NORMAL",
            cta_url="/student/applications",
            related_object_type="OpportunityApplication",
            related_object_id=app.id
        )

        # Student Email
        subject, body_html = render_application_received_email(user_name, opp_title, org_name, applied_at_str)
        NotificationService.send_email_notification(
            recipient_email=user.email,
            subject=subject,
            body_html=body_html,
            template_name="application_received",
            recipient_user=user
        )

        # Admin Alert
        NotificationService.notify_role_admins(
            required_modules=['OPPORTUNITIES', 'APPLICATIONS'],
            title="New Opportunity Application",
            message=f"{user_name} applied for {opp_title}.",
            cta_url="/admin/applications",
            notification_type="APPLICATION"
        )

    @staticmethod
    def notify_application_status_changed(app, old_status, new_status):
        if not app or not app.user or old_status == new_status:
            return
        user = app.user
        prof = getattr(user, 'student_profile', None)
        user_name = prof.full_name if (prof and prof.full_name) else (user.get_full_name() or user.username)
        opp_title = app.opportunity.title
        org_name = app.opportunity.organization_name

        # Student In-App
        NotificationService.create_in_app_notification(
            recipient=user,
            title="Application Status Updated",
            message=f"Your application for {opp_title} has moved to {new_status}.",
            notification_type="APPLICATION",
            priority="HIGH",
            cta_url="/student/applications",
            related_object_type="OpportunityApplication",
            related_object_id=app.id
        )

        # Student Email
        subject, body_html = render_application_status_email(user_name, opp_title, org_name, new_status)
        NotificationService.send_email_notification(
            recipient_email=user.email,
            subject=subject,
            body_html=body_html,
            template_name="application_status",
            recipient_user=user
        )

    @staticmethod
    def notify_event_registration(reg):
        if not reg or not reg.user:
            return
        user = reg.user
        event = reg.event
        prof = getattr(user, 'student_profile', None)
        user_name = prof.full_name if (prof and prof.full_name) else (user.get_full_name() or user.username)
        event_date_str = event.start_datetime.strftime('%A, %B %d, %Y at %I:%M %p')

        # Student In-App
        NotificationService.create_in_app_notification(
            recipient=user,
            title="Session Registration Confirmed",
            message=f"You are registered for {event.title} on {event_date_str}.",
            notification_type="SESSION" if event.session_type != 'EVENT' else "EVENT",
            priority="NORMAL",
            cta_url="/student/sessions",
            related_object_type="Event",
            related_object_id=event.id
        )

        # Student Email
        subject, body_html = render_event_confirmation_email(user_name, event.title, event_date_str, event.mode, event.location)
        NotificationService.send_email_notification(
            recipient_email=user.email,
            subject=subject,
            body_html=body_html,
            template_name="event_confirmation",
            recipient_user=user
        )

        # Admin Alert
        NotificationService.notify_role_admins(
            required_modules=['EVENTS', 'SESSIONS'],
            title="New Session Registration",
            message=f"{user_name} registered for {event.title}.",
            cta_url="/admin/events",
            notification_type="EVENT"
        )

    @staticmethod
    def notify_volunteer_status_changed(vol_app, old_status, new_status):
        if not vol_app or not vol_app.user or old_status == new_status:
            return
        user = vol_app.user
        prof = getattr(user, 'student_profile', None)
        user_name = prof.full_name if (prof and prof.full_name) else (user.get_full_name() or user.username)

        # Student In-App
        NotificationService.create_in_app_notification(
            recipient=user,
            title="Volunteer Status Updated",
            message=f"Your volunteer application for {vol_app.role.title} is now {new_status}.",
            notification_type="VOLUNTEER",
            priority="HIGH",
            cta_url="/student/volunteer-applications",
            related_object_type="VolunteerApplication",
            related_object_id=vol_app.id
        )

        # Student Email
        subject, body_html = render_volunteer_status_email(user_name, vol_app.event.title, vol_app.role.title, new_status)
        NotificationService.send_email_notification(
            recipient_email=user.email,
            subject=subject,
            body_html=body_html,
            template_name="volunteer_status",
            recipient_user=user
        )

    @staticmethod
    def notify_support_created(support_req):
        if not support_req or not support_req.user:
            return
        user = support_req.user
        prof = getattr(user, 'student_profile', None)
        user_name = prof.full_name if (prof and prof.full_name) else (user.get_full_name() or user.username)

        # Student In-App
        NotificationService.create_in_app_notification(
            recipient=user,
            title="Support Request Received",
            message=f"Your support ticket [{support_req.reference_number}] was created.",
            notification_type="SUPPORT",
            priority="NORMAL",
            cta_url=f"/student/support/{support_req.id}",
            related_object_type="SupportRequest",
            related_object_id=support_req.id
        )

        # Student Email
        subject, body_html = render_support_received_email(user_name, support_req.reference_number, support_req.subject, support_req.category)
        NotificationService.send_email_notification(
            recipient_email=user.email,
            subject=subject,
            body_html=body_html,
            template_name="support_received",
            recipient_user=user
        )

        # Admin Alert
        NotificationService.notify_role_admins(
            required_modules=['SUPPORT'],
            title="New Support Ticket",
            message=f"Ticket [{support_req.reference_number}] created by {user_name}: {support_req.subject}.",
            cta_url="/admin/support",
            notification_type="SUPPORT"
        )

    @staticmethod
    def notify_session_cancelled(event, reason=""):
        if not event:
            return
        regs = EventRegistration.objects.filter(event=event, status='REGISTERED').select_related('user')
        original_date_str = event.start_datetime.strftime('%A, %B %d, %Y at %I:%M %p')

        for reg in regs:
            user = reg.user
            prof = getattr(user, 'student_profile', None)
            user_name = prof.full_name if (prof and prof.full_name) else (user.get_full_name() or user.username)

            # In-App
            NotificationService.create_in_app_notification(
                recipient=user,
                title="Session Cancelled",
                message=f"The session '{event.title}' scheduled for {original_date_str} has been cancelled.",
                notification_type="SESSION",
                priority="HIGH",
                cta_url="/sessions",
                related_object_type="Event",
                related_object_id=event.id
            )

            # Email
            subject, body_html = render_session_cancelled_email(user_name, event.title, original_date_str, reason)
            NotificationService.send_email_notification(
                recipient_email=user.email,
                subject=subject,
                body_html=body_html,
                template_name="session_cancelled",
                recipient_user=user
            )

    @staticmethod
    def notify_new_opportunity_published(opp):
        if not opp:
            return
        users = User.objects.filter(is_active=True)
        notifications = [
            Notification(
                recipient=u,
                notification_type="OPPORTUNITY",
                title=f"New Opportunity: {opp.title}",
                message=f"{opp.organization_name} posted a new {opp.category} ({opp.location}). Check it out and apply!",
                priority="HIGH",
                status="UNREAD",
                cta_url=f"/opportunities/{opp.id}",
                related_object_type="Opportunity",
                related_object_id=str(opp.id)
            )
            for u in users
        ]
        Notification.objects.bulk_create(notifications, ignore_conflicts=True)

    @staticmethod
    def notify_new_event_published(event):
        if not event:
            return
        users = User.objects.filter(is_active=True)
        date_str = event.start_datetime.strftime('%b %d, %Y') if event.start_datetime else 'Upcoming'
        notifications = [
            Notification(
                recipient=u,
                notification_type="EVENT",
                title=f"New Event: {event.title}",
                message=f"Upcoming {event.category} on {date_str}. Slots open for registration!",
                priority="HIGH",
                status="UNREAD",
                cta_url=f"/events/{event.id}",
                related_object_type="Event",
                related_object_id=str(event.id)
            )
            for u in users
        ]
        Notification.objects.bulk_create(notifications, ignore_conflicts=True)
