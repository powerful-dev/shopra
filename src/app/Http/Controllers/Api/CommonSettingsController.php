<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\UpdateCommonSettingsRequest;
use App\Services\CommonSettingsService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class CommonSettingsController extends Controller
{
    public function __construct(private readonly CommonSettingsService $commonSettingsService) {}

    public function show(Request $request): JsonResponse
    {
        return response()->json([
            'data' => $this->commonSettingsService->get($request->user()),
        ]);
    }

    public function update(UpdateCommonSettingsRequest $request): JsonResponse
    {
        return response()->json([
            'data' => $this->commonSettingsService->update($request->user(), $request->validated()),
        ]);
    }
}
