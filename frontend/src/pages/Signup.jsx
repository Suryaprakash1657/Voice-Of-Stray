import React from 'react';

export default function Signup() {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh', padding: '2rem' }}>
      <div style={{
        maxWidth: '500px',
        padding: '2.5rem',
        borderRadius: '16px',
        background: 'rgba(255, 255, 255, 0.03)',
        backdropFilter: 'blur(12px)',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        textAlign: 'center',
        boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)'
      }}>
        <h2 style={{ color: '#f97316', marginBottom: '1rem', fontWeight: 600 }}>Signup Module</h2>
        <p style={{ color: '#94a3b8', lineHeight: 1.6 }}>
          Signup module is currently using the prototype implementation and will be migrated in the next milestone.
        </p>
      </div>
    </div>
  );
}
