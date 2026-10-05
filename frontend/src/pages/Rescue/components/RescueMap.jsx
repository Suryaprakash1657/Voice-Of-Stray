import React, { useMemo, useEffect, useRef } from 'react';

/**
 * Coordinate mapping helper
 */
function getMapCoordinates(c) {
  const loc = (c.location || '').toLowerCase();
  if (loc.includes('bandra') || loc.includes('linking')) {
    return { top: '30%', left: '40%' };
  }
  if (loc.includes('andheri') || loc.includes('anna')) {
    return { top: '55%', left: '35%' };
  }
  if (loc.includes('colaba')) {
    return { top: '75%', left: '55%' };
  }
  if (loc.includes('ghatkopar')) {
    return { top: '40%', left: '70%' };
  }

  // Consistent coordinate hashing
  let hash = 0;
  const str = String(c.id || '');
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  const top = 30 + Math.abs((hash * 7) % 50); // between 30% and 80%
  const left = 20 + Math.abs((hash * 13) % 60); // between 20% and 80%
  return { top: `${top}%`, left: `${left}%` };
}

/**
 * Overview Live Network Map Widget (Feed sidebar)
 */
export function OverviewRescueMap({ activeCases = [], onSelectCase = null, highlightedId = null }) {
  const criticalCount = useMemo(() => {
    return activeCases.filter((c) => {
      const sev = c.severity || c.priority || '';
      return sev.toLowerCase().includes('emergency') || sev.toLowerCase().includes('critical');
    }).length;
  }, [activeCases]);

  const dispatchCount = useMemo(() => {
    return activeCases.filter((c) => c.status === 'Volunteer En Route' || c.statusStep === 3).length;
  }, [activeCases]);

  const enRouteCase = useMemo(() => {
    return activeCases.find((c) => c.status === 'Volunteer En Route' || c.statusStep === 3);
  }, [activeCases]);

  const ambulanceCoords = useMemo(() => {
    if (!enRouteCase) return null;
    const coords = getMapCoordinates(enRouteCase);
    const topPercent = parseFloat(coords.top);
    const leftPercent = parseFloat(coords.left);
    return {
      top: `${topPercent + 5}%`,
      left: `${leftPercent - 8}%`
    };
  }, [enRouteCase]);

  return (
    <div className="map-container-dark">
      <div className="map-grid-bg"></div>
      <div className="radar-scanner"></div>

      {/* SVG stylized street connections */}
      <svg style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none' }}>
        <defs>
          <linearGradient id="glow-orange" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#f97316" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#ea580c" stopOpacity="0.1" />
          </linearGradient>
        </defs>
        <path d="M 120 144 L 200 240 M 200 240 L 300 360" stroke="rgba(249,115,22,0.08)" strokeWidth="1.5" />
        <path d="M 80 200 L 220 200 L 320 280" stroke="rgba(249,115,22,0.08)" strokeWidth="1.5" />
        <path d="M 180 144 L 180 380" stroke="rgba(249,115,22,0.08)" strokeWidth="1.5" />

        {/* Glowing Route path for dispatched vehicle */}
        <path d="M 180 144 L 160 216 L 200 240" stroke="url(#glow-orange)" strokeWidth="3" fill="none" className="route-path" />
      </svg>

      {/* Dynamic Glowing Pins for active cases */}
      {activeCases.map((c) => {
        const coords = getMapCoordinates(c);
        const severity = (c.severity || c.priority || '').toLowerCase();
        let nodeClass = 'map-node-progress';

        if (c.statusStep >= 6) {
          nodeClass = 'map-node-success';
        } else if (severity.includes('emergency') || severity.includes('critical')) {
          nodeClass = 'map-node-active';
        }

        const isHighlighted = highlightedId && String(highlightedId).replace(/^RSC-/, '') === String(c.id);

        return (
          <div
            key={c.id}
            className={`map-node ${nodeClass} ${isHighlighted ? 'pinned' : ''}`}
            style={{ top: coords.top, left: coords.left }}
            onClick={() => onSelectCase && onSelectCase(c)}
            title={`#RSC-${c.id}: ${c.breed || c.animalType || 'Animal'}`}
          >
            <div className="map-info-popup">
              #RSC-{c.id}: {c.breed || c.animalType || 'Animal'} ({c.status})
            </div>
          </div>
        );
      })}

      {/* Simulated Ambulance Icon */}
      {ambulanceCoords && (
        <div
          style={{
            position: 'absolute',
            top: ambulanceCoords.top,
            left: ambulanceCoords.left,
            transform: 'translate(-50%, -50%)',
            zIndex: 15
          }}
        >
          <div
            style={{
              width: '32px',
              height: '32px',
              background: 'rgba(59, 130, 246, 0.15)',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: '1.5px solid #3b82f6',
              animation: 'pulse-ring 2s infinite'
            }}
          >
            <i className="ph-fill ph-ambulance" style={{ color: '#3b82f6', fontSize: '0.9rem' }}></i>
          </div>
        </div>
      )}

      {/* Overview overlay statistics card */}
      <div className="map-overlay-card">
        <h4
          style={{
            fontSize: '0.85rem',
            color: '#431407',
            marginBottom: '8px',
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}
        >
          <i
            className="ph ph-crosshair"
            style={{ color: '#f97316', fontSize: '1rem', animation: 'pulse-dot-ping 1.5s infinite' }}
          ></i>
          Network Overview
        </h4>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ width: '6px', height: '6px', background: '#ef4444', borderRadius: '50%' }}></span>
            <span style={{ color: '#7c2d12' }}>{criticalCount} Critical Cases</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ width: '6px', height: '6px', background: '#f97316', borderRadius: '50%' }}></span>
            <span style={{ color: '#7c2d12' }}>{dispatchCount} Dispatches Live</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ width: '6px', height: '6px', background: '#10b981', borderRadius: '50%' }}></span>
            <span style={{ color: '#7c2d12' }}>Active Area Coverage</span>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Detailed Case Tracking GPS Map (Case Details view)
 */
export function DetailedTrackingMap({ caseItem = null, onRefresh = null }) {
  const mapContainerRef = useRef(null);
  const leafletMapRef = useRef(null);

  // Initialize Leaflet map if Leaflet is available in window
  useEffect(() => {
    if (typeof window !== 'undefined' && window.L && mapContainerRef.current) {
      if (leafletMapRef.current) {
        leafletMapRef.current.remove();
      }

      // Default to Mumbai center coordinates
      let lat = 19.0596;
      let lng = 72.8295;

      const loc = (caseItem?.location || '').toLowerCase();
      if (loc.includes('andheri')) {
        lat = 19.1136;
        lng = 72.8697;
      } else if (loc.includes('colaba')) {
        lat = 18.9067;
        lng = 72.8147;
      } else if (loc.includes('ghatkopar')) {
        lat = 19.086;
        lng = 72.908;
      }

      try {
        const map = window.L.map(mapContainerRef.current, {
          center: [lat, lng],
          zoom: 14,
          zoomControl: false,
          attributionControl: false
        });

        window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          maxZoom: 19
        }).addTo(map);

        leafletMapRef.current = map;
      } catch (err) {
        console.warn('Leaflet initialization fallback', err);
      }
    }

    return () => {
      if (leafletMapRef.current) {
        leafletMapRef.current.remove();
        leafletMapRef.current = null;
      }
    };
  }, [caseItem?.location]);

  return (
    <div className="map-section" style={{ marginBottom: '12px', position: 'relative' }}>
      {/* Interactive / visual base map */}
      <div
        ref={mapContainerRef}
        style={{
          width: '100%',
          height: '100%',
          position: 'absolute',
          top: 0,
          left: 0,
          filter: 'grayscale(0.3) contrast(1.1) brightness(1.05)'
        }}
      >
        {/* Fallback iframe Google Embed if Leaflet not ready */}
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d15000!2d-122.4194!3d37.7749!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1sen!2sus!4v1620000000000!5m2!1sen!2sus"
          width="100%"
          height="100%"
          style={{
            border: 0,
            position: 'absolute',
            top: 0,
            left: 0,
            pointerEvents: 'none',
            filter: 'grayscale(0.5) contrast(1.2) brightness(1.1)'
          }}
          title="Map Location"
          loading="lazy"
        ></iframe>
      </div>

      {/* Top Map Badges */}
      <div style={{ position: 'absolute', top: '16px', left: '16px', display: 'flex', gap: '8px', zIndex: 5 }}>
        <div
          style={{
            background: 'rgba(255, 255, 255, 0.9)',
            border: '1px solid rgba(249, 115, 22, 0.15)',
            color: '#431407',
            padding: '6px 12px',
            borderRadius: '20px',
            fontSize: '0.85rem',
            fontWeight: 700,
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            boxShadow: '0 4px 6px rgba(0,0,0,0.05)'
          }}
        >
          <span
            style={{
              width: '8px',
              height: '8px',
              background: '#10b981',
              borderRadius: '50%',
              boxShadow: '0 0 0 2px rgba(16, 185, 129, 0.3)'
            }}
          ></span>
          Live GPS Tracking
        </div>
      </div>

      {/* Top Right Action Controls */}
      <div
        style={{
          position: 'absolute',
          top: '16px',
          right: '16px',
          display: 'flex',
          gap: '8px',
          zIndex: 5,
          pointerEvents: 'auto'
        }}
      >
        <button
          onClick={onRefresh}
          style={{
            background: 'white',
            border: '1px solid rgba(249, 115, 22, 0.15)',
            padding: '8px 12px',
            borderRadius: '8px',
            fontWeight: 700,
            color: '#7c2d12',
            fontSize: '0.85rem',
            cursor: 'pointer',
            boxShadow: '0 4px 6px rgba(0,0,0,0.05)',
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}
        >
          <i className="ph ph-arrows-clockwise"></i> Refresh
        </button>
        <button
          onClick={() => {
            if (navigator.share) {
              navigator.share({
                title: `Rescue Case #${caseItem?.id}`,
                text: `Tracking rescue for ${caseItem?.animal || 'animal'} at ${caseItem?.location}`,
                url: window.location.href
              }).catch(() => {});
            } else {
              navigator.clipboard?.writeText(window.location.href);
              alert('Link copied to clipboard!');
            }
          }}
          style={{
            background: 'white',
            border: '1px solid rgba(249, 115, 22, 0.15)',
            padding: '8px 12px',
            borderRadius: '8px',
            fontWeight: 700,
            color: '#7c2d12',
            fontSize: '0.85rem',
            cursor: 'pointer',
            boxShadow: '0 4px 6px rgba(0,0,0,0.05)',
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}
        >
          <i className="ph ph-share-network"></i> Share
        </button>
      </div>

      {/* Simulated Route Overlay */}
      <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none' }}>
        {/* Route Line */}
        <svg style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }} preserveAspectRatio="none">
          <line x1="30%" y1="50%" x2="50%" y2="80%" stroke="var(--tracking-blue, #2563eb)" strokeWidth="4" strokeDasharray="8,8" />
        </svg>

        {/* Marker A (Vehicle) */}
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '30%',
            transform: 'translate(-50%, -50%)',
            zIndex: 2,
            animation: 'pulse-ring 2s infinite'
          }}
        >
          <div
            style={{
              width: '56px',
              height: '56px',
              background: 'rgba(37, 99, 235, 0.15)',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <div
              style={{
                width: '40px',
                height: '40px',
                background: 'linear-gradient(135deg, #2563eb, #1d4ed8)',
                borderRadius: '50%',
                border: '3px solid white',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontSize: '1.5rem',
                boxShadow: '0 4px 12px rgba(37, 99, 235, 0.35)'
              }}
            >
              <i className="ph-fill ph-van"></i>
            </div>
          </div>
        </div>

        {/* Marker B (Destination Pin) */}
        <div style={{ position: 'absolute', top: '80%', left: '50%', transform: 'translate(-50%, -100%)', zIndex: 2 }}>
          <i className="ph-fill ph-map-pin" style={{ color: '#ef4444', fontSize: '2.5rem', filter: 'drop-shadow(0 4px 6px rgba(0,0,0,0.15))' }}></i>
        </div>

        {/* Current Location Button */}
        <div
          style={{
            position: 'absolute',
            bottom: '20px',
            right: '20px',
            width: '44px',
            height: '44px',
            background: 'white',
            border: '1px solid rgba(249, 115, 22, 0.15)',
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 6px rgba(0,0,0,0.05)',
            cursor: 'pointer',
            pointerEvents: 'auto'
          }}
        >
          <i className="ph ph-crosshair" style={{ fontSize: '1.4rem', color: '#7c2d12' }}></i>
        </div>
      </div>
    </div>
  );
}

export default {
  Overview: React.memo(OverviewRescueMap),
  Detailed: React.memo(DetailedTrackingMap)
};
