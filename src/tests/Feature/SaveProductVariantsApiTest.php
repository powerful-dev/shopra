<?php

namespace Tests\Feature;

use App\Enums\ShopAttributeType;
use App\Models\Module;
use App\Models\ShopAttribute;
use App\Models\ShopItem;
use App\Models\ShopItemMedia;
use App\Models\ShopItemVariantSetting;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Event;
use RuntimeException;
use Tests\TestCase;

class SaveProductVariantsApiTest extends TestCase
{
    use RefreshDatabase;

    public function test_variants_can_be_created_with_temporary_ids_local_values_and_photos(): void
    {
        $this->authenticateProductAdmin();
        [$item, $color, $red, $blue, $firstMedia, $secondMedia] = $this->createCatalogData();
        $item->update(['quantity' => 14]);

        $response = $this->putJson(
            "/api/products/{$item->id}/variants",
            $this->creationPayload($color->id, $red->id, $blue->id, $firstMedia->id, $secondMedia->id),
        )->assertOk()
            ->assertJsonPath('data.settings.individual_prices_enabled', false)
            ->assertJsonPath('data.settings.photos_enabled', false)
            ->assertJsonPath('data.options.0.shop_attribute_id', $color->id)
            ->assertJsonPath('data.options.0.name', null)
            ->assertJsonPath('data.options.1.shop_attribute_id', null)
            ->assertJsonPath('data.options.1.name', 'Size')
            ->assertJsonPath('data.options.1.values.0.value', 'Small')
            ->assertJsonPath('data.variants.0.price', '110.00')
            ->assertJsonPath('data.variants.0.quantity', 5)
            ->assertJsonPath('data.photos.0.shop_item_media_id', $firstMedia->id)
            ->assertJsonCount(2, 'data.options')
            ->assertJsonCount(2, 'data.variants')
            ->assertJsonCount(2, 'data.photos');

        $state = $response->json('data');

        $this->assertIsInt($state['options'][0]['id']);
        $this->assertIsInt($state['options'][0]['values'][0]['id']);
        $this->assertIsInt($state['variants'][0]['id']);
        $this->assertSame($state['options'][0]['id'], $state['settings']['photo_option_id']);
        $this->assertSame($state['options'][0]['values'][0]['id'], $state['settings']['default_photo_value_id']);
        $this->assertSame($state['options'][0]['id'], $state['variants'][0]['selections'][0]['option_id']);
        $this->assertSame($state['options'][0]['values'][0]['id'], $state['variants'][0]['selections'][0]['value_id']);
        $this->assertDatabaseCount('shop_item_variant_options', 2);
        $this->assertDatabaseCount('shop_item_variant_values', 4);
        $this->assertDatabaseCount('shop_item_variants', 2);
        $this->assertDatabaseCount('shop_item_variant_selections', 4);
        $this->assertDatabaseCount('shop_item_variant_photos', 2);
        $this->assertDatabaseHas('shop_items', [
            'id' => $item->id,
            'quantity' => 14,
        ]);
    }

    public function test_repeated_save_preserves_ids_updates_values_and_deletes_missing_records(): void
    {
        $this->authenticateProductAdmin();
        [$item, $color, $red, $blue, $firstMedia, $secondMedia] = $this->createCatalogData();
        $state = $this->putJson(
            "/api/products/{$item->id}/variants",
            $this->creationPayload($color->id, $red->id, $blue->id, $firstMedia->id, $secondMedia->id),
        )->assertOk()->json('data');

        $keptOptionId = $state['options'][0]['id'];
        $keptValueId = $state['options'][0]['values'][0]['id'];
        $keptVariantId = $state['variants'][0]['id'];
        $keptSelectionIds = collect($state['variants'][0]['selections'])->pluck('id')->all();
        $keptPhotoId = $state['photos'][0]['id'];
        $removedValueId = $state['options'][0]['values'][1]['id'];
        $removedVariantId = $state['variants'][1]['id'];
        $removedPhotoId = $state['photos'][1]['id'];
        $state['options'][0]['values'] = [$state['options'][0]['values'][0]];
        $state['options'][1]['values'] = [$state['options'][1]['values'][0]];
        $state['variants'] = [$state['variants'][0]];
        $state['variants'][0]['price'] = '115.75';
        $state['variants'][0]['quantity'] = 9;
        $state['variants'][0]['sku'] = 'RED-S-UPDATED';
        $state['photos'] = [$state['photos'][0]];
        $state['photos'][0]['sort_order'] = 7;

        $updated = $this->putJson("/api/products/{$item->id}/variants", $state)
            ->assertOk()
            ->assertJsonPath('data.options.0.id', $keptOptionId)
            ->assertJsonPath('data.options.0.shop_attribute_id', $color->id)
            ->assertJsonPath('data.options.0.name', null)
            ->assertJsonPath('data.options.0.values.0.id', $keptValueId)
            ->assertJsonPath('data.options.0.values.0.shop_attribute_option_id', $red->id)
            ->assertJsonPath('data.options.0.values.0.value', null)
            ->assertJsonPath('data.options.1.shop_attribute_id', null)
            ->assertJsonPath('data.options.1.name', 'Size')
            ->assertJsonPath('data.options.1.values.0.shop_attribute_option_id', null)
            ->assertJsonPath('data.options.1.values.0.value', 'Small')
            ->assertJsonPath('data.variants.0.id', $keptVariantId)
            ->assertJsonPath('data.variants.0.price', '115.75')
            ->assertJsonPath('data.variants.0.quantity', 9)
            ->assertJsonPath('data.variants.0.sku', 'RED-S-UPDATED')
            ->assertJsonPath('data.photos.0.id', $keptPhotoId)
            ->assertJsonPath('data.photos.0.sort_order', 7)
            ->assertJsonCount(1, 'data.variants')
            ->assertJsonCount(1, 'data.photos')
            ->json('data');

        $this->getJson("/api/products/{$item->id}/variants")
            ->assertOk()
            ->assertJsonPath('data.options.0.shop_attribute_id', $color->id)
            ->assertJsonPath('data.options.0.name', null)
            ->assertJsonPath('data.options.0.values.0.shop_attribute_option_id', $red->id)
            ->assertJsonPath('data.options.0.values.0.value', null)
            ->assertJsonPath('data.options.1.shop_attribute_id', null)
            ->assertJsonPath('data.options.1.name', 'Size')
            ->assertJsonPath('data.options.1.values.0.shop_attribute_option_id', null)
            ->assertJsonPath('data.options.1.values.0.value', 'Small');

        $this->assertSame($keptSelectionIds, collect($updated['variants'][0]['selections'])->pluck('id')->all());
        $this->assertDatabaseHas('shop_item_variant_options', [
            'id' => $keptOptionId,
            'shop_attribute_id' => $color->id,
            'name' => null,
        ]);
        $this->assertDatabaseHas('shop_item_variant_values', [
            'id' => $keptValueId,
            'shop_attribute_option_id' => $red->id,
            'value' => null,
        ]);
        $this->assertDatabaseHas('shop_item_variant_options', [
            'id' => $state['options'][1]['id'],
            'shop_attribute_id' => null,
            'name' => 'Size',
        ]);
        $this->assertDatabaseHas('shop_item_variant_values', [
            'id' => $state['options'][1]['values'][0]['id'],
            'shop_attribute_option_id' => null,
            'value' => 'Small',
        ]);
        $this->assertDatabaseMissing('shop_item_variant_values', ['id' => $removedValueId]);
        $this->assertDatabaseMissing('shop_item_variants', ['id' => $removedVariantId]);
        $this->assertDatabaseMissing('shop_item_variant_photos', ['id' => $removedPhotoId]);
    }

    public function test_empty_state_removes_variant_data_and_keeps_settings(): void
    {
        $this->authenticateProductAdmin();
        [$item, $color, $red, $blue, $firstMedia, $secondMedia] = $this->createCatalogData();
        $state = $this->putJson(
            "/api/products/{$item->id}/variants",
            $this->creationPayload($color->id, $red->id, $blue->id, $firstMedia->id, $secondMedia->id),
        )->assertOk()->json('data');
        $settingId = $state['settings']['id'];

        $this->putJson("/api/products/{$item->id}/variants", [
            'settings' => [
                'id' => $settingId,
                'individual_prices_enabled' => false,
                'photos_enabled' => false,
                'photo_option_id' => null,
                'default_photo_value_id' => null,
            ],
            'options' => [],
            'variants' => [],
            'photos' => [],
        ])->assertOk()
            ->assertJsonPath('data.settings.id', $settingId)
            ->assertJsonCount(0, 'data.options')
            ->assertJsonCount(0, 'data.variants')
            ->assertJsonCount(0, 'data.photos');

        $this->assertDatabaseCount('shop_item_variant_options', 0);
        $this->assertDatabaseCount('shop_item_variant_values', 0);
        $this->assertDatabaseCount('shop_item_variants', 0);
        $this->assertDatabaseCount('shop_item_variant_selections', 0);
        $this->assertDatabaseCount('shop_item_variant_photos', 0);
        $this->assertDatabaseHas('shop_item_variant_settings', ['id' => $settingId]);
        $this->assertDatabaseHas('shop_items', [
            'id' => $item->id,
            'quantity' => null,
        ]);
    }

    public function test_invalid_references_combinations_prices_stock_and_skus_are_rejected(): void
    {
        $this->authenticateProductAdmin();
        [$item, $color, $red, $blue, $firstMedia, $secondMedia] = $this->createCatalogData();
        $otherItem = ShopItem::query()->create([
            'name' => 'Other',
            'url' => 'other',
            'price' => '50.00',
        ]);
        $foreignMedia = $otherItem->media()->create([
            'type' => ShopItemMedia::TYPE_IMAGE,
            'filename' => 'foreign.jpg',
        ]);
        $payload = $this->creationPayload($color->id, $red->id, $blue->id, $firstMedia->id, $secondMedia->id);
        $payload['variants'][1]['sku'] = $payload['variants'][0]['sku'];
        $payload['variants'][1]['selections'] = [$payload['variants'][1]['selections'][0]];
        $payload['photos'][0]['shop_item_media_id'] = $foreignMedia->id;
        $payload['settings']['default_photo_value_id'] = 'size-small';

        $this->putJson("/api/products/{$item->id}/variants", $payload)
            ->assertUnprocessable()
            ->assertJsonValidationErrors([
                'variants.1.sku',
                'variants.1.selections',
                'photos.0.shop_item_media_id',
                'settings.default_photo_value_id',
            ]);

        $invalidNumbers = $this->creationPayload($color->id, $red->id, $blue->id, $firstMedia->id, $secondMedia->id);
        $invalidNumbers['variants'][0]['price'] = -1;
        $invalidNumbers['variants'][0]['quantity'] = -2;

        $this->putJson("/api/products/{$item->id}/variants", $invalidNumbers)
            ->assertUnprocessable()
            ->assertJsonValidationErrors([
                'variants.0.price',
                'variants.0.quantity',
            ]);

        $this->assertDatabaseCount('shop_item_variant_options', 0);
        $this->assertDatabaseCount('shop_item_variants', 0);
    }

    public function test_more_than_one_hundred_variants_are_rejected(): void
    {
        $this->authenticateProductAdmin();
        [$item, $color, $red, $blue, $firstMedia, $secondMedia] = $this->createCatalogData();
        $payload = $this->creationPayload($color->id, $red->id, $blue->id, $firstMedia->id, $secondMedia->id);
        $payload['variants'] = array_fill(0, 101, $payload['variants'][0]);

        $this->putJson("/api/products/{$item->id}/variants", $payload)
            ->assertUnprocessable()
            ->assertJsonValidationErrors('variants');
    }

    public function test_options_and_values_require_a_reference_or_local_name(): void
    {
        $this->authenticateProductAdmin();
        [$item, $color, $red, $blue, $firstMedia, $secondMedia] = $this->createCatalogData();
        $payload = $this->creationPayload($color->id, $red->id, $blue->id, $firstMedia->id, $secondMedia->id);
        $payload['options'][0]['shop_attribute_id'] = null;
        $payload['options'][0]['name'] = null;
        $payload['options'][1]['values'][0]['shop_attribute_option_id'] = null;
        $payload['options'][1]['values'][0]['value'] = null;

        $this->putJson("/api/products/{$item->id}/variants", $payload)
            ->assertUnprocessable()
            ->assertJsonValidationErrors([
                'options.0.shop_attribute_id',
                'options.0.name',
                'options.1.values.0.shop_attribute_option_id',
                'options.1.values.0.value',
            ]);

        $this->assertDatabaseCount('shop_item_variant_options', 0);
        $this->assertDatabaseCount('shop_item_variant_values', 0);
    }

    public function test_persistent_ids_must_belong_to_the_current_product(): void
    {
        $this->authenticateProductAdmin();
        [$item] = $this->createCatalogData();
        [$otherItem, $color, $red, $blue, $firstMedia, $secondMedia] = $this->createCatalogData('other-backpack');
        $foreignState = $this->putJson(
            "/api/products/{$otherItem->id}/variants",
            $this->creationPayload($color->id, $red->id, $blue->id, $firstMedia->id, $secondMedia->id),
        )->assertOk()->json('data');

        $this->putJson("/api/products/{$item->id}/variants", $foreignState)
            ->assertUnprocessable()
            ->assertJsonValidationErrors([
                'settings.id',
                'options.0.id',
                'options.0.values.0.id',
                'variants.0.id',
                'variants.0.selections.0.id',
                'photos.0.id',
                'photos.0.shop_item_media_id',
            ]);

        $this->assertDatabaseMissing('shop_item_variant_settings', ['shop_item_id' => $item->id]);
    }

    public function test_transaction_is_rolled_back_when_saving_fails(): void
    {
        $this->authenticateProductAdmin();
        [$item, $color, $red, $blue, $firstMedia, $secondMedia] = $this->createCatalogData();
        $eventName = 'eloquent.saving: '.ShopItemVariantSetting::class;
        Event::listen($eventName, fn () => throw new RuntimeException('Simulated settings failure.'));
        $this->withoutExceptionHandling();

        try {
            $this->putJson(
                "/api/products/{$item->id}/variants",
                $this->creationPayload($color->id, $red->id, $blue->id, $firstMedia->id, $secondMedia->id),
            );
            $this->fail('The simulated save failure was not thrown.');
        } catch (RuntimeException $exception) {
            $this->assertSame('Simulated settings failure.', $exception->getMessage());
        } finally {
            Event::forget($eventName);
        }

        $this->assertDatabaseCount('shop_item_variant_options', 0);
        $this->assertDatabaseCount('shop_item_variant_values', 0);
        $this->assertDatabaseCount('shop_item_variants', 0);
        $this->assertDatabaseCount('shop_item_variant_selections', 0);
        $this->assertDatabaseCount('shop_item_variant_photos', 0);
        $this->assertDatabaseCount('shop_item_variant_settings', 0);
    }

    public function test_save_endpoint_requires_authentication_and_product_module_access(): void
    {
        [$item, $color, $red, $blue, $firstMedia, $secondMedia] = $this->createCatalogData();
        $payload = $this->creationPayload($color->id, $red->id, $blue->id, $firstMedia->id, $secondMedia->id);

        $this->putJson("/api/products/{$item->id}/variants", $payload)
            ->assertUnauthorized();

        $this->actingAs(User::factory()->create(['is_active' => true]), 'sanctum')
            ->putJson("/api/products/{$item->id}/variants", $payload)
            ->assertForbidden();

        $this->assertDatabaseCount('shop_item_variant_options', 0);
        $this->assertDatabaseCount('shop_item_variants', 0);
    }

    /** @return array<string, mixed> */
    private function creationPayload(
        int $attributeId,
        int $redId,
        int $blueId,
        int $firstMediaId,
        int $secondMediaId,
    ): array {
        return [
            'settings' => [
                'individual_prices_enabled' => false,
                'photos_enabled' => false,
                'photo_option_id' => 'option-color',
                'default_photo_value_id' => 'color-red',
            ],
            'options' => [
                [
                    'id' => 'option-color',
                    'shop_attribute_id' => $attributeId,
                    'name' => null,
                    'sort_order' => 0,
                    'values' => [
                        ['id' => 'color-red', 'shop_attribute_option_id' => $redId, 'value' => null, 'sort_order' => 0],
                        ['id' => 'color-blue', 'shop_attribute_option_id' => $blueId, 'value' => null, 'sort_order' => 1],
                    ],
                ],
                [
                    'id' => 'option-size',
                    'shop_attribute_id' => null,
                    'name' => 'Size',
                    'sort_order' => 1,
                    'values' => [
                        ['id' => 'size-small', 'shop_attribute_option_id' => null, 'value' => 'Small', 'sort_order' => 0],
                        ['id' => 'size-large', 'shop_attribute_option_id' => null, 'value' => 'Large', 'sort_order' => 1],
                    ],
                ],
            ],
            'variants' => [
                [
                    'selections' => [
                        ['option_id' => 'option-color', 'value_id' => 'color-red'],
                        ['option_id' => 'option-size', 'value_id' => 'size-small'],
                    ],
                    'price' => '110.00',
                    'quantity' => 5,
                    'sku' => 'RED-S',
                    'is_active' => true,
                    'sort_order' => 0,
                ],
                [
                    'selections' => [
                        ['option_id' => 'option-color', 'value_id' => 'color-blue'],
                        ['option_id' => 'option-size', 'value_id' => 'size-large'],
                    ],
                    'price' => '120.00',
                    'quantity' => 2,
                    'sku' => 'BLUE-L',
                    'is_active' => false,
                    'sort_order' => 1,
                ],
            ],
            'photos' => [
                [
                    'shop_item_variant_value_id' => 'color-red',
                    'shop_item_media_id' => $firstMediaId,
                    'sort_order' => 0,
                ],
                [
                    'shop_item_variant_value_id' => 'color-blue',
                    'shop_item_media_id' => $secondMediaId,
                    'sort_order' => 0,
                ],
            ],
        ];
    }

    /** @return array{ShopItem, ShopAttribute, mixed, mixed, ShopItemMedia, ShopItemMedia} */
    private function createCatalogData(string $slug = 'backpack'): array
    {
        $item = ShopItem::query()->create([
            'name' => 'Backpack',
            'url' => $slug,
            'price' => '100.00',
        ]);
        $color = ShopAttribute::query()->create([
            'name' => 'Color',
            'type' => ShopAttributeType::Select,
        ]);
        $red = $color->options()->create(['value' => 'Red']);
        $blue = $color->options()->create(['value' => 'Blue', 'sort_order' => 1]);
        $firstMedia = $item->media()->create([
            'type' => ShopItemMedia::TYPE_IMAGE,
            'filename' => 'first.jpg',
        ]);
        $secondMedia = $item->media()->create([
            'type' => ShopItemMedia::TYPE_IMAGE,
            'filename' => 'second.jpg',
            'sort_order' => 1,
        ]);

        return [$item, $color, $red, $blue, $firstMedia, $secondMedia];
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
}
