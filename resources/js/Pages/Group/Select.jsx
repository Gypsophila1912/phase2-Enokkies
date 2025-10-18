import { router, Link } from '@inertiajs/react';
import React from 'react';

export default function Select({ groups }) {
  const joinGroup = (groupId) => {
    router.post(`/groups/${groupId}/join`);
  };

  const handleDelete = (group) => {
    if (group.users_count > 1) {
      if (confirm('このグループには他のユーザーが所属しています。本当に削除しますか？')) {
        if (confirm('⚠️ 強制的に削除しますか？')) {
          router.delete(`/groups/${group.id}`);
        }
      }
    } else {
      if (confirm('本当に削除しますか？')) {
        router.delete(`/groups/${group.id}`);
      }
    }
  };

  return (
    <div style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
      <h1 style={{ fontSize: '2rem', color: '#6C63FF' }}>グループを選択</h1>
      <ul style={{ listStyleType: 'none', paddingLeft: 0 }}>
        {groups.map((group) => (
          <li key={group.id} style={{ marginBottom: '1rem', backgroundColor: '#F3F4F6', padding: '1rem', borderRadius: '8px' }}>
            <p><strong>グループ名：</strong> {group.name}</p>
            <p><strong>説明：</strong> {group.description ?? '（説明はまだありません）'}</p>
            <p><strong>参加者数：</strong> {group.users_count}</p>
            <button
              onClick={() => joinGroup(group.id)}
              style={{
                backgroundColor: '#4CAF50',
                color: 'white',
                padding: '0.5rem 1rem',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                marginRight: '1rem'
              }}
            >
              このグループに参加する
            </button>
            <button
              onClick={() => handleDelete(group)}
              style={{
                backgroundColor: '#f44336',
                color: 'white',
                padding: '0.5rem 1rem',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              削除
            </button>
          </li>
        ))}
      </ul>
      <Link href="/group-create" style={{ display: 'inline-block' }}>
        グループを作成
      </Link>
    </div>
  );
}
