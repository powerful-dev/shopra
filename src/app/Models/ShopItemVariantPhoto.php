<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ShopItemVariantPhoto extends Model
{
    protected $fillable = [
        'shop_item_variant_value_id',
        'shop_item_media_id',
        'sort_order',
    ];

    protected function casts(): array
    {
        return [
            'sort_order' => 'integer',
        ];
    }

    public function value(): BelongsTo
    {
        return $this->belongsTo(ShopItemVariantValue::class, 'shop_item_variant_value_id');
    }

    public function media(): BelongsTo
    {
        return $this->belongsTo(ShopItemMedia::class, 'shop_item_media_id');
    }
}
