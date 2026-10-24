<?php

namespace App\Http\Requests;

use App\Enums\ShopItemStatus;
use App\Enums\SupportedCurrency;
use App\Http\Requests\Concerns\ValidatesShopItemAttributes;
use App\Services\SettingsService;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Validator;

class SaveShopItemRequest extends FormRequest
{
    use ValidatesShopItemAttributes;

    /** @var list<string>|null */
    private ?array $availableCurrencyCodes = null;

    public function authorize(): bool
    {
        return true;
    }

    /** @return array<string, array<int, mixed>> */
    public function rules(): array
    {
        $requiredForNonDraft = Rule::requiredIf(
            $this->input('status') !== ShopItemStatus::Draft->value,
        );

        return [
            'name' => [
                $requiredForNonDraft,
                'nullable',
                'string',
                'max:255',
            ],
            'price' => [$requiredForNonDraft, 'nullable', 'numeric', 'min:0'],
            'old_price' => ['nullable', 'numeric', 'min:0'],
            'currency' => [
                $requiredForNonDraft,
                'nullable',
                Rule::enum(SupportedCurrency::class),
                Rule::in($this->availableCurrencyCodes()),
            ],
            'quantity' => ['nullable', 'integer', 'min:0'],
            'show_stock' => ['sometimes', 'boolean'],
            'description' => ['nullable', 'string'],
            'seo_title' => ['nullable', 'string', 'max:255'],
            'seo_description' => ['nullable', 'string'],
            'shop_group_id' => [
                'nullable',
                'integer',
                Rule::exists('shop_groups', 'id')->whereNull('deleted_at'),
            ],
            'status' => ['required', Rule::enum(ShopItemStatus::class)],
            ...$this->shopItemAttributeRules('sometimes'),
        ];
    }

    /** @return array<int, callable(Validator): void> */
    public function after(): array
    {
        return [fn (Validator $validator) => $this->validateShopItemAttributes($validator)];
    }

    protected function prepareForValidation(): void
    {
        $this->merge([
            'name' => $this->input('name'),
            'price' => $this->input('price'),
            'currency' => $this->input('currency'),
        ]);
    }

    /** @return list<string> */
    private function availableCurrencyCodes(): array
    {
        return $this->availableCurrencyCodes ??= app(SettingsService::class)->getAvailableCurrencyCodes();
    }
}
