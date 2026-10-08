import React from 'react';

export function EmptyDonationState({
  title = "No donations found",
  description = "No donation records are currently available.",
  icon = "ph-heart-break"
}) {
  return (
    <div style={{ textAlign: 'center', color: 'var(--text-muted, #64748b)', padding: '24px 16px', fontSize: '0.95rem' }}>
      <i className={`ph ${icon}`} style={{ fontSize: '2rem', color: 'var(--primary, #f97316)', marginBottom: '8px', display: 'block', opacity: 0.7 }}></i>
      <span>{description}</span>
    </div>
  );
}

export default EmptyDonationState;
