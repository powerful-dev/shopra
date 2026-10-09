<?php

namespace Tests\Feature;

use App\Models\Module;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ShopAttributeUnitApiTest extends TestCase
{
    use RefreshDatabase;

    public function test_units_require_authentication_and_product_module_access(): void
    {
        $this->getJson('/api/product-attribute-units')->assertUnauthorized();

        $this->actingAs(User::factory()->create(['is_active' => true]), 'sanctum')
            ->getJson('/api/product-attribute-units')
            ->assertForbidden();
    }

    public function test_units_are_returned_with_localized_names(): void
    {
        $this->authenticateProductAdmin();

        $this->withHeader('Accept-Language', 'ru')
            ->getJson('/api/product-attribute-units')
            ->assertOk()
            ->assertJsonCount(10, 'data')
            ->assertJsonPath('data.0.value', 'pcs')
            ->assertJsonPath('data.0.name', 'Штука')
            ->assertJsonPath('data.0.short_name', 'шт.')
            ->assertJsonPath('data.1.value', 'kg')
            ->assertJsonPath('data.1.name', 'Килограмм');

        $this->withHeader('Accept-Language', 'uk')
            ->getJson('/api/product-attribute-units')
            ->assertOk()
            ->assertJsonPath('data.1.name', 'Кілограм');

        $this->withHeader('Accept-Language', 'ua')
            ->getJson('/api/product-attribute-units')
            ->assertOk()
            ->assertJsonPath('data.1.name', 'Кілограм');

        $this->withHeader('Accept-Language', 'en')
            ->getJson('/api/product-attribute-units')
            ->assertOk()
            ->assertJsonPath('data.1.name', 'Kilogram')
            ->assertJsonPath('data.3.short_name', 'L');
    }

    private function authenticateProductAdmin(): void
    {
        $admin = User::factory()->create(['is_active' => true]);
        $module = Module::query()->create([
            'code' => 'products',
            'show_in_menu' => true,
            'is_required' => false,
        ]);
        $admin->modules()->attach($module);
        $this->actingAs($admin, 'sanctum');
    }
}
