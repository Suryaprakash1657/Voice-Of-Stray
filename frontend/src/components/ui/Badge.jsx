import React from 'react';

export default function Badge({ variant = 'info', className = '', children, ...props }) {
  let badgeClass = 'badge';
  const customStyles = {};

  const lowerVariant = variant.toLowerCase();

  if (lowerVariant === 'rescue') {
    badgeClass = 'badge badge-rescue';
  } else if (lowerVariant === 'feeding') {
    badgeClass = 'badge badge-feeding';
  } else if (lowerVariant === 'adoption' || lowerVariant === 'adopted') {
    badgeClass = 'badge badge-adoption';
  } else if (lowerVariant === 'alert' || lowerVariant === 'emergency' || lowerVariant === 'high' || lowerVariant === 'high priority') {
    badgeClass = 'badge badge-alert';
  } else if (lowerVariant === 'volunteer' || lowerVariant === 'user' || lowerVariant === 'regular user') {
    badgeClass = 'dropdown-role-badge user';
  } else if (lowerVariant === 'ngo' || lowerVariant === 'ngo shelter partner') {
    badgeClass = 'dropdown-role-badge ngo';
  } else {
    // Custom fallbacks matching platform's color palette
    badgeClass = 'badge';
    if (lowerVariant === 'pending' || lowerVariant === 'pending review') {
      customStyles.backgroundColor = 'var(--primary-light)';
      customStyles.color = 'var(--primary)';
      customStyles.boxShadow = 'none';
      customStyles.textTransform = 'uppercase';
    } else if (lowerVariant === 'success' || lowerVariant === 'approved' || lowerVariant === 'completed') {
      customStyles.backgroundColor = '#dcfce7';
      customStyles.color = '#15803d';
      customStyles.boxShadow = 'none';
      customStyles.textTransform = 'uppercase';
    } else if (lowerVariant === 'info' || lowerVariant === 'available' || lowerVariant === 'low' || lowerVariant === 'low priority') {
      customStyles.backgroundColor = '#e0f2fe';
      customStyles.color = '#0369a1';
      customStyles.boxShadow = 'none';
      customStyles.textTransform = 'uppercase';
    }
  }

  return (
    <span 
      className={`${badgeClass} ${className}`} 
      style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', ...customStyles }}
      {...props}
    >
      {children}
    </span>
  );
}
