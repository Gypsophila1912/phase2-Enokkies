<?php

namespace App\Http\Controllers;

use App\Models\Group;
use App\Models\Character;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class GroupController extends Controller
{
    public function index()
    {
        $groups = Group::all(); // ← 修正済み
        return Inertia::render('Group/Index', [
            'groups' => $groups
        ]);
    }

    public function select()
    {
        $groups = Group::withCount('users')->get();
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

    public function create()
    {
        return Inertia::render('Group/Create');
    }

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
            'image_path' => 'public/images/EnokkieImage.png',
        ]);

        $user = Auth::user();
        $user->group_id = $group->id;
        $user->save();

        return redirect()->route('groups.show', $group->id);
    }

    public function destroy($id)
    {
        $group = Group::findOrFail($id);
        $group->delete();

        return redirect('/group-select')->with('message', 'グループを削除しました');
    }
}
