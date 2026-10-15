<?php

namespace App\Http\Resources;

use App\Models\ShopItem;
use App\Models\ShopItemVariant;
use App\Models\ShopItemVariantOption;
use App\Models\ShopItemVariantPhoto;
use App\Models\ShopItemVariantSelection;
use App\Models\ShopItemVariantValue;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/** @mixin ShopItem */
class ProductVariantsResource extends JsonResource
{
    /** @return array<string, mixed> */
    public function toArray(Request $request): array
    {
        $settings = $this->variantSetting;

        return [
            'settings' => [
                'id' => $settings?->id,
                'individual_prices_enabled' => $settings?->individual_prices_enabled ?? false,
                'photos_enabled' => $settings?->photos_enabled ?? false,
                'photo_option_id' => $settings?->photo_option_id,
                'default_photo_value_id' => $settings?->default_photo_value_id,
            ],
            'options' => $this->variantOptions
                ->map(fn (ShopItemVariantOption $option): array => [
                    'id' => $option->id,
                    'shop_attribute_id' => $option->shop_attribute_id,
                    'name' => $option->name,
                    'sort_order' => $option->sort_order,
                    'values' => $option->values
                        ->map(fn (ShopItemVariantValue $value): array => [
                            'id' => $value->id,
                            'shop_attribute_option_id' => $value->shop_attribute_option_id,
                            'value' => $value->value,
                            'sort_order' => $value->sort_order,
                        ])
                        ->values(),
                ])
                ->values(),
            'variants' => $this->variants
                ->map(fn (ShopItemVariant $variant): array => [
                    'id' => $variant->id,
                    'selections' => $variant->selections
                        ->sortBy(fn (ShopItemVariantSelection $selection): array => [
                            $selection->value->option->sort_order,
                            $selection->value->option->id,
                            $selection->value->sort_order,
                            $selection->value->id,
                        ])
                        ->map(fn (ShopItemVariantSelection $selection): array => [
                            'id' => $selection->id,
                            'option_id' => $selection->value->shop_item_variant_option_id,
                            'value_id' => $selection->shop_item_variant_value_id,
                        ])
                        ->values(),
                    'price' => $variant->price,
                    'quantity' => $variant->quantity,
                    'sku' => $variant->sku,
                    'is_active' => $variant->is_active,
                    'sort_order' => $variant->sort_order,
                ])
                ->values(),
            'photos' => $this->variantOptions
                ->flatMap(fn (ShopItemVariantOption $option) => $option->values)
                ->flatMap(fn (ShopItemVariantValue $value) => $value->photos)
                ->map(fn (ShopItemVariantPhoto $photo): array => [
                    'id' => $photo->id,
                    'shop_item_variant_value_id' => $photo->shop_item_variant_value_id,
                    'shop_item_media_id' => $photo->shop_item_media_id,
                    'sort_order' => $photo->sort_order,
                ])
                ->values(),
        ];
    }
}
