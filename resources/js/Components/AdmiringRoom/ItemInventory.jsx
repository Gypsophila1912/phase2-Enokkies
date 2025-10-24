import { useState } from "react";
import { ChevronUp, ChevronDown } from "lucide-react";

export default function ItemInventory({ items }) {
    const [isOpen, setIsOpen] = useState(true);

    const handleDragStart = (e, item) => {
        e.dataTransfer.setData("item", JSON.stringify(item));
    };

    return (
        <div className="mt-6 w-full px-6">
            <div className="bg-white/80 backdrop-blur-sm border border-green-300 rounded-xl shadow-inner overflow-hidden">
                {/* ヘッダー部分（クリックで開閉） */}
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="w-full bg-green-100 hover:bg-green-200 transition-colors p-3 flex items-center justify-between border-b border-green-300"
                >
                    <span className="text-sm font-medium text-green-800">
                        アイテム ({items.length})
                    </span>
                    {isOpen ? (
                        <ChevronDown className="w-5 h-5 text-green-600" />
                    ) : (
                        <ChevronUp className="w-5 h-5 text-green-600" />
                    )}
                </button>

                {/* アイテム一覧（開閉アニメーション付き） */}
                <div
                    className={`transition-all duration-300 ease-in-out ${
                        isOpen ? "max-h-32 opacity-100" : "max-h-0 opacity-0"
                    }`}
                >
                    <div className="p-4">
                        <div className="flex gap-3 overflow-x-auto px-2">
                            {items.length > 0 ? (
                                items.map((item) => (
                                    <div
                                        key={item.id}
                                        draggable
                                        onDragStart={(e) =>
                                            handleDragStart(e, item)
                                        }
                                        className="border border-green-200 rounded-lg p-3 min-w-[80px] flex flex-col items-center justify-center bg-white hover:bg-green-50 cursor-grab active:cursor-grabbing transition-colors"
                                    >
                                        <img
                                            src={item.image_path}
                                            alt={item.name}
                                            className="w-12 h-12 object-contain"
                                        />
                                        <p className="text-xs mt-1 text-center">
                                            {item.name}
                                        </p>
                                        <p className="text-xs text-green-600">
                                            +{item.points} EXP
                                        </p>
                                    </div>
                                ))
                            ) : (
                                <p className="text-gray-500 text-sm text-center w-full">
                                    アイテムがありません
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
