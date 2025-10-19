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

      <div className="min-h-screen bg-gradient-to-br from-lime-200 via-green-100 to-green-300 px-4 py-10 font-sans text-gray-800 relative overflow-hidden">
        {/* キラキラエフェクト */}
        {[...Array(15)].map((_, i) => (
          <div
            key={i}
            className="absolute sparkle"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 2}s`,
            }}
          >
            ✨
          </div>
        ))}

        <div className="max-w-5xl mx-auto space-y-8 z-10 relative">
          {/* エノッキー情報 */}
          <section className="bg-white/80 backdrop-blur-md rounded-xl p-6 shadow-lg">
            <h2 className="text-2xl font-bold text-green-800 mb-4">🌱 エノッキー育成</h2>
            <div className="flex items-center space-x-6">
              <img src="images/EnokkieImage.png" alt="エノッキー" className="w-24 h-24 rounded-full border-4 border-green-400" />
              <div>
                <p className="text-lg font-semibold">名前：{character.name}</p>
                <p>レベル：Lv.{character.level}</p>
                <p>次のレベルまで：あと {character.points_to_next_level}pt</p>
              </div>
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

          {/* グループ情報 */}
          <section className="bg-white/80 backdrop-blur-md rounded-xl p-6 shadow-lg">
            <h2 className="text-xl font-bold text-green-800 mb-4">🌳 グループ情報</h2>
            <p>グループ名：{group.name}</p>
            <p>詳細：{group.description}</p>
            <p>メンバー数：{group.members_count}人</p>
            <p>所持ポイント：{group.points}</p>
            <p>育て始めて：{group.days_since_created}日目</p>
          </section>

          {/* タスク一覧 */}
          <section className="bg-white/80 backdrop-blur-md rounded-xl p-6 shadow-lg">
            <h2 className="text-xl font-bold text-green-800 mb-4">📋 タスク一覧</h2>
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
        </div>

        {/* キラキラアニメーション用スタイル */}
        <style>
          {`
            .sparkle {
              font-size: 1.2rem;
              animation: sparkle 1.5s infinite;
              pointer-events: none;
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
