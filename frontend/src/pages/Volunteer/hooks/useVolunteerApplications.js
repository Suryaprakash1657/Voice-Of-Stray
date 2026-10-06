import { useState, useEffect, useCallback } from 'react';
import {
  getCurrentUser,
  getVolunteerApplications,
  getApplicationsForCurrentUser,
  getVolunteerStatus,
  submitVolunteerApplication,
  submitNgoPartnerApplication
} from '../services/volunteerStorage.js';

export function useVolunteerApplications() {
  const [currentUser, setCurrentUser] = useState(getCurrentUser());
  const [applications, setApplications] = useState([]);
  const [userApplication, setUserApplication] = useState(null);
  const [statusInfo, setStatusInfo] = useState({
    status: 'Not Applied',
    isApproved: false,
    isPending: false,
    isRejected: false,
    isRemoved: false,
    role: '',
    availability: 'Weekends',
    skills: [],
    applicationDate: '',
    approvalDate: null
  });
  const [loading, setLoading] = useState(true);

  const loadData = useCallback(() => {
    const user = getCurrentUser();
    const allApps = getVolunteerApplications();
    const myApp = getApplicationsForCurrentUser();
    const myStatus = getVolunteerStatus();

    setCurrentUser(user);
    setApplications(allApps);
    setUserApplication(myApp);
    setStatusInfo(myStatus);
    setLoading(false);
  }, []);

  useEffect(() => {
    loadData();

    const handleUpdate = () => {
      loadData();
    };

    window.addEventListener('storage', handleUpdate);
    window.addEventListener('voiceOfStrayVolunteerUpdate', handleUpdate);

    return () => {
      window.removeEventListener('storage', handleUpdate);
      window.removeEventListener('voiceOfStrayVolunteerUpdate', handleUpdate);
    };
  }, [loadData]);

  const applyAsVolunteer = useCallback((formData) => {
    const res = submitVolunteerApplication(formData);
    if (res.success) {
      loadData();
    }
    return res;
  }, [loadData]);

  const applyAsNgo = useCallback((formData) => {
    const res = submitNgoPartnerApplication(formData);
    if (res.success) {
      loadData();
    }
    return res;
  }, [loadData]);

  return {
    currentUser,
    applications,
    userApplication,
    volunteerStatus: statusInfo.status,
    isApproved: statusInfo.isApproved,
    isPending: statusInfo.isPending,
    isRejected: statusInfo.isRejected,
    isRemoved: statusInfo.isRemoved,
    statusInfo,
    isNgo: currentUser.role === 'ngo' || currentUser.accountType === 'NGO Partner',
    loading,
    submitApplication: applyAsVolunteer,
    submitNgoApplication: applyAsNgo,
    refreshApplications: loadData
  };
}
