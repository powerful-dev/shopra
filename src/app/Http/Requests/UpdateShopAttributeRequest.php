<?php

namespace App\Http\Requests;

use App\Enums\ShopAttributeType;
use App\Enums\ShopAttributeUnit;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateShopAttributeRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name' => ['sometimes', 'required', 'string', 'max:255'],
            'type' => ['sometimes', 'required', Rule::enum(ShopAttributeType::class)],
            'unit' => [
                'nullable',
                Rule::enum(ShopAttributeUnit::class),
            ],
            'is_visible' => ['sometimes', 'required', 'boolean'],
            'is_filterable' => ['sometimes', 'required', 'boolean'],
            'sort_order' => ['sometimes', 'required', 'integer'],
        ];
    }
}
