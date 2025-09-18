import { Head, Link, useForm } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Shield, Zap } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/Components/ui/Button';
import { Input } from '@/Components/ui/Input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/Components/ui/Card';

export default function Login({ status, canResetPassword }) {
    const [showPassword, setShowPassword] = useState(false);
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    const submit = (e) => {
        e.preventDefault();
        post('/login', {
            onFinish: () => reset('password'),
        });
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-blue-900 dark:to-indigo-900">
            <Head title="Login - NITDA SRAP 2.0" />
            
            <div className="flex min-h-screen">
                {/* Left Side - Illustration */}
                <div className="hidden lg:flex lg:w-1/2 items-center justify-center p-12">
                    <motion.div 
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8 }}
                        className="max-w-md text-center"
                    >
                        <div className="mb-8 relative">
                            <div className="w-32 h-32 mx-auto bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mb-6">
                                <Shield className="w-16 h-16 text-white" />
                            </div>
                            <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                                className="absolute top-0 left-1/2 transform -translate-x-1/2 w-40 h-40 border-2 border-dashed border-blue-300 rounded-full"
                            />
                        </div>
                        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
                            NITDA SRAP 2.0
                        </h1>
                        <p className="text-xl text-gray-600 dark:text-gray-300 mb-6">
                            Smart Tracking Dashboard
                        </p>
                        <p className="text-gray-500 dark:text-gray-400">
                            Empowering Nigeria's digital transformation through intelligent data analytics and secure monitoring systems.
                        </p>
                    </motion.div>
                </div>

                {/* Right Side - Login Form */}
                <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="w-full max-w-md"
                    >
                        <Card className="shadow-2xl border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
                            <CardHeader className="text-center pb-6">
                                <div className="flex items-center justify-center mb-4">
                                    <Zap className="w-8 h-8 text-blue-600 mr-2" />
                                    <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white">
                                        Welcome Back
                                    </CardTitle>
                                </div>
                                <CardDescription className="text-gray-600 dark:text-gray-400">
                                    Sign in to access your SRAP 2.0 dashboard
                                </CardDescription>
                            </CardHeader>

                            <CardContent>
                                {status && (
                                    <motion.div 
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="mb-4 p-3 bg-green-50 border border-green-200 text-green-700 rounded-md text-sm"
                                    >
                                        {status}
                                    </motion.div>
                                )}

                                <form onSubmit={submit} className="space-y-6">
                                    <div className="space-y-2">
                                        <label htmlFor="email" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                            Email Address
                                        </label>
                                        <Input
                                            id="email"
                                            type="email"
                                            value={data.email}
                                            onChange={(e) => setData('email', e.target.value)}
                                            placeholder="Enter your email"
                                            className="h-12"
                                            autoComplete="username"
                                            autoFocus
                                        />
                                        {errors.email && (
                                            <p className="text-sm text-red-600 dark:text-red-400">{errors.email}</p>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <label htmlFor="password" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                            Password
                                        </label>
                                        <div className="relative">
                                            <Input
                                                id="password"
                                                type={showPassword ? 'text' : 'password'}
                                                value={data.password}
                                                onChange={(e) => setData('password', e.target.value)}
                                                placeholder="Enter your password"
                                                className="h-12 pr-10"
                                                autoComplete="current-password"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowPassword(!showPassword)}
                                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                                            >
                                                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                            </button>
                                        </div>
                                        {errors.password && (
                                            <p className="text-sm text-red-600 dark:text-red-400">{errors.password}</p>
                                        )}
                                    </div>

                                    <div className="flex items-center justify-between">
                                        <label className="flex items-center">
                                            <input
                                                type="checkbox"
                                                checked={data.remember}
                                                onChange={(e) => setData('remember', e.target.checked)}
                                                className="rounded border-gray-300 text-blue-600 shadow-sm focus:ring-blue-500"
                                            />
                                            <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">Remember me</span>
                                        </label>
                                        
                                        {canResetPassword && (
                                            <Link
                                                href="/forgot-password"
                                                className="text-sm text-blue-600 hover:text-blue-500 font-medium"
                                            >
                                                Forgot password?
                                            </Link>
                                        )}
                                    </div>

                                    <Button
                                        type="submit"
                                        disabled={processing}
                                        className="w-full h-12 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium rounded-md transition-all duration-200"
                                    >
                                        {processing ? (
                                            <div className="flex items-center">
                                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                                                Signing in...
                                            </div>
                                        ) : (
                                            'Sign In'
                                        )}
                                    </Button>
                                </form>

                                <div className="mt-6 text-center">
                                    <p className="text-sm text-gray-600 dark:text-gray-400">
                                        Don't have an account?{' '}
                                        <Link
                                            href="/register"
                                            className="text-blue-600 hover:text-blue-500 font-medium"
                                        >
                                            Sign up here
                                        </Link>
                                    </p>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                </div>
            </div>
        </div>
    );
}
