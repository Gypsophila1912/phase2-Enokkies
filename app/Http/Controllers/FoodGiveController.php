<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Group;
use App\Models\GroupFood;
use App\Models\Food;
use App\Models\Character;
use Inertia\Inertia;

class FoodGiveController extends Controller
{
    // ご飯一覧の表示
    public function index(Group $group)
    {
        $group->load('groupFoods.food');
        return inertia('FoodGive', [
            'group' => $group,
        ]);
    }

    // ご飯を与える処理
    public function give(Request $request, Group $group)
    {
        $request->validate([
            'food_id' => 'required|exists:foods,id',
        ]);

        $groupFood = $group->groupFoods()->where('food_id', $request->food_id)->first();

        if (!$groupFood || $groupFood->quantity <= 0) {
            return back()->withErrors(['message' => 'このご飯はもうありません！']);
        }

        // ご飯を減らす
        $groupFood->decrement('quantity');

        // ご飯の経験値量を取得
        $food = $groupFood->food;
        $expGain = match ($food->rarity) {
            'common' => 5,
            'rare' => 15,
            'super_rare' => 30,
            default => 0,
        };

        // キャラクターに経験値を追加
        $character = Character::where('group_id', $group->id)->first();

        if (!$character) {
            return back()->withErrors(['message' => 'キャラクターが見つかりません。']);
        }

        $character->increment('experience', $expGain);

        return redirect()->back()->with('message', "{$food->name}をあげました！ 経験値 +{$expGain}");
    }
}