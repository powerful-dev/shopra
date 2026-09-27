<?php

namespace App\Services;

use App\Models\Language;
use App\Models\Shop;
use App\Models\ShopUnit;
use App\Models\Site;
use App\Models\User;
use Illuminate\Support\Facades\DB;

class CommonSettingsService
{
    /** @return array<string, mixed> */
    public function get(User $user): array
    {
        $site = Site::query()->firstOrFail();
        $shop = Shop::query()->firstOrFail();

        return [
            'site_name' => $site->name,
            'admin_language_id' => $user->admin_language_id,
            'site_language_id' => $site->site_language_id,
            'low_stock_threshold' => $shop->low_stock_threshold,
            'default_shop_unit_id' => $shop->default_shop_unit_id,
            'group_small_image_max_width' => $shop->group_small_image_max_width,
            'group_small_image_max_height' => $shop->group_small_image_max_height,
            'group_small_image_fit' => $shop->group_small_image_fit,
            'group_large_image_max_width' => $shop->group_large_image_max_width,
            'group_large_image_max_height' => $shop->group_large_image_max_height,
            'group_large_image_fit' => $shop->group_large_image_fit,
            'group_image_format' => $shop->group_image_format,
            'product_small_image_max_width' => $shop->product_small_image_max_width,
            'product_small_image_max_height' => $shop->product_small_image_max_height,
            'product_small_image_fit' => $shop->product_small_image_fit,
            'product_large_image_max_width' => $shop->product_large_image_max_width,
            'product_large_image_max_height' => $shop->product_large_image_max_height,
            'product_large_image_fit' => $shop->product_large_image_fit,
            'product_image_format' => $shop->product_image_format,
            'admin_languages' => $this->languagesFor('is_admin'),
            'site_languages' => $this->languagesFor('is_site'),
            'shop_units' => ShopUnit::query()
                ->orderByDesc('is_system')
                ->orderBy('code')
                ->orderBy('name')
                ->get(['id', 'code', 'name', 'short_name', 'is_system'])
                ->toArray(),
        ];
    }

    /** @param array<string, mixed> $data */
    public function update(User $user, array $data): array
    {
        DB::transaction(function () use ($user, $data): void {
            $site = Site::query()->firstOrFail();
            $site->update([
                'name' => $data['site_name'],
                'site_language_id' => $data['site_language_id'],
            ]);

            $user->update([
                'admin_language_id' => $data['admin_language_id'],
            ]);

            Shop::query()->firstOrFail()->update([
                'low_stock_threshold' => $data['low_stock_threshold'],
                'default_shop_unit_id' => $data['default_shop_unit_id'],
                'group_small_image_max_width' => $data['group_small_image_max_width'],
                'group_small_image_max_height' => $data['group_small_image_max_height'],
                'group_small_image_fit' => $data['group_small_image_fit'],
                'group_large_image_max_width' => $data['group_large_image_max_width'],
                'group_large_image_max_height' => $data['group_large_image_max_height'],
                'group_large_image_fit' => $data['group_large_image_fit'],
                'group_image_format' => $data['group_image_format'],
                'product_small_image_max_width' => $data['product_small_image_max_width'],
                'product_small_image_max_height' => $data['product_small_image_max_height'],
                'product_small_image_fit' => $data['product_small_image_fit'],
                'product_large_image_max_width' => $data['product_large_image_max_width'],
                'product_large_image_max_height' => $data['product_large_image_max_height'],
                'product_large_image_fit' => $data['product_large_image_fit'],
                'product_image_format' => $data['product_image_format'],
            ]);
        });

        return $this->get($user->refresh());
    }

    private function languagesFor(string $column): array
    {
        return Language::query()
            ->where($column, true)
            ->orderBy('code')
            ->get(['id', 'code', 'name'])
            ->toArray();
    }
}
