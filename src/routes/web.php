<?php

use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return view('welcome');
})->name('home');

Route::view('/catalog/{slug}', 'welcome')
    ->where('slug', '[a-z0-9]+(?:-[a-z0-9]+)*')
    ->name('catalog.show');

Route::view('/admin/{path?}', 'admin.app')
    ->where('path', '.*')
    ->name('admin.app');
