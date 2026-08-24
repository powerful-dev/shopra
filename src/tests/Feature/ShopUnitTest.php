<?php

namespace Tests\Feature;

use App\Models\ShopItem;
use App\Models\ShopUnit;
use Database\Seeders\ShopUnitSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ShopUnitTest extends TestCase
{
    use RefreshDatabase;

    public function test_system_units_are_seeded_and_related_to_items(): void
    {
        $this->seed(ShopUnitSeeder::class);

        $this->assertDatabaseCount('shop_units', 10);

        $piece = ShopUnit::query()->where('code', 'piece')->sole();

        $this->assertTrue($piece->is_system);
        $this->assertNull($piece->name);
        $this->assertNull($piece->short_name);

        $item = ShopItem::query()->create([
            'name' => 'Test item',
            'url' => 'test-item',
            'price' => 100,
            'quantity' => 1,
            'show_stock' => true,
            'shop_unit_id' => $piece->getKey(),
        ]);

        $this->assertTrue($item->unit->is($piece));
        $this->assertTrue($piece->items->contains($item));

        $piece->delete();

        $this->assertSoftDeleted($piece);
        $this->assertDatabaseHas('shop_items', [
            'id' => $item->getKey(),
            'shop_unit_id' => $piece->getKey(),
        ]);
    }
}
