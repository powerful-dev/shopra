<?php

namespace Tests\Feature;

use App\Enums\SupportedCurrency;
use App\Models\Module;
use App\Models\Shop;
use App\Models\ShopCurrency;
use App\Models\ShopItem;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ShopItemCurrencyTest extends TestCase
{
    use RefreshDatabase;

    private User $user;

    protected function setUp(): void
    {
        parent::setUp();

        Shop::query()->create([
            'name' => 'Test shop',
            'theme' => 'other',
            'currency' => 'UAH',
        ]);
        ShopCurrency::query()->create([
            'currency_code' => 'USD',
            'rate' => '41.50',
        ]);

        $productsModule = Module::query()->create([
            'code' => 'products',
            'name' => 'Товары',
            'admin_path' => '/admin/products',
            'icon' => 'products',
            'sorting' => 10,
            'show_in_menu' => true,
            'is_required' => false,
        ]);
        $this->user = User::factory()->create(['is_active' => true]);
        $this->user->modules()->attach($productsModule);
        $this->actingAs($this->user, 'sanctum');
    }

    public function test_product_currency_is_saved_returned_and_updated(): void
    {
        $productId = $this->postJson('/api/products', [
            ...$this->productData('Product in dollars'),
            'currency' => 'USD',
        ])->assertCreated()
            ->assertJsonPath('data.currency', 'USD')
            ->assertJsonPath('data.price', '100.00')
            ->json('data.id');

        $product = ShopItem::query()->findOrFail($productId);

        $this->assertSame(SupportedCurrency::Usd, $product->currency);

        $this->getJson("/api/products/{$productId}")
            ->assertOk()
            ->assertJsonPath('data.currency', 'USD');

        $this->putJson("/api/products/{$productId}", [
            ...$this->productData('Product in hryvnias'),
            'currency' => 'UAH',
        ])->assertOk()->assertJsonPath('data.currency', 'UAH');

        $this->assertDatabaseHas('shop_items', [
            'id' => $productId,
            'currency' => 'UAH',
            'price' => '100.00',
            'old_price' => '120.00',
        ]);
    }

    public function test_new_product_defaults_to_store_currency(): void
    {
        $this->postJson('/api/products', $this->productData('Default currency product'))
            ->assertCreated()
            ->assertJsonPath('data.currency', 'UAH');

        $this->assertDatabaseHas('shop_items', [
            'name' => 'Default currency product',
            'currency' => 'UAH',
        ]);
    }

    public function test_product_currency_must_be_supported_and_available_to_the_store(): void
    {
        $this->postJson('/api/products', [
            ...$this->productData('Unavailable currency product'),
            'currency' => 'EUR',
        ])->assertUnprocessable()->assertJsonValidationErrors('currency');

        $this->postJson('/api/products', [
            ...$this->productData('Unsupported currency product'),
            'currency' => 'BTC',
        ])->assertUnprocessable()->assertJsonValidationErrors('currency');
    }

    public function test_product_quantity_can_be_null_but_not_negative(): void
    {
        $productId = $this->postJson('/api/products', [
            ...$this->productData('Product without stock'),
            'quantity' => null,
        ])->assertCreated()
            ->assertJsonPath('data.quantity', null)
            ->json('data.id');

        $this->assertDatabaseHas('shop_items', [
            'id' => $productId,
            'quantity' => null,
        ]);

        $this->putJson("/api/products/{$productId}", [
            ...$this->productData('Product with zero stock'),
            'quantity' => 0,
        ])->assertOk()->assertJsonPath('data.quantity', 0);

        $this->assertDatabaseHas('shop_items', [
            'id' => $productId,
            'quantity' => 0,
        ]);

        $this->putJson("/api/products/{$productId}", [
            ...$this->productData('Product without stock'),
            'quantity' => null,
        ])->assertOk()->assertJsonPath('data.quantity', null);

        $this->assertDatabaseHas('shop_items', [
            'id' => $productId,
            'quantity' => null,
        ]);

        $this->putJson("/api/products/{$productId}", [
            ...$this->productData('Product without stock'),
            'quantity' => -1,
        ])->assertUnprocessable()->assertJsonValidationErrors('quantity');

        $defaultQuantityItem = ShopItem::query()->create([
            'name' => 'Product with default stock',
            'url' => 'product-with-default-stock',
            'price' => '10.00',
            'currency' => 'UAH',
        ]);

        $this->assertSame(0, $defaultQuantityItem->refresh()->quantity);
    }

    public function test_product_uses_active_variant_stock_without_overwriting_base_quantity(): void
    {
        Shop::query()->update(['low_stock_threshold' => 10]);
        $product = ShopItem::query()->create([
            'name' => 'Variant product',
            'url' => 'variant-product',
            'price' => '100.00',
            'currency' => 'UAH',
            'quantity' => 12,
        ]);
        $product->variants()->create(['quantity' => 4, 'is_active' => true]);
        $product->variants()->create(['quantity' => 50, 'is_active' => false]);
        $product->variants()->create(['quantity' => 3, 'is_active' => true]);

        $this->getJson("/api/products/{$product->id}")
            ->assertOk()
            ->assertJsonPath('data.quantity', 7);

        $this->getJson('/api/products')
            ->assertOk()
            ->assertJsonPath('data.0.id', $product->id)
            ->assertJsonPath('data.0.quantity', 7)
            ->assertJsonPath('summary.low_stock', 1);

        $this->getJson('/api/products?stock=low')
            ->assertOk()
            ->assertJsonCount(1, 'data')
            ->assertJsonPath('data.0.id', $product->id);

        $this->putJson("/api/products/{$product->id}", [
            ...$this->productData('Updated variant product'),
            'quantity' => 99,
        ])->assertOk()
            ->assertJsonPath('data.quantity', 7);

        $this->assertDatabaseHas('shop_items', [
            'id' => $product->id,
            'quantity' => 12,
        ]);
    }

    /** @return array<string, int|string|null> */
    private function productData(string $name): array
    {
        return [
            'name' => $name,
            'price' => '100.00',
            'old_price' => '120.00',
            'quantity' => 5,
            'description' => null,
            'status' => 'draft',
        ];
    }
}
