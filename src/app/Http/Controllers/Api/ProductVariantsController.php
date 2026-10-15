<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\SaveProductVariantsRequest;
use App\Http\Resources\ProductVariantsResource;
use App\Models\ShopItem;
use App\Services\ProductVariantsService;

class ProductVariantsController extends Controller
{
    public function __construct(private readonly ProductVariantsService $productVariantsService) {}

    public function index(ShopItem $product): ProductVariantsResource
    {
        return new ProductVariantsResource(
            $this->productVariantsService->forItem($product),
        );
    }

    public function update(SaveProductVariantsRequest $request, ShopItem $product): ProductVariantsResource
    {
        return new ProductVariantsResource(
            $this->productVariantsService->sync($product, $request->validated()),
        );
    }
}
