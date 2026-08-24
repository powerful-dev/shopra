<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class ShopGroup extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'name',
        'url',
    ];

    public function items(): BelongsToMany
    {
        return $this->belongsToMany(ShopItem::class);
    }
}
