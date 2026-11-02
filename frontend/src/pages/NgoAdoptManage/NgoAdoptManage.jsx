import React, { useState, useEffect } from 'react';
import { useNgoDashboard } from '../NgoDashboard/hooks/useNgoDashboard.js';
import NgoSidebar from '../NgoDashboard/components/NgoSidebar.jsx';
import './ngo-adopt-manage.css';

export function NgoAdoptManage() {
  const { ngoUser, stats } = useNgoDashboard();

  const [adoptions, setAdoptions] = useState([]);
  const [visits, setVisits] = useState([]);
  const [activeTab, setActiveTab] = useState('pending'); // 'pending' | 'under_review' | 'visits' | 'history'
  const [selectedApp, setSelectedApp] = useState(null);
  const [scheduleModalVisit, setScheduleModalVisit] = useState(null);
  const [scheduleDate, setScheduleDate] = useState('');
  const [scheduleTime, setScheduleTime] = useState('10:00 AM');
  const [scheduleNotes, setScheduleNotes] = useState('');

  const [suggestModalVisit, setSuggestModalVisit] = useState(null);
  const [suggestDate, setSuggestDate] = useState('');
  const [suggestTime, setSuggestTime] = useState('02:00 PM');

  useEffect(() => {
    document.title = 'Adoption & Visit Management - Voice of Stray';
    loadData();
  }, []);

  const loadData = () => {
    try {
      const storedAdoptions = JSON.parse(localStorage.getItem('voiceOfStrayAdoptions') || '[]');
      if (storedAdoptions.length === 0) {
        // Initial sample seed if completely empty
        const initialAdoptions = [
          {
            id: 'charlie',
            petName: 'Charlie',
            breed: 'Golden Retriever Mix',
            applicantName: 'Arjun Sharma',
            applicantEmail: 'arjun@example.com',
            applicantPhone: '+91 98765 43210',
            city: 'Mumbai',
            occupation: 'Software Engineer',
            age: '28',
            ownRent: 'own',
            hasYard: 'yes',
            hasPets: 'no',
            hasKids: 'no',
            whyAdopt: "I fell in love with Charlie's gentle eyes. We have a spacious home with a fenced yard.",
            aloneHours: '1-2 hours (work from home)',
            ownedBefore: 'Grew up with dogs, raised a Labrador for 12 years.',
            emergencies: 'Dedicated pet emergency savings fund, local 24/7 clinic is 10 mins away.',
            adjustPlan: 'Taking 2 weeks off to help him adjust. Slow introductions and a calm, quiet routine.',
            status: 'Pending Review',
            date: '6/3/2026',
            avatar: 'https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&q=80&w=300'
          },
          {
            id: 'rocky-app-1',
            petName: 'Rocky',
            breed: 'Indie Puppy',
            applicantName: 'Sneha Patel',
            applicantEmail: 'sneha@example.com',
            applicantPhone: '+91 98220 11223',
            city: 'Pune',
            occupation: 'Graphic Designer',
            age: '26',
            ownRent: 'own',
            hasYard: 'yes',
            hasPets: 'yes',
            petsDesc: 'One 3-year-old friendly indie dog vaccinated.',
            hasKids: 'no',
            whyAdopt: 'Looking for a playful companion for my current indie rescue dog.',
            aloneHours: '0 hours (remote setup)',
            ownedBefore: 'Experienced rescue pet parent.',
            emergencies: 'Insured and vet clinic nearby.',
            status: 'Under Review',
            date: '6/5/2026',
            avatar: 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&q=80&w=300'
          }
        ];
        localStorage.setItem('voiceOfStrayAdoptions', JSON.stringify(initialAdoptions));
        setAdoptions(initialAdoptions);
      } else {
        setAdoptions(storedAdoptions);
      }

      const storedVisits = JSON.parse(localStorage.getItem('voiceOfStrayVisits') || '[]');
      if (storedVisits.length === 0) {
        const initialVisits = [
          {
            id: 'VISIT-101',
            petName: 'Charlie',
            applicantName: 'Arjun Sharma',
            preferredDate: '2026-06-25',
            preferredTime: '11:00 AM',
            message: 'Looking forward to meeting Charlie with my family this weekend.',
            status: 'Pending'
          }
        ];
        localStorage.setItem('voiceOfStrayVisits', JSON.stringify(initialVisits));
        setVisits(initialVisits);
      } else {
        setVisits(storedVisits);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const changeAdoptionStatus = (appId, nextStatus) => {
    const updated = adoptions.map((app) => {
      if (app.id === appId) {
        const next = { ...app, status: nextStatus };
        if (nextStatus === 'Approved') next.approvalDate = new Date().toLocaleDateString();
        if (nextStatus === 'Rejected') next.rejectionDate = new Date().toLocaleDateString();
        return next;
      }
      return app;
    });

    setAdoptions(updated);
    localStorage.setItem('voiceOfStrayAdoptions', JSON.stringify(updated));

    const target = adoptions.find((a) => a.id === appId);
    const petName = target ? target.petName : 'Pet';

    // Push dynamic user dashboard notification
    const notifications = JSON.parse(localStorage.getItem('voiceOfStrayNotifications') || '[]');
    const icon = nextStatus === 'Approved' ? 'ph-fill ph-check-circle' : 'ph-fill ph-x-circle';
    const msg =
      nextStatus === 'Approved'
        ? `Congratulations! Your adoption application for **${petName}** has been **Approved** by the shelter.`
        : `We regret to inform you that your application for **${petName}** was **Declined** after review.`;

    notifications.unshift({
      id: 'NOTIF-' + Math.floor(1000 + Math.random() * 9000),
      icon,
      message: msg,
      time: 'Just now',
      unread: true
    });
    localStorage.setItem('voiceOfStrayNotifications', JSON.stringify(notifications));

    if (selectedApp && selectedApp.id === appId) {
      setSelectedApp(null);
    }
  };

  const deleteAdoptionRequest = (appId) => {
    const updated = adoptions.filter((a) => a.id !== appId);
    setAdoptions(updated);
    localStorage.setItem('voiceOfStrayAdoptions', JSON.stringify(updated));
  };

  const clearArchivedRequest = (appId) => {
    const updated = adoptions.map((a) => (a.id === appId ? { ...a, archived: true } : a));
    setAdoptions(updated);
    localStorage.setItem('voiceOfStrayAdoptions', JSON.stringify(updated));
  };

  const handleOpenScheduleModal = (visit) => {
    setScheduleModalVisit(visit);
    setScheduleDate(visit.preferredDate || new Date().toISOString().split('T')[0]);
    setScheduleTime(visit.preferredTime || '10:00 AM');
    setScheduleNotes('');
  };

  const handleConfirmScheduleVisit = (e) => {
    e.preventDefault();
    if (!scheduleModalVisit) return;

    const updatedVisits = visits.map((v) => {
      if (v.id === scheduleModalVisit.id) {
        return {
          ...v,
          status: 'Visit Scheduled',
          scheduledDate: scheduleDate,
          scheduledTime: scheduleTime,
          shelterNotes: scheduleNotes
        };
      }
      return v;
    });

    setVisits(updatedVisits);
    localStorage.setItem('voiceOfStrayVisits', JSON.stringify(updatedVisits));

    // Sync matching adoption application
    const updatedAdoptions = adoptions.map((a) => {
      if (
        (a.petName === scheduleModalVisit.petName && a.applicantName === scheduleModalVisit.applicantName) ||
        (a.id === 'charlie' && scheduleModalVisit.petName === 'Charlie')
      ) {
        return { ...a, status: 'Visit Scheduled' };
      }
      return a;
    });
    setAdoptions(updatedAdoptions);
    localStorage.setItem('voiceOfStrayAdoptions', JSON.stringify(updatedAdoptions));

    // Notification
    const notifications = JSON.parse(localStorage.getItem('voiceOfStrayNotifications') || '[]');
    notifications.unshift({
      id: 'NOTIF-' + Math.floor(1000 + Math.random() * 9000),
      icon: 'ph-fill ph-calendar-check',
      message: `Visit scheduled for **${scheduleModalVisit.petName}** on **${scheduleDate}** at **${scheduleTime}**. Notes: *"${scheduleNotes || 'None'}"*`,
      time: 'Just now',
      unread: true
    });
    localStorage.setItem('voiceOfStrayNotifications', JSON.stringify(notifications));

    setScheduleModalVisit(null);
  };

  const handleOpenSuggestModal = (visit) => {
    setSuggestModalVisit(visit);
    setSuggestDate(visit.preferredDate || new Date().toISOString().split('T')[0]);
    setSuggestTime('03:00 PM');
  };

  const handleConfirmSuggestTime = (e) => {
    e.preventDefault();
    if (!suggestModalVisit) return;

    const updatedVisits = visits.map((v) => {
      if (v.id === suggestModalVisit.id) {
        return {
          ...v,
          status: 'Suggesting Time',
          suggestedDate: suggestDate,
          suggestedTime: suggestTime
        };
      }
      return v;
    });

    setVisits(updatedVisits);
    localStorage.setItem('voiceOfStrayVisits', JSON.stringify(updatedVisits));

    const notifications = JSON.parse(localStorage.getItem('voiceOfStrayNotifications') || '[]');
    notifications.unshift({
      id: 'NOTIF-' + Math.floor(1000 + Math.random() * 9000),
      icon: 'ph-fill ph-clock',
      message: `Shelter suggested new time for your visit of **${suggestModalVisit.petName}**: **${suggestDate}** at **${suggestTime}**.`,
      time: 'Just now',
      unread: true
    });
    localStorage.setItem('voiceOfStrayNotifications', JSON.stringify(notifications));

    setSuggestModalVisit(null);
  };

  const handleRejectVisit = (visitId) => {
    const updatedVisits = visits.map((v) => (v.id === visitId ? { ...v, status: 'Rejected' } : v));
    setVisits(updatedVisits);
    localStorage.setItem('voiceOfStrayVisits', JSON.stringify(updatedVisits));
  };

  // Grouped adoptions
  const pendingApps = adoptions.filter((a) => !a.archived && (a.status === 'Pending' || a.status === 'Pending Review'));
  const underReviewApps = adoptions.filter(
    (a) => !a.archived && (a.status === 'Under Review' || a.status === 'Visit Scheduled' || a.status === 'Home Check')
  );
  const pendingVisits = visits.filter((v) => v.status === 'Pending' || v.status === 'Suggesting Time');
  const historyApps = adoptions.filter((a) => !a.archived && (a.status === 'Approved' || a.status === 'Rejected' || a.status === 'Adopted'));

  return (
    <div className="ngo-reports-page-wrapper">
      <div className="ops-container">
        {/* Sidebar */}
        <NgoSidebar ngoUser={ngoUser} stats={stats} />

        {/* Main Content */}
        <main className="ops-main-panel">
          <div>
            <h1 style={{ fontSize: '1.9rem', fontWeight: 900, color: '#0f172a', margin: '0 0 6px 0' }}>
              Adoption & Visit Management
            </h1>
            <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.95rem', fontWeight: 500 }}>
              Review adoption questionnaire applications, schedule shelter visits, and finalize companion matches.
            </p>
          </div>

          {/* Metrics Overview */}
          <div className="metrics-grid">
            <div className="glass-card metric-card">
              <div className="metric-header">
                <span className="metric-title">Pending Review</span>
                <div className="metric-icon-bg" style={{ background: '#fffbeb', color: '#d97706' }}>
                  <i className="ph-fill ph-clock"></i>
                </div>
              </div>
              <div className="metric-value" style={{ color: '#d97706' }}>
                {pendingApps.length}
              </div>
              <span className="metric-subtext">Needs first assessment</span>
            </div>

            <div className="glass-card metric-card">
              <div className="metric-header">
                <span className="metric-title">In Progress</span>
                <div className="metric-icon-bg" style={{ background: '#eff6ff', color: '#2563eb' }}>
                  <i className="ph-fill ph-file-text"></i>
                </div>
              </div>
              <div className="metric-value" style={{ color: '#2563eb' }}>
                {underReviewApps.length}
              </div>
              <span className="metric-subtext">Interview & home checks</span>
            </div>

            <div className="glass-card metric-card">
              <div className="metric-header">
                <span className="metric-title">Visit Requests</span>
                <div className="metric-icon-bg" style={{ background: '#faf5ff', color: '#7c3aed' }}>
                  <i className="ph-fill ph-calendar"></i>
                </div>
              </div>
              <div className="metric-value" style={{ color: '#7c3aed' }}>
                {pendingVisits.length}
              </div>
              <span className="metric-subtext">Shelter visits requested</span>
            </div>

            <div className="glass-card metric-card">
              <div className="metric-header">
                <span className="metric-title">Successful Placements</span>
                <div className="metric-icon-bg" style={{ background: '#dcfce7', color: '#15803d' }}>
                  <i className="ph-fill ph-heart"></i>
                </div>
              </div>
              <div className="metric-value" style={{ color: '#15803d' }}>
                {adoptions.filter((a) => a.status === 'Approved' || a.status === 'Adopted').length}
              </div>
              <span className="metric-subtext">Forever homes found</span>
            </div>
          </div>

          {/* Navigation Tabs */}
          <section className="glass-card" style={{ padding: '24px' }}>
            <div className="filter-bar" style={{ padding: 0, marginBottom: '24px' }}>
              <div className="filter-pills">
                <button
                  type="button"
                  className={`filter-pill ${activeTab === 'pending' ? 'active' : ''}`}
                  onClick={() => setActiveTab('pending')}
                >
                  Pending Review ({pendingApps.length})
                </button>
                <button
                  type="button"
                  className={`filter-pill ${activeTab === 'under_review' ? 'active' : ''}`}
                  onClick={() => setActiveTab('under_review')}
                >
                  Active Assessments ({underReviewApps.length})
                </button>
                <button
                  type="button"
                  className={`filter-pill ${activeTab === 'visits' ? 'active' : ''}`}
                  onClick={() => setActiveTab('visits')}
                >
                  Visit Requests ({visits.length})
                </button>
                <button
                  type="button"
                  className={`filter-pill ${activeTab === 'history' ? 'active' : ''}`}
                  onClick={() => setActiveTab('history')}
                >
                  History & Approvals ({historyApps.length})
                </button>
              </div>
            </div>

            {/* TAB: Pending Review */}
            {activeTab === 'pending' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                {pendingApps.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--text-muted)' }}>
                    <i className="ph ph-check-circle" style={{ fontSize: '2.5rem', color: '#10b981', marginBottom: '8px', display: 'block' }}></i>
                    No pending applications. All new submissions have been reviewed.
                  </div>
                ) : (
                  pendingApps.map((app) => (
                    <div key={app.id} className="adopt-req-item">
                      <div className="adopt-req-left">
                        <img
                          src={
                            app.avatar ||
                            'https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&q=80&w=300'
                          }
                          alt={app.petName}
                          className="adopt-req-avatar"
                        />
                        <div className="adopt-req-info">
                          <h4>
                            {app.petName}
                            <span className="status-badge pending">Pending Review</span>
                          </h4>
                          <p>
                            Applicant: <strong>{app.applicantName}</strong> &bull; {app.applicantPhone || 'Phone unlisted'} &bull; {app.city || 'City N/A'}
                            <br />
                            Housing: <strong>{app.ownRent === 'own' ? 'Owns Home' : 'Rents'}</strong> &bull; Yard: <strong>{app.hasYard === 'yes' ? 'Yes' : 'No'}</strong> &bull; Submitted: {app.date || 'Recently'}
                          </p>
                        </div>
                      </div>
                      <div className="adopt-req-actions">
                        <button
                          type="button"
                          className="btn-adopt-act review"
                          onClick={() => {
                            if (app.status === 'Pending Review') {
                              changeAdoptionStatus(app.id, 'Under Review');
                            }
                            setSelectedApp(app);
                          }}
                        >
                          <i className="ph ph-eye"></i> Review Application
                        </button>
                        <button
                          type="button"
                          className="btn-adopt-act approve"
                          onClick={() => changeAdoptionStatus(app.id, 'Approved')}
                        >
                          <i className="ph ph-check"></i> Approve
                        </button>
                        <button
                          type="button"
                          className="btn-adopt-act reject"
                          onClick={() => changeAdoptionStatus(app.id, 'Rejected')}
                        >
                          <i className="ph ph-x"></i> Reject
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {/* TAB: Active Assessments */}
            {activeTab === 'under_review' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                {underReviewApps.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--text-muted)' }}>
                    <i className="ph ph-tray" style={{ fontSize: '2.5rem', color: 'var(--text-muted)', marginBottom: '8px', display: 'block' }}></i>
                    No applications currently under assessment.
                  </div>
                ) : (
                  underReviewApps.map((app) => (
                    <div key={app.id} className="adopt-req-item">
                      <div className="adopt-req-left">
                        <img
                          src={
                            app.avatar ||
                            'https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&q=80&w=300'
                          }
                          alt={app.petName}
                          className="adopt-req-avatar"
                        />
                        <div className="adopt-req-info">
                          <h4>
                            {app.petName}
                            <span className="status-badge review">{app.status}</span>
                          </h4>
                          <p>
                            Applicant: <strong>{app.applicantName}</strong> &bull; {app.applicantPhone} &bull; {app.city}
                            <br />
                            Plan: <em>"{app.adjustPlan || app.whyAdopt || 'Awaiting shelter visit'}"</em>
                          </p>
                        </div>
                      </div>
                      <div className="adopt-req-actions">
                        <button
                          type="button"
                          className="btn-adopt-act review"
                          onClick={() => setSelectedApp(app)}
                        >
                          <i className="ph ph-file-text"></i> Full Details
                        </button>
                        <button
                          type="button"
                          className="btn-adopt-act approve"
                          onClick={() => changeAdoptionStatus(app.id, 'Approved')}
                        >
                          <i className="ph ph-check"></i> Final Approve
                        </button>
                        <button
                          type="button"
                          className="btn-adopt-act reject"
                          onClick={() => changeAdoptionStatus(app.id, 'Rejected')}
                        >
                          <i className="ph ph-x"></i> Decline
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {/* TAB: Visits */}
            {activeTab === 'visits' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                {visits.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--text-muted)' }}>
                    <i className="ph ph-calendar-blank" style={{ fontSize: '2.5rem', color: 'var(--text-muted)', marginBottom: '8px', display: 'block' }}></i>
                    No visit requests scheduled yet.
                  </div>
                ) : (
                  visits.map((visit) => {
                    let badgeClass = 'pending';
                    let badgeLabel = 'Pending';
                    if (visit.status === 'Visit Scheduled') {
                      badgeClass = 'approved';
                      badgeLabel = 'Visit Scheduled';
                    } else if (visit.status === 'Suggesting Time') {
                      badgeClass = 'review';
                      badgeLabel = 'Time Suggested';
                    } else if (visit.status === 'Rejected') {
                      badgeClass = 'rejected';
                      badgeLabel = 'Declined';
                    }

                    return (
                      <div key={visit.id} className="adopt-req-item">
                        <div className="adopt-req-left">
                          <div
                            className="adopt-req-avatar"
                            style={{
                              background: 'rgba(249,115,22,0.08)',
                              color: 'var(--primary)',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontSize: '1.5rem'
                            }}
                          >
                            <i className="ph ph-calendar"></i>
                          </div>
                          <div className="adopt-req-info">
                            <h4>
                              {visit.petName} <span className={`status-badge ${badgeClass}`}>{badgeLabel}</span>
                            </h4>
                            <p>
                              Requested By: <strong>{visit.applicantName}</strong>
                              <br />
                              Preferred: <strong>{visit.preferredDate}</strong> at <strong>{visit.preferredTime}</strong>
                              {visit.status === 'Visit Scheduled' && (
                                <>
                                  <br />
                                  <span style={{ color: '#059669', fontWeight: 700 }}>
                                    Confirmed: {visit.scheduledDate} at {visit.scheduledTime}
                                  </span>
                                  {visit.shelterNotes && (
                                    <span style={{ display: 'block', fontSize: '0.76rem', color: '#475569' }}>
                                      Notes: <em>"{visit.shelterNotes}"</em>
                                    </span>
                                  )}
                                </>
                              )}
                              {visit.status === 'Suggesting Time' && (
                                <>
                                  <br />
                                  <span style={{ color: '#2563eb', fontWeight: 600 }}>
                                    Proposed Time: {visit.suggestedDate} at {visit.suggestedTime} (Awaiting response)
                                  </span>
                                </>
                              )}
                            </p>
                          </div>
                        </div>
                        <div className="adopt-req-actions">
                          {visit.status !== 'Visit Scheduled' && visit.status !== 'Rejected' && (
                            <>
                              <button
                                type="button"
                                className="btn-adopt-act approve"
                                onClick={() => handleOpenScheduleModal(visit)}
                              >
                                <i className="ph ph-calendar-check"></i> Approve Visit
                              </button>
                              <button
                                type="button"
                                className="btn-adopt-act review"
                                onClick={() => handleOpenSuggestModal(visit)}
                              >
                                <i className="ph ph-clock"></i> Suggest Time
                              </button>
                              <button
                                type="button"
                                className="btn-adopt-act reject"
                                onClick={() => handleRejectVisit(visit.id)}
                              >
                                <i className="ph ph-x"></i> Reject
                              </button>
                            </>
                          )}
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            )}

            {/* TAB: History */}
            {activeTab === 'history' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                {historyApps.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--text-muted)' }}>
                    <i className="ph ph-clock-counter-clockwise" style={{ fontSize: '2.5rem', color: 'var(--text-muted)', marginBottom: '8px', display: 'block' }}></i>
                    No archived adoption records.
                  </div>
                ) : (
                  historyApps.map((app) => {
                    const isApproved = app.status === 'Approved' || app.status === 'Adopted';
                    return (
                      <div key={app.id} className="adopt-req-item">
                        <div className="adopt-req-left">
                          <img
                            src={
                              app.avatar ||
                              'https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&q=80&w=300'
                            }
                            alt={app.petName}
                            className="adopt-req-avatar"
                          />
                          <div className="adopt-req-info">
                            <h4>
                              {app.petName}
                              <span className={`status-badge ${isApproved ? 'approved' : 'rejected'}`}>
                                {app.status}
                              </span>
                            </h4>
                            <p>
                              Applicant: <strong>{app.applicantName}</strong> &bull; {app.applicantEmail}
                              <br />
                              Decision Date: <strong>{app.approvalDate || app.rejectionDate || app.date || 'Archived'}</strong>
                            </p>
                          </div>
                        </div>
                        <div className="adopt-req-actions">
                          <button
                            type="button"
                            className="btn-adopt-act clear"
                            onClick={() => clearArchivedRequest(app.id)}
                          >
                            <i className="ph ph-archive"></i> Archive
                          </button>
                          <button
                            type="button"
                            className="btn-adopt-act delete"
                            onClick={() => deleteAdoptionRequest(app.id)}
                          >
                            <i className="ph ph-trash"></i> Delete
                          </button>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            )}
          </section>
        </main>
      </div>

      {/* MODAL: Review Application */}
      {selectedApp && (
        <div className="ops-modal-overlay show" onClick={() => setSelectedApp(null)}>
          <div className="ops-modal-card" style={{ maxWidth: '640px' }} onClick={(e) => e.stopPropagation()}>
            <div className="ops-modal-header">
              <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px', margin: 0, fontSize: '1.2rem', fontWeight: 800 }}>
                <i className="ph-fill ph-paw-print" style={{ color: 'var(--primary)' }}></i>
                Adoption Application for {selectedApp.petName}
              </h3>
              <button className="ops-modal-close" onClick={() => setSelectedApp(null)}>
                <i className="ph ph-x"></i>
              </button>
            </div>
            <div className="ops-modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '16px', color: '#334155' }}>
              <div style={{ background: 'rgba(249, 115, 22, 0.05)', padding: '16px', borderRadius: '8px', border: '1px dashed rgba(249, 115, 22, 0.2)' }}>
                <h4 style={{ margin: '0 0 8px 0', color: '#0f172a', fontWeight: 700, fontSize: '1rem' }}>Applicant Details</h4>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', fontSize: '0.85rem' }}>
                  <span><strong>Name:</strong> {selectedApp.applicantName}</span>
                  <span><strong>Age:</strong> {selectedApp.age || 'N/A'}</span>
                  <span><strong>Phone:</strong> {selectedApp.applicantPhone}</span>
                  <span><strong>Email:</strong> {selectedApp.applicantEmail}</span>
                  <span><strong>City:</strong> {selectedApp.city}</span>
                  <span><strong>Occupation:</strong> {selectedApp.occupation || 'N/A'}</span>
                </div>
              </div>

              <div style={{ background: 'rgba(249, 115, 22, 0.05)', padding: '16px', borderRadius: '8px', border: '1px dashed rgba(249, 115, 22, 0.2)' }}>
                <h4 style={{ margin: '0 0 8px 0', color: '#0f172a', fontWeight: 700, fontSize: '1rem' }}>Housing Information</h4>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', fontSize: '0.85rem' }}>
                  <span><strong>Ownership:</strong> {selectedApp.ownRent === 'own' ? 'Owns Home' : 'Rents Home'}</span>
                  <span><strong>Yard:</strong> {selectedApp.hasYard === 'yes' ? 'Has Yard' : 'No Yard'}</span>
                  <span><strong>Other Pets:</strong> {selectedApp.hasPets === 'yes' ? 'Yes' : 'No'}</span>
                  <span><strong>Kids:</strong> {selectedApp.hasKids === 'yes' ? 'Yes' : 'No'}</span>
                </div>
                {selectedApp.petsDesc && (
                  <p style={{ margin: '8px 0 0 0', fontSize: '0.85rem' }}><strong>Pet Description:</strong> {selectedApp.petsDesc}</p>
                )}
              </div>

              <div style={{ background: 'rgba(249, 115, 22, 0.05)', padding: '16px', borderRadius: '8px', border: '1px dashed rgba(249, 115, 22, 0.2)' }}>
                <h4 style={{ margin: '0 0 8px 0', color: '#0f172a', fontWeight: 700, fontSize: '1rem' }}>Questionnaire</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.85rem' }}>
                  <div>
                    <strong>Why do you want to adopt this pet?</strong>
                    <p style={{ margin: '4px 0 0 0', fontStyle: 'italic', color: '#475569' }}>"{selectedApp.whyAdopt}"</p>
                  </div>
                  <div>
                    <strong>How many hours will the pet be left alone?</strong>
                    <p style={{ margin: '4px 0 0 0', color: '#475569' }}>{selectedApp.aloneHours || 'Not specified'}</p>
                  </div>
                  <div>
                    <strong>Have you owned pets before?</strong>
                    <p style={{ margin: '4px 0 0 0', fontStyle: 'italic', color: '#475569' }}>"{selectedApp.ownedBefore || 'Not specified'}"</p>
                  </div>
                  <div>
                    <strong>How will you handle medical emergencies?</strong>
                    <p style={{ margin: '4px 0 0 0', fontStyle: 'italic', color: '#475569' }}>"{selectedApp.emergencies || 'Not specified'}"</p>
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '8px' }}>
                <button
                  type="button"
                  className="btn-adopt-act reject"
                  style={{ padding: '10px 20px' }}
                  onClick={() => changeAdoptionStatus(selectedApp.id, 'Rejected')}
                >
                  Reject Application
                </button>
                <button
                  type="button"
                  className="btn-adopt-act approve"
                  style={{ padding: '10px 20px' }}
                  onClick={() => changeAdoptionStatus(selectedApp.id, 'Approved')}
                >
                  Approve Application
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: Schedule Visit */}
      {scheduleModalVisit && (
        <div className="ops-modal-overlay show" onClick={() => setScheduleModalVisit(null)}>
          <div className="ops-modal-card" style={{ maxWidth: '480px' }} onClick={(e) => e.stopPropagation()}>
            <div className="ops-modal-header">
              <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 800 }}>Confirm Shelter Visit</h3>
              <button className="ops-modal-close" onClick={() => setScheduleModalVisit(null)}>
                <i className="ph ph-x"></i>
              </button>
            </div>
            <form onSubmit={handleConfirmScheduleVisit} className="ops-modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '6px' }}>Visit Date</label>
                <input
                  type="date"
                  className="input-glass"
                  required
                  value={scheduleDate}
                  onChange={(e) => setScheduleDate(e.target.value)}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '6px' }}>Visit Time</label>
                <input
                  type="text"
                  className="input-glass"
                  placeholder="e.g. 11:00 AM"
                  required
                  value={scheduleTime}
                  onChange={(e) => setScheduleTime(e.target.value)}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '6px' }}>Shelter Notes / Instructions for Adopter</label>
                <textarea
                  className="input-glass"
                  rows="3"
                  placeholder="e.g. Please bring ID proof and arrive 10 mins early..."
                  value={scheduleNotes}
                  onChange={(e) => setScheduleNotes(e.target.value)}
                ></textarea>
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '8px' }}>
                <button type="button" className="btn-adopt-act delete" onClick={() => setScheduleModalVisit(null)}>
                  Cancel
                </button>
                <button type="submit" className="btn-adopt-act approve" style={{ padding: '10px 20px' }}>
                  Confirm & Notify Adopter
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: Suggest New Time */}
      {suggestModalVisit && (
        <div className="ops-modal-overlay show" onClick={() => setSuggestModalVisit(null)}>
          <div className="ops-modal-card" style={{ maxWidth: '480px' }} onClick={(e) => e.stopPropagation()}>
            <div className="ops-modal-header">
              <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 800 }}>Suggest Alternative Time</h3>
              <button className="ops-modal-close" onClick={() => setSuggestModalVisit(null)}>
                <i className="ph ph-x"></i>
              </button>
            </div>
            <form onSubmit={handleConfirmSuggestTime} className="ops-modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '6px' }}>Suggested Date</label>
                <input
                  type="date"
                  className="input-glass"
                  required
                  value={suggestDate}
                  onChange={(e) => setSuggestDate(e.target.value)}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '6px' }}>Suggested Time</label>
                <input
                  type="text"
                  className="input-glass"
                  placeholder="e.g. 03:00 PM"
                  required
                  value={suggestTime}
                  onChange={(e) => setSuggestTime(e.target.value)}
                />
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '8px' }}>
                <button type="button" className="btn-adopt-act delete" onClick={() => setSuggestModalVisit(null)}>
                  Cancel
                </button>
                <button type="submit" className="btn-adopt-act review" style={{ padding: '10px 20px' }}>
                  Send Suggestion
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default NgoAdoptManage;
