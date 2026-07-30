# Architecture

## Administrative authentication

The `/admin` interface is a React SPA served by Laravel. It uses same-origin Laravel Sanctum SPA authentication: the browser first obtains the Sanctum CSRF cookie, then authenticates with the session-backed `web` guard. Administrative API routes use `auth:sanctum`, so unauthenticated JSON requests receive HTTP 401.

Authentication controllers coordinate HTTP input and responses only. `AuthenticationService` owns session login and logout behaviour, while `LoginRequest` validates login input. The current-user response is shaped by `UserResource` and excludes sensitive model fields.

Roles and permissions are provided by Spatie Laravel Permission. Role identifiers are centralised in `App\\Enums\\Role`; code should refer to the enum instead of repeating role names.
