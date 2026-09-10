<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\IndexShopItemsRequest;
use App\Http\Requests\SaveShopItemRequest;
use App\Http\Resources\ShopItemResource;
use App\Models\ShopItem;
use App\Services\ShopItemService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class ShopItemController extends Controller
{
    public function __construct(private readonly ShopItemService $shopItemService)
    {
    }

    public function index(IndexShopItemsRequest $request): AnonymousResourceCollection
    {
        return ShopItemResource::collection(
            $this->shopItemService->paginate($request->validated()),
        )->additional([
            'summary' => $this->shopItemService->summary(),
        ]);
    }

    public function show(ShopItem $product): ShopItemResource
    {
        return new ShopItemResource($product->load(['groups', 'unit']));
    }

    public function store(SaveShopItemRequest $request): ShopItemResource
    {
        return new ShopItemResource($this->shopItemService->create($request->validated()));
    }

    public function update(SaveShopItemRequest $request, ShopItem $product): ShopItemResource
    {
        return new ShopItemResource($this->shopItemService->update($product, $request->validated()));
    }

    public function destroy(ShopItem $product): JsonResponse
    {
        $this->shopItemService->delete($product);

        return response()->json(null, 204);
    }
}
