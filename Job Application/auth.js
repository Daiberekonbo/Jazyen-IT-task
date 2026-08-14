/* ============================================================
   AUTH MODULE - Shared Authentication Logic
   Used by: Login, Register, Dashboard, Profile, all protected pages
   ============================================================ */

/* SECTION 1: USER MANAGEMENT */

// Get all registered users
function getRegisteredUsers() {
    const stored = localStorage.getItem("registeredUsers");
    return stored ? JSON.parse(stored) : [];
}

// Save all registered users
function saveRegisteredUsers(users) {
    localStorage.setItem("registeredUsers", JSON.stringify(users));
}

// Get current logged-in user
function getCurrentUser() {
    const stored = localStorage.getItem("loggedInUser");
    return stored ? JSON.parse(stored) : null;
}

// Set current logged-in user
function setCurrentUser(user) {
    localStorage.setItem("loggedInUser", JSON.stringify(user));
}

// Check if user is logged in
function isLoggedIn() {
    return getCurrentUser() !== null;
}

// Find a user by email (case-insensitive)
function findUserByEmail(email) {
    const users = getRegisteredUsers();
    return users.find(function(u) {
        return u.email.toLowerCase() === email.toLowerCase();
    }) || null;
}

// Validate login credentials
function validateLogin(email, password) {
    const user = findUserByEmail(email);
    if (!user) return { success: false, message: "No account found with this email." };
    if (user.password !== password) return { success: false, message: "Incorrect password." };
    return { success: true, user: user };
}

// Register a new user
function registerUser(userData) {
    // Check if email already exists
    if (findUserByEmail(userData.email)) {
        return { success: false, message: "This email is already registered." };
    }
    // Create full user object
    const newUser = {
        name: userData.name || "",
        email: (userData.email || "").toLowerCase(),
        password: userData.password || "",
        phone: userData.phone || "",
        address: userData.address || "",
        bio: userData.bio || "",
        skills: userData.skills || [],
        experience: userData.experience || "",
        education: userData.education || "",
        profilePicture: userData.profilePicture || "",
        createdAt: new Date().toISOString()
    };
    const users = getRegisteredUsers();
    users.push(newUser);
    saveRegisteredUsers(users);
    return { success: true, user: newUser };
}

// Update user profile (syncs both registeredUsers and loggedInUser)
function updateUserProfile(updatedData) {
    const currentUser = getCurrentUser();
    if (!currentUser) return { success: false, message: "Not logged in." };

    // Build updated user object
    const updatedUser = {
        ...currentUser,
        ...updatedData,
        email: (updatedData.email || currentUser.email).toLowerCase()
    };

    // Update in registeredUsers
    const users = getRegisteredUsers();
    const updatedUsers = users.map(function(u) {
        if (u.email.toLowerCase() === currentUser.email.toLowerCase()) {
            return updatedUser;
        }
        return u;
    });
    saveRegisteredUsers(updatedUsers);

    // Update loggedInUser
    setCurrentUser(updatedUser);

    return { success: true, user: updatedUser };
}

// Logout
function logout() {
    localStorage.removeItem("loggedInUser");
    localStorage.removeItem("rememberMe");
    window.location.href = "Login.html";
}

// Protect page - redirect to login if not authenticated
function requireAuth() {
    if (!isLoggedIn()) {
        window.location.href = "Login.html";
        return false;
    }
    return true;
}

/* SECTION 2: PROFILE DATA */

// Get profile data for current user
function getProfileData() {
    const user = getCurrentUser();
    if (!user) return null;

    // Check for saved profile overrides
    const savedProfile = localStorage.getItem("profileData");
    if (savedProfile) {
        const parsed = JSON.parse(savedProfile);
        return {
            name: parsed.name || user.name || "",
            email: parsed.email || user.email || "",
            phone: parsed.phone || user.phone || "",
            address: parsed.address || user.address || "",
            bio: parsed.bio || user.bio || "",
            skills: parsed.skills || user.skills || [],
            experience: parsed.experience || user.experience || "",
            education: parsed.education || user.education || "",
            profilePicture: parsed.profilePicture || user.profilePicture || ""
        };
    }

    return {
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
        address: user.address || "",
        bio: user.bio || "",
        skills: user.skills || [],
        experience: user.experience || "",
        education: user.education || "",
        profilePicture: user.profilePicture || ""
    };
}

/* SECTION 3: APP DATA */

// Applied jobs
function getAppliedJobs() {
    const stored = localStorage.getItem("appliedJobs");
    return stored ? JSON.parse(stored) : [];
}

function saveAppliedJobs(jobs) {
    localStorage.setItem("appliedJobs", JSON.stringify(jobs));
}

// Saved jobs
function getSavedJobIds() {
    const stored = localStorage.getItem("savedJobs");
    return stored ? JSON.parse(stored) : [];
}

function saveSavedJobIds(ids) {
    localStorage.setItem("savedJobs", JSON.stringify(ids));
}

// Notifications
function getNotifications() {
    const stored = localStorage.getItem("notifications");
    return stored ? JSON.parse(stored) : [];
}

// User settings
function getUserSettings() {
    const stored = localStorage.getItem("userSettings");
    return stored ? JSON.parse(stored) : null;
}

function updateSidebarUserInfo() {
    const sidebar = document.querySelector('.sidebar');
    if (!sidebar) return;

    const profile = getCurrentUser() || getProfileData() || {};
    const name = profile.name || 'User';
    const email = profile.email || 'user@email.com';
    const avatar = sidebar.querySelector('.sidebar-avatar');
    const nameEl = sidebar.querySelector('.sidebar-header h3');
    const emailEl = sidebar.querySelector('.sidebar-header p');

    if (avatar) avatar.textContent = name.charAt(0).toUpperCase();
    if (nameEl) nameEl.textContent = name;
    if (emailEl) emailEl.textContent = email;
}

window.syncSidebarUser = updateSidebarUserInfo;

// Global init for all pages
document.addEventListener("DOMContentLoaded", function() {
    // Apply dark mode if saved
    const settings = getUserSettings();
    if (settings && settings.darkMode) {
        document.body.classList.add("dark-mode");
    }

    // Apply global theme stored by theme.js/localStorage for pages that include only auth.js
    try {
        const storedTheme = localStorage.getItem('theme');
        if (storedTheme === 'dark') {
            document.documentElement.setAttribute('data-theme', 'dark');
            document.body.classList.add('dark-mode');
        } else {
            document.documentElement.removeAttribute('data-theme');
            document.body.classList.remove('dark-mode');
        }
    } catch(e) {}

    const currentPage = window.location.pathname.split('/').pop() || 'LandingPage2.html';
    const loggedInPages = [
        'DashboardPage.html', 'ProfilePage.html', 'JobsListingPage.html',
        'MyApplicationsPage.html', 'SavedJobsPage.html', 'NotificationsPage.html',
        'MessagesPage.html', 'SettingsPage.html', 'SearchResultsPage.html',
        'JobDetailsPage.html', 'ApplicationSuccessPage.html'
    ];

    if (loggedInPages.includes(currentPage)) {
        document.body.classList.add('logged-in-page');
        const existingSidebar = document.querySelector('.sidebar');
        if (!existingSidebar) {
            const sidebar = document.createElement('aside');
            sidebar.className = 'sidebar';
            sidebar.innerHTML = `
                <div class="sidebar-header">
                    <div class="sidebar-avatar">U</div>
                    <h3>User</h3>
                    <p>user@email.com</p>
                </div>
                <ul class="sidebar-links">
                    <li><a href="DashboardPage.html" class="${currentPage === 'DashboardPage.html' ? 'active' : ''}"><span class="fas fa-chart-line"></span> Dashboard</a></li>
                    <li><a href="ProfilePage.html" class="${currentPage === 'ProfilePage.html' ? 'active' : ''}"><span class="fas fa-user"></span> Profile</a></li>
                    <li><a href="MyApplicationsPage.html" class="${currentPage === 'MyApplicationsPage.html' ? 'active' : ''}"><span class="fas fa-list-alt"></span> My Applications</a></li>
                    <li><a href="JobsListingPage.html" class="${currentPage === 'JobsListingPage.html' || currentPage === 'SearchResultsPage.html' || currentPage === 'JobDetailsPage.html' ? 'active' : ''}"><span class="fas fa-search"></span> Browse Jobs</a></li>
                    <li><a href="SavedJobsPage.html" class="${currentPage === 'SavedJobsPage.html' ? 'active' : ''}"><span class="fas fa-bookmark"></span> Saved Jobs</a></li>
                    <li><a href="NotificationsPage.html" class="${currentPage === 'NotificationsPage.html' ? 'active' : ''}"><span class="fas fa-bell"></span> Notifications</a></li>
                    <li><a href="MessagesPage.html" class="${currentPage === 'MessagesPage.html' ? 'active' : ''}"><span class="fas fa-envelope"></span> Messages</a></li>
                    <li><a href="SettingsPage.html" class="${currentPage === 'SettingsPage.html' ? 'active' : ''}"><span class="fas fa-cog"></span> Settings</a></li>
                    <li><a href="LandingPage2.html"><span class="fas fa-right-from-bracket"></span> Sign Out</a></li>
                </ul>
            `;
            document.body.insertBefore(sidebar, document.body.firstChild);

            const overlay = document.createElement('div');
            overlay.className = 'sidebar-overlay';
            document.body.insertBefore(overlay, document.body.firstChild);
        }

        updateSidebarUserInfo();

        const nav = document.querySelector('nav');
        if (nav) {
            nav.classList.add('top-nav-compact');
        }
    }

    // Attach logout handlers to all logout links
    document.querySelectorAll('[data-logout]').forEach(function(link) {
        link.addEventListener("click", function(e) {
            e.preventDefault();
            logout();
        });
    });
});

/* --- Helper: token management and authenticated fetch --- */

// Store auth tokens inside the loggedInUser object (merges with existing user fields)
function setAuthTokens(tokens) {
    const user = getCurrentUser() || {};
    const merged = {
        ...user,
        access: tokens.access || user.access,
        refresh: tokens.refresh || user.refresh
    };
    setCurrentUser(merged);
}

function getAccessToken() {
    const user = getCurrentUser();
    return user && user.access ? user.access : null;
}

// Try to refresh access token using refresh token
async function refreshAccessToken() {
    const user = getCurrentUser();
    if (!user || !user.refresh) return false;
    try {
        const resp = await fetch('/api/token/refresh/', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ refresh: user.refresh })
        });
        if (!resp.ok) {
            return false;
        }
        const data = await resp.json();
        if (data.access) {
            // update refresh token if rotation returned a new one
            const newRefresh = data.refresh || user.refresh;
            setAuthTokens({ access: data.access, refresh: newRefresh });
            return true;
        }
        return false;
    } catch (err) {
        return false;
    }
}

// Small fetch wrapper that adds Authorization header when an access token exists
// If a request returns 401, attempt to refresh the access token once and retry.
async function fetchWithAuth(url, options) {
    const headers = (options && options.headers) ? { ...options.headers } : { 'Content-Type': 'application/json' };
    const token = getAccessToken();
    if (token) headers['Authorization'] = 'Bearer ' + token;
    let opts = { ...(options || {}), headers };

    let resp = await fetch(url, opts);
    if (resp.status !== 401) return resp;

    // attempt refresh
    const refreshed = await refreshAccessToken();
    if (!refreshed) {
        // refresh failed — log out to clear state
        logout();
        return resp;
    }

    // retry request with new access token
    const newToken = getAccessToken();
    if (newToken) {
        opts = { ...(options || {}), headers: { ...(opts.headers || {}), Authorization: 'Bearer ' + newToken } };
    }
    return fetch(url, opts);
}

// Export helpers to global scope for simple usage in the static frontend
window.setAuthTokens = setAuthTokens;
window.getAccessToken = getAccessToken;
window.fetchWithAuth = fetchWithAuth;