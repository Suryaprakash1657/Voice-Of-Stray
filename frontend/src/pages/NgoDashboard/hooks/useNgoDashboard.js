import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { ngoDashboardStorage } from '../services/ngoDashboardStorage.js';

export function useNgoDashboard() {
  const navigate = useNavigate();

  const [ngoInfo, setNgoInfo] = useState({
    name: 'Paws Haven NGO',
    email: 'contact@pawshaven.org',
    avatarUrl: ''
  });
  const [incomingReports, setIncomingReports] = useState([]);
  const [activeRescueCases, setActiveRescueCases] = useState([]);
  const [volunteerApplications, setVolunteerApplications] = useState([]);
  const [approvedVolunteers, setApprovedVolunteers] = useState([]);
  const [pendingAdoptions, setPendingAdoptions] = useState([]);
  const [donationsOverview, setDonationsOverview] = useState({
    todayTotal: 0,
    todayDiffPercent: 0,
    monthlyTotal: 0,
    monthlyProgress: 0,
    grandTotal: 0,
    activeDonorsCount: 0,
    recentDonations: []
  });
  const [stats, setStats] = useState({
    activeCasesCount: 0,
    availableVolunteersCount: 0,
    animalsUnderCareCount: 18,
    rescuesThisMonthCount: 15
  });
  const [loading, setLoading] = useState(true);

  const loadData = useCallback(() => {
    const current = ngoDashboardStorage.getCurrentNgo();

    // 1. Unauthenticated Guard
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    if (!isLoggedIn) {
      setLoading(false);
      navigate('/login');
      return;
    }

    // 2. Role Guard: if not NGO, redirect to user dashboard
    if (current.role !== 'ngo') {
      setLoading(false);
      navigate('/user-dashboard');
      return;
    }

    setNgoInfo({
      name: current.name,
      email: current.email,
      avatarUrl: current.avatarUrl
    });

    // 3. Load aggregated collections
    const reports = ngoDashboardStorage.getIncomingReports();
    setIncomingReports(reports);

    const cases = ngoDashboardStorage.getActiveRescueCases();
    setActiveRescueCases(cases);

    const volApps = ngoDashboardStorage.getVolunteerApplications();
    setVolunteerApplications(volApps);

    const approvedVols = ngoDashboardStorage.getApprovedVolunteers();
    setApprovedVolunteers(approvedVols);

    const adoptions = ngoDashboardStorage.getPendingAdoptions();
    setPendingAdoptions(adoptions);

    const donations = ngoDashboardStorage.getDonationsOverview();
    setDonationsOverview(donations);

    const ngoStats = ngoDashboardStorage.getNgoStats();
    const pendingVolCount = volApps.filter(a => a && (a.status === 'Pending' || a.status === 'Pending Review')).length;
    setStats({
      ...ngoStats,
      incomingReportsCount: reports.length,
      activeCasesCount: cases.length,
      volunteerAppsCount: pendingVolCount,
      volunteerApplicationsCount: pendingVolCount,
      pendingAdoptionsCount: adoptions.length
    });

    setLoading(false);
  }, [navigate]);

  useEffect(() => {
    loadData();

    const handleUpdate = () => {
      loadData();
    };

    window.addEventListener('storage', handleUpdate);
    window.addEventListener('auth-change', handleUpdate);
    window.addEventListener('voiceOfStrayCasesUpdated', handleUpdate);
    window.addEventListener('voiceOfStrayReportsUpdated', handleUpdate);

    return () => {
      window.removeEventListener('storage', handleUpdate);
      window.removeEventListener('auth-change', handleUpdate);
      window.removeEventListener('voiceOfStrayCasesUpdated', handleUpdate);
      window.removeEventListener('voiceOfStrayReportsUpdated', handleUpdate);
    };
  }, [loadData]);

  // Operations actions
  const acceptReport = (reportId) => {
    const res = ngoDashboardStorage.acceptReport(reportId, ngoInfo.name);
    loadData();
    return res;
  };

  const updateCaseStatus = (caseId, targetStep) => {
    const res = ngoDashboardStorage.updateCaseStatus(caseId, targetStep);
    loadData();
    return res;
  };

  const approveVolunteer = (appId) => {
    const res = ngoDashboardStorage.approveVolunteerApplication(appId);
    loadData();
    return res;
  };

  const rejectVolunteer = (appId) => {
    const res = ngoDashboardStorage.rejectVolunteerApplication(appId);
    loadData();
    return res;
  };

  const approveAdoption = (petName, applicantName) => {
    const res = ngoDashboardStorage.approveAdoption(petName, applicantName);
    loadData();
    return res;
  };

  const rejectAdoption = (petName, applicantName) => {
    const res = ngoDashboardStorage.rejectAdoption(petName, applicantName);
    loadData();
    return res;
  };

  return {
    ngoInfo,
    ngoUser: ngoInfo,
    incomingReports,
    activeRescueCases,
    activeCases: activeRescueCases,
    volunteerApplications,
    approvedVolunteers,
    pendingAdoptions,
    donationsOverview,
    stats,
    loading,
    acceptReport,
    handleAcceptReport: acceptReport,
    updateCaseStatus,
    handleUpdateCaseStatus: updateCaseStatus,
    approveVolunteer,
    handleApproveVolunteer: approveVolunteer,
    rejectVolunteer,
    handleRejectVolunteer: rejectVolunteer,
    approveAdoption,
    handleApproveAdoption: approveAdoption,
    rejectAdoption,
    handleRejectAdoption: rejectAdoption,
    refreshData: loadData
  };
}
