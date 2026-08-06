import React from 'react';
import { Badge } from '../../../components/ui';

export default function ReviewSummary({ formValues }) {
  const {
    photo,
    animalType,
    breed,
    estimatedAge,
    issueCategory,
    observedCondition,
    severity,
    location,
    reporterName,
    reporterPhone,
    reporterEmail,
    anonymous,
    communityFollowUp,
    possibleOwned,
    rewardOffer
  } = formValues;

  const severityBadges = {
    low: <Badge variant="feeding">Low</Badge>,
    urgent: <Badge variant="rescue">Urgent</Badge>,
    emergency: <Badge variant="alert">Emergency</Badge>
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', color: 'var(--text-main)', fontSize: '0.95rem' }}>
      {photo && (
        <div style={{ width: '100%', maxHeight: '180px', borderRadius: '8px', overflow: 'hidden', border: '1px solid var(--border)' }}>
          <img src={photo} alt="Stray preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', borderBottom: '1px solid var(--border)', paddingBottom: '12px' }}>
        <div>
          <span style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>ANIMAL & BREED</span>
          <strong>{animalType} ({breed})</strong>
        </div>
        <div>
          <span style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>ESTIMATED AGE</span>
          <strong>{estimatedAge}</strong>
        </div>
        <div>
          <span style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>ISSUE CATEGORY</span>
          <strong>{issueCategory}</strong>
        </div>
        <div>
          <span style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>SEVERITY LEVEL</span>
          <div style={{ marginTop: '4px' }}>{severityBadges[severity] || severity}</div>
        </div>
      </div>

      <div style={{ borderBottom: '1px solid var(--border)', paddingBottom: '12px' }}>
        <span style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>OBSERVED CONDITION</span>
        <p style={{ margin: '4px 0 0 0', lineHeight: 1.4 }}>{observedCondition}</p>
      </div>

      <div style={{ borderBottom: '1px solid var(--border)', paddingBottom: '12px' }}>
        <span style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>LOCATION ADDRESS</span>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '4px', fontWeight: 500 }}>
          <i className="ph ph-map-pin" style={{ color: 'var(--primary)' }}></i> {location}
        </div>
      </div>

      <div style={{ borderBottom: '1px solid var(--border)', paddingBottom: '12px' }}>
        <span style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>REPORTER DETAILS</span>
        {anonymous ? (
          <div style={{ marginTop: '4px', fontStyle: 'italic', color: 'var(--text-muted)', fontWeight: 500 }}>
            <i className="ph ph-eye-slash"></i> Anonymous Submission Selected
          </div>
        ) : (
          <div style={{ marginTop: '4px', display: 'flex', flexDirection: 'column', gap: '4px', fontWeight: 500 }}>
            <div>Name: {reporterName}</div>
            <div>Phone: {reporterPhone}</div>
            <div>Email: {reporterEmail}</div>
          </div>
        )}
      </div>

      <div>
        <span style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>ADDITIONAL OPTIONS SELECTED</span>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '6px' }}>
          {communityFollowUp && <Badge variant="adoption">Community Follow-Up Allowed</Badge>}
          {possibleOwned && <Badge variant="rescue">Possible Owned Pet</Badge>}
          {rewardOffer && <Badge variant="alert">Reward Offered</Badge>}
        </div>
      </div>
    </div>
  );
}
