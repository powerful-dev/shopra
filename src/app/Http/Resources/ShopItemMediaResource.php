<?php

namespace App\Http\Resources;

use App\Enums\ImageVariant;
use App\Models\ShopItemMedia;
use App\Services\ShopItemImageStorageService;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/** @mixin ShopItemMedia */
class ShopItemMediaResource extends JsonResource
{
    /** @return array<string, mixed> */
    public function toArray(Request $request): array
    {
        $storage = app(ShopItemImageStorageService::class);

        return [
            'id' => $this->id,
            'shop_item_id' => $this->shop_item_id,
            'type' => $this->type,
            'filename' => $this->filename,
            'sort_order' => $this->sort_order,
            'is_main' => $this->is_main,
            'small_url' => $this->when(
                $this->type === ShopItemMedia::TYPE_IMAGE,
                fn (): string => $storage->imageUrl($this->shop_item_id, ImageVariant::Small, $this->filename),
            ),
            'large_url' => $this->when(
                $this->type === ShopItemMedia::TYPE_IMAGE,
                fn (): string => $storage->imageUrl($this->shop_item_id, ImageVariant::Large, $this->filename),
            ),
            'url' => $this->when(
                $this->type === ShopItemMedia::TYPE_VIDEO,
                fn (): string => $storage->videoUrl($this->shop_item_id, $this->filename),
            ),
        ];
    }
}
