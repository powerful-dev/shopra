<?php

namespace App\Http\Resources;

use App\Models\ShopAttributeOption;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/** @mixin ShopAttributeOption */
class ShopAttributeOptionResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'attribute_id' => $this->attribute_id,
            'value' => $this->value,
            'sort_order' => $this->sort_order,
        ];
    }
}
