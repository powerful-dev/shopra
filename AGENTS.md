# Shopra AI Agent Instructions

## Project Overview

Shopra is a SaaS platform for renting ready-made websites.

The goal of the project is to allow administrators to quickly create, configure and publish websites for customers.

This is a long-term project. Every architectural decision should prioritize maintainability, readability, and scalability over short-term speed.

---

# Technology Stack

## Backend

- Laravel 13
- PHP 8.4
- PostgreSQL
- Docker
- Vite

## Frontend

### Admin Panel

- React 19
- React Router
- Tailwind CSS

### Public Website

- Blade templates

Do not introduce Bootstrap, UIkit, Material UI, jQuery, or any other UI framework without explicit approval.

---

# Architecture

## Public Website

Use Blade templates.

## Admin Panel

Use a React SPA.

## Backend

Expose functionality through a Laravel REST API.

Business logic belongs in Services.

Validation belongs in Form Requests.

Use API Resources where appropriate.

Database access should remain inside Eloquent models unless there is a strong architectural reason otherwise.

Avoid introducing the Repository pattern unless it provides clear value.

---

# Frontend Guidelines

Build every admin interface using Tailwind CSS whenever possible.

Tailwind utility classes are the primary styling approach for the admin panel.

When implementing frontend styles, use the following priority:

1. Reuse existing React components and existing project styles.
2. Use Tailwind CSS utility classes.
3. Reuse existing shared custom SCSS where appropriate.
4. Create new custom SCSS only when necessary.

Avoid creating custom CSS/SCSS classes when the same result can be cleanly achieved with Tailwind.

Custom styles are appropriate when:

- Tailwind would make the markup unnecessarily complex.
- The required design cannot be reasonably implemented with Tailwind utilities.
- A reusable project-specific component requires dedicated styling.
- Complex states, interactions, or responsive behavior are significantly clearer in SCSS.

Keep the interface:

- clean
- modern
- responsive
- minimalistic
- consistent

Avoid unnecessary animations and visual effects.

Prefer consistency over decoration.

Use:

- Functional Components
- React Hooks
- React Router

Use the native Fetch API for all HTTP communication.

Wrap Fetch API in a reusable service module instead of calling `fetch()` directly from React components.

Keep components focused on a single responsibility.

Extract reusable logic into custom hooks.

Separate API communication from UI components by using dedicated service modules.

Avoid duplicated state.

Avoid unnecessary re-renders.

Reuse existing components whenever possible before creating new ones.

---

# Coding Style

Always follow PSR-12 for PHP code.

Write readable, maintainable code.

Prefer expressive method and variable names.

Keep controllers thin.

Keep React components small and focused.

Extract duplicated business logic into Services.

Prefer dependency injection.

Avoid static helper classes unless they provide clear value.

Do not introduce unnecessary abstractions.

Prefer simple solutions that follow the existing project architecture.

---

# Database

Database engine:

PostgreSQL

Requirements:

- Use foreign keys wherever appropriate.
- Use cascading deletes only when appropriate.
- Add indexes to searchable columns.
- Prefer Eloquent over raw SQL whenever possible.
- Every migration must be reversible.
- Avoid N+1 queries.
- Use eager loading where appropriate.

---

# Laravel

Prefer:

- Form Requests
- API Resources
- Policies
- Service classes
- Eloquent relationships

Avoid placing business logic inside controllers.

Protect all admin endpoints using authentication and authorization middleware.

Reuse existing Services and application architecture before introducing new abstractions.

---

# Docker

The project is developed entirely inside Docker.

Never assume a local PHP, Composer, Node.js, or NPM installation.

Run all project commands through Docker.

Examples:

```bash
docker compose exec php php artisan migrate
docker compose exec php composer install
docker compose exec php npm install
docker compose exec php npm run dev
```

Before running commands, inspect the existing Docker configuration when necessary.

Do not modify Docker configuration unless required by the current task.

---

# Git

Write meaningful commit messages.

Keep commits focused.

Avoid mixing unrelated changes.

Do not commit generated, temporary, or environment-specific files unless they are intentionally part of the project.

---

# Performance

Prefer server-side pagination for large datasets.

Avoid N+1 queries.

Use eager loading where appropriate.

Cache expensive operations when appropriate.

Avoid unnecessary frontend re-renders.

Do not introduce optimization complexity without a clear reason.

Optimize based on actual requirements rather than assumptions.

---

# Security

Never trust client input.

Validate everything.

Escape output where appropriate.

Protect all admin routes.

Never expose secrets.

Use Laravel authorization through Policies, Gates, and Middleware where appropriate.

Never expose sensitive backend information through API responses.

Do not weaken existing authentication or authorization mechanisms.

---

# Documentation

Whenever a significant architectural decision is made, update the documentation inside:

```text
docs/
```

Important documents:

- `PROJECT_CONTEXT.md`
- `ROADMAP.md`
- `DATABASE.md`
- `ARCHITECTURE.md`
- `DECISIONS.md`

Do not update documentation for trivial visual changes unless the change affects project conventions or architecture.

---

# Design Reference

The project contains a `layout/` directory.

The `layout/` directory is the authoritative design reference for the Shopra admin panel.

Before implementing or modifying any admin panel UI, always inspect the relevant files inside `layout/`.

Review:

- the corresponding HTML page
- relevant CSS/SCSS files
- relevant JavaScript files
- reused components
- icons and other assets
- responsive behavior

The `layout/` directory defines the expected:

- layout
- page structure
- navigation
- visual hierarchy
- spacing
- typography
- colors
- components
- responsive behavior
- interactions
- user experience

When implementing a page, first find the corresponding page or closest existing example inside `layout/`.

Reproduce the design and behavior as closely as reasonably possible.

Do not redesign existing interfaces unless explicitly requested.

Do not copy the `layout/` implementation blindly.

The `layout/` directory defines the visual appearance and expected behavior, not the production application architecture.

The production admin panel must recreate the layout using:

- React components
- React Router
- Tailwind CSS
- existing shared components
- existing services
- existing hooks
- custom SCSS only when necessary

Prefer Tailwind CSS when recreating styles from `layout/`.

If the layout contains custom CSS that can be cleanly replaced by Tailwind utilities without changing the appearance or behavior, use Tailwind.

If a specific layout implementation requires custom styles to reproduce correctly and cleanly, custom SCSS may be used.

Do not modify files inside `layout/` unless explicitly requested.

Treat `layout/` as a reference source.

---

# Icons and Assets

Before introducing a new icon or visual asset, check whether an appropriate asset already exists inside the project or `layout/`.

Prefer reusing the same icons and assets used by the reference layout.

Do not replace existing reference icons with visually different alternatives unless explicitly requested.

Do not introduce a new icon library without explicit approval.

---

# Tailwind CSS Guidelines

Tailwind CSS is the primary styling system for the admin panel.

Prefer utility classes directly in React markup when they provide a clear and readable implementation.

Use Tailwind for:

- spacing
- sizing
- typography
- colors
- borders
- border radius
- shadows
- flexbox
- grid
- positioning
- responsive behavior
- visibility
- common interactive states

Before creating custom CSS or SCSS, check whether the required result can be implemented cleanly with existing Tailwind utilities.

Avoid creating wrapper classes that simply duplicate a small set of Tailwind utilities.

Avoid excessive use of arbitrary Tailwind values when an existing project value or Tailwind utility already matches the design.

When an exact value from `layout/` is required to preserve the design and no appropriate standard utility exists, an arbitrary Tailwind value may be used.

Do not change the visual design merely to fit standard Tailwind values.

Visual consistency with `layout/` has priority over forcing everything into default Tailwind spacing or sizing.

---

# SCSS Organization

Tailwind CSS is the primary styling system.

Custom SCSS is secondary and should only be used when it provides a clearer or more maintainable solution.

Before adding custom SCSS:

1. Check whether the required style already exists.
2. Check whether an existing React component already solves the problem.
3. Check whether it can be implemented cleanly with Tailwind.
4. Check whether an existing shared SCSS class can be reused.
5. Only then introduce new custom styles.

Every new admin page that requires page-specific custom styles should have its own dedicated SCSS file.

Examples:

```text
_dashboard.scss
_administrators.scss
_orders.scss
```

Do not create a page-specific SCSS file if the page can be implemented entirely with Tailwind and existing shared styles.

Each page-specific SCSS file must be imported into the main SCSS entry file when needed.

Shared components, common layouts, and reusable custom styles belong in `_core.scss`.

Page-specific SCSS files should contain only styles unique to that page.

---

## Existing SCSS Architecture

The project already includes:

- `_tokens.scss` – design tokens such as colors, spacing, typography, border radius, and shadows.
- `_mixins.scss` – reusable mixins and helper functions.
- `_responsive.scss` – responsive breakpoints and responsive helper mixins.
- `_core.scss` – shared UI components and common application styles.

When custom SCSS is necessary:

- Reuse variables from `_tokens.scss` instead of hardcoding values when appropriate.
- Reuse existing mixins from `_mixins.scss`.
- Use responsive utilities from `_responsive.scss` instead of creating arbitrary media queries.
- Check `_core.scss` before creating a new reusable class.
- Avoid duplicating functionality already provided cleanly by Tailwind.

Before creating new variables, mixins, helper classes, or reusable styles, check whether an appropriate solution already exists.

---

# SCSS Style Guidelines

Follow the existing nested SCSS style used throughout `_core.scss`.

Keep selectors properly nested.

Avoid unnecessarily long or deeply nested selectors.

Avoid duplicating or overriding styles from `_core.scss` unless necessary.

If a custom style becomes reusable across multiple pages, move it into `_core.scss`.

Maintain consistent naming conventions across all SCSS files.

Do not use `!important` unless there is no reasonable alternative.

Do not create custom classes solely to hide Tailwind utilities behind another class name.

The styling priority is:

**existing reusable components → Tailwind CSS → existing shared SCSS → new custom SCSS**

The goal is to keep the styling system modular, reusable, predictable, and easy to maintain.

---

# Responsive Design

Responsive behavior should follow the reference implementation inside `layout/`.

Before implementing responsive styles, inspect how the corresponding page behaves in `layout/`.

Prefer Tailwind responsive utilities whenever possible.

Use existing responsive SCSS helpers only when custom SCSS is necessary.

Do not introduce arbitrary breakpoints when an existing project breakpoint can be used.

Do not simplify or remove responsive behavior from the reference layout unless explicitly requested.

---

# Component Reuse

Before creating a new React component:

1. Search for an existing component that already provides the required functionality.
2. Check whether an existing component can be extended without introducing unnecessary complexity.
3. Check similar pages for reusable patterns.
4. Create a new component only when reuse is not appropriate.

Shared UI patterns should become reusable components when doing so clearly reduces duplication.

Do not extract tiny components solely for abstraction.

Prefer meaningful component boundaries based on responsibility.

---

# AI Behavior

When suggesting or modifying code:

- Follow the existing project structure.
- Inspect the current implementation before making changes.
- Inspect relevant files inside `layout/` for UI tasks.
- Reuse existing Services before creating new ones.
- Reuse existing React components before creating new ones.
- Reuse existing hooks and utilities.
- Prefer Tailwind CSS for styling.
- Use custom SCSS only when appropriate.
- Do not introduce new libraries without a strong reason and explicit approval.
- Keep solutions simple and maintainable.
- Explain architectural trade-offs when multiple reasonable solutions exist.
- Prefer consistency with the existing codebase over personal preference.
- If project conventions conflict with general best practices, follow the project conventions unless doing so would introduce a serious problem.
- Do not redesign interfaces that already have a reference implementation.
- Do not implement functionality outside the requested scope.

If information required to make a safe architectural decision is missing, ask before making assumptions.

For small implementation details that can be determined from the existing codebase or `layout/`, inspect the project instead of asking unnecessary questions.

---

# Working Rules

Unless explicitly requested otherwise:

- Do not change existing business logic.
- Do not modify authentication or authorization flows.
- Do not change API contracts.
- Do not change routing.
- Do not rename existing components, services, models, or files.
- Do not introduce breaking changes.
- Do not refactor unrelated code while implementing a task.
- Focus only on the requested functionality.

If a required change may affect existing behavior, explain why and ask for confirmation before proceeding.

Before modifying existing code:

1. Understand the current implementation.
2. Inspect related components and files.
3. Inspect the corresponding reference inside `layout/` for UI changes.
4. Reuse existing architecture whenever possible.
5. Prefer extending existing code over replacing it.
6. Implement only the required changes.

Do not perform broad refactoring unless explicitly requested.

---

# Scope of Changes

Implement only what is required for the current task.

Avoid implementing future functionality unless explicitly requested.

Use placeholders or mock data where appropriate instead of introducing unfinished business logic.

Do not modify unrelated files.

Do not introduce abstractions solely for possible future requirements.

Do not create backend functionality when the task only requires frontend implementation.

Do not create frontend functionality when the task only requires backend implementation.

Keep each implementation focused on the requested result.

---

# Implementation Priority

When working on an existing feature, use the following order:

1. Understand the requested task.
2. Inspect the current implementation.
3. Inspect the relevant reference inside `layout/` for UI tasks.
4. Identify existing reusable components, services, hooks, styles, and assets.
5. Implement the smallest maintainable change.
6. Use Tailwind CSS as the primary styling approach.
7. Add custom SCSS only when necessary.
8. Preserve existing behavior outside the requested scope.
9. Verify responsive behavior when UI is affected.
10. Update documentation only when an architectural or significant project-level decision was made.

The primary goal is not to rewrite existing code.

The primary goal is to extend Shopra consistently, safely, and maintainably.