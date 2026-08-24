<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

#[Fillable(['name', 'logo', 'theme', 'low_stock_threshold', 'default_shop_unit_id'])]
class Shop extends Model
{
    protected function casts(): array
    {
        return [
            'low_stock_threshold' => 'integer',
        ];
    }

    public function defaultShopUnit(): BelongsTo
    {
        return $this->belongsTo(ShopUnit::class, 'default_shop_unit_id');
    }

    /** @return array<string, string> */
    public static function themes(): array
    {
        return [
            'clothing' => 'Одежда и обувь',
            'beauty' => 'Красота и здоровье',
            'food' => 'Продукты питания',
            'home' => 'Дом и интерьер',
            'electronics' => 'Электроника и техника',
            'children' => 'Детские товары',
            'sport' => 'Спорт и отдых',
            'other' => 'Другое',
        ];
    }
}
