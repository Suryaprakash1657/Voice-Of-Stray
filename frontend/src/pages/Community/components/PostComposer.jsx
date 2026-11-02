import React, { useRef, useState } from 'react';
import Avatar from '../../../components/ui/Avatar.jsx';
import Button from '../../../components/ui/Button.jsx';
import Card from '../../../components/ui/Card.jsx';
import MediaPreview from './MediaPreview.jsx';
import { processImageFile } from '../../../utils/imageUpload.js';

export default function PostComposer({ currentUser, onCreatePost }) {
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Rescue');
  const [mediaSrc, setMediaSrc] = useState(null);
  const [location, setLocation] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  
  const fileInputRef = useRef(null);

  const handleFile = async (file) => {
    if (!file) return;
    try {
      const dataUrl = await processImageFile(file, { maxWidth: 1200, maxHeight: 1200, quality: 0.85 });
      setMediaSrc(dataUrl);
    } catch (err) {
      console.error('Error processing post photo:', err);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
    if (e.target) e.target.value = '';
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleFile(file);
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

    onCreatePost({
      description: content,
      category,
      images: mediaSrc ? [mediaSrc] : [],
      video: '',
      location: location || ''
    });

    // Reset fields
    setDescription('');
    setCategory('Rescue');
    setMediaSrc(null);
    setLocation(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const categoryOptions = ['Rescue', 'Feeding', 'Adoption', 'Story', 'Alert'];

  return (
    <Card 
      className={`create-post-card ${isDragging ? 'dragover' : ''}`}
      onDragOver={(e) => {
        e.preventDefault();
        setIsDragging(true);
      }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={handleDrop}
      style={{
        transition: 'all 0.2s ease',
        outline: isDragging ? '2px dashed var(--primary)' : 'none',
        background: isDragging ? '#fff7ed' : 'white'
      }}
    >
      <div className="create-post-top">
        <Avatar src={currentUser.avatar} alt={currentUser.name} size="sm" className="avatar" />
        <textarea 
          placeholder="Share your impact or ask for help... (Drag & drop photo here or click Upload Photo)"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          style={{
            flex: 1,
            border: 'none',
            resize: 'none',
            fontSize: '1.05rem',
            fontFamily: 'inherit',
            outline: 'none',
            paddingTop: '10px',
            color: 'var(--text-main)',
            background: 'transparent'
          }}
        />
      </div>

      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleFileChange} 
        accept="image/*" 
        style={{ display: 'none' }} 
      />

      <MediaPreview mediaSrc={mediaSrc} onRemove={() => setMediaSrc(null)} />

      {location && (
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', margin: '0 16px 16px 16px', fontSize: '0.85rem', color: 'var(--primary)', fontWeight: 600 }}>
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

      <div className="create-post-categories">
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

      <div className="create-post-actions">
        <div className="action-buttons">
          <button 
            type="button" 
            className="icon-text-btn" 
            onClick={() => fileInputRef.current?.click()}
            title="Upload photo from your folder"
          >
            <i className="ph ph-folder-open"></i> Upload from Folder
          </button>
          <button type="button" className="icon-text-btn" onClick={handleAddLocation}>
            <i className="ph ph-map-pin"></i> Location
          </button>
        </div>
        <Button variant="primary" onClick={handleShare}>Share</Button>
      </div>
    </Card>
  );
}
