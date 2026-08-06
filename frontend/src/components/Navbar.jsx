import React, { useState, useEffect, useRef } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';

export default function Navbar() {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState({
    name: 'Arjun',
    email: 'user@voiceofstray.com',
    role: 'user',
    avatarUrl: '',
    accountType: 'Regular User'
  });
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Sync volunteer status against persistent global list
  const syncVolunteerAndAuthSession = () => {
    const loggedIn = localStorage.getItem("isLoggedIn") === "true";
    setIsLoggedIn(loggedIn);

    if (loggedIn) {
      const username = localStorage.getItem("username") || "Arjun";
      const email = localStorage.getItem("email") || "user@voiceofstray.com";
      const role = localStorage.getItem("role") || "user";
      const avatarUrl = localStorage.getItem("avatarUrl") || `https://ui-avatars.com/api/?name=${encodeURIComponent(username)}&background=f97316&color=fff&bold=true`;
      
      let isApproved = false;
      let accountType = role === 'ngo' ? 'NGO Shelter Partner' : 'Regular User';
      let status = "Not Applied";
      let userAppRole = "";
      let userAppAvailability = "Weekends";

      if (role === 'user') {
        const apps = JSON.parse(localStorage.getItem("voiceOfStrayVolunteerApplications") || "[]");
        const userApp = apps.find(a => a && a.email && a.email.toLowerCase() === email.toLowerCase());

        if (userApp) {
          if (userApp.status === "Approved" || userApp.status === "Active" || userApp.status === "Inactive" || userApp.status === "Unavailable") {
            status = "Approved Volunteer";
            isApproved = true;
            accountType = userApp.role && userApp.role.includes("Rescue") ? "Rescuer" : "Volunteer";
          } else if (userApp.status === "Rejected") {
            status = "Rejected";
          } else if (userApp.status === "Removed") {
            status = "Removed";
          } else if (userApp.status === "Pending Review" || userApp.status === "Pending") {
            status = "Pending Review";
          }
          userAppRole = userApp.role || "";
          userAppAvailability = userApp.availability || "Weekends";
        }
        
        // Sync voiceOfStrayVolunteer cache
        let volMeta = {};
        const storedVolMeta = localStorage.getItem("voiceOfStrayVolunteer");
        if (storedVolMeta) {
          try { volMeta = JSON.parse(storedVolMeta); } catch(e){}
        }
        
        if (volMeta.status !== status || volMeta.role !== userAppRole) {
          volMeta.status = status;
          volMeta.role = userAppRole;
          volMeta.availability = userAppAvailability;
          if (status === "Not Applied" || status === "Removed") {
            localStorage.removeItem("voiceOfStrayVolunteer");
          } else {
            localStorage.setItem("voiceOfStrayVolunteer", JSON.stringify(volMeta));
          }
        }
        
        // Sync with profile accountType
        const storedProfile = localStorage.getItem("voiceOfStrayUserProfile");
        if (storedProfile) {
          try {
            const profile = JSON.parse(storedProfile);
            if (profile.accountType !== accountType) {
              profile.accountType = accountType;
              localStorage.setItem("voiceOfStrayUserProfile", JSON.stringify(profile));
            }
          } catch(e){}
        }

        // Sync with currentUser and voiceOfStrayUsers
        const currentUserRaw = localStorage.getItem("currentUser");
        if (currentUserRaw) {
          try {
            const currentUser = JSON.parse(currentUserRaw);
            const userStatus = isApproved ? "Approved" : (status === "Not Applied" ? "Not Applied" : status);
            
            if (!currentUser.volunteer) {
              currentUser.volunteer = { approved: false, status: "Not Applied" };
            }
            if (currentUser.volunteer.approved !== isApproved || currentUser.volunteer.status !== userStatus) {
              currentUser.volunteer.approved = isApproved;
              currentUser.volunteer.status = userStatus;
              localStorage.setItem("currentUser", JSON.stringify(currentUser));
              
              const users = JSON.parse(localStorage.getItem("voiceOfStrayUsers") || "[]");
              const userIdx = users.findIndex(u => u && u.email && u.email.toLowerCase() === currentUser.email.toLowerCase());
              if (userIdx !== -1) {
                users[userIdx].volunteer = currentUser.volunteer;
                localStorage.setItem("voiceOfStrayUsers", JSON.stringify(users));
              }
            }
          } catch(e){}
        }
      }

      setUser({
        name: username,
        email: email,
        role: role,
        avatarUrl: avatarUrl,
        accountType: accountType
      });
    }
  };

  useEffect(() => {
    syncVolunteerAndAuthSession();
    
    // Listen for storage events (sync when login/logout/approval updates in another tab)
    const handleStorageChange = () => {
      syncVolunteerAndAuthSession();
    };
    window.addEventListener('storage', handleStorageChange);

    // Outside click listener for profile dropdown
    const handleOutsideClick = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('click', handleOutsideClick);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      document.removeEventListener('click', handleOutsideClick);
    };
  }, []);

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to log out of Voice of Stray?")) {
      // Clear ONLY session-related variables
      localStorage.removeItem("currentUser");
      localStorage.removeItem("isLoggedIn");
      localStorage.removeItem("role");
      localStorage.removeItem("username");
      localStorage.removeItem("email");
      localStorage.removeItem("avatarUrl");
      localStorage.removeItem("voiceOfStrayVolunteer"); // safe to clear as it is current-user cache
      
      setIsLoggedIn(false);
      setDropdownOpen(false);
      window.location.href = "/";
    }
  };

  const getDashboardUrl = () => {
    return user.role === 'ngo' ? '/ngo-dashboard.html' : '/user-dashboard.html';
  };

  const getActiveClass = (path) => {
    const currentPath = window.location.pathname;
    if (path === '/' && (currentPath === '/' || currentPath === '/index.html' || currentPath === '')) {
      return 'active';
    }
    return currentPath === path ? 'active' : '';
  };


  return (
    <nav className="navbar" style={{ position: 'sticky', top: 0, zIndex: 1000, boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
      <div className="nav-container">
        <Link to="/" className="logo">
          <i className="ph-fill ph-paw-print"></i>
          <span>Voice of Stray</span>
        </Link>
        <div className="nav-links">
          <NavLink to="/" className={({ isActive }) => isActive ? 'active' : ''} end>Home</NavLink>
          <NavLink to="/community" className={({ isActive }) => isActive ? 'active' : ''}>Community</NavLink>
          <NavLink to="/report" className={({ isActive }) => isActive ? 'active' : ''}>Report</NavLink>
          <NavLink to="/rescue" className={({ isActive }) => isActive ? 'active' : ''}>Rescue</NavLink>
          <NavLink to="/adopt" className={({ isActive }) => isActive ? 'active' : ''}>Adopt</NavLink>
          <NavLink to="/donate" className={({ isActive }) => isActive ? 'active' : ''}>Donate</NavLink>
          <NavLink to="/volunteer" className={({ isActive }) => isActive ? 'active' : ''}>Volunteer</NavLink>
        </div>

        {/* Guest Actions */}
        {!isLoggedIn ? (
          <div className="nav-actions guest-actions">
            <button 
              className="btn-premium primary nav-join-btn" 
              style={{ padding: '8px 24px', fontSize: '0.95rem' }}
              onClick={() => window.location.href = '/signup.html'}
            >
              Join Now
            </button>
          </div>
        ) : (
          /* Logged-In Actions */
          <div className="nav-actions logged-in-actions" style={{ display: 'flex' }}>
            {user.role !== 'ngo' && (
              <button className="icon-btn saved-pets-btn" onClick={() => navigate('/adopt')}>
                <i className="ph ph-heart"></i>
                <span className="badge-counter">3</span>
              </button>
            )}

            <button className="icon-btn" onClick={() => window.location.href = '/notifications.html'}>
              <i className="ph ph-bell"></i>
            </button>

            <div className="profile-pic" ref={dropdownRef} onClick={() => setDropdownOpen(!dropdownOpen)}>
              <img src={user.avatarUrl} alt="Profile" />
              
              {dropdownOpen && (
                <div className="profile-dropdown show" style={{ display: 'flex' }} onClick={(e) => e.stopPropagation()}>
                  <div className="dropdown-header">
                    <span className="dropdown-name">{user.name}</span>
                    <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 500 }}>{user.email}</span>
                    <span className={`dropdown-role-badge ${user.role === 'ngo' ? 'ngo' : 'user'}`}>
                      {user.role === 'ngo' ? (localStorage.getItem('ngoType') || 'NGO Shelter Partner') : user.accountType}
                    </span>
                  </div>
                  <div className="dropdown-divider"></div>
                  
                  {user.role === 'ngo' ? (
                    <>
                      <a href={getDashboardUrl()} className="dropdown-item">
                        <i className="ph ph-squares-four"></i> Dashboard
                      </a>
                      <a href="/ngo-edit-profile.html" className="dropdown-item">
                        <i className="ph ph-user-gear"></i> Edit NGO Profile
                      </a>
                      <a href="/ngo-settings.html" className="dropdown-item">
                        <i className="ph ph-gear"></i> NGO Settings
                      </a>
                    </>
                  ) : (
                    <>
                      <a href={getDashboardUrl()} className="dropdown-item">
                        <i className="ph ph-squares-four"></i> Dashboard
                      </a>
                      {(user.accountType === 'Volunteer' || user.accountType === 'Rescuer') && (
                        <a href="/volunteer-activities.html" className="dropdown-item">
                          <i className="ph ph-squares-four"></i> Volunteer Activities
                        </a>
                      )}
                      <a href="/user-edit-profile.html" className="dropdown-item">
                        <i className="ph ph-user-gear"></i> Edit Profile
                      </a>
                      <a href="/adopt.html" className="dropdown-item">
                        <i className="ph ph-heart"></i> Saved Animals
                      </a>
                    </>
                  )}
                  
                  <div className="dropdown-divider"></div>
                  <div className="dropdown-item logout-btn" onClick={handleLogout}>
                    <i className="ph ph-sign-out"></i> Log Out
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
