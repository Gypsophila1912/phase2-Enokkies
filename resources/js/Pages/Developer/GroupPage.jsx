import { Head, Link } from "@inertiajs/react";
import { useState } from "react";
import AuthenticatedLayout from "@/Layouts/AppLayout";

export default function GroupPage({ auth, group, character }) {
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

    // グループポイントの計算（1000ポイント単位）
    const groupPoints = Number(group?.total_points ?? 0);
    const progressPercent = Math.min((groupPoints / 1000) * 100, 100);

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title={`${group.name} - 開発者モード`} />

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
                    <h2 className="text-lg font-bold text-pink-700 mb-2">
                        🌱 あなたのエノッキー情報
                    </h2>
                    <p className="text-md font-semibold">
                        名前：{character?.name ?? "—"}
                    </p>
                    <p>レベル：Lv.{character?.level ?? 0}</p>
                    <p>グループ：{group?.name ?? "—"}</p>
                </div>
                {/* グループポイントメーターとUUID（横並び） */}
                <div className="absolute top-3 left-1/2 transform -translate-x-1/2 flex gap-3 items-start">
                    {/* グループポイントメーター */}
                    <div className="w-[600px] bg-white/80 backdrop-blur-md rounded-xl p-4 shadow-lg border border-green-300">
                        <h2 className="text-sm font-bold text-green-800 mb-2">
                            🍀 グループポイントメーター
                        </h2>
                        <div className="w-full bg-gray-300 rounded-full h-4">
                            <div
                                className="bg-green-500 h-4 rounded-full transition-all duration-500"
                                style={{ width: `${progressPercent}%` }}
                            ></div>
                        </div>
                        <p className="text-sm text-gray-600 mt-1 text-right">
                            1000ポイント分の {groupPoints}pt (
                            {progressPercent.toFixed(1)}%)
                        </p>
                    </div>

                    {/* UUID表示 */}
                    <div className="relative bg-purple-100/80 backdrop-blur-md rounded-xl p-4 shadow-lg border border-purple-300 w-[280px]">
                        <h2 className="text-sm font-bold text-purple-700 mb-2">
                            🔑 UUID
                        </h2>
                        <button
                            onClick={copyToClipboard}
                            className="w-full text-xs font-mono text-gray-700 bg-white hover:bg-gray-50 p-2 rounded-lg border border-purple-200 transition-all duration-200 hover:shadow-md break-all text-left"
                        >
                            <div className="flex items-center justify-between">
                                <span className="flex-1">{group.uuid}</span>
                                <span className="ml-2 text-lg">
                                    {copied ? "✓" : "📋"}
                                </span>
                            </div>
                        </button>
                        {copied && (
                            <p className="text-xs text-green-600 mt-1 text-center font-semibold">
                                コピーしました！
                            </p>
                        )}
                    </div>
                </div>
                {/* エノッキー画像（中央） */}
                <div className="flex justify-center mt-[80px]">
                    <div className="bg-white/80 backdrop-blur-md rounded-xl p-6 shadow-lg border border-green-400">
                        <img
                            src={
                                character?.image_url ||
                                "/images/default-character.png"
                            }
                            alt="エノッキー"
                            className="w-40 h-50 object-cover border-4 border-green-400"
                        />
                    </div>
                </div>
                <div className="absolute top-[320px] right-10 space-y-4 mt-[20px]">
                    <div className="bg-yellow-100/80 backdrop-blur-md rounded-xl p-3 shadow-lg border border-yellow-300 w-auto max-w-[680px] overflow-x-auto">
                        <div className="flex items-center gap-3 px-1">
                            <Link href={route("devadmiring.index")}>
                                <button className="flex-shrink-0 bg-green-300 hover:bg-green-400 text-white font-bold py-2 px-4 rounded-full shadow transition-colors duration-200 whitespace-nowrap">
                                    🏠 エノッキーの部屋
                                </button>
                            </Link>

                            <a
                                href={group.url}
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                <button className="flex-shrink-0 bg-blue-300 hover:bg-blue-400 text-white font-bold py-2 px-4 rounded-full shadow transition-colors duration-200 whitespace-nowrap">
                                    🔗 GitHubリポジトリ
                                </button>
                            </a>

                            <Link href={route("devfoods.shop")}>
                                <button className="flex-shrink-0 bg-yellow-400 hover:bg-yellow-500 text-white font-bold py-2 px-4 rounded-full shadow transition-colors duration-200 whitespace-nowrap">
                                    🛒 ショップ
                                </button>
                            </Link>

                            <Link href={route("character.dressing-room")}>
                                <button className="flex-shrink-0 bg-pink-300 hover:bg-pink-400 text-white font-bold py-2 px-4 rounded-full shadow transition-colors duration-200 whitespace-nowrap">
                                    👕 着替え部屋
                                </button>
                            </Link>
                        </div>
                    </div>
                </div>
                <div className="absolute top-[320px] right-10 space-y-4 mt-[80px]">
                    {/* 下部：グループ情報とメンバーコントリビューション */}
                    <section className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-10 mt-[20px]">
                        {/* グループ情報 */}
                        <div className="bg-blue-100/80 backdrop-blur-md rounded-xl p-6 shadow-lg border border-blue-300">
                            <h2 className="text-xl font-bold text-blue-800 mb-4">
                                🌳 グループ情報
                            </h2>
                            <p>グループ名：{group?.name ?? "—"}</p>
                            <p>
                                リポジトリ：{group?.repository_owner ?? "—"}/
                                {group?.repository_name ?? "—"}
                            </p>
                            <p>
                                メンバー数：
                                {group?.dev_group_users?.length ?? 0}人
                            </p>
                            <p>総ポイント：{groupPoints}pt</p>
                        </div>

                        {/* メンバーコントリビューション一覧 */}
                        <div className="lg:col-span-2 bg-yellow-100/80 backdrop-blur-md rounded-xl p-6 shadow-lg border border-yellow-300 overflow-auto max-h-[400px]">
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-xl font-bold text-yellow-800">
                                    👥 メンバーコントリビューション
                                </h2>
                            </div>

                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-yellow-200">
                                    <thead className="bg-yellow-50">
                                        <tr>
                                            <th className="px-4 py-3 text-left text-xs font-medium text-yellow-700 uppercase">
                                                GitHub アカウント
                                            </th>
                                            <th className="px-4 py-3 text-center text-xs font-medium text-yellow-700 uppercase">
                                                コミット
                                            </th>
                                            <th className="px-4 py-3 text-center text-xs font-medium text-yellow-700 uppercase">
                                                プッシュ
                                            </th>
                                            <th className="px-4 py-3 text-center text-xs font-medium text-yellow-700 uppercase">
                                                マージ
                                            </th>
                                            <th className="px-4 py-3 text-right text-xs font-medium text-yellow-700 uppercase">
                                                合計
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white/90 divide-y divide-yellow-200">
                                        {group.dev_group_users &&
                                        group.dev_group_users.length > 0 ? (
                                            group.dev_group_users.map(
                                                (member) => (
                                                    <tr
                                                        key={member.id}
                                                        className="hover:bg-yellow-50 transition-colors duration-150"
                                                    >
                                                        <td className="px-4 py-3 whitespace-nowrap">
                                                            <div className="text-sm font-medium text-gray-900">
                                                                {
                                                                    member.github_account
                                                                }
                                                            </div>
                                                        </td>
                                                        <td className="px-4 py-3 whitespace-nowrap text-center">
                                                            <div className="text-sm text-gray-900">
                                                                {member
                                                                    .contribution_details
                                                                    ?.commits ||
                                                                    0}
                                                                <span className="text-xs text-gray-500 ml-1">
                                                                    (×1)
                                                                </span>
                                                            </div>
                                                        </td>
                                                        <td className="px-4 py-3 whitespace-nowrap text-center">
                                                            <div className="text-sm text-gray-900">
                                                                {member
                                                                    .contribution_details
                                                                    ?.pushes ||
                                                                    0}
                                                                <span className="text-xs text-gray-500 ml-1">
                                                                    (×5)
                                                                </span>
                                                            </div>
                                                        </td>
                                                        <td className="px-4 py-3 whitespace-nowrap text-center">
                                                            <div className="text-sm text-gray-900">
                                                                {member
                                                                    .contribution_details
                                                                    ?.merges ||
                                                                    0}
                                                                <span className="text-xs text-gray-500 ml-1">
                                                                    (×10)
                                                                </span>
                                                            </div>
                                                        </td>
                                                        <td className="px-4 py-3 whitespace-nowrap text-right">
                                                            <div className="text-sm font-bold text-green-600">
                                                                {
                                                                    member.personal_points
                                                                }{" "}
                                                                pt
                                                            </div>
                                                        </td>
                                                    </tr>
                                                )
                                            )
                                        ) : (
                                            <tr>
                                                <td
                                                    colSpan="5"
                                                    className="px-4 py-3 text-center text-gray-600"
                                                >
                                                    メンバーがいません
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </section>
                </div>
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
