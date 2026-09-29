<?php

namespace App\Http\Requests;

use App\Models\ShopItemMedia;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UploadShopItemMediaRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    /** @return array<string, array<int, mixed>> */
    public function rules(): array
    {
        $fileRules = ['required', 'file'];

        if ($this->input('type') === ShopItemMedia::TYPE_IMAGE) {
            $fileRules = [
                'required',
                'file',
                'extensions:'.implode(',', config('media.products.image_extensions')),
                'mimetypes:'.implode(',', config('media.products.image_mime_types')),
                'max:'.config('media.image_max_kilobytes'),
            ];
        } elseif ($this->input('type') === ShopItemMedia::TYPE_VIDEO) {
            $fileRules = [
                'required',
                'file',
                'mimes:'.implode(',', config('media.products.video_extensions')),
                'mimetypes:'.implode(',', config('media.products.video_mime_types')),
                'max:'.config('media.video_max_kilobytes'),
            ];
        }

        return [
            'type' => ['required', Rule::in([ShopItemMedia::TYPE_IMAGE, ShopItemMedia::TYPE_VIDEO])],
            'file' => $fileRules,
        ];
    }
}
