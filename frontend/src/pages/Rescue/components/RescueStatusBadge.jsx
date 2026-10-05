import React from 'react';

/**
 * RescueStatusBadge renders standardized severity and lifecycle status badges
 */
export function RescueStatusBadge({ type = 'severity', value = '', step = null, className = '', style = {} }) {
  if (type === 'severity') {
    const sev = String(value || '').toLowerCase();
    let badgeClass = 'severity-stable';
    let iconClass = 'ph-fill ph-check-circle';
    let label = value || 'Normal';

    if (sev.includes('emergency') || sev.includes('critical')) {
      badgeClass = 'severity-critical';
      iconClass = 'ph-fill ph-warning';
    } else if (sev.includes('high') || sev.includes('medium')) {
      badgeClass = 'severity-medium';
      iconClass = 'ph-fill ph-info';
    }

    return (
      <span className={`severity-badge ${badgeClass} ${className}`} style={style}>
        <i className={iconClass}></i> {label}
      </span>
    );
  }

  // Type: lifecycle / status
  const isCompleted =
    step === 9 ||
    String(value).toLowerCase().includes('completed') ||
    String(value).toLowerCase().includes('adopted') ||
    String(value).toLowerCase().includes('resolved');

  let iconClass = 'ph-activity';
  if (isCompleted) {
    iconClass = 'ph-check-circle';
  } else if (step === 3 || String(value).toLowerCase().includes('en route')) {
    iconClass = 'ph-ambulance';
  } else if (step === 4 || String(value).toLowerCase().includes('rescued')) {
    iconClass = 'ph-first-aid';
  } else if (step === 5 || String(value).toLowerCase().includes('treatment')) {
    iconClass = 'ph-first-aid';
  }

  const badgeBg = isCompleted ? 'var(--success-green, #10b981)' : 'var(--tracking-blue, #2563eb)';

  return (
    <span
      className={`emergency-badge ${isCompleted ? 'stable' : ''} ${className}`}
      style={{ background: badgeBg, ...style }}
    >
      <i className={`ph-fill ${iconClass}`}></i> {value || 'Reported'}
    </span>
  );
}

export default React.memo(RescueStatusBadge);
