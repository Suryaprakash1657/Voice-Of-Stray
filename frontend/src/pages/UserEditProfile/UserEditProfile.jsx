import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authStorage } from '../Auth/services/authStorage.js';
import { processImageFile } from '../../utils/imageUpload.js';
import './user-edit-profile.css';

const presetAvatars = [
  'https://ui-avatars.com/api/?name=Arjun&background=f97316&color=fff',
  'https://ui-avatars.com/api/?name=Arjun&background=14b8a6&color=fff',
  'https://ui-avatars.com/api/?name=Arjun&background=3b82f6&color=fff',
  'https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&q=80&w=200',
  'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&q=80&w=200',
  'https://images.unsplash.com/photo-1537151608828-ea2b11777ee8?auto=format&fit=crop&q=80&w=200'
];

export function UserEditProfile() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  // Form State
  const [formData, setFormData] = useState({
    name: 'Arjun Prasad',
    email: 'user@voiceofstray.com',
    accountType: 'Regular User',
    phone: '+1 (555) 234-5678',
    city: 'Brooklyn',
    state: 'New York',
    pincode: '11201',
    bio: 'Animal lover passionate about helping stray dogs and supporting local rescue efforts.',
    animalPreferences: ['Dogs', 'Cats'],
    volunteerSkills: ['Feeding Drives'],
    volunteerAvailability: 'Weekends',
    volunteerExperience: '1-2 Years',
    rescuerSkills: ['First Aid', 'Canine Handling'],
    rescueRadius: '10km',
    rescueContact: '+1 (555) 901-2345',
    avatarUrl: 'https://ui-avatars.com/api/?name=Arjun&background=f97316&color=fff'
  });

  // Account stats for read-only overview
  const [overview, setOverview] = useState({
    memberSince: 'March 2026',
    reportsCount: 3,
    adoptionsCount: 1,
    activitiesCount: 4
  });

  // Avatar Modal State
  const [isAvatarModalOpen, setIsAvatarModalOpen] = useState(false);
  const [selectedAvatar, setSelectedAvatar] = useState(formData.avatarUrl);
  const [customAvatarUrl, setCustomAvatarUrl] = useState('');
  const [avatarModalTab, setAvatarModalTab] = useState('upload');
  const [uploadedAvatarFile, setUploadedAvatarFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [showToast, setShowToast] = useState(false);

  useEffect(() => {
    document.title = 'Edit Profile - Voice of Stray';

    // Auth check
    const isLoggedIn = authStorage.isLoggedIn();
    if (!isLoggedIn) {
      navigate('/login');
      return;
    }

    const currentUser = authStorage.getCurrentUser();
    if (currentUser?.role === 'ngo') {
      navigate('/ngo-edit-profile');
      return;
    }

    const storedUsername = localStorage.getItem('username') || currentUser?.name || 'Arjun';
    const storedEmail = localStorage.getItem('email') || currentUser?.email || 'user@voiceofstray.com';
    const storedAvatar = localStorage.getItem('avatarUrl') || currentUser?.avatarUrl || presetAvatars[0];

    // Load user profile from localStorage
    let userProfile = {};
    const rawProfile = localStorage.getItem('voiceOfStrayUserProfile');
    if (rawProfile) {
      try {
        userProfile = JSON.parse(rawProfile);
      } catch (e) {}
    }

    // Load volunteer meta
    let volMeta = {};
    const rawVol = localStorage.getItem('voiceOfStrayVolunteer');
    if (rawVol) {
      try {
        volMeta = JSON.parse(rawVol);
      } catch (e) {}
    }

    const defaultState = {
      name: userProfile.name || storedUsername || 'Arjun Prasad',
      email: userProfile.email || storedEmail || 'user@voiceofstray.com',
      accountType: userProfile.accountType || 'Regular User',
      phone: userProfile.phone || '+1 (555) 234-5678',
      city: userProfile.city || 'Brooklyn',
      state: userProfile.state || 'New York',
      pincode: userProfile.pincode || '11201',
      bio: userProfile.bio || 'Animal lover passionate about helping stray dogs and supporting local rescue efforts.',
      animalPreferences: userProfile.animalPreferences || ['Dogs', 'Cats'],
      volunteerSkills: volMeta.skills || userProfile.volunteerSkills || ['Feeding Drives'],
      volunteerAvailability: volMeta.availability || userProfile.volunteerAvailability || 'Weekends',
      volunteerExperience: userProfile.volunteerExperience || '1-2 Years',
      rescuerSkills: userProfile.rescuerSkills || ['First Aid', 'Canine Handling'],
      rescueRadius: userProfile.rescueRadius || '10km',
      rescueContact: userProfile.rescueContact || '+1 (555) 901-2345',
      avatarUrl: userProfile.avatarUrl || storedAvatar
    };

    setFormData(defaultState);
    setSelectedAvatar(defaultState.avatarUrl);

    // Compute dynamic overview counts
    try {
      const reports = JSON.parse(localStorage.getItem('voiceOfStrayUserReports') || '[]');
      const adoptions = JSON.parse(localStorage.getItem('voiceOfStrayAdoptions') || '[]');
      const volunteerApps = JSON.parse(localStorage.getItem('voiceOfStrayVolunteerApplications') || '[]');

      setOverview({
        memberSince: userProfile.memberSince || 'March 2026',
        reportsCount: reports.length || 3,
        adoptionsCount: adoptions.length || 1,
        activitiesCount: volunteerApps.length ? volunteerApps.length * 2 : 4
      });
    } catch (e) {}
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
      'input-full-name': 'name',
      'input-email': 'email',
      'input-account-type': 'accountType',
      'input-phone': 'phone',
      'input-city': 'city',
      'input-state': 'state',
      'input-pincode': 'pincode',
      'input-about': 'bio',
      'input-volunteer-availability': 'volunteerAvailability',
      'input-volunteer-experience': 'volunteerExperience',
      'input-rescue-radius': 'rescueRadius',
      'input-rescue-contact': 'rescueContact'
    };

    const field = fieldMap[id];
    if (field) {
      setFormData((prev) => ({ ...prev, [field]: value }));
    }
  };

  const handleCheckboxToggle = (category, value) => {
    setFormData((prev) => {
      const currentList = prev[category] || [];
      const updated = currentList.includes(value)
        ? currentList.filter((item) => item !== value)
        : [...currentList, value];
      return { ...prev, [category]: updated };
    });
  };

  const openAvatarSelector = () => {
    setSelectedAvatar(formData.avatarUrl);
    setCustomAvatarUrl('');
    setUploadedAvatarFile(null);
    setAvatarModalTab('upload');
    setIsAvatarModalOpen(true);
  };

  const handleLocalAvatarSelect = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      triggerToast('Processing image from your folder...');
      const dataUrl = await processImageFile(file, { maxWidth: 600, maxHeight: 600, quality: 0.9 });
      setSelectedAvatar(dataUrl);
      setUploadedAvatarFile({
        dataUrl,
        name: file.name,
        size: `${(file.size / 1024).toFixed(1)} KB`
      });
      triggerToast('Image ready! Click "Use Selected Avatar" to apply.');
    } catch (err) {
      triggerToast(err.message || 'Error processing image');
    } finally {
      if (e.target) e.target.value = '';
    }
  };

  const handleAvatarDrop = async (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (!file) return;

    try {
      triggerToast('Reading dropped image...');
      const dataUrl = await processImageFile(file, { maxWidth: 600, maxHeight: 600, quality: 0.9 });
      setSelectedAvatar(dataUrl);
      setUploadedAvatarFile({
        dataUrl,
        name: file.name,
        size: `${(file.size / 1024).toFixed(1)} KB`
      });
      triggerToast('Image loaded from your folder!');
    } catch (err) {
      triggerToast(err.message || 'Error processing image');
    }
  };

  const handleDirectAvatarDrop = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    const file = e.dataTransfer.files?.[0];
    if (!file) return;

    try {
      triggerToast('Updating avatar directly from your folder...');
      const dataUrl = await processImageFile(file, { maxWidth: 600, maxHeight: 600, quality: 0.9 });
      setFormData((prev) => ({ ...prev, avatarUrl: dataUrl }));
      setSelectedAvatar(dataUrl);
      triggerToast('Avatar updated from folder!');
    } catch (err) {
      triggerToast(err.message || 'Error uploading avatar');
    }
  };

  const saveSelectedAvatar = () => {
    const finalAvatar = customAvatarUrl.trim() || selectedAvatar;
    if (!finalAvatar) return;
    setFormData((prev) => ({ ...prev, avatarUrl: finalAvatar }));
    setIsAvatarModalOpen(false);
    triggerToast('Avatar updated!');
  };

  const handleSave = (e) => {
    e.preventDefault();

    // Persist to localStorage keys
    localStorage.setItem('username', formData.name);
    localStorage.setItem('email', formData.email);
    localStorage.setItem('avatarUrl', formData.avatarUrl);
    localStorage.setItem('voiceOfStrayUserProfile', JSON.stringify(formData));

    // Update currentUser if exists
    const currentUserRaw = localStorage.getItem('currentUser');
    if (currentUserRaw) {
      try {
        const currentUser = JSON.parse(currentUserRaw);
        currentUser.name = formData.name;
        currentUser.email = formData.email;
        currentUser.avatarUrl = formData.avatarUrl;
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
      } catch (e) {}
    }

    // Sync volunteer meta if volunteer or rescuer
    if (formData.accountType === 'Volunteer' || formData.accountType === 'Rescuer') {
      const volMeta = {
        status: 'Approved Volunteer',
        role: formData.accountType,
        availability: formData.volunteerAvailability,
        skills: formData.accountType === 'Rescuer' ? formData.rescuerSkills : formData.volunteerSkills
      };
      localStorage.setItem('voiceOfStrayVolunteer', JSON.stringify(volMeta));
    }

    // Broadcast auth/storage change
    window.dispatchEvent(new Event('storage'));
    window.dispatchEvent(new CustomEvent('auth-change'));

    triggerToast('Profile changes saved successfully!');
    setTimeout(() => {
      navigate('/user-dashboard');
    }, 1000);
  };

  return (
    <div className="user-edit-page-wrapper">
      <main className="user-edit-container">
        {/* Left Column: Form Cards */}
        <div>
          {/* Back Button */}
          <div className="back-btn-container">
            <Link to="/user-dashboard" className="back-link">
              <i className="ph ph-arrow-left"></i> Back to Dashboard
            </Link>
          </div>

          {/* Hero Header */}
          <section className="user-edit-hero">
            <div className="user-edit-hero-info">
              <h1>Edit Profile</h1>
              <p>Manage your personal information and preferences across Voice of Stray.</p>
            </div>
            <div className="user-identity-display">
              <div
                className="avatar-edit-wrapper"
                onClick={openAvatarSelector}
                onDrop={handleDirectAvatarDrop}
                onDragOver={(e) => e.preventDefault()}
                title="Change Avatar (Click or drag & drop image from your folder)"
              >
                <img id="hero-avatar" src={formData.avatarUrl} alt="Avatar" />
                <div className="avatar-edit-overlay">
                  <i className="ph ph-camera" style={{ fontSize: '1.5rem' }}></i>
                </div>
              </div>
              <div>
                <h2
                  id="hero-username"
                  style={{ fontSize: '1.45rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '2px' }}
                >
                  {formData.name}
                </h2>
                <span
                  id="hero-member-label"
                  style={{
                    fontSize: '0.82rem',
                    color: 'var(--text-muted)',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px'
                  }}
                >
                  {formData.accountType}
                </span>
              </div>
            </div>
          </section>

          <form onSubmit={handleSave}>
            {/* 1. Personal Information */}
            <section className="user-edit-card">
              <h3 className="card-title">
                <i className="ph-fill ph-user"></i> Personal Information
              </h3>
              <div className="form-grid">
                <div className="form-group span-2">
                  <label htmlFor="input-full-name">Full Name</label>
                  <input
                    type="text"
                    id="input-full-name"
                    className="input-glass"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="e.g. Arjun Prasad"
                    required
                  />
                </div>
                <div className="form-group span-2">
                  <label
                    htmlFor="input-email"
                    style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                  >
                    <span>Email Address</span>
                    <span className="badge-identifier">
                      <i className="ph-fill ph-shield-check"></i> Account Login Identifier
                    </span>
                  </label>
                  <input
                    type="email"
                    id="input-email"
                    className="input-glass"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="e.g. user@voiceofstray.com"
                    required
                  />
                  <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)', fontWeight: 500, marginTop: '2px' }}>
                    Your email is used for account notifications and recovery.
                  </span>
                </div>
                <div className="form-group span-2">
                  <label htmlFor="input-account-type">Account Type</label>
                  <select
                    id="input-account-type"
                    className="input-glass"
                    value={formData.accountType}
                    onChange={handleInputChange}
                  >
                    <option value="Regular User">Regular User</option>
                    <option value="Volunteer">Volunteer</option>
                    <option value="Rescuer">Rescuer</option>
                  </select>
                </div>
                <div className="form-group span-2">
                  <label htmlFor="input-phone">Phone Number</label>
                  <input
                    type="tel"
                    id="input-phone"
                    className="input-glass"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="e.g. +1 (555) 234-5678"
                  />
                </div>
              </div>
            </section>

            {/* 2. Location Information */}
            <section className="user-edit-card">
              <h3 className="card-title">
                <i className="ph-fill ph-map-pin"></i> Location Information
              </h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '16px', lineHeight: 1.5, fontWeight: 500 }}>
                Adding location parameters lets Voice of Stray optimize street rescue alerts, volunteer coordinating drives, and local pet shelter listings closest to you.
              </p>
              <div className="form-grid">
                <div className="form-group">
                  <label htmlFor="input-city">City</label>
                  <input
                    type="text"
                    id="input-city"
                    className="input-glass"
                    value={formData.city}
                    onChange={handleInputChange}
                    placeholder="e.g. Brooklyn"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="input-state">State</label>
                  <input
                    type="text"
                    id="input-state"
                    className="input-glass"
                    value={formData.state}
                    onChange={handleInputChange}
                    placeholder="e.g. New York"
                  />
                </div>
                <div className="form-group span-2">
                  <label htmlFor="input-pincode">Pincode</label>
                  <input
                    type="text"
                    id="input-pincode"
                    className="input-glass"
                    value={formData.pincode}
                    onChange={handleInputChange}
                    placeholder="e.g. 11201"
                  />
                </div>
              </div>
            </section>

            {/* 3. About Me */}
            <section className="user-edit-card">
              <h3 className="card-title">
                <i className="ph-fill ph-note-pencil"></i> About Me
              </h3>
              <div className="form-grid">
                <div className="form-group span-2">
                  <label htmlFor="input-about">Tell the community a little about yourself</label>
                  <textarea
                    id="input-about"
                    className="input-glass"
                    value={formData.bio}
                    onChange={handleInputChange}
                    placeholder="e.g. Animal lover passionate about helping stray dogs and supporting local rescue efforts."
                  ></textarea>
                </div>
              </div>
            </section>

            {/* 4. Animal Preferences */}
            <section className="user-edit-card">
              <h3 className="card-title">
                <i className="ph-fill ph-paw-print"></i> Animal Preferences
              </h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '16px', lineHeight: 1.5, fontWeight: 500 }}>
                Select the animals you want to support. This helps us customize recommendation layouts for rescues and adoptions.
              </p>
              <div className="preferences-grid">
                {['Dogs', 'Cats', 'Birds', 'Rabbits', 'Other'].map((animal) => {
                  const isChecked = formData.animalPreferences.includes(animal);
                  return (
                    <label
                      key={animal}
                      className={`pref-checkbox-wrapper ${isChecked ? 'checked' : ''}`}
                    >
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => handleCheckboxToggle('animalPreferences', animal)}
                      />
                      <span>{animal === 'Other' ? 'Other Animals' : animal}</span>
                    </label>
                  );
                })}
              </div>
            </section>

            {/* Volunteer Section (If Volunteer) */}
            {(formData.accountType === 'Volunteer' || formData.accountType === 'Rescuer') && (
              <section className="user-edit-card">
                <h3 className="card-title">
                  <i className="ph-fill ph-hand-heart"></i> Volunteer Profile
                </h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '16px', lineHeight: 1.5, fontWeight: 500 }}>
                  Please share your volunteering interests and preferences.
                </p>
                <div className="form-grid">
                  <div className="form-group span-2">
                    <label>Volunteering Interests</label>
                    <div className="preferences-grid">
                      {['Feeding Drives', 'Fostering', 'Shelter Help', 'Event Coordination', 'Social Media'].map((skill) => {
                        const isChecked = formData.volunteerSkills.includes(skill);
                        return (
                          <label
                            key={skill}
                            className={`pref-checkbox-wrapper ${isChecked ? 'checked' : ''}`}
                          >
                            <input
                              type="checkbox"
                              checked={isChecked}
                              onChange={() => handleCheckboxToggle('volunteerSkills', skill)}
                            />
                            <span>{skill}</span>
                          </label>
                        );
                      })}
                    </div>
                  </div>
                  <div className="form-group">
                    <label htmlFor="input-volunteer-availability">Availability</label>
                    <select
                      id="input-volunteer-availability"
                      className="input-glass"
                      value={formData.volunteerAvailability}
                      onChange={handleInputChange}
                    >
                      <option value="Weekends">Weekends</option>
                      <option value="Weekdays">Weekdays</option>
                      <option value="Anytime">Anytime</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label htmlFor="input-volunteer-experience">Prior Experience</label>
                    <select
                      id="input-volunteer-experience"
                      className="input-glass"
                      value={formData.volunteerExperience}
                      onChange={handleInputChange}
                    >
                      <option value="None">None / Beginner</option>
                      <option value="1-2 Years">1-2 Years</option>
                      <option value="3+ Years">3+ Years</option>
                    </select>
                  </div>
                </div>
              </section>
            )}

            {/* Rescuer Section (If Rescuer) */}
            {formData.accountType === 'Rescuer' && (
              <section className="user-edit-card">
                <h3 className="card-title">
                  <i className="ph-fill ph-first-aid"></i> Rescuer Profile
                </h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '16px', lineHeight: 1.5, fontWeight: 500 }}>
                  Configure your emergency alert radius and specializations to receive notifications of stray animals in distress.
                </p>
                <div className="form-grid">
                  <div className="form-group span-2">
                    <label>Rescuer Specializations</label>
                    <div className="preferences-grid">
                      {['Canine Handling', 'First Aid', 'Driving', 'Rescue Equipment'].map((skill) => {
                        const isChecked = formData.rescuerSkills.includes(skill);
                        return (
                          <label
                            key={skill}
                            className={`pref-checkbox-wrapper ${isChecked ? 'checked' : ''}`}
                          >
                            <input
                              type="checkbox"
                              checked={isChecked}
                              onChange={() => handleCheckboxToggle('rescuerSkills', skill)}
                            />
                            <span>{skill}</span>
                          </label>
                        );
                      })}
                    </div>
                  </div>
                  <div className="form-group">
                    <label htmlFor="input-rescue-radius">Alert Radius</label>
                    <select
                      id="input-rescue-radius"
                      className="input-glass"
                      value={formData.rescueRadius}
                      onChange={handleInputChange}
                    >
                      <option value="5km">5 km</option>
                      <option value="10km">10 km</option>
                      <option value="25km">25 km</option>
                      <option value="50km">50 km</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label htmlFor="input-rescue-contact">Emergency Contact No.</label>
                    <input
                      type="tel"
                      id="input-rescue-contact"
                      className="input-glass"
                      value={formData.rescueContact}
                      onChange={handleInputChange}
                      placeholder="e.g. +1 (555) 901-2345"
                    />
                  </div>
                </div>
              </section>
            )}

            {/* Read-Only Account Overview */}
            <section className="user-edit-card">
              <h3 className="card-title">
                <i className="ph-fill ph-info"></i> Account Overview
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '12px 16px',
                    background: 'rgba(255, 255, 255, 0.45)',
                    border: '1px solid var(--border)',
                    borderRadius: 'var(--radius-sm)'
                  }}
                >
                  <span style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-muted)' }}>Account Type</span>
                  <span
                    style={{
                      fontSize: '0.72rem',
                      fontWeight: 800,
                      background: 'var(--primary-light)',
                      color: 'var(--primary)',
                      padding: '3px 8px',
                      borderRadius: 'var(--radius-sm)',
                      textTransform: 'uppercase'
                    }}
                  >
                    {formData.accountType}
                  </span>
                </div>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '12px 16px',
                    background: 'rgba(255, 255, 255, 0.45)',
                    border: '1px solid var(--border)',
                    borderRadius: 'var(--radius-sm)'
                  }}
                >
                  <span style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-muted)' }}>Member Since</span>
                  <span style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-main)' }}>
                    {overview.memberSince}
                  </span>
                </div>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '12px 16px',
                    background: 'rgba(255, 255, 255, 0.45)',
                    border: '1px solid var(--border)',
                    borderRadius: 'var(--radius-sm)'
                  }}
                >
                  <span style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-muted)' }}>
                    Rescue Reports Submitted
                  </span>
                  <span style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-main)' }}>
                    {overview.reportsCount}
                  </span>
                </div>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '12px 16px',
                    background: 'rgba(255, 255, 255, 0.45)',
                    border: '1px solid var(--border)',
                    borderRadius: 'var(--radius-sm)'
                  }}
                >
                  <span style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-muted)' }}>
                    Adoption Applications
                  </span>
                  <span style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-main)' }}>
                    {overview.adoptionsCount}
                  </span>
                </div>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '12px 16px',
                    background: 'rgba(255, 255, 255, 0.45)',
                    border: '1px solid var(--border)',
                    borderRadius: 'var(--radius-sm)'
                  }}
                >
                  <span style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-muted)' }}>
                    Volunteer Activities
                  </span>
                  <span style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-main)' }}>
                    {overview.activitiesCount}
                  </span>
                </div>
              </div>
            </section>

            {/* Actions Bar */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'flex-end',
                gap: '16px',
                marginTop: '16px',
                marginBottom: '32px'
              }}
            >
              <button
                type="button"
                className="btn-action cancel"
                onClick={() => navigate('/user-dashboard')}
              >
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
            <div className="preview-badge">Public Profile Preview</div>

            <div
              style={{
                display: 'flex',
                gap: '16px',
                alignItems: 'center',
                marginTop: '12px',
                marginBottom: '20px'
              }}
            >
              <div className="preview-avatar-wrap">
                <img src={formData.avatarUrl} alt="Avatar Preview" />
              </div>
              <div>
                <h3
                  style={{
                    fontSize: '1.25rem',
                    color: 'var(--text-main)',
                    fontWeight: 800,
                    lineHeight: 1.2,
                    wordBreak: 'break-word',
                    margin: 0
                  }}
                >
                  {formData.name}
                </h3>
                <div
                  style={{
                    fontSize: '0.78rem',
                    color: 'var(--text-muted)',
                    fontWeight: 700,
                    marginTop: '4px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}
                >
                  <i className="ph-fill ph-paw-print" style={{ color: 'var(--primary)' }}></i>
                  <span>{formData.accountType}</span>
                </div>
              </div>
            </div>

            <div style={{ height: '1px', background: 'rgba(249, 115, 22, 0.08)', marginBottom: '20px' }}></div>

            {/* Bio */}
            <div style={{ marginBottom: '20px' }}>
              <h4
                style={{
                  fontSize: '0.75rem',
                  fontWeight: 800,
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                  color: 'var(--text-muted)',
                  marginBottom: '8px',
                  marginTop: 0
                }}
              >
                About
              </h4>
              <p
                style={{
                  fontSize: '0.92rem',
                  color: 'var(--text-muted)',
                  lineHeight: 1.5,
                  fontWeight: 500,
                  wordBreak: 'break-word',
                  fontStyle: 'italic',
                  whiteSpace: 'pre-line',
                  margin: 0
                }}
              >
                {formData.bio || 'No bio added yet.'}
              </p>
            </div>

            {/* Location */}
            <div style={{ marginBottom: '20px' }}>
              <h4
                style={{
                  fontSize: '0.75rem',
                  fontWeight: 800,
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                  color: 'var(--text-muted)',
                  marginBottom: '8px',
                  marginTop: 0
                }}
              >
                Location
              </h4>
              <p
                style={{
                  fontSize: '0.92rem',
                  color: 'var(--text-main)',
                  fontWeight: 600,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  margin: 0
                }}
              >
                <i className="ph ph-map-pin" style={{ color: 'var(--primary)', fontSize: '1.15rem' }}></i>
                <span>{formData.city ? `${formData.city}, ${formData.state}` : 'Location not set'}</span>
              </p>
            </div>

            {/* Animal Preferences */}
            <div style={{ marginBottom: '20px' }}>
              <h4
                style={{
                  fontSize: '0.75rem',
                  fontWeight: 800,
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                  color: 'var(--text-muted)',
                  marginBottom: '8px',
                  marginTop: 0
                }}
              >
                Animal Preferences
              </h4>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                {formData.animalPreferences.length > 0 ? (
                  formData.animalPreferences.map((pref) => (
                    <span key={pref} className="pref-tag">
                      {pref}
                    </span>
                  ))
                ) : (
                  <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>None selected</span>
                )}
              </div>
            </div>

            {/* Volunteer Profile */}
            {(formData.accountType === 'Volunteer' || formData.accountType === 'Rescuer') && (
              <div>
                <h4
                  style={{
                    fontSize: '0.75rem',
                    fontWeight: 800,
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                    color: 'var(--text-muted)',
                    marginBottom: '8px',
                    marginTop: 0
                  }}
                >
                  Volunteer Profile
                </h4>
                <div style={{ fontSize: '0.92rem', color: 'var(--text-main)', fontWeight: 600, display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <i className="ph ph-briefcase" style={{ color: 'var(--primary)', fontSize: '1.15rem' }}></i>
                    <span style={{ color: 'var(--text-muted)', fontWeight: 500 }}>Experience Level:</span>
                    <span>{formData.volunteerExperience}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <i className="ph ph-calendar-blank" style={{ color: 'var(--primary)', fontSize: '1.15rem' }}></i>
                    <span style={{ color: 'var(--text-muted)', fontWeight: 500 }}>Availability:</span>
                    <span>{formData.volunteerAvailability}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </aside>
      </main>

      {/* PHOTO SELECTOR MODAL */}
      {isAvatarModalOpen && (
        <div className="photo-selector-overlay" onClick={() => setIsAvatarModalOpen(false)}>
          <div className="photo-modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header-row">
              <h3>
                <i className="ph ph-image"></i> Select Profile Avatar
              </h3>
              <button className="modal-close-btn" onClick={() => setIsAvatarModalOpen(false)}>
                <i className="ph ph-x"></i>
              </button>
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              style={{ display: 'none' }}
              onChange={handleLocalAvatarSelect}
            />

            <div className="modal-tabs">
              <button
                type="button"
                className={`modal-tab-btn ${avatarModalTab === 'upload' ? 'active' : ''}`}
                onClick={() => setAvatarModalTab('upload')}
              >
                <i className="ph ph-folder-open"></i> Upload from Folder
              </button>
              <button
                type="button"
                className={`modal-tab-btn ${avatarModalTab === 'presets' ? 'active' : ''}`}
                onClick={() => setAvatarModalTab('presets')}
              >
                <i className="ph ph-user-circle"></i> Preset Avatars
              </button>
              <button
                type="button"
                className={`modal-tab-btn ${avatarModalTab === 'url' ? 'active' : ''}`}
                onClick={() => setAvatarModalTab('url')}
              >
                <i className="ph ph-link"></i> Web URL
              </button>
            </div>

            <div className="modal-body">
              {avatarModalTab === 'upload' && (
                <div>
                  <div
                    className={`file-dropzone ${isDragging ? 'dragover' : ''}`}
                    onClick={() => fileInputRef.current?.click()}
                    onDragOver={(e) => {
                      e.preventDefault();
                      setIsDragging(true);
                    }}
                    onDragLeave={() => setIsDragging(false)}
                    onDrop={handleAvatarDrop}
                  >
                    <i className="ph ph-cloud-arrow-up dropzone-icon"></i>
                    <div className="dropzone-text">
                      <strong>Choose avatar photo from your computer or folder</strong>
                      <p>Drag and drop image here or click to browse files</p>
                      <span className="dropzone-hint">Supports JPG, PNG, WEBP, GIF (auto-resized)</span>
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

                  {uploadedAvatarFile && (
                    <div className="file-preview-strip">
                      <img
                        src={uploadedAvatarFile.dataUrl}
                        alt="Uploaded preview"
                        className="file-preview-thumb"
                      />
                      <div className="file-preview-info">
                        <div className="file-preview-name">{uploadedAvatarFile.name}</div>
                        <div className="file-preview-meta">
                          <i className="ph ph-check-circle" style={{ color: 'var(--success, #22c55e)' }}></i> Ready to apply &bull; {uploadedAvatarFile.size}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {avatarModalTab === 'presets' && (
                <div>
                  <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '12px' }}>
                    Choose one of our community avatar illustrations:
                  </p>
                  <div className="image-options-grid">
                    {presetAvatars.map((url, idx) => (
                      <div
                        key={idx}
                        className={`image-option-item ${selectedAvatar === url ? 'selected' : ''}`}
                        onClick={() => {
                          setSelectedAvatar(url);
                          setCustomAvatarUrl('');
                          setUploadedAvatarFile(null);
                        }}
                      >
                        <img src={url} alt={`Preset ${idx + 1}`} />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {avatarModalTab === 'url' && (
                <div>
                  <div className="url-input-wrap">
                    <label style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                      Image URL (HTTPS)
                    </label>
                    <div className="url-input-row">
                      <input
                        type="url"
                        className="input-glass"
                        placeholder="https://images.unsplash.com/..."
                        value={customAvatarUrl}
                        onChange={(e) => {
                          setCustomAvatarUrl(e.target.value);
                          setSelectedAvatar(e.target.value);
                          setUploadedAvatarFile(null);
                        }}
                      />
                    </div>
                    {selectedAvatar && !uploadedAvatarFile && (
                      <div style={{ marginTop: '12px', textAlign: 'center' }}>
                        <img
                          src={selectedAvatar}
                          alt="URL Preview"
                          style={{ width: '80px', height: '80px', borderRadius: '50%', objectFit: 'cover', border: '2px solid var(--primary)' }}
                          onError={(e) => { e.currentTarget.style.display = 'none'; }}
                        />
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            <div className="modal-actions-row">
              <button className="btn-action cancel" onClick={() => setIsAvatarModalOpen(false)}>
                Cancel
              </button>
              <button className="btn-action save" disabled={!selectedAvatar && !customAvatarUrl} onClick={saveSelectedAvatar}>
                Use Selected Avatar
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

export default UserEditProfile;
