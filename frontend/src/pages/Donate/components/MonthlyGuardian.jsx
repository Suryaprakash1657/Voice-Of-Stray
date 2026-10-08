import React from 'react';

export function MonthlyGuardian({ onJoinGuardian }) {
  return (
    <section className="guardian-section fade-in">
      <div className="guardian-left">
        <h2>Become a Monthly Guardian</h2>
        <p>
          Sustained support allows us to plan long-term rescue operations and maintain sanctuary facilities.
        </p>
        <div className="joined-badge" style={{ marginBottom: '24px' }}>
          <div className="icon-circle">
            <i className="ph-bold ph-share-network"></i>
          </div>
          <span>Joined by 2,000+ Guardians</span>
        </div>
        <div className="avatar-group">
          <img src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=100" alt="Supporter" />
          <img src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=100" alt="Supporter" />
          <img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=100" alt="Supporter" />
          <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=100" alt="Supporter" />
          <div
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              border: '2px solid #ea580c',
              marginLeft: '-10px',
              background: 'white',
              color: 'var(--primary, #f97316)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '0.7rem',
              fontWeight: 'bold',
              position: 'relative',
              zIndex: 5
            }}
          >
            +2k
          </div>
        </div>
      </div>

      <div className="guardian-right">
        <div className="benefit-card">
          <div className="benefit-icon">
            <i className="ph-fill ph-file-text"></i>
          </div>
          <div className="benefit-content">
            <h4>Digital Care Reports</h4>
            <p>Weekly personalized updates on animals you help support.</p>
          </div>
        </div>
        <div className="benefit-card">
          <div className="benefit-icon">
            <i className="ph-fill ph-files"></i>
          </div>
          <div className="benefit-content">
            <h4>Annual Impact Statement</h4>
            <p>Simplified tax-ready reports for all your contributions.</p>
          </div>
        </div>
        <div className="benefit-card">
          <div className="benefit-icon">
            <i className="ph-fill ph-users"></i>
          </div>
          <div className="benefit-content">
            <h4>Community Invites</h4>
            <p>Exclusive quarterly webinars with our rescue ground teams.</p>
          </div>
        </div>
        <div className="benefit-card">
          <div className="benefit-icon">
            <i className="ph-fill ph-medal"></i>
          </div>
          <div className="benefit-content">
            <h4>Digital Badge</h4>
            <p>A custom badge for your profile and social media impact.</p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default MonthlyGuardian;
