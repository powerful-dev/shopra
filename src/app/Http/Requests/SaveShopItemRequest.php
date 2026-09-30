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
            'name' => [
                Rule::requiredIf($this->input('status') !== ShopItemStatus::Draft->value),
                'nullable',
                'string',
                'max:255',
            ],
            'price' => ['required', 'numeric', 'min:0'],
            'old_price' => ['nullable', 'numeric', 'min:0'],
            'quantity' => ['required', 'integer', 'min:0'],
            'description' => ['nullable', 'string'],
            'seo_title' => ['nullable', 'string', 'max:255'],
            'seo_description' => ['nullable', 'string'],
            'shop_group_id' => [
                'nullable',
                'integer',
                Rule::exists('shop_groups', 'id')->whereNull('deleted_at'),
            ],
            'status' => ['required', Rule::enum(ShopItemStatus::class)],
        ];
    }
}
