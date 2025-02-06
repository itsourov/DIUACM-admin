// app/(auth)/components/RegisterForm.tsx
"use client"
import React, {useState} from 'react';
import {z} from 'zod';
import {useForm} from 'react-hook-form';
import {zodResolver} from '@hookform/resolvers/zod';
import {signIn} from 'next-auth/react';
import {useRouter} from 'next/navigation';
import {
    Mail,
    Lock,
    Loader2,
    User,
    AtSign
} from 'lucide-react';
import {toast} from 'sonner';
import {registerSchema} from "@/lib/schemas/register";
import {FieldErrors, registerUser} from "@/app/(public)/(auth)/register/action";


type RegisterFormData = z.infer<typeof registerSchema>;

export default function RegisterForm() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});

    const {
        register,
        handleSubmit,
        formState: {errors},
    } = useForm<RegisterFormData>({
        resolver: zodResolver(registerSchema),
    });

    const onSubmit = async (data: RegisterFormData) => {
        try {
            setIsLoading(true);
            setFieldErrors({});

            const result = await registerUser(data);

            if (result.errors) {
                setFieldErrors(result.errors);
                return;
            }

            if (!result.success && result.error) {
                toast.error(result.error);
                return;
            }

            if (result.success) {
                toast.success("Registration successful!");

                const signInResult = await signIn('credentials', {
                    redirect: false,
                    identifier: data.email,
                    password: data.password,
                });

                if (signInResult?.error) {
                    toast.error('Failed to sign in after registration.');
                    return;
                }

                router.push('/');
            }
        } catch (error) {
            toast.error('An unexpected error occurred' + error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Name Field */}
            <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Full Name
                </label>
                <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <User className="h-5 w-5 text-gray-400"/>
                    </div>
                    <input
                        {...register('name')}
                        type="text"
                        className={`block w-full pl-10 pr-3 py-2 border ${
                            errors.name ? 'border-red-500' : 'border-gray-300'
                        } rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white`}
                        placeholder="John Doe"
                    />
                </div>
                {errors.name && (
                    <span className="text-sm text-red-500">{errors.name.message}</span>
                )}
            </div>

            {/* Username Field */}
            <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Username
                </label>
                <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <AtSign className="h-5 w-5 text-gray-400"/>
                    </div>
                    <input
                        {...register('username')}
                        type="text"
                        className={`block w-full pl-10 pr-3 py-2 border ${
                            errors.username || fieldErrors.username ? 'border-red-500' : 'border-gray-300'
                        } rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white`}
                        placeholder="johndoe123"
                    />
                </div>
                {(errors.username || fieldErrors.username) && (
                    <span className="text-sm text-red-500">
                        {errors.username?.message || fieldErrors.username}
                    </span>
                )}
            </div>

            {/* Email Field */}
            <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Email Address
                </label>
                <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Mail className="h-5 w-5 text-gray-400"/>
                    </div>
                    <input
                        {...register('email')}
                        type="email"
                        className={`block w-full pl-10 pr-3 py-2 border ${
                            errors.email || fieldErrors.email ? 'border-red-500' : 'border-gray-300'
                        } rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white`}
                        placeholder="you@example.com"
                    />
                </div>
                {(errors.email || fieldErrors.email) && (
                    <span className="text-sm text-red-500">
                        {errors.email?.message || fieldErrors.email}
                    </span>
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

            {/* Confirm Password Field */}
            <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Confirm Password
                </label>
                <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Lock className="h-5 w-5 text-gray-400"/>
                    </div>
                    <input
                        {...register('confirmPassword')}
                        type="password"
                        className={`block w-full pl-10 pr-3 py-2 border ${
                            errors.confirmPassword ? 'border-red-500' : 'border-gray-300'
                        } rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white`}
                        placeholder="••••••••"
                    />
                </div>
                {errors.confirmPassword && (
                    <span className="text-sm text-red-500">{errors.confirmPassword.message}</span>
                )}
            </div>

            <button
                type="submit"
                disabled={isLoading}
                className="w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-base font-medium text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {isLoading ? (
                    <Loader2 className="w-5 h-5 animate-spin"/>
                ) : (
                    'Create Account'
                )}
            </button>
        </form>
    );
}