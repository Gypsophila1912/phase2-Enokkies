<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Cache;
use Inertia\Inertia;
use App\Models\Group;
use App\Models\Task;
use App\Models\Character;
use App\Models\DailyMessage;
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
            return redirect()->route('groups.select')->withErrors(['message' => 'キャラクター情報が見つかりません。']);
        }

        // グループに紐づくタスクを取得してフロント用に整形
        $tasks = Task::where('group_id', $group->id)
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(function (Task $t) {
                return [
                    'id' => $t->id,
                    'title' => $t->title,
                    'memo' => $t->description,
                    'description' => $t->description,
                    'due_date' => $t->due_date ? $t->due_date->toDateString() : null,
                    'is_done' => ! is_null($t->completed_at),
                ];
            })->values();

        // 育て始めてからの日数（小数点切り上げ）
        $groupCreatedAt = Carbon::parse($group->created_at);
        $hoursSinceCreated = $groupCreatedAt->diffInHours(Carbon::now());
        $daysSinceCreated = ceil($hoursSinceCreated / 24);

        // 所持ポイントが null の場合は 0 にする
        $groupPoints = $group->points ?? 0;

        // 今日の日付を元にランダムなメッセージを1件取得
        $seed = intval(date('Ymd'));
        srand($seed);
        $dailyMessage = DailyMessage::inRandomOrder()->first()?->message ?? '「今日もがんばろう！」';

        
        // 今日の日付（例：2025-10-22）
        $today = Carbon::today()->toDateString();

        // キャッシュキーを日付で作成
        $cacheKey = 'daily_message_' . $today;

        // キャッシュに保存されていればそれを使う、なければ新しく取得して保存
        $message = Cache::remember($cacheKey, now()->addDay(), function () {
            return DailyMessage::inRandomOrder()->first();
        });

        
        return Inertia::render('Enokki/Show', [
            'group' => [
                'id' => $group->id,
                'name' => $group->name,
                'description' => $group->description,
                'members_count' => $group->users()->count(),
                'points' => (int) ($group->points ?? 0),
                'days_since_created' => $daysSinceCreated,
                'dailyMessage' => $message->message,
            ],
            'character' => [
                'name' => $character->name,
                'level' => $character->level,
                'current_points' => $character->current_points,
                'points_to_next_level' => 10 - ($character->current_points % 10),
                'image_url' => asset($character->image_path),
            ],
            'tasks' => $tasks,
            'dailyMessage' => $dailyMessage,
        ]);
    }
}
