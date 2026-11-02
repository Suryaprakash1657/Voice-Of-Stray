import React from 'react';

export function QuickActionsShortcuts({ onAction, scrollToSection }) {
  return (
    <section className="glass-card" style={{ paddingBottom: '12px' }}>
      <div style={{ padding: '24px 24px 0 24px' }}>
        <div className="ops-section-header">
          <span className="ops-section-title">
            <i className="ph-fill ph-sparkles"></i>
            <span>Operations Quick Actions</span>
          </span>
        </div>
      </div>

      <div className="quick-shortcut-grid">
        <button
          type="button"
          className="shortcut-btn"
          onClick={() => onAction ? onAction('create-update') : alert('Creating rescue update log entry...')}
        >
          <i className="ph ph-pencil-simple"></i>
          <span>Create Update</span>
        </button>

        <button
          type="button"
          className="shortcut-btn"
          onClick={() => scrollToSection ? scrollToSection('volunteer-applications-section') : null}
        >
          <i className="ph ph-hand-heart"></i>
          <span>Volunteer Management</span>
        </button>

        <button
          type="button"
          className="shortcut-btn"
          onClick={() => scrollToSection ? scrollToSection('pending-adoptions-section') : null}
        >
          <i className="ph ph-house-line"></i>
          <span>Review Adoptions</span>
        </button>

        <button
          type="button"
          className="shortcut-btn"
          onClick={() => scrollToSection ? scrollToSection('donations-section') : null}
        >
          <i className="ph ph-coins"></i>
          <span>View Donations</span>
        </button>
      </div>
    </section>
  );
}

export default QuickActionsShortcuts;
