<?php

namespace App\Http\Controllers\Api;

use App\Enums\ShopAttributeUnit;
use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ShopAttributeUnitController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $locale = $request->getPreferredLanguage(['ru', 'uk', 'ua', 'en']) ?? config('app.locale');
        $locale = $locale === 'ua' ? 'uk' : $locale;

        return response()->json([
            'data' => ShopAttributeUnit::options($locale),
        ]);
    }
}
