# 🎨 HTML & CSS Guide — How Your Website Works Together

This guide explains **every HTML and CSS concept** used in your project, and how HTML, CSS, and JavaScript work together to create a complete website. Read it section by section, and open the actual files to see each concept in action.

---

## Table of Contents

1. [The Big Picture: How HTML, CSS & JS Work Together](#1-the-big-picture-how-html-css--js-work-together)
2. [HTML Basics — The Skeleton](#2-html-basics--the-skeleton)
3. [The HTML Structure of Every Page](#3-the-html-structure-of-every-page)
4. [CSS Basics — The Skin](#4-css-basics--the-skin)
5. [The Design System — Your Color Palette](#5-the-design-system--your-color-palette)
6. [CSS Selectors — How You Target Elements](#6-css-selectors--how-you-target-elements)
7. [The Box Model — How Elements Take Up Space](#7-the-box-model--how-elements-take-up-space)
8. [Flexbox — Laying Out Elements in a Row](#8-flexbox--laying-out-elements-in-a-row)
9. [CSS Grid — Laying Out Elements in a Grid](#9-css-grid--laying-out-elements-in-a-grid)
10. [Positioning — Fixed, Absolute, Relative](#10-positioning--fixed-absolute-relative)
11. [The Glassmorphism Effect — Your Card Style](#11-the-glassmorphism-effect--your-card-style)
12. [Animations & Transitions — Making Things Move](#12-animations--transitions--making-things-move)
13. [Responsive Design — Making It Work on Phones](#13-responsive-design--making-it-work-on-phones)
14. [Pseudo-classes & Pseudo-elements](#14-pseudo-classes--pseudo-elements)
15. [CSS Variables — The Dark Mode Secret](#15-css-variables--the-dark-mode-secret)
16. [How HTML, CSS & JS Connect — The Complete Flow](#16-how-html-css--js-connect--the-complete-flow)
17. [The Frontend Integration Lead Checklist](#17-the-frontend-integration-lead-checklist)

---

## 1. The Big Picture: How HTML, CSS & JS Work Together

Think of a website like a **house**:

| Layer | What it is | House Analogy |
|-------|-----------|---------------|
| **HTML** | The structure and content | The **foundation, walls, rooms** — what exists |
| **CSS** | The styling and appearance | The **paint, furniture, decorations** — how it looks |
| **JavaScript** | The behavior and interactivity | The **electricity, plumbing** — what it does |

### How they connect:

```html
<!-- 1. HTML defines the structure -->
<button class="remove-btn" data-id="3">Remove</button>
```

```css
/* 2. CSS styles it */
.remove-btn {
    background: rgba(244, 67, 54, 0.25);
    color: #e57373;
    border-radius: 50px;
    padding: 10px 15px;
}
```

```javascript
// 3. JavaScript makes it interactive
savedGrid.addEventListener("click", function(event) {
    const removeBtn = event.target.closest(".remove-btn");
    if (removeBtn) {
        removeSavedJob(parseInt(removeBtn.dataset.id));
    }
});
```

### The connection points:

| HTML provides | CSS uses it to | JavaScript uses it to |
|---------------|----------------|----------------------|
| `class="remove-btn"` | Style the button | Find and interact with it |
| `id="savedGrid"` | Style a specific element | `getElementById("savedGrid")` |
| `data-id="3"` | — (invisible to CSS) | Know which job to remove |
| `<div>` container | Layout the page | Inject content with `innerHTML` |

### The flow of a page load:

```
1. Browser reads the HTML → builds the structure
2. Browser reads the CSS → applies the styling
3. Browser reads the JavaScript → runs the code
4. JavaScript finds elements (by id/class) → changes them
5. User clicks something → JavaScript responds → updates HTML/CSS
```

---

## 2. HTML Basics — The Skeleton

**HTML** (HyperText Markup Language) uses **tags** to define elements.

### The basic structure of every HTML file:

```html
<!DOCTYPE html>                    <!-- Tells browser: "This is HTML5" -->
<html lang="en">                   <!-- Root element, language is English -->
<head>                             <!-- Meta information (not visible) -->
    <meta charset="UTF-8">         <!-- Character encoding (supports emojis) -->
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                                   <!-- Makes it responsive on mobile -->
    <title>Page Title</title>      <!-- Shows in the browser tab -->
    <link rel="stylesheet" href="styles.css">
                                   <!-- Links the CSS file -->
</head>
<body>                             <!-- Visible content -->
    <!-- Everything the user sees goes here -->
    <script src="script.js"></script>
                                   <!-- Links the JavaScript file -->
</body>
</html>
```

### Common HTML tags you used:

| Tag | What it does | Example |
|-----|-------------|---------|
| `<div>` | A generic container (block) | `<div class="card">` |
| `<span>` | A generic container (inline) | `<span class="badge">Full Time</span>` |
| `<section>` | A section of the page | `<section id="saved-jobs">` |
| `<nav>` | Navigation bar | `<nav>...</nav>` |
| `<footer>` | Bottom of the page | `<footer>...</footer>` |
| `<h1>`-`<h6>` | Headings (h1 is biggest) | `<h2>Saved Jobs</h2>` |
| `<p>` | Paragraph of text | `<p>Jobs you've bookmarked.</p>` |
| `<a>` | Link | `<a href="DashboardPage.html">Dashboard</a>` |
| `<button>` | Clickable button | `<button class="remove-btn">Remove</button>` |
| `<input>` | Text field | `<input type="text" placeholder="Search...">` |
| `<select>` | Dropdown | `<select><option>All</option></select>` |
| `<label>` | Label for an input | `<label for="searchInput">Search</label>` |
| `<ul>` / `<li>` | Unordered list / list item | `<ul><li>Item</li></ul>` |
| `<img>` | Image | `<img src="logo.png" alt="Logo">` |
| `<br>` | Line break | `Line 1<br>Line 2` |

### Attributes — Extra information on tags:

```html
<!-- class: for CSS styling (can have multiple) -->
<div class="card saved-card active">

<!-- id: for JavaScript (must be unique) -->
<div id="savedGrid">

<!-- href: where a link goes -->
<a href="DashboardPage.html">

<!-- src: where an image/script comes from -->
<script src="saved_jobs.js">

<!-- placeholder: hint text in an input -->
<input type="text" placeholder="Search jobs...">

<!-- data-*: custom data for JavaScript -->
<button data-id="3">

<!-- style: inline CSS (avoid this, use classes) -->
<div style="display: none;">
```

### Where you used it:

```html
<!-- SavedJobsPage.html — the main section -->
<section id="saved-jobs">
    <div class="saved-header">
        <h2>Saved Jobs <span class="glyphicon glyphicon-heart"></span></h2>
        <p>Jobs you've bookmarked for later.</p>
    </div>

    <div class="saved-controls">
        <div class="search-bar">
            <span class="glyphicon glyphicon-search search-icon"></span>
            <input type="text" id="searchInput" placeholder="Search saved jobs..." />
        </div>
        <select id="sortSelect" title="sortSelect">
            <option value="recent">Most Recent</option>
            <option value="company">Company A-Z</option>
            <option value="salary">Salary: High to Low</option>
        </select>
    </div>

    <!-- JavaScript fills this empty container -->
    <div class="saved-grid" id="savedGrid"></div>

    <!-- Hidden by default, shown by JavaScript -->
    <div class="empty-state" id="emptyState" style="display: none;">
        <h3>No saved jobs yet</h3>
        <a href="JobsListingPage.html" class="browse-btn">Browse Jobs</a>
    </div>
</section>
```

---

## 3. The HTML Structure of Every Page

Every page in your project follows the **same structure**:

```html
<body>
    <!-- 1. Back arrow (fixed position, top-left) -->
    <a href="DashboardPage.html" class="back-arrow">
        <i class="glyphicon glyphicon-arrow-left"></i>
    </a>

    <!-- 2. Navigation bar (fixed position, top) -->
    <nav>
        <p class="logo">JobPortal</p>
        <ul>
            <li><a href="..." class="nav-link">Page</a></li>
            <li><a href="..." class="nav-btn">Sign Out</a></li>
        </ul>
    </nav>

    <!-- 3. Main content (unique to each page) -->
    <section id="page-name">
        <div class="page-header">
            <h2>Page Title</h2>
            <p>Page description</p>
        </div>
        <!-- Page-specific content -->
    </section>

    <!-- 4. Footer (bottom of page) -->
    <footer>
        <div class="footgrid">
            <div class="col">...</div>
            <div class="col">...</div>
            <div class="col">...</div>
            <div class="col">...</div>
        </div>
        <div class="bottom">&copy; 2026 JobPortal</div>
    </footer>

    <!-- 5. JavaScript (at the bottom, so HTML loads first) -->
    <script src="page_script.js"></script>
</body>
```

### Why this structure?

1. **Consistency** — users know where to find things on every page
2. **Reusability** — the nav and footer are the same everywhere
3. **Performance** — scripts at the bottom load after the HTML is ready
4. **Maintainability** — easy to update the nav once and it's everywhere

---

## 4. CSS Basics — The Skin

**CSS** (Cascading Style Sheets) styles your HTML. The name "Cascading" means styles flow from top to bottom, and more specific rules override general ones.

### The basic syntax:

```css
selector {
    property: value;
    property: value;
}
```

```css
/* Example: style all elements with class "card" */
.card {
    background: rgba(255, 255, 255, 0.1);
    border: 1px solid rgba(255, 255, 255, 0.2);
    border-radius: 15px;
    padding: 22px;
}
```

### How CSS connects to HTML:

```html
<!-- HTML: class="card" -->
<div class="card">...</div>
```

```css
/* CSS: .card targets it */
.card {
    background: rgba(255, 255, 255, 0.1);
}
```

### The 3 ways to add CSS:

```html
<!-- 1. External file (BEST — used in your project) -->
<link rel="stylesheet" href="saved_jobs.css">

<!-- 2. Internal (in the HTML file) -->
<style>
    .card { background: red; }
</style>

<!-- 3. Inline (on the element — avoid) -->
<div style="background: red;">...</div>
```

### Common CSS properties you used:

| Property | What it does | Example |
|----------|-------------|---------|
| `background` | Background color/image | `background: rgba(255,255,255,0.1)` |
| `color` | Text color | `color: #fff` |
| `font-size` | Text size | `font-size: 14px` |
| `font-weight` | Text thickness | `font-weight: 700` |
| `padding` | Space INSIDE the element | `padding: 22px` |
| `margin` | Space OUTSIDE the element | `margin: 0 auto` |
| `border` | Outline | `border: 1px solid rgba(255,255,255,0.2)` |
| `border-radius` | Rounded corners | `border-radius: 15px` |
| `display` | How it's shown | `display: flex` / `display: none` |
| `width` / `height` | Size | `width: 50px` |
| `max-width` | Maximum width | `max-width: 1200px` |
| `gap` | Space between flex/grid items | `gap: 20px` |
| `cursor` | Mouse cursor style | `cursor: pointer` |
| `transition` | Smooth changes | `transition: all 0.3s ease` |
| `opacity` | Transparency (0-1) | `opacity: 0.7` |
| `z-index` | Stacking order | `z-index: 999` |
| `position` | Positioning method | `position: fixed` |
| `overflow` | What happens when content overflows | `overflow-y: auto` |
| `text-align` | Text alignment | `text-align: center` |
| `line-height` | Line spacing | `line-height: 1.6` |
| `box-shadow` | Shadow effect | `box-shadow: 0 4px 10px rgba(0,0,0,0.3)` |
| `flex` | Flexbox sizing | `flex: 1` |
| `grid-template-columns` | Grid column layout | `grid-template-columns: repeat(auto-fit, minmax(320px, 1fr))` |

---

## 5. The Design System — Your Color Palette

Your project uses a **consistent design system**. This is what makes all pages look like they belong together.

### The Colors:

| Color | Hex | Where it's used |
|-------|-----|-----------------|
| **Primary Green** | `#2e7d32` | Main brand color, buttons, nav |
| **Darker Green** | `#1b5e20` | Hover states |
| **Light Green** | `#66bb6a` | Gradient middle |
| **Pale Green** | `#a5d6a7` | Gradient end |
| **White** | `#fff` | Text, primary buttons |
| **Success Green** | `#81c784` | Accepted, online, checkmarks |
| **Info Blue** | `#64b5f6` | Links, unread indicators |
| **Warning Orange** | `#ffb74d` | Pending, alerts |
| **Danger Red** | `#e57373` | Rejected, delete, hearts |
| **Purple** | `#ce93d8` | Profile, settings |

### The Gradient Background:

```css
body {
    background: linear-gradient(135deg, #2e7d32 0%, #66bb6a 50%, #a5d6a7 100%);
}
```

This creates a smooth transition from green (top-left) to pale blue (bottom-right).

### The Glassmorphism Card:

```css
.card {
    background: rgba(255, 255, 255, 0.1);   /* Semi-transparent white */
    border: 1px solid rgba(255, 255, 255, 0.2);  /* Subtle border */
    border-radius: 15px;                     /* Rounded corners */
    backdrop-filter: blur(10px);             /* Frosted glass effect */
}
```

### The Pill Button:

```css
.btn {
    border-radius: 50px;   /* Fully rounded = pill shape */
    padding: 10px 25px;    /* Comfortable click area */
    font-weight: 600;      /* Semi-bold text */
}
```

### The Spacing Scale:

| Size | Used for |
|------|----------|
| `5px` | Small gaps between icons and text |
| `10px` | Button padding, small gaps |
| `15px` | Card padding, gaps between items |
| `20px` | Section gaps, grid gaps |
| `22px` | Card inner padding |
| `25px` | Large gaps, footer padding |
| `30px` | Header margins |
| `40px` | Bottom padding of main sections |
| `100px` | Top padding (to clear fixed nav) |

---

## 6. CSS Selectors — How You Target Elements

### Type Selector (targets by tag name):

```css
/* All <nav> elements */
nav { ... }

/* All <footer> elements */
footer { ... }
```

### Class Selector (targets by class — most common):

```css
/* All elements with class="card" */
.card { ... }

/* Elements with BOTH "card" and "active" */
.card.active { ... }
```

### ID Selector (targets by id — must be unique):

```css
/* The element with id="savedGrid" */
#savedGrid { ... }
```

### Descendant Selector (targets elements INSIDE another):

```css
/* All <h3> inside .saved-card */
.saved-card h3 { ... }

/* All <a> inside nav */
nav a { ... }
```

### Child Selector (direct children only):

```css
/* Direct <li> children of <ul> */
ul > li { ... }
```

### Multiple Selectors (same styles for multiple):

```css
/* Both .nav-link and .nav-btn get these */
.nav-link, .nav-btn {
    color: #fff;
}
```

### Attribute Selector:

```css
/* All links that go to LandingPage2.html */
a[href="LandingPage2.html"] { ... }
```

### Where you used it:

```css
/* saved_jobs.css */
.saved-card h3 { ... }              /* Descendant: h3 inside saved-card */
.saved-card .remove-btn { ... }     /* Descendant: remove-btn inside saved-card */
#sortSelect option { ... }          /* Descendant: options inside the select */
.saved-card:hover { ... }           /* Pseudo-class: on hover */
```

---

## 7. The Box Model — How Elements Take Up Space

Every HTML element is a **box** with 4 layers:

```
┌─────────────────────────────────┐
│         MARGIN (outside)        │
│  ┌───────────────────────────┐  │
│  │        BORDER             │  │
│  │  ┌─────────────────────┐  │  │
│  │  │      PADDING        │  │  │
│  │  │  ┌───────────────┐  │  │  │
│  │  │  │    CONTENT    │  │  │  │
│  │  │  └───────────────┘  │  │  │
│  │  └─────────────────────┘  │  │
│  └───────────────────────────┘  │
└─────────────────────────────────┘
```

### The 4 layers:

| Layer | What it is | Example |
|-------|-----------|---------|
| **Content** | The actual text/image | The job title text |
| **Padding** | Space INSIDE the border | `padding: 22px` — pushes content away from edges |
| **Border** | The outline | `border: 1px solid white` |
| **Margin** | Space OUTSIDE the border | `margin: 0 auto` — centers the element |

### `box-sizing: border-box` — The important one:

```css
* {
    box-sizing: border-box;
}
```

Without it, `width: 100px` + `padding: 20px` = **140px** total.
With it, `width: 100px` + `padding: 20px` = **100px** total (padding is included).

This is why you have it at the top of every CSS file — it makes sizing predictable.

### Where you used it:

```css
/* saved_jobs.css */
.saved-card {
    padding: 22px;              /* Space inside the card */
    border: 1px solid rgba(255, 255, 255, 0.2);  /* The border */
}

.saved-grid {
    gap: 20px;                  /* Space between cards (margin-like) */
}

#saved-jobs {
    padding: 100px 5% 40px;     /* Top, sides, bottom */
    max-width: 1200px;          /* Don't get too wide */
    margin: 0 auto;             /* Center horizontally */
}
```

---

## 8. Flexbox — Laying Out Elements in a Row

**Flexbox** is a layout system for arranging elements in a row or column.

### The basic setup:

```css
.container {
    display: flex;          /* Turn on flexbox */
    justify-content: space-between;  /* Horizontal alignment */
    align-items: center;    /* Vertical alignment */
    gap: 15px;              /* Space between items */
}
```

### `justify-content` — Horizontal alignment:

| Value | What it does |
|-------|-------------|
| `flex-start` | Items at the start (left) |
| `center` | Items centered |
| `flex-end` | Items at the end (right) |
| `space-between` | Space between items, none at edges |
| `space-around` | Equal space around each item |

### `align-items` — Vertical alignment:

| Value | What it does |
|-------|-------------|
| `flex-start` | Items at the top |
| `center` | Items centered vertically |
| `flex-end` | Items at the bottom |
| `stretch` | Items stretch to fill height |

### `flex: 1` — Grow to fill space:

```css
/* This element takes up all remaining space */
.search-bar {
    flex: 1;
}
```

### `flex-direction` — Row or column:

```css
.container {
    flex-direction: row;     /* Default: left to right */
    flex-direction: column;  /* Top to bottom */
}
```

### `flex-wrap` — Allow wrapping:

```css
.container {
    flex-wrap: wrap;  /* Items wrap to next line if no space */
}
```

### Where you used it:

```css
/* saved_jobs.css */
.saved-controls {
    display: flex;
    gap: 15px;
    flex-wrap: wrap;              /* Drop to next line on small screens */
}

.search-bar {
    flex: 1;                      /* Grow to fill space */
    display: flex;
    align-items: center;          /* Vertically center icon + input */
    gap: 10px;
}

.saved-card-top {
    display: flex;
    align-items: center;          /* Vertically center logo + info */
    gap: 15px;
}

.saved-card-actions {
    display: flex;
    gap: 10px;
}

.apply-btn {
    flex: 1;                      /* Takes remaining space */
}
```

---

## 9. CSS Grid — Laying Out Elements in a Grid

**CSS Grid** is for 2D layouts (rows AND columns).

### The basic setup:

```css
.grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
    gap: 20px;
}
```

### Breaking down `repeat(auto-fit, minmax(320px, 1fr))`:

```
repeat(          → Repeat this pattern
    auto-fit,    → As many times as fit
    minmax(      → Each column is at least...
        320px,   → 320px wide
        1fr      → ...and can grow to fill space
    )
)
```

This means: **"Create as many columns as fit, each at least 320px wide, growing to fill the container."**

- On a wide screen: 3-4 columns
- On a tablet: 2 columns
- On a phone: 1 column

### Other grid patterns:

```css
/* Fixed 2 columns */
grid-template-columns: 1fr 1fr;

/* Fixed 3 columns */
grid-template-columns: repeat(3, 1fr);

/* Mixed sizes */
grid-template-columns: 320px 1fr;  /* Sidebar + content */
```

### Where you used it:

```css
/* saved_jobs.css */
.saved-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
    gap: 20px;
}

/* messages.css — two-panel layout */
.messages-container {
    display: flex;  /* Actually flexbox for the two panels */
}

/* dashboard_style.css */
.stats-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
    gap: 18px;
}

/* footer */
.footgrid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 20px;
}
```

---

## 10. Positioning — Fixed, Absolute, Relative

### `position: fixed` — Stays in place when scrolling:

```css
/* The nav bar stays at the top when you scroll */
nav {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: 999;
}

/* The back arrow stays in the corner */
.back-arrow {
    position: fixed;
    top: 20px;
    left: 20px;
    z-index: 1001;
}
```

### `position: absolute` — Positioned relative to nearest positioned ancestor:

```css
/* The online dot is positioned at the bottom-right of the avatar */
.conversation-avatar {
    position: relative;  /* This becomes the reference point */
}

.online-dot {
    position: absolute;
    bottom: 2px;
    right: 2px;
}
```

### `position: relative` — Positioned relative to its normal position:

```css
/* Used as a reference for absolute children */
.conversation-avatar {
    position: relative;
}
```

### `z-index` — Stacking order:

```css
/* Higher z-index = on top */
nav { z-index: 999; }        /* Nav is above content */
.back-arrow { z-index: 1001; }  /* Back arrow is above nav */
.sidebar { z-index: 2000; }  /* Sidebar is above everything */
```

### Where you used it:

```css
/* messages.css */
.conversation-avatar {
    position: relative;  /* Reference for the online dot */
}

.online-dot {
    position: absolute;  /* Positioned inside the avatar */
    bottom: 2px;
    right: 2px;
}

/* All pages */
nav {
    position: fixed;  /* Stays at top when scrolling */
    top: 0;
    left: 0;
    right: 0;
    z-index: 999;
}
```

---

## 11. The Glassmorphism Effect — Your Card Style

**Glassmorphism** is the frosted-glass look used on all your cards. Here's how it works:

```css
.card {
    background: rgba(255, 255, 255, 0.1);   /* 10% white = see-through */
    border: 1px solid rgba(255, 255, 255, 0.2);  /* Subtle white border */
    border-radius: 15px;                     /* Rounded corners */
    backdrop-filter: blur(10px);             /* Blur what's behind */
    -webkit-backdrop-filter: blur(10px);     /* Safari support */
}
```

### The `rgba()` color:

```css
/* rgba = red, green, blue, alpha (transparency) */
rgba(255, 255, 255, 0.1)  /* White at 10% opacity */
rgba(255, 255, 255, 0.2)  /* White at 20% opacity */
rgba(0, 0, 0, 0.3)        /* Black at 30% opacity */
```

### The hover effect:

```css
.card {
    transition: all 0.3s ease;  /* Smooth change over 0.3s */
}

.card:hover {
    transform: translateY(-4px);  /* Lift up 4px */
    background: rgba(255, 255, 255, 0.18);  /* More visible */
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);  /* Shadow below */
}
```

### Where you used it:

```css
/* Every card in the project */
.saved-card, .dash-card, .job-card, .notif-item, .settings-card {
    background: rgba(255, 255, 255, 0.1);
    border: 1px solid rgba(255, 255, 255, 0.2);
    border-radius: 15px;
    transition: all 0.3s ease;
}

/* Hover effect on all cards */
.saved-card:hover, .job-card:hover, .notif-item:hover {
    transform: translateY(-4px);
    background: rgba(255, 255, 255, 0.18);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
}
```

---

## 12. Animations & Transitions — Making Things Move

### `transition` — Smooth changes between states:

```css
/* When the button changes (hover, active), animate over 0.3s */
.btn {
    transition: all 0.3s ease;
}

.btn:hover {
    transform: translateY(-2px);  /* Smoothly moves up */
}
```

### `@keyframes` — Custom animations:

```css
/* Define the animation */
@keyframes fadeInUp {
    from { opacity: 0; transform: translateY(30px); }
    to   { opacity: 1; transform: translateY(0); }
}

/* Use it */
#saved-jobs {
    animation: fadeInUp 0.8s ease-out;
}
```

### The animations in your project:

| Animation | What it does | Where |
|-----------|-------------|-------|
| `fadeInUp` | Fades in and moves up | Every page's main section |
| `wave` | Hand waves back and forth | Dashboard welcome |
| `countUp` | Numbers count up | Dashboard stats |
| `spin` | Rotates continuously | Settings gear, spinners |
| `drawCircle` | Circle draws itself | Success checkmark |
| `drawCheck` | Checkmark draws itself | Success checkmark |
| `scaleIn` | Scales from 0 to 1 | Success circle |
| `slideIn` | Slides in from bottom | Toast notifications |
| `fadeOut` | Fades out | Toast dismissal |

### The success animation (application_success.css):

```css
/* The circle draws itself */
.checkmark-circle circle {
    stroke-dasharray: 166;      /* Total length of the circle */
    stroke-dashoffset: 166;     /* Start fully hidden */
    animation: drawCircle 0.6s ease-out forwards;
}

@keyframes drawCircle {
    to { stroke-dashoffset: 0; }  /* Reveal the circle */
}

/* Then the checkmark draws */
.checkmark-circle path {
    stroke-dasharray: 48;
    stroke-dashoffset: 48;
    animation: drawCheck 0.4s ease-out 0.6s forwards;  /* 0.6s delay */
}

@keyframes drawCheck {
    to { stroke-dashoffset: 0; }
}
```

---

## 13. Responsive Design — Making It Work on Phones

**Responsive design** means your website looks good on all screen sizes.

### The key: `@media` queries

```css
/* Default styles (desktop) */
.saved-grid {
    grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
}

/* When screen is 900px or less (tablet) */
@media (max-width: 900px) {
    .back-arrow {
        display: none;  /* Hide back arrow on mobile */
    }
    #saved-jobs {
        padding-top: 80px;  /* Less top padding */
    }
}

/* When screen is 600px or less (phone) */
@media (max-width: 600px) {
    .saved-grid {
        grid-template-columns: 1fr;  /* Single column */
    }
    .saved-controls {
        flex-direction: column;  /* Stack controls vertically */
    }
}
```

### The responsive patterns you used:

| Pattern | What it does |
|---------|-------------|
| `grid-template-columns: repeat(auto-fit, minmax(320px, 1fr))` | Auto-adjusts columns |
| `flex-wrap: wrap` | Items wrap to next line |
| `flex-direction: column` | Stack items vertically on mobile |
| `@media (max-width: 900px)` | Tablet breakpoint |
| `@media (max-width: 600px)` | Phone breakpoint |
| `min-width: 250px` | Don't let elements get too small |

### The mobile-first approach:

```css
/* Desktop: horizontal layout */
.saved-controls {
    display: flex;
    flex-direction: row;
}

/* Mobile: vertical layout */
@media (max-width: 600px) {
    .saved-controls {
        flex-direction: column;
    }
}
```

---

## 14. Pseudo-classes & Pseudo-elements

### Pseudo-classes — States of elements:

```css
/* Hover: when mouse is over the element */
.btn:hover {
    background: #2e7d32;
}

/* Active: when being clicked */
.btn:active {
    transform: scale(0.95);
}

/* Focus: when keyboard-tabbed to */
input:focus {
    outline: 2px solid #64b5f6;
}

/* First child: the first element in a parent */
.item:first-child {
    border-top: none;
}

/* Last child: the last element in a parent */
.item:last-child {
    border-bottom: none;
}

/* Checked: when a checkbox is checked */
.toggle input:checked + .toggle-slider {
    background: #2e7d32;
}
```

### Pseudo-elements — Parts of elements:

```css
/* ::before — content BEFORE the element */
.toggle-slider::before {
    content: "";
    position: absolute;
    width: 20px;
    height: 20px;
    background: #fff;
    border-radius: 50%;
}

/* ::placeholder — the placeholder text */
input::placeholder {
    color: rgba(255, 255, 255, 0.5);
}
```

### Where you used it:

```css
/* saved_jobs.css */
.search-bar input::placeholder {
    color: rgba(255, 255, 255, 0.5);
}

/* settings.css — the toggle switch */
.toggle-slider::before {
    content: "";
    position: absolute;
    width: 20px;
    height: 20px;
    left: 3px;
    bottom: 3px;
    background: #fff;
    border-radius: 50%;
    transition: 0.3s;
}

.toggle input:checked + .toggle-slider::before {
    transform: translateX(24px);  /* Slide the knob */
}
```

---

## 15. CSS Variables — The Dark Mode Secret

**CSS variables** (custom properties) let you define values once and reuse them everywhere.

### Defining variables:

```css
:root {
    --bg-gradient: linear-gradient(135deg, #2e7d32 0%, #66bb6a 50%, #a5d6a7 100%);
    --card-bg: rgba(255, 255, 255, 0.1);
    --text-color: #fff;
}
```

### Using variables:

```css
body {
    background: var(--bg-gradient);
    color: var(--text-color);
}

.card {
    background: var(--card-bg);
}
```

### The dark mode trick:

```css
/* Default (light) values */
:root {
    --bg-gradient: linear-gradient(135deg, #2e7d32 0%, #66bb6a 50%, #a5d6a7 100%);
    --card-bg: rgba(255, 255, 255, 0.1);
    --text-color: #fff;
}

/* When body has class "dark-mode", override the variables */
body.dark-mode {
    --bg-gradient: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%);
    --card-bg: rgba(255, 255, 255, 0.05);
    --text-color: #e0e0e0;
}
```

### How JavaScript triggers it:

```javascript
// settings.js
function applyDarkMode(enabled) {
    document.body.classList.toggle("dark-mode", enabled);
    // Adding "dark-mode" to <body> changes ALL the CSS variables
    // Every element using var(--bg-gradient) updates automatically!
}
```

### Why this is powerful:

1. **One change updates everything** — toggle one class, the whole site changes
2. **Consistent** — all pages use the same variables
3. **Easy to maintain** — change a color once, it updates everywhere

---

## 16. How HTML, CSS & JS Connect — The Complete Flow

### The full lifecycle of a page:

```
1. USER TYPES URL
   ↓
2. BROWSER LOADS HTML
   → Reads the structure
   → Sees <link rel="stylesheet" href="saved_jobs.css">
   → Sees <script src="saved_jobs.js"></script>
   ↓
3. BROWSER LOADS CSS
   → Applies styles to HTML elements
   → Elements get colors, sizes, positions
   ↓
4. BROWSER LOADS JAVASCRIPT
   → Runs the code
   → Finds elements by id/class
   → Renders dynamic content
   → Attaches event listeners
   ↓
5. USER INTERACTS
   → Clicks a button
   → JavaScript event fires
   → JavaScript updates HTML (innerHTML)
   → CSS styles the new content automatically
   → JavaScript saves to localStorage
   ↓
6. PAGE REFRESHES
   → HTML loads again
   → CSS styles again
   → JavaScript reads localStorage
   → Restores the user's data
```

### A concrete example — the Saved Jobs page:

```
STEP 1: HTML loads
  <div class="saved-grid" id="savedGrid"></div>
  <!-- Empty container -->

STEP 2: CSS loads
  .saved-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
      gap: 20px;
  }
  <!-- The container is styled, but empty -->

STEP 3: JavaScript runs
  const savedJobIds = JSON.parse(localStorage.getItem("savedJobs")) || [];
  // Reads [1, 3, 7] from localStorage

  const savedJobs = fakeJobs.filter(job => savedJobIds.includes(job.id));
  // Gets the full job objects for IDs 1, 3, 7

  savedGrid.innerHTML = savedJobs.map(job => createSavedCard(job)).join("");
  // Injects HTML into the container

STEP 4: CSS styles the new content
  <!-- The injected HTML has class="saved-card" -->
  <!-- CSS automatically styles it with glassmorphism -->

STEP 5: User clicks "Remove"
  <!-- Event delegation catches the click -->
  savedGrid.addEventListener("click", function(event) {
      const removeBtn = event.target.closest(".remove-btn");
      if (removeBtn) {
          removeSavedJob(parseInt(removeBtn.dataset.id));
      }
  });

  <!-- JavaScript updates localStorage -->
  localStorage.setItem("savedJobs", JSON.stringify(savedJobIds));

  <!-- JavaScript re-renders the grid -->
  renderSavedJobs();

  <!-- CSS styles the updated content -->
```

### The key connection points:

| HTML provides | CSS targets it | JavaScript uses it |
|---------------|----------------|-------------------|
| `class="saved-card"` | `.saved-card { ... }` | `document.querySelector(".saved-card")` |
| `id="savedGrid"` | `#savedGrid { ... }` | `document.getElementById("savedGrid")` |
| `data-id="3"` | — | `element.dataset.id` |
| `style="display: none"` | — | `element.style.display = "block"` |
| `<div id="navbar">` | — | `navbarContainer.innerHTML = renderNavbar()` |

---

## 17. The Frontend Integration Lead Checklist

As the **Frontend Integration Lead**, you're responsible for making sure all pages look and work together. Here's your checklist:

### ✅ Color Consistency
- [ ] All pages use the same gradient: `linear-gradient(135deg, #2e7d32, #66bb6a, #a5d6a7)`
- [ ] All cards use: `rgba(255, 255, 255, 0.1)` background
- [ ] All borders use: `rgba(255, 255, 255, 0.2)`
- [ ] All primary buttons: white background, `#2e7d32` text
- [ ] Status colors are consistent: green=success, blue=info, orange=pending, red=danger

### ✅ Spacing Consistency
- [ ] Cards: `padding: 22px`, `border-radius: 15px`
- [ ] Buttons: `border-radius: 50px` (pill shape)
- [ ] Grid gaps: `20px`
- [ ] Main content: `padding: 100px 5% 40px`, `max-width: 1200px`
- [ ] Section headers: `margin-bottom: 30px`

### ✅ Typography Consistency
- [ ] Font family: `'Segoe UI', Arial, sans-serif`
- [ ] Page titles: `font-size: 30px`, `font-weight: 800`
- [ ] Card titles: `font-size: 16px`, `font-weight: 700`
- [ ] Body text: `font-size: 13-14px`
- [ ] Secondary text: `opacity: 0.7-0.8`

### ✅ Navigation Consistency
- [ ] Nav bar: `position: fixed`, `backdrop-filter: blur(10px)`
- [ ] Nav links: `border-radius: 50px`, hover = `rgba(255,255,255,0.15)`
- [ ] Sign Out button: `border: 2px solid #fff`, hover = white bg
- [ ] All pages link to: Dashboard, Saved Jobs, Notifications, Messages, Settings

### ✅ Component Consistency
- [ ] Back arrow: `position: fixed`, `top: 20px`, `left: 20px`
- [ ] Footer: 4 columns, `background: rgba(0,0,0,0.15)`
- [ ] Empty states: centered, large icon, CTA button
- [ ] Responsive breakpoints: `@media (max-width: 900px)` and `@media (max-width: 600px)`

### ✅ JavaScript Consistency
- [ ] All pages check auth: `localStorage.getItem("loggedInUser")`
- [ ] All pages have `handleSignOut()` function
- [ ] All pages use the 5-section structure (Cache DOM → Variables → Helpers → Events → Init)
- [ ] All pages use `document.addEventListener("DOMContentLoaded", initPage)`
- [ ] All data stored in localStorage with `JSON.stringify`/`JSON.parse`

---

## 🎯 Practice Exercises

### Exercise 1: HTML Structure
```html
<!-- Create a simple card with:
     1. A header with a title
     2. A paragraph of text
     3. A button
     4. Give them appropriate classes -->
```

### Exercise 2: CSS Styling
```css
/* Style the card from Exercise 1:
     1. Glassmorphism background
     2. Rounded corners
     3. Hover effect (lift up)
     4. A pill-shaped button -->
```

### Exercise 3: Flexbox
```css
/* Create a row with:
     1. A logo on the left
     2. Links in the middle
     3. A button on the right
     Use flexbox with space-between -->
```

### Exercise 4: Grid
```css
/* Create a responsive grid that:
     1. Shows 3 columns on desktop
     2. Shows 2 columns on tablet
     3. Shows 1 column on phone -->
```

### Exercise 5: CSS Variables
```css
/* Create a theme with:
     1. --primary-color variable
     2. --background variable
     3. A dark mode override
     4. Use them in your styles -->
```

### Exercise 6: The Full Connection
```html
<!-- Create a page that:
     1. Has an empty <div id="list">
     2. Has a button
     3. JavaScript adds items to the list when clicked
     4. CSS styles the items -->
```

---

## 📚 Summary Cheat Sheet

| Concept | What it does | Example |
|---------|-------------|---------|
| `<div>` | Block container | `<div class="card">` |
| `<span>` | Inline container | `<span class="badge">` |
| `class` | For CSS styling | `class="card active"` |
| `id` | For JavaScript | `id="savedGrid"` |
| `data-*` | Custom data | `data-id="3"` |
| `display: flex` | Row/column layout | `display: flex` |
| `display: grid` | 2D layout | `display: grid` |
| `justify-content` | Horizontal alignment | `justify-content: space-between` |
| `align-items` | Vertical alignment | `align-items: center` |
| `flex: 1` | Grow to fill | `flex: 1` |
| `gap` | Space between items | `gap: 20px` |
| `grid-template-columns` | Column layout | `repeat(auto-fit, minmax(320px, 1fr))` |
| `position: fixed` | Stays in place | `position: fixed; top: 0` |
| `position: relative` | Reference for children | `position: relative` |
| `position: absolute` | Positioned inside parent | `position: absolute; bottom: 0` |
| `z-index` | Stacking order | `z-index: 999` |
| `rgba()` | Color with transparency | `rgba(255, 255, 255, 0.1)` |
| `border-radius` | Rounded corners | `border-radius: 15px` |
| `padding` | Space inside | `padding: 22px` |
| `margin` | Space outside | `margin: 0 auto` |
| `transition` | Smooth changes | `transition: all 0.3s ease` |
| `@keyframes` | Custom animation | `@keyframes fadeInUp` |
| `animation` | Use an animation | `animation: fadeInUp 0.8s ease-out` |
| `@media` | Responsive breakpoints | `@media (max-width: 600px)` |
| `:hover` | Mouse over state | `.btn:hover` |
| `::before` | Content before element | `.toggle-slider::before` |
| `::placeholder` | Placeholder text | `input::placeholder` |
| `:root` | Define CSS variables | `:root { --color: #fff; }` |
| `var()` | Use a CSS variable | `color: var(--color)` |
| `backdrop-filter` | Frosted glass | `backdrop-filter: blur(10px)` |
| `box-shadow` | Shadow effect | `box-shadow: 0 4px 10px rgba(0,0,0,0.3)` |
| `transform` | Move/scale/rotate | `transform: translateY(-4px)` |
| `opacity` | Transparency | `opacity: 0.7` |
| `overflow` | Handle overflow | `overflow-y: auto` |
| `cursor` | Mouse cursor | `cursor: pointer` |

---

**Now go back and re-read the HTML and CSS files with this guide!** Open a page's HTML, then its CSS, then its JavaScript — and trace how they connect. That's the key to understanding frontend development.