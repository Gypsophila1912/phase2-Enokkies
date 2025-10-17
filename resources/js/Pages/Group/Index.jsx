import React from 'react';
import { Link } from '@inertiajs/react';

export default function Index({ groups }) {
    return (
        <div style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
            <h1 style={{ fontSize: '2rem', color: '#6C63FF' }}>📋 グループ一覧</h1>

            <div style={{ marginBottom: '1rem' }}>
                <Link
                    href="/groups/create"
                    style={{
                        backgroundColor: '#6C63FF',
                        color: 'white',
                        padding: '0.5rem 1rem',
                        borderRadius: '8px',
                        textDecoration: 'none',
                        fontWeight: 'bold',
                        display: 'inline-block'
                    }}
                >
                    + グループ作成
                </Link>
            </div>

            <ul style={{ listStyle: 'none', padding: 0 }}>
                {groups.map(group => (
                    <li key={group.id} style={{ marginBottom: '0.5rem' }}>
                        <Link
                            href={`/groups/${group.id}`}
                            style={{
                                textDecoration: 'none',
                                color: '#4CAF50',
                                fontWeight: 'bold',
                                backgroundColor: '#F3F4F6',
                                padding: '0.5rem 1rem',
                                borderRadius: '8px',
                                display: 'inline-block'
                            }}
                        >
                            🌱 {group.name}
                        </Link>
                    </li>
                ))}
            </ul>
        </div>
    );
}
