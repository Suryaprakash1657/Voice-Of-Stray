import React from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAdoptionApplication } from '../hooks/useAdoptionApplication';
import { EmptyAdoptionState } from './EmptyAdoptionState';

export function AdoptionApplication() {
  const { petId } = useParams();
  const navigate = useNavigate();

  const {
    pet,
    currentUser,
    isLoggedIn,
    existingApp,
    formData,
    setFormData,
    errors,
    isSubmitting,
    isSubmitted,
    submittedApp,
    handleSubmit,
    handleChange
  } = useAdoptionApplication(petId);

  if (!pet) {
    return (
      <main className="pet-details-main" style={{ padding: '60px 24px', textAlign: 'center' }}>
        <EmptyAdoptionState
          type="not-found"
          title="Pet Not Found"
          message={`We couldn't find a rescue animal with identifier "${petId}". Please select an available animal from our listings.`}
          actionText="Browse Available Pets"
          onAction={() => navigate('/adopt')}
        />
      </main>
    );
  }

  // Success view
  if (isSubmitted && submittedApp) {
    return (
      <main style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '70vh', padding: '32px 16px' }}>
        <div className="success-screen-card">
          <i className="ph-fill ph-check-circle main-success-icon"></i>
          <h2>Application Submitted Successfully!</h2>
          <p>
            Thank you for applying to adopt <strong>{pet.name}</strong>. Your application has been logged and forwarded to{' '}
            <strong>{pet.ngoName || 'City Rescue NGO'}</strong>.
          </p>

          <div className="app-ref-box">
            Application Reference: <strong>{submittedApp.applicationId || submittedApp.id}</strong>
          </div>

          <div style={{ display: 'flex', gap: '16px', justifyContent: 'center' }}>
            <Link to="/adopt" className="btn-primary-large" style={{ padding: '14px 28px' }}>
              Browse More Pets
            </Link>
            <Link to="/" className="btn-secondary-large" style={{ padding: '14px 28px' }}>
              Return Home
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
      <div className="apply-container" id="application-content-grid">
        {/* Left Column: Form */}
        <div className="form-column">
          {/* 1. Pet Summary Header Card */}
          <section className="card" style={{ padding: '24px', marginBottom: '24px' }}>
            <div className="pet-summary-flex">
              <div className="pet-summary-img">
                <img
                  src={pet.images?.main || pet.image || pet.photo || 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&q=80&w=200'}
                  alt={pet.name}
                />
              </div>
              <div className="pet-summary-info">
                <span className="pet-summary-badge">Adoption Application</span>
                <h2>{pet.name}</h2>
                <div className="pet-summary-vitals">
                  <span>{pet.breed}</span> • <span>{pet.age}</span> • <span>{pet.gender}</span>
                </div>
                <div className="pet-summary-ngo">
                  <i className="ph-fill ph-shield-heart" style={{ color: '#0ea5e9' }}></i>
                  <span>{pet.ngoName || 'City Rescue NGO'}</span>
                </div>
              </div>
            </div>
            <div className="pet-summary-message">
              <i className="ph-fill ph-sparkles"></i>
              <span>You&apos;re one step closer to giving <strong>{pet.name}</strong> a loving forever home.</span>
            </div>
          </section>

          {existingApp && (
            <div
              className="card"
              style={{
                backgroundColor: '#fef2f2',
                borderColor: '#fca5a5',
                color: '#991b1b',
                padding: '20px',
                marginBottom: '24px'
              }}
            >
              <h4 style={{ margin: '0 0 6px' }}>Application Already on File</h4>
              <p style={{ margin: 0, fontSize: '0.95rem' }}>
                You already submitted an application ({existingApp.applicationId || existingApp.id}) for {pet.name} on{' '}
                {new Date(existingApp.appliedDate || existingApp.submittedAt).toLocaleDateString()} (Status: <strong>{existingApp.status}</strong>).
              </p>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {/* 2. Applicant Information */}
            <section className="card" style={{ padding: '24px', marginBottom: '24px' }}>
              <h3 className="card-title">
                <i className="ph-fill ph-user-circle"></i>
                <span>Applicant Information</span>
              </h3>
              <div className="form-grid-2">
                <div className="form-group">
                  <label htmlFor="txt-name">Full Name <span className="required">*</span></label>
                  <input
                    type="text"
                    id="txt-name"
                    name="fullName"
                    className="form-input"
                    placeholder="e.g. Arjun Dev"
                    required
                    value={formData.fullName}
                    onChange={handleChange}
                  />
                  {errors.fullName && <span style={{ color: '#ef4444', fontSize: '0.8rem' }}>{errors.fullName}</span>}
                </div>

                <div className="form-group">
                  <label htmlFor="txt-email">Email Address <span className="required">*</span></label>
                  <input
                    type="email"
                    id="txt-email"
                    name="email"
                    className="form-input"
                    placeholder="e.g. arjun@example.com"
                    required
                    value={formData.email}
                    onChange={handleChange}
                  />
                  {errors.email && <span style={{ color: '#ef4444', fontSize: '0.8rem' }}>{errors.email}</span>}
                </div>

                <div className="form-group">
                  <label htmlFor="txt-phone">Phone Number <span className="required">*</span></label>
                  <input
                    type="tel"
                    id="txt-phone"
                    name="phone"
                    className="form-input"
                    placeholder="e.g. +91 98765 43210"
                    required
                    value={formData.phone}
                    onChange={handleChange}
                  />
                  {errors.phone && <span style={{ color: '#ef4444', fontSize: '0.8rem' }}>{errors.phone}</span>}
                </div>

                <div className="form-group">
                  <label htmlFor="txt-city">City <span className="required">*</span></label>
                  <input
                    type="text"
                    id="txt-city"
                    name="city"
                    className="form-input"
                    placeholder="e.g. Mumbai"
                    required
                    value={formData.city}
                    onChange={handleChange}
                  />
                  {errors.city && <span style={{ color: '#ef4444', fontSize: '0.8rem' }}>{errors.city}</span>}
                </div>

                <div className="form-group">
                  <label htmlFor="txt-occupation">Occupation</label>
                  <input
                    type="text"
                    id="txt-occupation"
                    name="occupation"
                    className="form-input"
                    placeholder="e.g. Software Engineer"
                    value={formData.occupation}
                    onChange={handleChange}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="txt-age">Age</label>
                  <input
                    type="number"
                    id="txt-age"
                    name="age"
                    className="form-input"
                    placeholder="e.g. 28"
                    min="18"
                    value={formData.age}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </section>

            {/* 3. Living Environment */}
            <section className="card" style={{ padding: '24px', marginBottom: '24px' }}>
              <h3 className="card-title">
                <i className="ph-fill ph-house-line"></i>
                <span>Living Environment &amp; Experience</span>
              </h3>
              <div className="form-grid-2">
                <div className="form-group">
                  <label htmlFor="sel-housing">Housing Type</label>
                  <select
                    id="sel-housing"
                    name="housingType"
                    className="form-input"
                    value={formData.housingType}
                    onChange={handleChange}
                  >
                    <option value="Apartment / Flat">Apartment / Flat</option>
                    <option value="Independent House / Villa">Independent House / Villa</option>
                    <option value="Gated Community">Gated Community</option>
                    <option value="Farmhouse">Farmhouse</option>
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="sel-ownership">Home Ownership</label>
                  <select
                    id="sel-ownership"
                    name="ownership"
                    className="form-input"
                    value={formData.ownership}
                    onChange={handleChange}
                  >
                    <option value="Owned">Owned</option>
                    <option value="Rented (Pets Allowed)">Rented (Pets Allowed)</option>
                    <option value="Living with Family">Living with Family</option>
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="sel-exp">Pet Experience</label>
                  <select
                    id="sel-exp"
                    name="petExperience"
                    className="form-input"
                    value={formData.petExperience}
                    onChange={handleChange}
                  >
                    <option value="First-time pet parent">First-time pet parent</option>
                    <option value="Had pets in the past">Had pets in the past</option>
                    <option value="Currently have pets">Currently have pets at home</option>
                    <option value="Experienced rescuer / foster">Experienced rescuer / foster</option>
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="sel-hours">Hours Pet Left Alone Daily</label>
                  <select
                    id="sel-hours"
                    name="hoursAlone"
                    className="form-input"
                    value={formData.hoursAlone}
                    onChange={handleChange}
                  >
                    <option value="0 - 2 hours (WFH / Family)">0 – 2 hours (WFH / Family)</option>
                    <option value="2 - 4 hours">2 – 4 hours</option>
                    <option value="4 - 6 hours">4 – 6 hours</option>
                    <option value="6+ hours">6+ hours</option>
                  </select>
                </div>

                <div className="form-group span-2">
                  <label htmlFor="txt-reason">Why would you like to adopt {pet.name}? <span className="required">*</span></label>
                  <textarea
                    id="txt-reason"
                    name="reasonForAdopting"
                    className="form-input"
                    rows="3"
                    placeholder="Tell us a little about your home routine and why you chose this stray..."
                    required
                    value={formData.reasonForAdopting}
                    onChange={handleChange}
                  ></textarea>
                  {errors.reasonForAdopting && <span style={{ color: '#ef4444', fontSize: '0.8rem' }}>{errors.reasonForAdopting}</span>}
                </div>
              </div>
            </section>

            <button
              type="submit"
              className="btn-submit-application"
              disabled={isSubmitting || Boolean(existingApp)}
            >
              {isSubmitting ? 'Submitting Application...' : 'Submit Adoption Application'}
            </button>
          </form>
        </div>

        {/* Right Column: Support */}
        <div className="sidebar-column">
          <div className="card" style={{ padding: '24px', marginBottom: '24px' }}>
            <h4 style={{ margin: '0 0 12px', fontSize: '1.1rem', color: 'var(--text-main)' }}>
              <i className="ph-fill ph-shield-check" style={{ color: '#10b981' }}></i> Adoption Guarantee
            </h4>
            <ul style={{ margin: 0, paddingLeft: '20px', color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.6 }}>
              <li>100% Free Adoption (Zero broker fees)</li>
              <li>Free initial vaccination &amp; deworming</li>
              <li>30-day post-adoption behavioral support</li>
            </ul>
          </div>

          <div className="card" style={{ padding: '24px' }}>
            <h4 style={{ margin: '0 0 8px', fontSize: '1rem', color: 'var(--text-main)' }}>Need Help?</h4>
            <p style={{ margin: '0 0 12px', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              Our adoption coordinators are happy to assist you through the process.
            </p>
            <a
              href="mailto:adoptions@voiceofstray.org"
              style={{ color: '#b45309', fontWeight: 600, fontSize: '0.9rem', textDecoration: 'none' }}
            >
              adoptions@voiceofstray.org
            </a>
          </div>
        </div>
      </div>
    </main>
  );
}
