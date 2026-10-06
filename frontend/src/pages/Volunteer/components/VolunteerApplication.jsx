import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

export function VolunteerApplication({
  activeModal, // 'volunteer-modal' | 'foster-modal' | 'ngo-modal' | null
  onClose,
  onSubmitVolunteer,
  onSubmitNgo,
  currentUser,
  selectedSkills = ['First Aid'],
  selectedAvailability = 'Weekends'
}) {
  // Volunteer Form State
  const [volForm, setVolForm] = useState({
    name: '',
    email: '',
    phone: '',
    role: 'rescue',
    availability: selectedAvailability,
    skills: selectedSkills
  });

  // Foster Form State
  const [fosterForm, setFosterForm] = useState({
    name: '',
    email: '',
    housing: 'apt',
    pets: 'no'
  });

  // NGO Form State
  const [ngoForm, setNgoForm] = useState({
    name: '',
    email: '',
    reg: ''
  });

  const [errors, setErrors] = useState({});
  const [submittedModal, setSubmittedModal] = useState(null);

  // Autofill if user is logged in
  useEffect(() => {
    if (currentUser?.isLoggedIn) {
      setVolForm(prev => ({
        ...prev,
        name: currentUser.name || currentUser.username || '',
        email: currentUser.email || '',
        phone: currentUser.phone || '',
        availability: selectedAvailability || currentUser.volunteerAvailability || 'Weekends',
        skills: selectedSkills?.length ? selectedSkills : (currentUser.volunteerSkills || ['First Aid'])
      }));

      setFosterForm(prev => ({
        ...prev,
        name: currentUser.name || currentUser.username || '',
        email: currentUser.email || ''
      }));
    }
  }, [currentUser, selectedAvailability, selectedSkills]);

  useEffect(() => {
    // Reset errors when modal changes
    setErrors({});
    setSubmittedModal(null);
  }, [activeModal]);

  if (!activeModal) return null;

  const validateEmail = (email) => {
    return String(email)
      .toLowerCase()
      .match(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
  };

  const validatePhone = (phone) => {
    return String(phone).replace(/\D/g, '').length >= 10;
  };

  const handleVolunteerSubmit = (e) => {
    e.preventDefault();
    const errs = {};

    if (!volForm.name.trim()) errs.name = 'Full Name is required';
    if (!volForm.email.trim() || !validateEmail(volForm.email)) errs.email = 'Please enter a valid email address';
    if (!volForm.phone.trim() || !validatePhone(volForm.phone)) errs.phone = 'Please enter a valid 10-digit phone number';

    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }

    const res = onSubmitVolunteer({
      name: volForm.name,
      email: volForm.email,
      phone: volForm.phone,
      role: volForm.role,
      type: 'volunteer',
      availability: volForm.availability,
      skills: volForm.skills
    });

    if (res?.success) {
      setSubmittedModal('volunteer');
    }
  };

  const handleFosterSubmit = (e) => {
    e.preventDefault();
    const errs = {};

    if (!fosterForm.name.trim()) errs.name = 'Full Name is required';
    if (!fosterForm.email.trim() || !validateEmail(fosterForm.email)) errs.email = 'Please enter a valid email address';

    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }

    const res = onSubmitVolunteer({
      name: fosterForm.name,
      email: fosterForm.email,
      role: 'Foster Care Support',
      type: 'foster',
      availability: 'Weekends',
      skills: ['Fostering'],
      housing: fosterForm.housing,
      pets: fosterForm.pets
    });

    if (res?.success) {
      setSubmittedModal('foster');
    }
  };

  const handleNgoSubmit = (e) => {
    e.preventDefault();
    const errs = {};

    if (!ngoForm.name.trim()) errs.name = 'Organization Name is required';
    if (!ngoForm.email.trim() || !validateEmail(ngoForm.email)) errs.email = 'Please enter a valid official email address';
    if (!ngoForm.reg.trim()) errs.reg = 'Registration Number is required';

    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }

    const res = onSubmitNgo({
      name: ngoForm.name,
      email: ngoForm.email,
      reg: ngoForm.reg
    });

    if (res?.success) {
      setSubmittedModal('ngo');
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>
          <i className="ph-bold ph-x"></i>
        </button>

        {/* ========================================================
            VOLUNTEER MODAL
            ======================================================== */}
        {activeModal === 'volunteer-modal' && (
          <>
            {submittedModal === 'volunteer' ? (
              <div className="modal-success-msg">
                <i className="ph-fill ph-check-circle" style={{ fontSize: '3.5rem', color: '#10b981', marginBottom: '8px' }}></i>
                <h3 style={{ fontSize: '1.45rem', fontWeight: 800, color: '#1e293b' }}>Application Submitted</h3>
                <span
                  className="status-pill pending"
                  style={{
                    background: '#fef9c3',
                    color: '#854d0e',
                    padding: '6px 16px',
                    fontSize: '0.8rem',
                    fontWeight: 800,
                    borderRadius: '9999px',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                    marginBottom: '12px'
                  }}
                >
                  Pending Review
                </span>
                <p style={{ fontSize: '0.92rem', color: 'var(--text-muted, #64748b)', textAlign: 'center', lineHeight: 1.5, marginBottom: '20px' }}>
                  Your volunteer application has been successfully submitted and is currently under review by a partner NGO.<br /><br />
                  You will receive a notification once your application has been reviewed.
                </p>
                <Link
                  to="/user-dashboard"
                  className="btn-full orange"
                  onClick={onClose}
                  style={{ width: '100%', textDecoration: 'none' }}
                >
                  Return to Dashboard <i className="ph ph-arrow-right"></i>
                </Link>
              </div>
            ) : (
              <>
                <h3>Volunteer Registration</h3>
                <p>Join our network of heroes on the ground.</p>
                <form className="modal-form" onSubmit={handleVolunteerSubmit}>
                  <div className="form-group">
                    <label>Full Name *</label>
                    <input
                      type="text"
                      name="name"
                      placeholder="Enter your full name"
                      value={volForm.name}
                      onChange={(e) => setVolForm({ ...volForm, name: e.target.value })}
                    />
                    {errors.name && <span className="form-error">{errors.name}</span>}
                  </div>

                  <div className="form-group">
                    <label>Email Address *</label>
                    <input
                      type="email"
                      name="email"
                      placeholder="Enter your email"
                      value={volForm.email}
                      onChange={(e) => setVolForm({ ...volForm, email: e.target.value })}
                    />
                    {errors.email && <span className="form-error">{errors.email}</span>}
                  </div>

                  <div className="form-group">
                    <label>Phone Number *</label>
                    <input
                      type="tel"
                      name="phone"
                      placeholder="e.g. 9876543210"
                      value={volForm.phone}
                      onChange={(e) => setVolForm({ ...volForm, phone: e.target.value })}
                    />
                    {errors.phone && <span className="form-error">{errors.phone}</span>}
                  </div>

                  <div className="form-group">
                    <label>Primary Role</label>
                    <select
                      name="role"
                      value={volForm.role}
                      onChange={(e) => setVolForm({ ...volForm, role: e.target.value })}
                    >
                      <option value="rescue">Emergency Rescue</option>
                      <option value="transport">Transport</option>
                      <option value="feeding">Feeding Drives</option>
                      <option value="medical">Medical / Vet</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label>Availability Preference</label>
                    <select
                      name="availability"
                      value={volForm.availability}
                      onChange={(e) => setVolForm({ ...volForm, availability: e.target.value })}
                    >
                      <option value="Weekends">Weekends</option>
                      <option value="Weekdays">Weekdays</option>
                      <option value="Anytime">Anytime</option>
                    </select>
                  </div>

                  <button type="submit" className="btn-full orange" style={{ marginTop: '16px' }}>
                    Submit Registration
                  </button>
                </form>
              </>
            )}
          </>
        )}

        {/* ========================================================
            FOSTER MODAL
            ======================================================== */}
        {activeModal === 'foster-modal' && (
          <>
            {submittedModal === 'foster' ? (
              <div className="modal-success-msg">
                <i className="ph-fill ph-check-circle" style={{ fontSize: '3.5rem', color: '#10b981', marginBottom: '8px' }}></i>
                <h3 style={{ fontSize: '1.45rem', fontWeight: 800, color: '#1e293b' }}>Application Submitted</h3>
                <span
                  className="status-pill pending"
                  style={{
                    background: '#fef9c3',
                    color: '#854d0e',
                    padding: '6px 16px',
                    fontSize: '0.8rem',
                    fontWeight: 800,
                    borderRadius: '9999px',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                    marginBottom: '12px'
                  }}
                >
                  Pending Review
                </span>
                <p style={{ fontSize: '0.92rem', color: 'var(--text-muted, #64748b)', textAlign: 'center', lineHeight: 1.5, marginBottom: '20px' }}>
                  Your foster application has been successfully submitted and is currently under review by a partner NGO.<br /><br />
                  You will receive a notification once your application has been reviewed.
                </p>
                <Link
                  to="/user-dashboard"
                  className="btn-full orange"
                  onClick={onClose}
                  style={{ width: '100%', textDecoration: 'none' }}
                >
                  Return to Dashboard <i className="ph ph-arrow-right"></i>
                </Link>
              </div>
            ) : (
              <>
                <h3>Become a Foster Parent</h3>
                <p>Give a stray a temporary home while they heal.</p>
                <form className="modal-form" onSubmit={handleFosterSubmit}>
                  <div className="form-group">
                    <label>Full Name *</label>
                    <input
                      type="text"
                      name="name"
                      placeholder="Enter your full name"
                      value={fosterForm.name}
                      onChange={(e) => setFosterForm({ ...fosterForm, name: e.target.value })}
                    />
                    {errors.name && <span className="form-error">{errors.name}</span>}
                  </div>

                  <div className="form-group">
                    <label>Email Address *</label>
                    <input
                      type="email"
                      name="email"
                      placeholder="Enter your email"
                      value={fosterForm.email}
                      onChange={(e) => setFosterForm({ ...fosterForm, email: e.target.value })}
                    />
                    {errors.email && <span className="form-error">{errors.email}</span>}
                  </div>

                  <div className="form-group">
                    <label>Housing Type</label>
                    <select
                      name="housing"
                      value={fosterForm.housing}
                      onChange={(e) => setFosterForm({ ...fosterForm, housing: e.target.value })}
                    >
                      <option value="apt">Apartment</option>
                      <option value="house">House with yard</option>
                      <option value="other">Other</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label>Any current pets?</label>
                    <select
                      name="pets"
                      value={fosterForm.pets}
                      onChange={(e) => setFosterForm({ ...fosterForm, pets: e.target.value })}
                    >
                      <option value="no">No</option>
                      <option value="yes_dogs">Yes, Dogs</option>
                      <option value="yes_cats">Yes, Cats</option>
                      <option value="yes_both">Yes, Both</option>
                    </select>
                  </div>

                  <button type="submit" className="btn-full orange" style={{ marginTop: '16px' }}>
                    Apply to Foster
                  </button>
                </form>
              </>
            )}
          </>
        )}

        {/* ========================================================
            NGO MODAL
            ======================================================== */}
        {activeModal === 'ngo-modal' && (
          <>
            {submittedModal === 'ngo' ? (
              <div className="modal-success-msg">
                <i className="ph-fill ph-check-circle" style={{ fontSize: '3.5rem', color: '#10b981', marginBottom: '8px' }}></i>
                <h3 style={{ fontSize: '1.45rem', fontWeight: 800, color: '#1e293b' }}>Application Submitted</h3>
                <p style={{ fontSize: '0.92rem', color: 'var(--text-muted, #64748b)', textAlign: 'center', lineHeight: 1.5, marginBottom: '20px' }}>
                  Your organization details have been submitted. You can now visit your partner dashboard.
                </p>
                <Link
                  to="/ngo-dashboard"
                  className="btn-full blue"
                  onClick={onClose}
                  style={{ width: '100%', textDecoration: 'none' }}
                >
                  Go To NGO Dashboard <i className="ph ph-arrow-right"></i>
                </Link>
              </div>
            ) : (
              <>
                <h3>NGO Verification</h3>
                <p>Partner with us for direct funding and verified rescue alerts.</p>
                <form className="modal-form" onSubmit={handleNgoSubmit}>
                  <div className="form-group">
                    <label>Organization Name *</label>
                    <input
                      type="text"
                      name="name"
                      placeholder="Enter NGO name"
                      value={ngoForm.name}
                      onChange={(e) => setNgoForm({ ...ngoForm, name: e.target.value })}
                    />
                    {errors.name && <span className="form-error">{errors.name}</span>}
                  </div>

                  <div className="form-group">
                    <label>Official Email *</label>
                    <input
                      type="email"
                      name="email"
                      placeholder="contact@ngo.org"
                      value={ngoForm.email}
                      onChange={(e) => setNgoForm({ ...ngoForm, email: e.target.value })}
                    />
                    {errors.email && <span className="form-error">{errors.email}</span>}
                  </div>

                  <div className="form-group">
                    <label>Registration Number *</label>
                    <input
                      type="text"
                      name="reg"
                      placeholder="Enter registration ID"
                      value={ngoForm.reg}
                      onChange={(e) => setNgoForm({ ...ngoForm, reg: e.target.value })}
                    />
                    {errors.reg && <span className="form-error">{errors.reg}</span>}
                  </div>

                  <button type="submit" className="btn-full blue" style={{ marginTop: '16px' }}>
                    Start Onboarding
                  </button>
                </form>
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default VolunteerApplication;
