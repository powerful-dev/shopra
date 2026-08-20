<?php

namespace Tests\Feature;

use App\Models\Site;
use App\Models\SiteType;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AdminsApiTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        $siteType = SiteType::query()->create([
            'code' => 'test',
            'name' => 'Test',
        ]);

        Site::query()->create([
            'site_type_id' => $siteType->getKey(),
            'name' => 'Test',
        ]);
    }

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

    public function test_admins_can_be_searched_by_first_name_last_name_and_email(): void
    {
        $admin = User::factory()->create([
            'first_name' => 'Main',
            'last_name' => 'Admin',
            'email' => 'main@example.com',
            'is_active' => true,
        ]);
        $matchingByFirstName = User::factory()->create([
            'first_name' => 'Alexandra',
            'last_name' => 'Smith',
            'email' => 'first-name@example.com',
        ]);
        $matchingByLastName = User::factory()->create([
            'first_name' => 'John',
            'last_name' => 'Alexandrov',
            'email' => 'last-name@example.com',
        ]);
        $matchingByEmail = User::factory()->create([
            'first_name' => 'Jane',
            'last_name' => 'Smith',
            'email' => 'alex@example.com',
        ]);
        User::factory()->create([
            'first_name' => 'Maria',
            'last_name' => 'Ivanova',
            'email' => 'maria@example.com',
        ]);

        $this->actingAs($admin, 'sanctum');

        $response = $this->getJson('/api/admins?search=alex');

        $response->assertOk();
        $response->assertJsonPath('meta.total', 3);
        $response->assertJsonCount(3, 'data');
        $response->assertJsonFragment(['id' => $matchingByFirstName->getKey()]);
        $response->assertJsonFragment(['id' => $matchingByLastName->getKey()]);
        $response->assertJsonFragment(['id' => $matchingByEmail->getKey()]);
    }
}
