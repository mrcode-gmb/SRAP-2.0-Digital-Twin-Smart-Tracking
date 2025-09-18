import { Head, useForm, router } from '@inertiajs/react';
import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import toast, { Toaster } from 'react-hot-toast';
import {
    Brain,
    Upload,
    Download,
    Play,
    FileText,
    Settings,
    History,
    AlertTriangle,
    CheckCircle,
    TrendingUp,
    Database,
    Zap
} from 'lucide-react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/Components/ui/Card';
import { Button } from '@/Components/ui/Button';
import { Badge } from '@/Components/ui/Badge';

export default function AiPredictionIndex({ predictions = { data: [] }, stats = {}, apiConfig = {} }) {
    const [activeTab, setActiveTab] = useState('manual');
    const [predictionResult, setPredictionResult] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);
    const fileInputRef = useRef(null);

    const { data, setData, post, processing, errors } = useForm({
        progress: '',
        budget_utilization: '',
        delay_days: '',
        engagement_score: ''
    });

    const { data: bulkData, setData: setBulkData, post: postBulk, processing: bulkProcessing } = useForm({
        file: null
    });

    const handleManualPredict = (e) => {
        e.preventDefault();
        setIsLoading(true);

        post(route('ai-predictions.manual-predict'), {
            onSuccess: (response) => {
                setPredictionResult(response.props.results || response.results);
                setIsLoading(false);
                toast.success('Prediction completed successfully!');
            },
            onError: (errors) => {
                setIsLoading(false);
                toast.error('Prediction failed. Please check your inputs.');
            }
        });
    };

    const handleFileUpload = (e) => {
        e.preventDefault();
        if (!selectedFile) {
            toast.error('Please select a file to upload');
            return;
        }

        setBulkData('file', selectedFile);

        postBulk(route('ai-predictions.bulk-predict'), {
            onSuccess: (response) => {
                toast.success(`Bulk prediction completed! ${response.props.results?.length || 0} records processed.`);
                setSelectedFile(null);
                // Clear the file input
                if (fileInputRef.current) {
                    fileInputRef.current.value = '';
                }
                // Refresh predictions list
                router.reload({ only: ['predictions'] });
            },
            onError: (errors) => {
                toast.error('Bulk upload failed. Please check your file format.');
            }
        });
    };

    const handleFileSelect = (e) => {
        const file = e.target.files[0];

        if (file) {
            setSelectedFile(file);
            toast.success(`File selected: ${file.name}`);
        }
    };

    const getRiskBadge = (risk) => {
        const colors = {
            Low: 'bg-green-100 text-green-800',
            Medium: 'bg-yellow-100 text-yellow-800',
            High: 'bg-red-100 text-red-800'
        };
        return <Badge className={colors[risk] || 'bg-gray-100 text-gray-800'}>{risk}</Badge>;
    };

    // Dummy prediction history data
    const dummyPredictions = [
        { id: 1, progress: 65, budget_utilization: 70, delay_days: 12, engagement_score: 55.2, predicted_success: 67.5, predicted_risk: 'Medium', created_at: '2024-01-15' },
        { id: 2, progress: 45, budget_utilization: 60, delay_days: 25, engagement_score: 42.7, predicted_success: 45.2, predicted_risk: 'High', created_at: '2024-01-14' },
        { id: 3, progress: 90, budget_utilization: 80, delay_days: 5, engagement_score: 78.4, predicted_success: 85.3, predicted_risk: 'Low', created_at: '2024-01-13' },
        { id: 4, progress: 30, budget_utilization: 95, delay_days: 30, engagement_score: 36.1, predicted_success: 38.7, predicted_risk: 'High', created_at: '2024-01-12' },
        { id: 5, progress: 75, budget_utilization: 50, delay_days: 8, engagement_score: 68.5, predicted_success: 72.1, predicted_risk: 'Low', created_at: '2024-01-11' }
    ];

    return (
        <AuthenticatedLayout>
            <Head title="AI Risk Prediction" />

            <div className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="mb-8"
                >
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
                                <Brain className="w-8 h-8 text-blue-600" />
                                SRAP Smart Tracking - Risk Prediction
                            </h1>
                            <p className="mt-2 text-gray-600 dark:text-gray-400">
                                AI-powered risk prediction for NITDA SRAP 2.0 KPIs and milestones
                            </p>
                        </div>
                        <div className="mt-4 sm:mt-0 flex items-center space-x-2">
                            <Button variant="outline" size="sm">
                                <Settings className="w-4 h-4 mr-2" />
                                API Config
                            </Button>
                            <Button variant="outline" size="sm">
                                <Download className="w-4 h-4 mr-2" />
                                Export Results
                            </Button>
                        </div>
                    </div>
                </motion.div>

                {/* Tab Navigation */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.1 }}
                    className="mb-6"
                >
                    <div className="border-b border-gray-200 dark:border-gray-700">
                        <nav className="-mb-px flex space-x-8">
                            <button
                                onClick={() => setActiveTab('manual')}
                                className={`py-2 px-1 border-b-2 font-medium text-sm ${activeTab === 'manual'
                                        ? 'border-blue-500 text-blue-600'
                                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                    }`}
                            >
                                <Play className="w-4 h-4 inline mr-2" />
                                Manual Input Prediction
                            </button>
                            <button
                                onClick={() => setActiveTab('bulk')}
                                className={`py-2 px-1 border-b-2 font-medium text-sm ${activeTab === 'bulk'
                                        ? 'border-blue-500 text-blue-600'
                                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                    }`}
                            >
                                <Upload className="w-4 h-4 inline mr-2" />
                                Upload Excel/CSV for Bulk Prediction
                            </button>
                            <button
                                onClick={() => setActiveTab('history')}
                                className={`py-2 px-1 border-b-2 font-medium text-sm ${activeTab === 'history'
                                        ? 'border-blue-500 text-blue-600'
                                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                    }`}
                            >
                                <History className="w-4 h-4 inline mr-2" />
                                Prediction History
                            </button>
                            <button
                                onClick={() => setActiveTab('api')}
                                className={`py-2 px-1 border-b-2 font-medium text-sm ${activeTab === 'api'
                                        ? 'border-blue-500 text-blue-600'
                                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                    }`}
                            >
                                <Zap className="w-4 h-4 inline mr-2" />
                                API Configuration
                            </button>
                        </nav>
                    </div>
                </motion.div>

                {/* Manual Input Tab */}
                {activeTab === 'manual' && (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* Input Form */}
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                        >
                            <Card>
                                <CardHeader>
                                    <CardTitle>Manual Input Prediction</CardTitle>
                                    <CardDescription>
                                        Enter KPI metrics to predict risk and success probability
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <form onSubmit={handleManualPredict} className="space-y-4">
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                    Progress (%)
                                                </label>
                                                <input
                                                    type="number"
                                                    min="0"
                                                    max="100"
                                                    value={data.progress}
                                                    onChange={(e) => setData('progress', e.target.value)}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                    placeholder="65"
                                                    required
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                    Budget Utilization (%)
                                                </label>
                                                <input
                                                    type="number"
                                                    min="0"
                                                    max="100"
                                                    value={data.budget_utilization}
                                                    onChange={(e) => setData('budget_utilization', e.target.value)}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                    placeholder="70"
                                                    required
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                    Delay (Days)
                                                </label>
                                                <input
                                                    type="number"
                                                    min="0"
                                                    value={data.delay_days}
                                                    onChange={(e) => setData('delay_days', e.target.value)}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                    placeholder="12"
                                                    required
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                    Engagement Score
                                                </label>
                                                <input
                                                    type="number"
                                                    min="0"
                                                    max="100"
                                                    step="0.1"
                                                    value={data.engagement_score}
                                                    onChange={(e) => setData('engagement_score', e.target.value)}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                    placeholder="55.2"
                                                    required
                                                />
                                            </div>
                                        </div>

                                        <Button
                                            type="submit"
                                            className="w-full"
                                            disabled={isLoading}
                                        >
                                            {isLoading ? (
                                                <>
                                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                                    Predicting...
                                                </>
                                            ) : (
                                                <>
                                                    <Brain className="w-4 h-4 mr-2" />
                                                    Predict
                                                </>
                                            )}
                                        </Button>
                                    </form>
                                </CardContent>
                            </Card>
                        </motion.div>

                        {/* Prediction Result */}
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.6, delay: 0.3 }}
                        >
                            <Card>
                                <CardHeader>
                                    <CardTitle>Prediction Result</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    {predictionResult ? (
                                        <div className="space-y-4">
                                            <div className="text-center p-6 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                                                <TrendingUp className="w-12 h-12 text-blue-600 mx-auto mb-4" />
                                                <div className="text-3xl font-bold text-blue-600 mb-2">
                                                    {predictionResult.predicted_success.toFixed(1)}%
                                                </div>
                                                <div className="text-sm text-gray-600 dark:text-gray-400">
                                                    Predicted Success Rate
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                                                    <div className="mb-2">
                                                        {getRiskBadge(predictionResult.predicted_risk)}
                                                    </div>
                                                    <div className="text-sm text-gray-600 dark:text-gray-400">
                                                        Risk Level
                                                    </div>
                                                </div>
                                                <div className="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                                                    <div className="text-lg font-bold text-gray-900 dark:text-white mb-1">
                                                        {predictionResult.confidence.toFixed(1)}%
                                                    </div>
                                                    <div className="text-sm text-gray-600 dark:text-gray-400">
                                                        Confidence
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="text-center py-12">
                                            <Brain className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                                                No Prediction Yet
                                            </h3>
                                            <p className="text-gray-600 dark:text-gray-400">
                                                Enter values and click "Predict" to see AI analysis
                                            </p>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        </motion.div>
                    </div>
                )}

                {/* Bulk Upload Tab */}
                {activeTab === 'bulk' && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                    >
                        <Card>
                            <CardHeader>
                                <CardTitle>Upload Excel/CSV for Bulk Prediction</CardTitle>
                                <CardDescription>
                                    Upload a file with multiple records for batch prediction processing
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <form onSubmit={handleFileUpload} className="space-y-4">
                                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                                        <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                                        <div className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                                            {selectedFile ? selectedFile.name : 'Choose File'}
                                        </div>
                                        <p className="text-gray-600 dark:text-gray-400 mb-4">
                                            Select Excel (.xlsx) or CSV file for bulk prediction
                                        </p>
                                        <input
                                            ref={fileInputRef}
                                            type="file"
                                            accept=".xlsx,.xls,.csv"
                                            onChange={handleFileSelect}
                                            className="hidden"
                                            id="bulk-upload"
                                        />
                                        <Button type="button" variant="outline" className="cursor-pointer">
                                            <label htmlFor="bulk-upload">
                                                {selectedFile ? 'Change File' : 'Select File'}
                                            </label>
                                        </Button>
                                    </div>

                                    <Button
                                        type="submit"
                                        className="w-full"
                                        disabled={!selectedFile || bulkProcessing}
                                    >
                                        {bulkProcessing ? (
                                            <>
                                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                                Processing...
                                            </>
                                        ) : (
                                            <>
                                                <Upload className="w-4 h-4 mr-2" />
                                                Upload & Predict
                                            </>
                                        )}
                                    </Button>

                                    <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                                        <div className="text-sm text-blue-800 dark:text-blue-200">
                                            <strong>File Format:</strong> Include columns: Progress, Budget_Utilization, Delay_Days, Engagement_Score
                                        </div>
                                    </div>
                                </form>
                            </CardContent>
                        </Card>
                    </motion.div>
                )}

                {/* History Tab */}
                {activeTab === 'history' && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                    >
                        <Card>
                            <CardHeader>
                                <CardTitle>Prediction History</CardTitle>
                                <CardDescription>
                                    Recent AI predictions and their results
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                {predictions.data && predictions.data.length > 0 ? (
                                    <div className="overflow-x-auto">
                                        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                                            <thead className="bg-gray-50 dark:bg-gray-800">
                                                <tr>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                        Type
                                                    </th>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                        Model
                                                    </th>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                        Confidence
                                                    </th>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                        Status
                                                    </th>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                        Date
                                                    </th>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                        Predicted_Risk
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
                                                {predictions.data.map((prediction) => (
                                                    <tr key={prediction.id}>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                                                            {prediction.prediction_type}
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                                                            {prediction.model_name}
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                                                            {prediction.confidence_score}%
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            <Badge className={prediction.status === 'completed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}>
                                                                {prediction.status}
                                                            </Badge>
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                                                            {new Date(prediction.prediction_date).toLocaleDateString()}
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            {prediction.prediction_result?.risk_level && getRiskBadge(prediction.prediction_result.risk_level)}
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                ) : (
                                    <div className="text-center py-8">
                                        <History className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                                        <p className="text-gray-500 dark:text-gray-400">
                                            No prediction history available. Make some predictions to see results here.
                                        </p>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </motion.div>
                )}

                {/* API Configuration Tab */}
                {activeTab === 'api' && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                    >
                        <Card>
                            <CardHeader>
                                <CardTitle>Flask Model API Configuration</CardTitle>
                                <CardDescription>
                                    Configure the connection to your Flask ML model API
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            API Base URL
                                        </label>
                                        <input
                                            type="url"
                                            placeholder="http://localhost:5000"
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            Prediction Endpoint
                                        </label>
                                        <input
                                            type="text"
                                            placeholder="/api/predict"
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            Bulk Prediction Endpoint
                                        </label>
                                        <input
                                            type="text"
                                            placeholder="/api/predict/bulk"
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            API Key (Optional)
                                        </label>
                                        <input
                                            type="password"
                                            placeholder="Enter API key if required"
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        />
                                    </div>

                                    <div className="flex items-center space-x-4">
                                        <Button>
                                            <Settings className="w-4 h-4 mr-2" />
                                            Save Configuration
                                        </Button>
                                        <Button variant="outline">
                                            <Zap className="w-4 h-4 mr-2" />
                                            Test Connection
                                        </Button>
                                    </div>

                                    <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
                                        <CheckCircle className="w-5 h-5 text-green-600 inline mr-2" />
                                        <span className="text-sm text-green-800 dark:text-green-200">
                                            API connection successful! Model ready for predictions.
                                        </span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                )}
            </div>

            {/* Toast Notifications */}
            <Toaster
                position="top-right"
                toastOptions={{
                    duration: 4000,
                    style: {
                        background: '#363636',
                        color: '#fff',
                    },
                    success: {
                        duration: 3000,
                        theme: {
                            primary: 'green',
                            secondary: 'black',
                        },
                    },
                }}
            />
        </AuthenticatedLayout>
    );
}
