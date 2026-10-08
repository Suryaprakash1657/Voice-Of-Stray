import React from 'react';

export function DonationSummary({ donation }) {
  if (!donation) return null;

  return (
    <div
      style={{
        background: 'rgba(15, 23, 42, 0.02)',
        border: '1px solid #e2e8f0',
        borderRadius: '12px',
        padding: '16px',
        display: 'flex',
        flexDirection: 'column',
        gap: '4px'
      }}
    >
      <div className="confirm-row">
        <span className="confirm-label">Donor Name</span>
        <span className="confirm-value">
          {donation.donorName || donation.donor} {donation.anonymous ? '(Anonymous)' : ''}
        </span>
      </div>
      <div className="confirm-row">
        <span className="confirm-label">NGO</span>
        <span className="confirm-value">{donation.ngo}</span>
      </div>
      <div className="confirm-row">
        <span className="confirm-label">Campaign</span>
        <span className="confirm-value">{donation.campaign || donation.purpose}</span>
      </div>
      <div className="confirm-row">
        <span className="confirm-label">Amount</span>
        <span className="confirm-value" style={{ color: '#15803d' }}>
          ₹{Number(donation.amount || 0).toLocaleString('en-IN')}
        </span>
      </div>
      <div className="confirm-row">
        <span className="confirm-label">Donation Frequency</span>
        <span className="confirm-value">{donation.donationType || 'One-time'}</span>
      </div>
      <div className="confirm-row">
        <span className="confirm-label">Payment Method</span>
        <span className="confirm-value">{donation.paymentMethod || 'Credit Card (Mock)'}</span>
      </div>
    </div>
  );
}

export default DonationSummary;
