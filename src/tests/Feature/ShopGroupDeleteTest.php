<?php

namespace Tests\Feature;

use App\Models\Module;
use App\Models\ShopGroup;
use App\Models\ShopItem;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ShopGroupDeleteTest extends TestCase
{
    use RefreshDatabase;

    public function test_deleting_a_category_soft_deletes_its_branch_and_detaches_products(): void
    {
        $this->signIn();

        $before = ShopGroup::create(['name' => 'Before', 'slug' => 'before', 'sorting' => 0]);
        $root = ShopGroup::create(['name' => 'Root', 'slug' => 'root', 'sorting' => 1]);
        $after = ShopGroup::create(['name' => 'After', 'slug' => 'after', 'sorting' => 2]);
        $child = $root->children()->create(['name' => 'Child', 'slug' => 'child']);
        $leaf = $child->children()->create(['name' => 'Leaf', 'slug' => 'leaf']);
        $item = ShopItem::create(['name' => 'Item', 'url' => 'item', 'price' => 100]);
        $item->groups()->attach([$root->id, $child->id, $leaf->id, $after->id]);

        $this->deleteJson("/api/product-categories/{$root->id}")->assertNoContent();

        foreach ([$root, $child, $leaf] as $deleted) {
            $this->assertSoftDeleted('shop_groups', ['id' => $deleted->id]);
            $this->assertDatabaseMissing('shop_group_shop_item', ['shop_group_id' => $deleted->id]);
        }

        $this->assertDatabaseHas('shop_items', ['id' => $item->id, 'deleted_at' => null]);
        $this->assertDatabaseHas('shop_group_shop_item', ['shop_group_id' => $after->id, 'shop_item_id' => $item->id]);
        $this->assertSame([$before->id, $after->id], ShopGroup::orderBy('sorting')->pluck('id')->all());
        $this->assertSame([0, 1], ShopGroup::orderBy('sorting')->pluck('sorting')->all());
    }

    public function test_deleting_a_child_keeps_its_parent_and_siblings(): void
    {
        $this->signIn();

        $root = ShopGroup::create(['name' => 'Root', 'slug' => 'root']);
        $first = $root->children()->create(['name' => 'First', 'slug' => 'first', 'sorting' => 0]);
        $deleted = $root->children()->create(['name' => 'Deleted', 'slug' => 'deleted', 'sorting' => 1]);
        $last = $root->children()->create(['name' => 'Last', 'slug' => 'last', 'sorting' => 2]);

        $this->deleteJson("/api/product-categories/{$deleted->id}")->assertNoContent();

        $this->assertDatabaseHas('shop_groups', ['id' => $root->id, 'deleted_at' => null]);
        $this->assertSame([$first->id, $last->id], $root->children()->orderBy('sorting')->pluck('id')->all());
        $this->assertSame([0, 1], $root->children()->orderBy('sorting')->pluck('sorting')->all());
    }

    public function test_delete_requires_product_access(): void
    {
        $this->deleteJson('/api/product-categories/1')->assertUnauthorized();

        $group = ShopGroup::create(['name' => 'Group', 'slug' => 'group']);
        $this->actingAs(User::factory()->create(['is_active' => true]), 'sanctum')
            ->deleteJson("/api/product-categories/{$group->id}")->assertForbidden();
    }

    private function signIn(): void
    {
        $admin = User::factory()->create(['is_active' => true]);
        $module = Module::create(['code' => 'products', 'show_in_menu' => true, 'is_required' => false]);
        $admin->modules()->attach($module);
        $this->actingAs($admin, 'sanctum');
    }
}
