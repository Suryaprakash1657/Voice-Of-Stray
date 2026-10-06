import React, { memo } from 'react';
import { Link } from 'react-router-dom';

export const PetCard = memo(function PetCard({ pet, isFavorite, onToggleFavorite }) {
  if (!pet) return null;

  const targetPetId = pet.slug || pet.id;
  const imageSrc = pet.image || pet.images?.main || pet.photo || 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=600&q=80';
  const shortName = (pet.name || 'Friend').split(' ')[0];

  return (
    <div className="pet-card card">
      <div className="pet-img-wrapper">
        <img
          src={imageSrc}
          alt={pet.name}
          loading="lazy"
          onError={(e) => {
            e.currentTarget.src = 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=600&q=80';
          }}
        />
        <button
          type="button"
          className={`heart-btn ${isFavorite ? 'active' : ''}`}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            if (onToggleFavorite) onToggleFavorite(pet.id);
          }}
          aria-label={isFavorite ? 'Remove from saved' : 'Save pet'}
          title={isFavorite ? 'Remove from saved' : 'Save pet'}
        >
          <i className={isFavorite ? 'ph-fill ph-heart' : 'ph ph-heart'}></i>
        </button>
        <div className="pet-badges">
          {pet.urgent && <span className="badge badge-urgent">Urgent Foster</span>}
          {pet.specialNeeds && <span className="badge badge-orange">Special Needs</span>}
          {pet.attributes?.bondedPair && <span className="badge badge-orange">Bonded Pair</span>}
          {pet.vaccinated && <span className="badge badge-blue">Vaccinated</span>}
          {pet.attributes?.vetChecked && <span className="badge badge-healthy">Healthy</span>}
          {pet.attributes?.senior && <span className="badge badge-healthy">Senior</span>}
        </div>
      </div>

      <div className="pet-info">
        {pet.urgent && (
          <div className="urgency-banner urgent">
            <i className="ph-fill ph-warning"></i> Urgent: Foster Needed Immediately
          </div>
        )}

        <div className="pet-title-row">
          <h3>{pet.name}</h3>
          <div className="pet-distance">
            <span className="dist-label">Distance</span>
            <strong>{pet.distance || '5.2 km away'}</strong>
          </div>
        </div>

        <p className="pet-meta">{pet.breed} • {pet.age} • {pet.gender}</p>

        <div className="pet-medical-summary">
          <span>
            <i className="ph-fill ph-first-aid"></i>{' '}
            {pet.neutered ? 'Neutered, ' : ''}
            {pet.vaccinated ? 'Vaccinated, ' : ''}
            Microchipped
          </span>
        </div>

        <p className="pet-desc">
          {pet.storySnippet || pet.shortDesc || (pet.story ? pet.story.slice(0, 140) : '')}
        </p>

        <div className="pet-extra-tags">
          {pet.attributes?.goodkids !== false && (
            <span className="tag"><i className="ph ph-baby"></i> Good with kids</span>
          )}
          {pet.attributes?.housetrained !== false && (
            <span className="tag"><i className="ph ph-buildings"></i> Apartment friendly</span>
          )}
          {pet.attributes?.goodpets !== false && (
            <span className="tag"><i className="ph ph-cat"></i> Good with pets</span>
          )}
        </div>

        <div className="pet-footer-details">
          <p className="pet-ngo">
            <i className="ph-fill ph-seal-check verified-badge"></i>{' '}
            <strong>{pet.ngoName || 'City Rescue NGO'}</strong>
          </p>
          <span className="rescue-date">{pet.rescueDate ? `Rescued: ${pet.rescueDate}` : 'Rescued: Oct 12, 2025'}</span>
        </div>

        <div className="pet-actions">
          <Link to={`/adopt/apply/${targetPetId}`} className="btn-adopt">
            Adopt {shortName}
          </Link>
          <Link to={`/adopt/apply/${targetPetId}`} className="btn-foster">
            Foster
          </Link>
        </div>

        <Link to={`/adopt/pet/${targetPetId}`} className="btn-text view-story-btn">
          View Full Story
        </Link>
      </div>
    </div>
  );
});
