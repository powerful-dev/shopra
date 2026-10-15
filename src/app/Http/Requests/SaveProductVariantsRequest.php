<?php

namespace App\Http\Requests;

use App\Models\ShopAttribute;
use App\Models\ShopAttributeOption;
use App\Models\ShopItem;
use App\Models\ShopItemVariantPhoto;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Str;
use Illuminate\Validation\Validator;

class SaveProductVariantsRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    /** @return array<string, mixed> */
    public function rules(): array
    {
        return [
            'settings' => ['required', 'array'],
            'settings.id' => ['nullable', 'integer'],
            'settings.individual_prices_enabled' => ['required', 'boolean'],
            'settings.photos_enabled' => ['required', 'boolean'],
            'settings.photo_option_id' => ['nullable', $this->referenceRule()],
            'settings.default_photo_value_id' => ['nullable', $this->referenceRule()],

            'options' => ['present', 'array'],
            'options.*' => ['required', 'array'],
            'options.*.id' => ['required', $this->referenceRule()],
            'options.*.shop_attribute_id' => ['nullable', 'integer'],
            'options.*.name' => ['nullable', 'string', 'max:255'],
            'options.*.sort_order' => ['required', 'integer'],
            'options.*.values' => ['required', 'array'],
            'options.*.values.*' => ['required', 'array'],
            'options.*.values.*.id' => ['required', $this->referenceRule()],
            'options.*.values.*.shop_attribute_option_id' => ['nullable', 'integer'],
            'options.*.values.*.value' => ['nullable', 'string', 'max:255'],
            'options.*.values.*.sort_order' => ['required', 'integer'],

            'variants' => ['present', 'array', 'max:100'],
            'variants.*' => ['required', 'array'],
            'variants.*.id' => ['nullable', 'integer'],
            'variants.*.selections' => ['required', 'array'],
            'variants.*.selections.*' => ['required', 'array'],
            'variants.*.selections.*.id' => ['nullable', 'integer'],
            'variants.*.selections.*.option_id' => ['required', $this->referenceRule()],
            'variants.*.selections.*.value_id' => ['required', $this->referenceRule()],
            'variants.*.price' => ['present', 'nullable', 'numeric', 'min:0'],
            'variants.*.quantity' => ['required', 'integer', 'min:0'],
            'variants.*.sku' => ['nullable', 'string', 'max:255'],
            'variants.*.is_active' => ['required', 'boolean'],
            'variants.*.sort_order' => ['required', 'integer'],

            'photos' => ['present', 'array'],
            'photos.*' => ['required', 'array'],
            'photos.*.id' => ['nullable', 'integer'],
            'photos.*.shop_item_variant_value_id' => ['required', $this->referenceRule()],
            'photos.*.shop_item_media_id' => ['required', 'integer'],
            'photos.*.sort_order' => ['required', 'integer'],
        ];
    }

    /** @return array<int, callable> */
    public function after(): array
    {
        return [function (Validator $validator): void {
            if ($validator->errors()->isNotEmpty()) {
                return;
            }

            $product = $this->route('product');
            if (! $product instanceof ShopItem) {
                return;
            }

            $data = $this->validated();
            $options = $data['options'];
            $variants = $data['variants'];
            $photos = $data['photos'];
            $currentOptions = $product->variantOptions()->with('values')->get()->keyBy('id');
            $currentValues = $currentOptions->pluck('values')->flatten()->keyBy('id');
            $currentVariants = $product->variants()->with('selections')->get()->keyBy('id');
            $currentSelections = $currentVariants->pluck('selections')->flatten()->keyBy('id');
            $currentPhotos = ShopItemVariantPhoto::query()
                ->whereHas('value.option', fn ($query) => $query->where('shop_item_id', $product->id))
                ->get()
                ->keyBy('id');

            $attributeOptionIds = collect($options)
                ->flatMap(fn (array $option) => $option['values'])
                ->pluck('shop_attribute_option_id')
                ->filter()
                ->unique();
            $attributeOptions = ShopAttributeOption::query()
                ->whereKey($attributeOptionIds)
                ->get()
                ->keyBy('id');
            $attributeIds = collect($options)->pluck('shop_attribute_id')->filter()->unique();
            $validAttributeIdSet = array_fill_keys(
                ShopAttribute::query()->whereKey($attributeIds)->pluck('id')->all(),
                true,
            );
            $mediaIds = collect($photos)->pluck('shop_item_media_id')->unique();
            $validMediaIds = $product->media()
                ->where('type', 'image')
                ->whereKey($mediaIds)
                ->pluck('id')
                ->all();
            $validMediaIdSet = array_fill_keys($validMediaIds, true);

            $optionReferences = [];
            $valueReferences = [];
            $seenOptionIds = [];
            $seenAttributeIds = [];
            $seenLocalOptionNames = [];

            foreach ($options as $optionIndex => $optionData) {
                $optionPath = "options.{$optionIndex}";
                $optionKey = $this->referenceKey($optionData['id']);
                $attributeId = $optionData['shop_attribute_id'] ?? null;
                $name = $this->normalizedText($optionData['name'] ?? null);

                if (isset($optionReferences[$optionKey])) {
                    $validator->errors()->add("{$optionPath}.id", 'The option identifier must be unique.');

                    continue;
                }

                if ($this->isPersistentReference($optionData['id'])) {
                    $optionId = (int) $optionData['id'];
                    if (! $currentOptions->has($optionId) || isset($seenOptionIds[$optionId])) {
                        $validator->errors()->add("{$optionPath}.id", 'The option does not belong to this product or is duplicated.');
                    }
                    $seenOptionIds[$optionId] = true;
                }

                if (($attributeId === null) === ($name === null)) {
                    $validator->errors()->add($optionPath, 'An option must reference an attribute or contain a local name.');
                }

                if ($attributeId !== null) {
                    if (! isset($validAttributeIdSet[$attributeId])) {
                        $validator->errors()->add("{$optionPath}.shop_attribute_id", 'The referenced attribute does not exist.');
                    }
                    if (isset($seenAttributeIds[$attributeId])) {
                        $validator->errors()->add("{$optionPath}.shop_attribute_id", 'The attribute option is duplicated.');
                    }
                    $seenAttributeIds[$attributeId] = true;
                } elseif ($name !== null) {
                    if (isset($seenLocalOptionNames[$name])) {
                        $validator->errors()->add("{$optionPath}.name", 'The local option is duplicated.');
                    }
                    $seenLocalOptionNames[$name] = true;
                }

                $optionReferences[$optionKey] = [
                    'attribute_id' => $attributeId,
                    'index' => $optionIndex,
                ];
                $seenValueIds = [];
                $seenAttributeOptionIds = [];
                $seenLocalValues = [];

                foreach ($optionData['values'] as $valueIndex => $valueData) {
                    $valuePath = "{$optionPath}.values.{$valueIndex}";
                    $valueKey = $this->referenceKey($valueData['id']);
                    $attributeOptionId = $valueData['shop_attribute_option_id'] ?? null;
                    $value = $this->normalizedText($valueData['value'] ?? null);

                    if (isset($valueReferences[$valueKey])) {
                        $validator->errors()->add("{$valuePath}.id", 'The value identifier must be unique.');

                        continue;
                    }

                    if ($this->isPersistentReference($valueData['id'])) {
                        $valueId = (int) $valueData['id'];
                        $currentValue = $currentValues->get($valueId);
                        $persistentOptionId = $this->isPersistentReference($optionData['id'])
                            ? (int) $optionData['id']
                            : null;
                        if ($currentValue === null
                            || $currentValue->shop_item_variant_option_id !== $persistentOptionId
                            || isset($seenValueIds[$valueId])) {
                            $validator->errors()->add("{$valuePath}.id", 'The value does not belong to this product option or is duplicated.');
                        }
                        $seenValueIds[$valueId] = true;
                    }

                    if (($attributeOptionId === null) === ($value === null)) {
                        $validator->errors()->add($valuePath, 'A value must reference an attribute value or contain a local value.');
                    }

                    if ($attributeOptionId !== null) {
                        $attributeOption = $attributeOptions->get($attributeOptionId);
                        if ($attributeId === null || $attributeOption?->attribute_id !== $attributeId) {
                            $validator->errors()->add("{$valuePath}.shop_attribute_option_id", 'The attribute value does not belong to the selected attribute.');
                        }
                        if (isset($seenAttributeOptionIds[$attributeOptionId])) {
                            $validator->errors()->add("{$valuePath}.shop_attribute_option_id", 'The attribute value is duplicated.');
                        }
                        $seenAttributeOptionIds[$attributeOptionId] = true;
                    } elseif ($value !== null) {
                        if ($attributeId !== null) {
                            $validator->errors()->add("{$valuePath}.value", 'A referenced attribute requires referenced values.');
                        }
                        if (isset($seenLocalValues[$value])) {
                            $validator->errors()->add("{$valuePath}.value", 'The local value is duplicated.');
                        }
                        $seenLocalValues[$value] = true;
                    }

                    $valueReferences[$valueKey] = [
                        'option_key' => $optionKey,
                        'index' => $valueIndex,
                    ];
                }
            }

            $seenVariantIds = [];
            $seenSkus = [];
            $seenCombinations = [];

            foreach ($variants as $variantIndex => $variantData) {
                $variantPath = "variants.{$variantIndex}";
                $variantId = $variantData['id'] ?? null;

                if ($variantId !== null) {
                    if (! $currentVariants->has($variantId) || isset($seenVariantIds[$variantId])) {
                        $validator->errors()->add("{$variantPath}.id", 'The variant does not belong to this product or is duplicated.');
                    }
                    $seenVariantIds[$variantId] = true;
                }

                $sku = $variantData['sku'] ?? null;
                if ($sku !== null) {
                    if (isset($seenSkus[$sku])) {
                        $validator->errors()->add("{$variantPath}.sku", 'The SKU must be unique within the product variants.');
                    }
                    $seenSkus[$sku] = true;
                }

                $selectedOptionKeys = [];
                $combinationValueKeys = [];

                foreach ($variantData['selections'] as $selectionIndex => $selectionData) {
                    $selectionPath = "{$variantPath}.selections.{$selectionIndex}";
                    $optionKey = $this->referenceKey($selectionData['option_id']);
                    $valueKey = $this->referenceKey($selectionData['value_id']);
                    $valueReference = $valueReferences[$valueKey] ?? null;

                    if (! isset($optionReferences[$optionKey])) {
                        $validator->errors()->add("{$selectionPath}.option_id", 'The selected option is not present in the request.');
                    }
                    if ($valueReference === null || $valueReference['option_key'] !== $optionKey) {
                        $validator->errors()->add("{$selectionPath}.value_id", 'The selected value does not belong to the selected option.');
                    }
                    if (isset($selectedOptionKeys[$optionKey])) {
                        $validator->errors()->add("{$selectionPath}.option_id", 'A combination must contain one value per option.');
                    }
                    $selectedOptionKeys[$optionKey] = true;
                    $combinationValueKeys[] = $valueKey;

                    $selectionId = $selectionData['id'] ?? null;
                    if ($selectionId !== null) {
                        $currentSelection = $currentSelections->get($selectionId);
                        if ($variantId === null
                            || $currentSelection === null
                            || $currentSelection->shop_item_variant_id !== $variantId
                            || ! $this->isPersistentReference($selectionData['value_id'])
                            || $currentSelection->shop_item_variant_value_id !== (int) $selectionData['value_id']) {
                            $validator->errors()->add("{$selectionPath}.id", 'The selection does not belong to this product variant and value.');
                        }
                    }
                }

                if (count($selectedOptionKeys) !== count($optionReferences)) {
                    $validator->errors()->add("{$variantPath}.selections", 'A combination must contain exactly one value from every option.');
                }

                sort($combinationValueKeys);
                $combinationKey = implode('|', $combinationValueKeys);
                if (isset($seenCombinations[$combinationKey])) {
                    $validator->errors()->add("{$variantPath}.selections", 'The variant combination is duplicated.');
                }
                $seenCombinations[$combinationKey] = true;
            }

            $seenPhotoIds = [];
            $seenPhotoLinks = [];

            foreach ($photos as $photoIndex => $photoData) {
                $photoPath = "photos.{$photoIndex}";
                $valueKey = $this->referenceKey($photoData['shop_item_variant_value_id']);
                $mediaId = $photoData['shop_item_media_id'];

                if (! isset($valueReferences[$valueKey])) {
                    $validator->errors()->add("{$photoPath}.shop_item_variant_value_id", 'The photo value is not present in the request.');
                }
                if (! isset($validMediaIdSet[$mediaId])) {
                    $validator->errors()->add("{$photoPath}.shop_item_media_id", 'The photo must be an image belonging to this product.');
                }

                $photoId = $photoData['id'] ?? null;
                if ($photoId !== null) {
                    $currentPhoto = $currentPhotos->get($photoId);
                    if ($currentPhoto === null || isset($seenPhotoIds[$photoId])) {
                        $validator->errors()->add("{$photoPath}.id", 'The photo assignment does not belong to this product or is duplicated.');
                    } elseif (! $this->isPersistentReference($photoData['shop_item_variant_value_id'])
                        || $currentPhoto->shop_item_variant_value_id !== (int) $photoData['shop_item_variant_value_id']
                        || $currentPhoto->shop_item_media_id !== $mediaId) {
                        $validator->errors()->add("{$photoPath}.id", 'An existing photo assignment cannot change its value or media.');
                    }
                    $seenPhotoIds[$photoId] = true;
                }

                $photoLinkKey = "{$valueKey}:{$mediaId}";
                if (isset($seenPhotoLinks[$photoLinkKey])) {
                    $validator->errors()->add($photoPath, 'The photo assignment is duplicated.');
                }
                $seenPhotoLinks[$photoLinkKey] = true;
            }

            $settings = $data['settings'];
            $settingId = $settings['id'] ?? null;
            if ($settingId !== null && $product->variantSetting?->id !== $settingId) {
                $validator->errors()->add('settings.id', 'The variant settings do not belong to this product.');
            }

            $photoOptionReference = $settings['photo_option_id'] ?? null;
            $defaultPhotoValueReference = $settings['default_photo_value_id'] ?? null;
            if ($photoOptionReference !== null) {
                $photoOptionKey = $this->referenceKey($photoOptionReference);
                if (! isset($optionReferences[$photoOptionKey])) {
                    $validator->errors()->add('settings.photo_option_id', 'The photo option is not present in the request.');
                }
            }
            if ($defaultPhotoValueReference !== null) {
                $defaultPhotoValueKey = $this->referenceKey($defaultPhotoValueReference);
                $photoOptionKey = $photoOptionReference === null ? null : $this->referenceKey($photoOptionReference);
                if (! isset($valueReferences[$defaultPhotoValueKey])
                    || $valueReferences[$defaultPhotoValueKey]['option_key'] !== $photoOptionKey) {
                    $validator->errors()->add('settings.default_photo_value_id', 'The default photo value must belong to the selected photo option.');
                }
            }
        }];
    }

    private function referenceRule(): callable
    {
        return function (string $attribute, mixed $value, \Closure $fail): void {
            if ((is_int($value) && $value > 0)
                || (is_string($value) && trim($value) !== '' && mb_strlen($value) <= 100)) {
                return;
            }

            $fail("The {$attribute} field must be a positive integer or temporary identifier.");
        };
    }

    private function referenceKey(int|string $reference): string
    {
        return $this->isPersistentReference($reference)
            ? 'id:'.(int) $reference
            : 'tmp:'.$reference;
    }

    private function isPersistentReference(mixed $reference): bool
    {
        return is_int($reference) || (is_string($reference) && ctype_digit($reference));
    }

    private function normalizedText(mixed $value): ?string
    {
        if (! is_string($value) || trim($value) === '') {
            return null;
        }

        return Str::lower(trim($value));
    }
}
