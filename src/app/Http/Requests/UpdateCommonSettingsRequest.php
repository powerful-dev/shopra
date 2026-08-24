<?php

namespace App\Http\Requests;

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
        ];
    }
}
