import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function IncomingReportsSection({
  reports = [],
  onAcceptReport,
  onAccept,
  onViewReportDetails,
  onViewDetails
}) {
  const navigate = useNavigate();
  const handleAccept = onAcceptReport || onAccept;
  const handleView = onViewReportDetails || onViewDetails || ((r) => navigate(`/ngo-report-review?id=${r.id}`));
  return (
    <section className="glass-card priority-incident-panel" id="incoming-reports-section">
      <div style={{ padding: '20px 20px 0 20px' }}>
        <div className="ops-section-header" style={{ borderBottomColor: 'rgba(239, 68, 68, 0.15)' }}>
          <span className="ops-section-title" style={{ color: '#ef4444' }}>
            <i
              className="ph-fill ph-siren"
              style={{ color: '#ef4444', animation: 'pulseGlow 1.5s infinite alternate ease-in-out' }}
            ></i>
            <span>Incoming Rescue Reports (Highest Priority)</span>
          </span>
          <span
            className="status-pill"
            style={{
              background: '#fee2e2',
              color: '#ef4444',
              fontWeight: 800,
              animation: 'pulseGlow 1.5s infinite alternate'
            }}
          >
            Live Alerts Active
          </span>
        </div>
      </div>

      <div className="incident-grid" id="incoming-reports-grid">
        {reports.length === 0 ? (
          <div className="empty-state" style={{ gridColumn: '1 / -1' }}>
            <div className="empty-state-icon" style={{ background: 'rgba(16, 185, 129, 0.06)', color: '#10b981' }}>
              <i className="ph ph-shield-check"></i>
            </div>
            <h4>All caught up!</h4>
            <p>No incoming rescue reports at the moment. Active operations are en route safely.</p>
          </div>
        ) : (
          reports.map((r) => {
            const breedVal = r.breed || r.breedDesc || 'Other / Unknown';
            const ageVal = r.estimatedAge || 'Unknown';
            const categoryVal = r.issueCategory || 'Other';
            const conditionVal = r.observedCondition || r.description || '';

            return (
              <div key={r.id} className="incident-card" id={`report-card-${r.id}`}>
                <div className="incident-header">
                  <span className="incident-id">#RSC-{r.id}</span>
                  <span className="incident-time">
                    <i className="ph ph-clock"></i> {r.timeSubmitted || 'Just now'}
                  </span>
                </div>
                <div>
                  <h4 className="incident-title">
                    <i className="ph-fill ph-paw-print" style={{ color: 'var(--primary)' }}></i>{' '}
                    {r.animalType} ({breedVal})
                  </h4>
                  <div className="incident-loc" style={{ marginTop: '6px' }}>
                    <i className="ph-fill ph-map-pin"></i> {r.location}
                  </div>
                </div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: 1.4, fontWeight: 500 }}>
                  <strong>Age:</strong> {ageVal} | <strong>Category:</strong> {categoryVal}
                  <br />
                  <strong>Condition:</strong> {conditionVal}
                </div>
                <div className="incident-actions">
                  <button className="btn-inc-primary" onClick={() => handleAccept && handleAccept(r.id)}>
                    Accept Case
                  </button>
                  <button className="btn-inc-sec" onClick={() => handleView(r)}>
                    View Details
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
