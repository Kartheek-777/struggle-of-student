import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import AdminRoute from './components/AdminRoute';

import Navbar from './components/Navbar';
import Footer from './components/Footer';
import JoinModal from './components/JoinModal';

// Public Pages
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import OpportunitiesPage from './pages/OpportunitiesPage';
import OpportunityDetailPage from './pages/OpportunityDetailPage';
import EventsPage from './pages/EventsPage';
import EventDetailPage from './pages/EventDetailPage';
import ServicesPage from './pages/ServicesPage';
import CommunityPage from './pages/CommunityPage';
import TeamPage from './pages/TeamPage';
import ContactPage from './pages/ContactPage';

// Phase 5 Public Community Pages
import TalentPage from './pages/TalentPage';
import TalentDetailPage from './pages/TalentDetailPage';
import ProjectsPage from './pages/ProjectsPage';
import ProjectDetailPage from './pages/ProjectDetailPage';
import StoriesPage from './pages/StoriesPage';
import StoryDetailPage from './pages/StoryDetailPage';
import LeadershipPage from './pages/LeadershipPage';
import CampusAmbassadorPage from './pages/CampusAmbassadorPage';

// Auth Pages
import RegisterPage from './pages/RegisterPage';
import LoginPage from './pages/LoginPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';

// Protected Student Pages
import StudentDashboard from './pages/StudentDashboard';
import StudentProfilePage from './pages/StudentProfilePage';
import SavedOpportunitiesPage from './pages/SavedOpportunitiesPage';
import MyApplicationsPage from './pages/MyApplicationsPage';
import ApplicationDetailPage from './pages/ApplicationDetailPage';
import MyEventsPage from './pages/MyEventsPage';
import MyVolunteerApplicationsPage from './pages/MyVolunteerApplicationsPage';

// Phase 5 Protected Student Pages
import StudentTalentPage from './pages/StudentTalentPage';
import StudentProjectsPage from './pages/StudentProjectsPage';
import StudentStoriesPage from './pages/StudentStoriesPage';
import StudentAchievementsPage from './pages/StudentAchievementsPage';

// Phase 6 Pages
import ServiceDetailPage from './pages/ServiceDetailPage';
import SupportPage from './pages/SupportPage';
import NewSupportRequestPage from './pages/NewSupportRequestPage';

// Phase 7 Public Identity & Impact Pages
import TeamMemberDetailPage from './pages/TeamMemberDetailPage';
import PlacementsPage from './pages/PlacementsPage';
import PlacementDetailPage from './pages/PlacementDetailPage';
import SuccessStoriesPage from './pages/SuccessStoriesPage';
import SuccessStoryDetailPage from './pages/SuccessStoryDetailPage';
import ImpactPage from './pages/ImpactPage';

// Phase 8 Online Sessions, Workshops & Recordings Pages
import SessionsPage from './pages/SessionsPage';
import SessionDetailPage from './pages/SessionDetailPage';
import WorkshopsPage from './pages/WorkshopsPage';
import PastSessionsPage from './pages/PastSessionsPage';
import MySessionsPage from './pages/MySessionsPage';

// Phase 6 Protected Student Pages
import StudentSupportListPage from './pages/StudentSupportListPage';
import StudentSupportDetailPage from './pages/StudentSupportDetailPage';
import StudentEnquiriesListPage from './pages/StudentEnquiriesListPage';

// Phase 9 Internal Admin & Operations Pages
import AdminDashboardPage from './pages/admin/AdminDashboardPage';
import AdminUsersPage from './pages/admin/AdminUsersPage';
import AdminOpportunitiesPage from './pages/admin/AdminOpportunitiesPage';
import AdminApplicationsPage from './pages/admin/AdminApplicationsPage';
import AdminEventsPage from './pages/admin/AdminEventsPage';
import AdminVolunteersPage from './pages/admin/AdminVolunteersPage';
import AdminServicesPage from './pages/admin/AdminServicesPage';
import AdminSupportPage from './pages/admin/AdminSupportPage';
import AdminEnquiriesPage from './pages/admin/AdminEnquiriesPage';
import AdminModerationPage from './pages/admin/AdminModerationPage';
import AdminPlacementsPage from './pages/admin/AdminPlacementsPage';
import AdminTeamPartnersPage from './pages/admin/AdminTeamPartnersPage';
import AdminReportsPage from './pages/admin/AdminReportsPage';
import AdminAuditLogsPage from './pages/admin/AdminAuditLogsPage';
import AdminSettingsPage from './pages/admin/AdminSettingsPage';

// Phase 10 Notifications & Communications Pages
import NotificationCenterPage from './pages/NotificationCenterPage';
import NotificationPreferencesPage from './pages/NotificationPreferencesPage';
import AdminCommunicationsPage from './pages/AdminCommunicationsPage';

// Phase 11 Production Pages
import AdminAnalyticsPage from './pages/admin/AdminAnalyticsPage';
import SearchPage from './pages/SearchPage';
import SavedItemsPage from './pages/SavedItemsPage';
import NotFoundPage from './pages/NotFoundPage';



function AppContent({ joinModalOpen, handleOpenJoinModal, handleCloseJoinModal }) {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');

  return (
    <div className="flex flex-col min-h-screen bg-[#F8FAFC] selection:bg-[#1D4ED8]/30 selection:text-[#2563EB]">
      {!isAdminRoute && <Navbar onOpenJoinModal={handleOpenJoinModal} />}
      
      <div className="flex-grow">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<HomePage onOpenJoinModal={handleOpenJoinModal} />} />
          <Route path="/about" element={<AboutPage onOpenJoinModal={handleOpenJoinModal} />} />
          <Route path="/opportunities" element={<OpportunitiesPage onOpenJoinModal={handleOpenJoinModal} />} />
          <Route path="/opportunities/:id" element={<OpportunityDetailPage />} />
          <Route path="/events" element={<EventsPage onOpenJoinModal={handleOpenJoinModal} />} />
          <Route path="/events/:id" element={<EventDetailPage />} />
          <Route path="/sessions" element={<SessionsPage onOpenJoinModal={handleOpenJoinModal} />} />
          <Route path="/sessions/:id" element={<SessionDetailPage />} />
          <Route path="/workshops" element={<WorkshopsPage />} />
          <Route path="/sessions/past" element={<PastSessionsPage />} />
          <Route path="/services" element={<ServicesPage onOpenJoinModal={handleOpenJoinModal} />} />
          <Route path="/services/:slug" element={<ServiceDetailPage />} />
          <Route path="/support" element={<SupportPage />} />
          <Route path="/support/new" element={<NewSupportRequestPage />} />
          <Route path="/community" element={<CommunityPage onOpenJoinModal={handleOpenJoinModal} />} />
          <Route path="/team" element={<TeamPage onOpenJoinModal={handleOpenJoinModal} />} />
          <Route path="/team/:id" element={<TeamMemberDetailPage />} />
          <Route path="/contact" element={<ContactPage />} />

          {/* Phase 5 Public Routes */}
          <Route path="/talent" element={<TalentPage />} />
          <Route path="/talent/:id" element={<TalentDetailPage />} />
          <Route path="/projects" element={<ProjectsPage />} />
          <Route path="/projects/:id" element={<ProjectDetailPage />} />
          <Route path="/stories" element={<StoriesPage />} />
          <Route path="/stories/:id" element={<StoryDetailPage />} />
          <Route path="/leadership" element={<LeadershipPage />} />
          <Route path="/campus-ambassador" element={<CampusAmbassadorPage />} />

          {/* Phase 7 Public Routes */}
          <Route path="/placements" element={<PlacementsPage />} />
          <Route path="/placements/:id" element={<PlacementDetailPage />} />
          <Route path="/impact" element={<ImpactPage onOpenJoinModal={handleOpenJoinModal} />} />
          <Route path="/success-stories" element={<SuccessStoriesPage />} />
          <Route path="/success-stories/:id" element={<SuccessStoryDetailPage />} />

          {/* Authentication Routes */}
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />

          {/* Protected Student Routes */}
          <Route
            path="/student/dashboard"
            element={
              <ProtectedRoute>
                <StudentDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/sessions"
            element={
              <ProtectedRoute>
                <MySessionsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/profile"
            element={
              <ProtectedRoute>
                <StudentProfilePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/events"
            element={
              <ProtectedRoute>
                <MyEventsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/volunteer-applications"
            element={
              <ProtectedRoute>
                <MyVolunteerApplicationsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/saved-opportunities"
            element={
              <ProtectedRoute>
                <SavedOpportunitiesPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/applications"
            element={
              <ProtectedRoute>
                <MyApplicationsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/applications/:id"
            element={
              <ProtectedRoute>
                <ApplicationDetailPage />
              </ProtectedRoute>
            }
          />

          {/* Phase 5 Protected Student Routes */}
          <Route
            path="/student/talent"
            element={
              <ProtectedRoute>
                <StudentTalentPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/projects"
            element={
              <ProtectedRoute>
                <StudentProjectsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/stories"
            element={
              <ProtectedRoute>
                <StudentStoriesPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/achievements"
            element={
              <ProtectedRoute>
                <StudentAchievementsPage />
              </ProtectedRoute>
            }
          />

          {/* Phase 6 Protected Student Routes */}
          <Route
            path="/student/support"
            element={
              <ProtectedRoute>
                <StudentSupportListPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/support/:id"
            element={
              <ProtectedRoute>
                <StudentSupportDetailPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/enquiries"
            element={
              <ProtectedRoute>
                <StudentEnquiriesListPage />
              </ProtectedRoute>
            }
          />

          {/* Phase 10 Protected Student & Admin Communication Routes */}
          <Route
            path="/notifications"
            element={
              <ProtectedRoute>
                <NotificationCenterPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/settings/notifications"
            element={
              <ProtectedRoute>
                <NotificationPreferencesPage />
              </ProtectedRoute>
            }
          />
          <Route path="/admin/communications" element={<AdminRoute><AdminCommunicationsPage /></AdminRoute>} />

          {/* Phase 9 Protected Admin & Operations Routes */}
          <Route path="/admin" element={<AdminRoute><AdminDashboardPage /></AdminRoute>} />
          <Route path="/admin/users" element={<AdminRoute><AdminUsersPage /></AdminRoute>} />
          <Route path="/admin/users/:id" element={<AdminRoute><AdminUsersPage /></AdminRoute>} />
          <Route path="/admin/opportunities" element={<AdminRoute><AdminOpportunitiesPage /></AdminRoute>} />
          <Route path="/admin/applications" element={<AdminRoute><AdminApplicationsPage /></AdminRoute>} />
          <Route path="/admin/events" element={<AdminRoute><AdminEventsPage /></AdminRoute>} />
          <Route path="/admin/volunteers" element={<AdminRoute><AdminVolunteersPage /></AdminRoute>} />
          <Route path="/admin/services" element={<AdminRoute><AdminServicesPage /></AdminRoute>} />
          <Route path="/admin/support" element={<AdminRoute><AdminSupportPage /></AdminRoute>} />
          <Route path="/admin/enquiries" element={<AdminRoute><AdminEnquiriesPage /></AdminRoute>} />
          <Route path="/admin/moderation" element={<AdminRoute><AdminModerationPage /></AdminRoute>} />
          <Route path="/admin/placements" element={<AdminRoute><AdminPlacementsPage /></AdminRoute>} />
          <Route path="/admin/team" element={<AdminRoute><AdminTeamPartnersPage /></AdminRoute>} />
          <Route path="/admin/reports" element={<AdminRoute><AdminReportsPage /></AdminRoute>} />
          {/* Phase 11 Public & Protected Routes */}
          <Route path="/search" element={<SearchPage />} />
          <Route path="/saved" element={<ProtectedRoute><SavedItemsPage /></ProtectedRoute>} />
          <Route path="/admin/analytics" element={<AdminRoute><AdminAnalyticsPage /></AdminRoute>} />

          {/* 404 Wildcard Catch-All */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </div>

      {!isAdminRoute && <Footer onOpenJoinModal={handleOpenJoinModal} />}
      <JoinModal isOpen={joinModalOpen} onClose={handleCloseJoinModal} />
    </div>
  );
}

function App() {
  const [joinModalOpen, setJoinModalOpen] = useState(false);

  const handleOpenJoinModal = () => {
    setJoinModalOpen(true);
  };

  const handleCloseJoinModal = () => {
    setJoinModalOpen(false);
  };

  return (
    <AuthProvider>
      <Router>
        <AppContent
          joinModalOpen={joinModalOpen}
          handleOpenJoinModal={handleOpenJoinModal}
          handleCloseJoinModal={handleCloseJoinModal}
        />
      </Router>
    </AuthProvider>
  );
}

export default App;
