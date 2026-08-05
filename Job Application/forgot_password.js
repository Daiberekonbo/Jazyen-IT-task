/* ============================================================
   FORGOT PASSWORD PAGE - JavaScript
   ============================================================ */

/* ============================================================
   SECTION 1: CACHE DOM ELEMENTS
   ============================================================ */
const forgotForm = document.getElementById("forgotPasswordForm");
const emailInput = document.getElementById("email");
const emailError = document.getElementById("emailError");
const generalError = document.getElementById("generalError");
const successMessage = document.getElementById("successMessage");
const resetButton = document.getElementById("resetButton");
const buttonText = document.getElementById("buttonText");
const loadingSpinner = document.getElementById("loadingSpinner");

/* ============================================================
   SECTION 2: VARIABLES
   ============================================================ */
let isSending = false;

/* ============================================================
   SECTION 3: HELPER FUNCTIONS
   ============================================================ */
function showElement(element) {
    element.classList.remove("hidden");
}

function hideElement(element) {
    element.classList.add("hidden");
}

function clearAll() {
    emailError.textContent = "";
    hideElement(emailError);
    generalError.textContent = "";
    hideElement(generalError);
    successMessage.textContent = "";
    hideElement(successMessage);
    emailInput.classList.remove("input-error");
}

function setButtonLoading(isLoading) {
    if (isLoading) {
        buttonText.textContent = "Sending...";
        showElement(loadingSpinner);
        resetButton.disabled = true;
    } else {
        buttonText.textContent = "Send Reset Link";
        hideElement(loadingSpinner);
        resetButton.disabled = false;
    }
}

/* ============================================================
   SECTION 4: VALIDATION FUNCTIONS
   ============================================================ */
function validateEmail(email) {
    if (!email || email.trim() === "") {
        emailError.textContent = "Email is required.";
        showElement(emailError);
        emailInput.classList.add("input-error");
        return false;
    }
    if (email.indexOf("@") === -1) {
        emailError.textContent = "Please enter a valid email.";
        showElement(emailError);
        emailInput.classList.add("input-error");
        return false;
    }
    const parts = email.split("@");
    if (!parts[1] || parts[1].indexOf(".") === -1) {
        emailError.textContent = "Please enter a valid email.";
        showElement(emailError);
        emailInput.classList.add("input-error");
        return false;
    }
    emailInput.classList.remove("input-error");
    return true;
}

/* ============================================================
   SECTION 5: EVENT LISTENERS
   ============================================================ */
resetButton.addEventListener("click", function() {
    if (isSending) return;

    clearAll();

    const email = emailInput.value;
    if (!validateEmail(email)) return;

    isSending = true;
    setButtonLoading(true);

    // Simulate sending reset email
    // LATER BACKEND: POST /api/auth/forgot-password with { email }
    setTimeout(function() {
        setButtonLoading(false);
        isSending = false;

        // Show success message
        // LATER BACKEND: Show error if email not found in system
        successMessage.textContent = "If this email is registered, you will receive a password reset link shortly.";
        showElement(successMessage);

        // Clear the input
        emailInput.value = "";
    }, 2000);
});

// Live email validation
emailInput.addEventListener("input", function() {
    emailError.textContent = "";
    hideElement(emailError);
    emailInput.classList.remove("input-error");
});

/* ============================================================
   SECTION 6: MAIN LOGIC
   ============================================================ */
function initForgotPasswordPage() {
    console.log("Forgot Password Page initialized!");
    console.log("No backend connection. Email sending is simulated.");
}

document.addEventListener("DOMContentLoaded", initForgotPasswordPage);