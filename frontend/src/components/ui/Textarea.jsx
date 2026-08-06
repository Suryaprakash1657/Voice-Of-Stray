import React from 'react';

export default function Textarea({ label, error, className = '', id, rows = 4, ...props }) {
  const textareaId = id || `textarea-${Math.random().toString(36).slice(2, 11)}`;
  return (
    <div className="ui-textarea-group" style={{ display: 'flex', flexDirection: 'column', gap: '6px', width: '100%' }}>
      <style>{`
        .ui-textarea {
          width: 100%;
          border: 1px solid var(--border);
          border-radius: var(--radius-md);
          padding: 12px 18px;
          font-family: inherit;
          font-size: 0.95rem;
          outline: none;
          background-color: var(--bg-main);
          color: var(--text-main);
          resize: vertical;
          line-height: 1.5;
          transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .ui-textarea:focus {
          border-color: var(--primary);
          background-color: var(--bg-card);
          box-shadow: 0 0 0 3px var(--primary-light);
        }
        .ui-textarea:disabled {
          opacity: 0.6;
          cursor: not-allowed;
          background-color: var(--border);
        }
        .ui-textarea.error {
          border-color: var(--alert);
          background-color: var(--bg-card);
          box-shadow: 0 0 0 3px var(--alert-light);
        }
      `}</style>
      {label && (
        <label htmlFor={textareaId} style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-main)' }}>
          {label}
        </label>
      )}
      <textarea
        id={textareaId}
        rows={rows}
        className={`ui-textarea ${error ? 'error' : ''} ${className}`}
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
