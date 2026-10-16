import os
import django
import datetime

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

from django.utils import timezone
from django.contrib.auth.models import User
from api.models import (
    Opportunity, Event, SSService, CommunityStat, Skill, Interest, 
    OpportunityCategory, EventCategory, EventRegistration, VolunteerRole, VolunteerApplication,
    TalentProfile, TalentCategory, StudentProject, ProjectCategory, StudentStory,
    CampusAmbassadorApplication, StudentAchievement, StudentProfile,
    AboutSection, LeadershipMember, TeamMember, Placement, SuccessStory,
    Partner, Testimonial, OrganizationMilestone, ImpactMetric,
    SessionSpeaker, MeetingInfo, WaitlistEntry, SessionFeedback,
    AuditLog, ContentRevision, SiteSetting
)



def seed_data():
    print("Seeding Phase 3 Opportunities & Platform Data into MySQL via Django ORM...")

    # Seed Default Skills
    skill_names = [
        "Python", "Java", "JavaScript", "React", "Django", "SQL", 
        "UI/UX Design", "Graphic Design", "Video Editing", "Photography", 
        "Communication", "Leadership", "Public Speaking", "Social Media Management", "Event Management"
    ]
    skill_objs = {}
    for name in skill_names:
        s, _ = Skill.objects.get_or_create(name=name)
        skill_objs[name] = s
    print(f"Verified {len(skill_objs)} skills.")

    # Seed Default Categories
    categories = [
        "Internships", "IT Jobs", "Non IT Jobs", "Jobs", "Campus Ambassador", "Volunteering", 
        "Events", "Talent Showcase", "Leadership", "Workshops & Sessions", 
        "Student Projects", "Collaborations", "Other Opportunities"
    ]
    for cat in categories:
        slug = cat.lower().replace(" ", "-").replace("&", "and")
        OpportunityCategory.objects.get_or_create(name=cat, defaults={"slug": slug})

    # Clear and Seed Opportunities
    Opportunity.objects.all().delete()

    today = datetime.date.today()
    opps = [
        {
            "title": "Software Development Intern",
            "organization_name": "TechStart Innovations",
            "category": "Internships",
            "mode": "Online",
            "location": "Remote / Hyderabad",
            "work_type": "Remote",
            "experience_level": "Beginner",
            "stipend": "Rs.12,000 / month",
            "short_description": "Build modern React frontends and Python Django REST API services for real-world startup products.",
            "description": "Join an energetic startup team to build intuitive web interfaces, write clean Django ORM code, and participate in daily agile standups.",
            "responsibilities": "Develop React components\nIntegrate REST APIs using Axios\nCollaborate on Git workflows and code reviews",
            "requirements": "Basic proficiency in JavaScript, React, or Python\nUnderstanding of REST concepts\nPassion for software engineering",
            "eligibility": "Undergraduate B.Tech / B.E / B.Sc Computer Science students (2025 - 2028 batch)",
            "benefits": "Certificate of Internship, Paid Stipend, Performance bonus, Mentorship",
            "application_deadline": today + datetime.timedelta(days=20),
            "status": "OPEN",
            "tags": "Python, React, Django, Git",
            "is_featured": True,
            "skills_assigned": ["Python", "React", "Django", "JavaScript"]
        },
        {
            "title": "Full-Stack Web Developer (Associate)",
            "organization_name": "CloudMatrix Systems",
            "category": "IT Jobs",
            "mode": "Online",
            "location": "Remote / Bangalore",
            "work_type": "Full-time",
            "experience_level": "Beginner",
            "stipend": "Rs.4.5 - Rs.6.5 LPA",
            "short_description": "Junior Full-Stack developer role working with React.js, Node.js, and Cloud Infrastructure.",
            "description": "Exciting entry-level software engineering role for graduating students with strong problem-solving skills, JavaScript/Python proficiency, and database fundamentals.",
            "responsibilities": "Build responsive web applications\nOptimize SQL & NoSQL queries\nParticipate in code reviews and CI/CD pipelines",
            "requirements": "Strong foundation in Data Structures, Web Technologies, and Git\nDegree in CS, IT, or related fields",
            "eligibility": "2025/2026 Batch Graduates",
            "benefits": "Full-time salary, Remote flexibility, Health insurance, Learning allowance",
            "application_deadline": today + datetime.timedelta(days=25),
            "status": "OPEN",
            "tags": "JavaScript, React, Node.js, SQL, Full-Stack",
            "is_featured": True,
            "skills_assigned": ["JavaScript", "React", "SQL"]
        },
        {
            "title": "Junior Data Analyst & SQL Engineer",
            "organization_name": "AnalyticsCore India",
            "category": "IT Jobs",
            "mode": "Hybrid",
            "location": "Hyderabad",
            "work_type": "Full-time",
            "experience_level": "Beginner",
            "stipend": "Rs.4.0 - Rs.5.5 LPA",
            "short_description": "Query large MySQL datasets, generate business dashboards, and automate reporting pipelines.",
            "description": "Work directly with data scientists and business analysts to transform raw operational data into actionable insights.",
            "responsibilities": "Write complex SQL queries and views\nBuild dashboards in PowerBI/Tableau\nClean and validate data streams",
            "requirements": "Strong SQL skills, basic Python/R knowledge, analytical mindset",
            "eligibility": "Graduating students in Engineering, Statistics, or Math",
            "benefits": "Mentorship from Senior Analysts, Hybrid Work, Health Benefits",
            "application_deadline": today + datetime.timedelta(days=18),
            "status": "OPEN",
            "tags": "SQL, Python, Analytics, Data",
            "is_featured": True,
            "skills_assigned": ["SQL", "Python"]
        },
        {
            "title": "Business Development & Operations Executive",
            "organization_name": "GrowthSpark Solutions",
            "category": "Non IT Jobs",
            "mode": "Offline",
            "location": "Hyderabad",
            "work_type": "Full-time",
            "experience_level": "Beginner",
            "stipend": "Rs.3.5 - Rs.4.8 LPA",
            "short_description": "Drive client outreach, campus partnerships, and lead community expansion initiatives.",
            "description": "Dynamic entry-level role for non-tech and management graduates passionate about communications, client relationships, and business growth.",
            "responsibilities": "Conduct college outreach and partnerships\nManage client onboarding pipelines\nOrganize promotional events and offline campaigns",
            "requirements": "Excellent verbal and written communication\nProblem-solving attitude\nNegotiation skills",
            "eligibility": "BBA, MBA, B.Com, B.A or B.Tech graduates with strong communication",
            "benefits": "Performance incentives, Rapid career growth, Travel allowance",
            "application_deadline": today + datetime.timedelta(days=30),
            "status": "OPEN",
            "tags": "Communication, Sales, Operations, Business",
            "is_featured": True,
            "skills_assigned": ["Communication", "Leadership"]
        },
        {
            "title": "HR & Community Operations Coordinator",
            "organization_name": "Struggle of Student Network",
            "category": "Non IT Jobs",
            "mode": "Online",
            "location": "Remote",
            "work_type": "Full-time / Part-time",
            "experience_level": "Beginner",
            "stipend": "Rs.3.0 - Rs.4.2 LPA",
            "short_description": "Coordinate student member onboarding, volunteer recruitment, and community event scheduling.",
            "description": "Manage human relations, member queries, and volunteer workflows across SS regional campus chapters.",
            "responsibilities": "Screen volunteer and ambassador applications\nHost community onboarding webinars\nMaintain member databases",
            "requirements": "Strong interpersonal skills, organization skills, empathy",
            "eligibility": "Open to all graduates and final year students",
            "benefits": "Remote flexibility, Leadership certificate, Stipend/Salary",
            "application_deadline": today + datetime.timedelta(days=14),
            "status": "OPEN",
            "tags": "HR, Management, Operations, Communication",
            "is_featured": True,
            "skills_assigned": ["Communication", "Event Management"]
        },
        {
            "title": "Content & Social Media Strategist",
            "organization_name": "YouthPulse Media",
            "category": "Internships",
            "mode": "Online",
            "location": "Remote",
            "work_type": "Remote",
            "experience_level": "Beginner",
            "stipend": "Rs.8,000 / month",
            "short_description": "Craft authentic student stories, Instagram reels, and community engagement posts across platforms.",
            "description": "Help shape the voice of a student-focused media brand. Write compelling copy, design Canva posts, and analyze engagement metrics.",
            "responsibilities": "Create weekly social media content calendars\nDraft authentic student stories and interviews\nMonitor engagement metrics",
            "requirements": "Strong written communication\nBasic Canva or Figma skills\nActive social media presence",
            "eligibility": "Open to all undergraduate students regardless of branch",
            "benefits": "Certificate of Completion, Stipend, Media Exposure",
            "application_deadline": today + datetime.timedelta(days=2),
            "status": "CLOSING_SOON",
            "tags": "Content Creation, Canva, Social Media Management, Communication",
            "is_featured": True,
            "skills_assigned": ["Communication", "Social Media Management", "Graphic Design"]
        },
        {
            "title": "SS Campus Ambassador Lead",
            "organization_name": "Struggle of Student (SS)",
            "category": "Campus Ambassador",
            "mode": "Offline",
            "location": "Your College Campus",
            "work_type": "On-Campus",
            "experience_level": "Beginner",
            "stipend": "Certificate & Performance Incentives",
            "short_description": "Represent SS on your campus, organize student workshops, and connect peers with career opportunities.",
            "description": "Be the primary liaison for Struggle of Student on your campus. Coordinate event registrations, lead student clubs, and build a regional student network.",
            "responsibilities": "Promote SS community events on campus\nIdentify student talent for showcasing\nOrganize campus meetup groups",
            "requirements": "Strong leadership skills\nActive involvement in college fests or clubs\nEnthusiasm for helping fellow students",
            "eligibility": "Current college students (1st, 2nd, or 3rd year)",
            "benefits": "Official Ambassador Certificate, Leadership Badge, Free access to paid workshops",
            "application_deadline": today + datetime.timedelta(days=45),
            "status": "OPEN",
            "tags": "Leadership, Public Speaking, Event Management, Communication",
            "is_featured": True,
            "skills_assigned": ["Leadership", "Public Speaking", "Communication", "Event Management"]
        },
        {
            "title": "Event Media & Photography Lead",
            "organization_name": "SS Events Team",
            "category": "Volunteering",
            "mode": "Offline",
            "location": "Hyderabad",
            "work_type": "On-site",
            "experience_level": "Intermediate",
            "stipend": "Project-based Allowance & Media Credit",
            "short_description": "Capture candid photography, video highlights, and stage moments during SS campus hackathons and meets.",
            "description": "Join the SS event production team. Capture high-resolution photo highlights, edit highlight reels, and work directly with event organizers.",
            "responsibilities": "Photograph workshops and networking meets\nEdit photo highlights using Lightroom/Photoshop\nProduce short event recap videos",
            "requirements": "Experience with DSLR/Mirrorless cameras or high-end mobile photography\nBasic editing skills",
            "eligibility": "Students with passion for photography and visual storytelling",
            "benefits": "Portfolio Feature, Event Allowance, Professional Equipment Exposure",
            "application_deadline": today + datetime.timedelta(days=15),
            "status": "OPEN",
            "tags": "Photography, Video Editing, Event Management",
            "is_featured": True,
            "skills_assigned": ["Photography", "Video Editing", "Event Management"]
        },
        {
            "title": "UI/UX Design Contributor for Student Products",
            "organization_name": "SS Product Studio",
            "category": "Student Projects",
            "mode": "Online",
            "location": "Remote",
            "work_type": "Remote",
            "experience_level": "Intermediate",
            "stipend": "Verified Project Certificate & Portfolio Showcase",
            "short_description": "Design user flows, wireframes, and modern mobile interfaces for open student platform features.",
            "description": "Collaborate with full-stack student developers to design intuitive UI/UX for future SS platform modules. Conduct user interviews with real college students.",
            "responsibilities": "Create Figma wireframes and design systems\nDesign accessible mobile component layouts\nConduct user usability testing",
            "requirements": "Figma proficiency\nUnderstanding of color contrast, typography, and component hierarchy",
            "eligibility": "Designers and students with Figma portfolio examples",
            "benefits": "Live Product Portfolio Case Study, Verified Mentorship",
            "application_deadline": today + datetime.timedelta(days=30),
            "status": "OPEN",
            "tags": "UI/UX Design, Figma, Graphic Design",
            "is_featured": False,
            "skills_assigned": ["UI/UX Design", "Graphic Design"]
        },
        {
            "title": "Python & Django Backend Associate",
            "organization_name": "DataCraft Tech",
            "category": "IT Jobs",
            "mode": "Hybrid",
            "location": "Hyderabad",
            "work_type": "Full-time",
            "experience_level": "Advanced",
            "stipend": "Rs.25,000 / month",
            "short_description": "Build microservices, MySQL database queries, and REST APIs for scalable enterprise web platforms.",
            "description": "Entry-level full-time opening for graduating students. Work on Django ORM models, MySQL optimization, and REST API deployment.",
            "responsibilities": "Develop backend API endpoints using DRF\nOptimize SQL queries and database schemas\nDeploy applications on AWS/Vercel",
            "requirements": "Strong Python, Django, and MySQL knowledge\nFamiliarity with Git and Docker",
            "eligibility": "Final year students or 2025/2026 graduates",
            "benefits": "Competitive starting salary, Health insurance, Hybrid flexibility",
            "application_deadline": today - datetime.timedelta(days=5),
            "status": "CLOSED",
            "tags": "Python, Django, SQL, Java",
            "is_featured": False,
            "skills_assigned": ["Python", "Django", "SQL", "Java"]
        }
    ]

    for item in opps:
        skills_assigned = item.pop("skills_assigned", [])
        opp_obj = Opportunity.objects.create(**item)
        for sname in skills_assigned:
            if sname in skill_objs:
                opp_obj.skills.add(skill_objs[sname])

    print(f"Seeded {len(opps)} realistic opportunities into MySQL database.")

    # Clear and Seed Session Speakers
    SessionSpeaker.objects.all().delete()

    speaker1 = SessionSpeaker.objects.create(
        name="Karthik R.",
        designation="Founder & Lead Architect",
        organization="Struggle of Student (SS)",
        bio="Full-Stack Developer and Student Advocate building community-driven platforms for 1,200+ students across India.",
        linkedin_url="https://linkedin.com/in/ss-karthik"
    )

    speaker2 = SessionSpeaker.objects.create(
        name="Ananya Sharma",
        designation="Senior AI Engineer",
        organization="CloudMatrix Systems",
        bio="Specializes in Generative AI, RAG pipelines, and scalable backend infrastructure. Passionate about mentoring college students.",
        linkedin_url="https://linkedin.com/in/ananya-sharma-ai"
    )

    speaker3 = SessionSpeaker.objects.create(
        name="Vikram Reddy",
        designation="Product Lead & Tech Recruiter",
        organization="TechStart Innovations",
        bio="Tech hiring manager with experience screening over 5,000 student resumes and conducting tech interviews.",
        linkedin_url="https://linkedin.com/in/vikram-reddy-tech"
    )

    speaker4 = SessionSpeaker.objects.create(
        name="Dr. R. K. Varma",
        designation="Director of Student Growth",
        organization="SS Career Advisory Board",
        bio="Former Head of Placement & Career Guidance with 15+ years experience mentoring engineering & degree graduates.",
        linkedin_url="https://linkedin.com/in/dr-rk-varma"
    )
    print("Seeded 4 verified Session Speakers.")

    # Clear and Seed Events & Sessions
    Event.objects.all().delete()

    today = datetime.date.today()
    events_data = [
        {
            "title": "Building Your First Web Application",
            "slug": "building-your-first-web-app",
            "category": "Workshop",
            "session_type": "TECHNICAL_SESSION",
            "short_description": "Learn to build modern full-stack web applications using React, Django REST Framework, and MySQL.",
            "description": "Step-by-step technical workshop for students looking to move beyond static HTML and build production-grade web applications. We will build a live application from scratch, cover RESTful design patterns, and deploy with database persistence.",
            "agenda": "6:00 PM - Architecture Overview (React + Django + DRF)\n6:30 PM - Live Coding: Database Models & REST API Creation\n7:15 PM - Connecting React Frontend & State Management\n7:30 PM - Q&A & Project Showcase Setup",
            "topics": "React, Django, REST APIs, MySQL, Web Development",
            "prerequisites": "Basic understanding of JavaScript and Python concepts.",
            "who_should_attend": "B.Tech, B.Sc CS, BCA, and engineering students interested in full-stack web development.",
            "what_you_will_learn": "1. Designing relational database schemas in MySQL via Django ORM\n2. Building secure JWT REST APIs\n3. Connecting Vite React components to live endpoints",
            "organizer": "SS Technology Guild",
            "mode": "Online",
            "location": "Online Zoom",
            "meeting_provider": "ZOOM",
            "zoom_meeting_id": "892 4812 0019",
            "zoom_passcode": "SS2026",
            "meeting_url": "https://zoom.us/j/89248120019",
            "start_datetime": timezone.make_aware(datetime.datetime(2026, 10, 28, 18, 0, 0)),
            "end_datetime": timezone.make_aware(datetime.datetime(2026, 10, 28, 19, 30, 0)),
            "registration_deadline": timezone.make_aware(datetime.datetime(2026, 10, 28, 17, 0, 0)),
            "participant_capacity": 100,
            "volunteer_capacity": 5,
            "status": "REGISTRATION_OPEN",
            "is_published": True,
            "is_featured": True,
            "speaker_objs": [speaker1],
            "roles": [
                {"title": "Technical TA", "capacity": 3, "description": "Assist students with code debugging during live Q&A.", "requirements": "React or Python familiarity"},
                {"title": "Session Host", "capacity": 2, "description": "Manage check-ins, record highlights, and handle chat.", "requirements": "Punctual, friendly"}
            ]
        },
        {
            "title": "AI Career Roadmap & Hands-on LLM Masterclass",
            "slug": "ai-career-roadmap-workshop",
            "category": "Workshop",
            "session_type": "WORKSHOP",
            "short_description": "Master real-world AI tools, Python LLM frameworks, and craft an AI-proof tech resume.",
            "description": "Step-by-step masterclass on how to leverage generative AI models, build custom RAG pipelines, and position yourself for high-demand AI engineering internships.",
            "agenda": "5:00 PM - Introduction & Landscape of AI Careers\n5:45 PM - Hands-on Demo: Building an API Agent with Python\n6:45 PM - Resume Review & Portfolio Q&A",
            "topics": "AI, Machine Learning, Python, LLMs, Prompt Engineering",
            "prerequisites": "Interest in Artificial Intelligence and Python basics.",
            "who_should_attend": "All tech enthusiasts, CS/IT students, and aspiring data engineers.",
            "what_you_will_learn": "1. Building custom RAG agents with LangChain\n2. Optimizing LLM API calls safely\n3. Highlighting AI projects on your developer resume",
            "organizer": "SS Tech Guild & AI Club",
            "mode": "Online",
            "location": "Online Zoom",
            "meeting_provider": "ZOOM",
            "zoom_meeting_id": "910 3341 9821",
            "zoom_passcode": "AI2026",
            "meeting_url": "https://zoom.us/j/91033419821",
            "start_datetime": timezone.make_aware(datetime.datetime(2026, 10, 30, 17, 0, 0)),
            "end_datetime": timezone.make_aware(datetime.datetime(2026, 10, 30, 19, 30, 0)),
            "registration_deadline": timezone.make_aware(datetime.datetime(2026, 10, 30, 16, 0, 0)),
            "participant_capacity": 150,
            "volunteer_capacity": 6,
            "status": "REGISTRATION_OPEN",
            "is_published": True,
            "is_featured": True,
            "speaker_objs": [speaker2],
            "roles": [
                {"title": "Chat Moderator", "capacity": 3, "description": "Filter Q&A questions and keep chat interactive.", "requirements": "Good communication, online attendance"},
                {"title": "Technical Helper", "capacity": 3, "description": "Help students troubleshoot code snippets.", "requirements": "Python & API familiarity"}
            ]
        },
        {
            "title": "Resume & Off-Campus Placement Masterclass",
            "slug": "resume-offcampus-placement-masterclass",
            "category": "Career Session",
            "session_type": "CAREER_SESSION",
            "short_description": "Learn off-campus hiring hacks, resume formatting, LinkedIn outreach, and cold email strategies.",
            "description": "Exclusive career guidance session focusing on how to land interview calls from tier-1 & tier-2 tech companies without campus placement support.",
            "agenda": "4:00 PM - The ATS Resume Checklist\n4:45 PM - Cold Email Templates that Get Responses\n5:30 PM - Live Mock Interview Breakdown",
            "topics": "Career Growth, Resume Design, Off-Campus Placements, LinkedIn Networking",
            "prerequisites": "Updated student resume draft.",
            "who_should_attend": "Pre-final and final year college students seeking internships or entry-level jobs.",
            "what_you_will_learn": "1. Structuring ATS-optimized resume sections\n2. Reaching out directly to engineering managers on LinkedIn\n3. Answering behavioral and technical interview questions",
            "organizer": "SS Career Guidance Cell",
            "mode": "Online",
            "location": "Online Google Meet",
            "meeting_provider": "GOOGLE_MEET",
            "meeting_url": "https://meet.google.com/ss-career-masterclass",
            "start_datetime": timezone.make_aware(datetime.datetime(2026, 11, 5, 16, 0, 0)),
            "end_datetime": timezone.make_aware(datetime.datetime(2026, 11, 5, 18, 0, 0)),
            "registration_deadline": timezone.make_aware(datetime.datetime(2026, 11, 5, 15, 0, 0)),
            "participant_capacity": 80,
            "volunteer_capacity": 4,
            "status": "REGISTRATION_OPEN",
            "is_published": True,
            "is_featured": True,
            "speaker_objs": [speaker3, speaker4],
            "roles": [
                {"title": "Q&A Coordinator", "capacity": 4, "description": "Collect student questions and spotlight top queries.", "requirements": "Active communication"}
            ]
        },
        {
            "title": "Student Startup Meetup 2026",
            "slug": "student-startup-meetup-2026",
            "category": "Meetup",
            "session_type": "COMMUNITY_SESSION",
            "short_description": "Connect with student founders, builders and aspiring entrepreneurs in Hyderabad.",
            "description": "Join over 100+ ambitious student creators, pitch your ideas, find co-founders, and network with regional startup mentors and incubators.",
            "agenda": "5:30 PM - Check-in & Coffee\n6:00 PM - Keynote: Building from Hostel Rooms\n7:00 PM - 60-Second Student Elevator Pitches\n8:00 PM - Networking & Mentorship Mixer",
            "topics": "Entrepreneurship, Startups, Product Building, Networking",
            "prerequisites": "Enthusiasm for building startups and meeting peers.",
            "who_should_attend": "All college students with startup ideas or project MVPs.",
            "what_you_will_learn": "1. Validating startup ideas with zero initial budget\n2. Pitching to student co-founders\n3. Connecting with T-Hub incubators",
            "organizer": "Struggle of Student (SS) Founders Club",
            "mode": "Offline",
            "location": "T-Hub Phase 2, Madhapur, Hyderabad",
            "meeting_provider": "OTHER",
            "start_datetime": timezone.make_aware(datetime.datetime(2026, 10, 25, 18, 0, 0)),
            "end_datetime": timezone.make_aware(datetime.datetime(2026, 10, 25, 21, 0, 0)),
            "participant_capacity": 100,
            "volunteer_capacity": 14,
            "status": "REGISTRATION_OPEN",
            "is_published": True,
            "is_featured": True,
            "speaker_objs": [speaker1, speaker3],
            "roles": [
                {"title": "Registration Desk", "capacity": 5, "description": "Manage attendee check-in and issue name badges.", "requirements": "Punctual, friendly"},
                {"title": "Event Coordination", "capacity": 4, "description": "Assist with seating and stage management.", "requirements": "Active communication"}
            ]
        },
        {
            "title": "Advanced Full-Stack Engineering Bootcamp (Completed)",
            "slug": "advanced-full-stack-bootcamp-past",
            "category": "Workshop",
            "session_type": "WORKSHOP",
            "short_description": "Comprehensive 3-hour deep dive into Django REST Framework serialization and React Query state.",
            "description": "Recorded live session covering high-throughput database queries, custom DRF serializers, and clean component structures.",
            "agenda": "Completed Live Stream Recording.",
            "topics": "Django, DRF, React Query, Database Optimization",
            "prerequisites": "Python & JavaScript basics.",
            "who_should_attend": "Web engineering students.",
            "what_you_will_learn": "1. Optimizing ORM queries\n2. Building responsive frontend state",
            "organizer": "SS Tech Guild",
            "mode": "Online",
            "location": "Online Live Stream",
            "meeting_provider": "ZOOM",
            "meeting_url": "https://youtube.com/watch?v=ss_sample_recording",
            "recording_url": "https://youtube.com/watch?v=ss_sample_recording",
            "recording_visibility": "REGISTERED_PARTICIPANTS",
            "recording_available_date": today - datetime.timedelta(days=10),
            "start_datetime": timezone.make_aware(datetime.datetime(2026, 9, 15, 18, 0, 0)),
            "end_datetime": timezone.make_aware(datetime.datetime(2026, 9, 15, 21, 0, 0)),
            "participant_capacity": 120,
            "volunteer_capacity": 2,
            "status": "COMPLETED",
            "is_published": True,
            "is_featured": False,
            "speaker_objs": [speaker1],
            "roles": []
        }
    ]

    for edata in events_data:
        roles_data = edata.pop("roles", [])
        speaker_objs = edata.pop("speaker_objs", [])
        event_obj = Event.objects.create(**edata)
        if speaker_objs:
            event_obj.speakers.set(speaker_objs)
        for rdata in roles_data:
            VolunteerRole.objects.create(event=event_obj, **rdata)

        if event_obj.mode in ['Online', 'Hybrid']:
            MeetingInfo.objects.get_or_create(
                event=event_obj,
                defaults={
                    'provider': event_obj.meeting_provider,
                    'external_meeting_id': event_obj.zoom_meeting_id or 'SS-MEET-001',
                    'join_url': event_obj.meeting_url or 'https://zoom.us/j/89248120019',
                    'passcode': event_obj.zoom_passcode or 'SS2026',
                    'status': 'ACTIVE'
                }
            )

    print(f"Seeded {len(events_data)} realistic events and online sessions into MySQL database.")

    # Seed Demo Student User for Showcase
    demo_user, created = User.objects.get_or_create(
        username="rahul_kumar",
        defaults={
            "email": "rahul_kumar@example.com",
            "first_name": "Rahul",
            "last_name": "Kumar"
        }
    )
    if created:
        demo_user.set_password("Password123!")
        demo_user.save()

    demo_profile, _ = StudentProfile.objects.get_or_create(
        user=demo_user,
        defaults={
            "full_name": "Rahul Kumar",
            "phone_number": "9876500001",
            "college": "JNTU Hyderabad",
            "course": "B.Tech CSE",
            "graduation_year": "2026",
            "city": "Hyderabad",
            "bio": "Passionate photographer, UI/UX enthusiast, and student builder. Capturing authentic student stories.",
            "role": "STUDENT"
        }
    )

    # Clear and Seed Talents
    TalentProfile.objects.all().delete()
    t1 = TalentProfile.objects.create(
        user=demo_user,
        title="Portrait & Urban Street Photography",
        category="Photography",
        short_description="Portrait - Street - Events - Capturing candid human emotions and campus moments.",
        description="I have been practicing urban photography and portrait lighting for 3+ years. Featured in regional student exhibitions and campus events.",
        portfolio_url="https://rahulkumar.photos",
        instagram_url="https://instagram.com/rahul_snaps",
        status="PUBLISHED"
    )
    if "Photography" in skill_objs:
        t1.skills.add(skill_objs["Photography"])

    t2 = TalentProfile.objects.create(
        user=demo_user,
        title="Modern Web UI & Mobile Design System",
        category="Design",
        short_description="Figma - Component Systems - Accessibility - Crafting intuitive student web interfaces.",
        description="Specializing in dark mode aesthetics, glassmorphism, and responsive Tailwind CSS layout tokens for modern web apps.",
        portfolio_url="https://figma.com/@rahului",
        status="PUBLISHED"
    )
    if "UI/UX Design" in skill_objs:
        t2.skills.add(skill_objs["UI/UX Design"])

    print("Seeded 2 public Talent Showcase records.")

    # Clear and Seed Projects
    StudentProject.objects.all().delete()
    p1 = StudentProject.objects.create(
        user=demo_user,
        title="AI Study Assistant & Exam Planner",
        slug="ai-study-assistant",
        category="AI & Machine Learning",
        short_description="Python - Django - React - MySQL - AI-powered study scheduler that organizes student notes.",
        description="AI Study Assistant helps college students automatically parse syllabus documents, generate flashcards, and schedule optimized study sessions before exams.",
        problem_statement="Students struggle with overwhelming exam schedules and fragmented study material across multiple drives.",
        solution="Automated note extraction using Python LLM APIs with real-time study calendar synchronization.",
        technologies="Python, Django REST Framework, React, MySQL, OpenAI API",
        features="PDF Syllabus Parser\nAutomated Flashcard Generator\nSmart Study Countdown Calendar",
        github_url="https://github.com/rahulkumar/ai-study-assistant",
        live_demo_url="https://ai-study-assistant.demo.org",
        project_stage="COMPLETED",
        status="PUBLISHED"
    )

    p2 = StudentProject.objects.create(
        user=demo_user,
        title="EcoTrack - Campus Sustainability Monitor",
        slug="ecotrack-campus-monitor",
        category="IoT",
        short_description="IoT - Data Analytics - Web Hub - Real-time campus energy and water consumption dashboard.",
        description="An open-source student initiative tracking campus solar energy generation and hostel water usage to promote green campus habits.",
        problem_statement="High energy waste in college auditoriums and hostels without visibility.",
        solution="IoT sensor telemetry pushed to a live React dashboard for college administration.",
        technologies="React, Node.js, MySQL, ESP8266 Sensors",
        project_stage="IN_DEVELOPMENT",
        status="PUBLISHED"
    )
    print("Seeded 2 public Student Projects.")

    # Clear and Seed Stories
    StudentStory.objects.all().delete()
    s1 = StudentStory.objects.create(
        user=demo_user,
        title="From Hostel Room Developer to Building Real Products",
        slug="from-hostel-room-to-builder",
        category="Student Journey",
        excerpt="How starting with small weekend projects and connecting with fellow SS students helped me build my confidence.",
        content="When I joined college, I felt overwhelmed by complex frameworks and endless job requirements. My breakthrough happened when I stopped studying in isolation and began collaborating with peers in the Struggle of Student community. Building real MVPs and getting feedback from actual users taught me more than any textbook could.",
        status="PUBLISHED",
        published_at=timezone.now()
    )
    print("Seeded 1 public Student Story.")

    # Clear and Seed Achievements
    StudentAchievement.objects.all().delete()
    StudentAchievement.objects.create(
        user=demo_user,
        title="Smart India Hackathon 2026 Winner",
        organization="Ministry of Education & AICTE",
        category="Hackathon Winner",
        date_achieved=datetime.date(2026, 8, 15),
        description="Awarded 1st place in the Smart Education category for building an open-source student learning platform.",
        status="PUBLISHED"
    )
    print("Seeded 1 public Student Achievement.")

    # ==========================================
    # PHASE 7 SEED DATA
    # ==========================================
    print("\n--- Seeding Phase 7 Identity, Leadership, Placements & Impact ---")

    # 1. About SS Section
    AboutSection.objects.all().delete()
    AboutSection.objects.create(
        title="Built by Students, for Students.",
        subtitle="Struggle of Student (SS) is a student-driven community ecosystem built to ensure no student faces career, skill, or life challenges alone.",
        who_we_are="Struggle of Student (SS) is an active, peer-driven organization connecting students across universities. We empower college students through practical project experience, mentorship, career placement support, and campus leadership.",
        why_ss_exists="College students frequently encounter isolation, lack of real-world exposure, fragmented opportunity information, and financial constraints. SS was born to create a unified platform where students learn by building and growing together.",
        mission="To create a supportive ecosystem where students can discover opportunities, build skills, solve problems and grow together.",
        vision="To build a strong student-driven community where every student can find opportunities to learn, contribute and grow.",
        what_we_do="We organize hands-on technical workshops, coordinate campus meetups, connect students with verified internships and job opportunities, facilitate student showcase projects, and host live guidance sessions.",
        how_we_help="By offering zero-cost community mentorship, verified internship listings, practical event volunteering roles, campus ambassador programs, and direct placement guidance.",
        our_community_desc="A thriving nationwide network of student developers, designers, video creators, campus leads, and ambitious problem solvers.",
        our_opportunities_desc="Carefully curated student internships, freelance technical projects, hackathons, and volunteer chapters tailored for holistic career growth.",
        our_services_desc="Student-powered services including IT solutions, campus event management, SS student band performances, and structured career guidance clinics.",
        our_impact_desc="Facilitating student placements, skill transformations, real-world project portfolios, and nationwide peer connections.",
        founder_quote="No student should struggle alone. Together, we turn challenges into stepping stones for student growth."
    )
    print("Seeded About SS Identity & Mission/Vision.")

    # 2. Founder & Leadership Members
    LeadershipMember.objects.all().delete()
    leaders = [
        {
            "name": "Chanti Nelatalli",
            "designation": "Founder & CEO",
            "leadership_type": "FOUNDER",
            "photo_url": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80",
            "bio": "Founder and CEO of Struggle of Student (SS). Dedicated to building a supportive community ecosystem where college students across India can discover verified opportunities, build practical skills, and get genuine guidance.",
            "area_of_responsibility": "Visionary Leadership, Community Strategy & Platform Direction",
            "vision_statement": "To bridge the gap between education and career growth for every passionate student across engineering and degree colleges.",
            "quote": "Empowering students to transform struggles into opportunities.",
            "linkedin_url": "https://www.linkedin.com/in/chanti-nelatalli-6b592932a/",
            "github_url": "https://github.com/struggleofstudent",
            "display_order": 1,
            "status": "PUBLIC"
        },
        {
            "name": "Arjun Sharma",
            "designation": "Director of Community Operations",
            "leadership_type": "DIRECTOR",
            "photo_url": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80",
            "bio": "Leading nationwide campus ambassador networks, student volunteer operations, and university partnerships.",
            "area_of_responsibility": "Campus Outreach & Operations",
            "vision_statement": "Expanding SS presence across 100+ college campuses in South India.",
            "linkedin_url": "https://linkedin.com/in/arjun-sharma-ss",
            "display_order": 2,
            "status": "PUBLIC"
        },
        {
            "name": "Ananya Rao",
            "designation": "Head of Technology & Product",
            "leadership_type": "CORE_LEADERSHIP",
            "photo_url": "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80",
            "bio": "Overseeing digital platform development, student project mentorship, and tech stack architecture.",
            "area_of_responsibility": "Technical Architecture & Mentorship",
            "linkedin_url": "https://linkedin.com/in/ananya-rao-tech",
            "github_url": "https://github.com/ananyarao",
            "display_order": 3,
            "status": "PUBLIC"
        },
        {
            "name": "Karthik Verma",
            "designation": "Lead Events & Volunteer Coordinator",
            "leadership_type": "TEAM_LEAD",
            "photo_url": "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80",
            "bio": "Managing event logistics, volunteer onboarding, hackathons, and offline student meetups.",
            "area_of_responsibility": "Events Execution & Volunteer Logistics",
            "linkedin_url": "https://linkedin.com/in/karthik-verma-events",
            "display_order": 4,
            "status": "PUBLIC"
        }
    ]
    for ldata in leaders:
        LeadershipMember.objects.create(**ldata)
    print(f"Seeded {len(leaders)} verified Leadership members.")

    # 3. Active SS Team Members
    TeamMember.objects.all().delete()
    team_data = [
        {
            "name": "Priya Patel",
            "role": "Frontend Engineer",
            "department": "Technology",
            "photo_url": "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80",
            "short_bio": "Crafting intuitive React components and Tailwind CSS UI for SS platform.",
            "bio": "B.Tech CSE student passionate about web accessibility, design systems, and responsive layouts.",
            "responsibilities": "React Frontend Development, UI Polish, Responsive Optimization",
            "skills": "React, JavaScript, Tailwind CSS, HTML/CSS, Git",
            "joined_date": datetime.date(2025, 1, 15),
            "contributions": "Built Opportunity Filters & Event Registration Modules",
            "linkedin_url": "https://linkedin.com/in/priya-patel-dev",
            "github_url": "https://github.com/priyapatel",
            "display_order": 1,
            "status": "ACTIVE"
        },
        {
            "name": "Rohan Reddy",
            "role": "Backend Developer",
            "department": "Technology",
            "photo_url": "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=400&q=80",
            "short_bio": "Building robust Django REST APIs and MySQL ORM schemas.",
            "bio": "Python enthusiast focused on database optimization, authentication security, and scalable endpoints.",
            "responsibilities": "Django API endpoints, MySQL database optimization, JWT authentication",
            "skills": "Python, Django, MySQL, REST APIs, Docker",
            "joined_date": datetime.date(2025, 2, 1),
            "contributions": "Architected Service Enquiries & Support Ticketing APIs",
            "linkedin_url": "https://linkedin.com/in/rohan-reddy-py",
            "github_url": "https://github.com/rohanreddy",
            "display_order": 2,
            "status": "ACTIVE"
        },
        {
            "name": "Sneha Kulkarni",
            "role": "Community Lead",
            "department": "Community",
            "photo_url": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80",
            "short_bio": "Engaging student members and coordinating campus discussions.",
            "bio": "Dedicated to maintaining a welcoming, supportive community environment across Discord and campus groups.",
            "responsibilities": "Community Moderation, Campus Ambassador Support, Student Onboarding",
            "skills": "Community Management, Public Speaking, Event Coordination",
            "joined_date": datetime.date(2024, 11, 10),
            "contributions": "Grew SS Telegram & Discord communities to 5,000+ active students",
            "linkedin_url": "https://linkedin.com/in/sneha-kulkarni-community",
            "display_order": 3,
            "status": "ACTIVE"
        },
        {
            "name": "Vikram Singh",
            "role": "Content & Media Lead",
            "department": "Content",
            "photo_url": "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=400&q=80",
            "short_bio": "Creating authentic student stories, event graphics, and video highlights.",
            "bio": "Visual storyteller creating relatable content for college students.",
            "responsibilities": "Social Media Copywriting, Instagram Reels, Student Story Interviews",
            "skills": "Content Writing, Canva, Video Editing, Social Media Strategy",
            "joined_date": datetime.date(2025, 3, 5),
            "contributions": "Produced 40+ student achievement spotlight reels",
            "linkedin_url": "https://linkedin.com/in/vikram-singh-media",
            "display_order": 4,
            "status": "ACTIVE"
        }
    ]
    for tdata in team_data:
        TeamMember.objects.create(**tdata)
    print(f"Seeded {len(team_data)} active Team members.")

    # 4. Student Placements (Verified Placement Records)
    Placement.objects.all().delete()
    placements_data = [
        {
            "company_name": "Non-IT Core Corporate Enterprise",
            "company_logo_url": "https://images.unsplash.com/photo-1560179707-f14e90ef3623?auto=format&fit=crop&w=200&q=80",
            "roles": "Operations Specialist, Business Analyst, Core Technical Associate",
            "number_of_students": 3,
            "placement_year": "2026",
            "location": "Hyderabad / Core Industry Locations",
            "description": "3 SS community members recently placed in high-growth Non-IT roles with Rs.7 LPA packages.",
            "verification_status": "VERIFIED",
            "visibility": "PUBLIC",
            "student_names_visibility": "PUBLIC",
            "student_names": "Rajesh, Nithya, Mohammed Sufiyan",
            "testimonials": "SS mock interviews, resume clinics, and domain mentorship helped us land Rs.7 LPA Non-IT offers."
        }
    ]
    for pdata in placements_data:
        Placement.objects.create(**pdata)
    print(f"Seeded {len(placements_data)} verified Student Placement records.")

    # 5. Student Success Stories
    SuccessStory.objects.all().delete()
    stories_data = [
        {
            "student_name": "Rajesh",
            "is_anonymous": False,
            "title": "Secured a 7 LPA Offer from Non-IT Core Enterprise",
            "category": "Placement",
            "excerpt": "Secured a Rs.7 LPA offer from a leading Non-IT company after leveraging SS placement mentorship and skill guidance.",
            "story": "Rajesh prepared for core domain interviews using SS resume clinics and aptitude sessions. His dedication and practical problem-solving skills helped him land a high-value 7 LPA offer at a top Non-IT core enterprise.",
            "challenge": "Transitioning from academic knowledge to clearing rigorous Non-IT core interview rounds.",
            "how_ss_helped": "Provided structured interview prep, aptitude clinics, and core domain guidance.",
            "outcome": "Placed with Rs.7 LPA Package (Non-IT Sector)",
            "company": "Non-IT Core Enterprise",
            "role": "Operations & Core Management Specialist",
            "photo_url": "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=400&q=80",
            "student_quote": "SS gave me the exact domain guidance and interview confidence needed to land my 7 LPA Non-IT offer.",
            "verification_status": "PUBLISHED"
        },
        {
            "student_name": "Nithya",
            "is_anonymous": False,
            "title": "Achieved 7 LPA Non-IT Core Placement",
            "category": "Placement",
            "excerpt": "Landed a Rs.7 LPA placement offer at a reputed Non-IT organization through SS interview bootcamps.",
            "story": "Nithya participated actively in SS student sessions and mock interviews. Through focused preparation in analytical reasoning and domain concepts, she earned a 7 LPA package from a top Non-IT corporation.",
            "challenge": "Building interview confidence and mastering Non-IT technical domain rounds.",
            "how_ss_helped": "Offered peer mock interviews, resume feedback, and personalized career coaching.",
            "outcome": "Placed with Rs.7 LPA Package (Non-IT Sector)",
            "company": "Non-IT Corporate Partner",
            "role": "Business Strategy & Core Analyst",
            "photo_url": "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80",
            "student_quote": "The mock interviews and guidance at Struggle of Student were crucial in helping me secure my 7 LPA offer.",
            "verification_status": "PUBLISHED"
        },
        {
            "student_name": "Mohammed Sufiyan",
            "is_anonymous": False,
            "title": "Landed 7 LPA Non-IT Placement Offer Recently",
            "category": "Placement",
            "excerpt": "Successfully cleared multi-stage recruitment drives to land a 7 LPA package at a Non-IT enterprise.",
            "story": "Mohammed Sufiyan leveraged SS resources, project portfolio guidance, and interview prep workshops. His consistent preparation resulted in a 7 LPA offer from a renowned Non-IT firm.",
            "challenge": "Navigating complex multi-stage core recruitment evaluations.",
            "how_ss_helped": "Guided through portfolio review, soft skills enhancement, and technical mock rounds.",
            "outcome": "Placed with Rs.7 LPA Package (Non-IT Sector)",
            "company": "Non-IT Core Industry",
            "role": "Core Technical & Operations Associate",
            "photo_url": "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80",
            "student_quote": "SS is the best support ecosystem for students aiming for high-value placements in top companies.",
            "verification_status": "PUBLISHED"
        }
    ]
    for sdata in stories_data:
        SuccessStory.objects.create(**sdata)
    print(f"Seeded {len(stories_data)} verified Student Success Stories.")

    # 6. Partners
    Partner.objects.all().delete()
    partners_data = [
        {
            "name": "JNTU Innovation Hub",
            "logo_url": "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=200&q=80",
            "partnership_type": "College",
            "description": "Collaborating on hackathons, campus workshops, and student startup incubation.",
            "website": "https://jntuh.ac.in",
            "display_order": 1,
            "status": "ACTIVE"
        },
        {
            "name": "T-Hub Hyderabad",
            "logo_url": "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=200&q=80",
            "partnership_type": "Company",
            "description": "Host venue partner for student founder meetups and startup networking.",
            "website": "https://t-hub.co",
            "display_order": 2,
            "status": "ACTIVE"
        },
        {
            "name": "TechStart Innovations",
            "logo_url": "https://images.unsplash.com/photo-1560179707-f14e90ef3623?auto=format&fit=crop&w=200&q=80",
            "partnership_type": "Company",
            "description": "Official industry hiring and internship referral partner.",
            "display_order": 3,
            "status": "ACTIVE"
        }
    ]
    for part in partners_data:
        Partner.objects.create(**part)
    print(f"Seeded {len(partners_data)} verified Partners.")

    # 7. Testimonials
    Testimonial.objects.all().delete()
    testimonials_data = [
        {
            "author_name": "Aakash Sharma",
            "role": "Final Year Student, B.Tech CSE",
            "organization": "JNTUH",
            "photo_url": "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=200&q=80",
            "message": "Struggle of Student is the only community where I found genuine peer support. The event volunteering gave me real team management skills!",
            "category": "General",
            "verification_status": "APPROVED",
            "visibility": "PUBLIC"
        },
        {
            "author_name": "Pooja Reddy",
            "role": "Frontend Intern Placed via SS",
            "organization": "TechStart Innovations",
            "photo_url": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
            "message": "I applied for an internship posted on SS, received direct mentorship for the technical test, and got selected within two weeks.",
            "category": "Placement",
            "verification_status": "APPROVED",
            "visibility": "PUBLIC"
        }
    ]
    for tst in testimonials_data:
        Testimonial.objects.create(**tst)
    print(f"Seeded {len(testimonials_data)} approved Testimonials.")

    # 8. Impact Milestones Timeline
    OrganizationMilestone.objects.all().delete()
    milestones_data = [
        {
            "year": "2024",
            "title": "SS Founded",
            "description": "Struggle of Student was launched as a small campus initiative to solve student isolation and career confusion.",
            "category": "COMMUNITY",
            "display_order": 1
        },
        {
            "year": "2025",
            "title": "Community Expansion",
            "description": "Expanded to 15+ college campuses, launched volunteer chapters, and hosted South India's first Student Startup Meetup.",
            "category": "LEARNING",
            "display_order": 2
        },
        {
            "year": "2026",
            "title": "Platform & Career Placements",
            "description": "Rolled out the full digital ecosystem: Opportunities Hub, Event Management, Student Talent Showcase, and verified Student Placements.",
            "category": "CAREER",
            "display_order": 3
        }
    ]
    for mdata in milestones_data:
        OrganizationMilestone.objects.create(**mdata)
    print(f"Seeded {len(milestones_data)} Impact Milestones.")

    # 9. Impact Metrics
    ImpactMetric.objects.all().delete()
    metrics_data = [
        {"name": "Students Supported", "value": "1,250+", "description": "Students guided through career, skills, and event platforms", "category": "COMMUNITY", "display_order": 1},
        {"name": "Students Placed", "value": "17+", "description": "Verified student placements & internships secured through SS", "category": "CAREER", "display_order": 2},
        {"name": "Events & Workshops", "value": "24+", "description": "Practical hands-on technical meetups, hackathons, and workshops conducted", "category": "LEARNING", "display_order": 3},
        {"name": "Student Projects", "value": "45+", "description": "Collaborative student open-source software and design projects published", "category": "PROJECTS", "display_order": 4},
    ]
    for metric in metrics_data:
        ImpactMetric.objects.create(**metric)
    print(f"Seeded {len(metrics_data)} Impact Metrics.")

    # 10. Site Settings & Admin Accounts
    SiteSetting.objects.all().delete()
    SiteSetting.objects.create(
        organization_name="Struggle of Student (SS)",
        tagline="DREAM - LEARN - GROW - TOGETHER",
        contact_email="admin@struggleofstudent.org",
        contact_phone="+91 98765 43210",
        address="SS Community Hub, Hyderabad, India",
        linkedin_url="https://linkedin.com/company/struggleofstudent",
        instagram_url="https://instagram.com/struggleofstudent",
        youtube_url="https://youtube.com/@struggleofstudent",
        twitter_url="https://twitter.com/struggleofstudent",
        github_url="https://github.com/struggleofstudent"
    )
    print("Seeded Default Site Settings.")

    # Admin Users with Roles
    admin_roles_users = [
        ("admin@struggleofstudent.org", "AdminPass123!", "SS Super Admin", "ADMIN", True, True),
        ("superadmin@struggleofstudent.org", "SuperPass123!", "Super Administrator", "SUPER_ADMIN", True, True),
        ("contentmanager@struggleofstudent.org", "ManagerPass123!", "Content Manager", "CONTENT_MANAGER", True, False),
        ("eventmanager@struggleofstudent.org", "ManagerPass123!", "Event Manager", "EVENT_MANAGER", True, False),
        ("opportunitymanager@struggleofstudent.org", "ManagerPass123!", "Opportunity Manager", "OPPORTUNITY_MANAGER", True, False),
        ("communitymanager@struggleofstudent.org", "ManagerPass123!", "Community Manager", "COMMUNITY_MANAGER", True, False),
        ("supportmanager@struggleofstudent.org", "ManagerPass123!", "Support Manager", "SUPPORT_MANAGER", True, False),
        ("hr@struggleofstudent.org", "ManagerPass123!", "HR Team Manager", "HR_TEAM", True, False),
        ("moderator@struggleofstudent.org", "ManagerPass123!", "Community Moderator", "MODERATOR", True, False),
        ("reportviewer@struggleofstudent.org", "ManagerPass123!", "Report Viewer", "REPORT_VIEWER", True, False)
    ]

    for email, pwd, name, role, is_staff, is_super in admin_roles_users:
        usr, u_created = User.objects.get_or_create(
            username=email,
            defaults={"email": email, "first_name": name, "is_staff": is_staff, "is_superuser": is_super}
        )
        if u_created or not usr.check_password(pwd):
            usr.set_password(pwd)
            usr.is_staff = is_staff
            usr.is_superuser = is_super
            usr.save()

        prof, _ = StudentProfile.objects.get_or_create(
            user=usr,
            defaults={
                "full_name": name,
                "phone_number": "9876543210",
                "college": "Struggle of Student Admin HQ",
                "course": "Operations",
                "graduation_year": "2026",
                "role": role
            }
        )
        if prof.role != role:
            prof.role = role
            prof.save()

    print(f"Seeded {len(admin_roles_users)} Admin Accounts with Role-Based Access Control.")

    # Audit Logs
    AuditLog.objects.all().delete()
    AuditLog.objects.create(
        admin_name="SS Super Admin",
        admin_role="SUPER_ADMIN",
        action="System Initialized Phase 9 Admin Operations Platform",
        module="SYSTEM",
        record_repr="Platform Core",
        new_value="RBAC Enabled"
    )
    AuditLog.objects.create(
        admin_name="Event Manager",
        admin_role="EVENT_MANAGER",
        action="Published Workshop: Building Your First Web Application",
        module="EVENTS",
        record_repr="Building Your First Web Application",
        previous_value="DRAFT",
        new_value="REGISTRATION_OPEN"
    )
    print("Seeded Initial Audit Logs.")

if __name__ == '__main__':
    seed_data()



