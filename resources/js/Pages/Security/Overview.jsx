import { Head } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { Shield, AlertTriangle, CheckCircle, Activity, Eye, Lock, Server } from 'lucide-react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/Components/ui/Card';
import { Button } from '@/Components/ui/Button';
import { Badge } from '@/Components/ui/Badge';

export default function SecurityOverview() {
    // Mock security data
    const securityMetrics = [
        { name: 'Security Score', value: 96, status: 'excellent', icon: Shield },
        { name: 'Active Threats', value: 2, status: 'warning', icon: AlertTriangle },
        { name: 'Blocked Attacks', value: 147, status: 'good', icon: CheckCircle },
        { name: 'System Uptime', value: 99.9, status: 'excellent', icon: Activity },
    ];

    const securityAlerts = [
        { id: 1, type: 'warning', message: 'Unusual login pattern detected from IP 192.168.1.100', time: '5 minutes ago', severity: 'medium' },
        { id: 2, type: 'info', message: 'Security patch applied successfully', time: '2 hours ago', severity: 'low' },
        { id: 3, type: 'critical', message: 'Multiple failed login attempts detected', time: '1 day ago', severity: 'high' },
        { id: 4, type: 'success', message: 'Firewall rules updated', time: '2 days ago', severity: 'low' },
    ];

    const apiStatus = [
        { name: 'Authentication API', status: 'operational', responseTime: '45ms', uptime: '99.98%' },
        { name: 'Data Processing API', status: 'operational', responseTime: '120ms', uptime: '99.95%' },
        { name: 'Analytics API', status: 'degraded', responseTime: '340ms', uptime: '98.2%' },
        { name: 'Notification API', status: 'operational', responseTime: '78ms', uptime: '99.99%' },
    ];

    const getStatusColor = (status) => {
        switch (status) {
            case 'excellent':
            case 'operational':
                return 'text-green-600';
            case 'good':
                return 'text-blue-600';
            case 'warning':
            case 'degraded':
                return 'text-yellow-600';
            case 'critical':
                return 'text-red-600';
            default:
                return 'text-gray-600';
        }
    };

    const getAlertIcon = (type) => {
        switch (type) {
            case 'critical':
                return <AlertTriangle className="w-4 h-4 text-red-600" />;
            case 'warning':
                return <AlertTriangle className="w-4 h-4 text-yellow-600" />;
            case 'success':
                return <CheckCircle className="w-4 h-4 text-green-600" />;
            default:
                return <Activity className="w-4 h-4 text-blue-600" />;
        }
    };

    const getAlertColor = (severity) => {
        switch (severity) {
            case 'high':
                return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300';
            case 'medium':
                return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300';
            case 'low':
                return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300';
            default:
                return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-300';
        }
    };

    return (
        <AuthenticatedLayout>
            <Head title="Security Overview - Cybersecurity" />

            <div className="px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="mb-8"
                >
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center">
                                <Shield className="w-8 h-8 mr-3 text-blue-600" />
                                Security Overview
                            </h1>
                            <p className="text-gray-600 dark:text-gray-400 mt-2">
                                Monitor system security status and threat detection
                            </p>
                        </div>
                        <div className="flex items-center space-x-2">
                            <Button variant="outline">
                                <Eye className="w-4 h-4 mr-2" />
                                View Logs
                            </Button>
                            <Button className="bg-red-600 hover:bg-red-700">
                                <Lock className="w-4 h-4 mr-2" />
                                Security Scan
                            </Button>
                        </div>
                    </div>
                </motion.div>

                {/* Security Metrics */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.1 }}
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
                >
                    {securityMetrics.map((metric, index) => (
                        <Card key={metric.name} className="hover:shadow-md transition-shadow">
                            <CardContent className="p-6">
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">
                                        {metric.name}
                                    </h3>
                                    <metric.icon className={`w-6 h-6 ${getStatusColor(metric.status)}`} />
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-3xl font-bold text-gray-900 dark:text-white">
                                        {metric.value}{metric.name.includes('Score') || metric.name.includes('Uptime') ? '%' : ''}
                                    </span>
                                    <Badge className={
                                        metric.status === 'excellent' 
                                            ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300'
                                            : metric.status === 'warning'
                                            ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300'
                                            : 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300'
                                    }>
                                        {metric.status}
                                    </Badge>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </motion.div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Security Alerts */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                    >
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center">
                                    <AlertTriangle className="w-5 h-5 mr-2" />
                                    Security Alerts
                                </CardTitle>
                                <CardDescription>
                                    Recent security events and notifications
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {securityAlerts.map((alert, index) => (
                                        <motion.div
                                            key={alert.id}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ duration: 0.4, delay: index * 0.1 }}
                                            className="flex items-start space-x-3 p-4 border border-gray-200 dark:border-gray-700 rounded-lg"
                                        >
                                            {getAlertIcon(alert.type)}
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-medium text-gray-900 dark:text-white">
                                                    {alert.message}
                                                </p>
                                                <div className="flex items-center justify-between mt-2">
                                                    <span className="text-xs text-gray-500 dark:text-gray-400">
                                                        {alert.time}
                                                    </span>
                                                    <Badge className={getAlertColor(alert.severity)}>
                                                        {alert.severity}
                                                    </Badge>
                                                </div>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>

                    {/* API Status */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6, delay: 0.3 }}
                    >
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center">
                                    <Server className="w-5 h-5 mr-2" />
                                    API Status
                                </CardTitle>
                                <CardDescription>
                                    Real-time API performance monitoring
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {apiStatus.map((api, index) => (
                                        <motion.div
                                            key={api.name}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ duration: 0.4, delay: index * 0.1 }}
                                            className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg"
                                        >
                                            <div className="flex items-center space-x-3">
                                                <div className={`w-3 h-3 rounded-full ${
                                                    api.status === 'operational' ? 'bg-green-500' : 'bg-yellow-500'
                                                }`}></div>
                                                <div>
                                                    <p className="font-medium text-gray-900 dark:text-white">
                                                        {api.name}
                                                    </p>
                                                    <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
                                                        <span>{api.responseTime}</span>
                                                        <span>•</span>
                                                        <span>{api.uptime} uptime</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <Badge className={
                                                api.status === 'operational'
                                                    ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300'
                                                    : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300'
                                            }>
                                                {api.status}
                                            </Badge>
                                        </motion.div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                </div>

                {/* Security Recommendations */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                    className="mt-8"
                >
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center">
                                <CheckCircle className="w-5 h-5 mr-2" />
                                Security Recommendations
                            </CardTitle>
                            <CardDescription>
                                Suggested actions to improve system security
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-4">
                                    <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                                        <h4 className="font-medium text-blue-800 dark:text-blue-300 mb-2">
                                            Enable Two-Factor Authentication
                                        </h4>
                                        <p className="text-sm text-blue-700 dark:text-blue-400">
                                            Implement 2FA for all admin accounts to enhance security.
                                        </p>
                                    </div>
                                    <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                                        <h4 className="font-medium text-green-800 dark:text-green-300 mb-2">
                                            Update Security Policies
                                        </h4>
                                        <p className="text-sm text-green-700 dark:text-green-400">
                                            Review and update password policies quarterly.
                                        </p>
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
                                        <h4 className="font-medium text-yellow-800 dark:text-yellow-300 mb-2">
                                            Monitor API Performance
                                        </h4>
                                        <p className="text-sm text-yellow-700 dark:text-yellow-400">
                                            Analytics API showing degraded performance - investigate.
                                        </p>
                                    </div>
                                    <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-200 dark:border-purple-800">
                                        <h4 className="font-medium text-purple-800 dark:text-purple-300 mb-2">
                                            Security Training
                                        </h4>
                                        <p className="text-sm text-purple-700 dark:text-purple-400">
                                            Schedule security awareness training for all users.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>
            </div>
        </AuthenticatedLayout>
    );
}
