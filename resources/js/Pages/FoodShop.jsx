import React, { useState, useEffect } from 'react';
import { Link, router } from '@inertiajs/react';

export default function FoodShop({ foods, groupPoints ,dressings=[]}) {
  const [points, setPoints] = useState(groupPoints);
  const [flashMessage, setFlashMessage] = useState('');
  const [quantities, setQuantities] = useState(() => {
    const initial = {};
    foods.forEach(item => {
      initial[item.id] = item.quantity || 0;
    });
    return initial;
  });
  console.log(dressings);

  const handleBuy = (id, price, category) => {
    if (points < price) {
      setFlashMessage('ポイントが足りません😭');
      return;
    }

    // 洋服は一着しか買えない
    if (category === 'dressing' && quantities[id] > 0) {
      setFlashMessage('この服は既に購入済みです👕');
      return;
    }

    setPoints(prev => prev - price);

    const endpoint = category === 'dressing' ? `/dressings/buy/${id}` : `/foods/buy/${id}`;
    router.post(endpoint, {}, {
      onSuccess: () => {
        if (category === 'dressing') {
          setFlashMessage('服を購入しました👕✨');
          window.dispatchEvent(new Event('dressing-added'));
          setQuantities(prev => ({ ...prev, [id]: 1 }));
        } else {
          setFlashMessage('ご飯を購入しました🍚');
          setQuantities(prev => ({ ...prev, [id]: (prev[id] || 0) + 1 }));
        }
      },
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
      {/* グループポイント表示 */}
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
        🍄 ご飯＆服ショップ 👕
      </h1>

      {/* 一覧表示 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-8">
        {foods.map(item => {
          const isDressing = item.category === 'dressing';
          const owned = quantities[item.id] > 0;
          const canBuy = points >= item.price && (!isDressing || !owned);

          return (
            <div
              key={item.id}
              className="bg-white rounded-2xl shadow hover:shadow-lg transition-all p-4 text-center border border-gray-200 hover:-translate-y-1"
            >
              <img
                src={item.image_path.startsWith('/') ? item.image_path : `/${item.image_path}`}
                alt={item.name}
                className="mx-auto w-24 h-24 mb-3 object-contain"
              />
              <p className="font-bold text-lg text-gray-800">{item.name}</p>
              <p className="text-sm text-gray-600">💎 レアリティ: {item.rarity}</p>
              <p className="text-lg font-semibold text-yellow-600 mt-2">{item.price} pt</p>
              <p className="text-sm text-gray-500 mt-1">
                所持数: {quantities[item.id] || 0}
              </p>

              {/* ボタン */}
              {isDressing && owned ? (
                <button className="mt-3 w-full py-2 rounded-lg font-bold text-white bg-gray-400 cursor-not-allowed shadow-md" disabled>
                  売り切れ
                </button>
              ) : (
                <button
                  className={`mt-3 w-full py-2 rounded-lg font-bold text-white shadow-md transition-all ${
                    canBuy ? 'bg-yellow-500 hover:bg-yellow-600' : 'bg-gray-400 cursor-not-allowed'
                  }`}
                  onClick={() => handleBuy(item.id, item.price, item.category)}
                  disabled={!canBuy}
                >
                  {canBuy ? '買う' : 'ポイント不足'}
                </button>
              )}
            </div>
          );
        })}
      </div>

      <button
        onClick={() => window.history.back()}
        className="block mt-10 mx-auto bg-green-300 hover:bg-green-400 text-white font-bold py-2 px-6 rounded-full shadow"
      >
        ← 戻る
      </button>
    </div>
  );
}