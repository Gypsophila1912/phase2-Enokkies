// resources/js/Pages/Group/Show.jsx

import React from 'react';
import { usePage } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout'; // ← 追加

export default function Show() {
    const { group, users } = usePage().props;

    return (
        <AppLayout> {/* ← レイアウトで囲む */}
            <div style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
                <h1 style={{ fontSize: '2rem', color: '#6C63FF' }}>🌱 グループ詳細</h1>

                <div style={{ marginTop: '1rem', backgroundColor: '#F3F4F6', padding: '1rem', borderRadius: '8px' }}>
                    <p><strong>グループ名:</strong> {group.name}</p>
                    <p><strong>説明:</strong> {group.description ?? '（説明はまだありません）'}</p>
                </div>

                <h2 style={{ marginTop: '2rem', fontSize: '1.5rem', color: '#4CAF50' }}>👥 メンバー一覧</h2>
                <ul style={{ listStyleType: 'none', paddingLeft: 0 }}>
                    {users.map(user => (
                        <li key={user.id} style={{ padding: '0.5rem 0', borderBottom: '1px solid #ddd' }}>
                            👤 {user.name}
                        </li>
                    ))}
                </ul>
            </div>
        </AppLayout>
    );
}
