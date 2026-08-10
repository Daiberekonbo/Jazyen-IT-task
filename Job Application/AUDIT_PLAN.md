# 🔍 Frontend Audit & Refactor Plan

## Phase 1: Inspection
- [ ] Read all auth files (login, register, forgot/reset password)
- [ ] Read all page HTML files
- [ ] Read all CSS files
- [ ] Read all JavaScript files
- [ ] Identify all issues

## Phase 2: Color System Refactor
- [ ] Replace indigo/purple palette with Green (#2e7d32), White, Orange (#ff9800)
- [ ] Update all CSS files with new color system
- [ ] Ensure contrast and accessibility

## Phase 3: Dynamic User Data
- [ ] Update registration to store full user profile
- [ ] Update login to validate against registered users
- [ ] Update profile page to display/edit logged-in user's data
- [ ] Update dashboard to reflect logged-in user
- [ ] Remove all hardcoded user data

## Phase 4: Navigation & Links Audit
- [ ] Verify every link works
- [ ] Fix broken links
- [ ] Ensure consistent nav across all pages

## Phase 5: Forms & Validation
- [ ] Audit all forms
- [ ] Fix validation issues
- [ ] Ensure no empty submissions

## Phase 6: Job Pages
- [ ] Fix job listing/detail/application flow
- [ ] Ensure apply button works
- [ ] Prevent duplicate applications

## Phase 7: Responsive & UI/UX
- [ ] Fix responsive issues
- [ ] Improve UI polish
- [ ] Fix accessibility

## Phase 8: Final QA
- [ ] Verify all pages load
- [ ] Verify all links work
- [ ] Verify all forms work
- [ ] Verify persistence
- [ ] Produce final report