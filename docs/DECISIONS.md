# Decisions

## Session-based Sanctum SPA authentication

The admin SPA and API are served from the same application origin. We use Laravel Sanctum's stateful SPA middleware and Laravel session cookies instead of personal-access bearer tokens. This gives browser requests CSRF protection and lets Laravel's existing session lifecycle handle the optional remember-me cookie.

## Environment-provisioned bootstrap administrator

`DatabaseSeeder` provisions the initial administrator from `ADMIN_NAME`, `ADMIN_EMAIL`, and `ADMIN_PASSWORD`. The seed fails early with the missing variable name if configuration is incomplete. It uses the email as the natural key, updates the name and password on subsequent runs, and assigns the centralised Super Admin role without duplicating users or role assignments.
