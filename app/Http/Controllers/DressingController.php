<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Dressing;
use App\Models\GroupDressing;

class DressingController extends Controller
{
    public function buy($id)
    {
        $user = auth()->user();
        $group = $user->group;
        $dressing = Dressing::findOrFail($id);

        // 所持ポイントが足りない場合
        if ($group->points < $dressing->price) {
            return back()->with('error', 'ポイントが足りません');
        }

        // ポイントを減らす
        $group->points -= $dressing->price;
        $group->save();

        // 所持アイテムとして追加（重複チェック）
        $groupDressing = GroupDressing::firstOrCreate([
            'group_id' => $group->id,
            'dressing_id' => $dressing->id,
        ]);

        // 所持数カウントを増やす
        $groupDressing->increment('quantity');

        return back()->with('success', '服を購入しました！');
    }
}