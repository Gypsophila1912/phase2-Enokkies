import React, { useState, useEffect } from "react";
import { Head } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AppLayout";

export default function DressingRoom({ auth }) {
    // group_idの取得方法は適宜修正（例: auth.user.group_id など）
    const groupId = auth.user.group_id || 1;
    const [selectedImage, setSelectedImage] = useState("/images/EnokkieImage.png");
    const [showClothes, setShowClothes] = useState(false);
    const [showBackgrounds, setShowBackgrounds] = useState(false);
    const [selectedBackground, setSelectedBackground] = useState("/images/room_background.png");
    const [clothesOptions, setClothesOptions] = useState([]);
    const [loadingClothes, setLoadingClothes] = useState(false);

    // Load background and selected image from localStorage on mount
    useEffect(() => {
        const storedBg = localStorage.getItem("selectedBackground");
        if (storedBg) {
            setSelectedBackground(storedBg);
        }
        const storedImage = localStorage.getItem("selectedImage");
        if (storedImage) {
            setSelectedImage(storedImage);
        }
    }, []);

    // Store background in localStorage when it changes
    useEffect(() => {
        if (selectedBackground) {
            localStorage.setItem("selectedBackground", selectedBackground);
        }
    }, [selectedBackground]);

    // Store selected image in localStorage when it changes
    useEffect(() => {
        if (selectedImage) {
            localStorage.setItem("selectedImage", selectedImage);
        }
    }, [selectedImage]);

    // グループの選択中の服を取得
    const fetchSelectedDressing = async () => {
        try {
            const res = await fetch(`/api/group/selected-dressing?group_id=${groupId}`);
            if (res.ok) {
                const data = await res.json();
                if (data.selected_dressing && data.selected_dressing.image_path) {
                    setSelectedImage(data.selected_dressing.image_path);
                } else {
                    setSelectedImage("/images/EnokkieImage.png");
                }
            }
        } catch (e) {
            setSelectedImage("/images/EnokkieImage.png");
        }
    };

    // 初回マウント時に選択中の服を取得
    useEffect(() => {
        fetchSelectedDressing();
    }, []);

    // 服を選択したときにグループの服を更新
    const handleSelectClothes = async (imgPath, dressingId) => {
        setSelectedImage(imgPath);
        await fetch("/api/group/select-dressing", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ group_id: groupId, dressing_id: dressingId }),
        });
    };

    // 服リスト取得関数
    const fetchClothes = async () => {
        setLoadingClothes(true);
        try {
            const res = await fetch(`/api/shop/group-dressings?group_id=${groupId}`);
            if (res.ok) {
                const data = await res.json();
                setClothesOptions(data.dressings || []);
            }
        } catch (e) {
            setClothesOptions([]);
        }
        setLoadingClothes(false);
    };

    // 初回マウント時にも取得
    useEffect(() => {
        fetchClothes();
    }, []);

    // 服を選ぶボタン押下時に再取得
    const handleShowClothes = () => {
        if (!showClothes) {
            fetchClothes();
        }
        setShowClothes(!showClothes);
    };

    const backgroundOptions = [
        "/Room/CoolRoom.png",
        "/Room/Fashionable.png",
        "/Room/kiRoom.png",
        "/Room/EnokkieRoom.png",
    ];

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="お着替えメニュー" />

            <div className={`min-h-screen w-full flex flex-col items-center justify-center font-sans text-gray-900 relative bg-cover bg-center`} style={{backgroundImage: `url(${selectedBackground})`}}>
                {/* 白い透明レイヤー */}
                <div className="absolute inset-0 bg-white bg-opacity-30 pointer-events-none"></div>

                {/* 戻るボタン */}
                <div className="absolute top-4 left-4 z-20">
                    <button
                        onClick={() => window.history.back()}
                        className="bg-gradient-to-r from-green-400 to-green-600 hover:from-green-500 hover:to-green-700 text-white font-bold py-2 px-4 rounded-full shadow-lg transition-colors duration-300"
                    >
                        戻る
                    </button>
                </div>

                {/* タイトル */}
                <h2 className="fixed top-4 left-1/2 transform -translate-x-1/2 z-20 text-4xl font-extrabold text-green-900 drop-shadow-[0_2px_6px_rgba(0,128,0,0.7)]">
                    🌱 お着替え部屋
                </h2>

                {/* エノッキー画像 */}
                <img
                    src={selectedImage}
                    alt="エノッキー"
                    className="w-60 h-60 object-contain rounded-full border-4 border-green-300 shadow-lg bg-white/80 backdrop-blur-md relative z-10"
                />

                {/* 服選択ボタン */}
                <button
                    onClick={handleShowClothes}
                    className="mt-6 bg-yellow-400 hover:bg-yellow-500 text-white font-bold py-2 px-6 rounded-full shadow-lg relative z-10"
                >
                    {showClothes ? "服を隠す" : "服を選ぶ"}
                </button>

                {/* 背景選択ボタン */}
                <button
                    onClick={() => setShowBackgrounds(!showBackgrounds)}
                    className="mt-4 bg-purple-400 hover:bg-purple-500 text-white font-bold py-2 px-6 rounded-full shadow-lg relative z-10"
                >
                    {showBackgrounds ? "とじる" : "お着替え部屋内装"}
                </button>

                {/* 服アイコン一覧 */}
                {showClothes && (
                    <div className="mt-6 flex flex-wrap justify-center gap-6 bg-white bg-opacity-90 backdrop-blur-sm rounded-xl p-4 shadow-lg border border-white/80 relative z-10">
                        {loadingClothes ? (
                            <div>読み込み中...</div>
                        ) : clothesOptions.length === 0 ? (
                            <div className="text-lg text-gray-600 font-bold">洋服を持ってないよ！</div>
                        ) : (
                            clothesOptions.map((item) => (
                                <img
                                    key={item.id || item.dressing_id}
                                    src={item.image_path || item.path}
                                    alt={item.name}
                                    className={`w-28 h-28 rounded-lg cursor-pointer border-4 transition-transform duration-200 ${
                                        selectedImage === (item.image_path || item.path)
                                            ? "border-emerald-500 scale-105 shadow-[0_0_10px_2px_rgba(16,185,129,0.7)]"
                                            : "border-transparent hover:border-green-400 hover:scale-110"
                                    }`}
                                    onClick={() => handleSelectClothes(item.image_path || item.path, item.id || item.dressing_id)}
                                    style={selectedImage === (item.image_path || item.path) ? {filter: "drop-shadow(0 0 6px rgba(16,185,129,0.8))"} : {}}
                                />
                            ))
                        )}
                    </div>
                )}

                {/* 背景アイコン一覧 */}
                {showBackgrounds && (
                    <div className="mt-6 flex flex-wrap justify-center gap-6 bg-white bg-opacity-90 backdrop-blur-sm rounded-xl p-4 shadow-lg border border-white/80 relative z-10">
                        {backgroundOptions.map((path, index) => (
                            <img
                                key={index}
                                src={path}
                                alt={`背景${index + 1}`}
                                className={`w-28 h-28 rounded-lg cursor-pointer border-4 transition-transform duration-200 ${
                                    selectedBackground === path
                                        ? "border-emerald-500 scale-105 shadow-[0_0_10px_2px_rgba(16,185,129,0.7)]"
                                        : "border-transparent hover:border-purple-400 hover:scale-110"
                                }`}
                                onClick={() => setSelectedBackground(path)}
                                style={selectedBackground === path ? {filter: "drop-shadow(0 0 6px rgba(16,185,129,0.8))"} : {}}
                            />
                        ))}
                    </div>
                )}
            </div>
        </AuthenticatedLayout>
    );
}