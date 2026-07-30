<?php

namespace Database\Seeders;

use App\Enums\Role;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use RuntimeException;
use Spatie\Permission\Models\Role as RoleModel;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $admin = $this->administratorAttributes();

        $role = RoleModel::findOrCreate(Role::SuperAdmin->value, 'web');

        $user = User::query()->updateOrCreate(
            ['email' => $admin['email']],
            [
                'name' => $admin['name'],
                'password' => Hash::make($admin['password']),
            ],
        );

        $user->assignRole($role);
    }

    /**
     * @return array{name: string, email: string, password: string}
     */
    private function administratorAttributes(): array
    {
        return [
            'name' => $this->requiredEnvironmentValue('ADMIN_NAME'),
            'email' => $this->requiredEnvironmentValue('ADMIN_EMAIL'),
            'password' => $this->requiredEnvironmentValue('ADMIN_PASSWORD'),
        ];
    }

    private function requiredEnvironmentValue(string $key): string
    {
        $value = getenv($key);

        if (! is_string($value) || trim($value) === '') {
            throw new RuntimeException("Required environment variable [{$key}] is missing.");
        }

        return $value;
    }
}
