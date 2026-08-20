<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreAdminRequest;
use App\Http\Requests\UpdateAdminRequest;
use App\Http\Requests\UpdateAdminStatusRequest;
use App\Http\Resources\AdminResource;
use App\Models\User;
use App\Services\AdminService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use App\Models\Site;

class AdminController extends Controller
{
    public function __construct(private readonly AdminService $adminService)
    {
    }

    public function index(): AnonymousResourceCollection
    {
        $site = Site::query()
            ->with('siteType')
            ->firstOrFail();

        $availableModulesCount = $site->siteType
            ->modules()
            ->where('is_required', false)
            ->count();

        return AdminResource::collection(
            $this->adminService->paginate()
        )->additional([
            'available_modules_count' => $availableModulesCount,
        ]);
    }

    public function store(StoreAdminRequest $request): JsonResponse
    {
        $admin = $this->adminService->create($request->validated(), $request->user());

        return (new AdminResource($admin))->response()->setStatusCode(201);
    }

    public function show(User $admin): AdminResource
    {
        return new AdminResource($admin);
    }

    public function update(UpdateAdminRequest $request, User $admin): AdminResource
    {
        return new AdminResource($this->adminService->update($admin, $request->validated(), $request->user()));
    }

    public function status(UpdateAdminStatusRequest $request, User $admin): AdminResource
    {
        return new AdminResource($this->adminService->setStatus($admin, $request->validated('is_active'), $request->user()));
    }

    public function destroy(Request $request, User $admin): JsonResponse
    {
        $this->adminService->delete($admin, $request->user());

        return response()->json(null, 204);
    }
}
