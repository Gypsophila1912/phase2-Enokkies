import React from 'react';
import AppLayout from '@/Layouts/AppLayout';
import { Link, usePage, router } from '@inertiajs/react';

export default function GroupSelect() {
    const { groups } = usePage().props;

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
        <AppLayout>
            <div className="p-6">
                <h1 className="text-2xl font-bold mb-6">グループを選択</h1>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {groups.map(group => {
                        console.log('参加ボタンのgroup.id:', group.id); // ← ここに追加！

                        return (
                            <div key={group.id} className="border rounded-lg shadow p-4 bg-white">
                                <h2 className="text-xl font-semibold mb-2">{group.name}</h2>
                                <p className="text-gray-700 mb-2">{group.description ?? '（説明はまだありません）'}</p>
                                <p className="text-sm text-gray-500 mb-4">
                                    参加者数: {group.users_count}
                                </p>
                                <div className="flex gap-2">
                                    <Link
                                        href={route('groups.join', group.id)}
                                        method="post"
                                        as="button"
                                        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                                    >
                                        参加する
                                    </Link>
                                    <button
                                        onClick={() => handleDelete(group)}
                                        className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                                    >
                                        削除
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>

                <div className="mt-10 text-center">
                    <Link
                        href={route('groups.create')}
                        className="bg-green-500 text-white px-6 py-3 rounded-full hover:bg-green-600"
                    >
                        新しいグループを作成する
                    </Link>
                </div>
            </div>
        </AppLayout>
    );
}
