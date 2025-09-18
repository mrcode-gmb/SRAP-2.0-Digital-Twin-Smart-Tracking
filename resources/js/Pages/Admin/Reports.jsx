import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
    Plus, 
    Search, 
    Filter, 
    FileText,
    Download,
    Eye,
    Edit,
    Trash2,
    Calendar,
    BarChart3
} from 'lucide-react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/Components/ui/Card';
import { Button } from '@/Components/ui/Button';
import { Badge } from '@/Components/ui/Badge';

export default function AdminReports({ reports, filters }) {
    const [searchTerm, setSearchTerm] = useState(filters?.search || '');
    const [selectedType, setSelectedType] = useState(filters?.type || '');
    const [selectedStatus, setSelectedStatus] = useState(filters?.status || '');

    const handleSearch = () => {
        router.get('/admin/reports', {
            search: searchTerm,
            type: selectedType,
            status: selectedStatus
        }, {
            preserveState: true,
            preserveScroll: true
        });
    };

    const handleDownload = (report) => {
        window.open(`/admin/reports/${report.id}/download`, '_blank');
    };

    const handleDelete = (report) => {
        if (confirm(`Are you sure you want to delete "${report.title}"?`)) {
            router.delete(`/admin/reports/${report.id}`);
        }
    };

    const getReportTypeBadge = (type) => {
        const colors = {
            kpi_summary: 'bg-blue-100 text-blue-800',
            pillar_progress: 'bg-green-100 text-green-800',
            milestone_status: 'bg-yellow-100 text-yellow-800',
            custom: 'bg-purple-100 text-purple-800'
        };
        
        return <Badge className={colors[type] || 'bg-gray-100 text-gray-800'}>
            {type.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
        </Badge>;
    };

    const getStatusBadge = (status) => {
        const colors = {
            generated: 'bg-green-100 text-green-800',
            generating: 'bg-yellow-100 text-yellow-800',
            failed: 'bg-red-100 text-red-800',
            pending: 'bg-gray-100 text-gray-800'
        };
        
        return <Badge className={colors[status] || 'bg-gray-100 text-gray-800'}>
            {status.charAt(0).toUpperCase() + status.slice(1)}
        </Badge>;
    };

    return (
        <AuthenticatedLayout>
            <Head title="Report Management" />

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
                                Report Management
                            </h1>
                            <p className="mt-2 text-gray-600 dark:text-gray-400">
                                Generate and manage SRAP 2.0 reports and analytics
                            </p>
                        </div>
                        <div className="mt-4 sm:mt-0">
                            <Link href="/admin/reports/create">
                                <Button className="flex items-center gap-2">
                                    <Plus className="w-4 h-4" />
                                    Generate Report
                                </Button>
                            </Link>
                        </div>
                    </div>
                </motion.div>

                {/* Filters */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.1 }}
                    className="mb-6"
                >
                    <Card>
                        <CardContent className="p-6">
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Search Reports
                                    </label>
                                    <div className="relative">
                                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                                        <input
                                            type="text"
                                            placeholder="Search reports..."
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Type
                                    </label>
                                    <select
                                        value={selectedType}
                                        onChange={(e) => setSelectedType(e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    >
                                        <option value="">All Types</option>
                                        <option value="kpi_summary">KPI Summary</option>
                                        <option value="pillar_progress">Pillar Progress</option>
                                        <option value="milestone_status">Milestone Status</option>
                                        <option value="custom">Custom</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Status
                                    </label>
                                    <select
                                        value={selectedStatus}
                                        onChange={(e) => setSelectedStatus(e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    >
                                        <option value="">All Status</option>
                                        <option value="generated">Generated</option>
                                        <option value="generating">Generating</option>
                                        <option value="failed">Failed</option>
                                        <option value="pending">Pending</option>
                                    </select>
                                </div>
                                <div className="flex items-end">
                                    <Button onClick={handleSearch} className="w-full">
                                        <Filter className="w-4 h-4 mr-2" />
                                        Apply Filters
                                    </Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>

                {/* Reports Grid */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6"
                >
                    {reports?.data?.map((report, index) => (
                        <motion.div
                            key={report.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.2 + index * 0.1 }}
                        >
                            <Card className="hover:shadow-lg transition-all duration-300 border-0 shadow-md h-full">
                                <CardHeader className="pb-3">
                                    <div className="flex items-start justify-between">
                                        <div className="flex items-center space-x-3">
                                            <FileText className="w-6 h-6 text-blue-500" />
                                            <div>
                                                <CardTitle className="text-lg font-semibold line-clamp-2">
                                                    {report.title}
                                                </CardTitle>
                                                <div className="flex items-center space-x-2 mt-1">
                                                    {getReportTypeBadge(report.type)}
                                                    {getStatusBadge(report.status)}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4">
                                        <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-3">
                                            {report.description}
                                        </p>
                                        
                                        {/* Report Details */}
                                        <div className="space-y-2 text-sm">
                                            <div className="flex items-center space-x-2">
                                                <Calendar className="w-4 h-4 text-gray-400" />
                                                <span className="text-gray-600 dark:text-gray-400">
                                                    Generated: {new Date(report.created_at).toLocaleDateString()}
                                                </span>
                                            </div>
                                            
                                            {report.file_size && (
                                                <div className="flex items-center space-x-2">
                                                    <BarChart3 className="w-4 h-4 text-gray-400" />
                                                    <span className="text-gray-600 dark:text-gray-400">
                                                        Size: {(report.file_size / 1024).toFixed(1)} KB
                                                    </span>
                                                </div>
                                            )}
                                            
                                            {report.format && (
                                                <div className="flex items-center space-x-2">
                                                    <FileText className="w-4 h-4 text-gray-400" />
                                                    <span className="text-gray-600 dark:text-gray-400">
                                                        Format: {report.format.toUpperCase()}
                                                    </span>
                                                </div>
                                            )}
                                        </div>

                                        {/* Actions */}
                                        <div className="flex items-center space-x-2 pt-2">
                                            <Link href={`/admin/reports/${report.id}`}>
                                                <Button variant="outline" size="sm" className="flex-1">
                                                    <Eye className="w-4 h-4 mr-2" />
                                                    View
                                                </Button>
                                            </Link>
                                            {report.status === 'generated' && (
                                                <Button 
                                                    variant="outline" 
                                                    size="sm" 
                                                    onClick={() => handleDownload(report)}
                                                    className="flex-1"
                                                >
                                                    <Download className="w-4 h-4 mr-2" />
                                                    Download
                                                </Button>
                                            )}
                                            <Button 
                                                variant="outline" 
                                                size="sm" 
                                                onClick={() => handleDelete(report)}
                                                className="text-red-600 hover:text-red-700"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>
                    ))}
                </motion.div>

                {/* Empty State */}
                {(!reports?.data || reports.data.length === 0) && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="text-center py-12"
                    >
                        <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                            No Reports Found
                        </h3>
                        <p className="text-gray-600 dark:text-gray-400 mb-6">
                            Generate your first report to track SRAP 2.0 progress.
                        </p>
                        <Link href="/admin/reports/create">
                            <Button>
                                <Plus className="w-4 h-4 mr-2" />
                                Generate First Report
                            </Button>
                        </Link>
                    </motion.div>
                )}

                {/* Pagination */}
                {reports?.links && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.3 }}
                        className="mt-8 flex justify-center"
                    >
                        <div className="flex space-x-2">
                            {reports.links.map((link, index) => (
                                <Link
                                    key={index}
                                    href={link.url ?? '#'}
                                    className={`px-3 py-2 text-sm rounded-lg ${
                                        link.active
                                            ? 'bg-blue-600 text-white'
                                            : 'bg-white text-gray-700 hover:bg-gray-50 border'
                                    }`}
                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                />
                            ))}
                        </div>
                    </motion.div>
                )}
            </div>
        </AuthenticatedLayout>
    );
}
