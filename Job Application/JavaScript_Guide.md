# 🎓 JavaScript Guide — Everything You Used in This Project

This guide explains **every JavaScript concept** used in the pages you built, from the simplest to the most advanced. Read it section by section, and test each example in your browser console (press F12 → Console).

---

## Table of Contents

1. [Variables: `const` vs `let`](#1-variables-const-vs-let)
2. [Functions](#2-functions)
3. [Template Literals (Backticks)](#3-template-literals-backticks)
4. [Arrays and Array Methods](#4-arrays-and-array-methods)
5. [Objects](#5-objects)
6. [localStorage — Saving Data](#6-localstorage--saving-data)
7. [DOM Manipulation — Changing the Page](#7-dom-manipulation--changing-the-page)
8. [Event Listeners — Responding to Clicks](#8-event-listeners--responding-to-clicks)
9. [Event Delegation — The Smart Way](#9-event-delegation--the-smart-way)
10. [Callback Functions](#10-callback-functions)
11. [URL Parameters — Passing Data Between Pages](#11-url-parameters--passing-data-between-pages)
12. [setTimeout and setInterval — Timing](#12-settimeout-and-setinterval--timing)
13. [CSS Classes with JavaScript](#13-css-classes-with-javascript)
14. [The `data-` Attribute](#14-the-data--attribute)
15. [The Complete Page Structure Pattern](#15-the-complete-page-structure-pattern)

---

## 1. Variables: `const` vs `let`

**Variables** are containers that store values.

```javascript
// const = value CANNOT be changed (constant)
const userName = "David";
// userName = "John";  // ❌ ERROR! Can't reassign a const

// let = value CAN be changed
let count = 0;
count = 5;  // ✅ OK, we can change it
```

### Where you used it:

```javascript
// saved_jobs.js
const savedGrid = document.getElementById("savedGrid");  // This element will never change
let savedJobIds = JSON.parse(localStorage.getItem("savedJobs")) || [];  // This array WILL change
```

**Rule of thumb:** Use `const` by default. Only use `let` when you know the value will change.

---

## 2. Functions

**Functions** are reusable blocks of code. You define them once, then call them whenever you need.

### Function Declaration (the most common way)

```javascript
function greet(name) {
    return "Hello, " + name + "!";
}

// Call the function
const message = greet("David");
console.log(message);  // Output: "Hello, David!"
```

### Function Expression (stored in a variable)

```javascript
const greet = function(name) {
    return "Hello, " + name + "!";
};
```

### Anonymous Function (no name — used inside other functions)

```javascript
// This function has no name — it's passed directly to addEventListener
button.addEventListener("click", function() {
    console.log("Button was clicked!");
});
```

### Arrow Function (shorter way to write functions)

```javascript
// Regular function
const add = function(a, b) {
    return a + b;
};

// Arrow function (same thing, shorter)
const add = (a, b) => a + b;
```

### Where you used it:

```javascript
// saved_jobs.js — a function that takes a job object and returns HTML
function createSavedCard(job) {
    return `
        <div class="saved-card">
            <h3>${job.title}</h3>
        </div>
    `;
}

// notifications.js — anonymous function inside forEach
tabButtons.forEach(function(btn) {
    btn.addEventListener("click", function() {
        // This is an anonymous function
    });
});
```

---

## 3. Template Literals (Backticks)

**Template literals** let you embed variables directly inside strings using backticks (`` ` ``) and `${}`.

```javascript
// OLD WAY (string concatenation)
const message = "Hello, " + name + "! You have " + count + " messages.";

// NEW WAY (template literal)
const message = `Hello, ${name}! You have ${count} messages.`;
```

### Why they're powerful:

You can write **multi-line HTML** with variables inside:

```javascript
function createCard(job) {
    return `
        <div class="card">
            <h3>${job.title}</h3>
            <p>${job.company}</p>
            <span>${job.salary}</span>
        </div>
    `;
}
```

### Where you used it:

Everywhere! `createSavedCard()`, `createNotificationHTML()`, `createConversationHTML()`, `createMessageHTML()`, `createJobCard()` — all use template literals to build HTML.

---

## 4. Arrays and Array Methods

**Arrays** are ordered lists of values.

```javascript
const fruits = ["apple", "banana", "orange"];
console.log(fruits[0]);  // "apple" (index starts at 0!)
console.log(fruits.length);  // 3
```

### The Array Methods You Used:

### `.map()` — Transform every item

Creates a **new array** by transforming each item.

```javascript
const numbers = [1, 2, 3];
const doubled = numbers.map(function(num) {
    return num * 2;
});
// doubled = [2, 4, 6]
```

**In your code:** Converting job objects into HTML cards:

```javascript
savedGrid.innerHTML = savedJobs.map(function(job) {
    return createSavedCard(job);  // Transform each job into HTML
}).join("");  // Join all HTML strings together
```

### `.filter()` — Keep only matching items

Creates a **new array** with only items that pass a test.

```javascript
const numbers = [1, 2, 3, 4, 5];
const evenNumbers = numbers.filter(function(num) {
    return num % 2 === 0;  // Keep only even numbers
});
// evenNumbers = [2, 4]
```

**In your code:** Getting only saved jobs:

```javascript
function getSavedJobs() {
    return fakeJobs.filter(function(job) {
        return savedJobIds.includes(job.id);  // Keep jobs whose ID is saved
    });
}
```

### `.find()` — Find the first matching item

Returns the **first item** that matches, or `undefined`.

```javascript
const users = [
    { id: 1, name: "David" },
    { id: 2, name: "Sarah" }
];
const david = users.find(function(user) {
    return user.id === 1;
});
// david = { id: 1, name: "David" }
```

**In your code:** Finding a conversation by ID:

```javascript
const conv = conversations.find(function(c) {
    return c.id === convId;
});
```

### `.includes()` — Check if an item exists

Returns `true` or `false`.

```javascript
const fruits = ["apple", "banana"];
console.log(fruits.includes("apple"));  // true
console.log(fruits.includes("grape"));  // false
```

**In your code:** Checking if a job ID is in the saved list:

```javascript
return savedJobIds.includes(job.id);
```

### `.indexOf()` — Find the position of an item

Returns the **index** (position) or `-1` if not found.

```javascript
const fruits = ["apple", "banana", "orange"];
console.log(fruits.indexOf("banana"));  // 1
console.log(fruits.indexOf("grape"));   // -1 (not found)
```

**In your code:** Finding where to remove a job:

```javascript
const index = savedJobIds.indexOf(jobId);
if (index !== -1) {  // If found
    savedJobIds.splice(index, 1);  // Remove it
}
```

### `.splice()` — Remove items from an array

```javascript
const fruits = ["apple", "banana", "orange"];
fruits.splice(1, 1);  // Start at index 1, remove 1 item
// fruits = ["apple", "orange"]
```

### `.sort()` — Sort items

Takes a **comparison function** that returns:
- **Negative** if `a` should come before `b`
- **Positive** if `b` should come before `a`
- **Zero** if they're equal

```javascript
// Sort numbers ascending
numbers.sort(function(a, b) {
    return a - b;
});

// Sort strings alphabetically
names.sort(function(a, b) {
    return a.localeCompare(b);
});

// Sort by salary (high to low)
jobs.sort(function(a, b) {
    const salaryA = parseInt(a.salary.replace(/[^0-9]/g, ""));
    const salaryB = parseInt(b.salary.replace(/[^0-9]/g, ""));
    return salaryB - salaryA;  // High to low
});
```

### `.reduce()` — Combine all items into one value

```javascript
const numbers = [1, 2, 3, 4];
const total = numbers.reduce(function(sum, num) {
    return sum + num;
}, 0);  // Start with 0
// total = 10
```

**In your code:** Counting unread notifications:

```javascript
function countUnread() {
    return notifications.reduce(function(count, notif) {
        return notif.read ? count : count + 1;  // If not read, add 1
    }, 0);  // Start count at 0
}
```

### `.some()` — Check if ANY item matches

Returns `true` if at least one item passes the test.

```javascript
const numbers = [1, 2, 3];
console.log(numbers.some(function(n) { return n > 2; }));  // true (3 is > 2)
```

**In your code:** Checking if a job was already applied:

```javascript
const alreadyApplied = appliedJobs.some(function(app) {
    return app.id === job.id;
});
```

### `.unshift()` — Add to the beginning

```javascript
const fruits = ["banana"];
fruits.unshift("apple");
// fruits = ["apple", "banana"]
```

**In your code:** Adding recent searches to the front:

```javascript
recentSearches.unshift(term);
```

### `.slice()` — Get a portion of an array

```javascript
const fruits = ["apple", "banana", "orange", "grape"];
const firstTwo = fruits.slice(0, 2);
// firstTwo = ["apple", "banana"]
```

**In your code:** Keeping only the last 5 recent searches:

```javascript
if (recentSearches.length > 5) {
    recentSearches = recentSearches.slice(0, 5);
}
```

### `.join()` — Combine array items into a string

```javascript
const words = ["Hello", "World"];
console.log(words.join(" "));  // "Hello World"
```

**In your code:** Joining HTML strings:

```javascript
savedGrid.innerHTML = savedJobs.map(function(job) {
    return createSavedCard(job);
}).join("");  // Join with no separator
```

---

## 5. Objects

**Objects** store data as key-value pairs.

```javascript
const job = {
    id: 1,
    title: "Frontend Developer",
    company: "Facebook",
    salary: "$80k - $120k",
    tags: ["React", "TypeScript"]
};

// Access values
console.log(job.title);    // "Frontend Developer"
console.log(job["title"]); // Same thing
console.log(job.tags[0]);  // "React" (tags is an array inside the object)
```

### Nested Objects (objects inside objects)

```javascript
const conversation = {
    id: 1,
    name: "Facebook Recruiter",
    online: true,
    messages: [
        { text: "Hi!", sentByMe: false, time: "10:30 AM" },
        { text: "Hello!", sentByMe: true, time: "10:31 AM" }
    ]
};

// Access nested data
console.log(conversation.messages[0].text);  // "Hi!"
console.log(conversation.messages[1].sentByMe);  // true
```

### Where you used it:

Everywhere! The `fakeJobs` array is an array of objects. The `conversations` array is an array of objects that contain `messages` arrays of objects.

---

## 6. localStorage — Saving Data

**localStorage** lets you save data in the browser that persists even after you close the page.

### The 4 Methods:

```javascript
// 1. SAVE data (must convert to string with JSON.stringify)
localStorage.setItem("key", JSON.stringify(data));

// 2. READ data (must convert back with JSON.parse)
const data = JSON.parse(localStorage.getItem("key"));

// 3. REMOVE data
localStorage.removeItem("key");

// 4. CLEAR everything
localStorage.clear();
```

### Why JSON.stringify and JSON.parse?

localStorage can only store **strings**. But we want to store **arrays and objects**.

```javascript
// This won't work properly:
localStorage.setItem("savedJobs", [1, 2, 3]);  // Saves as "1,2,3" (a string!)

// This works:
localStorage.setItem("savedJobs", JSON.stringify([1, 2, 3]));  // Saves as "[1,2,3]"

// To read it back:
const savedJobs = JSON.parse(localStorage.getItem("savedJobs"));  // Back to [1, 2, 3]
```

### The `|| []` pattern (fallback)

```javascript
// If nothing is saved, getItem returns null
// null || [] → [] (empty array)
let savedJobIds = JSON.parse(localStorage.getItem("savedJobs")) || [];
```

This means: "If there's saved data, use it. If not, use an empty array."

### Where you used it:

| Key | What it stores | Page |
|-----|---------------|------|
| `savedJobs` | Array of job IDs `[1, 3, 7]` | Saved Jobs |
| `notifications` | Array of notification objects | Notifications |
| `conversations` | Array of conversation objects with messages | Messages |
| `recentSearches` | Array of search terms | Search Results |
| `appliedJobs` | Array of application objects | Application Success |
| `userSettings` | Object with dark mode, language, prefs | Settings |
| `loggedInUser` | The logged-in user object | All pages |

---

## 7. DOM Manipulation — Changing the Page

**DOM** (Document Object Model) is how JavaScript sees your HTML. You can find, change, add, and remove elements.

### Finding Elements:

```javascript
// By ID (returns ONE element)
const grid = document.getElementById("savedGrid");

// By class (returns a LIST of elements)
const buttons = document.querySelectorAll(".btn");

// By CSS selector (returns the FIRST match)
const firstButton = document.querySelector(".btn");
```

### Changing Content:

```javascript
// innerHTML — sets HTML content (can include tags)
element.innerHTML = "<h3>Hello</h3>";

// textContent — sets plain text (safer, no HTML parsing)
element.textContent = "Hello";
```

### ⚠️ Security: textContent vs innerHTML

```javascript
// DANGEROUS: If user input contains HTML, it will execute!
element.innerHTML = userInput;  // ❌ XSS vulnerability!

// SAFE: Shows the text as-is
element.textContent = userInput;  // ✅
```

**In your code:** We use `textContent` for user-generated content (like chat messages) and `innerHTML` for our own generated HTML.

### Changing Styles:

```javascript
element.style.display = "none";     // Hide
element.style.display = "grid";     // Show as grid
element.style.display = "block";    // Show as block
```

### Creating Elements:

```javascript
// Create a new element
const toast = document.createElement("div");

// Add a class
toast.className = "toast success";

// Add content
toast.innerHTML = "Settings saved!";

// Add to the page
document.body.appendChild(toast);

// Remove from the page
toast.remove();
```

### Where you used it:

- `savedGrid.innerHTML = ...` — rendering job cards
- `emptyState.style.display = "block"` — showing/hiding empty state
- `document.createElement("div")` — creating toast notifications
- `document.body.appendChild(toast)` — adding toast to the page

---

## 8. Event Listeners — Responding to Clicks

**Event listeners** let your page respond to user actions (clicks, typing, etc.).

```javascript
// Click
button.addEventListener("click", function() {
    console.log("Clicked!");
});

// Typing (fires on every keystroke)
input.addEventListener("input", function() {
    console.log("User typed:", input.value);
});

// Pressing a key
input.addEventListener("keypress", function(event) {
    if (event.key === "Enter") {
        console.log("Enter was pressed!");
    }
});

// Dropdown change
select.addEventListener("change", function() {
    console.log("Selection changed:", select.value);
});
```

### The `event` object

The event listener automatically receives an `event` object with information about what happened.

```javascript
button.addEventListener("click", function(event) {
    event.preventDefault();  // Stop default behavior (like navigation)
    console.log(event.target);  // The element that was clicked
});
```

### Where you used it:

```javascript
// saved_jobs.js
searchInput.addEventListener("input", handleSearch);  // Search as you type
sortSelect.addEventListener("change", handleSort);    // Sort when dropdown changes

// messages.js
messageInput.addEventListener("keypress", function(event) {
    if (event.key === "Enter") {
        sendMessage();  // Send on Enter key
    }
});
```

---

## 9. Event Delegation — The Smart Way

**Event delegation** is when you put ONE listener on a parent element instead of many listeners on child elements.

### The Problem:

```javascript
// ❌ BAD: These buttons are created dynamically by JavaScript
// They don't exist when the page loads, so this won't work:
document.querySelectorAll(".remove-btn").forEach(function(btn) {
    btn.addEventListener("click", function() {
        // This never runs for dynamically created buttons!
    });
});
```

### The Solution:

```javascript
// ✅ GOOD: Listen on the parent (which always exists)
savedGrid.addEventListener("click", function(event) {
    // Check if the click came from a remove button
    const removeBtn = event.target.closest(".remove-btn");
    if (removeBtn) {
        const jobId = parseInt(removeBtn.dataset.id);
        removeSavedJob(jobId);
    }
});
```

### How `event.target.closest()` works:

```javascript
// event.target = the exact element that was clicked
// .closest(".remove-btn") = walk UP from the clicked element
//   until you find an element with class "remove-btn"
// Returns null if no match found
```

### Why it's better:

1. **Works for dynamically created elements** — the parent always exists
2. **One listener instead of many** — better performance
3. **Simpler code** — no need to re-attach listeners after re-rendering

### Where you used it:

- `savedGrid` → remove buttons
- `notifList` → mark-read and delete buttons
- `conversationItems` → selecting conversations
- `jobGrid` → clicking job cards
- `.search-chips` → clicking search chips

---

## 10. Callback Functions

**Callbacks** are functions passed as arguments to other functions. The other function calls them back later.

```javascript
// A function that takes a callback
function processData(data, callback) {
    // Do something with data
    const result = data * 2;
    // Call the callback with the result
    callback(result);
}

// Using it
processData(5, function(result) {
    console.log("The result is:", result);  // "The result is: 10"
});
```

### You've been using callbacks all along!

```javascript
// addEventListener takes a callback:
button.addEventListener("click", function() {
    // This function is called back when the button is clicked
});

// forEach takes a callback:
array.forEach(function(item) {
    // This function is called back for each item
});

// map takes a callback:
array.map(function(item) {
    // This function is called back for each item
});
```

### Callbacks in your components:

```javascript
// confirm.js — confirmAction takes a callback
confirmAction("Are you sure?", function() {
    // This runs only if the user clicks "Confirm"
    deleteJob();
});

// pagination.js — onPageChange is a callback
renderPagination(container, 25, 6, 1, function(page) {
    // This runs when the user clicks a page number
    currentPage = page;
    renderJobs();
});

// search.js — onSearch is a callback
createSearchBar(container, {
    placeholder: "Search jobs...",
    onSearch: function(term) {
        // This runs when the user searches
        performSearch(term);
    }
});
```

---

## 11. URL Parameters — Passing Data Between Pages

**URL parameters** let you pass data from one page to another through the URL.

### The URL structure:

```
JobDetailsPage.html?id=3&source=saved
                    ^^^^ ^^^^
                    key  value
```

### Reading URL parameters:

```javascript
// Get the query string from the URL
const urlParams = new URLSearchParams(window.location.search);

// Get a specific parameter
const jobId = urlParams.get("id");  // "3"
const source = urlParams.get("source");  // "saved"
```

### Creating links with parameters:

```javascript
// In HTML:
<a href="JobDetailsPage.html?id=3">View Job</a>

// In JavaScript (template literal):
`<a href="JobDetailsPage.html?id=${job.id}">View Job</a>`
```

### Where you used it:

```javascript
// application_success.js — reading which job was applied to
const urlParams = new URLSearchParams(window.location.search);
const jobId = parseInt(urlParams.get("id"));

// search_results.js — reading a search query from the URL
const queryParam = urlParams.get("q");
if (queryParam) {
    searchInput.value = queryParam;
}
```

---

## 12. setTimeout and setInterval — Timing

### `setTimeout()` — Run once after a delay

```javascript
// Run this function after 3 seconds (3000ms)
setTimeout(function() {
    console.log("3 seconds have passed!");
}, 3000);
```

**In your code:** Auto-dismissing toasts:

```javascript
setTimeout(function() {
    toast.classList.add("fade-out");  // Start fade animation
    setTimeout(function() {
        toast.remove();  // Remove from DOM after animation
    }, 300);
}, 3000);
```

**In your code:** Simulating a loading delay:

```javascript
setTimeout(function() {
    renderJobSummary(job);  // Show the job summary after 800ms
    saveApplication(job);
}, 800);
```

### `setInterval()` — Run repeatedly

```javascript
// Run every 1 second (1000ms)
const interval = setInterval(function() {
    console.log("Tick!");
}, 1000);

// Stop it
clearInterval(interval);
```

**In your code:** The dashboard counters (in `dashboard.js`):

```javascript
const counterInterval = setInterval(function() {
    current += increment;
    if (current >= target) {
        current = target;
        clearInterval(counterInterval);  // Stop when done
    }
    stat.textContent = Math.floor(current);
}, 16);
```

---

## 13. CSS Classes with JavaScript

You can add, remove, and toggle CSS classes on elements.

```javascript
// Add a class
element.classList.add("active");

// Remove a class
element.classList.remove("active");

// Toggle (add if not there, remove if there)
element.classList.toggle("dark-mode");

// Check if it has a class
element.classList.contains("active");  // true or false
```

### Where you used it:

```javascript
// settings.js — dark mode
function applyDarkMode(enabled) {
    document.body.classList.toggle("dark-mode", enabled);
}

// notifications.js — active tab
btn.classList.add("active");
btn.classList.remove("active");

// messages.js — online status
chatStatus.className = "online-status" + (conv.online ? " online" : "");
```

---

## 14. The `data-` Attribute

**`data-` attributes** let you store custom data on HTML elements.

```html
<!-- In HTML -->
<button class="remove-btn" data-id="3">Remove</button>
```

```javascript
// In JavaScript — read the data
const jobId = parseInt(button.dataset.id);  // 3
```

### Why use them?

When you have many similar elements (like job cards), you need to know **which one** was clicked. The `data-id` tells you.

### Where you used it:

```javascript
// saved_jobs.js — each card has its job ID
`<div class="saved-card" data-id="${job.id}">`

// Reading it when clicked
const jobId = parseInt(removeBtn.dataset.id);

// notifications.js — each notification has its ID
`<button class="delete-btn" data-id="${notif.id}">`

// messages.js — each conversation has its ID
`<div class="conversation-item" data-id="${conv.id}">`
```

---

## 15. The Complete Page Structure Pattern

Every page you built follows the **same pattern**. This is the standard structure for vanilla JavaScript pages:

```javascript
/* ============================================================
   PAGE NAME - JavaScript
   ============================================================ */

/* SECTION 1: CACHE DOM ELEMENTS */
// Grab all the elements you'll need, ONCE, at the top
const grid = document.getElementById("grid");
const searchInput = document.getElementById("searchInput");

/* SECTION 2: VARIABLES */
// Data and state
const fakeData = [ ... ];  // Static data
let state = [];            // Mutable state
let currentFilter = "all"; // Current UI state

/* SECTION 3: HELPER FUNCTIONS */
// Small functions that do one thing
function createCard(item) { ... }      // Build HTML
function renderItems() { ... }         // Update the page
function handleSearch() { ... }        // Filter data
function handleSort() { ... }          // Sort data
function removeItem(id) { ... }        // Delete data

/* SECTION 4: EVENT LISTENERS */
// Wire up user interactions
searchInput.addEventListener("input", handleSearch);
grid.addEventListener("click", function(event) { ... });

/* SECTION 5: MAIN LOGIC */
// Initialize the page
function initPage() {
    // Check auth
    const user = localStorage.getItem("loggedInUser");
    if (!user) {
        window.location.href = "Login.html";
        return;
    }
    // Render initial state
    renderItems();
}

// Start when DOM is ready
document.addEventListener("DOMContentLoaded", initPage);
```

### Why this pattern?

1. **Readable** — anyone can understand the structure
2. **Maintainable** — easy to find and fix bugs
3. **Consistent** — every page follows the same structure
4. **Scalable** — easy to add new features

---

## 🎯 Practice Exercises

Test your understanding with these:

### Exercise 1: Array Methods
```javascript
// Given this array:
const jobs = [
    { title: "Frontend", salary: 80000, location: "Remote" },
    { title: "Backend", salary: 120000, location: "NYC" },
    { title: "Designer", salary: 90000, location: "Remote" }
];

// 1. Use .filter() to get only Remote jobs
// 2. Use .map() to get an array of just titles
// 3. Use .find() to get the Backend job
// 4. Use .sort() to sort by salary (high to low)
```

### Exercise 2: localStorage
```javascript
// 1. Save an array of 3 job IDs to localStorage
// 2. Read it back and log it
// 3. Add a 4th ID and save again
// 4. Remove the 2nd ID and save again
```

### Exercise 3: Event Delegation
```javascript
// Create a div with 3 buttons inside (dynamically)
// Add ONE click listener on the div
// When clicked, log which button was clicked (using data-id)
```

### Exercise 4: Template Literals
```javascript
// Create a function that takes a job object
// and returns HTML for a job card
// Include: title, company, salary, location
```

### Exercise 5: Callbacks
```javascript
// Write a function called "processJob" that:
// 1. Takes a job object and a callback
// 2. Adds a "processed: true" property to the job
// 3. Calls the callback with the processed job
```

---

## 📚 Summary Cheat Sheet

| Concept | What it does | Example |
|---------|-------------|---------|
| `const` | Variable that can't change | `const grid = ...` |
| `let` | Variable that can change | `let count = 0` |
| `function` | Reusable code block | `function greet() {}` |
| `` ` `` | Template literal (embed variables) | `` `Hello ${name}` `` |
| `.map()` | Transform each item | `arr.map(x => x * 2)` |
| `.filter()` | Keep matching items | `arr.filter(x => x > 5)` |
| `.find()` | Find first match | `arr.find(x => x.id === 3)` |
| `.includes()` | Check if exists | `arr.includes(3)` |
| `.indexOf()` | Find position | `arr.indexOf(3)` |
| `.splice()` | Remove items | `arr.splice(1, 1)` |
| `.sort()` | Sort items | `arr.sort((a, b) => a - b)` |
| `.reduce()` | Combine to one value | `arr.reduce((sum, x) => sum + x, 0)` |
| `.some()` | Any match? | `arr.some(x => x > 5)` |
| `.unshift()` | Add to front | `arr.unshift(0)` |
| `.slice()` | Get portion | `arr.slice(0, 2)` |
| `.join()` | Combine to string | `arr.join(", ")` |
| `localStorage.setItem()` | Save data | `localStorage.setItem("k", JSON.stringify(v))` |
| `localStorage.getItem()` | Read data | `JSON.parse(localStorage.getItem("k"))` |
| `getElementById()` | Find by ID | `document.getElementById("grid")` |
| `querySelectorAll()` | Find by selector | `document.querySelectorAll(".btn")` |
| `innerHTML` | Set HTML content | `el.innerHTML = "<p>Hi</p>"` |
| `textContent` | Set text content | `el.textContent = "Hi"` |
| `addEventListener()` | Respond to events | `btn.addEventListener("click", fn)` |
| `event.target.closest()` | Find parent element | `event.target.closest(".btn")` |
| `classList.add()` | Add CSS class | `el.classList.add("active")` |
| `classList.toggle()` | Toggle CSS class | `el.classList.toggle("dark")` |
| `URLSearchParams` | Read URL params | `new URLSearchParams(url).get("id")` |
| `setTimeout()` | Run once after delay | `setTimeout(fn, 3000)` |
| `setInterval()` | Run repeatedly | `setInterval(fn, 1000)` |
| `data-` attribute | Store data on elements | `data-id="3"` → `el.dataset.id` |
| `document.createElement()` | Create element | `document.createElement("div")` |
| `appendChild()` | Add to page | `document.body.appendChild(el)` |
| `JSON.stringify()` | Convert to string | `JSON.stringify([1, 2])` |
| `JSON.parse()` | Convert from string | `JSON.parse("[1, 2]")` |

---

**Now go back and re-read the JavaScript files with this guide!** Every line should make sense now. If something still confuses you, try the practice exercises — they'll help solidify the concepts.