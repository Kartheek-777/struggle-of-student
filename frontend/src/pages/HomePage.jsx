import React from 'react';
import HeroSection from '../components/HeroSection';
import WhoWeAreSection from '../components/WhoWeAreSection';
import WhatWeDoSection from '../components/WhatWeDoSection';
import OpportunitiesSection from '../components/OpportunitiesSection';
import FeaturedCommunitySection from '../components/FeaturedCommunitySection';
import UpcomingEventsSection from '../components/UpcomingEventsSection';
import VolunteerSection from '../components/VolunteerSection';
import SSCommunityTeamSection from '../components/SSCommunityTeamSection';
import StudentPlacementsSection from '../components/StudentPlacementsSection';
import ServicesSection from '../components/ServicesSection';
import FounderLeadershipSection from '../components/FounderLeadershipSection';
import UpcomingSessionsSection from '../components/UpcomingSessionsSection';
import LatestUpdatesSection from '../components/LatestUpdatesSection';
import JoinCTASection from '../components/JoinCTASection';
import ContactSection from '../components/ContactSection';

const HomePage = ({ onOpenJoinModal }) => {
  return (
    <main className="min-h-screen bg-[#F8FAFC]">
      <HeroSection onOpenJoinModal={onOpenJoinModal} />
      <WhoWeAreSection />
      <WhatWeDoSection />
      <UpcomingSessionsSection />
      <OpportunitiesSection onOpenJoinModal={onOpenJoinModal} />
      <FeaturedCommunitySection />
      <UpcomingEventsSection onOpenJoinModal={onOpenJoinModal} />
      <VolunteerSection onOpenJoinModal={onOpenJoinModal} />
      <SSCommunityTeamSection />
      <StudentPlacementsSection />
      <ServicesSection onOpenJoinModal={onOpenJoinModal} />
      <FounderLeadershipSection />
      <LatestUpdatesSection />
      <JoinCTASection onOpenJoinModal={onOpenJoinModal} />
      <ContactSection />
    </main>
  );
};

export default HomePage;
