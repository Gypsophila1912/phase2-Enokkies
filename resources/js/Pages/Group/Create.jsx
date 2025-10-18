// resources/js/Pages/Group/Create.jsx

import React from 'react';
import { useForm } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout'; // ← 追加

export default function Create() {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        description: '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post('/groups');
    };

    return (
        <AppLayout>
            <div style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
                <h1 style={{ fontSize: '2rem', color: '#6C63FF' }}>🛠️ グループ作成</h1>

                <form onSubmit={handleSubmit} style={{ marginTop: '1rem' }}>
                    <div style={{ marginBottom: '1rem' }}>
                        <label>グループ名：</label><br />
                        <input
                            type="text"
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                            style={{ padding: '0.5rem', width: '100%' }}
                        />
                        {errors.name && <div style={{ color: 'red' }}>{errors.name}</div>}
                    </div>

                    <div style={{ marginBottom: '1rem' }}>
                        <label>説明（任意）：</label><br />
                        <textarea
                            value={data.description}
                            onChange={(e) => setData('description', e.target.value)}
                            style={{ padding: '0.5rem', width: '100%', height: '100px' }}
                        />
                        {errors.description && <div style={{ color: 'red' }}>{errors.description}</div>}
                    </div>

                    <button
                        type="submit"
                        disabled={processing}
                        style={{
                            backgroundColor: '#4CAF50',
                            color: 'white',
                            padding: '0.5rem 1rem',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer'
                        }}
                    >
                        作成する
                    </button>
                </form>
            </div>
        </AppLayout>
    );
}
