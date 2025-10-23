import React, { useState, useEffect } from 'react';
import { Link, router } from '@inertiajs/react';

export default function FoodShop({ foods, groupPoints }) {
  const [points, setPoints] = useState(groupPoints);
  const [flashMessage, setFlashMessage] = useState('');

  const handleBuy = (foodId, price) => {
    if (points < price) {
      setFlashMessage('ポイントが足りません😭');
      return;
    }

    setPoints(prev => prev - price);
    setFlashMessage('購入しました！');

    router.post(`/foods/buy/${foodId}`, {}, {
      onError: () => setFlashMessage('購入に失敗しました…💧'),
    });
  };

  useEffect(() => {
    if (flashMessage) {
      const timer = setTimeout(() => setFlashMessage(''), 2000);
      return () => clearTimeout(timer);
    }
  }, [flashMessage]);

  return (
    <div className="relative p-8 min-h-screen bg-gradient-to-br from-green-100 to-yellow-100">
      {/* グループポイント表示（上部中央に移動＆強調） */}
      <div className="fixed top-6 left-1/2 transform -translate-x-1/2 bg-yellow-200 px-6 py-3 rounded-2xl shadow-lg border-2 border-yellow-400 z-30 flex items-center gap-2">
        <span className="font-extrabold text-2xl text-yellow-700">💰 グループポイント:</span>
        <span className="font-bold text-2xl text-green-800">{points} pt</span>
      </div>

      {/* フラッシュメッセージ */}
      {flashMessage && (
        <div className="fixed top-24 left-1/2 transform -translate-x-1/2 bg-white shadow-lg rounded-lg px-6 py-3 text-green-700 font-semibold border border-green-300 animate-bounce z-30">
          {flashMessage}
        </div>
      )}

      <h1 className="text-4xl font-extrabold mb-10 text-center text-green-800 drop-shadow mt-20">
        🍄 ご飯ショップ 🍚
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-8">
        {foods.map(food => (
          <div
            key={food.id}
            className="bg-white rounded-2xl shadow hover:shadow-lg transition-all p-4 text-center border border-gray-200 hover:-translate-y-1"
          >
            <img
              src={food.image_path}
              alt={food.name}
              className="mx-auto w-24 h-24 mb-3 object-contain"
            />
            <p className="font-bold text-lg text-gray-800">{food.name}</p>
            <p className="text-sm text-gray-600">💎 レアリティ: {food.rarity}</p>
            <p className="text-lg font-semibold text-yellow-600 mt-2">{food.price} pt</p>
            <p className="text-sm text-gray-500 mt-1">
              所持数: {food.quantity || 0}
            </p>

            {/* 購入ボタン: ポイントが足りている場合のみ有効化 */}
            <button
              className={`mt-3 w-full py-2 rounded-lg font-bold text-white shadow-md transition-all ${
                points >= food.price
                  ? 'bg-yellow-500 hover:bg-yellow-600'
                  : 'bg-gray-400 cursor-not-allowed'
              }`}
              onClick={() => handleBuy(food.id, food.price)}
              disabled={points < food.price}
            >
              {points >= food.price ? '買う' : 'ポイント不足'}
            </button>
          </div>
        ))}
      </div>

      <Link
        href="/"
        className="block mt-10 text-blue-700 text-lg font-semibold hover:underline text-center"
      >
        ← 戻る
      </Link>
    </div>
  );
}