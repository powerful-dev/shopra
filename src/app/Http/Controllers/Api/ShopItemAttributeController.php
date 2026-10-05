<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\SyncShopItemAttributesRequest;
use App\Http\Resources\ShopItemAttributeResource;
use App\Models\ShopItem;
use App\Services\ShopItemAttributeService;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class ShopItemAttributeController extends Controller
{
    public function __construct(private readonly ShopItemAttributeService $shopItemAttributeService) {}

    public function index(ShopItem $product): AnonymousResourceCollection
    {
        return ShopItemAttributeResource::collection(
            $this->shopItemAttributeService->forItem($product),
        );
    }

    public function update(
        SyncShopItemAttributesRequest $request,
        ShopItem $product,
    ): AnonymousResourceCollection {
        return ShopItemAttributeResource::collection(
            $this->shopItemAttributeService->sync($product, $request->validated('attributes')),
        );
    }
}
