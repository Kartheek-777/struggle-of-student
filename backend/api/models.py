from django.db import models
from django.contrib.auth.models import User
from django.utils import timezone
import datetime
import random
import string
import uuid

class Skill(models.Model):
    name = models.CharField(max_length=100, unique=True)
    category = models.CharField(max_length=50, default="General")

    def __str__(self):
        return self.name


class Interest(models.Model):
    name = models.CharField(max_length=100, unique=True)

    def __str__(self):
        return self.name


class StudentProfile(models.Model):
    ROLE_CHOICES = (
        ('STUDENT', 'Student'),
        ('SUPER_ADMIN', 'Super Admin'),
        ('ADMIN', 'Admin'),
        ('CONTENT_MANAGER', 'Content Manager'),
        ('EVENT_MANAGER', 'Event Manager'),
        ('OPPORTUNITY_MANAGER', 'Opportunity Manager'),
        ('COMMUNITY_MANAGER', 'Community Manager'),
        ('SUPPORT_MANAGER', 'Support Manager'),
        ('HR_TEAM', 'HR Team'),
        ('MODERATOR', 'Moderator'),
        ('REPORT_VIEWER', 'Report Viewer'),
        ('TEAM_MEMBER', 'Team Member'),
    )

    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='student_profile')
    full_name = models.CharField(max_length=255)
    phone_number = models.CharField(max_length=20)
    college = models.CharField(max_length=255)
    course = models.CharField(max_length=255)
    graduation_year = models.CharField(max_length=10)
    city = models.CharField(max_length=100, blank=True, default='')
    bio = models.TextField(blank=True, default='')
    profile_photo = models.ImageField(upload_to='profile_photos/', blank=True, null=True)
    linkedin_url = models.URLField(blank=True, default='')
    github_url = models.URLField(blank=True, default='')
    portfolio_url = models.URLField(blank=True, default='')
    skills = models.ManyToManyField(Skill, blank=True, related_name='profiles')
    interests = models.ManyToManyField(Interest, blank=True, related_name='profiles')
    role = models.CharField(max_length=30, choices=ROLE_CHOICES, default='STUDENT')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def calculate_completion(self):
        score = 0
        if self.full_name and self.user.email and self.phone_number:
            score += 20
        if self.college and self.course and self.graduation_year:
            score += 20
        if self.skills.exists():
            score += 20
        if self.interests.exists():
            score += 15
        if self.bio and len(self.bio.strip()) >= 10:
            score += 15
        if self.linkedin_url or self.github_url or self.portfolio_url:
            score += 10
        return min(score, 100)

    def __str__(self):
        return f"{self.full_name} ({self.college})"


class StudentResume(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='resume')
    resume_file = models.FileField(upload_to='resumes/')
    original_filename = models.CharField(max_length=255)
    uploaded_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Resume for {self.user.email}"


class OpportunityCategory(models.Model):
    name = models.CharField(max_length=100, unique=True)
    slug = models.SlugField(max_length=100, unique=True)

    def __str__(self):
        return self.name


class Opportunity(models.Model):
    MODE_CHOICES = (
        ('Online', 'Online / Remote'),
        ('Offline', 'Offline / On-site'),
        ('Hybrid', 'Hybrid'),
    )

    EXPERIENCE_CHOICES = (
        ('Beginner', 'Beginner / Entry Level'),
        ('Intermediate', 'Intermediate'),
        ('Advanced', 'Advanced'),
    )

    STATUS_CHOICES = (
        ('OPEN', 'Open'),
        ('CLOSING_SOON', 'Closing Soon'),
        ('CLOSED', 'Closed'),
    )

    title = models.CharField(max_length=255)
    organization_name = models.CharField(max_length=255, default="SS Community Partners")
    organization_logo = models.CharField(max_length=255, blank=True, default="")
    category = models.CharField(max_length=100, default="Internships")
    mode = models.CharField(max_length=50, choices=MODE_CHOICES, default="Online")
    location = models.CharField(max_length=100, default="Remote")
    work_type = models.CharField(max_length=50, default="Remote")
    experience_level = models.CharField(max_length=50, choices=EXPERIENCE_CHOICES, default="Beginner")
    stipend = models.CharField(max_length=100, default="Unpaid / Learning")
    short_description = models.CharField(max_length=500, default="")
    description = models.TextField(blank=True, default="")
    responsibilities = models.TextField(blank=True, default="")
    requirements = models.TextField(blank=True, default="")
    eligibility = models.TextField(blank=True, default="Undergraduate & Postgraduate Students")
    benefits = models.TextField(blank=True, default="Certificate of completion, stipend, mentorship")
    application_url = models.URLField(blank=True, default="")
    application_open_date = models.DateField(default=datetime.date.today)
    application_deadline = models.DateField(null=True, blank=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="OPEN")
    tags = models.CharField(max_length=255, blank=True, default="Opportunity, Student", help_text="Comma-separated tags")
    skills = models.ManyToManyField(Skill, blank=True, related_name='opportunities')
    is_featured = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def save(self, *args, **kwargs):
        if not self.tags:
            self.tags = "Opportunity, Student, SS Community"
        super().save(*args, **kwargs)

    def get_effective_status(self):
        if self.status == 'CLOSED':
            return 'CLOSED'
        if self.application_deadline:
            today = datetime.date.today()
            if today > self.application_deadline:
                return 'CLOSED'
            days_left = (self.application_deadline - today).days
            if days_left <= 3:
                return 'CLOSING_SOON'
        return self.status

    def __str__(self):
        return f"{self.title} ({self.organization_name})"


class SavedOpportunity(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='saved_opportunities')
    opportunity = models.ForeignKey(Opportunity, on_delete=models.CASCADE, related_name='saved_by_users')
    saved_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('user', 'opportunity')

    def __str__(self):
        return f"{self.user.email} saved {self.opportunity.title}"


class OpportunityApplication(models.Model):
    APP_STATUS_CHOICES = (
        ('APPLIED', 'Applied'),
        ('UNDER_REVIEW', 'Under Review'),
        ('SHORTLISTED', 'Shortlisted'),
        ('REJECTED', 'Rejected'),
        ('SELECTED', 'Selected'),
        ('WITHDRAWN', 'Withdrawn'),
    )

    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='applications')
    opportunity = models.ForeignKey(Opportunity, on_delete=models.CASCADE, related_name='applications')
    cover_message = models.TextField(blank=True, default='')
    resume_file = models.FileField(upload_to='application_resumes/', blank=True, null=True)
    portfolio_url = models.URLField(blank=True, default='')
    status = models.CharField(max_length=20, choices=APP_STATUS_CHOICES, default='APPLIED')
    applied_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ('user', 'opportunity')

    def __str__(self):
        return f"{self.user.email} applied to {self.opportunity.title}"


# PHASE 4: EVENTS & VOLUNTEER PLATFORM MODELS
class EventCategory(models.Model):
    name = models.CharField(max_length=100, unique=True)
    slug = models.SlugField(max_length=100, unique=True)

    def __str__(self):
        return self.name


class SessionSpeaker(models.Model):
    name = models.CharField(max_length=255)
    photo = models.CharField(max_length=500, blank=True, default="")
    designation = models.CharField(max_length=255, default="Speaker")
    organization = models.CharField(max_length=255, default="Struggle of Student")
    bio = models.TextField(blank=True, default="")
    linkedin_url = models.URLField(blank=True, default="")
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.name} ({self.designation} at {self.organization})"


class Event(models.Model):
    MODE_CHOICES = (
        ('Online', 'Online / Zoom'),
        ('Offline', 'Offline / On-site'),
        ('Hybrid', 'Hybrid'),
    )

    SESSION_TYPE_CHOICES = (
        ('EVENT', 'Event'),
        ('WORKSHOP', 'Workshop'),
        ('WEBINAR', 'Webinar'),
        ('ONLINE_SESSION', 'Online Session'),
        ('CAREER_SESSION', 'Career Session'),
        ('TECHNICAL_SESSION', 'Technical Session'),
        ('COMMUNITY_SESSION', 'Community Session'),
    )

    STATUS_CHOICES = (
        ('DRAFT', 'Draft'),
        ('PUBLISHED', 'Published'),
        ('REGISTRATION_OPEN', 'Registration Open'),
        ('REGISTRATION_FULL', 'Registration Full'),
        ('REGISTRATION_CLOSED', 'Registration Closed'),
        ('ONGOING', 'Ongoing'),
        ('COMPLETED', 'Completed'),
        ('CANCELLED', 'Cancelled'),
    )

    RECORDING_VISIBILITY_CHOICES = (
        ('PUBLIC', 'Public'),
        ('REGISTERED_PARTICIPANTS', 'Registered Participants Only'),
        ('PRIVATE', 'Private'),
    )

    MEETING_PROVIDER_CHOICES = (
        ('ZOOM', 'Zoom'),
        ('GOOGLE_MEET', 'Google Meet'),
        ('MICROSOFT_TEAMS', 'Microsoft Teams'),
        ('OTHER', 'Other Link'),
    )

    title = models.CharField(max_length=255)
    slug = models.SlugField(max_length=255, blank=True, default="")
    cover_image = models.ImageField(upload_to='event_covers/', blank=True, null=True)
    category = models.CharField(max_length=100, default="Workshop")
    session_type = models.CharField(max_length=50, choices=SESSION_TYPE_CHOICES, default="WORKSHOP")
    short_description = models.CharField(max_length=500, default="")
    description = models.TextField(blank=True, default="")
    agenda = models.TextField(blank=True, default="")
    topics = models.TextField(blank=True, default="")
    prerequisites = models.TextField(blank=True, default="")
    who_should_attend = models.TextField(blank=True, default="All College Students & Enthusiasts")
    what_you_will_learn = models.TextField(blank=True, default="")
    organizer = models.CharField(max_length=255, default="Struggle of Student (SS)")
    mode = models.CharField(max_length=50, choices=MODE_CHOICES, default="Online")
    location = models.CharField(max_length=255, default="Online Zoom")
    meeting_url = models.URLField(blank=True, default="")
    meeting_provider = models.CharField(max_length=50, choices=MEETING_PROVIDER_CHOICES, default="ZOOM")
    zoom_meeting_id = models.CharField(max_length=100, blank=True, default="")
    zoom_passcode = models.CharField(max_length=100, blank=True, default="")
    start_datetime = models.DateTimeField(default=timezone.now)
    end_datetime = models.DateTimeField(default=timezone.now)
    registration_deadline = models.DateTimeField(null=True, blank=True)
    timezone_str = models.CharField(max_length=50, default="Asia/Kolkata")
    participant_capacity = models.IntegerField(default=100)
    volunteer_capacity = models.IntegerField(default=20)
    status = models.CharField(max_length=30, choices=STATUS_CHOICES, default="REGISTRATION_OPEN")
    recording_url = models.URLField(blank=True, default="")
    recording_visibility = models.CharField(max_length=50, choices=RECORDING_VISIBILITY_CHOICES, default="REGISTERED_PARTICIPANTS")
    recording_available_date = models.DateField(null=True, blank=True)
    speakers = models.ManyToManyField(SessionSpeaker, blank=True, related_name='sessions')
    is_published = models.BooleanField(default=True)
    is_featured = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def save(self, *args, **kwargs):
        if not self.end_datetime or self.end_datetime <= self.start_datetime:
            self.end_datetime = self.start_datetime + datetime.timedelta(hours=2)
        super().save(*args, **kwargs)

    def get_registered_count(self):
        return self.registrations.filter(status='REGISTERED').count()

    def get_available_seats(self):
        return max(0, self.participant_capacity - self.get_registered_count())

    def is_full(self):
        return self.get_registered_count() >= self.participant_capacity

    def get_volunteer_filled_count(self):
        return VolunteerApplication.objects.filter(
            event=self, status__in=['APPLIED', 'UNDER_REVIEW', 'ACCEPTED']
        ).count()

    def get_effective_status(self):
        if self.status == 'CANCELLED':
            return 'CANCELLED'
        if self.status == 'COMPLETED':
            return 'COMPLETED'
        now = timezone.now()
        if self.end_datetime and now > self.end_datetime:
            return 'COMPLETED'
        if self.registration_deadline and now > self.registration_deadline:
            return 'REGISTRATION_CLOSED'
        if self.is_full():
            return 'REGISTRATION_FULL'
        return self.status

    def __str__(self):
        return self.title


class MeetingInfo(models.Model):
    event = models.OneToOneField(Event, on_delete=models.CASCADE, related_name='meeting_info')
    provider = models.CharField(max_length=50, choices=Event.MEETING_PROVIDER_CHOICES, default='ZOOM')
    external_meeting_id = models.CharField(max_length=100, blank=True, default="")
    join_url = models.URLField(blank=True, default="")
    start_url = models.TextField(blank=True, default="") # Host URL, kept private & server-side
    passcode = models.CharField(max_length=100, blank=True, default="")
    status = models.CharField(max_length=50, default='CONFIGURED')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.provider} Meeting for {self.event.title}"


class EventRegistration(models.Model):
    STATUS_CHOICES = (
        ('REGISTERED', 'Registered'),
        ('CANCELLED', 'Cancelled'),
        ('ATTENDED', 'Attended'),
        ('NO_SHOW', 'No Show'),
        ('WAITLISTED', 'Waitlisted'),
    )

    ATTENDANCE_CHOICES = (
        ('REGISTERED', 'Registered'),
        ('ATTENDED', 'Attended'),
        ('NO_SHOW', 'No Show'),
    )

    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='event_registrations')
    event = models.ForeignKey(Event, on_delete=models.CASCADE, related_name='registrations')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='REGISTERED')
    attendance_status = models.CharField(max_length=20, choices=ATTENDANCE_CHOICES, default='REGISTERED')
    registered_at = models.DateTimeField(auto_now_add=True)
    cancelled_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        unique_together = ('user', 'event')

    def __str__(self):
        return f"{self.user.email} registered for {self.event.title} ({self.status})"


class WaitlistEntry(models.Model):
    STATUS_CHOICES = (
        ('WAITING', 'Waiting'),
        ('PROMOTED', 'Promoted'),
        ('REMOVED', 'Removed'),
        ('CANCELLED', 'Cancelled'),
    )

    event = models.ForeignKey(Event, on_delete=models.CASCADE, related_name='waitlist_entries')
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='session_waitlists')
    position = models.IntegerField(default=1)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='WAITING')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ('user', 'event')

    def __str__(self):
        return f"Waitlist #{self.position}: {self.user.email} for {self.event.title} ({self.status})"


class SessionFeedback(models.Model):
    event = models.ForeignKey(Event, on_delete=models.CASCADE, related_name='feedbacks')
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='session_feedbacks')
    rating = models.IntegerField(default=5) # 1 to 5
    what_did_you_learn = models.TextField(blank=True, default="")
    what_did_you_like = models.TextField(blank=True, default="")
    suggestions = models.TextField(blank=True, default="")
    would_recommend = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('user', 'event')

    def __str__(self):
        return f"Rating {self.rating}/5 from {self.user.email} for {self.event.title}"


class VolunteerRole(models.Model):
    event = models.ForeignKey(Event, on_delete=models.CASCADE, related_name='volunteer_roles')
    title = models.CharField(max_length=255)
    description = models.TextField(blank=True, default="")
    capacity = models.IntegerField(default=5)
    requirements = models.TextField(blank=True, default="")

    def get_filled_slots(self):
        return self.applications.filter(status__in=['APPLIED', 'UNDER_REVIEW', 'ACCEPTED']).count()

    def is_full(self):
        return self.get_filled_slots() >= self.capacity

    def __str__(self):
        return f"{self.title} for {self.event.title} ({self.get_filled_slots()}/{self.capacity})"


class VolunteerApplication(models.Model):
    STATUS_CHOICES = (
        ('APPLIED', 'Applied'),
        ('UNDER_REVIEW', 'Under Review'),
        ('ACCEPTED', 'Accepted'),
        ('REJECTED', 'Rejected'),
        ('WITHDRAWN', 'Withdrawn'),
    )

    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='volunteer_applications')
    event = models.ForeignKey(Event, on_delete=models.CASCADE, related_name='volunteer_applications')
    role = models.ForeignKey(VolunteerRole, on_delete=models.CASCADE, related_name='applications')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='APPLIED')
    applied_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    withdrawn_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        unique_together = ('user', 'role')

    def __str__(self):
        return f"{self.user.email} applied for {self.role.title} ({self.status})"


class SSService(models.Model):
    title = models.CharField(max_length=255)
    slug = models.SlugField(max_length=100, default='', blank=True)
    category = models.CharField(max_length=100, default='Other Services')
    tagline = models.CharField(max_length=255, blank=True, default='')
    short_description = models.TextField(blank=True, default='')
    description = models.TextField()
    icon_name = models.CharField(max_length=50, default='Settings')
    who_it_is_for = models.CharField(max_length=255, default="All College Students & Young Professionals")
    features = models.TextField(blank=True, default='')
    process = models.TextField(blank=True, default='')
    deliverables = models.TextField(blank=True, default='')
    is_active = models.BooleanField(default=True)
    is_featured = models.BooleanField(default=False)
    order = models.IntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True, null=True)
    updated_at = models.DateTimeField(auto_now=True, null=True)

    def __str__(self):
        return self.title


class CommunityStat(models.Model):
    label = models.CharField(max_length=100)
    value = models.CharField(max_length=50)
    description = models.CharField(max_length=255)

    def __str__(self):
        return f"{self.label}: {self.value}"


# PHASE 5: COMMUNITY & STUDENT SHOWCASE MODELS

class TalentCategory(models.Model):
    name = models.CharField(max_length=100)
    slug = models.SlugField(max_length=100, unique=True)

    def __str__(self):
        return self.name


class TalentProfile(models.Model):
    STATUS_CHOICES = (
        ('DRAFT', 'Draft'),
        ('PENDING_REVIEW', 'Pending Review'),
        ('PUBLISHED', 'Published'),
        ('REJECTED', 'Rejected'),
        ('ARCHIVED', 'Archived'),
    )

    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='talent_profiles')
    title = models.CharField(max_length=255)
    category = models.CharField(max_length=100, default='Photography')
    short_description = models.CharField(max_length=500)
    description = models.TextField(blank=True, default='')
    portfolio_url = models.URLField(blank=True, default='')
    instagram_url = models.URLField(blank=True, default='')
    youtube_url = models.URLField(blank=True, default='')
    linkedin_url = models.URLField(blank=True, default='')
    media_url = models.URLField(blank=True, default='')
    skills = models.ManyToManyField(Skill, blank=True)
    status = models.CharField(max_length=30, choices=STATUS_CHOICES, default='PENDING_REVIEW')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.user.email} - {self.title} ({self.status})"


class ProjectCategory(models.Model):
    name = models.CharField(max_length=100)
    slug = models.SlugField(max_length=100, unique=True)

    def __str__(self):
        return self.name


class StudentProject(models.Model):
    STATUS_CHOICES = (
        ('DRAFT', 'Draft'),
        ('PENDING_REVIEW', 'Pending Review'),
        ('PUBLISHED', 'Published'),
        ('REJECTED', 'Rejected'),
        ('ARCHIVED', 'Archived'),
    )

    PROJECT_STAGE_CHOICES = (
        ('IDEA', 'Idea'),
        ('IN_DEVELOPMENT', 'In Development'),
        ('COMPLETED', 'Completed'),
        ('ARCHIVED', 'Archived'),
    )

    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='submitted_projects')
    team_members = models.ManyToManyField(User, related_name='team_projects', blank=True)
    title = models.CharField(max_length=255)
    slug = models.SlugField(max_length=255, blank=True, default='')
    category = models.CharField(max_length=100, default='Web Development')
    short_description = models.CharField(max_length=500)
    description = models.TextField(blank=True, default='')
    problem_statement = models.TextField(blank=True, default='')
    solution = models.TextField(blank=True, default='')
    technologies = models.CharField(max_length=500, blank=True, default='')
    features = models.TextField(blank=True, default='')
    github_url = models.URLField(blank=True, default='')
    live_demo_url = models.URLField(blank=True, default='')
    portfolio_url = models.URLField(blank=True, default='')
    cover_image_url = models.URLField(blank=True, default='')
    project_stage = models.CharField(max_length=30, choices=PROJECT_STAGE_CHOICES, default='IN_DEVELOPMENT')
    status = models.CharField(max_length=30, choices=STATUS_CHOICES, default='PENDING_REVIEW')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.title} ({self.status})"


class StudentStory(models.Model):
    STATUS_CHOICES = (
        ('DRAFT', 'Draft'),
        ('PENDING_REVIEW', 'Pending Review'),
        ('PUBLISHED', 'Published'),
        ('REJECTED', 'Rejected'),
        ('ARCHIVED', 'Archived'),
    )

    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='student_stories')
    title = models.CharField(max_length=255)
    slug = models.SlugField(max_length=255, blank=True, default='')
    category = models.CharField(max_length=100, default='Student Journey')
    excerpt = models.CharField(max_length=500)
    content = models.TextField()
    cover_image_url = models.URLField(blank=True, default='')
    status = models.CharField(max_length=30, choices=STATUS_CHOICES, default='PENDING_REVIEW')
    published_at = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.title} by {self.user.email} ({self.status})"


class CampusAmbassadorApplication(models.Model):
    STATUS_CHOICES = (
        ('APPLIED', 'Applied'),
        ('UNDER_REVIEW', 'Under Review'),
        ('SHORTLISTED', 'Shortlisted'),
        ('ACCEPTED', 'Accepted'),
        ('REJECTED', 'Rejected'),
        ('WITHDRAWN', 'Withdrawn'),
    )

    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='campus_ambassador_applications')
    college = models.CharField(max_length=255)
    campus_location = models.CharField(max_length=255)
    why_join = models.TextField()
    previous_experience = models.TextField(blank=True, default='')
    social_media_links = models.CharField(max_length=500, blank=True, default='')
    availability_hours = models.CharField(max_length=100, default='5-10 hours/week')
    expected_contribution = models.TextField(blank=True, default='')
    status = models.CharField(max_length=30, choices=STATUS_CHOICES, default='APPLIED')
    applied_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ('user', 'college')

    def __str__(self):
        return f"Ambassador Application: {self.user.email} - {self.college} ({self.status})"


class StudentAchievement(models.Model):
    STATUS_CHOICES = (
        ('DRAFT', 'Draft'),
        ('PENDING_REVIEW', 'Pending Review'),
        ('PUBLISHED', 'Published'),
        ('REJECTED', 'Rejected'),
        ('ARCHIVED', 'Archived'),
    )

    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='achievements')
    title = models.CharField(max_length=255)
    organization = models.CharField(max_length=255)
    category = models.CharField(max_length=100, default='Hackathon Winner')
    date_achieved = models.DateField(default=timezone.now)
    description = models.TextField()
    certificate_url = models.URLField(blank=True, default='')
    status = models.CharField(max_length=30, choices=STATUS_CHOICES, default='PENDING_REVIEW')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.title} - {self.user.email} ({self.status})"


# PHASE 6 MODELS: SERVICES, GUIDANCE, SUPPORT, ENQUIRIES & CONTACT

class ServiceCategory(models.Model):
    name = models.CharField(max_length=100, unique=True)
    slug = models.SlugField(max_length=100, unique=True)
    description = models.TextField(blank=True, default='')
    icon_name = models.CharField(max_length=50, default='Settings')
    order = models.IntegerField(default=0)

    def __str__(self):
        return self.name


class ServiceFAQ(models.Model):
    service = models.ForeignKey(SSService, on_delete=models.CASCADE, related_name='faqs', null=True, blank=True)
    question = models.CharField(max_length=255)
    answer = models.TextField()
    order = models.IntegerField(default=0)

    def __str__(self):
        return self.question


class ServicePortfolioItem(models.Model):
    service = models.ForeignKey(SSService, on_delete=models.CASCADE, related_name='portfolio_items', null=True, blank=True)
    title = models.CharField(max_length=255)
    description = models.TextField()
    image_url = models.CharField(max_length=500, blank=True, default='')
    outcome = models.CharField(max_length=255, blank=True, default='')

    def __str__(self):
        return self.title


def generate_enquiry_ref():
    chars = string.ascii_uppercase + string.digits
    rnd = ''.join(random.choices(chars, k=6))
    return f"SS-ENQ-{rnd}"


class ServiceEnquiry(models.Model):
    ENQUIRY_TYPE_CHOICES = (
        ('STUDENT', 'Student'),
        ('COLLEGE', 'College'),
        ('ORGANIZATION', 'Organization'),
        ('COMMUNITY', 'Community'),
        ('PARTNERSHIP', 'Partnership'),
        ('OTHER', 'Other'),
    )

    STATUS_CHOICES = (
        ('NEW', 'New'),
        ('ACKNOWLEDGED', 'Acknowledged'),
        ('IN_REVIEW', 'In Review'),
        ('CONTACTED', 'Contacted'),
        ('IN_PROGRESS', 'In Progress'),
        ('COMPLETED', 'Completed'),
        ('CLOSED', 'Closed'),
    )

    reference_number = models.CharField(max_length=50, unique=True, default=generate_enquiry_ref)
    user = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='service_enquiries')
    service = models.ForeignKey(SSService, on_delete=models.SET_NULL, null=True, blank=True, related_name='enquiries')
    service_name = models.CharField(max_length=255, blank=True, default='')
    enquiry_type = models.CharField(max_length=50, choices=ENQUIRY_TYPE_CHOICES, default='STUDENT')
    full_name = models.CharField(max_length=255)
    email = models.EmailField()
    phone = models.CharField(max_length=50, blank=True, default='')
    organization = models.CharField(max_length=255, blank=True, default='')
    requirement = models.TextField()
    preferred_contact = models.CharField(max_length=50, default='Email')
    expected_timeline = models.CharField(max_length=100, blank=True, default='')
    status = models.CharField(max_length=30, choices=STATUS_CHOICES, default='NEW')
    attachment = models.FileField(upload_to='enquiry_attachments/', null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.reference_number} - {self.full_name} ({self.service_name or 'General'})"


def generate_support_ref():
    date_str = timezone.now().strftime("%Y%m%d")
    rnd = ''.join(random.choices(string.digits, k=4))
    return f"SS-SUP-{date_str}-{rnd}"


class SupportRequest(models.Model):
    CATEGORY_CHOICES = (
        ('Career', 'Career'),
        ('Education', 'Education'),
        ('Internship', 'Internship'),
        ('Job Search', 'Job Search'),
        ('Skills', 'Skills'),
        ('Projects', 'Projects'),
        ('College Life', 'College Life'),
        ('Events', 'Events'),
        ('Technology', 'Technology'),
        ('Community', 'Community'),
        ('Financial Guidance', 'Financial Guidance'),
        ('General', 'General'),
        ('Other', 'Other'),
    )

    STATUS_CHOICES = (
        ('OPEN', 'Open'),
        ('ACKNOWLEDGED', 'Acknowledged'),
        ('IN_PROGRESS', 'In Progress'),
        ('WAITING_FOR_STUDENT', 'Waiting for Student'),
        ('RESOLVED', 'Resolved'),
        ('CLOSED', 'Closed'),
        ('CANCELLED', 'Cancelled'),
    )

    PRIORITY_CHOICES = (
        ('LOW', 'Low'),
        ('NORMAL', 'Normal'),
        ('HIGH', 'High'),
        ('URGENT', 'Urgent'),
    )

    reference_number = models.CharField(max_length=50, unique=True, default=generate_support_ref)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='support_requests')
    category = models.CharField(max_length=100, choices=CATEGORY_CHOICES, default='General')
    subject = models.CharField(max_length=255)
    description = models.TextField()
    preferred_contact = models.CharField(max_length=50, default='Email')
    status = models.CharField(max_length=30, choices=STATUS_CHOICES, default='OPEN')
    priority = models.CharField(max_length=20, choices=PRIORITY_CHOICES, default='NORMAL')
    attachment = models.FileField(upload_to='support_attachments/', null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    resolved_at = models.DateTimeField(null=True, blank=True)

    def __str__(self):
        return f"{self.reference_number} - {self.subject} ({self.status})"


class SupportUpdate(models.Model):
    support_request = models.ForeignKey(SupportRequest, on_delete=models.CASCADE, related_name='updates')
    author = models.ForeignKey(User, on_delete=models.CASCADE)
    is_staff_reply = models.BooleanField(default=False)
    message = models.TextField()
    attachment = models.FileField(upload_to='support_update_attachments/', null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Update on {self.support_request.reference_number} by {self.author.username}"


class ContactMessage(models.Model):
    STATUS_CHOICES = (
        ('NEW', 'New'),
        ('READ', 'Read'),
        ('RESPONDED', 'Responded'),
        ('ARCHIVED', 'Archived'),
    )

    name = models.CharField(max_length=255)
    email = models.EmailField()
    phone = models.CharField(max_length=50, blank=True, default='')
    subject = models.CharField(max_length=255)
    message = models.TextField()
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='NEW')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Contact Msg: {self.name} - {self.subject}"


# ==========================================
# PHASE 7: SS IDENTITY & IMPACT MODELS
# ==========================================

class AboutSection(models.Model):
    title = models.CharField(max_length=255, default="Built by Students, for Students.")
    subtitle = models.TextField(blank=True, default="Struggle of Student (SS) is a student-driven ecosystem designed to ensure no student faces career, skill, or life challenges alone.")
    who_we_are = models.TextField(blank=True, default="Struggle of Student (SS) is a vibrant, supportive community founded by students to bridge the gap between academic education and real-world career opportunities.")
    why_ss_exists = models.TextField(blank=True, default="Students often face isolation, lack of guidance, fragmented opportunity access, and insufficient practical mentorship during their college journey. SS was created to solve these exact problems.")
    mission = models.TextField(default="To create a supportive ecosystem where students can discover opportunities, build skills, solve problems and grow together.")
    vision = models.TextField(default="To build a strong student-driven community where every student can find opportunities to learn, contribute and grow.")
    what_we_do = models.TextField(blank=True, default="We organize practical workshops, connect students with internships and jobs, foster collaborative student projects, showcase student talent, and provide peer mentorship.")
    how_we_help = models.TextField(blank=True, default="Through verified opportunity listings, volunteer experience, campus leadership programs, technical guidance, and career support services.")
    our_community_desc = models.TextField(blank=True, default="A nationwide network of passionate college students, campus ambassadors, student developers, creators, and mentors.")
    our_opportunities_desc = models.TextField(blank=True, default="Curated internships, freelance projects, hackathons, and volunteer positions tailored for college growth.")
    our_services_desc = models.TextField(blank=True, default="End-to-end event management, IT solutions, student band, and career support services powered by student teams.")
    our_impact_desc = models.TextField(blank=True, default="Empowering thousands of students with real skills, career placements, project experience, and leadership roles.")
    founder_quote = models.TextField(blank=True, default="No student should struggle alone. Together, we turn challenges into stepping stones for student growth.")
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"About SS Section (Updated {self.updated_at.strftime('%Y-%m-%d') if self.updated_at else ''})"


class LeadershipMember(models.Model):
    LEADERSHIP_TYPE_CHOICES = (
        ('FOUNDER', 'Founder'),
        ('DIRECTOR', 'Director'),
        ('CORE_LEADERSHIP', 'Core Leadership'),
        ('TEAM_LEAD', 'Team Lead'),
    )

    STATUS_CHOICES = (
        ('PUBLIC', 'Public'),
        ('PRIVATE', 'Private'),
        ('ARCHIVED', 'Archived'),
    )

    name = models.CharField(max_length=255)
    designation = models.CharField(max_length=255)
    leadership_type = models.CharField(max_length=30, choices=LEADERSHIP_TYPE_CHOICES, default='CORE_LEADERSHIP')
    photo = models.ImageField(upload_to='leadership_photos/', blank=True, null=True)
    photo_url = models.CharField(max_length=500, blank=True, default='')
    bio = models.TextField(blank=True, default='')
    area_of_responsibility = models.TextField(blank=True, default='')
    vision_statement = models.TextField(blank=True, default='')
    quote = models.TextField(blank=True, default='')
    linkedin_url = models.URLField(blank=True, default='')
    twitter_url = models.URLField(blank=True, default='')
    github_url = models.URLField(blank=True, default='')
    other_url = models.URLField(blank=True, default='')
    display_order = models.IntegerField(default=0)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='PUBLIC')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def get_photo_display(self):
        if self.photo:
            return self.photo.url
        return self.photo_url or ''

    def __str__(self):
        return f"{self.name} ({self.designation} - {self.leadership_type})"


class TeamMember(models.Model):
    STATUS_CHOICES = (
        ('ACTIVE', 'Active'),
        ('INACTIVE', 'Inactive'),
        ('ARCHIVED', 'Archived'),
    )

    DEPARTMENT_CHOICES = (
        ('Core Team', 'Core Team'),
        ('Technology', 'Technology'),
        ('Events', 'Events'),
        ('Community', 'Community'),
        ('Content', 'Content'),
        ('Marketing', 'Marketing'),
        ('Design', 'Design'),
        ('Operations', 'Operations'),
        ('Volunteer Coordination', 'Volunteer Coordination'),
        ('Partnerships', 'Partnerships'),
    )

    name = models.CharField(max_length=255)
    role = models.CharField(max_length=255)
    department = models.CharField(max_length=100, choices=DEPARTMENT_CHOICES, default='Core Team')
    photo = models.ImageField(upload_to='team_photos/', blank=True, null=True)
    photo_url = models.CharField(max_length=500, blank=True, default='')
    short_bio = models.CharField(max_length=500, blank=True, default='')
    bio = models.TextField(blank=True, default='')
    responsibilities = models.TextField(blank=True, default='')
    skills = models.CharField(max_length=500, blank=True, default='', help_text="Comma-separated skills")
    joined_date = models.DateField(default=datetime.date.today)
    contributions = models.TextField(blank=True, default='')
    linkedin_url = models.URLField(blank=True, default='')
    github_url = models.URLField(blank=True, default='')
    other_url = models.URLField(blank=True, default='')
    display_order = models.IntegerField(default=0)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='ACTIVE')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def get_photo_display(self):
        if self.photo:
            return self.photo.url
        return self.photo_url or ''

    def __str__(self):
        return f"{self.name} - {self.role} ({self.department})"


class Placement(models.Model):
    VERIFICATION_CHOICES = (
        ('PENDING_VERIFICATION', 'Pending Verification'),
        ('VERIFIED', 'Verified'),
        ('REJECTED', 'Rejected'),
        ('ARCHIVED', 'Archived'),
    )

    VISIBILITY_CHOICES = (
        ('PUBLIC', 'Public'),
        ('PRIVATE', 'Private'),
    )

    STUDENT_PRIVACY_CHOICES = (
        ('PUBLIC', 'Public Names Allowed'),
        ('PRIVATE', 'Private (Hide Student Names)'),
        ('ANONYMOUS', 'Anonymous Display'),
    )

    company_name = models.CharField(max_length=255)
    company_logo_url = models.CharField(max_length=500, blank=True, default='')
    roles = models.CharField(max_length=500, help_text="Comma-separated placement roles (e.g. Software Engineer, QA, Analyst)")
    number_of_students = models.IntegerField(default=1)
    placement_year = models.CharField(max_length=10, default="2026")
    location = models.CharField(max_length=255, blank=True, default='')
    description = models.TextField(blank=True, default='')
    verification_status = models.CharField(max_length=30, choices=VERIFICATION_CHOICES, default='VERIFIED')
    visibility = models.CharField(max_length=20, choices=VISIBILITY_CHOICES, default='PUBLIC')
    student_names_visibility = models.CharField(max_length=20, choices=STUDENT_PRIVACY_CHOICES, default='ANONYMOUS')
    student_names = models.TextField(blank=True, default='', help_text="Comma-separated names of placed students if approved")
    testimonials = models.TextField(blank=True, default='', help_text="Student feedback / quotes regarding this placement")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.company_name} - {self.number_of_students} Students Placed ({self.placement_year})"


class SuccessStory(models.Model):
    CATEGORY_CHOICES = (
        ('Placement', 'Placement'),
        ('Internship', 'Internship'),
        ('Career', 'Career'),
        ('Leadership', 'Leadership'),
        ('Project', 'Project'),
        ('Volunteer', 'Volunteer'),
        ('Campus Ambassador', 'Campus Ambassador'),
        ('Skill Development', 'Skill Development'),
    )

    STATUS_CHOICES = (
        ('DRAFT', 'Draft'),
        ('PENDING_REVIEW', 'Pending Review'),
        ('VERIFIED', 'Verified'),
        ('PUBLISHED', 'Published'),
        ('REJECTED', 'Rejected'),
        ('ARCHIVED', 'Archived'),
    )

    student = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='placement_success_stories')
    student_name = models.CharField(max_length=255, default='SS Student')
    is_anonymous = models.BooleanField(default=False)
    title = models.CharField(max_length=255)
    category = models.CharField(max_length=50, choices=CATEGORY_CHOICES, default='Placement')
    excerpt = models.CharField(max_length=500)
    story = models.TextField(help_text="Detailed journey and success story")
    challenge = models.TextField(blank=True, default='')
    how_ss_helped = models.TextField(blank=True, default='')
    outcome = models.CharField(max_length=255, help_text="e.g. Secured Software Engineer role at Tech Start")
    company = models.CharField(max_length=255, blank=True, default='')
    role = models.CharField(max_length=255, blank=True, default='')
    photo_url = models.CharField(max_length=500, blank=True, default='')
    student_quote = models.TextField(blank=True, default='')
    verification_status = models.CharField(max_length=30, choices=STATUS_CHOICES, default='PUBLISHED')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def get_display_name(self):
        if self.is_anonymous:
            return "Anonymous Student"
        return self.student_name

    def __str__(self):
        return f"{self.title} ({self.category} - {self.verification_status})"


class Partner(models.Model):
    PARTNERSHIP_TYPE_CHOICES = (
        ('College', 'College / University'),
        ('Company', 'Company / Corporate'),
        ('Community', 'Community Partner'),
        ('Collaborator', 'Collaborator'),
    )

    STATUS_CHOICES = (
        ('ACTIVE', 'Active'),
        ('INACTIVE', 'Inactive'),
    )

    name = models.CharField(max_length=255)
    logo_url = models.CharField(max_length=500, blank=True, default='')
    partnership_type = models.CharField(max_length=50, choices=PARTNERSHIP_TYPE_CHOICES, default='Company')
    description = models.TextField(blank=True, default='')
    website = models.URLField(blank=True, default='')
    display_order = models.IntegerField(default=0)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='ACTIVE')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.name} ({self.partnership_type})"


class Testimonial(models.Model):
    VERIFICATION_CHOICES = (
        ('PENDING_REVIEW', 'Pending Review'),
        ('APPROVED', 'Approved'),
        ('REJECTED', 'Rejected'),
        ('ARCHIVED', 'Archived'),
    )

    VISIBILITY_CHOICES = (
        ('PUBLIC', 'Public'),
        ('PRIVATE', 'Private'),
    )

    author_name = models.CharField(max_length=255)
    role = models.CharField(max_length=255, help_text="e.g. B.Tech Student, Placement Recipient, Ambassador")
    organization = models.CharField(max_length=255, blank=True, default='', help_text="College or company name")
    photo_url = models.CharField(max_length=500, blank=True, default='')
    message = models.TextField()
    category = models.CharField(max_length=100, default='General')
    verification_status = models.CharField(max_length=30, choices=VERIFICATION_CHOICES, default='APPROVED')
    visibility = models.CharField(max_length=20, choices=VISIBILITY_CHOICES, default='PUBLIC')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Testimonial from {self.author_name} ({self.verification_status})"


class OrganizationMilestone(models.Model):
    CATEGORY_CHOICES = (
        ('CAREER', 'Career'),
        ('LEARNING', 'Learning'),
        ('COMMUNITY', 'Community'),
        ('PROJECTS', 'Projects'),
    )

    year = models.CharField(max_length=10)
    title = models.CharField(max_length=255)
    description = models.TextField()
    category = models.CharField(max_length=50, choices=CATEGORY_CHOICES, default='COMMUNITY')
    display_order = models.IntegerField(default=0)

    def __str__(self):
        return f"{self.year} - {self.title}"


class ImpactMetric(models.Model):
    CATEGORY_CHOICES = (
        ('CAREER', 'Career Impact'),
        ('LEARNING', 'Learning Impact'),
        ('COMMUNITY', 'Community Growth'),
        ('PROJECTS', 'Student Innovation'),
    )

    name = models.CharField(max_length=100)
    value = models.CharField(max_length=50)
    description = models.CharField(max_length=255)
    category = models.CharField(max_length=50, choices=CATEGORY_CHOICES, default='COMMUNITY')
    display_order = models.IntegerField(default=0)
    is_active = models.BooleanField(default=True)

    def __str__(self):
        return f"{self.name}: {self.value}"


# ==========================================
# PHASE 9: ADMIN & AUDIT MODELS
# ==========================================

class AuditLog(models.Model):
    user = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='audit_logs')
    admin_name = models.CharField(max_length=255, default='System Admin')
    admin_role = models.CharField(max_length=50, default='ADMIN')
    action = models.CharField(max_length=255)
    module = models.CharField(max_length=100)
    record_id = models.CharField(max_length=100, blank=True, default='')
    record_repr = models.CharField(max_length=255, blank=True, default='')
    previous_value = models.TextField(blank=True, default='')
    new_value = models.TextField(blank=True, default='')
    ip_address = models.GenericIPAddressField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.created_at.strftime('%Y-%m-%d %H:%M')} - {self.admin_name} ({self.action})"


class ContentRevision(models.Model):
    module = models.CharField(max_length=100)
    record_id = models.CharField(max_length=100, blank=True, default='')
    title = models.CharField(max_length=255)
    previous_content = models.TextField(blank=True, default='')
    updated_content = models.TextField(blank=True, default='')
    updated_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Revision for {self.module} by {self.updated_by}"


class SiteSetting(models.Model):
    organization_name = models.CharField(max_length=255, default="Struggle of Student")
    tagline = models.CharField(max_length=255, default="DREAM - LEARN - GROW - TOGETHER")
    contact_email = models.EmailField(default="support@struggleofstudent.org")
    contact_phone = models.CharField(max_length=50, default="+91 98765 43210")
    address = models.CharField(max_length=255, default="SS Community Hub, India")
    linkedin_url = models.URLField(blank=True, default="https://linkedin.com/company/struggleofstudent")
    instagram_url = models.URLField(blank=True, default="https://instagram.com/struggleofstudent")
    youtube_url = models.URLField(blank=True, default="https://youtube.com/@struggleofstudent")
    twitter_url = models.URLField(blank=True, default="https://twitter.com/struggleofstudent")
    github_url = models.URLField(blank=True, default="https://github.com/struggleofstudent")
    default_session_capacity = models.IntegerField(default=100)
    default_event_capacity = models.IntegerField(default=200)
    enable_community_moderation = models.BooleanField(default=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Site Settings (Updated {self.updated_at.strftime('%Y-%m-%d') if self.updated_at else ''})"


# ==========================================
# PHASE 10: NOTIFICATION & COMMUNICATION MODELS
# ==========================================

class Notification(models.Model):
    TYPE_CHOICES = (
        ('APPLICATION', 'Application'),
        ('OPPORTUNITY', 'Opportunity'),
        ('EVENT', 'Event'),
        ('VOLUNTEER', 'Volunteer'),
        ('SESSION', 'Session'),
        ('WORKSHOP', 'Workshop'),
        ('SUPPORT', 'Support'),
        ('ENQUIRY', 'Service Enquiry'),
        ('COMMUNITY', 'Community'),
        ('PROJECT', 'Project'),
        ('TALENT', 'Talent'),
        ('PLACEMENT', 'Placement'),
        ('ACCOUNT', 'Account'),
        ('SYSTEM', 'System'),
    )

    PRIORITY_CHOICES = (
        ('LOW', 'Low'),
        ('NORMAL', 'Normal'),
        ('HIGH', 'High'),
        ('URGENT', 'Urgent'),
    )

    STATUS_CHOICES = (
        ('UNREAD', 'Unread'),
        ('READ', 'Read'),
        ('ARCHIVED', 'Archived'),
    )

    recipient = models.ForeignKey(User, on_delete=models.CASCADE, related_name='notifications')
    notification_type = models.CharField(max_length=30, choices=TYPE_CHOICES, default='SYSTEM')
    title = models.CharField(max_length=255)
    message = models.TextField()
    priority = models.CharField(max_length=20, choices=PRIORITY_CHOICES, default='NORMAL')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='UNREAD')
    cta_url = models.CharField(max_length=500, blank=True, default='')
    related_object_type = models.CharField(max_length=100, blank=True, default='')
    related_object_id = models.CharField(max_length=100, blank=True, default='')
    created_at = models.DateTimeField(auto_now_add=True)
    read_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['recipient', 'status']),
            models.Index(fields=['recipient', 'created_at']),
        ]

    def __str__(self):
        return f"[{self.notification_type}] {self.title} -> {self.recipient.email}"


class NotificationPreference(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='notification_preference')
    opportunity_alerts = models.BooleanField(default=True)
    event_updates = models.BooleanField(default=True)
    session_updates = models.BooleanField(default=True)
    community_updates = models.BooleanField(default=True)
    application_updates = models.BooleanField(default=True)
    email_enabled = models.BooleanField(default=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Preferences for {self.user.email}"


class EmailLog(models.Model):
    STATUS_CHOICES = (
        ('QUEUED', 'Queued'),
        ('SENDING', 'Sending'),
        ('SENT', 'Sent'),
        ('FAILED', 'Failed'),
        ('RETRYING', 'Retrying'),
        ('CANCELLED', 'Cancelled'),
    )

    CHANNEL_CHOICES = (
        ('IN_APP', 'In App'),
        ('EMAIL', 'Email'),
        ('SMS', 'SMS (Future)'),
        ('PUSH', 'Push (Future)'),
    )

    recipient = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='email_logs')
    recipient_email = models.EmailField()
    channel = models.CharField(max_length=20, choices=CHANNEL_CHOICES, default='EMAIL')
    template_name = models.CharField(max_length=100)
    subject = models.CharField(max_length=255)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='QUEUED')
    attempt_count = models.IntegerField(default=0)
    error_message = models.TextField(blank=True, default='')
    sent_at = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['status', 'created_at']),
        ]

    def __str__(self):
        return f"Email ({self.status}) to {self.recipient_email}: {self.subject}"


class ScheduledReminder(models.Model):
    STATUS_CHOICES = (
        ('PENDING', 'Pending'),
        ('SENT', 'Sent'),
        ('CANCELLED', 'Cancelled'),
    )

    event = models.ForeignKey(Event, on_delete=models.CASCADE, related_name='scheduled_reminders', null=True, blank=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='event_reminders', null=True, blank=True)
    reminder_type = models.CharField(max_length=50, default='24_HOURS_BEFORE')
    scheduled_for = models.DateTimeField()
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='PENDING')
    sent_at = models.DateTimeField(null=True, blank=True)
    idempotency_key = models.CharField(max_length=255, unique=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['scheduled_for']

    def __str__(self):
        return f"Reminder ({self.reminder_type}) for {self.user.email if self.user else 'All'} at {self.scheduled_for}"




