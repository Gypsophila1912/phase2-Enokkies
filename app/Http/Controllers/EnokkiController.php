<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Group;
use App\Models\Task;
use App\Models\Character;
use Illuminate\Support\Facades\Auth;
use Carbon\Carbon;

class EnokkiController extends Controller
{
    public function show()
    {
        $user = Auth::user();
        $group = $user->group;


        // グループに未所属ならリダイレクト
        if (!$group) {
            return redirect()->route('groups.select');
        }

        // キャラクターが存在しない場合の対処
        $character = $group->character;
        if (!$character) {
            // 必要に応じてエラーページに飛ばすか、仮データを返す
            return redirect()->route('groups.select')->withErrors(['message' => 'キャラクター情報が見つかりません。']);
        }

        $tasks = $user->tasks()->get();

        $groupCreatedAt = Carbon::parse($group->created_at);
        $daysSinceCreated = $groupCreatedAt->diffInDays(Carbon::now());

        return Inertia::render('Enokki/Show', [
            'group' => [
                'name' => $group->name,
                'description' => $group->description,
                'members_count' => $group->users()->count(),
                'points' => $group->points . 'pt',
                'days_since_created' => $daysSinceCreated,
            ],
            'character' => [
                'name' => $character->name,
                'level' => $character->level,
                'current_points' => $character->current_points,
                'points_to_next_level' => 10 - ($character->current_points % 10),
                'image_url' => $character->image_url,
            ],
            'tasks' => $tasks,
        ]);
    }
}
