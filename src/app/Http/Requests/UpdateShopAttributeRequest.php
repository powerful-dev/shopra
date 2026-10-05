<?php

namespace App\Http\Requests;

use App\Enums\ShopAttributeType;
use App\Models\ShopAttribute;
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
                'string',
                'max:255',
                Rule::prohibitedIf($this->effectiveType() !== ShopAttributeType::Number),
            ],
            'is_visible' => ['sometimes', 'required', 'boolean'],
            'is_filterable' => ['sometimes', 'required', 'boolean'],
            'sort_order' => ['sometimes', 'required', 'integer'],
        ];
    }

    private function effectiveType(): ?ShopAttributeType
    {
        $type = $this->input('type');

        if (is_string($type)) {
            return ShopAttributeType::tryFrom($type);
        }

        $attribute = $this->route('attribute');

        return $attribute instanceof ShopAttribute ? $attribute->type : null;
    }
}
