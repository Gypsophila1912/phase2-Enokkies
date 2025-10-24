import AuthenticatedLayout from "@/Layouts/AppLayout";
import { Head, router, Link } from "@inertiajs/react";
import { useState } from "react";
import CharacterDisplay from "@/Components/AdmiringRoom/CharacterDisplay";
import ProfilePanel from "@/Components/AdmiringRoom/ProfilePanel";
import ItemInventory from "@/Components/AdmiringRoom/ItemInventory";

export default function EnokkieHome({ groupId, character, items }) {
    const [afe, setafe] = useState(character.affection || 0);
    const [name, setName] = useState(character.name || "エノッキー");

    const handleDropItem = (item) => {
        console.log("=== handleDropItem called ===");
        console.log("Item dropped:", item);
        console.log("Current affection:", afe);

        const newafe = afe + item.points;
        console.log("New affection:", newafe);

        setafe(newafe);

        // routerを使って直接送信
        console.log("Sending PATCH request...");
        console.log("Route:", route("enokkie.update"));
        console.log("Data:", { affection: newafe });

        router.patch(
            route("enokkie.update"),
            { affection: newafe },
            {
                onSuccess: () => {
                    console.log("✅ 親愛度更新成功！新しい値:", newafe);
                    // リダイレクト後にページ遷移
                    router.visit(route("enokkie.show"));
                },
                onError: (errors) => {
                    console.error("❌ 親愛度更新エラー:", errors);
                    // エラー時は元の値に戻す
                    setafe(afe);
                    alert("親愛度の更新に失敗しました");
                },
            }
        );
    };

    const handleNameUpdate = (newName) => {
        setName(newName);

        router.patch(
            route("enokkie.updateName", { groupId: groupId }),
            { name: newName },
            {
                preserveScroll: true,
                onSuccess: () => {
                    console.log("名前更新成功！");
                },
                onError: (errors) => {
                    console.error("名前更新エラー:", errors);
                    alert("名前の更新に失敗しました");
                    setName(character.name);
                },
            }
        );
    };

    return (
        <AuthenticatedLayout>
            <Head title="エノッキーの部屋" />
            <Link
                href={route("enokki.show")}
                className="bg-green-400 hover:bg-green-500 text-white font-bold py-2 px-4 rounded-full shadow mb-4 inline-block"
            >
                ← メイン画面に戻る
            </Link>
            <div className="flex-1 overflow-hidden bg-gradient-to-br from-lime-200 via-green-100 to-green-300 px-4 py-4 font-sans text-gray-800 relative">
                <h1 className="text-3xl font-bold text-green-700 text-center mb-8">
                    🌿 エノッキーのお部屋
                </h1>
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 p-6">
                        <div className="lg:col-span-1">
                            <div className="bg-white/80 backdrop-blur-sm border border-green-300 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow duration-200">
                                <h3 className="font-semibold text-lg mb-3 text-green-700">
                                    💬 コメント
                                </h3>
                                <p className="text-gray-600">準備中...</p>
                            </div>
                        </div>

                        <div className="lg:col-span-2 flex flex-col items-center relative">
                            <CharacterDisplay
                                onDropItem={handleDropItem}
                                character={character}
                                level={character.level}
                            />

                            <div className="fixed bottom-0 left-0 right-0 z-50">
                                <ItemInventory items={items} />
                            </div>
                        </div>

                        <div className="lg:col-span-1">
                            <ProfilePanel
                                chrname={name}
                                affection={afe}
                                level={character.level}
                                exp={character.experience}
                                onNameUpdate={handleNameUpdate}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
