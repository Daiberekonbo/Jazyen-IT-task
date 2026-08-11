/* ============================================================
   JOB DETAILS PAGE - JavaScript
   ============================================================ */

/* SECTION 1: CACHE DOM ELEMENTS */
const detailLogo = document.querySelector(".detail-logo");
const detailTitle = document.querySelector(".detail-title h2");
const detailCompany = document.querySelector(".detail-title .company");
const detailMeta = document.querySelector(".detail-meta");
const applyBtn = document.querySelector(".apply-btn");
const tabLabels = document.querySelectorAll(".tab-label");

/* SECTION 2: VARIABLES */
// Same fake jobs array as listings page
const fakeJobs = [
    { id: 1, title: "Frontend Developer", company: "Facebook", logo: "FB", location: "Remote", salary: "$80k - $120k", type: "Full Time", posted: "2 days ago" },
    { id: 2, title: "Backend Engineer", company: "Google", logo: "GG", location: "Mountain View", salary: "$120k - $160k", type: "Full Time", posted: "1 day ago" },
    { id: 3, title: "UI/UX Designer", company: "Apple", logo: "AP", location: "Cupertino", salary: "$90k - $130k", type: "Contract", posted: "3 days ago" },
    { id: 4, title: "Full Stack Developer", company: "Amazon", logo: "AM", location: "Seattle", salary: "$100k - $140k", type: "Full Time", posted: "5 days ago" },
    { id: 5, title: "DevOps Engineer", company: "Salesforce", logo: "SF", location: "San Francisco", salary: "$110k - $150k", type: "Full Time", posted: "1 week ago" },
    { id: 6, title: "Data Analyst", company: "Spotify", logo: "SP", location: "Remote", salary: "$60k - $80k", type: "Part Time", posted: "4 days ago" },
    { id: 7, title: "React Developer", company: "Netflix", logo: "NF", location: "Remote", salary: "$130k - $170k", type: "Full Time", posted: "1 day ago" },
    { id: 8, title: "Junior Developer", company: "Microsoft", logo: "MS", location: "New York", salary: "$40k - $60k", type: "Full Time", posted: "1 week ago" },
    { id: 9, title: "DevOps Intern", company: "Oracle", logo: "OR", location: "London", salary: "$40k - $60k", type: "Internship", posted: "2 days ago" }
];

let currentJob = null;

/* SECTION 3: HELPER FUNCTIONS */
function loadJobDetails() {
    // Get job ID from URL query parameter
    const urlParams = new URLSearchParams(window.location.search);
    const jobId = parseInt(urlParams.get("id")) || 1;

    // Try to fetch jobs from API and find the job by id (string or number)
    const idParam = urlParams.get("id");
    const idStr = idParam ? String(idParam) : String(jobId);
    currentJob = null;
    if (window.fetchWithAuth) {
        try {
            const resp = await fetchWithAuth('/api/jobs/');
            if (resp.ok) {
                const data = await resp.json();
                const found = data.find(j => String(j._id || j.id) === idStr);
                if (found) {
                    currentJob = {
                        id: found._id || found.id,
                        title: found.title || 'Untitled',
                        company: found.employer_id || 'Company',
                        logo: (found.employer_id || 'CP').slice(0,2).toUpperCase(),
                        location: found.location || 'Remote',
                        salary: found.salary || 'Not specified',
                        type: found.type || 'Full Time',
                        posted: found.created_at || ''
                    };
                }
            }
        } catch (err) {
            console.warn('Failed to load job from API', err);
        }
    }

    // Fallback to fake data if API didn't provide the job
    if (!currentJob) {
        currentJob = fakeJobs.find(j => String(j.id) === idStr) || fakeJobs[0];
    }

    // Update the page with job details
    detailLogo.textContent = currentJob.logo;
    detailTitle.textContent = currentJob.title;
    detailCompany.innerHTML = `<span class="glyphicon glyphicon-briefcase"></span> ${currentJob.company} &bull; <span class="glyphicon glyphicon-map-marker"></span> ${currentJob.location}`;
    detailMeta.innerHTML = `
        <span class="job-badge ${currentJob.type.toLowerCase().replace(" ", "-")}">${currentJob.type}</span>
        <span><span class="glyphicon glyphicon-usd"></span> ${currentJob.salary}</span>
        <span><span class="glyphicon glyphicon-time"></span> Posted ${currentJob.posted}</span>
    `;
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

applyBtn.addEventListener("click", function(e) {
    e.preventDefault();

    if (!currentJob) return;

    // Use backend POST /api/applications/ when available
    (async function() {
        const storedUser = getCurrentUser();
        if (!storedUser) {
            window.location.href = "Login.html";
            return;
        }

        const applicantId = storedUser.id || storedUser.email || null;
        if (!applicantId) {
            alert('Unable to determine applicant id.');
            return;
        }

        try {
            const resp = await (window.fetchWithAuth ? fetchWithAuth('/api/applications/', { method: 'POST', body: JSON.stringify({ job_id: String(currentJob.id), applicant_id: String(applicantId), resume_url: '' }) }) : fetch('/api/applications/', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ job_id: String(currentJob.id), applicant_id: String(applicantId), resume_url: '' }) }));

            if (resp && (resp.status === 201 || resp.ok)) {
                applyBtn.textContent = "Applied!";
                applyBtn.style.backgroundColor = "#28a745";
                applyBtn.style.borderColor = "#28a745";
                applyBtn.style.color = "#fff";
                applyBtn.style.pointerEvents = "none";
                return;
            }

            const data = await resp.json();
            alert(data.error || data.detail || 'Failed to apply.');
        } catch (err) {
            alert('Network error while applying.');
        }
    })();
});

/* SECTION 5: MAIN LOGIC */
function initJobDetails() {
    const storedUser = localStorage.getItem("loggedInUser");
    if (!storedUser) {
        window.location.href = "Login.html";
        return;
    }

    loadJobDetails();
    console.log("Job Details page initialized");
}

document.addEventListener("DOMContentLoaded", initJobDetails);