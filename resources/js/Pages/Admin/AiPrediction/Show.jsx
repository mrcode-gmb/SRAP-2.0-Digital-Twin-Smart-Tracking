import { Head, Link } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { 
    ArrowLeft, 
    Brain,
    TrendingUp,
    Target,
    Calendar,
    AlertTriangle,
    CheckCircle,
    Clock,
    FileText,
    User,
    BarChart3,
    Activity,
    Download,
    Eye
} from 'lucide-react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/Components/ui/Card';
import { Badge } from '@/Components/ui/Badge';
import { Progress } from '@/Components/ui/Progress';

export default function Show({ prediction }) {
    const getStatusBadge = (status) => {
        const statusConfig = {
            'completed': { color: 'bg-green-100 text-green-800', icon: CheckCircle },
            'processing': { color: 'bg-blue-100 text-blue-800', icon: Clock },
            'failed': { color: 'bg-red-100 text-red-800', icon: AlertTriangle },
            'pending': { color: 'bg-yellow-100 text-yellow-800', icon: Clock }
        };

        const config = statusConfig[status] || statusConfig['pending'];
        const Icon = config.icon;

        return (
            <Badge className={`${config.color} flex items-center gap-1`}>
                <Icon className="w-3 h-3" />
                {status.charAt(0).toUpperCase() + status.slice(1)}
            </Badge>
        );
    };

    const getRiskBadge = (riskLevel) => {
        const riskConfig = {
            'low': 'bg-green-100 text-green-800',
            'medium': 'bg-yellow-100 text-yellow-800',
            'high': 'bg-red-100 text-red-800',
            'critical': 'bg-red-200 text-red-900'
        };

        return (
            <Badge className={riskConfig[riskLevel] || 'bg-gray-100 text-gray-800'}>
                {riskLevel ? riskLevel.charAt(0).toUpperCase() + riskLevel.slice(1) : 'Unknown'}
            </Badge>
        );
    };

    const getConfidenceColor = (score) => {
        if (score >= 90) return 'text-green-600';
        if (score >= 75) return 'text-blue-600';
        if (score >= 60) return 'text-yellow-600';
        return 'text-red-600';
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const formatNumber = (num) => {
        return new Intl.NumberFormat().format(num);
    };

    return (
        <AuthenticatedLayout>
            <Head title={`AI Prediction - ${prediction.kpi?.name || 'Details'}`} />

            <div className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-8"
                >
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                            <Link
                                href="/ai-predictions"
                                className="flex items-center text-gray-500 hover:text-gray-700 transition-colors"
                            >
                                <ArrowLeft className="w-4 h-4 mr-1" />
                                Back to Predictions
                            </Link>
                            <div className="h-6 w-px bg-gray-300" />
                            <div className="flex items-center space-x-2">
                                <Brain className="w-6 h-6 text-blue-600" />
                                <h1 className="text-2xl font-bold text-gray-900">
                                    AI Prediction Details
                                </h1>
                            </div>
                        </div>
                        <div className="flex items-center space-x-3">
                            {getStatusBadge(prediction.status)}
                        </div>
                    </div>
                </motion.div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Prediction Overview */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                        >
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Target className="w-5 h-5" />
                                        Prediction Overview
                                    </CardTitle>
                                    <CardDescription>
                                        AI-generated prediction for {prediction.kpi?.name}
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="text-sm font-medium text-gray-500">KPI Name</label>
                                            <p className="text-lg font-semibold text-gray-900">
                                                {prediction.kpi?.name || 'N/A'}
                                            </p>
                                        </div>
                                        <div>
                                            <label className="text-sm font-medium text-gray-500">Prediction Type</label>
                                            <p className="text-lg font-semibold text-gray-900 capitalize">
                                                {prediction.prediction_type}
                                            </p>
                                        </div>
                                        <div>
                                            <label className="text-sm font-medium text-gray-500">Prediction Date</label>
                                            <p className="text-lg font-semibold text-gray-900">
                                                {formatDate(prediction.prediction_date)}
                                            </p>
                                        </div>
                                        <div>
                                            <label className="text-sm font-medium text-gray-500">Model Version</label>
                                            <p className="text-lg font-semibold text-gray-900">
                                                {prediction.model_version || 'v1.0'}
                                            </p>
                                        </div>
                                    </div>

                                    {prediction.forecast_period_start && prediction.forecast_period_end && (
                                        <div className="border-t pt-4">
                                            <label className="text-sm font-medium text-gray-500">Forecast Period</label>
                                            <p className="text-lg font-semibold text-gray-900">
                                                {formatDate(prediction.forecast_period_start)} - {formatDate(prediction.forecast_period_end)}
                                            </p>
                                        </div>
                                    )}

                                    {prediction.notes && (
                                        <div className="border-t pt-4">
                                            <label className="text-sm font-medium text-gray-500">Notes</label>
                                            <p className="text-gray-700 mt-1">
                                                {prediction.notes}
                                            </p>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        </motion.div>

                        {/* Prediction Results */}
                        {prediction.prediction_result && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 }}
                            >
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2">
                                            <BarChart3 className="w-5 h-5" />
                                            Prediction Results
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="bg-gray-50 rounded-lg p-4">
                                            <pre className="text-sm text-gray-700 whitespace-pre-wrap">
                                                {JSON.stringify(prediction.prediction_result, null, 2)}
                                            </pre>
                                        </div>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        )}

                        {/* Input Data */}
                        {prediction.input_data && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3 }}
                            >
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2">
                                            <FileText className="w-5 h-5" />
                                            Input Data
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="bg-gray-50 rounded-lg p-4">
                                            <pre className="text-sm text-gray-700 whitespace-pre-wrap">
                                                {JSON.stringify(prediction.input_data, null, 2)}
                                            </pre>
                                        </div>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        )}
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Confidence & Risk Metrics */}
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.1 }}
                        >
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Activity className="w-5 h-5" />
                                        Metrics
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    {/* Confidence Score */}
                                    <div>
                                        <div className="flex justify-between items-center mb-2">
                                            <label className="text-sm font-medium text-gray-500">
                                                Confidence Score
                                            </label>
                                            <span className={`text-lg font-bold ${getConfidenceColor(prediction.confidence_score)}`}>
                                                {prediction.confidence_score}%
                                            </span>
                                        </div>
                                        <Progress 
                                            value={prediction.confidence_score} 
                                            className="h-2"
                                        />
                                        <p className="text-xs text-gray-500 mt-1">
                                            {prediction.confidence_level || 'Medium'} Confidence
                                        </p>
                                    </div>

                                    {/* Risk Score */}
                                    {prediction.risk_score && (
                                        <div>
                                            <div className="flex justify-between items-center mb-2">
                                                <label className="text-sm font-medium text-gray-500">
                                                    Risk Score
                                                </label>
                                                <span className="text-lg font-bold text-red-600">
                                                    {prediction.risk_score}%
                                                </span>
                                            </div>
                                            <Progress 
                                                value={prediction.risk_score} 
                                                className="h-2"
                                            />
                                            <div className="flex justify-between items-center mt-1">
                                                <p className="text-xs text-gray-500">Risk Level:</p>
                                                {getRiskBadge(prediction.risk_level)}
                                            </div>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        </motion.div>

                        {/* Prediction Info */}
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.2 }}
                        >
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <User className="w-5 h-5" />
                                        Prediction Info
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                    <div>
                                        <label className="text-sm font-medium text-gray-500">Created By</label>
                                        <p className="text-sm text-gray-900">
                                            {prediction.user?.name || 'System'}
                                        </p>
                                    </div>
                                    
                                    {prediction.requested_by && (
                                        <div>
                                            <label className="text-sm font-medium text-gray-500">Requested By</label>
                                            <p className="text-sm text-gray-900">
                                                {prediction.requestedBy?.name || 'N/A'}
                                            </p>
                                        </div>
                                    )}

                                    <div>
                                        <label className="text-sm font-medium text-gray-500">Created At</label>
                                        <p className="text-sm text-gray-900">
                                            {formatDate(prediction.created_at)}
                                        </p>
                                    </div>

                                    {prediction.updated_at !== prediction.created_at && (
                                        <div>
                                            <label className="text-sm font-medium text-gray-500">Last Updated</label>
                                            <p className="text-sm text-gray-900">
                                                {formatDate(prediction.updated_at)}
                                            </p>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        </motion.div>

                        {/* Parameters */}
                        {prediction.parameters && Object.keys(prediction.parameters).length > 0 && (
                            <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.3 }}
                            >
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2">
                                            <FileText className="w-5 h-5" />
                                            Parameters
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="space-y-2">
                                            {Object.entries(prediction.parameters).map(([key, value]) => (
                                                <div key={key} className="flex justify-between">
                                                    <span className="text-sm text-gray-500 capitalize">
                                                        {key.replace(/_/g, ' ')}:
                                                    </span>
                                                    <span className="text-sm text-gray-900">
                                                        {typeof value === 'object' ? JSON.stringify(value) : value}
                                                    </span>
                                                </div>
                                            ))}
                                        </div>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        )}
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
