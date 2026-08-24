<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\IndexShopItemsRequest;
use App\Http\Resources\ShopItemResource;
use App\Services\ShopItemService;
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
}
