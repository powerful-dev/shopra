<?php

namespace App\Services;

use App\Models\Shop;
use Illuminate\Http\UploadedFile;

class ShopService
{
    /** @param array{name: string, logo?: UploadedFile|null, theme: string} $attributes */
    public function create(array $attributes): Shop
    {
        if (isset($attributes['logo'])) {
            $attributes['logo'] = $attributes['logo']->store('logos', 'public');
        }

        return Shop::query()->create($attributes);
    }
}
