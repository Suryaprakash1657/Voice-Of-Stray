import React from 'react';

export function DonorInformation({
  formData,
  formErrors = {},
  onChange
}) {
  return (
    <>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
        <label style={{ fontSize: '0.85rem', fontWeight: 700, color: '#475569' }}>
          Donor Name
        </label>
        <input
          type="text"
          required
          placeholder="e.g. Arjun Mehta"
          value={formData.donorName || ''}
          onChange={(e) => onChange('donorName', e.target.value)}
          style={{
            padding: '10px 14px',
            border: formErrors.donorName ? '1.5px solid #ef4444' : '1.5px solid var(--border, #e2e8f0)',
            borderRadius: '8px',
            fontFamily: 'inherit',
            fontSize: '0.95rem',
            outline: 'none',
            transition: 'border-color 0.2s'
          }}
        />
        {formErrors.donorName && (
          <span style={{ color: '#ef4444', fontSize: '0.8rem', fontWeight: 500 }}>
            {formErrors.donorName}
          </span>
        )}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
        <label style={{ fontSize: '0.85rem', fontWeight: 700, color: '#475569' }}>
          Donor Email
        </label>
        <input
          type="email"
          required
          placeholder="e.g. user@voiceofstray.com"
          value={formData.donorEmail || ''}
          onChange={(e) => onChange('donorEmail', e.target.value)}
          style={{
            padding: '10px 14px',
            border: formErrors.donorEmail ? '1.5px solid #ef4444' : '1.5px solid var(--border, #e2e8f0)',
            borderRadius: '8px',
            fontFamily: 'inherit',
            fontSize: '0.95rem',
            outline: 'none',
            transition: 'border-color 0.2s'
          }}
        />
        {formErrors.donorEmail && (
          <span style={{ color: '#ef4444', fontSize: '0.8rem', fontWeight: 500 }}>
            {formErrors.donorEmail}
          </span>
        )}
      </div>

      <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', color: '#475569', marginTop: '4px' }}>
        <input
          type="checkbox"
          checked={Boolean(formData.anonymous)}
          onChange={(e) => onChange('anonymous', e.target.checked)}
          style={{ width: '18px', height: '18px', accentColor: 'var(--primary, #f97316)' }}
        />
        <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>
          Donate Anonymously (Hide my details from public view)
        </span>
      </label>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <label style={{ fontSize: '0.85rem', fontWeight: 700, color: '#475569' }}>Select NGO</label>
          <select
            value={formData.ngo || 'Paws Haven NGO'}
            onChange={(e) => onChange('ngo', e.target.value)}
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
            <option value="Paws Haven NGO">Paws Haven NGO</option>
            <option value="Stray Safe Shelter">Stray Safe Shelter</option>
            <option value="Happy Paws Sanctuary">Happy Paws Sanctuary</option>
          </select>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <label style={{ fontSize: '0.85rem', fontWeight: 700, color: '#475569' }}>Campaign</label>
          <select
            value={formData.campaign || 'Emergency Medical Fund'}
            onChange={(e) => onChange('campaign', e.target.value)}
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
            <option value="Emergency Medical Fund">Emergency Medical Fund</option>
            <option value="General Fund">General Fund</option>
            <option value="Medical Supplies">Medical Supplies</option>
            <option value="Sanctuary Maintenance">Sanctuary Maintenance</option>
          </select>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
        <label style={{ fontSize: '0.85rem', fontWeight: 700, color: '#475569' }}>Payment Method (Prototype)</label>
        <select
          value={formData.paymentMethod || 'Credit Card (Mock)'}
          onChange={(e) => onChange('paymentMethod', e.target.value)}
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
          <option value="Credit Card (Mock)">Credit Card (Mock)</option>
          <option value="UPI (Mock)">UPI (Mock)</option>
          <option value="Net Banking (Mock)">Net Banking (Mock)</option>
        </select>
      </div>
    </>
  );
}

export default DonorInformation;
