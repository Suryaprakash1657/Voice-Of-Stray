import React from 'react';
import OpportunityCard from './OpportunityCard.jsx';
import EmptyVolunteerState from './EmptyVolunteerState.jsx';

export function VolunteerOpportunities({
  opportunities = [],
  filter = 'all',
  onFilterChange,
  onAcceptOpportunity,
  onOpenDetails,
  isNgo = false,
  onAddTask
}) {
  const filterOptions = [
    { key: 'all', label: 'All Needs' },
    { key: 'rescue', label: 'Rescue' },
    { key: 'foster', label: 'Foster' },
    { key: 'feeding', label: 'Feeding Drive' }
  ];

  return (
    <section className="fade-in">
      <div className="section-header-split" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div className="header-text">
          <h2>Volunteer Opportunities</h2>
          <p>Real-time help needed in your area.</p>
        </div>
        {isNgo && (
          <button
            type="button"
            className="btn-add-task"
            onClick={onAddTask}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '10px 22px',
              backgroundColor: 'var(--primary, #f97316)',
              color: '#ffffff',
              borderRadius: '9999px',
              fontWeight: 700,
              fontSize: '0.95rem',
              border: 'none',
              cursor: 'pointer',
              boxShadow: '0 4px 14px rgba(249, 115, 22, 0.3)',
              transition: 'all 0.2s ease'
            }}
          >
            <i className="ph-bold ph-plus" style={{ fontSize: '1.1rem' }}></i>
            Add Task
          </button>
        )}
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
