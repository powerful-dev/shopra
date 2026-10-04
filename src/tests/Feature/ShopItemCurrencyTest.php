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
