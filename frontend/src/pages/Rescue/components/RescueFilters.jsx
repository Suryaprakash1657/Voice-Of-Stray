import React from 'react';
import SearchInput from '../../../components/ui/SearchInput.jsx';

const FILTER_TABS = [
  { id: 'all', label: 'All Missions' },
  { id: 'emergency', label: 'Emergency' },
  { id: 'in-progress', label: 'In Progress' },
  { id: 'treatment', label: 'Treatment' },
  { id: 'recovery', label: 'Recovery' },
  { id: 'resolved', label: 'Resolved' }
];

export function RescueFilters({
  activeFilter = 'all',
  onFilterChange = () => {},
  searchQuery = '',
  onSearchChange = () => {}
}) {
  return (
    <section className="filter-section">
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', width: '100%', maxWidth: '750px' }}>
        <div className="filter-tabs-dark">
          {FILTER_TABS.map((tab) => (
            <button
              key={tab.id}
              className={`filter-tab-dark ${activeFilter === tab.id ? 'active' : ''}`}
              onClick={() => onFilterChange(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {searchQuery !== undefined && (
          <div style={{ maxWidth: '360px', marginTop: '4px' }}>
            <SearchInput
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search by ID, location, animal..."
            />
          </div>
        )}
      </div>

      <div style={{ fontSize: '0.88rem', color: '#9a3412', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px' }}>
        <i className="ph ph-clock" style={{ color: '#f97316' }}></i> Auto-updating live feed
      </div>
    </section>
  );
}

export default React.memo(RescueFilters);
