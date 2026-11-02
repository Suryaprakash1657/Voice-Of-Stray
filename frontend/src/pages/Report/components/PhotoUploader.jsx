import React, { useRef, useState } from 'react';
import { processImageFile } from '../../../utils/imageUpload.js';

export default function PhotoUploader({ value, onChange, error }) {
  const cameraInputRef = useRef(null);
  const galleryInputRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFile = async (file) => {
    if (!file) return;
    try {
      const dataUrl = await processImageFile(file, { maxWidth: 1000, maxHeight: 1000, quality: 0.85 });
      onChange(dataUrl);
    } catch (err) {
      console.error('Error processing photo:', err);
    }
  };

  const handleFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleFile(file);
  };

  const handleRemove = () => {
    onChange('');
    if (cameraInputRef.current) cameraInputRef.current.value = '';
    if (galleryInputRef.current) galleryInputRef.current.value = '';
  };

  return (
    <div className="form-section">
      <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--text-main)', marginBottom: '8px' }}>
        Upload Photo <span style={{ color: 'var(--alert)' }}>*</span>
      </h3>
      
      <div 
        className={`photo-upload-area ${isDragging ? 'dragover' : ''}`}
        style={{
          cursor: value ? 'default' : 'pointer',
          border: isDragging ? '2px dashed var(--primary)' : '2px dashed #cbd5e1',
          background: isDragging ? '#fff7ed' : '#f8fafc',
          borderRadius: 'var(--radius-md)',
          padding: '24px 16px',
          transition: 'all 0.25s ease'
        }}
        onClick={() => {
          if (!value) galleryInputRef.current?.click();
        }}
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
      >
        {!value && (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: '12px' }}>
            <div style={{ display: 'flex', gap: '12px', width: '100%', justifyContent: 'center', flexWrap: 'wrap' }}>
              <button 
                type="button" 
                className="btn-premium primary" 
                onClick={(e) => {
                  e.stopPropagation();
                  galleryInputRef.current?.click();
                }}
                style={{ padding: '12px 24px', fontSize: '0.95rem', borderRadius: 'var(--radius-sm)' }}
              >
                <i className="ph ph-folder-open" style={{ color: '#ffffff', fontSize: '1.25rem', verticalAlign: 'middle', marginRight: '6px' }}></i> Upload from Folder
              </button>
              <button 
                type="button" 
                className="btn-premium secondary" 
                onClick={(e) => {
                  e.stopPropagation();
                  cameraInputRef.current?.click();
                }}
                style={{ padding: '12px 24px', fontSize: '0.95rem', border: '1.5px solid var(--border)', borderRadius: 'var(--radius-sm)' }}
              >
                <i className="ph ph-camera"></i> Take Photo
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <strong style={{ fontSize: '0.9rem', color: 'var(--text-main)' }}>
                Drag and drop image here or click anywhere in box to browse files
              </strong>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                Supports JPG, PNG, WEBP, HEIC from your computer or phone
              </span>
            </div>
          </div>
        )}

        <input 
          type="file" 
          ref={cameraInputRef} 
          accept="image/*" 
          capture="environment" 
          onChange={handleFileSelect}
          style={{ display: 'none' }} 
        />
        <input 
          type="file" 
          ref={galleryInputRef} 
          accept="image/*" 
          onChange={handleFileSelect}
          style={{ display: 'none' }} 
        />

        {value && (
          <div style={{ position: 'relative', borderRadius: 'var(--radius-md)', overflow: 'hidden', width: '100%', maxHeight: '320px', border: '1px solid var(--border)' }}>
            <img src={value} alt="Selected Stray" style={{ width: '100%', maxHeight: '320px', objectFit: 'contain', background: '#0f172a', display: 'block', margin: '0 auto' }} />
            <div style={{ position: 'absolute', top: '10px', right: '10px', display: 'flex', gap: '8px' }}>
              <button 
                type="button" 
                onClick={(e) => {
                  e.stopPropagation();
                  galleryInputRef.current?.click();
                }}
                style={{ background: 'rgba(15, 23, 42, 0.75)', color: 'white', border: 'none', borderRadius: '6px', padding: '6px 12px', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', cursor: 'pointer', fontWeight: 600 }}
                title="Change image"
              >
                <i className="ph ph-arrow-counter-clockwise"></i> Change
              </button>
              <button 
                type="button" 
                onClick={(e) => {
                  e.stopPropagation();
                  handleRemove();
                }}
                style={{ background: 'rgba(239, 68, 68, 0.85)', color: 'white', border: 'none', borderRadius: '50%', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.15rem', cursor: 'pointer', transition: 'all 0.2s' }}
                aria-label="Remove photo"
              >
                <i className="ph ph-x"></i>
              </button>
            </div>
          </div>
        )}
      </div>
      {error && (
        <span style={{ fontSize: '0.8rem', color: 'var(--alert)', fontWeight: 500, display: 'block', marginTop: '8px' }}>
          {error}
        </span>
      )}
    </div>
  );
}
