<?php

namespace App\Models;

use App\Enums\ShopItemStatus;
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
        'quantity',
        'shop_unit_id',
        'show_stock',
        'status',
    ];

    protected function casts(): array
    {
        return [
            'price' => 'decimal:2',
            'old_price' => 'decimal:2',
            'quantity' => 'integer',
            'show_stock' => 'boolean',
            'status' => ShopItemStatus::class,
        ];
    }

    public function groups(): BelongsToMany
    {
        return $this->belongsToMany(ShopGroup::class);
    }

    public function unit(): BelongsTo
    {
        return $this->belongsTo(ShopUnit::class, 'shop_unit_id');
    }

    public function media(): HasMany
    {
        return $this->hasMany(ShopItemMedia::class);
    }
}
