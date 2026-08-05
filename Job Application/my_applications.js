/* ============================================================
   MY APPLICATIONS PAGE - JavaScript
   ============================================================ */

/* SECTION 1: CACHE DOM ELEMENTS */
const appList = document.querySelector(".app-list");
const filterRadios = document.querySelectorAll('input[name="filter"]');
const countBadges = document.querySelectorAll(".count-badge");

/* SECTION 2: VARIABLES */
// LATER BACKEND: GET /api/applications?userId=...
let applications = [];

function getDefaultApplications() {
    return [
        { id: 1, jobId: 1, title: "Frontend Developer", company: "Facebook", logo: "FB", location: "Remote", salary: "$80k - $120k", status: "Pending", appliedDate: "2 days ago" },
        { id: 2, jobId: 2, title: "Backend Engineer", company: "Google", logo: "GG", location: "Mountain View", salary: "$120k - $160k", status: "Interview", appliedDate: "Interview Fri 10AM" },
        { id: 3, jobId: 3, title: "UI/UX Designer", company: "Apple", logo: "AP", location: "Cupertino", salary: "$90k - $130k", status: "Rejected", appliedDate: "1 week ago" },
        { id: 4, jobId: 4, title: "Full Stack Developer", company: "Amazon", logo: "AM", location: "Seattle", salary: "$100k - $140k", status: "Pending", appliedDate: "5 days ago" },
        { id: 5, jobId: 5, title: "DevOps Engineer", company: "Salesforce", logo: "SF", location: "San Francisco", salary: "$110k - $150k", status: "Accepted", appliedDate: "2 weeks ago" },
        { id: 6, jobId: 7, title: "Senior Frontend Developer", company: "Netflix", logo: "NF", location: "Los Angeles", salary: "$140k - $180k", status: "Interview", appliedDate: "Interview Next Mon" },
        { id: 7, jobId: 6, title: "Data Analyst", company: "Spotify", logo: "SP", location: "Remote", salary: "$60k - $80k", status: "Pending", appliedDate: "4 days ago" },
        { id: 8, jobId: 9, title: "Software Engineer", company: "Twitter", logo: "TW", location: "San Francisco", salary: "$100k - $130k", status: "Rejected", appliedDate: "3 weeks ago" }
    ];
}

/* SECTION 3: HELPER FUNCTIONS */
function createAppCard(app) {
    const statusClass = app.status.toLowerCase();
    return `
        <div class="app-card status-${statusClass}" data-id="${app.id}">
            <div class="app-card-left">
                <div class="app-card-logo">${app.logo}</div>
                <div class="app-card-info">
                    <h3>${app.title}</h3>
                    <p class="app-card-company">${app.company}</p>
                    <p class="app-card-detail"><span class="glyphicon glyphicon-map-marker"></span> ${app.location} &bull; <span class="glyphicon glyphicon-usd"></span> ${app.salary}</p>
                </div>
            </div>
            <div class="app-card-right">
                <span class="app-status-tag ${statusClass}">${app.status}</span>
                <span class="app-date">${app.appliedDate}</span>
                <button class="withdraw-btn" data-id="${app.id}">Withdraw</button>
            </div>
        </div>
    `;
}

function renderApplications(filter) {
    const filtered = filter === "all"
        ? applications
        : applications.filter(a => a.status.toLowerCase() === filter);

    if (filtered.length === 0) {
        appList.innerHTML = '<div class="empty-state"><span class="glyphicon glyphicon-document"></span><h3>No applications found</h3><p>Apply to jobs to see them here.</p></div>';
        return;
    }

    appList.innerHTML = filtered.map(app => createAppCard(app)).join("");

    // Attach withdraw listeners
    document.querySelectorAll(".withdraw-btn").forEach(btn => {
        btn.addEventListener("click", function(e) {
            e.stopPropagation();
            const appId = parseInt(this.dataset.id);
            withdrawApplication(appId);
        });
    });
}

function updateCounts() {
    const counts = { pending: 0, interview: 0, accepted: 0, rejected: 0 };
    applications.forEach(app => {
        const s = app.status.toLowerCase();
        if (counts[s] !== undefined) counts[s]++;
    });

    document.querySelectorAll(".count-badge").forEach(badge => {
        const parent = badge.closest(".filter-label");
        if (parent) {
            const text = parent.textContent.trim().toLowerCase();
            Object.keys(counts).forEach(key => {
                if (text.includes(key)) {
                    badge.textContent = counts[key];
                }
            });
        }
    });
}

function withdrawApplication(appId) {
    if (!confirm("Are you sure you want to withdraw this application?")) return;

    applications = applications.filter(app => app.id !== appId);
    localStorage.setItem("myApplications", JSON.stringify(applications));
    updateCounts();

    // Re-render with current filter
    const checkedFilter = document.querySelector('input[name="filter"]:checked');
    const filter = checkedFilter ? checkedFilter.id.replace("filter-", "") : "all";
    renderApplications(filter);
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
   ------------------------------------------------ */
function handleSignOut() {
    // Step 1: Remove the logged-in user from localStorage
    localStorage.removeItem("loggedInUser");

    // Step 2: Remove the remember-me preference
    localStorage.removeItem("rememberMe");

    // Step 3: Navigate to the landing page
    window.location.href = "LandingPage2.html";
}

// Attach sign-out handler to all "Sign Out" links
document.querySelectorAll('a[href="LandingPage2.html"]').forEach(function(link) {
    link.addEventListener("click", function(event) {
        // Prevent the default navigation
        event.preventDefault();
        // Call our sign-out function instead
        handleSignOut();
    });
});

filterRadios.forEach(radio => {
    radio.addEventListener("change", function() {
        const filter = this.id.replace("filter-", "");
        renderApplications(filter);
    });
});

/* SECTION 5: MAIN LOGIC */
function initMyApplications() {
    const storedUser = localStorage.getItem("loggedInUser");
    if (!storedUser) {
        window.location.href = "Login.html";
        return;
    }

    // Load applications from localStorage (saved from Job Details page)
    const storedApps = localStorage.getItem("myApplications");
    if (storedApps) {
        const parsed = JSON.parse(storedApps);
        if (parsed.length > 0) {
            applications = parsed;
        } else {
            applications = getDefaultApplications();
        }
    } else {
        // First time: use default fake applications
        applications = getDefaultApplications();
        localStorage.setItem("myApplications", JSON.stringify(applications));
    }

    renderApplications("all");
    updateCounts();
    console.log("My Applications initialized with", applications.length, "applications");
}

document.addEventListener("DOMContentLoaded", initMyApplications);