import React, { useState, useEffect } from 'react';
import { Head, useForm, usePage, router } from '@inertiajs/react';
import { motion } from 'framer-motion';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { useToast } from '@/Contexts/ToastContext';
import { 
    Brain,
    ArrowLeft,
    Upload,
    Download,
    AlertTriangle,
    CheckCircle,
    Clock,
    TrendingUp,
    BarChart3,
    FileSpreadsheet,
    Zap,
    X
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/Components/ui/Card';
import { Button } from '@/Components/ui/Button';
import { Badge } from '@/Components/ui/Badge';

export default function AiPredictionCreate({ kpis = [] }) {
    const { showSuccess, showError, showWarning } = useToast();
    const { flash } = usePage().props;
    const [dragActive, setDragActive] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);
    const [predictionMode, setPredictionMode] = useState('manual'); // 'manual' or 'bulk'
    const [predictionResults, setPredictionResults] = useState(null);

    const { data, setData, post, processing, errors, progress } = useForm({
        kpi_id: '',
        progress: '',
        budget_utilization: '',
        delay_days: '',
        stakeholder_engagement_score: '',
        ai_predicted_success: '',
        file: null,
        overwrite_existing: false
    });

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
        if (flash?.prediction_results) {
            const results = flash.prediction_results;
            setPredictionResults(results);
            if (results.error_count > 0) {
                showWarning(`Bulk prediction completed with ${results.error_count} errors. Check the details for more information.`);
            }
        }
    }, [flash, showSuccess, showError, showWarning]);

    const handleDrag = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            const file = e.dataTransfer.files[0];
            setSelectedFile(file);
            setData('file', file);
        }
    };

    const handleFileSelect = (e) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setSelectedFile(file);
            setData('file', file);
        }
    };

    const handleManualSubmit = (e) => {
        e.preventDefault();
        
        if (!data.kpi_id) {
            showError('Please select a KPI');
            return;
        }

        post(route('admin.ai-predictions.store'), {
            onStart: () => {
                showSuccess('Processing AI prediction...');
            },
            onSuccess: () => {
                showSuccess('AI prediction completed successfully!');
            },
            onError: (errors) => {
                if (Object.keys(errors).length > 0) {
                    showError('Please check the form for errors');
                } else {
                    showError('Prediction failed. Please try again.');
                }
            }
        });
    };

    const handleBulkSubmit = (e) => {
        e.preventDefault();
        
        if (!selectedFile) {
            showError('Please select a file to upload');
            return;
        }

        post(route('admin.ai-predictions.bulk'), {
            onStart: () => {
                showSuccess('Starting bulk prediction processing...');
            },
            onSuccess: () => {
                setSelectedFile(null);
                setData('file', null);
            },
            onError: (errors) => {
                if (errors.file) {
                    showError(errors.file);
                } else {
                    showError('Bulk prediction failed. Please check your file and try again.');
                }
            }
        });
    };

    const downloadTemplate = () => {
        try {
            window.open('/admin/ai-predictions/template', '_blank');
            showSuccess('Template download started');
        } catch (error) {
            showError('Failed to download template. Please try again.');
        }
    };

    return (
        <AuthenticatedLayout>
            <Head title="Create AI Prediction" />
            
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
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => router.get('/admin/ai-predictions')}
                                className="flex items-center space-x-2"
                            >
                                <ArrowLeft className="h-4 w-4" />
                                <span>Back</span>
                            </Button>
                            <div className="flex items-center space-x-4">
                                <div className="p-3 bg-gradient-to-br from-purple-500 to-blue-600 rounded-xl">
                                    <Brain className="h-8 w-8 text-white" />
                                </div>
                                <div>
                                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                                        Create AI Risk Prediction
                                    </h1>
                                    <p className="text-gray-600 dark:text-gray-400 mt-1">
                                        Generate AI-powered risk assessments for KPI performance
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Mode Selection */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.1 }}
                    className="mb-8"
                >
                    <Card>
                        <CardHeader>
                            <CardTitle>Prediction Mode</CardTitle>
                            <CardDescription>
                                Choose between manual input or bulk file upload
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="flex space-x-4">
                                <button
                                    onClick={() => setPredictionMode('manual')}
                                    className={`flex-1 p-4 rounded-lg border-2 transition-all ${
                                        predictionMode === 'manual'
                                            ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20'
                                            : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'
                                    }`}
                                >
                                    <div className="text-center">
                                        <Zap className={`mx-auto h-8 w-8 mb-2 ${
                                            predictionMode === 'manual' ? 'text-purple-600' : 'text-gray-400'
                                        }`} />
                                        <h3 className="font-semibold text-gray-900 dark:text-white">Manual Input</h3>
                                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                            Enter parameters manually for single prediction
                                        </p>
                                    </div>
                                </button>
                                
                                <button
                                    onClick={() => setPredictionMode('bulk')}
                                    className={`flex-1 p-4 rounded-lg border-2 transition-all ${
                                        predictionMode === 'bulk'
                                            ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20'
                                            : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'
                                    }`}
                                >
                                    <div className="text-center">
                                        <FileSpreadsheet className={`mx-auto h-8 w-8 mb-2 ${
                                            predictionMode === 'bulk' ? 'text-purple-600' : 'text-gray-400'
                                        }`} />
                                        <h3 className="font-semibold text-gray-900 dark:text-white">Bulk Upload</h3>
                                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                            Upload Excel/CSV file for multiple predictions
                                        </p>
                                    </div>
                                </button>
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Form */}
                    <div className="lg:col-span-2">
                        {predictionMode === 'manual' ? (
                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.6, delay: 0.2 }}
                            >
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="flex items-center space-x-2">
                                            <Brain className="w-5 h-5" />
                                            <span>Manual Prediction Input</span>
                                        </CardTitle>
                                        <CardDescription>
                                            Enter KPI parameters for AI risk assessment
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <form onSubmit={handleManualSubmit} className="space-y-6">
                                            {/* KPI Selection */}
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                    Select KPI *
                                                </label>
                                                <select
                                                    value={data.kpi_id}
                                                    onChange={(e) => setData('kpi_id', e.target.value)}
                                                    className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2"
                                                    required
                                                >
                                                    <option value="">Choose a KPI...</option>
                                                    {kpis.map((kpi) => (
                                                        <option key={kpi.id} value={kpi.id}>
                                                            {kpi.name} ({kpi.current_value}/{kpi.target_value})
                                                        </option>
                                                    ))}
                                                </select>
                                                {errors.kpi_id && (
                                                    <p className="text-red-500 text-sm mt-1">{errors.kpi_id}</p>
                                                )}
                                            </div>

                                            {/* Input Parameters */}
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                        Progress (%) *
                                                    </label>
                                                    <input
                                                        type="number"
                                                        step="0.1"
                                                        min="0"
                                                        max="100"
                                                        value={data.progress}
                                                        onChange={(e) => setData('progress', e.target.value)}
                                                        className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2"
                                                        placeholder="e.g., 75.5"
                                                        required
                                                    />
                                                    {errors.progress && (
                                                        <p className="text-red-500 text-sm mt-1">{errors.progress}</p>
                                                    )}
                                                </div>

                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                        Budget Utilization (%) *
                                                    </label>
                                                    <input
                                                        type="number"
                                                        step="0.1"
                                                        min="0"
                                                        max="200"
                                                        value={data.budget_utilization}
                                                        onChange={(e) => setData('budget_utilization', e.target.value)}
                                                        className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2"
                                                        placeholder="e.g., 85.0"
                                                        required
                                                    />
                                                    {errors.budget_utilization && (
                                                        <p className="text-red-500 text-sm mt-1">{errors.budget_utilization}</p>
                                                    )}
                                                </div>

                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                        Delay Days *
                                                    </label>
                                                    <input
                                                        type="number"
                                                        min="0"
                                                        value={data.delay_days}
                                                        onChange={(e) => setData('delay_days', e.target.value)}
                                                        className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2"
                                                        placeholder="e.g., 5"
                                                        required
                                                    />
                                                    {errors.delay_days && (
                                                        <p className="text-red-500 text-sm mt-1">{errors.delay_days}</p>
                                                    )}
                                                </div>

                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                        Stakeholder Engagement Score *
                                                    </label>
                                                    <input
                                                        type="number"
                                                        step="0.1"
                                                        min="0"
                                                        max="10"
                                                        value={data.stakeholder_engagement_score}
                                                        onChange={(e) => setData('stakeholder_engagement_score', e.target.value)}
                                                        className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2"
                                                        placeholder="e.g., 8.5"
                                                        required
                                                    />
                                                    {errors.stakeholder_engagement_score && (
                                                        <p className="text-red-500 text-sm mt-1">{errors.stakeholder_engagement_score}</p>
                                                    )}
                                                </div>
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                    AI Predicted Success (%) *
                                                </label>
                                                <input
                                                    type="number"
                                                    step="0.1"
                                                    min="0"
                                                    max="100"
                                                    value={data.ai_predicted_success}
                                                    onChange={(e) => setData('ai_predicted_success', e.target.value)}
                                                    className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2"
                                                    placeholder="e.g., 82.0"
                                                    required
                                                />
                                                {errors.ai_predicted_success && (
                                                    <p className="text-red-500 text-sm mt-1">{errors.ai_predicted_success}</p>
                                                )}
                                            </div>

                                            <Button
                                                type="submit"
                                                disabled={processing}
                                                className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                                            >
                                                {processing ? (
                                                    <>
                                                        <Clock className="w-4 h-4 mr-2 animate-spin" />
                                                        Processing Prediction...
                                                    </>
                                                ) : (
                                                    <>
                                                        <Brain className="w-4 h-4 mr-2" />
                                                        Generate AI Prediction
                                                    </>
                                                )}
                                            </Button>
                                        </form>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        ) : (
                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.6, delay: 0.2 }}
                            >
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="flex items-center space-x-2">
                                            <Upload className="w-5 h-5" />
                                            <span>Bulk Prediction Upload</span>
                                        </CardTitle>
                                        <CardDescription>
                                            Upload Excel/CSV file for multiple AI predictions
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <form onSubmit={handleBulkSubmit} className="space-y-6">
                                            {/* File Upload Area */}
                                            <div
                                                className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                                                    dragActive
                                                        ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20'
                                                        : 'border-gray-300 dark:border-gray-600 hover:border-gray-400'
                                                }`}
                                                onDragEnter={handleDrag}
                                                onDragLeave={handleDrag}
                                                onDragOver={handleDrag}
                                                onDrop={handleDrop}
                                            >
                                                <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                                                <div className="space-y-2">
                                                    <p className="text-lg font-medium text-gray-900 dark:text-white">
                                                        Drop your file here, or{' '}
                                                        <label className="text-purple-600 hover:text-purple-700 cursor-pointer">
                                                            browse
                                                            <input
                                                                type="file"
                                                                className="hidden"
                                                                accept=".xlsx,.xls,.csv"
                                                                onChange={handleFileSelect}
                                                            />
                                                        </label>
                                                    </p>
                                                    <p className="text-sm text-gray-500 dark:text-gray-400">
                                                        Excel (.xlsx, .xls) or CSV files only. Max 10MB.
                                                    </p>
                                                    <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">
                                                        Required columns: Progress (%), Budget_Utilization (%), Delay_Days, Stakeholder_Engagement_Score, AI_Predicted_Success (%)
                                                    </p>
                                                </div>

                                                {selectedFile && (
                                                    <div className="flex items-center space-x-3">
                                                        <FileSpreadsheet className="h-8 w-8 text-green-600" />
                                                        <div>
                                                            <p className="font-medium text-green-900 dark:text-green-100">
                                                                {selectedFile.name}
                                                            </p>
                                                            <p className="text-sm text-green-600 dark:text-green-400">
                                                                {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                                                            </p>
                                                        </div>
                                                        <Button
                                                            type="button"
                                                            variant="ghost"
                                                            size="sm"
                                                            onClick={() => setSelectedFile(null)}
                                                        >
                                                            <X className="w-4 h-4" />
                                                        </Button>
                                                    </div>
                                                )}
                                            </div>

                                            {errors.file && (
                                                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 rounded-lg p-4">
                                                    <p className="text-red-600 dark:text-red-400">{errors.file}</p>
                                                </div>
                                            )}

                                            <div className="flex items-center space-x-3">
                                                <input
                                                    type="checkbox"
                                                    id="overwrite"
                                                    checked={data.overwrite_existing}
                                                    onChange={(e) => setData('overwrite_existing', e.target.checked)}
                                                    className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                                                />
                                                <label htmlFor="overwrite" className="text-sm text-gray-700 dark:text-gray-300">
                                                    Overwrite existing predictions for same parameters
                                                </label>
                                            </div>

                                            <Button
                                                type="submit"
                                                disabled={processing || !selectedFile}
                                                className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                                            >
                                                {processing ? (
                                                    <>
                                                        <Clock className="w-4 h-4 mr-2 animate-spin" />
                                                        Processing Bulk Predictions...
                                                    </>
                                                ) : (
                                                    <>
                                                        <Upload className="w-4 h-4 mr-2" />
                                                        Upload & Process
                                                    </>
                                                )}
                                            </Button>
                                        </form>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        )}
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Template Download */}
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.6, delay: 0.3 }}
                        >
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center space-x-2">
                                        <Download className="w-5 h-5" />
                                        <span>Template</span>
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                                        Download the Excel template with required columns and sample data.
                                    </p>
                                    <Button
                                        onClick={downloadTemplate}
                                        variant="outline"
                                        className="w-full"
                                    >
                                        <Download className="w-4 h-4 mr-2" />
                                        Download Template
                                    </Button>
                                </CardContent>
                            </Card>
                        </motion.div>

                        {/* Required Parameters */}
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.6, delay: 0.4 }}
                        >
                            <Card>
                                <CardHeader>
                                    <CardTitle>Required Parameters</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-3 text-sm">
                                        <div className="flex items-center space-x-2">
                                            <TrendingUp className="w-4 h-4 text-blue-500" />
                                            <span>Progress (%): 0-100</span>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <BarChart3 className="w-4 h-4 text-green-500" />
                                            <span>Budget Utilization (%): 0-200</span>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <Clock className="w-4 h-4 text-yellow-500" />
                                            <span>Delay Days: 0+</span>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <CheckCircle className="w-4 h-4 text-purple-500" />
                                            <span>Engagement Score: 0-10</span>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <Brain className="w-4 h-4 text-indigo-500" />
                                            <span>AI Success (%): 0-100</span>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>

                        {/* Risk Levels */}
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.6, delay: 0.5 }}
                        >
                            <Card>
                                <CardHeader>
                                    <CardTitle>Risk Assessment</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-3">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center space-x-2">
                                                <CheckCircle className="w-4 h-4 text-green-500" />
                                                <span className="text-sm">Low Risk</span>
                                            </div>
                                            <Badge className="bg-green-100 text-green-800 border-green-200">
                                                0-3.9
                                            </Badge>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center space-x-2">
                                                <Clock className="w-4 h-4 text-yellow-500" />
                                                <span className="text-sm">Medium Risk</span>
                                            </div>
                                            <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">
                                                4.0-6.9
                                            </Badge>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center space-x-2">
                                                <AlertTriangle className="w-4 h-4 text-red-500" />
                                                <span className="text-sm">High Risk</span>
                                            </div>
                                            <Badge className="bg-red-100 text-red-800 border-red-200">
                                                7.0-10
                                            </Badge>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>
                    </div>

                    {/* Prediction Results Table */}
                    {predictionResults && predictionResults.predictions && predictionResults.predictions.length > 0 && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.3 }}
                            className="mt-8"
                        >
                            <Card>
                                <CardHeader>
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <CardTitle className="flex items-center space-x-2">
                                                <CheckCircle className="w-5 h-5 text-green-600" />
                                                <span>Prediction Results</span>
                                            </CardTitle>
                                            <CardDescription>
                                                Preview of predictions (first 10 rows)
                                            </CardDescription>
                                        </div>
                                        {predictionResults.download_link && (
                                            <Button
                                                variant="outline"
                                                onClick={() => window.open(predictionResults.download_link, '_blank')}
                                                className="bg-yellow-500 hover:bg-yellow-600 text-white border-yellow-500"
                                            >
                                                <Download className="w-4 h-4 mr-2" />
                                                Download Results
                                            </Button>
                                        )}
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <div className="overflow-x-auto">
                                        <table className="w-full border-collapse border border-gray-200 dark:border-gray-700">
                                            <thead>
                                                <tr className="bg-gray-50 dark:bg-gray-800">
                                                    <th className="border border-gray-200 dark:border-gray-700 px-4 py-2 text-left font-medium text-gray-900 dark:text-white">
                                                        Progress (%)
                                                    </th>
                                                    <th className="border border-gray-200 dark:border-gray-700 px-4 py-2 text-left font-medium text-gray-900 dark:text-white">
                                                        Budget Utilization (%)
                                                    </th>
                                                    <th className="border border-gray-200 dark:border-gray-700 px-4 py-2 text-left font-medium text-gray-900 dark:text-white">
                                                        Delay Days
                                                    </th>
                                                    <th className="border border-gray-200 dark:border-gray-700 px-4 py-2 text-left font-medium text-gray-900 dark:text-white">
                                                        Stakeholder Engagement Score
                                                    </th>
                                                    <th className="border border-gray-200 dark:border-gray-700 px-4 py-2 text-left font-medium text-gray-900 dark:text-white">
                                                        AI Predicted Success (%)
                                                    </th>
                                                    <th className="border border-gray-200 dark:border-gray-700 px-4 py-2 text-left font-medium text-gray-900 dark:text-white">
                                                        Predicted Risk
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {predictionResults.predictions.slice(0, 10).map((prediction, index) => (
                                                    <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                                                        <td className="border border-gray-200 dark:border-gray-700 px-4 py-2 text-gray-900 dark:text-white">
                                                            {prediction.progress}
                                                        </td>
                                                        <td className="border border-gray-200 dark:border-gray-700 px-4 py-2 text-gray-900 dark:text-white">
                                                            {prediction.budget_utilization}
                                                        </td>
                                                        <td className="border border-gray-200 dark:border-gray-700 px-4 py-2 text-gray-900 dark:text-white">
                                                            {prediction.delay_days}
                                                        </td>
                                                        <td className="border border-gray-200 dark:border-gray-700 px-4 py-2 text-gray-900 dark:text-white">
                                                            {prediction.stakeholder_engagement_score}
                                                        </td>
                                                        <td className="border border-gray-200 dark:border-gray-700 px-4 py-2 text-gray-900 dark:text-white">
                                                            {prediction.ai_predicted_success}
                                                        </td>
                                                        <td className="border border-gray-200 dark:border-gray-700 px-4 py-2">
                                                            <Badge 
                                                                className={
                                                                    prediction.predicted_risk === 'Low' 
                                                                        ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300'
                                                                        : prediction.predicted_risk === 'Medium'
                                                                        ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300'
                                                                        : 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300'
                                                                }
                                                            >
                                                                {prediction.predicted_risk}
                                                            </Badge>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                    
                                    {predictionResults.predictions.length > 10 && (
                                        <div className="mt-4 text-center">
                                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                                Showing first 10 of {predictionResults.predictions.length} predictions.
                                                <br />
                                                Download the full results file to see all predictions.
                                            </p>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        </motion.div>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
