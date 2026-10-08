import React from 'react';
import { Link } from 'react-router-dom';

export default function SignupForm({
  activeRole,
  onRoleSwitch,
  fullname,
  onFullnameChange,
  email,
  onEmailChange,
  password,
  onPasswordChange,
  showPassword,
  onToggleShowPassword,
  passwordStrength,
  error,
  isShaking,
  loading,
  onSubmit
}) {
  return (
    <main className={`glass-auth-card ${isShaking ? 'shake' : ''}`} id="form-container">
      <h2>Create Your Account</h2>
      <p className="card-subtitle">Choose the account type that suits you best</p>

      {/* Segmented Selector Slider */}
      <div className="segmented-tab-control">
        <button
          type="button"
          className={`segmented-btn ${activeRole === 'user' ? 'active' : ''}`}
          id="user-tab"
          onClick={() => onRoleSwitch('user')}
        >
          <i className="ph-fill ph-user"></i> User
        </button>
        <button
          type="button"
          className={`segmented-btn ${activeRole === 'ngo' ? 'active' : ''}`}
          id="ngo-tab"
          onClick={() => onRoleSwitch('ngo')}
        >
          <i className="ph-fill ph-buildings"></i> NGO / Shelter
        </button>
      </div>

      {/* Error message banner */}
      {error && (
        <div className="auth-error-msg" id="error-box">
          <i className="ph-bold ph-warning-circle" style={{ fontSize: '1.25rem' }}></i>
          <span id="error-text">{error}</span>
        </div>
      )}

      {/* Signup Form */}
      <form id="signup-form" onSubmit={onSubmit}>
        {/* Full Name */}
        <div className="input-group">
          <label
            style={{
              display: 'block',
              fontSize: '0.85rem',
              fontWeight: 700,
              marginBottom: '6px',
              color: 'var(--text-main, #0f172a)'
            }}
          >
            {activeRole === 'ngo' ? 'Organization Name' : 'Full Name'}
          </label>
          <div className="input-box">
            <input
              type="text"
              id="fullname"
              value={fullname}
              onChange={(e) => onFullnameChange(e.target.value)}
              placeholder={activeRole === 'user' ? 'Full Name' : 'NGO Shelter Organization Name'}
              required
            />
            <i className="ph ph-user input-icon"></i>
          </div>
        </div>

        {/* Email Address */}
        <div className="input-group">
          <label
            style={{
              display: 'block',
              fontSize: '0.85rem',
              fontWeight: 700,
              marginBottom: '6px',
              color: 'var(--text-main, #0f172a)'
            }}
          >
            Email Address
          </label>
          <div className="input-box">
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => onEmailChange(e.target.value)}
              placeholder="Email Address"
              required
            />
            <i className="ph ph-envelope input-icon"></i>
          </div>
        </div>

        {/* Password */}
        <div className="input-group" style={{ marginBottom: '12px' }}>
          <label
            style={{
              display: 'block',
              fontSize: '0.85rem',
              fontWeight: 700,
              marginBottom: '6px',
              color: 'var(--text-main, #0f172a)'
            }}
          >
            Password
          </label>
          <div className="input-box">
            <input
              type={showPassword ? 'text' : 'password'}
              id="password"
              value={password}
              onChange={(e) => onPasswordChange(e.target.value)}
              placeholder="Password"
              required
            />
            <i className="ph ph-lock input-icon"></i>
            <i
              className={`ph ${showPassword ? 'ph-eye' : 'ph-eye-slash'} password-toggle`}
              id="toggle-pwd-icon"
              onClick={onToggleShowPassword}
              title={showPassword ? 'Hide password' : 'Show password'}
            ></i>
          </div>
        </div>

        {/* Password Strength Meter */}
        <div className="input-group" style={{ marginBottom: '24px' }}>
          <div className="pwd-strength-container">
            <span className="strength-indicator-label">
              Password strength:{' '}
              <span id="strength-label" style={{ color: passwordStrength.color }}>
                {passwordStrength.label}
              </span>
            </span>
            <div className="pwd-strength-meter">
              <div
                className="meter-bar"
                id="bar-1"
                style={{
                  backgroundColor: passwordStrength.score >= 1 ? passwordStrength.color : 'var(--border, #e2e8f0)'
                }}
              ></div>
              <div
                className="meter-bar"
                id="bar-2"
                style={{
                  backgroundColor: passwordStrength.score >= 2 ? passwordStrength.color : 'var(--border, #e2e8f0)'
                }}
              ></div>
              <div
                className="meter-bar"
                id="bar-3"
                style={{
                  backgroundColor: passwordStrength.score >= 3 ? passwordStrength.color : 'var(--border, #e2e8f0)'
                }}
              ></div>
              <div
                className="meter-bar"
                id="bar-4"
                style={{
                  backgroundColor: passwordStrength.score >= 4 ? passwordStrength.color : 'var(--border, #e2e8f0)'
                }}
              ></div>
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="btn-premium primary"
          disabled={loading}
          style={{
            width: '100%',
            justifyContent: 'center',
            padding: '14px',
            fontSize: '1.05rem',
            backgroundColor: '#9a3412',
            boxShadow: '0 8px 20px rgba(154, 52, 18, 0.3)',
            cursor: loading ? 'wait' : 'pointer'
          }}
        >
          {loading ? 'Creating Account...' : 'Signup'}
        </button>

        {/* Google Auth Placeholder */}
        <button
          type="button"
          className="btn-google"
          onClick={() => alert('Google authentication placeholder (to be connected in backend phase).')}
        >
          <img
            src="https://img.icons8.com/?size=100&id=V5cGWnc9R4xj&format=png&color=000000"
            style={{ borderRadius: '50%', width: '18px', height: '18px' }}
            alt="G"
          />
          Continue with Google
        </button>
      </form>

      <div className="or-divider">OR</div>

      <div className="auth-alt-footer">
        Already have an account? <Link to="/login">Login</Link>
      </div>
    </main>
  );
}
