<?php

namespace Tests\Feature;

use App\Models\ShopGroup;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ShopGroupImageFieldTest extends TestCase
{
    use RefreshDatabase;

    public function test_shop_group_stores_the_original_image_path(): void
    {
        $group = ShopGroup::query()->create([
            'name' => 'Backpacks',
            'slug' => 'backpacks',
            'image' => 'shop/categories/1/original.webp',
        ]);

        $this->assertSame('shop/categories/1/original.webp', $group->fresh()->image);
        $this->assertDatabaseHas('shop_groups', [
            'id' => $group->id,
            'image' => 'shop/categories/1/original.webp',
        ]);
    }
}
