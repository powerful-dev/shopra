<?php

namespace App\Services;

use App\Models\ShopItem;

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
}
