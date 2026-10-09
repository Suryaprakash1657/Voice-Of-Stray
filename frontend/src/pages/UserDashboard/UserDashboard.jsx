import React from 'react';
import { useUserDashboard } from './hooks/useUserDashboard.js';
import DashboardHeader from './components/DashboardHeader.jsx';
import QuickActionsSection from './components/QuickActionsSection.jsx';
import RescueCasesSection from './components/RescueCasesSection.jsx';
import AdoptionRequestsSection from './components/AdoptionRequestsSection.jsx';
import SavedAnimalsSection from './components/SavedAnimalsSection.jsx';
import DonationsSection from './components/DonationsSection.jsx';
import NotificationsSection from './components/NotificationsSection.jsx';
import ProfileSummary from './components/ProfileSummary.jsx';
import DashboardStats from './components/DashboardStats.jsx';
import './user-dashboard.css';

export default function UserDashboard() {
  const {
    currentUser,
    profile,
    isVolunteerOrRescuer,
    rescueCases,
    adoptionRequests,
    savedAnimals,
    donations,
    notifications,
    stats,
    isNewUser,
    loading
  } = useUserDashboard();

  if (loading) {
    return (
      <div className="user-dashboard-page" style={{ justifyContent: 'center', alignItems: 'center' }}>
        <div style={{ color: 'var(--primary)', fontWeight: 700, fontSize: '1.2rem', padding: '40px' }}>
          <i className="ph ph-spinner-gap ph-spin" style={{ marginRight: '8px' }}></i> Loading Dashboard...
        </div>
      </div>
    );
  }

  if (!currentUser) {
    return null;
  }

  return (
    <div className="user-dashboard-page">
      {/* Layered Background SVG Decorations */}
      <div className="bg-decorations">
        {/* Paws top-left */}
        <svg
          className="decor-item"
          style={{ top: '12%', left: '5%', width: '100px', transform: 'rotate(-15deg)' }}
          viewBox="0 0 100 100"
        >
          <ellipse cx="25" cy="40" rx="9" ry="12" />
          <ellipse cx="42" cy="25" rx="9" ry="12" />
          <ellipse cx="62" cy="25" rx="9" ry="12" />
          <ellipse cx="78" cy="40" rx="9" ry="12" />
          <path d="M 28 65 C 28 50, 40 45, 52 45 C 64 45, 76 50, 76 65 C 76 80, 64 85, 52 85 C 40 85, 28 80, 28 65 Z" />
        </svg>

        {/* Paws bottom-right */}
        <svg
          className="decor-item"
          style={{ bottom: '15%', right: '4%', width: '120px', transform: 'rotate(25deg)' }}
          viewBox="0 0 100 100"
        >
          <ellipse cx="25" cy="40" rx="9" ry="12" />
          <ellipse cx="42" cy="25" rx="9" ry="12" />
          <ellipse cx="62" cy="25" rx="9" ry="12" />
          <ellipse cx="78" cy="40" rx="9" ry="12" />
          <path d="M 28 65 C 28 50, 40 45, 52 45 C 64 45, 76 50, 76 65 C 76 80, 64 85, 52 85 C 40 85, 28 80, 28 65 Z" />
        </svg>

        {/* Sparkles */}
        <svg className="decor-item sparkle" style={{ top: '30%', left: '45%', width: '22px' }} viewBox="0 0 24 24">
          <path d="M12,2 L14.5,9.5 L22,12 L14.5,14.5 L12,22 L9.5,14.5 L2,12 L9.5,9.5 Z" />
        </svg>
        <svg
          className="decor-item sparkle"
          style={{ bottom: '35%', left: '15%', width: '26px', animationDelay: '1.5s' }}
          viewBox="0 0 24 24"
        >
          <path d="M12,2 L14.5,9.5 L22,12 L14.5,14.5 L12,22 L9.5,14.5 L2,12 L9.5,9.5 Z" />
        </svg>
      </div>

      {/* Main Dashboard Container */}
      <main className="dashboard-container">
        {/* 1. Hero Header Banner */}
        <DashboardHeader
          user={currentUser}
          profile={profile}
          isNewUser={isNewUser}
          helpedCount={stats.helped}
        />

        {/* 2. Quick Actions Cards */}
        <QuickActionsSection isVolunteerOrRescuer={isVolunteerOrRescuer} />

        {/* 3. Multi-Column Grid */}
        <div className="dashboard-grid">
          {/* Main Column */}
          <div className="dashboard-main-col">
            <RescueCasesSection cases={rescueCases} />
            <AdoptionRequestsSection adoptionRequests={adoptionRequests} />
            <SavedAnimalsSection savedAnimals={savedAnimals} />
            <DonationsSection donations={donations} />
          </div>

          {/* Sidebar Column */}
          <div className="dashboard-side-col">
            <NotificationsSection notifications={notifications} />
            <ProfileSummary
              user={currentUser}
              profile={profile}
              isVolunteerOrRescuer={isVolunteerOrRescuer}
              isNewUser={isNewUser}
            />
          </div>
        </div>

        {/* 4. Lifesaver Impact Overview Statistics */}
        <DashboardStats stats={stats} isVolunteerOrRescuer={isVolunteerOrRescuer} />
      </main>
    </div>
  );
}
