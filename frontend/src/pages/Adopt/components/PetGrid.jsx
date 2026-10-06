import React from 'react';
import { PetCard } from './PetCard';
import { EmptyAdoptionState } from './EmptyAdoptionState';

export function PetGrid({
  pets = [],
  savedPets = [],
  onToggleFavorite,
  onResetFilters,
  currentPage = 1,
  totalPages = 1,
  onPageChange,
  totalPets = 0,
  sortBy,
  onSortChange
}) {
  return (
    <div className="pet-grid-container">
      {/* Sort Header */}
      <div className="sort-header">
        <span className="results-count">
          Showing <strong>{totalPets}</strong> pets ready for adoption
        </span>
        <div className="sort-controls">
          <label htmlFor="pet-sort-select">Sort By:</label>
          <select
            id="pet-sort-select"
            className="sort-select"
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value)}
          >
            <option value="nearest">Nearest Location</option>
            <option value="newest">Newest Arrivals</option>
            <option value="featured">Most Urgent</option>
            <option value="age-young">Age: Young to Old</option>
          </select>
        </div>
      </div>

      {pets.length === 0 ? (
        <EmptyAdoptionState
          type="no-results"
          title="No stray companions found"
          message="We couldn't find any adoptable pets matching your current filters. Try resetting your filters."
          actionText="Clear All Filters"
          onAction={onResetFilters}
        />
      ) : (
        <>
          <div className="pet-grid">
            {pets.map((pet) => (
              <PetCard
                key={pet.id || pet.slug}
                pet={pet}
                isFavorite={savedPets.includes(pet.id)}
                onToggleFavorite={onToggleFavorite}
              />
            ))}
          </div>

          {totalPages > 1 && (
            <div className="pagination" style={{ margin: '40px auto 0' }}>
              <button
                type="button"
                className="page-btn"
                disabled={currentPage <= 1}
                onClick={() => onPageChange(currentPage - 1)}
                aria-label="Previous page"
              >
                <i className="ph ph-caret-left"></i>
              </button>
              {Array.from({ length: totalPages }, (_, idx) => idx + 1).map((pageNum) => (
                <button
                  key={pageNum}
                  type="button"
                  className={`page-btn ${pageNum === currentPage ? 'active' : ''}`}
                  onClick={() => onPageChange(pageNum)}
                >
                  {pageNum}
                </button>
              ))}
              <button
                type="button"
                className="page-btn next"
                disabled={currentPage >= totalPages}
                onClick={() => onPageChange(currentPage + 1)}
                aria-label="Next page"
              >
                <i className="ph ph-caret-right"></i>
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
