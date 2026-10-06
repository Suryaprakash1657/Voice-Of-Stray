import React, { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useAdoptablePets } from './hooks/useAdoptablePets';
import { PetFilters } from './components/PetFilters';
import { PetGrid } from './components/PetGrid';
import './adopt.css';

export function Adopt() {
  const {
    pets,
    rawPets,
    totalCount,
    savedPets,
    filters,
    sortBy,
    currentPage,
    totalPages,
    setSortBy,
    setCurrentPage,
    updateFilter,
    resetFilters,
    toggleFavorite
  } = useAdoptablePets();

  const [activeFaq, setActiveFaq] = useState(null);
  const carouselRef = useRef(null);

  const toggleFaq = (index) => {
    setActiveFaq(activeFaq === index ? null : index);
  };

  const handleScrollCarousel = (dir) => {
    if (carouselRef.current) {
      const scrollAmount = dir === 'left' ? -320 : 320;
      carouselRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  const handleCategoryClick = (type) => {
    resetFilters();
    if (type === 'puppies') {
      updateFilter('species', 'dog');
      updateFilter('age', 'puppy');
    } else if (type === 'seniors') {
      updateFilter('age', 'senior');
    } else if (type === 'emergency') {
      updateFilter('urgent', true);
    } else if (type === 'cats') {
      updateFilter('species', 'cat');
    } else if (type === 'bonded') {
      updateFilter('specialNeeds', false);
    } else if (type === 'special') {
      updateFilter('specialNeeds', true);
    }

    const gridElem = document.getElementById('browse-strays-area');
    if (gridElem) {
      gridElem.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const carouselPets = [
    {
      name: 'Charlie',
      species: 'Dog',
      slug: 'charlie',
      image: 'https://images.unsplash.com/photo-1537151608828-ea2b11777ee8?auto=format&fit=crop&q=80&w=300',
      reason: 'Found wandering near central park, scared but recovering fast...'
    },
    {
      name: 'Luna',
      species: 'Cat',
      slug: 'luna',
      image: 'https://images.unsplash.com/photo-1513360371669-4adf3dd7dff8?auto=format&fit=crop&q=80&w=300',
      reason: "Found in an abandoned warehouse. She's now a purr machine..."
    },
    {
      name: 'Cooper',
      species: 'Dog',
      slug: 'cooper',
      image: 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&q=80&w=300',
      reason: 'Saved from a high-traffic area, full of energy and ready...'
    },
    {
      name: 'Snowy',
      species: 'Dog',
      slug: 'snowy',
      image: 'https://images.unsplash.com/photo-1517849845537-4d257902454a?auto=format&fit=crop&q=80&w=300',
      reason: 'Abandoned during the winter, he is a survivor with a heart...'
    }
  ];

  const faqs = [
    {
      q: 'What are the standard adoption fees?',
      a: "Adoption fees vary by NGO and the animal's medical history. Generally, fees cover vaccinations, spay/neuter surgery, and microchipping. They typically range from $50 to $200."
    },
    {
      q: 'Can I foster a pet before fully adopting?',
      a: 'Yes! We highly encourage our "Foster-to-Adopt" program. It allows you to take a pet home for 1-2 weeks to ensure they are the right fit for your family and lifestyle before making a final commitment.'
    },
    {
      q: 'What are the basic requirements to adopt?',
      a: 'Requirements usually include proof of residence, landlord approval (if renting), an initial video or in-person home check, and ensuring all household members are on board.'
    },
    {
      q: 'What support is provided after adoption?',
      a: 'Voice of Stray and our partner NGOs provide 30 days of post-adoption check-ins, behaviorist helpline access, and initial starter nutrition kits to ensure a smooth transition.'
    }
  ];

  return (
    <>
      {/* Urgent Banner */}
      <div className="urgent-banner">
        <div className="urgent-banner-content">
          <i className="ph-fill ph-warning-circle"></i>
          <span>
            <strong>Urgent:</strong> The city shelter is at max capacity. Temporary fosters are desperately needed this weekend!
          </span>
          <button
            type="button"
            className="alert-text"
            onClick={() => handleCategoryClick('emergency')}
          >
            View Urgent Cases
          </button>
        </div>
      </div>

      {/* Main Content for Adopt Page */}
      <main className="adopt-main">
        {/* Hero Section */}
        <section className="adopt-hero">
          <h1>Give Them a Forever Home</h1>
          <p>
            Connect with hundreds of rescued animals waiting for their perfect match. From playful pups to senior
            companions, your new best friend is just a click away.
          </p>
        </section>

        {/* Featured Categories */}
        <section className="featured-categories">
          <div className="category-grid">
            <div
              className={`category-card ${filters.species === 'dog' && filters.age === 'puppy' ? 'active' : ''}`}
              onClick={() => handleCategoryClick('puppies')}
              role="button"
              tabIndex="0"
            >
              <div className="cat-icon"><i className="ph ph-dog"></i></div>
              <span>Puppies</span>
            </div>

            <div
              className={`category-card ${filters.age === 'senior' ? 'active' : ''}`}
              onClick={() => handleCategoryClick('seniors')}
              role="button"
              tabIndex="0"
            >
              <div className="cat-icon"><i className="ph ph-heartbeat"></i></div>
              <span>Senior Pets</span>
            </div>

            <div
              className={`category-card emergency-cat ${filters.urgent ? 'active' : ''}`}
              onClick={() => handleCategoryClick('emergency')}
              role="button"
              tabIndex="0"
            >
              <div className="cat-icon"><i className="ph ph-house-line"></i></div>
              <span>Emergency Foster</span>
            </div>

            <div
              className={`category-card ${filters.species === 'cat' ? 'active' : ''}`}
              onClick={() => handleCategoryClick('cats')}
              role="button"
              tabIndex="0"
            >
              <div className="cat-icon"><i className="ph ph-cat"></i></div>
              <span>Cats</span>
            </div>

            <div
              className="category-card"
              onClick={() => handleCategoryClick('bonded')}
              role="button"
              tabIndex="0"
            >
              <div className="cat-icon"><i className="ph ph-users-three"></i></div>
              <span>Bonded Pairs</span>
            </div>

            <div
              className={`category-card ${filters.specialNeeds ? 'active' : ''}`}
              onClick={() => handleCategoryClick('special')}
              role="button"
              tabIndex="0"
            >
              <div className="cat-icon"><i className="ph ph-first-aid-kit"></i></div>
              <span>Special Needs</span>
            </div>
          </div>
        </section>

        {/* Newly Ready for Adoption Carousel */}
        <section className="recently-rescued">
          <div className="section-header">
            <h2>Newly Ready for Adoption</h2>
            <div className="carousel-controls">
              <span className="see-all-link" onClick={() => resetFilters()}>
                See All <i className="ph ph-arrow-right"></i>
              </span>
              <button
                type="button"
                className="carousel-btn"
                onClick={() => handleScrollCarousel('left')}
                aria-label="Previous pet"
              >
                <i className="ph ph-caret-left"></i>
              </button>
              <button
                type="button"
                className="carousel-btn"
                onClick={() => handleScrollCarousel('right')}
                aria-label="Next pet"
              >
                <i className="ph ph-caret-right"></i>
              </button>
            </div>
          </div>

          <div className="carousel-container snap-x" ref={carouselRef}>
            {carouselPets.map((p, idx) => (
              <div key={idx} className="rescue-card card snap-start">
                <div className="rescue-img-container">
                  <img src={p.image} alt={p.name} />
                  <span className="badge new-arrival-badge">New Arrival</span>
                </div>
                <div className="rescue-info">
                  <div className="carousel-pet-header">
                    <h3>{p.name}</h3>
                    <span className="carousel-species">{p.species}</span>
                  </div>
                  <p className="rescue-reason">{p.reason}</p>
                  <Link to={`/adopt/pet/${p.slug}`} className="btn-text carousel-story-btn">
                    View Full Story
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Main Adopt Area */}
        <div className="adopt-content-layout" id="browse-strays-area">
          <PetFilters
            filters={filters}
            onFilterChange={updateFilter}
            onResetFilters={resetFilters}
          />

          <PetGrid
            pets={pets}
            savedPets={savedPets}
            onToggleFavorite={toggleFavorite}
            onResetFilters={resetFilters}
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            totalPets={totalCount}
            sortBy={sortBy}
            onSortChange={setSortBy}
          />
        </div>

        {/* Adoption Process Section */}
        <section className="adoption-process">
          <div className="section-header centered">
            <h2>Our Premium Adoption Journey</h2>
            <p>
              We&apos;ve streamlined the process to help you find and bring home your new best friend safely and
              joyfully.
            </p>
          </div>

          <div className="process-timeline-container">
            <div className="timeline-line"></div>
            <div className="process-card-grid">
              <div className="process-step-card card">
                <div className="step-icon-wrapper"><i className="ph ph-magnifying-glass"></i></div>
                <div className="step-number">1</div>
                <h4>Browse</h4>
                <p>Find a pet that perfectly matches your lifestyle.</p>
              </div>

              <div className="process-step-card card">
                <div className="step-icon-wrapper"><i className="ph ph-file-text"></i></div>
                <div className="step-number">2</div>
                <h4>Apply</h4>
                <p>Submit a short, simple adoption application.</p>
              </div>

              <div className="process-step-card card">
                <div className="step-icon-wrapper"><i className="ph ph-clipboard-text"></i></div>
                <div className="step-number">3</div>
                <h4>NGO Review</h4>
                <p>The rescue reviews your application quickly.</p>
              </div>

              <div className="process-step-card card">
                <div className="step-icon-wrapper"><i className="ph ph-handshake"></i></div>
                <div className="step-number">4</div>
                <h4>Meet</h4>
                <p>Meet the pet to ensure a joyful, perfect fit.</p>
              </div>

              <div className="process-step-card card">
                <div className="step-icon-wrapper"><i className="ph ph-house"></i></div>
                <div className="step-number">5</div>
                <h4>Home Check</h4>
                <p>A quick virtual or physical home check for safety.</p>
              </div>

              <div className="process-step-card card final-step">
                <div className="step-icon-wrapper"><i className="ph-fill ph-heart"></i></div>
                <div className="step-number">6</div>
                <h4>Forever Home</h4>
                <p>Welcome your new family member!</p>
              </div>
            </div>
          </div>
        </section>

        {/* Success Impact Section */}
        <section className="impact-section">
          <div className="impact-grid">
            <div className="impact-card card">
              <i className="ph-fill ph-paw-print"></i>
              <h3>2,400+</h3>
              <p>Successful Adoptions</p>
            </div>
            <div className="impact-card card">
              <i className="ph-fill ph-buildings"></i>
              <h3>180+</h3>
              <p>NGO Partners</p>
            </div>
            <div className="impact-card card">
              <i className="ph-fill ph-first-aid"></i>
              <h3>12,000+</h3>
              <p>Rescues Helped</p>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="faq-section">
          <div className="section-header centered">
            <h2>Adoption FAQ</h2>
            <p>Everything you need to know about welcoming a new pet.</p>
          </div>
          <div className="faq-grid">
            {faqs.map((faq, index) => (
              <div key={index} className="faq-card card">
                <div
                  className="faq-question"
                  onClick={() => toggleFaq(index)}
                  role="button"
                  tabIndex="0"
                >
                  <strong>{faq.q}</strong>
                  <i className={`ph ph-caret-${activeFaq === index ? 'up' : 'down'}`}></i>
                </div>
                {activeFaq === index && (
                  <div className="faq-answer" style={{ display: 'block' }}>
                    <p>{faq.a}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Final CTA Banner */}
        <section className="final-cta card">
          <div className="cta-content">
            <h2>Can&apos;t Adopt Right Now?</h2>
            <p>
              You can still make a massive difference by fostering, sponsoring medical treatments, or donating
              supplies to local shelters.
            </p>
            <div className="cta-buttons">
              <Link to="/volunteer" className="btn btn-primary">
                Become a Foster
              </Link>
              <Link to="/donate" className="btn btn-secondary">
                Sponsor a Rescue
              </Link>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}

export default Adopt;
