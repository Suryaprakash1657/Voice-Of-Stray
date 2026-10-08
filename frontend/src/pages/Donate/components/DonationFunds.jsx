import React from 'react';
import DonationFundCard from './DonationFundCard.jsx';

export function DonationFunds({ stats, onOpenDonationModal }) {
  const emergencyStats = stats?.campaigns?.emergencyMedical || {
    totalRaised: 49000,
    goal: 150000,
    percentage: 33
  };

  return (
    <section className="urgent-campaigns fade-in">
      <div className="section-header">
        <div className="header-text">
          <h2>Urgent Campaigns</h2>
          <p>Real-time funding needs for our most critical rescue missions.</p>
        </div>
        <a
          href="#campaigns"
          className="view-all"
          onClick={(e) => {
            e.preventDefault();
            onOpenDonationModal('General Fund');
          }}
        >
          View all campaigns <i className="ph-bold ph-arrow-right"></i>
        </a>
      </div>

      <div className="campaigns-grid">
        {/* Large Card: Emergency Medical Fund */}
        <DonationFundCard
          type="large"
          title="Emergency Medical Fund"
          description="Supporting critical surgeries, vaccinations, and recovery for animals rescued from high-risk environments."
          statusText="Status: Funded 48 surgeries this month."
          percentage={emergencyStats.percentage}
          raisedAmount={emergencyStats.totalRaised}
          goalAmount={emergencyStats.goal}
          daysLeft="12 Days Left"
          badgeText="URGENT"
          buttonText="Support Medical Care"
          onButtonClick={() => onOpenDonationModal('Emergency Medical Fund')}
        />

        {/* Small Card: Milo's Journey */}
        <DonationFundCard
          type="small"
          isMilo={true}
          buttonText="Support Dogs Like Milo"
          onButtonClick={() => onOpenDonationModal('General Fund')}
        />
      </div>
    </section>
  );
}

export default DonationFunds;
