<?php

namespace App\Http\Requests;

use App\Http\Requests\Concerns\ValidatesShopItemAttributes;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Validator;

class SyncShopItemAttributesRequest extends FormRequest
{
    use ValidatesShopItemAttributes;

    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return $this->shopItemAttributeRules('present');
    }

    /** @return array<int, callable(Validator): void> */
    public function after(): array
    {
        return [fn (Validator $validator) => $this->validateShopItemAttributes($validator)];
    }
}
