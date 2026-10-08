import React from 'react';
import { Link } from 'react-router-dom';

export default function LoginForm({
  activeRole,
  onRoleSwitch,
  fullname,
  onFullnameChange,
  email,
  onEmailChange,
  password,
  onPasswordChange,
  rememberMe,
  onRememberMeChange,
  showPassword,
  onToggleShowPassword,
  error,
  isShaking,
  loading,
  onSubmit
}) {
  return (
    <main className={`glass-auth-card ${isShaking ? 'shake' : ''}`} id="form-container">
      <h2>Login Your Account</h2>
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
          <i className="ph-fill ph-buildings"></i> NGO-Shelter
        </button>
      </div>

      {/* Error message banner */}
      {error && (
        <div className="auth-error-msg" id="error-box">
          <i className="ph-bold ph-warning-circle" style={{ fontSize: '1.25rem' }}></i>
          <span id="error-text">{error}</span>
        </div>
      )}

      {/* Login Form */}
      <form id="login-form" onSubmit={onSubmit}>
        {/* Full Name / Saved Profile */}
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
            Saved Profile
          </label>
          <div className="input-box">
            <input
              type="text"
              id="fullname"
              value={fullname}
              onChange={(e) => onFullnameChange(e.target.value)}
              placeholder={
                activeRole === 'user'
                  ? 'Full Name (placeholder or autofill value (e.g. for a saved login))'
                  : 'NGO Shelter Organization Name'
              }
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

        {/* Checkbox row */}
        <div className="check-row">
          <label className="checkbox-container">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => onRememberMeChange(e.target.checked)}
            />
            <span>Remember me</span>
          </label>
          <a href="#" className="forgot-link" onClick={(e) => { e.preventDefault(); alert('Password recovery link has been simulated.'); }}>
            Forgot password?
          </a>
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
            boxShadow: '0 8px 20px rgba(249, 115, 22, 0.3)',
            cursor: loading ? 'wait' : 'pointer'
          }}
        >
          {loading ? 'Logging in...' : 'Login'}
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
        Don't have an account? <Link to="/signup">Sign Up</Link>
      </div>
    </main>
  );
}
