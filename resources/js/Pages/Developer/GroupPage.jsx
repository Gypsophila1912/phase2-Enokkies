import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";

export default function GroupPage({ group }) {
    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    {group.name}
                </h2>
            }
        >
            <Head title={`${group.name} - DeveloperMode`} />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    {/* チーム全体のポイント表示 */}
                    <div className="mb-6 text-center">
                        <h3 className="text-xl font-semibold text-gray-600">
                            チーム総獲得ポイント
                        </h3>
                        <p className="text-4xl font-bold text-blue-600 mt-2">
                            {group.total_points} pt
                        </p>
                    </div>

                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            {/* グループの基本情報 */}
                            <div className="mb-8">
                                <div className="flex items-center justify-between">
                                    <h3 className="text-lg font-semibold mb-2">
                                        グループ情報
                                    </h3>
                                    <a
                                        href={group.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-blue-600 hover:underline"
                                    >
                                        GitHubリポジトリを見る →
                                    </a>
                                </div>
                            </div>

                            {/* メンバー一覧 */}
                            <div className="mt-8">
                                <h3 className="text-lg font-semibold mb-4">
                                    メンバー一覧
                                </h3>
                                <div className="overflow-x-auto">
                                    <table className="min-w-full divide-y divide-gray-200">
                                        <thead className="bg-gray-50">
                                            <tr>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    GitHub アカウント
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    獲得ポイント
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-200">
                                            {group.dev_group_users.map(
                                                (member) => (
                                                    <tr key={member.id}>
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            <div className="flex items-center">
                                                                <div className="text-sm font-medium text-gray-900">
                                                                    {
                                                                        member.github_account
                                                                    }
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            <div className="text-sm text-gray-900">
                                                                {
                                                                    member.personal_points
                                                                }{" "}
                                                                pt
                                                            </div>
                                                        </td>
                                                    </tr>
                                                )
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
