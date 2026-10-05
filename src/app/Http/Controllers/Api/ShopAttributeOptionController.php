<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreShopAttributeOptionRequest;
use App\Http\Requests\UpdateShopAttributeOptionRequest;
use App\Http\Resources\ShopAttributeOptionResource;
use App\Models\ShopAttribute;
use App\Models\ShopAttributeOption;
use App\Services\ShopAttributeService;
use Illuminate\Http\JsonResponse;

class ShopAttributeOptionController extends Controller
{
    public function __construct(private readonly ShopAttributeService $shopAttributeService) {}

    public function store(
        StoreShopAttributeOptionRequest $request,
        ShopAttribute $attribute,
    ): JsonResponse {
        $option = $this->shopAttributeService->createOption($attribute, $request->validated());

        return (new ShopAttributeOptionResource($option))->response()->setStatusCode(201);
    }

    public function update(
        UpdateShopAttributeOptionRequest $request,
        ShopAttribute $attribute,
        ShopAttributeOption $option,
    ): ShopAttributeOptionResource {
        return new ShopAttributeOptionResource(
            $this->shopAttributeService->updateOption($attribute, $option, $request->validated()),
        );
    }

    public function destroy(
        ShopAttribute $attribute,
        ShopAttributeOption $option,
    ): JsonResponse {
        $this->shopAttributeService->deleteOption($attribute, $option);

        return response()->json(null, 204);
    }
}
