# Shopra AI Agent Instructions

## Project Overview

Shopra is a SaaS platform for renting ready-made websites.

The goal of the project is to allow administrators to quickly create, configure and publish websites for customers.

This is a long-term project. Every architectural decision should prioritize maintainability, readability and scalability over short-term speed.

---

# Technology Stack

Backend

- Laravel 13
- PHP 8.4
- PostgreSQL
- Docker
- Vite

Frontend

- React 19 (Admin Panel only)
- Blade (Public Website)
- Tailwind CSS

Never introduce Bootstrap or jQuery.

---

# Architecture

Public website

Blade templates.

Admin panel

React application.

Backend

Laravel REST API.

Business logic belongs in Services.

Validation belongs in Form Requests.

Database access should stay inside Eloquent models unless there is a strong reason otherwise.

Avoid unnecessary Repository pattern.

---

# Coding Style

Always follow PSR-12.

Write readable code.

Prefer expressive method names.

Keep controllers thin.

Keep components small.

Extract duplicated logic into Services.

Avoid static helper classes unless appropriate.

Prefer dependency injection.

---

# Database

Database engine:

PostgreSQL

Requirements

- Foreign keys everywhere appropriate.
- Use cascading deletes only when it makes sense.
- Use indexes for searchable columns.
- Never use raw SQL when Eloquent can solve the problem cleanly.

Every migration must be reversible.

---

# React

React is used only inside the admin panel.

Use:

- Functional Components
- Hooks
- React Router
- Fetch API or Axios (one approach consistently)

Keep components focused.

Move reusable logic into custom hooks.

---

# Laravel

Use

- Form Requests
- API Resources where appropriate
- Policies for permissions
- Service classes

Avoid putting business logic inside controllers.

---

# Docker

The project is developed inside Docker.

Never assume local PHP.

Commands should be executed through Docker.

Examples:

docker compose exec php php artisan migrate

docker compose exec php composer install

docker compose exec php npm run dev

---

# Git

Write meaningful commit messages.

Keep commits focused.

Avoid mixing unrelated changes.

---

# UI Principles

The interface should be

- modern
- clean
- fast
- minimalistic

Avoid unnecessary animations.

Prefer consistency over decoration.

---

# Performance

Prefer server-side pagination.

Avoid N+1 queries.

Use eager loading when appropriate.

Cache expensive operations.

---

# Security

Never trust client input.

Validate everything.

Escape output.

Protect all admin routes.

Never expose secrets.

---

# Documentation

Whenever a significant architectural decision is made, update documentation inside

docs/

Important documents

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
- Do not introduce new libraries without a good reason.
- Explain architectural trade-offs when multiple solutions exist.
- Prefer consistency with the current codebase.

If information is missing, ask before making assumptions.