import React, { useState, useEffect } from 'react';
import { useNgoDashboard } from '../NgoDashboard/hooks/useNgoDashboard.js';
import NgoSidebar from '../NgoDashboard/components/NgoSidebar.jsx';
import './ngo-donation-manage.css';

export function NgoDonationManage() {
  const { ngoUser, stats } = useNgoDashboard();

  const [donations, setDonations] = useState([]);
  const [filterPurpose, setFilterPurpose] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  // New offline donation form state
  const [donorName, setDonorName] = useState('');
  const [amount, setAmount] = useState('');
  const [purpose, setPurpose] = useState('General Fund');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [alertSuccess, setAlertSuccess] = useState(null);

  useEffect(() => {
    document.title = 'Donation & Fund Management - Voice of Stray';
    loadDonations();
  }, []);

  const loadDonations = () => {
    try {
      const stored = JSON.parse(localStorage.getItem('voiceOfStrayDonations') || '[]');
      if (stored.length === 0) {
        const seedDonations = [
          {
            id: 'DON-1001',
            donorName: 'Rahul Verma',
            amount: 2500,
            purpose: 'Emergency Rescue Fund',
            date: '2026-06-12',
            donationType: 'One-time',
            status: 'Completed'
          },
          {
            id: 'DON-1002',
            donorName: 'Ananya Deshmukh',
            amount: 5000,
            purpose: 'General Fund',
            date: '2026-06-10',
            donationType: 'Monthly',
            status: 'Completed'
          },
          {
            id: 'DON-1003',
            donorName: 'Vikram Mehta',
            amount: 1500,
            purpose: 'Medical Supplies',
            date: '2026-06-08',
            donationType: 'One-time',
            status: 'Completed'
          },
          {
            id: 'DON-1004',
            donorName: 'Anonymous Donor',
            amount: 10000,
            purpose: 'Emergency Rescue Fund',
            date: '2026-06-05',
            donationType: 'One-time',
            status: 'Completed'
          }
        ];
        localStorage.setItem('voiceOfStrayDonations', JSON.stringify(seedDonations));
        setDonations(seedDonations);
      } else {
        setDonations(stored);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleRecordSubmit = (e) => {
    e.preventDefault();
    const numAmount = Number(amount);
    if (!donorName.trim() || !numAmount || numAmount <= 0) {
      return;
    }

    const newDonation = {
      id: `DON-${Math.floor(100000 + Math.random() * 900000)}`,
      donorName: donorName.trim(),
      amount: numAmount,
      purpose,
      date,
      donationType: 'Offline Direct',
      status: 'Completed'
    };

    const updated = [newDonation, ...donations];
    setDonations(updated);
    localStorage.setItem('voiceOfStrayDonations', JSON.stringify(updated));
    window.dispatchEvent(new Event('storage'));

    setDonorName('');
    setAmount('');
    setPurpose('General Fund');
    setAlertSuccess(`Successfully logged donation of ₹${numAmount.toLocaleString('en-IN')} from ${newDonation.donorName}!`);
    setTimeout(() => {
      setAlertSuccess(null);
    }, 4000);
  };

  // Calculations
  const totalRaised = donations.reduce((sum, d) => sum + (Number(d.amount) || 0), 0);
  const emergencyFunds = donations
    .filter((d) => {
      const p = (d.purpose || d.campaign || '').toLowerCase();
      return p.includes('emergency') || p.includes('medical fund');
    })
    .reduce((sum, d) => sum + (Number(d.amount) || 0), 0);
  const generalFunds = donations
    .filter((d) => {
      const p = (d.purpose || d.campaign || '').toLowerCase();
      return p.includes('general');
    })
    .reduce((sum, d) => sum + (Number(d.amount) || 0), 0);

  const monthlyTarget = 100000;
  const targetPercent = Math.min(100, Math.round((totalRaised / monthlyTarget) * 100));

  const filteredDonations = donations.filter((d) => {
    const dPurpose = d.purpose || d.campaign || 'General Fund';
    const matchesPurpose = filterPurpose === 'all' || dPurpose.toLowerCase() === filterPurpose.toLowerCase();
    const matchesSearch =
      !searchTerm ||
      (d.donorName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (d.id || '').toLowerCase().includes(searchTerm.toLowerCase());
    return matchesPurpose && matchesSearch;
  });

  return (
    <div className="ngo-reports-page-wrapper">
      <div className="ops-container">
        {/* Sidebar */}
        <NgoSidebar ngoUser={ngoUser} stats={stats} />

        {/* Main Panel */}
        <main className="ops-main-panel">
          <div>
            <h1 style={{ fontSize: '1.9rem', fontWeight: 900, color: '#0f172a', margin: '0 0 6px 0' }}>
              Donation & Fund Management
            </h1>
            <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.95rem', fontWeight: 500 }}>
              Track supporter contributions, monitor emergency medical funds, and record direct offline donations.
            </p>
          </div>

          {alertSuccess && (
            <div
              style={{
                background: '#dcfce7',
                border: '1px solid #86efac',
                color: '#15803d',
                padding: '12px 18px',
                borderRadius: '12px',
                fontWeight: 700,
                fontSize: '0.95rem',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              <i className="ph-fill ph-check-circle" style={{ fontSize: '1.25rem' }}></i>
              {alertSuccess}
            </div>
          )}

          {/* Metrics Grid */}
          <div className="metrics-grid">
            <div className="glass-card metric-card">
              <div className="metric-header">
                <span className="metric-title">Total Funds Raised</span>
                <div className="metric-icon-bg" style={{ background: '#dcfce7', color: '#15803d' }}>
                  <i className="ph-fill ph-currency-inr"></i>
                </div>
              </div>
              <div className="metric-value" style={{ color: '#15803d' }}>
                ₹{totalRaised.toLocaleString('en-IN')}
              </div>
              <span className="metric-subtext">Across all campaigns</span>
            </div>

            <div className="glass-card metric-card">
              <div className="metric-header">
                <span className="metric-title">Emergency Rescue</span>
                <div className="metric-icon-bg" style={{ background: '#fee2e2', color: '#ef4444' }}>
                  <i className="ph-fill ph-first-aid"></i>
                </div>
              </div>
              <div className="metric-value" style={{ color: '#ef4444' }}>
                ₹{emergencyFunds.toLocaleString('en-IN')}
              </div>
              <span className="metric-subtext">Critical trauma care</span>
            </div>

            <div className="glass-card metric-card">
              <div className="metric-header">
                <span className="metric-title">General Stray Care</span>
                <div className="metric-icon-bg" style={{ background: '#eff6ff', color: '#2563eb' }}>
                  <i className="ph-fill ph-bowl-food"></i>
                </div>
              </div>
              <div className="metric-value" style={{ color: '#2563eb' }}>
                ₹{generalFunds.toLocaleString('en-IN')}
              </div>
              <span className="metric-subtext">Food & shelter maintenance</span>
            </div>

            <div className="glass-card metric-card">
              <div className="metric-header">
                <span className="metric-title">Monthly Goal</span>
                <div className="metric-icon-bg" style={{ background: '#faf5ff', color: '#7c3aed' }}>
                  <i className="ph-fill ph-target"></i>
                </div>
              </div>
              <div className="metric-value" style={{ color: '#7c3aed' }}>
                {targetPercent}%
              </div>
              <div className="progress-bar-bg">
                <div className="progress-bar-fill" style={{ width: `${targetPercent}%` }}></div>
              </div>
            </div>
          </div>

          {/* Content Split: Form & Ledger */}
          <div style={{ display: 'grid', gridTemplateColumns: '1.8fr 1fr', gap: '24px' }}>
            {/* Ledger Section */}
            <section className="glass-card" style={{ padding: '24px' }}>
              <div className="filter-bar" style={{ padding: 0, marginBottom: '20px' }}>
                <div className="search-input-wrap">
                  <i className="ph ph-magnifying-glass"></i>
                  <input
                    type="text"
                    className="input-glass"
                    placeholder="Search by donor name or ID..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <div className="filter-pills">
                  <button
                    type="button"
                    className={`filter-pill ${filterPurpose === 'all' ? 'active' : ''}`}
                    onClick={() => setFilterPurpose('all')}
                  >
                    All ({donations.length})
                  </button>
                  <button
                    type="button"
                    className={`filter-pill ${filterPurpose === 'emergency rescue fund' ? 'active' : ''}`}
                    onClick={() => setFilterPurpose('emergency rescue fund')}
                  >
                    Emergency
                  </button>
                  <button
                    type="button"
                    className={`filter-pill ${filterPurpose === 'general fund' ? 'active' : ''}`}
                    onClick={() => setFilterPurpose('general fund')}
                  >
                    General
                  </button>
                </div>
              </div>

              <div style={{ overflowX: 'auto' }}>
                <table className="donations-table">
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Donor</th>
                      <th>Amount</th>
                      <th>Purpose</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredDonations.length === 0 ? (
                      <tr>
                        <td colSpan="4" style={{ textAlign: 'center', padding: '32px', color: 'var(--text-muted)' }}>
                          No donations match the current filter.
                        </td>
                      </tr>
                    ) : (
                      filteredDonations.map((d) => (
                        <tr key={d.id}>
                          <td style={{ fontWeight: 700, color: '#64748b' }}>{d.date}</td>
                          <td style={{ fontWeight: 800, color: '#0f172a' }}>{d.donorName || d.donor || 'Supporter'}</td>
                          <td style={{ fontWeight: 900, color: '#15803d' }}>₹{Number(d.amount).toLocaleString('en-IN')}</td>
                          <td>
                            <span className="status-badge review" style={{ fontSize: '0.75rem' }}>
                              {d.purpose || d.campaign || 'General'}
                            </span>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </section>

            {/* Offline Record & Recent Activity */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              {/* Record Direct Donation */}
              <section className="glass-card" style={{ padding: '24px' }}>
                <h3 style={{ margin: '0 0 16px 0', fontSize: '1.15rem', fontWeight: 800, color: '#0f172a', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <i className="ph ph-plus-circle" style={{ color: 'var(--primary)' }}></i>
                  Record Direct Donation
                </h3>
                <form onSubmit={handleRecordSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: '6px' }}>Donor Full Name</label>
                    <input
                      type="text"
                      className="input-glass"
                      placeholder="e.g. Ramesh Chandra"
                      required
                      value={donorName}
                      onChange={(e) => setDonorName(e.target.value)}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: '6px' }}>Amount (₹ INR)</label>
                    <input
                      type="number"
                      className="input-glass"
                      placeholder="e.g. 5000"
                      required
                      min="1"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: '6px' }}>Fund Allocation Purpose</label>
                    <select
                      className="input-glass"
                      value={purpose}
                      onChange={(e) => setPurpose(e.target.value)}
                    >
                      <option value="General Fund">General Fund</option>
                      <option value="Emergency Rescue Fund">Emergency Rescue Fund</option>
                      <option value="Medical Supplies">Medical Supplies & Vaccines</option>
                      <option value="Shelter Expansion">Shelter Expansion & Beds</option>
                    </select>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: '6px' }}>Donation Date</label>
                    <input
                      type="date"
                      className="input-glass"
                      required
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                    />
                  </div>

                  <button
                    type="submit"
                    className="btn-editor save"
                    style={{ width: '100%', marginTop: '6px', borderRadius: '12px' }}
                  >
                    <i className="ph ph-plus"></i> Record Offline Contribution
                  </button>
                </form>
              </section>

              {/* Recent Activity List */}
              <section className="glass-card" style={{ padding: '24px' }}>
                <h3 style={{ margin: '0 0 16px 0', fontSize: '1.15rem', fontWeight: 800, color: '#0f172a' }}>
                  Recent Contributions
                </h3>
                <div>
                  {donations.slice(0, 4).map((d) => {
                    const initials = (d.donorName || d.donor || 'S')
                      .split(' ')
                      .map((w) => w[0])
                      .join('')
                      .toUpperCase()
                      .slice(0, 2);
                    return (
                      <div key={d.id} className="recent-item">
                        <div className="recent-left">
                          <div className="recent-avatar">{initials}</div>
                          <div className="recent-info">
                            <h5>{d.donorName || d.donor || 'Anonymous'}</h5>
                            <span>{d.date} &bull; {d.purpose || 'General'}</span>
                          </div>
                        </div>
                        <div className="recent-amount">+₹{Number(d.amount).toLocaleString('en-IN')}</div>
                      </div>
                    );
                  })}
                </div>
              </section>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default NgoDonationManage;
