// volunteer.js

document.addEventListener('DOMContentLoaded', () => {
    // Detect if logged-in account is an NGO
    const currentRole = localStorage.getItem("role") || "user";
    const storedProfile = localStorage.getItem("voiceOfStrayUserProfile");
    let accountType = "Regular User";
    if (storedProfile) {
        try {
            accountType = JSON.parse(storedProfile).accountType || "Regular User";
        } catch(e){}
    }
    const isNgo = (currentRole === "ngo" || accountType === "NGO Partner" || accountType === "NGO");

    if (isNgo) {
        // Hide volunteer application functionality:
        // Hide "Join as Volunteer" CTA button in Hero section
        const heroVolBtn = document.querySelector(".btn-hero[data-modal='volunteer-modal']");
        if (heroVolBtn) {
            heroVolBtn.style.display = "none";
        }

        // Hide emergency banner
        const emergencyBanner = document.querySelector(".emergency-banner");
        if (emergencyBanner) {
            const wrapper = emergencyBanner.closest("div");
            if (wrapper) {
                wrapper.style.display = "none";
            }
        }

        // Hide role selection section header
        const roleHeader = document.querySelector("#role-selection-section .section-header-center");
        if (roleHeader) {
            roleHeader.style.display = "none";
        }

        // Replace `#role-selection-grid` with Volunteer Management block
        const roleGrid = document.getElementById("role-selection-grid");
        if (roleGrid) {
            roleGrid.outerHTML = `
                <div class="glass-card" style="max-width: 600px; margin: 40px auto; padding: 40px; text-align: center; background: rgba(255, 255, 255, 0.75); border-radius: var(--radius-lg); border: 1px solid rgba(249, 115, 22, 0.15); box-shadow: var(--shadow-md); width: 100%;">
                    <h3 style="font-size: 1.8rem; font-weight: 800; color: #1e293b; margin-bottom: 8px;">Volunteer Management</h3>
                    <p style="font-size: 1.05rem; color: var(--text-muted); line-height: 1.6; margin-bottom: 30px;">
                        Your organization manages volunteers through the NGO Dashboard.
                    </p>
                    <a href="ngo-volunteer-manage.html" class="btn-full blue" style="display: inline-flex; align-items: center; justify-content: center; gap: 8px; width: 100%; text-decoration: none; padding: 14px 24px; font-weight: 700; border-radius: var(--radius-md); font-size: 1.05rem; box-sizing: border-box;">
                        Go To Volunteer Management <i class="ph ph-arrow-right"></i>
                    </a>
                </div>
            `;
        }
    }

    // 0. Handle availability selection
    const availBtns = document.querySelectorAll('.availability-selector .avail-btn');
    availBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            availBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
        });
    });

    // 0b. Render Volunteer application status if exists
    function renderVolunteerApplicationStatus() {
        if (isNgo) return;
        const roleGrid = document.getElementById('role-selection-grid');
        const sectionHeader = document.querySelector('#role-selection-section .section-header-center');
        if (!roleGrid) return;

        const storedVolMeta = localStorage.getItem("voiceOfStrayVolunteer");
        if (!storedVolMeta) return; // not applied

        let volMeta = null;
        try { volMeta = JSON.parse(storedVolMeta); } catch(e){}
        if (!volMeta || !volMeta.status) return;

        const status = volMeta.status;

        if (status === "Pending Review") {
            if (sectionHeader) sectionHeader.style.display = "none";
            roleGrid.outerHTML = `
                <div class="glass-card" style="max-width: 600px; margin: 40px auto; padding: 40px; text-align: center; background: rgba(255, 255, 255, 0.75); border-radius: var(--radius-lg); border: 1px solid rgba(249, 115, 22, 0.15); box-shadow: var(--shadow-md); width: 100%;">
                    <h3 style="font-size: 1.8rem; font-weight: 800; color: #1e293b; margin-bottom: 8px;">Volunteer Application</h3>
                    <div style="margin: 20px 0;">
                        <span class="status-pill pending" style="background: #fef9c3; color: #854d0e; padding: 6px 16px; font-size: 0.85rem; font-weight: 700; border-radius: 9999px; text-transform: uppercase; letter-spacing: 0.5px;">Pending Review</span>
                    </div>
                    <p style="font-size: 1.05rem; color: var(--text-muted); line-height: 1.6; margin-bottom: 30px;">
                        Your volunteer application has been submitted and is currently under review by a partner NGO.<br><br>You will be notified once a decision has been made.
                    </p>
                    <a href="user-dashboard.html" class="btn-full orange" style="display: inline-flex; align-items: center; justify-content: center; gap: 8px; width: 100%; text-decoration: none; padding: 14px 24px; font-weight: 700; border-radius: var(--radius-md); font-size: 1.05rem; box-sizing: border-box;">
                        Return to Dashboard <i class="ph ph-arrow-right"></i>
                    </a>
                </div>
            `;
        } else if (status === "Approved Volunteer" || status === "Active Volunteer" || status === "Approved" || status === "Active") {
            if (sectionHeader) sectionHeader.style.display = "none";
            roleGrid.outerHTML = `
                <div class="glass-card" style="max-width: 600px; margin: 40px auto; padding: 40px; text-align: center; background: rgba(255, 255, 255, 0.75); border-radius: var(--radius-lg); border: 1px solid rgba(249, 115, 22, 0.15); box-shadow: var(--shadow-md); width: 100%;">
                    <h3 style="font-size: 1.8rem; font-weight: 800; color: #1e293b; margin-bottom: 8px;">Volunteer Application</h3>
                    <div style="margin: 20px 0;">
                        <span class="status-pill approved" style="background: #dcfce7; color: #166534; padding: 6px 16px; font-size: 0.85rem; font-weight: 700; border-radius: 9999px; text-transform: uppercase; letter-spacing: 0.5px;">Approved Volunteer</span>
                    </div>
                    <p style="font-size: 1.05rem; color: var(--text-muted); line-height: 1.6; margin-bottom: 30px;">
                        Congratulations! Your application has been approved. You are now an active volunteer in the Voice of Stray community.
                    </p>
                    <a href="volunteer-activities.html" class="btn-full orange" style="display: inline-flex; align-items: center; justify-content: center; gap: 8px; width: 100%; text-decoration: none; padding: 14px 24px; font-weight: 700; border-radius: var(--radius-md); font-size: 1.05rem; box-sizing: border-box;">
                        Go To Volunteer Activities <i class="ph ph-arrow-right"></i>
                    </a>
                </div>
            `;
        } else if (status === "Rejected") {
            if (sectionHeader) sectionHeader.style.display = "none";
            roleGrid.outerHTML = `
                <div class="glass-card" style="max-width: 600px; margin: 40px auto; padding: 40px; text-align: center; background: rgba(255, 255, 255, 0.75); border-radius: var(--radius-lg); border: 1px solid rgba(249, 115, 22, 0.15); box-shadow: var(--shadow-md); width: 100%;">
                    <h3 style="font-size: 1.8rem; font-weight: 800; color: #1e293b; margin-bottom: 8px;">Volunteer Application</h3>
                    <div style="margin: 20px 0;">
                        <span class="status-pill rejected" style="background: #fee2e2; color: #991b1b; padding: 6px 16px; font-size: 0.85rem; font-weight: 700; border-radius: 9999px; text-transform: uppercase; letter-spacing: 0.5px;">Rejected</span>
                    </div>
                    <p style="font-size: 1.05rem; color: var(--text-muted); line-height: 1.6; margin-bottom: 30px;">
                        Your application was not approved at this time.
                    </p>
                    <a href="user-dashboard.html" class="btn-full orange" style="display: inline-flex; align-items: center; justify-content: center; gap: 8px; width: 100%; text-decoration: none; padding: 14px 24px; font-weight: 700; border-radius: var(--radius-md); font-size: 1.05rem; box-sizing: border-box;">
                        Return to Dashboard <i class="ph ph-arrow-right"></i>
                    </a>
                </div>
            `;
        }
    }
    renderVolunteerApplicationStatus();

    // Sync avatar on load
    const storedUserProfile = localStorage.getItem("voiceOfStrayUserProfile");
    if (storedUserProfile) {
        try {
            const parsed = JSON.parse(storedUserProfile);
            if (parsed.avatarUrl) {
                const profileImgs = document.querySelectorAll(".profile-pic img");
                profileImgs.forEach(img => img.src = parsed.avatarUrl);
            }
        } catch(e){}
    }

    // 1. Scroll Fade-in Animation
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                
                // Trigger counter animation if it's the hero section
                if (entry.target.classList.contains('volunteer-hero')) {
                    startCounters();
                }
                
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    document.querySelectorAll('.fade-in').forEach(element => {
        observer.observe(element);
    });
    
    // Initial check for elements already in viewport on load
    setTimeout(() => {
        document.querySelectorAll('.fade-in').forEach(el => {
            if (el.getBoundingClientRect().top < window.innerHeight) {
                el.classList.add('visible');
                if (el.classList.contains('volunteer-hero')) {
                    startCounters();
                }
            }
        });
    }, 100);

    // 2. Animated Counters
    let countersStarted = false;
    function startCounters() {
        if (countersStarted) return;
        countersStarted = true;
        
        const counters = document.querySelectorAll('.counter');
        const speed = 200; // lower = faster

        counters.forEach(counter => {
            const target = +counter.getAttribute('data-target');
            const suffix = counter.getAttribute('data-suffix') || '';
            const increment = target / speed;

            const updateCount = () => {
                const count = +counter.innerText.replace(/\D/g, ''); // strip out non-digits just in case
                if (count < target) {
                    const nextVal = Math.ceil(count + increment);
                    // Add commas for thousands
                    counter.innerText = (nextVal > target ? target : nextVal).toLocaleString() + suffix;
                    setTimeout(updateCount, 10);
                } else {
                    counter.innerText = target.toLocaleString() + suffix;
                }
            };
            
            updateCount();
        });
    }

    // 3. Skill Chips Toggle
    const skillsList = document.getElementById('skills-list');
    if (skillsList) {
        skillsList.addEventListener('click', (e) => {
            const chip = e.target.closest('.skill-chip');
            if (!chip) return;
            
            // Ignore the "add new" button for this simple toggle logic
            if (chip.classList.contains('add-new')) {
                alert("This would open a modal to add custom skills.");
                return;
            }
            
            chip.classList.toggle('active');
        });
    }

    // 4. FAQ Accordion
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        question.addEventListener('click', () => {
            // Close all others
            faqItems.forEach(otherItem => {
                if (otherItem !== item) {
                    otherItem.classList.remove('active');
                }
            });
            // Toggle current
            item.classList.toggle('active');
        });
    });

    // 5. Accept Task Buttons
    const acceptBtns = document.querySelectorAll('.btn-accept');
    acceptBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const originalText = this.innerText;
            const originalBg = this.style.background;
            
            this.innerText = 'Accepted!';
            this.style.background = '#10b981'; // Success Green
            
            setTimeout(() => {
                this.innerText = originalText;
                this.style.background = originalBg; // revert
            }, 3000);
        });
    });

    // 6. Mobile Navbar Toggle
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const navLinks = document.getElementById('nav-links');
    if (mobileMenuBtn && navLinks) {
        mobileMenuBtn.addEventListener('click', () => {
            navLinks.classList.toggle('active');
        });
    }

    // 7. Modals Open/Close
    const openModalBtns = document.querySelectorAll('.open-modal-btn');
    const closeBtns = document.querySelectorAll('.modal-close');
    const overlays = document.querySelectorAll('.modal-overlay');

    function autofillModal(modalEl) {
        const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
        if (!isLoggedIn) return;

        let userProfile = {};
        const stored = localStorage.getItem("voiceOfStrayUserProfile");
        if (stored) {
            try {
                userProfile = JSON.parse(stored);
            } catch (e) {
                console.error("Error parsing user profile for autofill", e);
            }
        }

        const fullName = userProfile.fullName || localStorage.getItem("username") || "";
        const email = userProfile.email || localStorage.getItem("email") || "";
        const phone = userProfile.phone || "";

        const nameInput = modalEl.querySelector('input[name="name"]');
        const emailInput = modalEl.querySelector('input[name="email"]');
        const phoneInput = modalEl.querySelector('input[name="phone"]');

        if (nameInput && fullName && modalEl.id !== "ngo-modal") nameInput.value = fullName;
        if (emailInput && email) emailInput.value = email;
        if (phoneInput && phone) phoneInput.value = phone;
    }

    openModalBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const targetModalId = btn.getAttribute('data-modal');
            if (isNgo && (targetModalId === "volunteer-modal" || targetModalId === "foster-modal")) {
                alert("NGO accounts cannot apply as volunteers.");
                return;
            }
            const targetModal = document.getElementById(targetModalId);
            if (targetModal) {
                targetModal.classList.add('active');
                // Reset form on open
                const form = targetModal.querySelector('form');
                if(form) {
                    form.reset();
                    form.style.display = 'block';
                }
                const modalH3 = targetModal.querySelector('h3');
                if(modalH3) modalH3.style.display = 'block';
                const modalP = targetModal.querySelector('p');
                if(modalP) modalP.style.display = 'block';

                const successMsg = targetModal.querySelector('.modal-success-msg');
                if(successMsg) successMsg.classList.remove('show');
                targetModal.querySelectorAll('.form-group').forEach(fg => fg.classList.remove('has-error'));

                // Autofill fields
                autofillModal(targetModal);
            }
        });
    });

    closeBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            btn.closest('.modal-overlay').classList.remove('active');
        });
    });

    overlays.forEach(overlay => {
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) {
                overlay.classList.remove('active');
            }
        });
    });

    // 8. Form Validation
    const validateEmail = (email) => {
        return String(email)
            .toLowerCase()
            .match(
                /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
            );
    };
    const validatePhone = (phone) => {
        return String(phone).match(/^[0-9]{10}$/);
    };

    const forms = document.querySelectorAll('.modal-form');
    forms.forEach(form => {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            let isValid = true;
            
            // Clear previous errors
            form.querySelectorAll('.form-group').forEach(fg => fg.classList.remove('has-error'));

            // Validate inputs
            form.querySelectorAll('input').forEach(input => {
                const formGroup = input.closest('.form-group');
                
                if (input.required && !input.value.trim()) {
                    formGroup.classList.add('has-error');
                    isValid = false;
                } else if (input.type === 'email' && !validateEmail(input.value)) {
                    formGroup.classList.add('has-error');
                    isValid = false;
                } else if (input.type === 'tel' && !validatePhone(input.value)) {
                    formGroup.classList.add('has-error');
                    isValid = false;
                }
            });

            if (isValid) {
                const modalOverlay = form.closest('.modal-overlay');
                const modalId = modalOverlay ? modalOverlay.id : '';

                if (modalId === 'volunteer-modal') {
                    // Update user profile in localStorage
                    let userProfile = {};
                    const stored = localStorage.getItem("voiceOfStrayUserProfile");
                    if (stored) {
                        try { userProfile = JSON.parse(stored); } catch(e){}
                    }
                    
                    const nameVal = form.querySelector('input[name="name"]').value;
                    const emailVal = form.querySelector('input[name="email"]').value;
                    const phoneVal = form.querySelector('input[name="phone"]').value;
                    const roleVal = form.querySelector('select[name="role"]').value;
                    
                    // Extract selected skills and availability
                    const selectedAvail = document.querySelector('.availability-selector .avail-btn.active')?.textContent.trim() || "Weekends";
                    const selectedSkills = Array.from(document.querySelectorAll('#skills-list .skill-chip.active'))
                        .map(chip => chip.textContent.trim())
                        .filter(text => text !== '');

                    userProfile.fullName = nameVal;
                    userProfile.email = emailVal;
                    userProfile.phone = phoneVal;
                    userProfile.accountType = (roleVal === 'rescue') ? 'Rescuer' : 'Volunteer';
                    userProfile.volunteerAvailability = selectedAvail;
                    userProfile.volunteerSkills = selectedSkills;
                    
                    localStorage.setItem("voiceOfStrayUserProfile", JSON.stringify(userProfile));
                    localStorage.setItem("username", nameVal);
                    localStorage.setItem("email", emailVal);
                    
                    // Save volunteer metadata for dashboard
                    let roleDisplay = "Emergency Rescue";
                    if (roleVal === 'transport') roleDisplay = 'Transport Assistance';
                    else if (roleVal === 'feeding') roleDisplay = 'Feeding Drives';
                    else if (roleVal === 'medical') roleDisplay = 'Medical / Vet Support';
                    
                    const currentMonthYear = new Date().toLocaleString('default', { month: 'long', year: 'numeric' }) || "June 2026";
                    
                    const volunteerData = {
                        status: "Pending Review",
                        role: roleDisplay,
                        joined: currentMonthYear,
                        availability: selectedAvail,
                        skills: selectedSkills
                    };
                    localStorage.setItem("voiceOfStrayVolunteer", JSON.stringify(volunteerData));

                    // Update currentUser and voiceOfStrayUsers volunteer status
                    const currentUserRaw = localStorage.getItem("currentUser");
                    if (currentUserRaw) {
                        try {
                            const currentUser = JSON.parse(currentUserRaw);
                            currentUser.volunteer = currentUser.volunteer || {};
                            currentUser.volunteer.status = "Pending Review";
                            currentUser.volunteer.approved = false;
                            localStorage.setItem("currentUser", JSON.stringify(currentUser));

                            const users = JSON.parse(localStorage.getItem("voiceOfStrayUsers") || "[]");
                            const userIdx = users.findIndex(u => u.email.toLowerCase() === currentUser.email.toLowerCase());
                            if (userIdx !== -1) {
                                users[userIdx].volunteer = currentUser.volunteer;
                                localStorage.setItem("voiceOfStrayUsers", JSON.stringify(users));
                            }
                        } catch(e){}
                    }

                    // Append application to voiceOfStrayVolunteerApplications
                    let apps = [];
                    const storedApps = localStorage.getItem("voiceOfStrayVolunteerApplications");
                    if (storedApps) {
                        try { apps = JSON.parse(storedApps); } catch(e){}
                    }
                    apps.push({
                        id: "VOL-APP-" + Date.now(),
                        name: nameVal,
                        email: emailVal,
                        phone: phoneVal,
                        role: roleDisplay,
                        type: "volunteer",
                        status: "Pending Review",
                        date: "Just now",
                        availability: selectedAvail,
                        skills: selectedSkills
                    });
                    localStorage.setItem("voiceOfStrayVolunteerApplications", JSON.stringify(apps));

                    // Push user notification
                    let notifications = JSON.parse(localStorage.getItem("voiceOfStrayNotifications") || "[]");
                    notifications.unshift({
                        id: "NOTIF-" + Math.floor(1000 + Math.random() * 9000),
                        icon: "ph-fill ph-hand-heart",
                        message: `Congratulations ${nameVal}, your volunteer application for ${roleDisplay} has been submitted successfully and is currently under review.`,
                        time: "Just now",
                        unread: true
                    });
                    localStorage.setItem("voiceOfStrayNotifications", JSON.stringify(notifications));

                } else if (modalId === 'foster-modal') {
                    let userProfile = {};
                    const stored = localStorage.getItem("voiceOfStrayUserProfile");
                    if (stored) {
                        try { userProfile = JSON.parse(stored); } catch(e){}
                    }
                    const nameVal = form.querySelector('input[name="name"]').value;
                    const emailVal = form.querySelector('input[name="email"]').value;
                    
                    userProfile.fullName = nameVal;
                    userProfile.email = emailVal;
                    userProfile.accountType = 'Volunteer';
                    userProfile.volunteerAvailability = "Weekends";
                    userProfile.volunteerSkills = ["Fostering"];
                    
                    localStorage.setItem("voiceOfStrayUserProfile", JSON.stringify(userProfile));
                    localStorage.setItem("username", nameVal);
                    localStorage.setItem("email", emailVal);
                    
                    const currentMonthYear = new Date().toLocaleString('default', { month: 'long', year: 'numeric' }) || "June 2026";
                    
                    const volunteerData = {
                        status: "Pending Review",
                        role: "Foster Care Support",
                        joined: currentMonthYear,
                        availability: "Weekends",
                        skills: ["Fostering"]
                    };
                    localStorage.setItem("voiceOfStrayVolunteer", JSON.stringify(volunteerData));

                    // Append application to voiceOfStrayVolunteerApplications
                    let apps = [];
                    const storedApps = localStorage.getItem("voiceOfStrayVolunteerApplications");
                    if (storedApps) {
                        try { apps = JSON.parse(storedApps); } catch(e){}
                    }
                    apps.push({
                        id: "VOL-APP-" + Date.now(),
                        name: nameVal,
                        email: emailVal,
                        phone: "",
                        role: "Foster Care Support",
                        type: "foster",
                        status: "Pending Review",
                        date: "Just now",
                        availability: "Weekends",
                        skills: ["Fostering"]
                    });
                    localStorage.setItem("voiceOfStrayVolunteerApplications", JSON.stringify(apps));

                    // Push user notification
                    let notifications = JSON.parse(localStorage.getItem("voiceOfStrayNotifications") || "[]");
                    notifications.unshift({
                        id: "NOTIF-" + Math.floor(1000 + Math.random() * 9000),
                        icon: "ph-fill ph-hand-heart",
                        message: `Congratulations ${nameVal}, your foster application has been submitted successfully and is currently under review.`,
                        time: "Just now",
                        unread: true
                    });
                    localStorage.setItem("voiceOfStrayNotifications", JSON.stringify(notifications));

                } else if (modalId === 'ngo-modal') {
                    localStorage.setItem("role", "ngo");
                    
                    let userProfile = {};
                    const stored = localStorage.getItem("voiceOfStrayUserProfile");
                    if (stored) {
                        try { userProfile = JSON.parse(stored); } catch(e){}
                    }
                    const ngoNameVal = form.querySelector('input[name="name"]').value;
                    const ngoEmailVal = form.querySelector('input[name="email"]').value;
                    
                    userProfile.fullName = ngoNameVal;
                    userProfile.email = ngoEmailVal;
                    userProfile.accountType = 'NGO Partner';
                    
                    localStorage.setItem("voiceOfStrayUserProfile", JSON.stringify(userProfile));
                    localStorage.setItem("username", ngoNameVal);
                    localStorage.setItem("email", ngoEmailVal);
                    localStorage.setItem("ngoType", "NGO Shelter Partner");
                }

                // Show success UI
                const modalContent = form.closest('.modal-content');
                const modalH3 = modalContent.querySelector('h3');
                const modalP = modalContent.querySelector('p');
                const successMsg = modalContent.querySelector('.modal-success-msg');
                
                if (successMsg) {
                    if (modalH3) modalH3.style.display = 'none';
                    if (modalP) modalP.style.display = 'none';
                    form.style.display = 'none';
                    successMsg.classList.add('show');
                }
            }
        });
    });

    // 9. Opportunities Filtering
    const filterBtns = document.querySelectorAll('.filter-btn');
    const oppCards = document.querySelectorAll('.opp-card');

    if (filterBtns.length > 0) {
        filterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                // Update active state
                filterBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');

                const filter = btn.getAttribute('data-filter');

                // Filter cards
                oppCards.forEach(card => {
                    const category = card.getAttribute('data-category');
                    if (filter === 'all' || category === filter) {
                        card.classList.remove('hidden');
                    } else {
                        card.classList.add('hidden');
                    }
                });
            });
        });
    }

});
