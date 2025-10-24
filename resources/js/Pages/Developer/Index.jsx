import AuthenticatedLayout from "@/Layouts/AppLayout";
import { Head, Link } from "@inertiajs/react";
import { useState } from "react";
import GroupModal from "@/Components/DeveloperMode/GroupModal";

export default function Index({ devGroups }) {
    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        <AuthenticatedLayout>
            <Head title="開発者モード" />
            <div className="bg-gradient-to-br from-lime-200 via-green-100 to-green-300 px-4 py-10 font-sans text-gray-800 relative overflow-hidden">
                {/* キラキラエフェクト（上部に限定） */}
                {[...Array(15)].map((_, i) => (
                    <div
                        key={i}
                        className="absolute sparkle"
                        style={{
                            top: `${Math.random() * 70}%`, // ← 下部に出ないように調整
                            left: `${Math.random() * 100}%`,
                            animationDelay: `${Math.random() * 2}s`,
                        }}
                    >
                        ✨
                    </div>
                ))}
                <h1 className="text-3xl font-bold text-green-700 text-center">
                    🌿 グループを選択
                </h1>
                <div className="py-12">
                    <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                        {/* グループ一覧 */}
                        <div className="p-6">
                            <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                                {devGroups &&
                                    devGroups.map((group) => (
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
                                                <div className="flex justify-between items-center">
                                                    <a
                                                        href={group.url}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="text-blue-600 hover:text-blue-800 transition-colors duration-200"
                                                    >
                                                        GitHub →
                                                    </a>
                                                    <Link
                                                        href={route(
                                                            "developer.show",
                                                            { id: group.id }
                                                        )}
                                                        className="bg-lime-400 hover:bg-lime-500 text-white font-semibold px-4 py-2 rounded-full shadow transition duration-300 text-center"
                                                    >
                                                        詳細を見る
                                                    </Link>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                            </div>
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
