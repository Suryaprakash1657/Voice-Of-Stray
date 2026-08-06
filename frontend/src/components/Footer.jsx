import React from 'react';

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
            <li><a href="/report.html">Report a Stray</a></li>
            <li><a href="/rescue.html">Live Tracking</a></li>
            <li><a href="/adopt.html">Adopt a Pet</a></li>
            <li><a href="/community.html">Community Feed</a></li>
          </ul>
        </div>
        
        <div className="footer-links">
          <h4>Get Involved</h4>
          <ul>
            <li><a href="/volunteer.html">Volunteer</a></li>
            <li><a href="/donate.html">Donate</a></li>
            <li><a href="#">Register NGO</a></li>
            <li><a href="#">Foster Program</a></li>
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
