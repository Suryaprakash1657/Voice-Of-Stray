/**
 * User Dashboard Storage Service
 * Manages user-specific data aggregation, filtering, and impact calculations.
 */

import { authStorage } from '../../Auth/services/authStorage.js';
import { getAllAdoptablePets, getSavedPetIds } from '../../Adopt/services/adoptionStorage.js';

const CASES_KEY = 'voiceOfStrayCases';
const REPORTS_KEY = 'voiceOfStrayReports';
const ADOPTIONS_KEY = 'voiceOfStrayAdoptions';
const DONATIONS_KEY = 'voiceOfStrayDonations';
const NOTIFICATIONS_KEY = 'voiceOfStrayNotifications';
const USER_PROFILE_KEY = 'voiceOfStrayUserProfile';
const VOLUNTEER_APPS_KEY = 'voiceOfStrayVolunteerApplications';
const VOLUNTEER_CACHE_KEY = 'voiceOfStrayVolunteer';

export const userDashboardStorage = {
  /**
   * Get current authenticated user session
   */
  getCurrentUser() {
    return authStorage.getCurrentUser();
  },

  /**
   * Check if user is logged in
   */
  isLoggedIn() {
    return authStorage.isLoggedIn();
  },

  /**
   * Get user profile details
   */
  getUserProfile(currentUser) {
    let profile = {
      fullName: currentUser?.name || localStorage.getItem('username') || 'Guest',
      email: currentUser?.email || localStorage.getItem('email') || '',
      accountType: 'Regular User',
      avatarUrl: localStorage.getItem('avatarUrl') || ''
    };

    try {
      const stored = localStorage.getItem(USER_PROFILE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed && typeof parsed === 'object') {
          profile = { ...profile, ...parsed };
        }
      }
    } catch (e) {
      console.warn('Error reading user profile from localStorage:', e);
    }

    return profile;
  },

  /**
   * Check if current user is an approved volunteer or rescuer
   */
  checkVolunteerStatus(currentUser, profile) {
    if (!currentUser) return false;
    if (currentUser.role === 'ngo') return false;

    // Check currentUser object
    if (currentUser.volunteer?.approved) {
      return true;
    }

    // Check accountType
    const accountType = profile?.accountType || '';
    const isVolunteerType = accountType === 'Volunteer' || accountType === 'Rescuer';

    // Check persistent volunteer applications
    try {
      const apps = JSON.parse(localStorage.getItem(VOLUNTEER_APPS_KEY) || '[]');
      const userEmail = (currentUser.email || '').toLowerCase();
      const userApp = apps.find(a => a && a.email && a.email.toLowerCase() === userEmail);
      if (userApp) {
        const approvedStatuses = ['Approved', 'Active', 'Approved Volunteer', 'Active Volunteer'];
        if (approvedStatuses.includes(userApp.status)) {
          return true;
        }
      }
    } catch (e) {}

    // Check cached volunteer meta
    try {
      const volCache = JSON.parse(localStorage.getItem(VOLUNTEER_CACHE_KEY) || '{}');
      if (volCache.status === 'Approved Volunteer' || volCache.status === 'Active') {
        return true;
      }
    } catch (e) {}

    return isVolunteerType && currentUser.volunteer?.approved === true;
  },

  /**
   * Get rescue cases associated with the current user
   */
  getUserRescueCases(currentUser) {
    if (!currentUser) return [];

    const userEmail = (currentUser.email || '').toLowerCase().trim();
    const userName = (currentUser.name || '').toLowerCase().trim();
    const userId = currentUser.id ? String(currentUser.id) : '';

    const userCases = [];

    // 1. Read from voiceOfStrayCases (database of active/past rescue cases)
    try {
      const rawCases = localStorage.getItem(CASES_KEY);
      if (rawCases) {
        const casesDb = JSON.parse(rawCases);
        if (casesDb && typeof casesDb === 'object') {
          Object.keys(casesDb).forEach(id => {
            const c = casesDb[id];
            if (!c || typeof c !== 'object') return;

            const isAssigned = (userId && String(c.assignedVolunteerId) === userId) ||
              (userEmail && c.assignedVolunteerEmail && c.assignedVolunteerEmail.toLowerCase() === userEmail) ||
              (userName && c.assignedVolunteerName && c.assignedVolunteerName.toLowerCase() === userName);

            const isReporter = c.reporter && (
              (userEmail && c.reporter.email && c.reporter.email.toLowerCase() === userEmail) ||
              (userName && c.reporter.name && c.reporter.name.toLowerCase() === userName) ||
              (userEmail && c.reporter.phone === userEmail)
            );

            if (isAssigned || isReporter) {
              userCases.push({
                id: c.id,
                caseId: c.id,
                animalType: c.animalType || 'Animal',
                breed: c.breed || c.breedDesc || 'Other / Unknown',
                condition: c.condition || c.observedCondition || `${c.animalType || 'Animal'} Rescue`,
                location: c.location || 'Location specified in report',
                status: c.status || 'Reported',
                statusStep: typeof c.statusStep === 'number' ? c.statusStep : 0,
                severity: c.severity || 'Normal',
                isAssignedVolunteer: isAssigned
              });
            }
          });
        }
      }
    } catch (e) {
      console.warn('Error reading rescue cases:', e);
    }

    // 2. Read from voiceOfStrayReports (reports submitted by users)
    try {
      const rawReports = localStorage.getItem(REPORTS_KEY);
      if (rawReports) {
        const reports = JSON.parse(rawReports);
        if (Array.isArray(reports)) {
          reports.forEach(r => {
            if (!r || typeof r !== 'object') return;
            const rEmail = (r.reporterEmail || r.email || '').toLowerCase().trim();
            const rName = (r.reporterName || r.name || '').toLowerCase().trim();
            const rUserId = r.userId ? String(r.userId) : '';

            const isMatch = (userEmail && rEmail === userEmail) ||
              (userName && rName === userName) ||
              (userId && rUserId === userId);

            // Avoid duplicate if this report is already represented in userCases
            const alreadyExists = userCases.some(c => String(c.id) === String(r.id) || (r.caseId && String(c.id) === String(r.caseId)));

            if (isMatch && !alreadyExists) {
              userCases.push({
                id: r.id || 'REP-' + Math.floor(Math.random() * 10000),
                caseId: r.id || 'REP',
                animalType: r.animalType || r.animal || 'Animal',
                breed: r.breed || 'Other / Unknown',
                condition: r.condition || r.description || 'Stray in need',
                location: r.location || r.address || 'Reported location',
                status: r.status || 'Reported',
                statusStep: 0,
                severity: r.severity || 'Normal',
                isAssignedVolunteer: false
              });
            }
          });
        }
      }
    } catch (e) {
      console.warn('Error reading reports:', e);
    }

    // Sort by ID descending (newest first)
    return userCases.sort((a, b) => String(b.id || '').localeCompare(String(a.id || '')));
  },

  /**
   * Get adoption applications for current user
   */
  getUserAdoptionRequests(currentUser) {
    if (!currentUser) return [];

    const userEmail = (currentUser.email || '').toLowerCase().trim();
    const userName = (currentUser.name || '').toLowerCase().trim();

    try {
      const raw = localStorage.getItem(ADOPTIONS_KEY);
      if (!raw) return [];
      const parsed = JSON.parse(raw);
      if (!Array.isArray(parsed)) return [];

      return parsed.filter(app => {
        if (!app || typeof app !== 'object') return false;
        const appEmail = (app.applicantEmail || '').toLowerCase().trim();
        const appName = (app.applicantName || '').toLowerCase().trim();

        if (userEmail && appEmail === userEmail) return true;
        if (userName && appName === userName) return true;
        return false;
      });
    } catch (e) {
      console.warn('Error reading adoption applications:', e);
      return [];
    }
  },

  /**
   * Get saved pets for current user
   */
  getUserSavedAnimals() {
    try {
      const savedIds = getSavedPetIds();
      if (!Array.isArray(savedIds) || savedIds.length === 0) {
        return [];
      }

      const allPets = getAllAdoptablePets();
      const savedPets = [];

      savedIds.forEach(id => {
        const cleanId = String(id).toLowerCase().trim();
        const pet = allPets.find(p =>
          String(p.id).toLowerCase() === cleanId ||
          String(p.slug || '').toLowerCase() === cleanId ||
          (p.name && p.name.toLowerCase() === cleanId)
        );
        if (pet) {
          savedPets.push(pet);
        }
      });

      return savedPets;
    } catch (e) {
      console.warn('Error reading saved animals:', e);
      return [];
    }
  },

  /**
   * Get donations made by current user
   */
  getUserDonations(currentUser) {
    if (!currentUser) return [];

    const userEmail = (currentUser.email || '').toLowerCase().trim();
    const userName = (currentUser.name || '').toLowerCase().trim();

    try {
      const raw = localStorage.getItem(DONATIONS_KEY);
      if (!raw) return [];
      const parsed = JSON.parse(raw);
      if (!Array.isArray(parsed)) return [];

      return parsed.filter(d => {
        if (!d || typeof d !== 'object') return false;
        const dEmail = (d.donorEmail || '').toLowerCase().trim();
        const dName = (d.donorName || d.donor || '').toLowerCase().trim();

        if (userEmail && dEmail === userEmail) return true;
        // Check prototype seed Arjun Mehta match
        if (userEmail === 'user@voiceofstray.com' && (dName === 'arjun mehta' || dName === 'arjun')) {
          return true;
        }
        if (userName && dName === userName) return true;
        return false;
      });
    } catch (e) {
      console.warn('Error reading donations:', e);
      return [];
    }
  },

  /**
   * Get notifications relevant to current user
   */
  getUserNotifications(currentUser, userAdoptions, userCases, userDonations) {
    if (!currentUser) return [];

    const userEmail = (currentUser.email || '').toLowerCase().trim();
    const userName = (currentUser.name || '').toLowerCase().trim();
    const userId = currentUser.id ? String(currentUser.id) : '';

    try {
      const raw = localStorage.getItem(NOTIFICATIONS_KEY);
      if (!raw) return [];
      const parsed = JSON.parse(raw);
      if (!Array.isArray(parsed)) return [];

      return parsed.filter(n => {
        if (!n || typeof n !== 'object') return false;

        // If explicitly tagged with user identity
        if (n.userId && String(n.userId) === userId) return true;
        if (n.userEmail && n.userEmail.toLowerCase() === userEmail) return true;
        if (n.recipientEmail && n.recipientEmail.toLowerCase() === userEmail) return true;

        // If message relates to user's pet adoptions
        if (userAdoptions.length > 0 && n.message) {
          const relatesToAdopt = userAdoptions.some(a => a.petName && n.message.includes(a.petName));
          if (relatesToAdopt) return true;
        }

        // If message relates to user's rescue cases
        if (userCases.length > 0 && n.message) {
          const relatesToCase = userCases.some(c => c.id && n.message.includes(String(c.id)));
          if (relatesToCase) return true;
        }

        // For default seed user Arjun Mehta, allow seed notifications that belong to Arjun's initial experience
        if (userEmail === 'user@voiceofstray.com' || userName === 'arjun') {
          // Exclude NGO-specific administration notifications
          if (n.message && (n.message.includes('New Volunteer Application') || n.message.includes('Shelter Review'))) {
            return false;
          }
          return true;
        }

        return false;
      });
    } catch (e) {
      console.warn('Error reading notifications:', e);
      return [];
    }
  },

  /**
   * Calculate impact statistics accurately for the current user
   */
  calculateImpactStats(currentUser, userCases, userAdoptions, userDonations) {
    if (!currentUser) {
      return { reports: 0, helped: 0, volunteer: 0, donations: 0 };
    }

    // Reports submitted: Cases reported by user
    const reportsCount = userCases.filter(c => !c.isAssignedVolunteer).length;

    // Volunteer activities: Cases assigned to user
    const volunteerCount = userCases.filter(c => c.isAssignedVolunteer).length;

    // Donations made
    const donationsCount = userDonations.length;

    // Animals helped: Resolved rescue cases + approved adoptions
    const resolvedRescues = userCases.filter(c => {
      const s = (c.status || '').toLowerCase();
      return s.includes('completed') || s.includes('rescued') || s.includes('adopted') || s.includes('resolved') || c.statusStep >= 4;
    }).length;

    const approvedAdoptions = userAdoptions.filter(a => a.status === 'Approved').length;

    let helpedCount = resolvedRescues + approvedAdoptions;

    // For active seed user Arjun if there's seed baseline activity
    if (currentUser.email === 'user@voiceofstray.com' || currentUser.name === 'Arjun') {
      if (reportsCount === 0 && helpedCount === 0) {
        return {
          reports: 3,
          helped: 5,
          volunteer: volunteerCount,
          donations: donationsCount
        };
      }
    }

    return {
      reports: reportsCount,
      helped: helpedCount,
      volunteer: volunteerCount,
      donations: donationsCount
    };
  }
};
