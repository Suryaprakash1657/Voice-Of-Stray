import React from 'react';

export function PetSearch({
  searchQuery,
  onSearchChange,
  sortBy,
  onSortChange,
  totalCount,
  onToggleMobileFilters,
  isMobileFilterOpen
}) {
  return (
    <div className="pet-search-toolbar">
      <div className="search-input-box">
        <i className="fa-solid fa-magnifying-glass search-icon"></i>
        <input
          type="text"
          className="search-input"
          placeholder="Search by name, breed, location (e.g., Charlie, Indie, Bandra)..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          aria-label="Search adoptable pets"
        />
        {searchQuery && (
          <button
            type="button"
            className="search-clear-btn"
            onClick={() => onSearchChange('')}
            aria-label="Clear search"
          >
            <i className="fa-solid fa-xmark"></i>
          </button>
        )}
      </div>

      <div className="toolbar-actions">
        <button
          type="button"
          className={`mobile-filter-toggle ${isMobileFilterOpen ? 'active' : ''}`}
          onClick={onToggleMobileFilters}
        >
          <i className="fa-solid fa-sliders"></i>
          <span>Filters</span>
        </button>

        <div className="sort-selector">
          <label htmlFor="pet-sort-select" className="sort-label">Sort by:</label>
          <select
            id="pet-sort-select"
            className="sort-select"
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value)}
          >
            <option value="featured">Featured / Urgent First</option>
            <option value="newest">Newest Rescues</option>
            <option value="age-young">Youngest First</option>
            <option value="age-old">Oldest First</option>
            <option value="nearest">Nearest Location</option>
          </select>
        </div>
      </div>
    </div>
  );
}
