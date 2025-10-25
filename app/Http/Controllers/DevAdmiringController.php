<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\DevCharacter;
use App\Models\DevGroupFood;
use App\Models\DevGroupUser;
use App\Models\DevGroup;

class DevAdmiringController extends Controller
{
    public function index(Request $request)
    {
        $user = auth()->user();
        // ユーザーに紐づく devgroup_user レコードを取得し、所属 DevGroup を取得
        $devGroupUser = DevGroupUser::where('user_id', $user->id)->first();
        $devGroup = $devGroupUser ? DevGroup::find($devGroupUser->devgroup_id) : null;

        
        //キャラクター情報取得
        $character = DevCharacter::where('devgroup_id', $devGroup->id)->first();
        
        // アイテム一覧（仮データ、後でDBから取得）
        $items = DevGroupFood::where('devgroup_id', $devGroup->id)
        ->where('quantity', '>', 0)
        ->with('food')
        ->get()
        ->map(function ($groupFood) {
            return [
                'id' => $groupFood->id,
                'name' => $groupFood->food->name,
                'image_path' => $groupFood->food->image_path,
                'points' => $groupFood->food->exp_points,
                'quantity' => $groupFood->quantity,
                'rarity' => $groupFood->rarity,
                'food_id' => $groupFood->food_id,
            ];
        });

        return inertia('Developer/AdmiringRoom', [
            'character' => $character,
            'groupId' => $devGroup->id,
            'items' => $items,
        ]);
    }
    
    public function update(Request $request)
    {
        $user = auth()->user();
        $devGroupUser = DevGroupUser::where('user_id', $user->id)->first();
        $devGroup = $devGroupUser ? DevGroup::find($devGroupUser->devgroup_id) : null;
        
        $validated = $request->validate([
            'affection' => 'required|integer|min:0',
        ]);
        
        DevCharacter::where('devgroup_id', $devGroup->id)
            ->update(['affection' => $validated['affection']]);
        
        // 元のページにリダイレクト
        return redirect()->route('devadmiring.index');
    }

    public function updateName(Request $request, $groupId)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:20',
        ]);
        
        // 対象キャラクターを取得
        $character = DevCharacter::where('devgroup_id', $groupId)->firstOrFail();

        $character->name = $validated['name'];
        $character->save();

        // 元のページ（エノッキーのお部屋）にリダイレクト
        return redirect()->route('devadmiring.index'); // または適切なルート名に変更
    }


    public function useItem(Request $request)
    {
        $user = auth()->user();
        $devGroupUser = DevGroupUser::where('user_id', $user->id)->first();
        $devGroup = $devGroupUser ? DevGroup::find($devGroupUser->devgroup_id) : null;

        $request->validate([
            'id' => 'required|integer',
        ]);

        $groupFood = DevGroupFood::where('devgroup_id', $devGroup->id)
            ->findOrFail($request->id);

        if ($groupFood->quantity > 0) {
            $groupFood->decrement('quantity', 1);
        }

        $groupFood->refresh();

        return response()->json([
            'success' => true,
            'quantity' => $groupFood->quantity,
        ]);
    }

}
