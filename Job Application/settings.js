/* ============================================================
   SETTINGS PAGE - JavaScript
   ============================================================ */

/* SECTION 1: CACHE DOM ELEMENTS */
const darkModeToggle = document.getElementById("darkModeToggle");
const languageSelect = document.getElementById("languageSelect");
const notifJobMatches = document.getElementById("notifJobMatches");
const notifAppUpdates = document.getElementById("notifAppUpdates");
const notifMessages = document.getElementById("notifMessages");
const notifMarketing = document.getElementById("notifMarketing");
const saveSettingsBtn = document.getElementById("saveSettingsBtn");

/* SECTION 2: VARIABLES */
// Default settings
const defaultSettings = {
    darkMode: false,
    language: "en",
    notifications: {
        jobMatches: true,
        appUpdates: true,
        messages: true,
        marketing: false
    }
};

// Load settings from localStorage, or use defaults
let userSettings = JSON.parse(localStorage.getItem("userSettings")) || defaultSettings;

/* SECTION 3: HELPER FUNCTIONS */

// Applies dark mode to the page
function applyDarkMode(enabled) {
    document.body.classList.toggle("dark-mode", enabled);
}

// Loads saved settings into the form controls
function loadSettings() {
    // Dark mode
    darkModeToggle.checked = userSettings.darkMode;
    applyDarkMode(userSettings.darkMode);

    // Language
    languageSelect.value = userSettings.language;

    // Notification preferences
    notifJobMatches.checked = userSettings.notifications.jobMatches;
    notifAppUpdates.checked = userSettings.notifications.appUpdates;
    notifMessages.checked = userSettings.notifications.messages;
    notifMarketing.checked = userSettings.notifications.marketing;
}

// Saves settings to localStorage and shows a toast
function saveSettings() {
    // Update the settings object from form values
    userSettings = {
        darkMode: darkModeToggle.checked,
        language: languageSelect.value,
        notifications: {
            jobMatches: notifJobMatches.checked,
            appUpdates: notifAppUpdates.checked,
            messages: notifMessages.checked,
            marketing: notifMarketing.checked
        }
    };

    // Save to localStorage
    localStorage.setItem("userSettings", JSON.stringify(userSettings));

    // Apply dark mode immediately
    applyDarkMode(userSettings.darkMode);

    // Show a toast notification
    showToast("Settings saved successfully!", "success");
}

// Shows a toast notification
function showToast(message, type) {
    // Create the toast element
    const toast = document.createElement("div");
    toast.className = "toast " + type;

    // Add icon + message
    const icon = type === "success" ? "glyphicon-ok" : "glyphicon-info-sign";
    toast.innerHTML = `<span class="glyphicon ${icon}"></span> ${message}`;

    // Add to the page
    document.body.appendChild(toast);

    // Auto-dismiss after 3 seconds
    setTimeout(function() {
        toast.classList.add("fade-out");
        // Remove from DOM after animation completes
        setTimeout(function() {
            toast.remove();
        }, 300);
    }, 3000);
}

// Live preview dark mode as user toggles
function previewDarkMode() {
    applyDarkMode(darkModeToggle.checked);
}

/* SECTION 4: EVENT LISTENERS */

// Live preview dark mode toggle
darkModeToggle.addEventListener("change", previewDarkMode);

// Save settings button
saveSettingsBtn.addEventListener("click", saveSettings);

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
function initSettings() {
    // Check if user is logged in
    const storedUser = localStorage.getItem("loggedInUser");
    if (!storedUser) {
        window.location.href = "Login.html";
        return;
    }

    // Load saved settings into the form
    loadSettings();
    console.log("Settings initialized:", userSettings);
}

// Initialize when the DOM is fully loaded
document.addEventListener("DOMContentLoaded", initSettings);