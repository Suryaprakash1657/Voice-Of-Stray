import React from 'react';

export function DonationOperationsSection({ donationsOverview }) {
  const {
    todayTotal = 0,
    diffPercent = 0,
    monthlyTotal = 0,
    progress = 0,
    grandTotal = 0,
    activeDonorsCount = 0,
    recentDonations = []
  } = donationsOverview || {};

  return (
    <section className="glass-card" style={{ paddingBottom: '12px' }}>
      <div style={{ padding: '24px 24px 0 24px' }}>
        <div className="ops-section-header">
          <span className="ops-section-title">
            <i className="ph-fill ph-coins"></i>
            <span>Donation Operations Overview</span>
          </span>
        </div>
      </div>

      <div className="donation-overview-grid" style={{ gridTemplateColumns: 'repeat(4, 1fr)' }}>
        {/* Today */}
        <div className="hero-stat-card" style={{ background: 'rgba(249, 115, 22, 0.03)', minHeight: '120px' }}>
          <p style={{ marginTop: 0, marginBottom: '8px', fontSize: '0.8rem' }}>Today's Contributions</p>
          <h3 id="dashboard-today-donations" style={{ fontSize: '1.45rem' }}>
            ₹{todayTotal.toLocaleString('en-IN')}
          </h3>
          <span
            id="dashboard-today-subtext"
            style={{
              fontSize: '0.7rem',
              color: diffPercent >= 0 ? '#15803d' : '#ef4444',
              fontWeight: 700
            }}
          >
            <i className={`ph ${diffPercent >= 0 ? 'ph-trend-up' : 'ph-trend-down'}`}></i>{' '}
            {diffPercent >= 0 ? `+${diffPercent}% vs yesterday` : `${diffPercent}% vs yesterday`}
          </span>
        </div>

        {/* Month */}
        <div className="hero-stat-card" style={{ background: 'rgba(249, 115, 22, 0.03)', minHeight: '120px' }}>
          <p style={{ marginTop: 0, marginBottom: '8px', fontSize: '0.8rem' }}>This Month Total</p>
          <h3 id="dashboard-monthly-donations" style={{ fontSize: '1.45rem' }}>
            ₹{monthlyTotal.toLocaleString('en-IN')}
          </h3>
          <span
            id="dashboard-monthly-subtext"
            style={{ fontSize: '0.7rem', color: '#15803d', fontWeight: 700 }}
          >
            <i className="ph ph-trend-up"></i> Target ₹100,000 ({progress}%)
          </span>
        </div>

        {/* Total donations */}
        <div className="hero-stat-card" style={{ background: 'rgba(249, 115, 22, 0.03)', minHeight: '120px' }}>
          <p style={{ marginTop: 0, marginBottom: '8px', fontSize: '0.8rem' }}>Total Donations</p>
          <h3 id="dashboard-total-donations" style={{ fontSize: '1.45rem' }}>
            ₹{grandTotal.toLocaleString('en-IN')}
          </h3>
          <span style={{ fontSize: '0.7rem', color: 'var(--primary)', fontWeight: 700 }}>
            All-time total
          </span>
        </div>

        {/* Active donors */}
        <div className="hero-stat-card" style={{ background: 'rgba(249, 115, 22, 0.03)', minHeight: '120px' }}>
          <p style={{ marginTop: 0, marginBottom: '8px', fontSize: '0.8rem' }}>Active Donors</p>
          <h3 id="dashboard-active-donors" style={{ fontSize: '1.45rem' }}>
            {activeDonorsCount}
          </h3>
          <span style={{ fontSize: '0.7rem', color: 'var(--primary)', fontWeight: 700 }}>
            Unique profiles
          </span>
        </div>
      </div>

      {/* Recent Donations list */}
      <div style={{ borderTop: '1px solid rgba(249, 115, 22, 0.08)', padding: '20px 24px 8px 24px' }}>
        <h4
          style={{
            fontSize: '0.95rem',
            fontWeight: 800,
            color: '#0f172a',
            margin: '0 0 16px 0',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}
        >
          <i className="ph-fill ph-clock-counter-clockwise" style={{ color: 'var(--primary)' }}></i>{' '}
          Recent Donations
        </h4>
        <div id="dashboard-recent-donations-list" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {recentDonations.length === 0 ? (
            <div style={{ textAlign: 'center', fontSize: '0.8rem', color: 'var(--text-muted)', padding: '10px 0' }}>
              No donations recorded yet.
            </div>
          ) : (
            recentDonations.map((d, index) => {
              const donorName = d.anonymous ? 'Anonymous' : (d.donorName || d.donor || 'Anonymous');
              const initials = donorName
                .split(' ')
                .map((w) => w[0])
                .join('')
                .toUpperCase()
                .slice(0, 2);
              const campaignVal = d.campaign || d.purpose || 'General Fund';
              const amountVal = Number(d.amount || d.donationAmount || 0);

              let relativeTime = 'Today';
              if (d.date === '2026-06-17') relativeTime = 'Yesterday';
              else if (d.date && d.date !== '2026-06-18') {
                const tDate = new Date('2026-06-18T00:00:00');
                const dDate = new Date(d.date + 'T00:00:00');
                const diff = Math.round((tDate - dDate) / (1000 * 60 * 60 * 24));
                relativeTime = diff > 0 ? `${diff} days ago` : d.date;
              }

              return (
                <div
                  key={d.id || index}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '10px 14px',
                    background: 'rgba(255, 255, 255, 0.5)',
                    border: '1px solid rgba(249, 115, 22, 0.04)',
                    borderRadius: '8px'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div
                      style={{
                        width: '32px',
                        height: '32px',
                        borderRadius: '50%',
                        background: 'rgba(249, 115, 22, 0.08)',
                        color: 'var(--primary)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '0.85rem',
                        fontWeight: 700
                      }}
                    >
                      {initials}
                    </div>
                    <div>
                      <h5 style={{ fontSize: '0.88rem', fontWeight: 700, color: '#0f172a', margin: '0 0 2px 0' }}>
                        {donorName}
                      </h5>
                      <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 500 }}>
                        {relativeTime} &bull; {campaignVal}
                      </span>
                    </div>
                  </div>
                  <span style={{ fontSize: '0.9rem', fontWeight: 800, color: '#15803d' }}>
                    +₹{amountVal.toLocaleString('en-IN')}
                  </span>
                </div>
              );
            })
          )}
        </div>
      </div>
    </section>
  );
}

export default DonationOperationsSection;
