<?php

namespace Tests\Feature;

use App\Models\ShopItem;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ShopProductPageTest extends TestCase
{
    use RefreshDatabase;

    public function test_existing_product_url_renders_the_static_product_page(): void
    {
        $product = ShopItem::query()->create([
            'name' => 'Товар из базы',
            'url' => 'database-product',
            'price' => 1000,
        ]);

        $response = $this->get(route('product.show', ['url' => $product->url]));

        $response
            ->assertOk()
            ->assertViewIs('sites.shop.pages.product')
            ->assertViewHas('product', fn (ShopItem $viewProduct): bool => $viewProduct->is($product))
            ->assertSee('<h1 class="uk-heading-small uk-margin-small-top" data-variant-name>Пальто Axis</h1>', false)
            ->assertSee('data-product-gallery', false)
            ->assertSee('data-product-size-picker', false)
            ->assertSee('data-quick-order-open', false)
            ->assertSee('id="size-modal"', false)
            ->assertSee('id="product-favorite"', false)
            ->assertSee('/build/assets/organic-', false)
            ->assertSee('/build/assets/shop-', false)
            ->assertDontSee('/build/assets/shop-catalog-', false);
    }

    public function test_unknown_or_deleted_product_returns_not_found(): void
    {
        $deleted = ShopItem::query()->create([
            'name' => 'Удалённый товар',
            'url' => 'deleted-product',
            'price' => 1000,
        ]);
        $deleted->delete();

        $this->get('/product/missing-product')->assertNotFound();
        $this->get('/product/deleted-product')->assertNotFound();
    }
}
