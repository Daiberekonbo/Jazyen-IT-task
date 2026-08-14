/* ============================================================
   NOTIFICATIONS PAGE - JavaScript
   ============================================================ */

/* SECTION 1: CACHE DOM ELEMENTS */
const notifList = document.getElementById("notifList");
const emptyState = document.getElementById("emptyState");
const unreadBadge = document.getElementById("unreadBadge");
const tabButtons = document.querySelectorAll(".tab-btn");

/* SECTION 2: VARIABLES */
// LATER BACKEND: This will be fetched from GET /api/notifications
// Default notifications if none exist in localStorage
const defaultNotifications = [
    { id: 1, title: "Application Accepted", message: "Congratulations! Facebook has accepted your application for Frontend Developer.", type: "accepted", read: false, time: "2 hours ago" },
    { id: 2, title: "Interview Invitation", message: "Google would like to schedule an interview for the Backend Engineer position.", type: "interview", read: false, time: "5 hours ago" },
    { id: 3, title: "New Job Match", message: "Senior Frontend at Netflix matches your profile. Check it out!", type: "match", read: false, time: "1 day ago" },
    { id: 4, title: "Password Changed", message: "Your account password was successfully changed.", type: "password", read: true, time: "3 days ago" },
    { id: 5, title: "Application Viewed", message: "Amazon viewed your application for Full Stack Developer.", type: "interview", read: true, time: "4 days ago" },
    { id: 6, title: "New Job Match", message: "A new DevOps role at Salesforce matches your skills.", type: "match", read: true, time: "1 week ago" }
];

// Load notifications from localStorage, or use defaults if none exist
let notifications = JSON.parse(localStorage.getItem("notifications")) || defaultNotifications;

// Current filter: "all", "unread", or "read"
let currentFilter = "all";

/* SECTION 3: HELPER FUNCTIONS */

// Returns the Font Awesome icon class for a notification type
function getIconClass(type) {
    switch (type) {
        case "accepted":
            return "fas fa-check-circle";
        case "interview":
            return "fas fa-calendar-check";
        case "match":
            return "fas fa-star";
        case "password":
            return "fas fa-lock";
        default:
            return "fas fa-bell";
    }
}

// Creates HTML for a single notification item
function createNotificationHTML(notif) {
    const iconClass = getIconClass(notif.type);
    const unreadClass = notif.read ? "" : "unread";
    const readButton = notif.read
        ? ""
        : `<button class="notif-action-btn mark-read-btn" data-id="${notif.id}">Mark Read</button>`;

    return `
        <div class="notif-item ${unreadClass}" data-id="${notif.id}">
            <div class="notif-icon ${notif.type}">
                <span class="${iconClass}"></span>
            </div>
            <div class="notif-content">
                <h4>${notif.title}</h4>
                <p>${notif.message}</p>
                <small>${notif.time}</small>
            </div>
            <div class="notif-actions">
                ${readButton}
                <button class="notif-action-btn delete-btn" data-id="${notif.id}">
                    <span class="fas fa-trash"></span>
                </button>
            </div>
        </div>
    `;
}

// Counts unread notifications using reduce
function countUnread() {
    return notifications.reduce(function(count, notif) {
        return notif.read ? count : count + 1;
    }, 0);
}

// Updates the unread badge in the tabs
function updateUnreadBadge() {
    const unreadCount = countUnread();
    unreadBadge.textContent = unreadCount;
    unreadBadge.style.display = unreadCount > 0 ? "inline-block" : "none";
}

// Renders notifications based on the current filter
function renderNotifications() {
    // Filter notifications based on current tab
    let filtered = notifications;
    if (currentFilter === "unread") {
        filtered = notifications.filter(function(notif) {
            return !notif.read;
        });
    } else if (currentFilter === "read") {
        filtered = notifications.filter(function(notif) {
            return notif.read;
        });
    }

    // Show empty state if no notifications match
    if (filtered.length === 0) {
        notifList.innerHTML = "";
        notifList.style.display = "none";
        emptyState.style.display = "block";
    } else {
        notifList.style.display = "flex";
        emptyState.style.display = "none";
        notifList.innerHTML = filtered.map(function(notif) {
            return createNotificationHTML(notif);
        }).join("");
    }

    updateUnreadBadge();
}

// Marks a notification as read
function markAsRead(notifId) {
    const notif = notifications.find(function(n) {
        return n.id === notifId;
    });
    if (notif) {
        notif.read = true;
        localStorage.setItem("notifications", JSON.stringify(notifications));
        renderNotifications();
    }
}

// Deletes a notification
function deleteNotification(notifId) {
    notifications = notifications.filter(function(n) {
        return n.id !== notifId;
    });
    localStorage.setItem("notifications", JSON.stringify(notifications));
    renderNotifications();
}

// Sets the active tab styling
function setActiveTab(filter) {
    tabButtons.forEach(function(btn) {
        if (btn.dataset.filter === filter) {
            btn.classList.add("active");
        } else {
            btn.classList.remove("active");
        }
    });
}

/* SECTION 4: EVENT LISTENERS */

// Tab filter buttons
tabButtons.forEach(function(btn) {
    btn.addEventListener("click", function() {
        currentFilter = this.dataset.filter;
        setActiveTab(currentFilter);
        renderNotifications();
    });
});

// Event delegation for notification actions (mark read / delete)
notifList.addEventListener("click", function(event) {
    const markReadBtn = event.target.closest(".mark-read-btn");
    const deleteBtn = event.target.closest(".delete-btn");

    if (markReadBtn) {
        const notifId = parseInt(markReadBtn.dataset.id);
        markAsRead(notifId);
    } else if (deleteBtn) {
        const notifId = parseInt(deleteBtn.dataset.id);
        deleteNotification(notifId);
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
function initNotifications() {
    // Check if user is logged in
    const storedUser = localStorage.getItem("loggedInUser");
    if (!storedUser) {
        window.location.href = "Login.html";
        return;
    }

    renderNotifications();
    console.log("Notifications initialized with", notifications.length, "notifications");
}

// Initialize when the DOM is fully loaded
document.addEventListener("DOMContentLoaded", initNotifications);