import React, { useState, useEffect } from 'react';
import { useNgoDashboard } from '../NgoDashboard/hooks/useNgoDashboard.js';
import NgoSidebar from '../NgoDashboard/components/NgoSidebar.jsx';
import NgoModal from '../NgoDashboard/components/NgoModal.jsx';

export function NgoVolunteerManage() {
  const {
    ngoUser,
    stats,
    volunteerApplications,
    approvedVolunteers,
    handleApproveVolunteer,
    handleRejectVolunteer
  } = useNgoDashboard();

  const [activeTab, setActiveTab] = useState('active'); // 'active' | 'applications'
  const [searchTerm, setSearchTerm] = useState('');
  const [modalState, setModalState] = useState(null);

  useEffect(() => {
    document.title = 'Volunteer Management - Voice of Stray';
  }, []);

  const pendingApps = volunteerApplications.filter((a) => a.status === 'Pending' || a.status === 'Pending Review');

  const filteredVolunteers = approvedVolunteers.filter((v) =>
    !searchTerm ||
    (v.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (v.role || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (v.email || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleReviewApp = (app) => {
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

  return (
    <div className="ngo-reports-page-wrapper">
      <div className="ops-container">
        {/* Sidebar */}
        <NgoSidebar ngoUser={ngoUser} stats={stats} />

        {/* Main Panel */}
        <main className="ops-main-panel">
          <div>
            <h1 style={{ fontSize: '1.9rem', fontWeight: 900, color: '#0f172a', margin: '0 0 6px 0' }}>
              Volunteer Coordination & Roster
            </h1>
            <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.95rem', fontWeight: 500 }}>
              Manage registered rescue volunteers, approve applicant submissions, and monitor active field status.
            </p>
          </div>

          {/* Metrics Grid */}
          <div className="metrics-grid">
            <div className="glass-card metric-card">
              <div className="metric-header">
                <span className="metric-title">Available Volunteers</span>
                <div className="metric-icon-bg" style={{ background: '#dcfce7', color: '#15803d' }}>
                  <i className="ph-fill ph-users-three"></i>
                </div>
              </div>
              <div className="metric-value">{approvedVolunteers.length}</div>
              <span className="metric-subtext">Active on roster</span>
            </div>

            <div className="glass-card metric-card">
              <div className="metric-header">
                <span className="metric-title">Pending Applications</span>
                <div className="metric-icon-bg" style={{ background: '#e0f2fe', color: '#0284c7' }}>
                  <i className="ph-fill ph-hand-heart"></i>
                </div>
              </div>
              <div className="metric-value" style={{ color: '#0284c7' }}>{pendingApps.length}</div>
              <span className="metric-subtext">Awaiting onboarding</span>
            </div>

            <div className="glass-card metric-card">
              <div className="metric-header">
                <span className="metric-title">On Mission</span>
                <div className="metric-icon-bg" style={{ background: '#ffedd5', color: '#f97316' }}>
                  <i className="ph-fill ph-ambulance"></i>
                </div>
              </div>
              <div className="metric-value">2</div>
              <span className="metric-subtext">En route to rescues</span>
            </div>

            <div className="glass-card metric-card">
              <div className="metric-header">
                <span className="metric-title">Monthly Missions</span>
                <div className="metric-icon-bg" style={{ background: '#fce7f3', color: '#db2777' }}>
                  <i className="ph-fill ph-check-circle"></i>
                </div>
              </div>
              <div className="metric-value">15</div>
              <span className="metric-subtext">Completed tasks</span>
            </div>
          </div>

          {/* Tabs and Volunteer Lists */}
          <section className="glass-card">
            <div className="filter-bar">
              <div className="search-input-wrap">
                <i className="ph ph-magnifying-glass"></i>
                <input
                  type="text"
                  className="input-glass"
                  placeholder="Search volunteers by name, skill, email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              <div className="filter-pills">
                <button
                  type="button"
                  className={`filter-pill ${activeTab === 'active' ? 'active' : ''}`}
                  onClick={() => setActiveTab('active')}
                >
                  Approved Volunteers ({approvedVolunteers.length})
                </button>
                <button
                  type="button"
                  className={`filter-pill ${activeTab === 'applications' ? 'active' : ''}`}
                  onClick={() => setActiveTab('applications')}
                >
                  Pending Applications ({pendingApps.length})
                </button>
              </div>
            </div>

            {activeTab === 'active' ? (
              <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {filteredVolunteers.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '48px 20px', color: 'var(--text-muted)' }}>
                    <i className="ph ph-users" style={{ fontSize: '2.5rem', color: 'var(--primary)', marginBottom: '8px', display: 'block' }}></i>
                    No active volunteers found.
                  </div>
                ) : (
                  filteredVolunteers.map((vol) => {
                    const initials = vol.name ? vol.name[0].toUpperCase() : 'V';
                    const colorTheme = vol.name === 'Priya' ? '14b8a6' : vol.name === 'Akash' ? '64748b' : 'f97316';
                    let statusClass = 'available';
                    let statusText = 'Available';
                    if (vol.status === 'Unavailable') {
                      statusClass = 'busy';
                      statusText = 'On Rescue';
                    } else if (vol.status === 'Inactive') {
                      statusClass = 'offline';
                      statusText = 'Offline';
                    }

                    return (
                      <div
                        key={vol.id}
                        className="ops-item-card"
                        style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 18px', background: 'rgba(255,255,255,0.6)', borderRadius: '12px', border: '1px solid rgba(249,115,22,0.08)' }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                          <img
                            src={`https://ui-avatars.com/api/?name=${encodeURIComponent(vol.name)}&background=${colorTheme}&color=fff&bold=true`}
                            alt={initials}
                            style={{ width: '42px', height: '42px', borderRadius: '50%', border: '2px solid white', boxShadow: 'var(--shadow-sm)' }}
                          />
                          <div>
                            <h4 style={{ margin: '0 0 2px 0', fontSize: '1rem', fontWeight: 800, color: '#0f172a' }}>{vol.name}</h4>
                            <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 500 }}>
                              {vol.role || 'Volunteer'} &bull; {vol.email}
                            </span>
                          </div>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                          <span className={`status-pill ${statusClass}`}>{statusText}</span>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            ) : (
              <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {pendingApps.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '48px 20px', color: 'var(--text-muted)' }}>
                    <i className="ph ph-check-circle" style={{ fontSize: '2.5rem', color: '#10b981', marginBottom: '8px', display: 'block' }}></i>
                    No pending applications. All submissions reviewed.
                  </div>
                ) : (
                  pendingApps.map((app) => (
                    <div
                      key={app.id}
                      className="adopt-req-item"
                      style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 18px', background: 'rgba(255,255,255,0.6)', borderRadius: '12px', border: '1px solid rgba(249,115,22,0.08)' }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                        <div style={{ width: '42px', height: '42px', borderRadius: '50%', background: 'rgba(249,115,22,0.1)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem', fontWeight: 800 }}>
                          {app.name ? app.name[0].toUpperCase() : 'V'}
                        </div>
                        <div>
                          <h4 style={{ margin: '0 0 2px 0', fontSize: '1rem', fontWeight: 800, color: '#0f172a' }}>{app.name}</h4>
                          <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 500 }}>
                            Applied Role: <strong>{app.role || 'Volunteer'}</strong> &bull; {app.email}
                          </span>
                        </div>
                      </div>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button
                          type="button"
                          className="btn-adopt-act approve"
                          onClick={() => handleApproveVolunteer(app.id)}
                        >
                          Approve
                        </button>
                        <button
                          type="button"
                          className="btn-adopt-act reject"
                          onClick={() => handleRejectVolunteer(app.id)}
                        >
                          Reject
                        </button>
                        <button
                          type="button"
                          className="btn-adopt-act review"
                          onClick={() => handleReviewApp(app)}
                        >
                          Review
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </section>
        </main>
      </div>

      <NgoModal
        modalData={modalState}
        onClose={() => setModalState(null)}
        onApproveVolunteer={handleApproveVolunteer}
        onRejectVolunteer={handleRejectVolunteer}
      />
    </div>
  );
}

export default NgoVolunteerManage;
