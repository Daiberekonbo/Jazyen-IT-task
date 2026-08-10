/* ============================================================
   FOOTER COMPONENT - Reusable
   Modern Light Theme
   
   Usage:
   <div id="footer"></div>
   <script src="components/footer.js"></script>
   ============================================================ */

function renderFooter() {
    return `
        <footer class="site-footer">
            <div class="footer-container">
                <div class="footer-grid">
                    <div class="footer-col">
                        <h4><i class="fa-solid fa-briefcase"></i> JobPortal</h4>
                        <p>Connecting talent with opportunity since 2024.</p>
                    </div>
                    <div class="footer-col">
                        <h4>Quick Links</h4>
                        <ul>
                            <li><a href="LandingPage2.html">Home</a></li>
                            <li><a href="JobsListingPage.html">Browse Jobs</a></li>
                            <li><a href="DashboardPage.html">Dashboard</a></li>
                        </ul>
                    </div>
                    <div class="footer-col">
                        <h4>Account</h4>
                        <ul>
                            <li><a href="ProfilePage.html">Profile</a></li>
                            <li><a href="MyApplicationsPage.html">My Applications</a></li>
                            <li><a href="SettingsPage.html">Settings</a></li>
                        </ul>
                    </div>
                    <div class="footer-col">
                        <h4>Support</h4>
                        <ul>
                            <li><a href="#">Help Center</a></li>
                            <li><a href="#">Privacy Policy</a></li>
                            <li><a href="#">Terms of Service</a></li>
                        </ul>
                    </div>
                </div>
                <div class="footer-bottom">&copy; 2026 JobPortal. All rights reserved.</div>
            </div>
        </footer>
    `;
}

// Auto-render if the #footer div exists
document.addEventListener("DOMContentLoaded", function() {
    const footerContainer = document.getElementById("footer");
    if (footerContainer) {
        footerContainer.innerHTML = renderFooter();
    }
});