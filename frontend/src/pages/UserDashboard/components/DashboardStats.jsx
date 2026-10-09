import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function useCounterAnimation(targetValue, duration = 400) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTimestamp = null;
    const end = Number(targetValue) || 0;
    const start = 0;

    const step = (timestamp) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      setCount(Math.floor(progress * (end - start) + start));
      if (progress < 1) {
        window.requestAnimationFrame(step);
      }
    };

    window.requestAnimationFrame(step);
  }, [targetValue, duration]);

  return count;
}

export default function DashboardStats({ stats = { reports: 0, helped: 0, volunteer: 0, donations: 0 }, isVolunteerOrRescuer }) {
  const navigate = useNavigate();

  const animatedReports = useCounterAnimation(stats.reports);
  const animatedHelped = useCounterAnimation(stats.helped);
  const animatedVolunteer = useCounterAnimation(stats.volunteer);
  const animatedDonations = useCounterAnimation(stats.donations);

  return (
    <section className="stats-section-wrap">
      <h2 className="quick-actions-title">
        <i className="ph-fill ph-chart-bar" style={{ color: 'var(--primary)' }}></i>
        <span>Your Lifesaver Impact Overview</span>
      </h2>
      <div className="stats-grid">
        {/* Stat 1: Reports Submitted */}
        <div className="stat-card">
          <div className="stat-card-icon">
            <i className="ph-fill ph-megaphone"></i>
          </div>
          <h4 id="stat-reports">{animatedReports}</h4>
          <p>Reports Submitted</p>
        </div>

        {/* Stat 2: Animals Helped */}
        <div className="stat-card">
          <div className="stat-card-icon">
            <i className="ph-fill ph-first-aid-kit"></i>
          </div>
          <h4 id="stat-helped">{animatedHelped}</h4>
          <p>Animals Helped</p>
        </div>

        {/* Stat 3: Volunteer Activities */}
        {isVolunteerOrRescuer && (
          <div
            id="stat-card-volunteer"
            className="stat-card"
            onClick={() => navigate('/volunteer?view=activities')}
            style={{ cursor: 'pointer' }}
          >
            <div className="stat-card-icon">
              <i className="ph-fill ph-users-three"></i>
            </div>
            <h4 id="stat-volunteer">{animatedVolunteer}</h4>
            <p>Volunteer Activities</p>
          </div>
        )}

        {/* Stat 4: Donations Made */}
        <div className="stat-card">
          <div className="stat-card-icon">
            <i className="ph-fill ph-gift"></i>
          </div>
          <h4 id="stat-donations">{animatedDonations}</h4>
          <p>Donations Made</p>
        </div>
      </div>
    </section>
  );
}
