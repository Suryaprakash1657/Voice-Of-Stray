import React from 'react';
import DashboardEmptyState from './DashboardEmptyState.jsx';

export default function DonationsSection({ donations = [] }) {
  return (
    <section className="glass-card">
      <div style={{ padding: '24px 24px 0 24px' }}>
        <div className="section-header">
          <span className="section-title-wrap">
            <i className="ph-fill ph-coins"></i>
            <span>Recent Donations</span>
          </span>
        </div>
      </div>
      <div className="section-card-content" id="user-donations-container" style={{ padding: '12px 24px 24px 24px' }}>
        {donations.length === 0 ? (
          <DashboardEmptyState
            icon="ph ph-coins"
            title="No donations made yet"
            description="Your contributions to rescue operations and shelter campaigns will appear here."
          />
        ) : (
          <div className="active-list">
            {donations.map((d) => {
              const campaignVal = d.campaign || d.purpose || 'General Fund';
              const ngoVal = d.ngo || 'Paws Haven NGO';
              const amountVal = d.amount || d.donationAmount || 0;
              const dateVal = d.date;
              const statusVal = d.status || 'Completed';

              return (
                <div key={d.id || d.donationId || Math.random()} className="active-item">
                  <div className="active-item-left">
                    <div className="active-item-icon donate">
                      <i className="ph-fill ph-coins"></i>
                    </div>
                    <div className="active-item-info">
                      <h5>₹{Number(amountVal).toLocaleString('en-IN')}</h5>
                      <p>
                        {campaignVal} &bull; NGO: {ngoVal} &bull; Date: {dateVal}
                      </p>
                    </div>
                  </div>
                  <span className="status-pill completed">
                    <i className="ph-bold ph-check"></i> {statusVal}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
