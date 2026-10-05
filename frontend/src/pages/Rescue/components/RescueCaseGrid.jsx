import React from 'react';
import RescueCaseCard from './RescueCaseCard.jsx';
import EmptyRescueState from './EmptyRescueState.jsx';

export function RescueCaseGrid({
  cases = [],
  onTrackRescue = () => {},
  onResetFilter = () => {},
  currentFilter = 'all',
  highlightedId = null
}) {
  if (!cases || cases.length === 0) {
    return <EmptyRescueState filterName={currentFilter} onResetFilter={onResetFilter} />;
  }

  return (
    <div className="cards-list" id="rescue-cards-list">
      {cases.map((caseItem) => {
        const isHighlighted =
          highlightedId &&
          String(highlightedId).replace(/^RSC-/, '') === String(caseItem.id);

        return (
          <RescueCaseCard
            key={caseItem.id}
            caseItem={caseItem}
            onTrackRescue={onTrackRescue}
            isHighlighted={isHighlighted}
          />
        );
      })}
    </div>
  );
}

export default React.memo(RescueCaseGrid);
