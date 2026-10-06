import React, { useEffect, useState } from 'react';

export function VolunteerHero({ onOpenVolunteerModal, onOpenNgoModal, onOpenFosterModal, isNgo = false }) {
  const [counts, setCounts] = useState({
    volunteers: 0,
    lives: 0,
    ngos: 0,
    rate: 0
  });

  useEffect(() => {
    // Smooth counter animation on mount
    const targets = { volunteers: 1240, lives: 15420, ngos: 85, rate: 98 };
    const duration = 1200;
    const steps = 40;
    const intervalTime = duration / steps;
    let step = 0;

    const timer = setInterval(() => {
      step++;
      const progress = step / steps;
      setCounts({
        volunteers: Math.round(targets.volunteers * progress),
        lives: Math.round(targets.lives * progress),
        ngos: Math.round(targets.ngos * progress),
        rate: Math.round(targets.rate * progress)
      });

      if (step >= steps) {
        clearInterval(timer);
        setCounts(targets);
      }
    }, intervalTime);

    return () => clearInterval(timer);
  }, []);

  return (
    <>
      {/* Emergency Banner (Visible only for non-NGO users) */}
      {!isNgo && (
        <div style={{ maxWidth: '1200px', margin: '32px auto 0', padding: '0 24px' }}>
          <div className="emergency-banner fade-in">
            <h2>
              <i className="ph-fill ph-warning-circle"></i> Emergency Volunteers Needed Tonight
            </h2>
            <p>
              Due to severe weather conditions, we urgently need transport volunteers and temporary fosters to move strays from flood-prone zones to our sanctuaries.
            </p>
            <div className="emergency-actions">
              <button
                className="btn-white"
                onClick={onOpenVolunteerModal}
              >
                Join Emergency Team
              </button>
              <button
                className="btn-outline-white"
                onClick={onOpenFosterModal}
              >
                Become Foster Parent
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Hero Section */}
      <section className="volunteer-hero fade-in">
        <div className="hero-stats-floating left">
          <i className="ph-fill ph-check-circle" style={{ color: '#10b981', fontSize: '1.2rem' }}></i>
          <span>12k+ Rescues</span>
        </div>
        <div className="hero-stats-floating right">
          <i className="ph-fill ph-map-pin" style={{ color: 'var(--primary, #f97316)', fontSize: '1.2rem' }}></i>
          <span>Active in 50+ Cities</span>
        </div>

        <h1>Join the Rescue Ecosystem</h1>
        <p>Empowering heroes and organizations to build a world where no animal is left behind.</p>

        <div className="hero-ctas">
          {!isNgo && (
            <button
              className="btn-hero primary"
              onClick={onOpenVolunteerModal}
            >
              Join as Volunteer
            </button>
          )}
          <button
            className="btn-hero outline"
            onClick={onOpenNgoModal}
          >
            Partner as NGO
          </button>
        </div>

        <div className="hero-stats-grid">
          <div className="stat-card hover-lift">
            <div className="stat-icon">
              <i className="ph-fill ph-users"></i>
            </div>
            <div className="stat-value">{counts.volunteers.toLocaleString()}</div>
            <div className="stat-label">Volunteers Nearby</div>
          </div>

          <div className="stat-card green hover-lift">
            <div className="stat-icon">
              <i className="ph-fill ph-heartbeat"></i>
            </div>
            <div className="stat-value">{counts.lives.toLocaleString()}</div>
            <div className="stat-label">Total Lives Saved</div>
          </div>

          <div className="stat-card blue hover-lift">
            <div className="stat-icon">
              <i className="ph-fill ph-buildings"></i>
            </div>
            <div className="stat-value">{counts.ngos}</div>
            <div className="stat-label">Partner NGOs</div>
          </div>

          <div className="stat-card brown hover-lift">
            <div className="stat-icon">
              <i className="ph-fill ph-trend-up"></i>
            </div>
            <div className="stat-value">{counts.rate}%</div>
            <div className="stat-label">Success Rate</div>
          </div>
        </div>
      </section>
    </>
  );
}

export default VolunteerHero;
