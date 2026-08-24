<?php

namespace Database\Seeders;

namespace Database\Seeders;

use App\Models\Shop;
use Illuminate\Database\Seeder;

class ShopSeeder extends Seeder
{
    public function run(): void
    {
        Shop::updateOrCreate(
            ['id' => 1],
            [
                'name' => '',
                'logo' => null,
                'theme' => null,
                'default_shop_unit_id' => null,
                'low_stock_threshold' => 5,
            ]
        );
    }
}