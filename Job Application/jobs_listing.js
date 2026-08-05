/* ============================================================
   JOB LISTINGS PAGE - JavaScript
   ============================================================ */

/* SECTION 1: CACHE DOM ELEMENTS */
const jobGrid = document.querySelector(".job-grid");
const searchInput = document.querySelector(".search-bar input");
const searchButton = document.querySelector(".search-btn");
const locationFilter = document.getElementById("location");
const categoryFilter = document.getElementById("category");
const experienceFilter = document.getElementById("experience");
const salaryFilter = document.getElementById("salary");
const resultsInfo = document.querySelector(".results-info span");
const paginationContainer = document.querySelector(".pagination");

/* SECTION 2: VARIABLES */
// LATER BACKEND: This will be fetched from GET /api/jobs
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

let currentPage = 1;
const jobsPerPage = 6;
let filteredJobs = [...fakeJobs];
let savedJobs = JSON.parse(localStorage.getItem("savedJobs")) || [];

/* SECTION 3: HELPER FUNCTIONS */
function createJobCard(job) {
    const isSaved = savedJobs.includes(job.id);

    return `
        <div class="job-card" data-id="${job.id}">
            <div class="job-top">
                <div class="job-logo">${job.logo}</div>
                <div class="job-info">
                    <h3>${job.title}</h3>
                    <p class="company"><span class="glyphicon glyphicon-briefcase"></span> ${job.company}</p>
                </div>
                <span class="job-badge ${job.type.toLowerCase().replace(" ", "-")}">${job.type}</span>
            </div>
            <div class="job-mid">
                <span><span class="glyphicon glyphicon-map-marker"></span> ${job.location}</span>
                <span><span class="glyphicon glyphicon-usd"></span> ${job.salary}</span>
                <span><span class="glyphicon glyphicon-time"></span> Posted ${job.posted}</span>
            </div>
            <p class="job-desc">${job.desc}</p>
            <div class="job-tags">
                ${job.tags.map(tag => `<span>${tag}</span>`).join("")}
            </div>
            <div class="job-actions">
                <a href="JobDetailsPage.html?id=${job.id}" class="view-job-btn">View Details</a>
                <button class="save-job-btn ${isSaved ? 'saved' : ''}" data-id="${job.id}">
                    <span class="glyphicon ${isSaved ? 'glyphicon-heart' : 'glyphicon-heart-empty'}"></span>
                </button>
            </div>
        </div>
    `;
}

function renderJobs() {
    if (filteredJobs.length === 0) {
        jobGrid.innerHTML = '<div class="empty-state"><span class="glyphicon glyphicon-search"></span><h3>No jobs found</h3><p>Try adjusting your filters or search terms.</p></div>';
        resultsInfo.textContent = "Showing 0 jobs";
        paginationContainer.innerHTML = "";
        return;
    }

    const startIndex = (currentPage - 1) * jobsPerPage;
    const endIndex = startIndex + jobsPerPage;
    const pageJobs = filteredJobs.slice(startIndex, endIndex);

    jobGrid.innerHTML = pageJobs.map(job => createJobCard(job)).join("");
    resultsInfo.textContent = `Showing ${pageJobs.length} of ${filteredJobs.length} jobs`;

    renderPagination();
    attachSaveListeners();
    attachCardClickListeners();
}

function renderPagination() {
    const totalPages = Math.ceil(filteredJobs.length / jobsPerPage);
    if (totalPages <= 1) {
        paginationContainer.innerHTML = "";
        return;
    }

    let html = "";
    for (let i = 1; i <= totalPages; i++) {
        html += `<a href="#" class="page-btn ${i === currentPage ? 'active' : ''}" data-page="${i}">${i}</a>`;
    }
    paginationContainer.innerHTML = html;

    document.querySelectorAll(".page-btn").forEach(btn => {
        btn.addEventListener("click", function(e) {
            e.preventDefault();
            currentPage = parseInt(this.dataset.page);
            renderJobs();
        });
    });
}

function attachSaveListeners() {
    document.querySelectorAll(".save-job-btn").forEach(btn => {
        btn.addEventListener("click", function(e) {
            e.preventDefault();
            const jobId = parseInt(this.dataset.id);
            toggleSaveJob(jobId);
        });
    });
}

function attachCardClickListeners() {
    document.querySelectorAll(".job-card").forEach(card => {
        card.addEventListener("click", function(e) {
            if (e.target.closest(".save-job-btn") || e.target.closest(".view-job-btn")) return;
            const jobId = this.dataset.id;
            window.location.href = `JobDetailsPage.html?id=${jobId}`;
        });
    });
}

function toggleSaveJob(jobId) {
    const index = savedJobs.indexOf(jobId);
    if (index === -1) {
        savedJobs.push(jobId);
    } else {
        savedJobs.splice(index, 1);
    }
    localStorage.setItem("savedJobs", JSON.stringify(savedJobs));
    renderJobs();
}

function applyFilters() {
    const search = searchInput.value.toLowerCase().trim();
    const location = locationFilter.value;
    const category = categoryFilter.value;
    const experience = experienceFilter.value;
    const salary = salaryFilter.value;

    currentPage = 1;

    filteredJobs = fakeJobs.filter(job => {
        if (search && !job.title.toLowerCase().includes(search) && !job.company.toLowerCase().includes(search) && !job.tags.some(t => t.toLowerCase().includes(search))) {
            return false;
        }
        if (location !== "All Locations" && job.location !== location) return false;
        if (category !== "All Categories" && job.category !== category) return false;
        if (experience !== "Any Experience" && job.experience !== experience) return false;
        return true;
    });

    renderJobs();
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

searchButton.addEventListener("click", applyFilters);
searchInput.addEventListener("keyup", function(e) {
    if (e.key === "Enter") applyFilters();
});
locationFilter.addEventListener("change", applyFilters);
categoryFilter.addEventListener("change", applyFilters);
experienceFilter.addEventListener("change", applyFilters);
salaryFilter.addEventListener("change", applyFilters);

/* SECTION 5: MAIN LOGIC */
function initJobsListing() {
    const storedUser = localStorage.getItem("loggedInUser");
    if (!storedUser) {
        window.location.href = "Login.html";
        return;
    }

    renderJobs();
    console.log("Job Listings initialized with", fakeJobs.length, "fake jobs");
}

document.addEventListener("DOMContentLoaded", initJobsListing);