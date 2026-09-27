<?php

namespace App\Models;

use App\Enums\ImageFit;
use App\Enums\ImageFormat;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

#[Fillable([
    'name',
    'logo',
    'theme',
    'low_stock_threshold',
    'default_shop_unit_id',
    'group_small_image_max_width',
    'group_small_image_max_height',
    'group_small_image_fit',
    'group_large_image_max_width',
    'group_large_image_max_height',
    'group_large_image_fit',
    'group_image_format',
    'product_small_image_max_width',
    'product_small_image_max_height',
    'product_small_image_fit',
    'product_large_image_max_width',
    'product_large_image_max_height',
    'product_large_image_fit',
    'product_image_format',
])]
class Shop extends Model
{
    protected function casts(): array
    {
        return [
            'low_stock_threshold' => 'integer',
            'group_small_image_max_width' => 'integer',
            'group_small_image_max_height' => 'integer',
            'group_small_image_fit' => ImageFit::class,
            'group_large_image_max_width' => 'integer',
            'group_large_image_max_height' => 'integer',
            'group_large_image_fit' => ImageFit::class,
            'group_image_format' => ImageFormat::class,
            'product_small_image_max_width' => 'integer',
            'product_small_image_max_height' => 'integer',
            'product_small_image_fit' => ImageFit::class,
            'product_large_image_max_width' => 'integer',
            'product_large_image_max_height' => 'integer',
            'product_large_image_fit' => ImageFit::class,
            'product_image_format' => ImageFormat::class,
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
