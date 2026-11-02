import React, { useState } from 'react';

export default function AddTaskModal({ isOpen, onClose, onAddTask, ngoName = 'Voice of Stray Partner NGO' }) {
  const [formData, setFormData] = useState({
    title: '',
    category: 'rescue',
    time: 'Now (Urgent)',
    location: '',
    volunteersNeeded: '1 / 2 Volunteers',
    urgent: false,
    description: ''
  });
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      setError('Please enter a task title.');
      return;
    }
    if (!formData.location.trim()) {
      setError('Please enter a task location.');
      return;
    }

    const cat = formData.category;
    const tag = cat === 'rescue' ? 'Emergency Rescue' : cat === 'foster' ? 'Foster Needed' : 'Feeding Drive';

    onAddTask({
      title: formData.title.trim(),
      category: cat,
      tag: tag,
      tagClass: cat,
      time: formData.time.trim() || 'Flexible',
      location: formData.location.trim(),
      ngo: ngoName,
      volunteersNeeded: formData.volunteersNeeded.trim() || '0 / 1 Volunteers',
      urgent: formData.urgent || cat === 'rescue',
      description: formData.description.trim() || 'Volunteers needed to assist with animal welfare.'
    });

    onClose();
  };

  return (
    <div
      className="ops-modal-overlay show"
      onClick={onClose}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(15, 23, 42, 0.65)',
        backdropFilter: 'blur(6px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999,
        padding: '20px'
      }}
    >
      <div
        className="glass-card"
        onClick={(e) => e.stopPropagation()}
        style={{
          width: '100%',
          maxWidth: '540px',
          backgroundColor: '#ffffff',
          borderRadius: '16px',
          boxShadow: '0 20px 40px rgba(0, 0, 0, 0.2)',
          overflow: 'hidden',
          animation: 'fadeIn 0.2s ease-out'
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: '20px 24px',
            borderBottom: '1px solid #f1f5f9',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: 'linear-gradient(135deg, #fff7ed 0%, #ffedd5 100%)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                backgroundColor: 'rgba(249, 115, 22, 0.15)',
                color: 'var(--primary, #f97316)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.2rem'
              }}
            >
              <i className="ph-fill ph-plus-circle"></i>
            </div>
            <div>
              <h3 style={{ margin: 0, fontSize: '1.15rem', color: '#0f172a', fontWeight: 700 }}>
                Post Volunteer Task
              </h3>
              <p style={{ margin: 0, fontSize: '0.8rem', color: '#64748b' }}>
                Listing for: <strong>{ngoName}</strong>
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            type="button"
            style={{
              background: 'none',
              border: 'none',
              fontSize: '1.25rem',
              color: '#64748b',
              cursor: 'pointer',
              padding: '4px'
            }}
          >
            <i className="ph ph-x"></i>
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} style={{ padding: '24px' }}>
          {error && (
            <div
              style={{
                backgroundColor: '#fee2e2',
                color: '#dc2626',
                padding: '10px 14px',
                borderRadius: '8px',
                fontSize: '0.85rem',
                marginBottom: '16px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              <i className="ph-fill ph-warning-circle"></i>
              <span>{error}</span>
            </div>
          )}

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {/* Task Title */}
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
                Task Title *
              </label>
              <input
                type="text"
                placeholder="e.g. Injured Dog Rescue on 5th Ave"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  borderRadius: '8px',
                  border: '1px solid #cbd5e1',
                  fontSize: '0.9rem',
                  outline: 'none',
                  boxSizing: 'border-box'
                }}
              />
            </div>

            {/* Category & Urgency */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
                  Category *
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    borderRadius: '8px',
                    border: '1px solid #cbd5e1',
                    fontSize: '0.9rem',
                    outline: 'none',
                    backgroundColor: '#ffffff',
                    boxSizing: 'border-box'
                  }}
                >
                  <option value="rescue">Emergency Rescue</option>
                  <option value="foster">Foster Needed</option>
                  <option value="feeding">Feeding Drive</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
                  Timing / Schedule *
                </label>
                <input
                  type="text"
                  placeholder="e.g. Now (Urgent) or Sat 9 AM"
                  value={formData.time}
                  onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    borderRadius: '8px',
                    border: '1px solid #cbd5e1',
                    fontSize: '0.9rem',
                    outline: 'none',
                    boxSizing: 'border-box'
                  }}
                />
              </div>
            </div>

            {/* Location & Volunteers Needed */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
                  Location *
                </label>
                <input
                  type="text"
                  placeholder="e.g. 5th Avenue, Brooklyn"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    borderRadius: '8px',
                    border: '1px solid #cbd5e1',
                    fontSize: '0.9rem',
                    outline: 'none',
                    boxSizing: 'border-box'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
                  Volunteers Needed
                </label>
                <input
                  type="text"
                  placeholder="e.g. 0 / 2 Volunteers"
                  value={formData.volunteersNeeded}
                  onChange={(e) => setFormData({ ...formData, volunteersNeeded: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    borderRadius: '8px',
                    border: '1px solid #cbd5e1',
                    fontSize: '0.9rem',
                    outline: 'none',
                    boxSizing: 'border-box'
                  }}
                />
              </div>
            </div>

            {/* Urgent Checkbox */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '2px' }}>
              <input
                type="checkbox"
                id="urgent-checkbox"
                checked={formData.urgent}
                onChange={(e) => setFormData({ ...formData, urgent: e.target.checked })}
                style={{ width: '16px', height: '16px', cursor: 'pointer' }}
              />
              <label htmlFor="urgent-checkbox" style={{ fontSize: '0.85rem', color: '#475569', cursor: 'pointer', fontWeight: 500 }}>
                Mark as high-priority emergency task
              </label>
            </div>

            {/* Description */}
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
                Description & Instructions
              </label>
              <textarea
                rows="3"
                placeholder="Describe what help is needed and any safety precautions..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  borderRadius: '8px',
                  border: '1px solid #cbd5e1',
                  fontSize: '0.9rem',
                  outline: 'none',
                  resize: 'vertical',
                  boxSizing: 'border-box'
                }}
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '24px' }}>
            <button
              type="button"
              onClick={onClose}
              style={{
                padding: '10px 20px',
                borderRadius: '8px',
                border: '1px solid #cbd5e1',
                backgroundColor: '#ffffff',
                color: '#64748b',
                fontWeight: 600,
                fontSize: '0.9rem',
                cursor: 'pointer'
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              style={{
                padding: '10px 24px',
                borderRadius: '8px',
                border: 'none',
                backgroundColor: 'var(--primary, #f97316)',
                color: '#ffffff',
                fontWeight: 700,
                fontSize: '0.9rem',
                cursor: 'pointer',
                boxShadow: '0 4px 12px rgba(249, 115, 22, 0.3)'
              }}
            >
              Publish Task
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

