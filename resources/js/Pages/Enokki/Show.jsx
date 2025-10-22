import React from 'react';
import { usePage, Head, Link, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AppLayout';

export default function Show({ auth }) {
  // props のデフォルト値を設定して undefined 回避
  const { group = {}, character = {}, tasks = [] } = usePage().props;

  // group.points が undefined / null / 非数 の場合に備えて安全に計算
  const groupPoints = Number(group?.points ?? 0);
  const pointsInCycle = ((groupPoints % 10) + 10) % 10; // 0-9 の範囲に正規化
  const progressPercent = pointsInCycle * 10; // 0,10,...,90 (%)

  const charCurrent = Number(character?.current_points ?? 0);
  const charPointsInCycle = ((charCurrent % 10) + 10) % 10;
  const charProgressPercent = charPointsInCycle * 10;

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
          <p className="text-md font-semibold">名前：{character?.name ?? '—'}</p>
          <p>レベル：Lv.{character?.level ?? 0}</p>
          <p>次のレベルまで：あと {character?.points_to_next_level ?? 0}pt</p>
        </div>

        {/* 成長メーター（画像の上） */}
        <div className="absolute top-3 left-1/2 transform -translate-x-1/2 w-[600px] bg-white/80 backdrop-blur-md rounded-xl p-4 shadow-lg border border-green-300">
          <h2 className="text-sm font-bold text-green-800 mb-2">🍀 成長メーター</h2>
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
                    borderRight: '12px solid #D8B4F8',
                    borderTop: '12px solid transparent',
                    borderBottom: '12px solid transparent'
                }}>
            </div>

            {/* プログレスバー */}
            

            <h2 className="text-md font-bold text-purple-700 mb-2">💬 今日のひとこと</h2>
            <p className="text-sm">「好きな色はみどり！」</p>
          </div>

          <div className="flex justify-center mt-8">
            <div className="flex flex-row gap-4">
              <Link href="#">
                <button className="bg-green-300 hover:bg-green-400 text-white font-bold py-2 px-4 rounded-full shadow">
                  🏠 エノッキーの部屋
                </button>
              </Link>
              <Link href="#">
                <button className="bg-yellow-300 hover:bg-yellow-400 text-white font-bold py-2 px-4 rounded-full shadow">
                  🛍 ショップ
                </button>
              </Link>
              <Link href="#">
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
            <p>グループ名：{group?.name ?? '—'}</p>
            <p>詳細：{group?.description ?? '—'}</p>
            <p>メンバー数：{group?.members_count ?? 0}人</p>
            <p>所持ポイント：{Number(group?.points ?? 0)}pt</p>
            <p>育て始めて：{Math.ceil(Number(group?.days_since_created ?? 0))}日目</p>
          </div>

          {/* タスク一覧 */}
          <div className="lg:col-span-2 bg-yellow-100/80 backdrop-blur-md rounded-xl p-6 shadow-lg border border-yellow-300 overflow-auto max-h-[400px]">

            <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold text-yellow-800">📋 タスク一覧</h2>
                <Link href="/tasks">
                    <button className="bg-yellow-400 hover:bg-yellow-500 text-white font-bold py-1 px-3 rounded-full shadow">
                    ✏️ タスク編集
                    </button>
                </Link>
            </div>

            <ul className="space-y-3">
              {Array.isArray(tasks) && tasks.length > 0 ? (
                tasks.map((task) => (
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
                      <p className="text-sm text-gray-600">{task.memo ?? task.description}</p>
                      <p className="text-sm text-gray-500">期限：{task.due_date ?? '—'}</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={Boolean(task.is_done)}
                      disabled={Boolean(task.is_done)}
                      onChange={() => {
                        if (!task.is_done) {
                          router.patch(route('tasks.complete', { task: task.id }));
                        }
                      }}
                    />
                  </li>
                ))
              ) : (
                <li className="text-gray-600">タスクがありません。</li>
              )}
            </ul>
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
