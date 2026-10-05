import React, { useState } from 'react';

/**
 * Standard 10-stage lifecycle mapping to 5-milestone tracker
 * 0: Reported -> 0 (Reported)
 * 1: Waiting for Volunteer -> 1 (Assigned)
 * 2: Volunteer Assigned -> 1 (Assigned)
 * 3: Volunteer En Route -> 2 (In Progress / En Route)
 * 4: Animal Rescued -> 3 (Treatment / Care)
 * 5: Treatment -> 3 (Treatment / Care)
 * 6: Recovery -> 3 (Treatment / Care)
 * 7: Ready for Adoption -> 4 (Safe / Adoption)
 * 8: Adopted -> 4 (Safe / Adoption)
 * 9: Completed -> 4 (Safe / Adoption)
 */
const TRACKER_MAPPING = [0, 1, 1, 2, 3, 3, 3, 4, 4, 4];

/**
 * Mini timeline progress bar for rescue cards
 */
export function MiniRescueTimeline({ statusStep = 0 }) {
  const step = Number(statusStep) || 0;
  const totalSteps = 10;
  const progressPercent = Math.min(100, Math.max(0, (step / (totalSteps - 1)) * 100));
  const activeMilestone = TRACKER_MAPPING[step] !== undefined ? TRACKER_MAPPING[step] : 0;

  const getStepClass = (index) => {
    if (index < activeMilestone) return 'mini-step completed';
    if (index === activeMilestone) return 'mini-step active';
    return 'mini-step';
  };

  return (
    <div className="mini-timeline">
      <div className="mini-timeline-progress" style={{ width: `${progressPercent}%` }}></div>

      <div className={getStepClass(0)}>
        <div className="mini-step-dot">
          <i className="ph ph-check"></i>
        </div>
        <span className="mini-step-label">Reported</span>
      </div>

      <div className={getStepClass(1)}>
        <div className="mini-step-dot">
          <i className="ph ph-check"></i>
        </div>
        <span className="mini-step-label">Assigned</span>
      </div>

      <div className={getStepClass(2)}>
        <div className="mini-step-dot">
          <i className="ph ph-path"></i>
        </div>
        <span className="mini-step-label">En-Route</span>
      </div>

      <div className={getStepClass(3)}>
        <div className="mini-step-dot">
          <i className="ph ph-first-aid"></i>
        </div>
        <span className="mini-step-label">Treatment</span>
      </div>

      <div className={getStepClass(4)}>
        <div className="mini-step-dot">
          <i className="ph ph-house"></i>
        </div>
        <span className="mini-step-label">Resolved</span>
      </div>
    </div>
  );
}

/**
 * Detailed 5-milestone progress stepper for Case Details
 */
export function DetailedProgressStepper({ statusStep = 0, caseItem = null }) {
  const [showTreatmentPopup, setShowTreatmentPopup] = useState(false);
  const step = Number(statusStep) || 0;
  const totalSteps = 10;
  const percent = Math.min(100, Math.max(0, (step / (totalSteps - 1)) * 100));
  const activeMilestone = TRACKER_MAPPING[step] !== undefined ? TRACKER_MAPPING[step] : 0;

  const getMilestoneState = (index) => {
    if (index < activeMilestone) return 'completed';
    if (index === activeMilestone) return 'active';
    return '';
  };

  return (
    <div className="progress-tracker">
      <div className="progress-line" style={{ width: `${percent}%` }}></div>

      {/* Step 1: Reported */}
      <div className="progress-step">
        <div className={`step-icon ${getMilestoneState(0)}`}>
          <i className="ph ph-check"></i>
        </div>
        <span className={`step-label ${getMilestoneState(0)}`}>Reported</span>
      </div>

      {/* Step 2: NGO Assigned */}
      <div className="progress-step">
        <div className={`step-icon ${getMilestoneState(1)}`}>
          <i className="ph ph-check"></i>
        </div>
        <span className={`step-label ${getMilestoneState(1)}`}>NGO Assigned</span>
      </div>

      {/* Step 3: In Progress */}
      <div className="progress-step">
        <div className={`step-icon ${getMilestoneState(2)}`}>
          <i className={activeMilestone > 2 ? 'ph ph-check' : 'ph ph-path'}></i>
        </div>
        <span className={`step-label ${getMilestoneState(2)}`}>In Progress</span>
      </div>

      {/* Step 4: Treatment */}
      <div
        className="progress-step"
        style={{ cursor: 'pointer', position: 'relative' }}
        onClick={() => setShowTreatmentPopup((prev) => !prev)}
      >
        <div className={`step-icon ${getMilestoneState(3)}`}>
          <i className={activeMilestone > 3 ? 'ph ph-check' : 'ph ph-first-aid'}></i>
        </div>
        <span className={`step-label ${getMilestoneState(3)}`}>Treatment</span>

        {/* Interactive Treatment Popup */}
        {showTreatmentPopup && (
          <div className="treatment-details" style={{ display: 'block' }}>
            <strong style={{ display: 'block', marginBottom: '8px', color: '#431407' }}>
              Treatment Progress
            </strong>
            <ul
              style={{
                listStyle: 'none',
                textAlign: 'left',
                padding: 0,
                margin: 0,
                display: 'flex',
                flexDirection: 'column',
                gap: '8px'
              }}
            >
              <li style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <i
                  className="ph-fill ph-check-circle"
                  style={{ color: 'var(--success-green, #10b981)', fontSize: '1.1rem' }}
                ></i>{' '}
                Vet Assigned
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <i
                  className={`ph ${step >= 5 ? 'ph-fill ph-check-circle' : 'ph-circle'}`}
                  style={{ color: step >= 5 ? 'var(--success-green, #10b981)' : 'inherit', fontSize: '1.1rem' }}
                ></i>{' '}
                Shelter Assigned
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <i
                  className={`ph ${step >= 6 ? 'ph-fill ph-check-circle' : 'ph-circle'}`}
                  style={{ color: step >= 6 ? 'var(--success-green, #10b981)' : 'inherit', fontSize: '1.1rem' }}
                ></i>{' '}
                Recovery Ongoing
              </li>
            </ul>
          </div>
        )}
      </div>

      {/* Step 5: Safe / Adoption */}
      <div className="progress-step">
        <div className={`step-icon ${getMilestoneState(4)}`}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <i className="ph ph-house-line" style={{ fontSize: '1.2rem', marginBottom: '-4px' }}></i>
            <span style={{ fontSize: '0.5rem', textTransform: 'uppercase' }}>Safe</span>
          </div>
        </div>
        <span className={`step-label ${getMilestoneState(4)}`}>Safe/Adoption</span>
      </div>
    </div>
  );
}

/**
 * Vertical audit log timeline rendering case.timeline
 */
export function VerticalTimeline({ timeline = [] }) {
  if (!timeline || timeline.length === 0) {
    return (
      <div style={{ padding: '16px 0', color: 'var(--text-muted, #9a3412)', fontSize: '0.9rem' }}>
        No timeline events logged yet.
      </div>
    );
  }

  return (
    <div className="timeline-vertical">
      {timeline.map((item, idx) => (
        <div className="timeline-item" key={idx}>
          <strong style={{ color: idx === 0 ? '#431407' : '#7c2d12' }}>{item.text}</strong>
          <span>{item.time || 'N/A'}</span>
        </div>
      ))}
    </div>
  );
}

export default {
  Mini: React.memo(MiniRescueTimeline),
  Stepper: React.memo(DetailedProgressStepper),
  Vertical: React.memo(VerticalTimeline)
};
