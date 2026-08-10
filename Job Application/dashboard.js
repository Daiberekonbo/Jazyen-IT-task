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
    const storedUser = localStorage.getItem("loggedInUser");

    if (storedUser) {
        currentUser = JSON.parse(storedUser);

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

function updateStatsFromData() {
    // Get applied jobs count from localStorage
    const appliedJobs = JSON.parse(localStorage.getItem("appliedJobs")) || [];
    const savedJobs = JSON.parse(localStorage.getItem("savedJobs")) || [];

    // Update the applied jobs stat
    const appliedStat = document.querySelector('.stat-card .stat-icon.applied').parentElement.querySelector('.stat-num');
    if (appliedStat) {
        appliedStat.setAttribute("data-target", appliedJobs.length);
    }

    // Update the saved jobs stat
    const savedStat = document.querySelector('.stat-card .stat-icon.saved').parentElement.querySelector('.stat-num');
    if (savedStat) {
        savedStat.setAttribute("data-target", savedJobs.length);
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
function handleSignOut() {
    localStorage.removeItem("loggedInUser");
    localStorage.removeItem("rememberMe");
    window.location.href = "LandingPage2.html";
}

document.querySelectorAll('a[href="LandingPage2.html"]').forEach(function(link) {
    link.addEventListener("click", function(event) {
        event.preventDefault();
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
    const storedUser = localStorage.getItem("loggedInUser");
    if (!storedUser) {
        window.location.href = "Login.html";
        return;
    }

    updateUserInfo();
    updateStatsFromData();
    animateCounters();
    highlightActiveLink();
}

document.addEventListener("DOMContentLoaded", initDashboard);