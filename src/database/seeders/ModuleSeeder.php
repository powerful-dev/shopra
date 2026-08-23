<?php

namespace Database\Seeders;

use App\Models\Module;
use Illuminate\Database\Seeder;

class ModuleSeeder extends Seeder
{
    public function run(): void
    {
        $modules = [
            [
                'code' => 'dashboard',
                'admin_path' => '/admin/dashboard',
                'icon' => 'home',
                'sorting' => 10,
                'show_in_menu' => 1,
                'is_required' => 1,
            ],
            [
                'code' => 'appearance',
                'admin_path' => '/admin/appearance',
                'icon' => 'appearance',
                'sorting' => 20,
                'show_in_menu' => 1,
                'is_required' => 0,
            ],
            [
                'code' => 'products',
                'admin_path' => '/admin/products',
                'icon' => 'products',
                'sorting' => 30,
                'show_in_menu' => 1,
                'is_required' => 0,
            ],
            [
                'code' => 'orders',
                'admin_path' => '/admin/orders',
                'icon' => 'orders',
                'sorting' => 40,
                'show_in_menu' => 1,
                'is_required' => 0,
            ],
            [
                'code' => 'deliveries',
                'admin_path' => '/admin/deliveries',
                'icon' => 'shipping',
                'sorting' => 50,
                'show_in_menu' => 1,
                'is_required' => 0,
            ],
            [
                'code' => 'payments',
                'admin_path' => '/admin/payments',
                'icon' => 'payments',
                'sorting' => 60,
                'show_in_menu' => 1,
                'is_required' => 0,
            ],
            [
                'code' => 'discounts',
                'admin_path' => '/admin/discounts',
                'icon' => 'discounts',
                'sorting' => 70,
                'show_in_menu' => 1,
                'is_required' => 0,
            ],
            [
                'code' => 'analytics',
                'admin_path' => '/admin/analytics',
                'icon' => 'analytics',
                'sorting' => 80,
                'show_in_menu' => 1,
                'is_required' => 0,
            ], 
            [
                'code' => 'domain',
                'admin_path' => '/admin/domain',
                'icon' => 'domain',
                'sorting' => 90,
                'show_in_menu' => 1,
                'is_required' => 0,
            ],
            [
                'code' => 'settings',
                'admin_path' => '/admin/settings',
                'icon' => 'settings',
                'sorting' => 100,
                'show_in_menu' => 1,
                'is_required' => 0,
            ],
            [
                'code' => 'administrators',
                'admin_path' => '/admin/administrators',
                'icon' => 'administrators',
                'sorting' => 110,
                'show_in_menu' => 0,
                'is_required' => 0,
            ],
        ];

        foreach ($modules as $module) {
            Module::updateOrCreate(
                ['code' => $module['code']],
                $module
            );
        }
    }
}