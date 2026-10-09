<?php

namespace App\Http\Requests;

use App\Enums\ShopAttributeType;
use App\Enums\ShopAttributeUnit;
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
                Rule::enum(ShopAttributeUnit::class),
            ],
            'is_visible' => ['sometimes', 'boolean'],
            'is_filterable' => ['sometimes', 'boolean'],
            'sort_order' => ['sometimes', 'integer'],
        ];
    }
}
