<?php

namespace App\Models;

use App\Enums\ShopItemStatus;
use App\Enums\SupportedCurrency;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class ShopItem extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'name',
        'sku',
        'url',
        'price',
        'old_price',
        'currency',
        'quantity',
        'description',
        'seo_title',
        'seo_description',
        'shop_group_id',
        'shop_unit_id',
        'show_stock',
        'status',
    ];

    protected function casts(): array
    {
        return [
            'price' => 'decimal:2',
            'old_price' => 'decimal:2',
            'currency' => SupportedCurrency::class,
            'quantity' => 'integer',
            'show_stock' => 'boolean',
            'status' => ShopItemStatus::class,
        ];
    }

    public function groups(): BelongsToMany
    {
        return $this->belongsToMany(ShopGroup::class);
    }

    public function shopGroup(): BelongsTo
    {
        return $this->belongsTo(ShopGroup::class);
    }

    public function unit(): BelongsTo
    {
        return $this->belongsTo(ShopUnit::class, 'shop_unit_id');
    }

    public function media(): HasMany
    {
        return $this->hasMany(ShopItemMedia::class);
    }

    public function itemAttributes(): HasMany
    {
        return $this->hasMany(ShopItemAttribute::class);
    }

    public function attributes(): BelongsToMany
    {
        return $this->belongsToMany(ShopAttribute::class, 'shop_item_attributes', 'shop_item_id', 'attribute_id')
            ->withPivot(['id', 'text_value', 'number_value', 'boolean_value'])
            ->withTimestamps();
    }
}
