<?php

namespace App\Http\Resources;

use App\Enums\ShopAttributeType;
use App\Models\ShopItemAttribute;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/** @mixin ShopItemAttribute */
class ShopItemAttributeResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'attribute_id' => $this->attribute_id,
            'value' => match ($this->attribute->type) {
                ShopAttributeType::Select => $this->options->first()?->id,
                ShopAttributeType::Multiselect => $this->options->pluck('id')->values()->all(),
                ShopAttributeType::Text => $this->text_value,
                ShopAttributeType::Number => $this->number_value,
                ShopAttributeType::Boolean => $this->boolean_value,
            },
            'attribute' => new ShopAttributeResource($this->whenLoaded('attribute')),
        ];
    }
}
