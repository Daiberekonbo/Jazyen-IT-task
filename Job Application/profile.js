/* ============================================================
   PROFILE PAGE - JavaScript
   Uses shared auth module (auth.js)
   ============================================================ */

/* SECTION 1: CACHE DOM ELEMENTS */
const editCheckbox = document.getElementById("edit-mode");
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
const displayExp = document.querySelector(".detail-section:nth-child(3) .exp-item");
const editExp = document.querySelector(".exp-edit textarea");
const displayEdu = document.querySelector(".detail-section:nth-child(4) .display-field");
const editEdu = document.querySelector(".edu-edit input");
const uploadBtn = document.querySelector(".upload-btn");
const resumeStatus = document.querySelector(".resume-status");

/* SECTION 2: VARIABLES */
let isEditing = false;
let profileData = null;

/* SECTION 3: HELPER FUNCTIONS */
function loadProfileData() {
    profileData = getProfileData();
    if (!profileData) return;
    updateDisplay();
}

function updateDisplay() {
    if (!profileData) return;

    const firstName = profileData.name ? profileData.name.split(" ")[0] : "U";
    picInitials.textContent = firstName.charAt(0).toUpperCase();

    displayName.textContent = profileData.name || "Your Name";
    editName.value = profileData.name || "";

    displayEmail.textContent = profileData.email || "your@email.com";
    editEmail.value = profileData.email || "";

    displayPhone.textContent = profileData.phone || "Add your phone number";
    editPhone.value = profileData.phone || "";

    displayAbout.textContent = profileData.bio || "Tell employers about yourself. Click Edit Profile to add your bio.";
    editAbout.value = profileData.bio || "";

    if (profileData.skills && profileData.skills.length > 0) {
        displaySkills.innerHTML = profileData.skills.map(function(s) {
            return `<span class="skill-tag">${s}</span>`;
        }).join("");
        editSkills.value = profileData.skills.join(", ");
    } else {
        displaySkills.innerHTML = '<span class="skill-tag" style="opacity: 0.5;">Add your skills</span>';
        editSkills.value = "";
    }

    if (profileData.experience) {
        const expLines = profileData.experience.split("\n");
        displayExp.innerHTML = expLines.map(function(line) {
            const parts = line.split(" - ");
            if (parts.length >= 3) {
                return `<div class="exp-item display-field"><strong>${parts[0]}</strong><span class="exp-company">${parts[1]} &bull; ${parts[2]}</span>${parts[3] ? `<p>${parts[3]}</p>` : ""}</div>`;
            }
            return `<div class="exp-item display-field">${line}</div>`;
        }).join("");
    } else {
        displayExp.innerHTML = '<div class="exp-item display-field" style="opacity: 0.5;">Add your work experience</div>';
    }
    editExp.value = profileData.experience || "";

    displayEdu.textContent = profileData.education || "Add your education";
    editEdu.value = profileData.education || "";
}

function saveProfileData() {
    if (!profileData) return;

    const updatedData = {
        name: editName.value,
        email: editEmail.value,
        phone: editPhone.value,
        bio: editAbout.value,
        skills: editSkills.value.split(",").map(function(s) {
            return s.trim();
        }).filter(function(s) {
            return s;
        }),
        experience: editExp.value,
        education: editEdu.value
    };

    // Try to update on backend
    (async function() {
        try {
            const resp = await (window.fetchWithAuth ? fetchWithAuth('/api/users/me/', { method: 'PATCH', body: JSON.stringify(updatedData) }) : fetch('/api/users/me/', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(updatedData) }));
            if (resp && resp.ok) {
                const data = await resp.json();
                // Update local stored user and profileData for backward compat
                const userObj = { id: data.id, email: data.email, name: data.name, phone: data.phone, bio: data.bio, skills: data.skills, experience: data.experience, education: data.education };
                setCurrentUser({ ...getCurrentUser(), ...userObj });
                localStorage.setItem("profileData", JSON.stringify(userObj));
                profileData = getProfileData();
                updateDisplay();
                return;
            }
        } catch (err) {
            console.warn('Profile update failed, falling back to local save', err);
        }

        // Fallback to client-side update
        const result = updateUserProfile(updatedData);
        if (result.success) {
            localStorage.setItem("profileData", JSON.stringify(updatedData));
            profileData = getProfileData();
            updateDisplay();
        }
    })();
}

function toggleEditMode() {
    isEditing = editCheckbox.checked;

    const displayFields = document.querySelectorAll(".display-field");
    const editFields = document.querySelectorAll(".edit-field");

    displayFields.forEach(function(f) {
        f.style.display = isEditing ? "none" : "";
    });
    editFields.forEach(function(f) {
        f.style.display = isEditing ? "" : "none";
    });

    editText.style.display = isEditing ? "none" : "";
    saveText.style.display = isEditing ? "" : "none";

    if (!isEditing) {
        saveProfileData();
    }
}

/* SECTION 4: EVENT LISTENERS */
editCheckbox.addEventListener("change", toggleEditMode);

uploadBtn.addEventListener("click", function() {
    const fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.accept = ".pdf,.doc,.docx";
    fileInput.click();

    fileInput.addEventListener("change", function() {
        if (fileInput.files.length > 0) {
            const file = fileInput.files[0];
            resumeStatus.innerHTML = `<span class="fas fa-file-alt"></span> ${file.name} <span class="resume-size">(${(file.size / 1024 / 1024).toFixed(1)} MB)</span>`;
        }
    });
});

/* SECTION 5: MAIN LOGIC */
function initProfile() {
    if (!requireAuth()) return;

    loadProfileData();

    editCheckbox.checked = false;
    toggleEditMode();
}

document.addEventListener("DOMContentLoaded", initProfile);