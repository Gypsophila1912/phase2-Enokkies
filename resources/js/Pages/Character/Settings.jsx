import React from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';

export default function Settings({ auth }) {
  return (
    <AuthenticatedLayout user={auth.user}>
      <Head title="キャラ設定" />

      <div className="min-h-screen bg-gradient-to-br from-lime-100 to-green-200 p-6 relative">
        {/* キラキラ背景 */}
        <div className="absolute inset-0 pointer-events-none animate-pulse bg-[radial-gradient(circle,rgba(255,255,255,0.3)_1px,transparent_1px)] bg-[length:20px_20px]"></div>

        <div className="relative z-10 max-w-3xl mx-auto bg-white bg-opacity-80 rounded-xl shadow-md p-6">
          <h1 className="text-2xl font-bold text-green-800 mb-4">キャラ設定</h1>
          <p className="text-gray-700">ここにキャラ設定画面の内容が入ります。</p>
        </div>
      </div>
    </AuthenticatedLayout>
  );
}
