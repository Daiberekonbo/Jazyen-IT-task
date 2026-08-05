/* ============================================================
   PROFILE PAGE - JavaScript
   ============================================================ */

/* SECTION 1: CACHE DOM ELEMENTS */
const editCheckbox = document.getElementById("edit-mode");
const editToggle = document.querySelector(".edit-toggle");
const editText = document.querySelector(".edit-text");
const saveText = document.querySelector(".save-text");
const picInitials = document.querySelector(".pic-initials");
const displayName = document.querySelector(".profile-name h3");
const editName = document.querySelector(".name-field");
const displayEmail = document.querySelectorAll(".profile-name p")[0];
const editEmail = document.querySelector(".email-field");
const displayPhone = document.querySelectorAll(".profile-name p")[1];
const editPhone = document.querySelector(".phone-field");
const displayAbout = document.querySelector(".detail-section:nth-child(1) .display-field");
const editAbout = document.querySelector(".about-field");
const displaySkills = document.querySelector(".skills-display");
const editSkills = document.querySelector(".skills-input");
const displayExp = document.querySelectorAll(".display-field")[3];
const editExp = document.querySelector(".exp-edit textarea");
const displayEdu = document.querySelectorAll(".display-field")[4];
const editEdu = document.querySelector(".edu-edit input");
const uploadBtn = document.querySelector(".upload-btn");
const resumeStatus = document.querySelector(".resume-status");

/* SECTION 2: VARIABLES */
let isEditing = false;
let profileData = null;

/* SECTION 3: HELPER FUNCTIONS */
function loadProfileData() {
    const storedUser = localStorage.getItem("loggedInUser");
    if (!storedUser) return;

    const user = JSON.parse(storedUser);

    // Default profile data
    profileData = {
        name: user.name || "David Johnson",
        email: user.email || "david.johnson@email.com",
        phone: "+1 (555) 123-4567",
        about: "Experienced Frontend Developer with 5+ years building modern web applications. Passionate about creating intuitive user interfaces and writing clean, maintainable code.",
        skills: ["React", "TypeScript", "JavaScript", "CSS/SASS", "HTML5", "Git"],
        experience: "Senior Frontend Developer - TechCorp Inc. - 2021-Present - Led frontend team building SaaS platform\nFrontend Developer - StartupXYZ - 2019-2021 - Developed responsive apps with React",
        education: "B.Sc. Computer Science - University of Technology - 2015-2019"
    };

    // Check if saved profile exists
    const savedProfile = localStorage.getItem("profileData");
    if (savedProfile) {
        const parsed = JSON.parse(savedProfile);
        // Merge saved data with defaults
        Object.keys(parsed).forEach(key => {
            profileData[key] = parsed[key];
        });
    }

    updateDisplay();
}

function updateDisplay() {
    if (!profileData) return;

    const firstName = profileData.name.split(" ")[0] || "D";
    picInitials.textContent = firstName.charAt(0).toUpperCase();

    displayName.textContent = profileData.name;
    editName.value = profileData.name;

    displayEmail.textContent = profileData.email;
    editEmail.value = profileData.email;

    displayPhone.textContent = profileData.phone;
    editPhone.value = profileData.phone;

    displayAbout.textContent = profileData.about;
    editAbout.value = profileData.about;

    // Update skills tags
    displaySkills.innerHTML = profileData.skills.map(s => `<span class="skill-tag">${s}</span>`).join("");
    editSkills.value = profileData.skills.join(", ");

    // Update experience display
    const expLines = profileData.experience.split("\n");
    displayExp.innerHTML = expLines.map(line => {
        const parts = line.split(" - ");
        if (parts.length >= 3) {
            return `<div class="exp-item display-field"><strong>${parts[0]}</strong><span class="exp-company">${parts[1]} &bull; ${parts[2]}</span>${parts[3] ? `<p>${parts[3]}</p>` : ""}</div>`;
        }
        return `<div class="exp-item display-field">${line}</div>`;
    }).join("");
    editExp.value = profileData.experience;

    displayEdu.textContent = profileData.education;
    editEdu.value = profileData.education;
}

function saveProfileData() {
    if (!profileData) return;

    profileData.name = editName.value;
    profileData.email = editEmail.value;
    profileData.phone = editPhone.value;
    profileData.about = editAbout.value;
    profileData.skills = editSkills.value.split(",").map(s => s.trim()).filter(s => s);
    profileData.experience = editExp.value;
    profileData.education = editEdu.value;

    localStorage.setItem("profileData", JSON.stringify(profileData));

    // Also update the loggedInUser name if changed
    const storedUser = localStorage.getItem("loggedInUser");
    if (storedUser) {
        const user = JSON.parse(storedUser);
        user.name = profileData.name;
        user.email = profileData.email;
        localStorage.setItem("loggedInUser", JSON.stringify(user));
    }

    updateDisplay();
}

function toggleEditMode() {
    isEditing = editCheckbox.checked;

    const displayFields = document.querySelectorAll(".display-field");
    const editFields = document.querySelectorAll(".edit-field");

    displayFields.forEach(f => f.style.display = isEditing ? "none" : "");
    editFields.forEach(f => f.style.display = isEditing ? "" : "none");

    editText.style.display = isEditing ? "none" : "";
    saveText.style.display = isEditing ? "" : "none";

    if (!isEditing) {
        saveProfileData();
    }
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

editCheckbox.addEventListener("change", toggleEditMode);

uploadBtn.addEventListener("click", function() {
    // Simulate file upload
    // LATER BACKEND: POST /api/profile/resume with FormData
    const fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.accept = ".pdf,.doc,.docx";
    fileInput.click();

    fileInput.addEventListener("change", function() {
        if (fileInput.files.length > 0) {
            const file = fileInput.files[0];
            resumeStatus.innerHTML = `<span class="glyphicon glyphicon-file"></span> ${file.name} <span class="resume-size">(${(file.size / 1024 / 1024).toFixed(1)} MB)</span>`;
        }
    });
});

/* SECTION 5: MAIN LOGIC */
function initProfile() {
    const storedUser = localStorage.getItem("loggedInUser");
    if (!storedUser) {
        window.location.href = "Login.html";
        return;
    }

    loadProfileData();

    // Start in view mode
    editCheckbox.checked = false;
    toggleEditMode();

    console.log("Profile page initialized");
}

document.addEventListener("DOMContentLoaded", initProfile);