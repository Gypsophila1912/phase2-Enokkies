<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\DeveloperController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

use App\Http\Controllers\GroupController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\EnokkiController; // ← 追加
use App\Http\Controllers\FoodController;
use App\Http\Controllers\TaskController;    // ← 追加
use App\Http\Controllers\AdmiringController;
use App\Http\Controllers\CharacterController;
use App\Http\Controllers\DressingController;
use App\Http\Controllers\ShopController;

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

Route::get('/dashboard', function () {
    return redirect()->route('groups.select');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');


    //task
    Route::resource('tasks', TaskController::class);
    Route::patch('/tasks/{task}/toggle', [TaskController::class, 'toggle'])->name('tasks.toggle');

    //developer
    Route::get('/developer', [DeveloperController::class, 'index'])->name('developer.index');
    Route::post('/developer/create', [DeveloperController::class, 'create'])->name('developer.create');
    Route::get('/developer/group/{id}', [DeveloperController::class, 'show'])->name('developer.show');

    //group
    Route::get('/groups', [GroupController::class, 'index'])->name('groups.index');
    Route::get('/groups/{id}', [GroupController::class, 'show'])->name('groups.show');    
    Route::post('/groups', [GroupController::class, 'store'])->name('groups.store');
    Route::post('/groups/{id}/join', [GroupController::class, 'join'])->name('groups.join');
    Route::get('/group-select', [GroupController::class, 'select'])->name('groups.select');
    Route::get('/group-create', [GroupController::class, 'create'])->name('groups.create');
    Route::delete('/groups/{id}', [GroupController::class, 'destroy'])->name('groups.destroy');
    Route::delete('/account', [UserController::class, 'destroy'])->name('account.destroy');

    // 🆕 Enokki育成画面のルートを追加
    Route::get('/enokki', [EnokkiController::class, 'show'])->name('enokki.show');


    // 🆕 タスク完了処理のルートを追加
    Route::patch('/tasks/{task}/complete', [TaskController::class, 'complete'])->name('tasks.complete');

    // 🆕 キャラ設定画面への仮ルート（他メンバーが作成予定）
    Route::get('/character/settings', function () {
        return Inertia::render('Character/Settings');
    })->name('character.settings');

    // 🆕 フードショップ画面へのルートを追加
    Route::get('/food-shop', [FoodController::class, 'index'])->name('food.shop');
    // ご飯購入処理
    Route::post('/foods/buy/{food}', [FoodController::class, 'buy'])->name('foods.buy');

    // ご飯をあげる処理
    Route::post('/foods/give', [FoodController::class, 'feedToGroup'])->name('foods.give');

    //enokkie admiring
    Route::get('/admiring', [AdmiringController::class, 'index'])->name('admiring.index');
    Route::patch('/enokkie/{groupId}/name', [AdmiringController::class, 'updateName'])->name('enokkie.updateName');
    Route::patch('/admiring/update', [AdmiringController::class, 'update'])->name('admiring.update');
    Route::patch('/group-foods/useItem', [AdmiringController::class, 'useItem'])->name('group-foods.use');
    //character dressing room
    Route::get('/character/dressing-room', [CharacterController::class, 'dressingRoom'])
    ->name('character.dressing-room')
    ->middleware('auth');

    

    Route::get('/shop', [ShopController::class, 'index'])->name('shop.index');

    Route::post('/dressings/buy/{id}', [DressingController::class, 'buy'])->name('dressings.buy');

    // デバッグ用: ログインユーザーに500ポイント付与
    Route::post('/debug/add-points', function () {
        $user = auth()->user();
        $user->point = 500;
        $user->save();
        return response()->json(['message' => '500ポイント付与しました', 'point' => $user->point]);
    });
});

require __DIR__.'/auth.php';
