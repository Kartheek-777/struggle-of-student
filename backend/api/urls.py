from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView
from . import views
from . import admin_views
from . import notification_views
from . import analytics_views
from . import search_views

urlpatterns = [
    # Health check
    path('', views.health_check, name='api_root'),
    path('health/', views.health_check, name='health_check'),

    # Phase 11 Analytics & Search APIs
    path('admin/analytics/', analytics_views.admin_analytics_overview, name='admin_analytics_overview'),
    path('admin/analytics/export/', analytics_views.export_analytics_csv, name='export_analytics_csv'),
    path('search/', search_views.unified_search, name='unified_search'),
    path('student/recommendations/', search_views.student_personalized_recommendations, name='student_personalized_recommendations'),
    path('saved-items/', search_views.student_saved_items, name='student_saved_items'),

    # Phase 10 Notifications & Communications


    # Phase 10 Notifications & Communications
    path('notifications/', notification_views.list_notifications, name='list_notifications'),
    path('notifications/unread-count/', notification_views.unread_count, name='unread_count'),
    path('notifications/<int:pk>/read/', notification_views.mark_notification_read, name='mark_notification_read'),
    path('notifications/read-all/', notification_views.mark_all_notifications_read, name='mark_all_notifications_read'),
    path('notification-preferences/', notification_views.notification_preferences, name='notification_preferences'),

    # Phase 10 Admin Communications APIs
    path('admin/communications/', notification_views.admin_communications_dashboard, name='admin_communications_dashboard'),
    path('admin/email-logs/', notification_views.admin_email_logs, name='admin_email_logs'),
    path('admin/email-logs/<int:pk>/retry/', notification_views.admin_retry_email, name='admin_retry_email'),


    # Phase 2 Authentication & JWT
    path('auth/register/', views.register_user, name='register_user'),
    path('auth/login/', views.login_user, name='login_user'),
    path('auth/social-login/', views.social_login_user, name='social_login_user'),
    path('auth/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('auth/me/', views.get_current_user, name='get_current_user'),

    # Student Profile Management & Resume
    path('profile/', views.student_profile_detail, name='student_profile_detail'),
    path('profile/photo/', views.upload_profile_photo, name='upload_profile_photo'),
    path('profile/photo/delete/', views.delete_profile_photo, name='delete_profile_photo'),
    path('profile/resume/', views.student_resume_view, name='student_resume_view'),

    # Phase 3 Opportunities Platform
    path('opportunities/', views.get_opportunities, name='get_opportunities'),
    path('opportunities/categories/', views.get_opportunity_categories, name='get_opportunity_categories'),
    path('opportunities/saved/', views.get_saved_opportunities, name='get_saved_opportunities'),
    path('opportunities/<int:pk>/', views.get_opportunity_detail, name='get_opportunity_detail'),
    path('opportunities/<int:pk>/save/', views.toggle_save_opportunity, name='toggle_save_opportunity'),
    path('opportunities/<int:pk>/apply/', views.apply_to_opportunity, name='apply_to_opportunity'),

    # Student Applications Tracker
    path('applications/', views.get_my_applications, name='get_my_applications'),
    path('applications/<int:pk>/', views.get_application_detail, name='get_application_detail'),

    # Metadata & Directories
    path('skills/', views.get_skills, name='get_skills'),
    path('interests/', views.get_interests, name='get_interests'),

    # Phase 4 Events & Volunteer Platform
    path('events/', views.get_events, name='get_events'),
    path('events/categories/', views.get_event_categories, name='get_event_categories'),
    path('events/<int:pk>/', views.get_event_detail, name='get_event_detail'),
    path('events/<int:pk>/register/', views.register_for_event, name='register_for_event'),
    path('events/<int:pk>/cancel-registration/', views.cancel_event_registration, name='cancel_event_registration'),
    path('events/<int:pk>/volunteer/apply/', views.apply_for_volunteer_role, name='apply_for_volunteer_role'),

    # Phase 8 Online Sessions, Workshops, Waitlist & Feedback
    path('sessions/', views.get_events, name='get_sessions'),
    path('sessions/speakers/', views.get_session_speakers, name='get_session_speakers'),
    path('sessions/<int:pk>/', views.get_event_detail, name='get_session_detail'),
    path('sessions/<int:pk>/register/', views.register_for_event, name='register_session'),
    path('sessions/<int:pk>/cancel-registration/', views.cancel_event_registration, name='cancel_session_registration'),
    path('sessions/<int:pk>/waitlist/', views.join_session_waitlist, name='join_session_waitlist'),
    path('sessions/<int:pk>/cancel-waitlist/', views.cancel_session_waitlist, name='cancel_session_waitlist'),
    path('sessions/<int:pk>/feedback/', views.submit_session_feedback, name='submit_session_feedback'),
    
    path('student/sessions/', views.get_student_sessions, name='get_student_sessions'),
    path('student/sessions/<int:pk>/', views.get_student_session_detail, name='get_student_session_detail'),
    path('staff/sessions/<int:pk>/create-zoom/', views.staff_create_zoom_meeting, name='staff_create_zoom_meeting'),
    
    # Volunteer Applications & Withdrawals
    path('volunteer-applications/<int:pk>/withdraw/', views.withdraw_volunteer_application, name='withdraw_volunteer_application'),
    
    # Student Event & Volunteer Hub
    path('student/events/', views.get_student_events, name='get_student_events'),
    path('student/volunteer-applications/', views.get_student_volunteer_applications, name='get_student_volunteer_applications'),
    path('student/stats/', views.get_student_dashboard_stats, name='get_student_dashboard_stats'),

    # Phase 5 Community & Student Showcase Platform
    path('talent/', views.get_talents, name='get_talents'),
    path('talent/categories/', views.get_talent_categories, name='get_talent_categories'),
    path('talent/<int:pk>/', views.get_talent_detail, name='get_talent_detail'),
    path('student/talent/', views.student_talent_list_create, name='student_talent_list_create'),
    path('student/talent/<int:pk>/', views.student_talent_detail_update_delete, name='student_talent_detail_update_delete'),

    path('projects/', views.get_projects, name='get_projects'),
    path('projects/categories/', views.get_project_categories, name='get_project_categories'),
    path('projects/<int:pk>/', views.get_project_detail, name='get_project_detail'),
    path('student/projects/', views.student_project_list_create, name='student_project_list_create'),
    path('student/projects/<int:pk>/', views.student_project_detail_update_delete, name='student_project_detail_update_delete'),

    path('stories/', views.get_stories, name='get_stories'),
    path('stories/categories/', views.get_story_categories, name='get_story_categories'),
    path('stories/<int:pk>/', views.get_story_detail, name='get_story_detail'),
    path('student/stories/', views.student_story_list_create, name='student_story_list_create'),

    path('leadership/roles/', views.get_leadership_opportunities, name='get_leadership_opportunities'),
    path('leadership/<int:pk>/apply/', views.apply_leadership_opportunity, name='apply_leadership_opportunity'),
    path('campus-ambassador/apply/', views.apply_campus_ambassador, name='apply_campus_ambassador'),
    path('student/campus-ambassador-application/', views.get_student_ambassador_application, name='get_student_ambassador_application'),

    path('community/', views.get_community_members, name='get_community_members'),
    path('community/stats/', views.get_community_stats, name='get_community_stats'),
    path('community/<int:pk>/', views.get_community_member_detail, name='get_community_member_detail'),

    path('achievements/', views.get_achievements, name='get_achievements'),
    path('student/achievements/', views.student_achievement_list_create, name='student_achievement_list_create'),
    path('student/achievements/<int:pk>/', views.update_student_achievement, name='update_student_achievement'),

    # Phase 6 Services, Guidance, Support, Enquiries & Contact
    path('services/categories/', views.get_service_categories, name='get_service_categories'),
    path('services/faqs/', views.get_service_faqs, name='get_service_faqs'),
    path('services/<str:slug>/faqs/', views.get_service_faqs, name='get_service_slug_faqs'),
    path('services/enquire/', views.create_service_enquiry, name='create_general_service_enquiry'),
    path('services/<str:slug>/enquire/', views.create_service_enquiry, name='create_service_enquiry'),
    path('services/<str:slug>/', views.get_service_detail, name='get_service_detail'),
    
    path('student/enquiries/', views.get_student_enquiries, name='get_student_enquiries'),
    path('student/enquiries/<int:pk>/', views.get_student_enquiry_detail, name='get_student_enquiry_detail'),

    path('support/', views.create_support_request, name='create_support_request'),
    path('student/support/', views.get_student_support_requests, name='get_student_support_requests'),
    path('student/support/<str:pk>/', views.get_student_support_detail, name='get_student_support_detail'),
    path('student/support/<str:pk>/update/', views.add_support_update, name='add_support_update'),

    path('contact/', views.submit_contact_message, name='submit_contact_message'),

    # Phase 7 Identity & Impact Endpoints
    path('about/', views.get_about_section, name='get_about_section'),
    path('leadership/', views.get_leadership_list, name='get_leadership_list'),
    path('leadership/<int:pk>/', views.get_leadership_detail, name='get_leadership_detail'),
    path('team/', views.get_team_list, name='get_team_list'),
    path('team/<int:pk>/', views.get_team_detail, name='get_team_detail'),
    path('placements/', views.get_placements_list, name='get_placements_list'),
    path('placements/<int:pk>/', views.get_placement_detail, name='get_placement_detail'),
    path('success-stories/', views.get_success_stories_list, name='get_success_stories_list'),
    path('success-stories/<int:pk>/', views.get_success_story_detail, name='get_success_story_detail'),
    path('testimonials/', views.get_testimonials_list, name='get_testimonials_list'),
    path('partners/', views.get_partners_list, name='get_partners_list'),
    path('impact/', views.get_impact_data, name='get_impact_data'),
    path('impact/statistics/', views.get_impact_statistics, name='get_impact_statistics'),

    # Phase 1 Data Endpoints
    path('services/', views.get_services, name='get_services'),
    path('stats/', views.get_stats, name='get_stats'),

    # ==========================================
    # PHASE 9: ADMIN & OPERATIONS PLATFORM API
    # ==========================================
    path('admin/dashboard/', admin_views.admin_dashboard_overview, name='admin_dashboard_overview'),
    path('admin/users/', admin_views.admin_user_list, name='admin_user_list'),
    path('admin/users/<int:pk>/', admin_views.admin_user_detail, name='admin_user_detail'),
    path('admin/users/<int:pk>/action/', admin_views.admin_user_action, name='admin_user_action'),
    
    path('admin/opportunities/', admin_views.admin_opportunity_list_create, name='admin_opportunity_list_create'),
    path('admin/opportunities/<int:pk>/', admin_views.admin_opportunity_detail_action, name='admin_opportunity_detail_action'),
    
    path('admin/applications/', admin_views.admin_application_list, name='admin_application_list'),
    path('admin/applications/<int:pk>/status/', admin_views.admin_application_update_status, name='admin_application_update_status'),
    
    path('admin/events/', admin_views.admin_event_list_create, name='admin_event_list_create'),
    path('admin/events/<int:pk>/', admin_views.admin_event_detail_action, name='admin_event_detail_action'),
    
    path('admin/volunteers/', admin_views.admin_volunteer_list, name='admin_volunteer_list'),
    path('admin/volunteers/<int:pk>/status/', admin_views.admin_volunteer_update_status, name='admin_volunteer_update_status'),
    
    path('admin/services/', admin_views.admin_service_list_create, name='admin_service_list_create'),
    path('admin/services/<int:pk>/', admin_views.admin_service_detail_action, name='admin_service_detail_action'),
    
    path('admin/enquiries/', admin_views.admin_enquiry_list, name='admin_enquiry_list'),
    path('admin/enquiries/<int:pk>/status/', admin_views.admin_enquiry_update_status, name='admin_enquiry_update_status'),
    
    path('admin/support/', admin_views.admin_support_list, name='admin_support_list'),
    path('admin/support/<int:pk>/action/', admin_views.admin_support_action, name='admin_support_action'),
    
    path('admin/moderation/', admin_views.admin_moderation_queue, name='admin_moderation_queue'),
    path('admin/moderation/action/', admin_views.admin_moderation_action, name='admin_moderation_action'),
    
    path('admin/placements/', admin_views.admin_placement_list_create, name='admin_placement_list_create'),
    path('admin/placements/<int:pk>/', admin_views.admin_placement_detail_action, name='admin_placement_detail_action'),
    
    path('admin/team/', admin_views.admin_team_list_create, name='admin_team_list_create'),
    path('admin/partners/', admin_views.admin_partner_list_create, name='admin_partner_list_create'),
    path('admin/testimonials/', admin_views.admin_testimonial_list_create, name='admin_testimonial_list_create'),
    
    path('admin/reports/', admin_views.admin_reports, name='admin_reports'),
    path('admin/audit-logs/', admin_views.admin_audit_logs, name='admin_audit_logs'),
    path('admin/search/', admin_views.admin_global_search, name='admin_global_search'),
    path('admin/settings/', admin_views.admin_site_settings, name='admin_site_settings'),
]


