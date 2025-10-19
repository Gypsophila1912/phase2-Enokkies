import AuthenticatedLayout from "@/Layouts/AppLayout";
import { Head, router, useForm } from "@inertiajs/react";
import { useState } from "react";
import CharacterDisplay from "@/Components/AdmiringRoom/CharacterDisplay";
import ProfilePanel from "@/Components/AdmiringRoom/ProfilePanel";
import ItemInventory from "@/Components/AdmiringRoom/ItemInventory";

export default function EnokkieHome({ groupId, character, items = [] }) {
    const [exp, setExp] = useState(character.experience || 0);
    const [name, setName] = useState(character.name || "エノッキー");

    const { patch } = useForm();

    const handleDropItem = (item) => {
        const newExp = exp + item.points;
        setExp(newExp);

        // サーバーに経験値加算を送る
        patch(route("enokkie.update", { groupId: groupId }), {
            preserveScroll: true,
            onSuccess: () => console.log("経験値更新！"),
        });
    };

    const handleNameUpdate = (newName) => {
        setName(newName);

        // サーバーに名前を保存
        router.patch(
            route("enokkie.updateName", { groupId: groupId }),
            { name: newName }, // ← dataで包まない
            {
                preserveScroll: true,
                onSuccess: () => {
                    console.log("名前更新成功！");
                },
                onError: (errors) => {
                    console.error("名前更新エラー:", errors);
                    alert("名前の更新に失敗しました");
                },
            }
        );
    };

    return (
        <AuthenticatedLayout>
            <Head title="エノッキーの部屋" />
            <div className="flex-1 overflow-hidden bg-gradient-to-br from-lime-200 via-green-100 to-green-300 px-4 py-4 font-sans text-gray-800 relative">
                {" "}
                <h1 className="text-3xl font-bold text-green-700 text-center mb-8">
                    🌿 エノッキーのお部屋
                </h1>
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 p-6">
                        {/* 左側（コメントスペース） */}
                        <div className="lg:col-span-1">
                            <div className="bg-white/80 backdrop-blur-sm border border-green-300 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow duration-200">
                                <h3 className="font-semibold text-lg mb-3 text-green-700">
                                    💬 コメント
                                </h3>
                                <p className="text-gray-600">準備中...</p>
                            </div>
                        </div>

                        {/* 中央（エノッキー） */}
                        <div className="lg:col-span-2 flex flex-col items-center relative">
                            <CharacterDisplay
                                onDropItem={handleDropItem}
                                level={Math.floor(exp / 100) + 1}
                            />

                            {/* インベントリ固定 */}
                            <div className="fixed bottom-0 left-0 right-0 z-50 ">
                                <ItemInventory items={items} />
                            </div>
                        </div>

                        {/* 右側（情報パネル） */}
                        <div className="lg:col-span-1">
                            <ProfilePanel
                                chrname={name}
                                exp={exp}
                                level={Math.floor(exp / 100) + 1}
                                onNameUpdate={handleNameUpdate}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
