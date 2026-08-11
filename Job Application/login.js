/* ============================================================
   LOGIN PAGE - JavaScript
   Uses shared auth module (auth.js)
   ============================================================ */

/* SECTION 1: CACHE DOM ELEMENTS */
const loginForm = document.getElementById("loginForm");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const emailError = document.getElementById("emailError");
const passwordError = document.getElementById("passwordError");
const generalError = document.getElementById("generalError");
const successMessage = document.getElementById("successMessage");
const loginButton = document.getElementById("loginButton");
const buttonText = document.getElementById("buttonText");
const loadingSpinner = document.getElementById("loadingSpinner");
const togglePasswordBtn = document.getElementById("togglePassword");
const rememberMeCheckbox = document.getElementById("rememberMe");

/* SECTION 2: VARIABLES */
let isLoggingIn = false;

/* SECTION 3: HELPER FUNCTIONS */
function showElement(element) {
    element.classList.remove("hidden");
}

function hideElement(element) {
    element.classList.add("hidden");
}

function clearAllErrors() {
    emailError.textContent = "";
    hideElement(emailError);
    passwordError.textContent = "";
    hideElement(passwordError);
    generalError.textContent = "";
    hideElement(generalError);
    successMessage.textContent = "";
    hideElement(successMessage);
    emailInput.classList.remove("input-error");
    passwordInput.classList.remove("input-error");
}

function setButtonLoading(isLoading) {
    if (isLoading) {
        buttonText.textContent = "Signing in...";
        showElement(loadingSpinner);
        loginButton.disabled = true;
        loginButton.classList.add("btn-loading");
    } else {
        buttonText.textContent = "Sign In";
        hideElement(loadingSpinner);
        loginButton.disabled = false;
        loginButton.classList.remove("btn-loading");
    }
}

/* SECTION 4: VALIDATION FUNCTIONS */
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

function validatePassword(password) {
    if (!password || password.trim() === "") {
        passwordError.textContent = "Password is required.";
        showElement(passwordError);
        passwordInput.classList.add("input-error");
        return false;
    }

    passwordInput.classList.remove("input-error");
    hideElement(passwordError);
    return true;
}

/* SECTION 5: EVENT LISTENERS */
loginForm.addEventListener("submit", function(event) {
    event.preventDefault();

    if (isLoggingIn) return;

    clearAllErrors();

    const email = emailInput.value;
    const password = passwordInput.value;

    const isEmailValid = validateEmail(email);
    if (!isEmailValid) return;

    const isPasswordValid = validatePassword(password);
    if (!isPasswordValid) return;

    isLoggingIn = true;
    setButtonLoading(true);

    (async function() {
        try {
            const resp = await fetch('/api/users/login/', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: email.trim(), password: password })
            });

            const data = await resp.json();
            setButtonLoading(false);
            isLoggingIn = false;

            if (resp.status === 200) {
                // store tokens and user info returned from server
                const userObj = data.user ? { ...data.user, access: data.access, refresh: data.refresh } : { email: email.trim(), access: data.access, refresh: data.refresh };
                setCurrentUser(userObj);
                localStorage.setItem("rememberMe", rememberMeCheckbox.checked ? "true" : "false");
                if (window.setAuthTokens) setAuthTokens({ access: data.access, refresh: data.refresh });

                successMessage.textContent = "Login successful! Redirecting to Dashboard...";
                showElement(successMessage);

                setTimeout(function() { window.location.href = "DashboardPage.html"; }, 900);
                return;
            }

            generalError.textContent = data.error || data.detail || 'Invalid credentials';
            showElement(generalError);
        } catch (err) {
            setButtonLoading(false);
            isLoggingIn = false;

            const fallback = validateLogin(email.trim(), password);
            if (fallback.success) {
                setCurrentUser(fallback.user);
                localStorage.setItem("rememberMe", rememberMeCheckbox.checked ? "true" : "false");
                successMessage.textContent = "Login successful! Redirecting to Dashboard...";
                showElement(successMessage);
                setTimeout(function() { window.location.href = "DashboardPage.html"; }, 900);
                return;
            }

            generalError.textContent = fallback.message || 'Network error, please try again.';
            showElement(generalError);
        }
    })();
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

/* Password input - live validation */
passwordInput.addEventListener("input", function() {
    const password = passwordInput.value;
    passwordError.textContent = "";
    hideElement(passwordError);
    passwordInput.classList.remove("input-error");
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

/* SECTION 6: MAIN LOGIC */
function initLoginPage() {
    if (isLoggedIn()) {
        window.location.href = "DashboardPage.html";
    }
}

document.addEventListener("DOMContentLoaded", initLoginPage);