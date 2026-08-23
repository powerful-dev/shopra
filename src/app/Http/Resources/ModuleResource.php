<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ModuleResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'code' => $this->code,
            'path' => $this->admin_path,
            'icon' => $this->icon,
            'show_in_menu' => (bool) $this->show_in_menu,
            'is_required' => (bool) $this->is_required,
        ];
    }
}