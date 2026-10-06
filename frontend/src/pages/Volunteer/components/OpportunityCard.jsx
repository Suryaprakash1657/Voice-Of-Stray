import React, { useState } from 'react';

export function OpportunityCard({ opportunity, onAccept, onOpenDetails, isAccepting = false }) {
  const [accepted, setAccepted] = useState(false);

  const handleAcceptClick = (e) => {
    e.stopPropagation();
    if (accepted || isAccepting) return;
    
    setAccepted(true);
    if (onAccept) {
      onAccept(opportunity.id);
    }

    setTimeout(() => {
      setAccepted(false);
    }, 3000);
  };

  const isUrgent = opportunity.urgent || opportunity.category === 'rescue' || (opportunity.tagClass === 'rescue');

  return (
    <div
      className="opp-card hover-lift"
      data-category={opportunity.category || opportunity.tagClass || 'all'}
      onClick={() => onOpenDetails && onOpenDetails(opportunity)}
      style={{ cursor: onOpenDetails ? 'pointer' : 'default' }}
    >
      <div className="opp-header">
        <span className={`opp-badge ${isUrgent ? 'badge-urgent' : 'badge-normal'}`}>
          {opportunity.tag || 'Volunteer Task'}
        </span>
        {isUrgent ? (
          <i className="ph-fill ph-warning-circle" style={{ color: '#ef4444', fontSize: '1.4rem' }}></i>
        ) : opportunity.tagClass === 'foster' ? (
          <i className="ph-fill ph-house" style={{ color: '#3b82f6', fontSize: '1.4rem' }}></i>
        ) : (
          <i className="ph-fill ph-bone" style={{ color: '#f97316', fontSize: '1.4rem' }}></i>
        )}
      </div>

      <h3 className="opp-title">{opportunity.title}</h3>

      <div className="opp-details">
        <div className="opp-detail-row">
          <i className="ph-fill ph-map-pin"></i>
          <span>{opportunity.location}</span>
        </div>
        <div className="opp-detail-row">
          <i className="ph-fill ph-clock"></i>
          <span>{opportunity.time}</span>
        </div>
        <div className="opp-detail-row">
          <i className="ph-fill ph-buildings"></i>
          <span>{opportunity.ngo || 'Voice of Stray'}</span>
        </div>
      </div>

      <div className="opp-footer">
        <span className="volunteers-needed">{opportunity.volunteersNeeded || 'Open for Volunteers'}</span>
        <button
          className="btn-accept"
          style={{
            background: accepted ? '#10b981' : opportunity.tagClass === 'foster' ? '#3b82f6' : '#f97316',
            transition: 'all 0.25s ease'
          }}
          onClick={handleAcceptClick}
        >
          {accepted ? 'Accepted!' : 'Accept Task'}
        </button>
      </div>
    </div>
  );
}

export default OpportunityCard;
