import React from 'react';

export function AdoptionStatusBadge({ status = '', className = '', style = {} }) {
  const s = String(status || '').trim();

  let bg = '#fff1f2';
  let color = '#e11d48';
  let borderColor = '#fecdd3';
  let icon = 'ph-clock';

  if (s === 'Ready to Submit' || s === 'Approved' || s === 'Completed' || s === 'Healthy' || s === 'Available') {
    bg = '#dcfce7';
    color = '#15803d';
    borderColor = '#bbf7d0';
    icon = 'ph-check-circle';
  } else if (s === 'Pending Review' || s === 'Pending' || s === 'Under Review') {
    bg = '#fef9c3';
    color = '#854d0e';
    borderColor = '#fef08a';
    icon = 'ph-hourglass-medium';
  } else if (s === 'Vaccinated' || s === 'House Trained' || s === 'Vet Checked') {
    bg = '#dbeafe';
    color = '#1d4ed8';
    borderColor = '#bfdbfe';
    icon = 'ph-shield-check';
  } else if (s === 'Bonded Pair' || s === 'Neutered') {
    bg = '#ffedd5';
    color = '#c2410c';
    borderColor = '#fed7aa';
    icon = 'ph-sparkle';
  }

  return (
    <span
      className={`status-badge ${className}`}
      style={{
        background: bg,
        color: color,
        borderColor: borderColor,
        display: 'inline-flex',
        alignItems: 'center',
        gap: '4px',
        ...style
      }}
    >
      <i className={`ph-fill ${icon}`}></i> {status || 'Pending'}
    </span>
  );
}

export default React.memo(AdoptionStatusBadge);
