<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\UploadEditorImageRequest;
use App\Services\EditorImageService;
use Illuminate\Http\JsonResponse;

class EditorImageController extends Controller
{
    public function store(UploadEditorImageRequest $request, EditorImageService $editorImageService): JsonResponse
    {
        return response()->json([
            'location' => $editorImageService->store($request->file('file')),
        ], 201);
    }
}
