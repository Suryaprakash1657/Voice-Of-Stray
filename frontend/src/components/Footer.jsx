import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="premium-footer">
      <div className="footer-grid">
        <div className="footer-brand">
          <h2><i className="ph-fill ph-paw-print"></i> Voice of Stray</h2>
          <p>Building a compassionate world where no animal suffers alone. Together we can give every stray a voice.</p>
        </div>
        
        <div className="footer-links">
          <h4>Platform</h4>
          <ul>
            <li><Link to="/report">Report a Stray</Link></li>
            <li><Link to="/rescue">Live Tracking</Link></li>
            <li><Link to="/adopt">Adopt a Pet</Link></li>
            <li><Link to="/community">Community Feed</Link></li>
          </ul>
        </div>
        
        <div className="footer-links">
          <h4>Get Involved</h4>
          <ul>
            <li><Link to="/volunteer">Volunteer</Link></li>
            <li><Link to="/donate">Donate</Link></li>
            <li><Link to="/signup">Register NGO</Link></li>
            <li><Link to="/adopt">Foster Program</Link></li>
          </ul>
        </div>
        
        <div className="footer-newsletter">
          <h4>Stay Updated</h4>
          <p style={{ color: '#94a3b8', marginBottom: '16px', fontSize: '0.9rem' }}>Get the latest rescue stories and updates.</p>
          <div className="newsletter-form">
            <input type="email" placeholder="Email address" />
            <button>Subscribe</button>
          </div>
        </div>
      </div>
      
      <div className="footer-bottom">
        <p>&copy; 2026 Voice of Stray. All rights reserved.</p>
        <div className="social-links">
          <a href="#"><i className="ph-fill ph-instagram-logo"></i></a>
          <a href="#"><i className="ph-fill ph-twitter-logo"></i></a>
          <a href="#"><i className="ph-fill ph-facebook-logo"></i></a>
        </div>
      </div>
    </footer>
  );
}
