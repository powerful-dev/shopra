<?php

namespace App\Http\Requests;

use App\Enums\ShopItemStatus;
use App\Enums\SupportedCurrency;
use App\Models\ShopItem;
use App\Services\SettingsService;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class SaveShopItemRequest extends FormRequest
{
    /** @var list<string>|null */
    private ?array $availableCurrencyCodes = null;

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
            'currency' => [
                'required',
                Rule::enum(SupportedCurrency::class),
                Rule::in($this->availableCurrencyCodes()),
            ],
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

    protected function prepareForValidation(): void
    {
        if (! blank($this->input('currency'))) {
            return;
        }

        $product = $this->route('product');
        $currency = $product instanceof ShopItem
            ? $product->currency?->value
            : ($this->availableCurrencyCodes()[0] ?? null);

        $this->merge(['currency' => $currency]);
    }

    /** @return list<string> */
    private function availableCurrencyCodes(): array
    {
        return $this->availableCurrencyCodes ??= app(SettingsService::class)->getAvailableCurrencyCodes();
    }
}
