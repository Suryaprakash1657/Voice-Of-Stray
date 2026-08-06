/**
 * Voice of Stray Navigation Controller
 * Centralizes the authentication-aware navbar rendering states (Guest vs. Logged-In).
 * Scalable to support future backend auth integrations (e.g. Firebase Auth).
 */

// Initialize voiceOfStrayUsers if not present
(function initDefaultUsers() {
    const defaultUsers = [
        {
            id: "usr-arjun",
            name: "Arjun",
            email: "user@voiceofstray.com",
            password: "user123",
            role: "user",
            volunteer: {
                approved: false,
                status: "Not Applied"
            }
        },
        {
            id: "ngo-paws",
            name: "Paws Haven NGO",
            email: "ngo@voiceofstray.com",
            password: "ngo123",
            role: "ngo",
            volunteer: {
                approved: false,
                status: "Not Applied"
            }
        }
    ];
    if (!localStorage.getItem("voiceOfStrayUsers")) {
        localStorage.setItem("voiceOfStrayUsers", JSON.stringify(defaultUsers));
    }
})();

// Function to keep legacy keys synchronized with currentUser
function syncAuthKeys() {
    const currentUserRaw = localStorage.getItem("currentUser");
    if (!currentUserRaw) {
        localStorage.removeItem("isLoggedIn");
        localStorage.removeItem("role");
        localStorage.removeItem("username");
        localStorage.removeItem("email");
        localStorage.removeItem("avatarUrl");
        localStorage.removeItem("voiceOfStrayVolunteer");
    } else {
        try {
            const user = JSON.parse(currentUserRaw);
            localStorage.setItem("isLoggedIn", "true");
            localStorage.setItem("role", user.role);
            localStorage.setItem("username", user.name);
            localStorage.setItem("email", user.email);
            
            const bgClr = user.role === 'ngo' ? '14b8a6' : 'f97316';
            const avatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=${bgClr}&color=fff&bold=true`;
            localStorage.setItem("avatarUrl", avatarUrl);
            
            if (user.role === 'user') {
                if (user.volunteer && user.volunteer.status !== "Not Applied") {
                    let volMeta = {};
                    const storedVolMeta = localStorage.getItem("voiceOfStrayVolunteer");
                    if (storedVolMeta) {
                        try { volMeta = JSON.parse(storedVolMeta); } catch(e){}
                    }
                    volMeta.status = user.volunteer.approved ? "Approved Volunteer" : user.volunteer.status;
                    volMeta.role = volMeta.role || "Emergency Rescue";
                    volMeta.availability = volMeta.availability || "Weekends";
                    localStorage.setItem("voiceOfStrayVolunteer", JSON.stringify(volMeta));
                } else {
                    localStorage.removeItem("voiceOfStrayVolunteer");
                }
            } else {
                localStorage.removeItem("voiceOfStrayVolunteer");
            }
        } catch(e) {}
    }
}

// Call sync immediately
syncAuthKeys();

// Access Control Guard
(function enforceAccessControl() {
    const path = window.location.pathname;
    const page = path.split("/").pop();
    
    const currentUserRaw = localStorage.getItem("currentUser");
    let currentUser = null;
    if (currentUserRaw) {
        try { currentUser = JSON.parse(currentUserRaw); } catch(e){}
    }
    
    // Determine approved volunteer status directly from voiceOfStrayVolunteerApplications (Authoritative source)
    let isApprovedVolunteer = false;
    if (currentUser && currentUser.role === "user") {
        const currentEmail = localStorage.getItem("email") || currentUser.email;
        if (currentEmail) {
            const apps = JSON.parse(localStorage.getItem("voiceOfStrayVolunteerApplications") || "[]");
            const userApp = apps.find(a => a && a.email && a.email.toLowerCase() === currentEmail.toLowerCase());
            if (userApp) {
                if (userApp.status === "Approved" || userApp.status === "Active" || userApp.status === "Inactive" || userApp.status === "Unavailable") {
                    isApprovedVolunteer = true;
                }
            }
        }
    }
    
    // Pages lists
    const userPages = [
        "user-dashboard.html",
        "user-edit-profile.html",
        "volunteer.html",
        "adopt-apply.html"
    ];
    
    const ngoPages = [
        "ngo-dashboard.html",
        "ngo-pet-manage.html",
        "ngo-volunteer-manage.html",
        "ngo-reports-manage.html",
        "ngo-settings.html",
        "ngo-rescue-manage.html",
        "ngo-adopt-manage.html",
        "ngo-report-review.html",
        "ngo-edit-profile.html",
        "ngo-donation-manage.html"
    ];
    
    const volunteerPages = [
        "volunteer-activities.html"
    ];
    
    if (userPages.includes(page)) {
        if (!currentUser || currentUser.role !== "user") {
            window.location.href = "login.html";
        }
    } else if (ngoPages.includes(page)) {
        if (!currentUser || currentUser.role !== "ngo") {
            window.location.href = "login.html";
        }
    } else if (volunteerPages.includes(page)) {
        if (!currentUser || currentUser.role !== "user" || !isApprovedVolunteer) {
            window.location.href = "login.html";
        }
    }
})();

// Centralized dashboard routing engine
const DASHBOARD_ROUTES = {
    "user": "user-dashboard.html",
    "ngo": "ngo-dashboard.html",
    "admin": "admin-dashboard.html"
};

function getDashboardUrl() {
    const role = localStorage.getItem("role") || "user";
    return DASHBOARD_ROUTES[role] || "user-dashboard.html";
}

function applyRoleBasedRouting() {
    const dashboardUrl = getDashboardUrl();
    
    // Rewrite all anchor tags linking to user or NGO dashboard
    document.querySelectorAll("a").forEach(a => {
        const href = a.getAttribute("href");
        if (href) {
            const parts = href.split('#');
            if (parts[0] === "user-dashboard.html" || parts[0] === "ngo-dashboard.html") {
                const hash = parts[1] ? '#' + parts[1] : '';
                a.setAttribute("href", dashboardUrl + hash);
            }
        }
    });

    // Intercept dynamic redirection elements or button clicks with onclick attribute targeting dashboard
    document.addEventListener("click", function(e) {
        const target = e.target.closest("a, button, [onclick]");
        if (target) {
            if (target.tagName === "A") {
                const href = target.getAttribute("href");
                if (href) {
                    const parts = href.split('#');
                    if (parts[0] === "user-dashboard.html" || parts[0] === "ngo-dashboard.html") {
                        e.preventDefault();
                        window.location.href = dashboardUrl + (parts[1] ? '#' + parts[1] : '');
                    }
                }
            } else {
                const onclickAttr = target.getAttribute("onclick");
                if (onclickAttr && (onclickAttr.includes("user-dashboard.html") || onclickAttr.includes("ngo-dashboard.html"))) {
                    e.preventDefault();
                    e.stopPropagation();
                    // Extract hash if present in string
                    const hashMatch = onclickAttr.match(/dashboard\.html#([a-zA-Z0-9_-]+)/);
                    const hash = hashMatch ? '#' + hashMatch[1] : '';
                    window.location.href = dashboardUrl + hash;
                }
            }
        }
    }, true); // capturing phase
}

document.addEventListener("DOMContentLoaded", function () {
    // Sync session boundaries and initialize user profile
    const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
    if (isLoggedIn) {
        const currentEmail = localStorage.getItem("email") || "user@voiceofstray.com";
        const currentName = localStorage.getItem("username") || "Arjun";
        const storedProfile = localStorage.getItem("voiceOfStrayUserProfile");
        
        let profileNeedsInit = true;
        if (storedProfile) {
            try {
                const parsed = JSON.parse(storedProfile);
                if (parsed.email === currentEmail) {
                    profileNeedsInit = false;
                }
            } catch (e) {}
        }
        
        if (profileNeedsInit) {
            const isDefaultArjun = (currentEmail === "user@voiceofstray.com" || currentName === "Arjun");
            const defaultProfile = {
                fullName: currentName,
                email: currentEmail,
                phone: isDefaultArjun ? "+1 (555) 234-5678" : "",
                city: isDefaultArjun ? "Brooklyn" : "",
                state: isDefaultArjun ? "New York" : "",
                pincode: isDefaultArjun ? "11201" : "",
                about: isDefaultArjun ? "Animal lover passionate about helping stray dogs and supporting local rescue efforts." : "",
                avatarUrl: localStorage.getItem("avatarUrl") || `https://ui-avatars.com/api/?name=${encodeURIComponent(currentName)}&background=f97316&color=fff&bold=true`,
                preferences: isDefaultArjun ? ["Dogs", "Cats"] : [],
                memberSince: isDefaultArjun ? "June 2026" : new Date().toLocaleString('default', { month: 'long', year: 'numeric' }),
                accountType: "Regular User",
                volunteerSkills: [],
                volunteerAvailability: "Weekends",
                volunteerExperience: "None",
                rescuerSkills: [],
                rescuerRadius: "5km",
                rescuerContact: "",
                stats: {
                    reports: isDefaultArjun ? 3 : 0,
                    adoptions: isDefaultArjun ? 2 : 0,
                    volunteer: isDefaultArjun ? 2 : 0
                }
            };
            localStorage.setItem("voiceOfStrayUserProfile", JSON.stringify(defaultProfile));
            localStorage.setItem("username", defaultProfile.fullName);
            localStorage.setItem("email", defaultProfile.email);
            localStorage.setItem("avatarUrl", defaultProfile.avatarUrl);
        } else {
            // Keep keys in sync
            try {
                const parsed = JSON.parse(storedProfile);
                if (parsed.fullName) localStorage.setItem("username", parsed.fullName);
                if (parsed.email) localStorage.setItem("email", parsed.email);
                if (parsed.avatarUrl) localStorage.setItem("avatarUrl", parsed.avatarUrl);
            } catch (e) {}
        }

        // Also check if NGO has updated volunteer application status in voiceOfStrayVolunteerApplications
        const apps = JSON.parse(localStorage.getItem("voiceOfStrayVolunteerApplications") || "[]");
        const userApp = apps.find(a => a.email === currentEmail);
        if (userApp) {
            let volMeta = {};
            const storedVolMeta = localStorage.getItem("voiceOfStrayVolunteer");
            if (storedVolMeta) {
                try { volMeta = JSON.parse(storedVolMeta); } catch(e){}
            }
            
            let status = "Pending Review";
            if (userApp.status === "Approved" || userApp.status === "Active" || userApp.status === "Inactive" || userApp.status === "Unavailable") {
                status = "Approved Volunteer";
            } else if (userApp.status === "Rejected") {
                status = "Rejected";
            } else if (userApp.status === "Removed") {
                status = "Removed";
            }
            
            volMeta.status = status;
            volMeta.role = userApp.role;
            volMeta.availability = userApp.availability || "Weekends";
            localStorage.setItem("voiceOfStrayVolunteer", JSON.stringify(volMeta));
            
            // Sync with profile accountType
            const storedProfile2 = localStorage.getItem("voiceOfStrayUserProfile");
            if (storedProfile2) {
                try {
                    const profile = JSON.parse(storedProfile2);
                    if (status === "Approved Volunteer") {
                        profile.accountType = userApp.role.includes("Rescue") ? "Rescuer" : "Volunteer";
                    } else {
                        profile.accountType = "Regular User";
                    }
                    localStorage.setItem("voiceOfStrayUserProfile", JSON.stringify(profile));
                } catch(e){}
            }

            // Sync with currentUser and voiceOfStrayUsers
            const currentUserRaw = localStorage.getItem("currentUser");
            if (currentUserRaw) {
                try {
                    const currentUser = JSON.parse(currentUserRaw);
                    const isApproved = (status === "Approved Volunteer");
                    const userStatus = isApproved ? "Approved" : status;
                    
                    if (!currentUser.volunteer) {
                        currentUser.volunteer = { approved: false, status: "Not Applied" };
                    }
                    if (currentUser.volunteer.approved !== isApproved || currentUser.volunteer.status !== userStatus) {
                        currentUser.volunteer.approved = isApproved;
                        currentUser.volunteer.status = userStatus;
                        localStorage.setItem("currentUser", JSON.stringify(currentUser));
                        
                        const users = JSON.parse(localStorage.getItem("voiceOfStrayUsers") || "[]");
                        const userIdx = users.findIndex(u => u.email.toLowerCase() === currentUser.email.toLowerCase());
                        if (userIdx !== -1) {
                            users[userIdx].volunteer = currentUser.volunteer;
                            localStorage.setItem("voiceOfStrayUsers", JSON.stringify(users));
                        }
                    }
                } catch(e){}
            }
        }
    }

    // 1. Initialize Auth State checks
    initNavbarAuth();
    applyRoleBasedRouting();
});

function initNavbarAuth() {
    // Query both state container blocks
    const guestElements = document.querySelectorAll(".guest-actions");
    const loggedInElements = document.querySelectorAll(".logged-in-actions");

    // Check localStorage authentication status
    const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";

    if (isLoggedIn) {
        // Show Logged-in state, Hide Guest state
        guestElements.forEach(el => el.style.setProperty("display", "none", "important"));
        loggedInElements.forEach(el => el.style.setProperty("display", "flex", "important"));

        // Dynamically update profile avatars if custom name was registered
        const storedAvatar = localStorage.getItem("avatarUrl");
        if (storedAvatar) {
            const profileImgs = document.querySelectorAll(".profile-pic img");
            profileImgs.forEach(img => img.src = storedAvatar);
        }

        // Hide Saved Animals button globally for NGO role
        const role = localStorage.getItem("role") || "user";
        if (role === "ngo") {
            const savedPetsButtons = document.querySelectorAll(".saved-pets-btn");
            savedPetsButtons.forEach(btn => btn.style.setProperty("display", "none", "important"));
        }

        // Setup click listener for notification bell buttons globally
        if (!window.location.pathname.endsWith("notifications.html")) {
            const bellIcons = document.querySelectorAll(".logged-in-actions .ph-bell, .logged-in-actions .ph-bell-ringing, .logged-in-actions [class*='ph-bell']");
            bellIcons.forEach(icon => {
                const btn = icon.closest(".icon-btn");
                if (btn) {
                    btn.addEventListener("click", function (e) {
                        e.preventDefault();
                        window.location.href = "notifications.html";
                    });
                }
            });

            // Also support clicking the dashboard sidebar notification section header
            const sidebarBell = document.querySelector(".section-header i.ph-bell, .section-header i.ph-bell-ringing, .section-header i[class*='ph-bell']");
            if (sidebarBell) {
                const header = sidebarBell.closest(".section-header");
                if (header) {
                    header.style.cursor = "pointer";
                    header.addEventListener("click", function (e) {
                        e.preventDefault();
                        window.location.href = "notifications.html";
                    });
                }
            }
        }
    } else {
        // Show Guest state, Hide Logged-in state
        guestElements.forEach(el => el.style.setProperty("display", "flex", "important"));
        loggedInElements.forEach(el => el.style.setProperty("display", "none", "important"));
    }

    // 2. Setup Join Button Click Events (Redirect to signup.html)
    const joinButtons = document.querySelectorAll(".nav-join-btn");
    joinButtons.forEach(btn => {
        btn.addEventListener("click", function () {
            window.location.href = "signup.html";
        });
    });

    // 3. Setup Dropdown Menu and Hover/Click navigation behavior
    const profilePics = document.querySelectorAll(".profile-pic");
    profilePics.forEach(pic => {
        const role = localStorage.getItem("role") || "user";
        const email = localStorage.getItem("email") || "user@voiceofstray.com";
        const username = localStorage.getItem("username") || "Arjun";
        
        // Inject the dropdown HTML dynamically if it hasn't been created yet
        if (!pic.querySelector(".profile-dropdown")) {
            const dropdown = document.createElement("div");
            dropdown.className = "profile-dropdown";
            
            const isNgo = role === "ngo";
            const ngoType = localStorage.getItem("ngoType") || "NGO Shelter Partner";
            
            // Read stored account type for regular user
            let accountType = "Regular User";
            const currentUserRaw = localStorage.getItem("currentUser");
            if (currentUserRaw) {
                try {
                    const currentUser = JSON.parse(currentUserRaw);
                    if (currentUser.role === "user") {
                        if (currentUser.volunteer && currentUser.volunteer.approved) {
                            accountType = "Volunteer";
                        }
                    }
                } catch(e){}
            } else {
                const storedProfile = localStorage.getItem("voiceOfStrayUserProfile");
                if (storedProfile) {
                    try {
                        const parsed = JSON.parse(storedProfile);
                        if (parsed.accountType) {
                            accountType = parsed.accountType;
                        }
                    } catch (e) {}
                }
            }
            
            const roleLabel = isNgo ? ngoType : accountType;
            const badgeClass = isNgo ? "dropdown-role-badge ngo" : "dropdown-role-badge user";
            const dashboardUrl = getDashboardUrl();
            
            let menuItemsHtml = "";
            if (isNgo) {
                menuItemsHtml = `
                    <a href="${dashboardUrl}" class="dropdown-item">
                        <i class="ph ph-squares-four"></i> Dashboard
                    </a>
                    <a href="ngo-edit-profile.html" class="dropdown-item">
                        <i class="ph ph-user-gear"></i> Edit NGO Profile
                    </a>
                    <a href="ngo-settings.html" class="dropdown-item">
                        <i class="ph ph-gear"></i> NGO Settings
                    </a>
                `;
            } else {
                let volActivitiesHtml = "";
                if (accountType === "Volunteer" || accountType === "Rescuer") {
                    volActivitiesHtml = `
                        <a href="volunteer-activities.html" class="dropdown-item">
                            <i class="ph ph-squares-four"></i> Volunteer Activities
                        </a>
                    `;
                }

                menuItemsHtml = `
                    <a href="${dashboardUrl}" class="dropdown-item">
                        <i class="ph ph-squares-four"></i> Dashboard
                    </a>
                    ${volActivitiesHtml}
                    <a href="user-edit-profile.html" class="dropdown-item">
                        <i class="ph ph-user-gear"></i> Edit Profile
                    </a>
                    <a href="adopt.html" class="dropdown-item">
                        <i class="ph ph-heart"></i> Saved Animals
                    </a>
                `;
            }
            
            dropdown.innerHTML = `
                <div class="dropdown-header">
                    <span class="dropdown-name">${username}</span>
                    <span style="font-size: 0.78rem; color: var(--text-muted); font-weight: 500;">${email}</span>
                    <span class="${badgeClass}">${roleLabel}</span>
                </div>
                <div class="dropdown-divider"></div>
                ${menuItemsHtml}
                <div class="dropdown-divider"></div>
                <div class="dropdown-item logout-btn">
                    <i class="ph ph-sign-out"></i> Log Out
                </div>
            `;
            
            pic.appendChild(dropdown);
        }
        
        // Click avatar to toggle profile dropdown open/close
        pic.addEventListener("click", function (e) {
            e.stopPropagation();
            const dropdown = pic.querySelector(".profile-dropdown");
            if (dropdown) {
                // If clicking elements inside the dropdown, allow standard navigation/action bubbling
                if (e.target.closest(".profile-dropdown")) {
                    return;
                }
                
                const isShown = dropdown.classList.contains("show");
                
                // Close any other open dropdowns in page first
                document.querySelectorAll(".profile-dropdown").forEach(d => {
                    d.classList.remove("show");
                });
                
                if (!isShown) {
                    dropdown.classList.add("show");
                } else {
                    dropdown.classList.remove("show");
                }
            }
        });
    });

    // Dismiss dropdown on clicking anywhere else on the document (outside click)
    document.addEventListener("click", function () {
        document.querySelectorAll(".profile-dropdown").forEach(d => {
            d.classList.remove("show");
        });
    });

    // Setup Log-Out button action
    document.querySelectorAll(".logout-btn").forEach(btn => {
        btn.addEventListener("click", function (e) {
            e.stopPropagation();
            if (confirm("Are you sure you want to log out of Voice of Stray?")) {
                localStorage.removeItem("currentUser");
                syncAuthKeys();
                
                // Redirect back to homepage
                window.location.href = "index.html";
            }
        });
    });
}
