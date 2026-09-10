<?php

namespace Tests\Feature;

use App\Models\Module;
use App\Models\ShopGroup;
use App\Models\ShopItem;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ShopGroupSearchTest extends TestCase
{
    use RefreshDatabase;

    public function test_search_returns_matches_and_all_ancestors_without_duplicates(): void
    {
        $admin = User::factory()->create(['is_active' => true]);
        $module = Module::create(['code' => 'products', 'show_in_menu' => true, 'is_required' => false]);
        $admin->modules()->attach($module);
        $this->actingAs($admin, 'sanctum');

        $root = ShopGroup::create(['name' => 'Рюкзаки', 'slug' => 'backpacks']);
        $parent = $root->children()->create(['name' => 'Городские', 'slug' => 'city']);
        $first = $parent->children()->create(['name' => 'Для ноутбука', 'slug' => 'laptop']);
        $second = $parent->children()->create(['name' => 'Сумки для ноутбука', 'slug' => 'laptop-bags']);
        $parent->children()->create(['name' => 'Для школы', 'slug' => 'school']);
        ShopGroup::create(['name' => 'Удалённые для ноутбука', 'slug' => 'deleted'])->delete();
        $item = ShopItem::create(['name' => 'Item', 'url' => 'item', 'price' => 100]);
        $item->groups()->attach([$first->id, $second->id]);

        $results = $this->getJson('/api/product-categories/search?'.http_build_query(['search' => 'ноутбука']))
            ->assertOk()->assertJsonCount(4, 'data')->json('data');
        $this->assertSame([$root->id, $parent->id, $first->id, $second->id], array_column($results, 'id'));
        $this->assertSame([null, $root->id, $parent->id, $parent->id], array_column($results, 'parent_id'));
        $this->assertSame([1, 1, 1, 1], array_column($results, 'branch_count'));

        $this->getJson('/api/product-categories/search?search=missing')
            ->assertOk()->assertExactJson(['data' => []]);
        $this->getJson('/api/product-categories/search?search=x')->assertUnprocessable();
        $this->getJson('/api/product-categories/search')->assertUnprocessable();
    }

    public function test_search_requires_product_access(): void
    {
        $this->getJson('/api/product-categories/search?search=test')->assertUnauthorized();
        $this->actingAs(User::factory()->create(['is_active' => true]), 'sanctum')
            ->getJson('/api/product-categories/search?search=test')->assertForbidden();
    }
}
