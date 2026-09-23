<?php

namespace App\Services;

use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use RuntimeException;

class EditorImageService
{
    public function store(UploadedFile $image): string
    {
        $path = Storage::disk('public')->putFile('editor', $image);

        if ($path === false) {
            throw new RuntimeException('Unable to store editor image.');
        }

        return '/storage/'.$path;
    }
}
