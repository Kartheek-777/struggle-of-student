from rest_framework import permissions

ADMIN_ROLES = {
    'SUPER_ADMIN',
    'ADMIN',
    'CONTENT_MANAGER',
    'EVENT_MANAGER',
    'OPPORTUNITY_MANAGER',
    'COMMUNITY_MANAGER',
    'SUPPORT_MANAGER',
    'HR_TEAM',
    'MODERATOR',
    'REPORT_VIEWER',
    'TEAM_MEMBER',
}

ROLE_MODULE_PERMISSIONS = {
    'SUPER_ADMIN': ['*'],
    'ADMIN': ['*'],
    'CONTENT_MANAGER': ['ABOUT', 'TEAM', 'STORIES', 'TALENT', 'PROJECTS', 'TESTIMONIALS', 'PARTNERS', 'MILESTONES', 'CONTENT', 'IMPACT'],
    'EVENT_MANAGER': ['EVENTS', 'VOLUNTEERS', 'SESSIONS', 'WORKSHOPS', 'REGISTRATIONS', 'ZOOM', 'SPEAKERS'],
    'OPPORTUNITY_MANAGER': ['OPPORTUNITIES', 'APPLICATIONS', 'CATEGORIES'],
    'COMMUNITY_MANAGER': ['COMMUNITY', 'CAMPUS_AMBASSADOR', 'TALENT', 'PROJECTS', 'STORIES', 'USERS', 'ACHIEVEMENTS'],
    'SUPPORT_MANAGER': ['SUPPORT', 'ENQUIRIES', 'SERVICES', 'CONTACT'],
    'HR_TEAM': ['PLACEMENTS', 'LEADERSHIP', 'TEAM', 'USERS'],
    'MODERATOR': ['MODERATION', 'TALENT', 'PROJECTS', 'STORIES', 'ACHIEVEMENTS', 'TESTIMONIALS'],
    'REPORT_VIEWER': ['REPORTS', 'DASHBOARD'],
    'TEAM_MEMBER': ['DASHBOARD', 'REPORTS', 'COMMUNITY'],
}

def get_user_admin_role(user):
    if not user or not user.is_authenticated:
        return None
    if user.is_superuser:
        return 'SUPER_ADMIN'
    
    prof = getattr(user, 'student_profile', None)
    if prof and prof.role in ADMIN_ROLES:
        return prof.role
    
    if user.is_staff:
        return 'ADMIN'
    
    return None

def has_module_permission(user, module, read_only_action=False):
    role = get_user_admin_role(user)
    if not role:
        return False
    
    if role in ['SUPER_ADMIN', 'ADMIN']:
        return True
    
    if role == 'REPORT_VIEWER':
        # Report viewer can only view (read-only) reports and dashboard
        return read_only_action and module in ['REPORTS', 'DASHBOARD']
    
    allowed_modules = ROLE_MODULE_PERMISSIONS.get(role, [])
    if '*' in allowed_modules:
        return True
    
    return module in allowed_modules


class IsAdminUserOrStaff(permissions.BasePermission):
    """
    Allows access only to users with an Admin role or staff flag.
    """
    def has_permission(self, request, view):
        role = get_user_admin_role(request.user)
        return role is not None


class HasAdminRole(permissions.BasePermission):
    """
    Checks module specific permissions based on the view's required_module attribute.
    """
    def has_permission(self, request, view):
        role = get_user_admin_role(request.user)
        if not role:
            return False
        
        required_module = getattr(view, 'required_module', None)
        if not required_module:
            return True
        
        is_read_only = request.method in permissions.SAFE_METHODS
        return has_module_permission(request.user, required_module, read_only_action=is_read_only)
