import React from 'react';
import EmptyState from '../../../components/ui/EmptyState.jsx';
import Button from '../../../components/ui/Button.jsx';

export function EmptyRescueState({ onResetFilter = null, filterName = 'all' }) {
  return (
    <div
      style={{
        padding: '48px 24px',
        textAlign: 'center',
        background: 'rgba(255, 255, 255, 0.8)',
        borderRadius: '24px',
        border: '1px solid rgba(249, 115, 22, 0.15)',
        boxShadow: '0 4px 20px rgba(249, 115, 22, 0.02)'
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
        <i className="ph ph-magnifying-glass"></i>
      </div>
      <h3 style={{ color: '#431407', fontSize: '1.2rem', fontWeight: 700, marginBottom: '8px' }}>
        No Active Rescue Cases Found
      </h3>
      <p style={{ color: '#7c2d12', fontSize: '0.95rem', maxWidth: '420px', margin: '0 auto 20px', lineHeight: 1.5 }}>
        There are currently no rescue missions matching the "{filterName}" filter. New emergency dispatches will appear here automatically.
      </p>
      {onResetFilter && (
        <Button variant="secondary" onClick={onResetFilter}>
          View All Missions
        </Button>
      )}
    </div>
  );
}

export default React.memo(EmptyRescueState);
