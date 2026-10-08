import React, { useState } from 'react';
import { useDonation } from './hooks/useDonation.js';
import { useDonationHistory } from './hooks/useDonationHistory.js';

import DonationHero from './components/DonationHero.jsx';
import DonationFunds from './components/DonationFunds.jsx';
import MonthlyGuardian from './components/MonthlyGuardian.jsx';
import FinancialDashboard from './components/FinancialDashboard.jsx';
import Newsletter from './components/Newsletter.jsx';
import DonationFormModal from './components/DonationFormModal.jsx';
import DonationConfirmation from './components/DonationConfirmation.jsx';
import DonationSuccess from './components/DonationSuccess.jsx';
import DonationHistory from './components/DonationHistory.jsx';

import './donate.css';

export function Donate() {
  const {
    currentUser,
    modalState,
    formData,
    formErrors,
    pendingDonation,
    completedDonation,
    presetAmount,
    frequency,
    handleSelectPresetAmount,
    handleSelectFrequency,
    handleFormChange,
    openDonationModal,
    closeModal,
    handleFormSubmit,
    executePayment,
    openReceipt,
    closeReceipt
  } = useDonation();

  const {
    recentDonations,
    userDonations,
    stats
  } = useDonationHistory();

  const [selectedReceiptDonation, setSelectedReceiptDonation] = useState(null);

  const handleViewReceiptFromHistory = (donation) => {
    setSelectedReceiptDonation(donation);
  };

  const handleCloseHistoryReceipt = () => {
    setSelectedReceiptDonation(null);
  };

  return (
    <main className="donate-main">
      {/* 1. Hero Section */}
      <DonationHero
        presetAmount={presetAmount}
        frequency={frequency}
        onSelectPresetAmount={handleSelectPresetAmount}
        onSelectFrequency={handleSelectFrequency}
        onOpenDonationModal={openDonationModal}
        recentDonations={recentDonations}
      />

      {/* 2. Urgent Campaigns */}
      <DonationFunds
        stats={stats}
        onOpenDonationModal={openDonationModal}
      />

      {/* 3. Monthly Guardian */}
      <MonthlyGuardian
        onJoinGuardian={() => openDonationModal('General Fund')}
      />

      {/* 4. Financial Dashboard */}
      <FinancialDashboard />

      {/* Optional: User Donation History (if logged in or has personal donations) */}
      {userDonations.length > 0 && (
        <section className="fade-in">
          <DonationHistory
            userDonations={userDonations}
            currentUser={currentUser}
            onViewReceipt={handleViewReceiptFromHistory}
          />
        </section>
      )}

      {/* 5. Newsletter */}
      <Newsletter />

      {/* Checkout Modal 1: Donation Input Form */}
      <DonationFormModal
        isOpen={modalState === 'form'}
        formData={formData}
        formErrors={formErrors}
        onClose={closeModal}
        onChange={handleFormChange}
        onSubmit={handleFormSubmit}
      />

      {/* Checkout Modal 2: Confirmation Summary */}
      <DonationConfirmation
        isOpen={modalState === 'confirm'}
        pendingDonation={pendingDonation}
        onCancel={closeModal}
        onConfirm={executePayment}
      />

      {/* Checkout Modal 3: Processing Loader, Success Modal, and Receipt */}
      <DonationSuccess
        modalState={modalState}
        completedDonation={completedDonation}
        onOpenReceipt={openReceipt}
        onCloseReceipt={closeReceipt}
        onCloseSuccess={closeModal}
      />

      {/* Receipt Modal triggered from History */}
      {selectedReceiptDonation && (
        <DonationSuccess
          modalState="receipt"
          completedDonation={selectedReceiptDonation}
          onOpenReceipt={() => {}}
          onCloseReceipt={handleCloseHistoryReceipt}
          onCloseSuccess={handleCloseHistoryReceipt}
        />
      )}
    </main>
  );
}

export default Donate;
