/* ============================================================
   MY APPLICATIONS PAGE - JavaScript
   ============================================================ */

/* SECTION 1: CACHE DOM ELEMENTS */
const appList = document.querySelector(".app-list");
const filterRadios = document.querySelectorAll('input[name="filter"]');
const countBadges = document.querySelectorAll(".count-badge");

/* SECTION 2: VARIABLES */
let applications = [];

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
                <span class="app-date">${app.appliedDate || app.date || ""}</span>
                <button class="withdraw-btn" data-id="${app.id}">Withdraw</button>
            </div>
        </div>
    `;
}

function renderApplications(filter) {
    const filtered = filter === "all"
        ? applications
        : applications.filter(function(a) {
            return a.status.toLowerCase() === filter;
        });

    if (filtered.length === 0) {
        appList.innerHTML = '<div class="empty-state"><span class="glyphicon glyphicon-document"></span><h3>No applications found</h3><p>Apply to jobs to see them here.</p></div>';
        return;
    }

    appList.innerHTML = filtered.map(function(app) {
        return createAppCard(app);
    }).join("");

    // Attach withdraw listeners
    document.querySelectorAll(".withdraw-btn").forEach(function(btn) {
        btn.addEventListener("click", function(e) {
            e.stopPropagation();
            const appId = parseInt(this.dataset.id);
            withdrawApplication(appId);
        });
    });
}

function updateCounts() {
    const counts = { pending: 0, interview: 0, accepted: 0, rejected: 0 };
    applications.forEach(function(app) {
        const s = app.status.toLowerCase();
        if (counts[s] !== undefined) counts[s]++;
    });

    document.querySelectorAll(".count-badge").forEach(function(badge) {
        const parent = badge.closest(".filter-label");
        if (parent) {
            const text = parent.textContent.trim().toLowerCase();
            Object.keys(counts).forEach(function(key) {
                if (text.includes(key)) {
                    badge.textContent = counts[key];
                }
            });
        }
    });
}

function withdrawApplication(appId) {
    if (!confirm("Are you sure you want to withdraw this application?")) return;

    applications = applications.filter(function(app) {
        return app.id !== appId;
    });
    localStorage.setItem("appliedJobs", JSON.stringify(applications));
    updateCounts();

    const checkedFilter = document.querySelector('input[name="filter"]:checked');
    const filter = checkedFilter ? checkedFilter.id.replace("filter-", "") : "all";
    renderApplications(filter);
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

filterRadios.forEach(function(radio) {
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

    // Try to fetch applications for the current user from backend
    (async function() {
        const user = getCurrentUser();
        if (!user) return;
        const applicantId = user.id || user.email;

        try {
            const resp = await (window.fetchWithAuth ? fetchWithAuth('/api/applications/?applicant_id=' + encodeURIComponent(applicantId)) : fetch('/api/applications/?applicant_id=' + encodeURIComponent(applicantId)));
            if (resp && resp.ok) {
                const data = await resp.json();
                // Map backend application objects to the UI shape
                applications = data.map(a => ({
                    id: a._id || a.id,
                    title: a.title || a.job_title || '',
                    company: a.company || '',
                    logo: (a.company || '').slice(0,2).toUpperCase(),
                    location: a.location || '',
                    salary: a.salary || '',
                    status: (a.status || 'pending').charAt(0).toUpperCase() + (a.status || 'pending').slice(1),
                    appliedDate: a.applied_at || a.appliedDate || ''
                }));
                renderApplications("all");
                updateCounts();
                return;
            }
        } catch (err) {
            console.warn('Failed to fetch applications from API', err);
        }

        // Fallback to localStorage
        const storedApps = localStorage.getItem("appliedJobs");
        if (storedApps) {
            applications = JSON.parse(storedApps);
        } else {
            applications = [];
        }
        renderApplications("all");
        updateCounts();
    })();
}

document.addEventListener("DOMContentLoaded", initMyApplications);