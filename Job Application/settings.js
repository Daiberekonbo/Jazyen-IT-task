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

function getMergedSettings() {
    const saved = JSON.parse(localStorage.getItem("userSettings") || "{}");
    return {
        ...defaultSettings,
        ...saved,
        notifications: {
            ...defaultSettings.notifications,
            ...(saved.notifications || {})
        }
    };
}

// Load settings from localStorage, or use defaults
let userSettings = getMergedSettings();

/* SECTION 3: HELPER FUNCTIONS */

// Applies dark mode to the page
function applyDarkMode(enabled) {
    if (window.appTheme && typeof window.appTheme.setTheme === 'function') {
        window.appTheme.setTheme(enabled ? 'dark' : 'light');
        return;
    }
    document.body.classList.toggle("dark-mode", enabled);
    document.documentElement.toggleAttribute('data-theme', enabled);
}

// Loads saved settings into the form controls
function loadSettings() {
    userSettings = getMergedSettings();

    // Dark mode
    if (darkModeToggle) {
        darkModeToggle.checked = Boolean(userSettings.darkMode);
    }
    applyDarkMode(Boolean(userSettings.darkMode));

    // Language
    if (languageSelect) {
        languageSelect.value = userSettings.language || "en";
    }

    // Notification preferences
    const notifications = userSettings.notifications || defaultSettings.notifications;
    if (notifJobMatches) notifJobMatches.checked = Boolean(notifications.jobMatches);
    if (notifAppUpdates) notifAppUpdates.checked = Boolean(notifications.appUpdates);
    if (notifMessages) notifMessages.checked = Boolean(notifications.messages);
    if (notifMarketing) notifMarketing.checked = Boolean(notifications.marketing);
}

// Saves settings to localStorage and shows a toast
function saveSettings() {
    const currentTheme = (window.appTheme && typeof window.appTheme.getTheme === 'function')
        ? window.appTheme.getTheme()
        : (document.body.classList.contains('dark-mode') ? 'dark' : 'light');

    // Update the settings object from form values without changing the app theme.
    userSettings = {
        ...defaultSettings,
        darkMode: currentTheme === 'dark',
        language: languageSelect ? languageSelect.value : "en",
        notifications: {
            jobMatches: notifJobMatches ? notifJobMatches.checked : true,
            appUpdates: notifAppUpdates ? notifAppUpdates.checked : true,
            messages: notifMessages ? notifMessages.checked : true,
            marketing: notifMarketing ? notifMarketing.checked : false
        }
    };

    // Save to localStorage without mutating the global theme state.
    localStorage.setItem("userSettings", JSON.stringify(userSettings));

    // Show a toast notification
    showToast("Settings saved successfully!", "success");
}

// Shows a toast notification
function showToast(message, type) {
    // Create the toast element
    const toast = document.createElement("div");
    toast.className = "toast " + type;

    // Add icon + message
    const icon = type === "success" ? "fas fa-check-circle" : "fas fa-info-circle";
    toast.innerHTML = `<span class="${icon}"></span> ${message}`;

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
    // The settings page does not own the global dark mode state.
    // Any user theme change is handled by the top-level theme toggle.
    return;
}

/* SECTION 4: EVENT LISTENERS */

// Live preview dark mode toggle
if (darkModeToggle) {
    darkModeToggle.addEventListener("change", previewDarkMode);
}

// Save settings button
if (saveSettingsBtn) {
    saveSettingsBtn.addEventListener("click", saveSettings);
}

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