import React from 'react';

export function VolunteerApplicationsSection({ applications, onApprove, onReject, onViewDetails }) {
  const pendingApps = applications.filter(a => a.status === 'Pending' || !a.status);

  return (
    <section className="glass-card" id="volunteer-applications-section">
      <div style={{ padding: '24px 24px 0 24px' }}>
        <div className="ops-section-header">
          <span className="ops-section-title">
            <i className="ph-fill ph-hand-heart"></i>
            <span>Volunteer Management</span>
          </span>
          <a
            href="#volunteers-section"
            className="section-arrow-btn"
            style={{
              textDecoration: 'none',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              fontSize: '0.8rem',
              color: 'var(--primary)',
              fontWeight: 700
            }}
          >
            <span>Go to Page</span>
            <i className="ph ph-arrow-right"></i>
          </a>
        </div>
      </div>

      <div className="adopt-req-list" id="volunteer-applications-list">
        {pendingApps.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon" style={{ background: 'rgba(249, 115, 22, 0.06)', color: 'var(--primary)' }}>
              <i className="ph ph-users"></i>
            </div>
            <h4>No pending volunteer applications</h4>
            <p>All submitted volunteer requests have been reviewed.</p>
          </div>
        ) : (
          pendingApps.map((app) => {
            const initials = app.name ? app.name[0].toUpperCase() : 'V';
            const colorTheme = app.name === 'Priya' ? '14b8a6' : app.name === 'Akash' ? '64748b' : 'f97316';
            const avatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(app.name || 'Volunteer')}&background=${colorTheme}&color=fff&bold=true`;

            return (
              <div className="adopt-req-item" key={app.id} id={`vol-app-${app.id}`}>
                <div className="adopt-req-left">
                  <img
                    src={avatarUrl}
                    className="adopt-req-avatar"
                    alt={initials}
                  />
                  <div className="adopt-req-info">
                    <h5>{app.name} ({app.role || 'Volunteer'})</h5>
                    <p>
                      Email: <strong>{app.email}</strong> • Submitted {app.date || 'Recently'}
                    </p>
                  </div>
                </div>
                <div className="adopt-req-actions">
                  <button
                    className="btn-adopt-act approve"
                    onClick={() => onApprove(app.id)}
                  >
                    Approve
                  </button>
                  <button
                    className="btn-adopt-act reject"
                    onClick={() => onReject(app.id)}
                  >
                    Reject
                  </button>
                  <button
                    className="btn-adopt-act review"
                    onClick={() => onViewDetails(app)}
                  >
                    Review
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </section>
  );
}
export default VolunteerApplicationsSection;
