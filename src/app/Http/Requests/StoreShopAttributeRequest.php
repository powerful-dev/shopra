<?php

namespace App\Http\Requests;

use App\Enums\ShopAttributeType;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreShopAttributeRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:255'],
            'type' => ['required', Rule::enum(ShopAttributeType::class)],
            'unit' => [
                'nullable',
                'string',
                'max:255',
                Rule::prohibitedIf($this->input('type') !== ShopAttributeType::Number->value),
            ],
            'is_visible' => ['sometimes', 'boolean'],
            'is_filterable' => ['sometimes', 'boolean'],
            'sort_order' => ['sometimes', 'integer'],
        ];
    }
}
