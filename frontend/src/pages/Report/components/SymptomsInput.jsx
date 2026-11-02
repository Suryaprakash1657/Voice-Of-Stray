import React, { useState, useEffect } from 'react';
import { describeConditionWithAI } from '../services/aiConditionService.js';

export default function SymptomsInput({ value, onChange, error, photo }) {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [aiMessage, setAiMessage] = useState(null);
  const [aiMessageType, setAiMessageType] = useState('info'); // 'info' | 'warning' | 'error' | 'success'
  const [analyzedPhoto, setAnalyzedPhoto] = useState(null);
  const [photoChangedAfterAI, setPhotoChangedAfterAI] = useState(false);

  // Detect if user replaced photo after an AI description was generated
  useEffect(() => {
    if (analyzedPhoto && photo && analyzedPhoto !== photo) {
      setPhotoChangedAfterAI(true);
    } else if (analyzedPhoto && !photo) {
      setPhotoChangedAfterAI(true);
    } else {
      setPhotoChangedAfterAI(false);
    }
  }, [photo, analyzedPhoto]);

  const handleDescribeCondition = async () => {
    if (isAnalyzing) return;

    // 1. Check whether an animal photo has been selected or uploaded
    if (!photo || (typeof photo === 'string' && !photo.trim())) {
      setAiMessage('Please upload or take an animal photo first before requesting an AI description.');
      setAiMessageType('warning');
      return;
    }

    setIsAnalyzing(true);
    setAiMessage(null);

    try {
      const result = await describeConditionWithAI(photo);

      if (result.success && result.description) {
        onChange(result.description);
        setAnalyzedPhoto(photo);
        setPhotoChangedAfterAI(false);
        setAiMessage('✨ AI description generated! You can review and edit the text below.');
        setAiMessageType('success');
      } else {
        setAiMessage(result.error || 'Unable to analyze image. Please describe the condition manually below.');
        setAiMessageType('error');
      }
    } catch (err) {
      setAiMessage('An unexpected error occurred during AI analysis. Manual entry is available below.');
      setAiMessageType('error');
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="symptoms-input-wrapper" style={{ width: '100%' }}>
      {/* 1. Row with Observed Condition Heading & AI Assist Button */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '8px',
          marginBottom: '8px'
        }}
      >
        <label
          htmlFor="observed-condition-textarea"
          style={{
            fontSize: '0.9rem',
            fontWeight: 600,
            color: 'var(--text-main, #1e293b)',
            margin: 0
          }}
        >
          Observed Condition <span style={{ color: 'var(--alert, #ef4444)' }}>*</span>
        </label>

        <button
          type="button"
          id="btn-describe-condition-ai"
          className="btn-ai-assist"
          onClick={handleDescribeCondition}
          disabled={isAnalyzing}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            padding: '6px 14px',
            borderRadius: '9999px',
            border: '1px solid #fed7aa',
            background: isAnalyzing ? '#ffedd5' : 'linear-gradient(135deg, #fff7ed 0%, #ffedd5 100%)',
            color: '#c2410c',
            fontSize: '0.825rem',
            fontWeight: 700,
            cursor: isAnalyzing ? 'not-allowed' : 'pointer',
            transition: 'all 0.2s ease',
            boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
          }}
          title="Analyze the uploaded photo to suggest observed conditions"
        >
          {isAnalyzing ? (
            <>
              <i className="ph-bold ph-spinner ph-spin"></i> Analyzing Photo...
            </>
          ) : (
            <>✨ Describe Condition with AI</>
          )}
        </button>
      </div>

      {/* 2. Status / Error Message Banner */}
      {aiMessage && (
        <div
          role="alert"
          style={{
            padding: '8px 12px',
            borderRadius: '8px',
            marginBottom: '10px',
            fontSize: '0.825rem',
            lineHeight: 1.45,
            background: aiMessageType === 'error' ? '#fef2f2' : aiMessageType === 'warning' ? '#fffbeb' : '#f0fdf4',
            border: `1px solid ${aiMessageType === 'error' ? '#fca5a5' : aiMessageType === 'warning' ? '#fde68a' : '#bbf7d0'}`,
            color: aiMessageType === 'error' ? '#991b1b' : aiMessageType === 'warning' ? '#92400e' : '#166534',
            display: 'flex',
            alignItems: 'flex-start',
            gap: '8px'
          }}
        >
          <i
            className={`ph-fill ${
              aiMessageType === 'error'
                ? 'ph-warning-circle'
                : aiMessageType === 'warning'
                ? 'ph-info'
                : 'ph-check-circle'
            }`}
            style={{ marginTop: '2px', flexShrink: 0, fontSize: '1rem' }}
          ></i>
          <span style={{ flex: 1 }}>{aiMessage}</span>
          <button
            type="button"
            onClick={() => setAiMessage(null)}
            style={{ background: 'none', border: 'none', color: 'inherit', cursor: 'pointer', padding: 0, opacity: 0.7 }}
            aria-label="Dismiss alert"
          >
            <i className="ph-bold ph-x"></i>
          </button>
        </div>
      )}

      {/* 3. Photo Changed Notification */}
      {photoChangedAfterAI && (
        <div
          style={{
            padding: '6px 12px',
            borderRadius: '6px',
            marginBottom: '10px',
            fontSize: '0.8rem',
            background: '#fffbeb',
            border: '1px solid #fef3c7',
            color: '#b45309',
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}
        >
          <i className="ph-fill ph-info"></i>
          <span>Photo changed: The description above was generated from a previous photo and may no longer reflect the current photo.</span>
        </div>
      )}

      {/* 4. Existing Textarea - Editable, full-width */}
      <textarea
        id="observed-condition-textarea"
        name="observedCondition"
        className={`form-input form-textarea ${error ? 'has-error' : ''}`}
        placeholder="e.g. Hit by vehicle and unable to walk, open wound on front leg, severe dehydration, appears abandoned, possible fracture"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={3}
        required
        style={{
          width: '100%',
          boxSizing: 'border-box',
          resize: 'vertical',
          fontFamily: 'inherit',
          lineHeight: 1.5
        }}
      />
      {error && (
        <span
          style={{
            color: 'var(--alert, #ef4444)',
            fontSize: '0.8rem',
            marginTop: '4px',
            display: 'block'
          }}
        >
          {error}
        </span>
      )}
    </div>
  );
}
