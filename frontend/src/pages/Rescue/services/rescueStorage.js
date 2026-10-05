// Storage layer for Voice of Stray Rescue Module
// Interacts directly with localStorage keys: voiceOfStrayCases, currentUser, username, role, etc.

export const CASES_KEY = "voiceOfStrayCases";
export const REPORTS_KEY = "voiceOfStrayReports";
export const VOLUNTEER_APPS_KEY = "voiceOfStrayVolunteerApplications";
export const ASSIGNMENTS_KEY = "voiceOfStrayAssignments";

export const DEFAULT_RESCUE_CASES = {
  "4902": {
    id: "4902",
    animal: "Dog (Golden Retriever Mix)",
    animalType: "Dog",
    breed: "Golden Retriever Mix",
    breedDesc: "Golden Retriever Mix",
    estimatedAge: "Puppy / Kitten",
    issueCategory: "Injury",
    location: "Linking Road, Bandra West",
    reportedTime: "10:25 AM",
    condition: "Fractured Leg, Dehydrated",
    observedCondition: "Fractured Leg, Dehydrated",
    severity: "Emergency",
    status: "Reported",
    statusStep: 0,
    reporter: {
      name: "Anjali Sharma",
      phone: "+91 98200 12345",
      notes: "Puppy unable to walk. Seen near roadside."
    },
    team: {
      ngo: "Paws Haven NGO",
      lead: null,
      volunteers: []
    },
    timeline: [
      { time: "10:25 AM", text: "Rescue report received." }
    ],
    notes: "Possible fracture. Requires X-ray evaluation.",
    photos: {
      before: "https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&q=80&w=300",
      during: "",
      treatment: "",
      recovery: ""
    }
  },
  "4888": {
    id: "4888",
    animal: "Dog (Other / Unknown)",
    animalType: "Dog",
    breed: "Other / Unknown",
    breedDesc: "Other / Unknown",
    estimatedAge: "Adult",
    issueCategory: "Injury",
    location: "Anna Nagar Area",
    reportedTime: "09:15 AM",
    condition: "Bleeding near paw, whimpering",
    observedCondition: "Bleeding near paw, whimpering",
    severity: "Emergency",
    status: "Volunteer Assigned",
    statusStep: 2,
    assignedVolunteerId: "vol-priya-01",
    assignedVolunteerName: "Priya",
    assignedVolunteerEmail: "priya@example.com",
    assignedVolunteerRole: "Emergency Rescue",
    assignedAt: "14 Jun 2026",
    reporter: {
      name: "Rohan Sharma",
      phone: "+91 98765 43210",
      notes: "Dog is sitting under the green dustbin. Limping and whimpering."
    },
    team: {
      ngo: "Paws Haven NGO",
      lead: {
        username: "Priya",
        email: "priya@example.com",
        role: "Emergency Rescue",
        assignedDate: "14 Jun 2026",
        status: "Assigned"
      },
      volunteers: []
    },
    timeline: [
      { time: "09:20 AM", text: "Case accepted by Paws Haven NGO." },
      { time: "09:15 AM", text: "Rescue report received." }
    ],
    notes: "Volunteer Priya en-route with ambulance.",
    photos: {
      before: "https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?auto=format&fit=crop&q=80&w=300",
      during: "",
      treatment: "",
      recovery: ""
    }
  },
  "4871": {
    id: "4871",
    animal: "Cat (Other / Unknown)",
    animalType: "Cat",
    breed: "Other / Unknown",
    breedDesc: "Other / Unknown",
    estimatedAge: "Young",
    issueCategory: "Injury",
    location: "Metro Vet Center",
    reportedTime: "08:30 AM",
    condition: "Fractured hind leg, skin scabs",
    observedCondition: "Fractured hind leg, skin scabs",
    severity: "High Priority",
    status: "Treatment",
    statusStep: 5,
    assignedVolunteerId: "vol-akash-01",
    assignedVolunteerName: "Akash",
    assignedVolunteerEmail: "akash@example.com",
    assignedVolunteerRole: "Transport Assistance",
    assignedAt: "13 Jun 2026",
    reporter: {
      name: "Meera Nair",
      phone: "+91 87654 32109",
      notes: "Found limping near Andheri subway under a parked car."
    },
    team: {
      ngo: "Paws Haven NGO",
      lead: {
        username: "Akash",
        email: "akash@example.com",
        role: "Transport Assistance",
        assignedDate: "13 Jun 2026",
        status: "Assigned"
      },
      volunteers: []
    },
    timeline: [
      { time: "09:00 AM", text: "Treatment started at Metro Vet Center." },
      { time: "08:50 AM", text: "Animal safely reached Metro Vet clinic." },
      { time: "08:45 AM", text: "Cat successfully rescued and placed in carrier." },
      { time: "08:30 AM", text: "Rescue report received." }
    ],
    notes: "Hind leg splinted. Antibiotics started.",
    photos: {
      before: "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&q=80&w=300",
      during: "https://images.unsplash.com/photo-1573865526739-10659fec78a5?auto=format&fit=crop&q=80&w=300",
      treatment: "https://images.unsplash.com/photo-1584132967334-10e028bd69f7?auto=format&fit=crop&q=80&w=300",
      recovery: ""
    }
  }
};

/**
 * Initialize default rescue cases if none exist in localStorage
 */
export function initializeRescueCases() {
  const existing = localStorage.getItem(CASES_KEY);
  if (!existing || existing === "{}" || existing === "[]") {
    localStorage.setItem(CASES_KEY, JSON.stringify(DEFAULT_RESCUE_CASES));
  }
}

/**
 * Get raw cases database object from localStorage
 */
export function getCasesDatabase() {
  initializeRescueCases();
  try {
    const raw = localStorage.getItem(CASES_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch (e) {
    console.error("Error reading rescue cases from localStorage", e);
    return {};
  }
}

/**
 * Save cases database object to localStorage and dispatch event
 */
export function saveCasesDatabase(casesDb) {
  const serialized = JSON.stringify(casesDb);
  localStorage.setItem(CASES_KEY, serialized);
  window.dispatchEvent(
    new StorageEvent("storage", {
      key: CASES_KEY,
      newValue: serialized
    })
  );
  // Also dispatch custom event for intra-window reactivity
  window.dispatchEvent(new CustomEvent("voiceOfStrayCasesUpdated", { detail: casesDb }));
}

/**
 * Get all cases as a sorted array (newest / highest ID first)
 */
export function getAllCases() {
  const casesDb = getCasesDatabase();
  return Object.keys(casesDb)
    .map((id) => casesDb[id])
    .filter((c) => c && c.id)
    .sort((a, b) => String(b.id || "").localeCompare(String(a.id || "")));
}

/**
 * Get active rescue cases (NGO accepted to in-progress, not completed or archived)
 */
export function getActiveRescueCases() {
  const allCases = getAllCases();
  return allCases.filter((c) => {
    const isCompleted =
      c.statusStep === 9 ||
      c.status === "Completed" ||
      c.status === "Adopted" ||
      c.status === "Archived" ||
      c.status === "Rejected";
    // Must be accepted (statusStep >= 1 or explicitly accepted) and not completed
    return (c.statusStep >= 1 || (c.status && c.status !== "Reported")) && !isCompleted;
  });
}

/**
 * Get a specific case by ID (handles "RSC-4902" or "4902")
 */
export function getCaseById(caseId) {
  if (!caseId) return null;
  const cleanId = String(caseId).replace(/^RSC-/, "").trim();
  const casesDb = getCasesDatabase();
  return casesDb[cleanId] || null;
}

/**
 * Update a specific rescue case
 */
export function updateCase(caseId, updateFields) {
  if (!caseId) return null;
  const cleanId = String(caseId).replace(/^RSC-/, "").trim();
  const casesDb = getCasesDatabase();
  if (!casesDb[cleanId]) return null;

  casesDb[cleanId] = {
    ...casesDb[cleanId],
    ...updateFields
  };

  saveCasesDatabase(casesDb);
  return casesDb[cleanId];
}

/**
 * Current user helper
 */
export function getCurrentUser() {
  try {
    const currentUserRaw = localStorage.getItem("currentUser");
    if (currentUserRaw) {
      return JSON.parse(currentUserRaw);
    }
  } catch (e) {}

  const username = localStorage.getItem("username");
  const role = localStorage.getItem("role");
  const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";

  if (username || isLoggedIn) {
    return {
      name: username || "User",
      username: username || "User",
      role: role || "volunteer",
      isLoggedIn: true
    };
  }

  return null;
}

/**
 * Check if the given user is authorized as the assigned volunteer for a case
 */
export function isUserAssignedVolunteer(c, user) {
  if (!user || !c) return false;
  
  const userId = String(user.id || user.volunteerId || "");
  const userName = (user.name || user.username || "").toLowerCase();
  
  if (c.assignedVolunteerId && userId && String(c.assignedVolunteerId) === userId) {
    return true;
  }
  
  if (c.assignedVolunteerName && userName && c.assignedVolunteerName.toLowerCase() === userName) {
    return true;
  }

  if (c.team?.lead) {
    const lead = c.team.lead;
    const leadName = typeof lead === "object" ? (lead.username || lead.name) : lead;
    if (leadName && leadName.toLowerCase() === userName) {
      return true;
    }
  }

  return false;
}

/**
 * Transition volunteer status (Step 2 -> 3: En Route, Step 3 -> 4: Animal Rescued)
 */
export function updateVolunteerStatus(caseId, newStep, user) {
  const c = getCaseById(caseId);
  if (!c) throw new Error("Case not found");

  if (!user) throw new Error("You must be logged in to update mission status");
  if (!isUserAssignedVolunteer(c, user)) {
    throw new Error("You are not authorized to update this case");
  }

  if (c.statusStep >= 4) {
    throw new Error("This mission is already completed. Further updates are managed by the NGO.");
  }

  const nowTime = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  const timeline = Array.isArray(c.timeline) ? [...c.timeline] : [];

  let updatedStatus = c.status;
  let updatedStep = c.statusStep;

  if (newStep === 3) {
    if (c.statusStep !== 2 && c.status !== "Volunteer Assigned") {
      throw new Error("Invalid status progression");
    }
    updatedStep = 3;
    updatedStatus = "Volunteer En Route";
    timeline.unshift({
      time: nowTime,
      text: `Volunteer ${user.name || user.username || "Volunteer"} is en route to the rescue location.`
    });
  } else if (newStep === 4) {
    if (c.statusStep !== 3 && c.status !== "Volunteer En Route") {
      throw new Error("Invalid status progression");
    }
    updatedStep = 4;
    updatedStatus = "Animal Rescued";
    timeline.unshift({
      time: nowTime,
      text: "Animal rescued successfully and handed over to the NGO."
    });
  } else {
    throw new Error("Unsupported status update step");
  }

  return updateCase(c.id, {
    status: updatedStatus,
    statusStep: updatedStep,
    timeline
  });
}

/**
 * Derive high level statistics for hero banner
 */
export function getRescueStats(cases = null) {
  const allCases = cases || getAllCases();
  const activeCases = allCases.filter(
    (c) =>
      c.statusStep >= 1 &&
      c.statusStep < 8 &&
      c.status !== "Completed" &&
      c.status !== "Adopted" &&
      c.status !== "Archived" &&
      c.status !== "Rejected"
  );

  const emergencyCount = activeCases.filter((c) => {
    const sev = c.severity || c.priority || "";
    return sev.toLowerCase().includes("emergency") || sev.toLowerCase().includes("critical");
  }).length;

  const ngos = new Set();
  activeCases.forEach((c) => {
    if (c.team && c.team.ngo) ngos.add(c.team.ngo);
  });

  const resolvedCount = allCases.filter(
    (c) => c.statusStep === 9 || c.status === "Completed" || c.status === "Adopted"
  ).length;

  return {
    activeEmergencies: emergencyCount,
    ngosResponding: ngos.size || (activeCases.length > 0 ? 1 : 0),
    volunteersNearby: 47,
    rescuesToday: resolvedCount || 14
  };
}
