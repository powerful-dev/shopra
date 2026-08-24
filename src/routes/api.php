<?php

use App\Http\Controllers\Api\AdminController;
use App\Http\Controllers\Api\AdminModuleController;
use App\Http\Controllers\Api\AuthenticationController;
use App\Http\Controllers\Api\CommonSettingsController;
use App\Http\Controllers\Api\ShopController;
use App\Http\Controllers\Api\ShopItemController;
use App\Http\Controllers\Api\SiteModuleController;
use Illuminate\Support\Facades\Route;

Route::middleware('web')->post('/login', [AuthenticationController::class, 'login']);

Route::middleware([
    'auth:sanctum',
    'active', // admin must be active
])->group(function (): void {
    Route::post('/logout', [AuthenticationController::class, 'logout']);
    Route::get('/user', [AuthenticationController::class, 'user']);

    Route::get('/shop-themes', [ShopController::class, 'themes']);
    Route::post('/shops', [ShopController::class, 'store']);

    Route::get('/admins', [AdminController::class, 'index']);
    Route::post('/admins', [AdminController::class, 'store']);
    Route::get('/admins/{admin}', [AdminController::class, 'show']);
    Route::put('/admins/{admin}', [AdminController::class, 'update']);
    Route::patch('/admins/{admin}/status', [AdminController::class, 'status']);
    Route::delete('/admins/{admin}', [AdminController::class, 'destroy']);

    Route::get('/sites/{site}/modules', [SiteModuleController::class, 'index']);
    Route::get('/admins/{admin}/modules', [AdminModuleController::class, 'index']);
    Route::get('/me/modules', [SiteModuleController::class, 'currentUser']);

    Route::middleware('module:settings')->group(function (): void {
        Route::get('/settings/common', [CommonSettingsController::class, 'show']);
        Route::put('/settings/common', [CommonSettingsController::class, 'update']);
    });

    Route::middleware('module:products')->group(function (): void {
        Route::get('/products', [ShopItemController::class, 'index']);
    });

});
