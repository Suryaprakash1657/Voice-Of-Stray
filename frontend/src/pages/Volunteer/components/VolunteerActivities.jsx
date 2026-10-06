import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import AssignmentCard from './AssignmentCard.jsx';
import EmptyVolunteerState from './EmptyVolunteerState.jsx';

export function VolunteerActivities({
  currentUser,
  statusInfo,
  assignments = [],
  availableRescueCases = [],
  opportunities = [],
  history = [],
  metrics,
  levelInfo,
  badges = [],
  onCompleteAssignment,
  onUpdateAvailability,
  onSubmitRescueRequest,
  onAcceptOpportunity,
  onBackToOverview
}) {
  // Modal states
  const [selectedCase, setSelectedCase] = useState(null);
  const [selectedOpp, setSelectedOpp] = useState(null);
  const [selectedBadge, setSelectedBadge] = useState(null);
  const [isAvailabilityModalOpen, setIsAvailabilityModalOpen] = useState(false);
  const [availSelect, setAvailSelect] = useState(statusInfo?.availability || 'Weekends');

  const username = currentUser?.name || currentUser?.username || 'Arjun';
  const roleDisplay = statusInfo?.role || 'Emergency Rescue';
  const joinedDisplay = statusInfo?.applicationDate ? 'May 2026' : 'June 2026';
  const availDisplay = statusInfo?.availability || 'Weekends';

  const handleSaveAvailability = (e) => {
    e.preventDefault();
    if (onUpdateAvailability) {
      onUpdateAvailability(availSelect);
    }
    setIsAvailabilityModalOpen(false);
  };

  const scrollToSection = (sectionId) => {
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="activities-container fade-in">
      {/* Back Navigation */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        {onBackToOverview ? (
          <button
            onClick={onBackToOverview}
            className="back-link"
            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
          >
            <i className="ph ph-arrow-left"></i> Back to Volunteer Overview
          </button>
        ) : (
          <Link to="/user-dashboard" className="back-link">
            <i className="ph ph-arrow-left"></i> Back to Dashboard
          </Link>
        )}
      </div>

      {/* Hero Welcome Banner */}
      <div className="activities-hero-banner">
        <i
          className="ph-fill ph-paw-print"
          style={{
            fontSize: '15rem',
            transform: 'rotate(-10deg)',
            position: 'absolute',
            left: '20px',
            top: '20px',
            opacity: 0.06,
            color: '#ea580c',
            pointerEvents: 'none'
          }}
        ></i>

        <div className="hero-banner-content">
          <h1>
            Welcome back, <span>{username}</span> 👋
          </h1>
          <p>Thank you for being a lifeline for stray companion animals 🐾</p>
          <p style={{ fontSize: '0.92rem', color: 'var(--text-muted, #64748b)', opacity: 0.9 }}>
            Manage your ongoing rescue operations, view achievements, and accept recommendations.
          </p>
        </div>

        <div className="hero-banner-illustration">
          <img
            src="https://images.unsplash.com/photo-1596492784531-6e6eb5ea9993?auto=format&fit=crop&q=80&w=400"
            alt="Rescuer"
          />
        </div>
      </div>

      {/* Section: Quick Actions */}
      <section className="quick-actions-section">
        <div className="quick-actions-grid">
          {/* Action 1: Find Opportunities */}
          <div
            className="action-card find"
            onClick={() => scrollToSection('recommended-opps-section')}
          >
            <div className="action-icon">
              <i className="ph-fill ph-magnifying-glass"></i>
            </div>
            <h3>Find Opportunities</h3>
            <p>Find new street feeding drives and rescue cases.</p>
          </div>

          {/* Action 2: Update Availability */}
          <div
            className="action-card availability"
            onClick={() => {
              setAvailSelect(statusInfo?.availability || 'Weekends');
              setIsAvailabilityModalOpen(true);
            }}
          >
            <div className="action-icon">
              <i className="ph-fill ph-calendar"></i>
            </div>
            <h3>Update Availability</h3>
            <p>Change your volunteer hours and active days.</p>
          </div>

          {/* Action 3: View Volunteer Profile */}
          <Link
            to="/user-dashboard"
            className="action-card profile"
            style={{ textDecoration: 'none' }}
          >
            <div className="action-icon">
              <i className="ph-fill ph-user"></i>
            </div>
            <h3>View Volunteer Profile</h3>
            <p>Manage your contact details and skills preferences.</p>
          </Link>
        </div>
      </section>

      {/* Main Grid Layout */}
      <div className="activities-grid-layout">
        {/* Left Column */}
        <div className="activities-main-col">
          {/* 1. Current Rescue Assignments */}
          <section className="glass-card">
            <div className="section-header-row">
              <span className="section-title-wrap">
                <i className="ph-fill ph-ambulance"></i>
                <span>Current Rescue Assignments</span>
              </span>
              <span className="sidebar-badge count-green" style={{ background: '#ecfdf5', color: '#059669', fontWeight: 800, padding: '3px 8px', borderRadius: '4px', fontSize: '0.75rem' }}>
                {assignments.length} Active
              </span>
            </div>

            {assignments.length === 0 ? (
              <EmptyVolunteerState
                icon="ph-shield-check"
                title="No active rescue assignments"
                description="NGOs will assign you to active cases when dispatch is needed."
              />
            ) : (
              <div className="active-list">
                {assignments.map(c => (
                  <AssignmentCard
                    key={c.id}
                    caseItem={c}
                    onViewDetails={(item) => setSelectedCase(item)}
                  />
                ))}
              </div>
            )}
          </section>

          {/* 2. Available Rescue Opportunities */}
          <section className="glass-card">
            <div className="section-header-row">
              <span className="section-title-wrap">
                <i className="ph-fill ph-binoculars"></i>
                <span>Available Rescue Opportunities</span>
              </span>
              <span className="sidebar-badge count-green" style={{ background: '#eff6ff', color: '#2563eb', fontWeight: 800, padding: '3px 8px', borderRadius: '4px', fontSize: '0.75rem' }}>
                {availableRescueCases.length} Available
              </span>
            </div>

            {availableRescueCases.length === 0 ? (
              <EmptyVolunteerState
                icon="ph-circle-dashed"
                title="All caught up!"
                description="There are no active rescue cases waiting for volunteers at this time."
              />
            ) : (
              <div className="active-list">
                {availableRescueCases.map(c => {
                  const severity = c.severity || c.priority || 'Normal';
                  const isUrgent = severity.toLowerCase().includes('emergency') || severity.toLowerCase().includes('high');

                  return (
                    <div
                      key={c.id}
                      className="active-item"
                      style={{ cursor: 'pointer' }}
                      onClick={() => setSelectedOpp(c)}
                    >
                      <div className="active-item-left">
                        <div
                          className="active-item-icon rescue"
                          style={{ background: 'rgba(249, 115, 22, 0.08)', color: '#ea580c' }}
                        >
                          <i className="ph-fill ph-ambulance"></i>
                        </div>
                        <div className="active-item-info">
                          <h5 style={{ fontWeight: 800, color: '#1e293b', fontSize: '0.95rem', margin: '0 0 4px 0' }}>
                            #RSC-{c.id} - {c.animal}
                            <span
                              className="status-pill"
                              style={{
                                background: isUrgent ? '#fee2e2' : '#f0fdf4',
                                color: isUrgent ? '#ef4444' : '#15803d',
                                border: `1px solid ${isUrgent ? '#fca5a5' : '#bbf7d0'}`,
                                marginLeft: '8px',
                                fontSize: '0.7rem',
                                padding: '2px 8px',
                                borderRadius: '4px',
                                textTransform: 'uppercase',
                                fontWeight: 800
                              }}
                            >
                              {severity}
                            </span>
                          </h5>
                          <p style={{ margin: 0, fontSize: '0.82rem', color: 'var(--text-muted, #64748b)', lineHeight: 1.5 }}>
                            <strong>NGO:</strong> {c.team?.ngo || 'Paws Haven NGO'} &bull;{' '}
                            <strong>Reported:</strong> {c.reportedTime || 'Just now'} &bull;{' '}
                            <strong>Location:</strong> {c.location}
                          </p>
                        </div>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <span
                          className="status-pill pending"
                          style={{
                            background: '#fffbeb',
                            color: '#ea580c',
                            border: '1px solid #fed7aa',
                            padding: '4px 10px',
                            fontWeight: 700,
                            borderRadius: '9999px',
                            fontSize: '0.75rem'
                          }}
                        >
                          <i className="ph ph-hourglass" style={{ verticalAlign: 'middle' }}></i> Waiting for Volunteer
                        </span>
                        <button className="btn-view-details" onClick={(e) => { e.stopPropagation(); setSelectedOpp(c); }}>
                          View
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </section>

          {/* 3. Volunteer History */}
          <section className="glass-card">
            <div className="section-header-row">
              <span className="section-title-wrap">
                <i className="ph-fill ph-clock-counter-clockwise"></i>
                <span>Volunteer History</span>
              </span>
            </div>

            {history.length === 0 ? (
              <EmptyVolunteerState
                icon="ph-clock-counter-clockwise"
                title="No completed activities yet"
                description="Your completed tasks and drives will be listed here."
              />
            ) : (
              <div className="history-table-container">
                <table className="history-table">
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Activity Type</th>
                      <th>Outcome</th>
                    </tr>
                  </thead>
                  <tbody>
                    {history.map((item, idx) => (
                      <tr key={idx}>
                        <td>{item.date}</td>
                        <td>{item.type}</td>
                        <td>
                          <span className="history-outcome">
                            <i className="ph-fill ph-check-circle"></i> {item.outcome || 'Completed'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>

          {/* 4. Recommended Opportunities */}
          <section className="glass-card" id="recommended-opps-section">
            <div className="section-header-row">
              <span className="section-title-wrap">
                <i className="ph-fill ph-sparkles"></i>
                <span>Recommended Opportunities</span>
              </span>
            </div>

            {opportunities.length === 0 ? (
              <EmptyVolunteerState
                icon="ph-map-pin-line"
                title="No opportunities found"
                description="NGOs will list opportunities here when reports are accepted and need responders."
              />
            ) : (
              <div className="opp-card-grid">
                {opportunities.map(opp => (
                  <div
                    key={opp.id}
                    className="opp-row-item"
                    onClick={() => onAcceptOpportunity && onAcceptOpportunity(opp.id)}
                  >
                    <div className="opp-meta">
                      <span className={`opp-tag-badge ${opp.tagClass || 'transport'}`}>
                        {opp.tag || 'Opportunity'}
                      </span>
                      <h4 className="opp-title" style={{ margin: '4px 0', fontSize: '1.05rem', fontWeight: 800, color: '#1e293b' }}>
                        {opp.title}
                      </h4>
                      <div className="opp-info-line">
                        <span><i className="ph ph-calendar"></i> {opp.time}</span>
                        <span><i className="ph ph-map-pin"></i> {opp.location}</span>
                      </div>
                    </div>
                    <i
                      className="ph ph-caret-right"
                      style={{ color: '#ea580c', fontSize: '1.25rem', fontWeight: 'bold', marginLeft: '16px' }}
                    ></i>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>

        {/* Right Column (Sidebar) */}
        <div className="activities-side-col">
          {/* 1. Volunteer Status */}
          <section className="glass-card">
            <div className="section-header-row">
              <span className="section-title-wrap">
                <i className="ph-fill ph-shield-check"></i>
                <span>Volunteer Status</span>
              </span>
            </div>

            <div style={{ marginBottom: '16px' }}>
              <span className="volunteer-status-badge approved">
                Approved Volunteer
              </span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Volunteer Role</span>
              <span className="detail-val">{roleDisplay}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Date Joined</span>
              <span className="detail-val">{joinedDisplay}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Availability</span>
              <span className="detail-val">{availDisplay}</span>
            </div>
          </section>

          {/* 2. Volunteer Level */}
          <section className="glass-card">
            <div className="section-header-row">
              <span className="section-title-wrap">
                <i className="ph-fill ph-trophy"></i>
                <span>Volunteer Level</span>
              </span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <h4 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#1e293b', margin: 0 }}>
                    {levelInfo?.currentLevel || 'Level 1'}
                  </h4>
                  <p style={{ fontSize: '0.8rem', fontWeight: 700, color: '#ea580c', textTransform: 'uppercase', letterSpacing: '0.5px', margin: '2px 0 0 0' }}>
                    {levelInfo?.levelTitle || 'Community Helper'}
                  </p>
                </div>
                <div style={{ fontSize: '1.8rem', color: '#ea580c', display: 'flex', alignItems: 'center' }}>
                  <i className="ph-fill ph-sparkles"></i>
                </div>
              </div>

              {/* Progress bar */}
              <div style={{ marginTop: '4px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-muted, #64748b)', marginBttom: '6px' }}>
                  <span>LEVEL PROGRESS</span>
                  <span>{levelInfo?.percentage || 0}%</span>
                </div>
                <div style={{ width: '100%', height: '8px', background: 'rgba(249, 115, 22, 0.12)', borderRadius: '9999px', overflow: 'hidden', margin: '6px 0' }}>
                  <div
                    style={{
                      width: `${levelInfo?.percentage || 0}%`,
                      height: '100%',
                      background: 'linear-gradient(90deg, #f97316 0%, #ea580c 100%)',
                      borderRadius: '9999px',
                      transition: 'width 0.5s ease'
                    }}
                  ></div>
                </div>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted, #64748b)', fontWeight: 500, margin: '6px 0 0 0', lineHeight: 1.4 }}>
                  {levelInfo?.isCompleted
                    ? 'You have completed Level 1 requirements! Level 2 advancement is active.'
                    : `Complete ${levelInfo?.tasksRemaining || 2} more tasks to unlock Level 2: Active Volunteer.`}
                </p>
              </div>
            </div>
          </section>

          {/* 3. My Volunteer Impact */}
          <section className="glass-card">
            <div className="section-header-row">
              <span className="section-title-wrap">
                <i className="ph-fill ph-chart-line-up"></i>
                <span>My Volunteer Impact</span>
              </span>
            </div>

            <div className="metrics-grid">
              <div className="metric-card-box">
                <span className="metric-val">{metrics?.tasks ?? 0}</span>
                <span className="metric-lbl">Tasks Completed</span>
              </div>
              <div className="metric-card-box">
                <span className="metric-val">{metrics?.hours ?? 0}</span>
                <span className="metric-lbl">Volunteer Hours</span>
              </div>
              <div className="metric-card-box">
                <span className="metric-val">{metrics?.helped ?? 0}</span>
                <span className="metric-lbl">Animals Helped</span>
              </div>
              <div className="metric-card-box">
                <span className="metric-val">{metrics?.emergencyResponses ?? 0}</span>
                <span className="metric-lbl">Emergency Responses</span>
              </div>
            </div>
          </section>

          {/* 4. Achievements & Badges */}
          <section className="glass-card">
            <div className="section-header-row">
              <span className="section-title-wrap">
                <i className="ph-fill ph-medal"></i>
                <span>Achievements & Badges</span>
              </span>
            </div>

            <div className="badges-grid">
              {badges.map(badge => (
                <div
                  key={badge.id}
                  className="badge-box"
                  style={{ opacity: badge.isUnlocked ? 1 : 0.45, cursor: badge.isUnlocked ? 'pointer' : 'default' }}
                  onClick={() => setSelectedBadge(badge)}
                >
                  <div
                    className="badge-icon-holder"
                    style={{
                      background: badge.isUnlocked ? 'linear-gradient(135deg, #fff2e8 0%, #ffedd5 100%)' : '#f1f5f9',
                      borderColor: badge.isUnlocked ? 'rgba(249, 115, 22, 0.25)' : '#e2e8f0',
                      color: badge.isUnlocked ? '#ea580c' : '#94a3b8'
                    }}
                  >
                    <i className={badge.isUnlocked ? badge.icon : 'ph-fill ph-lock'}></i>
                  </div>
                  <span className="badge-title-lbl">{badge.title}</span>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>

      {/* ========================================================
          CASE DETAILS MODAL (Mark as Completed)
          ======================================================== */}
      {selectedCase && (
        <div className="modal-overlay" onClick={() => setSelectedCase(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setSelectedCase(null)}>
              <i className="ph-bold ph-x"></i>
            </button>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
              <i className="ph-fill ph-ambulance" style={{ fontSize: '2rem', color: '#ea580c' }}></i>
              <h3 style={{ margin: 0 }}>Rescue Case Details</h3>
            </div>

            <p style={{ marginTop: 0, fontSize: '0.95rem', color: '#475569', lineHeight: 1.5 }}>
              {selectedCase.condition || selectedCase.observedCondition || 'No description provided.'}
            </p>

            <div className="modal-info-list" style={{ background: '#f8fafc', padding: '16px', borderRadius: '12px', display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '24px', border: '1px solid #e2e8f0' }}>
              <div className="detail-row">
                <span className="detail-label">Case ID</span>
                <span className="detail-val">#RSC-{selectedCase.id}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Animal</span>
                <span className="detail-val">{selectedCase.animal}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Location</span>
                <span className="detail-val">{selectedCase.location}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">NGO</span>
                <span className="detail-val">{selectedCase.team?.ngo || 'Paws Haven NGO'}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Current Status</span>
                <span className="detail-val" style={{ color: '#ea580c' }}>{selectedCase.status}</span>
              </div>
            </div>

            <button
              className="btn-full orange"
              style={{ width: '100%' }}
              onClick={() => {
                onCompleteAssignment(selectedCase.id);
                setSelectedCase(null);
              }}
            >
              Mark Assignment as Completed
            </button>
          </div>
        </div>
      )}

      {/* ========================================================
          OPPORTUNITY DETAILS MODAL (Request to Join)
          ======================================================== */}
      {selectedOpp && (
        <div className="modal-overlay" onClick={() => setSelectedOpp(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setSelectedOpp(null)}>
              <i className="ph-bold ph-x"></i>
            </button>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
              <i className="ph-fill ph-paw-print" style={{ fontSize: '2rem', color: '#ea580c' }}></i>
              <h3 style={{ margin: 0 }}>Rescue Opportunity Details</h3>
            </div>

            <div className="modal-info-list" style={{ background: '#f8fafc', padding: '16px', borderRadius: '12px', display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '24px', border: '1px solid #e2e8f0' }}>
              <div className="detail-row">
                <span className="detail-label">Case ID</span>
                <span className="detail-val">#RSC-{selectedOpp.id}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Animal</span>
                <span className="detail-val">{selectedOpp.animal}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Priority</span>
                <span className="detail-val" style={{ color: '#ef4444' }}>{selectedOpp.severity || 'Normal'}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Location</span>
                <span className="detail-val">{selectedOpp.location}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">NGO</span>
                <span className="detail-val">{selectedOpp.team?.ngo || 'Paws Haven NGO'}</span>
              </div>
              <div style={{ marginTop: '8px', paddingTop: '8px', borderTop: '1px solid #e2e8f0' }}>
                <span className="detail-label" style={{ display: 'block', marginBottom: '4px' }}>Reporter Notes</span>
                <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-muted, #64748b)', lineHeight: 1.5 }}>
                  {selectedOpp.reporter?.notes || selectedOpp.condition || 'No additional notes.'}
                </p>
              </div>
            </div>

            {selectedOpp.volunteerRequests?.some(r => r.volunteerName === username || r.volunteerEmail === currentUser?.email) ? (
              <button
                className="btn-full"
                style={{ width: '100%', background: '#dcfce7', color: '#166534', border: '1px solid #bbf7d0', cursor: 'not-allowed' }}
                disabled
              >
                ✓ Request Submitted (Waiting for NGO)
              </button>
            ) : (
              <button
                className="btn-full orange"
                style={{ width: '100%' }}
                onClick={() => {
                  onSubmitRescueRequest(selectedOpp.id);
                  setSelectedOpp(null);
                }}
              >
                Request to Join Operation
              </button>
            )}
          </div>
        </div>
      )}

      {/* ========================================================
          UPDATE AVAILABILITY MODAL
          ======================================================== */}
      {isAvailabilityModalOpen && (
        <div className="modal-overlay" onClick={() => setIsAvailabilityModalOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setIsAvailabilityModalOpen(false)}>
              <i className="ph-bold ph-x"></i>
            </button>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
              <i className="ph-fill ph-calendar" style={{ fontSize: '2rem', color: '#ea580c' }}></i>
              <h3 style={{ margin: 0 }}>Update Availability</h3>
            </div>
            <p style={{ margin: '0 0 16px 0', fontSize: '0.92rem', color: 'var(--text-muted, #64748b)' }}>
              Select your availability window for volunteer tasks:
            </p>

            <form onSubmit={handleSaveAvailability}>
              <div className="form-group" style={{ marginBottom: '20px' }}>
                <label style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-muted, #64748b)', textTransform: 'uppercase' }}>
                  Availability Status
                </label>
                <select
                  value={availSelect}
                  onChange={(e) => setAvailSelect(e.target.value)}
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #e2e8f0', marginTop: '6px', fontSize: '0.95rem', fontFamily: 'inherit' }}
                >
                  <option value="Weekends">Weekends</option>
                  <option value="Weekdays">Weekdays</option>
                  <option value="Flexible">Flexible</option>
                  <option value="Full-time">Full-time</option>
                  <option value="Anytime">Anytime</option>
                </select>
              </div>

              <button type="submit" className="btn-full orange" style={{ width: '100%' }}>
                Save Changes
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================
          ACHIEVEMENT BADGE DETAILS MODAL
          ======================================================== */}
      {selectedBadge && (
        <div className="modal-overlay" onClick={() => setSelectedBadge(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setSelectedBadge(null)}>
              <i className="ph-bold ph-x"></i>
            </button>
            <div style={{ textAlign: 'center', padding: '12px 0 20px' }}>
              <div
                className="badge-icon-holder"
                style={{
                  width: '72px',
                  height: '72px',
                  fontSize: '2.2rem',
                  margin: '0 auto 16px',
                  background: selectedBadge.isUnlocked ? 'linear-gradient(135deg, #fff2e8 0%, #ffedd5 100%)' : '#f1f5f9',
                  borderColor: selectedBadge.isUnlocked ? '#f97316' : '#cbd5e1',
                  color: selectedBadge.isUnlocked ? '#ea580c' : '#94a3b8'
                }}
              >
                <i className={selectedBadge.isUnlocked ? selectedBadge.icon : 'ph-fill ph-lock'}></i>
              </div>
              <h4 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#1e293b', marginBottom: '6px' }}>
                {selectedBadge.title}
              </h4>
              <p style={{ color: 'var(--text-muted, #64748b)', fontSize: '0.95rem', maxWidth: '360px', margin: '0 auto 16px' }}>
                {selectedBadge.desc}
              </p>
              <span
                className="status-pill"
                style={{
                  background: selectedBadge.isUnlocked ? '#dcfce7' : '#f1f5f9',
                  color: selectedBadge.isUnlocked ? '#15803d' : '#64748b',
                  padding: '4px 14px',
                  fontWeight: 800
                }}
              >
                {selectedBadge.isUnlocked ? 'Unlocked' : `Requires ${selectedBadge.req} Completed Tasks`}
              </span>
            </div>

            <button
              className="btn-full orange"
              style={{ width: '100%' }}
              onClick={() => setSelectedBadge(null)}
            >
              {selectedBadge.isUnlocked ? 'Awesome!' : 'Close'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default VolunteerActivities;
