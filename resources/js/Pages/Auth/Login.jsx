import React from "react";
import Checkbox from "@/Components/Checkbox";
import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import PrimaryButton from "@/Components/PrimaryButton";
import TextInput from "@/Components/TextInput";
import GuestLayout from "@/Layouts/GuestLayout";
import { Head, Link, useForm } from "@inertiajs/react";

export default function Login({ status, canResetPassword }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: "",
        password: "",
        remember: false,
    });

    const submit = (e) => {
        e.preventDefault();

        post(route("login"), {
            onFinish: () => reset("password"),
        });
    };

    return (
        <GuestLayout>
            <Head title="ログイン" />

            {/* キラキラエフェクト */}
            {[...Array(20)].map((_, i) => (
                <div
                    key={i}
                    className="fixed sparkle"
                    style={{
                        top: `${Math.random() * 100}%`,
                        left: `${Math.random() * 100}%`,
                        animationDelay: `${Math.random() * 2}s`,
                    }}
                >
                    ✨
                </div>
            ))}

            <div className="w-full max-w-md bg-white/80 backdrop-blur-md rounded-xl shadow-xl p-6 border border-green-300 z-10 mx-4">
                <h1 className="text-3xl font-bold text-green-700 mb-4 text-center">
                    エノッキーの森
                </h1>
                <p className="text-center text-green-800 mb-4 text-base">
                    ログイン
                </p>

                {status && (
                    <div className="mb-4 text-sm font-medium text-green-600 text-center">
                        {status}
                    </div>
                )}

                <form onSubmit={submit} className="space-y-3">
                    <div>
                        <InputLabel
                            htmlFor="email"
                            value="メールアドレス"
                            className="text-gray-700"
                        />

                        <TextInput
                            id="email"
                            type="email"
                            name="email"
                            value={data.email}
                            className="mt-1 block w-full"
                            autoComplete="username"
                            isFocused={true}
                            onChange={(e) => setData("email", e.target.value)}
                        />

                        <InputError message={errors.email} className="mt-2" />
                    </div>

                    <div>
                        <InputLabel
                            htmlFor="password"
                            value="パスワード"
                            className="text-gray-700"
                        />

                        <TextInput
                            id="password"
                            type="password"
                            name="password"
                            value={data.password}
                            className="mt-1 block w-full"
                            autoComplete="current-password"
                            onChange={(e) =>
                                setData("password", e.target.value)
                            }
                        />

                        <InputError
                            message={errors.password}
                            className="mt-2"
                        />
                    </div>

                    <div className="block">
                        <label className="flex items-center">
                            <Checkbox
                                name="remember"
                                checked={data.remember}
                                onChange={(e) =>
                                    setData("remember", e.target.checked)
                                }
                            />
                            <span className="ms-2 text-sm text-gray-600">
                                ログイン状態を保持する
                            </span>
                        </label>
                    </div>

                    <div className="flex flex-col gap-3 items-center mt-4">
                        <PrimaryButton
                            className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold px-6 py-2 rounded-full shadow transition duration-300 justify-center"
                            disabled={processing}
                        >
                            ログイン
                        </PrimaryButton>

                        {canResetPassword && (
                            <Link
                                href={route("password.request")}
                                className="text-sm text-green-700 underline hover:text-green-900"
                            >
                                パスワードをお忘れですか？
                            </Link>
                        )}
                    </div>
                </form>

                <div className="mt-4 text-center">
                    <Link
                        href={route("register")}
                        className="text-lime-600 underline hover:text-lime-800 text-sm"
                    >
                        アカウントをお持ちでない方はこちら
                    </Link>
                </div>
            </div>

            <footer className="mt-6 text-sm text-green-800 text-center z-10">
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
        </GuestLayout>
    );
}
