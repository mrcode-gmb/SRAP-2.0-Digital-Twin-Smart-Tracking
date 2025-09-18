import { useState, useEffect } from 'react';
import { Head, useForm, usePage } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { useToast } from '@/Contexts/ToastContext';
import { 
    Upload, 
    Download, 
    FileText, 
    AlertCircle, 
    CheckCircle,
    ArrowLeft,
    FileSpreadsheet,
    Clock,
    XCircle,
    User,
    Calendar,
    ExternalLink
} from 'lucide-react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Button } from '@/Components/ui/Button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/Components/ui/Card';
import { Badge } from '@/Components/ui/Badge';
import { Alert, AlertDescription } from '@/Components/ui/Alert';

export default function Create({ recentUploads = [] }) {
    const { showSuccess, showError, showWarning } = useToast();
    const { flash } = usePage().props;
    const [dragActive, setDragActive] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);
    const [uploadType, setUploadType] = useState('kpi_progress');
    
    const { data, setData, post, processing, errors, progress } = useForm({
        file: null,
        type: 'kpi_progress',
        overwrite_existing: false
    });

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
        if (flash?.upload_results) {
            const results = flash.upload_results;
            if (results.errors > 0) {
                showWarning(`Upload completed with ${results.errors} errors. Check the details for more information.`);
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

    const handleSubmit = (e) => {
        e.preventDefault();
        
        if (!selectedFile) {
            showError('Please select a file to upload');
            return;
        }
        
        setData('type', uploadType);
        post(route('admin.progress-upload.store'), {
            onStart: () => {
                showSuccess('Starting file upload...');
            },
            onSuccess: (page) => {
                setSelectedFile(null);
                setData('file', null);
                // Success message will be handled by useEffect from flash messages
            },
            onError: (errors) => {
                if (errors.file) {
                    showError(errors.file);
                } else {
                    showError('Upload failed. Please check your file and try again.');
                }
            }
        });
    };

    const downloadTemplate = (type) => {
        try {
            window.location.href = route('admin.progress-upload.template', type);
            showSuccess(`${type.replace('_', ' ').toUpperCase()} template download started`);
        } catch (error) {
            showError('Failed to download template. Please try again.');
        }
    };

    return (
        <AuthenticatedLayout>
            <Head title="Upload Progress Data" />
            
            <div className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => window.history.back()}
                                className="flex items-center space-x-2"
                            >
                                <ArrowLeft className="h-4 w-4" />
                                <span>Back</span>
                            </Button>
                            <div>
                                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                                    Upload Progress Data
                                </h1>
                                <p className="text-gray-600 dark:text-gray-400 mt-1">
                                    Upload KPI progress or milestone updates via Excel/CSV files
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Upload Form */}
                    <div className="lg:col-span-2">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center space-x-2">
                                    <Upload className="h-5 w-5" />
                                    <span>Upload File</span>
                                </CardTitle>
                                <CardDescription>
                                    Select the type of data and upload your Excel or CSV file
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                {/* Upload Type Selection */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                                        Upload Type
                                    </label>
                                    <div className="grid grid-cols-2 gap-4">
                                        <button
                                            type="button"
                                            onClick={() => setUploadType('kpi_progress')}
                                            className={`p-4 border-2 rounded-lg text-left transition-colors ${
                                                uploadType === 'kpi_progress'
                                                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                                                    : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'
                                            }`}
                                        >
                                            <div className="flex items-center space-x-3">
                                                <FileText className="h-5 w-5 text-blue-600" />
                                                <div>
                                                    <div className="font-medium">KPI Progress</div>
                                                    <div className="text-sm text-gray-500">Update KPI values and progress</div>
                                                </div>
                                            </div>
                                        </button>
                                        
                                        <button
                                            type="button"
                                            onClick={() => setUploadType('milestone_progress')}
                                            className={`p-4 border-2 rounded-lg text-left transition-colors ${
                                                uploadType === 'milestone_progress'
                                                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                                                    : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'
                                            }`}
                                        >
                                            <div className="flex items-center space-x-3">
                                                <CheckCircle className="h-5 w-5 text-green-600" />
                                                <div>
                                                    <div className="font-medium">Milestone Progress</div>
                                                    <div className="text-sm text-gray-500">Update milestone completion</div>
                                                </div>
                                            </div>
                                        </button>
                                    </div>
                                </div>

                                {/* File Upload Area */}
                                <form onSubmit={handleSubmit}>
                                    <div
                                        className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                                            dragActive
                                                ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                                                : 'border-gray-300 dark:border-gray-600 hover:border-gray-400'
                                        }`}
                                        onDragEnter={handleDrag}
                                        onDragLeave={handleDrag}
                                        onDragOver={handleDrag}
                                        onDrop={handleDrop}
                                    >
                                        <input
                                            type="file"
                                            accept=".xlsx,.xls,.csv"
                                            onChange={handleFileSelect}
                                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                        />
                                        
                                        <div className="space-y-4">
                                            <FileSpreadsheet className="mx-auto h-12 w-12 text-gray-400" />
                                            
                                            {selectedFile ? (
                                                <div>
                                                    <p className="text-lg font-medium text-gray-900 dark:text-white">
                                                        {selectedFile.name}
                                                    </p>
                                                    <p className="text-sm text-gray-500">
                                                        {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                                                    </p>
                                                </div>
                                            ) : (
                                                <div>
                                                    <p className="text-lg font-medium text-gray-900 dark:text-white">
                                                        Drop your file here, or click to browse
                                                    </p>
                                                    <p className="text-sm text-gray-500">
                                                        Supports Excel (.xlsx, .xls) and CSV files up to 10MB
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {errors.file && (
                                        <Alert className="mt-4">
                                            <AlertCircle className="h-4 w-4" />
                                            <AlertDescription>{errors.file}</AlertDescription>
                                        </Alert>
                                    )}

                                    {/* Options */}
                                    <div className="flex items-center space-x-2">
                                        <input
                                            type="checkbox"
                                            id="overwrite"
                                            checked={data.overwrite_existing}
                                            onChange={(e) => setData('overwrite_existing', e.target.checked)}
                                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                        />
                                        <label htmlFor="overwrite" className="text-sm text-gray-700 dark:text-gray-300">
                                            Overwrite existing records with same date/ID
                                        </label>
                                    </div>

                                    {/* Submit Button */}
                                    <div className="flex justify-end">
                                        <Button
                                            type="submit"
                                            disabled={!selectedFile || processing}
                                            className="flex items-center space-x-2"
                                        >
                                            <Upload className="h-4 w-4" />
                                            <span>{processing ? 'Uploading...' : 'Upload File'}</span>
                                        </Button>
                                    </div>

                                    {/* Progress Bar */}
                                    {progress && (
                                        <div className="w-full bg-gray-200 rounded-full h-2">
                                            <div
                                                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                                                style={{ width: `${progress.percentage}%` }}
                                            />
                                        </div>
                                    )}
                                </form>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Templates and Help */}
                    <div className="space-y-6">
                        {/* Download Templates */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center space-x-2">
                                    <Download className="h-5 w-5" />
                                    <span>Download Templates</span>
                                </CardTitle>
                                <CardDescription>
                                    Download Excel templates with the correct format
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                <Button
                                    variant="outline"
                                    onClick={() => downloadTemplate('kpi_progress')}
                                    className="w-full justify-start"
                                >
                                    <FileText className="h-4 w-4 mr-2" />
                                    KPI Progress Template
                                </Button>
                                <Button
                                    variant="outline"
                                    onClick={() => downloadTemplate('milestone_progress')}
                                    className="w-full justify-start"
                                >
                                    <CheckCircle className="h-4 w-4 mr-2" />
                                    Milestone Progress Template
                                </Button>
                            </CardContent>
                        </Card>

                        {/* File Format Requirements */}
                        <Card>
                            <CardHeader>
                                <CardTitle>File Requirements</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div>
                                    <h4 className="font-medium text-gray-900 dark:text-white mb-2">
                                        KPI Progress Format
                                    </h4>
                                    <div className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
                                        <div>• KPI ID (required)</div>
                                        <div>• Reporting Date (required)</div>
                                        <div>• Current Value (required)</div>
                                        <div>• Notes (optional)</div>
                                        <div>• Entry Type (optional)</div>
                                        <div>• Source (optional)</div>
                                    </div>
                                </div>

                                <div>
                                    <h4 className="font-medium text-gray-900 dark:text-white mb-2">
                                        Milestone Progress Format
                                    </h4>
                                    <div className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
                                        <div>• Milestone ID (required)</div>
                                        <div>• Completion Percentage (required)</div>
                                        <div>• Status (optional)</div>
                                        <div>• Notes (optional)</div>
                                        <div>• Completed Date (optional)</div>
                                    </div>
                                </div>

                                <Alert>
                                    <AlertCircle className="h-4 w-4" />
                                    <AlertDescription className="text-xs">
                                        Make sure your file has headers in the first row matching the template format exactly.
                                    </AlertDescription>
                                </Alert>
                            </CardContent>
                        </Card>
                    </div>
                </div>

                {/* Recent Uploads Section */}
                {recentUploads.length > 0 && (
                    <div className="mt-12">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center space-x-2">
                                    <FileText className="h-5 w-5" />
                                    <span>Recent Uploads</span>
                                </CardTitle>
                                <CardDescription>
                                    View your recently uploaded files and their processing status
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {recentUploads.map((upload, index) => (
                                        <motion.div
                                            key={upload.id}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: index * 0.1 }}
                                            className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                                        >
                                            <div className="flex items-center space-x-4">
                                                <div className="flex-shrink-0">
                                                    <FileSpreadsheet className="h-8 w-8 text-green-600" />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center space-x-2">
                                                        <h4 className="text-sm font-medium text-gray-900 dark:text-white truncate">
                                                            {upload.original_filename}
                                                        </h4>
                                                        <Badge 
                                                            variant={upload.status === 'completed' ? 'success' : 
                                                                    upload.status === 'failed' ? 'destructive' : 
                                                                    upload.status === 'processing' ? 'default' : 'secondary'}
                                                        >
                                                            {upload.status === 'completed' && <CheckCircle className="h-3 w-3 mr-1" />}
                                                            {upload.status === 'failed' && <XCircle className="h-3 w-3 mr-1" />}
                                                            {upload.status === 'processing' && <Clock className="h-3 w-3 mr-1" />}
                                                            {upload.status.charAt(0).toUpperCase() + upload.status.slice(1)}
                                                        </Badge>
                                                    </div>
                                                    <div className="flex items-center space-x-4 mt-1 text-xs text-gray-500">
                                                        <div className="flex items-center space-x-1">
                                                            <User className="h-3 w-3" />
                                                            <span>{upload.uploader?.name || 'Unknown'}</span>
                                                        </div>
                                                        <div className="flex items-center space-x-1">
                                                            <Calendar className="h-3 w-3" />
                                                            <span>{new Date(upload.created_at).toLocaleDateString()}</span>
                                                        </div>
                                                        <div className="flex items-center space-x-1">
                                                            <FileText className="h-3 w-3" />
                                                            <span>{upload.file_type.replace('_', ' ').toUpperCase()}</span>
                                                        </div>
                                                        <div>
                                                            <span>{(upload.file_size / 1024 / 1024).toFixed(2)} MB</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                {upload.status === 'completed' && (
                                                    <div className="text-right text-xs text-gray-500">
                                                        <div className="text-green-600 font-medium">
                                                            {upload.records_processed} records processed
                                                        </div>
                                                        {upload.errors_count > 0 && (
                                                            <div className="text-red-600">
                                                                {upload.errors_count} errors
                                                            </div>
                                                        )}
                                                    </div>
                                                )}
                                                {upload.status === 'failed' && (
                                                    <div className="text-right text-xs text-red-600">
                                                        <div>Processing failed</div>
                                                        {upload.error_details && upload.error_details.length > 0 && (
                                                            <div className="text-xs">
                                                                {upload.error_details[0].error}
                                                            </div>
                                                        )}
                                                    </div>
                                                )}
                                                {upload.status === 'processing' && (
                                                    <div className="text-right text-xs text-blue-600">
                                                        <div className="flex items-center space-x-1">
                                                            <Clock className="h-3 w-3 animate-spin" />
                                                            <span>Processing...</span>
                                                        </div>
                                                    </div>
                                                )}
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => window.open(`/storage/${upload.file_path}`, '_blank')}
                                                    className="opacity-0 group-hover:opacity-100 transition-opacity"
                                                >
                                                    <ExternalLink className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                )}
            </div>
        </AuthenticatedLayout>
    );
}
