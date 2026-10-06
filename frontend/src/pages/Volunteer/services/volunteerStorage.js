// volunteerStorage.js
// Storage Service for Voice of Stray Volunteer Module
// Manages localStorage keys: voiceOfStrayVolunteerApplications, voiceOfStrayOpportunities,
// voiceOfStrayHistory, voiceOfStrayVolunteer, voiceOfStrayCases, currentUser, voiceOfStrayUserProfile, voiceOfStrayNotifications

export const VOLUNTEER_APPS_KEY = "voiceOfStrayVolunteerApplications";
export const OPPORTUNITIES_KEY = "voiceOfStrayOpportunities";
export const HISTORY_KEY = "voiceOfStrayHistory";
export const VOLUNTEER_META_KEY = "voiceOfStrayVolunteer";
export const CASES_KEY = "voiceOfStrayCases";
export const USERS_KEY = "voiceOfStrayUsers";
export const CURRENT_USER_KEY = "currentUser";
export const USER_PROFILE_KEY = "voiceOfStrayUserProfile";
export const NOTIFICATIONS_KEY = "voiceOfStrayNotifications";

export const DEFAULT_OPPORTUNITIES = [
  {
    id: "opp-1",
    tag: "Feeding Drive",
    tagClass: "feeding",
    category: "feeding",
    title: "Weekend community feed",
    time: "Saturday, 8:00 AM",
    location: "Central Park South",
    ngo: "Voice of Stray",
    volunteersNeeded: "12 / 20 Volunteers",
    description: "Help distribute weekly food packs and fresh water to street dog colonies. Volunteers will form teams of three to cover scheduled grids."
  },
  {
    id: "opp-2",
    tag: "Emergency Rescue",
    tagClass: "rescue",
    category: "rescue",
    title: "Dog stuck in drain",
    time: "Now (Urgent)",
    location: "5th Avenue, Brooklyn",
    ngo: "Paws Rescue NYC",
    volunteersNeeded: "1 / 3 Volunteers",
    urgent: true,
    description: "A stray dog has been trapped in a narrow drainage culvert. Needs gentle extraction and transport to emergency triage."
  },
  {
    id: "opp-3",
    tag: "Foster Needed",
    tagClass: "foster",
    category: "foster",
    title: "Kitten litter recovery",
    time: "Next 4 weeks",
    location: "Bronx Shelter",
    ngo: "Feline Friends",
    volunteersNeeded: "0 / 1 Fosters",
    description: "Five recovering kittens need temporary foster housing while recovering. Food and medical packages are fully sponsored."
  }
];

export const DEFAULT_HISTORY = [
  { date: "May 18, 2026", type: "Flood Rescue Support", outcome: "Completed" },
  { date: "May 02, 2026", type: "Community Feeding Drive", outcome: "Completed" },
  { date: "Apr 15, 2026", type: "Transport Assistance", outcome: "Completed" }
];

export const DEFAULT_APPLICATIONS = [
  {
    id: "VOL-APP-MOCK",
    volunteerId: "VOL-APP-MOCK",
    name: "Arjun",
    email: "user@voiceofstray.com",
    phone: "+91 98765 43211",
    role: "Emergency Rescue Support",
    type: "volunteer",
    status: "Pending Review",
    date: "1 day ago",
    availability: "Weekends",
    skills: ["First Aid", "Animal Handling"],
    housing: "",
    pets: ""
  },
  {
    id: "VOL-APP-RAVI",
    volunteerId: "VOL-APP-RAVI",
    name: "Ravi",
    email: "ravi@example.com",
    phone: "+91 98765 43212",
    role: "Feeding Drives",
    type: "volunteer",
    status: "Active",
    date: "3 days ago",
    availability: "Weekends",
    skills: ["Community Outreach"],
    approvalDate: "15 Jun 2026"
  },
  {
    id: "VOL-APP-PRIYA",
    volunteerId: "VOL-APP-PRIYA",
    name: "Priya",
    email: "priya@example.com",
    phone: "+91 98765 43213",
    role: "Emergency Rescue",
    type: "volunteer",
    status: "Unavailable",
    date: "4 days ago",
    availability: "Weekdays",
    skills: ["First Aid", "Animal Handling"],
    approvalDate: "14 Jun 2026"
  },
  {
    id: "VOL-APP-AKASH",
    volunteerId: "VOL-APP-AKASH",
    name: "Akash",
    email: "akash@example.com",
    phone: "+91 98765 43214",
    role: "Transport Assistance",
    type: "volunteer",
    status: "Inactive",
    date: "5 days ago",
    availability: "Weekends",
    skills: ["Driving"],
    approvalDate: "13 Jun 2026"
  }
];

function notifyStorageChange() {
  window.dispatchEvent(new Event("storage"));
  window.dispatchEvent(new CustomEvent("voiceOfStrayVolunteerUpdate"));
}

// --------------------------------------------------------
// USER & SESSION HELPERS
// --------------------------------------------------------

export function getCurrentUser() {
  try {
    const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
    const username = localStorage.getItem("username") || "Arjun";
    const email = localStorage.getItem("email") || (isLoggedIn ? "user@voiceofstray.com" : "");
    const role = localStorage.getItem("role") || "user";
    const avatarUrl = localStorage.getItem("avatarUrl") || `https://ui-avatars.com/api/?name=${encodeURIComponent(username)}&background=f97316&color=fff&bold=true`;

    let profile = {};
    const storedProfile = localStorage.getItem(USER_PROFILE_KEY);
    if (storedProfile) {
      try {
        profile = JSON.parse(storedProfile);
      } catch (e) {}
    }

    const accountType = profile.accountType || (role === "ngo" ? "NGO Partner" : "Regular User");

    return {
      isLoggedIn,
      username,
      name: profile.fullName || username,
      email,
      phone: profile.phone || "",
      role,
      avatarUrl: profile.avatarUrl || avatarUrl,
      accountType,
      volunteerAvailability: profile.volunteerAvailability || "Weekends",
      volunteerSkills: profile.volunteerSkills || ["First Aid"]
    };
  } catch (e) {
    console.error("[volunteerStorage] Error getting current user:", e);
    return {
      isLoggedIn: false,
      username: "Guest",
      name: "Guest",
      email: "",
      phone: "",
      role: "user",
      avatarUrl: "",
      accountType: "Regular User",
      volunteerAvailability: "Weekends",
      volunteerSkills: []
    };
  }
}

// --------------------------------------------------------
// VOLUNTEER APPLICATIONS
// --------------------------------------------------------

export function getVolunteerApplications() {
  try {
    const stored = localStorage.getItem(VOLUNTEER_APPS_KEY);
    if (!stored) {
      localStorage.setItem(VOLUNTEER_APPS_KEY, JSON.stringify(DEFAULT_APPLICATIONS));
      return DEFAULT_APPLICATIONS;
    }
    const parsed = JSON.parse(stored);
    return Array.isArray(parsed) ? parsed : DEFAULT_APPLICATIONS;
  } catch (e) {
    console.error("[volunteerStorage] Error reading volunteer applications:", e);
    return DEFAULT_APPLICATIONS;
  }
}

export function saveVolunteerApplications(applications) {
  try {
    localStorage.setItem(VOLUNTEER_APPS_KEY, JSON.stringify(applications || []));
    notifyStorageChange();
  } catch (e) {
    console.error("[volunteerStorage] Error saving volunteer applications:", e);
  }
}

export function getApplicationsForCurrentUser() {
  const user = getCurrentUser();
  if (!user.isLoggedIn || !user.email) return null;

  const applications = getVolunteerApplications();
  return applications.find(
    app =>
      (app.email && app.email.toLowerCase() === user.email.toLowerCase()) ||
      (user.username === "Arjun" && app.id === "VOL-APP-MOCK") ||
      (app.name && user.name && app.name.toLowerCase() === user.name.toLowerCase())
  ) || null;
}

export function getVolunteerStatus() {
  const user = getCurrentUser();
  if (!user.isLoggedIn) return { status: "Not Applied", isApproved: false, isPending: false, isRejected: false, isRemoved: false };

  // 1. Prioritize active record in voiceOfStrayVolunteerApplications
  const userApp = getApplicationsForCurrentUser();
  let status = "Not Applied";

  if (userApp && userApp.status) {
    status = userApp.status;
  } else {
    // 2. Fallback to currentUser object or voiceOfStrayVolunteer cache
    const currentUserRaw = localStorage.getItem(CURRENT_USER_KEY);
    if (currentUserRaw) {
      try {
        const cu = JSON.parse(currentUserRaw);
        if (cu.volunteer) {
          if (cu.volunteer.approved) status = "Approved";
          else if (cu.volunteer.status) status = cu.volunteer.status;
        }
      } catch (e) {}
    }

    if (status === "Not Applied") {
      const storedVolMeta = localStorage.getItem(VOLUNTEER_META_KEY);
      if (storedVolMeta) {
        try {
          const vm = JSON.parse(storedVolMeta);
          if (vm.status) status = vm.status;
        } catch (e) {}
      }
    }
  }

  // Normalize statuses
  const isApproved = status === "Approved" || status === "Active" || status === "Approved Volunteer" || status === "Active Volunteer";
  const isPending = status === "Pending" || status === "Pending Review";
  const isRejected = status === "Rejected";
  const isRemoved = status === "Removed" || status === "Revoked";

  return {
    status,
    isApproved,
    isPending,
    isRejected,
    isRemoved,
    role: userApp?.role || "Emergency Rescue Support",
    availability: userApp?.availability || user.volunteerAvailability || "Weekends",
    skills: userApp?.skills || user.volunteerSkills || [],
    applicationDate: userApp?.date || "Just now",
    approvalDate: userApp?.approvalDate || null
  };
}

export function submitVolunteerApplication({
  name,
  email,
  phone = "",
  role = "Emergency Rescue",
  type = "volunteer",
  availability = "Weekends",
  skills = ["First Aid"],
  housing = "",
  pets = ""
}) {
  try {
    const apps = getVolunteerApplications();
    const existingIdx = apps.findIndex(
      a => a.email && email && a.email.toLowerCase() === email.toLowerCase()
    );

    let roleDisplay = "Emergency Rescue";
    if (role === "transport" || role === "Transport Assistance") roleDisplay = "Transport Assistance";
    else if (role === "feeding" || role === "Feeding Drives") roleDisplay = "Feeding Drives";
    else if (role === "medical" || role === "Medical / Vet Support") roleDisplay = "Medical / Vet Support";
    else if (type === "foster" || role.includes("Foster")) roleDisplay = "Foster Care Support";
    else if (typeof role === "string" && role.trim()) roleDisplay = role;

    const currentMonthYear = new Date().toLocaleString("default", { month: "long", year: "numeric" }) || "June 2026";
    const appId = "VOL-APP-" + Date.now();

    const newApp = {
      id: appId,
      volunteerId: appId,
      name: name.trim(),
      email: email.trim().toLowerCase(),
      phone: phone.trim(),
      role: roleDisplay,
      type: type || "volunteer",
      status: "Pending Review",
      date: "Just now",
      availability: availability || "Weekends",
      skills: Array.isArray(skills) ? skills : [skills],
      housing: housing || "",
      pets: pets || ""
    };

    if (existingIdx !== -1) {
      apps[existingIdx] = { ...apps[existingIdx], ...newApp, id: apps[existingIdx].id };
    } else {
      apps.push(newApp);
    }

    saveVolunteerApplications(apps);

    // Update user profile in localStorage
    let profile = {};
    const storedProfile = localStorage.getItem(USER_PROFILE_KEY);
    if (storedProfile) {
      try { profile = JSON.parse(storedProfile); } catch (e) {}
    }
    profile.fullName = name;
    profile.email = email;
    if (phone) profile.phone = phone;
    profile.accountType = type === "foster" ? "Volunteer" : (roleDisplay.includes("Rescue") ? "Rescuer" : "Volunteer");
    profile.volunteerAvailability = availability;
    profile.volunteerSkills = skills;
    localStorage.setItem(USER_PROFILE_KEY, JSON.stringify(profile));

    localStorage.setItem("username", name);
    localStorage.setItem("email", email);

    // Save volunteer metadata cache
    const volunteerMeta = {
      status: "Pending Review",
      role: roleDisplay,
      joined: currentMonthYear,
      availability,
      skills
    };
    localStorage.setItem(VOLUNTEER_META_KEY, JSON.stringify(volunteerMeta));

    // Update currentUser and voiceOfStrayUsers
    const currentUserRaw = localStorage.getItem(CURRENT_USER_KEY);
    if (currentUserRaw) {
      try {
        const cu = JSON.parse(currentUserRaw);
        cu.volunteer = cu.volunteer || {};
        cu.volunteer.status = "Pending Review";
        cu.volunteer.approved = false;
        localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(cu));

        const users = JSON.parse(localStorage.getItem(USERS_KEY) || "[]");
        const idx = users.findIndex(u => u.email && u.email.toLowerCase() === email.toLowerCase());
        if (idx !== -1) {
          users[idx].volunteer = cu.volunteer;
          localStorage.setItem(USERS_KEY, JSON.stringify(users));
        }
      } catch (e) {}
    }

    // Push local notification
    const notifications = JSON.parse(localStorage.getItem(NOTIFICATIONS_KEY) || "[]");
    notifications.unshift({
      id: "NOTIF-" + Math.floor(1000 + Math.random() * 9000),
      icon: "ph-fill ph-hand-heart",
      message: `Congratulations ${name}, your volunteer application for ${roleDisplay} has been submitted successfully and is currently under review.`,
      time: "Just now",
      unread: true
    });
    localStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(notifications));

    notifyStorageChange();
    return { success: true, application: newApp };
  } catch (e) {
    console.error("[volunteerStorage] Error submitting volunteer application:", e);
    return { success: false, error: e.message };
  }
}

export function submitNgoPartnerApplication({ name, email, reg }) {
  try {
    localStorage.setItem("role", "ngo");
    localStorage.setItem("ngoType", "NGO Shelter Partner");
    localStorage.setItem("username", name);
    localStorage.setItem("email", email);

    let profile = {};
    const storedProfile = localStorage.getItem(USER_PROFILE_KEY);
    if (storedProfile) {
      try { profile = JSON.parse(storedProfile); } catch (e) {}
    }
    profile.fullName = name;
    profile.email = email;
    profile.accountType = "NGO Partner";
    profile.regNumber = reg;
    localStorage.setItem(USER_PROFILE_KEY, JSON.stringify(profile));

    notifyStorageChange();
    return { success: true };
  } catch (e) {
    console.error("[volunteerStorage] Error registering NGO:", e);
    return { success: false, error: e.message };
  }
}

// --------------------------------------------------------
// OPPORTUNITIES
// --------------------------------------------------------

export function getVolunteerOpportunities() {
  try {
    const stored = localStorage.getItem(OPPORTUNITIES_KEY);
    if (!stored) {
      localStorage.setItem(OPPORTUNITIES_KEY, JSON.stringify(DEFAULT_OPPORTUNITIES));
      return DEFAULT_OPPORTUNITIES;
    }
    const parsed = JSON.parse(stored);
    return Array.isArray(parsed) ? parsed : DEFAULT_OPPORTUNITIES;
  } catch (e) {
    console.error("[volunteerStorage] Error reading opportunities:", e);
    return DEFAULT_OPPORTUNITIES;
  }
}

export function saveVolunteerOpportunities(opportunities) {
  try {
    localStorage.setItem(OPPORTUNITIES_KEY, JSON.stringify(opportunities || []));
    notifyStorageChange();
  } catch (e) {
    console.error("[volunteerStorage] Error saving opportunities:", e);
  }
}

// --------------------------------------------------------
// RESCUE CASE OPPORTUNITIES & ASSIGNMENTS
// --------------------------------------------------------

export function getAvailableRescueOpportunities() {
  try {
    const casesDb = JSON.parse(localStorage.getItem(CASES_KEY) || "{}");
    const availCases = [];

    Object.keys(casesDb).forEach(id => {
      const c = casesDb[id];
      if (c && c.status === "Waiting for Volunteer" && !c.assignedVolunteerId) {
        availCases.push(c);
      }
    });

    return availCases;
  } catch (e) {
    console.error("[volunteerStorage] Error getting rescue opportunities:", e);
    return [];
  }
}

export function getVolunteerAssignments() {
  try {
    const casesDb = JSON.parse(localStorage.getItem(CASES_KEY) || "{}");
    const user = getCurrentUser();
    const assignedCases = [];

    Object.keys(casesDb).forEach(id => {
      const c = casesDb[id];
      if (c) {
        const isAssigned =
          (user.isLoggedIn && c.assignedVolunteerEmail && c.assignedVolunteerEmail.toLowerCase() === user.email.toLowerCase()) ||
          (user.isLoggedIn && c.assignedVolunteerName && c.assignedVolunteerName.toLowerCase() === user.name.toLowerCase()) ||
          (user.username === "Arjun" && c.assignedVolunteerName === "Arjun");

        if (isAssigned && c.statusStep >= 1 && c.statusStep < 8 && c.status !== "Completed") {
          assignedCases.push(c);
        }
      }
    });

    return assignedCases;
  } catch (e) {
    console.error("[volunteerStorage] Error getting volunteer assignments:", e);
    return [];
  }
}

export function getVolunteerHistory() {
  try {
    const stored = localStorage.getItem(HISTORY_KEY);
    if (!stored) {
      localStorage.setItem(HISTORY_KEY, JSON.stringify(DEFAULT_HISTORY));
      return DEFAULT_HISTORY;
    }
    const parsed = JSON.parse(stored);
    return Array.isArray(parsed) ? parsed : DEFAULT_HISTORY;
  } catch (e) {
    console.error("[volunteerStorage] Error getting volunteer history:", e);
    return DEFAULT_HISTORY;
  }
}

export function saveVolunteerHistory(history) {
  try {
    localStorage.setItem(HISTORY_KEY, JSON.stringify(history || []));
    notifyStorageChange();
  } catch (e) {
    console.error("[volunteerStorage] Error saving volunteer history:", e);
  }
}

export function acceptOpportunity(oppId) {
  try {
    const opportunities = getVolunteerOpportunities();
    const item = opportunities.find(o => o.id === oppId);
    if (!item) return { success: false, error: "Opportunity not found" };

    // Remove from opportunities roster
    const updatedOpps = opportunities.filter(o => o.id !== oppId);
    saveVolunteerOpportunities(updatedOpps);

    // Resolve assignment type
    let type = "General Task";
    if (item.tagClass === "feeding" || item.category === "feeding") type = "Feeding Drive";
    else if (item.tagClass === "transport" || item.category === "transport") type = "Transport Assistance";
    else if (item.tagClass === "foster" || item.category === "foster") type = "Foster Care Support";
    else if (item.tagClass === "rescue" || item.category === "rescue") type = "Emergency Rescue";

    const user = getCurrentUser();
    const casesDb = JSON.parse(localStorage.getItem(CASES_KEY) || "{}");
    const newCaseId = Math.floor(5000 + Math.random() * 5000).toString();
    const nowTime = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    const assignedDate = new Date().toLocaleDateString("en-US", { day: "2-digit", month: "short", year: "numeric" });

    const newCase = {
      id: newCaseId,
      animal: type === "Feeding Drive" ? "Street Dog Colony (Feeding)" : (type === "Foster Care Support" ? "Rescue Animal (Foster)" : "Rescue Animal (Transport)"),
      animalType: type === "Feeding Drive" ? "Dog" : "Animal",
      breed: "Street Mix",
      breedDesc: "Street Mix",
      estimatedAge: "Adult",
      issueCategory: type,
      location: item.location,
      reportedTime: item.time,
      condition: item.description,
      observedCondition: item.description,
      severity: item.urgent ? "Emergency" : "Normal",
      status: "Volunteer Assigned",
      statusStep: 2,
      assignedVolunteerId: "VOL-" + Date.now(),
      assignedVolunteerName: user.name || "Arjun",
      assignedVolunteerEmail: user.email || "user@voiceofstray.com",
      assignedVolunteerRole: type,
      assignedAt: assignedDate,
      reporter: {
        name: "Opportunity System",
        phone: "+91 XXXXX XXXXX",
        notes: "Accepted from recommended opportunities roster."
      },
      team: {
        ngo: item.ngo || "Paws Haven NGO",
        volunteers: []
      },
      timeline: [
        { time: nowTime, text: `Opportunity accepted. Volunteer ${user.name} assigned en-route.` }
      ],
      notes: item.description,
      photos: { before: "", during: "", treatment: "", recovery: "" }
    };

    casesDb[newCaseId] = newCase;
    localStorage.setItem(CASES_KEY, JSON.stringify(casesDb));

    // Notification
    const notifications = JSON.parse(localStorage.getItem(NOTIFICATIONS_KEY) || "[]");
    notifications.unshift({
      id: "notif-" + Date.now(),
      message: `You accepted the opportunity: <strong>${item.title}</strong>! Coordinate now.`,
      time: "Just now",
      unread: true,
      icon: "ph-fill ph-bell"
    });
    localStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(notifications));

    notifyStorageChange();
    return { success: true, caseId: newCaseId };
  } catch (e) {
    console.error("[volunteerStorage] Error accepting opportunity:", e);
    return { success: false, error: e.message };
  }
}

export function submitRescueVolunteerRequest(caseId) {
  try {
    const casesDb = JSON.parse(localStorage.getItem(CASES_KEY) || "{}");
    const c = casesDb[caseId];
    if (!c) return { success: false, error: "Case not found" };

    const user = getCurrentUser();
    c.volunteerRequests = c.volunteerRequests || [];

    const hasRequested = c.volunteerRequests.some(
      r => (r.volunteerEmail && r.volunteerEmail.toLowerCase() === user.email.toLowerCase()) || r.volunteerName === user.name
    );

    if (hasRequested) {
      return { success: false, error: "You have already submitted a request for this rescue case." };
    }

    const newRequest = {
      volunteerId: "VOL-" + Date.now(),
      volunteerName: user.name,
      volunteerEmail: user.email,
      volunteerLevel: "Level 1 Helper",
      requestedAt: "Just now",
      requestedTime: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      status: "Pending"
    };

    c.volunteerRequests.push(newRequest);
    c.timeline = c.timeline || [];
    c.timeline.unshift({
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      text: `Volunteer ${user.name} requested to join the rescue operation.`
    });

    localStorage.setItem(CASES_KEY, JSON.stringify(casesDb));

    const notifications = JSON.parse(localStorage.getItem(NOTIFICATIONS_KEY) || "[]");
    notifications.unshift({
      id: "notif-" + Date.now(),
      message: `Your request to join rescue case #RSC-${caseId} has been submitted.`,
      time: "Just now",
      unread: true,
      icon: "ph-fill ph-bell"
    });
    localStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(notifications));

    notifyStorageChange();
    return { success: true };
  } catch (e) {
    console.error("[volunteerStorage] Error submitting rescue volunteer request:", e);
    return { success: false, error: e.message };
  }
}

export function completeAssignment(caseId) {
  try {
    const casesDb = JSON.parse(localStorage.getItem(CASES_KEY) || "{}");
    const c = casesDb[caseId];
    if (!c) return { success: false, error: "Case not found" };

    c.statusStep = 9;
    c.status = "Completed";
    c.timeline = c.timeline || [];
    c.timeline.unshift({
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      text: "Volunteer marked this assignment as completed."
    });

    localStorage.setItem(CASES_KEY, JSON.stringify(casesDb));

    // Add to history
    const history = getVolunteerHistory();
    const today = new Date();
    const dateStr = today.toLocaleString("default", { month: "short", day: "2-digit", year: "numeric" });

    const newHistoryItem = {
      date: dateStr,
      type: (c.issueCategory || "Rescue Case") + " - " + (c.animal || "Stray Animal"),
      outcome: "Completed"
    };

    history.unshift(newHistoryItem);
    saveVolunteerHistory(history);

    // Push notification
    const notifications = JSON.parse(localStorage.getItem(NOTIFICATIONS_KEY) || "[]");
    notifications.unshift({
      id: "notif-" + Date.now(),
      message: `Congratulations! You completed the assignment for Case #RSC-${caseId}.`,
      time: "Just now",
      unread: true,
      icon: "ph-fill ph-check-circle"
    });
    localStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(notifications));

    notifyStorageChange();
    return { success: true };
  } catch (e) {
    console.error("[volunteerStorage] Error completing assignment:", e);
    return { success: false, error: e.message };
  }
}

export function updateVolunteerAvailability(newAvailability) {
  try {
    // 1. Update volunteer meta cache
    let volMeta = {};
    const storedVolMeta = localStorage.getItem(VOLUNTEER_META_KEY);
    if (storedVolMeta) {
      try { volMeta = JSON.parse(storedVolMeta); } catch (e) {}
    }
    volMeta.availability = newAvailability;
    localStorage.setItem(VOLUNTEER_META_KEY, JSON.stringify(volMeta));

    // 2. Update user profile
    let profile = {};
    const storedProfile = localStorage.getItem(USER_PROFILE_KEY);
    if (storedProfile) {
      try { profile = JSON.parse(storedProfile); } catch (e) {}
    }
    profile.volunteerAvailability = newAvailability;
    localStorage.setItem(USER_PROFILE_KEY, JSON.stringify(profile));

    // 3. Update application in applications list
    const user = getCurrentUser();
    if (user.email) {
      const apps = getVolunteerApplications();
      const appIdx = apps.findIndex(a => a.email && a.email.toLowerCase() === user.email.toLowerCase());
      if (appIdx !== -1) {
        apps[appIdx].availability = newAvailability;
        saveVolunteerApplications(apps);
      }
    }

    notifyStorageChange();
    return { success: true };
  } catch (e) {
    console.error("[volunteerStorage] Error updating availability:", e);
    return { success: false, error: e.message };
  }
}
