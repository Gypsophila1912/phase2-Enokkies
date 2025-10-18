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

    public function join($id)
    {
        $group = Group::findOrFail($id);
        $user = auth()->user();

        // すでに参加している場合は処理しない
        if ($user->group_id === $group->id) {
            return redirect()->route('groups.show', $group->id)
                ->with('message', 'すでにこのグループに参加しています。');
        }

        // グループに参加
        $user->group_id = $group->id;
        $user->save();

        return redirect()->route('groups.select')
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
