<?php

namespace App\Services;

use App\Models\User;
use Illuminate\Auth\Access\AuthorizationException;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\Hash;
use App\Enums\Role;

class AdminService
{
    public function paginate(?string $search = null): LengthAwarePaginator
    {
        $search = trim((string) $search);

        return User::query()
            ->with([
                'roles',
                'modules:id',
            ])
            ->when($search !== '', function ($query) use ($search) {
                $query->where(function ($query) use ($search) {
                    $query
                        ->whereLike('first_name', "%{$search}%", caseSensitive: false)
                        ->orWhereLike('last_name', "%{$search}%", caseSensitive: false)
                        ->orWhereLike('email', "%{$search}%", caseSensitive: false);
                });
            })
            ->orderByDesc('created_at')
            ->paginate(10);
    }

    public function create(array $data, ?User $actor = null): User
    {
        $moduleIds = $data['module_ids'] ?? [];
        unset($data['module_ids']);

        $admin = new User();
        $admin->fill($this->preparePayload($data));
        $admin->password = Hash::make($data['password']);
        $admin->save();

        $admin->modules()->sync($moduleIds);

        return $admin;
    }

    public function update(User $admin, array $data, ?User $actor = null): User
    {
        $this->ensureCanEdit($admin, $actor);

        $moduleIds = $data['module_ids'] ?? [];
        unset($data['module_ids']);

        if (isset($data['password']) && $data['password'] !== '') {
            $admin->password = Hash::make($data['password']);
        }

        $admin->fill($this->preparePayload($data, $admin));
        $admin->save();

        if (! $admin->hasRole(Role::SuperAdmin->value)) {
            $admin->modules()->sync($moduleIds);
        }

        return $admin;
    }

    public function setStatus(User $admin, bool $isActive, ?User $actor = null): User
    {
        $this->ensureNotSelf($admin, $actor, 'You cannot disable your own account.');

        $this->ensureNotSuperAdmin(
            $admin,
            'You cannot disable the super administrator.'
        );

        $admin->is_active = $isActive;
        $admin->save();

        return $admin;
    }

    public function delete(User $admin, ?User $actor = null): void
    {
        $this->ensureNotSelf($admin, $actor, 'You cannot delete your own account.');

        $this->ensureNotSuperAdmin(
            $admin,
            'You cannot delete the super administrator.'
        );

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

    private function ensureCanEdit(User $admin, ?User $actor): void
    {
        if (
            $admin->hasRole(Role::SuperAdmin->value) &&
            ($actor === null || $actor->getKey() !== $admin->getKey())
        ) {
            throw new AuthorizationException(
                'You cannot edit the super administrator.'
            );
        }
    }

    private function ensureNotSuperAdmin(User $admin, string $message): void
    {
        if ($admin->hasRole(Role::SuperAdmin->value)) {
            throw new AuthorizationException($message);
        }
    }
}
