import React, { useState } from 'react';

export function Newsletter() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email && email.trim()) {
      setSubscribed(true);
    }
  };

  return (
    <section
      className="newsletter-section fade-in"
      style={{
        background: 'linear-gradient(135deg, #ffedd5 0%, #ffe4e6 100%)',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      <i
        className="ph-fill ph-paw-print"
        style={{
          position: 'absolute',
          right: '-5%',
          top: '-20%',
          fontSize: '15rem',
          color: 'rgba(249, 115, 22, 0.05)',
          transform: 'rotate(15deg)',
          pointerEvents: 'none'
        }}
      ></i>
      <div className="newsletter-content" style={{ position: 'relative', zIndex: 1 }}>
        <div className="newsletter-text">
          <h2 style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <i className="ph-fill ph-heart" style={{ color: 'var(--alert, #ef4444)' }}></i> Stay Updated on the Impact
          </h2>
          <p>Join 15,000+ supporters receiving weekly reports on rescue lives and funding allocations.</p>
        </div>
        <div style={{ flex: 1 }}>
          {!subscribed ? (
            <form
              onSubmit={handleSubmit}
              className="newsletter-form-large"
              style={{
                boxShadow: '0 10px 25px -5px rgba(0,0,0,0.05)',
                border: '1px solid rgba(255,255,255,0.8)',
                background: 'white',
                transition: 'all 0.3s ease'
              }}
            >
              <input
                type="email"
                placeholder="Enter your email"
                style={{ background: 'transparent' }}
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <button
                type="submit"
                className="btn-primary"
                style={{
                  backgroundColor: 'var(--primary, #f97316)',
                  color: 'white',
                  border: 'none',
                  cursor: 'pointer',
                  fontWeight: 700,
                  boxShadow: '0 4px 12px rgba(249, 115, 22, 0.3)',
                  transition: 'transform 0.2s, box-shadow 0.2s'
                }}
              >
                Subscribe
              </button>
            </form>
          ) : (
            <div className="success-message show">
              <i className="ph-bold ph-check-circle"></i> Thank you! You've been subscribed to our updates.
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

export default Newsletter;
