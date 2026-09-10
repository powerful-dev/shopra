<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class MoveShopGroupRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'target_id' => ['present', 'nullable', 'integer', Rule::exists('shop_groups', 'id')->whereNull('deleted_at')],
            'position' => ['required', Rule::in(['inside', 'before', 'after'])],
        ];
    }
}
