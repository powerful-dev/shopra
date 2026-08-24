<?php

namespace App\Http\Requests;

use App\Enums\ShopItemStatus;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class IndexShopItemsRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    /** @return array<string, array<int, mixed>> */
    public function rules(): array
    {
        return [
            'search' => ['nullable', 'string', 'max:255'],
            'status' => ['nullable', Rule::enum(ShopItemStatus::class)],
            'stock' => ['nullable', Rule::in(['low'])],
            'page' => ['nullable', 'integer', 'min:1'],
        ];
    }
}
