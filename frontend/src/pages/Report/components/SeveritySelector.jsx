import React from 'react';

export default function SeveritySelector({ value, onChange, error }) {
  const options = [
    {
      key: 'low',
      label: 'Low',
      icon: 'ph-fill ph-info',
      desc: 'Safe but needs food or shelter. Not in immediate danger.'
    },
    {
      key: 'urgent',
      label: 'Urgent',
      icon: 'ph-fill ph-warning',
      desc: 'Lost, trapped, or showing signs of sickness. Needs help soon.'
    },
    {
      key: 'emergency',
      label: 'Emergency',
      icon: 'ph-fill ph-warning-circle',
      desc: 'Severe injury, abuse, or imminent life-threatening danger.'
    }
  ];

  return (
    <div className="form-section" style={{ width: '100%' }}>
      <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--text-main)', marginBottom: '16px' }}>
        Severity Level <span style={{ color: 'var(--alert)' }}>*</span>
      </h3>
      <div className="severity-grid">
        {options.map((opt) => {
          const isSelected = value === opt.key;
          return (
            <label key={opt.key} className={`severity-card ${opt.key} ${isSelected ? 'selected' : ''}`} style={{ cursor: 'pointer' }}>
              <input 
                type="radio" 
                name="severity" 
                value={opt.key} 
                checked={isSelected}
                onChange={() => onChange(opt.key)}
                style={{ display: 'none' }}
              />
              <div className="severity-card-content">
                <i className={opt.icon}></i>
                <h4>{opt.label}</h4>
                <p>{opt.desc}</p>
              </div>
            </label>
          );
        })}
      </div>
      {error && (
        <span style={{ fontSize: '0.8rem', color: 'var(--alert)', fontWeight: 500, display: 'block', marginTop: '8px' }}>
          {error}
        </span>
      )}
      <style>{`
        .severity-card.selected {
          border-color: var(--primary);
          background: rgba(249, 115, 22, 0.05);
          box-shadow: 0 0 0 3px var(--primary-light);
        }
        .severity-card.low.selected {
          border-color: #3b82f6;
          background: rgba(59, 130, 246, 0.05);
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.15);
        }
        .severity-card.urgent.selected {
          border-color: #f59e0b;
          background: rgba(245, 158, 11, 0.05);
          box-shadow: 0 0 0 3px rgba(245, 158, 11, 0.15);
        }
        .severity-card.emergency.selected {
          border-color: var(--alert);
          background: rgba(239, 68, 68, 0.05);
          box-shadow: 0 0 0 3px var(--alert-light);
        }
      `}</style>
    </div>
  );
}
