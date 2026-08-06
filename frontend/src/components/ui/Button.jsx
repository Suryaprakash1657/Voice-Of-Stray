import React from 'react';
import LoadingSpinner from './LoadingSpinner.jsx';

export default function Button({
  variant = 'primary',
  size = 'md',
  icon = null,
  iconPosition = 'left',
  isLoading = false,
  disabled = false,
  onClick,
  children,
  className = '',
  type = 'button',
  ...props
}) {
  // Determine standard classes from the styles.css sheets
  let baseClass = '';
  
  if (size === 'lg') {
    baseClass = 'btn-premium';
    if (variant === 'secondary') {
      baseClass += ' secondary';
    } else {
      baseClass += ' primary';
    }
  } else {
    if (variant === 'secondary') {
      baseClass = 'btn-secondary';
    } else {
      baseClass = 'btn-primary';
    }
  }

  // Custom inline styling extending standard buttons for special states/variants
  const inlineStyles = {};
  if (variant === 'outline') {
    baseClass = 'btn-secondary';
    inlineStyles.background = 'transparent';
    inlineStyles.border = '1px solid var(--border)';
    inlineStyles.color = 'var(--text-muted)';
    inlineStyles.boxShadow = 'none';
  } else if (variant === 'danger') {
    baseClass = 'btn-primary';
    inlineStyles.backgroundColor = 'var(--alert)';
    inlineStyles.color = 'white';
    inlineStyles.boxShadow = '0 4px 12px rgba(239, 68, 68, 0.2)';
  } else if (variant === 'success') {
    baseClass = 'btn-primary';
    inlineStyles.backgroundColor = 'var(--secondary)';
    inlineStyles.color = 'white';
    inlineStyles.boxShadow = '0 4px 12px rgba(20, 184, 166, 0.2)';
  }

  if (disabled || isLoading) {
    inlineStyles.opacity = 0.6;
    inlineStyles.cursor = 'not-allowed';
    inlineStyles.transform = 'none';
    inlineStyles.boxShadow = 'none';
  }

  return (
    <button
      type={type}
      className={`${baseClass} ${className}`}
      style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '8px', ...inlineStyles }}
      onClick={!disabled && !isLoading ? onClick : undefined}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading && (
        <LoadingSpinner 
          size="sm" 
          color={variant === 'secondary' || variant === 'outline' ? 'var(--text-muted)' : 'white'} 
        />
      )}
      {!isLoading && icon && iconPosition === 'left' && (
        <span className="btn-icon" style={{ display: 'inline-flex', alignItems: 'center' }}>{icon}</span>
      )}
      {children}
      {!isLoading && icon && iconPosition === 'right' && (
        <span className="btn-icon" style={{ display: 'inline-flex', alignItems: 'center' }}>{icon}</span>
      )}
    </button>
  );
}
