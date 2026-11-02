import React from 'react';

export default function VolunteersListSection({
  volunteers = [],
  onManageClick
}) {
  const getStatusDetails = (activityStatus) => {
    let statusText = 'Available';
    let statusClass = 'available';

    if (activityStatus === 'Unavailable') {
      statusText = 'On Rescue';
      statusClass = 'busy';
    } else if (activityStatus === 'Inactive') {
      statusText = 'Offline';
      statusClass = 'offline';
    }

    return { statusText, statusClass };
  };

  return (
    <section className="glass-card ops-col-card" style={{ paddingBottom: '12px' }} id="volunteers-section">
      <div className="ops-section-header">
        <span className="ops-section-title">
          <i className="ph-fill ph-users-three"></i>
          <span>Volunteer Management</span>
        </span>
        <button
          className="section-arrow-btn"
          onClick={onManageClick}
          style={{
            background: 'none',
            border: 'none',
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            fontSize: '0.8rem',
            color: 'var(--primary)',
            fontWeight: 700,
            cursor: 'pointer'
          }}
        >
          <span>Manage</span>
          <i className="ph ph-arrow-right"></i>
        </button>
      </div>

      <div className="vol-list" id="volunteers-list-container">
        {volunteers.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '20px', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
            No approved volunteers yet.
          </div>
        ) : (
          volunteers.map((vol) => {
            const { statusText, statusClass } = getStatusDetails(vol.status);
            const initials = vol.name ? vol.name[0].toUpperCase() : 'V';
            let colorTheme = 'f97316';
            if (vol.name === 'Priya') colorTheme = '14b8a6';
            else if (vol.name === 'Akash') colorTheme = '64748b';

            return (
              <div key={vol.id || vol.volunteerId || vol.name} className="vol-item">
                <div className="vol-info">
                  <img
                    src={`https://ui-avatars.com/api/?name=${encodeURIComponent(vol.name)}&background=${colorTheme}&color=fff&bold=true`}
                    alt={initials}
                  />
                  <span className="vol-name">{vol.name}</span>
                </div>
                <span className={`status-pill ${statusClass}`}>{statusText}</span>
              </div>
            );
          })
        )}
      </div>
    </section>
  );
}
