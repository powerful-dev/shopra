# Shopra AI Agent Instructions

## Project

Shopra is a SaaS platform for renting ready-made websites.

Prioritize maintainability, readability, consistency, and scalability. Prefer existing project conventions over personal preferences.

---

## Technology Stack

### Backend
- Laravel 13
- PHP 8.4
- PostgreSQL
- Docker
- Vite

### Admin Panel
- React 19
- React Router
- Tailwind CSS
- Reusable project CSS/SCSS components

### Public Website
- Blade templates

Do not introduce Bootstrap, UIkit, Material UI, jQuery, or other UI frameworks without explicit approval.

UIkit is legacy and must not be used in the production admin panel.

---

## Architecture

### Admin
Use a React SPA communicating with the Laravel REST API.

### Public Website
Use Blade templates.

### Backend
- Keep controllers thin.
- Business logic belongs in Services.
- Validation belongs in Form Requests.
- Use API Resources where appropriate.
- Use Eloquent and relationships for database access.
- Use Policies/Gates for authorization where appropriate.
- Prefer dependency injection.
- Do not introduce the Repository pattern unless it provides clear value.

---

# Admin UI Migration

The `layout/` directory is the source of truth for the new admin UI.

It contains the completed static frontend implementation, including:

- HTML
- CSS
- JavaScript interactions
- responsive behavior
- SVG/icons
- images and other assets

The current task is to progressively transfer this implementation into the React admin panel.

This is not a redesign or approximate recreation.

Before modifying an admin page, inspect the corresponding `layout/` HTML and all relevant CSS, JS, and assets.

Preserve the existing implementation as accurately as reasonably possible, including:

- structure relevant to styling
- dimensions and spacing
- typography
- colors
- borders, radius, and shadows
- icons and assets
- states
- responsive behavior

Use exact existing values when they are already defined in `layout/`.

Do not modify files inside `layout/` unless explicitly requested.

---

## Reusable UI and Styling

Existing reusable components from `layout/` should normally be preserved and reused.

Examples include:

- `.button`
- `.badge`
- `.data-list`
- `.popover`
- forms
- switches
- shared cards and containers

Do not recreate an existing reusable component with a different implementation merely because another approach is possible.

### Styling priority

1. Existing reusable component from `layout/`
2. Existing reusable production React/CSS component
3. Tailwind for structural and local utility styling
4. New custom CSS/SCSS only when necessary

Tailwind is appropriate for layout, grid, flexbox, spacing, sizing, positioning, visibility, responsive structure, and local adjustments.

Do not replace an existing reusable component with long repeated Tailwind class lists.

Arbitrary Tailwind values are allowed when required to reproduce exact layout values.

---

## CSS / SCSS

`admin.scss` is the main SCSS entry point for the admin application.

Shared components belong in the shared styling layer.

Page-specific files should contain only styles unique to that page and should not be created when unnecessary.

Reuse existing tokens, mixins, responsive helpers, and shared styles where appropriate.

Avoid:

- duplicated styles
- conflicting implementations
- excessive selector nesting
- unnecessary override layers
- unused legacy styles
- `!important` unless necessary

When migrating a page, remove obsolete styles only after verifying they are no longer used elsewhere.

Do not perform broad legacy cleanup unrelated to the current task.

---

## React

Use functional components, Hooks, and React Router.

Reuse existing components where possible.

Create reusable components when they represent a clear reusable UI concept, meaningful behavior, or are used in multiple places.

Do not split static markup into excessive numbers of tiny components or introduce abstractions for hypothetical future reuse.

When transferring `layout/` HTML to React:

- preserve relevant DOM structure and class names;
- convert markup correctly to JSX;
- reuse original assets;
- implement required interactions using React state and event handlers.

Do not blindly copy static JavaScript into React.

Static demo behavior does not need to become production functionality unless required by the task.

---

## API

Use the native Fetch API through reusable service modules.

Do not scatter direct `fetch()` calls throughout React components.

Keep API communication, UI rendering, and application state appropriately separated.

Reuse existing API services before creating new ones.

Do not change existing API contracts unless explicitly requested.

---

## Fonts and Assets

The primary admin font is `Manrope`.

Use local font files from:

`resources/fonts/`

Do not load the primary font from external CDNs.

Before adding icons, SVGs, images, or illustrations, check `layout/` and reuse the original assets when they exist.

Do not introduce a new icon library without approval.

---

## Responsive Design

Follow the responsive behavior already implemented in `layout/`.

Inspect its CSS, media queries, markup, and relevant interactions before implementing responsive changes.

Do not invent new breakpoints when the required behavior already exists.

Preserve reusable component responsive styles instead of creating duplicate implementations.

---

## Database

Use PostgreSQL and Eloquent.

Use appropriate foreign keys and indexes.

Migrations must be reversible.

Avoid N+1 queries and use eager loading where appropriate.

Use raw SQL only when there is a clear reason.

---

## Docker

The project runs inside Docker.

Do not assume local PHP, Composer, or Node installations.

Run project commands through Docker when applicable.

Do not modify Docker configuration unless required by the current task.

---

## Security

Preserve existing authentication and authorization behavior.

Validate client input and use Laravel authorization mechanisms where appropriate.

Never expose secrets or weaken existing security mechanisms.

---

# Working Rules

Work only on the requested scope.

Before changing code:

1. Inspect the current implementation.
2. For admin UI work, inspect the corresponding `layout/` implementation and its dependencies.
3. Identify existing reusable React and CSS components.
4. Make the smallest clean change that satisfies the task.
5. Remove code only when it has actually become obsolete.
6. Verify the result.

Unless explicitly requested:

- do not change business logic;
- do not change authentication or authorization flows;
- do not change API contracts or routing;
- do not rename files, components, models, or services unnecessarily;
- do not refactor unrelated code;
- do not install new libraries;
- do not modify unrelated pages;
- do not introduce breaking changes.

If required information can be determined by inspecting the project, inspect it instead of asking unnecessary questions.

If a change may significantly affect existing functionality and the correct behavior cannot be determined from the project, ask before proceeding.

---

## Admin Migration Checklist

When migrating a page from `layout/`:

1. Inspect its HTML and related CSS, JS, and assets.
2. Reuse already migrated components and styles where possible.
3. Transfer the markup and styling faithfully to React.
4. Preserve existing application functionality unless a static migration is explicitly requested.
5. Migrate missing shared components only once into the shared layer.
6. Remove only code made obsolete by this migration.
7. Compare the result with `layout/`, including responsive behavior.

Do not consider a migration complete if the result only approximately matches the source.

---

## Git and Documentation

Keep commits focused and avoid unrelated changes.

Update project documentation only when architecture, conventions, or significant implementation decisions change. Do not update architectural documentation for routine UI adjustments.