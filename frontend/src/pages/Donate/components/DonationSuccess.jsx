import React from 'react';

export function DonationSuccess({
  modalState, // 'processing' | 'success' | 'receipt'
  completedDonation,
  onOpenReceipt,
  onCloseReceipt,
  onCloseSuccess
}) {
  if (modalState === 'processing') {
    return (
      <div className="modal-overlay show">
        <div className="modal-card" style={{ maxWidth: '360px', textAlign: 'center', border: 'none', background: 'rgba(255, 255, 255, 0.95)' }}>
          <div style={{ padding: '40px 24px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px' }}>
            <div className="spinner-loader"></div>
            <div>
              <h3 style={{ margin: '0 0 8px 0', fontSize: '1.2rem', fontWeight: 800, color: '#0f172a' }}>
                Processing Payment...
              </h3>
              <p style={{ margin: 0, fontSize: '0.88rem', color: '#64748b', fontWeight: 500 }}>
                Please wait...
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (modalState === 'success' && completedDonation) {
    return (
      <div className="modal-overlay show" onClick={onCloseSuccess}>
        <div className="modal-card" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '440px' }}>
          <div style={{ padding: '32px 24px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px', textAlign: 'center' }}>
            <div
              style={{
                width: '64px',
                height: '64px',
                borderRadius: '50%',
                background: '#dcfce7',
                color: '#15803d',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '2.2rem',
                marginBottom: '8px'
              }}
            >
              <i className="ph-bold ph-check"></i>
            </div>
            <h2 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 800, color: '#0f172a' }}>
              Donation Successful
            </h2>
            <p style={{ margin: 0, fontSize: '0.95rem', color: '#64748b', lineHeight: 1.5 }}>
              Thank you! Your contribution gives stray animals a second chance at life.
            </p>

            <div
              style={{
                background: 'rgba(249, 115, 22, 0.03)',
                border: '1px dashed rgba(249, 115, 22, 0.15)',
                borderRadius: '12px',
                padding: '16px',
                width: '100%',
                display: 'flex',
                flexDirection: 'column',
                gap: '10px',
                margin: '8px 0',
                textAlign: 'left',
                fontSize: '0.9rem',
                boxSizing: 'border-box'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#64748b', fontWeight: 600 }}>Donation ID</span>
                <strong style={{ color: '#0f172a' }}>{completedDonation.donationId || completedDonation.id}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#64748b', fontWeight: 600 }}>Amount</span>
                <strong style={{ color: '#15803d', fontSize: '1rem' }}>
                  ₹{Number(completedDonation.amount || 0).toLocaleString('en-IN')}
                </strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#64748b', fontWeight: 600 }}>Campaign</span>
                <strong style={{ color: '#0f172a' }}>{completedDonation.campaign}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#64748b', fontWeight: 600 }}>NGO</span>
                <strong style={{ color: '#0f172a' }}>{completedDonation.ngo}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#64748b', fontWeight: 600 }}>Date</span>
                <strong style={{ color: '#0f172a' }}>{completedDonation.date}</strong>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', width: '100%' }}>
              <button
                type="button"
                onClick={onOpenReceipt}
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
                View Receipt
              </button>
              <button
                type="button"
                onClick={onCloseSuccess}
                className="btn-premium primary"
                style={{
                  justifyContent: 'center',
                  padding: '12px',
                  fontSize: '0.95rem',
                  border: 'none',
                  cursor: 'pointer',
                  borderRadius: '8px',
                  fontWeight: 700,
                  background: 'var(--primary, #f97316)',
                  color: 'white'
                }}
              >
                Continue
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (modalState === 'receipt' && completedDonation) {
    return (
      <div className="modal-overlay show" onClick={onCloseReceipt}>
        <div className="modal-card" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '440px' }}>
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
              <i className="ph-fill ph-file-text" style={{ color: 'var(--primary, #f97316)' }}></i> Donation Receipt
            </h3>
            <button
              type="button"
              onClick={onCloseReceipt}
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
            <div style={{ textAlign: 'center', marginBottom: '8px' }}>
              <i className="ph-fill ph-paw-print" style={{ fontSize: '3rem', color: 'var(--primary, #f97316)' }}></i>
              <h4 style={{ margin: '8px 0 2px 0', fontSize: '1.1rem', fontWeight: 800, color: '#0f172a' }}>Voice of Stray</h4>
              <p style={{ margin: 0, fontSize: '0.8rem', color: '#64748b', fontWeight: 600 }}>80G TAX EXEMPTION RECEIPT</p>
            </div>

            <div
              style={{
                background: 'rgba(15, 23, 42, 0.02)',
                border: '1px solid #e2e8f0',
                borderRadius: '12px',
                padding: '16px',
                display: 'flex',
                flexDirection: 'column',
                gap: '4px',
                boxSizing: 'border-box'
              }}
            >
              <div className="confirm-row">
                <span className="confirm-label">Donation ID</span>
                <span className="confirm-value">{completedDonation.donationId || completedDonation.id}</span>
              </div>
              <div className="confirm-row">
                <span className="confirm-label">Donor Name</span>
                <span className="confirm-value">
                  {completedDonation.donorName || completedDonation.donor} {completedDonation.anonymous ? '(Anonymous)' : ''}
                </span>
              </div>
              <div className="confirm-row">
                <span className="confirm-label">NGO</span>
                <span className="confirm-value">{completedDonation.ngo}</span>
              </div>
              <div className="confirm-row">
                <span className="confirm-label">Campaign</span>
                <span className="confirm-value">{completedDonation.campaign}</span>
              </div>
              <div className="confirm-row">
                <span className="confirm-label">Amount</span>
                <span className="confirm-value" style={{ color: '#15803d' }}>
                  ₹{Number(completedDonation.amount || 0).toLocaleString('en-IN')}
                </span>
              </div>
              <div className="confirm-row">
                <span className="confirm-label">Payment Method</span>
                <span className="confirm-value">{completedDonation.paymentMethod}</span>
              </div>
              <div className="confirm-row">
                <span className="confirm-label">Date</span>
                <span className="confirm-value">{completedDonation.date}</span>
              </div>
              <div className="confirm-row">
                <span className="confirm-label">Status</span>
                <span className="confirm-value" style={{ color: '#15803d' }}>
                  <i className="ph-bold ph-check"></i> Completed
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={onCloseReceipt}
              className="btn-premium primary"
              style={{
                width: '100%',
                justifyContent: 'center',
                padding: '12px',
                fontSize: '0.95rem',
                border: 'none',
                cursor: 'pointer',
                borderRadius: '8px',
                fontWeight: 700,
                background: 'var(--primary, #f97316)',
                color: 'white',
                marginTop: '8px'
              }}
            >
              Close Receipt
            </button>
          </div>
        </div>
      </div>
    );
  }

  return null;
}

export default DonationSuccess;
