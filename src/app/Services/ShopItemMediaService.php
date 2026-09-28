<?php

namespace App\Services;

use App\Models\Shop;
use App\Models\ShopItem;
use App\Models\ShopItemMedia;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class ShopItemMediaService
{
    public function __construct(
        private readonly ShopItemImageStorageService $storage,
        private readonly ImageProcessingService $imageProcessor,
    ) {}

    public function store(ShopItem $item, string $type, UploadedFile $file): ShopItemMedia
    {
        return $type === ShopItemMedia::TYPE_IMAGE
            ? $this->storeImage($item, $file)
            : $this->storeVideo($item, $file);
    }

    /**
     * @param  list<int>  $ids
     * @return Collection<int, ShopItemMedia>
     */
    public function reorder(ShopItem $item, array $ids): Collection
    {
        return DB::transaction(function () use ($item, $ids): Collection {
            $lockedItem = ShopItem::query()->lockForUpdate()->findOrFail($item->id);
            $media = $lockedItem->media()->lockForUpdate()->get()->keyBy('id');
            $existingIds = $media->keys()->map(fn ($id): int => (int) $id)->sort()->values()->all();
            $requestedIds = collect($ids)->map(fn ($id): int => (int) $id)->sort()->values()->all();

            if ($existingIds !== $requestedIds) {
                throw ValidationException::withMessages([
                    'ids' => 'Порядок должен содержать все медиафайлы товара.',
                ]);
            }

            return $this->applyOrder(
                $lockedItem,
                collect($ids)->map(fn (int $id): ShopItemMedia => $media->get($id)),
            );
        });
    }

    /** @return Collection<int, ShopItemMedia> */
    public function delete(ShopItem $item, ShopItemMedia $media): Collection
    {
        return DB::transaction(function () use ($item, $media): Collection {
            $lockedItem = ShopItem::query()->lockForUpdate()->findOrFail($item->id);
            $deleting = $lockedItem->media()->lockForUpdate()->findOrFail($media->id);

            if ($deleting->type === ShopItemMedia::TYPE_IMAGE) {
                $this->storage->deleteImageVariants($lockedItem->id, $deleting->filename);
            } else {
                $this->storage->deleteVideo($lockedItem->id, $deleting->filename);
            }

            $deleting->delete();

            return $this->applyOrder(
                $lockedItem,
                $lockedItem->media()->orderBy('sort_order')->orderBy('id')->get(),
            );
        });
    }

    private function storeImage(ShopItem $item, UploadedFile $image): ShopItemMedia
    {
        $shop = Shop::query()->firstOrFail();
        $small = $this->imageProcessor->process(
            $image,
            $shop->product_small_image_max_width,
            $shop->product_small_image_max_height,
            $shop->product_small_image_fit,
            $shop->product_image_format,
        );
        $large = $this->imageProcessor->process(
            $image,
            $shop->product_large_image_max_width,
            $shop->product_large_image_max_height,
            $shop->product_large_image_fit,
            $shop->product_image_format,
        );

        return DB::transaction(function () use ($item, $small, $large): ShopItemMedia {
            $lockedItem = ShopItem::query()->lockForUpdate()->findOrFail($item->id);
            $this->ensureCapacity($lockedItem, ShopItemMedia::TYPE_IMAGE);
            $sortOrder = $this->nextSortOrder($lockedItem);
            $isMain = ! $lockedItem->media()->where('type', ShopItemMedia::TYPE_IMAGE)->exists();
            $media = null;

            $this->storage->storeImageVariants(
                $lockedItem->id,
                $small,
                $large,
                function (string $filename) use ($lockedItem, $sortOrder, $isMain, &$media): void {
                    $media = $lockedItem->media()->create([
                        'type' => ShopItemMedia::TYPE_IMAGE,
                        'filename' => $filename,
                        'sort_order' => $sortOrder,
                        'is_main' => $isMain,
                    ]);
                },
            );

            return $media;
        });
    }

    private function storeVideo(ShopItem $item, UploadedFile $video): ShopItemMedia
    {
        return DB::transaction(function () use ($item, $video): ShopItemMedia {
            $lockedItem = ShopItem::query()->lockForUpdate()->findOrFail($item->id);
            $this->ensureCapacity($lockedItem, ShopItemMedia::TYPE_VIDEO);
            $sortOrder = $this->nextSortOrder($lockedItem);
            $media = null;

            $this->storage->storeVideo(
                $lockedItem->id,
                $video,
                function (string $filename) use ($lockedItem, $sortOrder, &$media): void {
                    $media = $lockedItem->media()->create([
                        'type' => ShopItemMedia::TYPE_VIDEO,
                        'filename' => $filename,
                        'sort_order' => $sortOrder,
                        'is_main' => false,
                    ]);
                },
            );

            return $media;
        });
    }

    private function ensureCapacity(ShopItem $item, string $type): void
    {
        $limit = $type === ShopItemMedia::TYPE_IMAGE
            ? (int) config('media.products.max_images')
            : (int) config('media.products.max_videos');

        if ($item->media()->where('type', $type)->count() >= $limit) {
            throw ValidationException::withMessages([
                'file' => $type === ShopItemMedia::TYPE_IMAGE
                    ? "Можно загрузить не более {$limit} фотографий товара."
                    : "Можно загрузить не более {$limit} видео товара.",
            ]);
        }
    }

    private function nextSortOrder(ShopItem $item): int
    {
        $currentMaximum = $item->media()->max('sort_order');

        return $currentMaximum === null ? 0 : ((int) $currentMaximum) + 1;
    }

    /**
     * @param  Collection<int, ShopItemMedia>  $media
     * @return Collection<int, ShopItemMedia>
     */
    private function applyOrder(ShopItem $item, Collection $media): Collection
    {
        $mainImageId = $media->first(
            fn (ShopItemMedia $mediaItem): bool => $mediaItem->type === ShopItemMedia::TYPE_IMAGE,
        )?->id;

        $media->values()->each(function (ShopItemMedia $mediaItem, int $sortOrder) use ($mainImageId): void {
            $mediaItem->update([
                'sort_order' => $sortOrder,
                'is_main' => $mediaItem->id === $mainImageId,
            ]);
        });

        return $item->media()->orderBy('sort_order')->orderBy('id')->get();
    }
}
