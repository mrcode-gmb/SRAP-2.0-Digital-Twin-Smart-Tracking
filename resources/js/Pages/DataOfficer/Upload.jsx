import React, { useState, useRef } from 'react';
import { Head, useForm, usePage } from '@inertiajs/react';
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
    Database,
    FileSpreadsheet,
    Target,
    Calendar
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/Components/ui/Card';
import { Button } from '@/Components/ui/Button';
import { Badge } from '@/Components/ui/Badge';

export default function DataOfficerUpload({ auth }) {
    const { showSuccess, showError, showWarning } = useToast();
    const fileInputRef = useRef(null);
    const [dragActive, setDragActive] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [isUploading, setIsUploading] = useState(false);

    const { data, setData, post, processing, errors, reset } = useForm({
        file: null,
        type: 'kpi_progress',
        overwrite_existing: false
    });

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
            handleFileSelect(e.dataTransfer.files[0]);
        }
    };

    const handleFileSelect = (file) => {
        if (file) {
            const allowedTypes = [
                'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                'application/vnd.ms-excel',
                'text/csv'
            ];
            
            if (!allowedTypes.includes(file.type)) {
                showError('Please select an Excel (.xlsx, .xls) or CSV file');
                return;
            }
            
            if (file.size > 10 * 1024 * 1024) { // 10MB limit
                showError('File size must be less than 10MB');
                return;
            }
            
            setData('file', file);
            showSuccess(`File "${file.name}" selected successfully`);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        
        if (!data.file) {
            showError('Please select a file to upload');
            return;
        }

        setIsUploading(true);
        setUploadProgress(0);

        // Simulate upload progress
        const progressInterval = setInterval(() => {
            setUploadProgress(prev => {
                if (prev >= 90) {
                    clearInterval(progressInterval);
                    return prev;
                }
                return prev + 10;
            });
        }, 200);

        post('/admin/progress-upload', {
            onSuccess: (page) => {
                clearInterval(progressInterval);
                setUploadProgress(100);
                showSuccess('File uploaded successfully! Awaiting HOD approval.');
                reset();
                setIsUploading(false);
                if (fileInputRef.current) {
                    fileInputRef.current.value = '';
                }
                // Stay on the same page instead of redirecting
            },
            onError: (errors) => {
                clearInterval(progressInterval);
                setUploadProgress(0);
                setIsUploading(false);
                showError('Upload failed. Please try again.');
            }
        });
    };

    const downloadTemplate = (type) => {
        window.location.href = `/admin/progress-upload/template/${type}`;
    };

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="Upload KPI Data - Data Officer" />

            <div className="py-6">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                            Upload KPI Progress Data
                        </h1>
                        <p className="mt-2 text-gray-600 dark:text-gray-400">
                            Upload Excel or CSV files with KPI progress data for review and approval
                        </p>
                    </div>

                    {/* Quick Stats */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                        <Card>
                            <CardContent className="p-6">
                                <div className="flex items-center">
                                    <div className="p-2 bg-blue-100 rounded-lg">
                                        <Upload className="h-6 w-6 text-blue-600" />
                                    </div>
                                    <div className="ml-4">
                                        <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Ready to Upload</p>
                                        <p className="text-2xl font-bold text-gray-900 dark:text-white">
                                            {data.file ? '1 File' : 'No File'}
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                        
                        <Card>
                            <CardContent className="p-6">
                                <div className="flex items-center">
                                    <div className="p-2 bg-yellow-100 rounded-lg">
                                        <Clock className="h-6 w-6 text-yellow-600" />
                                    </div>
                                    <div className="ml-4">
                                        <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Pending Approval</p>
                                        <p className="text-2xl font-bold text-gray-900 dark:text-white">-</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                        
                        <Card>
                            <CardContent className="p-6">
                                <div className="flex items-center">
                                    <div className="p-2 bg-green-100 rounded-lg">
                                        <CheckCircle className="h-6 w-6 text-green-600" />
                                    </div>
                                    <div className="ml-4">
                                        <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Approved Today</p>
                                        <p className="text-2xl font-bold text-gray-900 dark:text-white">-</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Upload Form */}
                    <Card className="mb-8">
                        <CardHeader>
                            <CardTitle className="flex items-center">
                                <Upload className="w-5 h-5 mr-2" />
                                Upload KPI Progress Data
                            </CardTitle>
                            <CardDescription>
                                Select an Excel or CSV file containing KPI progress updates
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleSubmit} className="space-y-6">
                                {/* File Upload Area */}
                                <div
                                    className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                                        dragActive 
                                            ? 'border-blue-400 bg-blue-50 dark:bg-blue-900/20' 
                                            : 'border-gray-300 dark:border-gray-600 hover:border-gray-400'
                                    }`}
                                    onDragEnter={handleDrag}
                                    onDragLeave={handleDrag}
                                    onDragOver={handleDrag}
                                    onDrop={handleDrop}
                                >
                                    <input
                                        ref={fileInputRef}
                                        type="file"
                                        accept=".xlsx,.xls,.csv"
                                        onChange={(e) => handleFileSelect(e.target.files[0])}
                                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                    />
                                    
                                    <div className="space-y-4">
                                        <div className="mx-auto w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center">
                                            <FileSpreadsheet className="w-8 h-8 text-gray-400" />
                                        </div>
                                        
                                        {data.file ? (
                                            <div>
                                                <p className="text-lg font-medium text-gray-900 dark:text-white">
                                                    {data.file.name}
                                                </p>
                                                <p className="text-sm text-gray-500">
                                                    {(data.file.size / 1024 / 1024).toFixed(2)} MB
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
                                    <div className="flex items-center text-red-600 text-sm">
                                        <AlertCircle className="w-4 h-4 mr-2" />
                                        {errors.file}
                                    </div>
                                )}

                                {/* Upload Options */}
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            Data Type
                                        </label>
                                        <select
                                            value={data.type}
                                            onChange={(e) => setData('type', e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                                        >
                                            <option value="kpi_progress">KPI Progress Data</option>
                                            <option value="milestone_progress">Milestone Progress Data</option>
                                        </select>
                                    </div>

                                    <div className="flex items-center">
                                        <input
                                            type="checkbox"
                                            id="overwrite"
                                            checked={data.overwrite_existing}
                                            onChange={(e) => setData('overwrite_existing', e.target.checked)}
                                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                        />
                                        <label htmlFor="overwrite" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                                            Overwrite existing data for the same date
                                        </label>
                                    </div>
                                </div>

                                {/* Upload Progress */}
                                {isUploading && (
                                    <div className="space-y-2">
                                        <div className="flex justify-between text-sm">
                                            <span>Uploading...</span>
                                            <span>{uploadProgress}%</span>
                                        </div>
                                        <div className="w-full bg-gray-200 rounded-full h-2">
                                            <div 
                                                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                                                style={{ width: `${uploadProgress}%` }}
                                            ></div>
                                        </div>
                                    </div>
                                )}

                                {/* Submit Button */}
                                <div className="flex space-x-4">
                                    <Button
                                        type="submit"
                                        disabled={processing || isUploading || !data.file}
                                        className="flex-1"
                                    >
                                        {processing || isUploading ? (
                                            <>
                                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                                Uploading...
                                            </>
                                        ) : (
                                            <>
                                                <Upload className="w-4 h-4 mr-2" />
                                                Upload Data
                                            </>
                                        )}
                                    </Button>
                                </div>
                            </form>
                        </CardContent>
                    </Card>

                    {/* Template Downloads */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center">
                                <Download className="w-5 h-5 mr-2" />
                                Download Templates
                            </CardTitle>
                            <CardDescription>
                                Download Excel templates with the correct format for data upload
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <Button
                                    onClick={() => downloadTemplate('kpi_progress')}
                                    variant="outline"
                                    className="flex items-center justify-center p-4 h-auto"
                                >
                                    <div className="text-center">
                                        <Target className="w-8 h-8 mx-auto mb-2 text-blue-600" />
                                        <div className="font-medium">KPI Progress Template</div>
                                        <div className="text-sm text-gray-500">Excel format for KPI updates</div>
                                    </div>
                                </Button>
                                
                                <Button
                                    onClick={() => downloadTemplate('milestone_progress')}
                                    variant="outline"
                                    className="flex items-center justify-center p-4 h-auto"
                                >
                                    <div className="text-center">
                                        <Calendar className="w-8 h-8 mx-auto mb-2 text-green-600" />
                                        <div className="font-medium">Milestone Template</div>
                                        <div className="text-sm text-gray-500">Excel format for milestone updates</div>
                                    </div>
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
