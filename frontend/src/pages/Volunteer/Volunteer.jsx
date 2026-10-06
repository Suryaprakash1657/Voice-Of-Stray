import React, { useState, useEffect } from 'react';
import { useSearchParams, useLocation, useNavigate } from 'react-router-dom';
import { useVolunteerApplications } from './hooks/useVolunteerApplications.js';
import { useVolunteerOpportunities } from './hooks/useVolunteerOpportunities.js';
import { useVolunteerAssignments } from './hooks/useVolunteerAssignments.js';

import VolunteerHero from './components/VolunteerHero.jsx';
import VolunteerOpportunities from './components/VolunteerOpportunities.jsx';
import VolunteerApplication from './components/VolunteerApplication.jsx';
import ApplicationStatus from './components/ApplicationStatus.jsx';
import VolunteerActivities from './components/VolunteerActivities.jsx';

import './volunteer.css';

export function Volunteer() {
  const [searchParams, setSearchParams] = useSearchParams();
  const location = useLocation();
  const navigate = useNavigate();

  // Active subview: 'overview' | 'activities'
  const isActivitiesPath = location.pathname.endsWith('/activities') || location.pathname === '/volunteer-activities';
  const viewParam = searchParams.get('view');
  const [activeView, setActiveView] = useState((isActivitiesPath || viewParam === 'activities') ? 'activities' : 'overview');

  // Application hook
  const {
    currentUser,
    volunteerStatus,
    statusInfo,
    isApproved,
    isPending,
    isRejected,
    isRemoved,
    isNgo,
    submitApplication,
    submitNgoApplication,
    refreshApplications
  } = useVolunteerApplications();

  // Opportunities hook
  const {
    filteredOpportunities,
    availableRescueCases,
    filter,
    setFilter,
    acceptOpportunity,
    submitRescueRequest
  } = useVolunteerOpportunities();

  // Assignments hook
  const {
    assignments,
    history,
    metrics,
    levelInfo,
    badges,
    completeAssignment,
    updateAvailability
  } = useVolunteerAssignments();

  // Modals state
  const [activeModal, setActiveModal] = useState(null); // 'volunteer-modal' | 'foster-modal' | 'ngo-modal' | null

  // Role section interactive states
  const [selectedSkills, setSelectedSkills] = useState(['First Aid']);
  const [selectedAvailability, setSelectedAvailability] = useState('Weekends');
  const [emergencyAlertsOnly, setEmergencyAlertsOnly] = useState(false);

  // FAQ Accordion state
  const [openFaqIndex, setOpenFaqIndex] = useState(null);

  useEffect(() => {
    if (isActivitiesPath || viewParam === 'activities') {
      setActiveView('activities');
    } else {
      setActiveView('overview');
    }
  }, [isActivitiesPath, viewParam]);

  const handleSkillToggle = (skill) => {
    if (selectedSkills.includes(skill)) {
      setSelectedSkills(selectedSkills.filter(s => s !== skill));
    } else {
      setSelectedSkills([...selectedSkills, skill]);
    }
  };

  const handleOpenVolunteerModal = () => {
    if (isNgo) {
      alert("NGO accounts cannot apply as individual volunteers.");
      return;
    }
    setActiveModal('volunteer-modal');
  };

  const handleOpenFosterModal = () => {
    if (isNgo) {
      alert("NGO accounts cannot apply as foster parents.");
      return;
    }
    setActiveModal('foster-modal');
  };

  const handleOpenNgoModal = () => {
    setActiveModal('ngo-modal');
  };

  const handleGoToActivities = () => {
    setActiveView('activities');
    setSearchParams({ view: 'activities' });
  };

  const handleBackToOverview = () => {
    setActiveView('overview');
    setSearchParams({});
  };

  const toggleFaq = (idx) => {
    setOpenFaqIndex(openFaqIndex === idx ? null : idx);
  };

  const faqData = [
    {
      q: 'Do I need prior experience to volunteer?',
      a: 'Not at all! We have roles for all experience levels. While emergency rescue missions may require specialized training (which we provide), tasks like feeding drives, transportation, and fostering are perfect for beginners.'
    },
    {
      q: 'Can students volunteer?',
      a: 'Yes, students over the age of 16 can volunteer for most tasks. Those under 16 must be accompanied by a parent or guardian during feeding drives and community events.'
    },
    {
      q: 'Is there any remote volunteering available?',
      a: 'Absolutely! We constantly need help with social media management, helpline coordination, graphic design, and grant writing. You can help save lives right from your laptop.'
    },
    {
      q: 'Can I volunteer weekends only?',
      a: 'Yes. When you set up your Individual Rescuer profile, you can set your exact availability zone and schedule. You will only be pinged for opportunities that match your settings.'
    },
    {
      q: 'Are rescues safe?',
      a: 'Safety is our top priority. We provide comprehensive safety guidelines, mandatory training for field roles, and you will always be paired with an experienced rescuer or verified NGO on your first few missions.'
    }
  ];

  // If approved and viewing activities dashboard
  if (activeView === 'activities') {
    return (
      <div className="activities-page-wrapper">
        {/* Background sparkles */}
        <div className="bg-decorations">
          <svg
            className="decor-item"
            style={{ bottom: '15%', right: '4%', width: '120px', transform: 'rotate(25deg)' }}
            viewBox="0 0 100 100"
          >
            <ellipse cx="25" cy="40" rx="9" ry="12" />
            <ellipse cx="42" cy="25" rx="9" ry="12" />
            <ellipse cx="62" cy="25" rx="9" ry="12" />
            <ellipse cx="78" cy="40" rx="9" ry="12" />
            <path d="M 28 65 C 28 50, 40 45, 52 45 C 64 45, 76 50, 76 65 C 76 80, 64 85, 52 85 C 40 85, 28 80, 28 65 Z" />
          </svg>
          <svg
            className="decor-item sparkle"
            style={{ top: '30%', left: '45%', width: '22px' }}
            viewBox="0 0 24 24"
          >
            <path d="M12,2 L14.5,9.5 L22,12 L14.5,14.5 L12,22 L9.5,14.5 L2,12 L9.5,9.5 Z" />
          </svg>
          <svg
            className="decor-item sparkle"
            style={{ bottom: '35%', left: '15%', width: '26px', animationDelay: '1.5s' }}
            viewBox="0 0 24 24"
          >
            <path d="M12,2 L14.5,9.5 L22,12 L14.5,14.5 L12,22 L9.5,14.5 L2,12 L9.5,9.5 Z" />
          </svg>
        </div>

        <VolunteerActivities
          currentUser={currentUser}
          statusInfo={statusInfo}
          assignments={assignments}
          availableRescueCases={availableRescueCases}
          opportunities={filteredOpportunities}
          history={history}
          metrics={metrics}
          levelInfo={levelInfo}
          badges={badges}
          onCompleteAssignment={completeAssignment}
          onUpdateAvailability={updateAvailability}
          onSubmitRescueRequest={submitRescueRequest}
          onAcceptOpportunity={acceptOpportunity}
          onBackToOverview={handleBackToOverview}
        />
      </div>
    );
  }

  // Has existing application status that should replace "Choose Your Role"
  const hasApplicationStatus = isPending || isApproved || isRejected || isRemoved || isNgo;

  return (
    <>
      {/* 1. Hero Section & Emergency Banner */}
      <VolunteerHero
        onOpenVolunteerModal={handleOpenVolunteerModal}
        onOpenNgoModal={handleOpenNgoModal}
        onOpenFosterModal={handleOpenFosterModal}
        isNgo={isNgo}
      />

      <main className="volunteer-main">
        {/* 2. Choose Your Role / Application Status */}
        <section className="fade-in" id="role-selection-section">
          {!hasApplicationStatus && (
            <div className="section-header-center">
              <h2>Choose Your Role</h2>
              <p>Select how you want to contribute to the mission</p>
            </div>
          )}

          {hasApplicationStatus ? (
            <ApplicationStatus
              status={volunteerStatus}
              isNgo={isNgo}
              onGoToActivities={handleGoToActivities}
              onApplyAgain={() => setActiveModal('volunteer-modal')}
            />
          ) : (
            <div className="role-grid" id="role-selection-grid">
              {/* Individual Rescuer */}
              <div className="role-card hover-lift">
                <div className="role-header">
                  <div className="role-title-area">
                    <div className="role-icon">
                      <i className="ph-fill ph-user"></i>
                    </div>
                    <div className="role-title">
                      <h3>Individual Rescuer</h3>
                      <p>Emergency responder & helper</p>
                    </div>
                  </div>
                  <div className="role-badge badge-orange">
                    <i className="ph-fill ph-check-circle"></i> Verified Rescuer
                  </div>
                </div>

                <div className="step-label">
                  <div className="step-num">1</div> SELECT YOUR SKILLS
                </div>
                <div className="skills-container">
                  {['First Aid', 'Driving', 'Photography', 'Fostering'].map(skill => (
                    <div
                      key={skill}
                      className={`skill-chip ${selectedSkills.includes(skill) ? 'active' : ''}`}
                      onClick={() => handleSkillToggle(skill)}
                    >
                      <i
                        className={`ph-bold ${
                          skill === 'First Aid'
                            ? 'ph-first-aid'
                            : skill === 'Driving'
                            ? 'ph-car'
                            : skill === 'Photography'
                            ? 'ph-camera'
                            : 'ph-house'
                        }`}
                      ></i>{' '}
                      {skill}
                    </div>
                  ))}
                  <div
                    className="skill-chip add-new"
                    onClick={() => {
                      const newSkill = prompt("Enter a skill (e.g. Dog Training, Medical Care):");
                      if (newSkill && newSkill.trim()) {
                        setSelectedSkills([...selectedSkills, newSkill.trim()]);
                      }
                    }}
                  >
                    <i className="ph-bold ph-plus"></i>
                  </div>
                </div>

                <div className="step-label">
                  <div className="step-num">2</div> SET AVAILABILITY & ZONE
                </div>

                <div className="availability-selector">
                  {['Weekdays', 'Weekends', 'Anytime'].map(opt => (
                    <button
                      key={opt}
                      className={`avail-btn ${selectedAvailability === opt ? 'active' : ''}`}
                      onClick={() => setSelectedAvailability(opt)}
                    >
                      {opt}
                    </button>
                  ))}
                </div>

                <div className="emergency-toggle">
                  <div className="emergency-toggle-text">
                    <h4>Emergency Alerts Only</h4>
                    <p>Only notify me for critical, life-threatening rescues.</p>
                  </div>
                  <label className="switch">
                    <input
                      type="checkbox"
                      checked={emergencyAlertsOnly}
                      onChange={(e) => setEmergencyAlertsOnly(e.target.checked)}
                    />
                    <span className="slider"></span>
                  </label>
                </div>

                <div className="map-zone">
                  <div className="map-overlay-circle"></div>
                  <div className="radius-badge">Radius: 5km</div>
                </div>

                <button
                  className="btn-full orange open-modal-btn"
                  onClick={handleOpenVolunteerModal}
                >
                  Submit Rescuer Profile
                </button>
              </div>

              {/* NGO Partner */}
              <div className="role-card ngo hover-lift">
                <div className="role-header">
                  <div className="role-title-area">
                    <div className="role-icon">
                      <i className="ph-fill ph-buildings"></i>
                    </div>
                    <div className="role-title">
                      <h3>NGO Partner</h3>
                      <p>Registered Welfare Group</p>
                    </div>
                  </div>
                  <div className="role-badge badge-green">
                    <i className="ph-fill ph-shield-check"></i> Registered NGO
                  </div>
                </div>

                <div className="step-label">
                  <div className="step-num">1</div> ORGANIZATION VERIFICATION
                </div>
                <div className="docs-grid">
                  <div className="doc-card">
                    <i className="ph-fill ph-shield-check"></i>
                    <h4>Legal Docs</h4>
                    <p>501(c)(3) or 80G equivalent</p>
                  </div>
                  <div className="doc-card">
                    <i className="ph-fill ph-bank"></i>
                    <h4>Financials</h4>
                    <p>Transparency reports</p>
                  </div>
                </div>

                <button
                  className="btn-upload"
                  onClick={() => alert("Document upload module is accessible through NGO Onboarding.")}
                >
                  <i className="ph-bold ph-upload-simple"></i> Upload Required Documents
                </button>

                <div className="ngo-benefits">
                  <ul>
                    <li><i className="ph-bold ph-check"></i> Access to verified rescue network</li>
                    <li><i className="ph-bold ph-check"></i> Receive verified emergency alerts</li>
                    <li><i className="ph-bold ph-check"></i> Direct funding distribution</li>
                  </ul>
                </div>

                <div className="step-label">
                  <div className="step-num">2</div> ONBOARDING PROGRESS
                </div>
                <div className="onboarding-progress">
                  <div className="progress-icon">
                    <i className="ph-fill ph-paw-print"></i>
                    <div className="progress-check">
                      <i className="ph-bold ph-check"></i>
                    </div>
                  </div>
                  <div className="progress-bar-container">
                    <div className="progress-header">
                      <span>PROGRESS</span>
                      <span>61%</span>
                    </div>
                    <div className="p-bar">
                      <div className="p-fill" style={{ width: '61%' }}></div>
                    </div>
                  </div>
                </div>

                <button
                  className="btn-full blue open-modal-btn"
                  onClick={handleOpenNgoModal}
                >
                  Begin NGO Verification
                </button>
              </div>
            </div>
          )}
        </section>

        {/* 3. Impact Dashboard */}
        <section className="fade-in">
          <div className="section-header-split">
            <div className="header-text">
              <h2>Impact Dashboard</h2>
              <p>A glimpse of your personal or organization's journey</p>
            </div>
            <a href="#role-selection-section" className="view-link">
              Full Report <i className="ph-bold ph-arrow-right"></i>
            </a>
          </div>

          <div className="dashboard-grid">
            <div className="dash-card hover-lift">
              <div className="dash-icon-row">
                <div className="dash-icon orange"><i className="ph-fill ph-clock-counter-clockwise"></i></div>
                <div className="dash-trend green">+ 12% vs last month</div>
              </div>
              <div className="dash-value">24</div>
              <div className="dash-label">Active Cases Handled</div>
              <div className="mini-chart">
                <div className="mini-bar" style={{ height: '30%' }}></div>
                <div className="mini-bar" style={{ height: '50%' }}></div>
                <div className="mini-bar" style={{ height: '70%' }}></div>
                <div className="mini-bar" style={{ height: '60%' }}></div>
                <div className="mini-bar active" style={{ height: '100%' }}></div>
              </div>
            </div>

            <div className="dash-card hover-lift">
              <div className="dash-icon-row">
                <div className="dash-icon blue"><i className="ph-fill ph-heart"></i></div>
                <div className="dash-trend green">95% Positive Feedback</div>
              </div>
              <div className="dash-value">186</div>
              <div className="dash-label">Animals Rehomed</div>
              <div className="mini-chart">
                <div className="mini-bar" style={{ height: '40%' }}></div>
                <div className="mini-bar" style={{ height: '60%' }}></div>
                <div className="mini-bar" style={{ height: '30%' }}></div>
                <div className="mini-bar" style={{ height: '80%' }}></div>
                <div className="mini-bar active" style={{ height: '100%' }}></div>
              </div>
            </div>

            <div className="dash-card hover-lift">
              <div className="dash-icon-row">
                <div className="dash-icon green"><i className="ph-fill ph-clock"></i></div>
                <div className="dash-trend green">Top 10% Contributor</div>
              </div>
              <div className="dash-value">320</div>
              <div className="dash-label">Hours Contributed</div>
              <div className="mini-chart">
                <div className="mini-bar" style={{ height: '50%' }}></div>
                <div className="mini-bar" style={{ height: '70%' }}></div>
                <div className="mini-bar" style={{ height: '90%' }}></div>
                <div className="mini-bar active" style={{ height: '100%' }}></div>
                <div className="mini-bar" style={{ height: '80%' }}></div>
              </div>
            </div>
          </div>

          <div className="dashboard-row-2">
            <div className="dash-card hover-lift" style={{ justifyContent: 'flex-start' }}>
              <div className="activity-title" style={{ marginBottom: '8px' }}>RECENT ACTIVITY</div>
              <div className="activity-list">
                <div className="activity-item">
                  <div className="act-icon"><i className="ph-fill ph-star" style={{ color: 'var(--primary, #f97316)' }}></i></div>
                  <div className="act-details">
                    <h4>Stray Rescue NYC-402</h4>
                    <p>2 days ago • Completed</p>
                  </div>
                  <div className="act-status green"><i className="ph-bold ph-check-circle"></i></div>
                </div>
                <div className="activity-item">
                  <div className="act-icon"><i className="ph-fill ph-first-aid" style={{ color: '#3b82f6' }}></i></div>
                  <div className="act-details">
                    <h4>Medical Aid Request</h4>
                    <p>5 days ago • In Review</p>
                  </div>
                  <div className="act-status gray"><i className="ph-bold ph-dots-three-circle"></i></div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 4. Global Impact */}
        <section className="fade-in">
          <div className="section-header-split">
            <div className="header-text">
              <h2>Global Impact</h2>
            </div>
          </div>

          <div className="global-impact-grid">
            <div className="impact-main-card hover-lift">
              <img
                src="https://images.unsplash.com/photo-1593134257782-e89567b7718a?auto=format&fit=crop&q=80&w=1200"
                alt="Rescuers"
                className="impact-img"
              />
              <div className="map-pin" style={{ top: '25%', left: '30%' }}></div>
              <div className="map-pin" style={{ top: '45%', left: '60%', animationDelay: '0.5s' }}></div>
              <div className="map-pin" style={{ top: '65%', left: '40%', animationDelay: '1s' }}></div>
              <div className="map-pin" style={{ top: '35%', left: '75%', animationDelay: '1.5s' }}></div>

              <div className="impact-overlay">
                <h3>4,200+ Lives Saved</h3>
                <p>
                  Our partner network provides critical medical care to strays in record time across 12 countries.
                </p>
              </div>
            </div>

            <div className="impact-side-cards">
              <div className="side-card orange hover-lift">
                <div className="side-icon"><i className="ph-fill ph-users"></i></div>
                <h3>850 Volunteers</h3>
                <p>Active on the ground today</p>
              </div>
              <div className="side-card green hover-lift">
                <div className="side-icon"><i className="ph-fill ph-handshake"></i></div>
                <h3>120 NGOs</h3>
                <p>Certified for transparency</p>
              </div>
            </div>
          </div>
        </section>

        {/* 5. Volunteer Opportunities */}
        <VolunteerOpportunities
          opportunities={filteredOpportunities}
          filter={filter}
          onFilterChange={setFilter}
          onAcceptOpportunity={acceptOpportunity}
        />

        {/* 6. Testimonials */}
        <section className="fade-in">
          <div className="section-header-center">
            <h2>Volunteer Stories</h2>
            <p>Hear from our community of heroes</p>
          </div>

          <div className="testimonials-grid">
            <div className="test-card hover-lift">
              <p className="test-quote">
                Fostering injured strays has been the most rewarding experience of my life. The platform makes it so easy to connect with verified vets.
              </p>
              <div className="test-author">
                <img
                  src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=150"
                  alt="Sarah"
                  className="test-avatar"
                />
                <div className="test-info">
                  <h4>Sarah Jenkins</h4>
                  <p>Foster Parent, NYC</p>
                </div>
              </div>
            </div>

            <div className="test-card hover-lift">
              <p className="test-quote">
                As an NGO, finding reliable volunteers used to be a challenge. Now, we fill transport and rescue roles in a matter of minutes.
              </p>
              <div className="test-author">
                <img
                  src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=150"
                  alt="Michael"
                  className="test-avatar"
                />
                <div className="test-info">
                  <h4>Michael Rodriguez</h4>
                  <p>Stray Hope Foundation</p>
                </div>
              </div>
            </div>

            <div className="test-card hover-lift">
              <p className="test-quote">
                I love the weekend feeding drives. It's an amazing way to give back to the community and help those who can't speak for themselves.
              </p>
              <div className="test-author">
                <img
                  src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150"
                  alt="Priya"
                  className="test-avatar"
                />
                <div className="test-info">
                  <h4>Priya Patel</h4>
                  <p>Community Volunteer</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 7. CTA Banner */}
        <section className="cta-banner fade-in">
          <div className="cta-content">
            <h2>Ready to Make a Difference?</h2>
            <p>Join thousands of everyday heroes making our streets safer for animals in need.</p>
            <div className="cta-buttons">
              {!isNgo && (
                <button
                  className="btn-hero primary open-modal-btn"
                  onClick={handleOpenVolunteerModal}
                >
                  Start as Volunteer
                </button>
              )}
              <button
                className="btn-hero outline open-modal-btn"
                onClick={handleOpenNgoModal}
              >
                Register NGO
              </button>
            </div>
          </div>
        </section>

        {/* 8. FAQ Accordion */}
        <section className="fade-in faq-section">
          <div className="section-header-center">
            <h2>Frequently Asked Questions</h2>
          </div>

          <div className="faq-list">
            {faqData.map((item, idx) => (
              <div key={idx} className={`faq-item ${openFaqIndex === idx ? 'active' : ''}`}>
                <div className="faq-question" onClick={() => toggleFaq(idx)}>
                  <span>{item.q}</span>
                  <i
                    className="ph-bold ph-caret-down faq-icon"
                    style={{
                      transform: openFaqIndex === idx ? 'rotate(180deg)' : 'rotate(0deg)'
                    }}
                  ></i>
                </div>
                {openFaqIndex === idx && (
                  <div className="faq-answer">
                    <p>{item.a}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* Application Modals */}
      <VolunteerApplication
        activeModal={activeModal}
        onClose={() => setActiveModal(null)}
        onSubmitVolunteer={submitApplication}
        onSubmitNgo={submitNgoApplication}
        currentUser={currentUser}
        selectedSkills={selectedSkills}
        selectedAvailability={selectedAvailability}
      />
    </>
  );
}

export default Volunteer;
