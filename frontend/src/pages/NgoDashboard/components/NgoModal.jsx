import React from 'react';

export function NgoModal({ modalData, onClose, onApproveVolunteer, onRejectVolunteer, onApproveAdoption, onRejectAdoption }) {
  if (!modalData) return null;

  const { type, title, data } = modalData;

  const renderContent = () => {
    switch (type) {
      case 'animals_under_care': {
        const animals = [
          { name: 'Daisy', breed: 'Beagle Mix', age: '2 years', status: 'Post-surgery recovery', icon: 'ph-first-aid' },
          { name: 'Rocky', breed: 'Indie Stray', age: '1 year', status: 'Physical therapy', icon: 'ph-activity' },
          { name: 'Mittens', breed: 'Tabby Cat', age: '6 months', status: 'Vaccinated, ready for foster', icon: 'ph-check-circle' },
          { name: 'Leo', breed: 'Labrador', age: '4 years', status: 'Skin treatment ongoing', icon: 'ph-pill' },
          { name: 'Bella', breed: 'Spitz Mix', age: '3 years', status: 'Malnutrition rehabilitation', icon: 'ph-heart' },
          { name: 'Simba', breed: 'Persian Cat', age: '2 years', status: 'Behavioral assessment', icon: 'ph-eye' }
        ];

        return (
          <>
            <p style={{ marginTop: 0, marginBottom: '16px', color: 'var(--text-muted)', fontWeight: 500 }}>
              Currently housing 18 rescues across your partner shelters. Here are active listings:
            </p>
            <div className="modal-list">
              {animals.map((a, i) => (
                <div className="modal-list-item" key={i}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div
                      style={{
                        width: '38px',
                        height: '38px',
                        borderRadius: '50%',
                        background: 'rgba(249,115,22,0.08)',
                        color: 'var(--primary)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '1.1rem'
                      }}
                    >
                      <i className={`ph ${a.icon}`}></i>
                    </div>
                    <div>
                      <h5 style={{ fontSize: '0.9rem', fontWeight: 700, color: '#0f172a', margin: '0 0 2px 0' }}>
                        {a.name} ({a.breed})
                      </h5>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 500 }}>
                        Age: {a.age}
                      </span>
                    </div>
                  </div>
                  <span
                    className="status-pill busy"
                    style={{ background: 'rgba(249,115,22,0.06)', color: 'var(--primary)', fontSize: '0.7rem', fontWeight: 700 }}
                  >
                    {a.status}
                  </span>
                </div>
              ))}
            </div>
            <div style={{ marginTop: '20px', textAlign: 'right' }}>
              <button
                className="btn-premium primary"
                style={{ padding: '8px 16px', fontSize: '0.8rem' }}
                onClick={onClose}
              >
                Close View
              </button>
            </div>
          </>
        );
      }

      case 'successful_rescues': {
        const cases = [
          { id: 'RSC-4821', type: 'Injured Cat', loc: 'Anna Nagar Area', date: 'May 28', vol: 'Ravi' },
          { id: 'RSC-4805', type: 'Dehydrated Dog', loc: 'Vadapalani', date: 'May 24', vol: 'Priya' },
          { id: 'RSC-4789', type: 'Fractured Calf', loc: 'Guindy Highway', date: 'May 19', vol: 'Akash' },
          { id: 'RSC-4762', type: 'Abandoned Pups', loc: 'Besant Nagar', date: 'May 12', vol: 'Ravi' },
          { id: 'RSC-4712', type: 'Trapped Kitten', loc: 'Velachery', date: 'May 05', vol: 'Priya' }
        ];

        return (
          <>
            <p style={{ marginTop: 0, marginBottom: '16px', color: 'var(--text-muted)', fontWeight: 500 }}>
              15 emergency cases successfully resolved and rehomed/sheltered this month:
            </p>
            <div className="modal-list">
              {cases.map((c) => (
                <div className="modal-list-item" key={c.id}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div
                      style={{
                        width: '38px',
                        height: '38px',
                        borderRadius: '50%',
                        background: '#dcfce7',
                        color: '#15803d',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '1.1rem'
                      }}
                    >
                      <i className="ph ph-check-square"></i>
                    </div>
                    <div>
                      <h5 style={{ fontSize: '0.9rem', fontWeight: 700, color: '#0f172a', margin: '0 0 2px 0' }}>
                        #{c.id} - {c.type}
                      </h5>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 500 }}>
                        Location: {c.loc} • Rescued by {c.vol}
                      </span>
                    </div>
                  </div>
                  <span className="status-pill available" style={{ fontSize: '0.7rem', fontWeight: 800 }}>
                    {c.date}
                  </span>
                </div>
              ))}
            </div>
            <div style={{ marginTop: '20px', textAlign: 'right' }}>
              <button
                className="btn-premium primary"
                style={{ padding: '8px 16px', fontSize: '0.8rem' }}
                onClick={onClose}
              >
                Close View
              </button>
            </div>
          </>
        );
      }

      case 'volunteer_application': {
        const app = data;
        return (
          <div style={{ fontFamily: "'Outfit', sans-serif", display: 'flex', flexDirection: 'column', gap: '16px', color: '#334155' }}>
            <div style={{ background: 'rgba(249, 115, 22, 0.05)', padding: '16px', borderRadius: '8px', border: '1px dashed rgba(249, 115, 22, 0.2)' }}>
              <h4 style={{ margin: '0 0 8px 0', color: '#0f172a', fontWeight: 700, fontSize: '1rem' }}>Volunteer Details</h4>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', fontSize: '0.85rem' }}>
                <span><strong>Name:</strong> {app.name}</span>
                <span><strong>Email:</strong> {app.email}</span>
                <span><strong>Phone:</strong> {app.phone || 'N/A'}</span>
                <span><strong>Applied Role:</strong> {app.role || 'Volunteer'}</span>
                <span><strong>Availability:</strong> {app.availability || 'Weekends'}</span>
                <span><strong>Skills:</strong> {app.skills && app.skills.length > 0 ? (Array.isArray(app.skills) ? app.skills.join(', ') : app.skills) : 'None'}</span>
                <span><strong>Application Type:</strong> {(app.type || 'volunteer').toUpperCase()}</span>
                <span><strong>Submitted:</strong> {app.date || 'Recent'}</span>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '8px' }}>
              <button
                className="btn-adopt-act reject"
                style={{ padding: '10px 20px' }}
                onClick={() => {
                  onRejectVolunteer(app.id);
                  onClose();
                }}
              >
                Reject Application
              </button>
              <button
                className="btn-adopt-act approve"
                style={{ padding: '10px 20px' }}
                onClick={() => {
                  onApproveVolunteer(app.id);
                  onClose();
                }}
              >
                Approve Application
              </button>
            </div>
          </div>
        );
      }

      case 'adoption_application': {
        const app = data || {};
        const petName = app.petName || 'Rescue Pet';
        const applicantName = app.applicantName || 'Applicant';
        return (
          <div style={{ fontFamily: "'Outfit', sans-serif", display: 'flex', flexDirection: 'column', gap: '16px', color: '#334155' }}>
            <div style={{ background: 'rgba(249, 115, 22, 0.05)', padding: '16px', borderRadius: '8px', border: '1px dashed rgba(249, 115, 22, 0.2)' }}>
              <h4 style={{ margin: '0 0 8px 0', color: '#0f172a', fontWeight: 700, fontSize: '1rem' }}>Applicant Details</h4>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', fontSize: '0.85rem' }}>
                <span><strong>Pet Requested:</strong> {petName} ({app.breed || 'Rescue Pet'})</span>
                <span><strong>Applicant Name:</strong> {applicantName}</span>
                <span><strong>Age:</strong> {app.age || '28'}</span>
                <span><strong>Phone:</strong> {app.applicantPhone || '+91 98765 43210'}</span>
                <span><strong>Email:</strong> {app.applicantEmail || 'arjun@example.com'}</span>
                <span><strong>City:</strong> {app.city || 'Mumbai'}</span>
                <span><strong>Occupation:</strong> {app.occupation || 'Software Engineer'}</span>
                <span><strong>Submitted:</strong> {app.date || 'Recent'}</span>
              </div>
            </div>

            <div style={{ background: 'rgba(249, 115, 22, 0.05)', padding: '16px', borderRadius: '8px', border: '1px dashed rgba(249, 115, 22, 0.2)' }}>
              <h4 style={{ margin: '0 0 8px 0', color: '#0f172a', fontWeight: 700, fontSize: '1rem' }}>Living Environment</h4>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', fontSize: '0.85rem' }}>
                <span><strong>Ownership:</strong> {app.ownRent === 'own' ? 'Owns Home' : 'Rents Home'}</span>
                <span><strong>Fenced Yard:</strong> {app.hasYard === 'yes' ? 'Yes' : 'No'}</span>
                <span><strong>Current Pets:</strong> {app.hasPets === 'yes' ? 'Yes' : 'None'}</span>
                <span><strong>Children at Home:</strong> {app.hasKids === 'yes' ? 'Yes' : 'No'}</span>
              </div>
            </div>

            <div style={{ background: 'rgba(249, 115, 22, 0.05)', padding: '16px', borderRadius: '8px', border: '1px dashed rgba(249, 115, 22, 0.2)' }}>
              <h4 style={{ margin: '0 0 8px 0', color: '#0f172a', fontWeight: 700, fontSize: '1rem' }}>Why Adopt</h4>
              <p style={{ margin: 0, fontSize: '0.85rem', lineHeight: 1.5 }}>
                {app.whyAdopt || 'Looking to provide a loving and safe home for a rescue animal.'}
              </p>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '8px' }}>
              <button
                type="button"
                className="btn-adopt-act reject"
                style={{ padding: '10px 20px', cursor: 'pointer' }}
                onClick={() => {
                  onRejectAdoption && onRejectAdoption(petName, applicantName);
                  onClose();
                }}
              >
                Reject Application
              </button>
              <button
                type="button"
                className="btn-adopt-act approve"
                style={{ padding: '10px 20px', cursor: 'pointer' }}
                onClick={() => {
                  onApproveAdoption && onApproveAdoption(petName, applicantName);
                  onClose();
                }}
              >
                Approve Application
              </button>
            </div>
          </div>
        );
      }

      default:
        return null;
    }
  };

  return (
    <div id="ops-modal" className="ops-modal-overlay show" onClick={onClose}>
      <div className="ops-modal-content glass-card" onClick={(e) => e.stopPropagation()}>
        <div className="ops-modal-header">
          <h3 id="ops-modal-title">{title}</h3>
          <button className="ops-modal-close" onClick={onClose}>
            <i className="ph ph-x"></i>
          </button>
        </div>
        <div className="ops-modal-body" id="ops-modal-body">
          {renderContent()}
        </div>
      </div>
    </div>
  );
}

export default NgoModal;
