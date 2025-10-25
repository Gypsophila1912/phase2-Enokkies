<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Str;//UUID生成のために追加
use Illuminate\Support\Facades\DB;
use App\Models\User;
use App\Models\DevGroup;
use App\Models\DevGroupUser;
use App\Services\GitHubService;
use App\Models\DevCharacter;

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
        \Log::info('受信データ:', $request->all());
        
        $validated = $request->validate([
            'group_name' => 'required|string|max:255',
            'repository_url' => 'required|url|max:255',
            'account_name' => 'required|string|max:255',
        ]);
        
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

            // グループを作成
            $group = DevGroup::create([
                'uuid' => $uuid,
                'name' => $validated['group_name'],
                'url' => $validated['repository_url'],
                'total_points' => 0,
                'repository_owner' => $parsed['owner'],
                'repository_name' => $parsed['repo'],
            ]);

            // キャラクターを作成
            DevCharacter::create([
                'devgroup_id' => $group->id,
                'name' => 'エノッキー',
                'level' => 1,
                'experience' => 0,
                'image_path' => '/Enokkie/EnokkieImage.png', // デフォルト画像
                'affection' => 0,
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

    protected $githubService;

    public function __construct(GitHubService $githubService)
    {
        $this->githubService = $githubService;
    }

    public function show($id)
    {
        try {
            $group = DevGroup::with(['devGroupUsers.user', 'character'])->findOrFail($id);
            
            $user = auth()->user();
            $isMember = DevGroupUser::where('devgroup_id', $id)
                ->where('user_id', $user->id)
                ->exists();

            if (!$isMember) {
                return redirect()->route('developer.index')
                    ->with('error', 'アクセス権限がありません');
            }

            // キャラクター情報を取得
            $character = $group->character;

            // 各メンバーのコントリビューションを取得
            $githubService = app(\App\Services\GitHubService::class);
            $totalPoints = 0;
            
            foreach ($group->devGroupUsers as $member) {
                if ($member->github_account) {
                    $contribution = $githubService->getContributionPoints(
                        $group->repository_owner,
                        $group->repository_name,
                        $member->github_account
                    );

                    $member->update([
                        'personal_points' => $contribution['total_points']
                    ]);

                    $member->contribution_details = $contribution;
                    $totalPoints += $contribution['total_points'];
                } else {
                    $member->contribution_details = [
                        'commits' => 0,
                        'pushes' => 0,
                        'merges' => 0,
                        'total_points' => 0,
                    ];
                }
            }

            $group->update(['total_points' => $totalPoints]);

            return inertia('Developer/GroupPage', [
                'group' => $group,
                'character' => [
                    'name' => $character->name,
                    'level' => $character->level,
                    'experience' => $character->experience,
                    'image_url' => $character->image_url, // DevCharacterのアクセサを使用
                    'affection' => $character->affection,
                ],
            ]);
        } catch (\Exception $e) {
            \Log::error('Group show error: ' . $e->getMessage());
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

    // app/Http/Controllers/DeveloperController.php

    public function leave($id)
    {
        try {
            $user = auth()->user();
            
            // グループの存在確認
            $group = DevGroup::findOrFail($id);
            
            // ユーザーがグループに所属しているか確認
            $membership = DevGroupUser::where('devgroup_id', $id)
                ->where('user_id', $user->id)
                ->first();

            if (!$membership) {
                return redirect()->route('developer.index')
                    ->with('error', 'このグループに参加していません');
            }

            DB::beginTransaction();

            // メンバーシップを削除
            $membership->delete();

            // グループに誰もいなくなった場合、グループとキャラクターも削除
            $remainingMembers = DevGroupUser::where('devgroup_id', $id)->count();
            
            if ($remainingMembers === 0) {
                // キャラクターを削除
                $group->character()->delete();
                // グループを削除
                $group->delete();
                
                DB::commit();
                
                return redirect()->route('developer.index')
                    ->with('success', 'グループから退会しました（最後のメンバーだったためグループを削除しました）');
            }

            DB::commit();
            
            return redirect()->route('developer.index')
                ->with('success', 'グループから退会しました');
                
        } catch (\Exception $e) {
            DB::rollBack();
            \Log::error('グループ退会エラー: ' . $e->getMessage());
            
            return redirect()->route('developer.index')
                ->with('error', 'グループからの退会に失敗しました');
        }
    }
}
