<?php

namespace Tests\Feature;

use App\Models\Module;
use App\Models\ShopGroup;
use App\Models\User;
use App\Services\ShopGroupService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ShopGroupApiTest extends TestCase
{
    use RefreshDatabase;

    public function test_categories_include_hierarchy_and_follow_manual_order(): void
    {
        $admin = User::factory()->create(['is_active' => true]);
        $module = Module::query()->create(['code' => 'products', 'show_in_menu' => true, 'is_required' => false]);
        $admin->modules()->attach($module);

        $parent = ShopGroup::query()->create(['name' => 'Рюкзаки', 'slug' => 'backpacks', 'sorting' => 2]);
        $child = $parent->children()->create(['name' => 'Городские', 'slug' => 'city', 'sorting' => 3]);
        $grandchild = $child->children()->create(['name' => 'Для ноутбука', 'slug' => 'laptop', 'sorting' => 4]);
        $first = ShopGroup::query()->create(['name' => 'Сумки', 'slug' => 'bags', 'sorting' => 1]);
        ShopGroup::query()->create(['name' => 'Deleted', 'slug' => 'deleted'])->delete();

        $this->actingAs($admin, 'sanctum')->getJson('/api/product-categories')
            ->assertOk()
            ->assertExactJson(['data' => [
                ['id' => $first->id, 'parent_id' => null, 'name' => 'Сумки', 'branch_count' => 0],
                ['id' => $parent->id, 'parent_id' => null, 'name' => 'Рюкзаки', 'branch_count' => 0],
                ['id' => $child->id, 'parent_id' => $parent->id, 'name' => 'Городские', 'branch_count' => 0],
                ['id' => $grandchild->id, 'parent_id' => $child->id, 'name' => 'Для ноутбука', 'branch_count' => 0],
            ]]);

        $this->getJson('/api/product-categories/roots')
            ->assertOk()
            ->assertExactJson(['data' => [
                ['id' => $first->id, 'parent_id' => null, 'name' => 'Сумки', 'branch_count' => 0, 'has_children' => false],
                ['id' => $parent->id, 'parent_id' => null, 'name' => 'Рюкзаки', 'branch_count' => 0, 'has_children' => true],
            ]]);

        $roots = app(ShopGroupService::class)->roots();
        foreach ($roots as $root) {
            $this->assertFalse($root->relationLoaded('children'));
        }

        $this->getJson("/api/product-categories/{$parent->id}/children")
            ->assertOk()->assertExactJson(['data' => [
                ['id' => $child->id, 'parent_id' => $parent->id, 'name' => 'Городские', 'branch_count' => 0, 'has_children' => true],
            ]]);
        $this->getJson("/api/product-categories/{$child->id}/children")
            ->assertOk()->assertExactJson(['data' => [
                ['id' => $grandchild->id, 'parent_id' => $child->id, 'name' => 'Для ноутбука', 'branch_count' => 0, 'has_children' => false],
            ]]);
        $this->getJson("/api/product-categories/{$first->id}/children")
            ->assertOk()->assertExactJson(['data' => []]);
        $this->getJson('/api/product-categories/999999/children')->assertNotFound();

        $child->delete();
        $this->getJson("/api/product-categories/{$child->id}/children")->assertNotFound();
        $this->getJson("/api/product-categories/{$parent->id}/children")
            ->assertOk()->assertExactJson(['data' => []]);
        $this->getJson('/api/product-categories/roots')
            ->assertOk()->assertJsonPath('data.1.has_children', false);
    }

    public function test_categories_require_authentication_and_product_module_access(): void
    {
        $this->getJson('/api/product-categories')->assertUnauthorized();
        $this->getJson('/api/product-categories/roots')->assertUnauthorized();
        $this->getJson('/api/product-categories/1/children')->assertUnauthorized();
        $this->postJson('/api/product-categories', [])->assertUnauthorized();
        $this->getJson('/api/product-categories/slug?value=test')->assertUnauthorized();

        $this->actingAs(User::factory()->create(['is_active' => true]), 'sanctum')
            ->getJson('/api/product-categories')->assertForbidden();
        $this->getJson('/api/product-categories/slug?value=test')->assertForbidden();
        $this->getJson('/api/product-categories/roots')->assertForbidden();
        $this->postJson('/api/product-categories', [])->assertForbidden();
    }

    public function test_categories_can_be_created_and_invalid_data_is_rejected(): void
    {
        $admin = User::factory()->create(['is_active' => true]);
        $module = Module::query()->create(['code' => 'products', 'show_in_menu' => true, 'is_required' => false]);
        $admin->modules()->attach($module);
        $this->actingAs($admin, 'sanctum');

        $parentId = $this->postJson('/api/product-categories', ['name' => 'Подарки', 'slug' => 'podarki'])
            ->assertCreated()->json('data.id');
        $childId = $this->postJson('/api/product-categories', ['name' => 'Детям', 'slug' => 'detyam', 'parent_id' => $parentId])
            ->assertCreated()->assertJsonPath('data.parent_id', $parentId)->json('data.id');
        $this->assertDatabaseHas('shop_groups', ['id' => $childId, 'name' => 'Детям', 'slug' => 'detyam', 'parent_id' => $parentId, 'sorting' => 0]);
        $this->getJson('/api/product-categories')->assertOk()->assertJsonCount(2, 'data');

        $this->postJson('/api/product-categories', [])->assertUnprocessable()->assertJsonValidationErrors(['name', 'slug']);
        $this->postJson('/api/product-categories', ['name' => 'Test', 'slug' => 'podarki'])
            ->assertUnprocessable()->assertJsonValidationErrors('slug');
        $this->postJson('/api/product-categories', ['name' => 'Test', 'slug' => '/catalog/Test!', 'parent_id' => 99999])
            ->assertUnprocessable()->assertJsonValidationErrors(['slug', 'parent_id']);
        ShopGroup::findOrFail($parentId)->delete();
        $this->postJson('/api/product-categories', ['name' => 'Test', 'slug' => 'podarki', 'parent_id' => $parentId])
            ->assertUnprocessable()->assertJsonValidationErrors(['slug', 'parent_id']);
        $this->assertDatabaseCount('shop_groups', 2);
    }

    public function test_slug_is_normalized_and_unique_without_creating_a_category(): void
    {
        $admin = User::factory()->create(['is_active' => true]);
        $module = Module::query()->create(['code' => 'products', 'show_in_menu' => true, 'is_required' => false]);
        $admin->modules()->attach($module);
        $this->actingAs($admin, 'sanctum');

        $this->getJson('/api/product-categories/slug?'.http_build_query(['value' => 'Подарки']))
            ->assertOk()->assertJsonPath('data.slug', 'podarki');
        ShopGroup::query()->create(['name' => 'Подарки', 'slug' => 'podarki']);
        $this->getJson('/api/product-categories/slug?'.http_build_query(['value' => 'Подарки']))
            ->assertOk()->assertJsonPath('data.slug', 'podarki-2');
        ShopGroup::query()->create(['name' => 'Deleted', 'slug' => 'podarki-2'])->delete();
        $this->getJson('/api/product-categories/slug?'.http_build_query(['value' => 'Подарки']))
            ->assertOk()->assertJsonPath('data.slug', 'podarki-3');
        $this->getJson('/api/product-categories/slug?'.http_build_query(['value' => '  Подарки для ДРУЗЕЙ!!!  ']))
            ->assertOk()->assertJsonPath('data.slug', 'podarki-dlya-druzey');
        $this->getJson('/api/product-categories/slug?value=My-CUSTOM-url!')
            ->assertOk()->assertJsonPath('data.slug', 'my-custom-url');
        $this->getJson('/api/product-categories/slug?value=!!!')
            ->assertOk()->assertJsonPath('data.slug', 'category');
        $this->getJson('/api/product-categories/slug?value=')
            ->assertUnprocessable()->assertJsonValidationErrors('value');
        $this->assertDatabaseCount('shop_groups', 2);
    }
}
