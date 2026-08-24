<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/** @mixin \App\Models\ShopItem */
class ShopItemResource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'sku' => $this->sku,
            'url' => $this->url,
            'price' => $this->price,
            'old_price' => $this->old_price,
            'quantity' => $this->quantity,
            'show_stock' => $this->show_stock,
            'status' => $this->status->value,
            'unit' => $this->whenLoaded('unit', fn () => $this->unit === null ? null : [
                'id' => $this->unit->id,
                'code' => $this->unit->code,
                'short_name' => $this->unit->short_name,
                'is_system' => $this->unit->is_system,
            ]),
            'categories' => $this->groups->map(fn ($group) => [
                'id' => $group->id,
                'name' => $group->name,
                'url' => $group->url,
            ])->values(),
        ];
    }
}
