<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreShopAttributeRequest;
use App\Http\Requests\UpdateShopAttributeRequest;
use App\Http\Resources\ShopAttributeResource;
use App\Models\ShopAttribute;
use App\Services\ShopAttributeService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class ShopAttributeController extends Controller
{
    public function __construct(private readonly ShopAttributeService $shopAttributeService) {}

    public function index(): AnonymousResourceCollection
    {
        return ShopAttributeResource::collection($this->shopAttributeService->all());
    }

    public function store(StoreShopAttributeRequest $request): JsonResponse
    {
        $attribute = $this->shopAttributeService->create($request->validated());

        return (new ShopAttributeResource($attribute))->response()->setStatusCode(201);
    }

    public function update(UpdateShopAttributeRequest $request, ShopAttribute $attribute): ShopAttributeResource
    {
        return new ShopAttributeResource(
            $this->shopAttributeService->update($attribute, $request->validated()),
        );
    }

    public function destroy(ShopAttribute $attribute): JsonResponse
    {
        $this->shopAttributeService->delete($attribute);

        return response()->json(null, 204);
    }
}
