<?php

namespace Tests\Feature;

use App\Models\ShopGroup;
use App\Models\ShopItem;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ShopCatalogSoftDeleteTest extends TestCase
{
    use RefreshDatabase;

    public function test_items_and_groups_are_soft_deleted_without_removing_pivot_rows(): void
    {
        $item = ShopItem::query()->create([
            'name' => 'Test item',
            'url' => 'test-item',
            'price' => 100,
            'quantity' => 1,
            'show_stock' => true,
        ]);
        $group = ShopGroup::query()->create([
            'name' => 'Test group',
            'url' => 'test-group',
        ]);
        $item->groups()->attach($group);

        $item->delete();
        $group->delete();

        $this->assertSoftDeleted($item);
        $this->assertSoftDeleted($group);
        $this->assertDatabaseHas('shop_group_shop_item', [
            'shop_item_id' => $item->getKey(),
            'shop_group_id' => $group->getKey(),
        ]);
    }
}
