import React from 'react';
import DonationSummary from './DonationSummary.jsx';

export function DonationConfirmation({
  isOpen,
  pendingDonation,
  onCancel,
  onConfirm
}) {
  if (!isOpen || !pendingDonation) return null;

  return (
    <div className="modal-overlay show" onClick={onCancel}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <div
          style={{
            padding: '20px 24px',
            background: 'rgba(249, 115, 22, 0.03)',
            borderBottom: '1px solid rgba(249, 115, 22, 0.1)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}
        >
          <h3
            style={{
              margin: 0,
              fontSize: '1.25rem',
              fontWeight: 800,
              color: '#0f172a',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            <i className="ph-fill ph-check-circle" style={{ color: 'var(--primary, #f97316)' }}></i> Confirm Donation
          </h3>
          <button
            type="button"
            onClick={onCancel}
            style={{
              background: 'none',
              border: 'none',
              fontSize: '1.5rem',
              color: '#64748b',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <i className="ph ph-x"></i>
          </button>
        </div>

        <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <DonationSummary donation={pendingDonation} />

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginTop: '8px' }}>
            <button
              type="button"
              onClick={onCancel}
              className="btn-premium secondary"
              style={{
                justifyContent: 'center',
                padding: '12px',
                fontSize: '0.95rem',
                border: '1px solid #e2e8f0',
                borderRadius: '8px',
                fontWeight: 700,
                cursor: 'pointer',
                background: 'white',
                color: '#475569'
              }}
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={onConfirm}
              className="btn-premium primary"
              style={{
                justifyContent: 'center',
                padding: '12px',
                fontSize: '0.95rem',
                border: 'none',
                borderRadius: '8px',
                fontWeight: 700,
                cursor: 'pointer',
                background: 'var(--primary, #f97316)',
                color: 'white',
                boxShadow: '0 4px 12px rgba(249, 115, 22, 0.3)'
              }}
            >
              Pay ₹{Number(pendingDonation.amount || 0).toLocaleString('en-IN')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DonationConfirmation;
