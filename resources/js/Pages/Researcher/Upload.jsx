import { Head } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { Upload, FileSpreadsheet, Database, CheckCircle, AlertCircle, Clock } from 'lucide-react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/Components/ui/Card';
import { Button } from '@/Components/ui/Button';
import { Badge } from '@/Components/ui/Badge';

export default function ResearcherUpload() {
    // Mock upload history
    const uploadHistory = [
        { id: 1, filename: 'research_data_2024.xlsx', size: '2.4 MB', status: 'completed', uploadedAt: '2 hours ago', records: 1250 },
        { id: 2, filename: 'survey_results.csv', size: '1.8 MB', status: 'processing', uploadedAt: '1 day ago', records: 890 },
        { id: 3, filename: 'field_study_data.xlsx', size: '3.2 MB', status: 'completed', uploadedAt: '3 days ago', records: 2100 },
        { id: 4, filename: 'questionnaire_responses.csv', size: '950 KB', status: 'failed', uploadedAt: '1 week ago', records: 0 },
    ];

    const getStatusIcon = (status) => {
        switch (status) {
            case 'completed':
                return <CheckCircle className="w-4 h-4 text-green-600" />;
            case 'processing':
                return <Clock className="w-4 h-4 text-yellow-600" />;
            case 'failed':
                return <AlertCircle className="w-4 h-4 text-red-600" />;
            default:
                return <Clock className="w-4 h-4 text-gray-600" />;
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'completed':
                return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300';
            case 'processing':
                return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300';
            case 'failed':
                return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300';
            default:
                return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-300';
        }
    };

    return (
        <AuthenticatedLayout>
            <Head title="Data Upload - Researcher" />

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
                                <Upload className="w-8 h-8 mr-3 text-blue-600" />
                                Data Upload
                            </h1>
                            <p className="text-gray-600 dark:text-gray-400 mt-2">
                                Upload Excel/CSV datasets for research analysis
                            </p>
                        </div>
                    </div>
                </motion.div>

                {/* Upload Stats */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.1 }}
                    className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8"
                >
                    <Card>
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Uploads</p>
                                    <p className="text-3xl font-bold text-gray-900 dark:text-white">47</p>
                                </div>
                                <Database className="w-8 h-8 text-blue-600" />
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Data Records</p>
                                    <p className="text-3xl font-bold text-gray-900 dark:text-white">24.5K</p>
                                </div>
                                <FileSpreadsheet className="w-8 h-8 text-green-600" />
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">This Month</p>
                                    <p className="text-3xl font-bold text-gray-900 dark:text-white">12</p>
                                </div>
                                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Processing</p>
                                    <p className="text-3xl font-bold text-gray-900 dark:text-white">3</p>
                                </div>
                                <Clock className="w-8 h-8 text-yellow-600" />
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Upload Area */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                    >
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center">
                                    <Upload className="w-5 h-5 mr-2" />
                                    Upload Dataset
                                </CardTitle>
                                <CardDescription>
                                    Upload Excel (.xlsx) or CSV (.csv) files for analysis
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center hover:border-blue-500 dark:hover:border-blue-400 transition-colors">
                                    <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                                    <p className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                                        Drop files here or click to browse
                                    </p>
                                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                                        Supports Excel (.xlsx) and CSV (.csv) files up to 50MB
                                    </p>
                                    <Button className="bg-blue-600 hover:bg-blue-700">
                                        Select Files
                                    </Button>
                                </div>
                                
                                <div className="mt-6">
                                    <h4 className="font-medium text-gray-900 dark:text-white mb-3">Upload Guidelines:</h4>
                                    <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-2">
                                        <li>• Ensure data is properly formatted with headers</li>
                                        <li>• Remove any sensitive or personal information</li>
                                        <li>• Use consistent date formats (YYYY-MM-DD)</li>
                                        <li>• Avoid special characters in column names</li>
                                    </ul>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>

                    {/* Upload History */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6, delay: 0.3 }}
                    >
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center">
                                    <Database className="w-5 h-5 mr-2" />
                                    Recent Uploads
                                </CardTitle>
                                <CardDescription>
                                    Track your uploaded datasets and their status
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {uploadHistory.map((upload, index) => (
                                        <motion.div
                                            key={upload.id}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ duration: 0.4, delay: index * 0.1 }}
                                            className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/50"
                                        >
                                            <div className="flex items-center space-x-3">
                                                <FileSpreadsheet className="w-8 h-8 text-blue-600" />
                                                <div>
                                                    <p className="font-medium text-gray-900 dark:text-white">
                                                        {upload.filename}
                                                    </p>
                                                    <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
                                                        <span>{upload.size}</span>
                                                        <span>•</span>
                                                        <span>{upload.uploadedAt}</span>
                                                        {upload.records > 0 && (
                                                            <>
                                                                <span>•</span>
                                                                <span>{upload.records.toLocaleString()} records</span>
                                                            </>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                {getStatusIcon(upload.status)}
                                                <Badge className={getStatusColor(upload.status)}>
                                                    {upload.status.charAt(0).toUpperCase() + upload.status.slice(1)}
                                                </Badge>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
