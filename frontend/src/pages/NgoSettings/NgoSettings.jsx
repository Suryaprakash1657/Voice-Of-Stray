import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authStorage } from '../Auth/services/authStorage.js';
import './ngo-settings.css';

export function NgoSettings() {
  const navigate = useNavigate();

  const [settings, setSettings] = useState({
    operatingRadius: '15km',
    autoDispatch: true,
    smsAlerts: true,
    pushNotifications: true,
    requireVolunteerApproval: true,
    allowSelfAssignment: false,
    maxActiveMissions: '3',
    maxShelterCapacity: 25,
    acceptDirectSurrenders: true,
    publicVisibility: true,
    twoFactorAuth: false
  });

  const [passwordState, setPasswordState] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [toastMessage, setToastMessage] = useState('');
  const [showToast, setShowToast] = useState(false);

  useEffect(() => {
    document.title = 'NGO Settings - Voice of Stray';

    const isLoggedIn = authStorage.isLoggedIn();
    if (!isLoggedIn) {
      navigate('/login');
      return;
    }

    const currentUser = authStorage.getCurrentUser();
    if (currentUser?.role !== 'ngo') {
      navigate('/user-dashboard');
      return;
    }

    const raw = localStorage.getItem('voiceOfStrayNgoSettings');
    if (raw) {
      try {
        const parsed = JSON.parse(raw);
        setSettings((prev) => ({ ...prev, ...parsed }));
      } catch (e) {}
    }
  }, []);

  const triggerToast = (msg) => {
    setToastMessage(msg);
    setShowToast(true);
    setTimeout(() => {
      setShowToast(false);
    }, 2000);
  };

  const handleToggle = (key) => {
    setSettings((prev) => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const handleSelectChange = (key, value) => {
    setSettings((prev) => ({
      ...prev,
      [key]: value
    }));
  };

  const handleSaveSettings = (e) => {
    e.preventDefault();
    localStorage.setItem('voiceOfStrayNgoSettings', JSON.stringify(settings));
    triggerToast('Settings updated successfully!');
  };

  const handlePasswordChange = (e) => {
    e.preventDefault();
    if (passwordState.newPassword !== passwordState.confirmPassword) {
      triggerToast('New passwords do not match!');
      return;
    }
    if (passwordState.newPassword.length < 6) {
      triggerToast('Password must be at least 6 characters!');
      return;
    }
    setPasswordState({ currentPassword: '', newPassword: '', confirmPassword: '' });
    triggerToast('Password changed successfully!');
  };

  const handleResetSandbox = () => {
    if (window.confirm('Are you sure you want to reset your NGO testing sandbox data?')) {
      localStorage.removeItem('voiceOfStrayCases');
      localStorage.removeItem('voiceOfStrayReports');
      window.dispatchEvent(new Event('storage'));
      triggerToast('NGO sandbox cases reset.');
    }
  };

  return (
    <div className="ngo-settings-page-wrapper">
      <main className="ngo-settings-container">
        {/* Left Column: Settings Cards */}
        <div>
          <div className="back-btn-container">
            <Link to="/ngo-dashboard" className="back-link">
              <i className="ph ph-arrow-left"></i> Back to NGO Dashboard
            </Link>
          </div>

          <section className="ngo-settings-hero">
            <div className="ngo-settings-hero-info">
              <h1>NGO Operations Settings</h1>
              <p>Configure emergency dispatch rules, volunteer assignment policies, and security.</p>
            </div>
          </section>

          <form onSubmit={handleSaveSettings}>
            {/* 1. Emergency Dispatch Alerts */}
            <section className="ngo-settings-card">
              <h3 className="card-title">
                <i className="ph-fill ph-siren"></i> Emergency Dispatch & Alert Settings
              </h3>
              <div className="toggles-list">
                <div className="toggle-row">
                  <div className="toggle-label-wrap">
                    <h4>Operating Emergency Radius</h4>
                    <p>Receive live rescue alerts from users reporting incidents within this perimeter.</p>
                  </div>
                  <select
                    className="input-glass"
                    style={{ width: '120px' }}
                    value={settings.operatingRadius}
                    onChange={(e) => handleSelectChange('operatingRadius', e.target.value)}
                  >
                    <option value="5km">5 km</option>
                    <option value="10km">10 km</option>
                    <option value="15km">15 km</option>
                    <option value="25km">25 km</option>
                    <option value="50km">50 km</option>
                  </select>
                </div>

                <div className="toggle-row">
                  <div className="toggle-label-wrap">
                    <h4>Automatic Live Alert Broadcast</h4>
                    <p>Instantly alert on-duty volunteers when a high-priority report is accepted.</p>
                  </div>
                  <div className="switch-wrap">
                    <span className="switch-state-text">{settings.autoDispatch ? 'ON' : 'OFF'}</span>
                    <label className="switch">
                      <input
                        type="checkbox"
                        checked={settings.autoDispatch}
                        onChange={() => handleToggle('autoDispatch')}
                      />
                      <span className="slider"></span>
                    </label>
                  </div>
                </div>

                <div className="toggle-row">
                  <div className="toggle-label-wrap">
                    <h4>SMS Emergency Alerts</h4>
                    <p>Send high-priority SMS notifications for urgent medical rescues.</p>
                  </div>
                  <div className="switch-wrap">
                    <span className="switch-state-text">{settings.smsAlerts ? 'ON' : 'OFF'}</span>
                    <label className="switch">
                      <input
                        type="checkbox"
                        checked={settings.smsAlerts}
                        onChange={() => handleToggle('smsAlerts')}
                      />
                      <span className="slider"></span>
                    </label>
                  </div>
                </div>

                <div className="toggle-row">
                  <div className="toggle-label-wrap">
                    <h4>Browser Push Notifications</h4>
                    <p>Display real-time desktop badges and notifications for incoming stray reports.</p>
                  </div>
                  <div className="switch-wrap">
                    <span className="switch-state-text">{settings.pushNotifications ? 'ON' : 'OFF'}</span>
                    <label className="switch">
                      <input
                        type="checkbox"
                        checked={settings.pushNotifications}
                        onChange={() => handleToggle('pushNotifications')}
                      />
                      <span className="slider"></span>
                    </label>
                  </div>
                </div>
              </div>
            </section>

            {/* 2. Volunteer Policies */}
            <section className="ngo-settings-card">
              <h3 className="card-title">
                <i className="ph-fill ph-hand-heart"></i> Volunteer Coordination Policies
              </h3>
              <div className="toggles-list">
                <div className="toggle-row">
                  <div className="toggle-label-wrap">
                    <h4>Require Admin Approval for Volunteers</h4>
                    <p>Every applicant must be approved by shelter admin before joining rescue runs.</p>
                  </div>
                  <div className="switch-wrap">
                    <span className="switch-state-text">{settings.requireVolunteerApproval ? 'ON' : 'OFF'}</span>
                    <label className="switch">
                      <input
                        type="checkbox"
                        checked={settings.requireVolunteerApproval}
                        onChange={() => handleToggle('requireVolunteerApproval')}
                      />
                      <span className="slider"></span>
                    </label>
                  </div>
                </div>

                <div className="toggle-row">
                  <div className="toggle-label-wrap">
                    <h4>Allow Volunteer Self-Assignment</h4>
                    <p>Permit approved volunteers to claim open rescue cases without manual assignment.</p>
                  </div>
                  <div className="switch-wrap">
                    <span className="switch-state-text">{settings.allowSelfAssignment ? 'ON' : 'OFF'}</span>
                    <label className="switch">
                      <input
                        type="checkbox"
                        checked={settings.allowSelfAssignment}
                        onChange={() => handleToggle('allowSelfAssignment')}
                      />
                      <span className="slider"></span>
                    </label>
                  </div>
                </div>

                <div className="toggle-row">
                  <div className="toggle-label-wrap">
                    <h4>Max Concurrent Active Missions Per Volunteer</h4>
                    <p>Limits number of ongoing cases one volunteer can simultaneously accept.</p>
                  </div>
                  <select
                    className="input-glass"
                    style={{ width: '120px' }}
                    value={settings.maxActiveMissions}
                    onChange={(e) => handleSelectChange('maxActiveMissions', e.target.value)}
                  >
                    <option value="1">1 Case</option>
                    <option value="2">2 Cases</option>
                    <option value="3">3 Cases</option>
                    <option value="5">5 Cases</option>
                  </select>
                </div>
              </div>
            </section>

            {/* 3. Shelter Capacity & Intake */}
            <section className="ngo-settings-card">
              <h3 className="card-title">
                <i className="ph-fill ph-house-line"></i> Shelter Capacity & Intake
              </h3>
              <div className="toggles-list">
                <div className="toggle-row">
                  <div className="toggle-label-wrap">
                    <h4>Max Shelter Animal Housing Capacity</h4>
                    <p>Alerts operations hub when in-care animal listings approach maximum capacity.</p>
                  </div>
                  <input
                    type="number"
                    className="input-glass"
                    style={{ width: '120px' }}
                    value={settings.maxShelterCapacity}
                    onChange={(e) => handleSelectChange('maxShelterCapacity', Number(e.target.value))}
                  />
                </div>

                <div className="toggle-row">
                  <div className="toggle-label-wrap">
                    <h4>Public Adoption Directory Visibility</h4>
                    <p>Showcase verified adoptable pets on the public Voice of Stray pet listing feed.</p>
                  </div>
                  <div className="switch-wrap">
                    <span className="switch-state-text">{settings.publicVisibility ? 'ON' : 'OFF'}</span>
                    <label className="switch">
                      <input
                        type="checkbox"
                        checked={settings.publicVisibility}
                        onChange={() => handleToggle('publicVisibility')}
                      />
                      <span className="slider"></span>
                    </label>
                  </div>
                </div>
              </div>
            </section>

            <div className="actions-bar" style={{ justifyContent: 'flex-end', marginBottom: '32px' }}>
              <button type="submit" className="btn-action save">
                Save Operations Settings
              </button>
            </div>
          </form>

          {/* 4. Password & Security */}
          <section className="ngo-settings-card">
            <h3 className="card-title">
              <i className="ph-fill ph-lock-key"></i> Security & Password
            </h3>
            <form onSubmit={handlePasswordChange}>
              <div className="form-grid">
                <div className="form-group span-2">
                  <label>Current Password</label>
                  <input
                    type="password"
                    className="input-glass"
                    value={passwordState.currentPassword}
                    onChange={(e) => setPasswordState({ ...passwordState, currentPassword: e.target.value })}
                    placeholder="Enter current password"
                    required
                  />
                </div>
                <div className="form-group">
                  <label>New Password</label>
                  <input
                    type="password"
                    className="input-glass"
                    value={passwordState.newPassword}
                    onChange={(e) => setPasswordState({ ...passwordState, newPassword: e.target.value })}
                    placeholder="At least 6 characters"
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Confirm New Password</label>
                  <input
                    type="password"
                    className="input-glass"
                    value={passwordState.confirmPassword}
                    onChange={(e) => setPasswordState({ ...passwordState, confirmPassword: e.target.value })}
                    placeholder="Confirm new password"
                    required
                  />
                </div>
              </div>
              <div style={{ marginTop: '16px', display: 'flex', justifyContent: 'flex-end' }}>
                <button type="submit" className="btn-action save" style={{ padding: '10px 22px', fontSize: '0.9rem' }}>
                  Update Password
                </button>
              </div>
            </form>
          </section>

          {/* 5. Danger Zone */}
          <section className="ngo-settings-card danger-card">
            <h3 className="card-title danger-title">
              <i className="ph-fill ph-warning"></i> Danger Zone
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <h4 style={{ margin: '0 0 4px 0', color: '#0f172a' }}>Reset Sandbox Test Data</h4>
                  <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                    Clears local testing reports and cases back to seed defaults.
                  </p>
                </div>
                <button type="button" className="btn-danger-outline" onClick={handleResetSandbox}>
                  <i className="ph ph-arrow-counter-clockwise"></i> Reset Sandbox
                </button>
              </div>
            </div>
          </section>
        </div>

        {/* Right Column: Information Overview */}
        <aside className="preview-column">
          <div className="sticky-card">
            <h4 style={{ margin: '0 0 16px 0', fontSize: '1.1rem', fontWeight: 800, color: '#0f172a' }}>
              <i className="ph-fill ph-shield-check" style={{ color: 'var(--primary)', marginRight: '6px' }}></i>
              NGO System Status
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '0.9rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px dashed var(--border)' }}>
                <span style={{ color: 'var(--text-muted)', fontWeight: 600 }}>Account State:</span>
                <span style={{ fontWeight: 800, color: '#15803d' }}>Verified Active</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px dashed var(--border)' }}>
                <span style={{ color: 'var(--text-muted)', fontWeight: 600 }}>Operating Radius:</span>
                <span style={{ fontWeight: 700 }}>{settings.operatingRadius}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px dashed var(--border)' }}>
                <span style={{ color: 'var(--text-muted)', fontWeight: 600 }}>Auto Dispatch:</span>
                <span style={{ fontWeight: 700 }}>{settings.autoDispatch ? 'Enabled' : 'Disabled'}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px dashed var(--border)' }}>
                <span style={{ color: 'var(--text-muted)', fontWeight: 600 }}>Shelter Capacity:</span>
                <span style={{ fontWeight: 700 }}>{settings.maxShelterCapacity} Rescues</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0' }}>
                <span style={{ color: 'var(--text-muted)', fontWeight: 600 }}>Directory Listing:</span>
                <span style={{ fontWeight: 700, color: settings.publicVisibility ? '#15803d' : '#ef4444' }}>
                  {settings.publicVisibility ? 'Public' : 'Hidden'}
                </span>
              </div>
            </div>
          </div>
        </aside>
      </main>

      {/* Toast */}
      <div className={`editor-notification ${showToast ? 'show' : ''}`}>
        <i className="ph ph-check-circle"></i>
        <span>{toastMessage}</span>
      </div>
    </div>
  );
}

export default NgoSettings;
