import React from 'react';

export default function NgoHeader({ ngoName = 'Paws Haven NGO', ngoEmail = 'contact@pawshaven.org' }) {
  return (
    <div className="ops-hero">
      <div className="ops-hero-info">
        <h1 id="ngo-welcome-title">
          Welcome Back, <span>{ngoName}</span> 🐾
        </h1>
        <p style={{ fontSize: '0.92rem', color: 'var(--text-muted)', fontWeight: 500 }} id="ngo-welcome-email">
          {ngoEmail}
        </p>
        <div className="ops-hero-badge-wrap">
          <span className="dropdown-role-badge ngo" id="ngo-role-badge">
            NGO Shelter Partner
          </span>
          <span style={{ fontSize: '0.8rem', color: 'var(--primary)', fontWeight: 700 }}>
            Active Rescue Hub Command
          </span>
        </div>
      </div>

      <div className="ops-hero-illustration">
        <img
          src="https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=format&fit=crop&q=80&w=300"
          alt="Rescue Animals"
        />
      </div>
    </div>
  );
}
