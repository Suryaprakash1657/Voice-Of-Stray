import React, { useRef, useState } from 'react';
import { Modal, Button, Avatar } from '../../../components/ui';
import MediaPreview from './MediaPreview.jsx';

export default function CreatePostModal({
  isOpen,
  onClose,
  currentUser,
  onShare
}) {
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Rescue');
  const [mediaSrc, setMediaSrc] = useState(null);
  const [location, setLocation] = useState(null);

  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setMediaSrc(event.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddLocation = () => {
    const loc = prompt("Enter location (e.g. Downtown Park, Westside Shelter):");
    if (loc && loc.trim()) {
      setLocation(loc.trim());
    }
  };

  const handleShare = () => {
    const content = description.trim();
    if (!content && !mediaSrc) {
      alert("Please enter a description or upload a photo to share your post.");
      return;
    }

    onShare({
      description: content,
      category,
      images: mediaSrc ? [mediaSrc] : [],
      video: '',
      location: location || ''
    });

    // Reset inputs
    setDescription('');
    setCategory('Rescue');
    setMediaSrc(null);
    setLocation(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
    onClose();
  };

  const categoryOptions = ['Rescue', 'Feeding', 'Adoption', 'Story', 'Alert'];

  const footer = (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
      <div className="action-buttons">
        <button type="button" className="icon-text-btn" onClick={() => fileInputRef.current?.click()}>
          <i className="ph ph-image"></i> Photo/Video
        </button>
        <button type="button" className="icon-text-btn" onClick={handleAddLocation}>
          <i className="ph ph-map-pin"></i> Location
        </button>
      </div>
      <div style={{ display: 'flex', gap: '12px' }}>
        <Button variant="secondary" onClick={onClose}>Cancel</Button>
        <Button variant="primary" onClick={handleShare}>Share Impact</Button>
      </div>
    </div>
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Create Community Post"
      footer={footer}
    >
      <div style={{ display: 'flex', gap: '16px', marginBottom: '16px', alignItems: 'flex-start' }}>
        <Avatar src={currentUser.avatar} alt={currentUser.name} size="sm" className="avatar" />
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <strong>{currentUser.name}</strong>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 500 }}>
            Posting as {currentUser.role}
          </span>
        </div>
      </div>

      <textarea
        placeholder="Share your impact or ask for help..."
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        rows={4}
        style={{
          width: '100%',
          border: 'none',
          resize: 'none',
          fontSize: '1.05rem',
          fontFamily: 'inherit',
          outline: 'none',
          color: 'var(--text-main)',
          background: 'transparent',
          marginBottom: '16px'
        }}
      />

      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleFileChange} 
        accept="image/*" 
        style={{ display: 'none' }} 
      />

      <MediaPreview mediaSrc={mediaSrc} onRemove={() => setMediaSrc(null)} />

      {location && (
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', marginBottom: '16px', fontSize: '0.85rem', color: 'var(--primary)', fontWeight: 600 }}>
          <i className="ph ph-map-pin"></i> <span>{location}</span>
          <button 
            type="button" 
            onClick={() => setLocation(null)}
            style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '1rem', display: 'inline-flex', alignItems: 'center', marginLeft: '2px' }}
            aria-label="Remove location tag"
          >
            <i className="ph ph-x-circle"></i>
          </button>
        </div>
      )}

      <div className="create-post-categories" style={{ marginBottom: 0 }}>
        {categoryOptions.map((opt) => (
          <button 
            key={opt}
            type="button"
            onClick={() => setCategory(opt)}
            className={`category-pill ${opt === 'Alert' ? 'alert' : ''} ${category === opt ? 'active' : ''}`}
          >
            {opt}
          </button>
        ))}
      </div>
    </Modal>
  );
}
