import React from 'react';
import { useNavigate } from 'react-router-dom';
import PageContainer from '../components/ui/PageContainer.jsx';
import SectionHeader from '../components/ui/SectionHeader.jsx';
import { Button, Modal } from '../components/ui';

// Forms sub-components
import ReportForm from './Report/components/ReportForm.jsx';
import ReviewSummary from './Report/components/ReviewSummary.jsx';

// Sidebar widgets (reused from Community page)
import AlertsWidget from './Community/components/Sidebar/AlertsWidget.jsx';
import EmergencyContacts from './Community/components/Sidebar/EmergencyContacts.jsx';
import SuggestedNgos from './Community/components/Sidebar/SuggestedNgos.jsx';

// Hooks
import { useReportForm } from './Report/hooks/useReportForm.js';

export default function Report() {
  const navigate = useNavigate();
  const {
    formValues,
    isSubmitting,
    showReview,
    successInfo,
    lastSaved,
    updateField,
    handleSaveDraft,
    handleSubmitTrigger,
    confirmSubmission,
    setShowReview
  } = useReportForm();

  // Dynamic step highlights based on field completeness
  const getActiveStep = () => {
    if (!formValues.photo) return 1;
    if (!formValues.severity || !formValues.location || !formValues.animalType) return 2;
    return 3;
  };

  const activeStep = getActiveStep();

  const sidebarContent = (
    <>
      <AlertsWidget />
      <div className="sticky-wrapper">
        <EmergencyContacts />
      </div>
      <SuggestedNgos />
      
      <div className="footer-links">
        <a href="#">About</a> • <a href="#">Privacy</a> • <a href="#">Terms</a>
        <p style={{ margin: '8px 0 0 0' }}>&copy; 2026 Voice of Stray</p>
      </div>
    </>
  );

  // Render Post-Submission Success Screen
  if (successInfo) {
    return (
      <PageContainer sidebar={sidebarContent}>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh', padding: '2rem 0' }}>
          <div style={{
            maxWidth: '550px',
            width: '100%',
            padding: '3rem 2.5rem',
            borderRadius: '16px',
            background: 'var(--bg-card)',
            border: '1px solid var(--border)',
            textAlign: 'center',
            boxShadow: 'var(--shadow-lg)'
          }}>
            <div style={{ 
              display: 'inline-flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              width: '70px', 
              height: '70px', 
              borderRadius: '50%', 
              background: 'rgba(16, 185, 129, 0.1)', 
              color: '#10b981', 
              fontSize: '2.5rem', 
              marginBottom: '24px' 
            }}>
              <i className="ph-fill ph-check-circle"></i>
            </div>
            
            <h2 style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '12px' }}>
              Report Submitted Successfully!
            </h2>
            
            <div style={{ 
              background: 'var(--bg-alt)', 
              border: '1px solid var(--border)', 
              borderRadius: '8px', 
              padding: '12px 24px', 
              margin: '24px 0', 
              fontSize: '1.1rem', 
              fontWeight: 700, 
              color: 'var(--primary)', 
              display: 'inline-block' 
            }}>
              Report ID: #{successInfo.id}
            </div>

            <p style={{ color: 'var(--text-muted)', lineHeight: 1.6, fontSize: '0.95rem', marginBottom: '32px', padding: '0 10px' }}>
              Thank you! Your report for <strong>{successInfo.title}</strong> has been successfully submitted and broadcasted to local NGOs and verified nearby volunteers. They will be notified immediately.
            </p>

            <Button variant="primary" onClick={() => navigate('/')} style={{ width: '100%', padding: '12px' }}>
              Return to Homepage
            </Button>
          </div>
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer sidebar={sidebarContent}>
      <SectionHeader 
        title="Report a Stray" 
        subtitle="Help us locate and assist animals in need quickly."
      />

      {/* Step Progress Bar */}
      <div className="step-progress card">
        <div className={`step-item ${activeStep >= 1 ? 'active' : ''}`}>
          <div className="step-circle">1</div>
          <span className="step-label">Photo & Details</span>
        </div>
        <div className="step-line"></div>
        <div className={`step-item ${activeStep >= 2 ? 'active' : ''}`}>
          <div className="step-circle">2</div>
          <span className="step-label">Location & Severity</span>
        </div>
        <div className="step-line"></div>
        <div className={`step-item ${activeStep >= 3 ? 'active' : ''}`}>
          <div className="step-circle">3</div>
          <span className="step-label">Extra Info</span>
        </div>
      </div>

      {/* Main Form Fields Component */}
      <ReportForm 
        formValues={formValues}
        updateField={updateField}
        lastSaved={lastSaved}
        handleSaveDraft={handleSaveDraft}
        onSubmitTrigger={handleSubmitTrigger}
        errors={{}}
      />

      {/* Review Modal Dialog */}
      <Modal
        isOpen={showReview}
        onClose={() => setShowReview(false)}
        title="Confirm Report Details"
        footer={
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', width: '100%' }}>
            <Button variant="secondary" onClick={() => setShowReview(false)} disabled={isSubmitting}>
              Go Back & Edit
            </Button>
            <Button variant="primary" onClick={confirmSubmission} loading={isSubmitting}>
              Confirm & Submit
            </Button>
          </div>
        }
      >
        <div style={{ maxHeight: '60vh', overflowY: 'auto', paddingRight: '4px' }}>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '16px', lineHeight: 1.4 }}>
            Please review the details of your report below before broadcasting. Once submitted, nearby rescue teams will be notified.
          </p>
          <ReviewSummary formValues={formValues} />
        </div>
      </Modal>
    </PageContainer>
  );
}
