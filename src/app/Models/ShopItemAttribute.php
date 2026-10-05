<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class ShopItemAttribute extends Model
{
    protected $fillable = [
        'shop_item_id',
        'attribute_id',
        'text_value',
        'number_value',
        'boolean_value',
    ];

    protected function casts(): array
    {
        return [
            'number_value' => 'decimal:6',
            'boolean_value' => 'boolean',
        ];
    }

    public function item(): BelongsTo
    {
        return $this->belongsTo(ShopItem::class, 'shop_item_id');
    }

    public function attribute(): BelongsTo
    {
        return $this->belongsTo(ShopAttribute::class, 'attribute_id');
    }

    public function options(): BelongsToMany
    {
        return $this->belongsToMany(
            ShopAttributeOption::class,
            'shop_item_attribute_options',
            'item_attribute_id',
            'option_id',
        );
    }
}
