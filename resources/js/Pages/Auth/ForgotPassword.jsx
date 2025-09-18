import { Head, Link, useForm } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { Mail, ArrowLeft, Shield } from 'lucide-react';
import { Button } from '@/Components/ui/Button';
import { Input } from '@/Components/ui/Input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/Components/ui/Card';

export default function ForgotPassword({ status }) {
    const { data, setData, post, processing, errors } = useForm({
        email: '',
    });

    const submit = (e) => {
        e.preventDefault();
        post('/forgot-password');
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-blue-900 dark:to-indigo-900">
            <Head title="Forgot Password - NITDA SRAP 2.0" />
            
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
                            <div className="w-32 h-32 mx-auto bg-gradient-to-r from-orange-500 to-red-600 rounded-full flex items-center justify-center mb-6">
                                <Mail className="w-16 h-16 text-white" />
                            </div>
                            <motion.div
                                animate={{ y: [-10, 10, -10] }}
                                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                                className="absolute top-0 left-1/2 transform -translate-x-1/2 w-40 h-40 border-2 border-dashed border-orange-300 rounded-full"
                            />
                        </div>
                        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
                            Password Recovery
                        </h1>
                        <p className="text-xl text-gray-600 dark:text-gray-300 mb-6">
                            SRAP 2.0 Security
                        </p>
                        <p className="text-gray-500 dark:text-gray-400">
                            We'll send you a secure link to reset your password and regain access to your dashboard.
                        </p>
                    </motion.div>
                </div>

                {/* Right Side - Forgot Password Form */}
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
                                    <Shield className="w-8 h-8 text-orange-600 mr-2" />
                                    <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white">
                                        Reset Password
                                    </CardTitle>
                                </div>
                                <CardDescription className="text-gray-600 dark:text-gray-400">
                                    Enter your email address and we'll send you a password reset link
                                </CardDescription>
                            </CardHeader>

                            <CardContent>
                                {status && (
                                    <motion.div 
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="mb-6 p-4 bg-green-50 border border-green-200 text-green-700 rounded-md text-sm"
                                    >
                                        <div className="flex items-center">
                                            <Mail className="w-4 h-4 mr-2" />
                                            {status}
                                        </div>
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
                                            placeholder="Enter your email address"
                                            className="h-12"
                                            autoComplete="username"
                                            autoFocus
                                        />
                                        {errors.email && (
                                            <p className="text-sm text-red-600 dark:text-red-400">{errors.email}</p>
                                        )}
                                    </div>

                                    <Button
                                        type="submit"
                                        disabled={processing}
                                        className="w-full h-12 bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white font-medium rounded-md transition-all duration-200"
                                    >
                                        {processing ? (
                                            <div className="flex items-center">
                                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                                                Sending Reset Link...
                                            </div>
                                        ) : (
                                            <div className="flex items-center">
                                                <Mail className="w-4 h-4 mr-2" />
                                                Send Password Reset Link
                                            </div>
                                        )}
                                    </Button>
                                </form>

                                <div className="mt-6 text-center">
                                    <Link
                                        href="/login"
                                        className="inline-flex items-center text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white font-medium"
                                    >
                                        <ArrowLeft className="w-4 h-4 mr-1" />
                                        Back to Login
                                    </Link>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                </div>
            </div>
        </div>
    );
}
