<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\LoginRequest;
use App\Http\Resources\UserResource;
use App\Services\AuthenticationService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AuthenticationController extends Controller
{
    public function login(LoginRequest $request, AuthenticationService $authenticationService): JsonResponse
    {
        $user = $authenticationService->login($request->validated(), $request->session());

        if ($user === null) {
            return response()->json([
                'message' => 'The provided credentials are incorrect.',
                'errors' => ['email' => ['The provided credentials are incorrect.']],
            ], 422);
        }

        return (new UserResource($user))->response();
    }

    public function logout(Request $request, AuthenticationService $authenticationService): JsonResponse
    {
        $authenticationService->logout($request->session());

        return response()->json(null, 204);
    }

    public function user(Request $request): UserResource
    {
        return new UserResource($request->user());
    }
}
