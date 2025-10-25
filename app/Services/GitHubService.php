<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class GitHubService
{
    private $baseUrl = 'https://api.github.com';

    /**
     * リポジトリのコントリビューションを取得してポイントを計算
     * 
     * @param string $owner リポジトリオーナー
     * @param string $repo リポジトリ名
     * @param string $githubAccount GitHubアカウント名
     * @return array ['commits' => int, 'pushes' => int, 'merges' => int, 'total_points' => int]
     */
    public function getContributionPoints($owner, $repo, $githubAccount)
    {
        try {
            $commits = $this->getCommitCount($owner, $repo, $githubAccount);
            $pushes = $this->getPushCount($owner, $repo, $githubAccount);
            $merges = $this->getMergeCount($owner, $repo, $githubAccount);

            $totalPoints = ($commits * 1) + ($pushes * 5) + ($merges * 10);

            return [
                'commits' => $commits,
                'pushes' => $pushes,
                'merges' => $merges,
                'total_points' => $totalPoints,
            ];
        } catch (\Exception $e) {
            Log::error('GitHub API Error: ' . $e->getMessage());
            return [
                'commits' => 0,
                'pushes' => 0,
                'merges' => 0,
                'total_points' => 0,
            ];
        }
    }

    /**
     * コミット数を取得
     */
    private function getCommitCount($owner, $repo, $author)
    {
        $response = Http::timeout(10)
            ->get("{$this->baseUrl}/repos/{$owner}/{$repo}/commits", [
                'author' => $author,
                'per_page' => 100,
            ]);

        if (!$response->successful()) {
            Log::warning("Failed to fetch commits for {$author}: " . $response->status());
            return 0;
        }

        $commits = $response->json();
        $totalCount = count($commits);

        // 次のページがある場合は追加取得（最大5ページまで = 500コミット）
        $page = 2;
        $maxPages = 5;
        while ($page <= $maxPages && $response->header('Link') && str_contains($response->header('Link'), 'rel="next"')) {
            $response = Http::timeout(10)
                ->get("{$this->baseUrl}/repos/{$owner}/{$repo}/commits", [
                    'author' => $author,
                    'per_page' => 100,
                    'page' => $page,
                ]);

            if ($response->successful()) {
                $totalCount += count($response->json());
                $page++;
            } else {
                break;
            }
        }

        return $totalCount;
    }

    /**
     * プッシュ数を取得（イベントAPIから）
     */
    private function getPushCount($owner, $repo, $username)
    {
        $response = Http::timeout(10)
            ->get("{$this->baseUrl}/repos/{$owner}/{$repo}/events", [
                'per_page' => 100,
            ]);

        if (!$response->successful()) {
            Log::warning("Failed to fetch events for push count: " . $response->status());
            return 0;
        }

        $events = $response->json();
        $pushCount = 0;

        foreach ($events as $event) {
            if ($event['type'] === 'PushEvent' && 
                isset($event['actor']['login']) && 
                $event['actor']['login'] === $username) {
                $pushCount++;
            }
        }

        return $pushCount;
    }

    /**
     * マージ数を取得（プルリクエストAPIから）
     */
    private function getMergeCount($owner, $repo, $username)
    {
        $response = Http::timeout(10)
            ->get("{$this->baseUrl}/repos/{$owner}/{$repo}/pulls", [
                'state' => 'closed',
                'per_page' => 100,
            ]);

        if (!$response->successful()) {
            Log::warning("Failed to fetch pull requests: " . $response->status());
            return 0;
        }

        $pullRequests = $response->json();
        $mergeCount = 0;

        foreach ($pullRequests as $pr) {
            // マージされたPRで、作成者が対象ユーザーの場合
            if (isset($pr['merged_at']) && 
                $pr['merged_at'] !== null &&
                isset($pr['user']['login']) &&
                $pr['user']['login'] === $username) {
                $mergeCount++;
            }
        }

        return $mergeCount;
    }

    /**
     * リポジトリの全体統計を取得
     */
    public function getRepositoryStats($owner, $repo)
    {
        try {
            $response = Http::timeout(10)
                ->get("{$this->baseUrl}/repos/{$owner}/{$repo}");

            if ($response->successful()) {
                $data = $response->json();
                return [
                    'stars' => $data['stargazers_count'] ?? 0,
                    'forks' => $data['forks_count'] ?? 0,
                    'open_issues' => $data['open_issues_count'] ?? 0,
                ];
            }
        } catch (\Exception $e) {
            Log::error('Failed to fetch repository stats: ' . $e->getMessage());
        }

        return ['stars' => 0, 'forks' => 0, 'open_issues' => 0];
    }
}