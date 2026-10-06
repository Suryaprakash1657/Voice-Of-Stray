import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

export function ApplicationStatus({
  status = 'Pending Review',
  isNgo = false,
  onGoToActivities,
  onApplyAgain
}) {
  const navigate = useNavigate();

  if (isNgo) {
    return (
      <div
        className="glass-card"
        style={{
          maxWidth: '600px',
          margin: '40px auto',
          padding: '40px',
          textAlign: 'center',
          background: 'rgba(255, 255, 255, 0.85)',
          borderRadius: 'var(--radius-lg, 20px)',
          border: '1px solid rgba(249, 115, 22, 0.18)',
          boxShadow: '0 10px 30px rgba(0, 0, 0, 0.05)',
          width: '100%'
        }}
      >
        <h3 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#1e293b', marginBottom: '8px' }}>
          Volunteer Management
        </h3>
        <p style={{ fontSize: '1.05rem', color: 'var(--text-muted, #64748b)', lineHeight: 1.6, marginBottom: '30px' }}>
          Your organization manages volunteers through the NGO Dashboard.
        </p>
        <a
          href="/ngo-volunteer-manage.html"
          className="btn-full blue"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            width: '100%',
            textDecoration: 'none',
            padding: '14px 24px',
            fontWeight: 700,
            borderRadius: 'var(--radius-md, 12px)',
            fontSize: '1.05rem',
            boxSizing: 'border-box'
          }}
        >
          Go To Volunteer Management <i className="ph ph-arrow-right"></i>
        </a>
      </div>
    );
  }

  const isApproved = status === 'Approved' || status === 'Active' || status === 'Approved Volunteer' || status === 'Active Volunteer';
  const isPending = status === 'Pending' || status === 'Pending Review';
  const isRejected = status === 'Rejected';
  const isRemoved = status === 'Removed' || status === 'Revoked';

  if (isApproved) {
    return (
      <div
        className="glass-card"
        style={{
          maxWidth: '600px',
          margin: '40px auto',
          padding: '40px',
          textAlign: 'center',
          background: 'rgba(255, 255, 255, 0.85)',
          borderRadius: 'var(--radius-lg, 20px)',
          border: '1px solid rgba(16, 185, 129, 0.2)',
          boxShadow: '0 10px 30px rgba(16, 185, 129, 0.08)',
          width: '100%'
        }}
      >
        <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: '#dcfce7', color: '#166534', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem', margin: '0 auto 16px' }}>
          <i className="ph-fill ph-check-circle"></i>
        </div>
        <h3 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#1e293b', marginBottom: '8px' }}>
          Volunteer Application
        </h3>
        <div style={{ margin: '16px 0 20px' }}>
          <span
            className="status-pill approved"
            style={{
              background: '#dcfce7',
              color: '#166534',
              padding: '6px 18px',
              fontSize: '0.85rem',
              fontWeight: 800,
              borderRadius: '9999px',
              textTransform: 'uppercase',
              letterSpacing: '0.5px'
            }}
          >
            Approved Volunteer
          </span>
        </div>
        <p style={{ fontSize: '1.05rem', color: 'var(--text-muted, #64748b)', lineHeight: 1.6, marginBottom: '28px' }}>
          Congratulations! Your application has been approved. You are now an active volunteer in the Voice of Stray community.
        </p>
        <button
          onClick={onGoToActivities}
          className="btn-full orange"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            width: '100%',
            padding: '14px 24px',
            fontWeight: 700,
            borderRadius: 'var(--radius-md, 12px)',
            fontSize: '1.05rem',
            border: 'none',
            cursor: 'pointer'
          }}
        >
          Go To Volunteer Activities <i className="ph ph-arrow-right"></i>
        </button>
      </div>
    );
  }

  if (isPending) {
    return (
      <div
        className="glass-card"
        style={{
          maxWidth: '600px',
          margin: '40px auto',
          padding: '40px',
          textAlign: 'center',
          background: 'rgba(255, 255, 255, 0.85)',
          borderRadius: 'var(--radius-lg, 20px)',
          border: '1px solid rgba(249, 115, 22, 0.18)',
          boxShadow: '0 10px 30px rgba(0, 0, 0, 0.05)',
          width: '100%'
        }}
      >
        <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: '#ffedd5', color: '#ea580c', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem', margin: '0 auto 16px' }}>
          <i className="ph-fill ph-hourglass"></i>
        </div>
        <h3 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#1e293b', marginBottom: '8px' }}>
          Volunteer Application
        </h3>
        <div style={{ margin: '16px 0 20px' }}>
          <span
            className="status-pill pending"
            style={{
              background: '#fef9c3',
              color: '#854d0e',
              padding: '6px 18px',
              fontSize: '0.85rem',
              fontWeight: 800,
              borderRadius: '9999px',
              textTransform: 'uppercase',
              letterSpacing: '0.5px'
            }}
          >
            Pending Review
          </span>
        </div>
        <p style={{ fontSize: '1.05rem', color: 'var(--text-muted, #64748b)', lineHeight: 1.6, marginBottom: '28px' }}>
          Your volunteer application has been submitted and is currently under review by a partner NGO.<br /><br />
          You will be notified once a decision has been made.
        </p>
        <Link
          to="/user-dashboard"
          className="btn-full orange"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            width: '100%',
            textDecoration: 'none',
            padding: '14px 24px',
            fontWeight: 700,
            borderRadius: 'var(--radius-md, 12px)',
            fontSize: '1.05rem',
            boxSizing: 'border-box'
          }}
        >
          Return to Dashboard <i className="ph ph-arrow-right"></i>
        </Link>
      </div>
    );
  }

  if (isRejected) {
    return (
      <div
        className="glass-card"
        style={{
          maxWidth: '600px',
          margin: '40px auto',
          padding: '40px',
          textAlign: 'center',
          background: 'rgba(255, 255, 255, 0.85)',
          borderRadius: 'var(--radius-lg, 20px)',
          border: '1px solid rgba(239, 68, 68, 0.2)',
          boxShadow: '0 10px 30px rgba(239, 68, 68, 0.08)',
          width: '100%'
        }}
      >
        <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: '#fee2e2', color: '#dc2626', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem', margin: '0 auto 16px' }}>
          <i className="ph-fill ph-x-circle"></i>
        </div>
        <h3 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#1e293b', marginBottom: '8px' }}>
          Volunteer Application
        </h3>
        <div style={{ margin: '16px 0 20px' }}>
          <span
            className="status-pill rejected"
            style={{
              background: '#fee2e2',
              color: '#991b1b',
              padding: '6px 18px',
              fontSize: '0.85rem',
              fontWeight: 800,
              borderRadius: '9999px',
              textTransform: 'uppercase',
              letterSpacing: '0.5px'
            }}
          >
            Rejected
          </span>
        </div>
        <p style={{ fontSize: '1.05rem', color: 'var(--text-muted, #64748b)', lineHeight: 1.6, marginBottom: '28px' }}>
          Your application was not approved at this time. You may submit a new application when ready.
        </p>
        <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', width: '100%' }}>
          <button
            onClick={onApplyAgain}
            className="btn-full orange"
            style={{
              flex: 1,
              padding: '12px 20px',
              fontWeight: 700,
              borderRadius: 'var(--radius-md, 12px)',
              fontSize: '0.95rem',
              border: 'none',
              cursor: 'pointer'
            }}
          >
            Apply Again
          </button>
          <Link
            to="/user-dashboard"
            style={{
              flex: 1,
              padding: '12px 20px',
              fontWeight: 700,
              borderRadius: 'var(--radius-md, 12px)',
              fontSize: '0.95rem',
              background: 'white',
              border: '1px solid var(--border, #e2e8f0)',
              color: 'var(--text-muted, #64748b)',
              textDecoration: 'none',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            Dashboard
          </Link>
        </div>
      </div>
    );
  }

  if (isRemoved) {
    return (
      <div
        className="glass-card"
        style={{
          maxWidth: '600px',
          margin: '40px auto',
          padding: '40px',
          textAlign: 'center',
          background: 'rgba(255, 255, 255, 0.85)',
          borderRadius: 'var(--radius-lg, 20px)',
          border: '1px solid rgba(239, 68, 68, 0.2)',
          boxShadow: '0 10px 30px rgba(239, 68, 68, 0.08)',
          width: '100%'
        }}
      >
        <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: '#fee2e2', color: '#dc2626', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem', margin: '0 auto 16px' }}>
          <i className="ph-fill ph-x-circle"></i>
        </div>
        <h3 style={{ fontSize: '1.8rem', fontWeight: 900, color: '#1e293b', marginBottom: '8px' }}>
          Volunteer Access Revoked
        </h3>
        <p style={{ fontSize: '1.05rem', color: 'var(--text-muted, #64748b)', lineHeight: 1.6, fontWeight: 600, marginBottom: '8px' }}>
          Your volunteer membership is currently inactive.
        </p>
        <p style={{ fontSize: '0.95rem', color: 'var(--text-muted, #64748b)', lineHeight: 1.6, marginBottom: '28px' }}>
          Please contact the NGO if you believe this was a mistake or submit a new application.
        </p>
        <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', width: '100%' }}>
          <button
            onClick={onApplyAgain}
            className="btn-full orange"
            style={{
              flex: 1,
              padding: '12px 20px',
              fontWeight: 700,
              borderRadius: 'var(--radius-md, 12px)',
              fontSize: '0.95rem',
              border: 'none',
              cursor: 'pointer'
            }}
          >
            Apply Again
          </button>
          <Link
            to="/user-dashboard"
            style={{
              flex: 1,
              padding: '12px 20px',
              fontWeight: 700,
              borderRadius: 'var(--radius-md, 12px)',
              fontSize: '0.95rem',
              background: 'white',
              border: '1px solid var(--border, #e2e8f0)',
              color: 'var(--text-muted, #64748b)',
              textDecoration: 'none',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            Dashboard
          </Link>
        </div>
      </div>
    );
  }

  return null;
}

export default ApplicationStatus;
