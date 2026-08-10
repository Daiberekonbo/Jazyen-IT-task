/* ============================================================
   NAVBAR COMPONENT - Reusable
   Modern Light Theme
   
   Usage:
   <div id="navbar"></div>
   <script src="components/navbar.js"></script>
   ============================================================ */

function renderNavbar(activePage) {
    const pages = [
        { href: "DashboardPage.html", label: "Dashboard", icon: "fa-solid fa-gauge-high" },
        { href: "JobsListingPage.html", label: "Browse Jobs", icon: "fa-solid fa-magnifying-glass" },
        { href: "SavedJobsPage.html", label: "Saved Jobs", icon: "fa-solid fa-bookmark" },
        { href: "NotificationsPage.html", label: "Notifications", icon: "fa-solid fa-bell" },
        { href: "MessagesPage.html", label: "Messages", icon: "fa-solid fa-envelope" }
    ];

    const links = pages.map(function(page) {
        const isActive = page.href === activePage ? ' class="nav-link active"' : ' class="nav-link"';
        return `<li><a href="${page.href}"${isActive}><i class="${page.icon}"></i> ${page.label}</a></li>`;
    }).join("");

    return `
        <nav class="top-nav">
            <div class="nav-container">
                <a href="DashboardPage.html" class="nav-logo">
                    <i class="fa-solid fa-briefcase"></i>
                    <span>JobPortal</span>
                </a>
                <ul class="nav-links">
                    ${links}
                    <li><a href="SettingsPage.html" class="nav-link"><i class="fa-solid fa-gear"></i> Settings</a></li>
                    <li><a href="#" class="nav-link nav-logout" data-logout><i class="fa-solid fa-right-from-bracket"></i> Sign Out</a></li>
                </ul>
                <button class="nav-toggle" id="navToggle" aria-label="Toggle navigation">
                    <i class="fa-solid fa-bars"></i>
                </button>
            </div>
        </nav>
    `;
}

// Auto-render if the #navbar div exists
document.addEventListener("DOMContentLoaded", function() {
    const navbarContainer = document.getElementById("navbar");
    if (navbarContainer) {
        const currentPage = window.location.pathname.split("/").pop();
        navbarContainer.innerHTML = renderNavbar(currentPage);

        // Mobile nav toggle
        const toggle = document.getElementById("navToggle");
        const links = document.querySelector(".nav-links");
        if (toggle && links) {
            toggle.addEventListener("click", function() {
                links.classList.toggle("active");
            });
        }
    }
});