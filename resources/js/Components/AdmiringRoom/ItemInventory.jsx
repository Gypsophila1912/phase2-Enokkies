export default function ItemInventory({ items }) {
    const handleDragStart = (e, item) => {
        e.dataTransfer.setData("item", JSON.stringify(item));
    };

    return (
        <div className="mt-6 w-full px-6">
            <div className="bg-white/80 backdrop-blur-sm border border-green-300 p-4 rounded-t-xl shadow-inner">
                <h3 className="font-semibold text-lg mb-3 text-green-700 text-center">
                    🎒 アイテム
                </h3>
                <div className="flex gap-3 overflow-x-auto px-2">
                    {items.length > 0 ? (
                        items.map((item) => (
                            <div
                                key={item.id}
                                draggable
                                onDragStart={(e) => handleDragStart(e, item)}
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
    );
}
