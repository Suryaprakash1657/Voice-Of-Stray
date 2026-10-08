import { useState, useEffect, useCallback } from 'react';
import { authStorage } from '../services/authStorage.js';

export function useAuth() {
  const [currentUser, setCurrentUser] = useState(authStorage.getCurrentUser());
  const [isLoggedIn, setIsLoggedIn] = useState(authStorage.isLoggedIn());
  const [role, setRole] = useState(currentUser?.role || 'user');

  // Form states
  const [activeRole, setActiveRole] = useState('user'); // 'user' | 'ngo'
  const [fullname, setFullname] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isShaking, setIsShaking] = useState(false);
  const [loading, setLoading] = useState(false);

  // Sync state with storage
  const syncAuth = useCallback(() => {
    const user = authStorage.getCurrentUser();
    const loggedIn = authStorage.isLoggedIn();
    setCurrentUser(user);
    setIsLoggedIn(loggedIn);
    setRole(user?.role || 'user');
  }, []);

  useEffect(() => {
    authStorage.initDefaultUsers();
    syncAuth();

    const handleStorage = () => syncAuth();
    window.addEventListener('storage', handleStorage);
    window.addEventListener('auth-change', handleStorage);

    return () => {
      window.removeEventListener('storage', handleStorage);
      window.removeEventListener('auth-change', handleStorage);
    };
  }, [syncAuth]);

  // Trigger error shake animation
  const triggerError = (msg) => {
    setError(msg);
    setIsShaking(false);
    setTimeout(() => {
      setIsShaking(true);
    }, 10);
  };

  // Switch role tab
  const handleRoleSwitch = (newRole) => {
    setActiveRole(newRole);
    setError('');
  };

  // Toggle password visibility
  const toggleShowPassword = () => {
    setShowPassword((prev) => !prev);
  };

  // Calculate password strength score (0 to 4)
  const getPasswordStrength = () => {
    if (!password) return { score: 0, label: 'Empty', color: 'var(--text-muted)' };
    let score = 0;
    if (password.length >= 4) score++;
    if (password.length >= 6) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[A-Z]/.test(password) && /[^A-Za-z0-9]/.test(password)) score++;

    if (score === 1) return { score: 1, label: 'Weak', color: '#ef4444' };
    if (score === 2) return { score: 2, label: 'Fair', color: '#f97316' };
    if (score === 3) return { score: 3, label: 'Good', color: '#fbbf24' };
    if (score >= 4) return { score: 4, label: 'Strong', color: '#22c55e' };
    return { score: 0, label: 'Empty', color: 'var(--text-muted)' };
  };

  // Handle Login submission
  const handleLogin = (e, onSuccess) => {
    if (e && e.preventDefault) e.preventDefault();
    setError('');

    if (!email.trim() || !password.trim()) {
      triggerError('Please enter both email and password.');
      return;
    }

    setLoading(true);
    const result = authStorage.login(email, password, activeRole);
    setLoading(false);

    if (result.success) {
      setError('');
      syncAuth();
      if (onSuccess) onSuccess(result.user);
    } else {
      triggerError(result.error || 'Invalid email or password');
    }
  };

  // Handle Signup submission
  const handleSignup = (e, onSuccess) => {
    if (e && e.preventDefault) e.preventDefault();
    setError('');

    if (!fullname.trim()) {
      triggerError(activeRole === 'ngo' ? 'Please enter the organization name.' : 'Please enter your full name.');
      return;
    }

    if (!email.trim() || !email.includes('@')) {
      triggerError('Please enter a valid email address.');
      return;
    }

    if (!password.trim() || password.length < 4) {
      triggerError('Password must be at least 4 characters long.');
      return;
    }

    setLoading(true);
    const result = authStorage.signup(fullname, email, password, activeRole);
    setLoading(false);

    if (result.success) {
      setError('');
      syncAuth();
      if (onSuccess) onSuccess(result.user);
    } else {
      triggerError(result.error || 'Registration failed.');
    }
  };

  // Handle Logout
  const handleLogout = (onSuccess) => {
    authStorage.logout();
    syncAuth();
    if (onSuccess) onSuccess();
  };

  return {
    currentUser,
    isLoggedIn,
    role,
    activeRole,
    fullname,
    email,
    password,
    rememberMe,
    showPassword,
    error,
    isShaking,
    loading,
    setFullname,
    setEmail,
    setPassword,
    setRememberMe,
    handleRoleSwitch,
    toggleShowPassword,
    getPasswordStrength,
    handleLogin,
    handleSignup,
    handleLogout
  };
}
