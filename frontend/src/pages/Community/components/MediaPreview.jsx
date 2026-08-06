import React from 'react';

export default function MediaPreview({ mediaSrc, onRemove }) {
  if (!mediaSrc) return null;

  return (
    <div style={{ position: 'relative', margin: '0 16px 16px 16px', borderRadius: '8px', overflow: 'hidden', maxHeight: '250px' }}>
      <img 
        src={mediaSrc} 
        alt="Preview upload" 
        style={{ width: '100%', height: 'auto', maxHeight: '250px', objectFit: 'cover', borderRadius: '8px' }} 
      />
      <button 
        type="button" 
        onClick={onRemove}
        style={{ 
          position: 'absolute', 
          top: '8px', 
          right: '8px', 
          background: 'rgba(15, 23, 42, 0.7)', 
          color: 'white', 
          border: 'none', 
          borderRadius: '50%', 
          width: '28px', 
          height: '28px', 
          cursor: 'pointer', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center', 
          fontSize: '1.1rem', 
          transition: 'background 0.2s' 
        }}
        aria-label="Remove upload preview"
      >
        <i className="ph ph-x"></i>
      </button>
    </div>
  );
}
