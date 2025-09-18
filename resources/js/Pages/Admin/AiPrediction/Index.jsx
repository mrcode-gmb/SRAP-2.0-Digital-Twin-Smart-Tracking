import React, { useState, useEffect } from 'react';
import { Head, useForm, usePage, Link, router } from '@inertiajs/react';
import { motion } from 'framer-motion';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { useToast } from '@/Contexts/ToastContext';
import { 
    Brain,
    TrendingUp,
    AlertTriangle,
    CheckCircle,
    Clock,
    Upload,
    Download,
    Search,
    Filter,
    Eye,
    Trash2,
    Plus,
    BarChart3,
    FileText,
    Calendar
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/Components/ui/Card';
import { Button } from '@/Components/ui/Button';
import { Badge } from '@/Components/ui/Badge';

export default function AiPredictionIndex({ predictions, stats, filters = {} }) {
    const { showSuccess, showError, showWarning } = useToast();
    const { flash } = usePage().props;
    const [searchTerm, setSearchTerm] = useState(filters?.search || '');
    const [selectedRiskLevel, setSelectedRiskLevel] = useState(filters?.risk_level || '');
    const [dateFrom, setDateFrom] = useState(filters?.date_from || '');
    const [dateTo, setDateTo] = useState(filters?.date_to || '');

    // Handle flash messages
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
        router.get('/admin/ai-predictions', {
            search: searchTerm,
            risk_level: selectedRiskLevel,
            date_from: dateFrom,
            date_to: dateTo
        }, {
            preserveState: true,
            preserveScroll: true
        });
    };

    const handleDelete = (prediction) => {
        if (confirm('Are you sure you want to delete this prediction?')) {
            router.delete(`/admin/ai-predictions/${prediction.id}`, {
                onSuccess: () => {
                    showSuccess('Prediction deleted successfully');
                },
                onError: () => {
                    showError('Failed to delete prediction');
                }
            });
        }
    };

    const getRiskBadge = (riskLevel) => {
        const colors = {
            'High': 'bg-red-100 text-red-800 border-red-200',
            'Medium': 'bg-yellow-100 text-yellow-800 border-yellow-200',
            'Low': 'bg-green-100 text-green-800 border-green-200'
        };
        return colors[riskLevel] || 'bg-gray-100 text-gray-800 border-gray-200';
    };

    const getRiskIcon = (riskLevel) => {
        switch (riskLevel) {
            case 'High':
                return <AlertTriangle className="w-4 h-4 text-red-500" />;
            case 'Medium':
                return <Clock className="w-4 h-4 text-yellow-500" />;
            case 'Low':
                return <CheckCircle className="w-4 h-4 text-green-500" />;
            default:
                return <Brain className="w-4 h-4 text-gray-500" />;
        }
    };

    return (
        <AuthenticatedLayout>
            <Head title="AI Risk Predictions" />
            
            <div className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="mb-8"
                >
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                            <div className="p-3 bg-gradient-to-br from-purple-500 to-blue-600 rounded-xl">
                                <Brain className="h-8 w-8 text-white" />
                            </div>
                            <div>
                                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                                    AI Risk Predictions
                                </h1>
                                <p className="text-gray-600 dark:text-gray-400 mt-1">
                                    Machine learning powered risk assessment for KPI performance
                                </p>
                            </div>
                        </div>
                        <div className="flex space-x-3">
                            <Button
                                onClick={() => router.get('/admin/ai-predictions/create')}
                                className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                            >
                                <Plus className="w-4 h-4 mr-2" />
                                New Prediction
                            </Button>
                            <Button
                                variant="outline"
                                onClick={() => window.open('/admin/ai-predictions/export', '_blank')}
                            >
                                <Download className="w-4 h-4 mr-2" />
                                Export
                            </Button>
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
                    <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 border-blue-200 dark:border-blue-700">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-blue-600 dark:text-blue-400 text-sm font-medium">Total Predictions</p>
                                    <p className="text-2xl font-bold text-blue-900 dark:text-blue-100">{stats.total_predictions}</p>
                                </div>
                                <BarChart3 className="h-8 w-8 text-blue-500" />
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-gradient-to-br from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-800/20 border-red-200 dark:border-red-700">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-red-600 dark:text-red-400 text-sm font-medium">High Risk</p>
                                    <p className="text-2xl font-bold text-red-900 dark:text-red-100">{stats.high_risk}</p>
                                </div>
                                <AlertTriangle className="h-8 w-8 text-red-500" />
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-gradient-to-br from-yellow-50 to-yellow-100 dark:from-yellow-900/20 dark:to-yellow-800/20 border-yellow-200 dark:border-yellow-700">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-yellow-600 dark:text-yellow-400 text-sm font-medium">Medium Risk</p>
                                    <p className="text-2xl font-bold text-yellow-900 dark:text-yellow-100">{stats.medium_risk}</p>
                                </div>
                                <Clock className="h-8 w-8 text-yellow-500" />
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 border-green-200 dark:border-green-700">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-green-600 dark:text-green-400 text-sm font-medium">Low Risk</p>
                                    <p className="text-2xl font-bold text-green-900 dark:text-green-100">{stats.low_risk}</p>
                                </div>
                                <CheckCircle className="h-8 w-8 text-green-500" />
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>

                {/* Filters */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="mb-6"
                >
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center space-x-2">
                                <Filter className="w-5 h-5" />
                                <span>Filters</span>
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Search
                                    </label>
                                    <div className="relative">
                                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                                        <input
                                            type="text"
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                            placeholder="Search KPIs..."
                                            className="pl-10 w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-sm"
                                        />
                                    </div>
                                </div>
                                
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Risk Level
                                    </label>
                                    <select
                                        value={selectedRiskLevel}
                                        onChange={(e) => setSelectedRiskLevel(e.target.value)}
                                        className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-sm"
                                    >
                                        <option value="">All Levels</option>
                                        <option value="High">High Risk</option>
                                        <option value="Medium">Medium Risk</option>
                                        <option value="Low">Low Risk</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        From Date
                                    </label>
                                    <input
                                        type="date"
                                        value={dateFrom}
                                        onChange={(e) => setDateFrom(e.target.value)}
                                        className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-sm"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        To Date
                                    </label>
                                    <input
                                        type="date"
                                        value={dateTo}
                                        onChange={(e) => setDateTo(e.target.value)}
                                        className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-sm"
                                    />
                                </div>

                                <div className="flex items-end">
                                    <Button onClick={handleSearch} className="w-full">
                                        <Search className="w-4 h-4 mr-2" />
                                        Search
                                    </Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>

                {/* Predictions List */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.3 }}
                >
                    <Card>
                        <CardHeader>
                            <CardTitle>Prediction History</CardTitle>
                            <CardDescription>
                                Recent AI predictions and their results
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            {predictions.data.length > 0 ? (
                                <div className="overflow-x-auto">
                                    <table className="w-full border-collapse">
                                        <thead>
                                            <tr className="border-b border-gray-200 dark:border-gray-700">
                                                <th className="text-left py-3 px-4 font-medium text-gray-700 dark:text-gray-300 text-sm">
                                                    TYPE
                                                </th>
                                                <th className="text-left py-3 px-4 font-medium text-gray-700 dark:text-gray-300 text-sm">
                                                    MODEL
                                                </th>
                                                <th className="text-left py-3 px-4 font-medium text-gray-700 dark:text-gray-300 text-sm">
                                                    CONFIDENCE
                                                </th>
                                                <th className="text-left py-3 px-4 font-medium text-gray-700 dark:text-gray-300 text-sm">
                                                    STATUS
                                                </th>
                                                <th className="text-left py-3 px-4 font-medium text-gray-700 dark:text-gray-300 text-sm">
                                                    DATE
                                                </th>
                                                <th className="text-left py-3 px-4 font-medium text-gray-700 dark:text-gray-300 text-sm">
                                                    PREDICTED RISK
                                                </th>
                                                <th className="text-left py-3 px-4 font-medium text-gray-700 dark:text-gray-300 text-sm">
                                                    ACTIONS
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-200">
                                            {predictions.data.map((prediction, index) => (
                                                <tr 
                                                    key={prediction.id} 
                                                    className="hover:bg-gray-50 transition-colors duration-150 ease-in-out animate-fade-in"
                                                    style={{ animationDelay: `${index * 50}ms` }}
                                                >
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                        {prediction.prediction_type || 'risk_assessment'}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                        {prediction.model_version || 'SRAP1.0_v1.0'}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                        {Math.round((prediction.confidence_score || 0.85) * 100)}%
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                                                            prediction.status === 'completed' ? 'bg-green-100 text-green-800 border-green-200' :
                                                            prediction.status === 'processing' ? 'bg-blue-100 text-blue-800 border-blue-200' :
                                                            prediction.status === 'pending' ? 'bg-yellow-100 text-yellow-800 border-yellow-200' :
                                                            prediction.status === 'failed' ? 'bg-red-100 text-red-800 border-red-200' :
                                                            'bg-gray-100 text-gray-800 border-gray-200'
                                                        }`}>
                                                            {prediction.status || 'completed'}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                        {new Date(prediction.prediction_date || prediction.created_at).toLocaleDateString('en-US', {
                                                            month: 'numeric',
                                                            day: 'numeric',
                                                            year: 'numeric'
                                                        })}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium border ${getRiskBadge(prediction.risk_level)}`}>
                                                            {getRiskIcon(prediction.prediction_result.risk_level)}
                                                            {prediction.prediction_result.risk_level || 'Unknown'}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                        <div className="flex items-center justify-end space-x-2">
                                                            <Link
                                                                href={`/admin/ai-predictions/${prediction.id}`}
                                                                className="text-indigo-600 hover:text-indigo-900 transition-colors duration-150"
                                                            >
                                                                <Eye className="w-4 h-4" />
                                                            </Link>
                                                            <button
                                                                onClick={() => handleDelete(prediction)}
                                                                className="text-red-600 hover:text-red-900 transition-colors duration-150"
                                                            >
                                                                <Trash2 className="w-4 h-4" />
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            ) : (
                                <div className="text-center py-12">
                                    <Brain className="mx-auto h-12 w-12 text-gray-400" />
                                    <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">No predictions found</h3>
                                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                                        Get started by creating your first AI risk prediction.
                                    </p>
                                    <div className="mt-6">
                                        <Button
                                            onClick={() => router.get('/admin/ai-predictions/create')}
                                            className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                                        >
                                            <Plus className="w-4 h-4 mr-2" />
                                            Create Prediction
                                        </Button>
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </motion.div>

                {/* Pagination */}
                {predictions.links && predictions.links.length > 3 && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.4 }}
                        className="mt-8 flex justify-center"
                    >
                        <div className="flex space-x-2">
                            {predictions.links.filter(link => link && typeof link === 'object').map((link, index) => {
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
                                            className="px-3 py-2 text-sm rounded-lg bg-purple-600 text-white"
                                            dangerouslySetInnerHTML={{ __html: linkLabel }}
                                        />
                                    );
                                }
                                
                                return (
                                    <Link
                                        key={`link-${index}`}
                                        href={link.url}
                                        className={`px-3 py-2 text-sm rounded-lg transition-colors ${
                                            isActive
                                                ? 'bg-purple-600 text-white'
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
