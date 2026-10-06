// Storage and persistence layer for Voice of Stray Adoption Module
// Interacts directly with localStorage: voiceOfStrayAdoptions, voiceOfStrayCustomPets,
// voiceOfStraySavedPets, voiceOfStrayVisits, voiceOfStrayNotifications, currentUser, etc.

export const ADOPTIONS_KEY = "voiceOfStrayAdoptions";
export const CUSTOM_PETS_KEY = "voiceOfStrayCustomPets";
export const SAVED_PETS_KEY = "voiceOfStraySavedPets";
export const VISITS_KEY = "voiceOfStrayVisits";
export const NOTIFICATIONS_KEY = "voiceOfStrayNotifications";
export const CURRENT_PET_KEY = "voiceOfStrayCurrentPet";

export const DEFAULT_ADOPTABLE_PETS = [
  {
    id: "pet-charlie",
    slug: "charlie",
    name: "Charlie",
    species: "Dog",
    breed: "Golden Retriever Mix",
    age: "2 Years Old",
    ageCategory: "Young",
    gender: "Male",
    size: "Large",
    location: "Linking Road, Bandra West",
    distance: "5.2 km away",
    distanceKm: 5.2,
    ngoName: "City Rescue NGO",
    ngoInitials: "CR",
    images: {
      main: "https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&q=80&w=800",
      thumbnails: [
        "https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&q=80&w=200",
        "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?auto=format&fit=crop&q=80&w=200",
        "https://images.unsplash.com/photo-1596492784531-6e6eb5ea9993?auto=format&fit=crop&q=80&w=200"
      ]
    },
    status: "Available",
    fosterBadge: "Urgent Foster Needed",
    shortDesc:
      "Charlie is a brilliant and loyal companion who loves long hikes and playing fetch. He was rescued from a construction site and has since blossomed into a deeply loving dog looking for a forever family.",
    story:
      "Charlie was found wandering near a busy highway interchange, scared and slightly malnourished. A kind commuter spotted him and used the Voice of Stray app to report his location. Our rescue team arrived within 30 minutes, using calm reassurance and treats to secure him.\n\nUpon arrival at the shelter, Charlie was timid but showed no signs of aggression. He quickly warmed up to the staff, showing his true goofy and affectionate Golden Retriever nature. After two weeks in a loving temporary foster home, he has fully recovered, gained healthy weight, and learned basic commands like 'sit' and 'stay'.",
    attributes: {
      vaccinated: true,
      vetChecked: true,
      neutered: true,
      goodkids: true,
      goodpets: true,
      housetrained: true,
      specialNeeds: false,
      senior: false,
      emergency: true
    },
    personality: {
      energy: 85,
      temperament: "Friendly/Calm",
      training: "Knows Commands"
    },
    dailyBehavior: "Loves morning walks, naps in the afternoon sun.",
    lifestyleFit: "Active family, hiking companion, house with yard.",
    medical: {
      vaccines: "Fully up to date (Rabies, DHPP)",
      treatments: "Neutered, Microchipped, Tick/Flea treated",
      specialCare: "None needed. Healthy and active."
    },
    rescueDate: "October 12, 2025"
  },
  {
    id: "pet-max",
    slug: "max",
    name: "Max",
    species: "Dog",
    breed: "German Shepherd",
    age: "3 years",
    ageCategory: "Adult",
    gender: "Male",
    size: "Large",
    location: "Andheri East",
    distance: "5.2 km away",
    distanceKm: 5.2,
    ngoName: "City Rescue NGO",
    ngoInitials: "CR",
    images: {
      main: "https://images.unsplash.com/photo-1589965716319-4a041b58fa8a?auto=format&fit=crop&q=80&w=600",
      thumbnails: [
        "https://images.unsplash.com/photo-1589965716319-4a041b58fa8a?auto=format&fit=crop&q=80&w=200"
      ]
    },
    status: "Available",
    shortDesc:
      "Max is a brilliant and loyal companion who loves long hikes and playing fetch. He was rescued from a construction site and has since blossomed into a devoted protector.",
    story:
      "Max was found guarding an abandoned site in Andheri. He was initially protective but responded immediately to gentle, patient handling. He has completed basic obedience and excels on the leash.",
    attributes: {
      vaccinated: true,
      vetChecked: true,
      neutered: true,
      goodkids: true,
      goodpets: false,
      housetrained: true,
      specialNeeds: false,
      senior: false,
      emergency: false
    },
    personality: {
      energy: 75,
      temperament: "Alert/Loyal",
      training: "Advanced Obedience"
    },
    dailyBehavior: "Enjoys two brisk walks a day and mental stimulation games.",
    lifestyleFit: "Experienced dog owner, yard preferred.",
    medical: {
      vaccines: "Neutered, Vaccinated, Microchipped",
      treatments: "Full veterinary clearance given.",
      specialCare: "Routine exercise"
    },
    rescueDate: "Oct 12, 2025"
  },
  {
    id: "pet-ginger",
    slug: "ginger",
    name: "Ginger",
    species: "Cat",
    breed: "Tabby Cat",
    age: "1 year",
    ageCategory: "Young",
    gender: "Female",
    size: "Small",
    location: "Colaba Causeway",
    distance: "2.8 km away",
    distanceKm: 2.8,
    ngoName: "Paws & Claws",
    ngoInitials: "PC",
    images: {
      main: "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&q=80&w=600",
      thumbnails: [
        "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&q=80&w=200"
      ]
    },
    status: "Available",
    fosterBadge: "Urgent: Foster Needed Immediately",
    shortDesc:
      "Ginger is a quiet soul looking for a peaceful home. She enjoys sunbathing by the window and is very gentle with children. She needs a forever family to love.",
    story:
      "Ginger was found taking shelter under a shop canopy during heavy rains. She is gentle, affectionate, and purrs whenever anyone sits near her.",
    attributes: {
      vaccinated: true,
      vetChecked: true,
      neutered: true,
      goodkids: true,
      goodpets: true,
      housetrained: true,
      specialNeeds: false,
      senior: false,
      emergency: true
    },
    personality: {
      energy: 40,
      temperament: "Calm/Gentle",
      training: "Litter trained"
    },
    dailyBehavior: "Loves warm window spots and quiet evenings.",
    lifestyleFit: "Apartment friendly, quiet home.",
    medical: {
      vaccines: "Spayed, Vaccinated",
      treatments: "Dental check completed.",
      specialCare: "Indoor only"
    },
    rescueDate: "Nov 05, 2025"
  },
  {
    id: "pet-pip-squeak",
    slug: "pip-squeak",
    name: "Pip & Squeak",
    species: "Dog",
    breed: "Mix Terriers",
    age: "4 months",
    ageCategory: "Baby",
    gender: "Male/Female",
    size: "Small",
    location: "Ghatkopar West",
    distance: "12.0 km away",
    distanceKm: 12.0,
    ngoName: "Happy Tails Rescue",
    ngoInitials: "HT",
    images: {
      main: "https://images.unsplash.com/photo-1546238232-20216dec9f72?auto=format&fit=crop&q=80&w=600",
      thumbnails: [
        "https://images.unsplash.com/photo-1546238232-20216dec9f72?auto=format&fit=crop&q=80&w=200"
      ]
    },
    status: "Available",
    shortDesc:
      "These inseparable siblings were found together in a cardboard box. They rely on each other for comfort and must be adopted as a pair. They are high energy and playful.",
    story:
      "Rescued as tiny puppies, Pip and Squeak have grown into playful bundles of joy. They do everything together and bring double the happiness to any home.",
    attributes: {
      vaccinated: true,
      vetChecked: true,
      neutered: false,
      goodkids: true,
      goodpets: true,
      housetrained: false,
      bondedPair: true,
      specialNeeds: false,
      senior: false,
      emergency: false
    },
    personality: {
      energy: 90,
      temperament: "Playful/Curious",
      training: "Puppy pad training"
    },
    dailyBehavior: "Wrestling, chasing toys, and falling asleep side by side.",
    lifestyleFit: "Active home willing to adopt bonded pair.",
    medical: {
      vaccines: "1st Vaccines complete",
      treatments: "Dewormed, health checked.",
      specialCare: "Second vaccine dose due next month."
    },
    rescueDate: "Jan 20, 2026"
  },
  {
    id: "pet-buddy",
    slug: "buddy",
    name: "Buddy",
    species: "Dog",
    breed: "Labrador Mix",
    age: "9 years",
    ageCategory: "Senior",
    gender: "Male",
    size: "Large",
    location: "Bandra West",
    distance: "1.5 km away",
    distanceKm: 1.5,
    ngoName: "City Rescue NGO",
    ngoInitials: "CR",
    images: {
      main: "https://images.unsplash.com/photo-1544568100-847a948585b9?auto=format&fit=crop&q=80&w=600",
      thumbnails: [
        "https://images.unsplash.com/photo-1544568100-847a948585b9?auto=format&fit=crop&q=80&w=200"
      ]
    },
    status: "Available",
    shortDesc:
      "Buddy is the definition of a 'good boy.' He knows all basic commands and just wants a warm spot on a rug to nap near his humans. Perfect for a first-time owner.",
    story:
      "Buddy's elderly previous owner passed away, and Buddy was surrendered to ensure he found a loving home. He is gentle, polite, and wonderful company.",
    attributes: {
      vaccinated: true,
      vetChecked: true,
      neutered: true,
      goodkids: true,
      goodpets: true,
      housetrained: true,
      senior: true,
      specialNeeds: false,
      emergency: false
    },
    personality: {
      energy: 30,
      temperament: "Gentle/Affectionate",
      training: "Fully trained"
    },
    dailyBehavior: "Leisurely strolls, belly rubs, and peaceful naps.",
    lifestyleFit: "Great for first-time owners, seniors, or relaxed families.",
    medical: {
      vaccines: "Fully vaccinated & neutered",
      treatments: "Takes daily joint supplement.",
      specialCare: "Low-impact walks"
    },
    rescueDate: "Aug 02, 2025"
  },
  {
    id: "pet-luna",
    slug: "luna",
    name: "Luna",
    species: "Cat",
    breed: "Tabby Cat",
    age: "1 year",
    ageCategory: "Young",
    gender: "Female",
    size: "Small",
    location: "Worli Sea Face",
    distance: "3.5 km away",
    distanceKm: 3.5,
    ngoName: "Paws & Claws",
    ngoInitials: "PC",
    images: {
      main: "https://images.unsplash.com/photo-1513360371669-4adf3dd7dff8?auto=format&fit=crop&q=80&w=600",
      thumbnails: [
        "https://images.unsplash.com/photo-1513360371669-4adf3dd7dff8?auto=format&fit=crop&q=80&w=200"
      ]
    },
    status: "Available",
    shortDesc:
      "Found in an abandoned warehouse. She's now a purr machine ready to snuggle on your couch.",
    story:
      "Luna was rescued from a quiet warehouse corner. She quickly adapted to human warmth and loves sleeping at the foot of the bed.",
    attributes: {
      vaccinated: true,
      vetChecked: true,
      neutered: true,
      goodkids: true,
      goodpets: true,
      housetrained: true,
      specialNeeds: false,
      senior: false,
      emergency: false
    },
    personality: {
      energy: 50,
      temperament: "Loving/Curious",
      training: "Litter trained"
    },
    dailyBehavior: "Chases feather toys and enjoys lap cuddles.",
    lifestyleFit: "Ideal for apartments.",
    medical: {
      vaccines: "Fully vaccinated",
      treatments: "Spayed, microchipped.",
      specialCare: "Indoor pet"
    },
    rescueDate: "Dec 15, 2025"
  },
  {
    id: "pet-cooper",
    slug: "cooper",
    name: "Cooper",
    species: "Dog",
    breed: "Golden Retriever Puppy",
    age: "3 months",
    ageCategory: "Baby",
    gender: "Male",
    size: "Med",
    location: "Juhu Beach Area",
    distance: "4.1 km away",
    distanceKm: 4.1,
    ngoName: "City Rescue NGO",
    ngoInitials: "CR",
    images: {
      main: "https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&q=80&w=800",
      thumbnails: [
        "https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&q=80&w=200"
      ]
    },
    status: "Available",
    shortDesc:
      "Saved from a high-traffic area, full of energy and ready for puppy school.",
    story:
      "Cooper was rescued near a busy road and brought to safety. He is eager to learn, food-motivated, and loves everyone he meets.",
    attributes: {
      vaccinated: true,
      vetChecked: true,
      neutered: false,
      goodkids: true,
      goodpets: true,
      housetrained: false,
      specialNeeds: false,
      senior: false,
      emergency: false
    },
    personality: {
      energy: 85,
      temperament: "Happy/Energetic",
      training: "Basic puppy training started"
    },
    dailyBehavior: "Zoomies, toy chew sessions, deep puppy naps.",
    lifestyleFit: "Family ready for puppy training.",
    medical: {
      vaccines: "Initial puppy vaccines given",
      treatments: "Dewormed.",
      specialCare: "Neutering recommended at 6 months"
    },
    rescueDate: "Feb 01, 2026"
  },
  {
    id: "pet-snowy",
    slug: "snowy",
    name: "Snowy",
    species: "Dog",
    breed: "Terrier Mix",
    age: "1 year",
    ageCategory: "Young",
    gender: "Male",
    size: "Med",
    location: "Powai Lake",
    distance: "6.0 km away",
    distanceKm: 6.0,
    ngoName: "City Rescue NGO",
    ngoInitials: "CR",
    images: {
      main: "https://images.unsplash.com/photo-1517849845537-4d257902454a?auto=format&fit=crop&q=80&w=600",
      thumbnails: [
        "https://images.unsplash.com/photo-1517849845537-4d257902454a?auto=format&fit=crop&q=80&w=200"
      ]
    },
    status: "Available",
    shortDesc:
      "Abandoned during the winter, he is a survivor with a heart of pure gold.",
    story:
      "Snowy was rescued during cold weather, underweight and frightened. With warmth, care, and good nutrition, he has turned into a happy and loyal friend.",
    attributes: {
      vaccinated: true,
      vetChecked: true,
      neutered: true,
      goodkids: true,
      goodpets: true,
      housetrained: true,
      specialNeeds: false,
      senior: false,
      emergency: false
    },
    personality: {
      energy: 70,
      temperament: "Affectionate/Alert",
      training: "House trained"
    },
    dailyBehavior: "Enjoys chasing balls and cuddling on the sofa.",
    lifestyleFit: "Great for active couples or families.",
    medical: {
      vaccines: "Fully vaccinated",
      treatments: "Neutered, microchipped.",
      specialCare: "Healthy"
    },
    rescueDate: "Jan 10, 2026"
  }
];

export function getCustomPets() {
  try {
    const raw = localStorage.getItem(CUSTOM_PETS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
}

/**
 * Normalize and combine static + NGO published pets
 */
export function getAllAdoptablePets() {
  const customPets = getCustomPets();

  // Format custom pets to adhere to unified pet schema
  const formattedCustom = customPets.map((p) => {
    const id = p.id || `custom-${p.name?.toLowerCase().replace(/\s+/g, '-')}`;
    return {
      id: id,
      slug: p.slug || p.name?.toLowerCase().replace(/\s+/g, '-'),
      name: p.name || "Rescued Pet",
      species: p.species || "Dog",
      breed: p.breed || "Mixed Breed",
      age: p.age || "Young",
      ageCategory: p.ageCategory || (String(p.age).includes("month") ? "Baby" : String(p.age).includes("9") || String(p.age).includes("Senior") ? "Senior" : "Young"),
      gender: p.gender || "Unknown",
      size: p.size || "Med",
      location: p.location || "Local Shelter",
      distance: p.distance || "5.0 km away",
      distanceKm: parseFloat(p.distance) || 5.0,
      ngoName: p.ngoName || "City Rescue NGO",
      ngoInitials: p.ngoInitials || "CR",
      images: {
        main: p.images?.main || p.photo || "https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&q=80&w=600",
        thumbnails: p.images?.thumbnails || [p.images?.main || "https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&q=80&w=200"]
      },
      status: p.status || "Available",
      fosterBadge: p.fosterBadge || "",
      shortDesc: p.shortDesc || p.story?.slice(0, 120) || "Ready for adoption! Rescue story details inside.",
      story: p.story || "Rescued with compassion and care. Ready to meet their forever family.",
      attributes: {
        vaccinated: p.attributes?.vaccinated ?? true,
        vetChecked: p.attributes?.vetChecked ?? true,
        neutered: p.attributes?.neutered ?? true,
        goodkids: p.attributes?.goodkids ?? true,
        goodpets: p.attributes?.goodpets ?? true,
        housetrained: p.attributes?.housetrained ?? true,
        specialNeeds: p.attributes?.specialNeeds ?? false,
        senior: p.attributes?.senior ?? false,
        emergency: p.attributes?.emergency ?? false
      },
      personality: p.personality || {
        energy: 60,
        temperament: "Friendly",
        training: "Basic commands"
      },
      dailyBehavior: p.dailyBehavior || "Enjoys walks and naps in a cozy spot.",
      lifestyleFit: p.lifestyleFit || "Loving family home.",
      medical: p.medical || {
        vaccines: "Fully checked",
        treatments: "Treatment logged",
        specialCare: "None"
      },
      rescueDate: p.rescueDate || "Recent"
    };
  });

  // Prepend custom pets before default pets, avoiding duplicates by ID or slug
  const all = [...formattedCustom];
  DEFAULT_ADOPTABLE_PETS.forEach((dp) => {
    if (!all.some((p) => p.id === dp.id || (p.slug && p.slug === dp.slug) || (p.name && dp.name && p.name.toLowerCase() === dp.name.toLowerCase()))) {
      all.push(dp);
    }
  });

  return all.map((pet) => ({
    ...pet,
    image: pet.image || pet.images?.main || pet.photo || "https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&q=80&w=600",
    gallery: pet.gallery || pet.images?.thumbnails || (pet.image ? [pet.image] : []),
    storySnippet: pet.storySnippet || pet.shortDesc || (pet.story ? pet.story.slice(0, 140) : "") || pet.description || "",
    vaccinated: pet.vaccinated ?? pet.attributes?.vaccinated ?? true,
    neutered: pet.neutered ?? pet.attributes?.neutered ?? true,
    trained: pet.trained ?? pet.attributes?.housetrained ?? true,
    specialNeeds: pet.specialNeeds ?? pet.attributes?.specialNeeds ?? false,
    urgent: Boolean(pet.urgent || pet.fosterBadge || pet.attributes?.emergency)
  }));
}

/**
 * Get a specific pet by ID or Slug or Name
 */
export function getPetById(petIdOrSlug) {
  if (!petIdOrSlug) return null;
  const clean = String(petIdOrSlug).toLowerCase().trim();
  const allPets = getAllAdoptablePets();

  return (
    allPets.find(
      (p) =>
        String(p.id).toLowerCase() === clean ||
        String(p.slug).toLowerCase() === clean ||
        p.name.toLowerCase() === clean
    ) || null
  );
}

/**
 * Get list of adoption applications
 */
export function getAdoptions() {
  try {
    const raw = localStorage.getItem(ADOPTIONS_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (e) {
    console.error("Error reading adoption applications from localStorage", e);
    return [];
  }
}

/**
 * Save adoption applications list and broadcast events
 */
export function saveAdoptions(adoptions) {
  const serialized = JSON.stringify(adoptions);
  localStorage.setItem(ADOPTIONS_KEY, serialized);
  window.dispatchEvent(
    new StorageEvent("storage", {
      key: ADOPTIONS_KEY,
      newValue: serialized
    })
  );
  window.dispatchEvent(new CustomEvent("voiceOfStrayAdoptionsUpdated", { detail: adoptions }));
}

/**
 * Get adoption application by ID
 */
export function getAdoptionById(appId) {
  if (!appId) return null;
  const list = getAdoptions();
  return list.find((a) => String(a.id).toLowerCase() === String(appId).toLowerCase()) || null;
}

/**
 * Get applications for current user
 */
export function getApplicationsForUser(userOrEmail) {
  const list = getAdoptions();
  if (!userOrEmail) return [];
  const targetEmail = typeof userOrEmail === "object" ? userOrEmail.email : userOrEmail;
  const targetName = typeof userOrEmail === "object" ? userOrEmail.name || userOrEmail.username : "";

  return list.filter((a) => {
    if (targetEmail && a.applicantEmail && a.applicantEmail.toLowerCase() === targetEmail.toLowerCase()) {
      return true;
    }
    if (targetName && a.applicantName && a.applicantName.toLowerCase() === targetName.toLowerCase()) {
      return true;
    }
    return false;
  });
}

/**
 * Check if active pending application exists for pet and user
 */
export function getExistingApplication(petNameOrId, user) {
  if (!petNameOrId || !user) return null;
  const list = getAdoptions();
  const cleanPet = String(petNameOrId).toLowerCase().trim();
  const userEmail = (user.email || "").toLowerCase().trim();
  const userName = (user.name || user.username || "").toLowerCase().trim();

  return list.find((a) => {
    const petMatch =
      (a.petName && a.petName.toLowerCase() === cleanPet) ||
      (a.petId && String(a.petId).toLowerCase() === cleanPet) ||
      (a.breed && cleanPet.includes(a.breed.toLowerCase()));

    const userMatch =
      (userEmail && a.applicantEmail && a.applicantEmail.toLowerCase() === userEmail) ||
      (userName && a.applicantName && a.applicantName.toLowerCase() === userName);

    const isActive = a.status === "Pending Review" || a.status === "Under Review" || a.status === "Pending";
    return petMatch && userMatch && isActive;
  });
}

/**
 * Submit a new adoption application
 */
export function createAdoptionApplication(applicationData, user = null) {
  if (!applicationData.applicantName || !applicationData.applicantEmail || !applicationData.applicantPhone) {
    throw new Error("Applicant name, email, and phone number are required.");
  }

  const existing = getExistingApplication(applicationData.petName || applicationData.petId, {
    email: applicationData.applicantEmail,
    name: applicationData.applicantName
  });

  if (existing) {
    throw new Error(`You already have an active application (${existing.status}) submitted for ${applicationData.petName}.`);
  }

  const appID = "APPL-" + Math.floor(1000 + Math.random() * 9000);

  const newApp = {
    id: appID,
    petId: applicationData.petId || "",
    petName: applicationData.petName || "Stray Companion",
    breed: applicationData.breed || "Companion Breed",
    ngoName: applicationData.ngoName || "City Rescue NGO",
    ngoInitials: applicationData.ngoInitials || "CR",
    applicantName: applicationData.applicantName.trim(),
    applicantEmail: applicationData.applicantEmail.trim(),
    applicantPhone: applicationData.applicantPhone.trim(),
    city: applicationData.city || "Mumbai",
    occupation: applicationData.occupation || "",
    age: applicationData.age || "",
    ownRent: applicationData.ownRent || "own",
    hasYard: applicationData.hasYard || "yes",
    hasPets: applicationData.hasPets || "no",
    petsDesc: applicationData.petsDesc || "",
    hasKids: applicationData.hasKids || "no",
    whyAdopt: applicationData.whyAdopt || "",
    aloneHours: applicationData.aloneHours || "",
    ownedBefore: applicationData.ownedBefore || "",
    emergencies: applicationData.emergencies || "",
    adjustPlan: applicationData.adjustPlan || "",
    status: "Pending Review",
    date: new Date().toLocaleDateString()
  };

  const adoptions = getAdoptions();
  adoptions.unshift(newApp);
  saveAdoptions(adoptions);

  // Push user notification
  try {
    const rawNotifs = localStorage.getItem(NOTIFICATIONS_KEY);
    const notifications = rawNotifs ? JSON.parse(rawNotifs) : [];
    notifications.unshift({
      id: "NOTIF-" + Math.floor(1000 + Math.random() * 9000),
      icon: "ph-fill ph-check-circle",
      message: `Adoption application for **${newApp.petName}** has been successfully submitted!`,
      time: "Just now",
      unread: true
    });
    localStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(notifications));
  } catch (e) {}

  return newApp;
}

/**
 * Schedule a visit with NGO for a pet
 */
export function scheduleVisit(visitData) {
  const visitID = "VISIT-" + Math.floor(1000 + Math.random() * 9000);
  const newVisit = {
    id: visitID,
    petId: visitData.petId || "",
    petName: visitData.petName || "Pet",
    applicantName: visitData.applicantName || "User",
    applicantEmail: visitData.applicantEmail || "",
    preferredDate: visitData.preferredDate || "",
    preferredTime: visitData.preferredTime || "",
    message: visitData.message || "",
    status: "Pending",
    scheduledDate: "",
    scheduledTime: "",
    shelterNotes: "",
    date: new Date().toLocaleDateString()
  };

  try {
    const rawVisits = localStorage.getItem(VISITS_KEY);
    const visits = rawVisits ? JSON.parse(rawVisits) : [];
    visits.unshift(newVisit);
    localStorage.setItem(VISITS_KEY, JSON.stringify(visits));
  } catch (e) {}

  // Update matching adoption application to "Under Review"
  const adoptions = getAdoptions();
  const app = adoptions.find(
    (a) =>
      a.petName === newVisit.petName &&
      a.applicantEmail &&
      newVisit.applicantEmail &&
      a.applicantEmail.toLowerCase() === newVisit.applicantEmail.toLowerCase()
  );
  if (app && app.status === "Pending Review") {
    app.status = "Under Review";
    saveAdoptions(adoptions);
  }

  // Push notification
  try {
    const rawNotifs = localStorage.getItem(NOTIFICATIONS_KEY);
    const notifications = rawNotifs ? JSON.parse(rawNotifs) : [];
    notifications.unshift({
      id: "NOTIF-" + Math.floor(1000 + Math.random() * 9000),
      icon: "ph-fill ph-calendar",
      message: `Visit request for **${newVisit.petName}** submitted for **${newVisit.preferredDate}** (${newVisit.preferredTime}).`,
      time: "Just now",
      unread: true
    });
    localStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(notifications));
  } catch (e) {}

  return newVisit;
}

/**
 * Saved / Favorited Pets management
 */
export function getSavedPetIds() {
  try {
    const raw = localStorage.getItem(SAVED_PETS_KEY);
    return raw ? JSON.parse(raw) : ["pet-max"];
  } catch (e) {
    return [];
  }
}

export function toggleSavePet(petId) {
  if (!petId) return [];
  const saved = getSavedPetIds();
  const idx = saved.indexOf(petId);
  if (idx >= 0) {
    saved.splice(idx, 1);
  } else {
    saved.push(petId);
  }
  localStorage.setItem(SAVED_PETS_KEY, JSON.stringify(saved));
  window.dispatchEvent(new CustomEvent("voiceOfStraySavedPetsUpdated", { detail: saved }));
  return saved;
}

/**
 * Get current session user info
 */
export function getCurrentUser() {
  try {
    const currentUserRaw = localStorage.getItem("currentUser");
    if (currentUserRaw) {
      return JSON.parse(currentUserRaw);
    }
  } catch (e) {}

  const username = localStorage.getItem("username");
  const email = localStorage.getItem("email");
  const role = localStorage.getItem("role") || "user";
  const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";

  let profile = {};
  try {
    const storedProfile = localStorage.getItem("voiceOfStrayUserProfile");
    if (storedProfile) profile = JSON.parse(storedProfile);
  } catch (e) {}

  if (username || email || isLoggedIn) {
    return {
      name: profile.fullName || username || "User",
      username: username || "User",
      email: profile.email || email || "user@voiceofstray.com",
      phone: profile.phone || "",
      city: profile.city || "Mumbai",
      occupation: profile.occupation || "",
      age: profile.age || "",
      role: role,
      isLoggedIn: isLoggedIn
    };
  }

  return null;
}

export function isPetSaved(petId) {
  const saved = getSavedPetIds();
  return saved.includes(petId);
}

export function toggleSavedPet(petId) {
  const list = toggleSavePet(petId);
  return list.includes(petId);
}

export function getSavedPets() {
  return getSavedPetIds();
}

export function getAdoptablePets() {
  return getAllAdoptablePets();
}

export function hasUserAppliedForPet(petIdOrName, user = null) {
  const u = user || getCurrentUser();
  return getExistingApplication(petIdOrName, u);
}

export function createVisitRequest(visitData) {
  return scheduleVisit(visitData);
}

export const adoptionStorage = {
  ADOPTIONS_KEY,
  CUSTOM_PETS_KEY,
  SAVED_PETS_KEY,
  VISITS_KEY,
  NOTIFICATIONS_KEY,
  DEFAULT_ADOPTABLE_PETS,
  getCustomPets,
  getAllAdoptablePets,
  getAdoptablePets,
  getPetById,
  getAdoptions,
  saveAdoptions,
  getAdoptionById,
  getApplicationsForUser,
  getExistingApplication,
  hasUserAppliedForPet,
  createAdoptionApplication,
  scheduleVisit,
  createVisitRequest,
  getSavedPetIds,
  getSavedPets,
  toggleSavePet,
  toggleSavedPet,
  isPetSaved,
  getCurrentUser
};

export default adoptionStorage;
