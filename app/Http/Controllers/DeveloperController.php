<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Str;//UUID生成のために追加
use Illuminate\Support\Facades\DB;
use App\Models\User;
use App\Models\DevGroup;
use App\Models\DevGroupUser;

class DeveloperController extends Controller
{
    public function index()
    {
        $user = auth()->user();
        $devGroups = $user->devGroups()->get();
        return inertia('Developer/Index', ['devGroups' => $devGroups]);
    }

    public function create(Request $request)
    {
        // リクエストの内容を確認
        \Log::info('受信データ:', $request->all());
        
        $validated = $request->validate([
            'group_name' => 'required|string|max:255',
            'repository_url' => 'required|url|max:255',
            'account_name' => 'required|string|max:255',
        ]);
        
        \Log::info('バリデーション後:', $validated);

        // GitHub URL をパースして owner / repo を取得
        $parsed = $this->parseGitHubUrl($validated['repository_url']);
        if (!$parsed) {
            return redirect()->back()->with('error', 'リポジトリURLが GitHub の形式ではありません（例: https://github.com/owner/repo）');
        }

        try {
            DB::beginTransaction();

            // ユニークな10桁のUUIDを生成
            do {
                $uuid = strtoupper(Str::random(10));
            } while (DevGroup::where('uuid', $uuid)->exists());

            // グループを作成（owner/name を保存）
            $group = DevGroup::create([
                'uuid' => $uuid,
                'name' => $validated['group_name'],
                'url' => $validated['repository_url'],
                'total_points' => 0,
                'repository_owner' => $parsed['owner'],
                'repository_name' => $parsed['repo'],
            ]);

            // 作成者を自動的にメンバーに追加
            DevGroupUser::create([
                'devgroup_id' => $group->id,
                'user_id' => auth()->id(),
                'github_account' => $validated['account_name'],
                'personal_points' => 0,
            ]);

            DB::commit();
            
            return redirect()->back()->with('success', 'グループが作成されました');
        } catch (\Exception $e) {
            DB::rollBack();
            
            \Log::error('グループ作成エラー: ' . $e->getMessage());
            
            return redirect()->back()->with('error', 'グループの作成に失敗しました: ' . $e->getMessage());
        }
    }

    public function join(Request $request)
    {
        $validated = $request->validate([
            'uuid' => 'required|string|max:255',
            'account_name' => 'required|string|max:255',
        ]);

        try {
            DB::beginTransaction(); // トランザクション開始を追加

            // UUIDでグループを検索
            $group = DevGroup::where('uuid', $validated['uuid'])->first();

            if (!$group) {
                return redirect()->back()->with('error', '指定されたUUIDのグループが見つかりません');
            }

            // 既に参加しているかチェック
            $exists = DevGroupUser::where('devgroup_id', $group->id)
                ->where('user_id', auth()->id())
                ->exists();

            if ($exists) {
                return redirect()->back()->with('error', '既にこのグループに参加しています');
            }

            // グループに参加
            DevGroupUser::create([
                'devgroup_id' => $group->id,
                'user_id' => auth()->id(),
                'github_account' => $validated['account_name'],
                'personal_points' => 0,
            ]);

            DB::commit();
            
            return redirect()->back()->with('success', 'グループに参加しました');
        } catch (\Exception $e) {
            DB::rollBack();
            
            \Log::error('グループ参加エラー: ' . $e->getMessage());
            
            return redirect()->back()->with('error', 'グループへの参加に失敗しました: ' . $e->getMessage());
        }
    }

    public function show($id)
    {
        try {
            // グループデータを取得
            $group = DevGroup::with(['devGroupUsers.user'])->findOrFail($id);
            
            // ユーザーがこのグループに所属しているか確認
            $user = auth()->user();
            $isMember = DevGroupUser::where('devgroup_id', $id)
                ->where('user_id', $user->id)
                ->exists();

            if (!$isMember) {
                return redirect()->route('developer.index')
                    ->with('error', 'アクセス権限がありません');
            }

            return inertia('Developer/GroupPage', [
                'group' => $group
            ]);
        } catch (\Exception $e) {
            return redirect()->route('developer.index')
                ->with('error', 'グループの表示に失敗しました');
        }
    }

    // URLパース用のヘルパーメソッド
    private function parseGitHubUrl($url)
    {
        // https://github.com/owner/repo または https://github.com/owner/repo.git
        $pattern = '/github\.com\/([^\/]+)\/([^\/\.]+)/';
        
        if (preg_match($pattern, $url, $matches)) {
            return [
                'owner' => $matches[1],
                'repo' => $matches[2],
            ];
        }
        
        return null;
    }
}
