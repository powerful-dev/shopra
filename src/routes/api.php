<?php

use App\Http\Controllers\Api\AdminController;
use App\Http\Controllers\Api\AuthenticationController;
use App\Http\Controllers\Api\ShopController;
use Illuminate\Support\Facades\Route;

Route::middleware('web')->post('/login', [AuthenticationController::class, 'login']);

Route::middleware('auth:sanctum')->group(function (): void {
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
});
