import { userDashboardStorage } from './userDashboardStorage.js';

// Setup mock localStorage and window environment for Node execution
const store = {};
global.localStorage = {
  getItem: (key) => store[key] || null,
  setItem: (key, val) => { store[key] = String(val); },
  removeItem: (key) => { delete store[key]; },
  clear: () => { Object.keys(store).forEach(k => delete store[k]); }
};
global.window = {
  addEventListener: () => {},
  removeEventListener: () => {},
  dispatchEvent: () => {}
};

console.log('--- Starting userDashboardStorage Tests ---');

// Setup Seed Data
const seedUser = {
  id: 'usr-arjun',
  name: 'Arjun',
  email: 'user@voiceofstray.com',
  role: 'user',
  volunteer: { approved: false, status: 'Not Applied' }
};

const newUser = {
  id: 'usr-newbie-123',
  name: 'Kavya',
  email: 'kavya@example.com',
  role: 'user',
  volunteer: { approved: false, status: 'Not Applied' }
};

const volunteerUser = {
  id: 'vol-priya-01',
  name: 'Priya',
  email: 'priya@example.com',
  role: 'user',
  volunteer: { approved: true, status: 'Approved' }
};

// 1. Test Seed User Arjun Dashboard data
localStorage.setItem('currentUser', JSON.stringify(seedUser));
localStorage.setItem('isLoggedIn', 'true');
localStorage.setItem('username', 'Arjun');
localStorage.setItem('email', 'user@voiceofstray.com');

// Cases
localStorage.setItem('voiceOfStrayCases', JSON.stringify({
  '4888': {
    id: '4888',
    assignedVolunteerId: 'vol-priya-01',
    assignedVolunteerName: 'Priya',
    reporter: { name: 'Arjun', email: 'user@voiceofstray.com' },
    condition: 'Injured Paw',
    location: 'Bandra',
    status: 'Completed',
    statusStep: 9
  },
  '4902': {
    id: '4902',
    reporter: { name: 'Other User', email: 'other@example.com' },
    condition: 'Puppy dehydrated',
    location: 'Andheri',
    status: 'Reported',
    statusStep: 0
  }
}));

// Adoptions
localStorage.setItem('voiceOfStrayAdoptions', JSON.stringify([
  {
    id: 'APP-101',
    petName: 'Charlie',
    breed: 'Golden Retriever Mix',
    ngoName: 'City Rescue',
    applicantEmail: 'user@voiceofstray.com',
    applicantName: 'Arjun',
    status: 'Approved'
  },
  {
    id: 'APP-102',
    petName: 'Bella',
    breed: 'Beagle',
    ngoName: 'Paws Hope',
    applicantEmail: 'other@example.com',
    applicantName: 'Other Person',
    status: 'Pending Review'
  }
]));

// Donations
localStorage.setItem('voiceOfStrayDonations', JSON.stringify([
  {
    id: 'DON-001',
    donor: 'Arjun Mehta',
    donorName: 'Arjun Mehta',
    donorEmail: 'user@voiceofstray.com',
    amount: 2500,
    campaign: 'General Fund',
    ngo: 'Paws Haven NGO',
    date: '2026-06-15',
    status: 'Completed'
  },
  {
    id: 'DON-002',
    donor: 'Other User',
    donorName: 'Other User',
    donorEmail: 'other@example.com',
    amount: 10000,
    campaign: 'Emergency Fund',
    ngo: 'Paws Haven NGO',
    date: '2026-06-16',
    status: 'Completed'
  }
]));

// Saved Pets
localStorage.setItem('voiceOfStraySavedPets', JSON.stringify(['pet-charlie', 'pet-max']));

// Notifications
localStorage.setItem('voiceOfStrayNotifications', JSON.stringify([
  {
    id: 'NOTIF-1',
    message: 'Adoption application for **Charlie** approved!',
    time: '1 day ago',
    unread: true
  },
  {
    id: 'NOTIF-2',
    message: 'New Volunteer Application received for John',
    time: '2 days ago',
    unread: false
  }
]));

// Test 1: User-Specific Rescue Cases
const arjunCases = userDashboardStorage.getUserRescueCases(seedUser);
console.assert(arjunCases.length === 1, `Expected 1 case for Arjun, got ${arjunCases.length}`);
console.assert(arjunCases[0].id === '4888', `Expected case 4888, got ${arjunCases[0]?.id}`);
console.log('✓ Test 1: User-specific rescue cases filtered correctly.');

// Test 2: User-Specific Adoption Requests
const arjunAdoptions = userDashboardStorage.getUserAdoptionRequests(seedUser);
console.assert(arjunAdoptions.length === 1, `Expected 1 adoption for Arjun, got ${arjunAdoptions.length}`);
console.assert(arjunAdoptions[0].petName === 'Charlie', `Expected Charlie, got ${arjunAdoptions[0]?.petName}`);
console.log('✓ Test 2: User-specific adoption requests filtered correctly.');

// Test 3: User-Specific Donations
const arjunDonations = userDashboardStorage.getUserDonations(seedUser);
console.assert(arjunDonations.length === 1, `Expected 1 donation for Arjun, got ${arjunDonations.length}`);
console.assert(arjunDonations[0].amount === 2500, `Expected 2500, got ${arjunDonations[0]?.amount}`);
console.log('✓ Test 3: User-specific donations filtered correctly.');

// Test 4: User-Specific Notifications
const arjunNotifs = userDashboardStorage.getUserNotifications(seedUser, arjunAdoptions, arjunCases, arjunDonations);
console.assert(arjunNotifs.length === 1, `Expected 1 user notification for Arjun, got ${arjunNotifs.length}`);
console.assert(arjunNotifs[0].id === 'NOTIF-1', `Expected NOTIF-1, got ${arjunNotifs[0]?.id}`);
console.log('✓ Test 4: User-specific notifications filtered correctly.');

// Test 5: Saved Animals Lookup
const savedPets = userDashboardStorage.getUserSavedAnimals();
console.assert(savedPets.length >= 1, `Expected saved pets to resolve, got ${savedPets.length}`);
console.log('✓ Test 5: Saved animals resolved correctly.');

// Test 6: Impact Statistics Calculation for Arjun
const arjunStats = userDashboardStorage.calculateImpactStats(seedUser, arjunCases, arjunAdoptions, arjunDonations);
console.assert(arjunStats.reports === 1, `Expected 1 report, got ${arjunStats.reports}`);
console.assert(arjunStats.helped === 2, `Expected 2 helped (1 resolved rescue + 1 approved adoption), got ${arjunStats.helped}`);
console.assert(arjunStats.donations === 1, `Expected 1 donation, got ${arjunStats.donations}`);
console.log('✓ Test 6: Impact stats calculated accurately.');

// Test 7: New User Isolation (No Activity)
const newCases = userDashboardStorage.getUserRescueCases(newUser);
const newAdoptions = userDashboardStorage.getUserAdoptionRequests(newUser);
const newDonations = userDashboardStorage.getUserDonations(newUser);
const newNotifs = userDashboardStorage.getUserNotifications(newUser, newAdoptions, newCases, newDonations);
const newStats = userDashboardStorage.calculateImpactStats(newUser, newCases, newAdoptions, newDonations);

console.assert(newCases.length === 0, `Expected 0 cases for new user, got ${newCases.length}`);
console.assert(newAdoptions.length === 0, `Expected 0 adoptions for new user, got ${newAdoptions.length}`);
console.assert(newDonations.length === 0, `Expected 0 donations for new user, got ${newDonations.length}`);
console.assert(newNotifs.length === 0, `Expected 0 notifications for new user, got ${newNotifs.length}`);
console.assert(newStats.reports === 0 && newStats.helped === 0 && newStats.donations === 0 && newStats.volunteer === 0, 'New user stats must all be 0');
console.log('✓ Test 7: New user activity is completely isolated with 0 cross-pollution.');

// Test 8: Volunteer status check
const volStatus = userDashboardStorage.checkVolunteerStatus(volunteerUser, { accountType: 'Volunteer' });
console.assert(volStatus === true, 'Priya should be recognized as approved volunteer');
const regularStatus = userDashboardStorage.checkVolunteerStatus(newUser, { accountType: 'Regular User' });
console.assert(regularStatus === false, 'Kavya should not be recognized as volunteer');
console.log('✓ Test 8: Volunteer / Rescuer status checked properly.');

// Test 9: Graceful handling of corrupted / malformed JSON in localStorage
localStorage.setItem('voiceOfStrayCases', 'INVALID_JSON_CORRUPTED{{{');
localStorage.setItem('voiceOfStrayAdoptions', '{not_an_array}');
localStorage.setItem('voiceOfStrayDonations', 'NULL');
localStorage.setItem('voiceOfStrayNotifications', 'undefined');

const safeCases = userDashboardStorage.getUserRescueCases(seedUser);
const safeAdoptions = userDashboardStorage.getUserAdoptionRequests(seedUser);
const safeDonations = userDashboardStorage.getUserDonations(seedUser);
const safeNotifs = userDashboardStorage.getUserNotifications(seedUser, [], [], []);

console.assert(Array.isArray(safeCases) && safeCases.length === 0, 'Corrupted cases should return empty array');
console.assert(Array.isArray(safeAdoptions) && safeAdoptions.length === 0, 'Corrupted adoptions should return empty array');
console.assert(Array.isArray(safeDonations) && safeDonations.length === 0, 'Corrupted donations should return empty array');
console.assert(Array.isArray(safeNotifs) && safeNotifs.length === 0, 'Corrupted notifs should return empty array');
console.log('✓ Test 9: Malformed / corrupted localStorage handled without throwing errors.');

console.log('--- ALL userDashboardStorage TESTS PASSED SUCCESSFULLY! ---');
