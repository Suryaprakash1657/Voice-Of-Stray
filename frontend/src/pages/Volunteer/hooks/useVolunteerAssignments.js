import { useState, useEffect, useCallback, useMemo } from 'react';
import {
  getVolunteerAssignments,
  getVolunteerHistory,
  completeAssignment,
  updateVolunteerAvailability
} from '../services/volunteerStorage.js';

export function useVolunteerAssignments() {
  const [assignments, setAssignments] = useState([]);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadData = useCallback(() => {
    const activeAssignments = getVolunteerAssignments();
    const historyData = getVolunteerHistory();
    setAssignments(activeAssignments);
    setHistory(historyData);
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

  // Derived metrics from history
  const metrics = useMemo(() => {
    let tasks = history.length;
    let hours = 0;
    let helped = 0;
    let emergencyResponses = 0;

    history.forEach(item => {
      const type = (item.type || '').toLowerCase();
      if (type.includes('rescue') || type.includes('flood') || type.includes('emergency') || type.includes('first aid')) {
        emergencyResponses += 1;
        hours += 6;
        helped += 4;
      } else if (type.includes('feeding') || type.includes('drive')) {
        hours += 4;
        helped += 3;
      } else if (type.includes('transport')) {
        hours += 4;
        helped += 1;
      } else {
        hours += 3;
        helped += 1;
      }
    });

    return {
      tasks,
      hours,
      helped,
      emergencyResponses
    };
  }, [history]);

  // Derived level progression info
  const levelInfo = useMemo(() => {
    const taskCount = history.length;
    const targetTasks = 5;
    const isCompleted = taskCount >= targetTasks;
    const percentage = isCompleted ? 100 : Math.round((taskCount / targetTasks) * 100);
    const tasksRemaining = Math.max(0, targetTasks - taskCount);

    return {
      currentLevel: isCompleted ? 'Level 2' : 'Level 1',
      levelTitle: isCompleted ? 'Active Volunteer' : 'Community Helper',
      percentage,
      tasksRemaining,
      isCompleted
    };
  }, [history]);

  // Derived badges unlocked
  const badges = useMemo(() => {
    const taskCount = history.length;
    const allBadges = [
      {
        id: 'first-rescue',
        title: 'First Rescue',
        desc: 'Awarded for completing your first successful street rescue operation.',
        icon: 'ph-fill ph-first-aid',
        req: 1
      },
      {
        id: 'first-aid',
        title: 'First Aid',
        desc: 'Certified in street emergency triage and animal resuscitation.',
        icon: 'ph-fill ph-heartbeat',
        req: 2
      },
      {
        id: 'responder',
        title: 'Responder',
        desc: 'Completed 3 or more high-priority emergency rescue missions.',
        icon: 'ph-fill ph-warning-circle',
        req: 3
      },
      {
        id: 'hero',
        title: 'Hero',
        desc: 'Recognized for contributing more than 50 verified volunteer hours.',
        icon: 'ph-fill ph-star',
        req: 5
      }
    ];

    return allBadges.map(b => ({
      ...b,
      isUnlocked: taskCount >= b.req
    }));
  }, [history]);

  const handleCompleteAssignment = useCallback((caseId) => {
    const res = completeAssignment(caseId);
    if (res.success) {
      loadData();
    }
    return res;
  }, [loadData]);

  const handleUpdateAvailability = useCallback((newAvail) => {
    const res = updateVolunteerAvailability(newAvail);
    if (res.success) {
      loadData();
    }
    return res;
  }, [loadData]);

  return {
    assignments,
    history,
    metrics,
    levelInfo,
    badges,
    completeAssignment: handleCompleteAssignment,
    updateAvailability: handleUpdateAvailability,
    refreshAssignments: loadData,
    loading
  };
}
