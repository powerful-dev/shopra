<?php

namespace App\Http\Middleware;

use App\Enums\Role;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureModuleAccess
{
    public function handle(
        Request $request,
        Closure $next,
        string $moduleCode
    ): Response {
        $user = $request->user();

        if ($user->hasRole(Role::SuperAdmin->value)) {
            return $next($request);
        }

        $hasAccess = $user->modules()
            ->where('code', $moduleCode)
            ->exists();

        abort_unless($hasAccess, 403, 'Access denied.');

        return $next($request);
    }
}