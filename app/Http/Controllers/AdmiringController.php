<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Character;
use App\Models\GroupFood;

class AdmiringController extends Controller
{

    public function index()
    {
        $user = auth()->user();
        $groupId = $user->group_id;
        
        //キャラクター情報取得
        $character = Character::where('group_id', $groupId)->first();
        
        // アイテム一覧（仮データ、後でDBから取得）
        $items = GroupFood::where('group_id', $groupId)
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

        return inertia('EnokkieAdmiringRoom/AdmiringRoom', [
            'character' => $character,
            'groupId' => $groupId,
            'items' => $items,
        ]);
    }
    
public function update(Request $request)
{
    $user = auth()->user();
    $groupId = $user->group_id;
    
    $validated = $request->validate([
        'affection' => 'required|integer|min:0',
    ]);
    
    Character::where('group_id', $groupId)
        ->update(['affection' => $validated['affection']]);
    
    // 元のページにリダイレクト
    return redirect()->route('admiring.index');
}

    public function updateName(Request $request, $groupId)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:20',
        ]);
        
        // 対象キャラクターを取得してから保存する
        $character = Character::where('group_id', $groupId)->first();
        if (! $character) {
            return response()->json(['success' => false, 'message' => 'Character not found'], 404);
        }

        $character->name = $validated['name'];
        $saved = $character->save();

        if (! $saved) {
            return response()->json(['success' => false, 'message' => 'Failed to save'], 500);
        }

        return response()->noContent();
    }
}