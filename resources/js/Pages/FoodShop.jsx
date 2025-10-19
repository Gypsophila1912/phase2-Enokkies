import React, { useState, useEffect } from 'react';
import { Link, router } from '@inertiajs/react';

export default function FoodShop({ foods, points }) {
  const [userPoints, setUserPoints] = useState(points);
  const [flashMessage, setFlashMessage] = useState('');

  const handleBuy = (foodId, price) => {
    if (userPoints < price) {
      setFlashMessage('ポイントが足りません😭');
      return;
    }

    setUserPoints(prev => prev - price);
    setFlashMessage('購入しました！🍙');

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
      {/* ポイント表示 */}
      <div className="absolute top-4 left-4 bg-yellow-200 px-4 py-2 rounded-xl shadow-md border border-yellow-400">
        <span className="font-bold text-lg">💰 所持ポイント: {userPoints} pt</span>
      </div>

      {/* フラッシュメッセージ */}
      {flashMessage && (
        <div className="absolute top-16 left-1/2 transform -translate-x-1/2 bg-white shadow-lg rounded-lg px-6 py-3 text-green-700 font-semibold border border-green-300 animate-bounce">
          {flashMessage}
        </div>
      )}

      <h1 className="text-4xl font-extrabold mb-10 text-center text-green-800 drop-shadow">
        🍄 ご飯ショップ 🍚
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
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

            {/* 購入ボタン: クリックすると group_foods.quantity が増え、ポイントが減る */}
            <button
              className={`mt-3 w-full py-2 rounded-lg font-bold text-white shadow-md transition-all ${
                userPoints >= food.price
                  ? 'bg-yellow-500 hover:bg-yellow-600'
                  : 'bg-gray-400 cursor-not-allowed'
              }`}
              onClick={() => handleBuy(food.id, food.price)}
              disabled={userPoints < food.price}
            >
              {userPoints >= food.price ? '買う' : 'ポイント不足'}
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