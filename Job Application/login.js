/* ============================================================
   LOGIN PAGE - JavaScript
   Job Application Website

   FILE PURPOSE:
   This file handles all the interactivity on the Login Page.
   It validates user input, simulates a login process, and
   prepares the structure for future backend integration.

   WHAT WE'RE TRYING TO ACHIEVE:
   A real login page needs to:
   1. Validate that the email is in a valid format
   2. Validate that the password meets requirements
   3. Show/hide password so users can check what they typed
   4. Show loading state while "logging in"
   5. Show error messages when something is wrong
   6. Show success message when login works
   7. Redirect to Dashboard after successful login

   HOW JAVASCRIPT SOLVES IT:
   - We use DOM methods to get references to form elements
   - We use event listeners to respond to user actions
   - We use functions to organize our validation logic
   - We use setTimeout() to simulate network delay
   - We use window.location.href to simulate page redirect

   LATER BACKEND CONNECTION:
   Currently we use fake user data stored in an array.
   Later, this will be replaced with:
   - Fetch API call to POST /api/auth/login
   - Server validates credentials
   - Server returns JWT token
   - Token stored in localStorage
   - User redirected to Dashboard

   ============================================================ */

/* ============================================================
   SECTION 1: CACHE DOM ELEMENTS
   
   We grab all the HTML elements we need to work with.
   Storing them at the top makes the code cleaner and faster.
   ============================================================ */

// ---- Form Elements ----
// The entire form element - we use this to prevent default submission
const loginForm = document.getElementById("loginForm");

// The email input field where users type their email
const emailInput = document.getElementById("email");

// The password input field where users type their password
const passwordInput = document.getElementById("password");

// ---- Error Message Elements ----
// Where we show email validation errors
const emailError = document.getElementById("emailError");

// Where we show password validation errors
const passwordError = document.getElementById("passwordError");

// Where we show general errors (like "Invalid credentials")
const generalError = document.getElementById("generalError");

// Where we show success message
const successMessage = document.getElementById("successMessage");

// ---- Button Elements ----
// The main Login button
const loginButton = document.getElementById("loginButton");

// The text inside the button (changes to "Logging in..." during loading)
const buttonText = document.getElementById("buttonText");

// The loading spinner icon (hidden by default)
const loadingSpinner = document.getElementById("loadingSpinner");

// ---- Password Toggle ----
// The eye icon button that shows/hides the password
const togglePasswordBtn = document.getElementById("togglePassword");

// ---- Remember Me ----
// The checkbox for "Remember Me" functionality
const rememberMeCheckbox = document.getElementById("rememberMe");

/* ============================================================
   SECTION 2: VARIABLES
   
   Data that changes as the user interacts with the page.
   ============================================================ */

/* ------------------------------------------------
   FAKE USERS ARRAY
   
   WHAT: An array of user objects that we use to
   simulate a real user database.
   
   WHY WE NEED IT:
   - We need to test login functionality without a backend.
   - These fake users let us demonstrate that the login
     actually checks credentials.
   - When the backend is ready, this array will be replaced
     with a Fetch API call to the server.
   
   HOW IT WORKS:
   - Each user is an object with properties: email, password, name
   - We use array.find() to look for a matching user
   - If found, login succeeds. If not, login fails.
   
   LATER BACKEND CONNECTION:
   This entire array will be removed.
   Instead, we will send a POST request to:
   POST /api/auth/login
   with { email, password } in the request body.
   The server will respond with { token, user } or an error.
   ================================================ */
const fakeUsers = [
    {
        email: "user@example.com",
        password: "Password123",
        name: "John Doe"
    },
    {
        email: "admin@jobportal.com",
        password: "Admin@2024",
        name: "Admin User"
    },
    {
        email: "test@test.com",
        password: "Test1234",
        name: "Test User"
    }
];

// Tracks whether the login process is currently running
// We use this to prevent multiple clicks on the login button
let isLoggingIn = false;

/* ============================================================
   SECTION 3: HELPER FUNCTIONS
   
   Small, focused functions that do one thing well.
   ============================================================ */

/* ------------------------------------------------
   FUNCTION: showElement(element)
   
   WHAT IT DOES:
   Removes the "hidden" class from an element to make
   it visible on the page.
   
   PARAMETER:
   - element: The DOM element to show
   
   WHY WE NEED IT:
   - Instead of writing element.classList.remove("hidden")
     everywhere, we call this function.
   - If we ever change how we hide/show elements, we only
     change it in one place.
   ------------------------------------------------ */
function showElement(element) {
    // Remove the "hidden" class to make the element visible
    element.classList.remove("hidden");
}

/* ------------------------------------------------
   FUNCTION: hideElement(element)
   
   WHAT IT DOES:
   Adds the "hidden" class to an element to hide it.
   
   PARAMETER:
   - element: The DOM element to hide
   ------------------------------------------------ */
function hideElement(element) {
    // Add the "hidden" class to make the element invisible
    element.classList.add("hidden");
}

/* ------------------------------------------------
   FUNCTION: clearAllErrors()
   
   WHAT IT DOES:
   Hides all error message elements and clears their text.
   
   WHY WE NEED IT:
   - Before showing new errors, we need to clear old ones.
   - If we don't clear them, old error messages will
     remain visible alongside new ones.
   - This function is called at the start of validation.
   ------------------------------------------------ */
function clearAllErrors() {
    // Clear the email error message text and hide it
    emailError.textContent = "";
    hideElement(emailError);

    // Clear the password error message text and hide it
    passwordError.textContent = "";
    hideElement(passwordError);

    // Clear the general error message text and hide it
    generalError.textContent = "";
    hideElement(generalError);

    // Clear the success message text and hide it
    successMessage.textContent = "";
    hideElement(successMessage);

    // Remove error styling from input fields
    // We do this so the red border disappears when errors are cleared
    emailInput.classList.remove("input-error");
    passwordInput.classList.remove("input-error");
}

/* ------------------------------------------------
   FUNCTION: setButtonLoading(isLoading)
   
   WHAT IT DOES:
   Changes the login button to show a loading state
   or restores it to normal.
   
   PARAMETER:
   - isLoading: Boolean - true to show loading, false to restore
   
   WHY WE NEED IT:
   - Users need visual feedback that something is happening.
   - The loading spinner tells the user "wait, we're processing."
   - Disabling the button prevents multiple submissions.
   
   HOW IT WORKS:
   1. If isLoading is true:
      - Change button text to "Logging in..."
      - Show the spinning icon
      - Disable the button so it can't be clicked again
   2. If isLoading is false:
      - Restore button text to "Login"
      - Hide the spinning icon
      - Enable the button
   ------------------------------------------------ */
function setButtonLoading(isLoading) {
    if (isLoading) {
        // Change the button text to show loading state
        buttonText.textContent = "Logging in...";
        // Show the loading spinner
        showElement(loadingSpinner);
        // Disable the button to prevent double-clicking
        loginButton.disabled = true;
        // Add a visual class to show the button is disabled
        loginButton.classList.add("button-loading");
    } else {
        // Restore the button text to normal
        buttonText.textContent = "Login";
        // Hide the loading spinner
        hideElement(loadingSpinner);
        // Re-enable the button
        loginButton.disabled = false;
        // Remove the loading visual class
        loginButton.classList.remove("button-loading");
    }
}

/* ============================================================
   SECTION 4: VALIDATION FUNCTIONS
   
   These functions check if the user's input is valid.
   Each function returns true if valid, false if invalid.
   ============================================================ */

/* ------------------------------------------------
   FUNCTION: validateEmail(email)
   
   WHAT IT DOES:
   Checks if an email address is in a valid format.
   
   PARAMETER:
   - email: The string the user typed in the email field
   
   RETURNS:
   - true if the email is valid
   - false if the email is invalid
   
   VALIDATION RULES:
   1. Email must not be empty
   2. Email must contain "@" symbol
   3. Email must contain "." after the "@" (like domain.com)
   4. There must be characters before "@" and after "."
   
   WHY THESE RULES:
   - A real email always has a username@domain.extension format
   - We keep validation simple for beginners
   - Later, the backend will do more thorough validation
   
   LATER BACKEND CONNECTION:
   The backend will also validate the email format.
   We do frontend validation for instant user feedback.
   Backend validation is for security (can't be bypassed).
   ------------------------------------------------ */
function validateEmail(email) {
    // Step 1: Check if email is empty
    // trim() removes whitespace from both ends of the string
    // If the user typed only spaces, trim() makes it empty
    if (!email || email.trim() === "") {
        // Set the error message text
        emailError.textContent = "Email is required.";
        // Show the error message element
        showElement(emailError);
        // Add red border to the input field
        emailInput.classList.add("input-error");
        // Return false because validation failed
        return false;
    }

    // Step 2: Check if email contains "@" symbol
    // indexOf() returns the position of "@" in the string
    // If "@" is not found, indexOf() returns -1
    if (email.indexOf("@") === -1) {
        emailError.textContent = "Email must contain @ symbol.";
        showElement(emailError);
        emailInput.classList.add("input-error");
        return false;
    }

    // Step 3: Split the email into local part and domain
    // split("@") divides the string at the "@" symbol
    // Example: "user@example.com" becomes ["user", "example.com"]
    const parts = email.split("@");

    // Check if there's text before the "@"
    // parts[0] is everything before "@"
    if (parts[0].length === 0) {
        emailError.textContent = "Email must have text before @.";
        showElement(emailError);
        emailInput.classList.add("input-error");
        return false;
    }

    // Check if there's text after the "@"
    // parts[1] is everything after "@"
    if (!parts[1] || parts[1].length === 0) {
        emailError.textContent = "Email must have a domain after @.";
        showElement(emailError);
        emailInput.classList.add("input-error");
        return false;
    }

    // Step 4: Check if the domain contains a dot
    // A valid domain looks like "example.com" (has a dot)
    if (parts[1].indexOf(".") === -1) {
        emailError.textContent = "Email domain must contain a dot (e.g., .com).";
        showElement(emailError);
        emailInput.classList.add("input-error");
        return false;
    }

    // If we made it here, the email is valid
    // Remove any error styling from the input
    emailInput.classList.remove("input-error");
    // Return true to indicate validation passed
    return true;
}

/* ------------------------------------------------
   FUNCTION: validatePassword(password)
   
   WHAT IT DOES:
   Checks if the password meets minimum requirements.
   
   PARAMETER:
   - password: The string the user typed in the password field
   
   RETURNS:
   - true if the password is valid
   - false if the password is invalid
   
   VALIDATION RULES:
   1. Password must not be empty
   2. Password must be at least 6 characters long
   
   WHY THESE RULES:
   - Empty passwords are never acceptable
   - 6 characters is a reasonable minimum for now
   - The Register page will have stronger password rules
   ------------------------------------------------ */
function validatePassword(password) {
    // Step 1: Check if password is empty
    if (!password || password.trim() === "") {
        passwordError.textContent = "Password is required.";
        showElement(passwordError);
        passwordInput.classList.add("input-error");
        return false;
    }

    // Step 2: Check minimum length
    if (password.length < 6) {
        passwordError.textContent = "Password must be at least 6 characters.";
        showElement(passwordError);
        passwordInput.classList.add("input-error");
        return false;
    }

    // If we made it here, the password is valid
    passwordInput.classList.remove("input-error");
    return true;
}

/* ------------------------------------------------
   FUNCTION: findUser(email, password)
   
   WHAT IT DOES:
   Searches the fakeUsers array for a user with matching
   email and password.
   
   PARAMETERS:
   - email: The email to search for
   - password: The password to check
   
   RETURNS:
   - The user object if found (login successful)
   - null if no matching user (login failed)
   
   HOW IT WORKS:
   1. We use the array.find() method to search through users
   2. find() takes a function that checks each user
   3. If a user matches both email AND password, find()
      returns that user object
   4. If no user matches, find() returns undefined
   5. We convert undefined to null for consistency
   
   LATER BACKEND CONNECTION:
   This entire function will be replaced with:
   
   const response = await fetch("/api/auth/login", {
       method: "POST",
       headers: { "Content-Type": "application/json" },
       body: JSON.stringify({ email, password })
   });
   
   const data = await response.json();
   
   if (response.ok) {
       // Login successful
       localStorage.setItem("token", data.token);
       localStorage.setItem("user", JSON.stringify(data.user));
       return data.user;
   } else {
       // Login failed
       return null;
   }
   ------------------------------------------------ */
function findUser(email, password) {
    // Step 1: Build a combined list of all users
    // We start with the hardcoded fake users
    let allUsers = [...fakeUsers];

    // Step 2: Add any users registered on the Register page
    // Registered users are stored in localStorage under "registeredUsers"
    // LATER BACKEND: This will be replaced with a server-side check
    const storedRegistrations = localStorage.getItem("registeredUsers");
    if (storedRegistrations) {
        // Parse the JSON string back into an array of user objects
        const registeredUsers = JSON.parse(storedRegistrations);
        // Add them to our combined list
        allUsers = allUsers.concat(registeredUsers);
    }

    // Step 3: Search the combined list for a matching user
    // We use array.find() to search through all users
    // The function checks each user object
    // We check if BOTH email AND password match
    const user = allUsers.find(function(user) {
        // Compare the provided email with the user's email
        // We use .toLowerCase() to make the comparison case-insensitive
        // "User@Example.com" becomes "user@example.com"
        const emailMatches = user.email.toLowerCase() === email.toLowerCase();
        
        // Compare the provided password with the user's password
        // Passwords ARE case-sensitive (this is standard security practice)
        const passwordMatches = user.password === password;
        
        // Return true only if BOTH match
        return emailMatches && passwordMatches;
    });

    // If user was found, return the user object
    // If not found, return null
    // The || operator means: if user is undefined, use null instead
    return user || null;
}

/* ============================================================
   SECTION 5: EVENT LISTENERS
   
   We connect our functions to user actions.
   ============================================================ */

/* ------------------------------------------------
   EVENT: Login Button Click
   
   WHAT IT DOES:
   When the user clicks the Login button, we:
   1. Clear any previous error messages
   2. Validate the email
   3. Validate the password
   4. If validation passes, simulate the login process
   5. Show loading state while "processing"
   6. Check credentials against fake users
   7. Show success or error message
   8. Redirect to Dashboard on success
   
   WHY WE USE "click" INSTEAD OF "submit":
   - The form has novalidate attribute, so the browser
     won't try to validate or submit the form
   - We have full control over what happens
   - We can show our own error messages instead of
     the browser's default ones
   ------------------------------------------------ */
loginButton.addEventListener("click", function() {
    // Step 1: Prevent double-clicking
    // If a login is already in progress, ignore this click
    if (isLoggingIn) {
        return;
    }

    // Step 2: Clear all previous error messages
    // This ensures old errors don't stay visible
    clearAllErrors();

    // Step 3: Get the values from the input fields
    // .value property gets whatever the user typed
    const email = emailInput.value;
    const password = passwordInput.value;

    // Step 4: Validate the email
    // If validateEmail() returns false, stop here
    const isEmailValid = validateEmail(email);
    if (!isEmailValid) {
        return; // Stop - email is invalid
    }

    // Step 5: Validate the password
    // If validatePassword() returns false, stop here
    const isPasswordValid = validatePassword(password);
    if (!isPasswordValid) {
        return; // Stop - password is invalid
    }

    // Step 6: Start the login process
    // Set the flag to prevent multiple clicks
    isLoggingIn = true;

    // Show the loading state on the button
    setButtonLoading(true);

    // Step 7: Simulate a network delay
    // setTimeout() waits for a specified time (in milliseconds)
    // then runs the function inside it
    // 2000ms = 2 seconds - simulates the time a real server would take
    setTimeout(function() {
        // Step 8: Try to find the user in our fake database
        const foundUser = findUser(email, password);

        // Step 9: Check if login was successful
        if (foundUser) {
            // ---- LOGIN SUCCESSFUL ----

            // Hide the loading state
            setButtonLoading(false);
            isLoggingIn = false;

            // Show a success message
            successMessage.textContent = "Login successful! Redirecting to Dashboard...";
            showElement(successMessage);

            // Store the logged-in user's information in localStorage
            // localStorage is a built-in browser feature that stores data
            // as key-value pairs. The data persists even after page refresh.
            // 
            // JSON.stringify() converts a JavaScript object into a JSON string
            // because localStorage can only store strings, not objects.
            //
            // LATER BACKEND CONNECTION:
            // Instead of storing the user object, we will store:
            // - JWT token from the server
            // - User info from the server response
            localStorage.setItem("loggedInUser", JSON.stringify(foundUser));

            // Also store the "Remember Me" preference
            // This will be used later for auto-login functionality
            localStorage.setItem("rememberMe", rememberMeCheckbox.checked);

            // Step 10: Redirect to the Dashboard page after a short delay
            // setTimeout() gives the user time to see the success message
            // before being redirected
            setTimeout(function() {
                // window.location.href changes the current page URL
                // This is how we navigate to another page in JavaScript
                window.location.href = "DashboardPage.html";
            }, 1500); // 1.5 second delay before redirect

        } else {
            // ---- LOGIN FAILED ----

            // Hide the loading state
            setButtonLoading(false);
            isLoggingIn = false;

            // Show a general error message
            // We don't specify whether the email or password was wrong
            // because that would give hackers information about valid emails
            generalError.textContent = "Invalid email or password. Please try again.";
            showElement(generalError);
        }
    }, 2000); // 2 second simulated delay
});

/* ------------------------------------------------
   EVENT: Password Toggle Button Click
   
   WHAT IT DOES:
   Toggles the password field between showing the text
   and hiding it with dots.
   
   WHY WE NEED IT:
   - Users often make typos when typing passwords
   - Showing the password lets them verify what they typed
   - The eye icon is a standard, recognizable pattern
   
   HOW IT WORKS:
   1. Check the current type of the password input
   2. If type is "password", change to "text" to show the password
   3. If type is "text", change to "password" to hide it
   4. Change the icon to indicate the current state
   ------------------------------------------------ */
togglePasswordBtn.addEventListener("click", function() {
    // Get the current type of the password input
    const currentType = passwordInput.getAttribute("type");

    // Check if the password is currently hidden
    if (currentType === "password") {
        // Change to text type to show the password
        passwordInput.setAttribute("type", "text");
        // Change the icon to "eye-close" (closed eye)
        // This tells the user "click to hide"
        togglePasswordBtn.innerHTML = '<span class="glyphicon glyphicon-eye-close"></span>';
        // Update the aria-label for accessibility
        togglePasswordBtn.setAttribute("aria-label", "Hide password");
    } else {
        // Change back to password type to hide it
        passwordInput.setAttribute("type", "password");
        // Change the icon back to "eye-open" (open eye)
        // This tells the user "click to show"
        togglePasswordBtn.innerHTML = '<span class="glyphicon glyphicon-eye-open"></span>';
        // Update the aria-label for accessibility
        togglePasswordBtn.setAttribute("aria-label", "Show password");
    }
});

/* ------------------------------------------------
   EVENT: Email Input - Real-time Validation
   
   WHAT IT DOES:
   As the user types in the email field, we validate
   the email in real-time and show/hide error messages.
   
   WHY WE NEED IT:
   - Instant feedback helps users correct mistakes quickly
   - Better user experience than waiting until they click Login
   - This is called "live validation" or "inline validation"
   
   HOW IT WORKS:
   1. Listen for the "input" event (fires on every keystroke)
   2. Clear the email error
   3. If the email is not empty, validate it
   4. Show or hide the error message based on validation
   ------------------------------------------------ */
emailInput.addEventListener("input", function() {
    // Get the current value of the email input
    const email = emailInput.value;

    // Clear the email error message
    emailError.textContent = "";
    hideElement(emailError);
    emailInput.classList.remove("input-error");

    // Only validate if there's something typed
    if (email.length > 0) {
        // Call validateEmail which will show errors if invalid
        validateEmail(email);
    }
});

/* ------------------------------------------------
   EVENT: Password Input - Real-time Validation
   
   WHAT IT DOES:
   As the user types in the password field, we validate
   the password in real-time.
   ------------------------------------------------ */
passwordInput.addEventListener("input", function() {
    // Get the current value of the password input
    const password = passwordInput.value;

    // Clear the password error message
    passwordError.textContent = "";
    hideElement(passwordError);
    passwordInput.classList.remove("input-error");

    // Only validate if there's something typed
    if (password.length > 0) {
        // Call validatePassword which will show errors if invalid
        validatePassword(password);
    }
});

/* ============================================================
   SECTION 6: MAIN LOGIC
   
   Initialization code that runs when the page loads.
   ============================================================ */

/* ------------------------------------------------
   FUNCTION: initLoginPage()
   
   WHAT IT DOES:
   Sets up the Login Page when it first loads.
   
   WHY WE NEED IT:
   - We check if a user is already logged in
   - If they are, we redirect them to the Dashboard
   - This prevents logged-in users from seeing the login page
   
   LATER BACKEND CONNECTION:
   When using JWT tokens, we would check if the token
   is still valid by calling:
   GET /api/auth/verify
   with the token in the Authorization header.
   If valid, redirect to Dashboard.
   If expired or invalid, show the login page.
   ------------------------------------------------ */
function initLoginPage() {
    // Check if there's already a logged-in user in localStorage
    // localStorage.getItem() retrieves a stored value by its key
    const storedUser = localStorage.getItem("loggedInUser");

    // If a user is stored, they're already logged in
    if (storedUser) {
        // Redirect them to the Dashboard
        // They don't need to see the login page
        window.location.href = "DashboardPage.html";
    }

    // Log that the page initialized
    console.log("Login Page initialized successfully!");
    console.log("Using fake user data. No backend connection.");
    console.log("Fake users available:", fakeUsers.length);
}

// Start the page initialization when the DOM is ready
document.addEventListener("DOMContentLoaded", initLoginPage);