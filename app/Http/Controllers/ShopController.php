<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Food;
use App\Models\Character;
use App\Models\User;
use App\Models\Dressing;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class ShopController extends Controller
{
    // ご飯・服一覧取得API (FoodShop)
    public function index(Request $request)
    {
        $groupId = $request->query('group_id', 1);

        // ご飯一覧の取得（カテゴリ: food）
        $foods = \DB::table('foods')->get()->map(function ($food) {
            $food->category = 'food';
            if (!str_starts_with($food->image_path, '/food/')) {
                $food->image_path = '/food/' . ltrim($food->image_path, '/');
            }
            return $food;
        });

        // 服一覧の取得（カテゴリ: dressing）
        $dressings = Dressing::all();
            
        

        // ご飯と服を統合して返す
        $merged = $foods->concat($dressings)->values();

        // グループのポイント取得
        $groupPoints = \DB::table('groups')->where('id', $groupId)->value('points') ?? 0;
        dd($merged->toArray());
        return Inertia::render('FoodShop', [
            'foods' => $merged,
            'groupPoints' => $groupPoints,
            'dressings' => $dressings,
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

    // 服一覧取得API
    public function dressings()
    {
        return response()->json([
            'dressings' => Dressing::all(),
        ]);
    }

    // グループ服購入API
    public function buyDressing(Request $request)
    {
        $request->validate([
            'dressing_id' => 'required|exists:dressings,id',
            'group_id' => 'required|exists:groups,id',
        ]);

        $user = $request->user();
        $dressing = Dressing::find($request->dressing_id);
        $group = \App\Models\Group::find($request->group_id);

        // グループのポイントが足りるか確認
        if ($group->points < $dressing->price) {
            return response()->json(['error' => 'グループのポイントが足りません'], 400);
        }

        // グループのポイントを減算
        $group->points -= $dressing->price;
        $group->save();

        // 在庫加算
        $groupDressing = DB::table('group_dressings')
            ->where('group_id', $group->id)
            ->where('dressing_id', $dressing->id)
            ->first();
        if ($groupDressing) {
            return response()->json(['error' => 'この服は既に購入済みです'], 400);
        }

        DB::table('group_dressings')->insert([
            'group_id' => $group->id,
            'dressing_id' => $dressing->id,
            'quantity' => 1,
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        return response()->json(['message' => '服を購入しました', 'points' => $group->points]);
    }

    // グループが所持している服一覧API
    public function groupDressings(Request $request)
    {
        $request->validate([
            'group_id' => 'required|exists:groups,id',
        ]);
        $groupId = $request->group_id;
        $dressings = DB::table('group_dressings')
            ->join('dressings', 'group_dressings.dressing_id', '=', 'dressings.id')
            ->where('group_dressings.group_id', $groupId)
            ->where('group_dressings.quantity', '>', 0)
            ->select('dressings.*', 'group_dressings.quantity')
            ->get();
        return response()->json(['dressings' => $dressings]);
    }
}
