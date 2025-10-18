<?php

namespace App\Providers;

use Illuminate\Support\Facades\Route;
use Illuminate\Foundation\Support\Providers\RouteServiceProvider as ServiceProvider;

class RouteServiceProvider extends ServiceProvider
{
    /**
     * このアプリケーションの「ホーム」ルート。
     *
     * ユーザーが認証後にリダイレクトされる場所を定義します。
     *
     * @var string
     */
    public const HOME = '/group-select'; // ← ログイン後に遷移する先をグループ選択画面に設定

    /**
     * アプリケーションのルートのマップを定義します。
     */
    public function boot(): void
    {
        $this->routes(function () {
            Route::middleware('web')
                ->group(base_path('routes/web.php'));

            Route::middleware('api')
                ->prefix('api')
                ->group(base_path('routes/api.php'));
        });
    }
}
