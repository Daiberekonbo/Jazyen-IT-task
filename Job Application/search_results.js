/* ============================================================
   SEARCH RESULTS PAGE - JavaScript
   ============================================================ */

/* SECTION 1: CACHE DOM ELEMENTS */
const searchInput = document.getElementById("searchInput");
const searchBtn = document.getElementById("searchBtn");
const recentSearchesContainer = document.getElementById("recentSearches");
const jobGrid = document.getElementById("jobGrid");
const emptyState = document.getElementById("emptyState");
const resultCount = document.getElementById("resultCount");
const locationFilter = document.getElementById("location");
const categoryFilter = document.getElementById("category");
const experienceFilter = document.getElementById("experience");
const sortBySelect = document.getElementById("sortBy");

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

// Load recent searches from localStorage
let recentSearches = JSON.parse(localStorage.getItem("recentSearches")) || [];

// Current search term (initialized from URL parameter if present)
let currentSearch = "";
let savedJobs = JSON.parse(localStorage.getItem("savedJobs")) || [];

/* SECTION 3: HELPER FUNCTIONS */

// Creates HTML for a single job card
function createJobCard(job) {
    const isSaved = savedJobs.includes(job.id);
    const typeClass = job.type.toLowerCase().replace(" ", "-");

    return `
        <div class="job-card" data-id="${job.id}">
            <div class="job-top">
                <div class="job-logo">${job.logo}</div>
                <div class="job-info">
                    <h3>${job.title}</h3>
                    <p class="company"><span class="fas fa-briefcase"></span> ${job.company}</p>
                </div>
                <span class="job-badge ${typeClass}">${job.type}</span>
            </div>
            <div class="job-mid">
                <span><span class="fas fa-map-marker-alt"></span> ${job.location}</span>
                <span><span class="fas fa-dollar-sign"></span> ${job.salary}</span>
                <span><span class="fas fa-clock"></span> Posted ${job.posted}</span>
            </div>
            <p class="job-desc">${job.desc}</p>
            <div class="job-tags">
                ${job.tags.map(tag => `<span>${tag}</span>`).join("")}
            </div>
        </div>
    `;
}

// Saves a search term to recent searches
function saveRecentSearch(term) {
    if (!term) return;

    // Remove if already exists
    recentSearches = recentSearches.filter(function(s) {
        return s.toLowerCase() !== term.toLowerCase();
    });

    // Add to the front
    recentSearches.unshift(term);

    // Keep only the last 5
    if (recentSearches.length > 5) {
        recentSearches = recentSearches.slice(0, 5);
    }

    localStorage.setItem("recentSearches", JSON.stringify(recentSearches));
}

// Renders recent search chips
function renderRecentSearches() {
    if (recentSearches.length === 0) {
        recentSearchesContainer.innerHTML = '<span class="chip" style="opacity: 0.5; cursor: default;">No recent searches</span>';
        return;
    }

    recentSearchesContainer.innerHTML = recentSearches.map(function(term) {
        return `<span class="chip" data-search="${term}">${term}</span>`;
    }).join("");
}

// Performs the search and renders results
function performSearch() {
    const searchTerm = searchInput.value.toLowerCase().trim();
    currentSearch = searchTerm;

    // Save to recent searches if there's a term
    if (searchTerm) {
        saveRecentSearch(searchTerm);
        renderRecentSearches();
    }

    // Get filter values
    const location = locationFilter.value;
    const category = categoryFilter.value;
    const experience = experienceFilter.value;
    const sortBy = sortBySelect.value;

    // Filter jobs
    let results = fakeJobs.filter(function(job) {
        // Search term matching
        if (searchTerm) {
            const searchable = (job.title + " " + job.company + " " + job.location + " " + job.tags.join(" ")).toLowerCase();
            if (!searchable.includes(searchTerm)) return false;
        }

        // Location filter
        if (location !== "All Locations" && job.location !== location) return false;

        // Category filter
        if (category !== "All Categories" && job.category !== category) return false;

        // Experience filter
        if (experience !== "Any Experience" && job.experience !== experience) return false;

        return true;
    });

    // Sort results
    if (sortBy === "newest") {
        // Sort by posted date (approximate - newer jobs have "1d" or "2d")
        results.sort(function(a, b) {
            const daysA = parseInt(a.posted) || 99;
            const daysB = parseInt(b.posted) || 99;
            return daysA - daysB;
        });
    } else if (sortBy === "salary-high") {
        results.sort(function(a, b) {
            const salaryA = parseInt(a.salary.replace(/[^0-9]/g, "")) || 0;
            const salaryB = parseInt(b.salary.replace(/[^0-9]/g, "")) || 0;
            return salaryB - salaryA;
        });
    } else if (sortBy === "salary-low") {
        results.sort(function(a, b) {
            const salaryA = parseInt(a.salary.replace(/[^0-9]/g, "")) || 0;
            const salaryB = parseInt(b.salary.replace(/[^0-9]/g, "")) || 0;
            return salaryA - salaryB;
        });
    }
    // "relevance" is default - no sorting needed

    // Update result count
    resultCount.textContent = results.length;

    // Show empty state or render results
    if (results.length === 0) {
        jobGrid.innerHTML = "";
        jobGrid.style.display = "none";
        emptyState.style.display = "block";
    } else {
        jobGrid.style.display = "grid";
        emptyState.style.display = "none";
        jobGrid.innerHTML = results.map(function(job) {
            return createJobCard(job);
        }).join("");
    }
}

/* SECTION 4: EVENT LISTENERS */

// Search button click
searchBtn.addEventListener("click", performSearch);

// Search on Enter key
searchInput.addEventListener("keypress", function(event) {
    if (event.key === "Enter") {
        performSearch();
    }
});

// Filter changes
locationFilter.addEventListener("change", performSearch);
categoryFilter.addEventListener("change", performSearch);
experienceFilter.addEventListener("change", performSearch);
sortBySelect.addEventListener("change", performSearch);

// Event delegation for chips (recent + suggested)
document.querySelectorAll(".search-chips").forEach(function(chipsContainer) {
    chipsContainer.addEventListener("click", function(event) {
        const chip = event.target.closest(".chip");
        if (chip && chip.dataset.search) {
            searchInput.value = chip.dataset.search;
            performSearch();
        }
    });
});

// Clicking a job card goes to its details page
jobGrid.addEventListener("click", function(event) {
    const card = event.target.closest(".job-card");
    if (card) {
        const jobId = card.dataset.id;
        window.location.href = "JobDetailsPage.html?id=" + jobId;
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
function initSearchResults() {
    // Check if user is logged in
    const storedUser = localStorage.getItem("loggedInUser");
    if (!storedUser) {
        window.location.href = "Login.html";
        return;
    }

    // Check for search query in URL (?q=...)
    const urlParams = new URLSearchParams(window.location.search);
    const queryParam = urlParams.get("q");
    if (queryParam) {
        searchInput.value = queryParam;
    }

    // Render recent searches
    renderRecentSearches();

    // Perform initial search (will use URL param if present)
    performSearch();

    console.log("Search Results initialized");
}

// Initialize when the DOM is fully loaded
document.addEventListener("DOMContentLoaded", initSearchResults);