<?php

namespace App\Http\Controllers;

use App\Models\ShopGroup;
use App\Services\StorefrontCatalogService;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Foundation\Vite;
use Illuminate\View\View;

class CatalogController extends Controller
{
    public function __invoke(string $slug, Vite $vite, StorefrontCatalogService $catalog): View
    {
        $category = ShopGroup::query()->where('slug', $slug)->firstOrFail();
        $breadcrumbs = $this->breadcrumbs($category);
        $products = $catalog->productsForCategory($category);
        $shopAssetBase = $vite->isRunningHot()
            ? rtrim($vite->asset(''), '/')
            : rtrim(asset('build'), '/');

        return view('sites.shop.pages.catalog', compact('category', 'breadcrumbs', 'products', 'shopAssetBase'));
    }

    /** @return Collection<int, ShopGroup> */
    private function breadcrumbs(ShopGroup $category): Collection
    {
        $breadcrumbs = new Collection;
        $current = $category;
        $visited = [$category->getKey() => true];

        while ($current->parent_id !== null) {
            $parent = ShopGroup::query()
                ->select(['id', 'parent_id', 'name', 'slug'])
                ->find($current->parent_id);

            if (! $parent || isset($visited[$parent->getKey()])) {
                break;
            }

            $visited[$parent->getKey()] = true;
            $breadcrumbs->prepend($parent);
            $current = $parent;
        }

        return $breadcrumbs;
    }
}
