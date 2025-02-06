// app/(auth)/register/page.tsx
"use client"
import React from 'react';
import {motion} from 'framer-motion';

import Link from 'next/link';
import SocialLoginButton from "@/app/(public)/(auth)/components/SocialLoginButton";
import RegisterForm from "@/app/(public)/(auth)/register/RegisterForm";


export default function RegisterPage() {
    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4">
            <div className="max-w-md w-full my-10">
                <motion.div
                    initial={{opacity: 0, y: 20}}
                    animate={{opacity: 1, y: 0}}
                    className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-xl"
                >
                    {/* Header */}
                    <div className="text-center mb-8">
                        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                            Create an Account
                        </h2>
                        <p className="text-gray-600 dark:text-gray-400">
                            Join our community today
                        </p>
                    </div>

                    <RegisterForm/>

                    {/* Divider */}
                    <div className="mt-6 relative">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-300 dark:border-gray-600"/>
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="px-2 bg-white dark:bg-gray-800 text-gray-500">
                                Or continue with
                            </span>
                        </div>
                    </div>

                    {/* Social Login Buttons */}
                    <div className="mt-6 grid grid-cols-2 gap-4">
                        <SocialLoginButton
                            provider="google"
                            label="Google"
                        />
                        <SocialLoginButton
                            provider="github"
                            label="GitHub"
                        />
                    </div>

                    {/* Sign In Link */}
                    <p className="mt-8 text-center text-sm text-gray-600 dark:text-gray-400">
                        Already have an account?{' '}
                        <Link
                            href="/login"
                            className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300"
                        >
                            Sign in
                        </Link>
                    </p>
                </motion.div>
            </div>
        </div>
    );
}