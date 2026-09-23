<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Facades\Storage;

class ShopGroupResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'parent_id' => $this->parent_id,
            'name' => $this->name,
            'slug' => $this->slug,
            'url' => route('catalog.show', ['slug' => $this->slug]),
            'description' => $this->description,
            'text' => $this->text,
            'seo_title' => $this->seo_title,
            'seo_description' => $this->seo_description,
            'image_url' => $this->when(
                $this->image !== null,
                fn (): string => Storage::disk('public')->url($this->image).'?v='.$this->updated_at->format('Uu'),
            ),
            'branch_count' => (int) $this->branch_count,
            'has_children' => $this->whenHas('children_exists', fn ($exists) => (bool) $exists),
        ];
    }
}
