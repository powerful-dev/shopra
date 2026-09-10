<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ShopGroupResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'parent_id' => $this->parent_id,
            'name' => $this->name,
            'branch_count' => (int) $this->branch_count,
            'has_children' => $this->whenHas('children_exists', fn ($exists) => (bool) $exists),
        ];
    }
}
