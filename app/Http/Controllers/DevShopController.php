<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Food;
use App\Models\DevGroup;
use App\Models\DevGroupUser;
use App\Models\DevGroupFood;

class DevShopController extends Controller
{
    public function index(Request $request)
    {
        $user = auth()->user();

        // ユーザーに紐づく devgroup_user レコードを取得し、所属 DevGroup を取得
        $devGroupUser = DevGroupUser::where('user_id', $user->id)->first();
        $devGroup = $devGroupUser ? DevGroup::find($devGroupUser->devgroup_id) : null;

        // 全フードを取得し、各フードの dev 所持数を付与
        $foods = Food::all()->map(function ($f) use ($devGroup) {
            $qty = 0;
            if ($devGroup) {
                $dgf = DevGroupFood::where('devgroup_id', $devGroup->id)
                    ->where('food_id', $f->id)
                    ->first();
                $qty = $dgf ? $dgf->quantity : 0;
            }
            // 追加属性として quantity を渡す
            $f->quantity = $qty;
            return $f;
        });

        return Inertia::render('Developer/Shop', [
            'foods' => $foods,
            'groupPoints' => $devGroup ? $devGroup->total_points : 0,
        ]);
    }


    public function buy(Food $food)
    {
        $user = auth()->user();

        $devGroupUser = DevGroupUser::where('user_id', $user->id)->first();
        $devGroup = $devGroupUser ? DevGroup::find($devGroupUser->devgroup_id) : null;

        if (!$devGroup) {
            return back()->with('error', '所属する開発者グループがありません');
        }

        if ($devGroup->total_points < $food->price) {
            return back()->with('error', 'ポイントが足りません');
        }

        // ポイントを減らす
        $devGroup->decrement('total_points', $food->price);

        // dev_group_food テーブルに追加／更新
        $devGroupFood = DevGroupFood::firstOrCreate(
            ['devgroup_id' => $devGroup->id, 'food_id' => $food->id],
            ['quantity' => 0]
        );
        $devGroupFood->increment('quantity', 1);

        return back()->with('success', "{$food->name} を購入しました！");
    }
}