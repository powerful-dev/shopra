<?php

namespace Tests\Feature;

use App\Enums\ShopAttributeType;
use App\Models\Module;
use App\Models\ShopAttribute;
use App\Models\ShopItem;
use App\Models\ShopItemMedia;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ProductVariantsApiTest extends TestCase
{
    use RefreshDatabase;

    public function test_full_variant_data_is_returned_in_sort_order(): void
    {
        $this->authenticateProductAdmin();
        $item = $this->createItem();
        $color = ShopAttribute::query()->create([
            'name' => 'Color',
            'type' => ShopAttributeType::Select,
        ]);
        $blue = $color->options()->create(['value' => 'Blue', 'sort_order' => 20]);
        $red = $color->options()->create(['value' => 'Red', 'sort_order' => 10]);
        $colorOption = $item->variantOptions()->create([
            'shop_attribute_id' => $color->id,
            'sort_order' => 20,
        ]);
        $blueValue = $colorOption->values()->create([
            'shop_attribute_option_id' => $blue->id,
            'sort_order' => 20,
        ]);
        $redValue = $colorOption->values()->create([
            'shop_attribute_option_id' => $red->id,
            'sort_order' => 10,
        ]);
        $sizeOption = $item->variantOptions()->create([
            'name' => 'Size',
            'sort_order' => 10,
        ]);
        $largeValue = $sizeOption->values()->create([
            'value' => 'Large',
            'sort_order' => 20,
        ]);
        $smallValue = $sizeOption->values()->create([
            'value' => 'Small',
            'sort_order' => 10,
        ]);
        $laterVariant = $item->variants()->create([
            'sku' => 'RED-L',
            'price' => null,
            'quantity' => 3,
            'is_active' => false,
            'sort_order' => 20,
        ]);
        $firstVariant = $item->variants()->create([
            'sku' => 'BLUE-S',
            'price' => '125.50',
            'quantity' => 7,
            'is_active' => true,
            'sort_order' => 10,
        ]);
        $firstGlobalSelection = $firstVariant->selections()->create([
            'shop_item_variant_value_id' => $blueValue->id,
        ]);
        $firstLocalSelection = $firstVariant->selections()->create([
            'shop_item_variant_value_id' => $smallValue->id,
        ]);
        $laterVariant->values()->attach([$redValue->id, $largeValue->id]);
        $firstMedia = $item->media()->create([
            'type' => ShopItemMedia::TYPE_IMAGE,
            'filename' => 'first.jpg',
            'sort_order' => 0,
        ]);
        $secondMedia = $item->media()->create([
            'type' => ShopItemMedia::TYPE_IMAGE,
            'filename' => 'second.jpg',
            'sort_order' => 1,
        ]);
        $laterPhoto = $redValue->photos()->create([
            'shop_item_media_id' => $firstMedia->id,
            'sort_order' => 20,
        ]);
        $firstPhoto = $redValue->photos()->create([
            'shop_item_media_id' => $secondMedia->id,
            'sort_order' => 10,
        ]);
        $settings = $item->variantSetting()->create([
            'individual_prices_enabled' => false,
            'photos_enabled' => true,
            'photo_option_id' => $colorOption->id,
            'default_photo_value_id' => $redValue->id,
        ]);

        $this->getJson("/api/products/{$item->id}/variants")
            ->assertOk()
            ->assertJsonPath('data.settings.id', $settings->id)
            ->assertJsonPath('data.settings.individual_prices_enabled', false)
            ->assertJsonPath('data.settings.photos_enabled', true)
            ->assertJsonPath('data.settings.photo_option_id', $colorOption->id)
            ->assertJsonPath('data.settings.default_photo_value_id', $redValue->id)
            ->assertJsonPath('data.options.0.id', $sizeOption->id)
            ->assertJsonPath('data.options.0.shop_attribute_id', null)
            ->assertJsonPath('data.options.0.name', 'Size')
            ->assertJsonPath('data.options.0.values.0.id', $smallValue->id)
            ->assertJsonPath('data.options.0.values.0.shop_attribute_option_id', null)
            ->assertJsonPath('data.options.0.values.0.value', 'Small')
            ->assertJsonPath('data.options.1.id', $colorOption->id)
            ->assertJsonPath('data.options.1.shop_attribute_id', $color->id)
            ->assertJsonPath('data.options.1.name', null)
            ->assertJsonPath('data.options.1.values.0.id', $redValue->id)
            ->assertJsonPath('data.options.1.values.0.shop_attribute_option_id', $red->id)
            ->assertJsonPath('data.options.1.values.0.value', null)
            ->assertJsonPath('data.variants.0.id', $firstVariant->id)
            ->assertJsonPath('data.variants.0.price', '125.50')
            ->assertJsonPath('data.variants.0.quantity', 7)
            ->assertJsonPath('data.variants.0.sku', 'BLUE-S')
            ->assertJsonPath('data.variants.0.is_active', true)
            ->assertJsonPath('data.variants.0.selections.0.id', $firstLocalSelection->id)
            ->assertJsonPath('data.variants.0.selections.0.option_id', $sizeOption->id)
            ->assertJsonPath('data.variants.0.selections.0.value_id', $smallValue->id)
            ->assertJsonPath('data.variants.0.selections.1.id', $firstGlobalSelection->id)
            ->assertJsonPath('data.variants.1.id', $laterVariant->id)
            ->assertJsonPath('data.variants.1.price', null)
            ->assertJsonPath('data.photos.0.id', $firstPhoto->id)
            ->assertJsonPath('data.photos.0.shop_item_variant_value_id', $redValue->id)
            ->assertJsonPath('data.photos.0.shop_item_media_id', $secondMedia->id)
            ->assertJsonPath('data.photos.0.sort_order', 10)
            ->assertJsonPath('data.photos.1.id', $laterPhoto->id)
            ->assertJsonCount(2, 'data.options')
            ->assertJsonCount(2, 'data.variants')
            ->assertJsonCount(2, 'data.photos');
    }

    public function test_new_item_returns_empty_variant_state_without_creating_records(): void
    {
        $this->authenticateProductAdmin();
        $item = $this->createItem();

        $this->getJson("/api/products/{$item->id}/variants")
            ->assertOk()
            ->assertExactJson([
                'data' => [
                    'settings' => [
                        'id' => null,
                        'individual_prices_enabled' => false,
                        'photos_enabled' => false,
                        'photo_option_id' => null,
                        'default_photo_value_id' => null,
                    ],
                    'options' => [],
                    'variants' => [],
                    'photos' => [],
                ],
            ]);

        $this->assertDatabaseCount('shop_item_variant_settings', 0);
        $this->assertDatabaseCount('shop_item_variant_options', 0);
        $this->assertDatabaseCount('shop_item_variants', 0);
    }

    public function test_variant_endpoint_requires_authentication_and_product_module_access(): void
    {
        $item = $this->createItem();

        $this->getJson("/api/products/{$item->id}/variants")
            ->assertUnauthorized();

        $this->actingAs(User::factory()->create(['is_active' => true]), 'sanctum')
            ->getJson("/api/products/{$item->id}/variants")
            ->assertForbidden();
    }

    private function authenticateProductAdmin(): void
    {
        $admin = User::factory()->create(['is_active' => true]);
        $module = Module::query()->create([
            'code' => 'products',
            'show_in_menu' => true,
            'is_required' => false,
        ]);
        $admin->modules()->attach($module);
        $this->actingAs($admin, 'sanctum');
    }

    private function createItem(): ShopItem
    {
        return ShopItem::query()->create([
            'name' => 'Backpack',
            'url' => 'backpack',
            'price' => '100.00',
        ]);
    }
}
