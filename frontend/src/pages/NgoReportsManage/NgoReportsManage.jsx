import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useNgoDashboard } from '../NgoDashboard/hooks/useNgoDashboard.js';
import NgoSidebar from '../NgoDashboard/components/NgoSidebar.jsx';
import './ngo-reports-manage.css';

export function NgoReportsManage() {
  const navigate = useNavigate();
  const {
    ngoUser,
    stats,
    incomingReports,
    handleAcceptReport
  } = useNgoDashboard();

  const [searchTerm, setSearchTerm] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('all');

  useEffect(() => {
    document.title = 'Incoming Reports Management - Voice of Stray';
  }, []);

  const filteredReports = incomingReports.filter((r) => {
    const matchesSearch =
      !searchTerm ||
      (r.animalType || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (r.location || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (r.breed || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (r.id || '').includes(searchTerm);

    const matchesPriority =
      priorityFilter === 'all' ||
      (priorityFilter === 'emergency' && r.priority === 'Emergency') ||
      (priorityFilter === 'high' && (r.priority === 'High Priority' || r.priority === 'High')) ||
      (priorityFilter === 'moderate' && (r.priority === 'Moderate' || r.priority === 'Normal'));

    return matchesSearch && matchesPriority;
  });

  const emergencyCount = incomingReports.filter((r) => r.priority === 'Emergency').length;
  const highCount = incomingReports.filter((r) => r.priority === 'High Priority' || r.priority === 'High').length;

  return (
    <div className="ngo-reports-page-wrapper">
      <div className="ops-container">
        {/* Sidebar */}
        <NgoSidebar ngoUser={ngoUser} stats={stats} />

        {/* Main Panel */}
        <main className="ops-main-panel">
          {/* Header Title */}
          <div>
            <h1 style={{ fontSize: '1.9rem', fontWeight: 900, color: '#0f172a', margin: '0 0 6px 0' }}>
              Incoming Stray Reports
            </h1>
            <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.95rem', fontWeight: 500 }}>
              Live intake pipeline of distress reports submitted by community members in your jurisdiction.
            </p>
          </div>

          {/* Metrics Grid */}
          <div className="metrics-grid">
            <div className="glass-card metric-card">
              <div className="metric-header">
                <span className="metric-title">Total Reports</span>
                <div className="metric-icon-bg" style={{ background: '#fee2e2', color: '#ef4444' }}>
                  <i className="ph-fill ph-bell-ringing"></i>
                </div>
              </div>
              <div className="metric-value">{incomingReports.length}</div>
              <span className="metric-subtext">Awaiting NGO action</span>
            </div>

            <div className="glass-card metric-card">
              <div className="metric-header">
                <span className="metric-title">Emergency Severity</span>
                <div className="metric-icon-bg" style={{ background: '#fee2e2', color: '#ef4444' }}>
                  <i className="ph-fill ph-siren"></i>
                </div>
              </div>
              <div className="metric-value" style={{ color: '#ef4444' }}>{emergencyCount}</div>
              <span className="metric-subtext">Requires immediate pickup</span>
            </div>

            <div className="glass-card metric-card">
              <div className="metric-header">
                <span className="metric-title">High Priority</span>
                <div className="metric-icon-bg" style={{ background: '#ffedd5', color: '#f97316' }}>
                  <i className="ph-fill ph-warning"></i>
                </div>
              </div>
              <div className="metric-value" style={{ color: '#f97316' }}>{highCount}</div>
              <span className="metric-subtext">Needs same-day response</span>
            </div>

            <div className="glass-card metric-card">
              <div className="metric-header">
                <span className="metric-title">Avg Response</span>
                <div className="metric-icon-bg" style={{ background: '#dcfce7', color: '#15803d' }}>
                  <i className="ph-fill ph-clock"></i>
                </div>
              </div>
              <div className="metric-value">12m</div>
              <span className="metric-subtext">Dispatch initiation</span>
            </div>
          </div>

          {/* Reports Table / Card List */}
          <section className="glass-card">
            <div className="filter-bar">
              <div className="search-input-wrap">
                <i className="ph ph-magnifying-glass"></i>
                <input
                  type="text"
                  className="input-glass"
                  placeholder="Search by animal, location, ID..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              <div className="filter-pills">
                <button
                  type="button"
                  className={`filter-pill ${priorityFilter === 'all' ? 'active' : ''}`}
                  onClick={() => setPriorityFilter('all')}
                >
                  All ({incomingReports.length})
                </button>
                <button
                  type="button"
                  className={`filter-pill ${priorityFilter === 'emergency' ? 'active' : ''}`}
                  onClick={() => setPriorityFilter('emergency')}
                >
                  Emergency ({emergencyCount})
                </button>
                <button
                  type="button"
                  className={`filter-pill ${priorityFilter === 'high' ? 'active' : ''}`}
                  onClick={() => setPriorityFilter('high')}
                >
                  High Priority ({highCount})
                </button>
                <button
                  type="button"
                  className={`filter-pill ${priorityFilter === 'moderate' ? 'active' : ''}`}
                  onClick={() => setPriorityFilter('moderate')}
                >
                  Moderate
                </button>
              </div>
            </div>

            {filteredReports.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '64px 20px', color: 'var(--text-muted)' }}>
                <i className="ph ph-shield-check" style={{ fontSize: '3rem', color: '#10b981', display: 'block', marginBottom: '12px' }}></i>
                <h3 style={{ margin: '0 0 6px 0', color: '#0f172a' }}>No reports matching your criteria</h3>
                <p style={{ margin: 0 }}>All incoming reports are handled or check back shortly for live submissions.</p>
              </div>
            ) : (
              <div className="reports-list-grid">
                {filteredReports.map((r) => {
                  const breed = r.breed || r.breedDesc || 'Other / Unknown';
                  const priorityClass =
                    r.priority === 'Emergency' ? 'badge-emergency' : r.priority === 'High Priority' || r.priority === 'High' ? 'badge-high' : 'badge-moderate';

                  return (
                    <div key={r.id} className="report-item-card">
                      <div className="report-item-media">
                        <img
                          src={r.photo || 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&q=80&w=400'}
                          alt={r.animalType}
                        />
                        <span className={`report-item-badge ${priorityClass}`}>
                          {r.priority || 'Normal'}
                        </span>
                      </div>
                      <div className="report-item-body">
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <span style={{ fontSize: '0.72rem', fontWeight: 800, color: 'var(--primary)' }}>#RSC-{r.id}</span>
                          <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{r.timeSubmitted || 'Just now'}</span>
                        </div>
                        <h4 className="report-item-title">{r.animalType} ({breed})</h4>
                        <div className="report-item-meta">
                          <span><i className="ph-fill ph-map-pin" style={{ color: 'var(--primary)', marginRight: '4px' }}></i> {r.location}</span>
                          <span><i className="ph-fill ph-user" style={{ color: 'var(--text-muted)', marginRight: '4px' }}></i> Reporter: {r.reporterName || 'Citizen'}</span>
                          <span style={{ color: '#475569', marginTop: '4px' }}>
                            <strong>Condition:</strong> {r.observedCondition || r.description || 'Distress observed'}
                          </span>
                        </div>
                        <div className="report-item-actions">
                          <button
                            type="button"
                            className="btn-inc-primary"
                            style={{ flex: 1 }}
                            onClick={() => handleAcceptReport(r.id)}
                          >
                            Accept Case
                          </button>
                          <Link
                            to={`/ngo-report-review?id=${r.id}`}
                            className="btn-inc-sec"
                            style={{ flex: 1, textDecoration: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                          >
                            View Details
                          </Link>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </section>
        </main>
      </div>
    </div>
  );
}

export default NgoReportsManage;
