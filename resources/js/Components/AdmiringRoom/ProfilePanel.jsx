import { Youtube, Twitter, Edit2, Check, X } from "lucide-react";
import { useState } from "react";

export default function ProfilePanel({
    chrname,
    exp,
    level,
    affection,
    onNameUpdate,
}) {
    const [isEditing, setIsEditing] = useState(false);
    const [editedName, setEditedName] = useState(chrname);
    const handleSave = () => {
        if (editedName.trim() === "") {
            alert("名前を入力してください");
            return;
        }
        onNameUpdate(editedName);
        setIsEditing(false);
    };

    const handleCancel = () => {
        setIsEditing(false);
    };

    // 親愛度を数値に変換し、0-100の範囲にクランプ
    const parseAffection = (value) => {
        const num = Number(value);
        return isNaN(num) ? 0 : num;
    };

    const clampedAffection = affection;

    return (
        <div className="bg-white/80 backdrop-blur-sm border border-green-300 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow duration-200">
            <h3 className="font-semibold text-lg mb-4 text-green-700">
                エノッキー情報
            </h3>
            <div className="space-y-3 text-gray-700">
                <div>
                    <p className="text-sm font-semibold text-gray-500">名前</p>
                    {isEditing ? (
                        <div className="flex items-center gap-2 mt-1">
                            <input
                                type="text"
                                value={editedName}
                                onChange={(e) => setEditedName(e.target.value)}
                                className="flex-1 border border-green-300 rounded px-2 py-1 focus:ring-2 focus:ring-green-400 outline-none"
                                maxLength={20}
                            />
                            <button
                                onClick={handleSave}
                                className="text-green-600 hover:text-green-700 p-1"
                                title="保存"
                            >
                                <Check size={20} />
                            </button>
                            <button
                                onClick={handleCancel}
                                className="text-red-600 hover:text-red-700 p-1"
                                title="キャンセル"
                            >
                                <X size={20} />
                            </button>
                        </div>
                    ) : (
                        <div className="flex items-center gap-2">
                            <p className="text-base">{chrname}</p>
                            <button
                                onClick={() => setIsEditing(true)}
                                className="text-gray-400 hover:text-green-600 transition"
                                title="編集"
                            >
                                <Edit2 size={16} />
                            </button>
                        </div>
                    )}
                </div>
                <div>
                    <p className="text-sm font-semibold text-gray-500">
                        レベル
                    </p>
                    <p className="text-base">Lv.{level}</p>
                </div>
                <div>
                    <p className="text-sm font-semibold text-gray-500">
                        経験値
                    </p>
                    <p className="text-base">{exp} EXP</p>
                    <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                        <div
                            className="bg-green-500 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${exp % 100}%` }}
                        ></div>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                        次のレベルまで {100 - (exp % 100)} EXP
                    </p>
                </div>
                {/* 親愛度バー */}
                <div>
                    <div className="flex items-center gap-2">
                        <p className="text-sm font-semibold text-gray-500">
                            親愛度
                        </p>
                    </div>
                    <div className="flex items-center gap-4 mt-2">
                        {/* ハート型バー */}
                        <div className="relative w-20 h-20">
                            {/* 背景のハート（グレー） */}
                            <svg
                                viewBox="0 0 100 100"
                                className="w-full h-full"
                            >
                                <defs>
                                    <clipPath id="heartClip">
                                        <path d="M50,90 C50,90 10,60 10,40 C10,25 20,15 30,15 C40,15 45,20 50,30 C55,20 60,15 70,15 C80,15 90,25 90,40 C90,60 50,90 50,90 Z" />
                                    </clipPath>
                                </defs>
                                {/* グレーの背景ハート */}
                                <path
                                    d="M50,90 C50,90 10,60 10,40 C10,25 20,15 30,15 C40,15 45,20 50,30 C55,20 60,15 70,15 C80,15 90,25 90,40 C90,60 50,90 50,90 Z"
                                    fill="#e5e7eb"
                                    stroke="#d1d5db"
                                    strokeWidth="2"
                                />
                                {/* 満たされる部分 */}
                                <g clipPath="url(#heartClip)">
                                    <rect
                                        x="0"
                                        y={100 - clampedAffection}
                                        width="100"
                                        height={clampedAffection}
                                        className="transition-all duration-500 ease-out"
                                    >
                                        <animate
                                            attributeName="fill"
                                            values="#ff9df7ff;#f59e0b;#fbbf24"
                                            dur="2s"
                                            repeatCount="indefinite"
                                        />
                                    </rect>
                                </g>
                                {/* ハートの枠線 */}
                                <path
                                    d="M50,90 C50,90 10,60 10,40 C10,25 20,15 30,15 C40,15 45,20 50,30 C55,20 60,15 70,15 C80,15 90,25 90,40 C90,60 50,90 50,90 Z"
                                    fill="none"
                                    stroke="#ff51dcff"
                                    strokeWidth="2"
                                />
                            </svg>
                            {/* パーセンテージ表示 */}
                            <div className="absolute inset-0 flex items-center justify-center">
                                <span className="text-xs font-bold text-gray-700 drop-shadow">
                                    {clampedAffection}%
                                </span>
                            </div>
                        </div>
                        {/* テキスト情報 */}
                        <div className="flex-1">
                            <p className="text-base font-semibold">
                                {clampedAffection} / 100
                            </p>
                            <p className="text-xs text-gray-500 mt-1">
                                {clampedAffection >= 100
                                    ? "最高の絆！💛"
                                    : `あと ${
                                          100 - clampedAffection
                                      } で最高の絆に`}
                            </p>
                        </div>
                    </div>
                </div>
                <div className="flex gap-4 mt-4">
                    <a
                        href="https://x.com/Gs_midorikun"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-blue-500 transition"
                    >
                        <Twitter size={32} />
                    </a>

                    <a
                        href="https://www.youtube.com/@Hello_MIDORIkun"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-red-500 transition"
                    >
                        <Youtube size={32} />
                    </a>
                </div>
                <p>＜プロフィール＞</p>
                <div>
                    <p className="py-4">・好きな食べ物：</p>
                    <p className="py-4">・苦手な食べ物：</p>
                    <p className="py-4">・趣味：</p>
                    <p className="py-4">・座右の銘：</p>
                </div>
            </div>
        </div>
    );
}
