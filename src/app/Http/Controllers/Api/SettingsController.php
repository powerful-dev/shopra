<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\UpdateCatalogSettingsRequest;
use App\Http\Requests\UpdateCurrencySettingsRequest;
use App\Http\Requests\UpdateGeneralSettingsRequest;
use App\Http\Requests\UpdateImageSettingsRequest;
use App\Services\SettingsService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class SettingsController extends Controller
{
    public function __construct(private readonly SettingsService $settingsService) {}

    public function general(Request $request): JsonResponse
    {
        return response()->json(['data' => $this->settingsService->getGeneral($request->user())]);
    }

    public function updateGeneral(UpdateGeneralSettingsRequest $request): JsonResponse
    {
        return response()->json([
            'data' => $this->settingsService->updateGeneral($request->user(), $request->validated()),
        ]);
    }

    public function currencies(): JsonResponse
    {
        return response()->json(['data' => $this->settingsService->getCurrencies()]);
    }

    public function updateCurrencies(UpdateCurrencySettingsRequest $request): JsonResponse
    {
        return response()->json(['data' => $this->settingsService->updateCurrencies($request->validated())]);
    }

    public function catalog(): JsonResponse
    {
        return response()->json(['data' => $this->settingsService->getCatalog()]);
    }

    public function updateCatalog(UpdateCatalogSettingsRequest $request): JsonResponse
    {
        return response()->json(['data' => $this->settingsService->updateCatalog($request->validated())]);
    }

    public function images(): JsonResponse
    {
        return response()->json(['data' => $this->settingsService->getImages()]);
    }

    public function updateImages(UpdateImageSettingsRequest $request): JsonResponse
    {
        return response()->json(['data' => $this->settingsService->updateImages($request->validated())]);
    }
}
