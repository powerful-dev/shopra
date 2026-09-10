<?php

namespace Tests\Feature;

use App\Http\Resources\ShopGroupResource;
use App\Models\Module;
use App\Models\ShopGroup;
use App\Models\ShopItem;
use App\Models\User;
use App\Services\ShopGroupService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ShopGroupBranchCountTest extends TestCase
{
    use RefreshDatabase;

    public function test_counts_include_unique_items_from_the_entire_active_branch(): void
    {
        $admin = User::factory()->create(['is_active' => true]);
        $module = Module::query()->create(['code' => 'products', 'show_in_menu' => true, 'is_required' => false]);
        $admin->modules()->attach($module);
        $this->actingAs($admin, 'sanctum');

        $root = ShopGroup::create(['name' => 'Root', 'slug' => 'root']);
        $child = $root->children()->create(['name' => 'Child', 'slug' => 'child']);
        $sibling = $root->children()->create(['name' => 'Sibling', 'slug' => 'sibling']);
        $grandchild = $child->children()->create(['name' => 'Grandchild', 'slug' => 'grandchild']);
        $leaf = $grandchild->children()->create(['name' => 'Leaf', 'slug' => 'leaf']);
        $other = ShopGroup::create(['name' => 'Other', 'slug' => 'other']);
        $empty = ShopGroup::create(['name' => 'Empty', 'slug' => 'empty']);
        $deleted = $root->children()->create(['name' => 'Deleted', 'slug' => 'deleted']);

        $this->item('direct', [$root]);
        $this->item('shared', [$root, $child, $sibling, $leaf, $other]);
        $this->item('deep', [$leaf]);
        $this->item('outside', [$other]);
        $this->item('deleted-item', [$root, $leaf])->delete();
        $this->item('deleted-category-item', [$deleted]);
        $deleted->delete();

        $roots = $this->getJson('/api/product-categories/roots')->assertOk()->json('data');
        $this->assertSame([$root->id => 3, $other->id => 2, $empty->id => 0], array_column($roots, 'branch_count', 'id'));

        $children = $this->getJson("/api/product-categories/{$root->id}/children")->assertOk()->json('data');
        $this->assertSame([$child->id => 2, $sibling->id => 1], array_column($children, 'branch_count', 'id'));
        $this->getJson("/api/product-categories/{$child->id}/children")
            ->assertOk()->assertJsonPath('data.0.branch_count', 2);
        $this->getJson("/api/product-categories/{$grandchild->id}/children")
            ->assertOk()->assertJsonPath('data.0.branch_count', 2);

        $all = $this->getJson('/api/product-categories')->assertOk()->json('data');
        $this->assertSame(3, array_column($all, 'branch_count', 'id')[$root->id]);

        $loadedRoot = app(ShopGroupService::class)->roots()->firstWhere('id', $root->id);
        $loadedRoot->setAttribute('items_count', 99);
        $loadedRoot->setAttribute('count', 48);
        $payload = (new ShopGroupResource($loadedRoot))->resolve();
        $this->assertSame(3, $payload['branch_count']);
        $this->assertArrayNotHasKey('count', $payload);
        $this->assertArrayNotHasKey('items_count', $payload);

        $this->postJson('/api/product-categories', ['name' => 'New', 'slug' => 'new'])
            ->assertCreated()->assertJsonPath('data.branch_count', 0);
    }

    private function item(string $slug, array $groups): ShopItem
    {
        $item = ShopItem::create(['name' => $slug, 'url' => $slug, 'price' => 100]);
        $item->groups()->attach(array_map(fn (ShopGroup $group) => $group->id, $groups));

        return $item;
    }
}
