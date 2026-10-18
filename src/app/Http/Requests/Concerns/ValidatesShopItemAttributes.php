<?php

namespace App\Http\Requests\Concerns;

use App\Enums\ShopAttributeType;
use App\Models\ShopAttribute;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Validator;

trait ValidatesShopItemAttributes
{
    /** @return array<string, array<int, mixed>> */
    protected function shopItemAttributeRules(string $presenceRule): array
    {
        return [
            'attributes' => [$presenceRule, 'array'],
            'attributes.*.attribute_id' => [
                'required',
                'integer',
                'distinct',
                Rule::exists('shop_attributes', 'id'),
            ],
            'attributes.*.value' => ['nullable'],
            'attributes.*.sort_order' => ['required', 'integer', 'min:0', 'distinct'],
        ];
    }

    protected function validateShopItemAttributes(Validator $validator): void
    {
        if ($validator->errors()->isNotEmpty() || ! array_key_exists('attributes', $this->all())) {
            return;
        }

        $rows = $this->input('attributes', []);
        $attributes = ShopAttribute::query()
            ->with('options:id,attribute_id')
            ->whereKey(collect($rows)->pluck('attribute_id'))
            ->get()
            ->keyBy('id');

        foreach ($rows as $index => $row) {
            $attribute = $attributes->get($row['attribute_id']);

            if ($attribute) {
                $this->validateShopItemAttributeValue($validator, $attribute, $row['value'] ?? null, $index);
            }
        }
    }

    private function validateShopItemAttributeValue(
        Validator $validator,
        ShopAttribute $attribute,
        mixed $value,
        int $index,
    ): void {
        $field = "attributes.{$index}.value";

        match ($attribute->type) {
            ShopAttributeType::Select => $this->validateSelectAttribute($validator, $attribute, $value, $field),
            ShopAttributeType::Multiselect => $this->validateMultiselectAttribute($validator, $attribute, $value, $field),
            ShopAttributeType::Text => $this->validateTextAttribute($validator, $value, $field),
            ShopAttributeType::Number => $this->validateNumberAttribute($validator, $value, $field),
            ShopAttributeType::Boolean => $this->validateBooleanAttribute($validator, $value, $field),
        };
    }

    private function validateSelectAttribute(
        Validator $validator,
        ShopAttribute $attribute,
        mixed $value,
        string $field,
    ): void {
        if (! is_int($value) || ! $attribute->options->contains('id', $value)) {
            $validator->errors()->add($field, 'Выберите значение, принадлежащее этой характеристике.');
        }
    }

    private function validateMultiselectAttribute(
        Validator $validator,
        ShopAttribute $attribute,
        mixed $value,
        string $field,
    ): void {
        if (! is_array($value) || $value === [] || count($value) !== count(array_unique($value))) {
            $validator->errors()->add($field, 'Выберите одно или несколько уникальных значений.');

            return;
        }

        $allowedOptionIds = $attribute->options->pluck('id');

        foreach ($value as $optionId) {
            if (! is_int($optionId) || ! $allowedOptionIds->contains($optionId)) {
                $validator->errors()->add($field, 'Все значения должны принадлежать выбранной характеристике.');

                return;
            }
        }
    }

    private function validateTextAttribute(Validator $validator, mixed $value, string $field): void
    {
        if ($value !== null && ! is_string($value)) {
            $validator->errors()->add($field, 'Значение должно быть текстом.');
        }
    }

    private function validateNumberAttribute(Validator $validator, mixed $value, string $field): void
    {
        if ($value !== null && (! is_numeric($value) || abs((float) $value) >= 100000000000000)) {
            $validator->errors()->add($field, 'Значение должно быть допустимым числом.');
        }
    }

    private function validateBooleanAttribute(Validator $validator, mixed $value, string $field): void
    {
        if (! is_bool($value)) {
            $validator->errors()->add($field, 'Значение должно быть логическим.');
        }
    }
}
