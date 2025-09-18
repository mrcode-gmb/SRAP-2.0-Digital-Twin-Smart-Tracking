import React, { useState, useRef, useEffect } from 'react';
import { Head, useForm, usePage, Link, router } from '@inertiajs/react';
import { motion } from 'framer-motion';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { useToast } from '@/Contexts/ToastContext';
import { 
    Upload, 
    FileText, 
    Download, 
    AlertCircle, 
    CheckCircle, 
    Clock,
    User,
    Calendar,
    FileSpreadsheet,
    Trash2,
    Plus,
    Search,
    Filter,
    Eye,
    AlertTriangle,
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/Components/ui/Card';
import { Button } from '@/Components/ui/Button';
import { Badge } from '@/Components/ui/Badge';

export default function AdminProgressUpload({ uploads, filters = {} }) {
    const { showSuccess, showError, showWarning } = useToast();
    const { flash } = usePage().props;
    const [searchTerm, setSearchTerm] = useState(filters?.search || '');
    const [selectedType, setSelectedType] = useState(filters?.type || '');
    const [selectedStatus, setSelectedStatus] = useState(filters?.status || '');

    // Handle flash messages from server
    useEffect(() => {
        if (flash?.success) {
            showSuccess(flash.success);
        }
        if (flash?.error) {
            showError(flash.error);
        }
        if (flash?.warning) {
            showWarning(flash.warning);
        }
    }, [flash, showSuccess, showError, showWarning]);

    const handleSearch = () => {
        router.get('/admin/progress-upload', {
            search: searchTerm,
            type: selectedType,
            status: selectedStatus
        }, {
            preserveState: true,
            preserveScroll: true
        });
    };

    const handleDownloadTemplate = (type) => {
        try {
            window.open(`/admin/progress-upload/template/${type}`, '_blank');
            showSuccess(`${type.charAt(0).toUpperCase() + type.slice(1)} template downloaded successfully`);
        } catch (error) {
            showError('Failed to download template. Please try again.');
        }
    };

    const handleDelete = (upload) => {
        if (confirm(`Are you sure you want to delete this upload?`)) {
            router.delete(`/admin/progress-upload/${upload.id}`, {
                onSuccess: () => {
                    showSuccess('Upload deleted successfully');
                },
                onError: (errors) => {
                    showError('Failed to delete upload. Please try again.');
                }
            });
        }
    };

    const getStatusBadge = (status) => {
        const colors = {
            completed: 'bg-green-100 text-green-800',
            processing: 'bg-yellow-100 text-yellow-800',
            failed: 'bg-red-100 text-red-800',
            pending: 'bg-gray-100 text-gray-800'
        };
        
        return <Badge className={colors[status] || 'bg-gray-100 text-gray-800'}>
            {status.charAt(0).toUpperCase() + status.slice(1)}
        </Badge>;
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'completed':
                return <CheckCircle className="w-5 h-5 text-green-500" />;
            case 'processing':
                return <Clock className="w-5 h-5 text-yellow-500" />;
            case 'failed':
                return <AlertTriangle className="w-5 h-5 text-red-500" />;
            default:
                return <Upload className="w-5 h-5 text-gray-500" />;
        }
    };

    const getTypeBadge = (type) => {
        const colors = {
            kpi_progress: 'bg-blue-100 text-blue-800',
            milestone_update: 'bg-green-100 text-green-800',
            bulk_data: 'bg-purple-100 text-purple-800'
        };
        
        return <Badge className={colors[type] || 'bg-gray-100 text-gray-800'}>
            {type.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
        </Badge>;
    };

    return (
        <AuthenticatedLayout>
            <Head title="Progress Upload Management" />

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
                                Progress Upload Management
                            </h1>
                            <p className="mt-2 text-gray-600 dark:text-gray-400">
                                Upload and manage KPI progress data and milestone updates
                            </p>
                        </div>
                        <div className="mt-4 sm:mt-0 flex space-x-2">
                            <Button 
                                variant="outline"
                                onClick={() => handleDownloadTemplate('kpi_progress')}
                            >
                                <Download className="w-4 h-4 mr-2" />
                                KPI Template
                            </Button>
                            <Link href="/admin/progress-upload/create">
                                <Button className="flex items-center gap-2">
                                    <Plus className="w-4 h-4" />
                                    Upload Data
                                </Button>
                            </Link>
                        </div>
                    </div>
                </motion.div>

                {/* Quick Templates */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.05 }}
                    className="mb-6"
                >
                    <Card>
                        <CardHeader>
                            <CardTitle>Download Templates</CardTitle>
                            <CardDescription>
                                Download Excel templates for different data types
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <Button 
                                    variant="outline" 
                                    className="h-auto p-4 flex flex-col items-center space-y-2"
                                    onClick={() => handleDownloadTemplate('kpi_progress')}
                                >
                                    <FileText className="w-8 h-8 text-blue-500" />
                                    <span className="font-medium">KPI Progress Template</span>
                                    <span className="text-sm text-gray-500">Update KPI current values</span>
                                </Button>
                                <Button 
                                    variant="outline" 
                                    className="h-auto p-4 flex flex-col items-center space-y-2"
                                    onClick={() => handleDownloadTemplate('milestone_progress')}
                                >
                                    <FileText className="w-8 h-8 text-green-500" />
                                    <span className="font-medium">Milestone Template</span>
                                    <span className="text-sm text-gray-500">Update milestone progress</span>
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
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
                                        Search Uploads
                                    </label>
                                    <div className="relative">
                                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                                        <input
                                            type="text"
                                            placeholder="Search uploads..."
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
                                        <option value="kpi_progress">KPI Progress</option>
                                        <option value="milestone_progress">Milestone Progress</option>
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
                                        <option value="completed">Completed</option>
                                        <option value="processing">Processing</option>
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

                {/* Uploads List */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="space-y-4"
                >
                    {uploads?.data?.map((upload, index) => (
                        <motion.div
                            key={upload.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.6, delay: 0.2 + index * 0.1 }}
                        >
                            <Card className="hover:shadow-lg transition-all duration-300">
                                <CardContent className="p-6">
                                    <div className="flex items-start justify-between">
                                        <div className="flex items-start space-x-4">
                                            {getStatusIcon(upload.status)}
                                            <div className="flex-1">
                                                <div className="flex items-center space-x-3 mb-2">
                                                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                                        {upload.original_filename}
                                                    </h3>
                                                    {getTypeBadge(upload.file_type)}
                                                    {getStatusBadge(upload.status)}
                                                </div>
                                                
                                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600 dark:text-gray-400">
                                                    <div>
                                                        <span className="font-medium">Records:</span> {upload.records_processed || 0}
                                                    </div>
                                                    <div>
                                                        <span className="font-medium">Processed:</span> {upload.records_processed || 0}
                                                    </div>
                                                    <div>
                                                        <span className="font-medium">Errors:</span> {upload.errors_count || 0}
                                                    </div>
                                                    <div>
                                                        <span className="font-medium">Size:</span> {upload.file_size ? (upload.file_size / 1024 / 1024).toFixed(2) + ' MB' : 'N/A'}
                                                    </div>
                                                </div>
                                                
                                                <div className="mt-3 text-sm text-gray-500">
                                                    Uploaded: {new Date(upload.created_at).toLocaleString()} by {upload.uploader?.name}
                                                </div>
                                                
                                                {upload.error_details && upload.error_details.length > 0 && (
                                                    <div className="mt-3 p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
                                                        <p className="text-sm text-red-700 dark:text-red-300">
                                                            Error: {upload.error_details[0].error || 'Processing failed'}
                                                        </p>
                                                    </div>
                                                )}
                                                
                                                {upload.status === 'completed' && upload.records_processed > 0 && (
                                                    <div className="mt-3 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                                                        <p className="text-sm text-green-700 dark:text-green-300">
                                                            Successfully processed {upload.records_processed} records
                                                            {upload.errors_count > 0 && ` with ${upload.errors_count} errors`}
                                                        </p>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                        
                                        <div className="flex items-center space-x-2">
                                            <Button 
                                                variant="outline" 
                                                size="sm"
                                                onClick={() => window.open(`/storage/${upload.file_path}`, '_blank')}
                                            >
                                                <Download className="w-4 h-4 mr-2" />
                                                Download
                                            </Button>
                                            <Link href={`/admin/progress-upload/${upload.id}`}>
                                                <Button variant="outline" size="sm">
                                                    <Eye className="w-4 h-4 mr-2" />
                                                    View
                                                </Button>
                                            </Link>
                                            <Button 
                                                variant="outline" 
                                                size="sm" 
                                                onClick={() => handleDelete(upload)}
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
                {(!uploads?.data || uploads.data.length === 0) && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="text-center py-12"
                    >
                        <Upload className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                            No Uploads Found
                        </h3>
                        <p className="text-gray-600 dark:text-gray-400 mb-6">
                            Upload your first data file to update KPI progress.
                        </p>
                        <Link href="/admin/progress-upload/create">
                            <Button>
                                <Plus className="w-4 h-4 mr-2" />
                                Upload First File
                            </Button>
                        </Link>
                    </motion.div>
                )}

                {/* Pagination */}
                {uploads?.links && uploads.links.length > 3 && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.3 }}
                        className="mt-8 flex justify-center"
                    >
                        <div className="flex space-x-2">
                            {uploads.links.filter(link => link && typeof link === 'object').map((link, index) => {
                                const hasValidUrl = link.url && typeof link.url === 'string' && link.url.trim() !== '';
                                const isActive = Boolean(link.active);
                                const linkLabel = link.label && typeof link.label === 'string' ? link.label : '';
                                
                                if (!hasValidUrl && !isActive) {
                                    return (
                                        <span
                                            key={`disabled-${index}`}
                                            className="px-3 py-2 text-sm rounded-lg bg-gray-100 text-gray-400 cursor-not-allowed"
                                            dangerouslySetInnerHTML={{ __html: linkLabel }}
                                        />
                                    );
                                }
                                
                                if (!hasValidUrl) {
                                    return (
                                        <span
                                            key={`active-${index}`}
                                            className="px-3 py-2 text-sm rounded-lg bg-blue-600 text-white"
                                            dangerouslySetInnerHTML={{ __html: linkLabel }}
                                        />
                                    );
                                }
                                
                                return (
                                    <Link
                                        key={`link-${index}`}
                                        href={link.url ?? '#'}
                                        className={`px-3 py-2 text-sm rounded-lg transition-colors ${
                                            isActive
                                                ? 'bg-blue-600 text-white'
                                                : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
                                        }`}
                                        dangerouslySetInnerHTML={{ __html: linkLabel }}
                                    />
                                );
                            })}
                        </div>
                    </motion.div>
                )}
            </div>
        </AuthenticatedLayout>
    );
}
