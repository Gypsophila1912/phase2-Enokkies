<?php

namespace App\Http\Controllers;

use App\Models\Task;
use Inertia\Inertia;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use App\Models\Group;

class TaskController extends Controller
{
    // 一覧取得
    public function index(Request $request)
    {
        $user = Auth::user();
        $groupId = $request->query('group_id', $user?->group_id);

        if (! $groupId) {
            // デバッグ用: グループ未設定なら空配列を返す前にログ出力
            logger()->warning('tasks index called without group_id', ['user_id' => $user?->id]);
            return Inertia::render('Tasks/Index', ['tasks' => [], 'tasks_count' => 0]);
        }

        $tasks = Task::where('group_id', $groupId)
            ->with('user')
            ->orderBy('created_at', 'desc')
            ->get();

        return Inertia::render('Tasks/Index', [
            'tasks' => $tasks->toArray(), // 明示的に配列で渡す
            'tasks_count' => $tasks->count(),
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

    //  タスク完了／未完了トグル
    public function toggleComplete(Task $task)
    {
        $user = Auth::user();

        // 所属チェック（ユーザーがそのグループのメンバーか）
        if ($task->group_id !== $user->group_id) {
            return response()->json(['message' => 'Forbidden'], 403);
        }

        // 現在の完了状態を判定
        $wasCompleted = (bool) $task->completed_at;

        DB::transaction(function () use ($task, $wasCompleted) {
            if ($wasCompleted) {
                // 未完了に戻す（ポイントは戻さない仕様）
                $task->update(['completed_at' => null]);
            } else {
                // 完了にする
                $task->update(['completed_at' => now()]);

                // グループにポイントを付与（+1）
                if ($task->group_id) {
                    $group = Group::where('id', $task->group_id)->lockForUpdate()->first();
                    if ($group) {
                        $group->increment('points', 1);
                    }
                }
            }
        });

        // 最新の関連を読み直して返す
        $task->load('user');

        if (request()->header('X-Inertia')) {
            return redirect()->route('tasks.index');
        }

        return response()->json($task);
    }

    //  タスク削除
    public function destroy(Task $task)
    {
        $user = Auth::user();

        // 所属チェック（必要に応じて Policy に切り出し）
        if ($task->group_id !== $user->group_id) {
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
