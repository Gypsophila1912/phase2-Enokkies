import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import PrimaryButton from "@/Components/PrimaryButton";
import TextInput from "@/Components/TextInput";
import GuestLayout from "@/Layouts/GuestLayout";
import { Head, Link, useForm } from "@inertiajs/react";

export default function Register() {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: "",
        email: "",
        password: "",
        password_confirmation: "",
    });

    const submit = (e) => {
        e.preventDefault();

        post(route("register"), {
            onFinish: () => reset("password", "password_confirmation"),
        });
    };

    return (
        <GuestLayout>
            <Head title="新規登録" />

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
                    新規登録
                </p>

                <form onSubmit={submit} className="space-y-3">
                    <div>
                        <InputLabel
                            htmlFor="name"
                            value="名前"
                            className="text-gray-700"
                        />

                        <TextInput
                            id="name"
                            name="name"
                            value={data.name}
                            className="mt-1 block w-full"
                            autoComplete="name"
                            isFocused={true}
                            onChange={(e) => setData("name", e.target.value)}
                            required
                        />

                        <InputError message={errors.name} className="mt-2" />
                    </div>

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
                            onChange={(e) => setData("email", e.target.value)}
                            required
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
                            autoComplete="new-password"
                            onChange={(e) =>
                                setData("password", e.target.value)
                            }
                            required
                        />

                        <InputError
                            message={errors.password}
                            className="mt-2"
                        />
                    </div>

                    <div>
                        <InputLabel
                            htmlFor="password_confirmation"
                            value="パスワード（確認）"
                            className="text-gray-700"
                        />

                        <TextInput
                            id="password_confirmation"
                            type="password"
                            name="password_confirmation"
                            value={data.password_confirmation}
                            className="mt-1 block w-full"
                            autoComplete="new-password"
                            onChange={(e) =>
                                setData("password_confirmation", e.target.value)
                            }
                            required
                        />

                        <InputError
                            message={errors.password_confirmation}
                            className="mt-2"
                        />
                    </div>

                    <div className="flex flex-col gap-3 items-center mt-4">
                        <PrimaryButton
                            className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold px-6 py-2 rounded-full shadow transition duration-300 justify-center"
                            disabled={processing}
                        >
                            登録
                        </PrimaryButton>

                        <Link
                            href={route("login")}
                            className="text-sm text-green-700 underline hover:text-green-900"
                        >
                            既にアカウントをお持ちの方はこちら
                        </Link>
                    </div>
                </form>
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
