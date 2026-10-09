import React from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardEmptyState from './DashboardEmptyState.jsx';

export default function AdoptionRequestsSection({ adoptionRequests = [] }) {
  const navigate = useNavigate();

  const getStatusBadge = (status = '') => {
    const s = status.toLowerCase();
    if (s === 'approved') {
      return { className: 'status-pill approved', icon: 'ph-bold ph-check', label: 'Approved' };
    }
    if (s === 'rejected') {
      return { className: 'status-pill emergency', icon: 'ph-bold ph-x', label: 'Rejected' };
    }
    return { className: 'status-pill pending', icon: 'ph-bold ph-hourglass', label: status || 'In Review' };
  };

  return (
    <section className="glass-card">
      <div style={{ padding: '24px 24px 0 24px' }}>
        <div className="section-header">
          <span className="section-title-wrap">
            <i className="ph-fill ph-house-line"></i>
            <span>My Adoption Requests</span>
          </span>
          <button className="section-arrow-btn" onClick={() => navigate('/adopt')}>
            <span>Adopt page</span>
            <i className="ph ph-arrow-right"></i>
          </button>
        </div>
      </div>
      <div className="section-card-content" id="adoption-requests-container">
        {adoptionRequests.length === 0 ? (
          <DashboardEmptyState
            icon="ph ph-house-line"
            title="You haven't applied for adoption yet"
            description="Your adoption requests will appear here once you apply to foster or adopt any of our happy tails."
          />
        ) : (
          <div className="active-list">
            {adoptionRequests.map((app) => {
              const badge = getStatusBadge(app.status);
              const breedText = app.breed ? ` (${app.breed})` : '';

              return (
                <div key={app.id || app.petName} className="active-item">
                  <div className="active-item-left">
                    <div className="active-item-icon adopt">
                      <i className="ph-fill ph-heart"></i>
                    </div>
                    <div className="active-item-info">
                      <h5>
                        {app.petName}
                        {breedText}
                      </h5>
                      <p>Shelter: {app.ngoName || 'City Rescue Shelter'}</p>
                    </div>
                  </div>
                  <span className={badge.className}>
                    <i className={badge.icon}></i> {badge.label}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
