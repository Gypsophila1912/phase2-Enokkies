<?php

namespace App\Http\Controllers;

use App\Models\Task;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

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

        $task->update([
            'completed_at' => $task->completed_at ? null : now(),
        ]);

        return response()->json($task);
    }

    //  タスク削除
    public function destroy(Task $task)
    {

        $task->delete();

        return response()->json(['message' => 'Deleted successfully'], 204);
    }
}
