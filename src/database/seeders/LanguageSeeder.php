<?php

namespace Database\Seeders;

use App\Models\Language;
use Illuminate\Database\Seeder;

class LanguageSeeder extends Seeder
{
    public function run(): void
    {
        $languages = [
            ['code' => 'ru', 'name' => 'Русский'],
            ['code' => 'uk', 'name' => 'Українська'],
            ['code' => 'en', 'name' => 'English'],
        ];

        foreach ($languages as $language) {
            Language::updateOrCreate(
                ['code' => $language['code']],
                [
                    'name' => $language['name'],
                    'is_admin' => true,
                    'is_site' => true,
                    'is_active' => true,
                ]
            );
        }
    }
}
