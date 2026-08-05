/* ============================================================
   LANDING PAGE - JavaScript
   Job Application Website

   FILE PURPOSE:
   This file adds interactivity to the Landing Page.
   Everything here will work 100% on the frontend.
   No backend, no API calls, no database.

   LATER BACKEND CONNECTION:
   This file does NOT connect to any backend yet.
   When we add the backend, we will use the Fetch API
   to send/receive data from the server.

   ============================================================ */

/* ============================================================
   SECTION 1: CACHE DOM ELEMENTS
   
   WHAT: We grab references to HTML elements and store them
   in variables at the top of the file.
   
   WHY: 
   - Finding elements once and storing them is faster than
     searching the DOM every time we need them.
   - Having all element references in one place makes the
     code easier to read and maintain.
   - If we need to change a class name or ID, we only change
     it in one place (here) instead of searching through the
     entire file.
   
   This is called "caching" and it's a standard practice
   in professional JavaScript development.
   ============================================================ */

// ---- Navigation Elements ----
// The <nav> element that contains the logo and menu links
const navBar = document.querySelector("nav");

// The <ul> element inside the nav that holds all the links
const navMenu = document.querySelector("nav ul");

// All anchor tags inside the navigation menu
// We use this to highlight the active link and close mobile menu
const navLinks = document.querySelectorAll("nav ul li a");

// The logo/brand element in the nav
const logo = document.querySelector(".logo");

// ---- Hero Section Elements ----
// The main heading "Find Your Dream Job" text container
const heroHeading = document.querySelector("#home .homec h1");

// The paragraph text in the hero section
const heroParagraph = document.querySelector(".homec p");

// Both buttons in the hero section ("Join Now" and "Sign In")
const heroButtons = document.querySelectorAll(".homebtns a");

// ---- Stats Counter Elements ----
// All the number spans inside the stats section
// We'll use these for the animated counter later
const statNumbers = document.querySelectorAll(".item .number");

// ---- Section Elements for Active Link Tracking ----
// We need to know when each section is visible on screen
// so we can highlight the correct nav link
const sections = document.querySelectorAll("section");

// ---- Scroll-to-Top Button ----
// This button doesn't exist in the HTML yet.
// We will create it with JavaScript and add it to the page.
// We declare the variable here but create the element later.
let scrollToTopBtn = null;

/* ============================================================
   SECTION 2: VARIABLES
   
   WHAT: We store values that might change as the user
   interacts with the page.
   
   WHY:
   - Keeps track of the page state (like whether the mobile
     menu is open or not).
   - Stores data we might need later (like which section
     the user is currently viewing).
   ============================================================ */

// Tracks whether the mobile navigation menu is currently open
// Starts as false (closed) because by default the menu is hidden
let isMobileMenuOpen = false;

// Stores the ID of the currently visible section on screen
// We update this as the user scrolls
let currentActiveSection = "home";

// We'll use this to improve performance by limiting how often
// scroll events fire (called "throttling")
let scrollTimeout = null;

/* ============================================================
   SECTION 3: HELPER FUNCTIONS
   
   WHAT: Small, reusable functions that do one specific task.
   
   WHY:
   - Breaking code into small functions makes it easier to
     understand and test.
   - Each function has a single responsibility.
   - We can reuse the same function in multiple places
     instead of writing the same code twice.
   
   This follows the "DRY" principle: Don't Repeat Yourself.
   ============================================================ */

/* ------------------------------------------------
   FUNCTION: createHamburgerButton()
   
   WHAT IT DOES:
   Creates a hamburger menu button for mobile devices.
   This button has three horizontal lines (like a hamburger)
   and toggles the navigation menu open and closed.
   
   WHY WE NEED IT:
   - On mobile screens, the navigation links take up too
     much space.
   - A hamburger button hides the links and shows them
     only when the user taps the button.
   - This is a standard pattern used on almost every
     professional website.
   
   HOW IT WORKS:
   1. We use document.createElement() to create a new
      button element in memory (not yet visible on page).
   2. We add a class to style it with CSS.
   3. We add an event listener (click) to toggle the menu.
   4. We insert the button at the beginning of the nav bar.
   
   LATER BACKEND CONNECTION:
   This is purely frontend UI. No backend needed.
   ------------------------------------------------ */
function createHamburgerButton() {
    // Step 1: Create a new button element
    // document.createElement("button") creates a <button></button>
    // It exists only in memory until we add it to the page
    const hamburger = document.createElement("button");

    // Step 2: Add a class name for CSS styling
    // We'll use this class to style the button's appearance
    hamburger.className = "hamburger-btn";

    // Step 3: Add aria-label for accessibility
    // Screen readers will read this text so visually impaired
    // users know what this button does
    hamburger.setAttribute("aria-label", "Toggle navigation menu");

    // Step 4: Create the three lines (the "hamburger" icon)
    // We create three <span> elements, each representing one line
    for (let i = 0; i < 3; i++) {
        // Create a span element for each line
        const line = document.createElement("span");
        // Add a class so CSS can style each line
        line.className = "hamburger-line";
        // Add the line to the button
        hamburger.appendChild(line);
    }

    // Step 5: Add a click event listener
    // When the user clicks the hamburger button, the menu toggles
    hamburger.addEventListener("click", function() {
        // Call the function that opens/closes the menu
        toggleMobileMenu();
    });

    // Step 6: Insert the button at the beginning of the nav
    // insertBefore() puts the button before the <ul> element
    // The first parameter is the new element, the second is the
    // reference element (the element we insert before)
    navBar.insertBefore(hamburger, navMenu);

    // Return the button so we can reference it elsewhere if needed
    return hamburger;
}

/* ------------------------------------------------
   FUNCTION: toggleMobileMenu()
   
   WHAT IT DOES:
   Opens or closes the mobile navigation menu when the
   hamburger button is clicked.
   
   WHY WE NEED IT:
   - Users on mobile phones need to access the same links
     as desktop users.
   - Toggling means: if menu is closed, open it. If menu
     is open, close it.
   
   HOW IT WORKS:
   1. Check if the menu is currently open or closed using
      our isMobileMenuOpen variable.
   2. If closed, add the "active" class to show it and
      update our variable to true.
   3. If open, remove the "active" class to hide it and
      update our variable to false.
   
   LATER BACKEND CONNECTION:
   Purely frontend. No backend needed.
   ------------------------------------------------ */
function toggleMobileMenu() {
    // Toggle the "active" class on the nav menu
    // classList.toggle() automatically adds the class if it's
    // not there, and removes it if it is.
    // This is a cleaner way than checking with if/else.
    navMenu.classList.toggle("active");

    // Update our tracking variable
    // The ! operator means "not" - it flips true to false
    // and false to true
    isMobileMenuOpen = !isMobileMenuOpen;
}

/* ------------------------------------------------
   FUNCTION: closeMobileMenu()
   
   WHAT IT DOES:
   Closes the mobile menu by removing the "active" class.
   
   WHY WE NEED IT:
   - When a user clicks on a nav link, the menu should
     automatically close so they can see the page content.
   - Without this, the menu would stay open and block
     the content.
   
   HOW IT WORKS:
   1. Check if the menu is currently open.
   2. If yes, remove the "active" class and reset the
      tracking variable to false.
   ------------------------------------------------ */
function closeMobileMenu() {
    // Only do something if the menu is currently open
    if (isMobileMenuOpen) {
        // Remove the "active" class to hide the menu
        navMenu.classList.remove("active");
        // Reset the tracking variable to closed
        isMobileMenuOpen = false;
    }
}

/* ------------------------------------------------
   FUNCTION: updateActiveLink()
   
   WHAT IT DOES:
   Highlights the navigation link that corresponds to the
   section currently visible in the viewport.
   
   WHY WE NEED IT:
   - Users need to know "where they are" on the page.
   - The highlighted link acts as a visual indicator,
     like a "You are here" sign.
   - This improves user experience (UX) and makes the
     site feel more professional.
   
   HOW IT WORKS:
   1. We loop through all the sections on the page.
   2. For each section, we check if it's currently visible
      in the viewport using getBoundingClientRect().
   3. getBoundingClientRect() returns an object with the
      element's position relative to the viewport.
   4. If a section's top is near the top of the viewport,
      we consider it the "active" section.
   5. We then find the nav link with the matching href
      and add an "active" class to it.
   
   LATER BACKEND CONNECTION:
   Purely frontend. No backend needed.
   ------------------------------------------------ */
function updateActiveLink() {
    // Loop through every section element on the page
    sections.forEach(function(section) {
        // Get the section's position relative to the viewport
        // getBoundingClientRect() returns top, bottom, left, right, width, height
        // "top" tells us how far the section is from the top of the viewport
        const sectionTop = section.getBoundingClientRect().top;

        // Get the section's ID (like "features", "howitworks", etc.)
        const sectionId = section.getAttribute("id");

        // Check if this section is near the top of the viewport
        // We consider a section "active" when its top is within 150px
        // of the viewport top. This accounts for the fixed nav bar height.
        if (sectionTop <= 150 && sectionTop >= -150) {
            // Update our tracking variable
            currentActiveSection = sectionId;

            // Loop through all nav links
            navLinks.forEach(function(link) {
                // Get the href attribute from the link
                // It looks like "#features" or "#how-it-works"
                const linkHref = link.getAttribute("href");

                // Remove the "active" class from all links first
                // This ensures only one link is highlighted at a time
                link.classList.remove("active-link");

                // Check if this link's href matches the current section
                // The href starts with "#" so we compare with "#sectionId"
                if (linkHref === "#" + sectionId) {
                    // Add the "active" class to highlight this link
                    link.classList.add("active-link");
                }
            });
        }
    });
}

/* ------------------------------------------------
   FUNCTION: createScrollToTopButton()
   
   WHAT IT DOES:
   Creates a button that appears when the user scrolls down
   and scrolls back to the top when clicked.
   
   WHY WE NEED IT:
   - On long pages, scrolling back up manually is annoying.
   - A "scroll to top" button provides a quick shortcut.
   - This is a standard UX pattern on content-heavy pages.
   
   HOW IT WORKS:
   1. Create a <button> element using document.createElement().
   2. Style it with CSS classes so it looks like a floating button.
   3. Add a click event that scrolls smoothly to the top.
   4. Add the button to the page body.
   5. We'll show/hide it later using the scroll event.
   
   LATER BACKEND CONNECTION:
   Purely frontend. No backend needed.
   ------------------------------------------------ */
function createScrollToTopButton() {
    // Step 1: Create the button element
    scrollToTopBtn = document.createElement("button");

    // Step 2: Add class names for styling
    scrollToTopBtn.className = "scroll-to-top";

    // Step 3: Add an accessibility label for screen readers
    scrollToTopBtn.setAttribute("aria-label", "Scroll to top");

    // Step 4: Set the inner HTML content
    // We use the &uarr; HTML entity which renders as an up arrow (↑)
    // Inner HTML can contain HTML, while innerText is plain text only
    scrollToTopBtn.innerHTML = "&uarr;";

    // Step 5: Add a click event listener
    scrollToTopBtn.addEventListener("click", function() {
        // When clicked, scroll to the top of the page smoothly
        // window.scrollTo() scrolls the page to specific coordinates
        // { top: 0, behavior: "smooth" } means:
        //   - top: 0 = scroll all the way to the top
        //   - behavior: "smooth" = animate the scroll (not instant jump)
        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    });

    // Step 6: Add the button to the page
    // document.body.appendChild() adds the button as the last child
    // of the <body> element, so it appears above everything else
    // (assuming the CSS has a high z-index)
    document.body.appendChild(scrollToTopBtn);

    // Step 7: Start with the button hidden
    // By default, it should not be visible until the user scrolls down
    scrollToTopBtn.style.display = "none";
}

/* ------------------------------------------------
   FUNCTION: handleScroll()
   
   WHAT IT DOES:
   Runs every time the user scrolls the page. It:
   1. Updates which nav link is highlighted (active).
   2. Shows or hides the scroll-to-top button.
   
   WHY WE NEED IT:
   - We need to respond to scrolling in real-time so the
     UI always reflects the current page state.
   
   HOW IT WORKS:
   1. Call updateActiveLink() to highlight the correct nav link.
   2. Check if the user has scrolled more than 300px from the top.
   3. If yes, show the scroll-to-top button. If no, hide it.
   ------------------------------------------------ */
function handleScroll() {
    // Update the active navigation link based on scroll position
    updateActiveLink();

    // Check if the user has scrolled down more than 300 pixels
    // window.scrollY gives the number of pixels scrolled vertically
    if (window.scrollY > 300) {
        // Show the scroll-to-top button
        // We use "block" display because buttons are block-level by default
        scrollToTopBtn.style.display = "block";
    } else {
        // Hide the scroll-to-top button
        scrollToTopBtn.style.display = "none";
    }
}

/* ------------------------------------------------
   FUNCTION: animateCounters()
   
   WHAT IT DOES:
   Animates the statistics numbers (10,000+, 5,000+, etc.)
   when they come into view. The numbers count up from zero.
   
   WHY WE NEED IT:
   - Animated counters grab the user's attention.
   - They make statistics feel more dynamic and impressive.
   - This is a common pattern on marketing/sales pages.
   
   HOW IT WORKS:
   1. Check if the stats section is visible in the viewport.
   2. If visible, extract the numeric value from each stat
      (e.g., "10,000+" becomes 10000).
   3. Animate from 0 to the target value over 2 seconds.
   4. Use requestAnimationFrame() for smooth animation.
   
   NOTE: We use parseInt() to convert strings to numbers.
   We remove commas and non-numeric characters first.
   
   LATER BACKEND CONNECTION:
   When connected to a backend, the numbers would come from
   an API response instead of being hardcoded in HTML.
   ------------------------------------------------ */
function animateCounters() {
    // Get the stats container element
    const statsSection = document.querySelector(".stats");

    // If the stats section doesn't exist, do nothing
    // This check prevents errors if the HTML structure changes
    if (!statsSection) return;

    // Get the position of the stats section relative to the viewport
    const statsPosition = statsSection.getBoundingClientRect().top;

    // Get the viewport height
    // window.innerHeight gives the height of the visible part of the page
    const viewportHeight = window.innerHeight;

    // Check if the stats section is visible in the viewport
    // We consider it visible when its top is less than the viewport height
    // (meaning it has scrolled into view or is about to)
    if (statsPosition < viewportHeight - 100) {
        // Loop through each stat number element
        statNumbers.forEach(function(statElement) {
            // Get the text content of the element
            // textContent returns the text inside the element (without HTML tags)
            const text = statElement.textContent;

            // Extract the numeric value from the text
            // We remove commas (",") and plus signs ("+") then convert to number
            // parseInt() takes a string and returns an integer
            // Example: "10,000+" -> remove "," and "+" -> "10000" -> 10000
            const targetValue = parseInt(text.replace(/,/g, "").replace(/\+/g, ""));

            // Check if this stat has already been animated
            // We use a custom property "data-animated" to track this
            if (statElement.getAttribute("data-animated") === "true") {
                return; // Skip if already animated
            }

            // Mark this stat as animated so it only runs once
            statElement.setAttribute("data-animated", "true");

            // Start the counter animation from 0
            let currentValue = 0;

            // Calculate the increment per animation frame
            // We want the animation to complete in about 2 seconds
            // At 60 frames per second, that's 120 frames total
            const increment = targetValue / 120;

            // Use setInterval to update the number every ~16ms (60fps)
            const counterInterval = setInterval(function() {
                // Increase the current value by the increment
                currentValue += increment;

                // Check if we've reached or passed the target
                if (currentValue >= targetValue) {
                    // Set to the exact target value
                    currentValue = targetValue;
                    // Stop the interval from running further
                    clearInterval(counterInterval);
                }

                // Format the number with commas for readability
                // toLocaleString() adds commas: 10000 becomes "10,000"
                const formattedValue = Math.floor(currentValue).toLocaleString();

                // Add back the "+" sign if the original text had one
                if (text.includes("+")) {
                    statElement.textContent = formattedValue + "+";
                } else if (text.includes("%")) {
                    statElement.textContent = formattedValue + "%";
                } else {
                    statElement.textContent = formattedValue;
                }
            }, 16); // 16 milliseconds ≈ 60 frames per second
        });
    }
}

/* ------------------------------------------------
   FUNCTION: animateOnScroll()
   
   WHAT IT DOES:
   Adds the "fade-in-up" animation class to elements when
   they scroll into the viewport.
   
   WHY WE NEED IT:
   - Elements appearing all at once looks boring.
   - "Reveal on scroll" animations feel polished and modern.
   - It guides the user's attention as they scroll.
   
   HOW IT WORKS:
   1. Select all elements with the class "animate-on-scroll".
   2. For each element, check if it's visible in the viewport.
   3. If visible, add a CSS class that triggers the animation.
   4. The CSS handles the actual animation (fade, slide, etc.).
   ------------------------------------------------ */
function animateOnScroll() {
    // Select all elements that should animate when scrolled into view
    // We use querySelectorAll with a class selector
    const animatedElements = document.querySelectorAll(".animate-on-scroll");

    // Loop through each element
    animatedElements.forEach(function(element) {
        // Get the element's position relative to the viewport
        const elementTop = element.getBoundingClientRect().top;

        // Get the viewport height
        const viewportHeight = window.innerHeight;

        // Check if the element is visible in the viewport
        // We add a small offset (50px) so the animation starts slightly
        // before the element fully enters the viewport
        if (elementTop < viewportHeight - 50) {
            // Add the "visible" class to trigger the CSS animation
            // The CSS will handle the actual animation keyframes
            element.classList.add("visible");
        }
    });
}

/* ------------------------------------------------
   FUNCTION: smoothScrollToSection(event)
   
   WHAT IT DOES:
   Handles clicking on internal navigation links (links that
   start with "#") and scrolls smoothly to the target section.
   
   PARAMETER:
   - event: The event object created by the browser when the
     user clicks. It contains information about the click.
   
   WHY WE NEED IT:
   - While CSS can handle smooth scrolling, some older browsers
     don't support it.
   - Using JavaScript ensures cross-browser compatibility.
   - We also need to prevent the default jump behavior and
     close the mobile menu.
   
   HOW IT WORKS:
   1. We use event.preventDefault() to stop the browser from
      doing its default jump-to-anchor behavior.
   2. We find the target section by the href value.
   3. We use scrollIntoView() with smooth behavior to scroll.
   4. We close the mobile menu if it's open.
   ------------------------------------------------ */
function smoothScrollToSection(event) {
    // Get the href attribute of the clicked link
    // For example: "#features" or "#howitworks"
    const targetHref = event.target.getAttribute("href");

    // Check if the link is an internal link (starts with "#")
    // External links (like "Login.html", "Register.html") should
    // work normally and navigate to the other page
    if (targetHref && targetHref.startsWith("#")) {
        // Prevent the default anchor jump behavior
        // Without this, the browser would instantly jump to the section
        event.preventDefault();

        // Find the target section by its ID
        // querySelector("#features") finds the element with id="features"
        const targetSection = document.querySelector(targetHref);

        // Only proceed if the target section exists
        if (targetSection) {
            // Scroll to the target section smoothly
            // scrollIntoView() scrolls the element into the visible area
            // { behavior: "smooth" } makes it animate smoothly
            targetSection.scrollIntoView({
                behavior: "smooth"
            });
        }

        // Close the mobile menu after clicking a link
        closeMobileMenu();
    }
}

/* ============================================================
   SECTION 4: VALIDATION FUNCTIONS
   
   NOTE: There are no forms on the Landing Page that need
   validation (no newsletter form, no FAQ accordion).
   Validation functions will be heavily used on the Login,
   Register, and other pages.
   
   We'll add an empty section here to maintain the consistent
   structure across all pages, and fill it when needed.
   ============================================================ */

// No validation functions needed for the Landing Page.
// When we add features like a newsletter signup form,
// we will add email validation here.

/* ============================================================
   SECTION 5: EVENT LISTENERS
   
   WHAT: We connect the functions to user actions (clicks,
   scrolls, etc.) using event listeners.
   
   WHY:
   - Event listeners are how JavaScript responds to user
     interaction.
   - Without them, the page would be static and lifeless.
   - Each listener waits for a specific event (like "click"
     or "scroll") and runs a function when it happens.
   
   HOW addEventListener WORKS:
   element.addEventListener("eventType", functionName);
   
   - First parameter: The type of event to listen for
     (without the "on" prefix, so "click" not "onclick").
   - Second parameter: The function to run when the event happens.
     We pass the function name WITHOUT parentheses here because
     we want to reference it, not call it immediately.
   ============================================================ */

// ---- Nav Link Click Listeners ----
// We add a click listener to each navigation link
navLinks.forEach(function(link) {
    link.addEventListener("click", smoothScrollToSection);
});

// ---- Window Scroll Listener ----
// We listen for the "scroll" event on the window
// This fires every time the user scrolls, even by one pixel
// We use requestAnimationFrame to improve performance
window.addEventListener("scroll", function() {
    // requestAnimationFrame tells the browser to run our function
    // just before the next screen repaint (usually 60 times per second)
    // This is more efficient than raw scroll events
    requestAnimationFrame(function() {
        handleScroll();
        animateCounters();
        animateOnScroll();
    });
});

// ---- Window Load Listener ----
// We listen for when the page finishes loading
// This ensures all images and resources are loaded before
// we run our initialization code
window.addEventListener("load", function() {
    // Animate counters if they're already visible on page load
    animateCounters();
    // Animate elements that are visible on page load
    animateOnScroll();
    // Set the initial active navigation link
    updateActiveLink();
});

/* ============================================================
   SECTION 6: MAIN LOGIC
   
   WHAT: This is where everything comes together. We call
   functions that set up the page's interactive features.
   
   WHY:
   - We keep this section separate to make the initialization
     process clear.
   - When someone reads the file, they can look at this section
     first to understand what the page does.
   ============================================================ */

/* ------------------------------------------------
   FUNCTION: initLandingPage()
   
   WHAT IT DOES:
   Initializes all the interactive features on the Landing Page.
   This is the "main" function that sets everything up.
   
   WHY WE NEED IT:
   - We want to control the order in which things are set up.
   - Having one init function makes the code more organized.
   - It clearly shows what this page does at a glance.
   
   HOW IT WORKS:
   1. Create the hamburger button for mobile navigation.
   2. Create the scroll-to-top button.
   3. Add the "animate-on-scroll" class to sections.
   4. Update the active nav link based on initial scroll position.
   ------------------------------------------------ */
function initLandingPage() {
    // Step 1: Create the mobile hamburger menu button
    // This adds the button to the navigation bar
    createHamburgerButton();

    // Step 2: Create the scroll-to-top button
    // This adds a floating button to the page
    createScrollToTopButton();

    // Step 3: Add animation classes to sections
    // We want sections to fade in as the user scrolls
    // We add the "animate-on-scroll" class to sections that
    // should animate when they come into the viewport
    
    // Features section
    const featuresSection = document.getElementById("features");
    if (featuresSection) {
        featuresSection.classList.add("animate-on-scroll");
    }

    // How It Works section
    const howItWorksSection = document.getElementById("howitworks");
    if (howItWorksSection) {
        howItWorksSection.classList.add("animate-on-scroll");
    }

    // Testimonials section
    const testimonialsSection = document.getElementById("testimony");
    if (testimonialsSection) {
        testimonialsSection.classList.add("animate-on-scroll");
    }

    // CTA section
    const ctaSection = document.querySelector(".cta");
    if (ctaSection) {
        ctaSection.classList.add("animate-on-scroll");
    }

    // Step 4: Update which navigation link is initially active
    // This runs once immediately after setup
    updateActiveLink();

    // Step 5: Log to console that the page initialized
    // This helps with debugging - we can see if the JS loaded
    console.log("Landing Page initialized successfully!");
    console.log("All features are running on the frontend only.");
    console.log("No backend connection established yet.");
}

// Start the page! 
// When the DOM is fully loaded and ready, we call initLandingPage()
// DOMContentLoaded fires when the HTML is fully parsed (faster than "load")
document.addEventListener("DOMContentLoaded", initLandingPage);