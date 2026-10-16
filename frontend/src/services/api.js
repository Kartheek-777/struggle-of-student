import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 12000,
});

apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('ss_access_token') || localStorage.getItem('access');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response && error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const refreshToken = localStorage.getItem('ss_refresh_token') || localStorage.getItem('refresh');
      if (refreshToken) {
        try {
          const res = await axios.post(`${API_BASE_URL}/auth/refresh/`, { refresh: refreshToken });
          if (res.status === 200 && res.data.access) {
            localStorage.setItem('ss_access_token', res.data.access);
            localStorage.setItem('access', res.data.access);
            originalRequest.headers.Authorization = `Bearer ${res.data.access}`;
            return apiClient(originalRequest);
          }
        } catch (refreshErr) {
          localStorage.removeItem('ss_access_token');
          localStorage.removeItem('access');
          localStorage.removeItem('ss_refresh_token');
          localStorage.removeItem('refresh');
          localStorage.removeItem('ss_user');
          window.location.href = '/login';
        }
      }
    }
    return Promise.reject(error);
  }
);

// Health & Auth
export const getHealth = async () => (await apiClient.get('/health/')).data;
export const register = async (data) => (await apiClient.post('/auth/register/', data)).data;
export const login = async (data) => (await apiClient.post('/auth/login/', data)).data;
export const socialLogin = async (data) => (await apiClient.post('/auth/social-login/', data)).data;
export const getMe = async () => (await apiClient.get('/auth/me/')).data;
export const forgotPassword = async (email) => (await apiClient.post('/auth/forgot-password/', { email })).data;
export const resetPassword = async (data) => (await apiClient.post('/auth/reset-password/', data)).data;

// Profile
export const getProfile = async () => (await apiClient.get('/profile/')).data;
export const updateProfile = async (data) => (await apiClient.put('/profile/', data)).data;
export const uploadPhoto = async (formData) => (await apiClient.post('/profile/photo/', formData, { headers: { 'Content-Type': 'multipart/form-data' } })).data;
export const deletePhoto = async () => (await apiClient.delete('/profile/photo/delete/')).data;
export const uploadResume = async (formData) => (await apiClient.post('/profile/resume/', formData, { headers: { 'Content-Type': 'multipart/form-data' } })).data;
export const deleteResume = async () => (await apiClient.delete('/profile/resume/')).data;

// Opportunities
export const getOpportunities = (params = {}) => apiClient.get('/opportunities/', { params });
export const getOpportunityDetail = (id) => apiClient.get(`/opportunities/${id}/`);
export const getOpportunityCategories = () => apiClient.get('/opportunities/categories/');
export const saveOpportunity = (id) => apiClient.post(`/opportunities/${id}/save/`);
export const unsaveOpportunity = (id) => apiClient.delete(`/opportunities/${id}/save/`);
export const getSavedOpportunities = () => apiClient.get('/opportunities/saved/');
export const applyToOpportunity = (id, data = {}) => apiClient.post(`/opportunities/${id}/apply/`, data);
export const getMyApplications = () => apiClient.get('/applications/');
export const getApplicationDetail = (id) => apiClient.get(`/applications/${id}/`);

// Metadata
export const getSkills = () => apiClient.get('/skills/');
export const getInterests = () => apiClient.get('/interests/');

// Events
export const getEvents = (params = {}) => apiClient.get('/events/', { params });
export const getEventDetail = (id) => apiClient.get(`/events/${id}/`);
export const getEventCategories = () => apiClient.get('/events/categories/');
export const registerForEvent = (id) => apiClient.post(`/events/${id}/register/`);
export const cancelEventRegistration = (id) => apiClient.post(`/events/${id}/cancel-registration/`);
export const applyForVolunteerRole = (eventId, roleId) => apiClient.post(`/events/${eventId}/volunteer/apply/`, { role_id: roleId });
export const withdrawVolunteerApplication = (appId) => apiClient.post(`/volunteer-applications/${appId}/withdraw/`);
export const getStudentEvents = () => apiClient.get('/student/events/');
export const getStudentVolunteerApplications = () => apiClient.get('/student/volunteer-applications/');
export const getStudentDashboardStats = () => apiClient.get('/student/stats/');

// Phase 5: Talent Showcase
export const getTalents = (params = {}) => apiClient.get('/talent/', { params });
export const getTalentCategories = () => apiClient.get('/talent/categories/');
export const getTalentDetail = (id) => apiClient.get(`/talent/${id}/`);
export const getStudentTalents = () => apiClient.get('/student/talent/');
export const createStudentTalent = (data) => apiClient.post('/student/talent/', data);
export const updateStudentTalent = (id, data) => apiClient.put(`/student/talent/${id}/`, data);
export const deleteStudentTalent = (id) => apiClient.delete(`/student/talent/${id}/`);

// Phase 5: Projects
export const getProjects = (params = {}) => apiClient.get('/projects/', { params });
export const getProjectCategories = () => apiClient.get('/projects/categories/');
export const getProjectDetail = (id) => apiClient.get(`/projects/${id}/`);
export const getStudentProjects = () => apiClient.get('/student/projects/');
export const createStudentProject = (data) => apiClient.post('/student/projects/', data);
export const updateStudentProject = (id, data) => apiClient.put(`/student/projects/${id}/`, data);
export const deleteStudentProject = (id) => apiClient.delete(`/student/projects/${id}/`);

// Phase 5: Stories
export const getStories = (params = {}) => apiClient.get('/stories/', { params });
export const getStoryCategories = () => apiClient.get('/stories/categories/');
export const getStoryDetail = (id) => apiClient.get(`/stories/${id}/`);
export const getStudentStories = () => apiClient.get('/student/stories/');
export const createStudentStory = (data) => apiClient.post('/student/stories/', data);
export const updateStudentStory = (id, data) => apiClient.put(`/student/stories/${id}/`, data);
export const deleteStudentStory = (id) => apiClient.delete(`/student/stories/${id}/`);

// Phase 5: Leadership & Campus Ambassador
export const getLeadershipOpportunities = () => apiClient.get('/leadership/');
export const applyLeadershipOpportunity = (id, data = {}) => apiClient.post(`/leadership/${id}/apply/`, data);
export const applyCampusAmbassador = (data) => apiClient.post('/campus-ambassador/apply/', data);
export const getCampusAmbassadorStatus = () => apiClient.get('/student/campus-ambassador-application/');

// Phase 5: Community & Achievements
export const getCommunityMembers = (params = {}) => apiClient.get('/community/', { params });
export const getCommunityStats = () => apiClient.get('/community/stats/');
export const getStudentAchievements = () => apiClient.get('/student/achievements/');
export const createStudentAchievement = (data) => apiClient.post('/student/achievements/', data);
export const updateStudentAchievement = (id, data) => apiClient.put(`/student/achievements/${id}/`, data);
export const deleteStudentAchievement = (id) => apiClient.delete(`/student/achievements/${id}/`);

// Phase 6: Services, Guidance, Support, Enquiries & Contact
export const getServices = (params = {}) => apiClient.get('/services/', { params });
export const getServiceCategories = () => apiClient.get('/services/categories/');
export const getServiceDetail = (slug) => apiClient.get(`/services/${slug}/`);
export const getServiceFaqs = (slug = null) => apiClient.get(slug ? `/services/${slug}/faqs/` : '/services/faqs/');
export const submitServiceEnquiry = (slug = null, data, isMultipart = false) => {
  const url = slug ? `/services/${slug}/enquire/` : '/services/enquire/';
  const headers = isMultipart ? { 'Content-Type': 'multipart/form-data' } : {};
  return apiClient.post(url, data, { headers });
};
export const getStudentEnquiries = () => apiClient.get('/student/enquiries/');
export const getStudentEnquiryDetail = (id) => apiClient.get(`/student/enquiries/${id}/`);

export const createSupportRequest = (data, isMultipart = false) => {
  const headers = isMultipart ? { 'Content-Type': 'multipart/form-data' } : {};
  return apiClient.post('/support/', data, { headers });
};
export const getStudentSupportRequests = () => apiClient.get('/student/support/');
export const getStudentSupportDetail = (id) => apiClient.get(`/student/support/${id}/`);
export const addSupportUpdate = (id, data, isMultipart = false) => {
  const headers = isMultipart ? { 'Content-Type': 'multipart/form-data' } : {};
  return apiClient.post(`/student/support/${id}/update/`, data, { headers });
};

export const submitContactMessage = (data) => apiClient.post('/contact/', data);
export const getStats = () => apiClient.get('/stats/').then(res => res.data);

// Phase 7: SS Identity, Leadership, Team, Placements, Impact & Success Stories
export const getAboutSection = () => apiClient.get('/about/');
export const getLeadershipList = () => apiClient.get('/leadership/');
export const getLeadershipDetail = (id) => apiClient.get(`/leadership/${id}/`);
export const getTeamList = (params = {}) => apiClient.get('/team/', { params });
export const getTeamDetail = (id) => apiClient.get(`/team/${id}/`);
export const getPlacementsList = () => apiClient.get('/placements/');
export const getPlacementDetail = (id) => apiClient.get(`/placement/${id}/`).catch(() => apiClient.get(`/placements/${id}/`));
export const getSuccessStoriesList = (params = {}) => apiClient.get('/success-stories/', { params });
export const getSuccessStoryDetail = (id) => apiClient.get(`/success-stories/${id}/`);
export const getTestimonialsList = () => apiClient.get('/testimonials/');
export const getPartnersList = () => apiClient.get('/partners/');
export const getImpactData = () => apiClient.get('/impact/');
export const getImpactStatistics = () => apiClient.get('/impact/statistics/');

// Phase 8: Online Sessions, Workshops, Waitlist, Feedback & Zoom
export const getSessions = (params = {}) => apiClient.get('/sessions/', { params });
export const getSessionDetail = (id) => apiClient.get(`/sessions/${id}/`);
export const registerSession = (id) => apiClient.post(`/sessions/${id}/register/`);
export const cancelSessionRegistration = (id) => apiClient.post(`/sessions/${id}/cancel-registration/`);
export const joinSessionWaitlist = (id) => apiClient.post(`/sessions/${id}/waitlist/`);
export const cancelSessionWaitlist = (id) => apiClient.delete(`/sessions/${id}/cancel-waitlist/`);
export const getStudentSessions = () => apiClient.get('/student/sessions/');
export const getStudentSessionDetail = (id) => apiClient.get(`/student/sessions/${id}/`);
export const submitSessionFeedback = (id, data) => apiClient.post(`/sessions/${id}/feedback/`, data);
export const getSessionSpeakers = () => apiClient.get('/sessions/speakers/');
export const staffCreateZoomMeeting = (id) => apiClient.post(`/staff/sessions/${id}/create-zoom/`);

// Phase 9: Admin & Operations Platform
export const getAdminDashboardOverview = () => apiClient.get('/admin/dashboard/');
export const getAdminUsers = (params = {}) => apiClient.get('/admin/users/', { params });
export const getAdminUserDetail = (id) => apiClient.get(`/admin/users/${id}/`);
export const updateAdminUserAction = (id, data) => apiClient.patch(`/admin/users/${id}/action/`, data);

export const getAdminOpportunities = (params = {}) => apiClient.get('/admin/opportunities/', { params });
export const getAdminOpportunityDetail = (id) => apiClient.get(`/admin/opportunities/${id}/`);
export const createAdminOpportunity = (data) => apiClient.post('/admin/opportunities/', data);
export const updateAdminOpportunity = (id, data) => apiClient.patch(`/admin/opportunities/${id}/`, data);
export const deleteAdminOpportunity = (id) => apiClient.delete(`/admin/opportunities/${id}/`);

export const getAdminApplications = (params = {}) => apiClient.get('/admin/applications/', { params });
export const updateAdminApplicationStatus = (id, data) => apiClient.patch(`/admin/applications/${id}/status/`, data);

export const getAdminEvents = (params = {}) => apiClient.get('/admin/events/', { params });
export const getAdminEventDetail = (id) => apiClient.get(`/admin/events/${id}/`);
export const createAdminEvent = (data) => apiClient.post('/admin/events/', data);
export const updateAdminEvent = (id, data) => apiClient.patch(`/admin/events/${id}/`, data);
export const deleteAdminEvent = (id) => apiClient.delete(`/admin/events/${id}/`);

export const getAdminVolunteers = (params = {}) => apiClient.get('/admin/volunteers/', { params });
export const updateAdminVolunteerStatus = (id, data) => apiClient.patch(`/admin/volunteers/${id}/status/`, data);

export const getAdminServices = () => apiClient.get('/admin/services/');
export const createAdminService = (data) => apiClient.post('/admin/services/', data);
export const updateAdminService = (id, data) => apiClient.patch(`/admin/services/${id}/`, data);
export const deleteAdminService = (id) => apiClient.delete(`/admin/services/${id}/`);

export const getAdminEnquiries = (params = {}) => apiClient.get('/admin/enquiries/', { params });
export const updateAdminEnquiryStatus = (id, data) => apiClient.patch(`/admin/enquiries/${id}/status/`, data);

export const getAdminSupportRequests = (params = {}) => apiClient.get('/admin/support/', { params });
export const addAdminSupportReply = (id, data) => apiClient.post(`/admin/support/${id}/action/`, data);
export const updateAdminSupportStatus = (id, data) => apiClient.patch(`/admin/support/${id}/action/`, data);

export const getAdminModerationQueue = (params = {}) => apiClient.get('/admin/moderation/', { params });
export const updateAdminModerationAction = (data) => apiClient.post('/admin/moderation/action/', data);

export const getAdminPlacements = () => apiClient.get('/admin/placements/');
export const createAdminPlacement = (data) => apiClient.post('/admin/placements/', data);
export const updateAdminPlacement = (id, data) => apiClient.patch(`/admin/placements/${id}/`, data);
export const deleteAdminPlacement = (id) => apiClient.delete(`/admin/placements/${id}/`);

export const getAdminTeam = () => apiClient.get('/admin/team/');
export const createAdminTeamMember = (data) => apiClient.post('/admin/team/', data);

export const getAdminPartners = () => apiClient.get('/admin/partners/');
export const createAdminPartner = (data) => apiClient.post('/admin/partners/', data);

export const getAdminTestimonials = () => apiClient.get('/admin/testimonials/');
export const createAdminTestimonial = (data) => apiClient.post('/admin/testimonials/', data);

export const getAdminReports = (params = {}) => apiClient.get('/admin/reports/', { params });
export const getAdminAuditLogs = (params = {}) => apiClient.get('/admin/audit-logs/', { params });
export const getAdminGlobalSearch = (q) => apiClient.get('/admin/search/', { params: { q } });
export const getAdminSiteSettings = () => apiClient.get('/admin/settings/');
export const updateAdminSiteSettings = (data) => apiClient.patch('/admin/settings/', data);

// Phase 10 Notifications & Communications
export const getNotifications = (params = {}) => apiClient.get('/notifications/', { params });
export const getUnreadNotificationCount = () => apiClient.get('/notifications/unread-count/');
export const markNotificationRead = (id) => apiClient.post(`/notifications/${id}/read/`);
export const markAllNotificationsRead = () => apiClient.post('/notifications/read-all/');
export const getNotificationPreferences = () => apiClient.get('/notification-preferences/');
export const updateNotificationPreferences = (data) => apiClient.patch('/notification-preferences/', data);
export const getAdminCommunications = () => apiClient.get('/admin/communications/');
export const getAdminEmailLogs = (params = {}) => apiClient.get('/admin/email-logs/', { params });
export const retryAdminEmail = (id) => apiClient.post(`/admin/email-logs/${id}/retry/`);

// Phase 11 Analytics, Search & Personalization
export const getAdminAnalytics = (params = {}) => apiClient.get('/admin/analytics/', { params });
export const exportAdminAnalyticsCsv = () => apiClient.get('/admin/analytics/export/', { responseType: 'blob' });
export const globalSearch = (params = {}) => apiClient.get('/search/', { params });
export const getPersonalizedRecommendations = () => apiClient.get('/student/recommendations/');
export const getSavedItems = () => apiClient.get('/saved-items/');

export const apiService = {
  getHealth, register, login, socialLogin, getMe, forgotPassword, resetPassword,
  getProfile, updateProfile, uploadPhoto, deletePhoto, uploadResume, deleteResume,
  getOpportunities, getOpportunityDetail, getOpportunityCategories, saveOpportunity, unsaveOpportunity,
  getSavedOpportunities, applyToOpportunity, getMyApplications, getApplicationDetail,
  getSkills, getInterests, getEvents, getEventDetail, getEventCategories, registerForEvent,
  cancelEventRegistration, applyForVolunteerRole, withdrawVolunteerApplication, getStudentEvents,
  getStudentVolunteerApplications, getStudentDashboardStats,
  getTalents, getTalentCategories, getTalentDetail, getStudentTalents, createStudentTalent, updateStudentTalent, deleteStudentTalent,
  getProjects, getProjectCategories, getProjectDetail, getStudentProjects, createStudentProject, updateStudentProject, deleteStudentProject,
  getStories, getStoryCategories, getStoryDetail, getStudentStories, createStudentStory, updateStudentStory, deleteStudentStory,
  getLeadershipOpportunities, applyLeadershipOpportunity, applyCampusAmbassador, getCampusAmbassadorStatus,
  getCommunityMembers, getCommunityStats, getStudentAchievements, createStudentAchievement, updateStudentAchievement, deleteStudentAchievement,
  getServices, getServiceCategories, getServiceDetail, getServiceFaqs, submitServiceEnquiry, getStudentEnquiries, getStudentEnquiryDetail,
  createSupportRequest, getStudentSupportRequests, getStudentSupportDetail, addSupportUpdate, submitContactMessage, getStats,
  getAboutSection, getLeadershipList, getLeadershipDetail, getTeamList, getTeamDetail, getPlacementsList, getPlacementDetail,
  getSuccessStoriesList, getSuccessStoryDetail, getTestimonialsList, getPartnersList, getImpactData, getImpactStatistics,
  getSessions, getSessionDetail, registerSession, cancelSessionRegistration, joinSessionWaitlist, cancelSessionWaitlist,
  getStudentSessions, getStudentSessionDetail, submitSessionFeedback, getSessionSpeakers, staffCreateZoomMeeting,
  getAdminDashboardOverview, getAdminUsers, getAdminUserDetail, updateAdminUserAction, getAdminOpportunities,
  getAdminOpportunityDetail, createAdminOpportunity, updateAdminOpportunity, deleteAdminOpportunity, getAdminApplications,
  updateAdminApplicationStatus, getAdminEvents, getAdminEventDetail, createAdminEvent, updateAdminEvent, deleteAdminEvent,
  getAdminVolunteers, updateAdminVolunteerStatus, getAdminServices, createAdminService, updateAdminService, deleteAdminService,
  getAdminEnquiries, updateAdminEnquiryStatus, getAdminSupportRequests, addAdminSupportReply, updateAdminSupportStatus,
  getAdminModerationQueue, updateAdminModerationAction, getAdminPlacements, createAdminPlacement, updateAdminPlacement,
  deleteAdminPlacement, getAdminTeam, createAdminTeamMember, getAdminPartners, createAdminPartner, getAdminTestimonials,
  createAdminTestimonial, getAdminReports, getAdminAuditLogs, getAdminGlobalSearch, getAdminSiteSettings, updateAdminSiteSettings,
  getNotifications, getUnreadNotificationCount, markNotificationRead, markAllNotificationsRead,
  getNotificationPreferences, updateNotificationPreferences, getAdminCommunications, getAdminEmailLogs, retryAdminEmail,
  getAdminAnalytics, exportAdminAnalyticsCsv, globalSearch, getPersonalizedRecommendations, getSavedItems
};

export default apiClient;



