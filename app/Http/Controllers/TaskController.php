<?php

namespace App\Http\Controllers;

use App\Models\Task;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class TaskController extends Controller
{
    // 一覧取得
    public function index(Request $request)
    {
        $groupId = $request->query('group_id');
        $tasks = Task::where('group_id', $groupId)
            ->with('user')
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json($tasks);
    }

    //  タスク作成
    public function store(Request $request)
    {
        $validated = $request->validate([
            'group_id' => 'required|integer|exists:groups,id',
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'points' => 'nullable|integer',
        ]);

        $validated['user_id'] = Auth::id(); // ログイン中ユーザー

        $task = Task::create($validated);

        return response()->json($task, 201);
    }

    //  タスク完了／未完了トグル
    public function toggleComplete(Task $task)
    {
        // 現在の完了状態を判定
        $wasCompleted = (bool) $task->completed_at;

        DB::transaction(function () use ($task, $wasCompleted) {
            if ($wasCompleted) {
                // 未完了に戻す（ポイントは戻さない仕様）
                $task->update(['completed_at' => null]);
            } else {
                // 完了にする
                $task->update(['completed_at' => now()]);

                // タスク所有ユーザーにポイントを付与（+1）
                if ($task->user_id) {
                    $user = $task->user()->lockForUpdate()->first();
                    if ($user) {
                        $user->increment('points', 1);
                    }
                }
            }
        });

        // 最新の関連を読み直して返す
        $task->load('user');

        return response()->json($task);
    }

    //  タスク削除
    public function destroy(Task $task)
    {

        $task->delete();

        return response()->json(['message' => 'Deleted successfully'], 204);
    }
}
