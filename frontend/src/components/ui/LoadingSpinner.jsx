import React from 'react';

export default function LoadingSpinner({ size = 'md', color = 'var(--primary)', className = '' }) {
  const sizeMap = {
    sm: '16px',
    md: '24px',
    lg: '36px'
  };

  const spinnerSize = sizeMap[size] || sizeMap.md;

  return (
    <div 
      className={`loading-spinner-container ${className}`}
      style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}
    >
      <svg
        width={spinnerSize}
        height={spinnerSize}
        viewBox="0 0 38 38"
        xmlns="http://www.w3.org/2000/svg"
        stroke={color}
        style={{ animation: 'spin-loading 0.8s linear infinite' }}
      >
        <style>{`
          @keyframes spin-loading {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
        <g fill="none" fillRule="evenodd">
          <g transform="translate(1 1)" strokeWidth="3">
            <circle strokeOpacity=".15" cx="18" cy="18" r="18" stroke="currentColor" />
            <path d="M36 18c0-9.94-8.06-18-18-18" />
          </g>
        </g>
      </svg>
    </div>
  );
}
