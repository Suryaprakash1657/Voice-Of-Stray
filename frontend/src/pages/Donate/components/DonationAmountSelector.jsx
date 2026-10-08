import React from 'react';

export function DonationAmountSelector({
  amount,
  donationType,
  onAmountChange,
  onTypeChange,
  error
}) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '12px' }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
        <label style={{ fontSize: '0.85rem', fontWeight: 700, color: '#475569' }}>
          Amount (₹)
        </label>
        <input
          type="number"
          min="1"
          required
          placeholder="e.g. 1000"
          value={amount || ''}
          onChange={(e) => onAmountChange && onAmountChange(e.target.value)}
          style={{
            padding: '10px 14px',
            border: error ? '1.5px solid #ef4444' : '1.5px solid var(--border, #e2e8f0)',
            borderRadius: '8px',
            fontFamily: 'inherit',
            fontSize: '0.95rem',
            outline: 'none'
          }}
        />
        {error && <span style={{ color: '#ef4444', fontSize: '0.8rem', fontWeight: 500 }}>{error}</span>}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
        <label style={{ fontSize: '0.85rem', fontWeight: 700, color: '#475569' }}>
          Frequency
        </label>
        <select
          value={donationType || 'One-time'}
          onChange={(e) => onTypeChange && onTypeChange(e.target.value)}
          style={{
            padding: '10px 14px',
            border: '1.5px solid var(--border, #e2e8f0)',
            borderRadius: '8px',
            fontFamily: 'inherit',
            fontSize: '0.95rem',
            background: 'white',
            outline: 'none'
          }}
        >
          <option value="One-time">One-time</option>
          <option value="Monthly">Monthly</option>
        </select>
      </div>
    </div>
  );
}

export default DonationAmountSelector;
