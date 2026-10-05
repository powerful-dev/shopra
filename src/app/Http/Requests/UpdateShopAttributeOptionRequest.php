<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateShopAttributeOptionRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'value' => ['required_without:sort_order', 'string', 'max:255'],
            'sort_order' => ['required_without:value', 'integer'],
        ];
    }
}
