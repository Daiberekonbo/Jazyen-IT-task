/* ============================================================
   REGISTER PAGE - JavaScript
   Uses shared auth module (auth.js)
   ============================================================ */

/* SECTION 1: CACHE DOM ELEMENTS */
const registerForm = document.getElementById("registerForm");
const nameInput = document.getElementById("fullName");
const emailInput = document.getElementById("email");
const phoneInput = document.getElementById("phone");
const passwordInput = document.getElementById("password");
const confirmPasswordInput = document.getElementById("confirmPassword");
const roleInputs = document.querySelectorAll('input[name="role"]');
const nameError = document.getElementById("nameError");
const emailError = document.getElementById("emailError");
const passwordError = document.getElementById("passwordError");
const confirmPasswordError = document.getElementById("confirmPasswordError");
const generalError = document.getElementById("generalError");
const successMessage = document.getElementById("successMessage");
const registerButton = document.getElementById("registerButton");
const buttonText = document.getElementById("buttonText");
const loadingSpinner = document.getElementById("loadingSpinner");
const togglePasswordBtn = document.getElementById("togglePassword");
const toggleConfirmPasswordBtn = document.getElementById("toggleConfirmPassword");
const strengthBar = document.getElementById("strengthBar");
const strengthLabel = document.getElementById("strengthLabel");
const passwordStrength = document.getElementById("passwordStrength");

/* SECTION 2: VARIABLES */
let isRegistering = false;

/* SECTION 3: HELPER FUNCTIONS */
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
        registerButton.classList.add("btn-loading");
    } else {
        buttonText.textContent = "Create Account";
        hideElement(loadingSpinner);
        registerButton.disabled = false;
        registerButton.classList.remove("btn-loading");
    }
}

/* SECTION 4: VALIDATION */
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
    hideElement(nameError);
    return true;
}

function validateEmail(email) {
    if (!email || email.trim() === "") {
        emailError.textContent = "Email is required.";
        showElement(emailError);
        emailInput.classList.add("input-error");
        return false;
    }
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
        emailError.textContent = "Please enter a valid email address.";
        showElement(emailError);
        emailInput.classList.add("input-error");
        return false;
    }
    emailInput.classList.remove("input-error");
    hideElement(emailError);
    return true;
}

function checkPasswordStrength(password) {
    let score = 0;
    let color = "#DC2626";

    if (password.length >= 8) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[a-z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[!@#$%^&*]/.test(password)) score++;

    const percentage = (score / 5) * 100;
    strengthBar.style.width = percentage + "%";

    if (score <= 1) {
        color = "#DC2626";
        strengthLabel.textContent = "Weak";
    } else if (score <= 3) {
        color = "#F97316";
        strengthLabel.textContent = "Fair";
    } else if (score <= 4) {
        color = "#3B82F6";
        strengthLabel.textContent = "Good";
    } else {
        color = "#16A34A";
        strengthLabel.textContent = "Strong";
    }

    strengthBar.style.background = color;

    return { score: score, label: strengthLabel.textContent };
}

function validatePassword(password) {
    if (!password || password.trim() === "") {
        passwordError.textContent = "Password is required.";
        showElement(passwordError);
        passwordInput.classList.add("input-error");
        return false;
    }
    const strength = checkPasswordStrength(password);
    if (strength.score < 3) {
        passwordError.textContent = "Password is too weak. Use at least 8 characters with uppercase, number, and special character.";
        showElement(passwordError);
        passwordInput.classList.add("input-error");
        return false;
    }
    passwordInput.classList.remove("input-error");
    hideElement(passwordError);
    return true;
}

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
    hideElement(confirmPasswordError);
    return true;
}

/* SECTION 5: EVENT LISTENERS */
registerForm.addEventListener("submit", function(event) {
    event.preventDefault();

    if (isRegistering) return;

    clearAllErrors();

    const fullName = nameInput.value;
    const email = emailInput.value;
    const phone = phoneInput.value;
    const password = passwordInput.value;
    const confirmPassword = confirmPasswordInput.value;
    const role = Array.from(roleInputs).find(function(input) { return input.checked; })?.value || 'applicant';

    if (!validateName(fullName)) return;
    if (!validateEmail(email)) return;
    if (!validatePassword(password)) return;
    if (!validateConfirmPassword(password, confirmPassword)) return;

    isRegistering = true;
    setButtonLoading(true);

    // Call backend API to register user
    (async function() {
        try {
            const resp = await fetch('/api/users/register/', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: fullName.trim(),
                    email: email.trim(),
                    phone: phone.trim(),
                    role: role,
                    password: password
                })
            });

            setButtonLoading(false);
            isRegistering = false;

            if (resp.status === 201) {
                successMessage.textContent = "Account created successfully! Redirecting to Login...";
                showElement(successMessage);
                setTimeout(function() { window.location.href = "Login.html"; }, 1200);
                return;
            }

            const data = await resp.json();
            generalError.textContent = data.error || data.message || 'Registration failed';
            showElement(generalError);
        } catch (err) {
            setButtonLoading(false);
            isRegistering = false;

            const localResult = registerUser({
                name: fullName.trim(),
                email: email.trim(),
                phone: phone.trim(),
                password: password,
                role: role
            });

            if (localResult.success) {
                successMessage.textContent = "Account created locally! Redirecting to Login...";
                showElement(successMessage);
                setTimeout(function() { window.location.href = "Login.html"; }, 1200);
                return;
            }

            generalError.textContent = localResult.message || 'Network error, please try again.';
            showElement(generalError);
        }
    })();
});

/* Password toggle */
togglePasswordBtn.addEventListener("click", function() {
    const currentType = passwordInput.type;
    if (currentType === "password") {
        passwordInput.type = "text";
        togglePasswordBtn.innerHTML = '<i class="fas fa-eye-slash"></i>';
        togglePasswordBtn.setAttribute("aria-label", "Hide password");
    } else {
        passwordInput.type = "password";
        togglePasswordBtn.innerHTML = '<i class="fas fa-eye"></i>';
        togglePasswordBtn.setAttribute("aria-label", "Show password");
    }
});

/* Confirm password toggle */
toggleConfirmPasswordBtn.addEventListener("click", function() {
    const currentType = confirmPasswordInput.type;
    if (currentType === "password") {
        confirmPasswordInput.type = "text";
        toggleConfirmPasswordBtn.innerHTML = '<i class="fas fa-eye-slash"></i>';
        toggleConfirmPasswordBtn.setAttribute("aria-label", "Hide confirm password");
    } else {
        confirmPasswordInput.type = "password";
        toggleConfirmPasswordBtn.innerHTML = '<i class="fas fa-eye"></i>';
        toggleConfirmPasswordBtn.setAttribute("aria-label", "Show confirm password");
    }
});

/* Password input - live strength */
passwordInput.addEventListener("input", function() {
    const password = passwordInput.value;

    if (password.length === 0) {
        strengthBar.style.width = "0%";
        passwordStrength.classList.add("hidden");
        passwordError.textContent = "";
        hideElement(passwordError);
        passwordInput.classList.remove("input-error");
    } else {
        passwordStrength.classList.remove("hidden");
        checkPasswordStrength(password);
        passwordError.textContent = "";
        hideElement(passwordError);
        passwordInput.classList.remove("input-error");
    }
});

/* Confirm password input - live match */
confirmPasswordInput.addEventListener("input", function() {
    const password = passwordInput.value;
    const confirmPassword = confirmPasswordInput.value;

    confirmPasswordError.textContent = "";
    hideElement(confirmPasswordError);
    confirmPasswordInput.classList.remove("input-error");

    if (confirmPassword.length > 0 && password.length > 0 && password !== confirmPassword) {
        confirmPasswordError.textContent = "Passwords do not match.";
        showElement(confirmPasswordError);
        confirmPasswordInput.classList.add("input-error");
    }
});

/* Name input - live validation */
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

/* Email input - live validation */
emailInput.addEventListener("input", function() {
    const email = emailInput.value;
    emailError.textContent = "";
    hideElement(emailError);
    emailInput.classList.remove("input-error");

    if (email.length > 0) {
        validateEmail(email);
    }
});

/* SECTION 6: MAIN LOGIC */
function initRegisterPage() {
    if (isLoggedIn()) {
        window.location.href = "DashboardPage.html";
    }
}

document.addEventListener("DOMContentLoaded", initRegisterPage);