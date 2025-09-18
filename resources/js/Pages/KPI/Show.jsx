import { Head, Link, router } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { 
    ArrowLeft, 
    Edit, 
    Trash2, 
    Target,
    TrendingUp,
    Calendar,
    Building,
    User,
    FileText,
    Activity,
    AlertTriangle,
    CheckCircle,
    Clock,
    BarChart3,
    Download,
    Plus
} from 'lucide-react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/Components/ui/Card';
import { Button } from '@/Components/ui/Button';
import { Badge } from '@/Components/ui/Badge';
import { Progress } from '@/Components/ui/Progress';

export default function KPIShow({ kpi, milestones, progressHistory }) {
    const handleDelete = () => {
        if (confirm(`Are you sure you want to delete "${kpi.title}"?`)) {
            router.delete(`/kpis/${kpi.id}`);
        }
    };

    const getStatusBadge = () => {
        const progress = kpi.progress_percentage;
        if (progress >= 100) {
            return <Badge className="bg-green-100 text-green-800">Completed</Badge>;
        } else if (progress >= 75) {
            return <Badge className="bg-blue-100 text-blue-800">On Track</Badge>;
        } else if (progress >= 50) {
            return <Badge className="bg-yellow-100 text-yellow-800">In Progress</Badge>;
        } else {
            return <Badge className="bg-red-100 text-red-800">At Risk</Badge>;
        }
    };

    const getStatusIcon = () => {
        const progress = kpi.progress_percentage;
        if (progress >= 100) {
            return <CheckCircle className="w-8 h-8 text-green-500" />;
        } else if (progress >= 75) {
            return <TrendingUp className="w-8 h-8 text-blue-500" />;
        } else if (progress >= 50) {
            return <Target className="w-8 h-8 text-yellow-500" />;
        } else {
            return <AlertTriangle className="w-8 h-8 text-red-500" />;
        }
    };

    return (
        <AuthenticatedLayout>
            <Head title={`Kpis: ${kpi.title}`} />

            <div className="px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="mb-8"
                >
                    <div className="flex items-center space-x-4 mb-6">
                        <Button
                            variant="outline"
                            onClick={() => router.visit('/kpis')}
                            className="flex items-center gap-2"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            Back to KPIs
                        </Button>
                    </div>
                    
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                        <div className="flex items-center space-x-4">
                            <div className="p-3 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl shadow-lg">
                                {getStatusIcon()}
                            </div>
                            <div>
                                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                                    {kpi.title}
                                </h1>
                                <div className="flex items-center space-x-3 mt-2">
                                    {getStatusBadge()}
                                    <Badge variant="outline">
                                        {kpi.pillar?.code} - {kpi.pillar?.name}
                                    </Badge>
                                    <Badge variant="outline">
                                        {kpi.frequency}
                                    </Badge>
                                </div>
                            </div>
                        </div>
                        
                        <div className="flex items-center space-x-3 mt-4 lg:mt-0">
                            <Link href={`/kpis/${kpi.id}/edit`}>
                                <Button className="flex items-center gap-2">
                                    <Edit className="w-4 h-4" />
                                    Edit KPI
                                </Button>
                            </Link>
                            <Button 
                                variant="outline" 
                                onClick={handleDelete}
                                className="text-red-600 hover:text-red-700"
                            >
                                <Trash2 className="w-4 h-4" />
                            </Button>
                        </div>
                    </div>
                </motion.div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* KPI Overview */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.1 }}
                        >
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <FileText className="w-5 h-5" />
                                        KPI Overview
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4">
                                        <p className="text-gray-600 dark:text-gray-400">
                                            {kpi.description}
                                        </p>
                                        
                                        {/* Progress Bar */}
                                        <div>
                                            <div className="flex items-center justify-between mb-2">
                                                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                                    Progress
                                                </span>
                                                <span className="text-2xl font-bold text-gray-900 dark:text-white">
                                                    {kpi.progress_percentage}%
                                                </span>
                                            </div>
                                            <Progress value={kpi.progress_percentage} className="h-4" />
                                        </div>

                                        {/* Key Metrics */}
                                        <div className="grid grid-cols-3 gap-4 pt-4">
                                            <div className="text-center">
                                                <p className="text-sm text-gray-600 dark:text-gray-400">Current Value</p>
                                                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                                                    {kpi.current_value}
                                                </p>
                                                <p className="text-sm text-gray-500">{kpi.unit}</p>
                                            </div>
                                            <div className="text-center">
                                                <p className="text-sm text-gray-600 dark:text-gray-400">Target Value</p>
                                                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                                                    {kpi.target_value}
                                                </p>
                                                <p className="text-sm text-gray-500">{kpi.unit}</p>
                                            </div>
                                            <div className="text-center">
                                                <p className="text-sm text-gray-600 dark:text-gray-400">Baseline</p>
                                                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                                                    {kpi.baseline_value || 'N/A'}
                                                </p>
                                                <p className="text-sm text-gray-500">{kpi.baseline_value ? kpi.unit : ''}</p>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>

                        {/* Progress History */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                        >
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <BarChart3 className="w-5 h-5" />
                                        Progress History
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    {progressHistory && progressHistory.length > 0 ? (
                                        <div className="space-y-4">
                                            {progressHistory.map((entry, index) => (
                                                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                                                    <div>
                                                        <p className="font-medium text-gray-900 dark:text-white">
                                                            {entry.value} {kpi.unit}
                                                        </p>
                                                        <p className="text-sm text-gray-600 dark:text-gray-400">
                                                            {entry.notes || 'Progress update'}
                                                        </p>
                                                    </div>
                                                    <div className="text-right">
                                                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                                                            {new Date(entry.recorded_at).toLocaleDateString()}
                                                        </p>
                                                        <p className="text-xs text-gray-500">
                                                            by {entry.recorded_by?.name}
                                                        </p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="text-center py-8">
                                            <Activity className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                                            <p className="text-gray-600 dark:text-gray-400">
                                                No progress history recorded yet
                                            </p>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        </motion.div>

                        {/* Related Milestones */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.3 }}
                        >
                            <Card>
                                <CardHeader>
                                    <div className="flex items-center justify-between">
                                        <CardTitle className="flex items-center gap-2">
                                            <Target className="w-5 h-5" />
                                            Related Milestones
                                        </CardTitle>
                                        <Link href={`/milestones/create?kpi_id=${kpi.id}`}>
                                            <Button size="sm" variant="outline">
                                                <Plus className="w-4 h-4 mr-2" />
                                                Add Milestone
                                            </Button>
                                        </Link>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    {milestones && milestones.length > 0 ? (
                                        <div className="space-y-3">
                                            {milestones.map((milestone) => (
                                                <div key={milestone.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                                                    <div className="flex items-center space-x-3">
                                                        <div className={`w-3 h-3 rounded-full ${
                                                            milestone.completion_percentage >= 100 
                                                                ? 'bg-green-500' 
                                                                : milestone.completion_percentage >= 50 
                                                                ? 'bg-yellow-500' 
                                                                : 'bg-red-500'
                                                        }`} />
                                                        <div>
                                                            <p className="font-medium text-gray-900 dark:text-white">
                                                                {milestone.title}
                                                            </p>
                                                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                                                Due: {new Date(milestone.due_date).toLocaleDateString()}
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <div className="text-right">
                                                        <p className="text-sm font-bold text-gray-900 dark:text-white">
                                                            {milestone.completion_percentage}%
                                                        </p>
                                                        <Link href={`/milestones/${milestone.id}`}>
                                                            <Button size="sm" variant="ghost">
                                                                View
                                                            </Button>
                                                        </Link>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="text-center py-8">
                                            <Target className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                                            <p className="text-gray-600 dark:text-gray-400 mb-4">
                                                No milestones defined for this KPI
                                            </p>
                                            <Link href={`/milestones/create?kpi_id=${kpi.id}`}>
                                                <Button size="sm">
                                                    <Plus className="w-4 h-4 mr-2" />
                                                    Create First Milestone
                                                </Button>
                                            </Link>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        </motion.div>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* KPI Details */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.1 }}
                        >
                            <Card>
                                <CardHeader>
                                    <CardTitle>KPI Details</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="flex items-center space-x-3">
                                        <Building className="w-5 h-5 text-gray-400" />
                                        <div>
                                            <p className="text-sm text-gray-600 dark:text-gray-400">Department</p>
                                            <p className="font-medium text-gray-900 dark:text-white">
                                                {kpi.department?.name}
                                            </p>
                                        </div>
                                    </div>

                                    {kpi.assigned_user && (
                                        <div className="flex items-center space-x-3">
                                            <User className="w-5 h-5 text-gray-400" />
                                            <div>
                                                <p className="text-sm text-gray-600 dark:text-gray-400">Assigned To</p>
                                                <p className="font-medium text-gray-900 dark:text-white">
                                                    {kpi.assigned_user.name}
                                                </p>
                                            </div>
                                        </div>
                                    )}

                                    <div className="flex items-center space-x-3">
                                        <Calendar className="w-5 h-5 text-gray-400" />
                                        <div>
                                            <p className="text-sm text-gray-600 dark:text-gray-400">Target Date</p>
                                            <p className="font-medium text-gray-900 dark:text-white">
                                                {new Date(kpi.target_date).toLocaleDateString()}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-center space-x-3">
                                        <Clock className="w-5 h-5 text-gray-400" />
                                        <div>
                                            <p className="text-sm text-gray-600 dark:text-gray-400">Frequency</p>
                                            <p className="font-medium text-gray-900 dark:text-white capitalize">
                                                {kpi.frequency}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-center space-x-3">
                                        <TrendingUp className="w-5 h-5 text-gray-400" />
                                        <div>
                                            <p className="text-sm text-gray-600 dark:text-gray-400">Weight</p>
                                            <p className="font-medium text-gray-900 dark:text-white">
                                                {kpi.weight}/10
                                            </p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>

                        {/* Calculation Method */}
                        {kpi.calculation_method && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: 0.2 }}
                            >
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Calculation Method</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <p className="text-sm text-gray-600 dark:text-gray-400">
                                            {kpi.calculation_method}
                                        </p>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        )}

                        {/* Data Source */}
                        {kpi.data_source && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: 0.3 }}
                            >
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Data Source</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <p className="text-sm text-gray-600 dark:text-gray-400">
                                            {kpi.data_source}
                                        </p>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        )}

                        {/* Actions */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.4 }}
                        >
                            <Card>
                                <CardHeader>
                                    <CardTitle>Actions</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                    <Button className="w-full" variant="outline">
                                        <Download className="w-4 h-4 mr-2" />
                                        Export Data
                                    </Button>
                                    <Button className="w-full" variant="outline">
                                        <Activity className="w-4 h-4 mr-2" />
                                        Update Progress
                                    </Button>
                                    <Button className="w-full" variant="outline">
                                        <BarChart3 className="w-4 h-4 mr-2" />
                                        View Analytics
                                    </Button>
                                </CardContent>
                            </Card>
                        </motion.div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
