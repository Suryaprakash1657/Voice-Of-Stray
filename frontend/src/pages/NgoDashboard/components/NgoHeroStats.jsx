import React from 'react';

export default function NgoHeroStats({
  stats = { activeCasesCount: 0, availableVolunteersCount: 0, animalsUnderCareCount: 18, rescuesThisMonthCount: 15 },
  onScrollTo,
  onOpenAnimalsUnderCare,
  onOpenSuccessfulRescues
}) {
  return (
    <div className="hero-stats-grid">
      {/* Stat 1: Active Rescue Cases */}
      <div className="hero-stat-card" onClick={() => onScrollTo('active-cases-section')}>
        <div className="hero-stat-header">
          <div className="hero-stat-icon">
            <i className="ph-fill ph-ambulance"></i>
          </div>
        </div>
        <h3 id="active-cases-count-card">{stats.activeCasesCount}</h3>
        <p>Active Rescue Cases</p>
      </div>

      {/* Stat 2: Available Volunteers */}
      <div className="hero-stat-card" onClick={() => onScrollTo('volunteers-section')}>
        <div className="hero-stat-header">
          <div className="hero-stat-icon" style={{ background: '#e0f2fe', color: '#0284c7' }}>
            <i className="ph-fill ph-users-three"></i>
          </div>
        </div>
        <h3 id="vol-manage-count-card">{stats.availableVolunteersCount}</h3>
        <p>Available Volunteers</p>
      </div>

      {/* Stat 3: Animals Under Care */}
      <div className="hero-stat-card" onClick={onOpenAnimalsUnderCare}>
        <div className="hero-stat-header">
          <div className="hero-stat-icon" style={{ background: '#fce7f3', color: '#db2777' }}>
            <i className="ph-fill ph-house-line"></i>
          </div>
        </div>
        <h3>{stats.animalsUnderCareCount}</h3>
        <p>Animals Under Care</p>
      </div>

      {/* Stat 4: Rescues This Month */}
      <div className="hero-stat-card" onClick={onOpenSuccessfulRescues}>
        <div className="hero-stat-header">
          <div className="hero-stat-icon" style={{ background: '#dcfce7', color: '#15803d' }}>
            <i className="ph-fill ph-check-circle"></i>
          </div>
        </div>
        <h3 id="resolved-cases-count-card">{stats.rescuesThisMonthCount}</h3>
        <p>Rescues This Month</p>
      </div>
    </div>
  );
}
