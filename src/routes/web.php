<?php

use Illuminate\Foundation\Vite;
use Illuminate\Support\Facades\Route;

Route::get('/', function (Vite $vite) {
    $shopAssetBase = $vite->isRunningHot()
        ? rtrim($vite->asset(''), '/')
        : rtrim(asset('build'), '/');

    return view('sites.shop.home', compact('shopAssetBase'));
})->name('home');

Route::view('/catalog/{slug}', 'welcome')
    ->where('slug', '[a-z0-9]+(?:-[a-z0-9]+)*')
    ->name('catalog.show');

Route::view('/admin/{path?}', 'admin.app')
    ->where('path', '.*')
    ->name('admin.app');
