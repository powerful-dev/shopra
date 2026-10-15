<?php

namespace App\Services;

use App\Models\ShopItem;
use App\Models\ShopItemVariant;
use App\Models\ShopItemVariantOption;
use App\Models\ShopItemVariantPhoto;
use App\Models\ShopItemVariantValue;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Relations\Relation;
use Illuminate\Support\Facades\DB;

class ProductVariantsService
{
    public function forItem(ShopItem $item): ShopItem
    {
        return $item->load([
            'variantSetting',
            'variantOptions' => fn ($query) => $query->orderBy('id'),
            'variantOptions.values' => fn ($query) => $query->orderBy('id'),
            'variantOptions.values.photos' => fn ($query) => $query->orderBy('id'),
            'variants' => fn ($query) => $query->orderBy('id'),
            'variants.selections.value.option',
        ]);
    }

    /** @param array<string, mixed> $data */
    public function sync(ShopItem $item, array $data): ShopItem
    {
        $syncedItem = DB::transaction(function () use ($item, $data): ShopItem {
            $lockedItem = ShopItem::query()->lockForUpdate()->findOrFail($item->getKey());
            $optionIds = collect($data['options'])
                ->pluck('id')
                ->filter(fn (mixed $id): bool => $this->isPersistentReference($id))
                ->map(fn (int|string $id): int => (int) $id)
                ->all();

            $this->deleteMissing($lockedItem->variantOptions(), $optionIds);
            if ($optionIds !== []) {
                ShopItemVariantOption::query()
                    ->where('shop_item_id', $lockedItem->id)
                    ->whereKey($optionIds)
                    ->update([
                        'shop_attribute_id' => null,
                        'name' => null,
                    ]);
            }
            $currentOptions = $lockedItem->variantOptions()->get()->keyBy('id');

            $optionMap = [];
            $valueMap = [];

            foreach ($data['options'] as $optionData) {
                $option = $this->isPersistentReference($optionData['id'])
                    ? $currentOptions->get((int) $optionData['id'])
                    : new ShopItemVariantOption(['shop_item_id' => $lockedItem->id]);
                $option->fill([
                    'shop_attribute_id' => $optionData['shop_attribute_id'] ?? null,
                    'name' => $optionData['name'] ?? null,
                    'sort_order' => $optionData['sort_order'],
                ])->save();
                $optionMap[$this->referenceKey($optionData['id'])] = $option;

                $valueIds = collect($optionData['values'])
                    ->pluck('id')
                    ->filter(fn (mixed $id): bool => $this->isPersistentReference($id))
                    ->map(fn (int|string $id): int => (int) $id)
                    ->all();
                $this->deleteMissing($option->values(), $valueIds);
                if ($valueIds !== []) {
                    ShopItemVariantValue::query()
                        ->where('shop_item_variant_option_id', $option->id)
                        ->whereKey($valueIds)
                        ->update([
                            'shop_attribute_option_id' => null,
                            'value' => null,
                        ]);
                }
                $currentValues = $option->values()->get()->keyBy('id');

                foreach ($optionData['values'] as $valueData) {
                    $value = $this->isPersistentReference($valueData['id'])
                        ? $currentValues->get((int) $valueData['id'])
                        : new ShopItemVariantValue(['shop_item_variant_option_id' => $option->id]);
                    $value->fill([
                        'shop_attribute_option_id' => $valueData['shop_attribute_option_id'] ?? null,
                        'value' => $valueData['value'] ?? null,
                        'sort_order' => $valueData['sort_order'],
                    ])->save();
                    $valueMap[$this->referenceKey($valueData['id'])] = $value;
                }
            }

            $variantIds = collect($data['variants'])->pluck('id')->filter()->map(fn (int $id): int => $id)->all();
            $this->deleteMissing($lockedItem->variants(), $variantIds);
            if ($variantIds !== []) {
                ShopItemVariant::query()
                    ->where('shop_item_id', $lockedItem->id)
                    ->whereKey($variantIds)
                    ->update(['sku' => null]);
            }
            $currentVariants = $lockedItem->variants()->get()->keyBy('id');

            foreach ($data['variants'] as $variantData) {
                $variant = isset($variantData['id'])
                    ? $currentVariants->get($variantData['id'])
                    : new ShopItemVariant(['shop_item_id' => $lockedItem->id]);
                $variant->fill([
                    'sku' => $variantData['sku'] ?? null,
                    'price' => $variantData['price'],
                    'quantity' => $variantData['quantity'],
                    'is_active' => $variantData['is_active'],
                    'sort_order' => $variantData['sort_order'],
                ])->save();
                $variant->values()->sync(collect($variantData['selections'])
                    ->map(fn (array $selection): int => $valueMap[$this->referenceKey($selection['value_id'])]->id)
                    ->all());
            }

            $photoIds = collect($data['photos'])->pluck('id')->filter()->map(fn (int $id): int => $id)->all();
            $photoQuery = ShopItemVariantPhoto::query()
                ->whereHas('value.option', fn ($query) => $query->where('shop_item_id', $lockedItem->id));
            $this->deleteMissing($photoQuery, $photoIds);
            $currentPhotos = ShopItemVariantPhoto::query()
                ->whereKey($photoIds)
                ->whereHas('value.option', fn ($query) => $query->where('shop_item_id', $lockedItem->id))
                ->get()
                ->keyBy('id');

            foreach ($data['photos'] as $photoData) {
                $photo = isset($photoData['id'])
                    ? $currentPhotos->get($photoData['id'])
                    : new ShopItemVariantPhoto;
                $photo->fill([
                    'shop_item_variant_value_id' => $valueMap[$this->referenceKey($photoData['shop_item_variant_value_id'])]->id,
                    'shop_item_media_id' => $photoData['shop_item_media_id'],
                    'sort_order' => $photoData['sort_order'],
                ])->save();
            }

            $settingsData = $data['settings'];
            $lockedItem->variantSetting()->updateOrCreate([], [
                'individual_prices_enabled' => $settingsData['individual_prices_enabled'],
                'photos_enabled' => $settingsData['photos_enabled'],
                'photo_option_id' => isset($settingsData['photo_option_id'])
                    ? $optionMap[$this->referenceKey($settingsData['photo_option_id'])]->id
                    : null,
                'default_photo_value_id' => isset($settingsData['default_photo_value_id'])
                    ? $valueMap[$this->referenceKey($settingsData['default_photo_value_id'])]->id
                    : null,
            ]);

            return $lockedItem;
        });

        return $this->forItem($syncedItem->fresh());
    }

    /** @param array<int, int> $ids */
    private function deleteMissing(Builder|Relation $query, array $ids): void
    {
        $query->when($ids !== [], fn (Builder $query) => $query->whereNotIn('id', $ids))->delete();
    }

    private function referenceKey(int|string $reference): string
    {
        return $this->isPersistentReference($reference)
            ? 'id:'.(int) $reference
            : 'tmp:'.$reference;
    }

    private function isPersistentReference(mixed $reference): bool
    {
        return is_int($reference) || (is_string($reference) && ctype_digit($reference));
    }
}
