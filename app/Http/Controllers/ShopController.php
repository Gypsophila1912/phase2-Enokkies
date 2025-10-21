<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Food;
use App\Models\Character;
use App\Models\User;
use Illuminate\Support\Facades\DB;

class ShopController extends Controller
{
    // ご飯一覧取得API
    public function index()
    {
        return response()->json([
            'foods' => Food::all(),
        ]);
    }

    // ご飯購入API
    public function buy(Request $request)
    {
        $request->validate([
            'food_id' => 'required|exists:foods,id',
        ]);

        $user = $request->user();
        $food = Food::find($request->food_id);

        if ($user->point < $food->price) {
            return response()->json(['error' => 'ポイントが足りません'], 400);
        }

        $user->point -= $food->price;
        $user->save();

        // ご飯の在庫管理
        $userFood = DB::table('user_foods')
            ->where('user_id', $user->id)
            ->where('food_id', $food->id)
            ->first();
        if ($userFood) {
            DB::table('user_foods')
                ->where('id', $userFood->id)
                ->update(['quantity' => $userFood->quantity + 1]);
        } else {
            DB::table('user_foods')->insert([
                'user_id' => $user->id,
                'food_id' => $food->id,
                'quantity' => 1,
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }

        return response()->json([
            'message' => '購入完了',
            'point' => $user->point,
        ]);
    }

    // キャラクターにご飯を与えるAPI
    public function feed(Request $request)
    {
        $request->validate([
            'food_id' => 'required|exists:foods,id',
            'character_id' => 'required|exists:characters,id',
        ]);

        $user = $request->user();
        $food = Food::find($request->food_id);
        $character = Character::find($request->character_id);

        // ご飯の在庫減算
        $userFood = DB::table('user_foods')
            ->where('user_id', $user->id)
            ->where('food_id', $food->id)
            ->first();
        if (!$userFood || $userFood->quantity < 1) {
            return response()->json(['error' => 'ご飯の在庫がありません'], 400);
        }
        DB::table('user_foods')
            ->where('id', $userFood->id)
            ->update(['quantity' => $userFood->quantity - 1]);

        // キャラクターの経験値アップ
        $character->experience += $food->exp;
        $leveledUp = $character->checkLevelUp();
        $character->save();

        return response()->json([
            'message' => 'ご飯を与えました',
            'character_exp' => $character->experience,
            'character_level' => $character->level,
            'leveled_up' => $leveledUp,
        ]);
    }
}
