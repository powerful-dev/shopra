<?php

namespace Tests\Feature;

use App\Enums\ShopAttributeType;
use App\Models\ShopAttribute;
use App\Models\ShopAttributeOption;
use App\Models\ShopItem;
use App\Models\ShopItemMedia;
use App\Models\ShopItemVariantOption;
use App\Models\ShopItemVariantSelection;
use App\Models\ShopItemVariantValue;
use Illuminate\Database\QueryException;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Schema;
use Tests\TestCase;

class ShopItemVariantModelTest extends TestCase
{
    use RefreshDatabase;

    public function test_variant_tables_have_the_expected_structure(): void
    {
        $this->assertTrue(Schema::hasColumns('shop_item_variant_options', [
            'id',
            'shop_item_id',
            'shop_attribute_id',
            'name',
            'sort_order',
        ]));
        $this->assertTrue(Schema::hasColumns('shop_item_variant_values', [
            'id',
            'shop_item_variant_option_id',
            'shop_attribute_option_id',
            'value',
            'sort_order',
        ]));
        $this->assertTrue(Schema::hasColumns('shop_item_variants', [
            'id',
            'shop_item_id',
            'sku',
            'price',
            'quantity',
            'is_active',
            'sort_order',
        ]));
        $this->assertTrue(Schema::hasColumns('shop_item_variant_selections', [
            'shop_item_variant_id',
            'shop_item_variant_value_id',
        ]));
        $this->assertTrue(Schema::hasColumns('shop_item_variant_photos', [
            'shop_item_variant_value_id',
            'shop_item_media_id',
            'sort_order',
        ]));
        $this->assertTrue(Schema::hasColumns('shop_item_variant_settings', [
            'shop_item_id',
            'individual_prices_enabled',
            'photos_enabled',
            'photo_option_id',
            'default_photo_value_id',
        ]));
    }

    public function test_variant_models_expose_their_relationships_and_defaults(): void
    {
        [$item, $attribute, $attributeOption, $variantOption, $variantValue] = $this->createVariantValue();
        $media = $item->media()->create([
            'type' => ShopItemMedia::TYPE_IMAGE,
            'filename' => 'variant.jpg',
        ]);
        $variant = $item->variants()->create([
            'sku' => 'TS-RED',
            'price' => '29.90',
            'quantity' => 4,
        ]);

        $variant->values()->attach($variantValue);
        $variantValue->media()->attach($media, ['sort_order' => 2]);
        $setting = $item->variantSetting()->create([
            'individual_prices_enabled' => true,
            'photos_enabled' => true,
            'photo_option_id' => $variantOption->getKey(),
            'default_photo_value_id' => $variantValue->getKey(),
        ]);
        $variant->refresh();

        $this->assertTrue($variant->is_active);
        $this->assertSame(4, $variant->quantity);
        $this->assertSame('29.90', $variant->price);
        $this->assertSame($item->getKey(), $variantOption->item->getKey());
        $this->assertSame($attribute->getKey(), $variantOption->attribute->getKey());
        $this->assertSame($attributeOption->getKey(), $variantValue->attributeOption->getKey());
        $this->assertTrue($variant->values->contains($variantValue));
        $this->assertTrue($variantValue->variants->contains($variant));
        $this->assertTrue($variantValue->media->contains($media));
        $this->assertTrue($media->variantValues->contains($variantValue));
        $this->assertTrue($setting->individual_prices_enabled);
        $this->assertTrue($setting->photos_enabled);
        $this->assertSame($variantOption->getKey(), $setting->photoOption->getKey());
        $this->assertSame($variantValue->getKey(), $setting->defaultPhotoValue->getKey());

        $defaultVariant = $item->variants()->create();
        $defaultSetting = $this->createItem('second-item')->variantSetting()->create();
        $defaultVariant->refresh();
        $defaultSetting->refresh();

        $this->assertNull($defaultVariant->price);
        $this->assertSame(0, $defaultVariant->quantity);
        $this->assertTrue($defaultVariant->is_active);
        $this->assertFalse($defaultSetting->individual_prices_enabled);
        $this->assertFalse($defaultSetting->photos_enabled);
    }

    public function test_variant_selection_cannot_be_duplicated(): void
    {
        [$item, , , , $variantValue] = $this->createVariantValue();
        $variant = $item->variants()->create();

        ShopItemVariantSelection::query()->create([
            'shop_item_variant_id' => $variant->getKey(),
            'shop_item_variant_value_id' => $variantValue->getKey(),
        ]);

        $this->expectException(QueryException::class);

        ShopItemVariantSelection::query()->create([
            'shop_item_variant_id' => $variant->getKey(),
            'shop_item_variant_value_id' => $variantValue->getKey(),
        ]);
    }

    public function test_reference_deletion_is_safe_and_photo_detaching_keeps_media(): void
    {
        [$item, $attribute, , $variantOption, $variantValue] = $this->createVariantValue();
        $media = $item->media()->create([
            'type' => ShopItemMedia::TYPE_IMAGE,
            'filename' => 'variant.jpg',
        ]);
        $photo = $variantValue->photos()->create([
            'shop_item_media_id' => $media->getKey(),
        ]);
        $item->variantSetting()->create([
            'photo_option_id' => $variantOption->getKey(),
            'default_photo_value_id' => $variantValue->getKey(),
        ]);

        $photo->delete();

        $this->assertDatabaseHas('shop_item_media', ['id' => $media->getKey()]);
        $this->assertDatabaseMissing('shop_item_variant_photos', ['id' => $photo->getKey()]);

        $variantValue->photos()->create(['shop_item_media_id' => $media->getKey()]);
        $attribute->delete();

        $this->assertNull($variantOption->refresh()->shop_attribute_id);
        $this->assertNull($variantValue->refresh()->shop_attribute_option_id);
    }

    public function test_force_deleting_an_item_cascades_to_all_variant_data(): void
    {
        [$item, , , $variantOption, $variantValue] = $this->createVariantValue();
        $media = $item->media()->create([
            'type' => ShopItemMedia::TYPE_IMAGE,
            'filename' => 'variant.jpg',
        ]);
        $variant = $item->variants()->create();
        $selection = $variant->selections()->create([
            'shop_item_variant_value_id' => $variantValue->getKey(),
        ]);
        $photo = $variantValue->photos()->create([
            'shop_item_media_id' => $media->getKey(),
        ]);
        $setting = $item->variantSetting()->create([
            'photo_option_id' => $variantOption->getKey(),
            'default_photo_value_id' => $variantValue->getKey(),
        ]);

        $item->forceDelete();

        $this->assertDatabaseMissing('shop_item_variant_options', ['id' => $variantOption->getKey()]);
        $this->assertDatabaseMissing('shop_item_variant_values', ['id' => $variantValue->getKey()]);
        $this->assertDatabaseMissing('shop_item_variants', ['id' => $variant->getKey()]);
        $this->assertDatabaseMissing('shop_item_variant_selections', ['id' => $selection->getKey()]);
        $this->assertDatabaseMissing('shop_item_variant_photos', ['id' => $photo->getKey()]);
        $this->assertDatabaseMissing('shop_item_variant_settings', ['id' => $setting->getKey()]);
    }

    /**
     * @return array{ShopItem, ShopAttribute, ShopAttributeOption, ShopItemVariantOption, ShopItemVariantValue}
     */
    private function createVariantValue(): array
    {
        $item = $this->createItem();
        $attribute = ShopAttribute::query()->create([
            'name' => 'Color',
            'type' => ShopAttributeType::Select,
        ]);
        $attributeOption = $attribute->options()->create(['value' => 'Red']);
        $variantOption = $item->variantOptions()->create([
            'shop_attribute_id' => $attribute->getKey(),
        ]);
        $variantValue = $variantOption->values()->create([
            'shop_attribute_option_id' => $attributeOption->getKey(),
        ]);

        return [$item, $attribute, $attributeOption, $variantOption, $variantValue];
    }

    private function createItem(string $url = 't-shirt'): ShopItem
    {
        return ShopItem::query()->create([
            'name' => 'T-shirt',
            'url' => $url,
            'price' => '25.00',
        ]);
    }
}
