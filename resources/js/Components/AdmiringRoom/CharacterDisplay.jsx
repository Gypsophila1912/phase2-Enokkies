export default function CharacterDisplay({ onDropItem, level = 1 }) {
    const handleDrop = (e) => {
        e.preventDefault();
        const itemData = JSON.parse(e.dataTransfer.getData("item"));
        onDropItem(itemData);
    };

    const handleDragOver = (e) => e.preventDefault();

    return (
        <div className="flex flex-col items-center">
            <div
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                className="relative bg-white/80 backdrop-blur-sm border border-green-300 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-200"
            >
                <img
                    src="/images/EnokkieImage.png"
                    alt="Enokkie"
                    className="w-64 h-64 md:w-80 md:h-80 lg:w-96 lg:h-96 object-contain"
                />
                <div className="absolute top-2 right-2 bg-green-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                    Lv.{level}
                </div>
            </div>
        </div>
    );
}
