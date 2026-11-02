import React from 'react';

export default function PendingAdoptionsSection({
  adoptions = [],
  onApprove,
  onReject,
  onReview,
  onApproveAdoption,
  onRejectAdoption,
  onReviewAdoption,
  onManageClick
}) {
  const handleApprove = onApprove || onApproveAdoption;
  const handleReject = onReject || onRejectAdoption;
  const handleReview = onReview || onReviewAdoption;
  return (
    <section className="glass-card" id="pending-adoptions-section">
      <div style={{ padding: '24px 24px 0 24px' }}>
        <div className="ops-section-header">
          <span className="ops-section-title">
            <i className="ph-fill ph-house-line"></i>
            <span>Pending Adoption Requests</span>
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
              fontSize: '0.85rem',
              color: 'var(--primary)',
              fontWeight: 700,
              cursor: 'pointer'
            }}
          >
            <span>Manage requests</span>
            <i className="ph ph-arrow-right"></i>
          </button>
        </div>
      </div>

      <div className="adopt-req-list" id="adoption-requests-list">
        {adoptions.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">
              <i className="ph ph-check-circle"></i>
            </div>
            <h4>All caught up!</h4>
            <p>No pending adoption requests at the moment.</p>
          </div>
        ) : (
          adoptions.map((app) => (
            <div key={app.id || app.petName + app.applicantName} className="adopt-req-item" id={`adopt-req-${app.id}`}>
              <div className="adopt-req-left">
                <img
                  src={app.avatar || "https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&q=80&w=100"}
                  className="adopt-req-avatar"
                  alt={app.petName}
                />
                <div className="adopt-req-info">
                  <h5>
                    {app.petName} ({app.breed || 'Companion'})
                  </h5>
                  <p>
                    Applicant: <strong>{app.applicantName}</strong> &bull; Submitted {app.date}
                  </p>
                </div>
              </div>
              <div className="adopt-req-actions">
                <button
                  type="button"
                  className="btn-adopt-act approve"
                  onClick={() => handleApprove && handleApprove(app.petName, app.applicantName)}
                >
                  Approve
                </button>
                <button
                  type="button"
                  className="btn-adopt-act reject"
                  onClick={() => handleReject && handleReject(app.petName, app.applicantName)}
                >
                  Reject
                </button>
                <button
                  type="button"
                  className="btn-adopt-act review"
                  onClick={() => handleReview && handleReview(app)}
                >
                  Review
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </section>
  );
}
