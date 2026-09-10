<?php

namespace App\Http\Requests;

use App\Enums\ShopItemStatus;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class SaveShopItemRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    /** @return array<string, array<int, mixed>> */
    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:255'],
            'price' => ['required', 'numeric', 'min:0'],
            'old_price' => ['nullable', 'numeric', 'min:0'],
            'quantity' => ['required', 'integer', 'min:0'],
            'status' => ['required', Rule::enum(ShopItemStatus::class)],
        ];
    }
}
