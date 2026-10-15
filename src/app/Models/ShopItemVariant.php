<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

class ShopItemVariant extends Model
{
    protected $fillable = [
        'shop_item_id',
        'sku',
        'price',
        'quantity',
        'is_active',
        'sort_order',
    ];

    protected function casts(): array
    {
        return [
            'price' => 'decimal:2',
            'quantity' => 'integer',
            'is_active' => 'boolean',
            'sort_order' => 'integer',
        ];
    }

    public function item(): BelongsTo
    {
        return $this->belongsTo(ShopItem::class, 'shop_item_id');
    }

    public function selections(): HasMany
    {
        return $this->hasMany(ShopItemVariantSelection::class);
    }

    public function values(): BelongsToMany
    {
        return $this->belongsToMany(
            ShopItemVariantValue::class,
            'shop_item_variant_selections',
            'shop_item_variant_id',
            'shop_item_variant_value_id',
        )->withTimestamps();
    }
}
