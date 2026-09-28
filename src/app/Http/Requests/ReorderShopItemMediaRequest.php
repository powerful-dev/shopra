<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class ReorderShopItemMediaRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    /** @return array<string, array<int, mixed>> */
    public function rules(): array
    {
        return [
            'ids' => ['required', 'array'],
            'ids.*' => [
                'required',
                'integer',
                'distinct',
                Rule::exists('shop_item_media', 'id')->where(
                    'shop_item_id',
                    $this->route('product')->id,
                ),
            ],
        ];
    }
}
