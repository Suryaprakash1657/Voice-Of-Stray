import React from 'react';
import DashboardEmptyState from './DashboardEmptyState.jsx';

export default function NotificationsSection({ notifications = [] }) {
  // Helper to safely render markdown bold syntax like **text** in notifications
  const formatNotifText = (text = '') => {
    if (!text) return '';
    const parts = text.split(/(\*\*.*?\*\*)/g);
    return parts.map((part, index) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={index}>{part.slice(2, -2)}</strong>;
      }
      return part;
    });
  };

  return (
    <section className="glass-card">
      <div style={{ padding: '20px 20px 0 20px' }}>
        <div className="section-header">
          <span className="section-title-wrap">
            <i className="ph-fill ph-bell"></i>
            <span>Notifications</span>
          </span>
        </div>
      </div>
      <div className="section-card-content" id="notifications-container">
        {notifications.length === 0 ? (
          <DashboardEmptyState
            icon="ph ph-bell"
            title="No notifications yet"
            description="Rescue updates and platform activity will appear here to keep you coordinated with street strays."
            iconStyle={{ background: 'rgba(0, 0, 0, 0.04)', color: 'var(--text-muted)' }}
          />
        ) : (
          <div className="notif-list">
            {notifications.map((notif, idx) => (
              <div
                key={notif.id || idx}
                className={`notif-item ${notif.unread ? 'unread' : ''}`}
              >
                <i className={notif.icon || 'ph-fill ph-bell'}></i>
                <div>
                  <span>{formatNotifText(notif.message)}</span>
                  <div style={{ fontSize: '0.7rem', opacity: 0.7, marginTop: '4px' }}>
                    {notif.time || 'Just now'}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
