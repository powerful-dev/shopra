<?php

namespace App\Http\Resources;

use App\Models\ShopAttribute;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/** @mixin ShopAttribute */
class ShopAttributeResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'type' => $this->type->value,
            'unit' => $this->unit,
            'is_visible' => $this->is_visible,
            'is_filterable' => $this->is_filterable,
            'sort_order' => $this->sort_order,
            'options' => ShopAttributeOptionResource::collection($this->whenLoaded('options')),
        ];
    }
}
