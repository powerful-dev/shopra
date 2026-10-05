<?php

namespace App\Http\Requests;

use App\Enums\ShopAttributeType;
use App\Models\ShopAttribute;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Validator;

class SyncShopItemAttributesRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'attributes' => ['present', 'array'],
            'attributes.*.attribute_id' => [
                'required',
                'integer',
                'distinct',
                Rule::exists('shop_attributes', 'id'),
            ],
            'attributes.*.value' => ['nullable'],
        ];
    }

    /** @return array<int, callable(Validator): void> */
    public function after(): array
    {
        return [function (Validator $validator): void {
            if ($validator->errors()->isNotEmpty()) {
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
                    $this->validateValue($validator, $attribute, $row['value'] ?? null, $index);
                }
            }
        }];
    }

    private function validateValue(
        Validator $validator,
        ShopAttribute $attribute,
        mixed $value,
        int $index,
    ): void {
        $field = "attributes.{$index}.value";

        match ($attribute->type) {
            ShopAttributeType::Select => $this->validateSelect($validator, $attribute, $value, $field),
            ShopAttributeType::Multiselect => $this->validateMultiselect($validator, $attribute, $value, $field),
            ShopAttributeType::Text => $this->validateText($validator, $value, $field),
            ShopAttributeType::Number => $this->validateNumber($validator, $value, $field),
            ShopAttributeType::Boolean => $this->validateBoolean($validator, $value, $field),
        };
    }

    private function validateSelect(
        Validator $validator,
        ShopAttribute $attribute,
        mixed $value,
        string $field,
    ): void {
        if (! is_int($value) || ! $attribute->options->contains('id', $value)) {
            $validator->errors()->add($field, 'Выберите значение, принадлежащее этой характеристике.');
        }
    }

    private function validateMultiselect(
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

    private function validateText(Validator $validator, mixed $value, string $field): void
    {
        if ($value !== null && ! is_string($value)) {
            $validator->errors()->add($field, 'Значение должно быть текстом.');
        }
    }

    private function validateNumber(Validator $validator, mixed $value, string $field): void
    {
        if ($value !== null && (! is_numeric($value) || abs((float) $value) >= 100000000000000)) {
            $validator->errors()->add($field, 'Значение должно быть допустимым числом.');
        }
    }

    private function validateBoolean(Validator $validator, mixed $value, string $field): void
    {
        if (! is_bool($value)) {
            $validator->errors()->add($field, 'Значение должно быть логическим.');
        }
    }
}
