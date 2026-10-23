<?php

namespace Tests\Feature;

use App\Models\ShopGroup;
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
            ->assertSee('shop-catalog-', false);

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
}
