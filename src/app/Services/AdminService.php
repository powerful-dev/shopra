<?php

namespace App\Services;

use App\Models\User;
use Illuminate\Auth\Access\AuthorizationException;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\Hash;

class AdminService
{
    public function paginate(): LengthAwarePaginator
    {
        return User::query()
            ->orderByDesc('created_at')
            ->paginate(10);
    }

    public function create(array $data, ?User $actor = null): User
    {
        $admin = new User();
        $admin->fill($this->preparePayload($data));
        $admin->password = Hash::make($data['password']);
        $admin->save();

        return $admin;
    }

    public function update(User $admin, array $data, ?User $actor = null): User
    {
        if (isset($data['password']) && $data['password'] !== '') {
            $data['password'] = Hash::make($data['password']);
        } else {
            unset($data['password']);
        }

        $admin->fill($this->preparePayload($data, $admin));
        $admin->save();

        return $admin;
    }

    public function setStatus(User $admin, bool $isActive, ?User $actor = null): User
    {
        $this->ensureNotSelf($admin, $actor, 'You cannot disable your own account.');

        $admin->is_active = $isActive;
        $admin->save();

        return $admin;
    }

    public function delete(User $admin, ?User $actor = null): void
    {
        $this->ensureNotSelf($admin, $actor, 'You cannot delete your own account.');

        $admin->delete();
    }

    private function preparePayload(array $data, ?User $admin = null): array
    {
        $payload = [];

        foreach (['first_name', 'last_name', 'email', 'is_active'] as $field) {
            if (array_key_exists($field, $data)) {
                $payload[$field] = $data[$field];
            }
        }

        if (array_key_exists('first_name', $data) || array_key_exists('last_name', $data)) {
            $payload['name'] = trim(($data['first_name'] ?? $admin?->first_name ?? '').' '.($data['last_name'] ?? $admin?->last_name ?? ''));
        }

        if (! array_key_exists('is_active', $payload) && $admin === null) {
            $payload['is_active'] = true;
        }

        return $payload;
    }

    private function ensureNotSelf(User $admin, ?User $actor, string $message): void
    {
        if ($actor !== null && $actor->getKey() === $admin->getKey()) {
            throw new AuthorizationException($message);
        }
    }
}
