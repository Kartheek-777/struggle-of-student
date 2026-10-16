from rest_framework import serializers
from django.contrib.auth.models import User
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
    SessionSpeaker, MeetingInfo, WaitlistEntry, SessionFeedback,
    AuditLog, ContentRevision, SiteSetting,
    Notification, NotificationPreference, EmailLog, ScheduledReminder
)


class SkillSerializer(serializers.ModelSerializer):
    class Meta:
        model = Skill
        fields = ['id', 'name', 'category']


class InterestSerializer(serializers.ModelSerializer):
    class Meta:
        model = Interest
        fields = ['id', 'name']


class StudentResumeSerializer(serializers.ModelSerializer):
    class Meta:
        model = StudentResume
        fields = ['id', 'resume_file', 'original_filename', 'uploaded_at']


class StudentProfileSerializer(serializers.ModelSerializer):
    email = serializers.EmailField(source='user.email', read_only=True)
    skills = SkillSerializer(many=True, read_only=True)
    interests = InterestSerializer(many=True, read_only=True)
    completion_percentage = serializers.SerializerMethodField()
    profile_photo = serializers.SerializerMethodField()

    class Meta:
        model = StudentProfile
        fields = [
            'id', 'full_name', 'email', 'phone_number', 'college', 'course', 
            'graduation_year', 'city', 'bio', 'profile_photo', 'linkedin_url', 
            'github_url', 'portfolio_url', 'skills', 'interests',
            'role', 'completion_percentage', 'created_at', 'updated_at'
        ]
        read_only_fields = ['role', 'created_at', 'updated_at']

    def get_completion_percentage(self, obj):
        return obj.calculate_completion()

    def get_profile_photo(self, obj):
        if obj.profile_photo:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.profile_photo.url)
            return obj.profile_photo.url
        return None


class RegisterSerializer(serializers.Serializer):
    full_name = serializers.CharField(max_length=255)
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True, min_length=6)
    confirm_password = serializers.CharField(write_only=True, min_length=6)
    phone_number = serializers.CharField(max_length=20)
    college = serializers.CharField(max_length=255)
    course = serializers.CharField(max_length=255)
    graduation_year = serializers.CharField(max_length=10)
    city = serializers.CharField(max_length=100, required=False, allow_blank=True, default='')
    linkedin_url = serializers.URLField(required=False, allow_blank=True, default='')
    github_url = serializers.URLField(required=False, allow_blank=True, default='')
    portfolio_url = serializers.URLField(required=False, allow_blank=True, default='')
    skills = serializers.ListField(child=serializers.CharField(), required=False, default=[])
    interests = serializers.ListField(child=serializers.CharField(), required=False, default=[])

    def validate_email(self, value):
        if User.objects.filter(email__iexact=value).exists():
            raise serializers.ValidationError("An account with this email address already exists.")
        return value.lower()

    def validate(self, data):
        if data['password'] != data['confirm_password']:
            raise serializers.ValidationError({"password": "Passwords do not match."})
        return data

    def create(self, validated_data):
        email = validated_data['email']
        password = validated_data['password']
        full_name = validated_data['full_name']

        user = User.objects.create_user(
            username=email,
            email=email,
            password=password,
            first_name=full_name.split(' ')[0],
            last_name=' '.join(full_name.split(' ')[1:]) if ' ' in full_name else ''
        )

        profile = StudentProfile.objects.create(
            user=user,
            full_name=full_name,
            phone_number=validated_data.get('phone_number', ''),
            college=validated_data.get('college', ''),
            course=validated_data.get('course', ''),
            graduation_year=validated_data.get('graduation_year', ''),
            city=validated_data.get('city', ''),
            linkedin_url=validated_data.get('linkedin_url', ''),
            github_url=validated_data.get('github_url', ''),
            portfolio_url=validated_data.get('portfolio_url', '')
        )

        skills_input = validated_data.get('skills', [])
        for skill_name in skills_input:
            s_obj, _ = Skill.objects.get_or_create(name=skill_name.strip())
            profile.skills.add(s_obj)

        interests_input = validated_data.get('interests', [])
        for int_name in interests_input:
            i_obj, _ = Interest.objects.get_or_create(name=int_name.strip())
            profile.interests.add(i_obj)

        return profile


class OpportunitySerializer(serializers.ModelSerializer):
    skills = SkillSerializer(many=True, read_only=True)
    effective_status = serializers.SerializerMethodField()
    is_saved = serializers.SerializerMethodField()
    is_applied = serializers.SerializerMethodField()

    class Meta:
        model = Opportunity
        fields = [
            'id', 'title', 'organization_name', 'organization_logo', 'category', 
            'mode', 'location', 'work_type', 'experience_level', 'stipend', 
            'short_description', 'description', 'responsibilities', 'requirements', 
            'eligibility', 'benefits', 'application_url', 'application_open_date', 
            'application_deadline', 'status', 'effective_status', 'tags', 'skills', 
            'is_featured', 'is_saved', 'is_applied', 'created_at', 'updated_at'
        ]

    def get_effective_status(self, obj):
        return obj.get_effective_status()

    def get_is_saved(self, obj):
        request = self.context.get('request')
        if request and request.user and request.user.is_authenticated:
            return SavedOpportunity.objects.filter(user=request.user, opportunity=obj).exists()
        return False

    def get_is_applied(self, obj):
        request = self.context.get('request')
        if request and request.user and request.user.is_authenticated:
            return OpportunityApplication.objects.filter(user=request.user, opportunity=obj).exists()
        return False


class SavedOpportunitySerializer(serializers.ModelSerializer):
    opportunity = OpportunitySerializer(read_only=True)

    class Meta:
        model = SavedOpportunity
        fields = ['id', 'opportunity', 'saved_at']


class OpportunityApplicationSerializer(serializers.ModelSerializer):
    opportunity = OpportunitySerializer(read_only=True)
    applicant_name = serializers.SerializerMethodField()
    applicant_email = serializers.SerializerMethodField()

    class Meta:
        model = OpportunityApplication
        fields = [
            'id', 'opportunity', 'applicant_name', 'applicant_email', 
            'cover_message', 'resume_file', 'portfolio_url', 'status', 
            'applied_at', 'updated_at'
        ]

    def get_applicant_name(self, obj):
        profile = getattr(obj.user, 'student_profile', None)
        return profile.full_name if profile else (obj.user.get_full_name() or obj.user.username)

    def get_applicant_email(self, obj):
        return obj.user.email if obj.user else ''


# PHASE 4: VOLUNTEER & EVENT SERIALIZERS
class VolunteerRoleSerializer(serializers.ModelSerializer):
    filled_slots = serializers.SerializerMethodField()
    is_full = serializers.SerializerMethodField()

    class Meta:
        model = VolunteerRole
        fields = ['id', 'title', 'description', 'capacity', 'filled_slots', 'is_full', 'requirements']

    def get_filled_slots(self, obj):
        return obj.get_filled_slots()

    def get_is_full(self, obj):
        return obj.is_full()


class VolunteerApplicationSerializer(serializers.ModelSerializer):
    event_title = serializers.CharField(source='event.title', read_only=True)
    role_title = serializers.CharField(source='role.title', read_only=True)
    student_name = serializers.SerializerMethodField()

    class Meta:
        model = VolunteerApplication
        fields = ['id', 'event', 'event_title', 'role', 'role_title', 'student_name', 'status', 'applied_at', 'withdrawn_at']

    def get_student_name(self, obj):
        profile = getattr(obj.user, 'student_profile', None)
        return profile.full_name if profile else (obj.user.get_full_name() or obj.user.username)


class SessionSpeakerSerializer(serializers.ModelSerializer):
    class Meta:
        model = SessionSpeaker
        fields = ['id', 'name', 'photo', 'designation', 'organization', 'bio', 'linkedin_url', 'created_at']


class MeetingInfoSerializer(serializers.ModelSerializer):
    class Meta:
        model = MeetingInfo
        fields = ['id', 'provider', 'external_meeting_id', 'passcode', 'status', 'created_at']


class EventRegistrationSerializer(serializers.ModelSerializer):
    event_title = serializers.CharField(source='event.title', read_only=True)
    event_start_datetime = serializers.DateTimeField(source='event.start_datetime', read_only=True)
    event_mode = serializers.CharField(source='event.mode', read_only=True)
    student_name = serializers.SerializerMethodField()

    class Meta:
        model = EventRegistration
        fields = [
            'id', 'event', 'event_title', 'event_start_datetime', 'event_mode',
            'student_name', 'status', 'attendance_status', 'registered_at', 'cancelled_at'
        ]

    def get_student_name(self, obj):
        profile = getattr(obj.user, 'student_profile', None)
        return profile.full_name if profile else (obj.user.get_full_name() or obj.user.username)


class WaitlistEntrySerializer(serializers.ModelSerializer):
    event_title = serializers.CharField(source='event.title', read_only=True)
    student_name = serializers.SerializerMethodField()

    class Meta:
        model = WaitlistEntry
        fields = ['id', 'event', 'event_title', 'student_name', 'position', 'status', 'created_at']

    def get_student_name(self, obj):
        profile = getattr(obj.user, 'student_profile', None)
        return profile.full_name if profile else (obj.user.get_full_name() or obj.user.username)


class SessionFeedbackSerializer(serializers.ModelSerializer):
    student_name = serializers.SerializerMethodField()

    class Meta:
        model = SessionFeedback
        fields = [
            'id', 'event', 'student_name', 'rating', 'what_did_you_learn', 
            'what_did_you_like', 'suggestions', 'would_recommend', 'created_at'
        ]

    def get_student_name(self, obj):
        profile = getattr(obj.user, 'student_profile', None)
        return profile.full_name if profile else (obj.user.get_full_name() or obj.user.username)


class EventSerializer(serializers.ModelSerializer):
    registered_count = serializers.SerializerMethodField()
    available_seats = serializers.SerializerMethodField()
    is_full = serializers.SerializerMethodField()
    volunteer_filled_count = serializers.SerializerMethodField()
    effective_status = serializers.SerializerMethodField()
    is_registered = serializers.SerializerMethodField()
    is_waitlisted = serializers.SerializerMethodField()
    user_registration_status = serializers.SerializerMethodField()
    user_volunteer_application = serializers.SerializerMethodField()
    volunteer_roles = VolunteerRoleSerializer(many=True, read_only=True)
    speakers = SessionSpeakerSerializer(many=True, read_only=True)
    meeting_url_protected = serializers.SerializerMethodField()
    aggregate_rating = serializers.SerializerMethodField()
    feedback_count = serializers.SerializerMethodField()

    class Meta:
        model = Event
        fields = [
            'id', 'title', 'slug', 'cover_image', 'category', 'session_type', 'short_description', 
            'description', 'agenda', 'topics', 'prerequisites', 'who_should_attend', 'what_you_will_learn',
            'organizer', 'mode', 'location', 'meeting_url_protected', 'meeting_provider', 'zoom_meeting_id',
            'start_datetime', 'end_datetime', 'registration_deadline', 'timezone_str',
            'participant_capacity', 'registered_count', 'available_seats', 'is_full',
            'volunteer_capacity', 'volunteer_filled_count', 'status', 'effective_status', 
            'recording_url', 'recording_visibility', 'recording_available_date',
            'speakers', 'is_published', 'is_featured', 'is_registered', 'is_waitlisted',
            'user_registration_status', 'user_volunteer_application', 'volunteer_roles',
            'aggregate_rating', 'feedback_count', 'created_at', 'updated_at'
        ]

    def get_registered_count(self, obj):
        return obj.get_registered_count()

    def get_available_seats(self, obj):
        return obj.get_available_seats()

    def get_is_full(self, obj):
        return obj.is_full()

    def get_volunteer_filled_count(self, obj):
        return obj.get_volunteer_filled_count()

    def get_effective_status(self, obj):
        return obj.get_effective_status()

    def get_is_registered(self, obj):
        request = self.context.get('request')
        if request and request.user and request.user.is_authenticated:
            return EventRegistration.objects.filter(user=request.user, event=obj, status='REGISTERED').exists()
        return False

    def get_is_waitlisted(self, obj):
        request = self.context.get('request')
        if request and request.user and request.user.is_authenticated:
            return WaitlistEntry.objects.filter(user=request.user, event=obj, status='WAITING').exists()
        return False

    def get_user_registration_status(self, obj):
        request = self.context.get('request')
        if request and request.user and request.user.is_authenticated:
            reg = EventRegistration.objects.filter(user=request.user, event=obj).first()
            if reg:
                return reg.status
            wl = WaitlistEntry.objects.filter(user=request.user, event=obj, status='WAITING').first()
            if wl:
                return 'WAITLISTED'
        return 'NONE'

    def get_meeting_url_protected(self, obj):
        # Security protection: do NOT leak meeting URL to non-registered or unauthenticated users
        request = self.context.get('request')
        if request and request.user and request.user.is_authenticated:
            is_reg = EventRegistration.objects.filter(user=request.user, event=obj, status='REGISTERED').exists()
            if is_reg or request.user.is_staff:
                # Return meeting link (from MeetingInfo or event.meeting_url)
                meeting_info = getattr(obj, 'meeting_info', None)
                if meeting_info and meeting_info.join_url:
                    return meeting_info.join_url
                return obj.meeting_url
        return ""

    def get_user_volunteer_application(self, obj):
        request = self.context.get('request')
        if request and request.user and request.user.is_authenticated:
            app = VolunteerApplication.objects.filter(user=request.user, event=obj).first()
            if app:
                return VolunteerApplicationSerializer(app).data
        return None

    def get_aggregate_rating(self, obj):
        feedbacks = obj.feedbacks.all()
        if feedbacks.count() == 0:
            return None
        avg = sum(f.rating for f in feedbacks) / feedbacks.count()
        return round(avg, 1)

    def get_feedback_count(self, obj):
        return obj.feedbacks.count()


class SSServiceSerializer(serializers.ModelSerializer):
    faqs = serializers.SerializerMethodField()
    portfolio_items = serializers.SerializerMethodField()

    class Meta:
        model = SSService
        fields = [
            'id', 'title', 'slug', 'category', 'tagline', 'short_description', 
            'description', 'icon_name', 'who_it_is_for', 'features', 'process', 
            'deliverables', 'is_active', 'is_featured', 'order', 'faqs', 'portfolio_items',
            'created_at', 'updated_at'
        ]

    def get_faqs(self, obj):
        faqs = obj.faqs.all().order_by('order')
        return ServiceFAQSerializer(faqs, many=True).data

    def get_portfolio_items(self, obj):
        items = obj.portfolio_items.all()
        return ServicePortfolioItemSerializer(items, many=True).data


class CommunityStatSerializer(serializers.ModelSerializer):
    class Meta:
        model = CommunityStat
        fields = '__all__'


# PHASE 5 SERIALIZERS

class TalentProfileSerializer(serializers.ModelSerializer):
    student_name = serializers.SerializerMethodField()
    student_photo = serializers.SerializerMethodField()
    college = serializers.SerializerMethodField()
    course = serializers.SerializerMethodField()
    city = serializers.SerializerMethodField()
    skills = SkillSerializer(many=True, read_only=True)

    class Meta:
        model = TalentProfile
        fields = [
            'id', 'user', 'student_name', 'student_photo', 'college', 'course', 'city',
            'title', 'category', 'short_description', 'description', 'portfolio_url',
            'instagram_url', 'youtube_url', 'linkedin_url', 'media_url', 'skills',
            'status', 'created_at', 'updated_at'
        ]
        read_only_fields = ['user', 'created_at', 'updated_at']

    def get_student_name(self, obj):
        profile = getattr(obj.user, 'student_profile', None)
        return profile.full_name if profile else (obj.user.get_full_name() or obj.user.username)

    def get_college(self, obj):
        profile = getattr(obj.user, 'student_profile', None)
        return profile.college if profile else ''

    def get_course(self, obj):
        profile = getattr(obj.user, 'student_profile', None)
        return profile.course if profile else ''

    def get_city(self, obj):
        profile = getattr(obj.user, 'student_profile', None)
        return profile.city if profile else ''

    def get_student_photo(self, obj):
        profile = getattr(obj.user, 'student_profile', None)
        if profile and profile.profile_photo:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(profile.profile_photo.url)
            return profile.profile_photo.url
        return None


class StudentProjectSerializer(serializers.ModelSerializer):
    author_name = serializers.SerializerMethodField()
    author_college = serializers.SerializerMethodField()
    author_photo = serializers.SerializerMethodField()
    team_members_detail = serializers.SerializerMethodField()

    class Meta:
        model = StudentProject
        fields = [
            'id', 'user', 'author_name', 'author_college', 'author_photo', 'team_members', 'team_members_detail',
            'title', 'slug', 'category', 'short_description', 'description', 'problem_statement',
            'solution', 'technologies', 'features', 'github_url', 'live_demo_url', 'portfolio_url',
            'cover_image_url', 'project_stage', 'status', 'created_at', 'updated_at'
        ]
        read_only_fields = ['user', 'created_at', 'updated_at']

    def get_author_name(self, obj):
        profile = getattr(obj.user, 'student_profile', None)
        return profile.full_name if profile else (obj.user.get_full_name() or obj.user.username)

    def get_author_college(self, obj):
        profile = getattr(obj.user, 'student_profile', None)
        return profile.college if profile else ''

    def get_author_photo(self, obj):
        profile = getattr(obj.user, 'student_profile', None)
        if profile and profile.profile_photo:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(profile.profile_photo.url)
            return profile.profile_photo.url
        return None

    def get_team_members_detail(self, obj):
        members = []
        for u in obj.team_members.all():
            p = getattr(u, 'student_profile', None)
            if p:
                members.append({
                    'id': u.id,
                    'full_name': p.full_name,
                    'college': p.college,
                    'role': p.role
                })
        return members


class StudentStorySerializer(serializers.ModelSerializer):
    author_name = serializers.SerializerMethodField()
    author_college = serializers.SerializerMethodField()
    author_photo = serializers.SerializerMethodField()

    class Meta:
        model = StudentStory
        fields = [
            'id', 'user', 'author_name', 'author_college', 'author_photo', 'title', 'slug',
            'category', 'excerpt', 'content', 'cover_image_url', 'status', 'published_at',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['user', 'created_at', 'updated_at']

    def get_author_name(self, obj):
        profile = getattr(obj.user, 'student_profile', None)
        return profile.full_name if profile else (obj.user.get_full_name() or obj.user.username)

    def get_author_college(self, obj):
        profile = getattr(obj.user, 'student_profile', None)
        return profile.college if profile else ''

    def get_author_photo(self, obj):
        profile = getattr(obj.user, 'student_profile', None)
        if profile and profile.profile_photo:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(profile.profile_photo.url)
            return profile.profile_photo.url
        return None


class CampusAmbassadorApplicationSerializer(serializers.ModelSerializer):
    applicant_name = serializers.SerializerMethodField()
    applicant_email = serializers.SerializerMethodField()

    class Meta:
        model = CampusAmbassadorApplication
        fields = [
            'id', 'user', 'applicant_name', 'applicant_email', 'college', 'campus_location',
            'why_join', 'previous_experience', 'social_media_links', 'availability_hours',
            'expected_contribution', 'status', 'applied_at', 'updated_at'
        ]
        read_only_fields = ['user', 'applied_at', 'updated_at']

    def get_applicant_name(self, obj):
        profile = getattr(obj.user, 'student_profile', None)
        return profile.full_name if profile else (obj.user.get_full_name() or obj.user.username)

    def get_applicant_email(self, obj):
        return obj.user.email if obj.user else ''


class StudentAchievementSerializer(serializers.ModelSerializer):
    student_name = serializers.SerializerMethodField()

    class Meta:
        model = StudentAchievement
        fields = [
            'id', 'user', 'student_name', 'title', 'organization', 'category',
            'date_achieved', 'description', 'certificate_url', 'status', 'created_at', 'updated_at'
        ]
        read_only_fields = ['user', 'created_at', 'updated_at']

    def get_student_name(self, obj):
        profile = getattr(obj.user, 'student_profile', None)
        return profile.full_name if profile else (obj.user.get_full_name() or obj.user.username)


class PublicCommunityMemberSerializer(serializers.ModelSerializer):
    skills = SkillSerializer(many=True, read_only=True)
    interests = InterestSerializer(many=True, read_only=True)
    is_ambassador = serializers.SerializerMethodField()
    projects_count = serializers.SerializerMethodField()
    talents_count = serializers.SerializerMethodField()
    achievements_count = serializers.SerializerMethodField()

    class Meta:
        model = StudentProfile
        fields = [
            'id', 'full_name', 'college', 'course', 'graduation_year', 'city',
            'bio', 'profile_photo', 'linkedin_url', 'github_url', 'portfolio_url',
            'skills', 'interests', 'role', 'is_ambassador', 'projects_count',
            'talents_count', 'achievements_count', 'created_at'
        ]

    def get_is_ambassador(self, obj):
        return CampusAmbassadorApplication.objects.filter(user=obj.user, status='ACCEPTED').exists()

    def get_projects_count(self, obj):
        return StudentProject.objects.filter(user=obj.user, status='PUBLISHED').count()

    def get_talents_count(self, obj):
        return TalentProfile.objects.filter(user=obj.user, status='PUBLISHED').count()

    def get_achievements_count(self, obj):
        return StudentAchievement.objects.filter(user=obj.user, status='PUBLISHED').count()


# PHASE 6 SERIALIZERS: SERVICES, GUIDANCE, SUPPORT, ENQUIRIES & CONTACT

class ServiceFAQSerializer(serializers.ModelSerializer):
    class Meta:
        model = ServiceFAQ
        fields = ['id', 'question', 'answer', 'order']


class ServicePortfolioItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = ServicePortfolioItem
        fields = ['id', 'title', 'description', 'image_url', 'outcome']


class ServiceCategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = ServiceCategory
        fields = ['id', 'name', 'slug', 'description', 'icon_name', 'order']


class ServiceEnquirySerializer(serializers.ModelSerializer):
    service_title = serializers.CharField(source='service.title', read_only=True)

    class Meta:
        model = ServiceEnquiry
        fields = [
            'id', 'reference_number', 'user', 'service', 'service_title', 'service_name', 
            'enquiry_type', 'full_name', 'email', 'phone', 'organization', 'requirement', 
            'preferred_contact', 'expected_timeline', 'status', 'attachment', 
            'created_at', 'updated_at'
        ]
        read_only_fields = ['reference_number', 'user', 'created_at', 'updated_at']


class SupportUpdateSerializer(serializers.ModelSerializer):
    author_name = serializers.SerializerMethodField()

    class Meta:
        model = SupportUpdate
        fields = ['id', 'support_request', 'author', 'author_name', 'is_staff_reply', 'message', 'attachment', 'created_at']
        read_only_fields = ['author', 'is_staff_reply', 'created_at']

    def get_author_name(self, obj):
        if obj.is_staff_reply:
            return "SS Support Team"
        profile = getattr(obj.author, 'student_profile', None)
        return profile.full_name if profile else (obj.author.get_full_name() or obj.author.username)


class SupportRequestSerializer(serializers.ModelSerializer):
    updates = SupportUpdateSerializer(many=True, read_only=True)
    user_name = serializers.SerializerMethodField()
    user_email = serializers.SerializerMethodField()

    class Meta:
        model = SupportRequest
        fields = [
            'id', 'reference_number', 'user', 'user_name', 'user_email', 'category', 
            'subject', 'description', 'preferred_contact', 'status', 'priority', 
            'attachment', 'updates', 'created_at', 'updated_at', 'resolved_at'
        ]
        read_only_fields = ['reference_number', 'user', 'status', 'priority', 'created_at', 'updated_at', 'resolved_at']

    def get_user_name(self, obj):
        profile = getattr(obj.user, 'student_profile', None)
        return profile.full_name if profile else (obj.user.get_full_name() or obj.user.username)

    def get_user_email(self, obj):
        return obj.user.email if obj.user else ''


class ContactMessageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ContactMessage
        fields = ['id', 'name', 'email', 'phone', 'subject', 'message', 'status', 'created_at']
        read_only_fields = ['status', 'created_at']


# PHASE 7 SERIALIZERS

class AboutSectionSerializer(serializers.ModelSerializer):
    class Meta:
        model = AboutSection
        fields = '__all__'


class LeadershipMemberSerializer(serializers.ModelSerializer):
    photo_display = serializers.SerializerMethodField()

    class Meta:
        model = LeadershipMember
        fields = [
            'id', 'name', 'designation', 'leadership_type', 'photo', 'photo_url',
            'photo_display', 'bio', 'area_of_responsibility', 'vision_statement',
            'quote', 'linkedin_url', 'twitter_url', 'github_url', 'other_url',
            'display_order', 'status', 'created_at', 'updated_at'
        ]

    def get_photo_display(self, obj):
        return obj.get_photo_display()


class TeamMemberSerializer(serializers.ModelSerializer):
    photo_display = serializers.SerializerMethodField()
    skills_list = serializers.SerializerMethodField()

    class Meta:
        model = TeamMember
        fields = [
            'id', 'name', 'role', 'department', 'photo', 'photo_url', 'photo_display',
            'short_bio', 'bio', 'responsibilities', 'skills', 'skills_list',
            'joined_date', 'contributions', 'linkedin_url', 'github_url', 'other_url',
            'display_order', 'status', 'created_at', 'updated_at'
        ]

    def get_photo_display(self, obj):
        return obj.get_photo_display()

    def get_skills_list(self, obj):
        if obj.skills:
            return [s.strip() for s in obj.skills.split(',') if s.strip()]
        return []


class PlacementSerializer(serializers.ModelSerializer):
    roles_list = serializers.SerializerMethodField()
    public_student_names = serializers.SerializerMethodField()

    class Meta:
        model = Placement
        fields = [
            'id', 'company_name', 'company_logo_url', 'roles', 'roles_list',
            'number_of_students', 'placement_year', 'location', 'description',
            'verification_status', 'visibility', 'student_names_visibility',
            'public_student_names', 'testimonials', 'created_at', 'updated_at'
        ]

    def get_roles_list(self, obj):
        if obj.roles:
            return [r.strip() for r in obj.roles.split(',') if r.strip()]
        return []

    def get_public_student_names(self, obj):
        if obj.student_names_visibility == 'PUBLIC' and obj.student_names:
            return [n.strip() for n in obj.student_names.split(',') if n.strip()]
        elif obj.student_names_visibility == 'ANONYMOUS':
            return [f"Student {i+1}" for i in range(min(obj.number_of_students, 5))]
        return []


class SuccessStorySerializer(serializers.ModelSerializer):
    display_name = serializers.SerializerMethodField()

    class Meta:
        model = SuccessStory
        fields = [
            'id', 'student', 'student_name', 'display_name', 'is_anonymous',
            'title', 'category', 'excerpt', 'story', 'challenge', 'how_ss_helped',
            'outcome', 'company', 'role', 'photo_url', 'student_quote',
            'verification_status', 'created_at', 'updated_at'
        ]

    def get_display_name(self, obj):
        return obj.get_display_name()


class PartnerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Partner
        fields = '__all__'


class TestimonialSerializer(serializers.ModelSerializer):
    class Meta:
        model = Testimonial
        fields = '__all__'


class OrganizationMilestoneSerializer(serializers.ModelSerializer):
    class Meta:
        model = OrganizationMilestone
        fields = '__all__'


class ImpactMetricSerializer(serializers.ModelSerializer):
    class Meta:
        model = ImpactMetric
        fields = '__all__'


# PHASE 9 ADMIN SERIALIZERS

class AuditLogSerializer(serializers.ModelSerializer):
    user_email = serializers.SerializerMethodField()

    class Meta:
        model = AuditLog
        fields = [
            'id', 'user', 'user_email', 'admin_name', 'admin_role',
            'action', 'module', 'record_id', 'record_repr',
            'previous_value', 'new_value', 'ip_address', 'created_at'
        ]

    def get_user_email(self, obj):
        return obj.user.email if obj.user else ''


class ContentRevisionSerializer(serializers.ModelSerializer):
    updated_by_email = serializers.SerializerMethodField()

    class Meta:
        model = ContentRevision
        fields = [
            'id', 'module', 'record_id', 'title',
            'previous_content', 'updated_content', 'updated_by', 'updated_by_email', 'created_at'
        ]

    def get_updated_by_email(self, obj):
        return obj.updated_by.email if obj.updated_by else ''


class SiteSettingSerializer(serializers.ModelSerializer):
    class Meta:
        model = SiteSetting
        fields = '__all__'


class AdminUserDetailSerializer(serializers.ModelSerializer):
    profile = StudentProfileSerializer(source='student_profile', read_only=True)
    is_active = serializers.BooleanField()
    date_joined = serializers.DateTimeField(read_only=True)
    last_login = serializers.DateTimeField(read_only=True)
    role = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = [
            'id', 'username', 'email', 'first_name', 'last_name',
            'is_active', 'is_staff', 'is_superuser', 'date_joined', 'last_login',
            'role', 'profile'
        ]

    def get_role(self, obj):
        if obj.is_superuser:
            return 'SUPER_ADMIN'
        prof = getattr(obj, 'student_profile', None)
        if prof and prof.role:
            return prof.role
        if obj.is_staff:
            return 'ADMIN'
        return 'STUDENT'


class NotificationSerializer(serializers.ModelSerializer):
    recipient_email = serializers.SerializerMethodField()

    class Meta:
        model = Notification
        fields = [
            'id', 'recipient', 'recipient_email', 'notification_type', 'title', 
            'message', 'priority', 'status', 'is_read', 'related_module', 
            'related_object_id', 'cta_link', 'cta_text', 'created_at', 'read_at'
        ]
        read_only_fields = ['id', 'recipient', 'created_at', 'read_at']

    def get_recipient_email(self, obj):
        return obj.recipient.email if obj.recipient else ''


class NotificationPreferenceSerializer(serializers.ModelSerializer):
    user_email = serializers.SerializerMethodField()

    class Meta:
        model = NotificationPreference
        fields = [
            'id', 'user', 'user_email', 'opportunity_alerts', 'event_updates',
            'session_updates', 'community_updates', 'application_updates',
            'email_enabled', 'updated_at'
        ]
        read_only_fields = ['id', 'user', 'updated_at']

    def get_user_email(self, obj):
        return obj.user.email if obj.user else ''


class EmailLogSerializer(serializers.ModelSerializer):
    recipient_email = serializers.SerializerMethodField()

    class Meta:
        model = EmailLog
        fields = [
            'id', 'recipient', 'recipient_email', 'email_type', 'subject',
            'status', 'channel', 'attempt_count', 'error_message',
            'related_object_type', 'related_object_id', 'sent_at', 'failed_at', 'created_at'
        ]
        read_only_fields = ['id', 'created_at', 'sent_at', 'failed_at']

    def get_recipient_email(self, obj):
        return obj.recipient.email if obj.recipient else ''




