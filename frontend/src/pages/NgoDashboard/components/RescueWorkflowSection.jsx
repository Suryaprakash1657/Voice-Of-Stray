import React from 'react';

export default function RescueWorkflowSection() {
  const steps = [
    { label: 'Reported', icon: 'ph-fill ph-camera', active: true },
    { label: 'Accepted', icon: 'ph-fill ph-warning-circle', active: true },
    { label: 'Team Assigned', icon: 'ph-fill ph-user-check', active: true },
    { label: 'Rescued', icon: 'ph-fill ph-ambulance', active: false },
    { label: 'Treatment', icon: 'ph-fill ph-first-aid-kit', active: false },
    { label: 'Recovery', icon: 'ph-fill ph-heart', active: false },
    { label: 'Completed', icon: 'ph-fill ph-check-circle', active: false }
  ];

  return (
    <section className="glass-card" style={{ padding: '24px 24px 8px 24px' }}>
      <div className="ops-section-header">
        <span className="ops-section-title">
          <i className="ph-fill ph-clock-counter-clockwise"></i>
          <span>Visual Rescue Operations Lifecycle Workflow</span>
        </span>
      </div>
      <div className="workflow-body-container" style={{ padding: '16px 0' }}>
        <div className="workflow-card-body">
          {steps.map((step, idx) => (
            <div key={idx} className={`workflow-step ${step.active ? 'active' : ''}`}>
              <div className="workflow-step-icon">
                <i className={step.icon}></i>
              </div>
              <h5>{step.label}</h5>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
