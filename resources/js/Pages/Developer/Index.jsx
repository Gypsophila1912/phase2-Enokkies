import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link } from "@inertiajs/react";
import { useState } from "react";
import GroupModal from "@/Components/DeveloperMode/GroupModal";

export default function Index({ devGroups }) {
    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    DeveloperMode
                </h2>
            }
        >
            <Head title="DeveloperMode" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            {devGroups && devGroups.length > 0 ? (
                                <div className="mt-6">
                                    <div className="flex justify-between items-center mb-4">
                                        <h3 className="text-lg font-semibold">
                                            参加中のグループ
                                        </h3>
                                        <button
                                            onClick={() => setIsModalOpen(true)}
                                            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
                                        >
                                            新しいグループに参加・作成
                                        </button>
                                    </div>
                                    <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                                        {devGroups.map((group) => (
                                            <div
                                                key={group.id}
                                                className="p-4 border rounded-lg shadow-sm hover:shadow-md transition relative min-h-[200px] flex flex-col"
                                            >
                                                {/* カードのメイン情報 */}
                                                <div className="flex-grow">
                                                    <h4 className="font-bold text-lg mb-2">
                                                        {group.name}
                                                    </h4>
                                                    <p className="text-sm text-gray-600 mb-2">
                                                        ポイント:{" "}
                                                        {group.total_points}
                                                    </p>
                                                </div>

                                                {/* リンク部分 - 下部に固定 */}
                                                <div className="mt-auto pt-4 flex justify-end items-center space-x-4">
                                                    <a
                                                        href={group.url}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
                                                    >
                                                        リポジトリを見る →
                                                    </a>
                                                    <Link
                                                        href={route(
                                                            "developer.show",
                                                            { id: group.id }
                                                        )}
                                                        className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
                                                    >
                                                        グループへ →
                                                    </Link>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ) : null}
                        </div>
                    </div>
                </div>
            </div>

            <GroupModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
            />
        </AuthenticatedLayout>
    );
}
