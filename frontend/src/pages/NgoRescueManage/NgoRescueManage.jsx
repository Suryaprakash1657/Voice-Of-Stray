import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useNgoDashboard } from '../NgoDashboard/hooks/useNgoDashboard.js';
import { ngoDashboardStorage } from '../NgoDashboard/services/ngoDashboardStorage.js';
import './ngo-rescue-manage.css';

const STEP_LABELS = [
  'Reported',
  'Waiting for Volunteer',
  'Volunteer Assigned',
  'Volunteer En Route',
  'Animal Rescued',
  'Treatment',
  'Recovery',
  'Ready for Adoption',
  'Adopted',
  'Completed'
];

export function NgoRescueManage() {
  const [searchParams] = useSearchParams();
  const caseId = searchParams.get('case') || '4902';

  const { handleUpdateCaseStatus } = useNgoDashboard();
  const [caseData, setCaseData] = useState(null);
  const [timelineNote, setTimelineNote] = useState('');
  const [selectedVolunteer, setSelectedVolunteer] = useState('');
  const [volunteerList, setVolunteerList] = useState([]);
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [showToast, setShowToast] = useState(false);

  useEffect(() => {
    document.title = `Manage Rescue Case #RSC-${caseId} - Voice of Stray`;

    const loadCase = () => {
      // Load eligible volunteers
      let vols = [
        { id: 'vol-priya-01', name: 'Priya', email: 'priya@example.com', role: 'Emergency Rescue' },
        { id: 'vol-akash-01', name: 'Akash', email: 'akash@example.com', role: 'Transport Specialist' },
        { id: 'vol-ravi-01', name: 'Ravi', email: 'ravi@example.com', role: 'Feeding Drives' },
        { id: 'usr-arjun', name: 'Arjun', email: 'user@voiceofstray.com', role: 'Active Rescuer' }
      ];
      try {
        const appsRaw = localStorage.getItem('voiceOfStrayVolunteerApplications');
        if (appsRaw) {
          const apps = JSON.parse(appsRaw);
          apps.forEach((a) => {
            if (a && (a.status === 'Approved' || a.status === 'Active' || a.status === 'Approved Volunteer')) {
              const existing = vols.find(
                (v) => (v.email && a.email && v.email.toLowerCase() === a.email.toLowerCase()) ||
                       (v.name && a.name && v.name.toLowerCase() === a.name.toLowerCase())
              );
              if (!existing) {
                vols.push({
                  id: a.volunteerId || a.id || `vol-${Date.now()}`,
                  name: a.name || 'Volunteer',
                  email: a.email || '',
                  role: a.role || 'Volunteer'
                });
              }
            }
          });
        }
      } catch (err) {}
      setVolunteerList(vols);

      try {
        const raw = localStorage.getItem('voiceOfStrayCases');
        if (raw) {
          const casesDb = JSON.parse(raw);
          if (casesDb[caseId]) {
            setCaseData(casesDb[caseId]);
            return;
          }
        }
      } catch (e) {}

      // Fallback sample case
      setCaseData({
        id: caseId,
        animal: 'Injured Puppy (Golden Retriever Mix)',
        animalType: 'Dog',
        breed: 'Golden Retriever Mix',
        location: 'Linking Road, Bandra West',
        reportedTime: '10:25 AM',
        severity: 'Emergency',
        status: 'Waiting for Volunteer',
        statusStep: 1,
        observedCondition: 'Fractured Leg, Dehydrated',
        reporter: {
          name: 'Anjali Sharma',
          phone: '+91 98200 12345',
          notes: 'Puppy unable to walk. Seen near roadside.'
        },
        team: {
          ngo: 'Paws Haven NGO',
          lead: '',
          volunteers: []
        },
        timeline: [
          { time: '10:30 AM', text: 'Case accepted by Paws Haven NGO.' },
          { time: '10:25 AM', text: 'Rescue report received from citizen.' }
        ],
        photos: {
          before: 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&q=80&w=400'
        }
      });
    };

    loadCase();
    window.addEventListener('storage', loadCase);
    return () => window.removeEventListener('storage', loadCase);
  }, [caseId]);

  const triggerToast = (msg) => {
    setToastMessage(msg);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2000);
  };

  if (!caseData) return null;

  const currentStep = caseData.statusStep || 1;

  const onAdvanceStep = (stepIdx) => {
    const targetStatus = STEP_LABELS[stepIdx];
    try {
      const raw = localStorage.getItem('voiceOfStrayCases');
      const casesDb = raw ? JSON.parse(raw) : {};
      if (casesDb[caseId]) {
        casesDb[caseId].statusStep = stepIdx;
        casesDb[caseId].status = targetStatus;
        if (!Array.isArray(casesDb[caseId].timeline)) casesDb[caseId].timeline = [];
        casesDb[caseId].timeline.unshift({
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          text: `Status advanced to ${targetStatus}.`
        });
        localStorage.setItem('voiceOfStrayCases', JSON.stringify(casesDb));
        setCaseData({ ...casesDb[caseId] });
        window.dispatchEvent(new Event('storage'));
        triggerToast(`Status advanced to: ${targetStatus}`);
      }
    } catch (e) {}
  };

  const handleAssignVolunteer = () => {
    if (!selectedVolunteer) return;

    try {
      const raw = localStorage.getItem('voiceOfStrayCases');
      const casesDb = raw ? JSON.parse(raw) : {};
      if (casesDb[caseId]) {
        const chosenVol = volunteerList.find(
          (v) => v.id === selectedVolunteer || v.email === selectedVolunteer || v.name === selectedVolunteer
        );
        const volName = chosenVol ? chosenVol.name : selectedVolunteer.replace(/\s*\(.*?\)/, '').trim();
        const volEmail = chosenVol ? chosenVol.email : '';
        const volId = chosenVol ? (chosenVol.volunteerId || chosenVol.id) : '';
        const volRole = chosenVol ? chosenVol.role : 'Volunteer';

        casesDb[caseId].team = casesDb[caseId].team || {};
        casesDb[caseId].team.lead = {
          username: volName,
          name: volName,
          email: volEmail,
          role: volRole,
          assignedDate: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
          status: 'Assigned'
        };
        casesDb[caseId].assignedVolunteerName = volName;
        casesDb[caseId].assignedVolunteerEmail = volEmail;
        casesDb[caseId].assignedVolunteerId = volId;
        casesDb[caseId].assignedVolunteerRole = volRole;
        casesDb[caseId].assignedAt = new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });

        if (casesDb[caseId].statusStep < 2) {
          casesDb[caseId].statusStep = 2;
          casesDb[caseId].status = 'Volunteer Assigned';
        }
        if (!Array.isArray(casesDb[caseId].timeline)) casesDb[caseId].timeline = [];
        casesDb[caseId].timeline.unshift({
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          text: `Volunteer ${volName} assigned to mission.`
        });
        localStorage.setItem('voiceOfStrayCases', JSON.stringify(casesDb));
        setCaseData({ ...casesDb[caseId] });
        window.dispatchEvent(new Event('storage'));
        window.dispatchEvent(new CustomEvent('voiceOfStrayCasesUpdated', { detail: casesDb }));
        setIsAssignModalOpen(false);
        triggerToast(`Assigned ${volName} to Case #${caseId}!`);
      }
    } catch (e) {}
  };

  const handleAddTimelineNote = (e) => {
    e.preventDefault();
    if (!timelineNote.trim()) return;

    try {
      const raw = localStorage.getItem('voiceOfStrayCases');
      const casesDb = raw ? JSON.parse(raw) : {};
      if (casesDb[caseId]) {
        if (!Array.isArray(casesDb[caseId].timeline)) casesDb[caseId].timeline = [];
        casesDb[caseId].timeline.unshift({
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          text: timelineNote.trim()
        });
        localStorage.setItem('voiceOfStrayCases', JSON.stringify(casesDb));
        setCaseData({ ...casesDb[caseId] });
        setTimelineNote('');
        window.dispatchEvent(new Event('storage'));
        triggerToast('Activity note added to timeline.');
      }
    } catch (e) {}
  };

  const leadName =
    caseData.assignedVolunteerName ||
    (caseData.team?.lead?.username || caseData.team?.lead || 'Not Assigned Yet');

  return (
    <div className="ngo-rescue-page-wrapper">
      <div className="workspace-container">
        {/* Back Link */}
        <div className="back-btn-container">
          <Link to="/ngo-dashboard" className="back-link">
            <i className="ph ph-arrow-left"></i> Back to NGO Dashboard
          </Link>
        </div>

        {/* Header Banner */}
        <header className="workspace-header-card">
          <div className="header-title-section">
            <span style={{ fontSize: '0.75rem', color: 'var(--primary)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1px' }}>
              NGO Rescue Operations Command
            </span>
            <h1>
              Manage Rescue Case <span className="case-badge">#RSC-{caseData.id}</span>
            </h1>
            <div className="badge-row">
              <span className={`meta-badge ${caseData.severity === 'Emergency' ? 'emergency' : 'high-priority'}`}>
                {caseData.severity || 'Emergency'}
              </span>
              <span className="meta-badge in-progress">{caseData.status}</span>
            </div>
          </div>
          <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', fontWeight: 700, background: 'white', padding: '10px 20px', borderRadius: 'var(--radius-md)', border: '1px solid rgba(249,115,22,0.15)', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ width: '8px', height: '8px', background: '#10b981', borderRadius: '50%', display: 'inline-block' }}></span>
            <span>Active Live Operation</span>
          </div>
        </header>

        {/* Workspace Grid */}
        <div className="workspace-grid">
          {/* Main Column */}
          <div className="main-column">
            {/* Case Information */}
            <section className="glass-card" style={{ padding: '24px' }}>
              <h3 className="card-title">
                <i className="ph-fill ph-info"></i> Case Information
              </h3>
              <div className="details-grid">
                <div className="detail-item">
                  <span className="detail-label">Animal</span>
                  <span className="detail-value">{caseData.animal || caseData.animalType}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Location</span>
                  <span className="detail-value">{caseData.location}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Reported Time</span>
                  <span className="detail-value">{caseData.reportedTime || '10:25 AM'}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Severity</span>
                  <span className="detail-value">{caseData.severity || 'Emergency'}</span>
                </div>
                <div className="detail-item" style={{ gridColumn: 'span 2' }}>
                  <span className="detail-label">Reported Condition</span>
                  <span className="detail-value">{caseData.observedCondition || caseData.condition || 'Emergency'}</span>
                </div>
              </div>
            </section>

            {/* Reporter Information */}
            <section className="glass-card" style={{ padding: '24px', borderColor: 'rgba(20, 184, 166, 0.25)' }}>
              <h3 className="card-title" style={{ borderBottomColor: 'rgba(20, 184, 166, 0.1)' }}>
                <i className="ph-fill ph-user-circle" style={{ color: 'var(--secondary)' }}></i>
                <span>Reporter Details</span>
                <span className="badge-identifier" style={{ marginLeft: 'auto' }}>Internal Staff View</span>
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div className="details-grid">
                  <div className="detail-item">
                    <span className="detail-label">Name</span>
                    <span className="detail-value">{caseData.reporter?.name || 'Concerned Citizen'}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Phone</span>
                    <span className="detail-value">{caseData.reporter?.phone || '+91 98200 12345'}</span>
                  </div>
                </div>
                <div style={{ background: 'rgba(249, 115, 22, 0.05)', padding: '12px', borderRadius: '8px' }}>
                  <strong style={{ display: 'block', fontSize: '0.72rem', textTransform: 'uppercase', color: 'var(--primary)', marginBottom: '4px' }}>
                    Reporter Notes:
                  </strong>
                  <span style={{ fontSize: '0.9rem', color: '#334155' }}>
                    {caseData.reporter?.notes || 'Stray in distress need assistance.'}
                  </span>
                </div>
              </div>
            </section>

            {/* Visual Lifecycle Stepper */}
            <section className="glass-card" style={{ padding: '24px' }}>
              <h3 className="card-title">
                <i className="ph-fill ph-clock-counter-clockwise"></i> Lifecycle Progress Status
              </h3>
              <div className="stepper-progress-box">
                {STEP_LABELS.slice(1).map((label, idx) => {
                  const stepNum = idx + 1;
                  const isCompleted = stepNum < currentStep;
                  const isActive = stepNum === currentStep;

                  return (
                    <div
                      key={label}
                      className={`step-node-row ${isActive ? 'active' : isCompleted ? 'completed' : ''}`}
                      onClick={() => onAdvanceStep(stepNum)}
                    >
                      <div className="step-num-icon">
                        {isCompleted ? <i className="ph-bold ph-check"></i> : stepNum}
                      </div>
                      <div style={{ flex: 1 }}>
                        <span style={{ fontSize: '0.9rem', fontWeight: 700, color: isActive ? 'var(--primary)' : isCompleted ? '#15803d' : 'var(--text-main)' }}>
                          Stage {stepNum}: {label}
                        </span>
                      </div>
                      <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)' }}>
                        {isActive ? 'Current State' : isCompleted ? 'Completed' : 'Click to Set'}
                      </span>
                    </div>
                  );
                })}
              </div>
            </section>
          </div>

          {/* Side Column */}
          <div className="side-column">
            {/* Assigned Volunteers */}
            <section className="glass-card" style={{ padding: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <h3 className="card-title" style={{ margin: 0, border: 'none', padding: 0 }}>
                  <i className="ph-fill ph-users-three"></i> Assigned Team
                </h3>
                <button
                  type="button"
                  className="btn-action save"
                  style={{ padding: '6px 14px', fontSize: '0.8rem' }}
                  onClick={() => setIsAssignModalOpen(true)}
                >
                  Assign Volunteer
                </button>
              </div>

              <div style={{ background: 'rgba(255, 255, 255, 0.6)', padding: '16px', borderRadius: '8px', border: '1px solid var(--border)' }}>
                <span style={{ fontSize: '0.72rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                  Mission Lead:
                </span>
                <h4 style={{ margin: '4px 0 0 0', fontSize: '1.05rem', fontWeight: 800, color: 'var(--text-main)' }}>
                  {leadName}
                </h4>
              </div>
            </section>

            {/* Timeline Activity Log */}
            <section className="glass-card" style={{ padding: '24px' }}>
              <h3 className="card-title">
                <i className="ph-fill ph-list-bullets"></i> Operations Timeline
              </h3>
              <div className="timeline-list">
                {Array.isArray(caseData.timeline) &&
                  caseData.timeline.map((entry, idx) => (
                    <div key={idx} className="timeline-entry">
                      <span style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--primary)' }}>{entry.time}</span>
                      <span style={{ fontSize: '0.88rem', color: '#334155', fontWeight: 500 }}>{entry.text}</span>
                    </div>
                  ))}
              </div>

              <form onSubmit={handleAddTimelineNote} style={{ marginTop: '20px', display: 'flex', gap: '8px' }}>
                <input
                  type="text"
                  className="input-glass"
                  placeholder="Add status log note..."
                  value={timelineNote}
                  onChange={(e) => setTimelineNote(e.target.value)}
                />
                <button type="submit" className="btn-action save" style={{ padding: '8px 16px', fontSize: '0.85rem' }}>
                  Post
                </button>
              </form>
            </section>
          </div>
        </div>
      </div>

      {/* Assign Volunteer Modal */}
      {isAssignModalOpen && (
        <div className="photo-selector-overlay" onClick={() => setIsAssignModalOpen(false)}>
          <div className="photo-modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header-row">
              <h3>
                <i className="ph ph-user-check"></i> Assign Volunteer
              </h3>
              <button className="modal-close-btn" onClick={() => setIsAssignModalOpen(false)}>
                <i className="ph ph-x"></i>
              </button>
            </div>
            <div className="modal-body">
              <label style={{ fontSize: '0.82rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '8px', display: 'block' }}>
                Choose On-Duty Volunteer
              </label>
              <select
                className="input-glass"
                value={selectedVolunteer}
                onChange={(e) => setSelectedVolunteer(e.target.value)}
              >
                <option value="">-- Select Volunteer --</option>
                {volunteerList.map((vol) => (
                  <option key={vol.id || vol.email || vol.name} value={vol.id || vol.email || vol.name}>
                    {vol.name} ({vol.role || 'Volunteer'}{vol.email ? ` • ${vol.email}` : ''})
                  </option>
                ))}
              </select>
            </div>
            <div className="modal-actions-row">
              <button className="btn-action cancel" onClick={() => setIsAssignModalOpen(false)}>
                Cancel
              </button>
              <button className="btn-action save" onClick={handleAssignVolunteer} disabled={!selectedVolunteer}>
                Confirm Assignment
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

export default NgoRescueManage;
