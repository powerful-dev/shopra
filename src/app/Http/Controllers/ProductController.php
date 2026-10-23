<?php

namespace App\Http\Controllers;

use App\Models\ShopItem;
use Illuminate\Foundation\Vite;
use Illuminate\View\View;

class ProductController extends Controller
{
    public function __invoke(string $url, Vite $vite): View
    {
        $product = ShopItem::query()->where('url', $url)->firstOrFail();
        $shopAssetBase = $vite->isRunningHot()
            ? rtrim($vite->asset(''), '/')
            : rtrim(asset('build'), '/');

        return view('sites.shop.pages.product', compact('product', 'shopAssetBase'));
    }
}
