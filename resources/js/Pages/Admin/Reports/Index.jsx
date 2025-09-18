import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { 
    Plus, 
    Download, 
    FileText, 
    FileSpreadsheet, 
    Clock, 
    CheckCircle, 
    XCircle, 
    RefreshCw,
    Calendar,
    Filter,
    Search,
    Eye,
    Trash2
} from 'lucide-react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

export default function Index({ auth, reports, filters }) {
    const [searchTerm, setSearchTerm] = useState(filters?.search || '');
    const [statusFilter, setStatusFilter] = useState(filters?.status || '');
    const [typeFilter, setTypeFilter] = useState(filters?.type || '');

    const handleSearch = (e) => {
        e.preventDefault();
        router.get('/admin/reports', {
            search: searchTerm,
            status: statusFilter,
            type: typeFilter
        }, { preserveState: true });
    };

    const handleQuickDownload = async (report, format) => {
        if (!report.pdf_path && !report.excel_path) {
            alert('No files available for download yet.');
            return;
        }

        try {
            const response = await fetch(`/admin/reports/${report.id}/download/${format}`, {
                method: 'GET',
                headers: {
                    'X-Requested-With': 'XMLHttpRequest',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content')
                }
            });

            if (!response.ok) throw new Error('Download failed');

            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `${report.title}_${format}.${format === 'pdf' ? 'pdf' : 'xlsx'}`;
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(url);

            router.reload({ only: ['reports'] });
        } catch (error) {
            alert('Failed to download report. Please try again.');
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'completed':
                return <CheckCircle className="w-4 h-4 text-green-500" />;
            case 'generating':
                return <RefreshCw className="w-4 h-4 text-blue-500 animate-spin" />;
            case 'failed':
                return <XCircle className="w-4 h-4 text-red-500" />;
            default:
                return <Clock className="w-4 h-4 text-yellow-500" />;
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'completed':
                return 'bg-green-100 text-green-800';
            case 'generating':
                return 'bg-blue-100 text-blue-800';
            case 'failed':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-yellow-100 text-yellow-800';
        }
    };

    const getReportTypeLabel = (type) => {
        const labels = {
            'kpi_summary': 'KPI Summary',
            'pillar_progress': 'Pillar Progress',
            'department_performance': 'Department Performance',
            'milestone_status': 'Milestone Status',
            'comprehensive': 'Comprehensive Report'
        };
        return labels[type] || type;
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex items-center justify-between">
                    <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                        Reports Management
                    </h2>
                    <Link
                        href="/admin/reports/create"
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
                    >
                        <Plus className="w-4 h-4" />
                        <span>Create Report</span>
                    </Link>
                </div>
            }
        >
            <Head title="Reports Management" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    {/* Search and Filters */}
                    <div className="bg-white overflow-hidden shadow-xl sm:rounded-lg mb-6">
                        <div className="p-6">
                            <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                                    <input
                                        type="text"
                                        placeholder="Search reports..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="pl-10 w-full border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                                    />
                                </div>

                                <select
                                    value={statusFilter}
                                    onChange={(e) => setStatusFilter(e.target.value)}
                                    className="border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                                >
                                    <option value="">All Statuses</option>
                                    <option value="pending">Pending</option>
                                    <option value="generating">Generating</option>
                                    <option value="completed">Completed</option>
                                    <option value="failed">Failed</option>
                                </select>

                                <select
                                    value={typeFilter}
                                    onChange={(e) => setTypeFilter(e.target.value)}
                                    className="border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                                >
                                    <option value="">All Types</option>
                                    <option value="kpi_summary">KPI Summary</option>
                                    <option value="pillar_progress">Pillar Progress</option>
                                    <option value="department_performance">Department Performance</option>
                                    <option value="milestone_status">Milestone Status</option>
                                    <option value="comprehensive">Comprehensive</option>
                                </select>

                                <button
                                    type="submit"
                                    className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg flex items-center justify-center space-x-2 transition-colors"
                                >
                                    <Filter className="w-4 h-4" />
                                    <span>Filter</span>
                                </button>
                            </form>
                        </div>
                    </div>

                    {/* Reports Grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                        {reports.data.map((report, index) => (
                            <motion.div
                                key={report.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className="bg-white overflow-hidden shadow-xl rounded-lg hover:shadow-2xl transition-shadow"
                            >
                                <div className="p-6">
                                    {/* Header */}
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="flex-1">
                                            <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                                {report.title}
                                            </h3>
                                            <div className="flex items-center space-x-2 mb-2">
                                                {getStatusIcon(report.status)}
                                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(report.status)}`}>
                                                    {report.status.charAt(0).toUpperCase() + report.status.slice(1)}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Report Details */}
                                    <div className="space-y-2 mb-4">
                                        <div className="flex items-center text-sm text-gray-600">
                                            <FileText className="w-4 h-4 mr-2" />
                                            <span>{getReportTypeLabel(report.type)}</span>
                                        </div>
                                        <div className="flex items-center text-sm text-gray-600">
                                            <Calendar className="w-4 h-4 mr-2" />
                                            <span>{formatDate(report.start_date)} - {formatDate(report.end_date)}</span>
                                        </div>
                                        {report.download_count > 0 && (
                                            <div className="flex items-center text-sm text-gray-600">
                                                <Download className="w-4 h-4 mr-2" />
                                                <span>{report.download_count} downloads</span>
                                            </div>
                                        )}
                                    </div>

                                    {/* Description */}
                                    {report.description && (
                                        <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                                            {report.description}
                                        </p>
                                    )}

                                    {/* Actions */}
                                    <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                                        <Link
                                            href={`/admin/reports/${report.id}`}
                                            className="flex items-center text-blue-600 hover:text-blue-800 text-sm font-medium transition-colors"
                                        >
                                            <Eye className="w-4 h-4 mr-1" />
                                            View Details
                                        </Link>

                                        {report.status === 'completed' && (
                                            <div className="flex items-center space-x-2">
                                                {report.pdf_path && (
                                                    <button
                                                        onClick={() => handleQuickDownload(report, 'pdf')}
                                                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                        title="Download PDF"
                                                    >
                                                        <FileText className="w-4 h-4" />
                                                    </button>
                                                )}
                                                {report.excel_path && (
                                                    <button
                                                        onClick={() => handleQuickDownload(report, 'excel')}
                                                        className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                                                        title="Download Excel"
                                                    >
                                                        <FileSpreadsheet className="w-4 h-4" />
                                                    </button>
                                                )}
                                            </div>
                                        )}

                                        {report.status === 'generating' && (
                                            <div className="flex items-center text-blue-600 text-sm">
                                                <RefreshCw className="w-4 h-4 mr-1 animate-spin" />
                                                Generating...
                                            </div>
                                        )}

                                        {report.status === 'failed' && (
                                            <button
                                                onClick={() => router.post(`/admin/reports/${report.id}/regenerate`)}
                                                className="text-red-600 hover:text-red-800 text-sm font-medium transition-colors"
                                            >
                                                Try Again
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    {/* Empty State */}
                    {reports.data.length === 0 && (
                        <div className="bg-white overflow-hidden shadow-xl sm:rounded-lg">
                            <div className="text-center py-12">
                                <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                                <h3 className="text-lg font-semibold text-gray-900 mb-2">No Reports Found</h3>
                                <p className="text-gray-600 mb-6">
                                    {searchTerm || statusFilter || typeFilter 
                                        ? 'No reports match your current filters.' 
                                        : 'Get started by creating your first report.'}
                                </p>
                                <Link
                                    href="/admin/reports/create"
                                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg inline-flex items-center space-x-2 transition-colors"
                                >
                                    <Plus className="w-4 h-4" />
                                    <span>Create Report</span>
                                </Link>
                            </div>
                        </div>
                    )}

                    {/* Pagination */}
                    {reports.links && reports.links.length > 3 && (
                        <div className="mt-6 flex justify-center">
                            <nav className="flex items-center space-x-2">
                                {reports.links.map((link, index) => (
                                    <Link
                                        key={index}
                                        href={link.url || '#'}
                                        className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                                            link.active
                                                ? 'bg-blue-600 text-white'
                                                : link.url
                                                ? 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
                                                : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                        }`}
                                        dangerouslySetInnerHTML={{ __html: link.label }}
                                    />
                                ))}
                            </nav>
                        </div>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
