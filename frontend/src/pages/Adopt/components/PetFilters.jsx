import React from 'react';

export function PetFilters({ filters, onFilterChange, onResetFilters }) {
  return (
    <aside className="filters-sidebar card">
      <div className="filter-header">
        <h3><i className="ph ph-funnel"></i> Filters</h3>
      </div>

      {/* Species */}
      <div className="filter-group">
        <label htmlFor="filter-species-select" className="group-label">Species</label>
        <select
          id="filter-species-select"
          className="filter-select"
          value={filters.species}
          onChange={(e) => onFilterChange('species', e.target.value)}
        >
          <option value="all">All Species</option>
          <option value="dog">Dogs</option>
          <option value="cat">Cats</option>
        </select>
      </div>

      {/* Age Range */}
      <div className="filter-group">
        <label htmlFor="filter-age-select" className="group-label">Age Range</label>
        <select
          id="filter-age-select"
          className="filter-select"
          value={filters.age}
          onChange={(e) => onFilterChange('age', e.target.value)}
        >
          <option value="all">Any Age</option>
          <option value="puppy">Baby</option>
          <option value="young">Young</option>
          <option value="adult">Adult</option>
          <option value="senior">Senior</option>
        </select>
      </div>

      {/* Gender */}
      <div className="filter-group">
        <label htmlFor="filter-gender-select" className="group-label">Gender</label>
        <select
          id="filter-gender-select"
          className="filter-select"
          value={filters.gender}
          onChange={(e) => onFilterChange('gender', e.target.value)}
        >
          <option value="all">Any Gender</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
        </select>
      </div>

      {/* Size */}
      <div className="filter-group">
        <label className="group-label">Size</label>
        <div className="size-toggles">
          {['all', 'small', 'medium', 'large'].map((s) => (
            <button
              key={s}
              type="button"
              className={`size-btn ${filters.size === s ? 'active' : ''}`}
              onClick={() => onFilterChange('size', s)}
            >
              {s === 'all' ? 'All' : s === 'medium' ? 'Med' : s.charAt(0).toUpperCase() + s.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Special Categories */}
      <div className="filter-group">
        <label className="group-label">Special Categories</label>
        <label className="checkbox-label">
          <input
            type="checkbox"
            checked={filters.vaccinated}
            onChange={(e) => onFilterChange('vaccinated', e.target.checked)}
          />
          <span>Show only vaccinated</span>
        </label>
        <label className="checkbox-label">
          <input
            type="checkbox"
            checked={filters.urgent}
            onChange={(e) => onFilterChange('urgent', e.target.checked)}
          />
          <span>Foster needed</span>
        </label>
        <label className="checkbox-label">
          <input
            type="checkbox"
            checked={filters.specialNeeds}
            onChange={(e) => onFilterChange('specialNeeds', e.target.checked)}
          />
          <span>Special needs</span>
        </label>
        <label className="checkbox-label">
          <input
            type="checkbox"
            checked={filters.age === 'senior'}
            onChange={(e) => onFilterChange('age', e.target.checked ? 'senior' : 'all')}
          />
          <span>Senior pets</span>
        </label>
        <label className="checkbox-label">
          <input
            type="checkbox"
            checked={filters.savedOnly}
            onChange={(e) => onFilterChange('savedOnly', e.target.checked)}
          />
          <span style={{ color: 'var(--alert)', fontWeight: 500 }}>Saved / Favorites</span>
        </label>
      </div>

      {/* Distance */}
      <div className="filter-group">
        <label htmlFor="filter-distance-slider" className="group-label">Distance (km)</label>
        <input
          type="range"
          id="filter-distance-slider"
          min="1"
          max="50"
          value={filters.distance}
          className="distance-slider"
          onChange={(e) => onFilterChange('distance', Number(e.target.value))}
        />
        <div className="distance-labels">
          <span>1km</span>
          <span>{filters.distance}km</span>
        </div>
      </div>

      <button type="button" className="clear-filters-btn" onClick={onResetFilters}>
        Clear All Filters
      </button>
    </aside>
  );
}
