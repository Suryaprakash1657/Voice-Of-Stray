import React, { useState } from 'react';
import RescueStatusBadge from './RescueStatusBadge.jsx';
import { DetailedProgressStepper, VerticalTimeline } from './RescueTimeline.jsx';
import { DetailedTrackingMap } from './RescueMap.jsx';
import { isUserAssignedVolunteer } from '../services/rescueStorage.js';

export function CaseDetails({
  caseItem,
  onBack = () => {},
  onVolunteerAction = () => {},
  currentUser = null,
  onTriggerAuth = () => {}
}) {
  const [actionNotice, setActionNotice] = useState(null);

  if (!caseItem) {
    return (
      <main className="rescue-container">
        <div style={{ textAlign: 'center', padding: '60px 20px' }}>
          <h2 style={{ color: '#431407' }}>Rescue Case Not Found</h2>
          <p style={{ color: '#7c2d12', margin: '16px 0 24px' }}>
            The requested rescue case could not be located in the system.
          </p>
          <button
            className="btn-track"
            style={{ margin: '0 auto', display: 'inline-flex' }}
            onClick={onBack}
          >
            <i className="ph ph-arrow-left"></i> Return to Live Feed
          </button>
        </div>
      </main>
    );
  }

  const severity = caseItem.severity || caseItem.priority || 'Normal';
  const isAssigned = isUserAssignedVolunteer(caseItem, currentUser);
  const statusStep = caseItem.statusStep !== undefined ? caseItem.statusStep : 0;
  const ngoName = caseItem.team?.ngo || 'Paws Haven NGO';
  const avatarInitials = ngoName.substring(0, 2).toUpperCase();

  const volunteerLead =
    caseItem.assignedVolunteerName ||
    (caseItem.team?.lead
      ? typeof caseItem.team.lead === 'object'
        ? caseItem.team.lead.username || caseItem.team.lead.name
        : caseItem.team.lead
      : null);

  const animalImage =
    caseItem.photos?.before ||
    caseItem.photo ||
    'https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&q=80&w=300';

  const etaDisplay =
    statusStep >= 8 ? 'Resolved' : statusStep >= 4 ? 'At Base' : '08 mins';

  // Dynamic status tag helpers
  const getAnimalStatusClass = (tagIndex) => {
    // 0: Stabilized, 1: Water Given, 2: First Aid Started, 3: Transporting, 4: Shelter Intake, 5: Recovery Ongoing
    if (tagIndex === 0 || tagIndex === 1) {
      return statusStep >= 4 ? 'completed' : 'upcoming';
    }
    if (tagIndex === 2) {
      if (statusStep === 4) return 'current';
      if (statusStep > 4) return 'completed';
      return 'upcoming';
    }
    if (tagIndex === 3) {
      if (statusStep === 3) return 'current';
      if (statusStep > 3) return 'completed';
      return 'upcoming';
    }
    if (tagIndex === 4) {
      if (statusStep === 4 || statusStep === 5) return 'current';
      if (statusStep > 5) return 'completed';
      return 'upcoming';
    }
    if (tagIndex === 5) {
      if (statusStep === 6) return 'current';
      if (statusStep > 6) return 'completed';
      return 'upcoming';
    }
    return 'upcoming';
  };

  const getRescueOutcomeClass = (tagIndex) => {
    // 0: Medical recovery, 1: Shelter care, 2: Foster, 3: Returned to owner, 4: Adopted
    if (tagIndex === 0) {
      if (statusStep === 5) return 'current';
      if (statusStep > 5) return 'completed';
    }
    if (tagIndex === 1) {
      if (statusStep === 6) return 'current';
      if (statusStep > 6) return 'completed';
    }
    if (tagIndex === 4) {
      if (statusStep === 8) return 'current';
      if (statusStep > 8) return 'completed';
    }
    return 'upcoming';
  };

  const handleActionClick = (msg) => {
    setActionNotice(msg);
    setTimeout(() => setActionNotice(null), 4000);
  };

  return (
    <main className="rescue-container">
      {/* Header */}
      <header className="rescue-header">
        <div style={{ marginBottom: '12px' }}>
          <button
            onClick={onBack}
            style={{
              color: 'var(--primary, #f97316)',
              fontWeight: 700,
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              fontSize: '1rem',
              padding: 0
            }}
          >
            <i className="ph ph-arrow-left"></i> Back to Live Rescue Network
          </button>
        </div>
        <h1 style={{ fontSize: '2rem', color: '#431407', fontWeight: 800 }}>Track Rescue Status</h1>
        <p style={{ fontSize: '1rem', color: '#7c2d12', marginTop: '4px', fontWeight: 600 }}>
          Monitor live status updates for case #RSC-{caseItem.id}
        </p>
        <p style={{ color: '#7c2d12', fontSize: '1.1rem', marginTop: '8px', fontWeight: 500 }}>
          Live updates from report to rescue, treatment, and safe recovery.
        </p>
      </header>

      {/* Top Info Card */}
      <div className="card info-card">
        <img src={animalImage} alt={caseItem.animal || 'Animal'} />

        <div className="info-block" style={{ flex: 1, minWidth: '150px' }}>
          <span className="info-label">Report ID</span>
          <span className="info-value">#RSC-{caseItem.id}</span>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: '4px' }}>
            <RescueStatusBadge type="severity" value={severity} />
            <RescueStatusBadge type="lifecycle" value={caseItem.status} step={statusStep} />
          </div>
        </div>

        <div className="info-block" style={{ flex: 2, minWidth: '200px' }}>
          <span className="info-label">Location</span>
          <span className="info-value">{caseItem.location || 'Unknown'}</span>
        </div>

        <div className="info-block" style={{ flex: 2, minWidth: '200px' }}>
          <span className="info-label">Condition</span>
          <span className="info-value">
            {caseItem.condition || caseItem.observedCondition || caseItem.animal || 'Injured Animal'}
          </span>
        </div>

        <div className="info-block" style={{ flex: 1, minWidth: '150px', textAlign: 'right' }}>
          <span className="info-label">Estimated Arrival</span>
          <span className="info-value" style={{ color: '#c2410c', fontSize: '1.8rem' }}>
            {etaDisplay}
          </span>
        </div>
      </div>

      {/* Progress Milestone Stepper */}
      <DetailedProgressStepper statusStep={statusStep} caseItem={caseItem} />

      {/* Action Notice Alert */}
      {actionNotice && (
        <div
          style={{
            padding: '12px 20px',
            background: '#fff7ed',
            border: '1px solid #fdba74',
            borderRadius: '12px',
            color: '#9a3412',
            fontWeight: 600,
            marginBottom: '20px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}
        >
          <i className="ph-fill ph-info"></i> {actionNotice}
        </div>
      )}

      {/* 2-Column Details Grid */}
      <div className="rescue-grid">
        {/* Left Column: GPS Map & Photos */}
        <div className="left-col">
          <DetailedTrackingMap caseItem={caseItem} onRefresh={() => window.location.reload()} />

          <div
            style={{
              textAlign: 'center',
              color: '#9a3412',
              fontSize: '0.95rem',
              marginBottom: '24px',
              fontWeight: 600
            }}
          >
            <i className="ph-fill ph-info"></i> Rescue team is 2.3 km away
          </div>

          <div className="card photos-section">
            <h3
              style={{
                fontSize: '0.9rem',
                color: '#9a3412',
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
                marginBottom: '12px'
              }}
            >
              On-Site & Treatment Photos
            </h3>
            <div className="photos-scroll">
              <div className="photo-placeholder">
                <i className="ph ph-camera" style={{ fontSize: '2rem' }}></i>
                <span style={{ fontSize: '0.75rem', fontWeight: 700 }}>BEFORE RESCUE</span>
              </div>
              <div className="photo-placeholder">
                <i className="ph ph-first-aid" style={{ fontSize: '2rem' }}></i>
                <span style={{ fontSize: '0.75rem', fontWeight: 700 }}>DURING TREATMENT</span>
              </div>
              <div
                className="photo-placeholder"
                style={{ background: 'white', border: '1px solid rgba(249, 115, 22, 0.15)' }}
              >
                <i className="ph ph-house" style={{ fontSize: '2rem', color: '#fdba74' }}></i>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#9a3412' }}>
                  SHELTER INTAKE
                </span>
              </div>
              <div
                className="photo-placeholder"
                style={{ background: 'white', border: '1px solid rgba(249, 115, 22, 0.15)' }}
              >
                <i className="ph ph-heartbeat" style={{ fontSize: '2rem', color: '#fdba74' }}></i>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#9a3412' }}>
                  RECOVERY PROGRESS
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Team, Timeline, Mission, Status */}
        <div className="right-col">
          {/* Rescue Team Card */}
          <div className="card rescue-card">
            <h3>
              <i className="ph ph-shield-check"></i> Rescue Team
            </h3>

            <div className="team-header">
              <div className="team-avatar">{avatarInitials}</div>
              <div>
                <div
                  style={{
                    fontWeight: 700,
                    color: '#431407',
                    fontSize: '1.1rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}
                >
                  {ngoName}{' '}
                  <i
                    className="ph-fill ph-seal-check"
                    style={{ color: 'var(--success-green, #10b981)', fontSize: '1rem' }}
                  ></i>
                </div>
                <div
                  style={{
                    fontSize: '0.85rem',
                    color: '#9a3412',
                    fontWeight: 600,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}
                >
                  <span>Assigned Organization</span> •
                  <span style={{ display: 'flex', alignItems: 'center', color: '#fbbf24' }}>
                    <i className="ph-fill ph-star"></i> 4.9
                  </span>
                </div>
              </div>
            </div>

            {/* Volunteer Lead Box */}
            <div className="volunteer-box">
              {volunteerLead ? (
                <>
                  <div className="name">
                    <i
                      className="ph ph-user"
                      style={{ color: 'var(--primary, #f97316)', fontSize: '1.2rem' }}
                    ></i>{' '}
                    {volunteerLead}
                  </div>
                  <div className="role">Volunteer Lead</div>
                </>
              ) : (
                <div
                  style={{
                    padding: '8px',
                    border: '1.5px dashed rgba(249, 115, 22, 0.3)',
                    borderRadius: '8px',
                    textAlign: 'center',
                    background: 'rgba(249, 115, 22, 0.02)',
                    width: '100%'
                  }}
                >
                  <p style={{ fontSize: '0.8rem', color: '#7c2d12', margin: 0, fontWeight: 600 }}>
                    <i
                      className="ph ph-user-plus"
                      style={{ fontSize: '1.1rem', verticalAlign: 'middle', marginRight: '4px' }}
                    ></i>
                    No volunteer assigned yet
                  </p>
                </div>
              )}
            </div>

            {/* Action Buttons Grid */}
            <div className="action-buttons-grid">
              <button
                className="btn-chat"
                onClick={() => handleActionClick('Chat channel with responder NGO opened.')}
              >
                <i className="ph-fill ph-chat-text"></i> Chat
              </button>
              <button
                style={{
                  background: 'white',
                  border: '1px solid rgba(249, 115, 22, 0.15)',
                  color: '#7c2d12'
                }}
                onClick={() => handleActionClick('Contacting dispatch helpline: +91 98200 12345')}
              >
                <i className="ph ph-phone"></i> Contact
              </button>
              <button
                className="btn-support"
                style={{ gridColumn: 'span 2' }}
                onClick={() => handleActionClick('Thank you for supporting this rescue mission!')}
              >
                <i className="ph-fill ph-heart"></i> Support
              </button>
            </div>

            {/* Help This Rescue Grid */}
            <div
              style={{
                marginTop: '24px',
                borderTop: '1px solid rgba(249, 115, 22, 0.12)',
                paddingTop: '20px'
              }}
            >
              <h4
                style={{
                  fontSize: '0.95rem',
                  color: '#431407',
                  marginBottom: '12px',
                  fontWeight: 800
                }}
              >
                Help This Rescue
              </h4>
              <div className="help-actions-grid">
                <div
                  className="help-action-btn"
                  onClick={() => handleActionClick('Redirecting to case donation portal...')}
                >
                  <i className="ph ph-currency-circle-dollar"></i>
                  Donate to Case
                </div>
                <div
                  className="help-action-btn"
                  onClick={() => {
                    navigator.clipboard?.writeText(window.location.href);
                    handleActionClick('Rescue link copied to clipboard!');
                  }}
                >
                  <i className="ph ph-share-network"></i>
                  Share Rescue
                </div>
                <div
                  className="help-action-btn"
                  onClick={() => {
                    if (currentUser) {
                      handleActionClick('Registered nearby for emergency standby.');
                    } else {
                      onTriggerAuth();
                    }
                  }}
                >
                  <i className="ph ph-hand-heart"></i>
                  Volunteer Nearby
                </div>
                <div
                  className="help-action-btn"
                  onClick={() => handleActionClick('Medical sponsorship form loaded.')}
                >
                  <i className="ph ph-first-aid-kit"></i>
                  Medical Sponsor
                </div>
              </div>
            </div>
          </div>

          {/* Live Updates Timeline Card */}
          <div className="card rescue-card">
            <h3>
              <i className="ph ph-clock-counter-clockwise"></i> Live Updates
              <span
                style={{
                  marginLeft: 'auto',
                  width: '8px',
                  height: '8px',
                  background: 'var(--primary, #f97316)',
                  borderRadius: '50%',
                  boxShadow: '0 0 0 4px rgba(249, 115, 22, 0.25)'
                }}
              ></span>
            </h3>
            <div className="scrollable-card">
              <VerticalTimeline timeline={caseItem.timeline || []} />
            </div>
          </div>

          {/* Volunteer Mission Panel (Only for assigned volunteer) */}
          {isAssigned && (
            <div className="card rescue-card" id="volunteer-mission-panel">
              <h3
                style={{
                  fontSize: '1.1rem',
                  color: '#431407',
                  fontWeight: 800,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  marginBottom: '16px'
                }}
              >
                <i className="ph-fill ph-shield-check" style={{ color: 'var(--primary, #f97316)' }}></i>
                Volunteer Mission Panel
              </h3>
              <div id="volunteer-mission-content">
                {statusStep === 2 && (
                  <>
                    <p
                      style={{
                        color: '#7c2d12',
                        fontSize: '0.95rem',
                        marginBottom: '16px',
                        fontWeight: 500,
                        lineHeight: 1.5
                      }}
                    >
                      You have been assigned to this rescue mission. Click below to indicate you are heading to the location.
                    </p>
                    <button
                      className="btn-volunteer-action"
                      onClick={() => onVolunteerAction(caseItem.id, 3)}
                    >
                      <i className="ph ph-path"></i> Mark En Route
                    </button>
                  </>
                )}

                {statusStep === 3 && (
                  <>
                    <p
                      style={{
                        color: '#7c2d12',
                        fontSize: '0.95rem',
                        marginBottom: '16px',
                        fontWeight: 500,
                        lineHeight: 1.5
                      }}
                    >
                      You are en route. Click below once you have successfully rescued the animal and handed them over to the NGO.
                    </p>
                    <button
                      className="btn-volunteer-action"
                      onClick={() => onVolunteerAction(caseItem.id, 4)}
                    >
                      <i className="ph ph-first-aid"></i> Mark Animal Rescued
                    </button>
                  </>
                )}

                {statusStep >= 4 && (
                  <blockquote
                    style={{
                      margin: 0,
                      padding: '12px 16px',
                      borderLeft: '4px solid var(--success-green, #10b981)',
                      background: 'rgba(16, 185, 129, 0.05)',
                      color: '#065f46',
                      fontSize: '0.95rem',
                      fontWeight: 600,
                      lineHeight: 1.5,
                      borderRadius: '0 8px 8px 0'
                    }}
                  >
                    Mission Completed. The rescued animal has been safely handed over to the NGO. Further updates will now be managed by the NGO.
                  </blockquote>
                )}
              </div>
            </div>
          )}

          {/* Animal Status Panel */}
          <div className="card rescue-card">
            <h3>
              <i className="ph ph-heartbeat"></i> Animal Status
            </h3>
            <div className="scrollable-card" style={{ maxHeight: '200px' }}>
              <div className="tags-container">
                <div className={`status-tag ${getAnimalStatusClass(0)}`}>
                  <i className="ph-fill ph-check-circle"></i> Stabilized
                </div>
                <div className={`status-tag ${getAnimalStatusClass(1)}`}>
                  <i className="ph-fill ph-check-circle"></i> Water Given
                </div>
                <div className={`status-tag ${getAnimalStatusClass(2)}`}>
                  <i className="ph-fill ph-activity"></i> First Aid Started
                </div>
                <div className={`status-tag ${getAnimalStatusClass(3)}`}>
                  <i className="ph ph-ambulance"></i> Transporting
                </div>
                <div className={`status-tag ${getAnimalStatusClass(4)}`}>
                  <i className="ph ph-house"></i> Shelter Intake
                </div>
                <div className={`status-tag ${getAnimalStatusClass(5)}`}>
                  <i className="ph ph-bandaids"></i> Recovery Ongoing
                </div>
              </div>
            </div>
          </div>

          {/* Rescue Outcome States */}
          <div className="card rescue-card">
            <h3>
              <i className="ph ph-flag-checkered"></i> Rescue Outcome
            </h3>
            <div className="scrollable-card" style={{ maxHeight: '200px' }}>
              <div className="tags-container">
                <div className={`status-tag ${getRescueOutcomeClass(0)}`}>
                  <i className="ph ph-bandaids"></i> Medical recovery
                </div>
                <div className={`status-tag ${getRescueOutcomeClass(1)}`}>
                  <i className="ph ph-house"></i> Shelter care
                </div>
                <div className={`status-tag ${getRescueOutcomeClass(2)}`}>
                  <i className="ph ph-heart"></i> Foster
                </div>
                <div className={`status-tag ${getRescueOutcomeClass(3)}`}>
                  <i className="ph ph-user"></i> Returned to owner
                </div>
                <div className={`status-tag ${getRescueOutcomeClass(4)}`}>
                  <i className="ph ph-check-circle"></i> Adopted
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

export default React.memo(CaseDetails);
