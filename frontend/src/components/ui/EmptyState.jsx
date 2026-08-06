import React from 'react';

export default function EmptyState({
  title = 'No data available',
  description = 'There is currently no information to show.',
  icon = 'ph-paw-print',
  actionButton = null,
  className = '',
  ...props
}) {
  return (
    <div className={`feed-empty-state ${className}`} {...props}>
      <i className={`ph-fill ${icon} feed-empty-state-icon`}></i>
      <h3>{title}</h3>
      <p>{description}</p>
      {actionButton && (
        <div style={{ marginTop: '20px', width: '100%', display: 'flex', justifyContent: 'center' }}>
          {actionButton}
        </div>
      )}
    </div>
  );
}
