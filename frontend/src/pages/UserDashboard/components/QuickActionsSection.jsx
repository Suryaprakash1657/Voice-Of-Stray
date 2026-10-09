import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function QuickActionsSection({ isVolunteerOrRescuer }) {
  const navigate = useNavigate();

  return (
    <section>
      <h2 className="quick-actions-title">
        <i className="ph-fill ph-sparkles" style={{ color: 'var(--primary)' }}></i>
        <span>Quick Rescue Hub Actions</span>
      </h2>
      <div className="quick-actions-grid">
        {/* Action 1: Report Stray */}
        <div className="action-card report" onClick={() => navigate('/report')}>
          <div className="action-icon">
            <i className="ph-fill ph-warning-circle"></i>
          </div>
          <h3>Report Stray</h3>
          <p>Report street emergencies and tag real-time locations.</p>
        </div>

        {/* Action 2: Adopt a Pet */}
        <div className="action-card adopt" onClick={() => navigate('/adopt')}>
          <div className="action-icon">
            <i className="ph-fill ph-paw-print"></i>
          </div>
          <h3>Adopt a Pet</h3>
          <p>View verified loving shelter animals looking for a home.</p>
        </div>

        {/* Action 3: Volunteer */}
        <div
          className="action-card volunteer"
          onClick={() => navigate(isVolunteerOrRescuer ? '/volunteer?view=activities' : '/volunteer')}
        >
          <div className="action-icon">
            <i className="ph-fill ph-hand-heart"></i>
          </div>
          <h3>{isVolunteerOrRescuer ? 'Volunteer Activities' : 'Volunteer'}</h3>
          <p>
            {isVolunteerOrRescuer
              ? 'Manage assignments, track impact, and view badges.'
              : 'Onboard as a verified rescuer or local feeding coordinator.'}
          </p>
        </div>

        {/* Action 4: Donate */}
        <div className="action-card donate" onClick={() => navigate('/donate')}>
          <div className="action-icon">
            <i className="ph-fill ph-coins"></i>
          </div>
          <h3>Donate</h3>
          <p>Fund medical bills, foster networks, and shelter campaigns.</p>
        </div>
      </div>
    </section>
  );
}
