import React, { useState } from 'react';
import EmptyDonationState from './EmptyDonationState.jsx';

function getDonationRelativeTime(donation) {
  // If donation has a recent timestamp from live user submission (within last 24h)
  if (donation.timestamp && (Date.now() - donation.timestamp) < 24 * 60 * 60 * 1000) {
    const diffMs = Date.now() - donation.timestamp;
    const diffSec = Math.floor(diffMs / 1000);
    if (diffSec < 60) return "Just now";
    const diffMin = Math.floor(diffSec / 60);
    if (diffMin < 60) return `${diffMin} min${diffMin > 1 ? 's' : ''} ago`;
    const diffHr = Math.floor(diffMin / 60);
    if (diffHr < 24) return `${diffHr} hr${diffHr > 1 ? 's' : ''} ago`;
  }

  // Fallback to prototype date comparison (mocking "today" as 2026-06-18)
  const refDateStr = "2026-06-18";
  if (donation.date === refDateStr) {
    return donation.time || "Today";
  }
  if (donation.date === "2026-06-17") return "Yesterday";

  try {
    const donationDate = new Date(donation.date + "T00:00:00");
    const today = new Date(refDateStr + "T00:00:00");
    const diffTime = today - donationDate;
    const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));
    if (diffDays === 1) return "Yesterday";
    if (diffDays > 1) {
      return `${diffDays} days ago`;
    }
  } catch (e) {}

  if (donation.timestamp) {
    const diffMs = Date.now() - donation.timestamp;
    const diffDay = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    if (diffDay === 1) return "Yesterday";
    if (diffDay > 1) return `${diffDay} days ago`;
  }

  return donation.date || "Recently";
}

export function DonationHero({
  presetAmount,
  frequency,
  onSelectPresetAmount,
  onSelectFrequency,
  onOpenDonationModal,
  recentDonations = []
}) {
  const [isCustom, setIsCustom] = useState(false);
  const [customValue, setCustomValue] = useState('');

  const presetOptions = [100, 500, 1000, 5000];

  const handlePresetClick = (amt) => {
    setIsCustom(false);
    onSelectPresetAmount(amt);
  };

  const handleCustomClick = () => {
    setIsCustom(true);
    const amt = prompt("Enter custom donation amount (₹):", "2500");
    if (amt && !isNaN(Number(amt)) && Number(amt) > 0) {
      setCustomValue(amt);
      onSelectPresetAmount(Number(amt));
    }
  };

  return (
    <section className="donate-hero">
      <div className="hero-left">
        <div className="tax-badge">
          <i className="ph-fill ph-shield-check"></i> 80G Tax Exempted NGO
        </div>
        <h1 className="hero-title">
          Small acts,<br />
          <span className="highlight">Life-changing</span> impact.
        </h1>
        <p className="hero-subtitle">
          Every dollar donated to Voice of Stray goes directly to rescue operations, medical supplies, and sanctuary upkeep. Track every cent from payment to paws.
        </p>

        <div className="stats-row">
          <div className="stat-box alert">
            <h3>12</h3>
            <span>AWAITING SURGERY</span>
          </div>
          <div className="stat-box primary">
            <h3>350</h3>
            <span>MEALS NEEDED THIS WEEK</span>
          </div>
        </div>

        <div className="donation-toggle">
          <button
            type="button"
            className={`toggle-btn ${frequency === 'Monthly' ? 'active' : ''}`}
            onClick={() => onSelectFrequency('Monthly')}
          >
            Monthly
          </button>
          <button
            type="button"
            className={`toggle-btn ${frequency === 'One-time' ? 'active' : ''}`}
            onClick={() => onSelectFrequency('One-time')}
          >
            One-time
          </button>
        </div>

        <div className="quick-donation-btns">
          {presetOptions.map((amt, idx) => (
            <button
              key={amt}
              type="button"
              className={`quick-btn ${!isCustom && presetAmount === amt ? 'filled' : 'outline'} fade-in`}
              style={{ transitionDelay: `${0.1 * (idx + 1)}s` }}
              onClick={() => handlePresetClick(amt)}
            >
              ₹{amt}
            </button>
          ))}
          <button
            type="button"
            className={`quick-btn dashed ${isCustom ? 'filled' : ''} fade-in`}
            style={{ transitionDelay: '0.5s' }}
            onClick={handleCustomClick}
          >
            {isCustom && customValue ? `₹${customValue}` : 'Custom Amount'}
          </button>
        </div>

        <button
          type="button"
          className="btn-donate-now fade-in"
          style={{ transitionDelay: '0.6s' }}
          onClick={() => onOpenDonationModal()}
        >
          Donate Now <i className="ph-bold ph-arrow-right"></i>
        </button>

        <div className="trust-element fade-in" style={{ transitionDelay: '0.7s' }}>
          <i className="ph-fill ph-heart" style={{ color: 'var(--alert, #ef4444)', fontSize: '1.2rem' }}></i>
          <span>
            <strong>15,000+</strong> monthly supporters giving animals a second chance.
          </span>
        </div>
      </div>

      <div className="hero-right fade-in">
        <div style={{ position: 'relative' }} className="hero-image-wrapper">
          <div className="img-zoom-container" style={{ borderRadius: 'var(--radius-lg, 16px)', overflow: 'hidden' }}>
            <img
              src="https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&q=80&w=800"
              alt="Dog looking at camera"
              className="hero-image"
            />
          </div>
          <div className="impact-card">
            <div className="impact-icon">
              <i className="ph-bold ph-shield-check"></i>
            </div>
            <div className="impact-info">
              <strong>Impact Score: A+</strong>
              <span>Transparency certified</span>
              <div className="impact-badges">
                <span className="small-badge">TAX EXEMPT</span>
                <span className="small-badge">VERIFIED NGO</span>
              </div>
            </div>
          </div>
        </div>

        <div className="recent-donations-card">
          <h4 style={{ fontSize: '1rem', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div className="live-dot-green"></div> Recent Donations
          </h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {recentDonations.length === 0 ? (
              <EmptyDonationState description="No donations yet. Be the first to support our strays!" />
            ) : (
              recentDonations.slice(0, 5).map((d, index) => {
                const donorName = d.anonymous ? 'Anonymous' : (d.donorName || d.donor || 'Anonymous');
                const amountVal = d.amount || 0;
                const relativeTime = getDonationRelativeTime(d);
                const campaignVal = d.campaign || d.purpose || '';

                const isMedical =
                  campaignVal.toLowerCase().includes('medical') ||
                  campaignVal.toLowerCase().includes('rescue') ||
                  campaignVal.toLowerCase().includes('supplies');

                const iconClass = isMedical ? 'ph-fill ph-first-aid' : 'ph-fill ph-heart';
                const iconBg = isMedical ? '#ffedd5' : '#fef2f2';
                const iconColor = isMedical ? 'var(--primary, #f97316)' : 'var(--alert, #ef4444)';
                const campaignText = campaignVal ? ` for ${campaignVal}` : '';

                return (
                  <div key={d.id || d.donationId || index} style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '0.95rem' }}>
                    <div
                      style={{
                        width: '36px',
                        height: '36px',
                        borderRadius: '50%',
                        background: iconBg,
                        color: iconColor,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '1.1rem',
                        flexShrink: 0
                      }}
                    >
                      <i className={iconClass}></i>
                    </div>
                    <div>
                      <strong>{donorName}</strong> donated ₹{Number(amountVal).toLocaleString('en-IN')}{campaignText}
                      <span style={{ color: 'var(--text-muted, #64748b)', fontSize: '0.85rem', marginLeft: '4px' }}>
                        — {relativeTime}
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

export default DonationHero;
