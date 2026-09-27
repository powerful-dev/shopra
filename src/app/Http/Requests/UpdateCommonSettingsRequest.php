<?php

namespace App\Http\Requests;

use App\Enums\ImageFit;
use App\Enums\ImageFormat;
use Illuminate\Database\Query\Builder;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateCommonSettingsRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    /** @return array<string, array<int, mixed>> */
    public function rules(): array
    {
        return [
            'site_name' => ['required', 'string', 'max:255'],
            'admin_language_id' => [
                'required',
                'integer',
                Rule::exists('languages', 'id')->where(
                    fn (Builder $query) => $query->where('is_admin', true)
                ),
            ],
            'site_language_id' => [
                'required',
                'integer',
                Rule::exists('languages', 'id')->where(
                    fn (Builder $query) => $query->where('is_site', true)
                ),
            ],
            'low_stock_threshold' => ['required', 'integer', 'min:1'],
            'default_shop_unit_id' => [
                'present',
                'nullable',
                'integer',
                Rule::exists('shop_units', 'id')->where(
                    fn (Builder $query) => $query->whereNull('deleted_at')
                ),
            ],
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
