import { Head } from "@inertiajs/react";
import { useState } from "react";

export default function GroupPage({ group }) {
    const [copied, setCopied] = useState(false);

    const copyToClipboard = async () => {
        try {
            await navigator.clipboard.writeText(group.uuid);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error("コピーに失敗しました:", err);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-lime-200 via-green-100 to-green-300 px-4 py-10 font-sans text-gray-800 relative overflow-hidden">
            <Head title={`${group.name} - 開発者モード`} />

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

            <div className="max-w-7xl mx-auto z-10 relative">
                <h1 className="text-3xl font-bold text-green-700 mb-4 text-center">
                    🌿 {group.name}
                </h1>

                {/* UUID表示 */}
                <div className="mb-8 flex justify-center items-center gap-2">
                    <button
                        onClick={copyToClipboard}
                        className="bg-white/80 backdrop-blur-md border border-green-300 rounded-full shadow px-4 py-2 hover:bg-white hover:shadow-lg transition-all duration-300 flex items-center gap-2 group"
                    >
                        <span className="text-xs font-medium text-green-700">
                            UUID:
                        </span>
                        <span className="text-sm font-mono text-gray-600">
                            {group.uuid}
                        </span>
                        <span className="text-green-600 group-hover:scale-110 transition-transform duration-200">
                            {copied ? "✓" : "📋"}
                        </span>
                    </button>
                    {copied && (
                        <div className="bg-green-600 text-white text-xs px-3 py-2 rounded-full shadow-lg animate-fade-in">
                            コピーしました！
                        </div>
                    )}
                </div>

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
                                        <th className="px-6 py-3 text-center text-xs font-medium text-green-700 uppercase tracking-wider">
                                            コミット
                                        </th>
                                        <th className="px-6 py-3 text-center text-xs font-medium text-green-700 uppercase tracking-wider">
                                            プッシュ
                                        </th>
                                        <th className="px-6 py-3 text-center text-xs font-medium text-green-700 uppercase tracking-wider">
                                            マージ
                                        </th>
                                        <th className="px-6 py-3 text-right text-xs font-medium text-green-700 uppercase tracking-wider">
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
                                            <td className="px-6 py-4 whitespace-nowrap text-center">
                                                <div className="text-sm text-gray-900">
                                                    {member.contribution_details
                                                        ?.commits || 0}
                                                    <span className="text-xs text-gray-500 ml-1">
                                                        (×1pt)
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-center">
                                                <div className="text-sm text-gray-900">
                                                    {member.contribution_details
                                                        ?.pushes || 0}
                                                    <span className="text-xs text-gray-500 ml-1">
                                                        (×5pt)
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-center">
                                                <div className="text-sm text-gray-900">
                                                    {member.contribution_details
                                                        ?.merges || 0}
                                                    <span className="text-xs text-gray-500 ml-1">
                                                        (×10pt)
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right">
                                                <div className="text-sm font-bold text-green-600">
                                                    {member.personal_points} pt
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

            <footer className="mt-10 text-sm text-green-800 text-center relative z-10">
                © 2025 Enokkies Team 🌲
            </footer>

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
                    @keyframes fade-in {
                        from { opacity: 0; transform: translateX(-10px); }
                        to { opacity: 1; transform: translateX(0); }
                    }
                    .animate-fade-in {
                        animation: fade-in 0.3s ease-out;
                    }
                `}
            </style>
        </div>
    );
}
