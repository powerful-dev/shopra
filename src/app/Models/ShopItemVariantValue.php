<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

class ShopItemVariantValue extends Model
{
    protected $fillable = [
        'shop_item_variant_option_id',
        'shop_attribute_option_id',
        'value',
        'sort_order',
    ];

    protected function casts(): array
    {
        return [
            'sort_order' => 'integer',
        ];
    }

    public function option(): BelongsTo
    {
        return $this->belongsTo(ShopItemVariantOption::class, 'shop_item_variant_option_id');
    }

    public function attributeOption(): BelongsTo
    {
        return $this->belongsTo(ShopAttributeOption::class, 'shop_attribute_option_id');
    }

    public function selections(): HasMany
    {
        return $this->hasMany(ShopItemVariantSelection::class);
    }

    public function variants(): BelongsToMany
    {
        return $this->belongsToMany(
            ShopItemVariant::class,
            'shop_item_variant_selections',
            'shop_item_variant_value_id',
            'shop_item_variant_id',
        )->withTimestamps();
    }

    public function photos(): HasMany
    {
        return $this->hasMany(ShopItemVariantPhoto::class)->orderBy('sort_order');
    }

    public function media(): BelongsToMany
    {
        return $this->belongsToMany(
            ShopItemMedia::class,
            'shop_item_variant_photos',
            'shop_item_variant_value_id',
            'shop_item_media_id',
        )->withPivot('sort_order')->withTimestamps()->orderByPivot('sort_order');
    }

    public function defaultPhotoSettings(): HasMany
    {
        return $this->hasMany(ShopItemVariantSetting::class, 'default_photo_value_id');
    }
}
