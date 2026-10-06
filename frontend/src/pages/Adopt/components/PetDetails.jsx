import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { adoptionStorage } from '../services/adoptionStorage';
import { EmptyAdoptionState } from './EmptyAdoptionState';

export function PetDetails() {
  const { petId } = useParams();
  const navigate = useNavigate();

  const [pet, setPet] = useState(null);
  const [activeImage, setActiveImage] = useState('');
  const [isSaved, setIsSaved] = useState(false);
  const [showVisitModal, setShowVisitModal] = useState(false);
  const [visitForm, setVisitForm] = useState({
    preferredDate: '',
    preferredTime: '10:00 AM - 12:00 PM',
    message: ''
  });
  const [visitSubmitted, setVisitSubmitted] = useState(false);

  useEffect(() => {
    const foundPet = adoptionStorage.getPetById(petId);
    setPet(foundPet || null);
    if (foundPet) {
      const mainImg = foundPet.images?.main || foundPet.image || foundPet.photo || 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&q=80&w=800';
      setActiveImage(mainImg);
      setIsSaved(adoptionStorage.isPetSaved(foundPet.id));
    }
    window.scrollTo(0, 0);
  }, [petId]);

  const handleToggleSave = () => {
    if (!pet) return;
    const nowSaved = adoptionStorage.toggleSavedPet(pet.id);
    setIsSaved(nowSaved);
  };

  const handleVisitSubmit = (e) => {
    e.preventDefault();
    if (!pet) return;
    adoptionStorage.scheduleVisit({
      petId: pet.id,
      petName: pet.name,
      ...visitForm
    });
    setVisitSubmitted(true);
    setTimeout(() => {
      setShowVisitModal(false);
      setVisitSubmitted(false);
    }, 2000);
  };

  if (!pet) {
    return (
      <main className="pet-details-main" style={{ padding: '60px 24px', textAlign: 'center' }}>
        <EmptyAdoptionState
          type="not-found"
          title="Pet Not Found"
          message={`We couldn't find a rescue animal with identifier "${petId}". Please browse our current adoptable strays.`}
          actionText="Browse Available Pets"
          onAction={() => navigate('/adopt')}
        />
      </main>
    );
  }

  const images = pet.images?.thumbnails && pet.images.thumbnails.length > 0
    ? pet.images.thumbnails
    : [activeImage];

  return (
    <main className="pet-details-main">
      {/* 1. HERO PROFILE */}
      <section className="hero-profile">
        <div className="hero-gallery">
          <div className="main-image">
            <img
              src={activeImage}
              alt={pet.name}
              onError={(e) => {
                e.currentTarget.src = 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&q=80&w=800';
              }}
            />
            <button
              type="button"
              className={`gallery-save-btn ${isSaved ? 'active' : ''}`}
              onClick={handleToggleSave}
              title={isSaved ? 'Remove from saved' : 'Save pet'}
              aria-label="Save pet"
            >
              <i className={isSaved ? 'ph-fill ph-heart' : 'ph ph-heart'}></i>
            </button>
            {pet.urgent && <div className="image-badge">Urgent Foster Needed</div>}
          </div>

          {images.length > 1 && (
            <div className="thumbnail-grid">
              {images.map((thumb, idx) => (
                <img
                  key={idx}
                  src={thumb}
                  alt={`${pet.name} thumb ${idx + 1}`}
                  className={activeImage === thumb ? 'active' : ''}
                  onClick={() => setActiveImage(thumb)}
                />
              ))}
            </div>
          )}
        </div>

        <div className="hero-info">
          <div className="breadcrumb">
            <Link to="/adopt">Adopt</Link> <i className="ph ph-caret-right"></i> <span>{pet.species || 'Pets'}</span> <i className="ph ph-caret-right"></i> <span>{pet.name}</span>
          </div>

          <div className="pet-title-area">
            <h1>{pet.name}</h1>
            <div className="pet-vital-stats">
              <span className="stat-pill">{pet.breed}</span>
              <span className="stat-pill">{pet.age}</span>
              <span className="stat-pill">
                <i className={`ph ph-gender-${pet.gender?.toLowerCase() === 'female' ? 'female' : 'male'}`}></i> {pet.gender}
              </span>
              <span className="stat-pill distance">
                <i className="ph ph-map-pin"></i> {pet.distance || '5.2 km away'}
              </span>
            </div>
          </div>

          <div className="rescue-date-line">
            <i className="ph ph-clock-counter-clockwise"></i> {pet.rescueDate ? `Rescued on ${pet.rescueDate}` : 'Rescued on October 12, 2025'}
          </div>

          <div className="badges-grid">
            <div className="feature-badge healthy"><i className="ph-fill ph-check-circle"></i> Vaccinated</div>
            <div className="feature-badge healthy"><i className="ph-fill ph-stethoscope"></i> Vet Checked</div>
            <div className="feature-badge healthy"><i className="ph-fill ph-scissors"></i> Neutered</div>
            <div className="feature-badge behavioral"><i className="ph-fill ph-baby"></i> Good with Kids</div>
            <div className="feature-badge behavioral"><i className="ph-fill ph-paw-print"></i> Good with Pets</div>
            <div className="feature-badge behavioral"><i className="ph-fill ph-house"></i> House Trained</div>
          </div>

          <p className="hero-short-desc">
            {pet.storySnippet || pet.shortDesc || pet.story || 'Rescued with care and ready to meet their forever family.'}
          </p>

          <div className="hero-actions">
            <Link to={`/adopt/apply/${pet.slug || pet.id}`} className="btn-primary-large">
              Adopt {pet.name}
            </Link>
            <Link to={`/adopt/apply/${pet.slug || pet.id}`} className="btn-secondary-large">
              Foster First
            </Link>
          </div>
        </div>
      </section>

      <div className="content-split-layout">
        {/* LEFT COLUMN (Details) */}
        <div className="details-column">
          {/* 2. FULL RESCUE STORY */}
          <section className="detail-section card" id="story">
            <h2>{pet.name}&apos;s Rescue Story</h2>
            <p className="story-text">
              {pet.story || `${pet.name} was rescued through our emergency stray network in ${pet.location}. Timely veterinary care and loving foster rehabilitation have helped ${pet.name} blossom into an affectionate, loyal companion ready for a forever home.`}
            </p>

            <div className="rescue-timeline">
              <div className="timeline-item completed">
                <div className="tl-icon"><i className="ph ph-warning-circle"></i></div>
                <div className="tl-content">
                  <h5>Reported</h5>
                  <span>Oct 12, 2025</span>
                </div>
              </div>
              <div className="timeline-item completed">
                <div className="tl-icon"><i className="ph ph-ambulance"></i></div>
                <div className="tl-content">
                  <h5>Rescued</h5>
                  <span>Oct 12, 2025</span>
                </div>
              </div>
              <div className="timeline-item completed">
                <div className="tl-icon"><i className="ph ph-first-aid"></i></div>
                <div className="tl-content">
                  <h5>Treated</h5>
                  <span>Oct 14, 2025</span>
                </div>
              </div>
              <div className="timeline-item completed">
                <div className="tl-icon"><i className="ph ph-house-line"></i></div>
                <div className="tl-content">
                  <h5>Fostered</h5>
                  <span>Oct 18, 2025</span>
                </div>
              </div>
              <div className="timeline-item active">
                <div className="tl-icon"><i className="ph-fill ph-heart"></i></div>
                <div className="tl-content">
                  <h5>Ready for Adoption</h5>
                  <span>Current</span>
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* RIGHT COLUMN (NGO) */}
        <div className="sidebar-column">
          <div className="ngo-profile-card">
            <div className="ngo-header">
              <div className="ngo-avatar">{pet.ngoInitials || 'CR'}</div>
              <div className="ngo-info">
                <h3>{pet.ngoName || 'City Rescue NGO'} <i className="ph-fill ph-seal-check" style={{ color: '#0ea5e9' }}></i></h3>
                <p>Verified Animal Welfare Partner</p>
              </div>
            </div>
            <div className="ngo-stats-mini">
              <div className="stat-item"><strong>142</strong><span>Rescues</span></div>
              <div className="stat-item"><strong>98%</strong><span>Adoption Rate</span></div>
            </div>
            <button
              type="button"
              className="btn-schedule-visit"
              onClick={() => setShowVisitModal(true)}
            >
              Schedule Shelter Visit
            </button>
            <a href="mailto:contact@cityrescue.org" className="btn-contact-ngo">
              Contact Shelter
            </a>
          </div>
        </div>
      </div>

      {/* Visit Modal */}
      {showVisitModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0,0,0,0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
            padding: '16px'
          }}
          onClick={() => setShowVisitModal(false)}
        >
          <div
            className="card"
            style={{ maxWidth: '480px', width: '100%', padding: '32px', position: 'relative' }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setShowVisitModal(false)}
              style={{ position: 'absolute', top: '16px', right: '16px', background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer' }}
            >
              &times;
            </button>
            {visitSubmitted ? (
              <div style={{ textAlign: 'center', padding: '24px 0' }}>
                <i className="ph-fill ph-check-circle" style={{ fontSize: '3rem', color: '#10b981' }}></i>
                <h3 style={{ marginTop: '16px' }}>Visit Appointment Scheduled!</h3>
                <p style={{ color: 'var(--text-muted)' }}>The shelter team has received your request and will contact you shortly.</p>
              </div>
            ) : (
              <form onSubmit={handleVisitSubmit}>
                <h3 style={{ marginBottom: '16px' }}>Schedule Visit to Meet {pet.name}</h3>
                <div className="form-group">
                  <label htmlFor="modal-visit-date">Preferred Date *</label>
                  <input
                    type="date"
                    id="modal-visit-date"
                    className="form-input"
                    required
                    min={new Date().toISOString().split('T')[0]}
                    value={visitForm.preferredDate}
                    onChange={(e) => setVisitForm({ ...visitForm, preferredDate: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="modal-visit-time">Preferred Time Slot *</label>
                  <select
                    id="modal-visit-time"
                    className="filter-select"
                    value={visitForm.preferredTime}
                    onChange={(e) => setVisitForm({ ...visitForm, preferredTime: e.target.value })}
                  >
                    <option value="10:00 AM - 12:00 PM">Morning (10:00 AM – 12:00 PM)</option>
                    <option value="12:00 PM - 2:00 PM">Noon (12:00 PM – 2:00 PM)</option>
                    <option value="2:00 PM - 4:00 PM">Afternoon (2:00 PM – 4:00 PM)</option>
                    <option value="4:00 PM - 6:00 PM">Evening (4:00 PM – 6:00 PM)</option>
                  </select>
                </div>
                <div className="form-group">
                  <label htmlFor="modal-visit-msg">Message / Notes</label>
                  <textarea
                    id="modal-visit-msg"
                    className="form-input"
                    rows="2"
                    placeholder="E.g., Visiting with family members..."
                    value={visitForm.message}
                    onChange={(e) => setVisitForm({ ...visitForm, message: e.target.value })}
                  ></textarea>
                </div>
                <button type="submit" className="btn-primary-large" style={{ width: '100%', marginTop: '8px' }}>
                  Confirm Appointment
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </main>
  );
}
