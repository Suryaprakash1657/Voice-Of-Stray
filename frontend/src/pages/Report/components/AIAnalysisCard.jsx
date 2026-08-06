import React from 'react';

export default function AIAnalysisCard({ show }) {
  if (!show) return null;

  return (
    <div className="ai-preview-card" style={{ marginTop: '16px' }}>
      <div className="ai-preview-header" style={{ display: 'flex', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 600, color: 'var(--primary)' }}>
          <i className="ph-fill ph-sparkle"></i> AI Assist Analysis
        </div>
        <span style={{ fontSize: '0.75rem', fontWeight: 'normal', marginLeft: 'auto', color: 'var(--text-muted)', opacity: 0.8 }}>
          *AI may not be 100% accurate
        </span>
      </div>
      <div className="ai-preview-content">
        <div className="ai-detected-item" style={{ marginBottom: '12px' }}>
          <span className="ai-label" style={{ fontWeight: 500, color: 'var(--text-muted)', marginRight: '8px' }}>Detected Animal:</span>
          <strong style={{ color: 'var(--text-main)' }}>Dog (Golden Retriever Mix)</strong>
        </div>
        <div className="ai-detected-item">
          <span className="ai-label" style={{ fontWeight: 500, color: 'var(--text-muted)', marginRight: '8px' }}>Possible Condition:</span>
          <strong style={{ color: 'var(--alert)' }}>Injured Hind Leg, Malnourished</strong>
        </div>
      </div>
    </div>
  );
}
