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
- UIkit (https://getuikit.com/)

### Public Website

- Blade templates

Do not introduce Bootstrap, Tailwind CSS, Material UI, jQuery, or any other UI framework without explicit approval.

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

Build every admin interface using UIkit components whenever possible.

Prefer existing UIkit components over custom implementations.

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

Wrap Fetch API in a reusable service module instead of calling fetch() directly from React components.

Keep components focused on a single responsibility.

Extract reusable logic into custom hooks.

Separate API communication from UI components by using dedicated service modules.

Avoid duplicated state.

Avoid unnecessary re-renders.

Reuse existing components whenever possible before creating new ones.

---

# Coding Style

Always follow PSR-12.

Write readable, maintainable code.

Prefer expressive method names.

Keep controllers thin.

Keep React components small.

Extract duplicated logic into Services.

Prefer dependency injection.

Avoid static helper classes unless they provide clear value.

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

---

# Docker

The project is developed entirely inside Docker.

Never assume a local PHP installation.

Run all project commands through Docker.

Examples:

```bash
docker compose exec php php artisan migrate
docker compose exec php composer install
docker compose exec php npm run dev
```

---

# Git

Write meaningful commit messages.

Keep commits focused.

Avoid mixing unrelated changes.

---

# Performance

Prefer server-side pagination.

Avoid N+1 queries.

Use eager loading where appropriate.

Cache expensive operations when appropriate.

Optimize before introducing unnecessary complexity.

---

# Security

Never trust client input.

Validate everything.

Escape output.

Protect all admin routes.

Never expose secrets.

Use Laravel authorization (Policies, Gates, Middleware) where appropriate.

---

# Documentation

Whenever a significant architectural decision is made, update the documentation inside:

```
docs/
```

Important documents:

- PROJECT_CONTEXT.md
- ROADMAP.md
- DATABASE.md
- ARCHITECTURE.md
- DECISIONS.md

---

# AI Behavior

When suggesting code:

- Follow the existing project structure.
- Reuse existing Services before creating new ones.
- Reuse existing React components before creating new ones.
- Do not introduce new libraries without a strong reason.
- Keep solutions simple and maintainable.
- Explain architectural trade-offs when multiple solutions exist.
- Prefer consistency with the existing codebase over personal preference.
- If project conventions conflict with general best practices, follow the project conventions.

If information is missing, ask before making assumptions.

---

# Design Reference

The project contains a `prototype/` directory.

Before implementing or modifying the admin panel UI, always review:

- prototype/README.md
- all relevant files inside prototype/

The prototype directory is the authoritative design reference for:

- layout
- navigation
- visual hierarchy
- spacing
- responsive behavior
- user experience

Do not copy the prototype implementation directly. The prototype defines the visual appearance, not the application architecture.

Instead, recreate it using the project's architecture, React components, and UIkit.

---

# Working Rules

Unless explicitly requested otherwise:

- Do not change existing business logic.
- Do not modify authentication or authorization flows.
- Do not change API contracts.
- Do not change routing.
- Do not rename existing components, services, models or files.
- Do not introduce breaking changes.
- Do not refactor unrelated code while implementing a task.
- Focus only on the requested functionality.
- If a required change may affect existing behavior, explain why and ask for confirmation before proceeding.

Before modifying existing code:

- First understand the current implementation.
- Reuse existing architecture whenever possible.
- Prefer extending existing code over replacing it.

---

# Scope of Changes

Implement only what is required for the current task.

Avoid implementing future functionality unless explicitly requested.

Use placeholders or mock data where appropriate instead of introducing unfinished business logic.

---

### SCSS Organization

To keep the styling architecture clean, scalable, and maintainable, follow these conventions:

* Every new admin page must have its own dedicated SCSS file (for example: `_dashboard.scss`, `_administrators.scss`, `_orders.scss`).
* Each page-specific SCSS file must be imported into the main SCSS entry file.
* Shared components, common layouts, utilities, and reusable styles belong in `_core.scss`.
* Page-specific SCSS files should contain only styles unique to that page.

#### Existing SCSS Architecture

The project already includes the following shared SCSS files:

* `_tokens.scss` – design tokens (colors, spacing, typography, border radius, shadows, etc.).
* `_mixins.scss` – reusable mixins and helper functions.
* `_responsive.scss` – responsive breakpoints and responsive helper mixins.
* `_core.scss` – shared UI components and common application styles.

When implementing new styles:

* Always reuse variables from `_tokens.scss` instead of hardcoding values.
* Always use existing mixins from `_mixins.scss` whenever applicable.
* Use the responsive utilities defined in `_responsive.scss` instead of writing arbitrary media queries.
* Before creating new variables, mixins, or helper classes, check whether an appropriate solution already exists.

#### SCSS Style Guidelines

* Follow the existing nested SCSS style used throughout `_core.scss`.
* Keep selectors properly nested and avoid unnecessarily long flat selectors.
* Avoid duplicating or overriding styles from `_core.scss` unless absolutely necessary.
* If a style becomes reusable across multiple pages, move it into `_core.scss`.
* Maintain consistent naming conventions across all SCSS files.
* Do not use `!important` unless there is no reasonable alternative.
* Before adding new styles, check whether an existing reusable component or class can be extended instead of creating duplicate rules.

The goal is to keep the styling system modular, reusable, and easy to maintain as the admin panel continues to grow.
