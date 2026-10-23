<?php

namespace App\Services;

use App\Enums\ShopItemStatus;
use App\Models\Shop;
use App\Models\ShopGroup;
use App\Models\ShopItem;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class ShopItemService
{
    public function __construct(private readonly ShopItemAttributeService $shopItemAttributeService) {}

    /** @param array{name: string|null, price: numeric-string|int|float, old_price?: numeric-string|int|float|null, currency: string, quantity?: int|null, show_stock?: bool, description?: string|null, seo_title?: string|null, seo_description?: string|null, shop_group_id?: int|null, status: string, attributes?: array<int, array{attribute_id: int, value: mixed, sort_order: int}>} $data */
    public function create(array $data): ShopItem
    {
        return DB::transaction(function () use ($data): ShopItem {
            [$itemData, $attributes] = $this->splitAttributes($data);
            $shopItem = ShopItem::query()->create([
                ...$itemData,
                'url' => $itemData['name'] === null
                    ? 'draft-'.Str::uuid()->toString()
                    : Str::slug($itemData['name']),
            ]);

            if ($attributes !== null) {
                $this->shopItemAttributeService->sync($shopItem, $attributes);
            }

            return $shopItem;
        });
    }

    /** @param array{name: string|null, price: numeric-string|int|float, old_price?: numeric-string|int|float|null, currency: string, quantity?: int|null, show_stock?: bool, description?: string|null, seo_title?: string|null, seo_description?: string|null, shop_group_id?: int|null, status: string, attributes?: array<int, array{attribute_id: int, value: mixed, sort_order: int}>} $data */
    public function update(ShopItem $shopItem, array $data): ShopItem
    {
        return DB::transaction(function () use ($shopItem, $data): ShopItem {
            [$itemData, $attributes] = $this->splitAttributes($data);

            if ($shopItem->variants()->exists()) {
                unset($itemData['quantity']);
            }

            $shopItem->update($itemData);

            if ($attributes !== null) {
                $this->shopItemAttributeService->sync($shopItem, $attributes);
            }

            return $shopItem;
        });
    }

    /**
     * @param  array<string, mixed>  $data
     * @return array{array<string, mixed>, array<int, array{attribute_id: int, value: mixed, sort_order: int}>|null}
     */
    private function splitAttributes(array $data): array
    {
        if (! array_key_exists('attributes', $data)) {
            return [$data, null];
        }

        $attributes = $data['attributes'];
        unset($data['attributes']);

        return [$data, $attributes];
    }

    public function delete(ShopItem $shopItem): void
    {
        $shopItem->delete();
    }

    public function attachGroup(ShopItem $shopItem, ShopGroup $shopGroup): void
    {
        $shopItem->groups()->syncWithoutDetaching([$shopGroup->getKey()]);
    }

    public function detachGroup(ShopItem $shopItem, ShopGroup $shopGroup): void
    {
        $shopItem->groups()->detach($shopGroup->getKey());
    }

    /** @param array<int, int> $ids */
    public function deleteMany(array $ids): void
    {
        DB::transaction(function () use ($ids): void {
            ShopItem::query()
                ->whereKey($ids)
                ->get()
                ->each(fn (ShopItem $shopItem) => $this->delete($shopItem));
        });
    }

    /** @param array{search?: string|null, status?: string|null, stock?: string|null, category_id?: int|null} $filters */
    public function paginate(array $filters = []): LengthAwarePaginator
    {
        $search = trim((string) ($filters['search'] ?? ''));
        $status = $filters['status'] ?? null;
        $stock = $filters['stock'] ?? null;
        $categoryId = $filters['category_id'] ?? null;
        $lowStockThreshold = $this->lowStockThreshold();

        return ShopItem::query()
            ->with(['groups', 'shopGroup', 'unit', 'media' => fn ($query) => $query
                ->where('type', 'image')
                ->orderByDesc('is_main')
                ->orderBy('sort_order')
                ->orderBy('id')])
            ->withExists('variants')
            ->withSum('activeVariants', 'quantity')
            ->when($search !== '', function ($query) use ($search) {
                $query->where(function ($query) use ($search) {
                    $query
                        ->whereLike('name', "%{$search}%", caseSensitive: false)
                        ->orWhereLike('sku', "%{$search}%", caseSensitive: false);
                });
            })
            ->when($status, fn ($query) => $query->where('status', $status))
            ->when($categoryId, fn (Builder $query) => $query->where(function (Builder $query) use ($categoryId) {
                $query->where('shop_group_id', $categoryId)
                    ->orWhereHas('groups', fn ($query) => $query->where('shop_groups.id', $categoryId));
            }))
            ->when($stock === 'low', fn (Builder $query) => $this->whereLowStock($query, $lowStockThreshold))
            ->orderBy('id')
            ->paginate();
    }

    /** @return array{total: int, active: int, draft: int, low_stock: int} */
    public function summary(): array
    {
        $lowStockThreshold = $this->lowStockThreshold();

        return [
            'total' => ShopItem::query()->count(),
            'active' => ShopItem::query()->where('status', ShopItemStatus::Active->value)->count(),
            'draft' => ShopItem::query()->where('status', ShopItemStatus::Draft->value)->count(),
            'low_stock' => $this->whereLowStock(ShopItem::query(), $lowStockThreshold)->count(),
        ];
    }

    private function whereLowStock(Builder $query, int $threshold): Builder
    {
        $activeVariantQuantity = '(select coalesce(sum(shop_item_variants.quantity), 0)'
            .' from shop_item_variants'
            .' where shop_item_variants.shop_item_id = shop_items.id'
            .' and shop_item_variants.is_active = true)';

        return $query->where(function (Builder $query) use ($activeVariantQuantity, $threshold): void {
            $query
                ->where(function (Builder $query) use ($threshold): void {
                    $query->whereDoesntHave('variants')
                        ->where('quantity', '>', 0)
                        ->where('quantity', '<', $threshold);
                })
                ->orWhere(function (Builder $query) use ($activeVariantQuantity, $threshold): void {
                    $query->whereHas('variants')
                        ->whereRaw("{$activeVariantQuantity} > 0")
                        ->whereRaw("{$activeVariantQuantity} < ?", [$threshold]);
                });
        });
    }

    private function lowStockThreshold(): int
    {
        return (int) (Shop::query()->value('low_stock_threshold') ?? 5);
    }
}
