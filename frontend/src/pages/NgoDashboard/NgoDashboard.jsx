import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useNgoDashboard } from './hooks/useNgoDashboard';
import NgoSidebar from './components/NgoSidebar';
import NgoHeader from './components/NgoHeader';
import NgoHeroStats from './components/NgoHeroStats';
import IncomingReportsSection from './components/IncomingReportsSection';
import ActiveRescuesSection from './components/ActiveRescuesSection';
import VolunteersListSection from './components/VolunteersListSection';
import RescueWorkflowSection from './components/RescueWorkflowSection';
import PendingAdoptionsSection from './components/PendingAdoptionsSection';
import VolunteerApplicationsSection from './components/VolunteerApplicationsSection';
import DonationOperationsSection from './components/DonationOperationsSection';
import QuickActionsShortcuts from './components/QuickActionsShortcuts';
import NgoModal from './components/NgoModal';
import './ngo-dashboard.css';

export function NgoDashboard() {
  const navigate = useNavigate();
  const {
    ngoUser,
    stats,
    incomingReports,
    activeCases,
    approvedVolunteers,
    volunteerApplications,
    pendingAdoptions,
    donationsOverview,
    handleAcceptReport,
    handleUpdateCaseStatus,
    handleApproveVolunteer,
    handleRejectVolunteer,
    handleApproveAdoption,
    handleRejectAdoption
  } = useNgoDashboard();

  const [modalState, setModalState] = useState(null);

  useEffect(() => {
    document.title = 'NGO Operations Hub | Voice of Stray';
  }, []);

  const scrollToSection = (sectionId) => {
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
      el.style.transition = 'border-color 0.3s ease, box-shadow 0.3s ease';
      el.style.borderColor = 'var(--primary)';
      el.style.boxShadow = '0 0 15px rgba(249, 115, 22, 0.25)';
      setTimeout(() => {
        el.style.borderColor = '';
        el.style.boxShadow = '';
      }, 1500);
    }
  };

  const handleOpenAnimalsUnderCare = () => {
    setModalState({
      type: 'animals_under_care',
      title: (
        <>
          <i className="ph-fill ph-house-line" style={{ color: 'var(--primary)', marginRight: '8px' }}></i>
          Animals Under Care Listing
        </>
      )
    });
  };

  const handleOpenSuccessfulRescues = () => {
    setModalState({
      type: 'successful_rescues',
      title: (
        <>
          <i className="ph-fill ph-check-circle" style={{ color: '#15803d', marginRight: '8px' }}></i>
          Successful Rescues This Month
        </>
      )
    });
  };

  const handleReviewVolunteer = (app) => {
    setModalState({
      type: 'volunteer_application',
      title: (
        <>
          <i className="ph-fill ph-hand-heart" style={{ color: 'var(--primary)', marginRight: '8px' }}></i>
          Volunteer Application for {app.name}
        </>
      ),
      data: app
    });
  };

  const handleReviewAdoption = (app) => {
    if (!app) return;
    setModalState({
      type: 'adoption_application',
      title: (
        <>
          <i className="ph-fill ph-house-line" style={{ color: 'var(--primary)', marginRight: '8px' }}></i>
          Adoption Application for {app.petName || 'Rescue Pet'}
        </>
      ),
      data: app
    });
  };

  return (
    <div className="ngo-dashboard-wrapper">
      <div className="ops-container">
        {/* Sidebar */}
        <NgoSidebar
          ngoUser={ngoUser}
          stats={stats}
          scrollToSection={scrollToSection}
        />

        {/* Main Panel */}
        <main className="ops-main-panel">
          {/* Hero Welcome */}
          <NgoHeader ngoUser={ngoUser} />

          {/* Hero Summary Stats */}
          <NgoHeroStats
            stats={stats}
            scrollToSection={scrollToSection}
            onOpenAnimalsUnderCare={handleOpenAnimalsUnderCare}
            onOpenSuccessfulRescues={handleOpenSuccessfulRescues}
          />

          {/* Incoming Reports (Priority) */}
          <IncomingReportsSection
            reports={incomingReports}
            onAccept={handleAcceptReport}
          />

          {/* Active Operations & Volunteers Grid */}
          <div className="ops-grid">
            <ActiveRescuesSection
              activeCases={activeCases}
              onUpdateStatus={handleUpdateCaseStatus}
            />

            <VolunteersListSection
              volunteers={approvedVolunteers}
            />
          </div>

          {/* Lifecycle Workflow */}
          <RescueWorkflowSection />

          {/* Pending Adoptions */}
          <div id="pending-adoptions-section">
            <PendingAdoptionsSection
              adoptions={pendingAdoptions}
              onApprove={handleApproveAdoption}
              onReject={handleRejectAdoption}
              onReview={handleReviewAdoption}
              onApproveAdoption={handleApproveAdoption}
              onRejectAdoption={handleRejectAdoption}
              onReviewAdoption={handleReviewAdoption}
              onManageClick={() => navigate('/ngo-adoptions')}
            />
          </div>

          {/* Volunteer Applications */}
          <VolunteerApplicationsSection
            applications={volunteerApplications}
            onApprove={handleApproveVolunteer}
            onReject={handleRejectVolunteer}
            onViewDetails={handleReviewVolunteer}
          />

          {/* Donations Overview */}
          <div id="donations-section">
            <DonationOperationsSection
              donationsOverview={donationsOverview}
            />
          </div>

          {/* Quick Actions Shortcuts */}
          <QuickActionsShortcuts
            scrollToSection={scrollToSection}
            onAction={(action) => {
              if (action === 'create-update') {
                alert('Creating rescue update log entry...');
              }
            }}
          />
        </main>
      </div>

      {/* Footer */}
      <footer
        className="premium-footer"
        style={{
          backgroundColor: '#fcf6f0',
          padding: '64px 24px 32px',
          borderTop: '1px solid rgba(249, 115, 22, 0.15)'
        }}
      >
        <div
          className="footer-bottom"
          style={{
            maxWidth: '1200px',
            margin: '0 auto',
            textAlign: 'center',
            color: 'var(--text-muted)',
            fontSize: '0.9rem'
          }}
        >
          <p style={{ marginBottom: '8px' }}>
            Made with <i className="ph-fill ph-heart" style={{ color: 'var(--alert)' }}></i> for stray rescue welfare NGOs
          </p>
          <p>&copy; 2026 Voice of Stray NGO Operations. All rights reserved.</p>
        </div>
      </footer>

      {/* Reusable Glassmorphic Modal */}
      <NgoModal
        modalData={modalState}
        onClose={() => setModalState(null)}
        onApproveVolunteer={handleApproveVolunteer}
        onRejectVolunteer={handleRejectVolunteer}
        onApproveAdoption={handleApproveAdoption}
        onRejectAdoption={handleRejectAdoption}
      />
    </div>
  );
}

export default NgoDashboard;
