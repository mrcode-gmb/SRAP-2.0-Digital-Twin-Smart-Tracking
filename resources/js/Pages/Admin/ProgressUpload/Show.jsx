import { Head, Link } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { ArrowLeft, FileText, CheckCircle, XCircle, Clock } from 'lucide-react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/Components/ui/Card';
import { Button } from '@/Components/ui/Button';
import { Badge } from '@/Components/ui/Badge';

export default function ShowProgressUpload({ upload }) {
    const getStatusBadge = (status) => {
        const config = {
            completed: { color: 'bg-green-100 text-green-800', icon: CheckCircle },
            failed: { color: 'bg-red-100 text-red-800', icon: XCircle },
            processing: { color: 'bg-yellow-100 text-yellow-800', icon: Clock }
        };
        
        const { color, icon: Icon } = config[status] || config.processing;
        
        return (
            <Badge className={color}>
                <Icon className="w-3 h-3 mr-1" />
                {status.charAt(0).toUpperCase() + status.slice(1)}
            </Badge>
        );
    };

    return (
        <AuthenticatedLayout>
            <Head title={`Upload Details - ${upload.original_filename}`} />

            <div className="px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
                <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
                    <div className="flex items-center space-x-4">
                        <Link href={route('admin.progress-upload.index')}>
                            <Button variant="ghost" className="flex items-center text-gray-500 hover:text-gray-700">
                                <ArrowLeft className="w-4 h-4 mr-1" />
                                Back to Uploads
                            </Button>
                        </Link>
                        <div className="h-6 w-px bg-gray-300" />
                        <div className="flex items-center space-x-2">
                            <FileText className="w-6 h-6 text-blue-600" />
                            <h1 className="text-2xl font-bold text-gray-900">Upload Details</h1>
                        </div>
                    </div>
                </motion.div>

                <div className="space-y-6">
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center justify-between">
                                    File Information
                                    {getStatusBadge(upload.status)}
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-sm font-medium text-gray-500">Original Filename</label>
                                        <p className="text-sm text-gray-900 font-mono">{upload.original_filename}</p>
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-gray-500">File Type</label>
                                        <p className="text-sm text-gray-900">{upload.file_type?.replace('_', ' ').toUpperCase()}</p>
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-gray-500">Records Processed</label>
                                        <p className="text-sm text-gray-900">{upload.records_processed || 0}</p>
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-gray-500">Errors</label>
                                        <p className="text-sm text-gray-900">{upload.errors_count || 0}</p>
                                    </div>
                                </div>

                                {upload.error_details && upload.error_details.length > 0 && (
                                    <div className="mt-4">
                                        <h4 className="text-sm font-medium text-gray-900 mb-2">Error Details:</h4>
                                        <div className="bg-red-50 border border-red-200 rounded-md p-3 max-h-40 overflow-y-auto">
                                            {upload.error_details.map((error, index) => (
                                                <div key={index} className="text-sm text-red-700 mb-1">
                                                    Row {error.row}: {error.error}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </motion.div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
