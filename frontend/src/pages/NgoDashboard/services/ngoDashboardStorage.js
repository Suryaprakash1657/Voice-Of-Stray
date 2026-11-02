/**
 * NGO Operations Dashboard Storage Service
 * Isolates data management, report acceptance, case workflow, and volunteer/adoption/donation aggregation.
 */

import { authStorage } from '../../Auth/services/authStorage.js';

const REPORTS_KEY = 'voiceOfStrayReports';
const CASES_KEY = 'voiceOfStrayCases';
const VOLUNTEER_APPS_KEY = 'voiceOfStrayVolunteerApplications';
const ADOPTIONS_KEY = 'voiceOfStrayAdoptions';
const DONATIONS_KEY = 'voiceOfStrayDonations';
const NOTIFICATIONS_KEY = 'voiceOfStrayNotifications';
const USERS_KEY = 'voiceOfStrayUsers';
const USER_PROFILE_KEY = 'voiceOfStrayUserProfile';
const VOLUNTEER_CACHE_KEY = 'voiceOfStrayVolunteer';

export const ngoDashboardStorage = {
  /**
   * Get current NGO authentication details
   */
  getCurrentNgo() {
    const user = authStorage.getCurrentUser();
    const role = localStorage.getItem('role') || user?.role;
    const name = localStorage.getItem('username') || user?.name || 'Paws Haven NGO';
    const email = localStorage.getItem('email') || user?.email || 'contact@pawshaven.org';
    const avatarUrl =
      localStorage.getItem('avatarUrl') ||
      user?.avatarUrl ||
      `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=14b8a6&color=fff&bold=true`;

    return {
      user,
      role,
      name,
      email,
      avatarUrl,
      isNgo: role === 'ngo'
    };
  },

  /**
   * Initialize default reports if empty
   */
  initDefaultReports() {
    try {
      const existing = localStorage.getItem(REPORTS_KEY);
      if (!existing || existing === '[]') {
        const defaultReports = [
          {
            id: '4902',
            animalType: 'Dog',
            breed: 'Golden Retriever Mix',
            breedDesc: 'Golden Retriever Mix',
            estimatedAge: 'Puppy / Kitten',
            issueCategory: 'Injury',
            title: 'Dog (Golden Retriever Mix) near Anna Nagar',
            location: 'Anna Nagar Area',
            reporterName: 'Anjali Sharma',
            reporterPhone: '+91 98200 12345',
            reporterEmail: 'anjali@example.com',
            dateSubmitted: '2026-06-18',
            timeSubmitted: '10:25 AM',
            priority: 'Emergency',
            observedCondition:
              'Reported with severe leg fracture. Stranded near the street corner. Needs immediate emergency pickup.',
            description:
              'Reported with severe leg fracture. Stranded near the street corner. Needs immediate emergency pickup.',
            photo: 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&q=80&w=500'
          },
          {
            id: '4903',
            animalType: 'Cat',
            breed: 'Indian Street Cat',
            breedDesc: 'Indian Street Cat',
            estimatedAge: 'Adult',
            issueCategory: 'Illness',
            title: 'Cat (Indian Street Cat) in T Nagar',
            location: 'T Nagar Market',
            reporterName: 'Rohan Sharma',
            reporterPhone: '+91 98765 43210',
            reporterEmail: 'rohan@example.com',
            dateSubmitted: '2026-06-18',
            timeSubmitted: '10:12 AM',
            priority: 'High Priority',
            observedCondition:
              'Stray cat collapsed in high heat. Volunteers have provided initial water, needs shelter transportation.',
            description:
              'Stray cat collapsed in high heat. Volunteers have provided initial water, needs shelter transportation.',
            photo: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&q=80&w=500'
          }
        ];

        let casesDb = {};
        try {
          casesDb = JSON.parse(localStorage.getItem(CASES_KEY) || '{}');
        } catch (e) {}

        const filteredReports = defaultReports.filter((rep) => {
          const activeCase = casesDb[rep.id];
          return !(activeCase && activeCase.statusStep > 0);
        });

        localStorage.setItem(REPORTS_KEY, JSON.stringify(filteredReports));
      }
    } catch (e) {
      console.warn('Error initializing reports:', e);
    }
  },

  /**
   * Get incoming rescue reports
   */
  getIncomingReports() {
    ngoDashboardStorage.initDefaultReports();
    try {
      const raw = localStorage.getItem(REPORTS_KEY);
      if (!raw) return [];
      const parsed = JSON.parse(raw);
      if (!Array.isArray(parsed)) return [];

      let casesDb = {};
      try {
        casesDb = JSON.parse(localStorage.getItem(CASES_KEY) || '{}');
      } catch (e) {}

      // Filter out reports that have already been converted into active rescue cases
      return parsed.filter((r) => {
        if (!r || !r.id) return false;
        const matchingCase = casesDb[r.id];
        return !(matchingCase && matchingCase.statusStep >= 1);
      });
    } catch (e) {
      console.warn('Error getting incoming reports:', e);
      return [];
    }
  },

  /**
   * Accept an incoming report and convert it into an Active Rescue Case
   */
  acceptReport(reportId, ngoName = 'Paws Haven NGO') {
    let casesDb = {};
    try {
      casesDb = JSON.parse(localStorage.getItem(CASES_KEY) || '{}');
    } catch (e) {
      casesDb = {};
    }

    if (casesDb[reportId] && casesDb[reportId].statusStep >= 1) {
      return { success: true, case: casesDb[reportId], alreadyAccepted: true };
    }

    const reports = ngoDashboardStorage.getIncomingReports();
    const reportIndex = reports.findIndex((r) => String(r.id) === String(reportId));
    if (reportIndex === -1) return { success: false, error: 'Report not found' };

    const report = reports[reportIndex];

    const breedVal = report.breed || report.breedDesc || 'Other / Unknown';
    const displayTitle = `${report.animalType || 'Stray'} (${breedVal})`;

    casesDb[reportId] = {
      id: String(reportId),
      animal: displayTitle,
      animalType: report.animalType || 'Animal',
      breed: breedVal,
      breedDesc: breedVal,
      estimatedAge: report.estimatedAge || 'Unknown',
      issueCategory: report.issueCategory || 'Other',
      location: report.location || 'Location provided in report',
      reportedTime: report.timeSubmitted || '10:00 AM',
      condition: report.observedCondition || report.description || 'Rescue needed',
      observedCondition: report.observedCondition || report.description || 'Rescue needed',
      severity: report.priority || 'Emergency',
      status: 'Waiting for Volunteer',
      statusStep: 1, // Step 1: NGO Accepted / Waiting for Volunteer
      reporter: {
        name: report.reporterName || 'Concerned Citizen',
        phone: report.reporterPhone || '',
        email: report.reporterEmail || '',
        notes: report.observedCondition || report.description || ''
      },
      team: {
        ngo: ngoName,
        lead: '',
        volunteers: []
      },
      timeline: [
        {
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          text: `Case accepted by ${ngoName}.`
        }
      ],
      notes: '',
      photos: {
        before:
          report.photo ||
          (String(reportId) === '4902'
            ? 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&q=80&w=300'
            : 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&q=80&w=300'),
        during: '',
        treatment: '',
        recovery: ''
      }
    };

    localStorage.setItem(CASES_KEY, JSON.stringify(casesDb));

    // Remove from incoming reports
    reports.splice(reportIndex, 1);
    localStorage.setItem(REPORTS_KEY, JSON.stringify(reports));

    // Push notification to user
    try {
      let notifications = JSON.parse(localStorage.getItem(NOTIFICATIONS_KEY) || '[]');
      notifications.unshift({
        id: 'NOTIF-' + Math.floor(1000 + Math.random() * 9000),
        icon: 'ph-fill ph-ambulance',
        message: `Your reported rescue **#RSC-${reportId}** has been accepted by **${ngoName}**!`,
        time: 'Just now',
        unread: true
      });
      localStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(notifications));
    } catch (e) {}

    ngoDashboardStorage.notifyUpdate();
    return { success: true, case: casesDb[reportId] };
  },

  /**
   * Get all active rescue cases
   */
  getActiveRescueCases() {
    try {
      const raw = localStorage.getItem(CASES_KEY);
      if (!raw) return [];
      const casesDb = JSON.parse(raw);
      if (!casesDb || typeof casesDb !== 'object') return [];

      const activeCases = [];
      Object.keys(casesDb).forEach((id) => {
        const c = casesDb[id];
        if (c && c.statusStep >= 1 && c.statusStep < 8 && c.status !== 'Completed' && c.status !== 'Archived') {
          activeCases.push(c);
        }
      });

      return activeCases.sort((a, b) => String(b.id).localeCompare(String(a.id)));
    } catch (e) {
      console.warn('Error reading active rescue cases:', e);
      return [];
    }
  },

  /**
   * Advance or update rescue case status
   */
  updateCaseStatus(caseId, targetStep = null) {
    try {
      const raw = localStorage.getItem(CASES_KEY);
      if (!raw) return { success: false, error: 'No cases found' };
      const casesDb = JSON.parse(raw);
      if (!casesDb[caseId]) return { success: false, error: 'Case not found' };

      const caseObj = casesDb[caseId];
      const nowTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

      if (!Array.isArray(caseObj.timeline)) {
        caseObj.timeline = [];
      }

      if (targetStep === 'reached_clinic') {
        caseObj.status = 'Treatment';
        caseObj.statusStep = 5;
        caseObj.timeline.unshift({
          time: nowTime,
          text: 'Animal safely reached vet clinic. Treatment started.'
        });
      } else if (targetStep === 'completed') {
        caseObj.status = 'Completed';
        caseObj.statusStep = 9;
        caseObj.timeline.unshift({
          time: nowTime,
          text: 'Rescue operation successfully completed.'
        });
      } else {
        // Next progression step
        const stepLabels = [
          'Reported',
          'Waiting for Volunteer',
          'Volunteer Assigned',
          'Volunteer En Route',
          'Animal Rescued',
          'Treatment',
          'Recovery',
          'Ready for Adoption',
          'Adopted',
          'Completed'
        ];

        if (caseObj.statusStep < 9) {
          caseObj.statusStep += 1;
          caseObj.status = stepLabels[caseObj.statusStep] || 'In Progress';
          caseObj.timeline.unshift({
            time: nowTime,
            text: `Status updated to ${caseObj.status}.`
          });
        }
      }

      localStorage.setItem(CASES_KEY, JSON.stringify(casesDb));

      // Notification
      try {
        let notifications = JSON.parse(localStorage.getItem(NOTIFICATIONS_KEY) || '[]');
        notifications.unshift({
          id: 'NOTIF-' + Math.floor(1000 + Math.random() * 9000),
          icon: 'ph-fill ph-activity',
          message: `Rescue Case **#RSC-${caseId}** status changed to **${caseObj.status}**.`,
          time: 'Just now',
          unread: true
        });
        localStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(notifications));
      } catch (e) {}

      ngoDashboardStorage.notifyUpdate();
      return { success: true, case: caseObj };
    } catch (e) {
      console.warn('Error updating case status:', e);
      return { success: false, error: e.message };
    }
  },

  /**
   * Get volunteer applications
   */
  getVolunteerApplications() {
    try {
      const raw = localStorage.getItem(VOLUNTEER_APPS_KEY);
      if (!raw) {
        const defaultApps = [
          {
            id: 'VOL-APP-MOCK',
            volunteerId: 'VOL-APP-MOCK',
            name: 'Jane Doe',
            email: 'jane@example.com',
            phone: '+91 98765 43211',
            role: 'Emergency Rescue Support',
            type: 'volunteer',
            status: 'Pending Review',
            date: '1 day ago',
            availability: 'Weekends',
            skills: ['First Aid', 'Animal Handling']
          },
          {
            id: 'VOL-APP-RAVI',
            volunteerId: 'VOL-APP-RAVI',
            name: 'Ravi',
            email: 'ravi@example.com',
            phone: '+91 98765 43212',
            role: 'Feeding Drives',
            type: 'volunteer',
            status: 'Active',
            date: '3 days ago',
            availability: 'Weekends',
            skills: ['Community Outreach'],
            approvalDate: '15 Jun 2026'
          },
          {
            id: 'VOL-APP-PRIYA',
            volunteerId: 'VOL-APP-PRIYA',
            name: 'Priya',
            email: 'priya@example.com',
            phone: '+91 98765 43213',
            role: 'Emergency Rescue',
            type: 'volunteer',
            status: 'Unavailable',
            date: '4 days ago',
            availability: 'Weekdays',
            skills: ['First Aid', 'Animal Handling'],
            approvalDate: '14 Jun 2026'
          },
          {
            id: 'VOL-APP-AKASH',
            volunteerId: 'VOL-APP-AKASH',
            name: 'Akash',
            email: 'akash@example.com',
            phone: '+91 98765 43214',
            role: 'Transport Assistance',
            type: 'volunteer',
            status: 'Inactive',
            date: '5 days ago',
            availability: 'Weekends',
            skills: ['Driving'],
            approvalDate: '13 Jun 2026'
          }
        ];
        localStorage.setItem(VOLUNTEER_APPS_KEY, JSON.stringify(defaultApps));
        return defaultApps;
      }
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : [];
    } catch (e) {
      console.warn('Error reading volunteer applications:', e);
      return [];
    }
  },

  /**
   * Get approved volunteers list
   */
  getApprovedVolunteers() {
    const apps = ngoDashboardStorage.getVolunteerApplications();
    return apps.filter(
      (a) => a.status === 'Approved' || a.status === 'Active' || a.status === 'Inactive' || a.status === 'Unavailable'
    );
  },

  /**
   * Approve a volunteer application
   */
  approveVolunteerApplication(appId) {
    const apps = ngoDashboardStorage.getVolunteerApplications();
    const app = apps.find((a) => a.id === appId);
    if (!app) return { success: false, error: 'Application not found' };

    app.status = 'Active';
    app.approvalDate = new Date().toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' });
    localStorage.setItem(VOLUNTEER_APPS_KEY, JSON.stringify(apps));

    // Sync with users collection
    try {
      const users = JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
      const targetUser = users.find(
        (u) => (u.email || '').toLowerCase() === (app.email || '').toLowerCase()
      );
      if (targetUser) {
        if (!targetUser.volunteer) targetUser.volunteer = {};
        targetUser.volunteer.approved = true;
        targetUser.volunteer.status = 'Approved';
        localStorage.setItem(USERS_KEY, JSON.stringify(users));

        const currentRaw = localStorage.getItem('currentUser');
        if (currentRaw) {
          const current = JSON.parse(currentRaw);
          if ((current.email || '').toLowerCase() === (targetUser.email || '').toLowerCase()) {
            current.volunteer = targetUser.volunteer;
            localStorage.setItem('currentUser', JSON.stringify(current));
          }
        }
      }
    } catch (e) {}

    // Push notification
    try {
      let notifications = JSON.parse(localStorage.getItem(NOTIFICATIONS_KEY) || '[]');
      notifications.unshift({
        id: 'NOTIF-' + Math.floor(1000 + Math.random() * 9000),
        icon: 'ph-fill ph-check-circle',
        message: `Congratulations **${app.name}**! Your volunteer application has been **Approved**.`,
        time: 'Just now',
        unread: true
      });
      localStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(notifications));
    } catch (e) {}

    ngoDashboardStorage.notifyUpdate();
    return { success: true, application: app };
  },

  /**
   * Reject a volunteer application
   */
  rejectVolunteerApplication(appId) {
    const apps = ngoDashboardStorage.getVolunteerApplications();
    const app = apps.find((a) => a.id === appId);
    if (!app) return { success: false, error: 'Application not found' };

    app.status = 'Rejected';
    app.rejectionDate = new Date().toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' });
    localStorage.setItem(VOLUNTEER_APPS_KEY, JSON.stringify(apps));

    try {
      let notifications = JSON.parse(localStorage.getItem(NOTIFICATIONS_KEY) || '[]');
      notifications.unshift({
        id: 'NOTIF-' + Math.floor(1000 + Math.random() * 9000),
        icon: 'ph-fill ph-x-circle',
        message: `Hello **${app.name}**, your volunteer application was not approved at this time.`,
        time: 'Just now',
        unread: true
      });
      localStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(notifications));
    } catch (e) {}

    ngoDashboardStorage.notifyUpdate();
    return { success: true, application: app };
  },

  /**
   * Get pending adoption applications
   */
  getPendingAdoptions() {
    try {
      const raw = localStorage.getItem(ADOPTIONS_KEY);
      let adoptions = [];
      if (raw) {
        adoptions = JSON.parse(raw);
      }
      if (!Array.isArray(adoptions) || adoptions.length === 0) {
        // Initialize default seed adoption request if none exists
        adoptions = [
          {
            id: 'charlie',
            petName: 'Charlie',
            breed: 'Golden Retriever Mix',
            ngoName: 'City Rescue NGO',
            ngoInitials: 'CR',
            applicantName: 'Arjun',
            applicantEmail: 'arjun@example.com',
            applicantPhone: '+91 98765 43210',
            city: 'Mumbai',
            occupation: 'Software Engineer',
            age: '28',
            ownRent: 'own',
            hasYard: 'yes',
            hasPets: 'no',
            hasKids: 'no',
            whyAdopt:
              "I fell in love with Charlie's gentle eyes. We have a spacious home with a fenced yard and plenty of time to spend with him.",
            aloneHours: '1-2 hours (work from home)',
            ownedBefore: 'Grew up with dogs, raised a Labrador for 12 years.',
            emergencies: 'Dedicated pet emergency savings fund, local 24/7 clinic is 10 mins away.',
            adjustPlan:
              'Taking 2 weeks off to help him adjust. Slow introductions and a calm, quiet routine.',
            status: 'Pending Review',
            date: '1 day ago'
          }
        ];
        localStorage.setItem(ADOPTIONS_KEY, JSON.stringify(adoptions));
      }

      return adoptions.filter(
        (a) => !a.archived && a.status !== 'Approved' && a.status !== 'Rejected' && a.status !== 'Adopted'
      );
    } catch (e) {
      console.warn('Error reading adoption applications:', e);
      return [];
    }
  },

  /**
   * Approve an adoption request
   */
  approveAdoption(petName, applicantName) {
    try {
      let adoptions = JSON.parse(localStorage.getItem(ADOPTIONS_KEY) || '[]');
      let app = adoptions.find((a) => a.petName === petName && a.applicantName === applicantName);

      if (app) {
        app.status = 'Approved';
        app.approvalDate = new Date().toLocaleDateString();
      } else {
        app = {
          id: 'APPL-' + Math.floor(1000 + Math.random() * 9000),
          petName,
          breed: 'Companion Breed',
          ngoName: 'Paws Haven NGO',
          applicantName,
          applicantEmail: 'user@voiceofstray.com',
          status: 'Approved',
          date: '1 day ago',
          approvalDate: new Date().toLocaleDateString()
        };
        adoptions.unshift(app);
      }

      localStorage.setItem(ADOPTIONS_KEY, JSON.stringify(adoptions));

      let notifications = JSON.parse(localStorage.getItem(NOTIFICATIONS_KEY) || '[]');
      notifications.unshift({
        id: 'NOTIF-' + Math.floor(1000 + Math.random() * 9000),
        icon: 'ph-fill ph-check-circle',
        message: `Congratulations! Your adoption application for **${petName}** has been **Approved** by the shelter.`,
        time: 'Just now',
        unread: true
      });
      localStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(notifications));

      ngoDashboardStorage.notifyUpdate();
      return { success: true, application: app };
    } catch (e) {
      return { success: false, error: e.message };
    }
  },

  /**
   * Reject an adoption request
   */
  rejectAdoption(petName, applicantName) {
    try {
      let adoptions = JSON.parse(localStorage.getItem(ADOPTIONS_KEY) || '[]');
      let app = adoptions.find((a) => a.petName === petName && a.applicantName === applicantName);

      if (app) {
        app.status = 'Rejected';
        app.rejectionDate = new Date().toLocaleDateString();
      } else {
        app = {
          id: 'APPL-' + Math.floor(1000 + Math.random() * 9000),
          petName,
          breed: 'Companion Breed',
          ngoName: 'Paws Haven NGO',
          applicantName,
          applicantEmail: 'user@voiceofstray.com',
          status: 'Rejected',
          date: '1 day ago',
          rejectionDate: new Date().toLocaleDateString()
        };
        adoptions.unshift(app);
      }

      localStorage.setItem(ADOPTIONS_KEY, JSON.stringify(adoptions));

      let notifications = JSON.parse(localStorage.getItem(NOTIFICATIONS_KEY) || '[]');
      notifications.unshift({
        id: 'NOTIF-' + Math.floor(1000 + Math.random() * 9000),
        icon: 'ph-fill ph-x-circle',
        message: `We regret to inform you that your application for **${petName}** was **Declined** after review.`,
        time: 'Just now',
        unread: true
      });
      localStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(notifications));

      ngoDashboardStorage.notifyUpdate();
      return { success: true, application: app };
    } catch (e) {
      return { success: false, error: e.message };
    }
  },

  /**
   * Get Donations Overview calculations
   */
  getDonationsOverview() {
    try {
      const raw = localStorage.getItem(DONATIONS_KEY);
      const donations = raw ? JSON.parse(raw) : [];

      if (!Array.isArray(donations) || donations.length === 0) {
        return {
          todayTotal: 0,
          todayDiffPercent: 0,
          monthlyTotal: 0,
          monthlyProgress: 0,
          grandTotal: 0,
          activeDonorsCount: 0,
          recentDonations: []
        };
      }

      // 1. Calculate today's contributions
      const todayDonations = donations.filter((d) => d.date === '2026-06-18');
      const todayTotal = todayDonations.reduce((sum, d) => sum + Number(d.amount || d.donationAmount || 0), 0);

      // 2. Calculate yesterday's contributions
      const yesterdayDonations = donations.filter((d) => d.date === '2026-06-17');
      const yesterdayTotal = yesterdayDonations.reduce((sum, d) => sum + Number(d.amount || d.donationAmount || 0), 0);

      let todayDiffPercent = 0;
      if (yesterdayTotal > 0) {
        todayDiffPercent = Math.round(((todayTotal - yesterdayTotal) / yesterdayTotal) * 100);
      }

      // 3. Calculate this month total (June 2026)
      const juneDonations = donations.filter((d) => (d.date || '').startsWith('2026-06'));
      const monthlyTotal = juneDonations.reduce((sum, d) => sum + Number(d.amount || d.donationAmount || 0), 0);
      const monthlyProgress = Math.min(100, Math.round((monthlyTotal / 100000) * 100));

      // 4. Calculate grand total & unique donors
      const grandTotal = donations.reduce((sum, d) => sum + Number(d.amount || d.donationAmount || 0), 0);
      const uniqueDonors = new Set(
        donations.map((d) => (d.donorEmail || d.donorName || d.donor || '').trim().toLowerCase())
      );

      // 5. Recent donations
      const sorted = [...donations].sort((a, b) => String(b.date || '').localeCompare(String(a.date || '')));
      const recentDonations = sorted.slice(0, 4);

      return {
        todayTotal,
        todayDiffPercent,
        monthlyTotal,
        monthlyProgress,
        grandTotal,
        activeDonorsCount: uniqueDonors.size,
        recentDonations
      };
    } catch (e) {
      console.warn('Error reading donations overview:', e);
      return {
        todayTotal: 0,
        todayDiffPercent: 0,
        monthlyTotal: 0,
        monthlyProgress: 0,
        grandTotal: 0,
        activeDonorsCount: 0,
        recentDonations: []
      };
    }
  },

  /**
   * Calculate NGO dashboard summary counters
   */
  getNgoStats() {
    const activeCases = ngoDashboardStorage.getActiveRescueCases();
    const approvedVolunteers = ngoDashboardStorage.getApprovedVolunteers();

    // Calculate resolved rescues count
    let resolvedCount = 15;
    try {
      const casesDb = JSON.parse(localStorage.getItem(CASES_KEY) || '{}');
      Object.keys(casesDb).forEach((id) => {
        const c = casesDb[id];
        if (c && (c.statusStep >= 8 || c.status === 'Completed' || c.status === 'Resolved')) {
          resolvedCount++;
        }
      });
    } catch (e) {}

    const incomingReports = ngoDashboardStorage.getIncomingReports();

    return {
      activeCasesCount: activeCases.length,
      availableVolunteersCount: approvedVolunteers.length,
      animalsUnderCareCount: 18,
      rescuesThisMonthCount: resolvedCount,
      resolvedCasesCount: resolvedCount,
      incomingReportsCount: incomingReports.length
    };
  },

  /**
   * Broadcast storage update event
   */
  notifyUpdate() {
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new Event('storage'));
      window.dispatchEvent(new CustomEvent('voiceOfStrayCasesUpdated'));
      window.dispatchEvent(new CustomEvent('voiceOfStrayReportsUpdated'));
    }
  }
};

export default ngoDashboardStorage;

export const {
  getCurrentNgo,
  initDefaultReports,
  getIncomingReports,
  acceptReport,
  initDefaultCases,
  getActiveRescueCases,
  updateCaseStatus,
  getVolunteerApplications,
  getApprovedVolunteers,
  approveVolunteerApplication,
  rejectVolunteerApplication,
  getPendingAdoptions,
  approveAdoption,
  rejectAdoption,
  initDefaultDonations,
  getDonationsOverview,
  getNgoStats,
  notifyUpdate
} = ngoDashboardStorage;
