import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

export default function NgoSidebar({
  incomingReportsCount = 0,
  activeCasesCount = 0,
  volunteerAppsCount = 0,
  pendingAdoptionsCount = 0,
  onScrollTo,
  stats,
  scrollToSection
}) {
  const navigate = useNavigate();
  const location = useLocation();
  const isDashboard = location.pathname === '/ngo-dashboard';

  const effectiveReports = stats?.incomingReportsCount ?? incomingReportsCount;
  const effectiveCases = stats?.activeCasesCount ?? activeCasesCount;
  const effectiveVolApps = stats?.volunteerAppsCount ?? stats?.volunteerApplicationsCount ?? volunteerAppsCount;
  const effectiveAdoptions = stats?.pendingAdoptionsCount ?? pendingAdoptionsCount;
  const scrollHandler = onScrollTo || scrollToSection;

  const handleNav = (sectionId, route) => {
    if (isDashboard && scrollHandler && sectionId) {
      scrollHandler(sectionId);
    } else if (route) {
      navigate(route);
    }
  };

  return (
    <aside className="ops-sidebar">
      <div className="sidebar-brand-section">
        <div className="sidebar-brand-icon">
          <i className="ph-fill ph-shield-heart"></i>
        </div>
        <div>
          <h3>Rescue Center</h3>
          <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>
            Ops Command
          </span>
        </div>
      </div>

      <div className="sidebar-menu">
        <div
          className={`sidebar-item ${location.pathname === '/ngo-dashboard' ? 'active' : ''}`}
          onClick={() => navigate('/ngo-dashboard')}
          style={{ cursor: 'pointer' }}
        >
          <span className="sidebar-item-left">
            <i className="ph ph-squares-four"></i>
            <span>Dashboard</span>
          </span>
        </div>

        <div
          className={`sidebar-item ${location.pathname === '/ngo-reports-manage' ? 'active' : ''}`}
          onClick={() => handleNav('incoming-reports-section', '/ngo-reports-manage')}
          style={{ cursor: 'pointer' }}
        >
          <span className="sidebar-item-left">
            <i className="ph ph-bell-ringing"></i>
            <span>Incoming Reports</span>
          </span>
          {effectiveReports > 0 && (
            <span className="sidebar-badge pulse-red" id="sidebar-reports-badge">
              {effectiveReports} New
            </span>
          )}
        </div>

        <div
          className={`sidebar-item ${location.pathname === '/ngo-rescue-manage' ? 'active' : ''}`}
          onClick={() => handleNav('active-cases-section', '/ngo-rescue-manage')}
          style={{ cursor: 'pointer' }}
        >
          <span className="sidebar-item-left">
            <i className="ph ph-ambulance"></i>
            <span>Active Cases</span>
          </span>
          {effectiveCases > 0 && (
            <span className="sidebar-badge count-green" id="sidebar-cases-badge">
              {effectiveCases}
            </span>
          )}
        </div>

        <div
          className={`sidebar-item ${location.pathname === '/ngo-volunteer-manage' ? 'active' : ''}`}
          id="sidebar-vol-apps"
          onClick={() => handleNav('volunteer-applications-section', '/ngo-volunteer-manage')}
          style={{ cursor: 'pointer' }}
        >
          <span className="sidebar-item-left">
            <i className="ph ph-hand-heart"></i>
            <span>Volunteer Management</span>
          </span>
          {effectiveVolApps > 0 && (
            <span
              id="vol-apps-badge"
              className="sidebar-badge count-green"
              style={{ background: '#e0f2fe', color: '#0284c7' }}
            >
              {effectiveVolApps}
            </span>
          )}
        </div>

        <div
          className={`sidebar-item ${location.pathname === '/ngo-adopt-manage' ? 'active' : ''}`}
          onClick={() => handleNav('pending-adoptions-section', '/ngo-adopt-manage')}
          style={{ cursor: 'pointer' }}
        >
          <span className="sidebar-item-left">
            <i className="ph ph-house-line"></i>
            <span>Adoption Requests</span>
          </span>
          {effectiveAdoptions > 0 && (
            <span
              className="sidebar-badge count-green"
              id="sidebar-adoption-count"
              style={{ background: '#fce7f3', color: '#db2777' }}
            >
              {effectiveAdoptions}
            </span>
          )}
        </div>

        <div
          className={`sidebar-item ${location.pathname === '/ngo-pet-manage' ? 'active' : ''}`}
          onClick={() => navigate('/ngo-pet-manage')}
          style={{ cursor: 'pointer' }}
        >
          <span className="sidebar-item-left">
            <i className="ph ph-note-pencil"></i>
            <span>Manage Pets (Builder)</span>
          </span>
          <span
            className="sidebar-badge"
            style={{ background: 'rgba(249, 115, 22, 0.1)', color: 'var(--primary)', fontWeight: 800 }}
          >
            Builder
          </span>
        </div>

        <div
          className={`sidebar-item ${location.pathname === '/ngo-donation-manage' ? 'active' : ''}`}
          onClick={() => handleNav('donations-overview-section', '/ngo-donation-manage')}
          style={{ cursor: 'pointer' }}
        >
          <span className="sidebar-item-left">
            <i className="ph ph-coins"></i>
            <span>Donations</span>
          </span>
        </div>

        <div
          className={`sidebar-item ${location.pathname === '/ngo-settings' ? 'active' : ''}`}
          onClick={() => navigate('/ngo-settings')}
          style={{ cursor: 'pointer' }}
        >
          <span className="sidebar-item-left">
            <i className="ph ph-gear"></i>
            <span>Settings</span>
          </span>
        </div>
      </div>
    </aside>
  );
}
