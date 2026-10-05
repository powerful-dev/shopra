<?php

namespace App\Services;

use App\Enums\ShopAttributeType;
use App\Models\ShopAttribute;
use App\Models\ShopItem;
use App\Models\ShopItemAttribute;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Support\Facades\DB;

class ShopItemAttributeService
{
    /** @return Collection<int, ShopItemAttribute> */
    public function forItem(ShopItem $item): Collection
    {
        return $item->itemAttributes()
            ->with([
                'attribute.options' => fn ($query) => $query->orderBy('sort_order')->orderBy('id'),
                'options' => fn ($query) => $query->orderBy('sort_order')->orderBy('id'),
            ])
            ->orderBy('sort_order')
            ->orderBy('id')
            ->get();
    }

    /**
     * @param  array<int, array{attribute_id: int, value: mixed, sort_order: int}>  $rows
     * @return Collection<int, ShopItemAttribute>
     */
    public function sync(ShopItem $item, array $rows): Collection
    {
        return DB::transaction(function () use ($item, $rows): Collection {
            $lockedItem = ShopItem::query()->lockForUpdate()->findOrFail($item->getKey());
            $attributeIds = collect($rows)->pluck('attribute_id');
            $attributes = ShopAttribute::query()->whereKey($attributeIds)->get()->keyBy('id');

            $existingValues = $lockedItem->itemAttributes()
                ->get()
                ->keyBy('attribute_id');

            foreach ($rows as $row) {
                $attribute = $attributes->get($row['attribute_id']);
                $itemAttribute = $existingValues->get($attribute->id) ?? new ShopItemAttribute([
                    'shop_item_id' => $lockedItem->id,
                    'attribute_id' => $attribute->id,
                ]);
                $value = $row['value'] ?? null;

                $itemAttribute->fill([
                    'text_value' => $attribute->type === ShopAttributeType::Text ? $value : null,
                    'number_value' => $attribute->type === ShopAttributeType::Number ? $value : null,
                    'boolean_value' => $attribute->type === ShopAttributeType::Boolean ? $value : null,
                    'sort_order' => $row['sort_order'],
                ])->save();

                $optionIds = match ($attribute->type) {
                    ShopAttributeType::Select => [$value],
                    ShopAttributeType::Multiselect => $value,
                    default => [],
                };
                $itemAttribute->options()->sync($optionIds);
            }

            $lockedItem->itemAttributes()
                ->when($attributeIds->isNotEmpty(), fn ($query) => $query->whereNotIn('attribute_id', $attributeIds))
                ->delete();

            return $this->forItem($lockedItem);
        });
    }
}
