import React, { useState } from 'react';
import AppLayout from '@/Layouts/AppLayout';
import { Link, usePage, router, useForm } from '@inertiajs/react';

export default function TasksIndex() {
    const { tasks = [] } = usePage().props;
    const currentGroupId = usePage().props?.auth?.user?.group_id ?? null;

    // 編集対象を保持する
    const [editingTask, setEditingTask] = useState(null);

    const { data, setData, post, put, processing, errors, reset } = useForm({
        group_id: currentGroupId,
        title: '',
        description: '',
        due_date: '',
        points: 0,
    });

    function startEdit(task) {
        setEditingTask(task);
        setData('title', task.title || '');
        setData('description', task.description || '');
        // due_date が ISO 文字列なら date input 用に切り出す
        setData('due_date', task.due_date ? task.due_date.split('T')[0] : '');
        setData('points', task.points ?? 0);
    }

    function cancelEdit() {
        setEditingTask(null);
        reset('title', 'description', 'due_date', 'points');
    }

    function submit(e) {
        e.preventDefault();
        if (editingTask) {
            // update
            put(route('tasks.update', editingTask.id), {
                onSuccess: () => {
                    cancelEdit();
                    router.reload();
                },
            });
        } else {
            // create
            post(route('tasks.store'), {
                onSuccess: () => {
                    reset('title', 'description', 'due_date', 'points');
                    router.reload();
                },
            });
        }
    }

    function handleDelete(id) {
        if (!confirm('このタスクを削除しますか？')) return;
        router.delete(route('tasks.destroy', id), {
            onSuccess: () => router.reload(),
        });
    }

    function formatDate(d) {
        if (!d) return '—';
        try {
            return new Date(d).toLocaleDateString();
        } catch {
            return d;
        }
    }

    return (
        <AppLayout>
            <div className="min-h-screen bg-gradient-to-br from-lime-200 via-green-100 to-green-300 px-4 py-10 font-sans text-gray-800 relative overflow-hidden">
                <div className="max-w-7xl mx-auto z-10">

                    {/* ここに左上の戻るボタンを追加 */}
                    <div className="mb-4">
                        <Link
                            href="/dashboard" // ここを戻りたいリンクに変更する
                            className="inline-flex items-center gap-2 bg-white/90 border border-green-300 text-green-800 px-3 py-1 rounded shadow-sm hover:bg-white"
                        >
                            ← 戻る
                        </Link>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* 左：タスク追加 / 編集フォーム */}
                        <div className="bg-white/90 backdrop-blur-md border border-green-300 rounded-xl shadow-lg p-6">
                            <h2 className="text-xl font-semibold text-green-800 mb-4 text-center">
                                {editingTask ? 'タスクを編集' : 'タスクを追加'}
                            </h2>
                            <form onSubmit={submit} className="space-y-4">
                                <input type="hidden" value={data.group_id ?? ''} />

                                <div>
                                    <label className="block text-sm font-medium" >タスク名</label>
                                    <input
                                        type="text"
                                        value={data.title}
                                        onChange={(e) => setData('title', e.target.value)}
                                        className="w-full border rounded px-3 py-2"
                                        required
                                    />
                                    {errors.title && <p className="text-sm text-red-600 mt-1">{errors.title}</p>}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium">期限</label>
                                    <input
                                        type="date"
                                        value={data.due_date}
                                        onChange={(e) => setData('due_date', e.target.value)}
                                        className="w-full border rounded px-3 py-2"
                                    />
                                    {errors.due_date && <p className="text-sm text-red-600 mt-1">{errors.due_date}</p>}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium">メモ</label>
                                    <textarea
                                        value={data.description}
                                        onChange={(e) => setData('description', e.target.value)}
                                        className="w-full border rounded px-3 py-2"
                                        rows={4}
                                    />
                                    {errors.description && <p className="text-sm text-red-600 mt-1">{errors.description}</p>}
                                </div>

                                <div className="flex items-center gap-2">
                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-60"
                                    >
                                        {processing ? '処理中…' : (editingTask ? '更新する' : 'タスクを作成')}
                                    </button>

                                    {editingTask ? (
                                        <button type="button" onClick={cancelEdit} className="text-sm text-gray-600">
                                            キャンセル
                                        </button>
                                    ) : (
                                        <></>
                                    )}
                                </div>
                            </form>
                        </div>

                        {/* 右：タスク一覧 */}
                        <div className="bg-white/90 backdrop-blur-md border border-green-300 rounded-xl shadow-lg p-6">
                            <h2 className="text-xl font-semibold text-green-800 mb-4 text-center">タスク一覧</h2>

                            {tasks.length === 0 ? (
                                <p className="text-gray-600">タスクがありません。</p>
                            ) : (
                                <ul className="space-y-3">
                                    {tasks.map((task) => (
                                        <li key={task.id} className="flex items-center justify-between bg-white rounded p-3 border">
                                            <div>
                                                <div className="font-medium text-gray-800">{task.title}</div>
                                                <div className="text-sm text-gray-500">締切: {formatDate(task.due_date)}</div>
                                            </div>

                                            <div className="flex items-center gap-2">
                                                <button
                                                    onClick={() => startEdit(task)}
                                                    className="text-sm bg-blue-400 hover:bg-blue-500 text-white px-3 py-1 rounded"
                                                >
                                                    編集
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(task.id)}
                                                    className="text-sm bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
                                                >
                                                    削除
                                                </button>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    </div>

                    <footer className="mt-10 text-sm text-green-800 text-center z-10">
                        © 2025 Enokkies Team 🌲
                    </footer>
                    {/* キラキラアニメーション用スタイル */}
                <style>
                    {`
                        .sparkle {
                            font-size: 1.2rem;
                            animation: sparkle 1.5s infinite;
                            pointer-events: none;
                        }
                        @keyframes sparkle {
                            0% { opacity: 0.2; transform: scale(1); }
                            50% { opacity: 1; transform: scale(1.5); }
                            100% { opacity: 0.2; transform: scale(1); }
                        }
                    `}
                </style>
                </div>
            </div>
        </AppLayout>
    );
}