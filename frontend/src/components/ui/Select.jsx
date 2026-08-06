import React from 'react';

export default function Select({ label, error, className = '', id, children, ...props }) {
  const selectId = id || `select-${Math.random().toString(36).slice(2, 11)}`;
  return (
    <div className="ui-select-group" style={{ display: 'flex', flexDirection: 'column', gap: '6px', width: '100%' }}>
      <style>{`
        .ui-select {
          width: 100%;
          border: 1px solid var(--border);
          border-radius: var(--radius-full);
          padding: 10px 18px;
          font-family: inherit;
          font-size: 0.95rem;
          outline: none;
          background-color: var(--bg-main);
          color: var(--text-main);
          appearance: none;
          background-image: url("data:image/svg+xml;charset=UTF-8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23475569' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E");
          background-repeat: no-repeat;
          background-position: right 16px center;
          background-size: 16px;
          cursor: pointer;
          transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .ui-select:focus {
          border-color: var(--primary);
          background-color: var(--bg-card);
          box-shadow: 0 0 0 3px var(--primary-light);
        }
        .ui-select:disabled {
          opacity: 0.6;
          cursor: not-allowed;
          background-color: var(--border);
        }
        .ui-select.error {
          border-color: var(--alert);
          background-color: var(--bg-card);
          box-shadow: 0 0 0 3px var(--alert-light);
        }
      `}</style>
      {label && (
        <label htmlFor={selectId} style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-main)' }}>
          {label}
        </label>
      )}
      <select
        id={selectId}
        className={`ui-select ${error ? 'error' : ''} ${className}`}
        {...props}
      >
        {children}
      </select>
      {error && (
        <span style={{ fontSize: '0.8rem', color: 'var(--alert)', fontWeight: 500, paddingLeft: '4px' }}>
          {error}
        </span>
      )}
    </div>
  );
}
