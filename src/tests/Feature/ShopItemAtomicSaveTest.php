<?php

namespace Tests\Feature;

use App\Enums\ShopAttributeType;
use App\Models\Module;
use App\Models\Shop;
use App\Models\ShopAttribute;
use App\Models\ShopItem;
use App\Models\User;
use App\Services\ShopItemAttributeService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use RuntimeException;
use Tests\TestCase;

class ShopItemAtomicSaveTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        Shop::query()->create([
            'name' => 'Test shop',
            'theme' => 'other',
            'currency' => 'UAH',
        ]);

        $module = Module::query()->create([
            'code' => 'products',
            'show_in_menu' => true,
            'is_required' => false,
        ]);
        $admin = User::factory()->create(['is_active' => true]);
        $admin->modules()->attach($module);

        $this->actingAs($admin, 'sanctum');
    }

    public function test_product_and_attributes_can_be_created_in_one_request(): void
    {
        $material = $this->createAttribute('Material', ShopAttributeType::Text);
        $available = $this->createAttribute('Available', ShopAttributeType::Boolean);

        $productId = $this->postJson('/api/products', [
            ...$this->productData('Atomic product', 'active'),
            'attributes' => [
                ['attribute_id' => $material->id, 'value' => 'Leather', 'sort_order' => 0],
                ['attribute_id' => $available->id, 'value' => true, 'sort_order' => 1],
            ],
        ])->assertCreated()
            ->assertJsonPath('data.status', 'active')
            ->json('data.id');

        $this->assertDatabaseHas('shop_item_attributes', [
            'shop_item_id' => $productId,
            'attribute_id' => $material->id,
            'text_value' => 'Leather',
            'sort_order' => 0,
        ]);
        $this->assertDatabaseHas('shop_item_attributes', [
            'shop_item_id' => $productId,
            'attribute_id' => $available->id,
            'boolean_value' => true,
            'sort_order' => 1,
        ]);
    }

    public function test_omitted_attributes_are_preserved_and_an_empty_array_removes_them(): void
    {
        $material = $this->createAttribute('Material', ShopAttributeType::Text);
        $product = $this->createProduct('Original product');
        $product->itemAttributes()->create([
            'attribute_id' => $material->id,
            'text_value' => 'Leather',
            'sort_order' => 0,
        ]);

        $this->putJson("/api/products/{$product->id}", $this->productData('Updated product'))
            ->assertOk();

        $this->assertDatabaseHas('shop_item_attributes', [
            'shop_item_id' => $product->id,
            'attribute_id' => $material->id,
            'text_value' => 'Leather',
        ]);

        $this->putJson("/api/products/{$product->id}", [
            ...$this->productData('Product without attributes'),
            'attributes' => [],
        ])->assertOk();

        $this->assertDatabaseMissing('shop_item_attributes', [
            'shop_item_id' => $product->id,
        ]);
    }

    public function test_product_and_attributes_can_be_updated_in_one_request(): void
    {
        $material = $this->createAttribute('Material', ShopAttributeType::Text);
        $weight = $this->createAttribute('Weight', ShopAttributeType::Number);
        $product = $this->createProduct('Draft product');
        $product->itemAttributes()->create([
            'attribute_id' => $material->id,
            'text_value' => 'Leather',
            'sort_order' => 0,
        ]);

        $this->putJson("/api/products/{$product->id}", [
            ...$this->productData('Published product', 'active'),
            'attributes' => [
                ['attribute_id' => $weight->id, 'value' => '1.25', 'sort_order' => 0],
            ],
        ])->assertOk()
            ->assertJsonPath('data.status', 'active');

        $this->assertDatabaseHas('shop_items', [
            'id' => $product->id,
            'name' => 'Published product',
            'status' => 'active',
        ]);
        $this->assertDatabaseMissing('shop_item_attributes', [
            'shop_item_id' => $product->id,
            'attribute_id' => $material->id,
        ]);
        $this->assertDatabaseHas('shop_item_attributes', [
            'shop_item_id' => $product->id,
            'attribute_id' => $weight->id,
            'number_value' => '1.250000',
            'sort_order' => 0,
        ]);
    }

    public function test_attribute_validation_prevents_product_changes(): void
    {
        $weight = $this->createAttribute('Weight', ShopAttributeType::Number);
        $product = $this->createProduct('Draft product');

        $this->putJson("/api/products/{$product->id}", [
            ...$this->productData('Published product', 'active'),
            'attributes' => [
                ['attribute_id' => $weight->id, 'value' => 'heavy', 'sort_order' => 0],
            ],
        ])->assertUnprocessable()
            ->assertJsonValidationErrors('attributes.0.value');

        $this->assertDatabaseHas('shop_items', [
            'id' => $product->id,
            'name' => 'Draft product',
            'status' => 'draft',
        ]);
        $this->assertDatabaseMissing('shop_item_attributes', [
            'shop_item_id' => $product->id,
        ]);
    }

    public function test_attribute_persistence_failure_rolls_back_product_update(): void
    {
        $material = $this->createAttribute('Material', ShopAttributeType::Text);
        $product = $this->createProduct('Draft product');
        $attributeService = \Mockery::mock(ShopItemAttributeService::class);
        $attributeService->shouldReceive('sync')
            ->once()
            ->andThrow(new RuntimeException('Attribute persistence failed.'));
        $this->app->instance(ShopItemAttributeService::class, $attributeService);
        $this->withoutExceptionHandling();

        try {
            $this->putJson("/api/products/{$product->id}", [
                ...$this->productData('Published product', 'active'),
                'attributes' => [
                    ['attribute_id' => $material->id, 'value' => 'Leather', 'sort_order' => 0],
                ],
            ]);
            $this->fail('The simulated attribute persistence failure was not thrown.');
        } catch (RuntimeException $exception) {
            $this->assertSame('Attribute persistence failed.', $exception->getMessage());
        }

        $this->assertDatabaseHas('shop_items', [
            'id' => $product->id,
            'name' => 'Draft product',
            'status' => 'draft',
        ]);
        $this->assertDatabaseMissing('shop_item_attributes', [
            'shop_item_id' => $product->id,
        ]);
    }

    public function test_attribute_persistence_failure_rolls_back_product_creation(): void
    {
        $material = $this->createAttribute('Material', ShopAttributeType::Text);
        $attributeService = \Mockery::mock(ShopItemAttributeService::class);
        $attributeService->shouldReceive('sync')
            ->once()
            ->andThrow(new RuntimeException('Attribute persistence failed.'));
        $this->app->instance(ShopItemAttributeService::class, $attributeService);
        $this->withoutExceptionHandling();

        try {
            $this->postJson('/api/products', [
                ...$this->productData('Atomic product', 'active'),
                'attributes' => [
                    ['attribute_id' => $material->id, 'value' => 'Leather', 'sort_order' => 0],
                ],
            ]);
            $this->fail('The simulated attribute persistence failure was not thrown.');
        } catch (RuntimeException $exception) {
            $this->assertSame('Attribute persistence failed.', $exception->getMessage());
        }

        $this->assertDatabaseMissing('shop_items', [
            'name' => 'Atomic product',
        ]);
        $this->assertDatabaseCount('shop_item_attributes', 0);
    }

    private function createAttribute(string $name, ShopAttributeType $type): ShopAttribute
    {
        return ShopAttribute::query()->create([
            'name' => $name,
            'type' => $type,
        ]);
    }

    private function createProduct(string $name): ShopItem
    {
        return ShopItem::query()->create([
            'name' => $name,
            'url' => str($name)->slug(),
            'price' => '100.00',
            'currency' => 'UAH',
            'status' => 'draft',
        ]);
    }

    /** @return array<string, int|string|null> */
    private function productData(string $name, string $status = 'draft'): array
    {
        return [
            'name' => $name,
            'price' => '100.00',
            'old_price' => null,
            'currency' => 'UAH',
            'quantity' => 5,
            'description' => null,
            'status' => $status,
        ];
    }
}
