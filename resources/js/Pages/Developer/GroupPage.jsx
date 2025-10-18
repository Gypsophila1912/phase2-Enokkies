import AppLayout from "@/Layouts/AppLayout";
import { Head } from "@inertiajs/react";

export default function GroupPage({ group }) {
    return (
        <AppLayout>
            <div className="min-h-screen bg-gradient-to-br from-lime-200 via-green-100 to-green-300 px-4 py-10 font-sans text-gray-800 relative overflow-hidden">
                {/* キラキラエフェクト */}
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
                    <Head title={`${group.name} - 開発者モード`} />

                    <h1 className="text-3xl font-bold text-green-700 mb-8 text-center">
                        🌿 {group.name}
                    </h1>

                    {/* チーム全体のポイント表示 */}
                    <div className="mb-8 bg-white/80 backdrop-blur-md border border-green-300 rounded-xl shadow-lg p-8 text-center">
                        <h3 className="text-xl font-semibold text-green-800">
                            チーム総獲得ポイント
                        </h3>
                        <p className="text-5xl font-bold text-green-600 mt-4">
                            {group.total_points} pt
                        </p>
                    </div>

                    {/* グループ情報 */}
                    <div className="bg-white/80 backdrop-blur-md border border-green-300 rounded-xl shadow-lg p-6 mb-6">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-xl font-semibold text-green-800">
                                グループ情報
                            </h3>
                            <a
                                href={group.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="bg-lime-400 hover:bg-lime-500 text-white font-semibold px-4 py-2 rounded-full shadow transition duration-300"
                            >
                                GitHubリポジトリを見る →
                            </a>
                        </div>

                        {/* メンバー一覧 */}
                        <div className="mt-6">
                            <h3 className="text-xl font-semibold text-green-800 mb-4">
                                メンバー一覧
                            </h3>
                            <div className="overflow-x-auto rounded-xl border border-green-200">
                                <table className="min-w-full divide-y divide-green-200">
                                    <thead className="bg-green-50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-green-700 uppercase tracking-wider">
                                                GitHub アカウント
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-green-700 uppercase tracking-wider">
                                                獲得ポイント
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white/90 divide-y divide-green-200">
                                        {group.dev_group_users.map((member) => (
                                            <tr
                                                key={member.id}
                                                className="hover:bg-green-50 transition-colors duration-150"
                                            >
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm font-medium text-gray-900">
                                                        {member.github_account}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm text-gray-900">
                                                        {member.personal_points}{" "}
                                                        pt
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
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
