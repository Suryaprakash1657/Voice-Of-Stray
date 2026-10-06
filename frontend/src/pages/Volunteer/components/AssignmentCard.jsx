import React from 'react';
import { useNavigate } from 'react-router-dom';

export function AssignmentCard({ caseItem, onViewDetails }) {
  const navigate = useNavigate();

  if (!caseItem) return null;

  let statusPillClass = 'assigned';
  if (caseItem.status === 'Waiting for Volunteer' || caseItem.status === 'Reported') {
    statusPillClass = 'pending';
  } else if (
    caseItem.status === 'Volunteer Assigned' ||
    caseItem.status === 'Volunteer En Route' ||
    caseItem.status === 'Animal Rescued' ||
    caseItem.status === 'Treatment' ||
    caseItem.status === 'Recovery' ||
    caseItem.status === 'Ready for Adoption'
  ) {
    statusPillClass = 'active';
  }

  const roleDisplay = caseItem.assignedVolunteerRole || 'Volunteer Lead';
  const assignedDate = caseItem.assignedAt || 'N/A';
  const ngoName = caseItem.team?.ngo || 'Paws Haven NGO';

  return (
    <div className="active-item">
      <div className="active-item-left">
        <div
          className="active-item-icon rescue"
          style={{ background: 'rgba(249, 115, 22, 0.08)', color: '#ea580c' }}
        >
          <i className="ph-fill ph-ambulance"></i>
        </div>
        <div className="active-item-info">
          <h5 style={{ fontWeight: 800, color: '#1e293b', fontSize: '0.95rem', margin: '0 0 4px 0' }}>
            #RSC-{caseItem.id} - {caseItem.animal}
          </h5>
          <p style={{ margin: 0, fontSize: '0.82rem', color: 'var(--text-muted, #64748b)', lineHeight: 1.5 }}>
            <strong>Location:</strong> {caseItem.location} &bull;{' '}
            <strong>NGO:</strong> {ngoName} &bull;{' '}
            <strong>Role:</strong> {roleDisplay} &bull;{' '}
            <strong>Assigned:</strong> {assignedDate}
          </p>
        </div>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <span className={`status-pill ${statusPillClass}`}>{caseItem.status}</span>
        {onViewDetails ? (
          <button className="btn-view-details" onClick={() => onViewDetails(caseItem)}>
            View Details
          </button>
        ) : (
          <button
            className="btn-view-details"
            onClick={() => navigate(`/rescue?id=RSC-${caseItem.id}`)}
          >
            View Case
          </button>
        )}
      </div>
    </div>
  );
}

export default AssignmentCard;
