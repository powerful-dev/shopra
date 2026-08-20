<?php

namespace Database\Seeders;

use App\Models\Site;
use App\Models\SiteType;
use Illuminate\Database\Seeder;

class SiteSeeder extends Seeder
{
    public function run(): void
    {
        $siteType = SiteType::where('code', 'shop')->firstOrFail();

        Site::updateOrCreate(
            ['id' => 1],
            [
                'name' => 'Тестовый интернет-магазин',
                'site_type_id' => $siteType->id,
            ]
        );
    }
}