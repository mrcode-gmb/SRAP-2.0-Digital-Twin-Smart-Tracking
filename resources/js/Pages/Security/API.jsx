import { Head, Link } from '@inertiajs/react';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
    Shield, 
    Key, 
    Activity, 
    AlertTriangle, 
    CheckCircle, 
    Clock,
    Database,
    Server,
    Lock,
    Eye,
    RefreshCw
} from 'lucide-react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/Components/ui/Card';
import { Button } from '@/Components/ui/Button';
import { Badge } from '@/Components/ui/Badge';

export default function SecurityAPI() {
    const [refreshing, setRefreshing] = useState(false);

    const handleRefresh = () => {
        setRefreshing(true);
        setTimeout(() => setRefreshing(false), 2000);
    };

    // Mock data for API monitoring
    const apiEndpoints = [
        { 
            id: 1, 
            endpoint: '/api/kpis', 
            method: 'GET', 
            status: 'healthy', 
            responseTime: 45, 
            requests24h: 1247,
            lastCheck: '2 minutes ago'
        },
        { 
            id: 2, 
            endpoint: '/api/milestones', 
            method: 'POST', 
            status: 'healthy', 
            responseTime: 89, 
            requests24h: 432,
            lastCheck: '1 minute ago'
        },
        { 
            id: 3, 
            endpoint: '/api/reports', 
            method: 'GET', 
            status: 'warning', 
            responseTime: 234, 
            requests24h: 89,
            lastCheck: '5 minutes ago'
        },
        { 
            id: 4, 
            endpoint: '/api/auth/login', 
            method: 'POST', 
            status: 'healthy', 
            responseTime: 67, 
            requests24h: 156,
            lastCheck: '30 seconds ago'
        }
    ];

    const securityMetrics = [
        { label: 'Active API Keys', value: 23, status: 'normal', icon: Key },
        { label: 'Failed Auth Attempts', value: 12, status: 'warning', icon: AlertTriangle },
        { label: 'Rate Limit Hits', value: 3, status: 'normal', icon: Shield },
        { label: 'Blocked IPs', value: 7, status: 'critical', icon: Lock }
    ];

    const getStatusBadge = (status) => {
        const colors = {
            healthy: 'bg-green-100 text-green-800',
            warning: 'bg-yellow-100 text-yellow-800',
            critical: 'bg-red-100 text-red-800',
            down: 'bg-gray-100 text-gray-800'
        };
        
        return <Badge className={colors[status] || 'bg-gray-100 text-gray-800'}>
            {status.charAt(0).toUpperCase() + status.slice(1)}
        </Badge>;
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'healthy':
                return <CheckCircle className="w-5 h-5 text-green-500" />;
            case 'warning':
                return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
            case 'critical':
                return <AlertTriangle className="w-5 h-5 text-red-500" />;
            default:
                return <Clock className="w-5 h-5 text-gray-500" />;
        }
    };

    const getMetricColor = (status) => {
        switch (status) {
            case 'normal':
                return 'text-green-600';
            case 'warning':
                return 'text-yellow-600';
            case 'critical':
                return 'text-red-600';
            default:
                return 'text-gray-600';
        }
    };

    return (
        <AuthenticatedLayout>
            <Head title="API Security Monitoring" />

            <div className="px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="mb-8"
                >
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                                API Security Monitoring
                            </h1>
                            <p className="mt-2 text-gray-600 dark:text-gray-400">
                                Monitor API endpoints, security metrics, and access patterns
                            </p>
                        </div>
                        <div className="mt-4 sm:mt-0">
                            <Button 
                                onClick={handleRefresh}
                                disabled={refreshing}
                                className="flex items-center gap-2"
                            >
                                <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
                                Refresh Data
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
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.1 + index * 0.1 }}
                        >
                            <Card>
                                <CardContent className="p-6">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                                                {metric.label}
                                            </p>
                                            <p className={`text-2xl font-bold ${getMetricColor(metric.status)}`}>
                                                {metric.value}
                                            </p>
                                        </div>
                                        <div className={`p-3 rounded-full ${
                                            metric.status === 'normal' ? 'bg-green-100' :
                                            metric.status === 'warning' ? 'bg-yellow-100' : 'bg-red-100'
                                        }`}>
                                            <metric.icon className={`w-6 h-6 ${getMetricColor(metric.status)}`} />
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>
                    ))}
                </motion.div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* API Endpoints Status */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                    >
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center space-x-2">
                                    <Server className="w-5 h-5" />
                                    <span>API Endpoints</span>
                                </CardTitle>
                                <CardDescription>
                                    Real-time monitoring of API endpoint health and performance
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {apiEndpoints.map((endpoint) => (
                                        <div key={endpoint.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                                            <div className="flex items-start justify-between mb-3">
                                                <div className="flex items-center space-x-3">
                                                    {getStatusIcon(endpoint.status)}
                                                    <div>
                                                        <div className="flex items-center space-x-2">
                                                            <span className="font-mono text-sm font-medium">
                                                                {endpoint.method}
                                                            </span>
                                                            <span className="text-sm text-gray-600 dark:text-gray-400">
                                                                {endpoint.endpoint}
                                                            </span>
                                                        </div>
                                                        <div className="text-xs text-gray-500 mt-1">
                                                            Last checked: {endpoint.lastCheck}
                                                        </div>
                                                    </div>
                                                </div>
                                                {getStatusBadge(endpoint.status)}
                                            </div>
                                            
                                            <div className="grid grid-cols-2 gap-4 text-sm">
                                                <div>
                                                    <span className="text-gray-600 dark:text-gray-400">Response Time:</span>
                                                    <span className={`ml-2 font-medium ${
                                                        endpoint.responseTime < 100 ? 'text-green-600' :
                                                        endpoint.responseTime < 200 ? 'text-yellow-600' : 'text-red-600'
                                                    }`}>
                                                        {endpoint.responseTime}ms
                                                    </span>
                                                </div>
                                                <div>
                                                    <span className="text-gray-600 dark:text-gray-400">24h Requests:</span>
                                                    <span className="ml-2 font-medium text-gray-900 dark:text-white">
                                                        {endpoint.requests24h.toLocaleString()}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>

                    {/* Security Events */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6, delay: 0.3 }}
                    >
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center space-x-2">
                                    <Shield className="w-5 h-5" />
                                    <span>Recent Security Events</span>
                                </CardTitle>
                                <CardDescription>
                                    Latest security alerts and authentication events
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    <div className="border-l-4 border-red-500 pl-4 py-2">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="font-medium text-red-800 dark:text-red-200">
                                                    Multiple failed login attempts
                                                </p>
                                                <p className="text-sm text-red-600 dark:text-red-400">
                                                    IP: 192.168.1.100 - 5 attempts in 2 minutes
                                                </p>
                                            </div>
                                            <span className="text-xs text-gray-500">2 min ago</span>
                                        </div>
                                    </div>
                                    
                                    <div className="border-l-4 border-yellow-500 pl-4 py-2">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="font-medium text-yellow-800 dark:text-yellow-200">
                                                    Rate limit exceeded
                                                </p>
                                                <p className="text-sm text-yellow-600 dark:text-yellow-400">
                                                    API key: ...abc123 exceeded 1000 req/hour
                                                </p>
                                            </div>
                                            <span className="text-xs text-gray-500">15 min ago</span>
                                        </div>
                                    </div>
                                    
                                    <div className="border-l-4 border-green-500 pl-4 py-2">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="font-medium text-green-800 dark:text-green-200">
                                                    New API key generated
                                                </p>
                                                <p className="text-sm text-green-600 dark:text-green-400">
                                                    User: admin@nitda.gov.ng
                                                </p>
                                            </div>
                                            <span className="text-xs text-gray-500">1 hour ago</span>
                                        </div>
                                    </div>
                                    
                                    <div className="border-l-4 border-blue-500 pl-4 py-2">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="font-medium text-blue-800 dark:text-blue-200">
                                                    SSL certificate renewed
                                                </p>
                                                <p className="text-sm text-blue-600 dark:text-blue-400">
                                                    Domain: api.srap.nitda.gov.ng
                                                </p>
                                            </div>
                                            <span className="text-xs text-gray-500">3 hours ago</span>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                </div>

                {/* API Keys Management */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                    className="mt-8"
                >
                    <Card>
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <div>
                                    <CardTitle className="flex items-center space-x-2">
                                        <Key className="w-5 h-5" />
                                        <span>API Key Management</span>
                                    </CardTitle>
                                    <CardDescription>
                                        Monitor and manage API keys and access permissions
                                    </CardDescription>
                                </div>
                                <Button variant="outline">
                                    <Eye className="w-4 h-4 mr-2" />
                                    View All Keys
                                </Button>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead>
                                        <tr className="border-b border-gray-200 dark:border-gray-700">
                                            <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">
                                                Key Name
                                            </th>
                                            <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">
                                                User
                                            </th>
                                            <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">
                                                Last Used
                                            </th>
                                            <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">
                                                Requests (24h)
                                            </th>
                                            <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">
                                                Status
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr className="border-b border-gray-100 dark:border-gray-800">
                                            <td className="py-3 px-4 font-mono text-sm">srap-prod-***abc123</td>
                                            <td className="py-3 px-4 text-sm">admin@nitda.gov.ng</td>
                                            <td className="py-3 px-4 text-sm">2 minutes ago</td>
                                            <td className="py-3 px-4 text-sm">1,247</td>
                                            <td className="py-3 px-4">
                                                <Badge className="bg-green-100 text-green-800">Active</Badge>
                                            </td>
                                        </tr>
                                        <tr className="border-b border-gray-100 dark:border-gray-800">
                                            <td className="py-3 px-4 font-mono text-sm">srap-dev-***def456</td>
                                            <td className="py-3 px-4 text-sm">dev@nitda.gov.ng</td>
                                            <td className="py-3 px-4 text-sm">1 hour ago</td>
                                            <td className="py-3 px-4 text-sm">89</td>
                                            <td className="py-3 px-4">
                                                <Badge className="bg-green-100 text-green-800">Active</Badge>
                                            </td>
                                        </tr>
                                        <tr className="border-b border-gray-100 dark:border-gray-800">
                                            <td className="py-3 px-4 font-mono text-sm">srap-test-***ghi789</td>
                                            <td className="py-3 px-4 text-sm">test@nitda.gov.ng</td>
                                            <td className="py-3 px-4 text-sm">3 days ago</td>
                                            <td className="py-3 px-4 text-sm">12</td>
                                            <td className="py-3 px-4">
                                                <Badge className="bg-yellow-100 text-yellow-800">Inactive</Badge>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>
            </div>
        </AuthenticatedLayout>
    );
}
