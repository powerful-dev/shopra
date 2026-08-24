<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class ShopUnit extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'code',
        'name',
        'short_name',
        'is_system',
    ];

    protected function casts(): array
    {
        return [
            'is_system' => 'boolean',
        ];
    }

    public function items(): HasMany
    {
        return $this->hasMany(ShopItem::class);
    }
}
