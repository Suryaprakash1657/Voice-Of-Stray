import React from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardEmptyState from './DashboardEmptyState.jsx';

export default function SavedAnimalsSection({ savedAnimals = [] }) {
  const navigate = useNavigate();

  return (
    <section className="glass-card">
      <div style={{ padding: '24px 24px 0 24px' }}>
        <div className="section-header">
          <span className="section-title-wrap">
            <i className="ph-fill ph-heart"></i>
            <span>Saved Animals</span>
          </span>
          <button className="section-arrow-btn" onClick={() => navigate('/adopt')}>
            <span>Browse animals</span>
            <i className="ph ph-arrow-right"></i>
          </button>
        </div>
      </div>
      <div className="section-card-content" id="saved-animals-container">
        {savedAnimals.length === 0 ? (
          <DashboardEmptyState
            icon="ph ph-heart"
            title="No saved animals yet"
            description="Animals you save from the adoption page by clicking the heart button will appear here."
          />
        ) : (
          <div className="saved-grid">
            {savedAnimals.map((pet) => {
              const imageSrc =
                pet.images?.main ||
                pet.image ||
                'https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&q=80&w=100';

              return (
                <div
                  key={pet.id || pet.slug}
                  className="saved-animal-card"
                  onClick={() => navigate(pet.slug ? `/adopt/pet/${pet.slug}` : `/adopt/pet/${pet.id}`)}
                >
                  <img src={imageSrc} alt={pet.name} />
                  <div>
                    <h5>{pet.name}</h5>
                    <p>
                      {pet.breed} &bull; {pet.age}
                    </p>
                  </div>
                </div>
              );
            })}
            <div
              className="saved-animal-card"
              style={{ justifyContent: 'center', background: 'rgba(249, 115, 22, 0.04)', borderStyle: 'dashed' }}
              onClick={() => navigate('/adopt')}
            >
              <span style={{ fontSize: '0.76rem', fontWeight: 700, color: 'var(--primary)' }}>
                + View More
              </span>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
