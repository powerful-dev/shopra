<?php

namespace Database\Seeders;

use App\Models\ShopUnit;
use Illuminate\Database\Seeder;

class ShopUnitSeeder extends Seeder
{
    public function run(): void
    {
        $codes = [
            'piece',
            'kilogram',
            'gram',
            'liter',
            'milliliter',
            'meter',
            'centimeter',
            'square_meter',
            'package',
            'set',
        ];

        foreach ($codes as $code) {
            $unit = ShopUnit::query()
                ->withTrashed()
                ->updateOrCreate(
                    ['code' => $code],
                    [
                        'name' => null,
                        'short_name' => null,
                        'is_system' => true,
                    ],
                );

            if ($unit->trashed()) {
                $unit->restore();
            }
        }
    }
}
