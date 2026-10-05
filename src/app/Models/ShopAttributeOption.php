<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class ShopAttributeOption extends Model
{
    protected $fillable = [
        'attribute_id',
        'value',
        'sort_order',
    ];

    protected function casts(): array
    {
        return [
            'sort_order' => 'integer',
        ];
    }

    public function attribute(): BelongsTo
    {
        return $this->belongsTo(ShopAttribute::class, 'attribute_id');
    }

    public function itemAttributes(): BelongsToMany
    {
        return $this->belongsToMany(
            ShopItemAttribute::class,
            'shop_item_attribute_options',
            'option_id',
            'item_attribute_id',
        );
    }
}
