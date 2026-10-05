<?php

namespace App\Models;

use App\Enums\ShopAttributeType;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

class ShopAttribute extends Model
{
    protected $fillable = [
        'name',
        'type',
        'unit',
        'is_visible',
        'is_filterable',
        'sort_order',
    ];

    protected function casts(): array
    {
        return [
            'type' => ShopAttributeType::class,
            'is_visible' => 'boolean',
            'is_filterable' => 'boolean',
            'sort_order' => 'integer',
        ];
    }

    public function options(): HasMany
    {
        return $this->hasMany(ShopAttributeOption::class, 'attribute_id');
    }

    public function itemAttributes(): HasMany
    {
        return $this->hasMany(ShopItemAttribute::class, 'attribute_id');
    }

    public function items(): BelongsToMany
    {
        return $this->belongsToMany(ShopItem::class, 'shop_item_attributes', 'attribute_id', 'shop_item_id')
            ->withPivot(['id', 'text_value', 'number_value', 'boolean_value'])
            ->withTimestamps();
    }
}
