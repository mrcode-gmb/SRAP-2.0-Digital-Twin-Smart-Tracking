import { Head } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { 
    Cpu, 
    Bot,
    Brain,
    Zap,
    Activity,
    Clock,
    Database,
    Download,
    Upload,
    Play,
    Pause,
    Square,
    Settings,
    BarChart3,
    TrendingUp,
    AlertCircle,
    CheckCircle,
    RefreshCw,
    Plus,
    Eye,
    Edit,
    Trash2
} from 'lucide-react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/Components/ui/Card';
import { Button } from '@/Components/ui/Button';
import { Badge } from '@/Components/ui/Badge';

export default function AIModels() {
    // AI Models Data
    const aiModels = [
        {
            id: 1,
            name: 'SRAP-GPT-4',
            type: 'Language Model',
            version: '2.1.0',
            status: 'active',
            accuracy: 94.7,
            lastTrained: '2024-09-10',
            trainingData: '2.4M samples',
            performance: 'excellent',
            usage: 'high',
            description: 'Advanced language model for research analysis and report generation'
        },
        {
            id: 2,
            name: 'DataClassifier-Pro',
            type: 'Classification Model',
            version: '1.8.2',
            status: 'training',
            accuracy: 89.3,
            lastTrained: '2024-09-12',
            trainingData: '1.8M samples',
            performance: 'good',
            usage: 'medium',
            description: 'Automated data classification and categorization system'
        },
        {
            id: 3,
            name: 'SecurityAI-Shield',
            type: 'Anomaly Detection',
            version: '3.0.1',
            status: 'active',
            accuracy: 97.2,
            lastTrained: '2024-09-08',
            trainingData: '3.1M samples',
            performance: 'excellent',
            usage: 'high',
            description: 'Real-time security threat detection and prevention'
        },
        {
            id: 4,
            name: 'PredictiveAnalyzer',
            type: 'Prediction Model',
            version: '2.3.1',
            status: 'inactive',
            accuracy: 86.8,
            lastTrained: '2024-09-05',
            trainingData: '1.2M samples',
            performance: 'good',
            usage: 'low',
            description: 'Predictive analytics for KPI forecasting and trend analysis'
        },
        {
            id: 5,
            name: 'NLP-Processor',
            type: 'Natural Language Processing',
            version: '1.5.0',
            status: 'active',
            accuracy: 91.5,
            lastTrained: '2024-09-11',
            trainingData: '4.2M samples',
            performance: 'very good',
            usage: 'high',
            description: 'Advanced text processing and sentiment analysis'
        },
        {
            id: 6,
            name: 'ImageRecognition-AI',
            type: 'Computer Vision',
            version: '2.0.3',
            status: 'maintenance',
            accuracy: 93.1,
            lastTrained: '2024-09-07',
            trainingData: '5.6M samples',
            performance: 'excellent',
            usage: 'medium',
            description: 'Image and document analysis for research data processing'
        }
    ];

    const getStatusColor = (status) => {
        switch (status) {
            case 'active':
                return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
            case 'training':
                return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
            case 'inactive':
                return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
            case 'maintenance':
                return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
            case 'error':
                return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
            default:
                return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
        }
    };

    const getPerformanceColor = (performance) => {
        switch (performance) {
            case 'excellent':
                return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
            case 'very good':
                return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
            case 'good':
                return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
            case 'poor':
                return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
            default:
                return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
        }
    };

    const getTypeIcon = (type) => {
        switch (type) {
            case 'Language Model':
                return Bot;
            case 'Classification Model':
                return Database;
            case 'Anomaly Detection':
                return AlertCircle;
            case 'Prediction Model':
                return TrendingUp;
            case 'Natural Language Processing':
                return Brain;
            case 'Computer Vision':
                return Eye;
            default:
                return Cpu;
        }
    };

    const summaryStats = [
        {
            title: 'Total Models',
            value: '12',
            icon: Cpu,
            color: 'text-blue-600'
        },
        {
            title: 'Active Models',
            value: '8',
            icon: CheckCircle,
            color: 'text-green-600'
        },
        {
            title: 'In Training',
            value: '2',
            icon: RefreshCw,
            color: 'text-blue-600'
        },
        {
            title: 'Avg Accuracy',
            value: '92.1%',
            icon: BarChart3,
            color: 'text-purple-600'
        }
    ];

    return (
        <AuthenticatedLayout>
            <Head title="AI Model Training & Management - SRAP 2.0" />

            <div className="px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="mb-8"
                >
                    <div className="bg-gradient-to-r from-indigo-600 to-indigo-800 rounded-2xl p-8 text-white">
                        <div className="flex items-center justify-between">
                            <div>
                                <h1 className="text-3xl font-bold mb-2">AI Model Training & Management</h1>
                                <p className="text-indigo-100">
                                    Manage, train, and deploy intelligent AI models for advanced analytics
                                </p>
                            </div>
                            <div className="hidden md:block">
                                <Brain className="w-16 h-16 text-indigo-200" />
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Summary Stats */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.1 }}
                    className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8"
                >
                    {summaryStats.map((stat, index) => {
                        const IconComponent = stat.icon;
                        return (
                            <Card key={stat.title} className="border-0 shadow-lg">
                                <CardContent className="p-6">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                                                {stat.title}
                                            </p>
                                            <p className="text-3xl font-bold text-gray-900 dark:text-white">
                                                {stat.value}
                                            </p>
                                        </div>
                                        <div className="p-3 bg-gray-100 dark:bg-gray-800 rounded-xl">
                                            <IconComponent className={`w-6 h-6 ${stat.color}`} />
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        );
                    })}
                </motion.div>

                {/* Action Buttons */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="flex flex-wrap gap-4 mb-8"
                >
                    <Button className="bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800">
                        <Plus className="w-4 h-4 mr-2" />
                        Create New Model
                    </Button>
                    <Button variant="outline">
                        <Upload className="w-4 h-4 mr-2" />
                        Import Model
                    </Button>
                    <Button variant="outline">
                        <RefreshCw className="w-4 h-4 mr-2" />
                        Refresh Status
                    </Button>
                    <Button variant="outline">
                        <BarChart3 className="w-4 h-4 mr-2" />
                        Performance Report
                    </Button>
                </motion.div>

                {/* AI Models Grid */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.3 }}
                    className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8"
                >
                    {aiModels.map((model, index) => {
                        const TypeIcon = getTypeIcon(model.type);
                        return (
                            <motion.div
                                key={model.id}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
                            >
                                <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                                    <CardContent className="p-6">
                                        <div className="flex items-start justify-between mb-4">
                                            <div className="flex items-center space-x-3">
                                                <div className="p-3 bg-indigo-100 dark:bg-indigo-900 rounded-xl">
                                                    <TypeIcon className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
                                                </div>
                                                <div>
                                                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                                                        {model.name}
                                                    </h3>
                                                    <p className="text-sm text-gray-600 dark:text-gray-400">
                                                        {model.type} • v{model.version}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <Badge className={getStatusColor(model.status)}>
                                                    {model.status}
                                                </Badge>
                                            </div>
                                        </div>

                                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                                            {model.description}
                                        </p>

                                        <div className="grid grid-cols-2 gap-4 mb-4">
                                            <div>
                                                <p className="text-xs text-gray-500 dark:text-gray-400">Accuracy</p>
                                                <p className="text-lg font-bold text-gray-900 dark:text-white">
                                                    {model.accuracy}%
                                                </p>
                                            </div>
                                            <div>
                                                <p className="text-xs text-gray-500 dark:text-gray-400">Training Data</p>
                                                <p className="text-lg font-bold text-gray-900 dark:text-white">
                                                    {model.trainingData}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex items-center justify-between mb-4">
                                            <div className="flex items-center space-x-4">
                                                <Badge variant="outline" className={getPerformanceColor(model.performance)}>
                                                    {model.performance}
                                                </Badge>
                                                <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                                                    <Clock className="w-3 h-3 mr-1" />
                                                    {new Date(model.lastTrained).toLocaleDateString()}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Progress Bar for Accuracy */}
                                        <div className="space-y-2 mb-4">
                                            <div className="flex justify-between text-sm">
                                                <span className="text-gray-600 dark:text-gray-400">Model Accuracy</span>
                                                <span className="font-medium text-gray-900 dark:text-white">
                                                    {model.accuracy}%
                                                </span>
                                            </div>
                                            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                                                <div
                                                    className={`h-2 rounded-full transition-all duration-500 ${
                                                        model.accuracy >= 95 ? 'bg-green-500' :
                                                        model.accuracy >= 90 ? 'bg-blue-500' :
                                                        model.accuracy >= 80 ? 'bg-yellow-500' : 'bg-red-500'
                                                    }`}
                                                    style={{ width: `${model.accuracy}%` }}
                                                />
                                            </div>
                                        </div>

                                        {/* Action Buttons */}
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center space-x-2">
                                                {model.status === 'active' && (
                                                    <Button variant="outline" size="sm">
                                                        <Pause className="w-4 h-4 mr-1" />
                                                        Pause
                                                    </Button>
                                                )}
                                                {model.status === 'inactive' && (
                                                    <Button variant="outline" size="sm">
                                                        <Play className="w-4 h-4 mr-1" />
                                                        Activate
                                                    </Button>
                                                )}
                                                {model.status === 'training' && (
                                                    <Button variant="outline" size="sm">
                                                        <Square className="w-4 h-4 mr-1" />
                                                        Stop
                                                    </Button>
                                                )}
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <Button variant="ghost" size="sm">
                                                    <Eye className="w-4 h-4" />
                                                </Button>
                                                <Button variant="ghost" size="sm">
                                                    <Settings className="w-4 h-4" />
                                                </Button>
                                                <Button variant="ghost" size="sm">
                                                    <Download className="w-4 h-4" />
                                                </Button>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        );
                    })}
                </motion.div>

                {/* Training Queue & System Resources */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                    className="grid grid-cols-1 lg:grid-cols-2 gap-6"
                >
                    {/* Training Queue */}
                    <Card className="border-0 shadow-lg">
                        <CardHeader className="pb-3">
                            <CardTitle className="flex items-center text-lg">
                                <RefreshCw className="w-5 h-5 mr-2 text-blue-500" />
                                Training Queue
                            </CardTitle>
                            <CardDescription>
                                Models currently in training or queued for training
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <div className="flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                                    <div>
                                        <p className="font-medium text-blue-900 dark:text-blue-100">DataClassifier-Pro</p>
                                        <p className="text-sm text-blue-600 dark:text-blue-400">Training in progress • 67% complete</p>
                                    </div>
                                    <div className="w-16 h-2 bg-blue-200 dark:bg-blue-800 rounded-full">
                                        <div className="w-2/3 h-2 bg-blue-500 rounded-full"></div>
                                    </div>
                                </div>
                                <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                                    <div>
                                        <p className="font-medium text-gray-900 dark:text-gray-100">NLP-Enhanced</p>
                                        <p className="text-sm text-gray-600 dark:text-gray-400">Queued • ETA: 2 hours</p>
                                    </div>
                                    <Badge variant="outline">Queued</Badge>
                                </div>
                                <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                                    <div>
                                        <p className="font-medium text-gray-900 dark:text-gray-100">Vision-AI-v3</p>
                                        <p className="text-sm text-gray-600 dark:text-gray-400">Queued • ETA: 4 hours</p>
                                    </div>
                                    <Badge variant="outline">Queued</Badge>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* System Resources */}
                    <Card className="border-0 shadow-lg">
                        <CardHeader className="pb-3">
                            <CardTitle className="flex items-center text-lg">
                                <Activity className="w-5 h-5 mr-2 text-green-500" />
                                System Resources
                            </CardTitle>
                            <CardDescription>
                                Current system resource utilization
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <div>
                                    <div className="flex justify-between text-sm mb-2">
                                        <span className="text-gray-600 dark:text-gray-400">GPU Usage</span>
                                        <span className="font-medium text-gray-900 dark:text-white">78%</span>
                                    </div>
                                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                                        <div className="w-3/4 h-2 bg-green-500 rounded-full"></div>
                                    </div>
                                </div>
                                <div>
                                    <div className="flex justify-between text-sm mb-2">
                                        <span className="text-gray-600 dark:text-gray-400">Memory Usage</span>
                                        <span className="font-medium text-gray-900 dark:text-white">64%</span>
                                    </div>
                                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                                        <div className="w-2/3 h-2 bg-blue-500 rounded-full"></div>
                                    </div>
                                </div>
                                <div>
                                    <div className="flex justify-between text-sm mb-2">
                                        <span className="text-gray-600 dark:text-gray-400">Storage Usage</span>
                                        <span className="font-medium text-gray-900 dark:text-white">45%</span>
                                    </div>
                                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                                        <div className="w-2/5 h-2 bg-purple-500 rounded-full"></div>
                                    </div>
                                </div>
                                <div className="pt-2 border-t border-gray-200 dark:border-gray-700">
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-gray-600 dark:text-gray-400">Training Capacity</span>
                                        <span className="font-medium text-green-600">Available</span>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>
            </div>
        </AuthenticatedLayout>
    );
}
