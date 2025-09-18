import { Head, Link } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { 
    FileText, 
    Download, 
    Calendar,
    BarChart3,
    TrendingUp,
    Users,
    Database,
    Clock,
    Filter,
    Search,
    Plus,
    Eye,
    Share2
} from 'lucide-react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/Components/ui/Card';
import { Button } from '@/Components/ui/Button';
import { Badge } from '@/Components/ui/Badge';

export default function Reports() {
    // Sample reports data
    const reports = [
        {
            id: 1,
            title: 'Q3 2024 Research Analysis',
            description: 'Comprehensive analysis of Q3 research data and findings',
            type: 'Quarterly Report',
            status: 'Published',
            date: '2024-09-10',
            author: 'Dr. Sarah Johnson',
            downloads: 156,
            size: '2.4 MB'
        },
        {
            id: 2,
            title: 'AI Model Performance Study',
            description: 'Detailed performance metrics and optimization recommendations',
            type: 'Technical Report',
            status: 'Draft',
            date: '2024-09-08',
            author: 'Dr. Michael Chen',
            downloads: 89,
            size: '1.8 MB'
        },
        {
            id: 3,
            title: 'Data Quality Assessment',
            description: 'Analysis of data integrity and quality metrics across datasets',
            type: 'Quality Report',
            status: 'Published',
            date: '2024-09-05',
            author: 'Dr. Emily Rodriguez',
            downloads: 234,
            size: '3.1 MB'
        },
        {
            id: 4,
            title: 'Security Vulnerability Analysis',
            description: 'Comprehensive security assessment and recommendations',
            type: 'Security Report',
            status: 'Under Review',
            date: '2024-09-03',
            author: 'Dr. James Wilson',
            downloads: 67,
            size: '1.5 MB'
        }
    ];

    const getStatusColor = (status) => {
        switch (status) {
            case 'Published':
                return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
            case 'Draft':
                return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
            case 'Under Review':
                return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
            default:
                return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
        }
    };

    const getTypeColor = (type) => {
        switch (type) {
            case 'Quarterly Report':
                return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300';
            case 'Technical Report':
                return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
            case 'Quality Report':
                return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
            case 'Security Report':
                return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
            default:
                return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
        }
    };

    return (
        <AuthenticatedLayout>
            <Head title="Research Reports - SRAP 2.0" />

            <div className="px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="mb-8"
                >
                    <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white">
                        <div className="flex items-center justify-between">
                            <div>
                                <h1 className="text-3xl font-bold mb-2">Research Reports</h1>
                                <p className="text-blue-100">
                                    Generate, manage, and share comprehensive research analysis reports
                                </p>
                            </div>
                            <div className="hidden md:block">
                                <FileText className="w-16 h-16 text-blue-200" />
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Stats Cards */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.1 }}
                    className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8"
                >
                    <Card className="border-0 shadow-lg">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Reports</p>
                                    <p className="text-3xl font-bold text-gray-900 dark:text-white">24</p>
                                </div>
                                <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-xl">
                                    <FileText className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-0 shadow-lg">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Published</p>
                                    <p className="text-3xl font-bold text-gray-900 dark:text-white">18</p>
                                </div>
                                <div className="p-3 bg-green-100 dark:bg-green-900 rounded-xl">
                                    <TrendingUp className="w-6 h-6 text-green-600 dark:text-green-400" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-0 shadow-lg">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Downloads</p>
                                    <p className="text-3xl font-bold text-gray-900 dark:text-white">1.2K</p>
                                </div>
                                <div className="p-3 bg-purple-100 dark:bg-purple-900 rounded-xl">
                                    <Download className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-0 shadow-lg">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">This Month</p>
                                    <p className="text-3xl font-bold text-gray-900 dark:text-white">6</p>
                                </div>
                                <div className="p-3 bg-orange-100 dark:bg-orange-900 rounded-xl">
                                    <Calendar className="w-6 h-6 text-orange-600 dark:text-orange-400" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>

                {/* Actions Bar */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8"
                >
                    <div className="flex items-center space-x-4">
                        <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                            <Plus className="w-4 h-4 mr-2" />
                            Generate New Report
                        </Button>
                        <Button variant="outline">
                            <Filter className="w-4 h-4 mr-2" />
                            Filter
                        </Button>
                    </div>
                    <div className="flex items-center space-x-2">
                        <div className="relative">
                            <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search reports..."
                                className="pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>
                    </div>
                </motion.div>

                {/* Reports List */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.3 }}
                    className="space-y-6"
                >
                    {reports.map((report, index) => (
                        <motion.div
                            key={report.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
                        >
                            <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                                <CardContent className="p-6">
                                    <div className="flex items-start justify-between">
                                        <div className="flex-1">
                                            <div className="flex items-center space-x-3 mb-3">
                                                <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                                                    {report.title}
                                                </h3>
                                                <Badge className={getStatusColor(report.status)}>
                                                    {report.status}
                                                </Badge>
                                                <Badge variant="outline" className={getTypeColor(report.type)}>
                                                    {report.type}
                                                </Badge>
                                            </div>
                                            <p className="text-gray-600 dark:text-gray-400 mb-4">
                                                {report.description}
                                            </p>
                                            <div className="flex items-center space-x-6 text-sm text-gray-500 dark:text-gray-400">
                                                <div className="flex items-center space-x-1">
                                                    <Users className="w-4 h-4" />
                                                    <span>{report.author}</span>
                                                </div>
                                                <div className="flex items-center space-x-1">
                                                    <Calendar className="w-4 h-4" />
                                                    <span>{new Date(report.date).toLocaleDateString()}</span>
                                                </div>
                                                <div className="flex items-center space-x-1">
                                                    <Download className="w-4 h-4" />
                                                    <span>{report.downloads} downloads</span>
                                                </div>
                                                <div className="flex items-center space-x-1">
                                                    <Database className="w-4 h-4" />
                                                    <span>{report.size}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex items-center space-x-2 ml-6">
                                            <Button variant="outline" size="sm">
                                                <Eye className="w-4 h-4 mr-2" />
                                                View
                                            </Button>
                                            <Button variant="outline" size="sm">
                                                <Download className="w-4 h-4 mr-2" />
                                                Download
                                            </Button>
                                            <Button variant="outline" size="sm">
                                                <Share2 className="w-4 h-4 mr-2" />
                                                Share
                                            </Button>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </AuthenticatedLayout>
    );
}
