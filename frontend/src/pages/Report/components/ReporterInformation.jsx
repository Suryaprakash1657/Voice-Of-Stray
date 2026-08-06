import React from 'react';
import { Input } from '../../../components/ui';

export default function ReporterInformation({
  name,
  phone,
  email,
  anonymous,
  onChangeField,
  errors = {}
}) {
  return (
    <div className="form-section">
      <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--text-main)', marginBottom: '16px' }}>
        Your Contact Info <span style={{ color: 'var(--alert)' }}>*</span>
      </h3>
      <div style={{ display: 'grid', gap: '12px', marginBottom: '12px' }}>
        <Input 
          placeholder="Full Name" 
          value={name}
          onChange={(e) => onChangeField('reporterName', e.target.value)}
          error={errors.reporterName}
          required
        />
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
          <Input 
            placeholder="Phone Number" 
            type="tel"
            value={phone}
            onChange={(e) => onChangeField('reporterPhone', e.target.value)}
            error={errors.reporterPhone}
            required
          />
          <Input 
            placeholder="Email Address" 
            type="email"
            value={email}
            onChange={(e) => onChangeField('reporterEmail', e.target.value)}
            error={errors.reporterEmail}
            required
          />
        </div>
      </div>
      <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', color: 'var(--text-main)', fontWeight: 500, fontSize: '0.95rem' }}>
        <input 
          type="checkbox" 
          checked={anonymous}
          onChange={(e) => onChangeField('anonymous', e.target.checked)}
          style={{ width: '18px', height: '18px', accentColor: 'var(--primary)' }}
        />
        <span>Report Anonymously (Hide my details from public view)</span>
      </label>
    </div>
  );
}
