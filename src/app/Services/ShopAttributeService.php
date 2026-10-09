<?php

namespace App\Services;

use App\Enums\ShopAttributeType;
use App\Models\ShopAttribute;
use App\Models\ShopAttributeOption;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class ShopAttributeService
{
    /** @return Collection<int, ShopAttribute> */
    public function all(): Collection
    {
        return ShopAttribute::query()
            ->with(['options' => fn ($query) => $query->orderBy('sort_order')->orderBy('id')])
            ->orderBy('sort_order')
            ->orderBy('id')
            ->get();
    }

    /** @param array<string, mixed> $data */
    public function create(array $data): ShopAttribute
    {
        if (ShopAttributeType::from($data['type']) !== ShopAttributeType::Number) {
            $data['unit'] = null;
        }

        return $this->loadOptions(ShopAttribute::query()->create($data)->refresh());
    }

    /** @param array<string, mixed> $data */
    public function update(ShopAttribute $attribute, array $data): ShopAttribute
    {
        return DB::transaction(function () use ($attribute, $data): ShopAttribute {
            $lockedAttribute = ShopAttribute::query()->lockForUpdate()->findOrFail($attribute->getKey());
            $newType = isset($data['type']) ? ShopAttributeType::from($data['type']) : $lockedAttribute->type;

            if ($newType !== $lockedAttribute->type && $lockedAttribute->itemAttributes()->exists()) {
                throw ValidationException::withMessages([
                    'type' => 'Нельзя изменить тип характеристики, которая уже используется товарами.',
                ]);
            }

            if ($newType !== ShopAttributeType::Number) {
                $data['unit'] = null;
            }

            $lockedAttribute->update($data);

            if (! in_array($newType, [ShopAttributeType::Select, ShopAttributeType::Multiselect], true)) {
                $lockedAttribute->options()->delete();
            }

            return $this->loadOptions($lockedAttribute);
        });
    }

    public function delete(ShopAttribute $attribute): void
    {
        $attribute->delete();
    }

    /** @param array<string, mixed> $data */
    public function createOption(ShopAttribute $attribute, array $data): ShopAttributeOption
    {
        $this->ensureOptionsAreSupported($attribute);

        return $attribute->options()->create($data)->refresh();
    }

    /** @param array<string, mixed> $data */
    public function updateOption(
        ShopAttribute $attribute,
        ShopAttributeOption $option,
        array $data,
    ): ShopAttributeOption {
        $this->ensureOptionsAreSupported($attribute);
        $option->update($data);

        return $option->refresh();
    }

    public function deleteOption(ShopAttribute $attribute, ShopAttributeOption $option): void
    {
        $this->ensureOptionsAreSupported($attribute);
        $option->delete();
    }

    private function ensureOptionsAreSupported(ShopAttribute $attribute): void
    {
        if (! in_array($attribute->type, [ShopAttributeType::Select, ShopAttributeType::Multiselect], true)) {
            throw ValidationException::withMessages([
                'attribute' => 'Варианты значений доступны только для характеристик типов select и multiselect.',
            ]);
        }
    }

    private function loadOptions(ShopAttribute $attribute): ShopAttribute
    {
        return $attribute->load([
            'options' => fn ($query) => $query->orderBy('sort_order')->orderBy('id'),
        ]);
    }
}
