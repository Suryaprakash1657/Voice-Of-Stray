import React from 'react';

export default function PageContainer({
  children,
  sidebar = null,
  className = '',
  style,
  ...props
}) {
  if (sidebar) {
    return (
      <div 
        className={`main-container ${className}`} 
        style={style}
        {...props}
      >
        <div className="feed-column">
          {children}
        </div>
        <div className="sidebar-column">
          {sidebar}
        </div>
      </div>
    );
  }

  return (
    <div 
      className={className}
      style={{ maxWidth: '1200px', margin: '16px auto 32px', padding: '0 24px', ...style }}
      {...props}
    >
      {children}
    </div>
  );
}
