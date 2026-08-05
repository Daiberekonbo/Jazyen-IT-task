/* ============================================================
   REGISTER PAGE - JavaScript
   Job Application Website

   FILE PURPOSE:
   This file handles user registration. It validates all
   input fields, checks password strength, confirms passwords
   match, and simulates storing the new user.
   ============================================================ */

/* ============================================================
   SECTION 1: CACHE DOM ELEMENTS
   ============================================================ */

// ---- Form Elements ----
const registerForm = document.getElementById("registerForm");
const nameInput = document.getElementById("fullName");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const confirmPasswordInput = document.getElementById("confirmPassword");

// ---- Error Message Elements ----
const nameError = document.getElementById("nameError");
const emailError = document.getElementById("emailError");
const passwordError = document.getElementById("passwordError");
const confirmPasswordError = document.getElementById("confirmPasswordError");
const generalError = document.getElementById("generalError");

// ---- Success Message ----
const successMessage = document.getElementById("successMessage");

// ---- Button Elements ----
const registerButton = document.getElementById("registerButton");
const buttonText = document.getElementById("buttonText");
const loadingSpinner = document.getElementById("loadingSpinner");

// ---- Password Toggle Buttons ----
const togglePasswordBtn = document.getElementById("togglePassword");
const toggleConfirmPasswordBtn = document.getElementById("toggleConfirmPassword");

// ---- Password Strength Elements ----
const strengthBar = document.getElementById("strengthBar");
const reqLength = document.getElementById("reqLength");
const reqUppercase = document.getElementById("reqUppercase");
const reqLowercase = document.getElementById("reqLowercase");
const reqNumber = document.getElementById("reqNumber");
const reqSpecial = document.getElementById("reqSpecial");

/* ============================================================
   SECTION 2: VARIABLES
   ============================================================ */

// Track registration state
let isRegistering = false;

// The fake registered users array - starts empty
// LATER BACKEND: This will be replaced with POST /api/auth/register
const registeredUsers = [];

/* ============================================================
   SECTION 3: HELPER FUNCTIONS
   ============================================================ */

function showElement(element) {
    element.classList.remove("hidden");
}

function hideElement(element) {
    element.classList.add("hidden");
}

function clearAllErrors() {
    nameError.textContent = "";
    hideElement(nameError);
    emailError.textContent = "";
    hideElement(emailError);
    passwordError.textContent = "";
    hideElement(passwordError);
    confirmPasswordError.textContent = "";
    hideElement(confirmPasswordError);
    generalError.textContent = "";
    hideElement(generalError);
    successMessage.textContent = "";
    hideElement(successMessage);

    nameInput.classList.remove("input-error");
    emailInput.classList.remove("input-error");
    passwordInput.classList.remove("input-error");
    confirmPasswordInput.classList.remove("input-error");
}

function setButtonLoading(isLoading) {
    if (isLoading) {
        buttonText.textContent = "Creating Account...";
        showElement(loadingSpinner);
        registerButton.disabled = true;
        registerButton.classList.add("button-loading");
    } else {
        buttonText.textContent = "Create Account";
        hideElement(loadingSpinner);
        registerButton.disabled = false;
        registerButton.classList.remove("button-loading");
    }
}

/* ============================================================
   SECTION 4: VALIDATION FUNCTIONS
   ============================================================ */

/* ------------------------------------------------
   FUNCTION: validateName(name)
   
   WHAT IT DOES: Checks if the name is not empty and
   has at least 2 characters.
   ------------------------------------------------ */
function validateName(name) {
    if (!name || name.trim() === "") {
        nameError.textContent = "Full name is required.";
        showElement(nameError);
        nameInput.classList.add("input-error");
        return false;
    }

    if (name.trim().length < 2) {
        nameError.textContent = "Name must be at least 2 characters.";
        showElement(nameError);
        nameInput.classList.add("input-error");
        return false;
    }

    nameInput.classList.remove("input-error");
    return true;
}

/* ------------------------------------------------
   FUNCTION: validateEmail(email)
   
   WHAT IT DOES: Same email validation as the login page.
   ------------------------------------------------ */
function validateEmail(email) {
    if (!email || email.trim() === "") {
        emailError.textContent = "Email is required.";
        showElement(emailError);
        emailInput.classList.add("input-error");
        return false;
    }

    if (email.indexOf("@") === -1) {
        emailError.textContent = "Email must contain @ symbol.";
        showElement(emailError);
        emailInput.classList.add("input-error");
        return false;
    }

    const parts = email.split("@");

    if (parts[0].length === 0) {
        emailError.textContent = "Email must have text before @.";
        showElement(emailError);
        emailInput.classList.add("input-error");
        return false;
    }

    if (!parts[1] || parts[1].length === 0) {
        emailError.textContent = "Email must have a domain after @.";
        showElement(emailError);
        emailInput.classList.add("input-error");
        return false;
    }

    if (parts[1].indexOf(".") === -1) {
        emailError.textContent = "Email domain must contain a dot (e.g., .com).";
        showElement(emailError);
        emailInput.classList.add("input-error");
        return false;
    }

    emailInput.classList.remove("input-error");
    return true;
}

/* ------------------------------------------------
   FUNCTION: checkPasswordStrength(password)
   
   WHAT IT DOES:
   Checks the password against multiple criteria and
   updates the strength bar and requirements list.
   
   RETURNS:
   An object with:
   - score: number from 0-5 (how many criteria met)
   - label: "Weak", "Fair", "Good", or "Strong"
   ------------------------------------------------ */
function checkPasswordStrength(password) {
    // Track which requirements are met
    let score = 0;

    // Check minimum length (8 characters)
    if (password.length >= 8) {
        score++;
        reqLength.classList.add("met");
        reqLength.classList.remove("not-met");
    } else {
        reqLength.classList.add("not-met");
        reqLength.classList.remove("met");
    }

    // Check for uppercase letter
    // We use a regular expression /[A-Z]/ which matches any
    // capital letter from A to Z. test() returns true/false.
    if (/[A-Z]/.test(password)) {
        score++;
        reqUppercase.classList.add("met");
        reqUppercase.classList.remove("not-met");
    } else {
        reqUppercase.classList.add("not-met");
        reqUppercase.classList.remove("met");
    }

    // Check for lowercase letter
    if (/[a-z]/.test(password)) {
        score++;
        reqLowercase.classList.add("met");
        reqLowercase.classList.remove("not-met");
    } else {
        reqLowercase.classList.add("not-met");
        reqLowercase.classList.remove("met");
    }

    // Check for number
    if (/[0-9]/.test(password)) {
        score++;
        reqNumber.classList.add("met");
        reqNumber.classList.remove("not-met");
    } else {
        reqNumber.classList.add("not-met");
        reqNumber.classList.remove("met");
    }

    // Check for special character
    // [!@#$%^&*] matches any of these special characters
    if (/[!@#$%^&*]/.test(password)) {
        score++;
        reqSpecial.classList.add("met");
        reqSpecial.classList.remove("not-met");
    } else {
        reqSpecial.classList.add("not-met");
        reqSpecial.classList.remove("met");
    }

    // Update the strength bar based on score
    // We calculate the width as a percentage (0-100%)
    const percentage = (score / 5) * 100;
    strengthBar.style.width = percentage + "%";

    // Set the color based on strength
    if (score <= 1) {
        strengthBar.style.backgroundColor = "#dc3545"; // Red
        strengthBar.textContent = "Weak";
    } else if (score <= 2) {
        strengthBar.style.backgroundColor = "#ffc107"; // Yellow
        strengthBar.textContent = "Fair";
    } else if (score <= 4) {
        strengthBar.style.backgroundColor = "#17a2b8"; // Blue
        strengthBar.textContent = "Good";
    } else {
        strengthBar.style.backgroundColor = "#28a745"; // Green
        strengthBar.textContent = "Strong";
    }

    return {
        score: score,
        label: strengthBar.textContent
    };
}

/* ------------------------------------------------
   FUNCTION: validatePassword(password)
   
   WHAT IT DOES: Validates that password meets the
   minimum requirement (at least 3 out of 5 criteria).
   ------------------------------------------------ */
function validatePassword(password) {
    if (!password || password.trim() === "") {
        passwordError.textContent = "Password is required.";
        showElement(passwordError);
        passwordInput.classList.add("input-error");
        return false;
    }

    // Check password strength
    const strength = checkPasswordStrength(password);

    // Require at least 3 out of 5 criteria to be met
    if (strength.score < 3) {
        passwordError.textContent = "Password is too weak. Meet at least 3 requirements.";
        showElement(passwordError);
        passwordInput.classList.add("input-error");
        return false;
    }

    passwordInput.classList.remove("input-error");
    return true;
}

/* ------------------------------------------------
   FUNCTION: validateConfirmPassword(password, confirmPassword)
   
   WHAT IT DOES: Checks if the confirm password matches
   the original password.
   ------------------------------------------------ */
function validateConfirmPassword(password, confirmPassword) {
    if (!confirmPassword || confirmPassword.trim() === "") {
        confirmPasswordError.textContent = "Please confirm your password.";
        showElement(confirmPasswordError);
        confirmPasswordInput.classList.add("input-error");
        return false;
    }

    if (password !== confirmPassword) {
        confirmPasswordError.textContent = "Passwords do not match.";
        showElement(confirmPasswordError);
        confirmPasswordInput.classList.add("input-error");
        return false;
    }

    confirmPasswordInput.classList.remove("input-error");
    return true;
}

/* ------------------------------------------------
   FUNCTION: isEmailTaken(email)
   
   WHAT IT DOES: Checks if the email is already registered.
   
   LATER BACKEND: This will check with the server:
   GET /api/auth/check-email?email=user@example.com
   ------------------------------------------------ */
function isEmailTaken(email) {
    // Check against registered users in memory
    // toLocaleLowerCase() makes the comparison case-insensitive
    return registeredUsers.some(function(user) {
        return user.email.toLowerCase() === email.toLowerCase();
    });
}

/* ============================================================
   SECTION 5: EVENT LISTENERS
   ============================================================ */

/* ------------------------------------------------
   EVENT: Register Button Click
   ------------------------------------------------ */
registerButton.addEventListener("click", function() {
    if (isRegistering) {
        return;
    }

    clearAllErrors();

    const fullName = nameInput.value;
    const email = emailInput.value;
    const password = passwordInput.value;
    const confirmPassword = confirmPasswordInput.value;

    // Validate all fields in order
    const isNameValid = validateName(fullName);
    if (!isNameValid) return;

    const isEmailValid = validateEmail(email);
    if (!isEmailValid) return;

    // Check if email is already taken
    if (isEmailTaken(email)) {
        generalError.textContent = "This email is already registered. Please login.";
        showElement(generalError);
        return;
    }

    const isPasswordValid = validatePassword(password);
    if (!isPasswordValid) return;

    const isConfirmValid = validateConfirmPassword(password, confirmPassword);
    if (!isConfirmValid) return;

    // Start registration
    isRegistering = true;
    setButtonLoading(true);

    // Simulate network delay
    setTimeout(function() {
        // Create a new user object
        const newUser = {
            name: fullName.trim(),
            email: email.trim().toLowerCase(),
            password: password
        };

        // Add to our fake registered users array
        registeredUsers.push(newUser);

        // Also store in localStorage so other pages can access it
        // LATER BACKEND: Server will handle this
        localStorage.setItem("registeredUsers", JSON.stringify(registeredUsers));

        // Show success message
        setButtonLoading(false);
        isRegistering = false;

        successMessage.textContent = "Account created successfully! Redirecting to Login...";
        showElement(successMessage);

        // Redirect to Login page after a short delay
        setTimeout(function() {
            window.location.href = "Login.html";
        }, 2000);

    }, 1500);
});

/* ------------------------------------------------
   EVENT: Password Toggle (main password)
   ------------------------------------------------ */
togglePasswordBtn.addEventListener("click", function() {
    const currentType = passwordInput.getAttribute("type");

    if (currentType === "password") {
        passwordInput.setAttribute("type", "text");
        togglePasswordBtn.innerHTML = '<span class="glyphicon glyphicon-eye-close"></span>';
        togglePasswordBtn.setAttribute("aria-label", "Hide password");
    } else {
        passwordInput.setAttribute("type", "password");
        togglePasswordBtn.innerHTML = '<span class="glyphicon glyphicon-eye-open"></span>';
        togglePasswordBtn.setAttribute("aria-label", "Show password");
    }
});

/* ------------------------------------------------
   EVENT: Confirm Password Toggle
   ------------------------------------------------ */
toggleConfirmPasswordBtn.addEventListener("click", function() {
    const currentType = confirmPasswordInput.getAttribute("type");

    if (currentType === "password") {
        confirmPasswordInput.setAttribute("type", "text");
        toggleConfirmPasswordBtn.innerHTML = '<span class="glyphicon glyphicon-eye-close"></span>';
        toggleConfirmPasswordBtn.setAttribute("aria-label", "Hide password");
    } else {
        confirmPasswordInput.setAttribute("type", "password");
        toggleConfirmPasswordBtn.innerHTML = '<span class="glyphicon glyphicon-eye-open"></span>';
        toggleConfirmPasswordBtn.setAttribute("aria-label", "Show password");
    }
});

/* ------------------------------------------------
   EVENT: Password Input - Live Validation + Strength
   ------------------------------------------------ */
passwordInput.addEventListener("input", function() {
    const password = passwordInput.value;

    // Always update strength indicator even when empty
    if (password.length === 0) {
        // Reset strength bar
        strengthBar.style.width = "0%";
        strengthBar.textContent = "";

        // Reset all requirement indicators
        reqLength.classList.remove("met", "not-met");
        reqUppercase.classList.remove("met", "not-met");
        reqLowercase.classList.remove("met", "not-met");
        reqNumber.classList.remove("met", "not-met");
        reqSpecial.classList.remove("met", "not-met");

        passwordError.textContent = "";
        hideElement(passwordError);
        passwordInput.classList.remove("input-error");
    } else {
        // Check strength and update UI in real-time
        checkPasswordStrength(password);

        // Also validate minimum requirements
        passwordError.textContent = "";
        hideElement(passwordError);
        passwordInput.classList.remove("input-error");
    }
});

/* ------------------------------------------------
   EVENT: Confirm Password Input - Live Match Check
   ------------------------------------------------ */
confirmPasswordInput.addEventListener("input", function() {
    const password = passwordInput.value;
    const confirmPassword = confirmPasswordInput.value;

    confirmPasswordError.textContent = "";
    hideElement(confirmPasswordError);
    confirmPasswordInput.classList.remove("input-error");

    // Only check if there's something typed in both fields
    if (confirmPassword.length > 0 && password.length > 0) {
        if (password !== confirmPassword) {
            confirmPasswordError.textContent = "Passwords do not match.";
            showElement(confirmPasswordError);
            confirmPasswordInput.classList.add("input-error");
        }
    }
});

/* ------------------------------------------------
   EVENT: Name Input - Live Validation
   ------------------------------------------------ */
nameInput.addEventListener("input", function() {
    const name = nameInput.value;

    nameError.textContent = "";
    hideElement(nameError);
    nameInput.classList.remove("input-error");

    if (name.length > 0 && name.trim().length < 2) {
        nameError.textContent = "Name must be at least 2 characters.";
        showElement(nameError);
        nameInput.classList.add("input-error");
    }
});

/* ------------------------------------------------
   EVENT: Email Input - Live Validation
   ------------------------------------------------ */
emailInput.addEventListener("input", function() {
    const email = emailInput.value;

    emailError.textContent = "";
    hideElement(emailError);
    emailInput.classList.remove("input-error");

    if (email.length > 0) {
        validateEmail(email);
    }
});

/* ============================================================
   SECTION 6: MAIN LOGIC
   ============================================================ */

function initRegisterPage() {
    // Check if user is already logged in
    const storedUser = localStorage.getItem("loggedInUser");
    if (storedUser) {
        window.location.href = "DashboardPage.html";
    }

    // Load any previously registered users from localStorage
    // This way, registrations persist across page refreshes
    const storedRegistrations = localStorage.getItem("registeredUsers");
    if (storedRegistrations) {
        // Parse the JSON string back into an array of user objects
        const users = JSON.parse(storedRegistrations);
        // Add each user to our registeredUsers array
        users.forEach(function(user) {
            registeredUsers.push(user);
        });
    }

    console.log("Register Page initialized!");
    console.log("Registered users count:", registeredUsers.length);
}

document.addEventListener("DOMContentLoaded", initRegisterPage);