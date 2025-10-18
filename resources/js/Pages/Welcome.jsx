import React from 'react';
import AppLayout from '@/Layouts/AppLayout';
import { Link, usePage, router } from '@inertiajs/react';

export default function Welcome({ canLogin, canRegister, laravelVersion, phpVersion }) {
    const { auth } = usePage().props;

    const handleDeleteAccount = () => {
        const confirmed = confirm(`アカウントを本当に削除しますか？\nアカウント名: ${auth.user.name}`);
        if (confirmed) {
            router.delete(route('account.destroy'));
        }
    };

    return (
        <AppLayout>
            <div className="min-h-screen w-full bg-gradient-to-br from-lime-200 via-green-100 to-green-300 flex flex-col items-center justify-center font-sans text-gray-800 relative overflow-hidden">
                {/* キラキラエフェクト */}
                {[...Array(20)].map((_, i) => (
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
                    <h1 className="text-4xl font-bold text-green-700 mb-6 text-center">エノッキーの森</h1>

                    {auth.user ? (
                        <div className="text-center">
                            <p className="mb-4 text-lg">ログイン中：<span className="font-semibold text-green-800">{auth.user.name}</span></p>

                            <div className="flex flex-col gap-4 items-center">
                                {/* サインアウトボタン */}
                                <Link
                                    href={route('logout')}
                                    method="post"
                                    as="button"
                                    className="bg-red-400 hover:bg-red-500 text-white font-semibold px-6 py-2 rounded-full shadow transition duration-300"
                                >
                                    サインアウト
                                </Link>

                                {/* グループ選択ボタン */}
                                <Link
                                    href={route('groups.select')}
                                    className="bg-green-500 hover:bg-green-600 text-white font-semibold px-6 py-2 rounded-full shadow transition duration-300"
                                >
                                    グループ選択
                                </Link>

                                {/* アカウント削除ボタン */}
                                <button
                                    onClick={handleDeleteAccount}
                                    className="bg-red-600 hover:bg-red-700 text-white font-semibold px-6 py-2 rounded-full shadow transition duration-300"
                                >
                                    アカウント削除
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="text-center">
                            <div className="flex flex-col gap-4 items-center">
                                {canLogin && (
                                    <Link href={route('login')} className="text-green-700 underline hover:text-green-900 text-lg">
                                        ログイン
                                    </Link>
                                )}
                                {canRegister && (
                                    <Link href={route('register')} className="text-lime-600 underline hover:text-lime-800 text-lg">
                                        新規登録
                                    </Link>
                                )}
                            </div>
                        </div>
                    )}

                    <div className="mt-8 text-sm text-gray-600 text-center">
                        Laravel v{laravelVersion} / PHP v{phpVersion}
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
