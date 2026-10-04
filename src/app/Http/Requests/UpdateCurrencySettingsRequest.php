<?php

namespace App\Http\Requests;

use App\Enums\SupportedCurrency;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateCurrencySettingsRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    /** @return array<string, array<int, mixed>> */
    public function rules(): array
    {
        return [
            'currency' => ['required', Rule::enum(SupportedCurrency::class)],
            'currency_rates' => ['present', 'array'],
            'currency_rates.*.code' => [
                'required',
                'distinct',
                Rule::enum(SupportedCurrency::class),
                Rule::notIn([$this->input('currency')]),
            ],
            'currency_rates.*.rate' => [
                'required',
                'numeric',
                'decimal:0,8',
                'gt:0',
                'lt:1000000000000',
            ],
        ];
    }
}
