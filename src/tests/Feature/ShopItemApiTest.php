<?php

namespace Tests\Feature;

use App\Models\Module;
use App\Models\ShopGroup;
use App\Models\ShopItem;
use App\Models\ShopUnit;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ShopItemApiTest extends TestCase
{
    use RefreshDatabase;

    public function test_products_are_returned_with_all_their_categories(): void
    {
        $admin = User::factory()->create(['is_active' => true]);
        $productsModule = Module::query()->create([
            'code' => 'products',
            'show_in_menu' => true,
            'is_required' => false,
        ]);
        $admin->modules()->attach($productsModule);

        $pieceUnit = ShopUnit::query()->create([
            'code' => 'piece',
            'is_system' => true,
        ]);
        $item = ShopItem::query()->create([
            'name' => 'Сумка-рюкзак Urban Flex',
            'url' => 'sumka-ryukzak-urban-flex',
            'price' => 4990,
            'old_price' => 5690,
            'quantity' => 8,
            'show_stock' => true,
            'shop_unit_id' => $pieceUnit->getKey(),
        ]);
        $groups = collect([
            ShopGroup::query()->create(['name' => 'Сумки', 'url' => 'sumki']),
            ShopGroup::query()->create(['name' => 'Рюкзаки', 'url' => 'ryukzaki']),
        ]);
        $item->groups()->attach($groups->pluck('id'));

        foreach (range(1, 20) as $index) {
            ShopItem::query()->create([
                'name' => "Товар {$index}",
                'url' => "tovar-{$index}",
                'price' => 1000 + $index,
                'quantity' => $index,
                'show_stock' => true,
                'status' => $index <= 5 ? 'active' : 'draft',
            ]);
        }

        $this->actingAs($admin, 'sanctum');

        $this->getJson('/api/products?page=1')
            ->assertOk()
            ->assertJsonPath('data.0.name', 'Сумка-рюкзак Urban Flex')
            ->assertJsonPath('data.0.quantity', 8)
            ->assertJsonPath('data.0.status', 'draft')
            ->assertJsonPath('data.0.unit.code', 'piece')
            ->assertJsonPath('data.0.unit.short_name', null)
            ->assertJsonPath('data.0.unit.is_system', true)
            ->assertJsonCount(2, 'data.0.categories')
            ->assertJsonPath('data.0.categories.0.name', 'Сумки')
            ->assertJsonPath('data.0.categories.1.name', 'Рюкзаки')
            ->assertJsonCount(15, 'data')
            ->assertJsonPath('meta.current_page', 1)
            ->assertJsonPath('meta.last_page', 2)
            ->assertJsonPath('meta.total', 21)
            ->assertJsonPath('summary.total', 21)
            ->assertJsonPath('summary.active', 5)
            ->assertJsonPath('summary.draft', 16)
            ->assertJsonPath('summary.low_stock', 4);

        $this->getJson('/api/products?page=2')
            ->assertOk()
            ->assertJsonCount(6, 'data')
            ->assertJsonPath('data.0.unit', null)
            ->assertJsonPath('meta.current_page', 2)
            ->assertJsonPath('meta.total', 21);

        $this->getJson('/api/products?search=urban')
            ->assertOk()
            ->assertJsonCount(1, 'data')
            ->assertJsonPath('data.0.name', 'Сумка-рюкзак Urban Flex')
            ->assertJsonPath('meta.total', 1);

        $filters = http_build_query([
            'search' => 'Товар 1',
            'status' => 'active',
            'stock' => 'low',
        ]);

        $this->getJson('/api/products?'.$filters)
            ->assertOk()
            ->assertJsonCount(1, 'data')
            ->assertJsonPath('data.0.name', 'Товар 1')
            ->assertJsonPath('data.0.status', 'active')
            ->assertJsonPath('meta.total', 1)
            ->assertJsonPath('summary.total', 21)
            ->assertJsonPath('summary.active', 5)
            ->assertJsonPath('summary.draft', 16)
            ->assertJsonPath('summary.low_stock', 4);
    }
}
