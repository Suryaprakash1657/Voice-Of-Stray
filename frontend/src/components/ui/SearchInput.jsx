import React from 'react';

export default function SearchInput({
  value,
  onChange,
  onClear,
  placeholder = 'Search...',
  className = '',
  ...props
}) {
  const showClear = value && typeof onClear === 'function';

  return (
    <div className={`community-search-container ${className}`}>
      <input
        type="text"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        style={showClear ? { paddingRight: '50px' } : undefined}
        {...props}
      />
      <i className="ph ph-magnifying-glass search-icon"></i>
      {showClear && (
        <button 
          type="button" 
          className="search-clear-btn" 
          onClick={onClear}
          aria-label="Clear search input"
        >
          <i className="ph ph-x"></i>
        </button>
      )}
    </div>
  );
}
