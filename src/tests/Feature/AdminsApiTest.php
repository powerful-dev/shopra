<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AdminsApiTest extends TestCase
{
    use RefreshDatabase;

    public function test_admins_can_be_created_and_listed_with_pagination(): void
    {
        $admin = User::factory()->create([
            'first_name' => 'Main',
            'last_name' => 'Admin',
            'is_active' => true,
        ]);

        $this->actingAs($admin, 'sanctum');

        $response = $this->postJson('/api/admins', [
            'first_name' => 'Alice',
            'last_name' => 'Johnson',
            'email' => 'alice@example.com',
            'password' => 'secret123',
            'is_active' => true,
        ]);

        $response->assertCreated();
        $response->assertJsonPath('data.first_name', 'Alice');
        $response->assertJsonPath('data.last_name', 'Johnson');
        $this->assertDatabaseHas('users', ['email' => 'alice@example.com']);

        $listResponse = $this->getJson('/api/admins');

        $listResponse->assertOk();
        $listResponse->assertJsonStructure([
            'data',
            'meta' => ['current_page', 'last_page', 'per_page', 'total'],
        ]);
    }

    public function test_current_admin_cannot_delete_themselves(): void
    {
        $admin = User::factory()->create([
            'first_name' => 'Main',
            'last_name' => 'Admin',
            'is_active' => true,
        ]);

        $this->actingAs($admin, 'sanctum');

        $response = $this->deleteJson('/api/admins/'.$admin->getKey());

        $response->assertForbidden();
        $response->assertJsonPath('message', 'You cannot delete your own account.');
    }
}
