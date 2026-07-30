<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreShopRequest;
use App\Http\Resources\ShopResource;
use App\Models\Shop;
use App\Services\ShopService;
use Illuminate\Http\JsonResponse;

class ShopController extends Controller
{
    public function themes(): JsonResponse
    {
        $themes = collect(Shop::themes())
            ->map(fn (string $label, string $value): array => compact('value', 'label'))
            ->values();

        return response()->json(['data' => $themes]);
    }

    public function store(StoreShopRequest $request, ShopService $shopService): JsonResponse
    {
        return (new ShopResource($shopService->create($request->validated())))
            ->response()
            ->setStatusCode(201);
    }
}
