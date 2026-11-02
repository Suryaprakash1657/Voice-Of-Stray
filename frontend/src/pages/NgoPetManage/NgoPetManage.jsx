import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { processImageFile } from '../../utils/imageUpload.js';
import './ngo-pet-manage.css';

const PRESET_IMAGES = [
  'https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&q=80&w=800',
  'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?auto=format&fit=crop&q=80&w=800',
  'https://images.unsplash.com/photo-1537151608828-ea2b11777ee8?auto=format&fit=crop&q=80&w=800',
  'https://images.unsplash.com/photo-1517849845537-4d257902454a?auto=format&fit=crop&q=80&w=800',
  'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&q=80&w=800',
  'https://images.unsplash.com/photo-1533738363-b7f9aef128ce?auto=format&fit=crop&q=80&w=800'
];

function getNgoInitials(name) {
  if (!name) return 'CR';
  const words = name.trim().split(/\s+/);
  if (words.length === 1) return words[0].slice(0, 2).toUpperCase();
  return (words[0][0] + words[1][0]).toUpperCase();
}

export function NgoPetManage() {
  const navigate = useNavigate();

  const [orgName, setOrgName] = useState(() => localStorage.getItem('username') || 'City Rescue NGO');
  const orgInitials = getNgoInitials(orgName);

  const [petState, setPetState] = useState({
    id: '',
    name: '',
    breed: '',
    age: '',
    gender: '',
    location: '',
    rescueDate: '',
    fosterBadge: '',
    status: 'Draft',
    shortDesc: '',
    story: '',
    attributes: {
      vaccinated: false,
      vetchecked: false,
      neutered: false,
      goodkids: false,
      goodpets: false,
      housetrained: false
    },
    // Mirror for test assertions & compatibility with migrationDeepAudit
    badges: {
      vaccinated: false,
      vetchecked: false,
      neutered: false,
      goodkids: false,
      goodpets: false,
      housetrained: false
    },
    images: {
      main: '',
      thumbs: [null, null, null, null]
    },
    personality: {
      energy: 50,
      temperament: '',
      training: '',
      dailyNotes: '',
      lifestyleNotes: ''
    },
    medical: {
      vaccines: { title: 'Vaccines', desc: '' },
      treatments: { title: 'Treatments', desc: '' },
      surgeries: { title: 'Surgeries', desc: '' },
      diet: { title: 'Dietary Notes', desc: '' }
    },
    requirements: {
      family: { title: 'Family Type', desc: '' },
      yard: { title: 'Yard / Home', desc: '' },
      exp: { title: 'Experience', desc: '' },
      pets: { title: 'Other Pets', desc: '' }
    }
  });

  const fileInputRef = useRef(null);
  const [photoModalOpen, setPhotoModalOpen] = useState(false);
  const [photoModalSlot, setPhotoModalSlot] = useState(null); // 'main' | 0 | 1 | 2 | 3
  const [modalActiveTab, setModalActiveTab] = useState('upload'); // 'upload' | 'presets' | 'url'
  const [selectedModalPhotoUrl, setSelectedModalPhotoUrl] = useState(null);
  const [uploadedFilePreview, setUploadedFilePreview] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [customImageUrl, setCustomImageUrl] = useState('');
  const [toastMessage, setToastMessage] = useState(null);

  // Auth check & load draft
  useEffect(() => {
    document.title = 'NGO Pet Profile Builder - Voice of Stray';

    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    const role = localStorage.getItem('role') || 'ngo';

    if (!isLoggedIn) {
      navigate('/login');
      return;
    }
    if (role !== 'ngo') {
      navigate('/user-dashboard');
      return;
    }

    const currentNgoName = localStorage.getItem('username') || 'City Rescue NGO';
    setOrgName(currentNgoName);

    // Load saved draft if present
    const saved = localStorage.getItem('voiceOfStrayCurrentPet');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setPetState((prev) => {
          const mergedAttrs = {
            ...prev.attributes,
            ...(parsed.attributes || parsed.badges || {})
          };
          return {
            ...prev,
            ...parsed,
            attributes: mergedAttrs,
            badges: mergedAttrs,
            images: {
              main: parsed.images?.main || prev.images.main,
              thumbs: Array.isArray(parsed.images?.thumbs) && parsed.images.thumbs.length === 4
                ? parsed.images.thumbs
                : prev.images.thumbs
            },
            personality: {
              ...prev.personality,
              ...(parsed.personality || {})
            },
            medical: {
              vaccines: { ...prev.medical.vaccines, ...(parsed.medical?.vaccines || {}) },
              treatments: { ...prev.medical.treatments, ...(parsed.medical?.treatments || {}) },
              surgeries: { ...prev.medical.surgeries, ...(parsed.medical?.surgeries || {}) },
              diet: { ...prev.medical.diet, ...(parsed.medical?.diet || {}) }
            },
            requirements: {
              family: { ...prev.requirements.family, ...(parsed.requirements?.family || {}) },
              yard: { ...prev.requirements.yard, ...(parsed.requirements?.yard || {}) },
              exp: { ...prev.requirements.exp, ...(parsed.requirements?.exp || {}) },
              pets: { ...prev.requirements.pets, ...(parsed.requirements?.pets || {}) }
            }
          };
        });
        showToast('Loaded unsaved draft profile', 'info');
      } catch (e) {
        console.error('Error loading draft pet:', e);
      }
    }
  }, [navigate]);

  const showToast = (msg, type = 'success') => {
    setToastMessage({ msg, type });
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  const handleToggleBadge = (key) => {
    setPetState((prev) => {
      const nextVal = !prev.attributes[key];
      const updated = { ...prev.attributes, [key]: nextVal };
      return {
        ...prev,
        attributes: updated,
        badges: updated
      };
    });
  };

  const getEnergyInfo = (val) => {
    if (val < 33) return { label: 'Low Energy', fillClass: 'energy-fill-low' };
    if (val < 66) return { label: 'Medium Energy', fillClass: 'energy-fill-med' };
    return { label: 'High Energy', fillClass: 'energy-fill-high' };
  };

  // Photo Selector Modal handlers
  const openPhotoSelector = (slot) => {
    setPhotoModalSlot(slot);
    setSelectedModalPhotoUrl(null);
    setCustomImageUrl('');
    setUploadedFilePreview(null);
    setModalActiveTab('upload');
    setPhotoModalOpen(true);
  };

  const closePhotoSelector = () => {
    setPhotoModalOpen(false);
    setPhotoModalSlot(null);
    setSelectedModalPhotoUrl(null);
    setUploadedFilePreview(null);
    setIsDragging(false);
  };

  const handleLocalFileSelect = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      showToast('Processing photo from your folder...', 'info');
      const dataUrl = await processImageFile(file, { maxWidth: 1200, maxHeight: 1200, quality: 0.85 });
      setSelectedModalPhotoUrl(dataUrl);
      setUploadedFilePreview({
        dataUrl,
        name: file.name,
        size: `${(file.size / 1024).toFixed(1)} KB`
      });
      showToast('Photo loaded from your folder! Click "Use This Photo" to apply.', 'success');
    } catch (err) {
      showToast(err.message || 'Error processing image', 'info');
    } finally {
      if (e.target) e.target.value = '';
    }
  };

  const handleModalDrop = async (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (!file) return;

    try {
      showToast('Reading dropped image...', 'info');
      const dataUrl = await processImageFile(file, { maxWidth: 1200, maxHeight: 1200, quality: 0.85 });
      setSelectedModalPhotoUrl(dataUrl);
      setUploadedFilePreview({
        dataUrl,
        name: file.name,
        size: `${(file.size / 1024).toFixed(1)} KB`
      });
      showToast('Photo loaded from your folder!', 'success');
    } catch (err) {
      showToast(err.message || 'Error processing image', 'info');
    }
  };

  const handleDirectFileDrop = async (e, slot) => {
    e.preventDefault();
    e.stopPropagation();
    const file = e.dataTransfer.files?.[0];
    if (!file) return;

    try {
      showToast('Uploading photo directly to gallery...', 'info');
      const dataUrl = await processImageFile(file, { maxWidth: 1200, maxHeight: 1200, quality: 0.85 });
      if (slot === 'main') {
        setPetState((prev) => ({
          ...prev,
          images: { ...prev.images, main: dataUrl }
        }));
      } else if (typeof slot === 'number') {
        setPetState((prev) => {
          const nextThumbs = [...prev.images.thumbs];
          nextThumbs[slot] = dataUrl;
          return {
            ...prev,
            images: { ...prev.images, thumbs: nextThumbs }
          };
        });
      }
      showToast('Photo updated directly from your folder!', 'success');
    } catch (err) {
      showToast(err.message || 'Error uploading photo', 'info');
    }
  };

  const selectMockPhoto = (url) => {
    setSelectedModalPhotoUrl(url);
    setUploadedFilePreview(null);
  };

  const applyCustomImageUrl = () => {
    const val = customImageUrl.trim();
    if (val !== '') {
      setSelectedModalPhotoUrl(val);
      setUploadedFilePreview(null);
      saveSelectedPhoto(val);
    } else {
      showToast('Please select an image option or paste a URL', 'info');
    }
  };

  const saveSelectedPhoto = (overrideUrl) => {
    const urlToUse = overrideUrl || selectedModalPhotoUrl || PRESET_IMAGES[0];
    const targetSlot = photoModalSlot !== null ? photoModalSlot : 'main';

    if (targetSlot === 'main') {
      setPetState((prev) => ({
        ...prev,
        images: { ...prev.images, main: urlToUse }
      }));
    } else if (typeof targetSlot === 'number') {
      setPetState((prev) => {
        const nextThumbs = [...prev.images.thumbs];
        nextThumbs[targetSlot] = urlToUse;
        return {
          ...prev,
          images: { ...prev.images, thumbs: nextThumbs }
        };
      });
    }

    closePhotoSelector();
    showToast('Photo updated in workspace gallery', 'success');
  };

  const deletePhoto = (slot) => {
    if (slot === 'main') {
      setPetState((prev) => ({
        ...prev,
        images: {
          main: '',
          thumbs: [null, null, null, null]
        }
      }));
    } else {
      setPetState((prev) => {
        const nextThumbs = [...prev.images.thumbs];
        nextThumbs[slot] = null;
        return {
          ...prev,
          images: { ...prev.images, thumbs: nextThumbs }
        };
      });
    }
    showToast('Photo removed from gallery', 'info');
  };

  // Actions
  const handleSaveDraft = () => {
    const current = {
      ...petState,
      ngoName: orgName,
      ngoInitials: orgInitials
    };
    localStorage.setItem('voiceOfStrayCurrentPet', JSON.stringify(current));
    showToast('Profile draft changes saved to database!', 'success');
  };

  const handlePreview = () => {
    if (!petState.name.trim()) {
      showToast('Please specify a Pet Name before previewing!', 'info');
      return;
    }

    const current = {
      ...petState,
      ngoName: orgName,
      ngoInitials: orgInitials
    };
    localStorage.setItem('voiceOfStrayCurrentPet', JSON.stringify(current));
    showToast('Generating adopter preview...', 'success');
    setTimeout(() => {
      navigate('/pet-details.html?preview=true');
    }, 800);
  };

  const handlePublish = () => {
    if (!petState.name.trim()) {
      showToast('Error: Pet Name cannot be blank when publishing!', 'info');
      return;
    }
    if (!petState.images.main) {
      showToast('Error: Showcase photo is required to publish!', 'info');
      return;
    }

    const petId = petState.id || `PET-${Math.floor(1000 + Math.random() * 9000)}`;
    const publishedPet = {
      ...petState,
      id: petId,
      status: 'Ready for Adoption',
      ngoName: orgName,
      ngoInitials: orgInitials,
      publishedAt: new Date().toISOString()
    };

    let customPets = [];
    try {
      customPets = JSON.parse(localStorage.getItem('voiceOfStrayCustomPets') || '[]');
    } catch (e) {
      customPets = [];
    }

    const existingIdx = customPets.findIndex((p) => p.id === petId);
    if (existingIdx >= 0) {
      customPets[existingIdx] = publishedPet;
    } else {
      customPets.push(publishedPet);
    }

    localStorage.setItem('voiceOfStrayCustomPets', JSON.stringify(customPets));
    localStorage.setItem('voiceOfStrayCurrentPet', JSON.stringify(publishedPet));

    window.dispatchEvent(new Event('storage'));
    window.dispatchEvent(new CustomEvent('voiceOfStrayCustomPetsUpdated', { detail: customPets }));
    window.dispatchEvent(new CustomEvent('voiceOfStrayPetsUpdated', { detail: customPets }));

    showToast('Profile Published! Ready for adopters.', 'success');
    setTimeout(() => {
      navigate('/adopt');
    }, 1200);
  };

  const energyInfo = getEnergyInfo(petState.personality.energy);

  return (
    <div className="ngo-pet-manage-wrapper">
      {/* Shared Background Sparkles */}
      <div className="bg-decorations">
        <svg
          className="decor-item sparkle"
          style={{ top: '15%', left: '8%', width: '40px', height: '40px' }}
          viewBox="0 0 256 256"
        >
          <path
            d="M243,128.5A115,115,0,0,1,128.5,243,115,115,0,0,1,14,128.5,115,115,0,0,1,128.5,14,115,115,0,0,1,243,128.5Z"
            fill="none"
            stroke="currentColor"
            strokeWidth="16"
          />
          <path
            d="M128,80v96M80,128h96"
            fill="none"
            stroke="currentColor"
            strokeWidth="16"
            strokeLinecap="round"
          />
        </svg>
        <svg
          className="decor-item sparkle"
          style={{ top: '60%', right: '5%', width: '50px', height: '50px' }}
          viewBox="0 0 256 256"
        >
          <path d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm0,192a88,88,0,1,1,88-88A88.1,88.1,0,0,1,128,216Z" />
        </svg>
      </div>

      {/* STICKY TOP NGO ACTION BAR */}
      <header className="editor-action-bar">
        <div className="action-bar-container">
          <div className="editor-mode-label">
            <h2>
              <i className="ph ph-note-pencil"></i> Pet Profile Builder
            </h2>
            <span className="editor-mode-tag">WYSIWYG Editor</span>
          </div>
          <div className="bar-actions">
            <div className="status-select-wrap">
              <label htmlFor="profile-status">Profile Status</label>
              <select
                id="profile-status"
                className="status-select"
                value={petState.status}
                onChange={(e) => setPetState({ ...petState, status: e.target.value })}
              >
                <option value="Draft">Draft</option>
                <option value="Ready for Adoption">Ready for Adoption</option>
                <option value="Adoption Pending">Adoption Pending</option>
                <option value="Adopted">Adopted</option>
              </select>
            </div>
            <button
              type="button"
              className="btn-editor preview"
              id="btn-preview"
              onClick={handlePreview}
            >
              <i className="ph ph-eye"></i> Preview Public View
            </button>
            <button
              type="button"
              className="btn-editor save"
              id="btn-save"
              onClick={handleSaveDraft}
            >
              <i className="ph ph-floppy-disk"></i> Save Changes
            </button>
            <button
              type="button"
              className="btn-editor publish"
              id="btn-publish"
              onClick={handlePublish}
            >
              <i className="ph ph-rocket-launch"></i> Publish Profile
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Container */}
      <main className="pet-details-main" style={{ position: 'relative', zIndex: 1 }}>
        <div className="back-btn-container">
          <Link to="/ngo-dashboard" className="back-link">
            <i className="ph ph-arrow-left"></i> Back to NGO Dashboard
          </Link>
        </div>

        {/* 1. HERO PROFILE EDITOR */}
        <section
          className="hero-profile card"
          style={{
            background: 'rgba(255,255,255,0.75)',
            backdropFilter: 'blur(15px)',
            padding: '32px',
            border: '1px solid rgba(249,115,22,0.1)'
          }}
        >
          {/* Image Gallery Panel */}
          <div className="hero-gallery">
            {!petState.images.main ? (
              <div
                id="gallery-empty-state"
                className="empty-gallery-state"
                onClick={() => openPhotoSelector('main')}
                onDragOver={(e) => { e.preventDefault(); }}
                onDrop={(e) => handleDirectFileDrop(e, 'main')}
              >
                <i className="ph ph-camera-plus"></i>
                <h4>No Pet Photos Uploaded Yet</h4>
                <p>Click to select a photo from your folder, or drag & drop an image file here.</p>
                <div
                  style={{
                    marginTop: '12px',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    background: 'white',
                    padding: '8px 18px',
                    borderRadius: '9999px',
                    fontSize: '0.85rem',
                    fontWeight: 700,
                    color: 'var(--primary)',
                    boxShadow: '0 2px 8px rgba(249,115,22,0.15)'
                  }}
                >
                  <i className="ph ph-folder-open"></i> Browse from Folder
                </div>
              </div>
            ) : (
              <div id="gallery-active-workspace" className="active-gallery-container">
                <div
                  className="uploader-main-image"
                  onDragOver={(e) => { e.preventDefault(); }}
                  onDrop={(e) => handleDirectFileDrop(e, 'main')}
                >
                  <img id="display-main-image" src={petState.images.main} alt="Showcase" />
                  <div className="photo-overlay-actions">
                    <div
                      className="overlay-btn"
                      onClick={() => openPhotoSelector('main')}
                      title="Replace Photo (Browse Folder or Library)"
                    >
                      <i className="ph ph-pencil-simple"></i>
                    </div>
                    <div
                      className="overlay-btn delete"
                      onClick={() => deletePhoto('main')}
                      title="Delete Photo"
                    >
                      <i className="ph ph-trash"></i>
                    </div>
                  </div>
                  <div className="image-badge-edit">
                    <i
                      className="ph ph-tag"
                      style={{ color: 'white', fontSize: '0.9rem', marginRight: '4px' }}
                    ></i>
                    <input
                      type="text"
                      id="pet-foster-badge"
                      placeholder="e.g. Urgent Foster Needed"
                      value={petState.fosterBadge}
                      onChange={(e) => setPetState({ ...petState, fosterBadge: e.target.value })}
                    />
                  </div>
                </div>

                <div className="uploader-thumb-grid">
                  {[0, 1, 2, 3].map((slot) => {
                    const thumbUrl = petState.images.thumbs[slot];
                    return thumbUrl ? (
                      <div
                        key={slot}
                        className="uploader-thumb-slot has-image"
                        id={`thumb-slot-${slot}`}
                        onDragOver={(e) => { e.preventDefault(); }}
                        onDrop={(e) => handleDirectFileDrop(e, slot)}
                      >
                        <img src={thumbUrl} alt={`Thumb ${slot + 1}`} />
                        <div className="photo-overlay-actions">
                          <div
                            className="overlay-btn"
                            onClick={(e) => {
                              e.stopPropagation();
                              openPhotoSelector(slot);
                            }}
                            title="Replace Photo"
                          >
                            <i className="ph ph-pencil-simple"></i>
                          </div>
                          <div
                            className="overlay-btn delete"
                            onClick={(e) => {
                              e.stopPropagation();
                              deletePhoto(slot);
                            }}
                            title="Delete"
                          >
                            <i className="ph ph-trash"></i>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div
                        key={slot}
                        className="uploader-thumb-slot"
                        id={`thumb-slot-${slot}`}
                        onClick={() => openPhotoSelector(slot)}
                        onDragOver={(e) => { e.preventDefault(); }}
                        onDrop={(e) => handleDirectFileDrop(e, slot)}
                      >
                        <i className="ph ph-plus plus-icon"></i>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Pet Vital Headers Grid */}
          <div className="hero-info">
            <div className="breadcrumb">
              <Link to="/adopt">Adopt</Link>
              <i className="ph ph-caret-right"></i>
              <span>Dogs</span>
              <i className="ph ph-caret-right"></i>
              <span id="breadcrumb-pet-name" style={{ fontWeight: 700, color: 'var(--primary)' }}>
                {petState.name.trim() !== '' ? petState.name : 'New Profile'}
              </span>
            </div>

            <div className="pet-title-area">
              <input
                type="text"
                id="pet-name"
                className="wysiwyg-title-input"
                placeholder="Enter Pet Name..."
                value={petState.name}
                onChange={(e) => setPetState({ ...petState, name: e.target.value })}
              />

              <div className="pet-vital-stats" style={{ marginTop: '12px' }}>
                <span className="editable-stat-pill">
                  <i className="ph ph-paw-print" style={{ color: 'var(--text-muted)' }}></i>
                  <input
                    type="text"
                    id="pet-breed"
                    placeholder="Breed/Mix..."
                    style={{ width: '140px' }}
                    value={petState.breed}
                    onChange={(e) => setPetState({ ...petState, breed: e.target.value })}
                  />
                </span>
                <span className="editable-stat-pill">
                  <i className="ph ph-hourglass" style={{ color: 'var(--text-muted)' }}></i>
                  <input
                    type="text"
                    id="pet-age"
                    placeholder="Age (e.g. 2 Years)..."
                    style={{ width: '120px' }}
                    value={petState.age}
                    onChange={(e) => setPetState({ ...petState, age: e.target.value })}
                  />
                </span>
                <span className="editable-stat-pill">
                  <i
                    className="ph ph-gender-intercellular"
                    style={{ color: 'var(--text-muted)' }}
                  ></i>
                  <select
                    id="pet-gender"
                    value={petState.gender}
                    onChange={(e) => setPetState({ ...petState, gender: e.target.value })}
                  >
                    <option value="" disabled>
                      Gender...
                    </option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                  </select>
                </span>
                <span className="editable-stat-pill distance-pill">
                  <i className="ph ph-map-pin"></i>
                  <input
                    type="text"
                    id="pet-location"
                    placeholder="Pet Location (e.g. Paws Haven Shelter)..."
                    style={{ width: '240px' }}
                    value={petState.location}
                    onChange={(e) => setPetState({ ...petState, location: e.target.value })}
                  />
                </span>
              </div>
            </div>

            <div className="rescue-date-line">
              <i className="ph ph-calendar"></i>
              <span
                style={{
                  fontSize: '0.95rem',
                  fontWeight: 600,
                  color: 'var(--text-muted)',
                  marginRight: '8px'
                }}
              >
                Rescued on
              </span>
              <input
                type="text"
                id="pet-rescue-date"
                className="input-glass"
                placeholder="e.g. October 12, 2025"
                style={{ width: '200px', padding: '4px 8px', fontSize: '0.9rem', fontWeight: 600 }}
                value={petState.rescueDate}
                onChange={(e) => setPetState({ ...petState, rescueDate: e.target.value })}
              />
            </div>

            {/* Attributes badging editor */}
            <div className="badges-grid-edit">
              <div
                className={`feature-badge-toggle healthy ${petState.attributes.vaccinated ? 'active' : ''}`}
                id="badge-vaccinated"
                onClick={() => handleToggleBadge('vaccinated')}
              >
                <span className="badge-left-side">
                  <i className="ph-fill ph-check-circle"></i> Vaccinated
                </span>
                <span className="badge-checkbox">
                  <i className="ph ph-check"></i>
                </span>
              </div>
              <div
                className={`feature-badge-toggle healthy ${petState.attributes.vetchecked ? 'active' : ''}`}
                id="badge-vetchecked"
                onClick={() => handleToggleBadge('vetchecked')}
              >
                <span className="badge-left-side">
                  <i className="ph-fill ph-stethoscope"></i> Vet Checked
                </span>
                <span className="badge-checkbox">
                  <i className="ph ph-check"></i>
                </span>
              </div>
              <div
                className={`feature-badge-toggle healthy ${petState.attributes.neutered ? 'active' : ''}`}
                id="badge-neutered"
                onClick={() => handleToggleBadge('neutered')}
              >
                <span className="badge-left-side">
                  <i className="ph-fill ph-scissors"></i> Neutered
                </span>
                <span className="badge-checkbox">
                  <i className="ph ph-check"></i>
                </span>
              </div>
              <div
                className={`feature-badge-toggle behavioral ${petState.attributes.goodkids ? 'active' : ''}`}
                id="badge-goodkids"
                onClick={() => handleToggleBadge('goodkids')}
              >
                <span className="badge-left-side">
                  <i className="ph-fill ph-baby"></i> Good with Kids
                </span>
                <span className="badge-checkbox">
                  <i className="ph ph-check"></i>
                </span>
              </div>
              <div
                className={`feature-badge-toggle behavioral ${petState.attributes.goodpets ? 'active' : ''}`}
                id="badge-goodpets"
                onClick={() => handleToggleBadge('goodpets')}
              >
                <span className="badge-left-side">
                  <i className="ph-fill ph-paw-print"></i> Good with Pets
                </span>
                <span className="badge-checkbox">
                  <i className="ph ph-check"></i>
                </span>
              </div>
              <div
                className={`feature-badge-toggle behavioral ${petState.attributes.housetrained ? 'active' : ''}`}
                id="badge-housetrained"
                onClick={() => handleToggleBadge('housetrained')}
              >
                <span className="badge-left-side">
                  <i className="ph-fill ph-house"></i> House Trained
                </span>
                <span className="badge-checkbox">
                  <i className="ph ph-check"></i>
                </span>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label
                htmlFor="pet-short-desc"
                style={{
                  fontSize: '0.8rem',
                  fontWeight: 800,
                  color: 'var(--text-muted)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px'
                }}
              >
                Short Summary Highlight
              </label>
              <textarea
                id="pet-short-desc"
                className="story-textarea-editor"
                placeholder="Write a short catchy summary for adopters (appears on the main adoption card)..."
                style={{ minHeight: '80px', marginBottom: 0 }}
                value={petState.shortDesc}
                onChange={(e) => setPetState({ ...petState, shortDesc: e.target.value })}
              ></textarea>
            </div>
          </div>
        </section>

        <div className="content-split-layout">
          {/* LEFT COLUMN (Details Editor) */}
          <div className="details-column">
            {/* 2. FULL RESCUE STORY */}
            <section
              className="detail-section card"
              id="story"
              style={{ background: 'rgba(255,255,255,0.7)', backdropFilter: 'blur(10px)' }}
            >
              <h2>Rescue & Story Editor</h2>
              <textarea
                id="pet-story"
                className="story-textarea-editor"
                placeholder="Write the pet's story here... Include rescue background details, personality remarks, recovery highlights, and the type of home they would thrive in. Guidance: A warm, authentic tone helps adopters connect emotionally."
                value={petState.story}
                onChange={(e) => setPetState({ ...petState, story: e.target.value })}
              ></textarea>

              <h3
                style={{
                  fontSize: '1.25rem',
                  fontWeight: 700,
                  color: 'var(--text-main)',
                  marginBottom: '16px'
                }}
              >
                Rescue Timeline Tracker
              </h3>
              <p
                style={{
                  fontSize: '0.88rem',
                  color: 'var(--text-muted)',
                  marginBottom: '24px'
                }}
              >
                The workflow checkpoints below are automatically managed through operational logs. Placeholder nodes are displayed below to visualize what adopters will track.
              </p>

              <div className="rescue-timeline">
                <div className="timeline-item completed">
                  <div className="tl-icon">
                    <i className="ph ph-warning-circle"></i>
                  </div>
                  <div className="tl-content">
                    <h5>Reported</h5>
                    <span>Timeline Verified</span>
                  </div>
                </div>
                <div className="timeline-item completed">
                  <div className="tl-icon">
                    <i className="ph ph-ambulance"></i>
                  </div>
                  <div className="tl-content">
                    <h5>Rescued</h5>
                    <span>Operations Completed</span>
                  </div>
                </div>
                <div className="timeline-item completed">
                  <div className="tl-icon">
                    <i className="ph ph-first-aid"></i>
                  </div>
                  <div className="tl-content">
                    <h5>Treated</h5>
                    <span>Medical Cleared</span>
                  </div>
                </div>
                <div className="timeline-item completed">
                  <div className="tl-icon">
                    <i className="ph ph-house-line"></i>
                  </div>
                  <div className="tl-content">
                    <h5>Fostered</h5>
                    <span>Socialization Logged</span>
                  </div>
                </div>
                <div className="timeline-item active">
                  <div className="tl-icon">
                    <i className="ph-fill ph-heart"></i>
                  </div>
                  <div className="tl-content">
                    <h5>Ready for Adoption</h5>
                    <span>Awaiting Matching</span>
                  </div>
                </div>
              </div>
            </section>

            {/* 3. PERSONALITY PROFILE */}
            <section
              className="detail-section card"
              id="personality"
              style={{ background: 'rgba(255,255,255,0.7)', backdropFilter: 'blur(10px)' }}
            >
              <h2>Personality Profile</h2>

              <div className="personality-bars">
                <div className="trait-row">
                  <div className="trait-label">
                    <i className="ph ph-lightning"></i>
                    <span>Energy Level</span>
                  </div>
                  <div className="range-slider-wrap">
                    <input
                      type="range"
                      id="trait-energy"
                      min="0"
                      max="100"
                      value={petState.personality.energy}
                      className={`range-input ${energyInfo.fillClass}`}
                      onChange={(e) =>
                        setPetState({
                          ...petState,
                          personality: {
                            ...petState.personality,
                            energy: parseInt(e.target.value) || 0
                          }
                        })
                      }
                    />
                  </div>
                  <span className="trait-value" id="label-energy">
                    {energyInfo.label}
                  </span>
                </div>

                <div className="trait-row">
                  <div className="trait-label">
                    <i className="ph ph-coffee"></i>
                    <span>Temperament</span>
                  </div>
                  <div style={{ flex: 1, display: 'flex', alignItems: 'center' }}>
                    <select
                      id="trait-temperament"
                      className="trait-dropdown-edit"
                      value={petState.personality.temperament}
                      onChange={(e) =>
                        setPetState({
                          ...petState,
                          personality: {
                            ...petState.personality,
                            temperament: e.target.value
                          }
                        })
                      }
                    >
                      <option value="" disabled>
                        Select Temperament...
                      </option>
                      <option value="Friendly/Calm">Friendly/Calm</option>
                      <option value="Playful/Active">Playful/Active</option>
                      <option value="Shy/Gentle">Shy/Gentle</option>
                      <option value="Protective/Loyal">Protective/Loyal</option>
                      <option value="Independent/Quiet">Independent/Quiet</option>
                    </select>
                  </div>
                  <span className="trait-value">Dropdown Selector</span>
                </div>

                <div className="trait-row">
                  <div className="trait-label">
                    <i className="ph ph-graduation-cap"></i>
                    <span>Training Level</span>
                  </div>
                  <div style={{ flex: 1, display: 'flex', alignItems: 'center' }}>
                    <select
                      id="trait-training"
                      className="trait-dropdown-edit"
                      value={petState.personality.training}
                      onChange={(e) =>
                        setPetState({
                          ...petState,
                          personality: {
                            ...petState.personality,
                            training: e.target.value
                          }
                        })
                      }
                    >
                      <option value="" disabled>
                        Select Training...
                      </option>
                      <option value="Knows Commands">Knows Commands</option>
                      <option value="Basic Training">Basic Training</option>
                      <option value="Advanced Training">Advanced Training</option>
                      <option value="Needs Training">Needs Training</option>
                    </select>
                  </div>
                  <span className="trait-value">Dropdown Selector</span>
                </div>
              </div>

              <div className="behavior-grid">
                <div className="behavior-item" style={{ background: 'rgba(255,255,255,0.45)' }}>
                  <div className="b-icon" style={{ color: '#ea580c', boxShadow: 'var(--shadow-sm)' }}>
                    <i className="ph ph-sneaker"></i>
                  </div>
                  <div className="b-text" style={{ flex: 1 }}>
                    <strong>Daily Behavior Notes</strong>
                    <textarea
                      id="behavior-daily"
                      className="behavior-input"
                      placeholder="e.g. Loves morning walks, naps in the afternoon sun..."
                      value={petState.personality.dailyNotes}
                      onChange={(e) =>
                        setPetState({
                          ...petState,
                          personality: {
                            ...petState.personality,
                            dailyNotes: e.target.value
                          }
                        })
                      }
                    ></textarea>
                  </div>
                </div>
                <div className="behavior-item" style={{ background: 'rgba(255,255,255,0.45)' }}>
                  <div className="b-icon" style={{ color: '#0ea5e9', boxShadow: 'var(--shadow-sm)' }}>
                    <i className="ph ph-house"></i>
                  </div>
                  <div className="b-text" style={{ flex: 1 }}>
                    <strong>Lifestyle Fit Notes</strong>
                    <textarea
                      id="behavior-lifestyle"
                      className="behavior-input"
                      placeholder="e.g. Active family, hiking companion, house with yard..."
                      value={petState.personality.lifestyleNotes}
                      onChange={(e) =>
                        setPetState({
                          ...petState,
                          personality: {
                            ...petState.personality,
                            lifestyleNotes: e.target.value
                          }
                        })
                      }
                    ></textarea>
                  </div>
                </div>
              </div>
            </section>

            {/* 4. MEDICAL & CARE NEEDS */}
            <section
              className="detail-section card"
              id="medical"
              style={{ background: 'rgba(255,255,255,0.7)', backdropFilter: 'blur(10px)' }}
            >
              <h2>Medical & Care Log Cards</h2>
              <p
                style={{
                  fontSize: '0.88rem',
                  color: 'var(--text-muted)',
                  marginBottom: '24px'
                }}
              >
                Configure specific diagnostic reports, treatments, surgeries, and nutrition directives for this pet profile below. Cards can be updated independently.
              </p>

              <div className="medical-grid">
                {/* Vaccine Card */}
                <div className="med-card-edit">
                  <i className="ph ph-syringe"></i>
                  <input
                    type="text"
                    className="med-card-title-input"
                    id="med-vaccines-title"
                    placeholder="Vaccine Status..."
                    value={petState.medical.vaccines.title}
                    onChange={(e) =>
                      setPetState({
                        ...petState,
                        medical: {
                          ...petState.medical,
                          vaccines: { ...petState.medical.vaccines, title: e.target.value }
                        }
                      })
                    }
                  />
                  <textarea
                    className="med-card-desc-input"
                    id="med-vaccines-desc"
                    placeholder="e.g. Fully up to date (Rabies, DHPP)..."
                    value={petState.medical.vaccines.desc}
                    onChange={(e) =>
                      setPetState({
                        ...petState,
                        medical: {
                          ...petState.medical,
                          vaccines: { ...petState.medical.vaccines, desc: e.target.value }
                        }
                      })
                    }
                  ></textarea>
                </div>
                {/* Treatments Card */}
                <div className="med-card-edit">
                  <i className="ph ph-bug-droid" style={{ color: '#0284c7' }}></i>
                  <input
                    type="text"
                    className="med-card-title-input"
                    id="med-treatments-title"
                    placeholder="Treatments Log..."
                    value={petState.medical.treatments.title}
                    onChange={(e) =>
                      setPetState({
                        ...petState,
                        medical: {
                          ...petState.medical,
                          treatments: { ...petState.medical.treatments, title: e.target.value }
                        }
                      })
                    }
                  />
                  <textarea
                    className="med-card-desc-input"
                    id="med-treatments-desc"
                    placeholder="e.g. Monthly flea/tick preventative needed..."
                    value={petState.medical.treatments.desc}
                    onChange={(e) =>
                      setPetState({
                        ...petState,
                        medical: {
                          ...petState.medical,
                          treatments: { ...petState.medical.treatments, desc: e.target.value }
                        }
                      })
                    }
                  ></textarea>
                </div>
                {/* Surgeries Card */}
                <div className="med-card-edit">
                  <i className="ph ph-scissors" style={{ color: '#e11d48' }}></i>
                  <input
                    type="text"
                    className="med-card-title-input"
                    id="med-surgeries-title"
                    placeholder="Surgeries Log..."
                    value={petState.medical.surgeries.title}
                    onChange={(e) =>
                      setPetState({
                        ...petState,
                        medical: {
                          ...petState.medical,
                          surgeries: { ...petState.medical.surgeries, title: e.target.value }
                        }
                      })
                    }
                  />
                  <textarea
                    className="med-card-desc-input"
                    id="med-surgeries-desc"
                    placeholder="e.g. Neutered, healed perfectly..."
                    value={petState.medical.surgeries.desc}
                    onChange={(e) =>
                      setPetState({
                        ...petState,
                        medical: {
                          ...petState.medical,
                          surgeries: { ...petState.medical.surgeries, desc: e.target.value }
                        }
                      })
                    }
                  ></textarea>
                </div>
                {/* Dietary Card */}
                <div className="med-card-edit special">
                  <i className="ph ph-bowl-food"></i>
                  <input
                    type="text"
                    className="med-card-title-input"
                    id="med-diet-title"
                    placeholder="Dietary Guidelines..."
                    value={petState.medical.diet.title}
                    onChange={(e) =>
                      setPetState({
                        ...petState,
                        medical: {
                          ...petState.medical,
                          diet: { ...petState.medical.diet, title: e.target.value }
                        }
                      })
                    }
                  />
                  <textarea
                    className="med-card-desc-input"
                    id="med-diet-desc"
                    placeholder="e.g. Grain-free diet required due to mild allergies..."
                    value={petState.medical.diet.desc}
                    onChange={(e) =>
                      setPetState({
                        ...petState,
                        medical: {
                          ...petState.medical,
                          diet: { ...petState.medical.diet, desc: e.target.value }
                        }
                      })
                    }
                  ></textarea>
                </div>
              </div>
            </section>

            {/* 5. ADOPTION REQUIREMENTS */}
            <section
              className="detail-section card"
              id="requirements"
              style={{ background: 'rgba(255,255,255,0.7)', backdropFilter: 'blur(10px)' }}
            >
              <h2>Adoption Requirements</h2>
              <p className="req-intro">
                Formulate the optimal family match requirements for this pet below:
              </p>

              <ul className="req-list">
                {/* Family */}
                <li className="req-item-edit">
                  <i className="ph-fill ph-users-three"></i>
                  <div className="req-edit-inputs">
                    <input
                      type="text"
                      className="req-title-input"
                      id="req-family-title"
                      placeholder="Family Requirement Category..."
                      value={petState.requirements.family.title}
                      onChange={(e) =>
                        setPetState({
                          ...petState,
                          requirements: {
                            ...petState.requirements,
                            family: { ...petState.requirements.family, title: e.target.value }
                          }
                        })
                      }
                    />
                    <textarea
                      className="req-desc-input"
                      id="req-family-desc"
                      placeholder="e.g. Great for active families, couples, or singles. Good with older children..."
                      value={petState.requirements.family.desc}
                      onChange={(e) =>
                        setPetState({
                          ...petState,
                          requirements: {
                            ...petState.requirements,
                            family: { ...petState.requirements.family, desc: e.target.value }
                          }
                        })
                      }
                    ></textarea>
                  </div>
                </li>
                {/* Yard */}
                <li className="req-item-edit">
                  <i className="ph-fill ph-house-line"></i>
                  <div className="req-edit-inputs">
                    <input
                      type="text"
                      className="req-title-input"
                      id="req-yard-title"
                      placeholder="Yard Requirement Category..."
                      value={petState.requirements.yard.title}
                      onChange={(e) =>
                        setPetState({
                          ...petState,
                          requirements: {
                            ...petState.requirements,
                            yard: { ...petState.requirements.yard, title: e.target.value }
                          }
                        })
                      }
                    />
                    <textarea
                      className="req-desc-input"
                      id="req-yard-desc"
                      placeholder="e.g. Fenced yard required. Not highly suitable for small apartments..."
                      value={petState.requirements.yard.desc}
                      onChange={(e) =>
                        setPetState({
                          ...petState,
                          requirements: {
                            ...petState.requirements,
                            yard: { ...petState.requirements.yard, desc: e.target.value }
                          }
                        })
                      }
                    ></textarea>
                  </div>
                </li>
                {/* Experience */}
                <li className="req-item-edit">
                  <i className="ph-fill ph-medal"></i>
                  <div className="req-edit-inputs">
                    <input
                      type="text"
                      className="req-title-input"
                      id="req-exp-title"
                      placeholder="Experience Requirement Category..."
                      value={petState.requirements.exp.title}
                      onChange={(e) =>
                        setPetState({
                          ...petState,
                          requirements: {
                            ...petState.requirements,
                            exp: { ...petState.requirements.exp, title: e.target.value }
                          }
                        })
                      }
                    />
                    <textarea
                      className="req-desc-input"
                      id="req-exp-desc"
                      placeholder="e.g. First-time owners welcome, but large-breed experience is a plus..."
                      value={petState.requirements.exp.desc}
                      onChange={(e) =>
                        setPetState({
                          ...petState,
                          requirements: {
                            ...petState.requirements,
                            exp: { ...petState.requirements.exp, desc: e.target.value }
                          }
                        })
                      }
                    ></textarea>
                  </div>
                </li>
                {/* Other pets */}
                <li className="req-item-edit">
                  <i className="ph-fill ph-cat"></i>
                  <div className="req-edit-inputs">
                    <input
                      type="text"
                      className="req-title-input"
                      id="req-pets-title"
                      placeholder="Other Animal Match Rules..."
                      value={petState.requirements.pets.title}
                      onChange={(e) =>
                        setPetState({
                          ...petState,
                          requirements: {
                            ...petState.requirements,
                            pets: { ...petState.requirements.pets, title: e.target.value }
                          }
                        })
                      }
                    />
                    <textarea
                      className="req-desc-input"
                      id="req-pets-desc"
                      placeholder="e.g. Gets along great with other dogs. Has not been tested with cats..."
                      value={petState.requirements.pets.desc}
                      onChange={(e) =>
                        setPetState({
                          ...petState,
                          requirements: {
                            ...petState.requirements,
                            pets: { ...petState.requirements.pets, desc: e.target.value }
                          }
                        })
                      }
                    ></textarea>
                  </div>
                </li>
              </ul>
            </section>
          </div>

          {/* RIGHT COLUMN (NGO Profile Details - Read-Only Layout Context) */}
          <aside className="sidebar-column">
            <div
              className="ngo-profile-card card sticky-card"
              style={{
                background: 'rgba(255,255,255,0.8)',
                backdropFilter: 'blur(15px)',
                borderTop: '4px solid var(--primary)',
                boxShadow: 'var(--shadow-sm)',
                top: '160px'
              }}
            >
              <div className="ngo-header">
                <div
                  className="ngo-avatar"
                  id="ngo-card-avatar"
                  style={{ background: 'var(--primary)' }}
                >
                  {orgInitials}
                </div>
                <div className="ngo-title">
                  <h3 id="ngo-card-name">{orgName}</h3>
                  <span className="verified-badge">
                    <i className="ph-fill ph-seal-check"></i> NGO Operations Owner
                  </span>
                </div>
              </div>

              <div className="ngo-stats">
                <div className="n-stat">
                  <strong>4.8</strong>
                  <span>
                    <i className="ph-fill ph-star"></i> Rating
                  </span>
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

              <p className="ngo-desc" id="ngo-card-desc">
                You are editing this profile as {orgName}. Once saved and published, this profile will become visible to hundreds of verified adopters searching the active database.
              </p>

              <div className="ngo-contact-info">
                <p>
                  <i className="ph ph-map-pin"></i> 124 Rescue Ave, North District
                </p>
                <p>
                  <i className="ph ph-clock"></i> Open Today: 10AM - 6PM
                </p>
              </div>

              <div className="ngo-actions" style={{ opacity: 0.65, pointerEvents: 'none' }}>
                <button type="button" className="btn-primary w-full">
                  <i className="ph ph-chat-circle-text"></i> Chat (Disabled in Editor)
                </button>
                <button type="button" className="btn-secondary outline w-full">
                  <i className="ph ph-calendar-plus"></i> Schedule (Disabled)
                </button>
              </div>
            </div>
          </aside>
        </div>
      </main>

      {/* Shared Footer */}
      <div
        style={{
          textAlgn: 'center',
          padding: '40px 20px 100px',
          color: 'var(--text-muted)',
          fontSize: '0.9rem',
          borderTop: '1px solid var(--border)',
          position: 'relative',
          zIndex: 1,
          textAlign: 'center'
        }}
      >
        <p>&copy; 2026 Voice of Stray NGO Workspace</p>
      </div>

      {/* MOCK PHOTO SELECTOR MODAL DIALOG */}
      {photoModalOpen && (
        <div
          className="photo-selector-overlay show"
          id="photo-modal-overlay"
          onClick={closePhotoSelector}
        >
          <div className="photo-modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header-row">
              <h3>
                <i className="ph ph-images-square"></i> Select Pet Photo
              </h3>
              <span className="modal-close-btn" onClick={closePhotoSelector}>
                <i className="ph ph-x"></i>
              </span>
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              style={{ display: 'none' }}
              onChange={handleLocalFileSelect}
            />

            <div className="modal-tabs">
              <button
                type="button"
                className={`modal-tab-btn ${modalActiveTab === 'upload' ? 'active' : ''}`}
                onClick={() => setModalActiveTab('upload')}
              >
                <i className="ph ph-folder-open"></i> Upload from Folder
              </button>
              <button
                type="button"
                className={`modal-tab-btn ${modalActiveTab === 'presets' ? 'active' : ''}`}
                onClick={() => setModalActiveTab('presets')}
              >
                <i className="ph ph-images"></i> Preset Library
              </button>
              <button
                type="button"
                className={`modal-tab-btn ${modalActiveTab === 'url' ? 'active' : ''}`}
                onClick={() => setModalActiveTab('url')}
              >
                <i className="ph ph-link"></i> Web URL
              </button>
            </div>

            <div className="modal-body">
              {modalActiveTab === 'upload' && (
                <div className="tab-pane">
                  <div
                    className={`file-dropzone ${isDragging ? 'dragover' : ''}`}
                    onClick={() => fileInputRef.current?.click()}
                    onDragOver={(e) => {
                      e.preventDefault();
                      setIsDragging(true);
                    }}
                    onDragLeave={() => setIsDragging(false)}
                    onDrop={handleModalDrop}
                  >
                    <i className="ph ph-cloud-arrow-up dropzone-icon"></i>
                    <div className="dropzone-text">
                      <strong>Choose photo from your computer or folder</strong>
                      <p>Drag and drop image here or click to browse files</p>
                      <span className="dropzone-hint">Supports JPG, PNG, WEBP, GIF (auto-optimized)</span>
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

                  {uploadedFilePreview && (
                    <div className="file-preview-strip">
                      <img
                        src={uploadedFilePreview.dataUrl}
                        alt="Uploaded preview"
                        className="file-preview-thumb"
                      />
                      <div className="file-preview-info">
                        <div className="file-preview-name">{uploadedFilePreview.name}</div>
                        <div className="file-preview-meta">
                          <i className="ph ph-check-circle" style={{ color: 'var(--success)' }}></i> Ready to apply &bull; {uploadedFilePreview.size}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {modalActiveTab === 'presets' && (
                <div className="tab-pane">
                  <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '12px' }}>
                    Select from our pre-configured rescue pet photos:
                  </p>
                  <div className="image-options-grid">
                    {PRESET_IMAGES.map((url, idx) => (
                      <div
                        key={idx}
                        className={`image-option-item ${selectedModalPhotoUrl === url ? 'selected' : ''}`}
                        onClick={() => selectMockPhoto(url)}
                        onDoubleClick={() => saveSelectedPhoto(url)}
                      >
                        <img
                          src={url.includes('w=800') ? url.replace('w=800', 'w=200') : url}
                          alt={`Preset Pet ${idx + 1}`}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {modalActiveTab === 'url' && (
                <div className="tab-pane">
                  <div className="url-input-wrap" style={{ marginTop: 0 }}>
                    <label htmlFor="custom-image-url">Image Web URL (HTTPS)</label>
                    <div className="url-input-row">
                      <input
                        type="text"
                        id="custom-image-url"
                        className="input-glass"
                        style={{ flex: 1 }}
                        placeholder="https://images.unsplash.com/photo-..."
                        value={customImageUrl}
                        onChange={(e) => setCustomImageUrl(e.target.value)}
                      />
                      <button
                        type="button"
                        className="btn-editor save"
                        style={{ borderRadius: 'var(--radius-sm)', padding: '8px 16px' }}
                        onClick={applyCustomImageUrl}
                      >
                        Apply
                      </button>
                    </div>
                    {selectedModalPhotoUrl && !uploadedFilePreview && (
                      <div style={{ marginTop: '12px', textAlign: 'center' }}>
                        <img
                          src={selectedModalPhotoUrl}
                          alt="URL Preview"
                          style={{ maxHeight: '160px', borderRadius: '8px', border: '2px solid var(--accent-orange)' }}
                          onError={(e) => { e.currentTarget.style.display = 'none'; }}
                        />
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            <div className="modal-actions-row">
              <button
                type="button"
                className="btn-editor preview"
                style={{ padding: '8px 18px' }}
                onClick={closePhotoSelector}
              >
                Cancel
              </button>
              <button
                type="button"
                className="btn-editor save"
                style={{ padding: '8px 20px' }}
                disabled={!selectedModalPhotoUrl}
                onClick={() => saveSelectedPhoto()}
              >
                <i className="ph ph-check"></i> Apply Photo
              </button>
            </div>
          </div>
        </div>
      )}

      {/* NOTIFICATION SLIDE-UP BUBBLE */}
      <div
        className={`editor-notification ${toastMessage ? `show ${toastMessage.type}` : ''}`}
        id="save-notification"
      >
        <i
          className={`ph ${toastMessage?.type === 'info' ? 'ph-info' : 'ph-check-circle'}`}
        ></i>
        <span id="notification-message">{toastMessage?.msg || 'Changes saved successfully!'}</span>
      </div>
    </div>
  );
}

export default NgoPetManage;
