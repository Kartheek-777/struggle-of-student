# SS Email Template Engine

def get_base_email_template(title, recipient_name, content_html, cta_text="", cta_url=""):
    cta_block = ""
    if cta_text and cta_url:
        cta_block = f"""
        <div style="margin-top: 24px; text-align: center;">
            <a href="{cta_url}" style="background-color: #0B3D2E; color: #F7F3E8; font-weight: bold; font-size: 14px; padding: 12px 24px; text-decoration: none; border-radius: 8px; display: inline-block; border: 1px solid #C99A2E;">
                {cta_text} &rarr;
            </a>
        </div>
        """

    return f"""
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>{title}</title>
    </head>
    <body style="font-family: Arial, sans-serif; background-color: #F7F3E8; margin: 0; padding: 20px; color: #1D2521;">
        <table width="100%" border="0" cellspacing="0" cellpadding="0" style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 16px; border: 1px solid #E2DAC8; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.05);">
            <!-- HEADER -->
            <tr>
                <td style="background-color: #0B3D2E; padding: 24px 32px; text-align: left;">
                    <table border="0" cellspacing="0" cellpadding="0">
                        <tr>
                            <td style="background-color: #C99A2E; color: #0B3D2E; font-weight: 900; font-size: 20px; width: 40px; height: 40px; border-radius: 10px; text-align: center; vertical-align: middle;">
                                SS
                            </td>
                            <td style="padding-left: 12px; color: #F7F3E8; font-weight: 800; font-size: 16px; letter-spacing: 0.5px;">
                                STRUGGLE OF STUDENT
                                <div style="font-size: 9px; color: #C99A2E; letter-spacing: 2px; text-transform: uppercase; margin-top: 2px; font-weight: 600;">
                                    DREAM &bull; LEARN &bull; GROW &bull; TOGETHER
                                </div>
                            </td>
                        </tr>
                    </table>
                </td>
            </tr>

            <!-- CONTENT BODY -->
            <tr>
                <td style="padding: 32px; font-size: 14px; line-height: 1.6; color: #1D2521;">
                    <h2 style="color: #0B3D2E; margin-top: 0; font-size: 20px; font-weight: 800;">{title}</h2>
                    <p style="margin-bottom: 20px;">Hi <strong>{recipient_name}</strong>,</p>
                    
                    {content_html}

                    {cta_block}
                    
                    <p style="margin-top: 32px; font-size: 13px; color: #555;">
                        Warm regards,<br>
                        <strong style="color: #0B3D2E;">The Struggle of Student Team</strong>
                    </p>
                </td>
            </tr>

            <!-- FOOTER -->
            <tr>
                <td style="background-color: #FAF7F0; padding: 20px 32px; border-top: 1px solid #E2DAC8; font-size: 11px; color: #666666; text-align: center;">
                    <p style="margin: 0 0 8px 0; font-weight: 700; color: #0B3D2E;">Struggle of Student (SS) Community Platform</p>
                    <p style="margin: 0 0 8px 0;">Empowering students across India with opportunities, practical skills, and peer support.</p>
                    <p style="margin: 0;">Need help? Reach out at <a href="mailto:support@struggleofstudent.org" style="color: #0B3D2E; font-weight: bold; text-decoration: none;">support@struggleofstudent.org</a></p>
                </td>
            </tr>
        </table>
    </body>
    </html>
    """


def render_welcome_email(user_name, cta_url="http://localhost:5173/"):
    title = "Welcome to Struggle of Student"
    content_html = """
    <p>We are thrilled to welcome you to the <strong>Struggle of Student (SS)</strong> community platform!</p>
    <p>SS was created by students for students to ensure no one has to face academic, career, or life challenges alone.</p>
    <div style="background-color: #FAF7F0; padding: 16px; border-radius: 12px; border: 1px solid #E2DAC8; margin: 20px 0;">
        <strong style="color: #0B3D2E; display: block; margin-bottom: 8px;">Here is what you can explore on SS:</strong>
        <ul style="margin: 0; padding-left: 20px; color: #333;">
            <li><strong>Verified Opportunities:</strong> Explore stipended internships, IT, and non-IT job roles.</li>
            <li><strong>Live Sessions & Workshops:</strong> Register for technical masterclasses and skill bootcamps.</li>
            <li><strong>Talent & Projects Showcase:</strong> Highlight your portfolio and collaborate on open student projects.</li>
            <li><strong>Student Support Clinic:</strong> Request career, academic, and project guidance from peer mentors.</li>
        </ul>
    </div>
    """
    return title, get_base_email_template(title, user_name, content_html, "Explore SS Platform", cta_url)


def render_application_received_email(user_name, opportunity_title, org_name, applied_at_str, cta_url="http://localhost:5173/student/applications"):
    title = "Application Received"
    content_html = f"""
    <p>Your application for <strong>{opportunity_title}</strong> at <strong>{org_name}</strong> has been successfully submitted.</p>
    
    <div style="background-color: #FAF7F0; padding: 16px; border-radius: 12px; border: 1px solid #E2DAC8; margin: 20px 0;">
        <table width="100%" border="0" cellspacing="0" cellpadding="4" style="font-size: 13px;">
            <tr>
                <td style="color: #666; font-weight: bold;">Opportunity:</td>
                <td style="color: #0B3D2E; font-weight: bold;">{opportunity_title}</td>
            </tr>
            <tr>
                <td style="color: #666; font-weight: bold;">Organization:</td>
                <td style="color: #1D2521;">{org_name}</td>
            </tr>
            <tr>
                <td style="color: #666; font-weight: bold;">Submitted Date:</td>
                <td style="color: #1D2521;">{applied_at_str}</td>
            </tr>
            <tr>
                <td style="color: #666; font-weight: bold;">Status:</td>
                <td style="color: #C99A2E; font-weight: bold;">APPLIED (Under Review)</td>
            </tr>
        </table>
    </div>
    <p>The SS hiring team will review your profile and update your application status in your student dashboard.</p>
    """
    return title, get_base_email_template(title, user_name, content_html, "Track Application Status", cta_url)


def render_application_status_email(user_name, opportunity_title, org_name, new_status, cta_url="http://localhost:5173/student/applications"):
    title = f"Application Status Updated: {new_status}"
    content_html = f"""
    <p>There is an update on your application for <strong>{opportunity_title}</strong> at <strong>{org_name}</strong>.</p>
    
    <div style="background-color: #FAF7F0; padding: 16px; border-radius: 12px; border: 1px solid #E2DAC8; margin: 20px 0; text-align: center;">
        <p style="margin: 0; font-size: 12px; color: #666; uppercase;">New Application Status</p>
        <p style="margin: 6px 0 0 0; font-size: 22px; font-weight: 900; color: #0B3D2E; letter-spacing: 0.5px;">{new_status}</p>
    </div>
    <p>Please check your student dashboard for complete details and next steps.</p>
    """
    return title, get_base_email_template(title, user_name, content_html, "View Application", cta_url)


def render_event_confirmation_email(user_name, event_title, event_date_str, mode_str, location_str, cta_url="http://localhost:5173/student/sessions"):
    title = "Session Registration Confirmed"
    content_html = f"""
    <p>You are successfully registered for <strong>{event_title}</strong>.</p>
    
    <div style="background-color: #FAF7F0; padding: 16px; border-radius: 12px; border: 1px solid #E2DAC8; margin: 20px 0;">
        <table width="100%" border="0" cellspacing="0" cellpadding="4" style="font-size: 13px;">
            <tr>
                <td style="color: #666; font-weight: bold;">Event / Session:</td>
                <td style="color: #0B3D2E; font-weight: bold;">{event_title}</td>
            </tr>
            <tr>
                <td style="color: #666; font-weight: bold;">Date & Time:</td>
                <td style="color: #1D2521;">{event_date_str}</td>
            </tr>
            <tr>
                <td style="color: #666; font-weight: bold;">Mode & Location:</td>
                <td style="color: #1D2521;">{mode_str} ({location_str})</td>
            </tr>
        </table>
    </div>
    <p>You can access meeting details and calendar links from your registered sessions tab.</p>
    """
    return title, get_base_email_template(title, user_name, content_html, "View Session Details", cta_url)


def render_volunteer_status_email(user_name, event_title, role_title, new_status, cta_url="http://localhost:5173/student/events"):
    title = f"Volunteer Application Status: {new_status}"
    content_html = f"""
    <p>Your volunteer application for <strong>{role_title}</strong> at <strong>{event_title}</strong> has been updated.</p>
    
    <div style="background-color: #FAF7F0; padding: 16px; border-radius: 12px; border: 1px solid #E2DAC8; margin: 20px 0; text-align: center;">
        <p style="margin: 0; font-size: 12px; color: #666;">Volunteer Status</p>
        <p style="margin: 6px 0 0 0; font-size: 20px; font-weight: 900; color: #0B3D2E;">{new_status}</p>
    </div>
    <p>Thank you for contributing your time to the student community!</p>
    """
    return title, get_base_email_template(title, user_name, content_html, "View Volunteer Hub", cta_url)


def render_support_received_email(user_name, ref_num, subject, category, cta_url="http://localhost:5173/student/support"):
    title = f"Support Request Received [{ref_num}]"
    content_html = f"""
    <p>Your SS support request has been received. Reference Number: <strong>{ref_num}</strong>.</p>
    
    <div style="background-color: #FAF7F0; padding: 16px; border-radius: 12px; border: 1px solid #E2DAC8; margin: 20px 0;">
        <table width="100%" border="0" cellspacing="0" cellpadding="4" style="font-size: 13px;">
            <tr>
                <td style="color: #666; font-weight: bold;">Reference #:</td>
                <td style="color: #0B3D2E; font-weight: bold;">{ref_num}</td>
            </tr>
            <tr>
                <td style="color: #666; font-weight: bold;">Category:</td>
                <td style="color: #1D2521;">{category}</td>
            </tr>
            <tr>
                <td style="color: #666; font-weight: bold;">Subject:</td>
                <td style="color: #1D2521;">{subject}</td>
            </tr>
        </table>
    </div>
    <p>An SS support manager will review your ticket and respond shortly.</p>
    """
    return title, get_base_email_template(title, user_name, content_html, "Track Support Ticket", cta_url)


def render_session_cancelled_email(user_name, event_title, original_date_str, reason_str="", cta_url="http://localhost:5173/sessions"):
    title = f"Session Cancelled: {event_title}"
    content_html = f"""
    <p>We regret to inform you that the upcoming session <strong>{event_title}</strong> scheduled for <strong>{original_date_str}</strong> has been cancelled.</p>
    
    {f'<div style="background-color: #FFF5F5; padding: 14px; border-radius: 10px; border: 1px solid #FEB2B2; color: #C53030; margin: 16px 0;"><strong>Reason:</strong> {reason_str}</div>' if reason_str else ''}
    
    <p>We apologize for any inconvenience. Please explore our upcoming alternate workshops and live masterclasses.</p>
    """
    return title, get_base_email_template(title, user_name, content_html, "Explore Alternate Sessions", cta_url)
