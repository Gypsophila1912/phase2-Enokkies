<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ShopController;

Route::get('/shop', [ShopController::class, 'index']);
Route::post('/shop/buy', [ShopController::class, 'buy']);
Route::post('/shop/feed', [ShopController::class, 'feed']);
