import React from 'react';

export default function Avatar({ src, alt = 'User', size = 'md', className = '', onClick, ...props }) {
  let sizeClass = '';
  const inlineStyles = {};

  if (size === 'sm') {
    sizeClass = 'avatar-sm';
  } else if (size === 'lg') {
    sizeClass = 'avatar';
  } else {
    // For size 'md' (standard 40px used in navigation blocks)
    inlineStyles.width = '40px';
    inlineStyles.height = '40px';
    inlineStyles.borderRadius = 'var(--radius-full)';
    inlineStyles.objectFit = 'cover';
  }

  const isClickable = typeof onClick === 'function';
  if (isClickable) {
    inlineStyles.cursor = 'pointer';
  }

  // Auto-generate high contrast avatar fallback using the name
  const fallbackSrc = `https://ui-avatars.com/api/?name=${encodeURIComponent(alt)}&background=f97316&color=fff&bold=true`;

  return (
    <img 
      src={src || fallbackSrc} 
      alt={alt} 
      className={`${sizeClass} ${className}`}
      style={{ display: 'block', ...inlineStyles }}
      onClick={onClick}
      {...props}
    />
  );
}
