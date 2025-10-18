import React from 'react';
import { Link, usePage } from '@inertiajs/react';

export default function AppLayout({ children }) {
    const { auth } = usePage().props;

    return (
        <div className="min-h-screen bg-gradient-to-br from-lime-100 via-green-50 to-green-200 font-sans text-gray-800">
            {/* ナビゲーションバー */}
            <nav className="bg-lime-100 shadow-md fixed top-0 left-0 right-0 z-50 border-b border-green-300">
                <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
                    {/* 左側のタブ */}
                        <div className="flex space-x-4">
                            <Link href="/" className="tab-button">
                                トップ
                            </Link>
                            <Link href="/group-select" className="tab-button">
                                グループ選択
                            </Link>
                            <Link href="/group-create" className="tab-button">
                                グループ作成
                            </Link>
                        </div>
    
                        {/* ログイン情報 */}
                        {auth.user ? (
                            <div className="text-sm text-green-800 font-semibold">
                                ログイン中：{auth.user.name}
                            </div>
                        ) : (
                            <div>
                                <Link href="/login" className="tab-button">
                                    ログイン
                                </Link>
                            </div>
                        )}
                </div>
            </nav>

            {/* ページの中身 */}
            <main className="max-w-7xl mx-auto px-4 pt-24">
                {children}
            </main>

            {/* タブ用スタイル */}
            <style>
                {`
                    .tab-button {
                        background-color: #d9f99d; /* 薄い黄緑 */
                        color: #065f46;
                        padding: 0.5rem 1rem;
                        border-radius: 9999px;
                        font-weight: 600;
                        box-shadow: 0 2px 4px rgba(0,0,0,0.1);
                        transition: all 0.3s ease;
                        text-decoration: none;
                        border: 1px solid #bbf7d0;
                    }

                    .tab-button:hover {
                        background-color: #bef264; /* 少し濃い黄緑 */
                        transform: scale(1.05);
                        color: #064e3b;
                        box-shadow: 0 4px 6px rgba(0,0,0,0.15);
                    }

                    .tab-highlight {
                        background-color: #bbf7d0;
                        border: 2px solid #4ade80;
                    }
                `}
            </style>
        </div>
    );
}
