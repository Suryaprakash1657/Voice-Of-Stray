// Unit tests for ngoDashboardStorage.js
import assert from 'node:assert';
import {
  getCurrentNgo,
  getIncomingReports,
  acceptReport,
  getActiveRescueCases,
  updateCaseStatus,
  getVolunteerApplications,
  getApprovedVolunteers,
  approveVolunteerApplication,
  rejectVolunteerApplication,
  getPendingAdoptions,
  approveAdoption,
  rejectAdoption,
  getDonationsOverview,
  getNgoStats
} from './ngoDashboardStorage.js';

// Setup Mock localStorage for Node.js test environment
const mockStore = {};
global.localStorage = {
  getItem: (key) => mockStore[key] || null,
  setItem: (key, val) => {
    mockStore[key] = String(val);
  },
  removeItem: (key) => {
    delete mockStore[key];
  },
  clear: () => {
    Object.keys(mockStore).forEach((k) => delete mockStore[k]);
  }
};

console.log('--- Running NGO Dashboard Storage Tests ---');

// Test 1: NGO Identity
localStorage.clear();
localStorage.setItem('isLoggedIn', 'true');
localStorage.setItem('role', 'ngo');
localStorage.setItem('username', 'Paws Haven NGO');
localStorage.setItem('email', 'contact@pawshaven.org');

const identity = getCurrentNgo();
assert.strictEqual(identity.isNgo, true, 'isNgo should be true');
assert.strictEqual(identity.role, 'ngo', 'role should be ngo');
assert.strictEqual(identity.name, 'Paws Haven NGO', 'name should match');
assert.strictEqual(identity.email, 'contact@pawshaven.org', 'email should match');
console.log('✔ Test 1: getNgoIdentity passed');

// Test 2: Incoming Reports initialization & retrieval
const reports = getIncomingReports();
assert.ok(Array.isArray(reports), 'reports should be an array');
assert.ok(reports.length >= 2, 'should have initial default reports');
console.log(`✔ Test 2: getIncomingReports passed (${reports.length} incoming reports)`);

// Test 3: Accept Report workflow
const initialReportCount = reports.length;
const reportToAccept = reports[0];
const acceptResult = acceptReport(reportToAccept.id, 'Paws Haven NGO');

assert.ok(acceptResult.success, 'acceptReport should return success: true');
assert.ok(acceptResult.case, 'acceptReport should return newly created case');
assert.strictEqual(acceptResult.case.id, reportToAccept.id, 'Case ID should match report ID');
assert.strictEqual(acceptResult.case.statusStep, 1, 'Case statusStep should be 1 (Waiting for Volunteer)');
assert.strictEqual(acceptResult.case.status, 'Waiting for Volunteer', 'Case status should be Waiting for Volunteer');

const updatedReports = getIncomingReports();
assert.strictEqual(updatedReports.length, initialReportCount - 1, 'Report should be removed from incoming reports');

const activeCases = getActiveRescueCases();
const foundCase = activeCases.find((c) => c.id === reportToAccept.id);
assert.ok(foundCase, 'Accepted case should now be in active cases');
console.log('✔ Test 3: acceptReport workflow passed');

// Test 4: Case Status Updates
// Update to reached_clinic
const clinicResult = updateCaseStatus(reportToAccept.id, 'reached_clinic');
assert.ok(clinicResult.success, 'updateCaseStatus should succeed');
assert.strictEqual(clinicResult.case.statusStep, 5, 'Status step should be 5 for clinic');
assert.strictEqual(clinicResult.case.status, 'Treatment', 'Status should be Treatment');

// Update to completed
const completedResult = updateCaseStatus(reportToAccept.id, 'completed');
assert.ok(completedResult.success, 'updateCaseStatus should succeed');
assert.strictEqual(completedResult.case.statusStep, 9, 'Status step should be 9 for completed');
assert.strictEqual(completedResult.case.status, 'Completed', 'Status should be Completed');
console.log('✔ Test 4: updateCaseStatus passed');

// Test 5: Volunteer Applications
localStorage.setItem(
  'voiceOfStrayVolunteerApplications',
  JSON.stringify([
    {
      id: 'VOL-TEST-1',
      name: 'Rohan Sharma',
      email: 'rohan@example.com',
      role: 'Emergency Rescue',
      status: 'Pending',
      date: '2026-06-18'
    }
  ])
);

const volApps = getVolunteerApplications();
assert.strictEqual(volApps.length, 1, 'Should have 1 application');

approveVolunteerApplication('VOL-TEST-1');
const approvedVols = getApprovedVolunteers();
assert.ok(approvedVols.some((v) => v.id === 'VOL-TEST-1'), 'Approved volunteer should appear in approved list');

// Notifications check
const notifs = JSON.parse(localStorage.getItem('voiceOfStrayNotifications') || '[]');
assert.ok(notifs.length > 0, 'Notification should be created on approval');
console.log('✔ Test 5: Volunteer Application approval & notification passed');

// Test 6: Adoption Requests
localStorage.setItem(
  'voiceOfStrayAdoptions',
  JSON.stringify([
    {
      id: 'ADOPT-TEST-1',
      petName: 'Rocky',
      applicantName: 'Sneha',
      status: 'Pending Review'
    }
  ])
);

const pendingAdoptions = getPendingAdoptions();
assert.ok(pendingAdoptions.some((a) => a.petName === 'Rocky'), 'Should have pending adoption for Rocky');

approveAdoption('Rocky', 'Sneha');
const updatedAdoptions = JSON.parse(localStorage.getItem('voiceOfStrayAdoptions'));
const rockyApp = updatedAdoptions.find((a) => a.petName === 'Rocky');
assert.strictEqual(rockyApp.status, 'Approved', 'Adoption status should be Approved');
console.log('✔ Test 6: Adoption approval passed');

// Test 7: Donations Overview
const donationsOverview = getDonationsOverview();
assert.ok(typeof donationsOverview.todayTotal === 'number', 'todayTotal should be number');
assert.ok(typeof donationsOverview.monthlyTotal === 'number', 'monthlyTotal should be number');
assert.ok(typeof donationsOverview.grandTotal === 'number', 'grandTotal should be number');
assert.ok(typeof donationsOverview.activeDonorsCount === 'number', 'activeDonorsCount should be number');
assert.ok(Array.isArray(donationsOverview.recentDonations), 'recentDonations should be array');
console.log(`✔ Test 7: getDonationsOverview passed (Grand total: ₹${donationsOverview.grandTotal})`);

// Test 8: NGO Stats
const stats = getNgoStats();
assert.ok(typeof stats.activeCasesCount === 'number', 'activeCasesCount should be number');
assert.ok(typeof stats.resolvedCasesCount === 'number', 'resolvedCasesCount should be number');
assert.ok(typeof stats.availableVolunteersCount === 'number', 'availableVolunteersCount should be number');
assert.ok(typeof stats.incomingReportsCount === 'number', 'incomingReportsCount should be number');
console.log('✔ Test 8: getNgoStats passed');

console.log('\nAll 8 NGO Dashboard Storage Tests Passed Successfully! 🎉');
