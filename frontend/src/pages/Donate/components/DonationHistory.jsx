import React, { useState } from 'react';
import EmptyDonationState from './EmptyDonationState.jsx';

export function DonationHistory({
  userDonations = [],
  currentUser,
  onViewReceipt
}) {
  const [filter, setFilter] = useState('all');

  const filtered = userDonations.filter(d => {
    if (filter === 'all') return true;
    if (filter === 'medical') {
      const camp = (d.campaign || d.purpose || '').toLowerCase();
      return camp.includes('medical') || camp.includes('rescue');
    }
    if (filter === 'general') {
      const camp = (d.campaign || d.purpose || '').toLowerCase();
      return camp.includes('general') || camp.includes('sanctuary');
    }
    return true;
  });

  const totalUserDonated = userDonations.reduce((sum, d) => sum + (Number(d.amount) || 0), 0);

  return (
    <div style={{ marginTop: '24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h3 style={{ margin: 0, fontSize: '1.25rem', color: '#0f172a', fontWeight: 800 }}>Your Donation History</h3>
          <p style={{ margin: 0, fontSize: '0.88rem', color: '#64748b' }}>
            {currentUser ? `Total Contributed: ₹${totalUserDonated.toLocaleString('en-IN')}` : 'Log in to track your personal impact statement'}
          </p>
        </div>

        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            type="button"
            className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
            onClick={() => setFilter('all')}
            style={{ padding: '6px 12px', fontSize: '0.85rem' }}
          >
            All
          </button>
          <button
            type="button"
            className={`filter-btn ${filter === 'medical' ? 'active' : ''}`}
            onClick={() => setFilter('medical')}
            style={{ padding: '6px 12px', fontSize: '0.85rem' }}
          >
            Medical Care
          </button>
          <button
            type="button"
            className={`filter-btn ${filter === 'general' ? 'active' : ''}`}
            onClick={() => setFilter('general')}
            style={{ padding: '6px 12px', fontSize: '0.85rem' }}
          >
            General Support
          </button>
        </div>
      </div>

      {filtered.length === 0 ? (
        <EmptyDonationState
          description={currentUser ? "You haven't made any donations in this category yet." : "No personal donations to display."}
        />
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {filtered.map(d => (
            <div
              key={d.id || d.donationId}
              style={{
                background: 'white',
                border: '1px solid #e2e8f0',
                borderRadius: '12px',
                padding: '16px 20px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '12px',
                boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                <div
                  style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '50%',
                    background: '#ffedd5',
                    color: 'var(--primary, #f97316)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1.2rem'
                  }}
                >
                  <i className="ph-fill ph-hand-heart"></i>
                </div>
                <div>
                  <h4 style={{ margin: 0, fontSize: '0.98rem', color: '#0f172a', fontWeight: 700 }}>
                    {d.campaign || d.purpose}
                  </h4>
                  <p style={{ margin: '2px 0 0', fontSize: '0.82rem', color: '#64748b' }}>
                    {d.ngo} • {d.date} • {d.donationType || 'One-time'}
                  </p>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontWeight: 800, color: '#15803d', fontSize: '1.05rem' }}>
                    ₹{Number(d.amount).toLocaleString('en-IN')}
                  </div>
                  <span style={{ fontSize: '0.75rem', color: '#10b981', fontWeight: 600 }}>
                    <i className="ph-bold ph-check"></i> Completed
                  </span>
                </div>

                {onViewReceipt && (
                  <button
                    type="button"
                    onClick={() => onViewReceipt(d)}
                    style={{
                      background: '#f8fafc',
                      border: '1px solid #e2e8f0',
                      borderRadius: '6px',
                      padding: '6px 12px',
                      fontSize: '0.82rem',
                      fontWeight: 600,
                      color: '#475569',
                      cursor: 'pointer'
                    }}
                  >
                    Receipt
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default DonationHistory;
