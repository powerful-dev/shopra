<?php

namespace App\Http\Requests;

use Illuminate\Database\Query\Builder;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateCatalogSettingsRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    /** @return array<string, array<int, mixed>> */
    public function rules(): array
    {
        return [
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
