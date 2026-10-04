<?php

namespace App\Models;

use App\Enums\SupportedCurrency;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;

#[Fillable([
    'currency_code',
    'rate',
])]
class ShopCurrency extends Model
{
    protected function casts(): array
    {
        return [
            'currency_code' => SupportedCurrency::class,
            'rate' => 'decimal:8',
        ];
    }
}
