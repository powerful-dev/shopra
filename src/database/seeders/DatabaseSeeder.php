<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->call([
            LanguageSeeder::class,
            AdminSeeder::class,
            ModuleSeeder::class,
            SiteTypeSeeder::class,
            SiteSeeder::class,
            ShopSeeder::class,
            ShopUnitSeeder::class,
        ]);

        //if (app()->environment('local')) {
            $this->call(ShopCatalogSeeder::class);
        //}
    }
}
