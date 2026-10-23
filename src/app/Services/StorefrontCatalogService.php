<?php

namespace App\Services;

use App\Enums\ImageVariant;
use App\Enums\ShopItemStatus;
use App\Enums\SupportedCurrency;
use App\Models\Shop;
use App\Models\ShopCurrency;
use App\Models\ShopGroup;
use App\Models\ShopItem;
use App\Models\ShopItemMedia;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Collection;

class StorefrontCatalogService
{
    public const PRODUCTS_PER_PAGE = 15;

    public function __construct(private readonly ShopItemImageStorageService $imageStorage) {}

    /** @return LengthAwarePaginator<int, array<string, mixed>> */
    public function productsForCategory(ShopGroup $category): LengthAwarePaginator
    {
        $storeCurrency = Shop::query()->first()?->currency;
        $rates = ShopCurrency::query()
            ->get(['currency_code', 'rate'])
            ->mapWithKeys(fn (ShopCurrency $currency): array => [
                $currency->currency_code->value => (float) $currency->rate,
            ]);

        return ShopItem::query()
            ->where('status', ShopItemStatus::Active)
            ->where(function (Builder $query) use ($category): void {
                $query
                    ->where('shop_group_id', $category->getKey())
                    ->orWhereHas('groups', fn (Builder $groups): Builder => $groups->whereKey($category->getKey()));
            })
            ->with([
                'media' => fn (HasMany $media): HasMany => $media
                    ->where('type', ShopItemMedia::TYPE_IMAGE)
                    ->orderByDesc('is_main')
                    ->orderBy('sort_order')
                    ->orderBy('id'),
            ])
            ->orderByDesc('id')
            ->paginate(self::PRODUCTS_PER_PAGE)
            ->withQueryString()
            ->through(fn (ShopItem $product): array => $this->catalogProduct($product, $storeCurrency, $rates));
    }

    /**
     * @param  Collection<string, float>  $rates
     * @return array<string, mixed>
     */
    private function catalogProduct(ShopItem $product, ?SupportedCurrency $storeCurrency, Collection $rates): array
    {
        $mainImage = $product->media->first();
        $sourceCurrency = $product->currency ?? $storeCurrency;
        $price = $this->convertPrice($product->price, $sourceCurrency, $storeCurrency, $rates);
        $oldPrice = $this->convertPrice($product->old_price, $sourceCurrency, $storeCurrency, $rates);

        return [
            'id' => $product->getKey(),
            'name' => $product->name ?: 'Товар без названия',
            'url' => $product->url,
            'image_url' => $mainImage === null
                ? null
                : $this->imageStorage->imageUrl($product->getKey(), ImageVariant::Small, $mainImage->filename),
            'price' => $price,
            'old_price' => $oldPrice,
            'formatted_price' => $this->formatPrice($price, $storeCurrency),
            'formatted_old_price' => $this->formatPrice($oldPrice, $storeCurrency),
        ];
    }

    /** @param Collection<string, float> $rates */
    private function convertPrice(
        int|float|string|null $price,
        ?SupportedCurrency $sourceCurrency,
        ?SupportedCurrency $storeCurrency,
        Collection $rates,
    ): ?float {
        if ($price === null || $sourceCurrency === null || $storeCurrency === null) {
            return null;
        }

        $amount = (float) $price;

        if ($sourceCurrency === $storeCurrency) {
            return $amount;
        }

        $rate = $rates->get($sourceCurrency->value);

        return is_numeric($rate) && (float) $rate > 0
            ? $amount * (float) $rate
            : null;
    }

    private function formatPrice(?float $price, ?SupportedCurrency $currency): ?string
    {
        if ($price === null || $currency === null) {
            return null;
        }

        $rounded = round($price, 2);
        $decimals = $rounded === floor($rounded) ? 0 : 2;

        return number_format($rounded, $decimals, ',', ' ').' '.$currency->symbol();
    }
}
