<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\GroupController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\EnokkiController; // ← 追加
use App\Http\Controllers\TaskController;    // ← 追加

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
});

require __DIR__.'/auth.php';
