import React from 'react';
import AppLayout from '@/Layouts/AppLayout';
import { Link, usePage, router } from '@inertiajs/react';

export default function GroupSelect() {
    const { groups } = usePage().props;

    const handleDelete = (group) => {
        if (group.users_count > 1) {
            if (confirm('このグループには他のユーザーが所属しています。本当に削除しますか？')) {
                if (confirm('⚠️ 強制的に削除しますか？')) {
                    router.delete(`/groups/${group.id}`);
                }
            }
        } else {
            if (confirm('本当に削除しますか？')) {
                router.delete(`/groups/${group.id}`);
            }
        }
    };

    const handleJoin = (groupId) => {
        router.post('/groups/join', { group_id: groupId });
    };

    return (
        <AppLayout>
            <div className="min-h-screen bg-gradient-to-br from-lime-200 via-green-100 to-green-300 px-4 py-10 font-sans text-gray-800 relative overflow-hidden">

                {/* キラキラエフェクト（上部に限定） */}
                {[...Array(15)].map((_, i) => (
                    <div
                        key={i}
                        className="absolute sparkle"
                        style={{
                            top: `${Math.random() * 70}%`,
                            left: `${Math.random() * 100}%`,
                            animationDelay: `${Math.random() * 2}s`,
                        }}
                    >
                        ✨
                    </div>
                ))}

                <div className="max-w-7xl mx-auto z-10">
                    <h1 className="text-3xl font-bold text-green-700 mb-8 text-center">🌿 グループを選択</h1>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {groups.map(group => (
                            <div key={group.id} className="bg-white/80 backdrop-blur-md border border-green-300 rounded-xl shadow-lg p-6">
                                <h2 className="text-xl font-semibold text-green-800 mb-2">{group.name}</h2>
                                <p className="text-gray-700 mb-2">{group.description ?? '（説明はまだありません）'}</p>
                                <p className="text-sm text-gray-600 mb-4">参加者数: {group.users_count}</p>

                                <div className="flex flex-col gap-2">
                                    <Link
                                        href={route('groups.show', group.id)}
                                        className="bg-lime-400 hover:bg-lime-500 text-white font-semibold px-4 py-2 rounded-full shadow transition duration-300 text-center"
                                    >
                                        詳細を見る
                                    </Link>
                                    
                                    <button
                                        onClick={() => handleDelete(group)}
                                        className="bg-red-500 hover:bg-red-600 text-white font-semibold px-4 py-2 rounded-full shadow transition duration-300"
                                    >
                                        削除
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="mt-10 text-center z-20 relative">
                        <Link
                            href={route('groups.create')}
                            className="bg-green-500 hover:bg-green-600 text-white font-semibold px-6 py-3 rounded-full shadow transition duration-300"
                        >
                            新しいグループを作成する
                        </Link>
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
