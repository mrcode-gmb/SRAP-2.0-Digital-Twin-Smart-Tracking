import { Head } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { 
    TrendingUp, 
    Target,
    CheckCircle,
    AlertTriangle,
    Activity,
    BarChart3,
    PieChart,
    LineChart,
    Calendar,
    Filter,
    Download,
    RefreshCw,
    ArrowUpRight,
    ArrowDownRight,
    Users,
    Database,
    Globe,
    Zap
} from 'lucide-react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/Components/ui/Card';
import { Button } from '@/Components/ui/Button';
import { Badge } from '@/Components/ui/Badge';

export default function KPI() {
    // KPI Performance Data
    const kpiMetrics = [
        {
            id: 1,
            name: 'User Engagement Rate',
            current: 78.5,
            target: 80.0,
            trend: 'up',
            change: '+5.2%',
            status: 'on-track',
            category: 'User Experience',
            lastUpdated: '2 hours ago'
        },
        {
            id: 2,
            name: 'System Response Time',
            current: 142,
            target: 150,
            trend: 'up',
            change: '+8ms',
            status: 'at-risk',
            category: 'Performance',
            unit: 'ms',
            lastUpdated: '15 minutes ago'
        },
        {
            id: 3,
            name: 'Data Processing Accuracy',
            current: 99.7,
            target: 99.5,
            trend: 'up',
            change: '+0.3%',
            status: 'exceeding',
            category: 'Quality',
            lastUpdated: '1 hour ago'
        },
        {
            id: 4,
            name: 'API Uptime',
            current: 99.98,
            target: 99.9,
            trend: 'stable',
            change: '0%',
            status: 'exceeding',
            category: 'Reliability',
            lastUpdated: '30 minutes ago'
        },
        {
            id: 5,
            name: 'Security Incidents',
            current: 2,
            target: 5,
            trend: 'down',
            change: '-60%',
            status: 'exceeding',
            category: 'Security',
            lastUpdated: '4 hours ago'
        },
        {
            id: 6,
            name: 'User Satisfaction Score',
            current: 4.6,
            target: 4.5,
            trend: 'up',
            change: '+0.2',
            status: 'exceeding',
            category: 'User Experience',
            unit: '/5',
            lastUpdated: '6 hours ago'
        }
    ];

    const getStatusColor = (status) => {
        switch (status) {
            case 'exceeding':
                return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
            case 'on-track':
                return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
            case 'at-risk':
                return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
            case 'critical':
                return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
            default:
                return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
        }
    };

    const getCategoryColor = (category) => {
        switch (category) {
            case 'User Experience':
                return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300';
            case 'Performance':
                return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
            case 'Quality':
                return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
            case 'Reliability':
                return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300';
            case 'Security':
                return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
            default:
                return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
        }
    };

    const getProgressPercentage = (current, target) => {
        return Math.min((current / target) * 100, 100);
    };

    const summaryStats = [
        {
            title: 'Total KPIs',
            value: '24',
            icon: Target,
            color: 'text-blue-600'
        },
        {
            title: 'Exceeding Target',
            value: '12',
            icon: CheckCircle,
            color: 'text-green-600'
        },
        {
            title: 'On Track',
            value: '8',
            icon: Activity,
            color: 'text-blue-600'
        },
        {
            title: 'At Risk',
            value: '4',
            icon: AlertTriangle,
            color: 'text-yellow-600'
        }
    ];

    return (
        <AuthenticatedLayout>
            <Head title="KPI Performance Metrics - SRAP 2.0" />

            <div className="px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="mb-8"
                >
                    <div className="bg-gradient-to-r from-teal-600 to-teal-800 rounded-2xl p-8 text-white">
                        <div className="flex items-center justify-between">
                            <div>
                                <h1 className="text-3xl font-bold mb-2">KPI Performance Metrics</h1>
                                <p className="text-teal-100">
                                    Track and analyze key performance indicators across all system components
                                </p>
                            </div>
                            <div className="hidden md:block">
                                <TrendingUp className="w-16 h-16 text-teal-200" />
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Summary Stats */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.1 }}
                    className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8"
                >
                    {summaryStats.map((stat, index) => {
                        const IconComponent = stat.icon;
                        return (
                            <Card key={stat.title} className="border-0 shadow-lg">
                                <CardContent className="p-6">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                                                {stat.title}
                                            </p>
                                            <p className="text-3xl font-bold text-gray-900 dark:text-white">
                                                {stat.value}
                                            </p>
                                        </div>
                                        <div className="p-3 bg-gray-100 dark:bg-gray-800 rounded-xl">
                                            <IconComponent className={`w-6 h-6 ${stat.color}`} />
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        );
                    })}
                </motion.div>

                {/* Action Buttons */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="flex flex-wrap gap-4 mb-8"
                >
                    <Button className="bg-gradient-to-r from-teal-600 to-teal-700 hover:from-teal-700 hover:to-teal-800">
                        <RefreshCw className="w-4 h-4 mr-2" />
                        Refresh Data
                    </Button>
                    <Button variant="outline">
                        <Filter className="w-4 h-4 mr-2" />
                        Filter KPIs
                    </Button>
                    <Button variant="outline">
                        <Download className="w-4 h-4 mr-2" />
                        Export Report
                    </Button>
                    <Button variant="outline">
                        <Calendar className="w-4 h-4 mr-2" />
                        Schedule Report
                    </Button>
                </motion.div>

                {/* KPI Metrics Grid */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.3 }}
                    className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8"
                >
                    {kpiMetrics.map((kpi, index) => (
                        <motion.div
                            key={kpi.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
                        >
                            <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                                <CardContent className="p-6">
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="flex-1">
                                            <div className="flex items-center space-x-3 mb-2">
                                                <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                                                    {kpi.name}
                                                </h3>
                                                <Badge className={getStatusColor(kpi.status)}>
                                                    {kpi.status.replace('-', ' ')}
                                                </Badge>
                                            </div>
                                            <Badge variant="outline" className={getCategoryColor(kpi.category)}>
                                                {kpi.category}
                                            </Badge>
                                        </div>
                                        <div className={`flex items-center text-sm font-medium ${
                                            kpi.trend === 'up' ? 'text-green-600' : 
                                            kpi.trend === 'down' ? 'text-red-600' : 'text-gray-600'
                                        }`}>
                                            {kpi.trend === 'up' ? (
                                                <ArrowUpRight className="w-4 h-4 mr-1" />
                                            ) : kpi.trend === 'down' ? (
                                                <ArrowDownRight className="w-4 h-4 mr-1" />
                                            ) : null}
                                            {kpi.change}
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                                                    {kpi.current}{kpi.unit || '%'}
                                                </p>
                                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                                    Target: {kpi.target}{kpi.unit || '%'}
                                                </p>
                                            </div>
                                        </div>

                                        {/* Progress Bar */}
                                        <div className="space-y-2">
                                            <div className="flex justify-between text-sm">
                                                <span className="text-gray-600 dark:text-gray-400">Progress to Target</span>
                                                <span className="font-medium text-gray-900 dark:text-white">
                                                    {Math.round(getProgressPercentage(kpi.current, kpi.target))}%
                                                </span>
                                            </div>
                                            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                                                <div
                                                    className={`h-2 rounded-full transition-all duration-500 ${
                                                        kpi.status === 'exceeding' ? 'bg-green-500' :
                                                        kpi.status === 'on-track' ? 'bg-blue-500' :
                                                        kpi.status === 'at-risk' ? 'bg-yellow-500' : 'bg-red-500'
                                                    }`}
                                                    style={{ width: `${Math.min(getProgressPercentage(kpi.current, kpi.target), 100)}%` }}
                                                />
                                            </div>
                                        </div>

                                        <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                                            <span>Last updated: {kpi.lastUpdated}</span>
                                            <Button variant="ghost" size="sm">
                                                <BarChart3 className="w-4 h-4 mr-1" />
                                                View Details
                                            </Button>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>
                    ))}
                </motion.div>

                {/* Quick Insights */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                    className="grid grid-cols-1 lg:grid-cols-3 gap-6"
                >
                    {/* Performance Trends */}
                    <Card className="border-0 shadow-lg">
                        <CardHeader className="pb-3">
                            <CardTitle className="flex items-center text-lg">
                                <LineChart className="w-5 h-5 mr-2 text-blue-500" />
                                Performance Trends
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-gray-600 dark:text-gray-400">This Week</span>
                                    <div className="flex items-center text-green-600">
                                        <ArrowUpRight className="w-4 h-4 mr-1" />
                                        <span className="text-sm font-medium">+12%</span>
                                    </div>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-gray-600 dark:text-gray-400">This Month</span>
                                    <div className="flex items-center text-green-600">
                                        <ArrowUpRight className="w-4 h-4 mr-1" />
                                        <span className="text-sm font-medium">+8%</span>
                                    </div>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-gray-600 dark:text-gray-400">This Quarter</span>
                                    <div className="flex items-center text-green-600">
                                        <ArrowUpRight className="w-4 h-4 mr-1" />
                                        <span className="text-sm font-medium">+15%</span>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Top Performers */}
                    <Card className="border-0 shadow-lg">
                        <CardHeader className="pb-3">
                            <CardTitle className="flex items-center text-lg">
                                <CheckCircle className="w-5 h-5 mr-2 text-green-500" />
                                Top Performers
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-gray-600 dark:text-gray-400">Data Processing Accuracy</span>
                                    <span className="text-sm font-bold text-green-600">99.7%</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-gray-600 dark:text-gray-400">API Uptime</span>
                                    <span className="text-sm font-bold text-green-600">99.98%</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-gray-600 dark:text-gray-400">User Satisfaction</span>
                                    <span className="text-sm font-bold text-green-600">4.6/5</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Alerts & Recommendations */}
                    <Card className="border-0 shadow-lg">
                        <CardHeader className="pb-3">
                            <CardTitle className="flex items-center text-lg">
                                <AlertTriangle className="w-5 h-5 mr-2 text-yellow-500" />
                                Recommendations
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-3">
                                <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                                    <p className="text-sm font-medium text-yellow-800 dark:text-yellow-300">
                                        System Response Time
                                    </p>
                                    <p className="text-xs text-yellow-600 dark:text-yellow-400 mt-1">
                                        Consider optimizing database queries
                                    </p>
                                </div>
                                <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                                    <p className="text-sm font-medium text-blue-800 dark:text-blue-300">
                                        User Engagement
                                    </p>
                                    <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">
                                        Close to target, maintain current strategy
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>
            </div>
        </AuthenticatedLayout>
    );
}
