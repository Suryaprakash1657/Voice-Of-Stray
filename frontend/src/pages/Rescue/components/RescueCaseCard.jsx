import React from 'react';
import RescueStatusBadge from './RescueStatusBadge.jsx';
import { MiniRescueTimeline } from './RescueTimeline.jsx';

export function RescueCaseCard({
  caseItem,
  onTrackRescue = () => {},
  isHighlighted = false
}) {
  if (!caseItem) return null;

  const severity = caseItem.severity || caseItem.priority || 'Normal';
  const breedVal = caseItem.breed || caseItem.breedDesc || 'Other / Unknown';
  const animalType = caseItem.animalType || 'Animal';
  const displayTitle =
    caseItem.condition || caseItem.observedCondition || `${animalType} (${breedVal})`;
  const locationText = caseItem.location || 'Unknown Location';
  const ngoName = caseItem.team?.ngo || 'Paws Haven NGO';
  const currentStatus = caseItem.status || 'NGO Accepted';
  const reportedTime = caseItem.reportedTime || 'N/A';

  const cardStyle = isHighlighted
    ? {
        borderColor: '#f97316',
        boxShadow: '0 0 20px rgba(249, 115, 22, 0.25)'
      }
    : {};

  return (
    <div className="live-rescue-card" style={cardStyle} id={`rescue-card-${caseItem.id}`}>
      {/* Header Row */}
      <div className="card-header-row">
        <span className="card-id-badge">
          <span className="live-dot-red"></span> #RSC-{caseItem.id}
        </span>
        <RescueStatusBadge type="severity" value={severity} />
      </div>

      {/* Case Condition / Animal Title */}
      <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#431407', margin: '4px 0' }}>
        {displayTitle}
      </h3>

      {/* Details 3-column Grid */}
      <div className="card-body-details">
        <div className="card-info-item">
          <span className="card-info-label">Location</span>
          <span className="card-info-value">
            <i className="ph ph-map-pin" style={{ color: '#ef4444', marginRight: '4px' }}></i>
            {locationText}
          </span>
        </div>

        <div className="card-info-item">
          <span className="card-info-label">NGO Assigned</span>
          <span className="card-info-value">{ngoName}</span>
        </div>

        <div className="card-info-item">
          <span className="card-info-label">Current Status</span>
          <span className="card-info-value" style={{ color: '#3b82f6', fontWeight: 700 }}>
            {currentStatus}
          </span>
        </div>
      </div>

      {/* Inline Mini Timeline Progress */}
      <MiniRescueTimeline statusStep={caseItem.statusStep} />

      {/* Footer Row */}
      <div className="card-footer-row">
        <span className="time-eta">
          <i className="ph ph-clock"></i> Reported {reportedTime}
        </span>
        <button
          className="btn-track track-rescue-btn"
          onClick={() => onTrackRescue(caseItem)}
          data-id={`RSC-${caseItem.id}`}
        >
          Track Rescue <i className="ph ph-arrow-right"></i>
        </button>
      </div>
    </div>
  );
}

export default React.memo(RescueCaseCard);
