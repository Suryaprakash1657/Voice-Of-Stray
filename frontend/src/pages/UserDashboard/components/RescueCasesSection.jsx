import React from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardEmptyState from './DashboardEmptyState.jsx';

export default function RescueCasesSection({ cases = [] }) {
  const navigate = useNavigate();

  const getStatusBadge = (status = '') => {
    const s = status.toLowerCase();
    if (s.includes('completed') || s.includes('adopted') || s.includes('resolved') || s.includes('rescued')) {
      return { className: 'status-pill completed', icon: 'ph-bold ph-check', label: status || 'Completed' };
    }
    if (s.includes('en route') || s.includes('en-route') || s.includes('dispatched')) {
      return { className: 'status-pill en-route', icon: 'ph-bold ph-clock', label: status || 'En Route' };
    }
    if (s.includes('emergency') || s.includes('critical')) {
      return { className: 'status-pill emergency', icon: 'ph-bold ph-warning', label: status || 'Emergency' };
    }
    return { className: 'status-pill pending', icon: 'ph-bold ph-hourglass', label: status || 'Reported' };
  };

  return (
    <section className="glass-card">
      <div style={{ padding: '24px 24px 0 24px' }}>
        <div className="section-header">
          <span className="section-title-wrap">
            <i className="ph-fill ph-shield-alert"></i>
            <span>My Rescue Cases</span>
          </span>
          <button className="section-arrow-btn" onClick={() => navigate('/rescue')}>
            <span>View all cases</span>
            <i className="ph ph-arrow-right"></i>
          </button>
        </div>
      </div>
      <div className="section-card-content" id="rescue-cases-container">
        {cases.length === 0 ? (
          <DashboardEmptyState
            icon="ph ph-shield-alert"
            title="No rescue cases yet"
            description="Your reported rescue missions will appear here once you report street stray animals in emergency."
          />
        ) : (
          <div className="active-list">
            {cases.map((c) => {
              const badge = getStatusBadge(c.status);
              const title = c.condition || `${c.animalType} (${c.breed})`;
              const displayId = String(c.id).startsWith('RSC-') ? c.id : `RSC-${c.id}`;

              return (
                <div
                  key={c.id}
                  className="active-item"
                  style={{ cursor: 'pointer' }}
                  onClick={() => navigate(`/rescue?id=${displayId}`)}
                >
                  <div className="active-item-left">
                    <div className="active-item-icon rescue">
                      <i className="ph-fill ph-first-aid"></i>
                    </div>
                    <div className="active-item-info">
                      <h5>{title}</h5>
                      <p>
                        {c.location} &bull; Case ID: #{displayId}
                      </p>
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
