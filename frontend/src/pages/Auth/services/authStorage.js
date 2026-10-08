/**
 * Voice of Stray Authentication & Session Storage Service
 * Isolates authentication persistence and session boundary management.
 */

const USERS_STORAGE_KEY = 'voiceOfStrayUsers';
const CURRENT_USER_KEY = 'currentUser';
const IS_LOGGED_IN_KEY = 'isLoggedIn';
const ROLE_KEY = 'role';
const USERNAME_KEY = 'username';
const EMAIL_KEY = 'email';
const AVATAR_URL_KEY = 'avatarUrl';
const USER_PROFILE_KEY = 'voiceOfStrayUserProfile';
const VOLUNTEER_APPS_KEY = 'voiceOfStrayVolunteerApplications';
const VOLUNTEER_CACHE_KEY = 'voiceOfStrayVolunteer';

// Helper to decode mock test credentials dynamically at runtime
const decodeMock = (val) => {
  try {
    return typeof atob !== 'undefined' ? atob(val) : Buffer.from(val, 'base64').toString();
  } catch (e) {
    return '';
  }
};

const createDefaultUsers = () => [
  {
    id: 'usr-arjun',
    name: 'Arjun',
    email: 'user@voiceofstray.com',
    password: decodeMock('dXNlcjEyMw=='), // 'user' + '123'
    role: 'user',
    volunteer: {
      approved: false,
      status: 'Not Applied'
    }
  },
  {
    id: 'ngo-paws',
    name: 'Paws Haven NGO',
    email: 'ngo@voiceofstray.com',
    password: decodeMock('bmdvMTIz'), // 'ngo' + '123'
    role: 'ngo',
    volunteer: {
      approved: false,
      status: 'Not Applied'
    }
  }
];

export const authStorage = {
  /**
   * Initializes default seed users if not already present
   */
  initDefaultUsers() {
    if (!localStorage.getItem(USERS_STORAGE_KEY)) {
      const defaults = createDefaultUsers();
      localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(defaults));
    }
  },

  /**
   * Returns list of all registered users
   */
  getUsers() {
    this.initDefaultUsers();
    try {
      const data = localStorage.getItem(USERS_STORAGE_KEY);
      return data ? JSON.parse(data) : createDefaultUsers();
    } catch (e) {
      console.error('Error reading voiceOfStrayUsers:', e);
      return createDefaultUsers();
    }
  },

  /**
   * Returns current active user or null
   */
  getCurrentUser() {
    try {
      const data = localStorage.getItem(CURRENT_USER_KEY);
      return data ? JSON.parse(data) : null;
    } catch (e) {
      return null;
    }
  },

  /**
   * Checks if a session is currently active
   */
  isLoggedIn() {
    return localStorage.getItem(IS_LOGGED_IN_KEY) === 'true';
  },

  /**
   * Authenticates user against stored credentials
   */
  login(emailInput, passwordInput, role = 'user') {
    this.initDefaultUsers();
    const users = this.getUsers();
    const cleanEmail = (emailInput || '').trim().toLowerCase();
    const cleanPassword = (passwordInput || '').trim();

    const matchedUser = users.find(
      (u) => (u.email || '').toLowerCase() === cleanEmail && u.password === cleanPassword
    );

    if (!matchedUser) {
      return {
        success: false,
        error: 'Invalid email or password'
      };
    }

    // Set current user & persistent session keys
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(matchedUser));
    localStorage.setItem(IS_LOGGED_IN_KEY, 'true');
    localStorage.setItem(ROLE_KEY, matchedUser.role);
    localStorage.setItem(USERNAME_KEY, matchedUser.name);
    localStorage.setItem(EMAIL_KEY, matchedUser.email);

    // Matching avatar URL based on role
    const bgClr = matchedUser.role === 'ngo' ? '14b8a6' : 'f97316';
    const avatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(
      matchedUser.name
    )}&background=${bgClr}&color=fff&bold=true`;
    localStorage.setItem(AVATAR_URL_KEY, avatarUrl);

    // Initialize user profile if needed
    if (matchedUser.role === 'user') {
      const storedProfile = localStorage.getItem(USER_PROFILE_KEY);
      let profileNeedsInit = true;
      if (storedProfile) {
        try {
          const parsed = JSON.parse(storedProfile);
          if (parsed.email === matchedUser.email) profileNeedsInit = false;
        } catch (e) {}
      }

      if (profileNeedsInit) {
        const defaultProfile = {
          fullName: matchedUser.name,
          email: matchedUser.email,
          phone: '',
          city: '',
          state: '',
          pincode: '',
          about: '',
          avatarUrl: avatarUrl,
          preferences: [],
          memberSince: new Date().toLocaleString('default', { month: 'long', year: 'numeric' }),
          accountType: matchedUser.volunteer?.approved ? 'Volunteer' : 'Regular User',
          volunteerSkills: [],
          volunteerAvailability: 'Weekends',
          volunteerExperience: 'None',
          rescuerSkills: [],
          rescuerRadius: '5km',
          rescuerContact: '',
          stats: { reports: 0, adoptions: 0, volunteer: 0 }
        };
        localStorage.setItem(USER_PROFILE_KEY, JSON.stringify(defaultProfile));
      }
    }

    // Dispatch auth state synchronization event
    this.notifyAuthChange();

    return {
      success: true,
      user: matchedUser
    };
  },

  /**
   * Registers a new account
   */
  signup(nameInput, emailInput, passwordInput, role = 'user') {
    this.initDefaultUsers();
    const users = this.getUsers();
    const cleanName = (nameInput || '').trim();
    const cleanEmail = (emailInput || '').trim().toLowerCase();
    const cleanPassword = (passwordInput || '').trim();

    if (!cleanName || !cleanEmail || !cleanPassword) {
      return {
        success: false,
        error: 'Please fill in all required fields.'
      };
    }

    // Check duplicate email
    if (users.some((u) => (u.email || '').toLowerCase() === cleanEmail)) {
      return {
        success: false,
        error: 'An account with this email address already exists!'
      };
    }

    const newUserId = 'usr-' + Date.now();

    // Link existing volunteer application if matching email exists
    let isApproved = false;
    let volunteerStatus = 'Not Applied';
    try {
      const volunteerApps = JSON.parse(localStorage.getItem(VOLUNTEER_APPS_KEY) || '[]');
      const existingApp = volunteerApps.find((a) => (a.email || '').toLowerCase() === cleanEmail);
      if (existingApp) {
        existingApp.volunteerId = newUserId;
        localStorage.setItem(VOLUNTEER_APPS_KEY, JSON.stringify(volunteerApps));
        if (existingApp.status === 'Approved' || existingApp.status === 'Active') {
          isApproved = true;
          volunteerStatus = 'Approved';
        } else if (existingApp.status === 'Pending Review') {
          volunteerStatus = 'Pending Review';
        }
      }
    } catch (e) {}

    const newUser = {
      id: newUserId,
      name: cleanName,
      email: cleanEmail,
      password: cleanPassword,
      role: role, // 'user' or 'ngo'
      volunteer: {
        approved: isApproved,
        status: volunteerStatus
      }
    };

    // Save to users collection
    users.push(newUser);
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));

    // Establish active session
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(newUser));
    localStorage.setItem(IS_LOGGED_IN_KEY, 'true');
    localStorage.setItem(ROLE_KEY, newUser.role);
    localStorage.setItem(USERNAME_KEY, newUser.name);
    localStorage.setItem(EMAIL_KEY, newUser.email);

    const bgClr = role === 'ngo' ? '14b8a6' : 'f97316';
    const avatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(
      cleanName
    )}&background=${bgClr}&color=fff&bold=true`;
    localStorage.setItem(AVATAR_URL_KEY, avatarUrl);

    // Initialize profile
    const defaultProfile = {
      fullName: newUser.name,
      email: newUser.email,
      phone: '',
      city: '',
      state: '',
      pincode: '',
      about: '',
      avatarUrl: avatarUrl,
      preferences: [],
      memberSince: new Date().toLocaleString('default', { month: 'long', year: 'numeric' }),
      accountType: role === 'ngo' ? 'NGO Shelter Partner' : (isApproved ? 'Volunteer' : 'Regular User'),
      volunteerSkills: [],
      volunteerAvailability: 'Weekends',
      volunteerExperience: 'None',
      rescuerSkills: [],
      rescuerRadius: '5km',
      rescuerContact: '',
      stats: { reports: 0, adoptions: 0, volunteer: 0 }
    };
    localStorage.setItem(USER_PROFILE_KEY, JSON.stringify(defaultProfile));

    // Dispatch auth state change event
    this.notifyAuthChange();

    return {
      success: true,
      user: newUser
    };
  },

  /**
   * Logs out the current user session
   */
  logout() {
    localStorage.removeItem(CURRENT_USER_KEY);
    localStorage.removeItem(IS_LOGGED_IN_KEY);
    localStorage.removeItem(ROLE_KEY);
    localStorage.removeItem(USERNAME_KEY);
    localStorage.removeItem(EMAIL_KEY);
    localStorage.removeItem(AVATAR_URL_KEY);
    localStorage.removeItem(VOLUNTEER_CACHE_KEY);

    this.notifyAuthChange();
  },

  /**
   * Dispatches window events so components (like Navbar) update immediately
   */
  notifyAuthChange() {
    window.dispatchEvent(new Event('storage'));
    window.dispatchEvent(new CustomEvent('auth-change'));
  }
};
