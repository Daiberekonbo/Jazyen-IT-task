/* ============================================================
   SAVED JOBS PAGE - JavaScript
   ============================================================ */

/* SECTION 1: CACHE DOM ELEMENTS */
const savedGrid = document.getElementById("savedGrid");
const emptyState = document.getElementById("emptyState");
const searchInput = document.getElementById("searchInput");
const sortSelect = document.getElementById("sortSelect");

/* SECTION 2: VARIABLES */
// LATER BACKEND: This will be fetched from GET /api/jobs
// Same data as jobs_listing.js so we can look up saved job details
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

// Read saved job IDs from localStorage, default to empty array if none
let savedJobIds = JSON.parse(localStorage.getItem("savedJobs")) || [];

/* SECTION 3: HELPER FUNCTIONS */

// Creates HTML for a single saved job card
function createSavedCard(job) {
    return `
        <div class="saved-card" data-id="${job.id}">
            <div class="saved-card-top">
                <div class="saved-card-logo">${job.logo}</div>
                <div class="saved-card-info">
                    <h3>${job.title}</h3>
                    <p><span class="glyphicon glyphicon-briefcase"></span> ${job.company}</p>
                </div>
            </div>
            <div class="saved-card-mid">
                <span><span class="glyphicon glyphicon-map-marker"></span> ${job.location}</span>
                <span><span class="glyphicon glyphicon-usd"></span> ${job.salary}</span>
                <span><span class="glyphicon glyphicon-time"></span> Posted ${job.posted}</span>
            </div>
            <div class="saved-card-actions">
                <a href="JobDetailsPage.html?id=${job.id}" class="apply-btn">Apply Now</a>
                <button class="remove-btn" data-id="${job.id}">
                    <span class="glyphicon glyphicon-trash"></span> Remove
                </button>
            </div>
        </div>
    `;
}

// Gets the full job objects for all saved IDs
function getSavedJobs() {
    return fakeJobs.filter(function(job) {
        return savedJobIds.includes(job.id);
    });
}

// Renders saved jobs to the page
function renderSavedJobs() {
    let savedJobs = getSavedJobs();

    // If no saved jobs, show empty state and hide grid
    if (savedJobs.length === 0) {
        savedGrid.innerHTML = "";
        savedGrid.style.display = "none";
        emptyState.style.display = "block";
        return;
    }

    // Show grid, hide empty state
    savedGrid.style.display = "grid";
    emptyState.style.display = "none";

    // Convert each job to HTML and set as grid content
    savedGrid.innerHTML = savedJobs.map(function(job) {
        return createSavedCard(job);
    }).join("");
}

// Handles search filtering
function handleSearch() {
    const searchTerm = searchInput.value.toLowerCase().trim();
    let savedJobs = getSavedJobs();

    // If there's a search term, filter matching jobs
    if (searchTerm) {
        savedJobs = savedJobs.filter(function(job) {
            return job.title.toLowerCase().includes(searchTerm) ||
                   job.company.toLowerCase().includes(searchTerm);
        });
    }

    // If no results after filtering, show empty state
    if (savedJobs.length === 0) {
        savedGrid.innerHTML = "";
        savedGrid.style.display = "none";
        emptyState.style.display = "block";
        return;
    }

    // Show results
    savedGrid.style.display = "grid";
    emptyState.style.display = "none";
    savedGrid.innerHTML = savedJobs.map(function(job) {
        return createSavedCard(job);
    }).join("");
}

// Handles sorting
function handleSort() {
    const sortValue = sortSelect.value;
    let savedJobs = getSavedJobs();

    if (sortValue === "company") {
        // Sort alphabetically A-Z by company name
        savedJobs.sort(function(a, b) {
            return a.company.localeCompare(b.company);
        });
    } else if (sortValue === "salary") {
        // Sort by salary: extract number from "$80k - $120k" and compare
        savedJobs.sort(function(a, b) {
            const salaryA = parseInt(a.salary.replace(/[^0-9]/g, "")) || 0;
            const salaryB = parseInt(b.salary.replace(/[^0-9]/g, "")) || 0;
            return salaryB - salaryA;  // High to low
        });
    }
    // "recent" is default - no sorting needed, preserves original order

    // Re-render with sorted jobs
    savedGrid.innerHTML = savedJobs.map(function(job) {
        return createSavedCard(job);
    }).join("");
}

// Removes a job from saved jobs
function removeSavedJob(jobId) {
    // Find the index of the job ID in the array
    const index = savedJobIds.indexOf(jobId);

    // If found, remove it from the array
    if (index !== -1) {
        savedJobIds.splice(index, 1);
    }

    // Save the updated array back to localStorage
    localStorage.setItem("savedJobs", JSON.stringify(savedJobIds));

    // Re-render the page (will show empty state if no jobs left)
    renderSavedJobs();
}

/* SECTION 4: EVENT LISTENERS */

// Search as user types
searchInput.addEventListener("input", handleSearch);

// Sort when dropdown changes
sortSelect.addEventListener("change", handleSort);

// Event delegation: listen on grid for remove button clicks
savedGrid.addEventListener("click", function(event) {
    const removeBtn = event.target.closest(".remove-btn");
    if (removeBtn) {
        const jobId = parseInt(removeBtn.dataset.id);
        removeSavedJob(jobId);
    }
});

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
function initSavedJobs() {
    // Check if user is logged in
    const storedUser = localStorage.getItem("loggedInUser");
    if (!storedUser) {
        window.location.href = "Login.html";
        return;
    }

    // Render the saved jobs
    renderSavedJobs();
    console.log("Saved Jobs initialized with", savedJobIds.length, "saved jobs");
}

// Initialize when the DOM is fully loaded
document.addEventListener("DOMContentLoaded", initSavedJobs);