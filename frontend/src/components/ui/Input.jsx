import React from 'react';

export default function Input({ label, error, className = '', id, ...props }) {
  const inputId = id || `input-${Math.random().toString(36).slice(2, 11)}`;
  return (
    <div className="ui-input-group" style={{ display: 'flex', flexDirection: 'column', gap: '6px', width: '100%' }}>
      <style>{`
        .ui-input {
          width: 100%;
          border: 1px solid var(--border);
          border-radius: var(--radius-full);
          padding: 10px 18px;
          font-family: inherit;
          font-size: 0.95rem;
          outline: none;
          background-color: var(--bg-main);
          color: var(--text-main);
          transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .ui-input:focus {
          border-color: var(--primary);
          background-color: var(--bg-card);
          box-shadow: 0 0 0 3px var(--primary-light);
        }
        .ui-input:disabled {
          opacity: 0.6;
          cursor: not-allowed;
          background-color: var(--border);
        }
        .ui-input.error {
          border-color: var(--alert);
          background-color: var(--bg-card);
          box-shadow: 0 0 0 3px var(--alert-light);
        }
      `}</style>
      {label && (
        <label htmlFor={inputId} style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-main)' }}>
          {label}
        </label>
      )}
      <input
        id={inputId}
        className={`ui-input ${error ? 'error' : ''} ${className}`}
        {...props}
      />
      {error && (
        <span style={{ fontSize: '0.8rem', color: 'var(--alert)', fontWeight: 500, paddingLeft: '4px' }}>
          {error}
        </span>
      )}
    </div>
  );
}
