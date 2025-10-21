import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Shop = ({ characterId = 1 }) => {
  const [foods, setFoods] = useState([]);
  const [point, setPoint] = useState(0);
  const [character, setCharacter] = useState({ experience: 0, level: 1 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFoods = async () => {
      try {
        const res = await axios.get('/api/shop');
        setFoods(res.data.foods);
      } catch (error) {
        console.error('食品一覧の取得に失敗しました:', error);
        alert('食品一覧の取得に失敗しました。');
      } finally {
        setLoading(false);
      }
    };

    fetchFoods();
  }, [characterId]);

  const handleBuy = async (foodId) => {
    try {
      const res = await axios.post('/api/shop/buy', {
        food_id: foodId,
        character_id: characterId,
      });
      setPoint(res.data.point ?? point);
      setCharacter({
        experience: res.data.character_exp ?? character.experience,
        level: res.data.character_level ?? character.level,
      });
      if (res.data.leveled_up) {
        alert('🎉 レベルアップしました！');
      } else {
        alert('購入完了！');
      }
    } catch (e) {
      console.error('購入失敗:', e);
      alert(e.response?.data?.error || '購入に失敗しました。');
    }
  };

  if (loading) {
    return <div style={{ textAlign: 'center', marginTop: '50px' }}>読み込み中...</div>;
  }

  return (
    <div style={{ maxWidth: 900, margin: '40px auto', padding: 24, background: '#f9f9f9', borderRadius: 12 }}>
      <h2 style={{ textAlign: 'center', marginBottom: 24 }}>ショップ</h2>

      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 24 }}>
        <div style={{ background: '#fff', padding: 16, borderRadius: 8, boxShadow: '0 2px 8px #eee' }}>
          <strong>所持ポイント</strong>
          <div style={{ fontSize: 24, color: '#1976d2' }}>{point}</div>
        </div>
        <div style={{ background: '#fff', padding: 16, borderRadius: 8, boxShadow: '0 2px 8px #eee' }}>
          <strong>キャラクター</strong>
          <div>Lv: <span style={{ fontWeight: 'bold' }}>{character.level}</span></div>
          <div>経験値: <span style={{ fontWeight: 'bold' }}>{character.experience}</span></div>
        </div>
      </div>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '32px', justifyContent: 'center' }}>
        {foods.length === 0 ? (
          <p style={{ textAlign: 'center' }}>商品がありません。</p>
        ) : (
          foods.map((food, idx) => (
            <div key={food.id} style={{ width: 160, background: '#fff', borderRadius: 12, boxShadow: '0 2px 8px #eee', padding: 16, textAlign: 'center' }}>
              <img
                src={food.image_url || `/images/food${(idx % 10) + 1}.jpg`}
                alt={food.name}
                style={{ width: '100%', height: 100, objectFit: 'cover', borderRadius: 8, marginBottom: 8 }}
              />
              <div style={{ fontWeight: 'bold', fontSize: 18 }}>{food.name}</div>
              <div style={{ color: '#888', fontSize: 14 }}>経験値 +{food.exp}</div>
              <div style={{ margin: '8px 0', fontSize: 16 }}>
                必要ポイント: <span style={{ color: '#1976d2', fontWeight: 'bold' }}>{food.price}</span> pt
              </div>
              <button
                style={{
                  background: '#1976d2',
                  color: '#fff',
                  border: 'none',
                  borderRadius: 6,
                  padding: '8px 16px',
                  cursor: 'pointer',
                  fontWeight: 'bold',
                  marginTop: 8,
                }}
                onClick={() => handleBuy(food.id)}
              >
                購入
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Shop;
