// frontend/src/pages/Donate/services/donationStorage.js

export const DONATIONS_STORAGE_KEY = 'voiceOfStrayDonations';
export const NOTIFICATIONS_STORAGE_KEY = 'voiceOfStrayNotifications';
export const USER_PROFILE_STORAGE_KEY = 'voiceOfStrayUserProfile';

export const CAMPAIGN_GOALS = {
  "Emergency Medical Fund": 150000,
  "General Fund": 200000,
  "Medical Supplies": 100000,
  "Sanctuary Maintenance": 120000
};

export const DEFAULT_DONATIONS = [
  // June 2026 donations (15 donations, total 81,000)
  { id: "DON-001", donationId: "DON-001", donor: "John Doe", donorName: "John Doe", donorEmail: "john@example.com", amount: 5000, date: "2026-06-18", purpose: "Emergency Rescue Fund", campaign: "Emergency Medical Fund", ngo: "Paws Haven NGO", status: "Completed" },
  { id: "DON-002", donationId: "DON-002", donor: "Sarah Smith", donorName: "Sarah Smith", donorEmail: "sarah@example.com", amount: 2500, date: "2026-06-17", purpose: "General Fund", campaign: "General Fund", ngo: "Stray Safe Shelter", status: "Completed" },
  { id: "DON-003", donationId: "DON-003", donor: "Mike Johnson", donorName: "Mike Johnson", donorEmail: "mike@example.com", amount: 10000, date: "2026-06-16", purpose: "Emergency Rescue Fund", campaign: "Emergency Medical Fund", ngo: "Happy Paws Sanctuary", status: "Completed" },
  { id: "DON-004", donationId: "DON-004", donor: "Arjun Mehta", donorName: "Arjun Mehta", donorEmail: "arjun@example.com", amount: 1500, date: "2026-06-15", purpose: "Medical Supplies", campaign: "Medical Supplies", ngo: "Paws Haven NGO", status: "Completed" },
  { id: "DON-005", donationId: "DON-005", donor: "Priya Sharma", donorName: "Priya Sharma", donorEmail: "priya@example.com", amount: 3500, date: "2026-06-14", purpose: "Emergency Rescue Fund", campaign: "Emergency Medical Fund", ngo: "Stray Safe Shelter", status: "Completed" },
  { id: "DON-006", donationId: "DON-006", donor: "Vikram Malhotra", donorName: "Vikram Malhotra", donorEmail: "vikram@example.com", amount: 20000, date: "2026-06-12", purpose: "Emergency Rescue Fund", campaign: "Emergency Medical Fund", ngo: "Paws Haven NGO", status: "Completed" },
  { id: "DON-007", donationId: "DON-007", donor: "Rajesh Kumar", donorName: "Rajesh Kumar", donorEmail: "rajesh@example.com", amount: 15000, date: "2026-06-10", purpose: "General Fund", campaign: "General Fund", ngo: "Happy Paws Sanctuary", status: "Completed" },
  { id: "DON-008", donationId: "DON-008", donor: "Amit Patel", donorName: "Amit Patel", donorEmail: "amit@example.com", amount: 8000, date: "2026-06-08", purpose: "Medical Supplies", campaign: "Medical Supplies", ngo: "Stray Safe Shelter", status: "Completed" },
  { id: "DON-009", donationId: "DON-009", donor: "Sneha Reddy", donorName: "Sneha Reddy", donorEmail: "sneha@example.com", amount: 4500, date: "2026-06-05", purpose: "General Fund", campaign: "General Fund", ngo: "Paws Haven NGO", status: "Completed" },
  { id: "DON-010", donationId: "DON-010", donor: "Ananya Sen", donorName: "Ananya Sen", donorEmail: "ananya@example.com", amount: 3000, date: "2026-06-04", purpose: "Medical Supplies", campaign: "Medical Supplies", ngo: "Happy Paws Sanctuary", status: "Completed" },
  { id: "DON-011", donationId: "DON-011", donor: "Karan Johar", donorName: "Karan Johar", donorEmail: "karan@example.com", amount: 2000, date: "2026-06-03", purpose: "General Fund", campaign: "General Fund", ngo: "Stray Safe Shelter", status: "Completed" },
  { id: "DON-012", donationId: "DON-012", donor: "Rohan Das", donorName: "Rohan Das", donorEmail: "rohan@example.com", amount: 1000, date: "2026-06-02", purpose: "Emergency Rescue Fund", campaign: "Emergency Medical Fund", ngo: "Paws Haven NGO", status: "Completed" },
  { id: "DON-013", donationId: "DON-013", donor: "Neha Gupta", donorName: "Neha Gupta", donorEmail: "neha@example.com", amount: 2500, date: "2026-06-02", purpose: "General Fund", campaign: "General Fund", ngo: "Happy Paws Sanctuary", status: "Completed" },
  { id: "DON-014", donationId: "DON-014", donor: "Deepak Singh", donorName: "Deepak Singh", donorEmail: "deepak@example.com", amount: 1500, date: "2026-06-01", purpose: "Medical Supplies", campaign: "Medical Supplies", ngo: "Stray Safe Shelter", status: "Completed" },
  { id: "DON-015", donationId: "DON-015", donor: "Sanjay Dutt", donorName: "Sanjay Dutt", donorEmail: "sanjay@example.com", amount: 1000, date: "2026-06-01", purpose: "General Fund", campaign: "General Fund", ngo: "Paws Haven NGO", status: "Completed" },

  // May 2026 donations (18 donations, total 1,60,000)
  { id: "DON-016", donationId: "DON-016", donor: "David Lee", donorName: "David Lee", donorEmail: "david@example.com", amount: 5000, date: "2026-05-28", purpose: "Emergency Rescue Fund", campaign: "Emergency Medical Fund", ngo: "Happy Paws Sanctuary", status: "Completed" },
  { id: "DON-017", donationId: "DON-017", donor: "Emma Watson", donorName: "Emma Watson", donorEmail: "emma@example.com", amount: 12000, date: "2026-05-26", purpose: "General Fund", campaign: "General Fund", ngo: "Paws Haven NGO", status: "Completed" },
  { id: "DON-018", donationId: "DON-018", donor: "Kavita Rao", donorName: "Kavita Rao", donorEmail: "kavita@example.com", amount: 25000, date: "2026-05-24", purpose: "General Fund", campaign: "General Fund", ngo: "Stray Safe Shelter", status: "Completed" },
  { id: "DON-019", donationId: "DON-019", donor: "Aditya Roy", donorName: "Aditya Roy", donorEmail: "aditya@example.com", amount: 18000, date: "2026-05-22", purpose: "General Fund", campaign: "General Fund", ngo: "Happy Paws Sanctuary", status: "Completed" },
  { id: "DON-020", donationId: "DON-020", donor: "Pooja Hegde", donorName: "Pooja Hegde", donorEmail: "pooja@example.com", amount: 6000, date: "2026-05-20", purpose: "Medical Supplies", campaign: "Medical Supplies", ngo: "Paws Haven NGO", status: "Completed" },
  { id: "DON-021", donationId: "DON-021", donor: "Abhishek Bachchan", donorName: "Abhishek Bachchan", donorEmail: "abhishek@example.com", amount: 14000, date: "2026-05-18", purpose: "General Fund", campaign: "General Fund", ngo: "Stray Safe Shelter", status: "Completed" },
  { id: "DON-022", donationId: "DON-022", donor: "Aishwarya Rai", donorName: "Aishwarya Rai", donorEmail: "aishwarya@example.com", amount: 9500, date: "2026-05-16", purpose: "General Fund", campaign: "General Fund", ngo: "Happy Paws Sanctuary", status: "Completed" },
  { id: "DON-023", donationId: "DON-023", donor: "Salman Khan", donorName: "Salman Khan", donorEmail: "salman@example.com", amount: 30000, date: "2026-05-14", purpose: "Emergency Rescue Fund", campaign: "Emergency Medical Fund", ngo: "Paws Haven NGO", status: "Completed" },
  { id: "DON-024", donationId: "DON-024", donor: "Katrina Kaif", donorName: "Katrina Kaif", donorEmail: "katrina@example.com", amount: 4000, date: "2026-05-12", purpose: "Medical Supplies", campaign: "Medical Supplies", ngo: "Stray Safe Shelter", status: "Completed" },
  { id: "DON-025", donationId: "DON-025", donor: "Ranbir Kapoor", donorName: "Ranbir Kapoor", donorEmail: "ranbir@example.com", amount: 7500, date: "2026-05-10", purpose: "General Fund", campaign: "General Fund", ngo: "Happy Paws Sanctuary", status: "Completed" },
  { id: "DON-026", donationId: "DON-026", donor: "Alia Bhatt", donorName: "Alia Bhatt", donorEmail: "alia@example.com", amount: 11000, date: "2026-05-08", purpose: "Emergency Rescue Fund", campaign: "Emergency Medical Fund", ngo: "Paws Haven NGO", status: "Completed" },
  { id: "DON-027", donationId: "DON-027", donor: "Varun Dhawan", donorName: "Varun Dhawan", donorEmail: "varun@example.com", amount: 3000, date: "2026-05-06", purpose: "Emergency Rescue Fund", campaign: "Emergency Medical Fund", ngo: "Stray Safe Shelter", status: "Completed" },
  { id: "DON-028", donationId: "DON-028", donor: "Shraddha Kapoor", donorName: "Shraddha Kapoor", donorEmail: "shraddha@example.com", amount: 5000, date: "2026-05-05", purpose: "General Fund", campaign: "General Fund", ngo: "Happy Paws Sanctuary", status: "Completed" },
  { id: "DON-029", donationId: "DON-029", donor: "Sidharth Malhotra", donorName: "Sidharth Malhotra", donorEmail: "sidharth@example.com", amount: 2000, date: "2026-05-04", purpose: "General Fund", campaign: "General Fund", ngo: "Paws Haven NGO", status: "Completed" },
  { id: "DON-030", donationId: "DON-030", donor: "Kiara Advani", donorName: "Kiara Advani", donorEmail: "kiara@example.com", amount: 4500, date: "2026-05-03", purpose: "General Fund", campaign: "General Fund", ngo: "Stray Safe Shelter", status: "Completed" },
  { id: "DON-031", donationId: "DON-031", donor: "Kartik Aaryan", donorName: "Kartik Aaryan", donorEmail: "kartik@example.com", amount: 1500, date: "2026-05-02", purpose: "Medical Supplies", campaign: "Medical Supplies", ngo: "Happy Paws Sanctuary", status: "Completed" },
  { id: "DON-032", donationId: "DON-032", donor: "Kriti Sanon", donorName: "Kriti Sanon", donorEmail: "kriti@example.com", amount: 2000, date: "2026-05-01", purpose: "General Fund", campaign: "General Fund", ngo: "Paws Haven NGO", status: "Completed" },
  { id: "DON-033", donationId: "DON-033", donor: "Sara Ali Khan", donorName: "Sara Ali Khan", donorEmail: "sara@example.com", amount: 1000, date: "2026-05-01", purpose: "General Fund", campaign: "General Fund", ngo: "Stray Safe Shelter", status: "Completed" }
];

class DonationStorageService {
  constructor() {
    this.storageKey = DONATIONS_STORAGE_KEY;
    this.listeners = new Set();
    this._initWindowListener();
  }

  _initWindowListener() {
    if (typeof window !== 'undefined') {
      window.addEventListener('storage', (e) => {
        if (e.key === this.storageKey || e.key === NOTIFICATIONS_STORAGE_KEY || !e.key) {
          this._notifyListeners();
        }
      });
    }
  }

  _notifyListeners() {
    this.listeners.forEach(cb => {
      try {
        cb(this.getDonations());
      } catch (err) {
        console.error('DonationStorage listener error:', err);
      }
    });
  }

  subscribe(callback) {
    this.listeners.add(callback);
    return () => {
      this.listeners.delete(callback);
    };
  }

  getCurrentUser() {
    if (typeof window === 'undefined') return null;
    try {
      const storedProfile = localStorage.getItem(USER_PROFILE_STORAGE_KEY);
      if (storedProfile) {
        const parsed = JSON.parse(storedProfile);
        if (parsed && typeof parsed === 'object') {
          return {
            name: parsed.fullName || parsed.name || localStorage.getItem('username') || '',
            email: parsed.email || localStorage.getItem('email') || '',
            username: localStorage.getItem('username') || '',
            role: parsed.role || localStorage.getItem('role') || 'User'
          };
        }
      }
      const username = localStorage.getItem('username');
      const email = localStorage.getItem('email');
      const role = localStorage.getItem('role') || 'User';
      if (username || email) {
        return {
          name: username || '',
          username: username || '',
          email: email || '',
          role: role
        };
      }
    } catch (e) {
      console.warn('Error reading current user:', e);
    }
    return null;
  }

  getDonations() {
    if (typeof window === 'undefined') return DEFAULT_DONATIONS;
    try {
      const raw = localStorage.getItem(this.storageKey);
      if (!raw) {
        localStorage.setItem(this.storageKey, JSON.stringify(DEFAULT_DONATIONS));
        return DEFAULT_DONATIONS;
      }
      const parsed = JSON.parse(raw);
      if (!Array.isArray(parsed)) {
        localStorage.setItem(this.storageKey, JSON.stringify(DEFAULT_DONATIONS));
        return DEFAULT_DONATIONS;
      }
      // Check if it's the old 7 template items
      if (parsed.length === 7 && parsed[0]?.id === "DON-001" && parsed[0]?.donor === "John Doe" && parsed[0]?.date === "2026-06-15") {
        localStorage.setItem(this.storageKey, JSON.stringify(DEFAULT_DONATIONS));
        return DEFAULT_DONATIONS;
      }
      return parsed;
    } catch (err) {
      console.error('Error reading voiceOfStrayDonations from localStorage:', err);
      localStorage.setItem(this.storageKey, JSON.stringify(DEFAULT_DONATIONS));
      return DEFAULT_DONATIONS;
    }
  }

  saveDonations(donations) {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(donations));
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('donationStorageChange', { detail: donations }));
      }
      this._notifyListeners();
    } catch (err) {
      console.error('Error saving voiceOfStrayDonations to localStorage:', err);
    }
  }

  getDonationById(id) {
    const list = this.getDonations();
    return list.find(d => d.id === id || d.donationId === id) || null;
  }

  getDonationsForCurrentUser(currentUser) {
    const all = this.getDonations();
    const user = currentUser || this.getCurrentUser();
    if (!user) return [];

    const userEmail = (user.email || '').trim().toLowerCase();
    const userName = (user.name || user.username || '').trim().toLowerCase();

    return all.filter(d => {
      const donorEmail = (d.donorEmail || '').trim().toLowerCase();
      const donorName = (d.donorName || d.donor || '').trim().toLowerCase();

      if (userEmail && donorEmail && userEmail === donorEmail) return true;
      if (userName && donorName && userName === donorName) return true;
      return false;
    });
  }

  getRecentDonations(limit = 5) {
    const all = this.getDonations();
    return all.slice(0, limit);
  }

  getCampaignProgress(campaignName = "Emergency Medical Fund") {
    const donations = this.getDonations();
    const targetPurpose = campaignName === "Emergency Medical Fund" ? "Emergency Rescue Fund" : campaignName;

    const matchingDonations = donations.filter(d => 
      (d.purpose && d.purpose.toLowerCase() === targetPurpose.toLowerCase()) || 
      (d.campaign && d.campaign.toLowerCase() === campaignName.toLowerCase()) ||
      (campaignName === "Emergency Medical Fund" && d.purpose === "Emergency Rescue Fund")
    );

    const totalRaised = matchingDonations.reduce((sum, d) => sum + (Number(d.amount) || 0), 0);
    const goal = CAMPAIGN_GOALS[campaignName] || 150000;
    const percentage = Math.min(100, Math.round((totalRaised / goal) * 100));

    return {
      campaign: campaignName,
      totalRaised,
      goal,
      percentage,
      donationCount: matchingDonations.length
    };
  }

  getDonationStats() {
    const donations = this.getDonations();
    const totalDonated = donations.reduce((sum, d) => sum + (Number(d.amount) || 0), 0);
    const donationCount = donations.length;
    
    // Unique donors count
    const uniqueDonors = new Set(donations.map(d => (d.donorEmail || d.donorName || d.donor || '').toLowerCase()).filter(Boolean));

    return {
      totalDonated,
      donationCount,
      donorCount: uniqueDonors.size || donationCount,
      campaigns: {
        emergencyMedical: this.getCampaignProgress("Emergency Medical Fund"),
        general: this.getCampaignProgress("General Fund"),
        medicalSupplies: this.getCampaignProgress("Medical Supplies"),
        sanctuary: this.getCampaignProgress("Sanctuary Maintenance")
      }
    };
  }

  createDonation(formData) {
    const donations = this.getDonations();
    const todayStr = "2026-06-18"; // standard workspace date
    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const randomNum = Math.floor(100000 + Math.random() * 900000);
    const donationId = formData.id || `DON-${randomNum}`;

    const newDonation = {
      id: donationId,
      donationId: donationId,
      donor: formData.donorName,
      donorName: formData.donorName,
      donorEmail: formData.donorEmail,
      ngo: formData.ngo || 'Paws Haven NGO',
      purpose: formData.campaign === "Emergency Medical Fund" ? "Emergency Rescue Fund" : formData.campaign,
      campaign: formData.campaign || 'Emergency Medical Fund',
      amount: Number(formData.amount),
      donationType: formData.donationType || 'One-time',
      paymentMethod: formData.paymentMethod || 'Credit Card (Mock)',
      date: formData.date || todayStr,
      time: formData.time || timeStr,
      status: "Completed",
      anonymous: Boolean(formData.anonymous),
      timestamp: Date.now()
    };

    // Prepend to donations list
    const updated = [newDonation, ...donations];
    this.saveDonations(updated);

    // Create notifications in localStorage
    try {
      let notifications = [];
      const rawNotifs = localStorage.getItem(NOTIFICATIONS_STORAGE_KEY);
      if (rawNotifs) {
        notifications = JSON.parse(rawNotifs);
        if (!Array.isArray(notifications)) notifications = [];
      }

      const notifId1 = "NOTIF-" + Math.floor(1000 + Math.random() * 9000);
      const notifId2 = "NOTIF-" + Math.floor(1000 + Math.random() * 9000);

      notifications.unshift({
        id: notifId1,
        icon: "ph-fill ph-heart",
        message: `Thank you for donating ₹${Number(newDonation.amount).toLocaleString("en-IN")}.`,
        time: "Just now",
        unread: true
      });

      notifications.unshift({
        id: notifId2,
        icon: "ph-fill ph-coins",
        message: `New donation of ₹${Number(newDonation.amount).toLocaleString("en-IN")} received for ${newDonation.campaign}.`,
        time: "Just now",
        unread: true
      });

      localStorage.setItem(NOTIFICATIONS_STORAGE_KEY, JSON.stringify(notifications));
    } catch (e) {
      console.warn('Error creating donation notification:', e);
    }

    return newDonation;
  }
}

export const donationStorage = new DonationStorageService();
export default donationStorage;
