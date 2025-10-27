import React, { useState, useEffect } from "react";
import { Head } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AppLayout";

export default function DressingRoom({ auth }) {
    const groupId = auth.user.group_id || 1;
    const [selectedImage, setSelectedImage] = useState("/dressings/EnokkieImage.png");
    const [showClothes, setShowClothes] = useState(false);
    const [showBackgrounds, setShowBackgrounds] = useState(false);
    const [selectedBackground, setSelectedBackground] = useState("/dressings/room_background.png");

    // ✅ 最初から服が揃っている（固定データ）
    const clothesOptions = [
        { id: 1, name: "ベーシック", image_path: "/Enokkie/EnokkieImage.png" },
        { id: 2, name: "エンジニア", image_path: "/dressings/en.png" },
        { id: 3, name: "パンプキン", image_path: "/dressings/pumpkin.png" },
        { id: 4, name: "ベイビー", image_path: "/dressings/baby.png" },
        { id: 5, name: "スーパー", image_path: "/dressings/super.png" },
    ];

    const backgroundOptions = [
        "/Room/CoolRoom.png",
        "/Room/Fashionable.png",
        "/Room/kiRoom.png",
        "/Room/EnokkieRoom.png",
    ];

    // ローカルストレージ復元
    useEffect(() => {
        const storedBg = localStorage.getItem("selectedBackground");
        if (storedBg) setSelectedBackground(storedBg);
        const storedImage = localStorage.getItem("selectedImage");
        if (storedImage) setSelectedImage(storedImage);
    }, []);

    // 変更時に保存
    useEffect(() => {
        if (selectedBackground) localStorage.setItem("selectedBackground", selectedBackground);
    }, [selectedBackground]);
    useEffect(() => {
        if (selectedImage) localStorage.setItem("selectedImage", selectedImage);
    }, [selectedImage]);

    // 服選択
    const handleSelectClothes = async (imgPath) => {
        setSelectedImage(imgPath);
        await fetch("/character/update-image", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ group_id: groupId, image_path: imgPath }),
        });
    };

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="お着替えメニュー" />
            <div
                className="min-h-screen w-full flex flex-col items-center justify-center font-sans text-gray-900 relative bg-cover bg-center"
                style={{ backgroundImage: `url(${selectedBackground})` }}
            >
                <div className="absolute inset-0 bg-white bg-opacity-30 pointer-events-none"></div>

                <div className="absolute top-4 left-4 z-20">
                    <button
                        onClick={() => window.history.back()}
                        className="bg-gradient-to-r from-green-400 to-green-600 text-white font-bold py-2 px-4 rounded-full shadow-lg hover:from-green-500 hover:to-green-700 transition-colors"
                    >
                        戻る
                    </button>
                </div>

                <h2 className="fixed top-4 left-1/2 transform -translate-x-1/2 z-20 text-4xl font-extrabold text-green-900 drop-shadow-[0_2px_6px_rgba(0,128,0,0.7)]">
                    🌱 お着替え部屋
                </h2>

                <img
                    src={selectedImage}
                    alt="エノッキー"
                    className="w-60 h-60 object-contain rounded-full border-4 border-green-300 shadow-lg bg-white/80 backdrop-blur-md relative z-10"
                />

                {/* ボタン */}
                <button
                    onClick={() => setShowClothes(!showClothes)}
                    className="mt-6 bg-yellow-400 hover:bg-yellow-500 text-white font-bold py-2 px-6 rounded-full shadow-lg relative z-10"
                >
                    {showClothes ? "服を隠す" : "服を選ぶ"}
                </button>

                <button
                    onClick={() => setShowBackgrounds(!showBackgrounds)}
                    className="mt-4 bg-purple-400 hover:bg-purple-500 text-white font-bold py-2 px-6 rounded-full shadow-lg relative z-10"
                >
                    {showBackgrounds ? "とじる" : "お着替え部屋内装"}
                </button>

                {/* 服リスト */}
                {showClothes && (
                    <div className="mt-6 flex flex-wrap justify-center gap-6 bg-white bg-opacity-90 rounded-xl p-4 shadow-lg border border-white/80 relative z-10">
                        {clothesOptions.map((item) => (
                            <img
                                key={item.id}
                                src={item.image_path}
                                alt={item.name}
                                className={`w-28 h-28 rounded-lg cursor-pointer border-4 transition-transform duration-200 ${
                                    selectedImage === item.image_path
                                        ? "border-emerald-500 scale-105 shadow-[0_0_10px_2px_rgba(16,185,129,0.7)]"
                                        : "border-transparent hover:border-green-400 hover:scale-110"
                                }`}
                                onClick={() => handleSelectClothes(item.image_path)}
                            />
                        ))}
                    </div>
                )}

                {/* 背景リスト */}
                {showBackgrounds && (
                    <div className="mt-6 flex flex-wrap justify-center gap-6 bg-white bg-opacity-90 rounded-xl p-4 shadow-lg border border-white/80 relative z-10">
                        {backgroundOptions.map((path, i) => (
                            <img
                                key={i}
                                src={path}
                                alt={`背景${i + 1}`}
                                className={`w-28 h-28 rounded-lg cursor-pointer border-4 transition-transform duration-200 ${
                                    selectedBackground === path
                                        ? "border-emerald-500 scale-105 shadow-[0_0_10px_2px_rgba(16,185,129,0.7)]"
                                        : "border-transparent hover:border-purple-400 hover:scale-110"
                                }`}
                                onClick={() => setSelectedBackground(path)}
                            />
                        ))}
                    </div>
                )}
            </div>
        </AuthenticatedLayout>
    );
}
