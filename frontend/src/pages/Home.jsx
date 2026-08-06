import React, { useEffect, useRef } from 'react';
import '../assets/landing.css';

export default function Home() {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersRef = useRef({});
  const highlightIntervalRef = useRef(null);

  useEffect(() => {
    // Check if Leaflet (L) is loaded on the window global scope
    const L = window.L;
    if (!L || !mapContainerRef.current) return;

    // 1. Initialize Map centered on San Francisco coordinates
    // Disable interaction to simulate a clean showcase dashboard
    const map = L.map(mapContainerRef.current, {
      center: [37.772, -122.442],
      zoom: 13,
      zoomControl: false,
      scrollWheelZoom: false,
      doubleClickZoom: false,
      dragging: false,
      touchZoom: false,
      attributionControl: false
    });
    mapInstanceRef.current = map;

    // 2. Add high-contrast CartoDB Dark Matter tile layer
    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
      maxZoom: 20
    }).addTo(map);

    // 3. Define Coordinates for Storytelling Lifecycle
    const coords = {
      emergency: [37.765, -122.472],  // Step 1: Reported (Sunset Blvd)
      hub: [37.758, -122.435],        // Step 2: Accepted (Paws Hope NGO HQ)
      active: [37.759, -122.418],      // Step 3: Dispatched (Mission District)
      transport: [37.778, -122.446],   // Step 4: Transporting (Panhandle Medical Center)
      resolved: [37.800, -122.438]     // Step 5: Completed (Marina District Shelter)
    };

    // 4. Create custom pulsing HTML divIcons matching the Voice of Stray branding
    const createPulseIcon = (statusClass) => {
      let innerHtml = '<div class="pulse-core"></div><div class="pulse-ring"></div>';
      if (statusClass === 'emergency') {
        innerHtml += '<div class="pulse-radar-ring"></div>';
      }
      
      return L.divIcon({
        className: 'custom-pulsing-marker marker-' + statusClass,
        iconSize: [24, 24],
        iconAnchor: [12, 12],
        html: innerHtml
      });
    };

    // 5. Add markers to the map matching the storytelling lifecycle
    const markers = {
      emergency: L.marker(coords.emergency, { icon: createPulseIcon('emergency') }).addTo(map),
      hub: L.marker(coords.hub, { icon: createPulseIcon('coordinated') }).addTo(map),
      active: L.marker(coords.active, { icon: createPulseIcon('active') }).addTo(map),
      transport: L.marker(coords.transport, { icon: createPulseIcon('transport') }).addTo(map),
      resolved: L.marker(coords.resolved, { icon: createPulseIcon('resolved') }).addTo(map)
    };
    markersRef.current = markers;

    // Add clean, human-centered tooltips to the map pins
    markers.emergency.bindTooltip("<b>Step 1</b>: Stray Reported (Injured Puppy)", { direction: 'top', className: 'map-tooltip' });
    markers.hub.bindTooltip("<b>Step 2</b>: Request Accepted (Paws Hope Center)", { direction: 'top', className: 'map-tooltip' });
    markers.active.bindTooltip("<b>Step 3</b>: Rescue Team Dispatched", { direction: 'top', className: 'map-tooltip' });
    markers.transport.bindTooltip("<b>Step 4</b>: Transporting to Medical Center", { direction: 'top', className: 'map-tooltip' });
    markers.resolved.bindTooltip("<b>Step 5</b>: Rescue Completed Successfully!", { direction: 'top', className: 'map-tooltip' });

    // 6. Bezier Arc mathematical helper to draw premium curved rescue paths
    const getArcPoints = (start, end, numPoints = 40) => {
      const points = [];
      const lat1 = start[0], lon1 = start[1];
      const lat2 = end[0], lon2 = end[1];
      
      const midLat = (lat1 + lat2) / 2;
      const midLon = (lon1 + lon2) / 2;
      
      const dLat = lat2 - lat1;
      const dLon = lon2 - lon1;
      
      const offsetStrength = 0.15;
      const offsetLat = -dLon * offsetStrength;
      const offsetLon = dLat * offsetStrength;
      
      const controlLat = midLat + offsetLat;
      const controlLon = midLon + offsetLon;
      
      for (let i = 0; i <= numPoints; i++) {
        const t = i / numPoints;
        const lat = (1 - t) * (1 - t) * lat1 + 2 * (1 - t) * t * controlLat + t * t * lat2;
        const lon = (1 - t) * (1 - t) * lon1 + 2 * (1 - t) * t * controlLon + t * t * lon2;
        points.push([lat, lon]);
      }
      return points;
    };

    // 7. Generate curves and project animated flowing SVGs onto Leaflet
    L.polyline(getArcPoints(coords.emergency, coords.hub), {
      color: '#ef4444',
      weight: 2,
      opacity: 0.6,
      className: 'animated-route-line'
    }).addTo(map);

    L.polyline(getArcPoints(coords.hub, coords.active), {
      color: '#f97316',
      weight: 2,
      opacity: 0.6,
      className: 'animated-route-line'
    }).addTo(map);

    L.polyline(getArcPoints(coords.active, coords.transport), {
      color: '#8b5cf6',
      weight: 2,
      opacity: 0.6,
      className: 'animated-route-line'
    }).addTo(map);

    L.polyline(getArcPoints(coords.transport, coords.resolved), {
      color: '#10b981',
      weight: 2,
      opacity: 0.6,
      className: 'animated-route-line'
    }).addTo(map);

    // 8. Dynamic Highlight Engine (Autocycle highlighting cards)
    const feedItems = document.querySelectorAll('.premium-item');
    const keys = ['emergency', 'hub', 'active', 'transport', 'resolved'];
    
    let currentHighlightIdx = 0;
    highlightIntervalRef.current = setInterval(() => {
      if (feedItems.length === 0) return;
      const prevIdx = (currentHighlightIdx - 1 + feedItems.length) % feedItems.length;
      
      // Clear previous highlight
      feedItems[prevIdx].classList.remove('feed-active-highlight');
      const prevMarker = markers[keys[prevIdx]];
      if (prevMarker) prevMarker.closeTooltip();

      // Apply new highlight
      const targetItem = feedItems[currentHighlightIdx];
      targetItem.classList.add('feed-active-highlight');
      
      const targetMarker = markers[keys[currentHighlightIdx]];
      if (targetMarker) {
        targetMarker.openTooltip();
      }

      currentHighlightIdx = (currentHighlightIdx + 1) % feedItems.length;
    }, 6000);

    // Clean up on unmount
    return () => {
      if (highlightIntervalRef.current) {
        clearInterval(highlightIntervalRef.current);
      }
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
      }
    };
  }, []);

  // Card Mouse Enter / Leave Handlers for manual highlights
  const handleMouseEnter = (idx) => {
    const keys = ['emergency', 'hub', 'active', 'transport', 'resolved'];
    const marker = markersRef.current[keys[idx]];
    if (marker) {
      marker.openTooltip();
      const iconEl = marker.getElement();
      if (iconEl) {
        iconEl.style.transform = iconEl.style.transform + ' translateY(-6px)';
        iconEl.style.transition = 'transform 0.2s ease-out';
      }
    }
  };

  const handleMouseLeave = (idx) => {
    const keys = ['emergency', 'hub', 'active', 'transport', 'resolved'];
    const marker = markersRef.current[keys[idx]];
    if (marker) {
      marker.closeTooltip();
      const iconEl = marker.getElement();
      if (iconEl) {
        iconEl.style.transform = iconEl.style.transform.replace(' translateY(-6px)', '');
      }
    }
  };

  return (
    <div>
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-background-shape"></div>
        <div className="hero-content">
          <div className="hero-text animate-up">
            <h1>Every stray deserves a <span>voice</span></h1>
            <p>Join the fastest growing community of animal lovers, rescuers, and NGOs working together to create a safer world for street animals.</p>
            <div className="hero-actions">
              <a href="/report.html" className="btn-premium primary" style={{ textDecoration: 'none' }}>
                <i className="ph-fill ph-warning-circle"></i> Report Emergency
              </a>
              <a href="/adopt.html" className="btn-premium secondary" style={{ textDecoration: 'none' }}>
                <i className="ph-fill ph-heart"></i> Adopt a Pet
              </a>
            </div>
          </div>
          <div className="hero-visual animate-up" style={{ animationDelay: '0.2s' }}>
            <img src="https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=format&fit=crop&q=80&w=800" alt="Rescued dogs playing" className="hero-main-img" />
            
            <div className="floating-glass-card glass-card-1">
              <div className="glass-icon"><i className="ph-fill ph-shield-check"></i></div>
              <div className="glass-text">
                <strong>Verified Rescue</strong>
                <span>Safe & secure</span>
              </div>
            </div>
            
            <div className="floating-glass-card glass-card-2">
              <div className="glass-icon" style={{ background: '#10b981' }}><i className="ph-fill ph-clock"></i></div>
              <div className="glass-text">
                <strong>15 Min ETA</strong>
                <span>Emergency response</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Impact Network */}
      <section className="impact-section">
        <div className="impact-grid">
          <div className="impact-stat">
            <i className="ph-fill ph-paw-print"></i>
            <h3>12k+</h3>
            <p>Animals Rescued</p>
          </div>
          <div className="impact-stat">
            <i className="ph-fill ph-heart"></i>
            <h3>5k+</h3>
            <p>Successful Adoptions</p>
          </div>
          <div className="impact-stat">
            <i className="ph-fill ph-buildings"></i>
            <h3>180+</h3>
            <p>Partner NGOs</p>
          </div>
          <div className="impact-stat">
            <i className="ph-fill ph-users"></i>
            <h3>50k+</h3>
            <p>Active Volunteers</p>
          </div>
        </div>
      </section>

      {/* Rescue Journey */}
      <section className="journey-section">
        <div className="section-title">
          <h2>How It Works</h2>
          <p>Our platform connects reporters directly with nearby rescue teams for the fastest possible response.</p>
        </div>
        
        <div className="journey-steps">
          <div className="journey-step">
            <div className="step-number-bg">1</div>
            <div className="journey-icon"><i className="ph-fill ph-camera"></i></div>
            <h3>Report</h3>
            <p>See a stray in need? Take a photo, tag the location, and select the severity level. Our system alerts nearby volunteers instantly.</p>
          </div>
          
          <div className="journey-step">
            <div className="step-number-bg">2</div>
            <div className="journey-icon"><i className="ph-fill ph-ambulance"></i></div>
            <h3>Rescue</h3>
            <p>Verified NGO partners or volunteers accept the case. Track their live GPS location as they navigate to the animal.</p>
          </div>
          
          <div className="journey-step">
            <div className="step-number-bg">3</div>
            <div className="journey-icon"><i className="ph-fill ph-house-line"></i></div>
            <h3>Recover & Adopt</h3>
            <p>The animal receives medical care at a verified shelter. Once healthy, they are listed on our platform for adoption or fostering.</p>
          </div>
        </div>
      </section>

      {/* Live Map Preview */}
      <section className="live-map-section">
        <div className="section-title">
          <h2>Live Rescue Network</h2>
          <p>Watch our community in action. Real-time updates from rescues happening around you.</p>
        </div>
        
        <div className="map-container">
          {/* Leaflet Map Target */}
          <div ref={mapContainerRef} id="live-rescue-map"></div>

          {/* Dashboard Technical Overlays */}
          <div className="map-grid-overlay"></div>
          <div className="map-glow-overlay"></div>

          {/* Live Status Bar */}
          <div className="map-status-bar">
            <span className="status-item">
              <span className="status-dot dot-emergency"></span>
              <strong>13</strong> Emergencies
            </span>
            <span className="status-divider">•</span>
            <span className="status-item">
              <span className="status-dot dot-active"></span>
              <strong>7</strong> Teams En Route
            </span>
            <span className="status-divider">•</span>
            <span className="status-item">
              <span className="status-dot dot-resolved"></span>
              <strong>48</strong> NGOs Active
            </span>
          </div>
          
          {/* Left Premium Storytelling Feed Sidebar */}
          <div className="map-overlay">
            <div className="map-overlay-header">
              <div className="live-pulse-container">
                <div className="live-pulse-dot"></div>
                <div className="live-pulse-ring"></div>
              </div>
              <div>
                <h3>Live Rescue Feed</h3>
                <span style={{ fontSize: '0.78rem', color: '#94a3b8', fontWeight: 500 }}>Real-time ecosystem updates</span>
              </div>
            </div>

            {/* Storytelling Incidents Feed List */}
            <div className="map-list-wrapper">
              <div 
                className="map-list-item premium-item" 
                data-incident-id="1"
                onMouseEnter={() => handleMouseEnter(0)}
                onMouseLeave={() => handleMouseLeave(0)}
              >
                <div className="item-icon-wrapper siren-glow">
                  <i className="ph-fill ph-siren"></i>
                </div>
                <div className="item-details">
                  <div className="item-title">Injured puppy reported</div>
                  <div className="item-sub">Sunset Blvd • 2 mins ago</div>
                </div>
                <div className="item-badge badge-emergency">Reported</div>
              </div>
              
              <div 
                className="map-list-item premium-item" 
                data-incident-id="2"
                onMouseEnter={() => handleMouseEnter(1)}
                onMouseLeave={() => handleMouseLeave(1)}
              >
                <div className="item-icon-wrapper coordinated-glow">
                  <i className="ph-fill ph-hand-heart"></i>
                </div>
                <div className="item-details">
                  <div className="item-title">Rescue request accepted</div>
                  <div className="item-sub">City Vet Center • 6 mins ago</div>
                </div>
                <div className="item-badge badge-coordinated">Accepted</div>
              </div>
              
              <div 
                className="map-list-item premium-item" 
                data-incident-id="3"
                onMouseEnter={() => handleMouseEnter(2)}
                onMouseLeave={() => handleMouseLeave(2)}
              >
                <div className="item-icon-wrapper active-glow">
                  <i className="ph-fill ph-ambulance"></i>
                </div>
                <div className="item-details">
                  <div className="item-title">Rescue team dispatched</div>
                  <div className="item-sub">Mission District • 12 mins ago</div>
                </div>
                <div className="item-badge badge-active">En Route</div>
              </div>

              <div 
                className="map-list-item premium-item" 
                data-incident-id="4"
                onMouseEnter={() => handleMouseEnter(3)}
                onMouseLeave={() => handleMouseLeave(3)}
              >
                <div className="item-icon-wrapper transport-glow">
                  <i className="ph-fill ph-first-aid-kit"></i>
                </div>
                <div className="item-details">
                  <div className="item-title">Animal transported to clinic</div>
                  <div className="item-sub">Downtown Park • 18 mins ago</div>
                </div>
                <div className="item-badge badge-transport">Transporting</div>
              </div>
              
              <div 
                className="map-list-item premium-item" 
                data-incident-id="5"
                onMouseEnter={() => handleMouseEnter(4)}
                onMouseLeave={() => handleMouseLeave(4)}
              >
                <div className="item-icon-wrapper resolved-glow">
                  <i className="ph-fill ph-heart"></i>
                </div>
                <div className="item-details">
                  <div className="item-title">Rescue completed safely</div>
                  <div className="item-sub">Marina District • 30 mins ago</div>
                </div>
                <div className="item-badge badge-resolved">Completed</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Success Stories */}
      <section className="stories-section">
        <div className="section-title">
          <h2>Happy Tails</h2>
          <p>Every rescue tells a story. Meet the animals who found their second chance.</p>
        </div>
        
        <div className="stories-grid">
          <div className="story-card">
            <img src="https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&q=80&w=600" alt="Charlie" className="story-img" />
            <div className="story-content">
              <h3>Charlie's Journey</h3>
              <p>Found injured by the highway, Charlie underwent a 3-month recovery before finding his forever family who loves taking him on hikes.</p>
              <div className="story-meta">
                <img src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=100" alt="Sarah" />
                <span>Adopted by Sarah</span>
              </div>
            </div>
          </div>
          
          <div className="story-card">
            <img src="https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&q=80&w=600" alt="Luna" className="story-img" />
            <div className="story-content">
              <h3>Little Luna</h3>
              <p>Rescued from an abandoned building during a storm. This tiny kitten grew into a fierce, loving house cat.</p>
              <div className="story-meta">
                <img src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=100" alt="Mark" />
                <span>Adopted by Mark</span>
              </div>
            </div>
          </div>
          
          <div className="story-card">
            <img src="https://images.unsplash.com/photo-1583337130417-3346a1be7dee?auto=format&fit=crop&q=80&w=600" alt="Max" className="story-img" />
            <div className="story-content">
              <h3>Max the Senior</h3>
              <p>Proving that age is just a number. Max, a 9-year-old lab mix, finally found a quiet home to spend his golden years.</p>
              <div className="story-meta">
                <img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=100" alt="Priya" />
                <span>Adopted by Priya</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mobile App CTA */}
      <section className="app-cta-section">
        <div className="app-cta-container">
          <div className="app-cta-text">
            <h2>Rescue in your pocket</h2>
            <p>Download the Voice of Stray app to report emergencies instantly, track live rescues, and connect with the community on the go. Faster reporting saves lives.</p>
            <div className="store-buttons">
              <a href="#" className="store-btn">
                <i className="ph-fill ph-apple-logo"></i>
                <div>
                  <span>Download on the</span>
                  <strong>App Store</strong>
                </div>
              </a>
              <a href="#" className="store-btn">
                <i className="ph-fill ph-google-play-logo"></i>
                <div>
                  <span>GET IT ON</span>
                  <strong>Google Play</strong>
                </div>
              </a>
            </div>
          </div>
          
          <div className="app-mockup">
            <div className="phone-frame">
              <img src="https://images.unsplash.com/photo-1551650975-87deedd944c3?auto=format&fit=crop&q=80&w=400" alt="App interface preview" />
            </div>
          </div>
        </div>
      </section>

      {/* Partner NGOs */}
      <section className="partners-section">
        <h4 className="partners-title">Trusted by over 180+ verified rescue organizations</h4>
        
        <div className="ticker-wrap">
          <div className="ticker-track">
            <div className="partner-logo"><i className="ph-fill ph-shield-heart"></i> Paws Hope Rescue</div>
            <div className="partner-logo"><i className="ph-fill ph-first-aid-kit"></i> City Vet Network</div>
            <div className="partner-logo"><i className="ph-fill ph-hand-heart"></i> Animal Angels</div>
            <div className="partner-logo"><i className="ph-fill ph-paw-print"></i> Safe Haven Shelter</div>
            <div className="partner-logo"><i className="ph-fill ph-heartbeat"></i> Metro Street Dogs</div>
            
            {/* Duplicated for seamless loop */}
            <div className="partner-logo"><i className="ph-fill ph-shield-heart"></i> Paws Hope Rescue</div>
            <div className="partner-logo"><i className="ph-fill ph-first-aid-kit"></i> City Vet Network</div>
            <div className="partner-logo"><i className="ph-fill ph-hand-heart"></i> Animal Angels</div>
            <div className="partner-logo"><i className="ph-fill ph-paw-print"></i> Safe Haven Shelter</div>
            <div className="partner-logo"><i className="ph-fill ph-heartbeat"></i> Metro Street Dogs</div>
          </div>
        </div>
      </section>
    </div>
  );
}
