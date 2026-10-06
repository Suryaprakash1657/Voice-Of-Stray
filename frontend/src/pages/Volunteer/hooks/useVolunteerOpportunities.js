import { useState, useEffect, useCallback, useMemo } from 'react';
import {
  getVolunteerOpportunities,
  getAvailableRescueOpportunities,
  acceptOpportunity,
  submitRescueVolunteerRequest
} from '../services/volunteerStorage.js';

export function useVolunteerOpportunities() {
  const [opportunities, setOpportunities] = useState([]);
  const [availableRescueCases, setAvailableRescueCases] = useState([]);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);

  const loadData = useCallback(() => {
    const opps = getVolunteerOpportunities();
    const rescueOpps = getAvailableRescueOpportunities();
    setOpportunities(opps);
    setAvailableRescueCases(rescueOpps);
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

  const filteredOpportunities = useMemo(() => {
    if (filter === 'all') return opportunities;
    return opportunities.filter(
      opp => (opp.category && opp.category.toLowerCase() === filter.toLowerCase()) ||
             (opp.tagClass && opp.tagClass.toLowerCase() === filter.toLowerCase())
    );
  }, [opportunities, filter]);

  const handleAcceptOpportunity = useCallback((oppId) => {
    const res = acceptOpportunity(oppId);
    if (res.success) {
      loadData();
    }
    return res;
  }, [loadData]);

  const handleSubmitRescueRequest = useCallback((caseId) => {
    const res = submitRescueVolunteerRequest(caseId);
    if (res.success) {
      loadData();
    }
    return res;
  }, [loadData]);

  return {
    opportunities,
    availableRescueCases,
    filter,
    setFilter,
    filteredOpportunities,
    acceptOpportunity: handleAcceptOpportunity,
    submitRescueRequest: handleSubmitRescueRequest,
    refreshOpportunities: loadData,
    loading
  };
}
