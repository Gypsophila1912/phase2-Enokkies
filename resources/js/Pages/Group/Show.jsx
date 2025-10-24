// resources/js/Pages/Group/Show.jsx

import React from 'react';
import { usePage, router } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';

export default function Show() {
    const { group, users, selectedDressing } = usePage().props;

    // キャラクター画像パス
    const characterImage = selectedDressing && selectedDressing.image_path
        ? selectedDressing.image_path
        : "/images/EnokkieImage.png";

    const joinGroup = (groupId) => {
      router.post(route('groups.join', { id: groupId }));
    };

    return (
        <AppLayout>
            <div className="min-h-screen bg-gradient-to-br from-lime-200 via-green-100 to-green-300 flex flex-col items-center justify-center font-sans text-gray-800 relative overflow-hidden px-4 py-10">
                {/* キャラクターアイコン表示 */}
                <div className="flex justify-center mb-6">
                    <img
                        src={characterImage}
                        alt="エノッキー"
                        className="w-40 h-40 object-contain rounded-full border-4 border-green-300 shadow-lg bg-white/80 backdrop-blur-md"
                    />
                </div>

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

                <div className="w-full max-w-2xl bg-white/80 backdrop-blur-md rounded-xl shadow-xl p-8 border border-green-300 z-10">
                    <h1 className="text-3xl font-bold text-green-700 mb-6 text-center">🌱 グループ詳細</h1>

                    <div className="bg-green-50 p-4 rounded-lg shadow mb-6">
                        <p className="mb-2"><strong>グループ名:</strong> {group.name}</p>
                        <p><strong>説明:</strong> {group.description ?? '（説明はまだありません）'}</p>
                        <p><strong>グループポイント:</strong> {group.points ?? 0} pt</p>
                    </div>

                    <h2 className="text-xl font-semibold text-green-600 mb-4">👥 メンバー一覧</h2>
                    <ul className="list-none mb-6">
                        {users.map(user => (
                            <li key={user.id} className="py-2 border-b border-gray-200">
                                👤 {user.name}
                            </li>
                        ))}
                    </ul>

                    {/* グループ参加ボタン */}
                    <div className="text-center">
                        <button
                            onClick={() => joinGroup(group.id)}
                            className="bg-green-500 hover:bg-green-600 text-white font-semibold px-6 py-2 rounded-full shadow transition duration-300"
                        >
                            このグループに参加する
                        </button>
                    </div>
                </div>

                <footer className="mt-10 text-sm text-green-800 text-center z-10">
                    © 2025 Enokkies Team 🌲
                </footer>

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
        </AppLayout>
    );
}
