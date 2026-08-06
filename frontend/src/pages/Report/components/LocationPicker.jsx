import React from 'react';

export default function LocationPicker({ value, onChange, error }) {
  const handleUseCurrentLocation = () => {
    onChange("Current Location (37.7749, -122.4194) - Downtown");
  };

  const handlePinExactSpot = () => {
    const customLoc = prompt("Enter street address or landmark:", value);
    if (customLoc !== null) {
      onChange(customLoc.trim());
    }
  };

  return (
    <div className="form-section">
      <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--text-main)', marginBottom: '16px' }}>
        Location Details <span style={{ color: 'var(--alert)' }}>*</span>
      </h3>
      <div className="location-preview">
        <div className="map-placeholder" style={{ position: 'relative', overflow: 'hidden', borderRadius: '8px', background: '#e5e5e5', minHeight: '160px' }}>
          <iframe 
            src="https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d15000!2d-122.4194!3d37.7749!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1sen!2sus!4v1620000000000!5m2!1sen!2sus" 
            width="100%" 
            height="100%" 
            style={{ border: 0, position: 'absolute', top: 0, left: 0, pointerEvents: 'none' }} 
            allowFullScreen="" 
            loading="lazy"
            title="Google Maps Location Preview"
          ></iframe>
          <div className="map-overlay" style={{ position: 'relative', zIndex: 1, background: 'rgba(255, 255, 255, 0.4)', backdropFilter: 'blur(2px)' }}>
            <button type="button" className="btn-primary" onClick={handleUseCurrentLocation}>
              <i className="ph ph-crosshair"></i> Use Current Location
            </button>
            <button type="button" className="btn-secondary" onClick={handlePinExactSpot}>
              <i className="ph ph-map-pin"></i> Pin Exact Spot
            </button>
          </div>
        </div>

        <div className="location-info">
          <div className="address-input" style={{ border: error ? '1px solid var(--alert)' : '' }}>
            <i className="ph ph-map-pin"></i>
            <input 
              type="text" 
              placeholder="Enter street address or landmark" 
              value={value} 
              onChange={(e) => onChange(e.target.value)}
            />
          </div>
          {error && (
            <span style={{ fontSize: '0.8rem', color: 'var(--alert)', fontWeight: 500, display: 'block', marginTop: '4px', paddingLeft: '4px' }}>
              {error}
            </span>
          )}
          <div className="eta-badge" style={{ marginTop: '8px' }}>
            <i className="ph-fill ph-clock"></i>
            <span>Nearby Rescue ETA: <strong>15-20 mins</strong></span>
          </div>
          <div className="eta-badge" style={{ marginTop: '8px', background: 'rgba(249, 115, 22, 0.1)', color: 'var(--primary)' }}>
            <i className="ph-fill ph-users"></i>
            <span><strong>3</strong> Rescue Teams Active Nearby</span>
          </div>
        </div>
      </div>
    </div>
  );
}
