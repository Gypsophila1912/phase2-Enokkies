<?php

namespace App\Http\Controllers;

use App\Models\Group;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class GroupController extends Controller
{
    public function index()
    {
        // データベースからすべてのグループを取得
        $groups = Groups::all();

        // Inertiaを使ってReactコンポーネントにデータを渡す
        return Inertia::render('Group/Index', [
            'groups' => $groups
        ]);
    }

    
    
    public function select()
    {
        $groups = Group::withCount('users')->get(); // ← 所属ユーザー数を取得
        return Inertia::render('GroupSelect', [
            'groups' => $groups
        ]);
    }



    public function show($id)
    
    {
        $group = Group::with('users')->findOrFail($id);

        return Inertia::render('Group/Show', [
            'group' => $group,
            'users' => $group->users,
        ]);
    }

    public function join($id)
    {
        $group = Group::findOrFail($id);
        $user = auth()->user();

        // 所属グループを上書きする（1人1グループ制）
        $user->group_id = $group->id;
        $user->save();

        return redirect()->route('groups.show', $group->id);
    }



    public function create()
    {
        // グループ作成フォームを表示
        return Inertia::render('Group/Create');
    }

    public function store(Request $request)
    {
        // バリデーション
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string|max:1000',
        ]);

        // グループ作成
        $group = Group::create([
            'name' => $validated['name'],
            'description' => $validated['description'] ?? null,
            'created_by' => Auth::id(), // ← ここが追加された部分
        ]);

        // ユーザーをこのグループに所属させる（1人1グループ制）
        $user = Auth::user();
        $user->group_id = $group->id;
        $user->save();

        // 作成したグループの詳細ページへリダイレクト
        return redirect()->route('groups.show', $group->id);
    }

    public function destroy($id)
    {
        $group = Group::findOrFail($id);

        // 関連データも削除（onDelete('cascade') が設定されている前提）
        $group->delete();

        return redirect('/group-select')->with('message', 'グループを削除しました');
    }

}
