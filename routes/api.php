<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ShopController;
use App\Http\Controllers\GroupController;

Route::get('/shop', [ShopController::class, 'index']);
Route::post('/shop/buy', [ShopController::class, 'buy']);
Route::post('/shop/feed', [ShopController::class, 'feed']);
Route::get('/shop/dressings', [ShopController::class, 'dressings']);
Route::post('/shop/dressings/buy', [ShopController::class, 'buyDressing']);
Route::get('/shop/group-dressings', [ShopController::class, 'groupDressings']);
Route::get('/group/selected-dressing', [GroupController::class, 'getSelectedDressing']);
Route::post('/group/select-dressing', [GroupController::class, 'selectDressing']);
Route::post('/group/add-500-points', [GroupController::class, 'add500Points']);
