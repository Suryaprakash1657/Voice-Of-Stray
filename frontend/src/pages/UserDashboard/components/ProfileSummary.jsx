import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function ProfileSummary({ user, profile, isVolunteerOrRescuer, isNewUser }) {
  const navigate = useNavigate();

  const getAccountBadgeText = () => {
    if (user?.role === 'ngo') {
      return 'NGO Partner Account';
    }
    if (isVolunteerOrRescuer) {
      return `${profile?.accountType || 'Volunteer'} Account`;
    }
    if (isNewUser) {
      return 'New Rescue Member';
    }
    return `${profile?.accountType || 'Regular User'} Account`;
  };

  return (
    <section className="glass-card" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <div
          className="active-item-icon saved"
          style={{ background: 'rgba(249, 115, 22, 0.08)', width: '44px', height: '44px', fontSize: '1.4rem' }}
        >
          <i className="ph-fill ph-user-gear"></i>
        </div>
        <div>
          <h4 style={{ fontSize: '0.95rem', fontWeight: 800, color: '#0f172a' }}>Account Type</h4>
          <span
            className="dropdown-role-badge user"
            id="account-badge"
            style={{ fontSize: '0.65rem', padding: '2px 8px', marginTop: '4px' }}
          >
            {getAccountBadgeText()}
          </span>
        </div>
      </div>
      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: 1.5, fontWeight: 500 }}>
        Future architecture prepared for both <strong>User Accounts</strong> and <strong>NGO / Shelter Accounts</strong>.
      </div>
      <div style={{ height: '1px', background: 'rgba(249, 115, 22, 0.08)', margin: '4px 0' }}></div>
      <button
        className="btn-premium secondary"
        style={{
          fontSize: '0.82rem',
          padding: '10px 16px',
          justifyContent: 'center',
          width: '100%',
          border: '1px solid rgba(249, 115, 22, 0.15)'
        }}
        onClick={() => {
          window.location.href = '/user-edit-profile.html';
        }}
      >
        <i className="ph ph-pencil-simple"></i> Edit Rescue Settings
      </button>

      {isVolunteerOrRescuer && (
        <button
          id="btn-volunteer-activities"
          className="btn-premium primary"
          style={{
            fontSize: '0.82rem',
            padding: '10px 16px',
            justifyContent: 'center',
            width: '100%',
            border: '1px solid rgba(249, 115, 22, 0.15)',
            marginTop: '8px'
          }}
          onClick={() => navigate('/volunteer?view=activities')}
        >
          <i className="ph ph-squares-four"></i> Volunteer Activities
        </button>
      )}
    </section>
  );
}
