<?php

namespace Tests\Feature;

use App\Models\Shop;
use App\Models\ShopCurrency;
use App\Models\ShopGroup;
use App\Models\ShopItem;
use App\Models\ShopItemMedia;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Vite;
use Tests\TestCase;

class ShopCatalogPageTest extends TestCase
{
    use RefreshDatabase;

    public function test_existing_category_is_rendered_with_its_parent_breadcrumbs(): void
    {
        $root = ShopGroup::query()->create(['name' => 'Одежда', 'slug' => 'clothes']);
        $parent = $root->children()->create(['name' => 'Жакеты', 'slug' => 'jackets']);
        $category = $parent->children()->create(['name' => 'Летние жакеты', 'slug' => 'summer-jackets']);

        $response = $this->get(route('catalog.show', ['slug' => $category->slug]));

        $response
            ->assertOk()
            ->assertViewIs('sites.shop.pages.catalog')
            ->assertViewHas('category', fn (ShopGroup $viewCategory): bool => $viewCategory->is($category))
            ->assertViewHas('breadcrumbs', fn ($breadcrumbs): bool => $breadcrumbs->pluck('name')->all() === ['Одежда', 'Жакеты'])
            ->assertSee('<h1 class="uk-heading-medium uk-margin-small-top">Летние жакеты</h1>', false)
            ->assertSee(route('catalog.show', ['slug' => $root->slug]), false)
            ->assertSee(route('catalog.show', ['slug' => $parent->slug]), false)
            ->assertSee('data-catalog-grid', false)
            ->assertSee('В этой категории пока нет товаров', false)
            ->assertSee('/build/assets/shop-', false)
            ->assertDontSee('/build/assets/shop-catalog-', false);

        $appearance = config('shop.appearance');
        $themeAssets = [
            'layout/shop/css/themes/palettes/'.$appearance['palette'].'.css',
            'layout/shop/css/themes/shapes/'.$appearance['shape'].'.css',
            'layout/shop/css/themes/fonts/'.$appearance['font'].'.css',
            'layout/shop/css/themes/icons/'.$appearance['icons'].'.css',
            'layout/shop/css/themes/icon-backgrounds/'.$appearance['icon_background'].'.css',
            'layout/shop/css/themes/menus/'.$appearance['menu'].'.css',
        ];
        $vite = app(Vite::class);
        $home = $this->get(route('home'));

        foreach ($themeAssets as $themeAsset) {
            $assetUrl = $vite->asset($themeAsset);

            $home->assertSee($assetUrl, false);
            $response->assertSee($assetUrl, false);
        }
    }

    public function test_unknown_or_deleted_category_returns_not_found(): void
    {
        $deleted = ShopGroup::query()->create(['name' => 'Удалённая', 'slug' => 'deleted']);
        $deleted->delete();

        $this->get('/catalog/missing')->assertNotFound();
        $this->get('/catalog/deleted')->assertNotFound();
    }

    public function test_catalog_uses_primary_and_additional_categories_without_duplicates(): void
    {
        Shop::query()->create(['name' => 'Магазин', 'theme' => 'clothing', 'currency' => 'UAH']);
        ShopCurrency::query()->create(['currency_code' => 'USD', 'rate' => '40']);
        $category = ShopGroup::query()->create(['name' => 'Категория', 'slug' => 'category']);
        $otherCategory = ShopGroup::query()->create(['name' => 'Другая', 'slug' => 'other']);

        $primary = ShopItem::query()->create([
            'name' => 'Основной товар',
            'url' => 'primary-product',
            'price' => '10',
            'old_price' => '12',
            'currency' => 'USD',
            'status' => 'active',
            'shop_group_id' => $category->id,
        ]);
        $primary->groups()->attach($category);
        $primary->media()->createMany([
            ['type' => ShopItemMedia::TYPE_IMAGE, 'filename' => 'secondary.webp', 'sort_order' => 0, 'is_main' => false],
            ['type' => ShopItemMedia::TYPE_IMAGE, 'filename' => 'main.webp', 'sort_order' => 1, 'is_main' => true],
        ]);

        $additional = ShopItem::query()->create([
            'name' => 'Дополнительный товар',
            'url' => 'additional-product',
            'price' => '250',
            'currency' => 'UAH',
            'status' => 'active',
            'shop_group_id' => $otherCategory->id,
        ]);
        $additional->groups()->attach($category);

        foreach (['draft', 'archived'] as $status) {
            ShopItem::query()->create([
                'name' => "Скрытый {$status}",
                'url' => "hidden-{$status}",
                'price' => '100',
                'currency' => 'UAH',
                'status' => $status,
                'shop_group_id' => $category->id,
            ]);
        }

        $deleted = ShopItem::query()->create([
            'name' => 'Удалённый товар каталога',
            'url' => 'deleted-catalog-product',
            'price' => '100',
            'currency' => 'UAH',
            'status' => 'active',
            'shop_group_id' => $category->id,
        ]);
        $deleted->delete();

        $response = $this->get(route('catalog.show', ['slug' => $category->slug]));

        $response
            ->assertOk()
            ->assertViewHas('products', function ($products) use ($primary, $additional): bool {
                return $products->total() === 2
                    && $products->pluck('id')->sort()->values()->all() === collect([$primary->id, $additional->id])->sort()->values()->all();
            })
            ->assertSee('Основной товар', false)
            ->assertSee('Дополнительный товар', false)
            ->assertSee('400 ₴', false)
            ->assertSee('480 ₴', false)
            ->assertSee('main.webp', false)
            ->assertSee('Нет изображения', false)
            ->assertDontSee('secondary.webp', false)
            ->assertDontSee('Скрытый draft', false)
            ->assertDontSee('Скрытый archived', false)
            ->assertDontSee('Удалённый товар каталога', false);
    }

    public function test_catalog_paginates_fifteen_products_per_page(): void
    {
        Shop::query()->create(['name' => 'Магазин', 'theme' => 'clothing', 'currency' => 'UAH']);
        $category = ShopGroup::query()->create(['name' => 'Категория', 'slug' => 'paginated']);

        foreach (range(1, 16) as $index) {
            ShopItem::query()->create([
                'name' => "Товар {$index}",
                'url' => "product-{$index}",
                'price' => $index,
                'currency' => 'UAH',
                'status' => 'active',
                'shop_group_id' => $category->id,
            ]);
        }

        $firstPage = $this->get(route('catalog.show', ['slug' => $category->slug]));
        $secondPage = $this->get(route('catalog.show', ['slug' => $category->slug, 'page' => 2]));

        $firstPage
            ->assertOk()
            ->assertViewHas('products', fn ($products): bool => $products->total() === 16 && $products->count() === 15)
            ->assertSee(route('catalog.show', ['slug' => $category->slug, 'page' => 2]), false);

        $secondPage
            ->assertOk()
            ->assertViewHas('products', fn ($products): bool => $products->total() === 16 && $products->count() === 1 && $products->currentPage() === 2);
    }
}
