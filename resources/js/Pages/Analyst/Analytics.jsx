import { Head } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { BarChart3, TrendingUp, PieChart, Activity, Download, Filter } from 'lucide-react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/Components/ui/Card';
import { Button } from '@/Components/ui/Button';
import { Badge } from '@/Components/ui/Badge';

export default function AnalystAnalytics() {
    // Mock analytics data
    const kpiData = [
        { name: 'User Engagement', value: 87, change: '+12%', trend: 'up' },
        { name: 'Data Quality Score', value: 94, change: '+5%', trend: 'up' },
        { name: 'System Performance', value: 92, change: '-2%', trend: 'down' },
        { name: 'Research Completion', value: 78, change: '+18%', trend: 'up' },
    ];

    const chartData = [
        { month: 'Jan', value: 65 },
        { month: 'Feb', value: 78 },
        { month: 'Mar', value: 82 },
        { month: 'Apr', value: 91 },
        { month: 'May', value: 87 },
        { month: 'Jun', value: 95 },
    ];

    return (
        <AuthenticatedLayout>
            <Head title="KPI Analytics - Data Analyst" />

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
                                <BarChart3 className="w-8 h-8 mr-3 text-blue-600" />
                                KPI Analytics
                            </h1>
                            <p className="text-gray-600 dark:text-gray-400 mt-2">
                                Monitor key performance indicators and data insights
                            </p>
                        </div>
                        <div className="flex items-center space-x-2">
                            <Button variant="outline">
                                <Filter className="w-4 h-4 mr-2" />
                                Filter
                            </Button>
                            <Button className="bg-blue-600 hover:bg-blue-700">
                                <Download className="w-4 h-4 mr-2" />
                                Export Report
                            </Button>
                        </div>
                    </div>
                </motion.div>

                {/* KPI Cards */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.1 }}
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
                >
                    {kpiData.map((kpi, index) => (
                        <Card key={kpi.name} className="hover:shadow-md transition-shadow">
                            <CardContent className="p-6">
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">
                                        {kpi.name}
                                    </h3>
                                    <TrendingUp className={`w-4 h-4 ${
                                        kpi.trend === 'up' ? 'text-green-600' : 'text-red-600'
                                    }`} />
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-3xl font-bold text-gray-900 dark:text-white">
                                        {kpi.value}%
                                    </span>
                                    <Badge className={
                                        kpi.trend === 'up' 
                                            ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300'
                                            : 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300'
                                    }>
                                        {kpi.change}
                                    </Badge>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </motion.div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Performance Chart */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                    >
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center">
                                    <BarChart3 className="w-5 h-5 mr-2" />
                                    Performance Trends
                                </CardTitle>
                                <CardDescription>
                                    Monthly performance metrics over time
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="h-64 flex items-end justify-between space-x-2">
                                    {chartData.map((data, index) => (
                                        <div key={data.month} className="flex flex-col items-center flex-1">
                                            <motion.div
                                                initial={{ height: 0 }}
                                                animate={{ height: `${(data.value / 100) * 200}px` }}
                                                transition={{ duration: 0.8, delay: index * 0.1 }}
                                                className="bg-gradient-to-t from-blue-600 to-blue-400 rounded-t-md w-full mb-2"
                                            />
                                            <span className="text-xs text-gray-600 dark:text-gray-400">
                                                {data.month}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>

                    {/* Data Insights */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6, delay: 0.3 }}
                    >
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center">
                                    <Activity className="w-5 h-5 mr-2" />
                                    Key Insights
                                </CardTitle>
                                <CardDescription>
                                    Data-driven insights and recommendations
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                                        <div className="flex items-center mb-2">
                                            <TrendingUp className="w-4 h-4 text-green-600 mr-2" />
                                            <span className="font-medium text-green-800 dark:text-green-300">
                                                Positive Trend
                                            </span>
                                        </div>
                                        <p className="text-sm text-green-700 dark:text-green-400">
                                            Research completion rate increased by 18% this quarter, indicating improved workflow efficiency.
                                        </p>
                                    </div>

                                    <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                                        <div className="flex items-center mb-2">
                                            <BarChart3 className="w-4 h-4 text-blue-600 mr-2" />
                                            <span className="font-medium text-blue-800 dark:text-blue-300">
                                                Data Quality
                                            </span>
                                        </div>
                                        <p className="text-sm text-blue-700 dark:text-blue-400">
                                            Data quality score remains high at 94%, with consistent validation processes.
                                        </p>
                                    </div>

                                    <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
                                        <div className="flex items-center mb-2">
                                            <Activity className="w-4 h-4 text-yellow-600 mr-2" />
                                            <span className="font-medium text-yellow-800 dark:text-yellow-300">
                                                Attention Needed
                                            </span>
                                        </div>
                                        <p className="text-sm text-yellow-700 dark:text-yellow-400">
                                            System performance dropped by 2%. Consider optimizing database queries.
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                </div>

                {/* Data Summary Table */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                    className="mt-8"
                >
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center">
                                <PieChart className="w-5 h-5 mr-2" />
                                Data Summary
                            </CardTitle>
                            <CardDescription>
                                Detailed breakdown of key metrics
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead>
                                        <tr className="border-b border-gray-200 dark:border-gray-700">
                                            <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">Metric</th>
                                            <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">Current</th>
                                            <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">Target</th>
                                            <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr className="border-b border-gray-100 dark:border-gray-800">
                                            <td className="py-3 px-4 text-gray-900 dark:text-white">Data Processing Speed</td>
                                            <td className="py-3 px-4 text-gray-600 dark:text-gray-400">2.3 sec/MB</td>
                                            <td className="py-3 px-4 text-gray-600 dark:text-gray-400">2.0 sec/MB</td>
                                            <td className="py-3 px-4">
                                                <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300">
                                                    Needs Improvement
                                                </Badge>
                                            </td>
                                        </tr>
                                        <tr className="border-b border-gray-100 dark:border-gray-800">
                                            <td className="py-3 px-4 text-gray-900 dark:text-white">User Satisfaction</td>
                                            <td className="py-3 px-4 text-gray-600 dark:text-gray-400">4.7/5.0</td>
                                            <td className="py-3 px-4 text-gray-600 dark:text-gray-400">4.5/5.0</td>
                                            <td className="py-3 px-4">
                                                <Badge className="bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300">
                                                    Excellent
                                                </Badge>
                                            </td>
                                        </tr>
                                        <tr className="border-b border-gray-100 dark:border-gray-800">
                                            <td className="py-3 px-4 text-gray-900 dark:text-white">API Response Time</td>
                                            <td className="py-3 px-4 text-gray-600 dark:text-gray-400">145ms</td>
                                            <td className="py-3 px-4 text-gray-600 dark:text-gray-400">200ms</td>
                                            <td className="py-3 px-4">
                                                <Badge className="bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300">
                                                    Good
                                                </Badge>
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
