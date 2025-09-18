import { Head, Link, useForm } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { Eye, EyeOff, UserPlus, Zap } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/Components/ui/Button';
import { Input } from '@/Components/ui/Input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/Components/ui/Card';
import { getRoleConfig } from '@/lib/utils';

export default function Register() {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
        role: 'researcher',
    });

    const submit = (e) => {
        e.preventDefault();
        post('/register', {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    const roles = [
        { value: 'admin', label: 'Administrator' },
        { value: 'researcher', label: 'Researcher' },
        { value: 'data_analyst', label: 'Data Analyst' },
        { value: 'cybersecurity_specialist', label: 'Cybersecurity Specialist' },
        { value: 'ai_developer', label: 'AI Developer' },
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-blue-900 dark:to-indigo-900">
            <Head title="Register - NITDA SRAP 2.0" />
            
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
                            <div className="w-32 h-32 mx-auto bg-gradient-to-r from-green-500 to-blue-600 rounded-full flex items-center justify-center mb-6">
                                <UserPlus className="w-16 h-16 text-white" />
                            </div>
                            <motion.div
                                animate={{ scale: [1, 1.1, 1] }}
                                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                                className="absolute top-0 left-1/2 transform -translate-x-1/2 w-40 h-40 border-2 border-dashed border-green-300 rounded-full"
                            />
                        </div>
                        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
                            Join SRAP 2.0
                        </h1>
                        <p className="text-xl text-gray-600 dark:text-gray-300 mb-6">
                            Digital Twin Platform
                        </p>
                        <p className="text-gray-500 dark:text-gray-400">
                            Create your account to access advanced analytics, secure monitoring, and intelligent tracking capabilities.
                        </p>
                    </motion.div>
                </div>

                {/* Right Side - Register Form */}
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
                                    <Zap className="w-8 h-8 text-green-600 mr-2" />
                                    <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white">
                                        Create Account
                                    </CardTitle>
                                </div>
                                <CardDescription className="text-gray-600 dark:text-gray-400">
                                    Sign up to get started with SRAP 2.0
                                </CardDescription>
                            </CardHeader>

                            <CardContent>
                                <form onSubmit={submit} className="space-y-4">
                                    <div className="space-y-2">
                                        <label htmlFor="name" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                            Full Name
                                        </label>
                                        <Input
                                            id="name"
                                            type="text"
                                            value={data.name}
                                            onChange={(e) => setData('name', e.target.value)}
                                            placeholder="Enter your full name"
                                            className="h-12"
                                            autoComplete="name"
                                            autoFocus
                                        />
                                        {errors.name && (
                                            <p className="text-sm text-red-600 dark:text-red-400">{errors.name}</p>
                                        )}
                                    </div>

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
                                        />
                                        {errors.email && (
                                            <p className="text-sm text-red-600 dark:text-red-400">{errors.email}</p>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <label htmlFor="role" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                            Role
                                        </label>
                                        <select
                                            id="role"
                                            value={data.role}
                                            onChange={(e) => setData('role', e.target.value)}
                                            className="h-12 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                                        >
                                            {roles.map((role) => (
                                                <option key={role.value} value={role.value}>
                                                    {role.label}
                                                </option>
                                            ))}
                                        </select>
                                        {errors.role && (
                                            <p className="text-sm text-red-600 dark:text-red-400">{errors.role}</p>
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
                                                placeholder="Create a password"
                                                className="h-12 pr-10"
                                                autoComplete="new-password"
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

                                    <div className="space-y-2">
                                        <label htmlFor="password_confirmation" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                            Confirm Password
                                        </label>
                                        <div className="relative">
                                            <Input
                                                id="password_confirmation"
                                                type={showConfirmPassword ? 'text' : 'password'}
                                                value={data.password_confirmation}
                                                onChange={(e) => setData('password_confirmation', e.target.value)}
                                                placeholder="Confirm your password"
                                                className="h-12 pr-10"
                                                autoComplete="new-password"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                                            >
                                                {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                            </button>
                                        </div>
                                        {errors.password_confirmation && (
                                            <p className="text-sm text-red-600 dark:text-red-400">{errors.password_confirmation}</p>
                                        )}
                                    </div>

                                    <Button
                                        type="submit"
                                        disabled={processing}
                                        className="w-full h-12 bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white font-medium rounded-md transition-all duration-200 mt-6"
                                    >
                                        {processing ? (
                                            <div className="flex items-center">
                                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                                                Creating Account...
                                            </div>
                                        ) : (
                                            'Create Account'
                                        )}
                                    </Button>
                                </form>

                                <div className="mt-6 text-center">
                                    <p className="text-sm text-gray-600 dark:text-gray-400">
                                        Already have an account?{' '}
                                        <Link
                                            href="/login"
                                            className="text-blue-600 hover:text-blue-500 font-medium"
                                        >
                                            Sign in here
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
