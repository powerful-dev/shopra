<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

class ShopItemMedia extends Model
{
    public const TYPE_IMAGE = 'image';

    public const TYPE_VIDEO = 'video';

    protected $table = 'shop_item_media';

    protected $fillable = [
        'shop_item_id',
        'type',
        'filename',
        'sort_order',
        'is_main',
    ];

    protected function casts(): array
    {
        return [
            'sort_order' => 'integer',
            'is_main' => 'boolean',
        ];
    }

    public function item(): BelongsTo
    {
        return $this->belongsTo(ShopItem::class, 'shop_item_id');
    }

    public function variantPhotos(): HasMany
    {
        return $this->hasMany(ShopItemVariantPhoto::class);
    }

    public function variantValues(): BelongsToMany
    {
        return $this->belongsToMany(
            ShopItemVariantValue::class,
            'shop_item_variant_photos',
            'shop_item_media_id',
            'shop_item_variant_value_id',
        )->withPivot('sort_order')->withTimestamps();
    }
}
