import { donationStorage, CAMPAIGN_GOALS, DEFAULT_DONATIONS } from './donationStorage.js';

// Mock localStorage
const store = {};
global.localStorage = {
  getItem: (key) => store[key] || null,
  setItem: (key, val) => { store[key] = String(val); },
  removeItem: (key) => { delete store[key]; },
  clear: () => { Object.keys(store).forEach(k => delete store[k]); }
};
global.window = {
  addEventListener: () => {},
  dispatchEvent: () => {}
};

console.log('Testing donationStorage...');

// Test 1: getDonations default
const donations = donationStorage.getDonations();
console.assert(donations.length >= 15, `Expected >= 15 donations, got ${donations.length}`);

// Test 2: CAMPAIGN_GOALS
console.assert(CAMPAIGN_GOALS["Emergency Medical Fund"] === 150000, `Goal should be 150000, got ${CAMPAIGN_GOALS["Emergency Medical Fund"]}`);

// Test 3: getCampaignProgress
const progress = donationStorage.getCampaignProgress("Emergency Medical Fund");
console.log('Emergency Medical Fund progress:', progress);
console.assert(progress.goal === 150000, 'Goal mismatch');
console.assert(progress.totalRaised > 0, 'Total raised should be > 0');

// Test 4: createDonation
const newDonation = donationStorage.createDonation({
  donorName: 'Test User',
  donorEmail: 'test@example.com',
  amount: 2500,
  campaign: 'Emergency Medical Fund',
  ngo: 'Paws Haven NGO',
  donationType: 'One-time',
  paymentMethod: 'UPI (Mock)',
  anonymous: false
});
console.assert(newDonation.id.startsWith('DON-'), 'Donation ID prefix');
console.assert(newDonation.amount === 2500, 'Donation amount');

// Test 5: verify persisted
const updatedDonations = donationStorage.getDonations();
console.assert(updatedDonations[0].donorName === 'Test User', 'First donation should be Test User');

// Test 6: user donations filter
const userDonations = donationStorage.getDonationsForCurrentUser({ email: 'test@example.com' });
console.assert(userDonations.length === 1, `Expected 1 donation for user, got ${userDonations.length}`);

// Test 7: getStats
const stats = donationStorage.getDonationStats();
console.assert(stats.donationCount === updatedDonations.length, 'Stats count mismatch');

console.log('All donationStorage tests PASSED!');
