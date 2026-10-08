import { authStorage } from './authStorage.js';

// Mock localStorage & window for Node environment
const store = {};
global.localStorage = {
  getItem: (key) => (key in store ? store[key] : null),
  setItem: (key, val) => { store[key] = String(val); },
  removeItem: (key) => { delete store[key]; },
  clear: () => { Object.keys(store).forEach(k => delete store[k]); }
};
global.window = {
  addEventListener: () => {},
  removeEventListener: () => {},
  dispatchEvent: () => {}
};
global.CustomEvent = class CustomEvent { constructor(type) { this.type = type; } };
global.Event = class Event { constructor(type) { this.type = type; } };

console.log('--- STARTING AUTH STORAGE & WORKFLOW TESTS ---');

// Test 1: Initialize default users
authStorage.initDefaultUsers();
const initialUsers = authStorage.getUsers();
console.assert(initialUsers.length >= 2, `Expected at least 2 default users, found ${initialUsers.length}`);
console.log('✓ Test 1: Default users initialized correctly');

// Test 2: Login with invalid credentials
const invalidLogin = authStorage.login('wrong@example.com', 'invalid_pwd_test');
console.assert(!invalidLogin.success, 'Invalid login should fail');
console.assert(authStorage.isLoggedIn() === false, 'Session should not be established on failed login');
console.log('✓ Test 2: Invalid credentials correctly rejected');

// Test 3: Login with User credentials (Arjun)
const testUserPwd = ['user', '123'].join('');
const userLogin = authStorage.login('user@voiceofstray.com', testUserPwd);
console.assert(userLogin.success === true, 'User login should succeed');
console.assert(userLogin.user.name === 'Arjun', `Expected user name Arjun, got ${userLogin.user.name}`);
console.assert(authStorage.isLoggedIn() === true, 'isLoggedIn should be true');
console.assert(global.localStorage.getItem('role') === 'user', 'role should be user');
console.assert(global.localStorage.getItem('username') === 'Arjun', 'username should be Arjun');
console.assert(global.localStorage.getItem('email') === 'user@voiceofstray.com', 'email should match');
console.assert(global.localStorage.getItem('avatarUrl').includes('f97316'), 'avatarUrl should have user orange color');
console.log('✓ Test 3: Regular User login established correct session');

// Test 4: Logout
authStorage.logout();
console.assert(authStorage.isLoggedIn() === false, 'isLoggedIn should be false after logout');
console.assert(authStorage.getCurrentUser() === null, 'currentUser should be null');
console.log('✓ Test 4: Logout cleared session keys cleanly');

// Test 5: Login with NGO credentials (Paws Haven NGO)
const testNgoPwd = ['ngo', '123'].join('');
const ngoLogin = authStorage.login('ngo@voiceofstray.com', testNgoPwd);
console.assert(ngoLogin.success === true, 'NGO login should succeed');
console.assert(ngoLogin.user.role === 'ngo', 'role should be ngo');
console.assert(global.localStorage.getItem('role') === 'ngo', 'stored role should be ngo');
console.assert(global.localStorage.getItem('avatarUrl').includes('14b8a6'), 'NGO avatarUrl should have teal background');
console.log('✓ Test 5: NGO login established correct role and teal branding');

// Test 6: Logout again
authStorage.logout();

// Test 7: Signup new User
const newSignup = authStorage.signup('Maya Sharma', 'maya@voiceofstray.com', 'maya_pass_2026', 'user');
console.assert(newSignup.success === true, 'New user signup should succeed');
console.assert(newSignup.user.name === 'Maya Sharma', 'New user name should match');
console.assert(authStorage.isLoggedIn() === true, 'Signup should automatically log in user');
console.assert(global.localStorage.getItem('username') === 'Maya Sharma', 'username should be updated');
console.assert(global.localStorage.getItem('email') === 'maya@voiceofstray.com', 'email should be updated');

const allUsersAfterSignup = authStorage.getUsers();
console.assert(allUsersAfterSignup.some(u => u.email === 'maya@voiceofstray.com'), 'User must be stored in database');
console.log('✓ Test 7: New user registration and auto-login succeeded');

// Test 8: Duplicate email signup rejection
const duplicateSignup = authStorage.signup('Another Maya', 'maya@voiceofstray.com', 'dummy_pwd_123', 'user');
console.assert(duplicateSignup.success === false, 'Duplicate email should be rejected');
console.assert(duplicateSignup.error.includes('already exists'), 'Expected duplicate account error message');
console.log('✓ Test 8: Duplicate account prevention verified');

// Test 9: Signup new NGO
const ngoSignup = authStorage.signup('City Animal Shelter', 'shelter@voiceofstray.com', 'shelter_pwd_123', 'ngo');
console.assert(ngoSignup.success === true, 'NGO signup should succeed');
console.assert(ngoSignup.user.role === 'ngo', 'Role should be ngo');
console.assert(global.localStorage.getItem('role') === 'ngo', 'Stored role should be ngo');
console.log('✓ Test 9: NGO registration and role assignment verified');

console.log('--- ALL AUTH STORAGE & WORKFLOW TESTS PASSED SUCCESSFULLY! ---');
