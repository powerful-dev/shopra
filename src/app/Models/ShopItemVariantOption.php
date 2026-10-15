<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class ShopItemVariantOption extends Model
{
    protected $fillable = [
        'shop_item_id',
        'shop_attribute_id',
        'name',
        'sort_order',
    ];

    protected function casts(): array
    {
        return [
            'sort_order' => 'integer',
        ];
    }

    public function item(): BelongsTo
    {
        return $this->belongsTo(ShopItem::class, 'shop_item_id');
    }

    public function attribute(): BelongsTo
    {
        return $this->belongsTo(ShopAttribute::class, 'shop_attribute_id');
    }

    public function values(): HasMany
    {
        return $this->hasMany(ShopItemVariantValue::class)->orderBy('sort_order');
    }

    public function photoSettings(): HasMany
    {
        return $this->hasMany(ShopItemVariantSetting::class, 'photo_option_id');
    }
}
