import React from 'react';
import PhotoUploader from './PhotoUploader.jsx';
import AIAnalysisCard from './AIAnalysisCard.jsx';
import AnimalSelector from './AnimalSelector.jsx';
import BreedSelector from './BreedSelector.jsx';
import IssueCategorySelector from './IssueCategorySelector.jsx';
import SeveritySelector from './SeveritySelector.jsx';
import SymptomsInput from './SymptomsInput.jsx';
import LocationPicker from './LocationPicker.jsx';
import ReporterInformation from './ReporterInformation.jsx';
import { Select } from '../../../components/ui';

export default function ReportForm({
  formValues,
  updateField,
  lastSaved,
  handleSaveDraft,
  onSubmitTrigger,
  errors = {}
}) {
  const getRelativeTimeStr = (timestamp) => {
    if (!timestamp) return 'No draft saved yet';
    const seconds = Math.floor((Date.now() - timestamp) / 1000);
    if (seconds < 10) return 'Draft saved just now';
    if (seconds < 60) return `Draft saved ${seconds}s ago`;
    return `Draft saved at ${new Date(timestamp).toLocaleTimeString()}`;
  };

  return (
    <div className="report-form card">
      {/* 1. Photo Uploader */}
      <PhotoUploader 
        value={formValues.photo}
        onChange={(val) => updateField('photo', val)}
        error={errors.photo}
      />

      {/* 2. AI Assist Preview */}
      <AIAnalysisCard show={!!formValues.photo} />

      {/* 3. Verified Animal Information */}
      <div className="form-section">
        <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--text-main)', marginBottom: '8px' }}>
          Verified Animal Information
        </h3>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: 0, marginBottom: '16px', fontWeight: 500 }}>
          Please verify the details below. These values will be used by responders.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '12px' }}>
          <AnimalSelector 
            value={formValues.animalType}
            onChange={(val) => updateField('animalType', val)}
            error={errors.animalType}
          />

          <BreedSelector 
            animalType={formValues.animalType}
            value={formValues.breed}
            onChange={(val) => updateField('breed', val)}
            error={errors.breed}
          />

          <Select
            label="Estimated Age *"
            value={formValues.estimatedAge}
            onChange={(e) => updateField('estimatedAge', e.target.value)}
            error={errors.estimatedAge}
          >
            <option value="" disabled>Select Estimated Age</option>
            <option value="Puppy / Kitten">Puppy / Kitten</option>
            <option value="Young">Young</option>
            <option value="Adult">Adult</option>
            <option value="Senior">Senior</option>
            <option value="Unknown">Unknown</option>
          </Select>

          <IssueCategorySelector 
            value={formValues.issueCategory}
            onChange={(val) => updateField('issueCategory', val)}
            error={errors.issueCategory}
          />

          <div style={{ gridColumn: 'span 2' }}>
            <SymptomsInput 
              value={formValues.observedCondition}
              onChange={(val) => updateField('observedCondition', val)}
              error={errors.observedCondition}
            />
          </div>
        </div>
      </div>

      {/* 4. Severity Cards */}
      <SeveritySelector 
        value={formValues.severity}
        onChange={(val) => updateField('severity', val)}
        error={errors.severity}
      />

      {/* 5. Location Details */}
      <LocationPicker 
        value={formValues.location}
        onChange={(val) => updateField('location', val)}
        error={errors.location}
      />

      {/* 6. Reporter Info */}
      <ReporterInformation 
        name={formValues.reporterName}
        phone={formValues.reporterPhone}
        email={formValues.reporterEmail}
        anonymous={formValues.anonymous}
        onChangeField={updateField}
        errors={errors}
      />

      {/* 7. Additional Toggle Options */}
      <div className="form-section">
        <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--text-main)', marginBottom: '16px' }}>
          Additional Options
        </h3>
        <div className="toggles-container">
          <label className="toggle-row" style={{ cursor: 'pointer' }}>
            <div className="toggle-info">
              <strong>Community Follow-Up</strong>
              <span>Allow local community members to contact you for details.</span>
            </div>
            <div className="toggle-switch">
              <input 
                type="checkbox" 
                checked={formValues.communityFollowUp}
                onChange={(e) => updateField('communityFollowUp', e.target.checked)}
              />
              <span className="slider"></span>
            </div>
          </label>

          <label className="toggle-row" style={{ cursor: 'pointer' }}>
            <div className="toggle-info">
              <strong>Possible Owned Pet</strong>
              <span>Animal appears to have a collar or looks well-groomed.</span>
            </div>
            <div className="toggle-switch">
              <input 
                type="checkbox" 
                checked={formValues.possibleOwned}
                onChange={(e) => updateField('possibleOwned', e.target.checked)}
              />
              <span className="slider"></span>
            </div>
          </label>

          <label className="toggle-row" style={{ cursor: 'pointer' }}>
            <div className="toggle-info">
              <strong>Reward Info</strong>
              <span>I want to offer a reward for safe rescue/return.</span>
            </div>
            <div className="toggle-switch">
              <input 
                type="checkbox" 
                checked={formValues.rewardOffer}
                onChange={(e) => updateField('rewardOffer', e.target.checked)}
              />
              <span className="slider"></span>
            </div>
          </label>
        </div>
      </div>

      {/* 8. Submission & Timeline Footer */}
      <div className="form-footer">
        <div className="what-happens-next">
          <h4 style={{ marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-main)', fontSize: '1.1rem' }}>
            <i className="ph-fill ph-info"></i> What Happens After Submission?
          </h4>
          <ul className="timeline" style={{ listStyle: 'none', paddingLeft: '14px', borderLeft: '2px solid var(--border)', marginLeft: '8px' }}>
            <li style={{ marginBottom: '16px', position: 'relative' }}>
              <span style={{ position: 'absolute', left: '-21px', top: '4px', width: '14px', height: '14px', borderRadius: '50%', background: 'var(--primary)', border: '3px solid var(--bg-alt)' }}></span>
              <strong style={{ color: 'var(--text-main)', display: 'block', marginBottom: '4px' }}>1. Broadcasting Alert</strong>
              <p className="text-sm" style={{ color: 'var(--text-muted)', margin: 0 }}>Your report is instantly sent to nearby verified volunteers and rescues.</p>
            </li>
            <li style={{ marginBottom: '16px', position: 'relative' }}>
              <span style={{ position: 'absolute', left: '-21px', top: '4px', width: '14px', height: '14px', borderRadius: '50%', background: 'var(--border)', border: '3px solid var(--bg-alt)' }}></span>
              <strong style={{ color: 'var(--text-main)', display: 'block', marginBottom: '4px' }}>2. Responder Acceptance</strong>
              <p className="text-sm" style={{ color: 'var(--text-muted)', margin: 0 }}>A responder accepts the case and provides an ETA to the location.</p>
            </li>
            <li style={{ position: 'relative' }}>
              <span style={{ position: 'absolute', left: '-21px', top: '4px', width: '14px', height: '14px', borderRadius: '50%', background: 'var(--border)', border: '3px solid var(--bg-alt)' }}></span>
              <strong style={{ color: 'var(--text-main)', display: 'block', marginBottom: '4px' }}>3. Rescue & Updates</strong>
              <p className="text-sm" style={{ color: 'var(--text-muted)', margin: 0 }}>Animal is secured and you receive a final status update.</p>
            </li>
          </ul>
        </div>

        <div className="form-actions">
          <div className="autosave-status">
            <i className="ph ph-check-circle"></i> {getRelativeTimeStr(lastSaved)}
          </div>
          <div className="action-buttons">
            <button type="button" className="btn-secondary" onClick={handleSaveDraft}>Save Draft</button>
            <button type="button" className="btn-primary" onClick={onSubmitTrigger} style={{ padding: '12px 32px', fontSize: '1.1rem' }}>
              Submit Report
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
