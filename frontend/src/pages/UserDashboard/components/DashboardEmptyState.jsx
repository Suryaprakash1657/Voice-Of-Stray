import React from 'react';

export default function DashboardEmptyState({ icon, title, description, iconStyle }) {
  return (
    <div className="empty-state">
      <div className="empty-state-icon" style={iconStyle}>
        <i className={icon}></i>
      </div>
      <h4>{title}</h4>
      <p>{description}</p>
    </div>
  );
}
