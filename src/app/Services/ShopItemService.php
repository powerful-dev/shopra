<?php

namespace App\Services;

use App\Enums\ShopItemStatus;
use App\Models\Shop;
use App\Models\ShopItem;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Str;

class ShopItemService
{
    /** @param array{name: string, price: numeric-string|int|float, old_price?: numeric-string|int|float|null, quantity: int, status: string} $data */
    public function create(array $data): ShopItem
    {
        return ShopItem::query()->create([
            ...$data,
            'url' => Str::slug($data['name']),
        ]);
    }

    /** @param array{name: string, price: numeric-string|int|float, old_price?: numeric-string|int|float|null, quantity: int, status: string} $data */
    public function update(ShopItem $shopItem, array $data): ShopItem
    {
        $shopItem->update($data);

        return $shopItem;
    }

    public function delete(ShopItem $shopItem): void
    {
        $shopItem->delete();
    }

    /** @param array{search?: string|null, status?: string|null, stock?: string|null} $filters */
    public function paginate(array $filters = []): LengthAwarePaginator
    {
        $search = trim((string) ($filters['search'] ?? ''));
        $status = $filters['status'] ?? null;
        $stock = $filters['stock'] ?? null;
        $lowStockThreshold = $this->lowStockThreshold();

        return ShopItem::query()
            ->with(['groups', 'unit'])
            ->when($search !== '', function ($query) use ($search) {
                $query->where(function ($query) use ($search) {
                    $query
                        ->whereLike('name', "%{$search}%", caseSensitive: false)
                        ->orWhereLike('sku', "%{$search}%", caseSensitive: false);
                });
            })
            ->when($status, fn ($query) => $query->where('status', $status))
            ->when($stock === 'low', fn ($query) => $query
                ->where('quantity', '>', 0)
                ->where('quantity', '<', $lowStockThreshold))
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
            'low_stock' => ShopItem::query()
                ->where('quantity', '>', 0)
                ->where('quantity', '<', $lowStockThreshold)
                ->count(),
        ];
    }

    private function lowStockThreshold(): int
    {
        return (int) (Shop::query()->value('low_stock_threshold') ?? 5);
    }
}
