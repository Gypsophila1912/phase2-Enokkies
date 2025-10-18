import React from 'react';
import AppLayout from '@/Layouts/AppLayout';
import { Link, usePage, router, useForm } from '@inertiajs/react';

export default function Create() {
    const { props } = usePage();
    const user = props?.auth?.user || null;
    // デフォルトの group_id をユーザーの所属グループから取る（なければ null）
    const defaultGroupId = user?.group_id ?? null;

    const { data, setData, post, processing, errors, reset } = useForm({
        group_id: defaultGroupId,
        title: '',
        description: '',
        points: 0,
        due_date: '',
    });

    function submit(e) {
        e.preventDefault();
        post('/tasks', {
            onSuccess: () => {
                reset('title', 'description', 'points', 'due_date');
                // 必要ならリストをリロードするなど追加処理
            },
            onError: () => {
                // エラー時の追加処理があれば
            },
        });
    }

    return (
        <AppLayout>
            <div className="container mx-auto p-4">
                <div className="flex items-center justify-between mb-4">
                    <h1 className="text-2xl font-bold">タスクを作成</h1>
                    <Link href="/tasks" className="text-sm text-blue-600">← タスク一覧へ</Link>
                </div>

                <form onSubmit={submit} className="space-y-4 max-w-xl">
                    <input type="hidden" value={data.group_id ?? ''} />

                    <div>
                        <label className="block text-sm font-medium">タイトル</label>
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
                        <label className="block text-sm font-medium">説明</label>
                        <textarea
                            value={data.description}
                            onChange={(e) => setData('description', e.target.value)}
                            className="w-full border rounded px-3 py-2"
                            rows={4}
                        />
                        {errors.description && <p className="text-sm text-red-600 mt-1">{errors.description}</p>}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium">ポイント</label>
                            <input
                                type="number"
                                value={data.points}
                                onChange={(e) => setData('points', Number(e.target.value))}
                                className="w-full border rounded px-3 py-2"
                                min={0}
                            />
                            {errors.points && <p className="text-sm text-red-600 mt-1">{errors.points}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-medium">締切日</label>
                            <input
                                type="date"
                                value={data.due_date}
                                onChange={(e) => setData('due_date', e.target.value)}
                                className="w-full border rounded px-3 py-2"
                            />
                            {errors.due_date && <p className="text-sm text-red-600 mt-1">{errors.due_date}</p>}
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <button
                            type="submit"
                            disabled={processing}
                            className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-60"
                        >
                            {processing ? '作成中…' : 'タスクを作成'}
                        </button>

                        <Link href="/tasks" className="text-sm text-gray-600">キャンセル</Link>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}