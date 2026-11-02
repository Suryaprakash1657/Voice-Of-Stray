import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authStorage } from '../Auth/services/authStorage.js';
import { processImageFile } from '../../utils/imageUpload.js';
import './ngo-edit-profile.css';

const presetLogos = [
  'https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&q=80&w=200',
  'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?auto=format&fit=crop&q=80&w=200',
  'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=format&fit=crop&q=80&w=200',
  'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?auto=format&fit=crop&q=80&w=200',
  'https://ui-avatars.com/api/?name=Paws+Haven&background=f97316&color=fff',
  'https://ui-avatars.com/api/?name=City+Rescue&background=14b8a6&color=fff'
];

export function NgoEditProfile() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [formData, setFormData] = useState({
    name: 'Paws Haven NGO',
    desc: 'Rescuing, rehabilitating, and rehoming stray animals since 2018. Operating 24/7 rescue ambulances across the city.',
    foundedYear: '2018',
    regNumber: 'NGO-12345-IND',
    email: 'contact@pawshaven.org',
    phone: '+91 98765 43210',
    website: 'www.pawshaven.org',
    address: '124 Rescue Ave',
    city: 'North District',
    state: 'Tamil Nadu',
    pincode: '627001',
    instagram: '',
    facebook: '',
    linkedin: '',
    youtube: '',
    logoUrl: 'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=format&fit=crop&q=80&w=200'
  });

  const [isLogoModalOpen, setIsLogoModalOpen] = useState(false);
  const [selectedLogo, setSelectedLogo] = useState(formData.logoUrl);
  const [customLogoUrl, setCustomLogoUrl] = useState('');
  const [logoModalTab, setLogoModalTab] = useState('upload');
  const [uploadedLogoFile, setUploadedLogoFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [showToast, setShowToast] = useState(false);

  useEffect(() => {
    document.title = 'Edit NGO Profile - Voice of Stray';

    const isLoggedIn = authStorage.isLoggedIn();
    if (!isLoggedIn) {
      navigate('/login');
      return;
    }

    const currentUser = authStorage.getCurrentUser();
    if (currentUser?.role !== 'ngo') {
      navigate('/user-edit-profile');
      return;
    }

    const storedUsername = localStorage.getItem('username') || currentUser?.name || 'Paws Haven NGO';
    const storedEmail = localStorage.getItem('email') || currentUser?.email || 'contact@pawshaven.org';
    const storedAvatar = localStorage.getItem('avatarUrl') || currentUser?.avatarUrl || presetLogos[0];

    let ngoProfile = {};
    const raw = localStorage.getItem('voiceOfStrayNgoProfile');
    if (raw) {
      try {
        ngoProfile = JSON.parse(raw);
      } catch (e) {}
    }

    setFormData((prev) => ({
      ...prev,
      name: ngoProfile.name || storedUsername || prev.name,
      email: ngoProfile.email || storedEmail || prev.email,
      desc: ngoProfile.desc || prev.desc,
      foundedYear: ngoProfile.foundedYear || prev.foundedYear,
      regNumber: ngoProfile.regNumber || prev.regNumber,
      phone: ngoProfile.phone || prev.phone,
      website: ngoProfile.website || prev.website,
      address: ngoProfile.address || prev.address,
      city: ngoProfile.city || prev.city,
      state: ngoProfile.state || prev.state,
      pincode: ngoProfile.pincode || prev.pincode,
      instagram: ngoProfile.instagram || prev.instagram,
      facebook: ngoProfile.facebook || prev.facebook,
      linkedin: ngoProfile.linkedin || prev.linkedin,
      youtube: ngoProfile.youtube || prev.youtube,
      logoUrl: ngoProfile.logoUrl || storedAvatar || prev.logoUrl
    }));
  }, []);

  const triggerToast = (msg) => {
    setToastMessage(msg);
    setShowToast(true);
    setTimeout(() => {
      setShowToast(false);
    }, 2000);
  };

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    const fieldMap = {
      'input-ngo-name': 'name',
      'input-ngo-desc': 'desc',
      'input-founded-year': 'foundedYear',
      'input-reg-number': 'regNumber',
      'input-ngo-email': 'email',
      'input-ngo-phone': 'phone',
      'input-ngo-website': 'website',
      'input-ngo-address': 'address',
      'input-ngo-city': 'city',
      'input-ngo-state': 'state',
      'input-ngo-pincode': 'pincode',
      'input-social-instagram': 'instagram',
      'input-social-facebook': 'facebook',
      'input-social-linkedin': 'linkedin',
      'input-social-youtube': 'youtube'
    };

    const field = fieldMap[id];
    if (field) {
      setFormData((prev) => ({ ...prev, [field]: value }));
    }
  };

  const openLogoModal = () => {
    setSelectedLogo(formData.logoUrl);
    setCustomLogoUrl('');
    setUploadedLogoFile(null);
    setLogoModalTab('upload');
    setIsLogoModalOpen(true);
  };

  const handleLocalLogoSelect = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      triggerToast('Processing logo from your folder...');
      const dataUrl = await processImageFile(file, { maxWidth: 600, maxHeight: 600, quality: 0.9 });
      setSelectedLogo(dataUrl);
      setUploadedLogoFile({
        dataUrl,
        name: file.name,
        size: `${(file.size / 1024).toFixed(1)} KB`
      });
      triggerToast('Logo ready! Click "Use Selected Logo" to apply.');
    } catch (err) {
      triggerToast(err.message || 'Error processing logo image');
    } finally {
      if (e.target) e.target.value = '';
    }
  };

  const handleLogoDrop = async (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (!file) return;

    try {
      triggerToast('Reading dropped image...');
      const dataUrl = await processImageFile(file, { maxWidth: 600, maxHeight: 600, quality: 0.9 });
      setSelectedLogo(dataUrl);
      setUploadedLogoFile({
        dataUrl,
        name: file.name,
        size: `${(file.size / 1024).toFixed(1)} KB`
      });
      triggerToast('Logo loaded from your folder!');
    } catch (err) {
      triggerToast(err.message || 'Error processing image');
    }
  };

  const handleDirectLogoDrop = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    const file = e.dataTransfer.files?.[0];
    if (!file) return;

    try {
      triggerToast('Updating logo directly from your folder...');
      const dataUrl = await processImageFile(file, { maxWidth: 600, maxHeight: 600, quality: 0.9 });
      setFormData((prev) => ({ ...prev, logoUrl: dataUrl }));
      setSelectedLogo(dataUrl);
      triggerToast('Logo updated from folder!');
    } catch (err) {
      triggerToast(err.message || 'Error uploading logo');
    }
  };

  const saveLogoSelection = () => {
    const finalLogo = customLogoUrl.trim() || selectedLogo;
    if (!finalLogo) return;
    setFormData((prev) => ({ ...prev, logoUrl: finalLogo }));
    setIsLogoModalOpen(false);
    triggerToast('NGO Logo updated!');
  };

  const removeLogo = () => {
    setFormData((prev) => ({ ...prev, logoUrl: '' }));
    triggerToast('NGO Logo removed.');
  };

  const handleSave = (e) => {
    e.preventDefault();

    localStorage.setItem('username', formData.name);
    localStorage.setItem('email', formData.email);
    localStorage.setItem('avatarUrl', formData.logoUrl);
    localStorage.setItem('voiceOfStrayNgoProfile', JSON.stringify(formData));

    window.dispatchEvent(new Event('storage'));
    window.dispatchEvent(new CustomEvent('auth-change'));

    triggerToast('NGO Profile updated successfully!');
    setTimeout(() => {
      navigate('/ngo-dashboard');
    }, 1000);
  };

  const initials = (formData.name || 'NGO')
    .split(' ')
    .map((w) => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className="ngo-edit-page-wrapper">
      <main className="ngo-edit-container">
        {/* Left Column: Edit Panels */}
        <div>
          <div className="back-btn-container">
            <Link to="/ngo-dashboard" className="back-link">
              <i className="ph ph-arrow-left"></i> Back to NGO Dashboard
            </Link>
          </div>

          {/* Hero Section */}
          <section className="ngo-edit-hero">
            <div className="ngo-edit-hero-info">
              <h1>Edit NGO Profile</h1>
              <p>Manage the information adopters, volunteers, donors, and community members see across Voice of Stray.</p>
            </div>
            <div className="ngo-identity-display">
              <div
                className="avatar-edit-wrapper"
                onClick={openLogoModal}
                onDrop={handleDirectLogoDrop}
                onDragOver={(e) => e.preventDefault()}
                title="Change Logo (Click or drag & drop image from your folder)"
                style={{
                  width: '80px',
                  height: '80px',
                  borderRadius: 'var(--radius-md)',
                  border: '3px solid white',
                  boxShadow: 'var(--shadow-md)',
                  background: 'var(--primary)',
                  color: 'white',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.8rem',
                  fontWeight: 800,
                  overflow: 'hidden'
                }}
              >
                {formData.logoUrl ? (
                  <img src={formData.logoUrl} alt="Logo" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  <span>{initials}</span>
                )}
                <div className="avatar-edit-overlay">
                  <i className="ph ph-camera" style={{ fontSize: '1.5rem' }}></i>
                </div>
              </div>
              <div>
                <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-main)', margin: '0 0 2px 0' }}>
                  {formData.name}
                </h2>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  Partner NGO
                </span>
              </div>
            </div>
          </section>

          <form onSubmit={handleSave}>
            {/* Logo Management Section */}
            <section className="ngo-edit-card">
              <h3 className="card-title">
                <i className="ph ph-image"></i> Organization Logo
              </h3>
              <div style={{ display: 'flex', alignItems: 'center', gap: '24px', flexWrap: 'wrap' }}>
                <div
                  onDrop={handleDirectLogoDrop}
                  onDragOver={(e) => e.preventDefault()}
                  title="Drop photo from your folder here"
                  style={{
                    width: '100px',
                    height: '100px',
                    borderRadius: 'var(--radius-md)',
                    overflow: 'hidden',
                    background: 'var(--primary)',
                    border: '1.5px solid var(--border)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '2.2rem',
                    fontWeight: 800,
                    color: 'white',
                    boxShadow: 'var(--shadow-sm)',
                    flexShrink: 0
                  }}
                >
                  {formData.logoUrl ? (
                    <img src={formData.logoUrl} alt="Logo" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : (
                    <span>{initials}</span>
                  )}
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                    <button
                      type="button"
                      className="btn-action save"
                      style={{ padding: '10px 22px', fontSize: '0.9rem' }}
                      onClick={openLogoModal}
                    >
                      <i className="ph ph-upload-simple"></i> Change Logo
                    </button>
                    <button
                      type="button"
                      className="btn-action cancel"
                      style={{ padding: '10px 22px', fontSize: '0.9rem', color: '#ef4444', borderColor: 'rgba(239, 68, 68, 0.2)' }}
                      onClick={removeLogo}
                    >
                      <i className="ph ph-trash"></i> Remove Logo
                    </button>
                  </div>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 500 }}>
                    Supported formats: PNG, JPG, JPEG, SVG
                  </span>
                </div>
              </div>
            </section>

            {/* 1. Organization Info */}
            <section className="ngo-edit-card">
              <h3 className="card-title">
                <i className="ph ph-buildings"></i> Organization Information
              </h3>
              <div className="form-grid">
                <div className="form-group span-2">
                  <label htmlFor="input-ngo-name">NGO Name</label>
                  <input
                    type="text"
                    id="input-ngo-name"
                    className="input-glass"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="e.g. Paws Haven NGO"
                    required
                  />
                </div>
                <div className="form-group span-2">
                  <label htmlFor="input-ngo-desc">Description</label>
                  <textarea
                    id="input-ngo-desc"
                    className="input-glass"
                    value={formData.desc}
                    onChange={handleInputChange}
                    placeholder="Describe your organization's mission, history, and goals..."
                  ></textarea>
                </div>
                <div className="form-group">
                  <label htmlFor="input-founded-year">Founded Year</label>
                  <input
                    type="number"
                    id="input-founded-year"
                    className="input-glass"
                    value={formData.foundedYear}
                    onChange={handleInputChange}
                    placeholder="e.g. 2018"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="input-reg-number">Registration Number</label>
                  <input
                    type="text"
                    id="input-reg-number"
                    className="input-glass"
                    value={formData.regNumber}
                    onChange={handleInputChange}
                    placeholder="e.g. NGO-12345-IND"
                  />
                </div>
              </div>
            </section>

            {/* 2. Contact Information */}
            <section className="ngo-edit-card">
              <h3 className="card-title">
                <i className="ph ph-phone-call"></i> Contact Information
              </h3>
              <div className="form-grid">
                <div className="form-group">
                  <label htmlFor="input-ngo-email">Contact Email</label>
                  <input
                    type="email"
                    id="input-ngo-email"
                    className="input-glass"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="e.g. contact@pawshaven.org"
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="input-ngo-phone">Phone Number</label>
                  <input
                    type="text"
                    id="input-ngo-phone"
                    className="input-glass"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="e.g. +91 98765 43210"
                  />
                </div>
                <div className="form-group span-2">
                  <label htmlFor="input-ngo-website">Website</label>
                  <input
                    type="text"
                    id="input-ngo-website"
                    className="input-glass"
                    value={formData.website}
                    onChange={handleInputChange}
                    placeholder="e.g. www.pawshaven.org"
                  />
                </div>
              </div>
            </section>

            {/* 3. Location Information */}
            <section className="ngo-edit-card">
              <h3 className="card-title">
                <i className="ph ph-map-pin"></i> Location Information
              </h3>
              <div className="form-grid">
                <div className="form-group span-2">
                  <label htmlFor="input-ngo-address">Address</label>
                  <input
                    type="text"
                    id="input-ngo-address"
                    className="input-glass"
                    value={formData.address}
                    onChange={handleInputChange}
                    placeholder="e.g. 124 Rescue Ave"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="input-ngo-city">City</label>
                  <input
                    type="text"
                    id="input-ngo-city"
                    className="input-glass"
                    value={formData.city}
                    onChange={handleInputChange}
                    placeholder="e.g. North District"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="input-ngo-state">State</label>
                  <input
                    type="text"
                    id="input-ngo-state"
                    className="input-glass"
                    value={formData.state}
                    onChange={handleInputChange}
                    placeholder="e.g. Tamil Nadu"
                  />
                </div>
                <div className="form-group span-2">
                  <label htmlFor="input-ngo-pincode">Pincode</label>
                  <input
                    type="text"
                    id="input-ngo-pincode"
                    className="input-glass"
                    value={formData.pincode}
                    onChange={handleInputChange}
                    placeholder="e.g. 627001"
                  />
                </div>
              </div>
            </section>

            {/* 4. Social Links */}
            <section className="ngo-edit-card">
              <h3 className="card-title">
                <i className="ph ph-share-network"></i> Social Links
              </h3>
              <div className="form-grid">
                <div className="form-group">
                  <label htmlFor="input-social-instagram">
                    <i className="ph ph-instagram" style={{ verticalAlign: 'middle', marginRight: '4px' }}></i> Instagram
                  </label>
                  <input
                    type="text"
                    id="input-social-instagram"
                    className="input-glass"
                    value={formData.instagram}
                    onChange={handleInputChange}
                    placeholder="Instagram URL (Optional)"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="input-social-facebook">
                    <i className="ph ph-facebook-logo" style={{ verticalAlign: 'middle', marginRight: '4px' }}></i> Facebook
                  </label>
                  <input
                    type="text"
                    id="input-social-facebook"
                    className="input-glass"
                    value={formData.facebook}
                    onChange={handleInputChange}
                    placeholder="Facebook URL (Optional)"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="input-social-linkedin">
                    <i className="ph ph-linkedin-logo" style={{ verticalAlign: 'middle', marginRight: '4px' }}></i> LinkedIn
                  </label>
                  <input
                    type="text"
                    id="input-social-linkedin"
                    className="input-glass"
                    value={formData.linkedin}
                    onChange={handleInputChange}
                    placeholder="LinkedIn URL (Optional)"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="input-social-youtube">
                    <i className="ph ph-youtube-logo" style={{ verticalAlign: 'middle', marginRight: '4px' }}></i> YouTube
                  </label>
                  <input
                    type="text"
                    id="input-social-youtube"
                    className="input-glass"
                    value={formData.youtube}
                    onChange={handleInputChange}
                    placeholder="YouTube URL (Optional)"
                  />
                </div>
              </div>
            </section>

            {/* Actions Bar */}
            <div className="actions-bar">
              <button type="button" className="btn-action cancel" onClick={() => navigate('/ngo-dashboard')}>
                Cancel
              </button>
              <button type="submit" className="btn-action save">
                Save Changes
              </button>
            </div>
          </form>
        </div>

        {/* Right Column: Sticky Live Preview */}
        <aside className="preview-column">
          <div className="sticky-card">
            <span className="preview-badge">Live Preview</span>
            <div className="ngo-header">
              <div className="ngo-avatar">
                {formData.logoUrl ? (
                  <img src={formData.logoUrl} alt="Logo" />
                ) : (
                  <span>{initials}</span>
                )}
              </div>
              <div>
                <h3 style={{ margin: '0 0 2px 0', fontSize: '1.3rem', fontWeight: 800, color: 'var(--text-main)' }}>
                  {formData.name}
                </h3>
                <span className="verified-badge">
                  <i className="ph-fill ph-seal-check"></i> Verified Partner
                </span>
              </div>
            </div>

            <div className="ngo-stats">
              <div className="n-stat">
                <strong>4.8</strong>
                <span><i className="ph-fill ph-star" style={{ color: '#f59e0b' }}></i> Rating</span>
              </div>
              <div className="n-stat">
                <strong>1.2k</strong>
                <span>Adoptions</span>
              </div>
              <div className="n-stat">
                <strong>15</strong>
                <span>Active Pets</span>
              </div>
            </div>

            <p className="ngo-desc">{formData.desc}</p>

            <div className="ngo-contact-info">
              <p>
                <i className="ph ph-map-pin"></i>{' '}
                {formData.address ? `${formData.address}, ${formData.city}, ${formData.state} - ${formData.pincode}` : 'Address not set'}
              </p>
              <p>
                <i className="ph ph-clock"></i> Open Today: 9:00 AM - 6:00 PM
              </p>
              <p>
                <i className="ph ph-envelope"></i> {formData.email}
              </p>
              <p>
                <i className="ph ph-phone"></i> {formData.phone}
              </p>
              {formData.website && (
                <p>
                  <i className="ph ph-globe"></i> {formData.website}
                </p>
              )}
            </div>
          </div>
        </aside>
      </main>

      {/* LOGO SELECTOR MODAL */}
      {isLogoModalOpen && (
        <div className="photo-selector-overlay" onClick={() => setIsLogoModalOpen(false)}>
          <div className="photo-modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header-row">
              <h3>
                <i className="ph ph-images-square"></i> Select NGO Logo
              </h3>
              <button className="modal-close-btn" onClick={() => setIsLogoModalOpen(false)}>
                <i className="ph ph-x"></i>
              </button>
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              style={{ display: 'none' }}
              onChange={handleLocalLogoSelect}
            />

            <div className="modal-tabs">
              <button
                type="button"
                className={`modal-tab-btn ${logoModalTab === 'upload' ? 'active' : ''}`}
                onClick={() => setLogoModalTab('upload')}
              >
                <i className="ph ph-folder-open"></i> Upload from Folder
              </button>
              <button
                type="button"
                className={`modal-tab-btn ${logoModalTab === 'presets' ? 'active' : ''}`}
                onClick={() => setLogoModalTab('presets')}
              >
                <i className="ph ph-images"></i> Preset Logos
              </button>
              <button
                type="button"
                className={`modal-tab-btn ${logoModalTab === 'url' ? 'active' : ''}`}
                onClick={() => setLogoModalTab('url')}
              >
                <i className="ph ph-link"></i> Web URL
              </button>
            </div>

            <div className="modal-body">
              {logoModalTab === 'upload' && (
                <div>
                  <div
                    className={`file-dropzone ${isDragging ? 'dragover' : ''}`}
                    onClick={() => fileInputRef.current?.click()}
                    onDragOver={(e) => {
                      e.preventDefault();
                      setIsDragging(true);
                    }}
                    onDragLeave={() => setIsDragging(false)}
                    onDrop={handleLogoDrop}
                  >
                    <i className="ph ph-cloud-arrow-up dropzone-icon"></i>
                    <div className="dropzone-text">
                      <strong>Choose logo image from your computer or folder</strong>
                      <p>Drag and drop image here or click to browse files</p>
                      <span className="dropzone-hint">Supports JPG, PNG, WEBP, SVG (auto-optimized)</span>
                    </div>
                    <button
                      type="button"
                      className="btn-browse-file"
                      onClick={(e) => {
                        e.stopPropagation();
                        fileInputRef.current?.click();
                      }}
                    >
                      <i className="ph ph-folder"></i> Browse My Computer
                    </button>
                  </div>

                  {uploadedLogoFile && (
                    <div className="file-preview-strip">
                      <img
                        src={uploadedLogoFile.dataUrl}
                        alt="Uploaded preview"
                        className="file-preview-thumb"
                      />
                      <div className="file-preview-info">
                        <div className="file-preview-name">{uploadedLogoFile.name}</div>
                        <div className="file-preview-meta">
                          <i className="ph ph-check-circle" style={{ color: 'var(--success, #22c55e)' }}></i> Ready to apply &bull; {uploadedLogoFile.size}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {logoModalTab === 'presets' && (
                <div>
                  <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '12px' }}>
                    Choose one of our preset NGO logos:
                  </p>
                  <div className="image-options-grid">
                    {presetLogos.map((url, idx) => (
                      <div
                        key={idx}
                        className={`image-option-item ${selectedLogo === url ? 'selected' : ''}`}
                        onClick={() => {
                          setSelectedLogo(url);
                          setCustomLogoUrl('');
                          setUploadedLogoFile(null);
                        }}
                      >
                        <img src={url} alt={`Preset Logo ${idx + 1}`} />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {logoModalTab === 'url' && (
                <div>
                  <div className="url-input-wrap">
                    <label style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                      Logo URL (HTTPS)
                    </label>
                    <div className="url-input-row">
                      <input
                        type="url"
                        className="input-glass"
                        placeholder="https://..."
                        value={customLogoUrl}
                        onChange={(e) => {
                          setCustomLogoUrl(e.target.value);
                          setSelectedLogo(e.target.value);
                          setUploadedLogoFile(null);
                        }}
                      />
                    </div>
                    {selectedLogo && !uploadedLogoFile && (
                      <div style={{ marginTop: '12px', textAlign: 'center' }}>
                        <img
                          src={selectedLogo}
                          alt="URL Preview"
                          style={{ width: '80px', height: '80px', borderRadius: 'var(--radius-sm)', objectFit: 'cover', border: '2px solid var(--primary)' }}
                          onError={(e) => { e.currentTarget.style.display = 'none'; }}
                        />
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            <div className="modal-actions-row">
              <button className="btn-action cancel" onClick={() => setIsLogoModalOpen(false)}>
                Cancel
              </button>
              <button className="btn-action save" disabled={!selectedLogo && !customLogoUrl} onClick={saveLogoSelection}>
                Use Selected Logo
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast */}
      <div className={`editor-notification ${showToast ? 'show' : ''}`}>
        <i className="ph ph-check-circle"></i>
        <span>{toastMessage}</span>
      </div>
    </div>
  );
}

export default NgoEditProfile;
