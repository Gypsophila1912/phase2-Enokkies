<?php

namespace App\Http\Controllers;

use App\Models\Group;
use App\Models\Character;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class GroupController extends Controller
{
    /**
     * グループ一覧を表示する
     *
     * @return \Inertia\Response
     */
    public function index()
    {
        $groups = Group::all(); // ← 修正済み
        return Inertia::render('Group/Index', [
            'groups' => $groups
        ]);
    }

    /**
     * グループ選択画面を表示する
     *
     * @return \Inertia\Response
     */
    public function select()
    {
        $groups = Group::withCount('users')->get();
        return Inertia::render('GroupSelect', [
            'groups' => $groups
        ]);
    }

    /**
     * 指定したグループの詳細と参加ユーザーを表示する
     *
     * @param int $id グループID
     * @return \Inertia\Response
     */
    public function show($id)
    {
        $group = Group::with(['users', 'selectedDressing'])->findOrFail($id);
        $character = Character::where('group_id', $group->id)->first();
        return Inertia::render('Group/Show', [
            'group' => $group,
            'users' => $group->users,
            'selectedDressing' => $group->selectedDressing,
            'character' => $character,
        ]);
    }

    /**
     * グループに参加する処理を行う
     *
     * @param \Illuminate\Http\Request $request
     * @param int|null $id グループID（URLパラメータまたはリクエストから取得）
     * @return \Illuminate\Http\RedirectResponse
     */
   public function join(Request $request, $id)
    {
        $groupId = $id ?? $request->input('group_id');

        if (! $groupId || ! Group::where('id', $groupId)->exists()) {
            return redirect()->route('groups.select')
                ->withErrors(['message' => '指定されたグループが見つかりません。']);
        }

        $user = Auth::user();

        // すでに同じグループに参加している場合
        if ($user->group_id === (int) $groupId) {
            return redirect()->route('enokki.show')
                ->with('message', 'すでにこのグループに参加しています。');
        }

        // グループに参加
        $user->group_id = $groupId;
        $user->save();

        return redirect()->route('enokki.show')
            ->with('message', 'グループに参加しました！');
    }

    /**
     * グループ作成画面を表示する
     *
     * @return \Inertia\Response
     */
    public function create()
    {
        return Inertia::render('Group/Create');
    }

    /**
     * 新しいグループを作成し、初期キャラクターとユーザーのグループ設定を行う
     *
     * @param \Illuminate\Http\Request $request
     * @return \Illuminate\Http\RedirectResponse
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string|max:1000',
        ]);

        $group = Group::create([
            'name' => $validated['name'],
            'description' => $validated['description'] ?? null,
            'created_by' => Auth::id(),
        ]);

        Character::create([
            'group_id' => $group->id,
            'name' => 'エノッキー',
            'level' => 1,
            'experience' => 0,
            'image_path' => '/Enokkie/EnokkieImage.png',
        ]);

        $user = Auth::user();
        $user->group_id = $group->id;
        $user->save();

        return redirect()->route('groups.show', $group->id);
    }

    /**
     * 指定したグループを削除する
     *
     * @param int $id グループID
     * @return \Illuminate\Http\RedirectResponse
     */
    public function destroy($id)
    {
        $group = Group::findOrFail($id);
        $group->delete();

        return redirect('/group-select')->with('message', 'グループを削除しました');
    }

    /**
     * テスト用: 指定したグループにポイントを追加する
     * 
     * @param int $groupId 対象のグループID
     * @param int $amount 追加するポイント
     * @return \Illuminate\Http\JsonResponse
     */
    public function addTestPoints($groupId, $amount)
    {
        $group = Group::findOrFail($groupId);
        $group->increment('points', $amount);

        return response()->json([
            'message' => "グループ {$group->name} に {$amount} ポイントを追加しました。",
            'points' => $group->points,
        ]);
    }

    /**
     * グループに500ポイント追加するAPI
     * @param \Illuminate\Http\Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function add500Points(Request $request)
    {
        $request->validate([
            'group_id' => 'required|exists:groups,id',
        ]);
        $group = Group::findOrFail($request->group_id);
        $group->increment('points', 500);
        return response()->json([
            'message' => "グループ {$group->name} に500ポイント追加しました。",
            'points' => $group->points,
        ]);
    }

    // グループの選択中の服を取得
    public function getSelectedDressing(Request $request)
    {
        $request->validate([
            'group_id' => 'required|exists:groups,id',
        ]);
        $group = Group::with('selectedDressing')->find($request->group_id);
        return response()->json([
            'selected_dressing_id' => $group->selected_dressing_id,
            'selected_dressing' => $group->selectedDressing,
        ]);
    }

    // グループの服選択を更新
    public function selectDressing(Request $request)
    {
        $request->validate([
            'group_id' => 'required|exists:groups,id',
            'dressing_id' => 'nullable|exists:dressings,id',
        ]);
        $group = Group::find($request->group_id);
        $group->selected_dressing_id = $request->dressing_id;
        $group->save();
        return response()->json(['message' => '服を変更しました']);
    }
}
