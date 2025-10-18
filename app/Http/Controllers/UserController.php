<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\Auth;
use Illuminate\Http\Request;
use App\Models\User;

class UserController extends Controller
{
    public function destroy(Request $request)
    {
        $user = Auth::user();

        Auth::logout(); // ログアウト
        $user->delete(); // アカウント削除

        return redirect('/'); // ログインしていない状態のトップページへ
    }
}
