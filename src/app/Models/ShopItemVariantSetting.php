<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ShopItemVariantSetting extends Model
{
    protected $fillable = [
        'shop_item_id',
        'individual_prices_enabled',
        'photos_enabled',
        'photo_option_id',
        'default_photo_value_id',
    ];

    protected function casts(): array
    {
        return [
            'individual_prices_enabled' => 'boolean',
            'photos_enabled' => 'boolean',
        ];
    }

    public function item(): BelongsTo
    {
        return $this->belongsTo(ShopItem::class, 'shop_item_id');
    }

    public function photoOption(): BelongsTo
    {
        return $this->belongsTo(ShopItemVariantOption::class, 'photo_option_id');
    }

    public function defaultPhotoValue(): BelongsTo
    {
        return $this->belongsTo(ShopItemVariantValue::class, 'default_photo_value_id');
    }
}
