import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useRescueCases } from './hooks/useRescueCases.js';
import RescueFilters from './components/RescueFilters.jsx';
import RescueCaseGrid from './components/RescueCaseGrid.jsx';
import { OverviewRescueMap } from './components/RescueMap.jsx';
import CaseDetails from './components/CaseDetails.jsx';
import Modal from '../../components/ui/Modal.jsx';
import Button from '../../components/ui/Button.jsx';
import './rescue.css';

export default function Rescue() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const queryId = searchParams.get('id');

  const {
    allCases,
    activeCases,
    filteredCases,
    selectedCase,
    selectedCaseId,
    setSelectedCaseId,
    stats,
    currentFilter,
    setCurrentFilter,
    searchQuery,
    setSearchQuery,
    currentUser,
    highlightedCaseId,
    setHighlightedCaseId,
    handleVolunteerAction
  } = useRescueCases(queryId);

  const [showLoginModal, setShowLoginModal] = useState(false);

  // Sync selectedCaseId with URL query params
  useEffect(() => {
    if (queryId) {
      setSelectedCaseId(queryId);
    } else {
      setSelectedCaseId(null);
    }
  }, [queryId, setSelectedCaseId]);

  // Handle Track Rescue click from card
  const handleTrackRescue = useCallback(
    (caseItem) => {
      const isLoggedIn = currentUser?.isLoggedIn || localStorage.getItem('isLoggedIn') === 'true';

      if (isLoggedIn) {
        setSearchParams({ id: `RSC-${caseItem.id}` });
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        setShowLoginModal(true);
      }
    },
    [currentUser, setSearchParams]
  );

  // Handle Back to Feed from Case Details
  const handleBackToFeed = useCallback(() => {
    setSearchParams({});
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [setSearchParams]);

  // Handle map pin selection / highlight
  const handleMapSelectCase = useCallback(
    (caseItem) => {
      setHighlightedCaseId(caseItem.id);
      const el = document.getElementById(`rescue-card-${caseItem.id}`);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    },
    [setHighlightedCaseId]
  );

  // Handle Community Action click
  const handleCommunityAction = useCallback(
    (action) => {
      const isLoggedIn = currentUser?.isLoggedIn || localStorage.getItem('isLoggedIn') === 'true';

      if (isLoggedIn) {
        if (action === 'volunteer') {
          navigate('/volunteer');
        } else if (action === 'donate') {
          navigate('/donate');
        } else {
          alert('Thank you! You are logged in. The ecosystem foster/sponsor panel is loading soon.');
        }
      } else {
        setShowLoginModal(true);
      }
    },
    [currentUser, navigate]
  );

  // If a case is selected and exists in database, render Detailed Tracking View
  if (selectedCaseId && selectedCase) {
    return (
      <div id="detailed-tracking-view">
        <CaseDetails
          caseItem={selectedCase}
          onBack={handleBackToFeed}
          onVolunteerAction={handleVolunteerAction}
          currentUser={currentUser}
          onTriggerAuth={() => setShowLoginModal(true)}
        />

        {/* Login Required Modal */}
        <Modal
          isOpen={showLoginModal}
          onClose={() => setShowLoginModal(false)}
          title="Login Required"
          footer={
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', width: '100%' }}>
              <Button
                variant="primary"
                onClick={() => navigate('/login')}
                style={{ width: '100%', padding: '14px', fontSize: '1rem' }}
              >
                Login
              </Button>
              <Button
                variant="secondary"
                onClick={() => navigate('/signup')}
                style={{ width: '100%', padding: '14px', fontSize: '1rem' }}
              >
                Create Account
              </Button>
            </div>
          }
        >
          <div style={{ textAlign: 'center', padding: '12px 0' }}>
            <div
              style={{
                width: '72px',
                height: '72px',
                borderRadius: '50%',
                background: '#fff7ed',
                border: '1px solid rgba(249, 115, 22, 0.2)',
                color: '#f97316',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '2.2rem',
                marginBottom: '16px'
              }}
            >
              <i className="ph-fill ph-shield-warning"></i>
            </div>
            <p style={{ color: '#7c2d12', fontWeight: 500, fontSize: '0.98rem', lineHeight: 1.6 }}>
              Login to track rescue missions, support cases, volunteer nearby, and participate in the rescue ecosystem.
            </p>
          </div>
        </Modal>
      </div>
    );
  }

  // Otherwise, render View 1: Main Live Rescue Discovery Feed & Ecology
  return (
    <div id="live-network-feed-view">
      <main className="rescue-container">
        {/* 1. Hero Section */}
        <section className="live-hero">
          <div className="hero-badge-live">
            <span className="live-dot-red" style={{ marginRight: '4px' }}></span> Live Rescue Network
          </div>
          <h1>Live Rescue Network</h1>
          <p>
            Real-time coordination, dispatch, and emergency response for stray animals in distress. See active cases, track dispatches, and volunteer nearby.
          </p>

          <div className="hero-counters">
            <div className="counter-box">
              <div className="counter-val" id="active-emergencies-val">
                {stats.activeEmergencies}{' '}
                <span
                  className="live-dot-red"
                  style={{ width: '8px', height: '8px', boxShadow: '0 0 8px rgba(239, 68, 68, 0.4)' }}
                ></span>
              </div>
              <span className="counter-label">Active Emergencies</span>
            </div>

            <div className="counter-box">
              <div className="counter-val" id="ngos-responding-val">
                {stats.ngosResponding}
              </div>
              <span className="counter-label">NGOs Responding</span>
            </div>

            <div className="counter-box">
              <div className="counter-val">
                {stats.volunteersNearby} <span className="pulse-dot-green"></span>
              </div>
              <span className="counter-label">Volunteers Nearby</span>
            </div>

            <div className="counter-box">
              <div className="counter-val" id="rescues-today-val">
                {stats.rescuesToday}
              </div>
              <span className="counter-label">Rescues Today</span>
            </div>
          </div>
        </section>

        {/* 2. Success Strip */}
        <section className="success-strip">
          <i className="ph-fill ph-sparkle"></i> Today {stats.rescuesToday} animals were safely rescued ❤️{' '}
          <i className="ph-fill ph-sparkle"></i>
        </section>

        {/* 3. Filter Section */}
        <RescueFilters
          activeFilter={currentFilter}
          onFilterChange={setCurrentFilter}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />

        {/* 4. Main Grid: Cards + Compassionate Light Map */}
        <div className="rescue-feed-grid">
          {/* Left Column: Rescue Cards List */}
          <RescueCaseGrid
            cases={filteredCases}
            onTrackRescue={handleTrackRescue}
            onResetFilter={() => {
              setCurrentFilter('all');
              setSearchQuery('');
            }}
            currentFilter={currentFilter}
            highlightedId={highlightedCaseId}
          />

          {/* Right Column: Interactive Map Widget */}
          <div className="sidebar-column" style={{ position: 'sticky', top: '88px' }}>
            <OverviewRescueMap
              activeCases={activeCases}
              onSelectCase={handleMapSelectCase}
              highlightedId={highlightedCaseId}
            />
          </div>
        </div>

        {/* 5. Community Action Section */}
        <section style={{ marginTop: '60px' }}>
          <h3 className="help-section-title">How You Can Help</h3>
          <div className="community-actions-grid">
            <div
              className="action-help-card help-trigger"
              onClick={() => handleCommunityAction('volunteer')}
            >
              <div className="action-help-icon">
                <i className="ph ph-hand-heart"></i>
              </div>
              <h4>Volunteer Nearby</h4>
              <p>Join on-site emergency rescues, transport injured strays, or help lead distress search operations.</p>
            </div>

            <div
              className="action-help-card help-trigger"
              onClick={() => handleCommunityAction('donate')}
            >
              <div className="action-help-icon">
                <i className="ph ph-first-aid-kit"></i>
              </div>
              <h4>Donate Supplies</h4>
              <p>Support our field responders and shelters by donating medications, high-quality dog/cat food, or blankets.</p>
            </div>

            <div
              className="action-help-card help-trigger"
              onClick={() => handleCommunityAction('foster')}
            >
              <div className="action-help-icon">
                <i className="ph ph-house"></i>
              </div>
              <h4>Foster Animal</h4>
              <p>Provide a safe, quiet space for healing and recuperation for animals recovering from major surgeries.</p>
            </div>

            <div
              className="action-help-card help-trigger"
              onClick={() => handleCommunityAction('sponsor')}
            >
              <div className="action-help-icon">
                <i className="ph ph-currency-circle-dollar"></i>
              </div>
              <h4>Sponsor Treatment</h4>
              <p>Fund critical veterinary surgeries, diagnostics, X-rays, or specialized medical treatments directly.</p>
            </div>
          </div>
        </section>
      </main>

      {/* Login Required Modal */}
      <Modal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        title="Login Required"
        footer={
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', width: '100%' }}>
            <Button
              variant="primary"
              onClick={() => navigate('/login')}
              style={{ width: '100%', padding: '14px', fontSize: '1rem' }}
            >
              Login
            </Button>
            <Button
              variant="secondary"
              onClick={() => navigate('/signup')}
              style={{ width: '100%', padding: '14px', fontSize: '1rem' }}
            >
              Create Account
            </Button>
          </div>
        }
      >
        <div style={{ textAlign: 'center', padding: '12px 0' }}>
          <div
            style={{
              width: '72px',
              height: '72px',
              borderRadius: '50%',
              background: '#fff7ed',
              border: '1px solid rgba(249, 115, 22, 0.2)',
              color: '#f97316',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '2.2rem',
              marginBottom: '16px'
            }}
          >
            <i className="ph-fill ph-shield-warning"></i>
          </div>
          <p style={{ color: '#7c2d12', fontWeight: 500, fontSize: '0.98rem', lineHeight: 1.6 }}>
            Login to track rescue missions, support cases, volunteer nearby, and participate in the rescue ecosystem.
          </p>
        </div>
      </Modal>
    </div>
  );
}
