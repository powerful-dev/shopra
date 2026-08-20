<?php

use App\Http\Controllers\Api\AdminController;
use App\Http\Controllers\Api\AuthenticationController;
use App\Http\Controllers\Api\ShopController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\SiteModuleController;
use App\Http\Controllers\Api\AdminModuleController;


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


    Route::middleware('module:products')->group(function (): void {

        // Сюда потом помещаем ProductController:
        // Route::get('/products', ...);
        // Route::post('/products', ...);
        // Route::put('/products/{product}', ...);

    });

});
