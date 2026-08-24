<?php

namespace Tests\Feature;

use App\Models\Shop;
use App\Models\ShopUnit;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ShopDefaultUnitTest extends TestCase
{
    use RefreshDatabase;

    public function test_shop_can_have_a_default_unit_that_is_nullified_on_force_delete(): void
    {
        $unit = ShopUnit::query()->create([
            'code' => 'piece',
            'is_system' => true,
        ]);
        $shop = Shop::query()->create([
            'name' => 'Test shop',
            'theme' => 'other',
            'default_shop_unit_id' => $unit->getKey(),
        ]);

        $this->assertTrue($shop->defaultShopUnit->is($unit));

        $unit->forceDelete();

        $this->assertNull($shop->refresh()->default_shop_unit_id);
        $this->assertNull($shop->defaultShopUnit);
    }
}
