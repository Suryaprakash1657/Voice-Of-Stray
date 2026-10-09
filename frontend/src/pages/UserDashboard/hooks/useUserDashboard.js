import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { userDashboardStorage } from '../services/userDashboardStorage.js';

export function useUserDashboard() {
  const navigate = useNavigate();

  const [currentUser, setCurrentUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [isVolunteerOrRescuer, setIsVolunteerOrRescuer] = useState(false);
  const [rescueCases, setRescueCases] = useState([]);
  const [adoptionRequests, setAdoptionRequests] = useState([]);
  const [savedAnimals, setSavedAnimals] = useState([]);
  const [donations, setDonations] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [stats, setStats] = useState({ reports: 0, helped: 0, volunteer: 0, donations: 0 });
  const [isNewUser, setIsNewUser] = useState(false);
  const [loading, setLoading] = useState(true);

  const loadDashboardData = useCallback(() => {
    // 1. Session Guard Check
    const isLoggedIn = userDashboardStorage.isLoggedIn();
    const user = userDashboardStorage.getCurrentUser();

    if (!isLoggedIn || !user) {
      setCurrentUser(null);
      setLoading(false);
      navigate('/login');
      return;
    }

    // NGO user redirection
    if (user.role === 'ngo') {
      window.location.href = '/ngo-dashboard.html';
      return;
    }

    setCurrentUser(user);

    // 2. Fetch Profile & Volunteer Status
    const userProfile = userDashboardStorage.getUserProfile(user);
    setProfile(userProfile);

    const isVol = userDashboardStorage.checkVolunteerStatus(user, userProfile);
    setIsVolunteerOrRescuer(isVol);

    // 3. Fetch User-Filtered Data
    const cases = userDashboardStorage.getUserRescueCases(user);
    setRescueCases(cases);

    const adoptions = userDashboardStorage.getUserAdoptionRequests(user);
    setAdoptionRequests(adoptions);

    const saved = userDashboardStorage.getUserSavedAnimals();
    setSavedAnimals(saved);

    const userDonations = userDashboardStorage.getUserDonations(user);
    setDonations(userDonations);

    const notifs = userDashboardStorage.getUserNotifications(user, adoptions, cases, userDonations);
    setNotifications(notifs);

    // 4. Calculate Stats
    const calculatedStats = userDashboardStorage.calculateImpactStats(user, cases, adoptions, userDonations);
    setStats(calculatedStats);

    // 5. Determine Overall New vs Active State
    const hasAnyActivity =
      cases.length > 0 ||
      adoptions.length > 0 ||
      userDonations.length > 0 ||
      saved.length > 0 ||
      user.email === 'user@voiceofstray.com';

    setIsNewUser(!hasAnyActivity);
    setLoading(false);
  }, [navigate]);

  useEffect(() => {
    loadDashboardData();

    // Listen to storage events & custom dispatch events across the app
    const handleUpdate = () => {
      loadDashboardData();
    };

    window.addEventListener('storage', handleUpdate);
    window.addEventListener('auth-change', handleUpdate);
    window.addEventListener('voiceOfStrayCasesUpdated', handleUpdate);
    window.addEventListener('voiceOfStrayAdoptionsUpdated', handleUpdate);
    window.addEventListener('voiceOfStraySavedPetsUpdated', handleUpdate);

    return () => {
      window.removeEventListener('storage', handleUpdate);
      window.removeEventListener('auth-change', handleUpdate);
      window.removeEventListener('voiceOfStrayCasesUpdated', handleUpdate);
      window.removeEventListener('voiceOfStrayAdoptionsUpdated', handleUpdate);
      window.removeEventListener('voiceOfStraySavedPetsUpdated', handleUpdate);
    };
  }, [loadDashboardData]);

  return {
    currentUser,
    profile,
    isVolunteerOrRescuer,
    rescueCases,
    adoptionRequests,
    savedAnimals,
    donations,
    notifications,
    stats,
    isNewUser,
    loading,
    refreshDashboard: loadDashboardData
  };
}
