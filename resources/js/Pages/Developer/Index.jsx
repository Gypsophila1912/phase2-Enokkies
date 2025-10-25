import AuthenticatedLayout from "@/Layouts/AppLayout";
import { Head, Link, router } from "@inertiajs/react";
import { useState } from "react";
import GroupModal from "@/Components/DeveloperMode/GroupModal";

export default function Index({ devGroups }) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [leavingGroupId, setLeavingGroupId] = useState(null);
    const handleLeave = (groupId, groupName) => {
        if (
            confirm(
                `本当に「${groupName}」から退会しますか？\n\n※最後のメンバーの場合、グループとキャラクターも削除されます。`
            )
        ) {
            router.delete(route("developer.leave", { id: groupId }), {
                preserveScroll: true,
                onStart: () => setLeavingGroupId(groupId),
                onFinish: () => setLeavingGroupId(null),
            });
        }
    };

    return (
        <AuthenticatedLayout>
            <Head title="開発者モード" />
            <div className="bg-gradient-to-br from-lime-200 via-green-100 to-green-300 px-4 py-10 font-sans text-gray-800 relative overflow-hidden min-h-screen">
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

                <h1 className="text-3xl font-bold text-green-700 text-center mb-8">
                    🌿 グループを選択
                </h1>

                <div className="py-12">
                    <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                        {/* グループ一覧 */}
                        <div className="p-6">
                            {devGroups && devGroups.length > 0 ? (
                                <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                                    {devGroups.map((group) => (
                                        <div
                                            key={group.id}
                                            className="bg-white border border-green-300 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200"
                                        >
                                            <div className="p-5">
                                                <h4 className="text-xl font-semibold mb-2">
                                                    {group.name}
                                                </h4>
                                                <p className="text-gray-600 mb-4">
                                                    合計ポイント:{" "}
                                                    {group.total_points}
                                                </p>
                                                <div className="flex justify-between items-center mb-3">
                                                    <a
                                                        href={group.url}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="text-blue-600 hover:text-blue-800 transition-colors duration-200"
                                                    >
                                                        GitHub →
                                                    </a>
                                                    <button
                                                        onClick={() =>
                                                            handleLeave(
                                                                group.id,
                                                                group.name
                                                            )
                                                        }
                                                        disabled={
                                                            leavingGroupId ===
                                                            group.id
                                                        }
                                                        className="bg-red-400 hover:bg-red-500 disabled:bg-gray-300 text-white font-semibold px-4 py-2 rounded-full shadow transition duration-300 text-center"
                                                    >
                                                        {leavingGroupId ===
                                                        group.id
                                                            ? "退会中..."
                                                            : "退会する"}
                                                    </button>
                                                </div>
                                                <Link
                                                    href={route(
                                                        "developer.show",
                                                        { id: group.id }
                                                    )}
                                                    className="block w-full bg-lime-400 hover:bg-lime-500 text-white font-semibold px-4 py-2 rounded-full shadow transition duration-300 text-center"
                                                >
                                                    詳細を見る
                                                </Link>
                                            </div>
                                        </div>
                                    ))}{" "}
                                </div>
                            ) : (
                                <div className="text-center py-12">
                                    <p className="text-gray-600 text-lg mb-4">
                                        まだグループに参加していません
                                    </p>
                                    <p className="text-gray-500 text-sm">
                                        下のボタンから新しいグループに参加または作成してください
                                    </p>
                                </div>
                            )}

                            <div className="mt-10 text-center z-20 relative">
                                <button
                                    onClick={() => setIsModalOpen(true)}
                                    className="bg-green-500 hover:bg-green-600 text-white font-semibold px-6 py-3 rounded-full shadow transition duration-300"
                                >
                                    <span className="mr-2">+</span>
                                    新しいグループに参加・作成
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
                </div>

                <GroupModal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                />
            </div>
        </AuthenticatedLayout>
    );
}
