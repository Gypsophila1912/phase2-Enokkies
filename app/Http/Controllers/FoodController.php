<?php

namespace App\Http\Controllers;

use App\Models\Food;
use App\Models\GroupFood;
use Inertia\Inertia;

class FoodController extends Controller
{
    public function index()
    {
        $user = auth()->user();
        $group = $user->group; // 最新のグループ情報
        $foods = Food::all();

        return Inertia::render('FoodShop', [
            'foods' => $foods,
            'groupPoints' => $group ? $group->points : 0, // グループの所持ポイント
        ]);
    }


    /**
     * ご飯を購入してグループの所持ご飯に追加する
     *
     * @param \App\Models\Group_Food $food
     * @return \Illuminate\Http\RedirectResponse
     */
    public function buy(Food $food)
    {
        $user = auth()->user();
        $group = $user->group;

        if (!$group) {
            return back()->with('error', '所属グループがありません');
        }

        // ポイントが足りるか確認
        if ($group->points < $food->price) {
            return back()->with('error', 'ポイントが足りません');
        }

        // ポイントを減らす
        $group->decrement('points', $food->price);

        // 所持ご飯に追加（group_foodsテーブル）
        $groupFood = GroupFood::firstOrCreate(
            ['group_id' => $group->id, 'food_id' => $food->id],
            ['quantity' => 0]
        );
        $groupFood->increment('quantity', 1);

        return back()->with('success', "{$food->name} を購入しました！");
    }
}