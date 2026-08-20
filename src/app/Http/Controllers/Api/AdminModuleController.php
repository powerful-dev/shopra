<?php

namespace App\Http\Controllers\Api;

use App\Enums\Role;
use App\Http\Controllers\Controller;
use App\Models\Site;
use App\Models\User;
use Illuminate\Http\JsonResponse;

class AdminModuleController extends Controller
{
    public function index(User $admin): JsonResponse
    {
        $site = Site::query()
            ->with([
                'siteType.modules' => function ($query) {
                    $query
                        ->where('is_required', false)
                        ->orderBy('sorting');
                },
            ])
            ->firstOrFail();

        $isSuperAdmin = $admin->hasRole(Role::SuperAdmin->value);

        $assignedModuleIds = $isSuperAdmin
            ? []
            : $admin->modules()
                ->where('is_required', false)
                ->pluck('modules.id')
                ->all();

        $modules = $site->siteType->modules->map(function ($module) use ($isSuperAdmin, $assignedModuleIds) {
            return [
                'id' => $module->id,
                'code' => $module->code,
                'name' => $module->name,
                'icon' => $module->icon,
                'enabled' => $isSuperAdmin || in_array($module->id, $assignedModuleIds, true),
                'locked' => $isSuperAdmin,
            ];
        });

        return response()->json([
            'data' => $modules,
        ]);
    }
}