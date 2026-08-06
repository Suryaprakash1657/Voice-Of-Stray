import React from 'react';

export default function SectionHeader({
  title,
  subtitle,
  action = null,
  className = '',
  ...props
}) {
  return (
    <div 
      className={`feed-header ${className}`} 
      style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'flex-end', 
        gap: '20px', 
        width: '100%', 
        marginBottom: '24px' 
      }}
      {...props}
    >
      <div>
        <h1 style={{ margin: 0 }}>{title}</h1>
        {subtitle && <p style={{ margin: '8px 0 0 0' }}>{subtitle}</p>}
      </div>
      {action && (
        <div style={{ flexShrink: 0, paddingBottom: '2px' }}>
          {action}
        </div>
      )}
    </div>
  );
}
