import React from 'react';

export function EmptyVolunteerState({
  icon = 'ph-circle-dashed',
  title = 'No items found',
  description = 'There are no active items to display at this time.',
  action = null
}) {
  return (
    <div
      style={{
        textAlign: 'center',
        padding: '36px 24px',
        color: 'var(--text-muted, #64748b)',
        fontWeight: 500,
        fontSize: '0.9rem',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '8px'
      }}
    >
      <i
        className={`ph ${icon}`}
        style={{ fontSize: '2.5rem', color: '#cbd5e1' }}
      ></i>
      <h4
        style={{
          fontSize: '1rem',
          fontWeight: 800,
          color: '#1e293b',
          margin: '4px 0 2px 0'
        }}
      >
        {title}
      </h4>
      <p
        style={{
          fontSize: '0.82rem',
          color: 'var(--text-muted, #64748b)',
          margin: 0,
          maxWidth: '320px',
          lineHeight: 1.4
        }}
      >
        {description}
      </p>
      {action && <div style={{ marginTop: '12px' }}>{action}</div>}
    </div>
  );
}

export default EmptyVolunteerState;
