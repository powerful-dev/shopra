<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\GenerateShopGroupSlugRequest;
use App\Http\Requests\MoveShopGroupRequest;
use App\Http\Requests\SearchShopGroupsRequest;
use App\Http\Requests\StoreShopGroupRequest;
use App\Http\Requests\UpdateShopGroupRequest;
use App\Http\Resources\ShopGroupResource;
use App\Models\ShopGroup;
use App\Services\ShopGroupService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class ShopGroupController extends Controller
{
    public function __construct(private readonly ShopGroupService $shopGroupService) {}

    public function index(): AnonymousResourceCollection
    {
        return ShopGroupResource::collection($this->shopGroupService->all());
    }

    public function move(MoveShopGroupRequest $request, ShopGroup $group): JsonResponse
    {
        $this->shopGroupService->move($group, $request->validated());

        return response()->json(null, 204);
    }

    public function destroy(ShopGroup $group): JsonResponse
    {
        $this->shopGroupService->delete($group);

        return response()->json(null, 204);
    }

    public function roots(): AnonymousResourceCollection
    {
        return ShopGroupResource::collection($this->shopGroupService->roots());
    }

    public function search(SearchShopGroupsRequest $request): AnonymousResourceCollection
    {
        return ShopGroupResource::collection($this->shopGroupService->search($request->validated('search')));
    }

    public function children(ShopGroup $group): AnonymousResourceCollection
    {
        return ShopGroupResource::collection($this->shopGroupService->children($group));
    }

    public function store(StoreShopGroupRequest $request): ShopGroupResource
    {
        return new ShopGroupResource($this->shopGroupService->create($request->validated()));
    }

    public function update(UpdateShopGroupRequest $request, ShopGroup $group): ShopGroupResource
    {
        return new ShopGroupResource($this->shopGroupService->update($group, $request->validated()));
    }

    public function slug(GenerateShopGroupSlugRequest $request): JsonResponse
    {
        return response()->json(['data' => [
            'slug' => $this->shopGroupService->uniqueSlug($request->validated('value')),
        ]]);
    }
}
