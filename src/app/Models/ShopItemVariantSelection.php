<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ShopItemVariantSelection extends Model
{
    protected $fillable = [
        'shop_item_variant_id',
        'shop_item_variant_value_id',
    ];

    public function variant(): BelongsTo
    {
        return $this->belongsTo(ShopItemVariant::class, 'shop_item_variant_id');
    }

    public function value(): BelongsTo
    {
        return $this->belongsTo(ShopItemVariantValue::class, 'shop_item_variant_value_id');
    }
}
