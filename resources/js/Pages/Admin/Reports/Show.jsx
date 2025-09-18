import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { 
    ArrowLeft, 
    Download, 
    FileText, 
    FileSpreadsheet, 
    Clock, 
    CheckCircle, 
    XCircle, 
    RefreshCw,
    Calendar,
    User,
    Filter,
    Eye
} from 'lucide-react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

export default function Show({ auth, report }) {
    const [downloading, setDownloading] = useState({ pdf: false, excel: false });

    const handleDownload = async (format) => {
        if (!report.pdf_path && !report.excel_path) {
            alert('No files available for download yet. Please wait for report generation to complete.');
            return;
        }

        setDownloading(prev => ({ ...prev, [format]: true }));

        try {
            const response = await fetch(`/admin/reports/${report.id}/download/${format}`, {
                method: 'GET',
                headers: {
                    'X-Requested-With': 'XMLHttpRequest',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content')
                }
            });

            if (!response.ok) {
                throw new Error('Download failed');
            }

            // Create blob and download
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `${report.title}_${format}.${format === 'pdf' ? 'pdf' : 'xlsx'}`;
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(url);

            // Update download count
            router.reload({ only: ['report'] });
        } catch (error) {
            alert('Failed to download report. Please try again.');
        } finally {
            setDownloading(prev => ({ ...prev, [format]: false }));
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'completed':
                return <CheckCircle className="w-5 h-5 text-green-500" />;
            case 'generating':
                return <RefreshCw className="w-5 h-5 text-blue-500 animate-spin" />;
            case 'failed':
                return <XCircle className="w-5 h-5 text-red-500" />;
            default:
                return <Clock className="w-5 h-5 text-yellow-500" />;
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

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
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

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                        <Link
                            href="/admin/reports"
                            className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
                        >
                            <ArrowLeft className="w-5 h-5 mr-2" />
                            Back to Reports
                        </Link>
                        <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                            Report Details
                        </h2>
                    </div>
                </div>
            }
        >
            <Head title={`Report: ${report.title}`} />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white overflow-hidden shadow-xl sm:rounded-lg"
                    >
                        {/* Header Section */}
                        <div className="px-6 py-8 border-b border-gray-200">
                            <div className="flex items-start justify-between">
                                <div className="flex-1">
                                    <div className="flex items-center space-x-3 mb-4">
                                        <h1 className="text-3xl font-bold text-gray-900">
                                            {report.title}
                                        </h1>
                                        <div className="flex items-center space-x-2">
                                            {getStatusIcon(report.status)}
                                            <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(report.status)}`}>
                                                {report.status.charAt(0).toUpperCase() + report.status.slice(1)}
                                            </span>
                                        </div>
                                    </div>
                                    
                                    {report.description && (
                                        <p className="text-gray-600 text-lg mb-6">
                                            {report.description}
                                        </p>
                                    )}

                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                        <div className="flex items-center space-x-3">
                                            <FileText className="w-5 h-5 text-gray-400" />
                                            <div>
                                                <p className="text-sm text-gray-500">Type</p>
                                                <p className="font-medium">{getReportTypeLabel(report.type)}</p>
                                            </div>
                                        </div>

                                        <div className="flex items-center space-x-3">
                                            <Calendar className="w-5 h-5 text-gray-400" />
                                            <div>
                                                <p className="text-sm text-gray-500">Period</p>
                                                <p className="font-medium">
                                                    {formatDate(report.start_date)} - {formatDate(report.end_date)}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex items-center space-x-3">
                                            <User className="w-5 h-5 text-gray-400" />
                                            <div>
                                                <p className="text-sm text-gray-500">Generated By</p>
                                                <p className="font-medium">{report.generator?.name || 'System'}</p>
                                            </div>
                                        </div>

                                        <div className="flex items-center space-x-3">
                                            <Eye className="w-5 h-5 text-gray-400" />
                                            <div>
                                                <p className="text-sm text-gray-500">Downloads</p>
                                                <p className="font-medium">{report.download_count || 0}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Download Section */}
                        <div className="px-6 py-8">
                            <h3 className="text-xl font-semibold text-gray-900 mb-6">Download Report</h3>
                            
                            {report.status === 'completed' ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {/* PDF Download */}
                                    {report.pdf_path && (
                                        <motion.div
                                            whileHover={{ scale: 1.02 }}
                                            className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
                                        >
                                            <div className="flex items-center justify-between mb-4">
                                                <div className="flex items-center space-x-3">
                                                    <div className="p-2 bg-red-100 rounded-lg">
                                                        <FileText className="w-6 h-6 text-red-600" />
                                                    </div>
                                                    <div>
                                                        <h4 className="font-semibold text-gray-900">PDF Report</h4>
                                                        <p className="text-sm text-gray-500">Formatted for printing and viewing</p>
                                                    </div>
                                                </div>
                                            </div>
                                            <button
                                                onClick={() => handleDownload('pdf')}
                                                disabled={downloading.pdf}
                                                className="w-full flex items-center justify-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                            >
                                                {downloading.pdf ? (
                                                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                                                ) : (
                                                    <Download className="w-4 h-4 mr-2" />
                                                )}
                                                {downloading.pdf ? 'Downloading...' : 'Download PDF'}
                                            </button>
                                        </motion.div>
                                    )}

                                    {/* Excel Download */}
                                    {report.excel_path && (
                                        <motion.div
                                            whileHover={{ scale: 1.02 }}
                                            className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
                                        >
                                            <div className="flex items-center justify-between mb-4">
                                                <div className="flex items-center space-x-3">
                                                    <div className="p-2 bg-green-100 rounded-lg">
                                                        <FileSpreadsheet className="w-6 h-6 text-green-600" />
                                                    </div>
                                                    <div>
                                                        <h4 className="font-semibold text-gray-900">Excel Report</h4>
                                                        <p className="text-sm text-gray-500">Data for analysis and manipulation</p>
                                                    </div>
                                                </div>
                                            </div>
                                            <button
                                                onClick={() => handleDownload('excel')}
                                                disabled={downloading.excel}
                                                className="w-full flex items-center justify-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                            >
                                                {downloading.excel ? (
                                                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                                                ) : (
                                                    <Download className="w-4 h-4 mr-2" />
                                                )}
                                                {downloading.excel ? 'Downloading...' : 'Download Excel'}
                                            </button>
                                        </motion.div>
                                    )}
                                </div>
                            ) : report.status === 'generating' ? (
                                <div className="text-center py-12">
                                    <RefreshCw className="w-12 h-12 text-blue-500 animate-spin mx-auto mb-4" />
                                    <h4 className="text-lg font-semibold text-gray-900 mb-2">Generating Report</h4>
                                    <p className="text-gray-600">Please wait while your report is being generated...</p>
                                </div>
                            ) : report.status === 'failed' ? (
                                <div className="text-center py-12">
                                    <XCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
                                    <h4 className="text-lg font-semibold text-gray-900 mb-2">Generation Failed</h4>
                                    <p className="text-gray-600 mb-4">There was an error generating your report.</p>
                                    <button
                                        onClick={() => router.post(`/admin/reports/${report.id}/regenerate`)}
                                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                                    >
                                        Try Again
                                    </button>
                                </div>
                            ) : (
                                <div className="text-center py-12">
                                    <Clock className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
                                    <h4 className="text-lg font-semibold text-gray-900 mb-2">Report Pending</h4>
                                    <p className="text-gray-600">Your report is queued for generation.</p>
                                </div>
                            )}
                        </div>

                        {/* Report Details */}
                        {report.filters && Object.keys(report.filters).length > 0 && (
                            <div className="px-6 py-8 border-t border-gray-200">
                                <h3 className="text-xl font-semibold text-gray-900 mb-6">Report Filters</h3>
                                <div className="bg-gray-50 rounded-lg p-4">
                                    <div className="flex items-center space-x-2 mb-2">
                                        <Filter className="w-4 h-4 text-gray-500" />
                                        <span className="text-sm font-medium text-gray-700">Applied Filters:</span>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                                        {report.filters.pillar_ids && report.filters.pillar_ids.length > 0 && (
                                            <div>
                                                <span className="font-medium">Pillars:</span> {report.filters.pillar_ids.length} selected
                                            </div>
                                        )}
                                        {report.filters.department_ids && report.filters.department_ids.length > 0 && (
                                            <div>
                                                <span className="font-medium">Departments:</span> {report.filters.department_ids.length} selected
                                            </div>
                                        )}
                                        {report.filters.kpi_ids && report.filters.kpi_ids.length > 0 && (
                                            <div>
                                                <span className="font-medium">KPIs:</span> {report.filters.kpi_ids.length} selected
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Metadata */}
                        {report.generated_at && (
                            <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
                                <div className="flex items-center justify-between text-sm text-gray-600">
                                    <span>Generated on: {formatDate(report.generated_at)}</span>
                                    <span>Report ID: #{report.id}</span>
                                </div>
                            </div>
                        )}
                    </motion.div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}