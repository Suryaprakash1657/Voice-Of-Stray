import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authStorage } from '../Auth/services/authStorage.js';
import './notifications.css';

const NOTIF_STORAGE_KEY = 'voiceOfStrayNotifications';

const defaultNotifications = [
  {
    id: 'notif-001',
    type: 'rescue',
    icon: 'ph-fill ph-first-aid',
    title: 'Rescue Accepted',
    message: 'Your rescue report #RSC-4902 has been accepted by a nearby NGO.',
    time: '2 hours ago',
    read: false,
    destinationUrl: '/rescue'
  },
  {
    id: 'notif-002',
    type: 'rescue',
    icon: 'ph-fill ph-ambulance',
    title: 'Rescue Team Assigned',
    message: 'A rescue team has been assigned to your reported case.',
    time: 'Yesterday',
    read: true,
    destinationUrl: '/rescue'
  },
  {
    id: 'notif-003',
    type: 'adoption',
    icon: 'ph-fill ph-file-text',
    title: 'Application Under Review',
    message: 'Your adoption request for Charlie is currently being reviewed.',
    time: '1 day ago',
    read: false,
    destinationUrl: '/adopt'
  },
  {
    id: 'notif-004',
    type: 'adoption',
    icon: 'ph-fill ph-calendar-check',
    title: 'Visit Confirmed',
    message: 'Your visit request for Charlie has been confirmed.',
    time: '3 days ago',
    read: true,
    destinationUrl: '/adopt'
  },
  {
    id: 'notif-005',
    type: 'volunteer',
    icon: 'ph-fill ph-hand-heart',
    title: 'Volunteer Opportunity',
    message: 'A new volunteer opportunity is available near your location.',
    time: '4 days ago',
    read: true,
    destinationUrl: '/volunteer'
  },
  {
    id: 'notif-006',
    type: 'community',
    icon: 'ph-fill ph-heart',
    title: 'Community Post Liked',
    message: 'Someone reacted to your community post.',
    time: '5 days ago',
    read: true,
    destinationUrl: '/community'
  },
  {
    id: 'notif-007',
    type: 'system',
    icon: 'ph-fill ph-party-horn',
    title: 'Welcome to Voice of Stray',
    message: 'Thank you for joining the Voice of Stray community.',
    time: '1 week ago',
    read: true,
    destinationUrl: '/'
  }
];

export function Notifications() {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [currentFilter, setCurrentFilter] = useState('all');
  const [toastMessage, setToastMessage] = useState('');
  const [showToast, setShowToast] = useState(false);

  const currentUser = authStorage.getCurrentUser();
  const role = localStorage.getItem('role') || currentUser?.role || 'user';
  const dashboardPath = role === 'ngo' ? '/ngo-dashboard' : '/user-dashboard';

  useEffect(() => {
    document.title = 'Notifications - Voice of Stray';

    if (!authStorage.isLoggedIn()) {
      navigate('/login');
      return;
    }

    const stored = localStorage.getItem(NOTIF_STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setNotifications(parsed);
        } else {
          setNotifications(defaultNotifications);
          localStorage.setItem(NOTIF_STORAGE_KEY, JSON.stringify(defaultNotifications));
        }
      } catch (e) {
        setNotifications(defaultNotifications);
        localStorage.setItem(NOTIF_STORAGE_KEY, JSON.stringify(defaultNotifications));
      }
    } else {
      setNotifications(defaultNotifications);
      localStorage.setItem(NOTIF_STORAGE_KEY, JSON.stringify(defaultNotifications));
    }
  }, []);

  const triggerToast = (msg) => {
    setToastMessage(msg);
    setShowToast(true);
    setTimeout(() => {
      setShowToast(false);
    }, 2000);
  };

  const saveNotifs = (updated) => {
    setNotifications(updated);
    localStorage.setItem(NOTIF_STORAGE_KEY, JSON.stringify(updated));
    window.dispatchEvent(new Event('storage'));
  };

  const handleNotifClick = (notif) => {
    const updated = notifications.map((n) =>
      n.id === notif.id ? { ...n, read: true, unread: false } : n
    );
    saveNotifs(updated);

    let destination = notif.destinationUrl || dashboardPath;
    if (destination.endsWith('.html')) {
      destination = destination.replace('.html', '');
      if (!destination.startsWith('/')) destination = '/' + destination;
    }

    triggerToast('Redirecting to source event details...');
    setTimeout(() => {
      navigate(destination);
    }, 600);
  };

  const markAllAsRead = () => {
    if (notifications.length === 0) return;
    const updated = notifications.map((n) => ({ ...n, read: true, unread: false }));
    saveNotifs(updated);
    triggerToast('All notifications marked as read!');
  };

  const clearReadNotifications = () => {
    const unreadOnly = notifications.filter((n) => !n.read && n.unread !== false);
    if (unreadOnly.length === notifications.length) {
      triggerToast('No read notifications to clear.');
      return;
    }
    saveNotifs(unreadOnly);
    triggerToast('Cleared all read notifications!');
  };

  const totalCount = notifications.length;
  const unreadCount = notifications.filter((n) => !n.read && n.unread !== false).length;

  const filteredNotifications = notifications.filter((n) => {
    if (currentFilter === 'all') return true;
    return n.type === currentFilter;
  });

  return (
    <div className="notif-page-wrapper">
      <main className="notif-container">
        {/* Back to Dashboard */}
        <div className="back-btn-container">
          <Link to={dashboardPath} className="back-link">
            <i className="ph ph-arrow-left"></i> Back to Dashboard
          </Link>
        </div>

        {/* Hero Header */}
        <section className="notif-hero">
          <div className="notif-hero-info">
            <h1>
              <i
                className="ph-fill ph-bell-ringing"
                style={{ color: 'var(--primary)', fontSize: '2.2rem', display: 'inline-block' }}
              ></i>
              Notifications
            </h1>
            <p>Stay updated on your rescue, adoption, volunteer, and community activities.</p>
          </div>
          <div className="notif-stats-display">
            <div className="notif-stats-col">
              <span id="unread-count" className="notif-stats-num unread">
                {unreadCount}
              </span>
              <span className="notif-stats-label">Unread</span>
            </div>
            <div className="notif-stats-divider"></div>
            <div className="notif-stats-col">
              <span id="total-count" className="notif-stats-num total">
                {totalCount}
              </span>
              <span className="notif-stats-label">Total</span>
            </div>
          </div>
        </section>

        {/* Controls Row */}
        <div className="controls-row">
          <div className="filter-tabs" id="filter-tabs-container">
            {['all', 'rescue', 'adoption', 'volunteer', 'community', 'system'].map((type) => (
              <button
                key={type}
                className={`tab ${currentFilter === type ? 'active' : ''}`}
                onClick={() => setCurrentFilter(type)}
              >
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </button>
            ))}
          </div>
          <div className="actions-group">
            <button
              className="btn-action-sm"
              onClick={markAllAsRead}
              title="Mark all notifications as read"
            >
              <i className="ph ph-check-square"></i> Mark All as Read
            </button>
            <button
              className="btn-action-sm"
              onClick={clearReadNotifications}
              title="Delete all read notifications"
            >
              <i className="ph ph-trash"></i> Clear Read
            </button>
          </div>
        </div>

        {/* Notification List or Empty State */}
        {notifications.length === 0 ? (
          <div className="notif-empty-state">
            <div className="empty-icon">🔔</div>
            <h3 className="empty-title">No notifications yet</h3>
            <p className="empty-desc">
              You'll see updates about rescues, adoptions, volunteering, and community activities here.
            </p>
            <Link
              to="/rescue"
              className="btn-premium primary"
              style={{ padding: '12px 28px', fontSize: '0.95rem', display: 'inline-flex', textDecoration: 'none' }}
            >
              Explore Rescue Cases
            </Link>
          </div>
        ) : filteredNotifications.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)', fontWeight: 500, width: '100%' }}>
            <i
              className="ph ph-folder-open"
              style={{ fontSize: '2.5rem', color: 'var(--primary)', opacity: 0.7, marginBottom: '8px', display: 'block' }}
            ></i>
            No alerts matching this category.
          </div>
        ) : (
          <div className="notification-list">
            {filteredNotifications.map((notif) => {
              const isUnread = !notif.read && notif.unread !== false;
              let typeColorClass = 'icon-system';
              if (notif.type === 'rescue') typeColorClass = 'icon-rescue';
              else if (notif.type === 'adoption') typeColorClass = 'icon-adoption';
              else if (notif.type === 'volunteer') typeColorClass = 'icon-volunteer';
              else if (notif.type === 'community') typeColorClass = 'icon-community';

              return (
                <div
                  key={notif.id}
                  className={`notification-card ${isUnread ? 'unread' : ''}`}
                  onClick={() => handleNotifClick(notif)}
                  title="Click to open details"
                >
                  <div className={`notification-icon-wrap ${typeColorClass}`}>
                    <i className={notif.icon || 'ph-fill ph-bell'}></i>
                  </div>
                  <div className="notification-content">
                    <div className="notification-top">
                      <span className={`type-badge ${notif.type || 'system'}`}>
                        {notif.type || 'System'}
                      </span>
                      <span className="time-text">{notif.time || 'Recent'}</span>
                    </div>
                    <h4 className="notification-title">{notif.title || 'Notification'}</h4>
                    <p className="notification-desc">{notif.message}</p>
                  </div>
                  <div className="unread-indicator">
                    {isUnread && <div className="unread-dot"></div>}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      {/* Toast Notification */}
      <div className={`toast-notification ${showToast ? 'show' : ''}`}>
        <i className="ph ph-check-circle"></i>
        <span>{toastMessage}</span>
      </div>
    </div>
  );
}

export default Notifications;
