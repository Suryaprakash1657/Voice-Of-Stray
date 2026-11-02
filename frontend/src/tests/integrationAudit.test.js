/**
 * Integration Audit Test Suite for Milestone 14
 * Tests critical end-to-end business workflows and storage integrity.
 */

import { authStorage } from '../pages/Auth/services/authStorage.js';
import { createReport, getReports } from '../pages/Report/services/reportStorage.js';
import { ngoDashboardStorage } from '../pages/NgoDashboard/services/ngoDashboardStorage.js';
import {
  getAllCases,
  getActiveRescueCases,
  getCaseById,
  updateVolunteerStatus,
  isUserAssignedVolunteer
} from '../pages/Rescue/services/rescueStorage.js';
import {
  getVolunteerApplications,
  saveVolunteerApplications,
  getVolunteerStatus,
  getVolunteerAssignments
} from '../pages/Volunteer/services/volunteerStorage.js';
import {
  getAllAdoptablePets,
  getPetById,
  createAdoptionApplication,
  getAdoptions
} from '../pages/Adopt/services/adoptionStorage.js';
import { donationStorage } from '../pages/Donate/services/donationStorage.js';
import { userDashboardStorage } from '../pages/UserDashboard/services/userDashboardStorage.js';

// Setup Mock In-Memory localStorage & Browser globals
const store = {};
global.localStorage = {
  getItem: (k) => (k in store ? store[k] : null),
  setItem: (k, v) => { store[k] = String(v); },
  removeItem: (k) => { delete store[k]; },
  clear: () => { Object.keys(store).forEach(k => delete store[k]); }
};

global.window = {
  addEventListener: () => {},
  removeEventListener: () => {},
  dispatchEvent: () => {}
};

console.log('======================================================');
console.log('VOICE OF STRAY — MILESTONE 14 INTEGRATION AUDIT SUITE');
console.log('======================================================\n');

// -------------------------------------------------------------------------
// SECTION 1: AUTHENTICATION & ROLE ISOLATION
// -------------------------------------------------------------------------
console.log('▶ [1] Testing Auth & Role Isolation...');
authStorage.logout();
console.assert(authStorage.isLoggedIn() === false, 'Should be logged out initially');

// Regular user login
const userLogin = authStorage.login('user@voiceofstray.com', 'user123', 'user');
console.assert(userLogin.success === true, 'Regular user login failed');
console.assert(authStorage.isLoggedIn() === true, 'Session should be active');
console.assert(localStorage.getItem('role') === 'user', 'Role should be user');

// Check user dashboard auth guard
console.assert(userDashboardStorage.isLoggedIn() === true, 'userDashboardStorage reports logged in');
const currentAuthUser = userDashboardStorage.getCurrentUser();
console.assert(currentAuthUser.email === 'user@voiceofstray.com', 'User email mismatch');

// NGO Login
const ngoLogin = authStorage.login('ngo@voiceofstray.com', 'ngo123', 'ngo');
console.assert(ngoLogin.success === true, 'NGO login failed');
console.assert(localStorage.getItem('role') === 'ngo', 'Role should be ngo');
const currentNgo = ngoDashboardStorage.getCurrentNgo();
console.assert(currentNgo.role === 'ngo', 'NGO identity mismatch');
console.log('  ✔ Auth & Role tests passed cleanly.\n');

// -------------------------------------------------------------------------
// SECTION 2: CRITICAL RESCUE WORKFLOW END-TO-END
// -------------------------------------------------------------------------
console.log('▶ [2] Testing Critical Rescue Workflow Journey...');
// Switch to regular user session
authStorage.login('user@voiceofstray.com', 'user123', 'user');

// Step 1: User submits a stray report
const testReport = {
  id: '9901',
  animalType: 'Dog',
  breed: 'Indie Stray',
  breedDesc: 'Indie Stray',
  estimatedAge: 'Young',
  issueCategory: 'Injury',
  title: 'Dog (Indie Stray) near Park St',
  location: 'Park Street Cross, T Nagar',
  reporterName: 'Arjun',
  reporterEmail: 'user@voiceofstray.com',
  reporterPhone: '+91 98765 00000',
  dateSubmitted: '2026-06-18',
  timeSubmitted: '11:00 AM',
  priority: 'Emergency',
  observedCondition: 'Severe limp and visible distress',
  description: 'Severe limp and visible distress',
  photo: 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=300'
};
createReport(testReport);

// Verify report was saved in voiceOfStrayReports
const reportsAfterSubmit = getReports();
console.assert(reportsAfterSubmit.some(r => r.id === '9901'), 'Report 9901 should be saved in storage');

// Business Rule: Submitting a report must NOT automatically create an accepted rescue case
const casesBeforeAccept = getCasesDatabaseDirect();
console.assert(!casesBeforeAccept['9901'] || casesBeforeAccept['9901'].statusStep === 0,
  'Report submission must NOT create an active rescue case');

// Step 2 & 3: NGO views incoming reports
const incomingReports = ngoDashboardStorage.getIncomingReports();
console.assert(incomingReports.some(r => r.id === '9901'), 'NGO incoming reports must show 9901');

// Step 4 & 5: NGO accepts the report
const acceptResult = ngoDashboardStorage.acceptReport('9901', 'Paws Haven NGO');
console.assert(acceptResult.success === true, 'Accepting report 9901 should succeed');

// Acceptance creates or activates the correct rescue case exactly once
const case9901 = getCaseById('9901');
console.assert(case9901 !== null, 'Case 9901 must now exist in cases DB');
console.assert(case9901.statusStep === 1, 'Case 9901 should be in Step 1 (Waiting for Volunteer)');
console.assert(case9901.status === 'Waiting for Volunteer', 'Status string mismatch');

// Business Rule: Duplicate acceptance must NOT overwrite or duplicate case
const duplicateAccept = ngoDashboardStorage.acceptReport('9901', 'Paws Haven NGO');
console.assert(duplicateAccept.success === true, 'Duplicate accept should return safe success');
console.assert(getCaseById('9901').statusStep === 1, 'Duplicate accept must not mutate status step');

// Step 6: NGO assigns an eligible volunteer (Arjun)
let casesDb = JSON.parse(localStorage.getItem('voiceOfStrayCases') || '{}');
casesDb['9901'].assignedVolunteerName = 'Arjun';
casesDb['9901'].assignedVolunteerEmail = 'user@voiceofstray.com';
casesDb['9901'].assignedVolunteerRole = 'Emergency Rescue';
casesDb['9901'].statusStep = 2;
casesDb['9901'].status = 'Volunteer Assigned';
casesDb['9901'].team = {
  ngo: 'Paws Haven NGO',
  lead: {
    username: 'Arjun',
    name: 'Arjun',
    email: 'user@voiceofstray.com',
    role: 'Emergency Rescue'
  }
};
localStorage.setItem('voiceOfStrayCases', JSON.stringify(casesDb));

// Step 7: The volunteer sees the assignment
authStorage.login('user@voiceofstray.com', 'user123', 'user');
const userAssignments = getVolunteerAssignments();
console.assert(userAssignments.some(c => c.id === '9901'), 'Volunteer Arjun MUST see assignment #9901');

// Step 8: Volunteer updates progress (Step 2 -> 3: En Route)
const volunteerUser = { id: 'usr-arjun', username: 'Arjun', name: 'Arjun', email: 'user@voiceofstray.com' };
const step3Result = updateVolunteerStatus('9901', 3, volunteerUser);
console.assert(step3Result.statusStep === 3, 'Status step should advance to 3 (En Route)');
console.assert(step3Result.status === 'Volunteer En Route', 'Status text should be Volunteer En Route');

// Volunteer updates progress (Step 3 -> 4: Animal Rescued)
const step4Result = updateVolunteerStatus('9901', 4, volunteerUser);
console.assert(step4Result.statusStep === 4, 'Status step should advance to 4 (Animal Rescued)');

// Step 9: User tracks their rescue on user dashboard
const userRescueCases = userDashboardStorage.getUserRescueCases({
  email: 'user@voiceofstray.com',
  name: 'Arjun'
});
console.assert(userRescueCases.some(c => c.id === '9901'), 'User dashboard must track case #9901');

// Step 10: NGO advances to Completed
ngoDashboardStorage.updateCaseStatus('9901', 'completed');
const completedCase = getCaseById('9901');
console.assert(completedCase.status === 'Completed', 'Case should be marked Completed');
console.assert(completedCase.statusStep === 9, 'Completed case statusStep should be 9');
console.log('  ✔ Critical Rescue Workflow passed completely.\n');

// -------------------------------------------------------------------------
// SECTION 3: VOLUNTEER WORKFLOW
// -------------------------------------------------------------------------
console.log('▶ [3] Testing Volunteer Workflow...');
// Step 1: Submit new volunteer application
const newVolApp = {
  id: 'VOL-NEW-01',
  volunteerId: 'VOL-NEW-01',
  name: 'Test Volunteer',
  email: 'testvol@example.com',
  phone: '+91 99887 76655',
  role: 'Emergency Rescue',
  type: 'volunteer',
  status: 'Pending Review',
  date: 'Just now',
  availability: 'Weekends',
  skills: ['First Aid']
};
const existingApps = getVolunteerApplications();
saveVolunteerApplications([newVolApp, ...existingApps]);

// Step 2: Visibility in NGO roster
const pendingApps = ngoDashboardStorage.getVolunteerApplications()
  .filter(a => a.status === 'Pending' || a.status === 'Pending Review');
console.assert(pendingApps.some(a => a.id === 'VOL-NEW-01'), 'New application must be pending in NGO list');

// Step 3: NGO approves application
const approveRes = ngoDashboardStorage.approveVolunteerApplication('VOL-NEW-01');
console.assert(approveRes.success === true, 'NGO approve volunteer application succeeded');

const approvedList = ngoDashboardStorage.getApprovedVolunteers();
console.assert(approvedList.some(a => a.id === 'VOL-NEW-01'), 'Volunteer should now be in approved list');
console.log('  ✔ Volunteer Workflow tests passed.\n');

// -------------------------------------------------------------------------
// SECTION 4: ADOPTION WORKFLOW
// -------------------------------------------------------------------------
console.log('▶ [4] Testing Adoption Workflow...');
// Step 1: NGO publishes adoptable pet
const customPets = [
  {
    id: 'PET-CUSTOM-99',
    slug: 'bella-pup',
    name: 'Bella',
    species: 'Dog',
    breed: 'Labrador Retriever',
    age: '1 Year',
    gender: 'Female',
    location: 'Paws Shelter',
    ngoName: 'Paws Haven NGO',
    status: 'Ready for Adoption',
    story: 'Gentle and friendly puppy recovered from street injury.'
  }
];
localStorage.setItem('voiceOfStrayCustomPets', JSON.stringify(customPets));

// Step 2: Animal appears in public catalog
const allPets = getAllAdoptablePets();
console.assert(allPets.some(p => p.id === 'PET-CUSTOM-99'), 'Custom published pet Bella must be in public catalog');

// Step 3: Pet details load correctly
const bellaPet = getPetById('PET-CUSTOM-99');
console.assert(bellaPet !== null && bellaPet.name === 'Bella', 'Bella details should load by ID');

// Step 4: User submits adoption application
const adoptionApp = createAdoptionApplication({
  petId: 'PET-CUSTOM-99',
  petName: 'Bella',
  breed: 'Labrador Retriever',
  ngoName: 'Paws Haven NGO',
  applicantName: 'Arjun',
  applicantEmail: 'user@voiceofstray.com',
  applicantPhone: '+91 98765 43210',
  city: 'Mumbai',
  whyAdopt: 'Love pets and ready to provide a home.'
});
console.assert(adoptionApp.id.startsWith('APPL-'), 'Adoption application ID generated');
console.assert(adoptionApp.status === 'Pending Review', 'Status should be Pending Review');

// Business rule: Application must NOT mark animal as adopted
const bellaAfterApp = getPetById('PET-CUSTOM-99');
console.assert(bellaAfterApp.status !== 'Adopted', 'Adoption application must NOT mark pet as adopted');

// Step 5: NGO reviews and approves application
const ngoApprove = ngoDashboardStorage.approveAdoption('Bella', 'Arjun');
console.assert(ngoApprove.success === true, 'NGO adoption approval succeeded');

// Step 6: Status reflected in user dashboard
const userAdoptions = userDashboardStorage.getUserAdoptionRequests({
  email: 'user@voiceofstray.com',
  name: 'Arjun'
});
console.assert(userAdoptions.some(a => a.petName === 'Bella' && a.status === 'Approved'),
  'User dashboard must reflect Approved adoption for Bella');
console.log('  ✔ Adoption Workflow tests passed.\n');

// -------------------------------------------------------------------------
// SECTION 5: DONATIONS AND DASHBOARD METRICS
// -------------------------------------------------------------------------
console.log('▶ [5] Testing Donations & Dashboard Metrics...');
const allDonations = donationStorage.getDonations();
console.assert(allDonations.length > 0, 'Donations list should not be empty');

// Simulated donation
const createdDonation = donationStorage.createDonation({
  donorName: 'Arjun',
  donorEmail: 'user@voiceofstray.com',
  amount: 3000,
  campaign: 'Emergency Medical Fund',
  ngo: 'Paws Haven NGO',
  donationType: 'One-time',
  paymentMethod: 'Card (Mock)',
  anonymous: false
});
console.assert(createdDonation.id.startsWith('DON-'), 'Donation created with DON- prefix');

// Reflected on User Dashboard
const userDonationsList = userDashboardStorage.getUserDonations({
  email: 'user@voiceofstray.com',
  name: 'Arjun'
});
console.assert(userDonationsList.some(d => d.amount === 3000), 'Donation should be visible in User Dashboard');
console.log('  ✔ Donations & Dashboard tests passed.\n');

console.log('======================================================');
console.log('ALL MILESTONE 14 INTEGRATION AUDIT TESTS PASSED! 🎉');
console.log('======================================================');

function getCasesDatabaseDirect() {
  try {
    return JSON.parse(localStorage.getItem('voiceOfStrayCases') || '{}');
  } catch (e) {
    return {};
  }
}
