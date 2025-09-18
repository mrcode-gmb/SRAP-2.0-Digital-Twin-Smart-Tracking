import { Head, Link } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { Shield, ArrowLeft, Home } from 'lucide-react';
import { Button } from '@/Components/ui/Button';

export default function Error403() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center px-4">
            <Head title="403 - Access Denied" />
            
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="max-w-md w-full text-center"
            >
                {/* Error Icon */}
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="mx-auto mb-8"
                >
                    <div className="relative">
                        <div className="w-32 h-32 mx-auto bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center">
                            <Shield className="w-16 h-16 text-red-600 dark:text-red-400" />
                        </div>
                        <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                            className="absolute inset-0 border-4 border-red-200 dark:border-red-800 border-t-red-500 dark:border-t-red-400 rounded-full"
                        />
                    </div>
                </motion.div>

                {/* Error Message */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.3 }}
                    className="mb-8"
                >
                    <h1 className="text-6xl font-bold text-gray-900 dark:text-white mb-4">403</h1>
                    <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
                        Access Denied
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400 mb-2">
                        You don't have permission to access this resource.
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-500">
                        Please contact your administrator if you believe this is an error.
                    </p>
                </motion.div>

                {/* Action Buttons */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                    className="space-y-4"
                >
                    <div className="flex flex-col sm:flex-row gap-3 justify-center">
                        <Button
                            onClick={() => window.history.back()}
                            variant="outline"
                            className="flex items-center justify-center"
                        >
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Go Back
                        </Button>
                        <Link href="/dashboard">
                            <Button className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 flex items-center justify-center">
                                <Home className="w-4 h-4 mr-2" />
                                Dashboard
                            </Button>
                        </Link>
                    </div>
                </motion.div>

                {/* Additional Info */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.6, delay: 0.6 }}
                    className="mt-12 p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700"
                >
                    <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
                        Need Help?
                    </h3>
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                        If you believe you should have access to this page, please contact your system administrator 
                        or check if you're logged in with the correct role.
                    </p>
                </motion.div>

                {/* Animated Background Elements */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <motion.div
                        animate={{ 
                            x: [0, 100, 0],
                            y: [0, -100, 0],
                            rotate: [0, 180, 360]
                        }}
                        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                        className="absolute top-1/4 left-1/4 w-2 h-2 bg-red-300 dark:bg-red-700 rounded-full opacity-20"
                    />
                    <motion.div
                        animate={{ 
                            x: [0, -50, 0],
                            y: [0, 100, 0],
                            rotate: [360, 180, 0]
                        }}
                        transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                        className="absolute top-3/4 right-1/4 w-3 h-3 bg-red-400 dark:bg-red-600 rounded-full opacity-20"
                    />
                </div>
            </motion.div>
        </div>
    );
}
