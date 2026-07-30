<?php

namespace Tests\Feature;

use App\Enums\Role;
use App\Models\User;
use Database\Seeders\DatabaseSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use RuntimeException;
use Tests\TestCase;

class AuthenticationTest extends TestCase
{
    use RefreshDatabase;

    public function test_user_can_login_and_retrieve_their_profile(): void
    {
        $user = User::factory()->create([
            'email' => 'admin@example.com',
            'password' => Hash::make('secret-password'),
        ]);

        $this->withHeader('Origin', 'http://localhost')->postJson('/api/login', [
            'email' => $user->email,
            'password' => 'secret-password',
            'remember' => true,
        ])->assertOk()
            ->assertJsonPath('data.email', $user->email)
            ->assertJsonMissingPath('data.password');

        $this->getJson('/api/user')->assertOk()
            ->assertJsonPath('data.id', $user->id);
    }

    public function test_invalid_credentials_return_a_validation_error(): void
    {
        $this->withHeader('Origin', 'http://localhost')->postJson('/api/login', [
            'email' => 'admin@example.com',
            'password' => 'incorrect',
        ])->assertUnprocessable()
            ->assertJsonValidationErrors('email');
    }

    public function test_current_user_endpoint_requires_authentication(): void
    {
        $this->getJson('/api/user')->assertUnauthorized();
    }

    public function test_administrator_seeder_updates_existing_user_and_assigns_super_admin_role(): void
    {
        config()->set('app.env', 'testing');
        putenv('ADMIN_NAME=Shopra Administrator');
        putenv('ADMIN_EMAIL=admin@shopra.test');
        putenv('ADMIN_PASSWORD=initial-password');

        $this->seed(DatabaseSeeder::class);

        putenv('ADMIN_NAME=Updated Administrator');
        putenv('ADMIN_PASSWORD=updated-password');
        $this->seed(DatabaseSeeder::class);

        $administrator = User::query()->where('email', 'admin@shopra.test')->sole();

        $this->assertSame('Updated Administrator', $administrator->name);
        $this->assertTrue(Hash::check('updated-password', $administrator->password));
        $this->assertTrue($administrator->hasRole(Role::SuperAdmin));
        $this->assertSame(1, User::query()->where('email', 'admin@shopra.test')->count());
    }

    public function test_administrator_seeder_reports_a_missing_environment_variable(): void
    {
        putenv('ADMIN_NAME');
        putenv('ADMIN_EMAIL');
        putenv('ADMIN_PASSWORD');

        $this->expectException(RuntimeException::class);
        $this->expectExceptionMessage('ADMIN_NAME');

        $this->seed(DatabaseSeeder::class);
    }
}
