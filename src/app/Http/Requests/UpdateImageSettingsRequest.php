<?php

namespace App\Http\Requests;

use App\Enums\ImageFit;
use App\Enums\ImageFormat;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateImageSettingsRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    /** @return array<string, array<int, mixed>> */
    public function rules(): array
    {
        return [
            'group_small_image_max_width' => ['present', 'nullable', 'integer', 'min:1'],
            'group_small_image_max_height' => ['present', 'nullable', 'integer', 'min:1'],
            'group_small_image_fit' => ['required', Rule::enum(ImageFit::class)],
            'group_large_image_max_width' => ['present', 'nullable', 'integer', 'min:1'],
            'group_large_image_max_height' => ['present', 'nullable', 'integer', 'min:1'],
            'group_large_image_fit' => ['required', Rule::enum(ImageFit::class)],
            'group_image_format' => ['required', Rule::enum(ImageFormat::class)],
            'product_small_image_max_width' => ['present', 'nullable', 'integer', 'min:1'],
            'product_small_image_max_height' => ['present', 'nullable', 'integer', 'min:1'],
            'product_small_image_fit' => ['required', Rule::enum(ImageFit::class)],
            'product_large_image_max_width' => ['present', 'nullable', 'integer', 'min:1'],
            'product_large_image_max_height' => ['present', 'nullable', 'integer', 'min:1'],
            'product_large_image_fit' => ['required', Rule::enum(ImageFit::class)],
            'product_image_format' => ['required', Rule::enum(ImageFormat::class)],
        ];
    }
}
