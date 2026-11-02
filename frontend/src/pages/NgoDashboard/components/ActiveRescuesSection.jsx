import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function ActiveRescuesSection({
  cases,
  activeCases,
  onViewCaseDetails,
  onUpdateCaseStatus,
  onUpdateStatus
}) {
  const navigate = useNavigate();
  const caseList = activeCases || cases || [];
  const handleUpdate = onUpdateCaseStatus || onUpdateStatus;
  const handleView = onViewCaseDetails || ((c) => navigate(`/ngo-rescue-manage?case=${c.id}`));

  const getIconClass = (statusStep) => {
    if (statusStep === 2) return 'ph-fill ph-user-check';
    if (statusStep >= 5) return 'ph-fill ph-first-aid-kit';
    return 'ph-fill ph-ambulance';
  };

  const getPillClass = (statusStep) => {
    if (statusStep >= 5) return 'clinic';
    return 'busy';
  };

  return (
    <section className="glass-card ops-col-card" id="active-cases-section">
      <div className="ops-section-header">
        <span className="ops-section-title">
          <i className="ph-fill ph-ambulance"></i>
          <span>Active Rescue Operations</span>
        </span>
        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 700 }}>
          {caseList.length} Real-Time Runs
        </span>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }} id="active-cases-list">
        {caseList.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">
              <i className="ph ph-check-circle"></i>
            </div>
            <h4>No active operations</h4>
            <p>All rescue operations have been successfully resolved. Good job team!</p>
          </div>
        ) : (
          caseList.map((c) => {
            const iconClass = getIconClass(c.statusStep);
            const pillClass = getPillClass(c.statusStep);
            const lead =
              c.assignedVolunteerName ||
              (c.team?.lead && typeof c.team.lead === 'object'
                ? c.team.lead.username || 'Not Assigned Yet'
                : c.team?.lead || 'Not Assigned Yet');

            return (
              <div key={c.id} className="ops-item-card" id={`active-case-${c.id}`}>
                <div className="active-item-left">
                  <div
                    className="active-item-icon rescue"
                    style={{ background: 'rgba(249, 115, 22, 0.08)', color: 'var(--primary)' }}
                  >
                    <i className={iconClass}></i>
                  </div>
                  <div className="active-item-info">
                    <h5 style={{ fontSize: '0.88rem' }}>
                      #RSC-{c.id} - {c.animal || c.condition || 'Stray Rescue'}
                    </h5>
                    <p>
                      Assigned: <strong>{lead}</strong>
                    </p>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span className={`status-pill ${pillClass}`}>{c.status || 'In Progress'}</span>
                  <button className="btn-view-details" onClick={() => handleView(c)}>
                    View Details
                  </button>
                  <button className="btn-status-update" onClick={() => handleUpdate && handleUpdate(c.id)}>
                    Update Status
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
