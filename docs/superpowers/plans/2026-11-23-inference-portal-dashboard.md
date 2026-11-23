# Inference Portal Dashboard Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Upgrade `docs/index.html` into a searchable, animated AI inference knowledge dashboard while preserving static GitHub Pages deployment and all existing destinations.

**Architecture:** Keep the site framework-free and self-contained in `docs/index.html`. Replace the current page shell with a dashboard-oriented semantic structure, a single authored resource index in an inline data block, and small vanilla JavaScript modules for theme, filtering, counters, and reveal effects. CSS custom properties provide light/dark themes, responsive layout, and reduced-motion fallbacks.

**Tech Stack:** HTML5, CSS3 custom properties/animations, vanilla JavaScript, existing local images, Python static HTTP server for smoke testing.

**Spec:** `docs/superpowers/specs/2026-11-23-inference-portal-dashboard-design.md`

## Global Constraints

- Preserve existing page URLs, GitHub Pages deployment, and document content.
- Do not add React/Vue, a bundler, a backend, runtime network requests, or third-party chart services.
- Search matches Chinese and English text, is case-insensitive, supports partial matches, and combines with category filters using AND.
- Initial theme follows `prefers-color-scheme`; an explicit user choice is saved to `localStorage`.
- Respect `prefers-reduced-motion` and keep all primary content usable without JavaScript.
- Keep the implementation limited to `docs/index.html` unless a separate asset is demonstrably necessary.

## Review Focus

- Empty search results: the result count and empty state must explain what to try next — test in Task 3.
- Combined search and category filter: both constraints must apply together, not replace each other — test in Task 3.
- Stored theme value and invalid storage: invalid values must fall back to system preference without breaking the page — test in Task 3.
- Reduced-motion preference: reveal and background animations must be disabled or minimized — test in Task 2.
- Narrow viewport: dashboard grids must collapse without horizontal overflow and primary controls remain usable — test in Task 4.

### Task 1: Replace the page shell with dashboard information architecture

**Files:**
- Modify: `docs/index.html` (HTML body and existing inline style block)

**Interfaces:**
- Consumes: existing resource destinations and copy from the current homepage.
- Produces: semantic sections with stable IDs: `#overview`, `#explore`, `#path`, `#library`, `#visual-lab`, and `#resources`; filterable cards expose `data-category`, `data-search`, and `data-featured` attributes.

- [ ] **Step 1: Add a failing structural smoke check**

  Create a temporary local check command that parses `docs/index.html` and asserts the new stable IDs, a search input, category buttons, and at least one `data-search` resource card. The check should fail against the current page because those selectors do not yet exist.

- [ ] **Step 2: Run the structural check and verify it fails**

  Run the check against `docs/index.html`; expected result is a missing-selector failure.

- [ ] **Step 3: Implement the new dashboard shell in `docs/index.html`**

  Rework the current navigation and section order into: sticky command-bar navigation; hero with system status, metrics, and visual pipeline; explore/search panel; learning route; core library; visual lab; supporting resources; footer. Keep the current book, knowledge-map, lecture, production-note, walkthrough, environment, and GitHub destinations in the new cards or resource links. Add accessible labels, keyboard-focusable controls, `aria-live` result count, and a no-JavaScript-friendly static card layout.

- [ ] **Step 4: Run the structural check and verify it passes**

  Re-run the parser check; expected result is all required selectors found and all preserved primary destinations still present.

### Task 2: Implement the visual system and responsive motion layer

**Files:**
- Modify: `docs/index.html` (inline CSS)

**Interfaces:**
- Consumes: dashboard section classes and `data-*` hooks from Task 1.
- Produces: CSS variables for light/dark palettes, `.theme-dark`, responsive grids, `.reveal`, `.is-visible`, `.metric`, `.pipeline`, `.filter-chip`, `.resource-card`, and reduced-motion behavior.

- [ ] **Step 1: Add a failing style smoke check**

  Extend the structural check to assert the presence of the light/dark variables, reduced-motion media query, responsive breakpoint, visible focus styles, and the animation hook classes.

- [ ] **Step 2: Run the style check and verify it fails**

  Run the check; expected result is missing dashboard style tokens/classes.

- [ ] **Step 3: Implement the visual system**

  Replace the paper-first palette with a dark command-center default plus a warm light theme, use electric cyan/violet/orange accents, add layered grid/noise/aurora backgrounds, glass panels, status pills, compact metric cards, pipeline nodes, route timeline, hover states, and restrained entrance/hover animations. Preserve strong contrast and provide `@media (prefers-reduced-motion: reduce)` that disables transforms, reveals, and looping background animation.

- [ ] **Step 4: Run the style check and verify it passes**

  Re-run the check; expected result is all required style hooks found.

### Task 3: Add the resource index, search, filtering, theme, and counters

**Files:**
- Modify: `docs/index.html` (inline resource data and inline JavaScript)

**Interfaces:**
- Consumes: `#explore` controls and filterable cards from Task 1.
- Produces: `window.portal` functions `filterResources(query, category)`, `setTheme(theme)`, and `updateMetrics()`; UI behavior is wired to `#resource-search`, `[data-filter]`, `[data-theme-toggle]`, `[data-result-count]`, and `[data-resource-grid]`.

- [ ] **Step 1: Add failing behavior checks**

  Add a browser-evaluable check script with assertions for: partial Chinese/English matching, case-insensitive matching, AND combination of query and category, empty-state rendering, count updates, valid theme persistence, and invalid stored theme fallback.

- [ ] **Step 2: Run behavior checks and verify they fail**

  Run the checks against the current page; expected result is missing `window.portal` behavior and controls.

- [ ] **Step 3: Implement the resource index and vanilla JS behavior**

  Author a compact resource index from existing local destinations, with categories such as `core`, `guide`, `visual`, `production`, and `lab`. Normalize query text with `toLocaleLowerCase`, match against each card’s `data-search`, keep filter buttons mutually exclusive, and update the live result count plus an explicit empty state. Derive dashboard metrics from the indexed cards rather than hard-coded duplicate totals. Initialize theme from local storage, then system preference, expose `setTheme`, and update the toggle label/icon. Use `IntersectionObserver` for reveal classes with a reduced-motion guard, and add a subtle pointer glow only when motion is allowed.

- [ ] **Step 4: Run behavior checks and verify they pass**

  Start a local static server, load the page in a browser automation check, and assert all behavior checks pass.

### Task 4: Verify links, responsive layout, accessibility, and final visual polish

**Files:**
- Modify: `docs/index.html` only if verification exposes a defect.

**Interfaces:**
- Consumes: completed dashboard page from Tasks 1–3.
- Produces: verified static homepage with no broken primary interactions.

- [ ] **Step 1: Run a local static server**

  Run `python3 -m http.server 8000 --directory docs` from the repository root.

- [ ] **Step 2: Run HTML and link smoke checks**

  Parse the document, verify all local `href` targets referenced by the homepage exist, and verify there is no duplicate `id` or missing `alt` on meaningful images.

- [ ] **Step 3: Run browser checks at desktop and mobile widths**

  At desktop width, verify hero, search, metrics, route, library, and visual lab are visible and the search/filter interaction updates cards. At a narrow viewport, verify no horizontal overflow, the nav remains usable, and the primary CTA/search remain reachable. Verify theme toggle and reduced-motion behavior.

- [ ] **Step 4: Inspect the final diff and run the complete verification suite**

  Review `git diff -- docs/index.html`, run all structural, style, behavior, link, and browser checks from Tasks 1–4, and record exit codes/output before reporting completion.
