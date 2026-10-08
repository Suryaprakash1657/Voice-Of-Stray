// frontend/src/pages/Donate/hooks/useDonation.js
import { useState, useEffect, useCallback } from 'react';
import donationStorage, { CAMPAIGN_GOALS } from '../services/donationStorage.js';

export function useDonation() {
  // Current user info
  const [currentUser, setCurrentUser] = useState(donationStorage.getCurrentUser());

  // Multi-step Checkout modal state: 'closed' | 'form' | 'confirm' | 'processing' | 'success' | 'receipt'
  const [modalState, setModalState] = useState('closed');

  // Selected quick preset amount / frequency on the hero
  const [presetAmount, setPresetAmount] = useState(1000);
  const [frequency, setFrequency] = useState('Monthly'); // 'Monthly' | 'One-time'

  // Form State
  const [formData, setFormData] = useState({
    donorName: '',
    donorEmail: '',
    ngo: 'Paws Haven NGO',
    campaign: 'Emergency Medical Fund',
    amount: 1000,
    donationType: 'Monthly',
    paymentMethod: 'Credit Card (Mock)',
    anonymous: false
  });

  const [formErrors, setFormErrors] = useState({});

  // Pending donation (ready for confirmation) and completed donation (for success/receipt)
  const [pendingDonation, setPendingDonation] = useState(null);
  const [completedDonation, setCompletedDonation] = useState(null);

  // Sync user profile if login state changes
  useEffect(() => {
    const user = donationStorage.getCurrentUser();
    setCurrentUser(user);
    if (user) {
      setFormData(prev => ({
        ...prev,
        donorName: prev.donorName || user.name || user.username || '',
        donorEmail: prev.donorEmail || user.email || ''
      }));
    }
  }, []);

  // Update hero frequency / preset amount
  const handleSelectPresetAmount = (amt) => {
    setPresetAmount(amt);
    setFormData(prev => ({ ...prev, amount: amt }));
  };

  const handleSelectFrequency = (freq) => {
    setFrequency(freq);
    setFormData(prev => ({ ...prev, donationType: freq }));
  };

  // Open donation modal with prefilled campaign/amount
  const openDonationModal = useCallback((campaignName = null, customAmt = null) => {
    const user = donationStorage.getCurrentUser();
    let name = user?.name || user?.username || '';
    let email = user?.email || '';

    setFormData(prev => ({
      ...prev,
      donorName: name || prev.donorName,
      donorEmail: email || prev.donorEmail,
      campaign: campaignName || prev.campaign || 'Emergency Medical Fund',
      amount: customAmt !== null ? customAmt : (prev.amount || presetAmount || 1000),
      donationType: frequency || 'Monthly',
      anonymous: false
    }));

    setFormErrors({});
    setModalState('form');
  }, [frequency, presetAmount]);

  const closeModal = useCallback(() => {
    setModalState('closed');
    setPendingDonation(null);
    setFormErrors({});
  }, []);

  const handleFormChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    if (formErrors[field]) {
      setFormErrors(prev => ({ ...prev, [field]: null }));
    }
  };

  // Validate and proceed to Confirm Modal
  const handleFormSubmit = (e) => {
    if (e) e.preventDefault();

    const errors = {};
    if (!formData.donorName || !formData.donorName.trim()) {
      errors.donorName = 'Please enter your name.';
    }
    if (!formData.donorEmail || !formData.donorEmail.trim()) {
      errors.donorEmail = 'Please enter your email.';
    } else if (!formData.donorEmail.includes('@') || !formData.donorEmail.includes('.')) {
      errors.donorEmail = 'Please enter a valid email address.';
    }

    const numAmount = Number(formData.amount);
    if (isNaN(numAmount) || numAmount <= 0) {
      errors.amount = 'Please enter a valid donation amount greater than 0.';
    }

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    setPendingDonation({
      ...formData,
      amount: numAmount
    });
    setModalState('confirm');
  };

  // Execute simulated payment
  const executePayment = () => {
    if (!pendingDonation) return;

    setModalState('processing');

    // 2.5s simulation matching prototype MockPaymentGateway
    setTimeout(() => {
      const donation = donationStorage.createDonation(pendingDonation);
      setCompletedDonation(donation);
      setPendingDonation(null);
      setModalState('success');
    }, 2500);
  };

  const openReceipt = () => {
    setModalState('receipt');
  };

  const closeReceipt = () => {
    setModalState('success');
  };

  return {
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
  };
}

export default useDonation;
