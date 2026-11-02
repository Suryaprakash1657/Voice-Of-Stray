import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams, useParams } from 'react-router-dom';
import { useNgoDashboard } from '../NgoDashboard/hooks/useNgoDashboard.js';
import NgoSidebar from '../NgoDashboard/components/NgoSidebar.jsx';
import { ngoDashboardStorage } from '../NgoDashboard/services/ngoDashboardStorage.js';
import './ngo-report-review.css';

export function NgoReportReview() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { reportId: paramId } = useParams();
  const queryId = searchParams.get('id') || searchParams.get('case');
  const targetId = paramId || queryId || '4902';

  const { ngoUser, stats, handleAcceptReport } = useNgoDashboard();
  const [report, setReport] = useState(null);

  useEffect(() => {
    document.title = `Review Report #RSC-${targetId} - Voice of Stray`;

    const reports = ngoDashboardStorage.getIncomingReports();
    const found = reports.find((r) => String(r.id) === String(targetId));

    if (found) {
      setReport(found);
    } else {
      // Fallback default sample report if accessed directly
      setReport({
        id: targetId,
        animalType: 'Dog',
        breed: 'Golden Retriever Mix',
        estimatedAge: 'Puppy / Kitten',
        issueCategory: 'Injury',
        location: 'Anna Nagar Area',
        reporterName: 'Anjali Sharma',
        reporterPhone: '+91 98200 12345',
        reporterEmail: 'anjali@example.com',
        timeSubmitted: '10:25 AM',
        priority: 'Emergency',
        observedCondition: 'Reported with severe leg fracture. Stranded near the street corner. Needs immediate emergency pickup.',
        photo: 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&q=80&w=600'
      });
    }
  }, [targetId]);

  if (!report) return null;

  const onAccept = () => {
    handleAcceptReport(report.id);
    navigate(`/ngo-rescue-manage?case=${report.id}`);
  };

  const onDismiss = () => {
    if (window.confirm(`Dismiss report #${report.id}?`)) {
      try {
        const raw = localStorage.getItem('voiceOfStrayReports');
        if (raw) {
          const reports = JSON.parse(raw);
          const filtered = reports.filter((r) => String(r.id) !== String(report.id));
          localStorage.setItem('voiceOfStrayReports', JSON.stringify(filtered));
          window.dispatchEvent(new Event('storage'));
          window.dispatchEvent(new CustomEvent('voiceOfStrayReportsUpdated'));
        }
      } catch (e) {}
      navigate('/ngo-reports-manage');
    }
  };

  return (
    <div className="ngo-review-page-wrapper">
      <div className="ops-container">
        {/* Sidebar */}
        <NgoSidebar ngoUser={ngoUser} stats={stats} />

        {/* Main Panel */}
        <main className="ops-main-panel">
          <div>
            <Link to="/ngo-reports-manage" className="back-link" style={{ marginBottom: '16px' }}>
              <i className="ph ph-arrow-left"></i> Back to Incoming Reports
            </Link>
          </div>

          <section className="glass-card">
            <div className="review-card-layout">
              {/* Photo & Priority */}
              <div>
                <div className="review-photo-holder">
                  <img
                    src={report.photo || 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&q=80&w=600'}
                    alt={report.animalType}
                  />
                  <span
                    className={`review-badge-float ${
                      report.priority === 'Emergency' ? 'badge-emergency' : 'badge-high'
                    }`}
                  >
                    {report.priority || 'Emergency'}
                  </span>
                </div>
              </div>

              {/* Details & Actions */}
              <div className="review-details-col">
                <div>
                  <span style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--primary)', textTransform: 'uppercase' }}>
                    Incident Report #{report.id}
                  </span>
                  <h2 className="review-header-title">
                    {report.animalType} ({report.breed || report.breedDesc || 'Other / Unknown'})
                  </h2>
                  <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                    Reported {report.timeSubmitted || 'Just now'}
                  </span>
                </div>

                <div className="detail-row">
                  <span className="detail-label">Location</span>
                  <span className="detail-value">
                    <i className="ph-fill ph-map-pin" style={{ color: 'var(--primary)', marginRight: '6px' }}></i>
                    {report.location}
                  </span>
                </div>

                <div className="detail-row">
                  <span className="detail-label">Reported Condition / Medical Notes</span>
                  <p style={{ margin: 0, fontSize: '0.92rem', color: '#334155', lineHeight: 1.5 }}>
                    {report.observedCondition || report.description || 'Stray animal in distress, assistance requested.'}
                  </p>
                </div>

                <div className="detail-row">
                  <span className="detail-label">Reporter Details</span>
                  <span className="detail-value">
                    <strong>{report.reporterName || 'Concerned Citizen'}</strong> &bull; {report.reporterPhone || 'No phone provided'}
                  </span>
                </div>

                <div style={{ display: 'flex', gap: '12px', marginTop: 'auto', paddingTop: '16px', borderTop: '1px solid var(--border)' }}>
                  <button
                    type="button"
                    className="btn-action cancel"
                    style={{ flex: 1 }}
                    onClick={onDismiss}
                  >
                    Dismiss Report
                  </button>
                  <button
                    type="button"
                    className="btn-action save"
                    style={{ flex: 1.5 }}
                    onClick={onAccept}
                  >
                    Accept & Create Case
                  </button>
                </div>
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}

export default NgoReportReview;
