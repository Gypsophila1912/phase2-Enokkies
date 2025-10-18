import { useState } from "react";
import { router } from "@inertiajs/react";

export default function GroupModal({ isOpen, onClose }) {
    const [isJoin, setIsJoin] = useState(true);
    const [UUID, setUUID] = useState("");
    const [groupName, setGroupName] = useState("");
    const [repositoryURL, setRepositoryURL] = useState("");
    const [accountName, setAccountName] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    // 入力内容登録処理
    const handleSubmit = (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        if (isJoin) {
            // グループに参加
            router.post(
                route("developer.join"),
                {
                    uuid: UUID,
                    account_name: accountName,
                },
                {
                    onSuccess: () => {
                        // 成功時の処理
                        resetForm();
                        onClose();
                    },
                    onError: (errors) => {
                        // エラー時の処理
                        console.error("参加エラー:", errors);
                        alert(
                            "参加に失敗しました: " +
                                (errors.uuid ||
                                    errors.account_name ||
                                    "不明なエラー")
                        );
                    },
                    onFinish: () => {
                        setIsSubmitting(false);
                    },
                }
            );
        } else {
            // グループを作成
            router.post(
                route("developer.create"),
                {
                    group_name: groupName,
                    repository_url: repositoryURL,
                    account_name: accountName,
                },
                {
                    onSuccess: () => {
                        // 成功時の処理
                        resetForm();
                        onClose();
                    },
                    onError: (errors) => {
                        // エラー時の処理
                        console.error("作成エラー:", errors);
                        alert(
                            "作成に失敗しました: " +
                                (errors.group_name ||
                                    errors.repository_url ||
                                    errors.account_name ||
                                    "不明なエラー")
                        );
                    },
                    onFinish: () => {
                        setIsSubmitting(false);
                    },
                }
            );
        }
    };

    // フォームリセット
    const resetForm = () => {
        setUUID("");
        setGroupName("");
        setRepositoryURL("");
        setAccountName("");
    };

    // キャンセル押したときの処理
    const handleCancel = () => {
        resetForm();
        setIsJoin(true);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 flex items-start justify-center bg-black bg-opacity-50 z-50 pt-60">
            <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6 relative">
                <div className="mb-4">
                    <button
                        onClick={() => setIsJoin(true)}
                        className={`px-4 py-2 rounded transition mr-2 ${
                            isJoin
                                ? "bg-blue-600 text-white hover:bg-blue-700"
                                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                        }`}
                    >
                        参加
                    </button>
                    <button
                        onClick={() => setIsJoin(false)}
                        className={`px-4 py-2 rounded transition ${
                            !isJoin
                                ? "bg-blue-600 text-white hover:bg-blue-700"
                                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                        }`}
                    >
                        作成
                    </button>
                </div>

                {/* 参加フォーム */}
                {isJoin ? (
                    <>
                        <h3 className="text-lg font-bold mb-4">
                            グループに参加
                        </h3>
                        <form onSubmit={handleSubmit}>
                            <div>
                                <label className="block mb-2 text-sm font-medium text-gray-700">
                                    参加したいグループのUUID
                                </label>
                                <input
                                    type="text"
                                    value={UUID}
                                    onChange={(e) => setUUID(e.target.value)}
                                    placeholder="例: 550e8400-e29b-41d4-a716-446655440000"
                                    className="w-full border border-gray-300 rounded px-3 py-2 mb-4 focus:ring-2 focus:ring-blue-400 outline-none"
                                    required
                                    disabled={isSubmitting}
                                />

                                <label className="block mb-2 text-sm font-medium text-gray-700">
                                    GitHubアカウント名
                                </label>
                                <input
                                    type="text"
                                    value={accountName}
                                    onChange={(e) =>
                                        setAccountName(e.target.value)
                                    }
                                    placeholder="例: octocat"
                                    className="w-full border border-gray-300 rounded px-3 py-2 mb-4 focus:ring-2 focus:ring-blue-400 outline-none"
                                    required
                                    disabled={isSubmitting}
                                />
                            </div>

                            <div className="flex justify-end gap-2">
                                <button
                                    type="button"
                                    onClick={handleCancel}
                                    className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400 transition"
                                    disabled={isSubmitting}
                                >
                                    キャンセル
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition disabled:bg-blue-400 disabled:cursor-not-allowed"
                                    disabled={isSubmitting}
                                >
                                    {isSubmitting ? "参加中..." : "参加"}
                                </button>
                            </div>
                        </form>
                    </>
                ) : (
                    /* 作成フォーム */
                    <>
                        <h3 className="text-lg font-bold mb-4">
                            グループを作成
                        </h3>
                        <form onSubmit={handleSubmit}>
                            <label className="block mb-2 text-sm font-medium text-gray-700">
                                グループ名
                            </label>
                            <input
                                type="text"
                                value={groupName}
                                onChange={(e) => setGroupName(e.target.value)}
                                placeholder="例: Enokkies"
                                className="w-full border border-gray-300 rounded px-3 py-2 mb-4 focus:ring-2 focus:ring-blue-400 outline-none"
                                required
                                disabled={isSubmitting}
                            />

                            <label className="block mb-2 text-sm font-medium text-gray-700">
                                リポジトリURL
                            </label>
                            <input
                                type="url"
                                value={repositoryURL}
                                onChange={(e) =>
                                    setRepositoryURL(e.target.value)
                                }
                                placeholder="例: https://github.com/user/repo"
                                className="w-full border border-gray-300 rounded px-3 py-2 mb-4 focus:ring-2 focus:ring-blue-400 outline-none"
                                required
                                disabled={isSubmitting}
                            />

                            <label className="block mb-2 text-sm font-medium text-gray-700">
                                GitHubアカウント名
                            </label>
                            <input
                                type="text"
                                value={accountName}
                                onChange={(e) => setAccountName(e.target.value)}
                                placeholder="例: octocat"
                                className="w-full border border-gray-300 rounded px-3 py-2 mb-4 focus:ring-2 focus:ring-blue-400 outline-none"
                                required
                                disabled={isSubmitting}
                            />

                            <div className="flex justify-end gap-2">
                                <button
                                    type="button"
                                    onClick={handleCancel}
                                    className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400 transition"
                                    disabled={isSubmitting}
                                >
                                    キャンセル
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition disabled:bg-blue-400 disabled:cursor-not-allowed"
                                    disabled={isSubmitting}
                                >
                                    {isSubmitting ? "作成中..." : "作成"}
                                </button>
                            </div>
                        </form>
                    </>
                )}
            </div>
        </div>
    );
}
