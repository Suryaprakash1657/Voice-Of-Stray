import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

export function VolunteerApplication({
  activeModal, // 'volunteer-modal' | 'foster-modal' | 'ngo-modal' | null
  onClose,
  onSubmitVolunteer,
  onSubmitNgo,
  currentUser,
  selectedSkills = ['First Aid'],
  selectedAvailability = 'Weekends',
  petReference = null
}) {
  const petDisplayName = typeof petReference === 'object' && petReference !== null
    ? (petReference.name || petReference.id || '')
    : (petReference || '');

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

  // NGO Form State with Document Uploads
  const [ngoForm, setNgoForm] = useState({
    name: '',
    email: '',
    reg: '',
    documents: []
  });

  const [errors, setErrors] = useState({});
  const [submittedModal, setSubmittedModal] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

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

      // Pre-fill NGO form if available
      try {
        const storedNgo = JSON.parse(localStorage.getItem('voiceOfStrayNgoProfile') || '{}');
        if (storedNgo.name || storedNgo.email) {
          setNgoForm(prev => ({
            ...prev,
            name: storedNgo.name || currentUser.name || '',
            email: storedNgo.email || currentUser.email || '',
            reg: storedNgo.regNumber || prev.reg
          }));
        }
      } catch (e) {}
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

  const handleVolunteerSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;

    const errs = {};
    if (!volForm.name.trim()) errs.name = 'Full Name is required';
    if (!volForm.email.trim() || !validateEmail(volForm.email)) errs.email = 'Please enter a valid email address';
    if (!volForm.phone.trim() || !validatePhone(volForm.phone)) errs.phone = 'Please enter a valid 10-digit phone number';

    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await onSubmitVolunteer({
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
      } else {
        setErrors({ general: res?.error || 'Failed to submit application. Please try again.' });
      }
    } catch (err) {
      console.error('[VolunteerApplication] Submit volunteer error:', err);
      setErrors({ general: err.message || 'An unexpected error occurred. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFosterSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;

    const errs = {};
    if (!fosterForm.name.trim()) errs.name = 'Full Name is required';
    if (!fosterForm.email.trim() || !validateEmail(fosterForm.email)) errs.email = 'Please enter a valid email address';

    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await onSubmitVolunteer({
        name: fosterForm.name,
        email: fosterForm.email,
        role: 'Foster Care Support',
        type: 'foster',
        availability: 'Weekends',
        skills: ['Fostering'],
        housing: fosterForm.housing,
        pets: fosterForm.pets,
        petPreference: petDisplayName
      });

      if (res?.success) {
        setSubmittedModal('foster');
      } else {
        setErrors({ general: res?.error || 'Failed to submit application. Please try again.' });
      }
    } catch (err) {
      console.error('[VolunteerApplication] Submit foster error:', err);
      setErrors({ general: err.message || 'An unexpected error occurred. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDocumentUpload = (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    const allowedExtensions = ['pdf', 'png', 'jpg', 'jpeg'];
    const maxSizeBytes = 10 * 1024 * 1024; // 10MB
    const newDocs = [];
    let fileError = null;

    files.forEach(file => {
      const ext = file.name.split('.').pop()?.toLowerCase();
      if (!allowedExtensions.includes(ext)) {
        fileError = `Unsupported file type for "${file.name}". Please upload PDF, PNG, JPG, or JPEG.`;
        return;
      }
      if (file.size > maxSizeBytes) {
        fileError = `File "${file.name}" exceeds the 10MB size limit.`;
        return;
      }
      newDocs.push({
        id: 'DOC-' + Math.random().toString(36).substr(2, 9),
        name: file.name,
        size: (file.size / 1024 / 1024).toFixed(2) + ' MB',
        type: ext.toUpperCase(),
        uploadedAt: new Date().toLocaleDateString(),
        status: 'Pending Verification'
      });
    });

    if (fileError) {
      setErrors(prev => ({ ...prev, documents: fileError }));
    } else {
      setErrors(prev => ({ ...prev, documents: null }));
      setNgoForm(prev => ({
        ...prev,
        documents: [...prev.documents, ...newDocs]
      }));
    }
  };

  const handleRemoveDocument = (docId) => {
    setNgoForm(prev => ({
      ...prev,
      documents: prev.documents.filter(d => d.id !== docId)
    }));
  };

  const handleNgoSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;

    const errs = {};
    if (!ngoForm.name.trim()) errs.name = 'Organization Name is required';
    if (!ngoForm.email.trim() || !validateEmail(ngoForm.email)) errs.email = 'Please enter a valid official email address';
    if (!ngoForm.reg.trim()) errs.reg = 'Registration Number is required';

    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await onSubmitNgo({
        name: ngoForm.name,
        email: ngoForm.email,
        reg: ngoForm.reg,
        documents: ngoForm.documents
      });

      if (res?.success) {
        setSubmittedModal('ngo');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay active show" onClick={onClose}>
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
              <div className="modal-success-msg show" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', background: 'transparent', padding: '16px 0', marginBottom: 0 }}>
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

                  <button type="submit" className="btn-full orange" disabled={isSubmitting} style={{ marginTop: '16px', opacity: isSubmitting ? 0.7 : 1 }}>
                    {isSubmitting ? 'Submitting Registration...' : 'Submit Registration'}
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
              <div className="modal-success-msg show" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', background: 'transparent', padding: '16px 0', marginBottom: 0 }}>
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

                {petDisplayName && (
                  <div
                    style={{
                      background: '#fff7ed',
                      border: '1px solid #fed7aa',
                      padding: '10px 14px',
                      borderRadius: '8px',
                      color: '#9a3412',
                      fontSize: '0.88rem',
                      fontWeight: 600,
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      marginBottom: '12px'
                    }}
                  >
                    <i className="ph-fill ph-paw-print"></i>
                    <span>Fostering Interest for: <strong>{petDisplayName}</strong></span>
                  </div>
                )}

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

                  <button type="submit" className="btn-full orange" disabled={isSubmitting} style={{ marginTop: '16px', opacity: isSubmitting ? 0.7 : 1 }}>
                    {isSubmitting ? 'Submitting Application...' : 'Apply to Foster'}
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
              <div className="modal-success-msg show" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', background: 'transparent', padding: '16px 0', marginBottom: 0 }}>
                <i className="ph-fill ph-check-circle" style={{ fontSize: '3.5rem', color: '#10b981', marginBottom: '8px' }}></i>
                <h3 style={{ fontSize: '1.45rem', fontWeight: 800, color: '#1e293b' }}>Verification Under Review</h3>
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
                  Pending Verification
                </span>
                <p style={{ fontSize: '0.92rem', color: 'var(--text-muted, #64748b)', textAlign: 'center', lineHeight: 1.5, marginBottom: '20px' }}>
                  Your organization details and {ngoForm.documents.length} verification document(s) have been submitted.<br /><br />
                  <strong>Note:</strong> Document upload does not automatically grant verified status. Our team will review your organization&apos;s legal credentials within 2–3 business days.
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
                <h3>NGO Verification &amp; Onboarding</h3>
                <p>Register and upload required documents for official verification.</p>
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
                      placeholder="Enter registration ID (e.g. NGO-12345-IND)"
                      value={ngoForm.reg}
                      onChange={(e) => setNgoForm({ ...ngoForm, reg: e.target.value })}
                    />
                    {errors.reg && <span className="form-error">{errors.reg}</span>}
                  </div>

                  {/* Document Upload Section */}
                  <div className="form-group" style={{ marginTop: '12px' }}>
                    <label style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span>Required Verification Documents</span>
                      <span style={{ fontSize: '0.75rem', color: '#64748b' }}>PDF, JPG, PNG (Max 10MB)</span>
                    </label>

                    <label
                      htmlFor="ngo-doc-upload-input"
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '6px',
                        padding: '16px',
                        border: '2px dashed #cbd5e1',
                        borderRadius: '8px',
                        background: '#f8fafc',
                        cursor: 'pointer',
                        transition: 'border-color 0.2s',
                        textAlign: 'center'
                      }}
                    >
                      <i className="ph-bold ph-upload-simple" style={{ fontSize: '1.5rem', color: '#0284c7' }}></i>
                      <span style={{ fontSize: '0.88rem', fontWeight: 600, color: '#334155' }}>
                        Click to select Legal / Financial documents
                      </span>
                      <span style={{ fontSize: '0.75rem', color: '#64748b' }}>
                        501(c)(3), 80G Certificate, or Registration Docs
                      </span>
                    </label>
                    <input
                      id="ngo-doc-upload-input"
                      type="file"
                      multiple
                      accept=".pdf,.png,.jpg,.jpeg"
                      onChange={handleDocumentUpload}
                      style={{ display: 'none' }}
                    />

                    {errors.documents && (
                      <span className="form-error" style={{ marginTop: '6px', display: 'block' }}>
                        {errors.documents}
                      </span>
                    )}

                    {ngoForm.documents.length > 0 && (
                      <div style={{ marginTop: '10px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                        {ngoForm.documents.map((doc) => (
                          <div
                            key={doc.id}
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'space-between',
                              padding: '8px 12px',
                              background: 'white',
                              border: '1px solid #e2e8f0',
                              borderRadius: '6px',
                              fontSize: '0.82rem'
                            }}
                          >
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                              <i className="ph-fill ph-file-text" style={{ color: '#0284c7' }}></i>
                              <span style={{ fontWeight: 600, color: '#0f172a' }}>{doc.name}</span>
                              <span style={{ color: '#64748b' }}>({doc.size})</span>
                            </div>
                            <button
                              type="button"
                              onClick={() => handleRemoveDocument(doc.id)}
                              style={{
                                background: 'none',
                                border: 'none',
                                color: '#ef4444',
                                cursor: 'pointer',
                                fontSize: '1.1rem',
                                padding: '2px'
                              }}
                              title="Remove document"
                            >
                              <i className="ph ph-trash"></i>
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <button
                    type="submit"
                    className="btn-full blue"
                    disabled={isSubmitting}
                    style={{ marginTop: '16px', opacity: isSubmitting ? 0.7 : 1 }}
                  >
                    {isSubmitting ? 'Submitting Details...' : 'Submit for Verification'}
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
