import React from 'react';

export default function DashboardHeader({ user, profile, isNewUser, helpedCount }) {
  const displayName = profile?.fullName || user?.name || 'Friend';

  return (
    <div className="hero-banner">
      <i className="ph-fill ph-paw-print hero-paws" style={{ fontSize: '15rem', transform: 'rotate(-10deg)' }}></i>
      <i
        className="ph-fill ph-paw-print hero-paws"
        style={{ fontSize: '8rem', left: 'auto', right: '280px', bottom: '10px', top: 'auto', transform: 'rotate(15deg)' }}
      ></i>

      <div className="hero-banner-content">
        {isNewUser ? (
          <h1 id="hero-title">
            Your rescue journey starts here, <span>{displayName}</span> 🐾
          </h1>
        ) : (
          <h1 id="hero-title">
            Welcome back, <span>{displayName}</span> 👋
          </h1>
        )}

        {isNewUser ? (
          <p className="hero-subtitle" id="hero-subtitle">
            Report, adopt, volunteer, or donate to make your first impact.
          </p>
        ) : (
          <p className="hero-subtitle" id="hero-subtitle">
            Together we helped {helpedCount || 5} animals this month 🐾
          </p>
        )}

        <p className="hero-tagline">
          Keep making a difference in the lives of stray animals.
        </p>
      </div>

      <div className="hero-banner-illustration">
        <img
          src="https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?auto=format&fit=crop&q=80&w=400"
          alt="Dog and Cat Rescue Friend"
          id="hero-dog-img"
        />
      </div>
    </div>
  );
}
