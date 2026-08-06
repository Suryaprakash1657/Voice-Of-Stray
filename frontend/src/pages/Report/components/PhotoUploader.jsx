import React, { useRef } from 'react';

export default function PhotoUploader({ value, onChange, error }) {
  const cameraInputRef = useRef(null);
  const galleryInputRef = useRef(null);

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const MAX_WIDTH = 500;
        const MAX_HEIGHT = 500;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_WIDTH) {
            height *= MAX_WIDTH / width;
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_HEIGHT) {
            width *= MAX_HEIGHT / height;
            height = MAX_HEIGHT;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, width, height);

        const base64 = canvas.toDataURL("image/jpeg", 0.7);
        onChange(base64);
      };
      img.src = event.target.result;
    };
    reader.readAsDataURL(file);
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
      
      <div className="photo-upload-area" style={{ cursor: 'default' }}>
        {!value && (
          <div style={{ display: 'flex', gap: '16px', width: '100%', justifyContent: 'center', marginBottom: '12px', flexWrap: 'wrap' }}>
            <button 
              type="button" 
              className="btn-premium primary" 
              onClick={() => cameraInputRef.current?.click()}
              style={{ padding: '12px 24px', fontSize: '0.95rem', borderRadius: 'var(--radius-sm)' }}
            >
              <i className="ph ph-camera"></i> Take Photo
            </button>
            <button 
              type="button" 
              className="btn-premium secondary" 
              onClick={() => galleryInputRef.current?.click()}
              style={{ padding: '12px 24px', fontSize: '0.95rem', border: '1.5px solid var(--border)', borderRadius: 'var(--radius-sm)' }}
            >
              <i className="ph ph-image"></i> Upload Gallery
            </button>
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
          <div style={{ position: 'relative', marginTop: '12px', borderRadius: 'var(--radius-md)', overflow: 'hidden', width: '100%', maxHeight: '300px', border: '1px solid var(--border)' }}>
            <img src={value} alt="Selected Stray" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            <button 
              type="button" 
              onClick={handleRemove}
              style={{ position: 'absolute', top: '10px', right: '10px', background: 'rgba(15, 23, 42, 0.7)', color: 'white', border: 'none', borderRadius: '50%', width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.25rem', cursor: 'pointer', transition: 'all 0.2s' }}
              aria-label="Remove photo"
            >
              <i className="ph ph-x"></i>
            </button>
          </div>
        )}

        {!value && (
          <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 500, textAlign: 'center', marginTop: '8px', display: 'block' }}>
            Select an option to add a photo of the stray animal.
          </span>
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
