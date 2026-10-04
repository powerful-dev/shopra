<?php

namespace App\Services;

use App\Models\Language;
use App\Models\Shop;
use App\Models\ShopCurrency;
use App\Models\ShopUnit;
use App\Models\Site;
use App\Models\User;
use Illuminate\Support\Facades\DB;

class SettingsService
{
    /** @return list<string> */
    public function getAvailableCurrencyCodes(): array
    {
        $baseCurrency = Shop::query()->first()?->currency;
        $additionalCurrencies = ShopCurrency::query()
            ->orderBy('id')
            ->get(['currency_code'])
            ->map(fn (ShopCurrency $currency): string => $currency->currency_code->value)
            ->all();

        return array_values(array_unique(array_filter([
            $baseCurrency?->value,
            ...$additionalCurrencies,
        ])));
    }

    /** @return array<string, mixed> */
    public function getGeneral(User $user): array
    {
        $site = Site::query()->firstOrFail();

        return [
            'site_name' => $site->name,
            'admin_language_id' => $user->admin_language_id,
            'site_language_id' => $site->site_language_id,
            'admin_languages' => $this->languagesFor('is_admin'),
            'site_languages' => $this->languagesFor('is_site'),
        ];
    }

    /** @param array<string, mixed> $data */
    public function updateGeneral(User $user, array $data): array
    {
        DB::transaction(function () use ($user, $data): void {
            Site::query()->firstOrFail()->update([
                'name' => $data['site_name'],
                'site_language_id' => $data['site_language_id'],
            ]);

            $user->update(['admin_language_id' => $data['admin_language_id']]);
        });

        return $this->getGeneral($user->refresh());
    }

    /** @return array<string, mixed> */
    public function getCurrencies(): array
    {
        $shop = Shop::query()->firstOrFail();

        return [
            'currency' => $shop->currency?->value,
            'currency_rates' => ShopCurrency::query()
                ->orderBy('id')
                ->get(['currency_code', 'rate'])
                ->map(fn (ShopCurrency $currency): array => [
                    'code' => $currency->currency_code->value,
                    'rate' => $this->formatRate($currency->rate),
                ])
                ->all(),
        ];
    }

    /** @param array<string, mixed> $data */
    public function updateCurrencies(array $data): array
    {
        DB::transaction(function () use ($data): void {
            Shop::query()->firstOrFail()->update(['currency' => $data['currency']]);
            $this->syncCurrencyRates($data['currency'], $data['currency_rates']);
        });

        return $this->getCurrencies();
    }

    /** @return array<string, mixed> */
    public function getCatalog(): array
    {
        $shop = Shop::query()->firstOrFail();

        return [
            'low_stock_threshold' => $shop->low_stock_threshold,
            'default_shop_unit_id' => $shop->default_shop_unit_id,
            'shop_units' => ShopUnit::query()
                ->orderByDesc('is_system')
                ->orderBy('code')
                ->orderBy('name')
                ->get(['id', 'code', 'name', 'short_name', 'is_system'])
                ->toArray(),
        ];
    }

    /** @param array<string, mixed> $data */
    public function updateCatalog(array $data): array
    {
        Shop::query()->firstOrFail()->update([
            'low_stock_threshold' => $data['low_stock_threshold'],
            'default_shop_unit_id' => $data['default_shop_unit_id'],
        ]);

        return $this->getCatalog();
    }

    /** @return array<string, mixed> */
    public function getImages(): array
    {
        $shop = Shop::query()->firstOrFail();

        return [
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
        ];
    }

    /** @param array<string, mixed> $data */
    public function updateImages(array $data): array
    {
        Shop::query()->firstOrFail()->update($data);

        return $this->getImages();
    }

    /** @return list<array<string, mixed>> */
    private function languagesFor(string $column): array
    {
        return Language::query()
            ->where($column, true)
            ->orderBy('code')
            ->get(['id', 'code', 'name'])
            ->toArray();
    }

    /** @param list<array{code: string, rate: string}> $rates */
    private function syncCurrencyRates(?string $baseCurrency, array $rates): void
    {
        $rates = array_values(array_filter(
            $rates,
            fn (array $rate): bool => $rate['code'] !== $baseCurrency,
        ));
        $currencyCodes = array_column($rates, 'code');

        if ($currencyCodes === []) {
            ShopCurrency::query()->delete();

            return;
        }

        ShopCurrency::query()->whereNotIn('currency_code', $currencyCodes)->delete();

        $now = now();
        ShopCurrency::query()->upsert(
            array_map(
                fn (array $rate): array => [
                    'currency_code' => $rate['code'],
                    'rate' => $rate['rate'],
                    'created_at' => $now,
                    'updated_at' => $now,
                ],
                $rates,
            ),
            ['currency_code'],
            ['rate', 'updated_at'],
        );
    }

    private function formatRate(string $rate): string
    {
        [$integer, $fraction] = array_pad(explode('.', $rate, 2), 2, '');
        $fraction = str_pad(rtrim($fraction, '0'), 2, '0');

        return $integer.'.'.$fraction;
    }
}
