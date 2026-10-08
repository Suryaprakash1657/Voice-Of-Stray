// frontend/src/pages/Donate/hooks/useDonationHistory.js
import { useState, useEffect, useCallback } from 'react';
import donationStorage from '../services/donationStorage.js';

export function useDonationHistory() {
  const [donations, setDonations] = useState(() => donationStorage.getDonations());
  const [currentUser, setCurrentUser] = useState(() => donationStorage.getCurrentUser());
  const [stats, setStats] = useState(() => donationStorage.getDonationStats());
  const [recentDonations, setRecentDonations] = useState(() => donationStorage.getRecentDonations(5));

  const refresh = useCallback(() => {
    const all = donationStorage.getDonations();
    const user = donationStorage.getCurrentUser();
    setDonations(all);
    setCurrentUser(user);
    setStats(donationStorage.getDonationStats());
    setRecentDonations(donationStorage.getRecentDonations(5));
  }, []);

  useEffect(() => {
    refresh();
    const unsubscribe = donationStorage.subscribe(() => {
      refresh();
    });

    const handleCustomChange = () => refresh();
    window.addEventListener('donationStorageChange', handleCustomChange);

    return () => {
      unsubscribe();
      window.removeEventListener('donationStorageChange', handleCustomChange);
    };
  }, [refresh]);

  const userDonations = currentUser ? donationStorage.getDonationsForCurrentUser(currentUser) : [];

  return {
    donations,
    userDonations,
    recentDonations,
    stats,
    currentUser,
    refresh
  };
}

export default useDonationHistory;
