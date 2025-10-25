import AuthenticatedLayout from "@/Layouts/AppLayout";
import { Head, router, Link } from "@inertiajs/react";
import { useState } from "react";
import axios from "axios"; // ← 追加
import CharacterDisplay from "@/Components/DeveloperMode/AdmiringRoom/CharacterDisplay";
import ProfilePanel from "@/Components/DeveloperMode/AdmiringRoom/ProfilePanel";
import ItemInventory from "@/Components/DeveloperMode/AdmiringRoom/ItemInventory";

export default function EnokkieHome({
    groupId,
    character,
    items: initialItems,
}) {
    const [afe, setafe] = useState(character.affection || 0);
    const [name, setName] = useState(character.name || "エノッキー");
    const [items, setItems] = useState(initialItems);

    // アイテム使用時に呼ぶ関数（個数を更新）
    const handleItemUsed = (itemId, newQuantity) => {
        setItems((prev) =>
            prev
                .map((item) =>
                    item.id === itemId
                        ? { ...item, quantity: newQuantity }
                        : item
                )
                .filter((item) => item.quantity > 0)
        );
    };

    const handleNameUpdate = (newName) => {
        setName(newName);

        router.patch(
            route("devenokkie.updateName", { groupId: groupId }),
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

    // ドラッグ&ドロップでアイテムを使用
    const handleDropItem = async (item) => {
        console.log("=== handleDropItem called ===", item);

        const newafe = afe + item.points;
        setafe(newafe);

        // 親愛度更新
        router.patch(
            route("devadmiring.update"),
            { affection: newafe },
            {
                preserveScroll: true,
                onSuccess: () => console.log("✅ 親愛度更新成功！", newafe),
                onError: () => setafe(afe),
            }
        );

        // アイテム使用API呼び出し
        try {
            const response = await axios.patch("/devgroup-foods/useItem", {
                id: item.id,
            });
            handleItemUsed(item.id, response.data.quantity);
        } catch (error) {
            console.error("アイテム使用エラー:", error);
            alert("アイテムの使用に失敗しました");
        }
    };

    // クリックでアイテムを使用（ItemInventoryから呼ばれる）
    const handleClickUseItem = async (itemId) => {
        const item = items.find((i) => i.id === itemId);
        if (!item) return;

        const newafe = afe + item.points;
        setafe(newafe);

        // 親愛度更新
        router.patch(
            route("admiring.update"),
            { affection: newafe },
            {
                preserveScroll: true,
                onSuccess: () => console.log("✅ 親愛度更新成功！", newafe),
                onError: () => setafe(afe),
            }
        );

        // アイテム使用API呼び出し
        try {
            const response = await axios.patch("/group-foods/useItem", {
                id: itemId,
            });
            handleItemUsed(itemId, response.data.quantity);
        } catch (error) {
            console.error("アイテム使用エラー:", error);
            alert("アイテムの使用に失敗しました");
        }
    };

    return (
        <AuthenticatedLayout>
            <Head title="エノッキーの部屋" />
            <Link
                href={route("developer.show", { id: groupId })}
                className="bg-green-400 hover:bg-green-500 text-white font-bold py-2 px-4 rounded-full shadow mb-4 inline-block"
            >
                ← 開発者画面に戻る
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
                                <ItemInventory
                                    items={items}
                                    onItemUsed={handleClickUseItem}
                                />
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
