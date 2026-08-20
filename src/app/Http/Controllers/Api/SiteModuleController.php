<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\ModuleResource;
use App\Models\Site;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Http\Request;
use App\Enums\Role;

class SiteModuleController extends Controller
{
    public function index(Site $site): AnonymousResourceCollection
    {

        return ModuleResource::collection(
            $site->siteType->modules()->orderBy('sorting')->get()
        );
    }

    public function currentUser(Request $request): AnonymousResourceCollection
    {
        $user = $request->user();

        $site = Site::query()
            ->with('siteType')
            ->firstOrFail();

        $siteType = $site->siteType;

        if ($user->hasRole(Role::SuperAdmin->value)) {
            $modules = $siteType
                ->modules()
                ->orderBy('sorting')
                ->get();
        } else {
            $modules = $siteType
                ->modules()
                ->where(function ($query) use ($user) {
                    $query
                        ->where('is_required', true)
                        ->orWhereHas('users', function ($query) use ($user) {
                            $query->where('users.id', $user->id);
                        });
                })
                ->orderBy('sorting')
                ->get();
        }

        return ModuleResource::collection($modules);
    }
}