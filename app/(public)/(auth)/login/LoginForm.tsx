// app/(auth)/components/LoginForm.tsx
"use client"
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {loginSchema, LoginFormData} from "@/lib/schemas/login";
import {useState} from "react";
import {toast} from "sonner";
import {useRouter} from "next/navigation";
import {AtSign, Lock, Loader2} from "lucide-react";
import {signIn} from "next-auth/react"; // Change this import

export default function LoginForm() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);

    const {
        register,
        handleSubmit,
        formState: {errors},
    } = useForm<LoginFormData>({
        resolver: zodResolver(loginSchema),
    });

    const onSubmit = async (data: LoginFormData) => {
        try {
            setIsLoading(true);

            const result = await signIn("credentials", {
                identifier: data.identifier,
                password: data.password,
                redirect: false,
            });

            if (result?.error) {
                toast.error("Invalid credentials");
                return;
            }

            toast.success("Logged in successfully");
            router.push('/');

        } catch (error) {
            toast.error("Something went wrong. " + error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Identifier Field */}
            <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Username or Email
                </label>
                <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <AtSign className="h-5 w-5 text-gray-400"/>
                    </div>
                    <input
                        {...register('identifier')}
                        type="text"
                        autoComplete="username"
                        className={`block w-full pl-10 pr-3 py-2 border ${
                            errors.identifier ? 'border-red-500' : 'border-gray-300'
                        } rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white`}
                        placeholder="Username or email"
                    />
                </div>
                {errors.identifier && (
                    <span className="text-sm text-red-500">{errors.identifier.message}</span>
                )}
            </div>

            {/* Password Field */}
            <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Password
                </label>
                <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Lock className="h-5 w-5 text-gray-400"/>
                    </div>
                    <input
                        {...register('password')}
                        type="password"
                        autoComplete="current-password"
                        className={`block w-full pl-10 pr-3 py-2 border ${
                            errors.password ? 'border-red-500' : 'border-gray-300'
                        } rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white`}
                        placeholder="••••••••"
                    />
                </div>
                {errors.password && (
                    <span className="text-sm text-red-500">{errors.password.message}</span>
                )}
            </div>

            {/* Forgot Password */}
            <div className="flex items-center justify-end">
                <div className="text-sm">
                    <a href="/forgot-password"
                       className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400">
                        Forgot your password?
                    </a>
                </div>
            </div>

            <button
                type="submit"
                disabled={isLoading}
                className="w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-base font-medium text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {isLoading ? (
                    <Loader2 className="w-5 h-5 animate-spin"/>
                ) : (
                    'Sign in'
                )}
            </button>
        </form>
    );
}