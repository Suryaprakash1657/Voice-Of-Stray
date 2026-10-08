import React from 'react';
import { Link } from 'react-router-dom';

export default function AuthLayout({
  children,
  title,
  titleHighlight,
  subtitle,
  quote = null,
  stats = {
    left1: { count: '15,000+', label: 'Animals Rescued', icon: 'ph-fill ph-paw-print' },
    left2: { count: '7,000+', label: 'Active Volunteers', icon: 'ph-fill ph-users' },
    right1: { count: '450+', label: 'NGO Partners', icon: 'ph-fill ph-shield-check', isNgo: true },
    right2: { count: '24/7', label: 'Rescue Network', icon: 'ph-fill ph-clock' }
  }
}) {
  return (
    <div className="auth-page-root">
      {/* 1. Layered Background Decorations */}
      <div className="bg-decorations">
        {/* Large Paw Top Left */}
        <svg
          className="decor-item"
          style={{ top: '5%', left: '3%', width: '140px', transform: 'rotate(-15deg)' }}
          viewBox="0 0 100 100"
        >
          <ellipse cx="25" cy="40" rx="9" ry="12" />
          <ellipse cx="42" cy="25" rx="9" ry="12" />
          <ellipse cx="62" cy="25" rx="9" ry="12" />
          <ellipse cx="78" cy="40" rx="9" ry="12" />
          <path d="M 28 65 C 28 50, 40 45, 52 45 C 64 45, 76 50, 76 65 C 76 80, 64 85, 52 85 C 40 85, 28 80, 28 65 Z" />
        </svg>

        {/* Large Paw Top Right */}
        <svg
          className="decor-item"
          style={{ top: '15%', right: '18%', width: '100px', transform: 'rotate(20deg)' }}
          viewBox="0 0 100 100"
        >
          <ellipse cx="25" cy="40" rx="9" ry="12" />
          <ellipse cx="42" cy="25" rx="9" ry="12" />
          <ellipse cx="62" cy="25" rx="9" ry="12" />
          <ellipse cx="78" cy="40" rx="9" ry="12" />
          <path d="M 28 65 C 28 50, 40 45, 52 45 C 64 45, 76 50, 76 65 C 76 80, 64 85, 52 85 C 40 85, 28 80, 28 65 Z" />
        </svg>

        {/* Paw Print Middle Left */}
        <svg
          className="decor-item"
          style={{ top: '45%', left: '2%', width: '80px', transform: 'rotate(10deg)' }}
          viewBox="0 0 100 100"
        >
          <ellipse cx="25" cy="40" rx="9" ry="12" />
          <ellipse cx="42" cy="25" rx="9" ry="12" />
          <ellipse cx="62" cy="25" rx="9" ry="12" />
          <ellipse cx="78" cy="40" rx="9" ry="12" />
          <path d="M 28 65 C 28 50, 40 45, 52 45 C 64 45, 76 50, 76 65 C 76 80, 64 85, 52 85 C 40 85, 28 80, 28 65 Z" />
        </svg>

        {/* Paw Print Middle Right */}
        <svg
          className="decor-item"
          style={{ top: '52%', right: '3%', width: '90px', transform: 'rotate(-25deg)' }}
          viewBox="0 0 100 100"
        >
          <ellipse cx="25" cy="40" rx="9" ry="12" />
          <ellipse cx="42" cy="25" rx="9" ry="12" />
          <ellipse cx="62" cy="25" rx="9" ry="12" />
          <ellipse cx="78" cy="40" rx="9" ry="12" />
          <path d="M 28 65 C 28 50, 40 45, 52 45 C 64 45, 76 50, 76 65 C 76 80, 64 85, 52 85 C 40 85, 28 80, 28 65 Z" />
        </svg>

        {/* Golden Retriever Dog Silhouette Top Right */}
        <svg
          className="decor-item"
          style={{ top: '8%', right: '2%', width: '180px', transform: 'scaleX(-1) rotate(-8deg)' }}
          viewBox="0 0 200 200"
        >
          <path d="M 80,45 C 80,38 85,32 92,30 C 100,28 108,32 110,40 C 112,48 108,55 106,62 C 104,70 108,76 112,80 C 118,85 125,92 128,100 C 132,110 134,122 134,135 C 134,148 130,160 120,165 C 112,168 102,168 95,165 C 85,160 80,148 80,135 C 80,122 82,110 86,100 C 90,92 88,85 84,80 C 80,76 76,70 76,62 C 76,55 78,48 80,45 Z M 120,165 C 122,166 128,168 135,168 C 142,168 150,162 152,152 C 154,142 148,135 142,135 C 135,135 130,145 128,155 Z" />
        </svg>

        {/* Leaves Bottom Left */}
        <svg
          className="decor-item leaves"
          style={{ bottom: '-20px', left: '-20px', width: '240px', transform: 'rotate(15deg)' }}
          viewBox="0 0 100 100"
        >
          <path d="M10,90 Q30,70 50,50 Q70,30 90,10" stroke="currentColor" strokeWidth="2" fill="none" />
          <path d="M50,50 Q45,30 30,30 Q40,45 50,50" />
          <path d="M70,30 Q65,10 50,10 Q60,25 70,30" />
          <path d="M30,70 Q25,50 10,50 Q20,65 30,70" />
        </svg>

        {/* Leaves Bottom Right */}
        <svg
          className="decor-item leaves"
          style={{ bottom: '-20px', right: '-20px', width: '240px', transform: 'scaleX(-1) rotate(15deg)' }}
          viewBox="0 0 100 100"
        >
          <path d="M10,90 Q30,70 50,50 Q70,30 90,10" stroke="currentColor" strokeWidth="2" fill="none" />
          <path d="M50,50 Q45,30 30,30 Q40,45 50,50" />
          <path d="M70,30 Q65,10 50,10 Q60,25 70,30" />
          <path d="M30,70 Q25,50 10,50 Q20,65 30,70" />
        </svg>

        {/* Glowing Bokeh Stars */}
        <svg className="decor-item sparkle" style={{ top: '25%', left: '30%', width: '24px' }} viewBox="0 0 24 24">
          <path d="M12,2 L14.5,9.5 L22,12 L14.5,14.5 L12,22 L9.5,14.5 L2,12 L9.5,9.5 Z" />
        </svg>
        <svg className="decor-item sparkle" style={{ top: '30%', right: '28%', width: '30px', animationDelay: '1s' }} viewBox="0 0 24 24">
          <path d="M12,2 L14.5,9.5 L22,12 L14.5,14.5 L12,22 L9.5,14.5 L2,12 L9.5,9.5 Z" />
        </svg>
        <svg className="decor-item sparkle" style={{ bottom: '28%', left: '25%', width: '20px', animationDelay: '0.5s' }} viewBox="0 0 24 24">
          <path d="M12,2 L14.5,9.5 L22,12 L14.5,14.5 L12,22 L9.5,14.5 L2,12 L9.5,9.5 Z" />
        </svg>
        <svg className="decor-item sparkle" style={{ bottom: '22%', right: '26%', width: '28px', animationDelay: '1.5s' }} viewBox="0 0 24 24">
          <path d="M12,2 L14.5,9.5 L22,12 L14.5,14.5 L12,22 L9.5,14.5 L2,12 L9.5,9.5 Z" />
        </svg>
      </div>

      {/* 2. Top Branding Logo Bar */}
      <Link to="/" className="auth-logo-bar">
        <i className="ph-fill ph-paw-print"></i>
        <span>Voice of Stray</span>
      </Link>

      {/* 3. Header */}
      <header className="auth-header">
        <h1>
          {title} <span>{titleHighlight}</span>
        </h1>
        <p>{subtitle}</p>
        {quote && (
          <div className="emotional-quote-line">
            <i className="ph-fill ph-heart"></i>
            <span>{quote}</span>
            <i className="ph-fill ph-heart"></i>
          </div>
        )}
      </header>

      {/* 4. Layout Grid with Floating Sidebars and Central Card */}
      <div className="auth-layout-wrapper">
        {/* Floating Left Sidebar */}
        <div className="floating-sidebar left">
          <div className="stat-bubble">
            <div className="bubble-icon-wrap">
              <i className={stats.left1.icon}></i>
            </div>
            <h3>{stats.left1.count}</h3>
            <p>{stats.left1.label}</p>
          </div>
          <div className="stat-bubble">
            <div className="bubble-icon-wrap">
              <i className={stats.left2.icon}></i>
            </div>
            <h3>{stats.left2.count}</h3>
            <p>{stats.left2.label}</p>
          </div>
        </div>

        {/* Central Card */}
        {children}

        {/* Floating Right Sidebar */}
        <div className="floating-sidebar right">
          <div className={`stat-bubble ${stats.right1.isNgo ? 'ngo-bubble' : ''}`}>
            <div className="bubble-icon-wrap">
              <i className={stats.right1.icon}></i>
            </div>
            <h3>{stats.right1.count}</h3>
            <p>{stats.right1.label}</p>
          </div>
          <div className="stat-bubble">
            <div className="bubble-icon-wrap">
              <i className={stats.right2.icon}></i>
            </div>
            <h3>{stats.right2.count}</h3>
            <p>{stats.right2.label}</p>
          </div>
        </div>
      </div>

      {/* 5. Trust Badges */}
      <div className="trust-footer-badges">
        <div className="trust-badge-item">
          <i className="ph-fill ph-seal-check"></i>
          <span>Verified NGOs (Trusted partners)</span>
        </div>
        <div className="trust-badge-item">
          <i className="ph-fill ph-shield-lock"></i>
          <span>Safe Authentication (Your data is secure)</span>
        </div>
        <div className="trust-badge-item">
          <i className="ph-fill ph-users-three"></i>
          <span>Community Trusted (Loved by thousands)</span>
        </div>
      </div>

      {/* 6. Consent Note */}
      <div className="consent-footer-note">
        By continuing, you agree to our <a href="#">Terms of Service</a> and <a href="#">Privacy Policy</a>.
      </div>
    </div>
  );
}
