<?php

namespace App\Http\Controllers;

use App\Models\Task;
use Inertia\Inertia;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use App\Models\Group;
use App\Models\Character;

class TaskController extends Controller
{
    // 一覧取得
    public function index(Request $request)
    {
        $user = Auth::user();
        $groupId = $request->query('group_id', $user?->group_id);

        if (! $groupId) {
            logger()->warning('tasks index called without group_id', ['user_id' => $user?->id]);
            return Inertia::render('Tasks/Index', ['tasks' => [], 'tasks_count' => 0]);
        }

        $tasks = Task::where('group_id', $groupId)
            ->with('user')
            ->orderBy('created_at', 'desc')
            ->get();

        $group = Group::select(['id','name','description','points'])->find($groupId);

        return Inertia::render('Tasks/Index', [
            'tasks' => $tasks->toArray(),
            'tasks_count' => $tasks->count(),
            'group' => $group,
        ]);
    }

    //  タスク作成
    public function store(Request $request)
    {
        $validated = $request->validate([
            'group_id' => 'required|integer|exists:groups,id',
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'due_date' => 'nullable|date',
            'points' => 'nullable|integer|min:0',
        ]);

        $validated['user_id'] = Auth::id();

        $task = Task::create($validated);

        // Inertia リクエストならリダイレクトを返す（Inertia が期待する形）
        if ($request->header('X-Inertia')) {
            return redirect()->route('tasks.index');
        }

        // API 等で直接 JSON を期待する場合は元の挙動を維持
        return response()->json($task, 201);
    }

    //  タスク完了（チェックでグループにポイント加算してタスクを削除・キャラの成長反映）
    public function complete(Request $request, Task $task)
    {
        $user = Auth::user();

        // 所属チェック
        if ($task->group_id !== $user->group_id) {
            if ($request->header('X-Inertia')) {
                return redirect()->back()->with('error', 'Forbidden');
            }
            return response()->json(['message' => 'Forbidden'], 403);
        }

        DB::transaction(function () use ($task) {
            if (is_null($task->completed_at)) {
                $group = Group::where('id', $task->group_id)->lockForUpdate()->first();

                if ($group) {
                    $group->increment('points', 1);

                    // グループに紐づくキャラクターをロックして取得
                    $character = Character::where('group_id', $group->id)->lockForUpdate()->first();

                    if ($character) {
                        $attrs = $character->getAttributes();
                        $threshold = 10;

                        if (array_key_exists('current_points', $attrs)) {
                            $character->current_points = (int) ($character->current_points ?? 0) + 1;
                            if ($character->current_points >= $threshold) {
                                $levelsGained = intdiv($character->current_points, $threshold);
                                $character->level = (int) ($character->level ?? 0) + $levelsGained;
                                $character->current_points = $character->current_points % $threshold;
                            }
                        } elseif (array_key_exists('experience', $attrs)) {
                            $character->experience = (int) ($character->experience ?? 0) + 1;
                            if ($character->experience >= $threshold) {
                                $levelsGained = intdiv($character->experience, $threshold);
                                $character->level = (int) ($character->level ?? 0) + $levelsGained;
                                $character->experience = $character->experience % $threshold;
                            }
                        } else {
                            // フォールバック：experience を使う
                            $character->experience = (int) ($character->experience ?? 0) + 1;
                            if ($character->experience >= $threshold) {
                                $levelsGained = intdiv($character->experience, $threshold);
                                $character->level = (int) ($character->level ?? 0) + $levelsGained;
                                $character->experience = $character->experience % $threshold;
                            }
                        }

                        $character->save();
                    }
                }

                // タスクを削除
                $task->delete();
            }
        });

        // Inertia リクエストなら元のページへリダイレクト（再フェッチ）
        if ($request->header('X-Inertia')) {
            return redirect()->back()->with('success', 'タスクを完了しました');
        }

        return response()->json(['message' => 'deleted'], 200);
    }

    //  タスク削除
    public function destroy(Task $task)
    {
        $user = Auth::user();

        // 所属チェック（必要に応じて Policy に切り出し）
        if ($task->group_id !== $user->group_id) {
            if (request()->header('X-Inertia')) {
                return redirect()->back()->with('error', 'Forbidden');
            }
            return response()->json(['message' => 'Forbidden'], 403);
        }

        $task->delete();

        // Inertia リクエストならリダイレクトを返す（Inertia が期待する形）
        if (request()->header('X-Inertia')) {
            return redirect()->route('tasks.index')->with('success', 'タスクを削除しました');
        }

        // API 等で直接 JSON を期待する場合は 204 No Content を返す
        return response()->noContent();
    }

    // タスク更新
    public function update(Request $request, Task $task)
    {
        $user = Auth::user();

        // 所属チェック（必要に応じて Policy に切り出し）
        if ($task->group_id !== $user->group_id) {
            if ($request->header('X-Inertia')) {
                return redirect()->back()->with('error', 'Forbidden');
            }
            return response()->json(['message' => 'Forbidden'], 403);
        }

        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'due_date' => 'nullable|date',
            'points' => 'nullable|integer|min:0',
        ]);

        $task->update($validated);

        if ($request->header('X-Inertia')) {
            return redirect()->route('tasks.index');
        }

        return response()->json($task);
    }
}
