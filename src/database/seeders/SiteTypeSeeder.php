<?php

namespace Database\Seeders;

use App\Models\Module;
use App\Models\SiteType;
use Illuminate\Database\Seeder;

class SiteTypeSeeder extends Seeder
{
    public function run(): void
    {
        $siteType = SiteType::updateOrCreate(
            ['code' => 'shop'],
            [
                'name' => 'Интернет-магазин',
            ]
        );

        $siteType->modules()->sync(
            Module::query()->pluck('id')
        );
    }
}