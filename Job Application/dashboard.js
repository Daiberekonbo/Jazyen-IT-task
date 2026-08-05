/* ============================================================
   DASHBOARD PAGE - JavaScript
   ============================================================ */

/* SECTION 1: CACHE DOM ELEMENTS */
const welcomeHeading = document.querySelector(".dash-header h2");
const sidebarAvatar = document.querySelector(".sidebar-avatar");
const sidebarName = document.querySelector(".sidebar-header h3");
const sidebarEmail = document.querySelector(".sidebar-header p");
const statNumbers = document.querySelectorAll(".stat-num");
const sidebarLinks = document.querySelectorAll(".sidebar-links a");
const navLinks = document.querySelectorAll("nav ul a");
const sidebarToggle = document.getElementById("sidebar-toggle");
const sidebarOverlay = document.querySelector(".sidebar-overlay");
const notifItems = document.querySelectorAll(".notif-item.unread");
const signOutLinks = document.querySelectorAll('a[href="LandingPage2.html"]');

/* SECTION 2: VARIABLES */
let currentUser = null;

/* SECTION 3: HELPER FUNCTIONS */
function animateCounters() {
    statNumbers.forEach(function(stat) {
        const target = parseInt(stat.getAttribute("data-target"));
        const increment = target / 60;
        let current = 0;

        const counterInterval = setInterval(function() {
            current += increment;
            if (current >= target) {
                current = target;
                clearInterval(counterInterval);
            }
            stat.textContent = Math.floor(current);
        }, 16);
    });
}

function updateUserInfo() {
    // Try to get logged-in user from localStorage
    const storedUser = localStorage.getItem("loggedInUser");

    if (storedUser) {
        currentUser = JSON.parse(storedUser);

        // Update welcome message with user's name
        if (currentUser.name) {
            const firstName = currentUser.name.split(" ")[0];
            welcomeHeading.innerHTML = 'Welcome back, ' + firstName + '! <span class="wave">👋</span>';
            sidebarName.textContent = currentUser.name;
            sidebarAvatar.textContent = currentUser.name.charAt(0).toUpperCase();
        }

        if (currentUser.email) {
            sidebarEmail.textContent = currentUser.email;
        }
    }
}

function highlightActiveLink() {
    const currentPage = window.location.pathname.split("/").pop();

    sidebarLinks.forEach(function(link) {
        link.classList.remove("active");
        const linkPage = link.getAttribute("href");
        if (linkPage === currentPage) {
            link.classList.add("active");
        }
    });
}

function closeSidebar() {
    sidebarToggle.checked = false;
}

/* SECTION 4: EVENT LISTENERS */

/* ------------------------------------------------
   FUNCTION: handleSignOut()
   
   WHAT IT DOES:
   Signs the user out by clearing their session data
   from localStorage, then redirects to the landing page.
   
   WHY WE NEED IT:
   - The "Sign Out" links currently just navigate to
     LandingPage2.html without clearing the stored user.
   - When the user goes back to Login, initLoginPage()
     sees the stored user and redirects them back to
     the Dashboard - so they're never actually signed out.
   
   HOW IT WORKS:
   1. Remove the "loggedInUser" from localStorage
   2. Remove the "rememberMe" preference
   3. Navigate to the landing page
   
   LATER BACKEND CONNECTION:
   When using JWT tokens, we would also:
   - Call POST /api/auth/logout to invalidate the token
   - Remove the token from localStorage
   ------------------------------------------------ */
function handleSignOut() {
    // Step 1: Remove the logged-in user from localStorage
    // This is what "signing out" means - we clear the session
    localStorage.removeItem("loggedInUser");

    // Step 2: Remove the remember-me preference
    localStorage.removeItem("rememberMe");

    // Step 3: Navigate to the landing page
    // The user is now signed out, so they can see the landing page
    window.location.href = "LandingPage2.html";
}

// Attach sign-out handler to all "Sign Out" links
// This includes both the nav menu and the sidebar links
document.querySelectorAll('a[href="LandingPage2.html"]').forEach(function(link) {
    link.addEventListener("click", function(event) {
        // Prevent the default navigation
        event.preventDefault();
        // Call our sign-out function instead
        handleSignOut();
    });
});

sidebarLinks.forEach(function(link) {
    link.addEventListener("click", function() {
        closeSidebar();
    });
});

if (sidebarOverlay) {
    sidebarOverlay.addEventListener("click", function() {
        closeSidebar();
    });
}

// Mark notification as read when clicked
notifItems.forEach(function(item) {
    item.addEventListener("click", function() {
        item.classList.remove("unread");
        const dot = item.querySelector(".notif-dot");
        if (dot) {
            dot.classList.add("read");
        }
    });
});

/* SECTION 5: MAIN LOGIC */
function initDashboard() {
    // Check if user is logged in
    const storedUser = localStorage.getItem("loggedInUser");
    if (!storedUser) {
        // Not logged in - redirect to Login
        window.location.href = "Login.html";
        return;
    }

    updateUserInfo();
    animateCounters();
    highlightActiveLink();

    console.log("Dashboard initialized for:", currentUser ? currentUser.name : "Unknown");
}

document.addEventListener("DOMContentLoaded", initDashboard);