import React from 'react';
import DonorInformation from './DonorInformation.jsx';
import DonationAmountSelector from './DonationAmountSelector.jsx';

export function DonationFormModal({
  isOpen,
  formData,
  formErrors,
  onClose,
  onChange,
  onSubmit
}) {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay show" onClick={onClose}>
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
            <i className="ph-fill ph-hand-heart" style={{ color: 'var(--primary, #f97316)' }}></i> Make a Donation
          </h3>
          <button
            type="button"
            onClick={onClose}
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

        <form
          onSubmit={onSubmit}
          style={{
            padding: '24px',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
            margin: 0
          }}
        >
          <DonorInformation
            formData={formData}
            formErrors={formErrors}
            onChange={onChange}
          />

          <DonationAmountSelector
            amount={formData.amount}
            donationType={formData.donationType}
            onAmountChange={(val) => onChange('amount', val)}
            onTypeChange={(val) => onChange('donationType', val)}
            error={formErrors.amount}
          />

          <button
            type="submit"
            className="btn-premium primary"
            style={{
              width: '100%',
              justifyContent: 'center',
              padding: '14px',
              marginTop: '10px',
              fontSize: '1rem',
              border: 'none',
              cursor: 'pointer',
              boxShadow: '0 4px 12px rgba(249, 115, 22, 0.3)',
              borderRadius: '8px',
              fontWeight: 700,
              background: 'var(--primary, #f97316)',
              color: 'white'
            }}
          >
            Submit Donation
          </button>
        </form>
      </div>
    </div>
  );
}

export default DonationFormModal;
