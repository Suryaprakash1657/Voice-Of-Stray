import React from 'react';
import Button from '../../../components/ui/Button.jsx';

export function EmptyAdoptionState({
  title = 'No Adoptable Pets Found',
  message = 'We could not find any pets matching your filter criteria. Try adjusting your filters or search keywords.',
  onReset = null,
  actionLabel = 'Clear All Filters'
}) {
  return (
    <div
      style={{
        padding: '48px 24px',
        textAlign: 'center',
        background: 'rgba(255, 255, 255, 0.8)',
        borderRadius: '24px',
        border: '1px solid rgba(249, 115, 22, 0.15)',
        boxShadow: '0 4px 20px rgba(249, 115, 22, 0.02)',
        gridColumn: '1 / -1'
      }}
    >
      <div
        style={{
          width: '64px',
          height: '64px',
          borderRadius: '50%',
          background: '#fff7ed',
          color: '#f97316',
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '2rem',
          marginBottom: '16px'
        }}
      >
        <i className="ph ph-paw-print"></i>
      </div>
      <h3 style={{ color: '#431407', fontSize: '1.25rem', fontWeight: 700, marginBottom: '8px' }}>
        {title}
      </h3>
      <p style={{ color: '#7c2d12', fontSize: '0.95rem', maxWidth: '440px', margin: '0 auto 20px', lineHeight: 1.5 }}>
        {message}
      </p>
      {onReset && (
        <Button variant="secondary" onClick={onReset}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
}

export default React.memo(EmptyAdoptionState);
