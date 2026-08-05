/* ============================================================
   RESET PASSWORD PAGE - JavaScript
   ============================================================ */

/* SECTION 1: CACHE DOM ELEMENTS */
const resetForm = document.getElementById("resetPasswordForm");
const passwordInput = document.getElementById("newPassword");
const confirmPasswordInput = document.getElementById("confirmPassword");
const passwordError = document.getElementById("passwordError");
const confirmPasswordError = document.getElementById("confirmPasswordError");
const generalError = document.getElementById("generalError");
const successMessage = document.getElementById("successMessage");
const resetButton = document.getElementById("resetButton");
const buttonText = document.getElementById("buttonText");
const loadingSpinner = document.getElementById("loadingSpinner");
const togglePasswordBtn = document.getElementById("togglePassword");
const toggleConfirmPasswordBtn = document.getElementById("toggleConfirmPassword");
const strengthBar = document.getElementById("strengthBar");
const reqLength = document.getElementById("reqLength");
const reqUppercase = document.getElementById("reqUppercase");
const reqLowercase = document.getElementById("reqLowercase");
const reqNumber = document.getElementById("reqNumber");
const reqSpecial = document.getElementById("reqSpecial");

/* SECTION 2: VARIABLES */
let isResetting = false;

/* SECTION 3: HELPER FUNCTIONS */
function showElement(el) { el.classList.remove("hidden"); }
function hideElement(el) { el.classList.add("hidden"); }

function clearAll() {
    passwordError.textContent = ""; hideElement(passwordError);
    confirmPasswordError.textContent = ""; hideElement(confirmPasswordError);
    generalError.textContent = ""; hideElement(generalError);
    successMessage.textContent = ""; hideElement(successMessage);
    passwordInput.classList.remove("input-error");
    confirmPasswordInput.classList.remove("input-error");
}

function setButtonLoading(isLoading) {
    if (isLoading) {
        buttonText.textContent = "Resetting...";
        showElement(loadingSpinner);
        resetButton.disabled = true;
    } else {
        buttonText.textContent = "Reset Password";
        hideElement(loadingSpinner);
        resetButton.disabled = false;
    }
}

/* SECTION 4: VALIDATION FUNCTIONS */
function checkPasswordStrength(password) {
    let score = 0;

    if (password.length >= 8) { score++; reqLength.classList.add("met"); reqLength.classList.remove("not-met"); }
    else { reqLength.classList.add("not-met"); reqLength.classList.remove("met"); }

    if (/[A-Z]/.test(password)) { score++; reqUppercase.classList.add("met"); reqUppercase.classList.remove("not-met"); }
    else { reqUppercase.classList.add("not-met"); reqUppercase.classList.remove("met"); }

    if (/[a-z]/.test(password)) { score++; reqLowercase.classList.add("met"); reqLowercase.classList.remove("not-met"); }
    else { reqLowercase.classList.add("not-met"); reqLowercase.classList.remove("met"); }

    if (/[0-9]/.test(password)) { score++; reqNumber.classList.add("met"); reqNumber.classList.remove("not-met"); }
    else { reqNumber.classList.add("not-met"); reqNumber.classList.remove("met"); }

    if (/[!@#$%^&*]/.test(password)) { score++; reqSpecial.classList.add("met"); reqSpecial.classList.remove("not-met"); }
    else { reqSpecial.classList.add("not-met"); reqSpecial.classList.remove("met"); }

    const pct = (score / 5) * 100;
    strengthBar.style.width = pct + "%";

    if (score <= 1) { strengthBar.style.backgroundColor = "#dc3545"; strengthBar.textContent = "Weak"; }
    else if (score <= 2) { strengthBar.style.backgroundColor = "#ffc107"; strengthBar.textContent = "Fair"; }
    else if (score <= 4) { strengthBar.style.backgroundColor = "#17a2b8"; strengthBar.textContent = "Good"; }
    else { strengthBar.style.backgroundColor = "#28a745"; strengthBar.textContent = "Strong"; }

    return score;
}

function validatePassword(password) {
    if (!password || password.trim() === "") {
        passwordError.textContent = "Password is required.";
        showElement(passwordError);
        passwordInput.classList.add("input-error");
        return false;
    }
    const score = checkPasswordStrength(password);
    if (score < 3) {
        passwordError.textContent = "Password is too weak. Meet at least 3 requirements.";
        showElement(passwordError);
        passwordInput.classList.add("input-error");
        return false;
    }
    passwordInput.classList.remove("input-error");
    return true;
}

function validateConfirmPassword(password, confirm) {
    if (!confirm || confirm.trim() === "") {
        confirmPasswordError.textContent = "Please confirm your password.";
        showElement(confirmPasswordError);
        confirmPasswordInput.classList.add("input-error");
        return false;
    }
    if (password !== confirm) {
        confirmPasswordError.textContent = "Passwords do not match.";
        showElement(confirmPasswordError);
        confirmPasswordInput.classList.add("input-error");
        return false;
    }
    confirmPasswordInput.classList.remove("input-error");
    return true;
}

/* SECTION 5: EVENT LISTENERS */
resetButton.addEventListener("click", function() {
    if (isResetting) return;
    clearAll();

    const password = passwordInput.value;
    const confirm = confirmPasswordInput.value;

    if (!validatePassword(password)) return;
    if (!validateConfirmPassword(password, confirm)) return;

    isResetting = true;
    setButtonLoading(true);

    // LATER BACKEND: POST /api/auth/reset-password with { token, password }
    setTimeout(function() {
        setButtonLoading(false);
        isResetting = false;
        successMessage.textContent = "Password reset successfully! Redirecting to Login...";
        showElement(successMessage);

        setTimeout(function() {
            window.location.href = "Login.html";
        }, 2000);
    }, 1500);
});

togglePasswordBtn.addEventListener("click", function() {
    const type = passwordInput.getAttribute("type");
    if (type === "password") {
        passwordInput.setAttribute("type", "text");
        togglePasswordBtn.innerHTML = '<span class="glyphicon glyphicon-eye-close"></span>';
        togglePasswordBtn.setAttribute("aria-label", "Hide password");
    } else {
        passwordInput.setAttribute("type", "password");
        togglePasswordBtn.innerHTML = '<span class="glyphicon glyphicon-eye-open"></span>';
        togglePasswordBtn.setAttribute("aria-label", "Show password");
    }
});

toggleConfirmPasswordBtn.addEventListener("click", function() {
    const type = confirmPasswordInput.getAttribute("type");
    if (type === "password") {
        confirmPasswordInput.setAttribute("type", "text");
        toggleConfirmPasswordBtn.innerHTML = '<span class="glyphicon glyphicon-eye-close"></span>';
        toggleConfirmPasswordBtn.setAttribute("aria-label", "Hide password");
    } else {
        confirmPasswordInput.setAttribute("type", "password");
        toggleConfirmPasswordBtn.innerHTML = '<span class="glyphicon glyphicon-eye-open"></span>';
        toggleConfirmPasswordBtn.setAttribute("aria-label", "Show password");
    }
});

passwordInput.addEventListener("input", function() {
    const pw = passwordInput.value;
    if (pw.length === 0) {
        strengthBar.style.width = "0%"; strengthBar.textContent = "";
        reqLength.classList.remove("met", "not-met");
        reqUppercase.classList.remove("met", "not-met");
        reqLowercase.classList.remove("met", "not-met");
        reqNumber.classList.remove("met", "not-met");
        reqSpecial.classList.remove("met", "not-met");
        passwordError.textContent = ""; hideElement(passwordError);
        passwordInput.classList.remove("input-error");
    } else {
        checkPasswordStrength(pw);
        passwordError.textContent = ""; hideElement(passwordError);
        passwordInput.classList.remove("input-error");
    }
});

confirmPasswordInput.addEventListener("input", function() {
    const pw = passwordInput.value;
    const confirm = confirmPasswordInput.value;
    confirmPasswordError.textContent = ""; hideElement(confirmPasswordError);
    confirmPasswordInput.classList.remove("input-error");
    if (confirm.length > 0 && pw.length > 0 && pw !== confirm) {
        confirmPasswordError.textContent = "Passwords do not match.";
        showElement(confirmPasswordError);
        confirmPasswordInput.classList.add("input-error");
    }
});

/* SECTION 6: MAIN LOGIC */
function initResetPasswordPage() {
    console.log("Reset Password Page initialized!");
}

document.addEventListener("DOMContentLoaded", initResetPasswordPage);