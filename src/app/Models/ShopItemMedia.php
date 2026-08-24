<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ShopItemMedia extends Model
{
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
}
