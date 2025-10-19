import React from 'react';
import { usePage, Head, Link } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AppLayout';
import { router } from '@inertiajs/react';

export default function Show({ auth }) {
  const { group, character, tasks } = usePage().props;

  // group.points が undefined / null / 非数 の場合に備えて安全に計算
  const groupPoints = Number(group?.points ?? 0);
  const pointsInCycle = ((groupPoints % 10) + 10) % 10; // 0-9 の範囲に正規化
  const progressPercent = pointsInCycle * 10; // 0,10,...,90 (%)

  return (
    <AuthenticatedLayout user={auth.user}>
      <Head title="エノッキー育成" />

      <div className="min-h-screen bg-gradient-to-br from-lime-200 via-green-100 to-green-300 px-6 py-10 font-sans text-gray-800 relative overflow-hidden">

        {/* キラキラエフェクト */}
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute sparkle"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 2}s`,
              fontSize: `${Math.random() * 1.5 + 0.8}rem`,
            }}
          >
            ✨
          </div>
        ))}

        {/* エノッキー情報（左上） */}
        <div className="absolute top-40 left-20 bg-pink-100/80 backdrop-blur-md rounded-xl p-4 shadow-lg border border-pink-300 w-[300px]">
          <h2 className="text-lg font-bold text-pink-700 mb-2">🌱 あなたのエノッキー情報</h2>
          <p className="text-md font-semibold">名前：{character.name}</p>
          <p>レベル：Lv.{character.level}</p>
          <p>次のレベルまで：あと {character.points_to_next_level}pt</p>
        </div>

        {/* 成長メーター（画像の上） */}
        <div className="absolute top-3 left-1/2 transform -translate-x-1/2 w-[600px] bg-white/80 backdrop-blur-md rounded-xl p-4 shadow-lg border border-green-300">
          <h2 className="text-sm font-bold text-green-800 mb-2">🍀 成長メーター</h2>
          <div className="w-full bg-gray-300 rounded-full h-4">
            <div
              className="bg-green-400 h-4 rounded-full transition-all duration-500"
              style={{ width: `${(character.current_points % 10) * 10}%` }}
            ></div>
          </div>
          <p className="text-sm text-gray-700 mt-1 text-right">
            {character.current_points % 10}pt / 10pt
          </p>
        </div>

        {/* エノッキー画像（中央） */}
        <div className="flex justify-center mt-[80px]">
          <div className="bg-white/80 backdrop-blur-md rounded-xl p-6 shadow-lg border border-green-400">
            <img
              src="/images/EnokkieImage.png"
              alt="エノッキー"
              className="w-40 h-50 object-cover border-4 border-green-400"
            />
          </div>
        </div>

        {/* 右側：今日のひとこと＋ボタン群 */}
        <div className="absolute top-[185px] right-10 space-y-4">
          <div className="relative bg-purple-100/80 backdrop-blur-md rounded-xl p-4 shadow-lg border border-purple-300 w-[250px]">
            <div className="absolute top-4 -left-3 w-0 h-0"
                style={{
                    borderRight: '12px solid #D8B4F8', // 茶色の枠線（パステルブラウン）
                    borderTop: '12px solid transparent',
                    borderBottom: '12px solid transparent'
                }}>
            </div>

          {/* プログレスバー */}
            <div className="mt-4">
              <div className="w-full bg-gray-300 rounded-full h-4">
                <div
                  className="bg-green-500 h-4 rounded-full transition-all duration-500"
                  style={{ width: `${progressPercent}%` }}
                ></div>
              </div>
              <p className="text-sm text-gray-600 mt-1 text-right">
                {pointsInCycle}pt / 10pt
              </p>
            </div>

          </section>


            <h2 className="text-md font-bold text-purple-700 mb-2">💬 今日のひとこと</h2>
            <p className="text-sm">「好きな色はみどり！」</p>
            </div>


            <div className="flex justify-center mt-8">
                <div className="flex flex-row gap-4">
                    <Link>
                        <button className="bg-green-300 hover:bg-green-400 text-white font-bold py-2 px-4 rounded-full shadow">
                            🏠 エノッキーの部屋
                        </button>
                    </Link>
                    <Link>
                        <button className="bg-yellow-300 hover:bg-yellow-400 text-white font-bold py-2 px-4 rounded-full shadow">
                            🛍 ショップ
                        </button>
                    </Link>
                    <Link>
                        <button className="bg-pink-300 hover:bg-pink-400 text-white font-bold py-2 px-4 rounded-full shadow">
                            🎁 ごはんをあげる
                        </button>
                    </Link>
                </div>
            </div>
        </div>
        {/* 下部：グループ情報とタスク管理 */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-10">
          {/* グループ情報 */}
          <div className="bg-blue-100/80 backdrop-blur-md rounded-xl p-6 shadow-lg border border-blue-300">
            <h2 className="text-xl font-bold text-blue-800 mb-4">🌳 グループ情報</h2>
            <p>グループ名：{group.name}</p>
            <p>詳細：{group.description}</p>
            <p>メンバー数：{group.members_count}人</p>
            <p>所持ポイント：{group.points ?? 0}</p>
            <p>育て始めて：{Math.ceil(group.days_since_created)}日目</p>
          </div>

          {/* タスク一覧 */}
          <div className="lg:col-span-2 bg-yellow-100/80 backdrop-blur-md rounded-xl p-6 shadow-lg border border-yellow-300 overflow-auto max-h-[400px]">
            <h2 className="text-xl font-bold text-yellow-800 mb-4">📋 タスク一覧</h2>
            <ul className="space-y-3">
              {tasks.map((task) => (
                <li
                  key={task.id}
                  className={`flex items-center justify-between p-3 rounded-md ${
                    task.is_done ? 'bg-gray-200' : 'bg-lime-100'
                  }`}
                >
                  <div>
                    <p className={`font-semibold ${task.is_done ? 'line-through text-gray-500' : ''}`}>
                      {task.title}
                    </p>
                    <p className="text-sm text-gray-600">{task.memo}</p>
                    <p className="text-sm text-gray-500">期限：{task.due_date}</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={task.is_done}
                    disabled={task.is_done}
                    onChange={() => {
                      if (!task.is_done) {
                        router.patch(route('tasks.complete', { task: task.id }));
                      }
                    }}
                  />
                </li>
              ))}
            </ul>

          </section>

          {/* ボタンたち */}
          <div className="flex flex-wrap gap-4 justify-center">
            <Link href="/food-shop">
              <button className="bg-yellow-300 hover:bg-yellow-400 text-white font-bold py-2 px-4 rounded-full shadow">
                ごはんショップ
              </button>
            </Link>
            <Link href="/feed-enokki">
              <button className="bg-pink-300 hover:bg-pink-400 text-white font-bold py-2 px-4 rounded-full shadow">
                ごはんをあげる
              </button>
            </Link>
            <Link href="/tasks">
              <button className="bg-blue-300 hover:bg-blue-400 text-white font-bold py-2 px-4 rounded-full shadow">
                タスク編集
              </button>
            </Link>
            <Link href="/character/settings">
              <button className="bg-purple-300 hover:bg-purple-400 text-white font-bold py-2 px-4 rounded-full shadow">
                キャラ設定
              </button>
            </Link>

          </div>
        </section>

        {/* キラキラアニメーション用スタイル */}
        <style>
          {`
            .sparkle {
              animation: sparkle 1.5s infinite;
              pointer-events: none;
              position: absolute;
            }
            @keyframes sparkle {
              0% { opacity: 0.2; transform: scale(1); }
              50% { opacity: 1; transform: scale(1.5); }
              100% { opacity: 0.2; transform: scale(1); }
            }
          `}
        </style>
      </div>
    </AuthenticatedLayout>
  );
}
