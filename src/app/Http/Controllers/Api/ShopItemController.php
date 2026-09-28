<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\BulkDeleteShopItemsRequest;
use App\Http\Requests\IndexShopItemsRequest;
use App\Http\Requests\ReorderShopItemMediaRequest;
use App\Http\Requests\SaveShopItemRequest;
use App\Http\Requests\UploadShopItemMediaRequest;
use App\Http\Resources\ShopItemMediaResource;
use App\Http\Resources\ShopItemResource;
use App\Models\ShopItem;
use App\Models\ShopItemMedia;
use App\Services\ShopItemMediaService;
use App\Services\ShopItemService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class ShopItemController extends Controller
{
    public function __construct(
        private readonly ShopItemService $shopItemService,
        private readonly ShopItemMediaService $shopItemMediaService,
    ) {}

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
        return new ShopItemResource($product->load([
            'groups',
            'unit',
            'media' => fn ($query) => $query->orderBy('sort_order')->orderBy('id'),
        ]));
    }

    public function store(SaveShopItemRequest $request): ShopItemResource
    {
        return new ShopItemResource($this->shopItemService->create($request->validated()));
    }

    public function update(SaveShopItemRequest $request, ShopItem $product): ShopItemResource
    {
        return new ShopItemResource($this->shopItemService->update($product, $request->validated()));
    }

    public function storeMedia(UploadShopItemMediaRequest $request, ShopItem $product): ShopItemMediaResource
    {
        return new ShopItemMediaResource($this->shopItemMediaService->store(
            $product,
            $request->validated('type'),
            $request->file('file'),
        ));
    }

    public function reorderMedia(ReorderShopItemMediaRequest $request, ShopItem $product): AnonymousResourceCollection
    {
        return ShopItemMediaResource::collection(
            $this->shopItemMediaService->reorder($product, $request->validated('ids')),
        );
    }

    public function destroyMedia(ShopItem $product, ShopItemMedia $media): AnonymousResourceCollection
    {
        return ShopItemMediaResource::collection(
            $this->shopItemMediaService->delete($product, $media),
        );
    }

    public function destroy(ShopItem $product): JsonResponse
    {
        $this->shopItemService->delete($product);

        return response()->json(null, 204);
    }

    public function bulkDestroy(BulkDeleteShopItemsRequest $request): JsonResponse
    {
        $this->shopItemService->deleteMany($request->validated('ids'));

        return response()->json(null, 204);
    }
}
