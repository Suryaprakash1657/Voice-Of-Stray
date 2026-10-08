import React from 'react';
import { useNavigate } from 'react-router-dom';
import AuthLayout from './components/AuthLayout.jsx';
import LoginForm from './components/LoginForm.jsx';
import { useAuth } from './hooks/useAuth.js';
import './auth.css';

export default function Login() {
  const navigate = useNavigate();
  const {
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
    handleLogin
  } = useAuth();

  const handleLoginSubmit = (e) => {
    handleLogin(e, (user) => {
      const targetPath = user.role === 'ngo' ? '/ngo-dashboard' : '/user-dashboard';
      navigate(targetPath);
    });
  };

  return (
    <AuthLayout
      title="Welcome Back to the"
      titleHighlight="Rescue Mission"
      subtitle="Continue helping strays through rescue, adoption, volunteering, and community support."
      stats={{
        left1: { count: '15,000+', label: 'Animals Rescued', icon: 'ph-fill ph-paw-print' },
        left2: { count: '7,000+', label: 'Active Volunteers', icon: 'ph-fill ph-users' },
        right1: { count: '450+', label: 'NGO Partners', icon: 'ph-fill ph-shield-check', isNgo: true },
        right2: { count: '24/7', label: 'Rescue Network', icon: 'ph-fill ph-clock' }
      }}
    >
      <LoginForm
        activeRole={activeRole}
        onRoleSwitch={handleRoleSwitch}
        fullname={fullname}
        onFullnameChange={setFullname}
        email={email}
        onEmailChange={setEmail}
        password={password}
        onPasswordChange={setPassword}
        rememberMe={rememberMe}
        onRememberMeChange={setRememberMe}
        showPassword={showPassword}
        onToggleShowPassword={toggleShowPassword}
        error={error}
        isShaking={isShaking}
        loading={loading}
        onSubmit={handleLoginSubmit}
      />
    </AuthLayout>
  );
}
