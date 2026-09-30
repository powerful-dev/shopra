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
            ShopGroup::query()->create(['name' => 'Сумки', 'slug' => 'sumki']),
            ShopGroup::query()->create(['name' => 'Рюкзаки', 'slug' => 'ryukzaki']),
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

        $createdProductId = $this->postJson('/api/products', [
            'name' => 'Новый товар',
            'price' => 1200,
            'old_price' => null,
            'quantity' => 3,
            'description' => '<p>Описание нового товара</p>',
            'shop_group_id' => $groups->first()->id,
            'status' => 'draft',
        ])
            ->assertCreated()
            ->assertJsonPath('data.status', 'draft')
            ->assertJsonPath('data.description', '<p>Описание нового товара</p>')
            ->assertJsonPath('data.shop_group_id', $groups->first()->id)
            ->json('data.id');

        $this->assertDatabaseMissing('shop_group_shop_item', [
            'shop_item_id' => $createdProductId,
            'shop_group_id' => $groups->first()->id,
        ]);

        $emptyDraftId = $this->postJson('/api/products', [
            'name' => null,
            'price' => 0,
            'old_price' => null,
            'quantity' => 0,
            'description' => null,
            'status' => 'draft',
        ])
            ->assertCreated()
            ->assertJsonPath('data.name', null)
            ->assertJsonPath('data.status', 'draft')
            ->json('data.id');

        $this->assertDatabaseHas('shop_items', [
            'id' => $emptyDraftId,
            'name' => null,
            'status' => 'draft',
        ]);
        ShopItem::query()->findOrFail($emptyDraftId)->forceDelete();

        $this->postJson('/api/products', [
            'name' => null,
            'price' => 0,
            'quantity' => 0,
            'status' => 'active',
        ])->assertUnprocessable()->assertJsonValidationErrors('name');

        $this->putJson("/api/products/{$createdProductId}", [
            'name' => 'Опубликованный товар',
            'price' => 1300,
            'old_price' => 1500,
            'quantity' => 4,
            'description' => '<p>Обновлённое описание товара</p>',
            'shop_group_id' => $groups->last()->id,
            'status' => 'active',
        ])
            ->assertOk()
            ->assertJsonPath('data.name', 'Опубликованный товар')
            ->assertJsonPath('data.description', '<p>Обновлённое описание товара</p>')
            ->assertJsonPath('data.shop_group_id', $groups->last()->id)
            ->assertJsonPath('data.status', 'active');

        $this->assertDatabaseHas('shop_items', [
            'id' => $createdProductId,
            'status' => 'active',
            'quantity' => 4,
            'description' => '<p>Обновлённое описание товара</p>',
            'shop_group_id' => $groups->last()->id,
        ]);

        $this->putJson("/api/products/{$createdProductId}", [
            'name' => 'Опубликованный товар',
            'price' => 1300,
            'old_price' => 1500,
            'quantity' => 4,
            'shop_group_id' => null,
            'status' => 'archived',
        ])
            ->assertOk()
            ->assertJsonPath('data.shop_group_id', null)
            ->assertJsonPath('data.status', 'archived');

        $this->putJson("/api/products/{$createdProductId}", [
            'name' => 'Опубликованный товар',
            'price' => 1300,
            'old_price' => null,
            'quantity' => 4,
            'status' => 'unknown',
        ])->assertUnprocessable()->assertJsonValidationErrors('status');

        ShopItem::query()->findOrFail($createdProductId)->delete();

        $this->getJson("/api/products/{$item->id}")
            ->assertOk()
            ->assertJsonPath('data.id', $item->id)
            ->assertJsonPath('data.name', 'Сумка-рюкзак Urban Flex')
            ->assertJsonPath('data.price', '4990.00')
            ->assertJsonPath('data.old_price', '5690.00')
            ->assertJsonPath('data.quantity', 8);

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

        $this->getJson('/api/products?'.http_build_query([
            'category_id' => $groups->first()->id,
        ]))
            ->assertOk()
            ->assertJsonCount(1, 'data')
            ->assertJsonPath('data.0.name', 'Сумка-рюкзак Urban Flex')
            ->assertJsonPath('meta.total', 1);

        $this->getJson('/api/products?'.http_build_query([
            'search' => 'Товар',
            'category_id' => $groups->first()->id,
        ]))
            ->assertOk()
            ->assertJsonCount(0, 'data')
            ->assertJsonPath('meta.total', 0);

        $this->getJson('/api/products?category_id=999999')
            ->assertUnprocessable()
            ->assertJsonValidationErrors('category_id');

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

        $this->deleteJson("/api/products/{$item->id}")
            ->assertNoContent();

        $this->assertSoftDeleted('shop_items', ['id' => $item->id]);
        $this->assertDatabaseHas('shop_group_shop_item', [
            'shop_item_id' => $item->id,
            'shop_group_id' => $groups->first()->id,
        ]);

        $this->getJson('/api/products?search=urban')
            ->assertOk()
            ->assertJsonCount(0, 'data')
            ->assertJsonPath('meta.total', 0)
            ->assertJsonPath('summary.total', 20);
    }

    public function test_products_can_be_bulk_soft_deleted(): void
    {
        $admin = User::factory()->create(['is_active' => true]);
        $productsModule = Module::query()->create([
            'code' => 'products',
            'show_in_menu' => true,
            'is_required' => false,
        ]);
        $admin->modules()->attach($productsModule);

        $products = collect(range(1, 3))->map(fn (int $index) => ShopItem::query()->create([
            'name' => "Товар {$index}",
            'url' => "product-{$index}",
            'price' => 1000 + $index,
        ]));

        $this->actingAs($admin, 'sanctum');

        $this->deleteJson('/api/products/bulk', [
            'ids' => [$products[0]->id, $products[1]->id],
        ])->assertNoContent();

        $this->assertSoftDeleted('shop_items', ['id' => $products[0]->id]);
        $this->assertSoftDeleted('shop_items', ['id' => $products[1]->id]);
        $this->assertDatabaseHas('shop_items', [
            'id' => $products[2]->id,
            'deleted_at' => null,
        ]);

        $this->deleteJson('/api/products/bulk', [
            'ids' => [$products[0]->id],
        ])->assertUnprocessable()->assertJsonValidationErrors('ids.0');

        $this->deleteJson('/api/products/bulk', [
            'ids' => [$products[2]->id, $products[2]->id],
        ])->assertUnprocessable()->assertJsonValidationErrors('ids.1');
    }

    public function test_product_can_be_attached_to_and_detached_from_store_category_without_changing_its_primary_group(): void
    {
        $admin = User::factory()->create(['is_active' => true]);
        $productsModule = Module::query()->create([
            'code' => 'products',
            'show_in_menu' => true,
            'is_required' => false,
        ]);
        $admin->modules()->attach($productsModule);

        $group = ShopGroup::query()->create(['name' => 'Сумки', 'slug' => 'sumki']);
        $item = ShopItem::query()->create([
            'name' => 'Сумка',
            'url' => 'sumka',
            'price' => 1000,
            'shop_group_id' => $group->id,
        ]);

        $this->actingAs($admin, 'sanctum')
            ->postJson("/api/products/{$item->id}/categories/{$group->id}")
            ->assertOk()
            ->assertJsonPath('data.categories.0.id', $group->id)
            ->assertJsonPath('data.categories.0.name', 'Сумки');

        $this->assertDatabaseHas('shop_group_shop_item', [
            'shop_item_id' => $item->id,
            'shop_group_id' => $group->id,
        ]);

        $this->postJson("/api/products/{$item->id}/categories/{$group->id}")
            ->assertOk();
        $this->assertDatabaseCount('shop_group_shop_item', 1);

        $this->deleteJson("/api/products/{$item->id}/categories/{$group->id}")
            ->assertNoContent();

        $this->assertDatabaseMissing('shop_group_shop_item', [
            'shop_item_id' => $item->id,
            'shop_group_id' => $group->id,
        ]);
        $this->assertDatabaseHas('shop_groups', [
            'id' => $group->id,
            'deleted_at' => null,
        ]);
        $this->assertDatabaseHas('shop_items', [
            'id' => $item->id,
            'shop_group_id' => $group->id,
        ]);
    }
}
