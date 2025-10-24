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
        $items = [];
        
        return inertia('EnokkieAdmiringRoom/AdmiringRoom', [
            'character' => $character,
            'groupId' => $groupId,
            'items' => $items,
        ]);
    }
    
    public function update(Request $request, $groupId)
    {
        $validated = $request->validate([
            'personal_points' => 'required|integer|min:0',
        ]);
        
        $user = auth()->user();
        
        DevGroupUser::where('devgroup_id', $groupId)
            ->where('user_id', $user->id)
            ->update([
                'personal_points' => $validated['personal_points']
            ]);
        
        return redirect()->back();
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