<?php

namespace Tests\Feature;

use App\Models\Language;
use App\Models\Module;
use App\Models\Shop;
use App\Models\ShopCurrency;
use App\Models\ShopUnit;
use App\Models\Site;
use App\Models\SiteType;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class SettingsApiTest extends TestCase
{
    use RefreshDatabase;

    private User $user;

    private Site $site;

    private Shop $shop;

    private ShopUnit $pieceUnit;

    protected function setUp(): void
    {
        parent::setUp();

        $siteType = SiteType::query()->create(['code' => 'test', 'name' => 'Test']);
        $this->site = Site::query()->create([
            'site_type_id' => $siteType->getKey(),
            'name' => 'Initial site',
        ]);
        $this->pieceUnit = ShopUnit::query()->create([
            'code' => 'piece',
            'is_system' => true,
        ]);
        $this->shop = Shop::query()->create([
            'name' => 'Initial shop',
            'theme' => 'other',
            'low_stock_threshold' => 5,
            'default_shop_unit_id' => $this->pieceUnit->getKey(),
        ]);
        $this->user = User::factory()->create(['is_active' => true]);

        $settingsModule = Module::query()->create([
            'code' => 'settings',
            'name' => 'Настройки',
            'admin_path' => '/admin/settings',
            'icon' => 'settings',
            'sorting' => 100,
            'show_in_menu' => true,
            'is_required' => false,
        ]);
        $this->user->modules()->attach($settingsModule);

        $this->actingAs($this->user, 'sanctum');
    }

    public function test_general_settings_are_loaded_and_updated_independently(): void
    {
        $russian = Language::query()->create($this->language('ru', 'Русский'));
        Language::query()->create($this->language('uk', 'Українська'));
        $english = Language::query()->create($this->language('en', 'English'));
        Language::query()->create($this->language('de', 'Deutsch', false, true));
        $this->user->update(['admin_language_id' => $russian->getKey()]);
        $this->site->update(['site_language_id' => $english->getKey()]);

        $response = $this->getJson('/api/settings/general');

        $response->assertOk()
            ->assertJsonPath('data.site_name', 'Initial site')
            ->assertJsonPath('data.admin_language_id', $russian->getKey())
            ->assertJsonPath('data.site_language_id', $english->getKey())
            ->assertJsonPath('data.admin_languages.0.code', 'en')
            ->assertJsonCount(3, 'data.admin_languages')
            ->assertJsonCount(4, 'data.site_languages');
        $this->assertSame(
            ['site_name', 'admin_language_id', 'site_language_id', 'admin_languages', 'site_languages'],
            array_keys($response->json('data')),
        );

        $this->putJson('/api/settings/general', [
            'site_name' => 'Updated site',
            'admin_language_id' => $english->getKey(),
            'site_language_id' => $russian->getKey(),
        ])->assertOk()->assertJsonPath('data.site_name', 'Updated site');

        $this->assertDatabaseHas('sites', [
            'id' => $this->site->getKey(),
            'name' => 'Updated site',
            'site_language_id' => $russian->getKey(),
        ]);
        $this->assertDatabaseHas('users', [
            'id' => $this->user->getKey(),
            'admin_language_id' => $english->getKey(),
        ]);
        $this->assertSame(5, $this->shop->fresh()->low_stock_threshold);
    }

    public function test_currency_settings_are_loaded_and_synchronized_independently(): void
    {
        $this->shop->update(['currency' => 'UAH']);
        ShopCurrency::query()->create(['currency_code' => 'USD', 'rate' => '40.00']);
        ShopCurrency::query()->create(['currency_code' => 'EUR', 'rate' => '44.00']);

        $response = $this->getJson('/api/settings/currencies');

        $response->assertOk()
            ->assertJsonPath('data.currency', 'UAH')
            ->assertJsonPath('data.currency_rates.0.code', 'USD')
            ->assertJsonPath('data.currency_rates.0.rate', '40.00');
        $this->assertSame(['currency', 'currency_rates'], array_keys($response->json('data')));

        $this->putJson('/api/settings/currencies', [
            'currency' => 'USD',
            'currency_rates' => [
                ['code' => 'EUR', 'rate' => '45.20'],
                ['code' => 'GEL', 'rate' => '15.12345678'],
            ],
        ])->assertOk()
            ->assertJsonPath('data.currency', 'USD')
            ->assertJsonPath('data.currency_rates.0.rate', '45.20')
            ->assertJsonPath('data.currency_rates.1.rate', '15.12345678');

        $this->assertSame('USD', $this->shop->fresh()->currency->value);
        $this->assertDatabaseMissing('shop_currencies', ['currency_code' => 'USD']);
        $this->assertDatabaseHas('shop_currencies', ['currency_code' => 'EUR', 'rate' => '45.20']);
        $this->assertDatabaseHas('shop_currencies', ['currency_code' => 'GEL', 'rate' => '15.12345678']);
        $this->assertDatabaseCount('shop_currencies', 2);
    }

    public function test_product_editor_can_manage_shop_currencies_without_other_settings_access(): void
    {
        $this->user->modules()->detach();
        $productsModule = Module::query()->create([
            'code' => 'products',
            'name' => 'Товары',
            'admin_path' => '/admin/products',
            'icon' => 'products',
            'sorting' => 10,
            'show_in_menu' => true,
            'is_required' => false,
        ]);
        $this->user->modules()->attach($productsModule);
        $this->shop->update(['currency' => 'USD']);
        ShopCurrency::query()->create(['currency_code' => 'EUR', 'rate' => '1.08']);
        ShopCurrency::query()->create(['currency_code' => 'USD', 'rate' => '1.00']);

        $this->getJson('/api/settings/currencies')
            ->assertOk()
            ->assertJsonPath('data.currency', 'USD')
            ->assertJsonPath('data.currency_rates.0.code', 'EUR')
            ->assertJsonPath('data.currency_rates.0.rate', '1.08')
            ->assertJsonPath('data.currency_rates.1.code', 'USD');

        $this->putJson('/api/settings/currencies', [
            'currency' => 'USD',
            'currency_rates' => [
                ['code' => 'EUR', 'rate' => '1.10'],
            ],
        ])->assertOk()
            ->assertJsonPath('data.currency', 'USD')
            ->assertJsonPath('data.currency_rates.0.rate', '1.10');

        $this->getJson('/api/settings/general')->assertForbidden();
    }

    public function test_currency_settings_are_validated_against_supported_currencies(): void
    {
        $this->putJson('/api/settings/currencies', [
            'currency' => 'UAH',
            'currency_rates' => [
                ['code' => 'UAH', 'rate' => '1.00'],
                ['code' => 'BTC', 'rate' => '0'],
            ],
        ])->assertUnprocessable()->assertJsonValidationErrors([
            'currency_rates.0.code',
            'currency_rates.1.code',
            'currency_rates.1.rate',
        ]);

        $this->putJson('/api/settings/currencies', [
            'currency' => 'BTC',
            'currency_rates' => [],
        ])->assertUnprocessable()->assertJsonValidationErrors('currency');
    }

    public function test_store_currency_can_remain_unselected(): void
    {
        $this->shop->update(['currency' => null]);

        $this->getJson('/api/settings/currencies')
            ->assertOk()
            ->assertJsonPath('data.currency', null);

        $this->putJson('/api/settings/currencies', [
            'currency' => null,
            'currency_rates' => [],
        ])->assertOk()
            ->assertJsonPath('data.currency', null);

        $this->assertNull($this->shop->fresh()->currency);
    }

    public function test_catalog_settings_are_loaded_and_updated_independently(): void
    {
        $response = $this->getJson('/api/settings/catalog');

        $response->assertOk()
            ->assertJsonPath('data.low_stock_threshold', 5)
            ->assertJsonPath('data.default_shop_unit_id', $this->pieceUnit->getKey())
            ->assertJsonPath('data.shop_units.0.code', 'piece');
        $this->assertSame(
            ['low_stock_threshold', 'default_shop_unit_id', 'shop_units'],
            array_keys($response->json('data')),
        );

        $this->putJson('/api/settings/catalog', [
            'low_stock_threshold' => 8,
            'default_shop_unit_id' => null,
        ])->assertOk()
            ->assertJsonPath('data.low_stock_threshold', 8)
            ->assertJsonPath('data.default_shop_unit_id', null);

        $this->assertDatabaseHas('shops', [
            'id' => $this->shop->getKey(),
            'low_stock_threshold' => 8,
            'default_shop_unit_id' => null,
        ]);
    }

    public function test_image_settings_are_loaded_and_updated_independently(): void
    {
        $response = $this->getJson('/api/settings/images');

        $response->assertOk()
            ->assertJsonPath('data.group_small_image_max_width', null)
            ->assertJsonPath('data.group_small_image_fit', 'contain')
            ->assertJsonPath('data.product_image_format', 'webp');
        $this->assertCount(14, $response->json('data'));

        $this->putJson('/api/settings/images', $this->imageSettings())
            ->assertOk()
            ->assertJsonPath('data.group_small_image_max_width', 320)
            ->assertJsonPath('data.product_image_format', 'original');

        $this->assertDatabaseHas('shops', [
            'id' => $this->shop->getKey(),
            ...$this->imageSettings(),
        ]);
    }

    public function test_image_settings_are_validated(): void
    {
        $this->putJson('/api/settings/images', [
            ...$this->imageSettings(),
            'group_small_image_max_width' => 0,
            'group_large_image_max_height' => 1.5,
            'product_small_image_fit' => 'stretch',
            'product_image_format' => 'jpeg',
        ])->assertUnprocessable()->assertJsonValidationErrors([
            'group_small_image_max_width',
            'group_large_image_max_height',
            'product_small_image_fit',
            'product_image_format',
        ]);
    }

    /** @return array<string, int|string|null> */
    private function imageSettings(): array
    {
        return [
            'group_small_image_max_width' => 320,
            'group_small_image_max_height' => null,
            'group_small_image_fit' => 'cover',
            'group_large_image_max_width' => 1280,
            'group_large_image_max_height' => 960,
            'group_large_image_fit' => 'contain',
            'group_image_format' => 'webp',
            'product_small_image_max_width' => null,
            'product_small_image_max_height' => 480,
            'product_small_image_fit' => 'contain',
            'product_large_image_max_width' => 1920,
            'product_large_image_max_height' => null,
            'product_large_image_fit' => 'cover',
            'product_image_format' => 'original',
        ];
    }

    /** @return array<string, mixed> */
    private function language(string $code, string $name, bool $isAdmin = true, bool $isSite = true): array
    {
        return [
            'code' => $code,
            'name' => $name,
            'is_admin' => $isAdmin,
            'is_site' => $isSite,
            'is_active' => true,
        ];
    }
}
