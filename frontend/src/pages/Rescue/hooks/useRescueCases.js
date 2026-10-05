import { useState, useEffect, useMemo, useCallback } from 'react';
import {
  getAllCases,
  getActiveRescueCases,
  getCaseById,
  getCurrentUser,
  getRescueStats,
  updateVolunteerStatus,
  CASES_KEY
} from '../services/rescueStorage.js';

/**
 * Custom hook for Rescue Cases data and lifecycle management
 */
export function useRescueCases(initialCaseId = null) {
  const [allCases, setAllCases] = useState(() => getAllCases());
  const [currentFilter, setCurrentFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCaseId, setSelectedCaseId] = useState(initialCaseId);
  const [currentUser, setCurrentUser] = useState(() => getCurrentUser());
  const [highlightedCaseId, setHighlightedCaseId] = useState(null);

  // Sync / reload cases
  const reloadCases = useCallback(() => {
    setAllCases(getAllCases());
    setCurrentUser(getCurrentUser());
  }, []);

  // Synchronize on mount and whenever localStorage changes (across tabs or within window)
  useEffect(() => {
    reloadCases();

    const handleStorageChange = (e) => {
      if (e.key === CASES_KEY || !e.key) {
        reloadCases();
      }
    };

    const handleCustomChange = () => {
      reloadCases();
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('voiceOfStrayCasesUpdated', handleCustomChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('voiceOfStrayCasesUpdated', handleCustomChange);
    };
  }, [reloadCases]);

  // Derived active rescue operations
  const activeCases = useMemo(() => {
    return allCases.filter((c) => {
      const isCompleted =
        c.statusStep === 9 ||
        c.status === 'Completed' ||
        c.status === 'Adopted' ||
        c.status === 'Archived' ||
        c.status === 'Rejected';
      return (c.statusStep >= 1 || (c.status && c.status !== 'Reported')) && !isCompleted;
    });
  }, [allCases]);

  // Derive statistics
  const stats = useMemo(() => {
    return getRescueStats(allCases);
  }, [allCases]);

  // Selected case details
  const selectedCase = useMemo(() => {
    if (!selectedCaseId) return null;
    return getCaseById(selectedCaseId);
  }, [selectedCaseId, allCases]);

  // Filtered cases matching currentFilter and optional search query
  const filteredCases = useMemo(() => {
    return activeCases.filter((c) => {
      const severity = (c.severity || c.priority || '').toLowerCase();
      const status = (c.status || '').toLowerCase();
      const step = c.statusStep !== undefined ? c.statusStep : 0;

      // Category matching exactly aligned with prototype data-category logic
      let matchesCategory = true;
      if (currentFilter === 'emergency') {
        matchesCategory = severity.includes('emergency') || severity.includes('critical');
      } else if (currentFilter === 'in-progress') {
        matchesCategory = step >= 1 && step < 8;
      } else if (currentFilter === 'treatment') {
        matchesCategory = step === 5 || status.includes('treatment');
      } else if (currentFilter === 'recovery') {
        matchesCategory = step === 6 || status.includes('recovery') || status.includes('ready for adoption');
      } else if (currentFilter === 'resolved') {
        matchesCategory = step >= 8 || status.includes('completed') || status.includes('resolved') || status.includes('adopted');
      }

      if (!matchesCategory) return false;

      // Optional text search matching
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        const idMatch = String(c.id).toLowerCase().includes(query) || `rsc-${c.id}`.toLowerCase().includes(query);
        const locMatch = (c.location || '').toLowerCase().includes(query);
        const animalMatch = (c.animal || '').toLowerCase().includes(query) || (c.breed || '').toLowerCase().includes(query) || (c.animalType || '').toLowerCase().includes(query);
        const ngoMatch = (c.team?.ngo || '').toLowerCase().includes(query);
        return idMatch || locMatch || animalMatch || ngoMatch;
      }

      return true;
    });
  }, [activeCases, currentFilter, searchQuery]);

  // Volunteer action dispatcher
  const handleVolunteerAction = useCallback(
    (caseId, targetStep) => {
      try {
        const updated = updateVolunteerStatus(caseId, targetStep, currentUser);
        reloadCases();
        return { success: true, case: updated };
      } catch (err) {
        return { success: false, error: err.message };
      }
    },
    [currentUser, reloadCases]
  );

  return {
    allCases,
    activeCases,
    filteredCases,
    selectedCase,
    selectedCaseId,
    setSelectedCaseId,
    stats,
    currentFilter,
    setCurrentFilter,
    searchQuery,
    setSearchQuery,
    currentUser,
    highlightedCaseId,
    setHighlightedCaseId,
    reloadCases,
    handleVolunteerAction
  };
}
