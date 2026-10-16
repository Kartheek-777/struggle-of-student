from django.contrib import admin
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

@admin.register(SessionSpeaker)
class SessionSpeakerAdmin(admin.ModelAdmin):
    list_display = ('name', 'designation', 'organization', 'linkedin_url', 'created_at')
    search_fields = ('name', 'designation', 'organization', 'bio')

@admin.register(MeetingInfo)
class MeetingInfoAdmin(admin.ModelAdmin):
    list_display = ('event', 'provider', 'external_meeting_id', 'status', 'created_at')
    search_fields = ('event__title', 'external_meeting_id', 'provider')
    list_filter = ('provider', 'status')

@admin.register(WaitlistEntry)
class WaitlistEntryAdmin(admin.ModelAdmin):
    list_display = ('event', 'user', 'position', 'status', 'created_at')
    search_fields = ('event__title', 'user__email')
    list_filter = ('status',)

@admin.register(SessionFeedback)
class SessionFeedbackAdmin(admin.ModelAdmin):
    list_display = ('event', 'user', 'rating', 'would_recommend', 'created_at')
    search_fields = ('event__title', 'user__email', 'what_did_you_learn', 'suggestions')
    list_filter = ('rating', 'would_recommend')

@admin.register(StudentProfile)
class StudentProfileAdmin(admin.ModelAdmin):
    list_display = ('full_name', 'user', 'college', 'course', 'graduation_year', 'created_at')
    search_fields = ('full_name', 'user__email', 'college', 'city')
    list_filter = ('role', 'graduation_year')

@admin.register(StudentResume)
class StudentResumeAdmin(admin.ModelAdmin):
    list_display = ('user', 'original_filename', 'uploaded_at')

@admin.register(Skill)
class SkillAdmin(admin.ModelAdmin):
    list_display = ('name', 'category')
    search_fields = ('name',)

@admin.register(Interest)
class InterestAdmin(admin.ModelAdmin):
    list_display = ('name',)
    search_fields = ('name',)

@admin.register(OpportunityCategory)
class OpportunityCategoryAdmin(admin.ModelAdmin):
    list_display = ('name', 'slug')

@admin.register(Opportunity)
class OpportunityAdmin(admin.ModelAdmin):
    list_display = ('title', 'organization_name', 'category', 'mode', 'status', 'application_deadline', 'is_featured')
    search_fields = ('title', 'organization_name', 'description')
    list_filter = ('category', 'mode', 'status', 'is_featured')

@admin.register(SavedOpportunity)
class SavedOpportunityAdmin(admin.ModelAdmin):
    list_display = ('user', 'opportunity', 'saved_at')

@admin.register(OpportunityApplication)
class OpportunityApplicationAdmin(admin.ModelAdmin):
    list_display = ('user', 'opportunity', 'status', 'applied_at')
    list_filter = ('status',)

@admin.register(EventCategory)
class EventCategoryAdmin(admin.ModelAdmin):
    list_display = ('name', 'slug')

class VolunteerRoleInline(admin.TabularInline):
    model = VolunteerRole
    extra = 1

@admin.register(Event)
class EventAdmin(admin.ModelAdmin):
    list_display = ('title', 'category', 'mode', 'location', 'start_datetime', 'participant_capacity', 'volunteer_capacity', 'status', 'is_published', 'is_featured')
    search_fields = ('title', 'description', 'organizer', 'location')
    list_filter = ('category', 'mode', 'status', 'is_published', 'is_featured')
    inlines = [VolunteerRoleInline]

@admin.register(EventRegistration)
class EventRegistrationAdmin(admin.ModelAdmin):
    list_display = ('event', 'user', 'status', 'registered_at', 'cancelled_at')
    search_fields = ('event__title', 'user__email', 'user__student_profile__full_name')
    list_filter = ('status',)

@admin.register(VolunteerRole)
class VolunteerRoleAdmin(admin.ModelAdmin):
    list_display = ('title', 'event', 'capacity')
    search_fields = ('title', 'event__title')

@admin.register(VolunteerApplication)
class VolunteerApplicationAdmin(admin.ModelAdmin):
    list_display = ('event', 'role', 'user', 'status', 'applied_at')
    search_fields = ('event__title', 'role__title', 'user__email')
    list_filter = ('status',)

@admin.register(TalentProfile)
class TalentProfileAdmin(admin.ModelAdmin):
    list_display = ('title', 'user', 'category', 'status', 'created_at')
    search_fields = ('title', 'user__email', 'user__student_profile__full_name')
    list_filter = ('status', 'category')

@admin.register(StudentProject)
class StudentProjectAdmin(admin.ModelAdmin):
    list_display = ('title', 'user', 'category', 'project_stage', 'status', 'created_at')
    search_fields = ('title', 'technologies', 'user__email')
    list_filter = ('status', 'project_stage', 'category')

@admin.register(StudentStory)
class StudentStoryAdmin(admin.ModelAdmin):
    list_display = ('title', 'user', 'category', 'status', 'created_at')
    search_fields = ('title', 'excerpt', 'user__email')
    list_filter = ('status', 'category')

@admin.register(CampusAmbassadorApplication)
class CampusAmbassadorApplicationAdmin(admin.ModelAdmin):
    list_display = ('user', 'college', 'campus_location', 'status', 'applied_at')
    search_fields = ('user__email', 'college', 'campus_location')
    list_filter = ('status',)

@admin.register(StudentAchievement)
class StudentAchievementAdmin(admin.ModelAdmin):
    list_display = ('title', 'user', 'organization', 'status', 'date_achieved')
    search_fields = ('title', 'organization', 'user__email')
    list_filter = ('status', 'category')

class ServiceFAQInline(admin.TabularInline):
    model = ServiceFAQ
    extra = 1

class ServicePortfolioItemInline(admin.TabularInline):
    model = ServicePortfolioItem
    extra = 1

@admin.register(SSService)
class SSServiceAdmin(admin.ModelAdmin):
    list_display = ('title', 'category', 'slug', 'is_active', 'is_featured', 'order')
    search_fields = ('title', 'description', 'category')
    list_filter = ('category', 'is_active', 'is_featured')
    inlines = [ServiceFAQInline, ServicePortfolioItemInline]

@admin.register(ServiceCategory)
class ServiceCategoryAdmin(admin.ModelAdmin):
    list_display = ('name', 'slug', 'icon_name', 'order')
    search_fields = ('name',)

@admin.register(ServiceEnquiry)
class ServiceEnquiryAdmin(admin.ModelAdmin):
    list_display = ('reference_number', 'full_name', 'email', 'service_name', 'enquiry_type', 'status', 'created_at')
    search_fields = ('reference_number', 'full_name', 'email', 'requirement', 'service_name')
    list_filter = ('status', 'enquiry_type', 'created_at')

class SupportUpdateInline(admin.TabularInline):
    model = SupportUpdate
    extra = 1

@admin.register(SupportRequest)
class SupportRequestAdmin(admin.ModelAdmin):
    list_display = ('reference_number', 'user', 'category', 'subject', 'status', 'priority', 'created_at')
    search_fields = ('reference_number', 'subject', 'description', 'user__email')
    list_filter = ('status', 'priority', 'category')
    inlines = [SupportUpdateInline]

@admin.register(SupportUpdate)
class SupportUpdateAdmin(admin.ModelAdmin):
    list_display = ('support_request', 'author', 'is_staff_reply', 'created_at')
    search_fields = ('message', 'author__email')

@admin.register(ContactMessage)
class ContactMessageAdmin(admin.ModelAdmin):
    list_display = ('name', 'email', 'subject', 'status', 'created_at')
    search_fields = ('name', 'email', 'subject', 'message')
    list_filter = ('status', 'created_at')

@admin.register(CommunityStat)
class CommunityStatAdmin(admin.ModelAdmin):
    list_display = ('label', 'value', 'description')


# PHASE 7 ADMIN REGISTRATIONS

@admin.register(AboutSection)
class AboutSectionAdmin(admin.ModelAdmin):
    list_display = ('title', 'updated_at')

@admin.register(LeadershipMember)
class LeadershipMemberAdmin(admin.ModelAdmin):
    list_display = ('name', 'designation', 'leadership_type', 'display_order', 'status', 'created_at')
    search_fields = ('name', 'designation', 'bio', 'area_of_responsibility')
    list_filter = ('leadership_type', 'status')

@admin.register(TeamMember)
class TeamMemberAdmin(admin.ModelAdmin):
    list_display = ('name', 'role', 'department', 'display_order', 'status', 'joined_date')
    search_fields = ('name', 'role', 'department', 'skills', 'bio')
    list_filter = ('department', 'status')

@admin.register(Placement)
class PlacementAdmin(admin.ModelAdmin):
    list_display = ('company_name', 'number_of_students', 'roles', 'placement_year', 'verification_status', 'visibility', 'student_names_visibility')
    search_fields = ('company_name', 'roles', 'description', 'student_names')
    list_filter = ('verification_status', 'visibility', 'placement_year', 'student_names_visibility')

@admin.register(SuccessStory)
class SuccessStoryAdmin(admin.ModelAdmin):
    list_display = ('title', 'student_name', 'category', 'company', 'verification_status', 'is_anonymous', 'created_at')
    search_fields = ('title', 'student_name', 'company', 'outcome', 'story')
    list_filter = ('verification_status', 'category', 'is_anonymous')

@admin.register(Partner)
class PartnerAdmin(admin.ModelAdmin):
    list_display = ('name', 'partnership_type', 'display_order', 'status', 'created_at')
    search_fields = ('name', 'description', 'website')
    list_filter = ('partnership_type', 'status')

@admin.register(Testimonial)
class TestimonialAdmin(admin.ModelAdmin):
    list_display = ('author_name', 'role', 'organization', 'verification_status', 'visibility', 'created_at')
    search_fields = ('author_name', 'role', 'organization', 'message')
    list_filter = ('verification_status', 'visibility', 'category')

@admin.register(OrganizationMilestone)
class OrganizationMilestoneAdmin(admin.ModelAdmin):
    list_display = ('year', 'title', 'category', 'display_order')
    search_fields = ('year', 'title', 'description')
    list_filter = ('category', 'year')

@admin.register(ImpactMetric)
class ImpactMetricAdmin(admin.ModelAdmin):
    list_display = ('name', 'value', 'category', 'display_order', 'is_active')
    search_fields = ('name', 'value', 'description')
    list_filter = ('category', 'is_active')



