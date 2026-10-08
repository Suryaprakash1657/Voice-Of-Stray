import React from 'react';

export function DonationFundCard({
  type = 'large', // 'large' | 'small'
  title,
  description,
  image,
  statusText,
  percentage,
  raisedAmount,
  goalAmount,
  daysLeft = '12 Days Left',
  badgeText = 'URGENT',
  buttonText = 'Support Medical Care',
  onButtonClick,
  isMilo = false
}) {
  if (isMilo) {
    return (
      <div className="campaign-card small">
        <div className="spotlight-badge">IMPACT SPOTLIGHT</div>
        <h3>Milo's Journey</h3>
        <div className="before-after img-zoom-container">
          <div className="ba-image">
            <img src="https://images.unsplash.com/photo-1541364983171-a8ba01e95cfc?auto=format&fit=crop&q=80&w=300" alt="Milo Before" />
            <span className="ba-label">BEFORE</span>
          </div>
          <div className="ba-image">
            <img src="https://images.unsplash.com/photo-1583337130417-3346a1be7dee?auto=format&fit=crop&q=80&w=300" alt="Milo After" />
            <span className="ba-label">AFTER</span>
          </div>
        </div>
        <div className="progress-container" style={{ marginTop: 0, marginBottom: '16px' }}>
          <div className="progress-labels" style={{ marginBottom: '4px' }}>
            <span style={{ color: 'var(--primary, #f97316)', fontWeight: 700, fontSize: '0.95rem' }}>100% Funded</span>
            <span style={{ fontWeight: 600, color: '#10b981', fontSize: '0.8rem', background: '#dcfce7', padding: '2px 6px', borderRadius: '4px' }}>
              <i className="ph-bold ph-check"></i> Completed
            </span>
          </div>
          <div className="progress-bar" style={{ marginBottom: '8px', height: '6px', borderRadius: '3px' }}>
            <div className="progress-fill" style={{ width: '100%', borderRadius: '3px', background: '#10b981' }}></div>
          </div>
        </div>
        <p className="quote">
          "One month after his rescue, Milo is healthy, active, and looking for a home. This was made possible by donors like you."
        </p>
        <button
          type="button"
          className="btn-outline w-100"
          onClick={onButtonClick}
        >
          {buttonText || 'Support Dogs Like Milo'}
        </button>
      </div>
    );
  }

  return (
    <div className="campaign-card large">
      <div className="campaign-image-wrapper img-zoom-container">
        <img
          src={image || "https://images.unsplash.com/photo-1628009368231-7710bc311215?auto=format&fit=crop&q=80&w=600"}
          alt={title}
          className="campaign-img"
        />
        <span className="urgent-badge">{badgeText}</span>
      </div>
      <div className="campaign-content">
        <h3>{title}</h3>
        <p>{description}</p>

        {statusText && (
          <div className="funded-status">
            <i className="ph-fill ph-check-circle"></i> {statusText}
          </div>
        )}

        <div className="progress-container">
          <div className="progress-labels" style={{ marginBottom: '6px' }}>
            <span style={{ color: 'var(--primary, #f97316)', fontWeight: 800, fontSize: '1.15rem' }}>
              {percentage}% Funded
            </span>
            <span
              style={{
                fontWeight: 600,
                color: 'var(--alert, #ef4444)',
                fontSize: '0.9rem',
                background: '#fef2f2',
                padding: '4px 8px',
                borderRadius: '4px'
              }}
            >
              <i className="ph-bold ph-clock"></i> {daysLeft}
            </span>
          </div>
          <div className="progress-bar" style={{ marginBottom: '8px', height: '10px', borderRadius: '5px' }}>
            <div
              className="progress-fill"
              style={{
                width: `${Math.min(100, Math.max(0, percentage))}%`,
                borderRadius: '5px',
                background: 'linear-gradient(90deg, var(--primary, #f97316), #fb923c)'
              }}
            ></div>
          </div>
          <div className="progress-labels">
            <span style={{ fontSize: '0.9rem', color: 'var(--text-muted, #64748b)' }}>
              <strong>₹{Number(raisedAmount || 0).toLocaleString('en-IN')}</strong> raised
            </span>
            <span style={{ fontSize: '0.9rem', color: 'var(--text-muted, #64748b)' }}>
              <strong>₹{Number(goalAmount || 150000).toLocaleString('en-IN')}</strong> goal
            </span>
          </div>
        </div>

        <button
          type="button"
          className="btn-primary w-100"
          style={{
            backgroundColor: '#9a3412',
            color: 'white',
            border: 'none',
            borderRadius: 'var(--radius-md, 12px)',
            fontWeight: 600,
            cursor: 'pointer',
            transition: 'background 0.2s',
            padding: '14px'
          }}
          onClick={onButtonClick}
        >
          {buttonText}
        </button>
      </div>
    </div>
  );
}

export default DonationFundCard;
