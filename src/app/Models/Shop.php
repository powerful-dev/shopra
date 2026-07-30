<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;

#[Fillable(['name', 'logo', 'theme'])]
class Shop extends Model
{
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
