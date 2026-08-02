<?php

namespace Database\Seeders;

use App\Enums\Role;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use RuntimeException;
use Spatie\Permission\Models\Role as RoleModel;

class AdminSeeder extends Seeder
{
    public function run(): void
    {
        $role = RoleModel::findOrCreate(Role::SuperAdmin->value, 'web');

        $admin = $this->administratorAttributes();

        $user = User::query()->updateOrCreate(
            ['email' => $admin['email']],
            [
                'name' => $admin['name'],
                'first_name' => $this->splitName($admin['name'])[0],
                'last_name' => $this->splitName($admin['name'])[1],
                'password' => Hash::make($admin['password']),
                'is_active' => true,
            ],
        );

        $user->assignRole($role);

        $existingEmails = User::query()->pluck('email')->all();

        for ($i = 0; $i < 30; $i++) {
            $email = fake()->unique()->safeEmail();

            while (in_array($email, $existingEmails, true)) {
                $email = fake()->unique()->safeEmail();
            }

            $firstName = fake()->firstName();
            $lastName = fake()->lastName();

            $adminUser = User::query()->create([
                'name' => trim($firstName.' '.$lastName),
                'first_name' => $firstName,
                'last_name' => $lastName,
                'email' => $email,
                'password' => Hash::make('password'),
                'is_active' => fake()->boolean(),
            ]);

            $adminUser->assignRole($role);
            $existingEmails[] = $email;
        }
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

    /**
     * @return array{0: string, 1: string}
     */
    private function splitName(string $name): array
    {
        $parts = preg_split('/\s+/', trim($name)) ?: [''];
        $parts = array_values(array_filter($parts, static fn (string $part): bool => $part !== ''));
        $lastName = count($parts) > 1 ? implode(' ', array_slice($parts, 1)) : '';

        return [
            $parts[0] ?? '',
            $lastName,
        ];
    }
}
