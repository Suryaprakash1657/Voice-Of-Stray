import React from 'react';
import { useNavigate } from 'react-router-dom';
import AuthLayout from './components/AuthLayout.jsx';
import SignupForm from './components/SignupForm.jsx';
import { useAuth } from './hooks/useAuth.js';
import './auth.css';

export default function Signup() {
  const navigate = useNavigate();
  const {
    activeRole,
    fullname,
    email,
    password,
    showPassword,
    error,
    isShaking,
    loading,
    setFullname,
    setEmail,
    setPassword,
    handleRoleSwitch,
    toggleShowPassword,
    getPasswordStrength,
    handleSignup
  } = useAuth();

  const handleSignupSubmit = (e) => {
    handleSignup(e, (user) => {
      const targetPath = user.role === 'ngo' ? '/ngo-dashboard' : '/user-dashboard';
      navigate(targetPath);
    });
  };

  const passwordStrength = getPasswordStrength();

  return (
    <AuthLayout
      title="Become a Voice for the"
      titleHighlight="Voiceless"
      subtitle="Join thousands of rescuers, adopters, volunteers, and NGOs"
      quote="Every rescue begins with one compassionate human."
      stats={{
        left1: { count: '12,000+', label: 'Animals Rescued', icon: 'ph-fill ph-paw-print' },
        left2: { count: '5,000+', label: 'Volunteers', icon: 'ph-fill ph-users' },
        right1: { count: '300+', label: 'NGO Partners', icon: 'ph-fill ph-shield-check', isNgo: true },
        right2: { count: '24/7', label: 'Rescue Network', icon: 'ph-fill ph-clock' }
      }}
    >
      <SignupForm
        activeRole={activeRole}
        onRoleSwitch={handleRoleSwitch}
        fullname={fullname}
        onFullnameChange={setFullname}
        email={email}
        onEmailChange={setEmail}
        password={password}
        onPasswordChange={setPassword}
        showPassword={showPassword}
        onToggleShowPassword={toggleShowPassword}
        passwordStrength={passwordStrength}
        error={error}
        isShaking={isShaking}
        loading={loading}
        onSubmit={handleSignupSubmit}
      />
    </AuthLayout>
  );
}
