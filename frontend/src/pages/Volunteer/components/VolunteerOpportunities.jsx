import React from 'react';
import OpportunityCard from './OpportunityCard.jsx';
import EmptyVolunteerState from './EmptyVolunteerState.jsx';

export function VolunteerOpportunities({
  opportunities = [],
  filter = 'all',
  onFilterChange,
  onAcceptOpportunity,
  onOpenDetails
}) {
  const filterOptions = [
    { key: 'all', label: 'All Needs' },
    { key: 'rescue', label: 'Rescue' },
    { key: 'foster', label: 'Foster' },
    { key: 'feeding', label: 'Feeding Drive' }
  ];

  return (
    <section className="fade-in">
      <div className="section-header-split">
        <div className="header-text">
          <h2>Volunteer Opportunities</h2>
          <p>Real-time help needed in your area.</p>
        </div>
      </div>

      <div className="opportunities-filter">
        {filterOptions.map(opt => (
          <button
            key={opt.key}
            className={`filter-btn ${filter === opt.key ? 'active' : ''}`}
            onClick={() => onFilterChange && onFilterChange(opt.key)}
          >
            {opt.label}
          </button>
        ))}
      </div>

      {opportunities.length === 0 ? (
        <EmptyVolunteerState
          icon="ph-map-pin-line"
          title="No opportunities found"
          description={`No opportunities matching "${filter}" are currently listed. Please check back soon.`}
        />
      ) : (
        <div className="opportunities-grid">
          {opportunities.map(opp => (
            <OpportunityCard
              key={opp.id}
              opportunity={opp}
              onAccept={onAcceptOpportunity}
              onOpenDetails={onOpenDetails}
            />
          ))}
        </div>
      )}
    </section>
  );
}

export default VolunteerOpportunities;
