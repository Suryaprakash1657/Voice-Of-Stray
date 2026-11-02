import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../../../../components/ui/Card.jsx';

export default function AlertsWidget() {
  const navigate = useNavigate();
  const [demoModalAlert, setDemoModalAlert] = useState(null);

  // Connect alerts to verified existing rescue cases
  const alerts = [
    {
      id: 1,
      caseId: '4888',
      title: 'Bleeding dog reported',
      meta: '0.5 miles away • 10 mins ago',
      isLive: true
    },
    {
      id: 2,
      caseId: '4902',
      title: 'Injured puppy spotted',
      meta: '1.2 miles away • 25 mins ago',
      isLive: true
    },
    {
      id: 3,
      caseId: null,
      title: 'Puppies in cardboard box',
      meta: '2.0 miles away • 1 hour ago',
      isLive: false
    }
  ];

  const handleHelpNow = (item) => {
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';

    if (item.caseId) {
      if (!isLoggedIn) {
        navigate(`/login?redirect=${encodeURIComponent(`/rescue?id=${item.caseId}`)}`);
        return;
      }
      navigate(`/rescue?id=${item.caseId}`);
    } else {
      // Demonstration alert - handle gracefully without fabricating a case
      setDemoModalAlert(item);
    }
  };

  return (
    <>
      <Card className="alert-widget">
        <h3>
          <i className="ph-fill ph-warning-circle"></i> Nearby Alerts
        </h3>
        <div className="widget-scroll-container">
          {alerts.map((item) => (
            <div key={item.id} className="alert-item">
              <div className="alert-item-content">
                <div className="alert-icon">
                  <i className="ph ph-siren"></i>
                </div>
                <div className="alert-info">
                  <strong>{item.title}</strong>
                  <span>{item.meta}</span>
                </div>
              </div>
              <button
                type="button"
                className="alert-cta"
                onClick={() => handleHelpNow(item)}
                title={item.caseId ? 'Assist with this rescue case' : 'View alert details'}
              >
                Help Now
              </button>
            </div>
          ))}
          <div className="widget-scroll-indicator">
            <i className="ph ph-caret-down"></i>
          </div>
        </div>
      </Card>

      {/* Demo Alert Information Modal */}
      {demoModalAlert && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
            padding: '16px'
          }}
          onClick={() => setDemoModalAlert(null)}
        >
          <div
            className="card"
            style={{
              maxWidth: '460px',
              width: '100%',
              padding: '28px',
              position: 'relative',
              background: 'white',
              borderRadius: '16px',
              boxShadow: 'var(--shadow-xl, 0 20px 25px -5px rgba(0,0,0,0.1))'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
              <div
                style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: '50%',
                  background: '#fef3c7',
                  color: '#d97706',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.4rem'
                }}
              >
                <i className="ph-fill ph-info"></i>
              </div>
              <div>
                <h4 style={{ margin: 0, fontSize: '1.15rem', color: 'var(--text-main)' }}>
                  Demonstration Alert
                </h4>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                  Sample Community Notification
                </span>
              </div>
            </div>

            <p style={{ fontSize: '0.95rem', color: 'var(--text-muted)', lineHeight: 1.6, margin: '0 0 20px 0' }}>
              <strong>&ldquo;{demoModalAlert.title}&rdquo;</strong> is a simulated demonstration alert to showcase how real-time emergency notifications are broadcast to nearby rescuers. No live rescue operation is attached to this card.
            </p>

            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
              <button
                type="button"
                className="btn-text"
                style={{ padding: '8px 16px', borderRadius: '8px', cursor: 'pointer', border: 'none', background: 'none', color: 'var(--text-muted)' }}
                onClick={() => setDemoModalAlert(null)}
              >
                Dismiss
              </button>
              <button
                type="button"
                className="btn-primary"
                style={{
                  padding: '10px 20px',
                  borderRadius: '8px',
                  background: 'var(--primary, #f97316)',
                  color: 'white',
                  border: 'none',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
                onClick={() => {
                  setDemoModalAlert(null);
                  navigate('/rescue?id=4902');
                }}
              >
                View Live Cases
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
