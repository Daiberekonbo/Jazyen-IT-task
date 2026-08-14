/* ============================================================
   APPLICATION SUCCESS PAGE - JavaScript
   ============================================================ */

/* SECTION 1: CACHE DOM ELEMENTS */
const jobSummary = document.getElementById("jobSummary");
const summaryLoading = document.getElementById("summaryLoading");

/* SECTION 2: VARIABLES */
// LATER BACKEND: This will be fetched from GET /api/jobs
// Same data as jobs_listing.js so we can look up job details by ID
const fakeJobs = [
    { id: 1, title: "Frontend Developer", company: "Facebook", logo: "FB", location: "Remote", salary: "$80k - $120k", type: "Full Time", category: "Frontend", experience: "Mid Level", posted: "2d ago", tags: ["React", "TypeScript", "CSS"], desc: "Build and maintain modern web applications using React, TypeScript, and CSS." },
    { id: 2, title: "Backend Engineer", company: "Google", logo: "GG", location: "Mountain View", salary: "$120k - $160k", type: "Full Time", category: "Backend", experience: "Senior", posted: "1d ago", tags: ["Go", "Python", "Kubernetes"], desc: "Design and implement scalable backend services." },
    { id: 3, title: "UI/UX Designer", company: "Apple", logo: "AP", location: "Cupertino", salary: "$90k - $130k", type: "Contract", category: "Design", experience: "Mid Level", posted: "3d ago", tags: ["Figma", "Prototyping", "Design Systems"], desc: "Create intuitive user interfaces for millions of users." },
    { id: 4, title: "Full Stack Developer", company: "Amazon", logo: "AM", location: "Seattle", salary: "$100k - $140k", type: "Full Time", category: "Full Stack", experience: "Senior", posted: "5d ago", tags: ["Java", "React", "AWS"], desc: "Develop end-to-end features for e-commerce platform." },
    { id: 5, title: "DevOps Engineer", company: "Salesforce", logo: "SF", location: "San Francisco", salary: "$110k - $150k", type: "Full Time", category: "DevOps", experience: "Senior", posted: "1w ago", tags: ["Docker", "Terraform", "CI/CD"], desc: "Manage CI/CD pipelines and cloud infrastructure." },
    { id: 6, title: "Data Analyst", company: "Spotify", logo: "SP", location: "Remote", salary: "$60k - $80k", type: "Part Time", category: "Backend", experience: "Entry Level", posted: "4d ago", tags: ["SQL", "Python", "Tableau"], desc: "Analyze user behavior data to drive product decisions." },
    { id: 7, title: "React Developer", company: "Netflix", logo: "NF", location: "Remote", salary: "$130k - $170k", type: "Full Time", category: "Frontend", experience: "Senior", posted: "1d ago", tags: ["React", "Redux", "GraphQL"], desc: "Build streaming UI components used by millions." },
    { id: 8, title: "Junior Developer", company: "Microsoft", logo: "MS", location: "New York", salary: "$40k - $60k", type: "Full Time", category: "Frontend", experience: "Entry Level", posted: "1w ago", tags: ["HTML", "CSS", "JavaScript"], desc: "Learn and grow with our experienced team." },
    { id: 9, title: "DevOps Intern", company: "Oracle", logo: "OR", location: "London", salary: "$40k - $60k", type: "Internship", category: "DevOps", experience: "Entry Level", posted: "2d ago", tags: ["Linux", "Docker", "Bash"], desc: "Assist with infrastructure automation and monitoring." }
];

// Track applied jobs in localStorage so MyApplicationsPage can show them
let appliedJobs = JSON.parse(localStorage.getItem("appliedJobs")) || [];

/* SECTION 3: HELPER FUNCTIONS */

// Renders the job summary card
function renderJobSummary(job) {
    summaryLoading.style.display = "none";

    jobSummary.innerHTML = `
        <div class="summary-header">
            <div class="summary-logo">${job.logo}</div>
            <div class="summary-info">
                <h3>${job.title}</h3>
                <p><span class="fas fa-briefcase"></span> ${job.company}</p>
            </div>
            <span class="summary-status">Applied</span>
        </div>
        <div class="summary-details">
            <span class="summary-detail">
                <span class="fas fa-map-marker-alt"></span> ${job.location}
            </span>
            <span class="summary-detail">
                <span class="fas fa-dollar-sign"></span> ${job.salary}
            </span>
            <span class="summary-detail">
                <span class="fas fa-clock"></span> ${job.type}
            </span>
            <span class="summary-detail">
                <span class="fas fa-graduation-cap"></span> ${job.experience}
            </span>
        </div>
    `;
}

// Saves the applied job to localStorage
function saveApplication(job) {
    // Create an application record
    const application = {
        id: job.id,
        title: job.title,
        company: job.company,
        logo: job.logo,
        location: job.location,
        salary: job.salary,
        type: job.type,
        appliedDate: new Date().toLocaleDateString(),
        status: "Pending"
    };

    // Add to applied jobs if not already there
    const alreadyApplied = appliedJobs.some(function(app) {
        return app.id === job.id;
    });

    if (!alreadyApplied) {
        appliedJobs.push(application);
        localStorage.setItem("appliedJobs", JSON.stringify(appliedJobs));
    }
}

/* SECTION 4: EVENT LISTENERS */

/* ------------------------------------------------
   FUNCTION: handleSignOut()
   Signs the user out by clearing session data
   ------------------------------------------------ */
function handleSignOut() {
    localStorage.removeItem("loggedInUser");
    localStorage.removeItem("rememberMe");
    window.location.href = "LandingPage2.html";
}

// Attach sign-out handler to all "Sign Out" links
document.querySelectorAll('a[href="LandingPage2.html"]').forEach(function(link) {
    link.addEventListener("click", function(event) {
        event.preventDefault();
        handleSignOut();
    });
});

/* SECTION 5: MAIN LOGIC */
function initSuccessPage() {
    // Check if user is logged in
    const storedUser = localStorage.getItem("loggedInUser");
    if (!storedUser) {
        window.location.href = "Login.html";
        return;
    }

    // Get the job ID from the URL (?id=3)
    const urlParams = new URLSearchParams(window.location.search);
    const jobId = parseInt(urlParams.get("id"));

    // Find the job
    const job = fakeJobs.find(function(j) {
        return j.id === jobId;
    });

    if (job) {
        // Simulate loading delay to show the spinner
        setTimeout(function() {
            renderJobSummary(job);
            saveApplication(job);
        }, 800);
    } else {
        // Job not found - show a message
        summaryLoading.style.display = "none";
        jobSummary.innerHTML = `
            <div class="summary-loading">
                <p>We couldn't find the job you applied for.</p>
                <a href="JobsListingPage.html" class="action-btn secondary" style="margin-top: 15px;">
                    <span class="fas fa-search"></span> Browse Jobs
                </a>
            </div>
        `;
    }

    console.log("Success page initialized for job ID:", jobId);
}

// Initialize when the DOM is fully loaded
document.addEventListener("DOMContentLoaded", initSuccessPage);