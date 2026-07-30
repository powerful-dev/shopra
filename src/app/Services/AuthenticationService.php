<?php

namespace App\Services;

use App\Models\User;
use Illuminate\Contracts\Auth\Factory as AuthFactory;
use Illuminate\Contracts\Session\Session;

class AuthenticationService
{
    public function __construct(private readonly AuthFactory $auth)
    {
    }

    /** @param array{email: string, password: string, remember?: bool} $credentials */
    public function login(array $credentials, Session $session): ?User
    {
        $authenticated = $this->auth->guard('web')->attempt(
            [
                'email' => $credentials['email'],
                'password' => $credentials['password'],
            ],
            $credentials['remember'] ?? false,
        );

        if (! $authenticated) {
            return null;
        }

        $session->regenerate();

        /** @var User $user */
        $user = $this->auth->guard('web')->user();

        return $user;
    }

    public function logout(Session $session): void
    {
        $this->auth->guard('web')->logout();
        $session->invalidate();
        $session->regenerateToken();
    }
}
