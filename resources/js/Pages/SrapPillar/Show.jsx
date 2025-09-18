import { Head, Link, router } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { 
    ArrowLeft, 
    Edit, 
    Trash2, 
    Target, 
    TrendingUp,
    Calendar,
    DollarSign,
    Building,
    Flag,
    CheckCircle,
    AlertTriangle,
    Clock,
    Plus,
    BarChart3,
    Download,
    Users,
    FileText
} from 'lucide-react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/Components/ui/Card';
import { Button } from '@/Components/ui/Button';
import { Badge } from '@/Components/ui/Badge';
import { Progress } from '@/Components/ui/Progress';

export default function SrapPillarShow({ pillar, statistics }) {
    const handleDelete = () => {
        if (confirm(`Are you sure you want to delete "${pillar.name}"?`)) {
            router.delete(`/srap-pillars/${pillar.id}`);
        }
    };

    const getPriorityBadge = () => {
        if (!pillar.priority_level) {
            return <Badge className="bg-gray-100 text-gray-800">Unknown</Badge>;
        }
        
        const colors = {
            low: 'bg-gray-100 text-gray-800',
            medium: 'bg-yellow-100 text-yellow-800',
            high: 'bg-orange-100 text-orange-800',
            critical: 'bg-red-100 text-red-800'
        };
        
        return <Badge className={colors[pillar.priority_level] || 'bg-gray-100 text-gray-800'}>
            {pillar.priority_level.charAt(0).toUpperCase() + pillar.priority_level.slice(1)}
        </Badge>;
    };

    const getProgressColor = (progress) => {
        if (progress >= 90) return 'text-green-600';
        if (progress >= 75) return 'text-blue-600';
        if (progress >= 50) return 'text-yellow-600';
        return 'text-red-600';
    };

    const getProgressIcon = (progress) => {
        if (progress >= 90) return <CheckCircle className="w-6 h-6 text-green-500" />;
        if (progress >= 75) return <TrendingUp className="w-6 h-6 text-blue-500" />;
        if (progress >= 50) return <Clock className="w-6 h-6 text-yellow-500" />;
        return <AlertTriangle className="w-6 h-6 text-red-500" />;
    };

    const getKpiStatusBadge = (kpi) => {
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

    return (
        <AuthenticatedLayout>
            <Head title={pillar.name} />

            <div className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="mb-8"
                >
                    <div className="flex items-center space-x-4 mb-4">
                        <Link href="/srap-pillars">
                            <Button variant="outline" size="sm">
                                <ArrowLeft className="w-4 h-4 mr-2" />
                                Back to Pillars
                            </Button>
                        </Link>
                    </div>
                    
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between">
                        <div className="flex items-start space-x-4">
                            {getProgressIcon(statistics.overall_progress)}
                            <div>
                                <div className="flex items-center space-x-2 mb-2">
                                    <Badge variant="outline" className="text-sm font-mono">
                                        {pillar.code}
                                    </Badge>
                                    {getPriorityBadge()}
                                    {!pillar.is_active && (
                                        <Badge variant="outline">Inactive</Badge>
                                    )}
                                </div>
                                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                                    {pillar.name}
                                </h1>
                            </div>
                        </div>
                        
                        <div className="flex items-center space-x-2 mt-4 sm:mt-0">
                            <Button variant="outline" size="sm">
                                <Download className="w-4 h-4 mr-2" />
                                Export
                            </Button>
                            <Button variant="outline" size="sm">
                                <BarChart3 className="w-4 h-4 mr-2" />
                                Analytics
                            </Button>
                            <Link href={`/srap-pillars/${pillar.id}/edit`}>
                                <Button variant="outline" size="sm">
                                    <Edit className="w-4 h-4 mr-2" />
                                    Edit
                                </Button>
                            </Link>
                            <Button 
                                variant="outline" 
                                size="sm" 
                                onClick={handleDelete}
                                className="text-red-600 hover:text-red-700"
                            >
                                <Trash2 className="w-4 h-4 mr-2" />
                                Delete
                            </Button>
                        </div>
                    </div>
                </motion.div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Overview */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.1 }}
                        >
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center space-x-2">
                                        <FileText className="w-5 h-5" />
                                        <span>Overview</span>
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                                        {pillar.description}
                                    </p>
                                </CardContent>
                            </Card>
                        </motion.div>

                        {/* Progress Statistics */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                        >
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center space-x-2">
                                        <BarChart3 className="w-5 h-5" />
                                        <span>Progress Overview</span>
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-6">
                                        <div>
                                            <div className="flex items-center justify-between mb-2">
                                                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                                    Overall Progress
                                                </span>
                                                <span className={`text-2xl font-bold ${getProgressColor(statistics.overall_progress)}`}>
                                                    {statistics.overall_progress}%
                                                </span>
                                            </div>
                                            <Progress value={statistics.overall_progress} className="h-3" />
                                        </div>
                                        
                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                            <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                                                <div className="text-2xl font-bold text-blue-600">
                                                    {statistics.total_kpis}
                                                </div>
                                                <div className="text-sm text-blue-600/80">
                                                    Total KPIs
                                                </div>
                                            </div>
                                            <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                                                <div className="text-2xl font-bold text-green-600">
                                                    {statistics.completed_kpis}
                                                </div>
                                                <div className="text-sm text-green-600/80">
                                                    Completed
                                                </div>
                                            </div>
                                            <div className="text-center p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                                                <div className="text-2xl font-bold text-yellow-600">
                                                    {statistics.on_track_kpis}
                                                </div>
                                                <div className="text-sm text-yellow-600/80">
                                                    On Track
                                                </div>
                                            </div>
                                            <div className="text-center p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
                                                <div className="text-2xl font-bold text-red-600">
                                                    {statistics.at_risk_kpis}
                                                </div>
                                                <div className="text-sm text-red-600/80">
                                                    At Risk
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>

                        {/* Strategic Objectives */}
                        {pillar.objectives && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: 0.3 }}
                            >
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="flex items-center space-x-2">
                                            <Target className="w-5 h-5" />
                                            <span>Strategic Objectives</span>
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="prose dark:prose-invert max-w-none">
                                            <p className="whitespace-pre-wrap">{pillar.objectives}</p>
                                        </div>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        )}

                        {/* Success Metrics */}
                        {pillar.success_metrics && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: 0.4 }}
                            >
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="flex items-center space-x-2">
                                            <CheckCircle className="w-5 h-5" />
                                            <span>Success Metrics</span>
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="prose dark:prose-invert max-w-none">
                                            <p className="whitespace-pre-wrap">{pillar.success_metrics}</p>
                                        </div>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        )}

                        {/* Associated KPIs */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.5 }}
                        >
                            <Card>
                                <CardHeader>
                                    <div className="flex items-center justify-between">
                                        <CardTitle className="flex items-center space-x-2">
                                            <Target className="w-5 h-5" />
                                            <span>Associated KPIs</span>
                                        </CardTitle>
                                        <Link href={`/kpis/create?pillar_id=${pillar.id}`}>
                                            <Button size="sm">
                                                <Plus className="w-4 h-4 mr-2" />
                                                Add KPI
                                            </Button>
                                        </Link>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    {pillar.kpis && pillar.kpis.length > 0 ? (
                                        <div className="space-y-4">
                                            {pillar.kpis.map((kpi) => (
                                                <div key={kpi.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                                                    <div className="flex items-start justify-between mb-3">
                                                        <div>
                                                            <h4 className="font-semibold text-gray-900 dark:text-white">
                                                                {kpi.title}
                                                            </h4>
                                                            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                                                {kpi.description}
                                                            </p>
                                                        </div>
                                                        {getKpiStatusBadge(kpi)}
                                                    </div>
                                                    
                                                    <div className="space-y-2">
                                                        <div className="flex items-center justify-between text-sm">
                                                            <span className="text-gray-600 dark:text-gray-400">Progress</span>
                                                            <span className="font-bold text-gray-900 dark:text-white">
                                                                {kpi.progress_percentage}%
                                                            </span>
                                                        </div>
                                                        <Progress value={kpi.progress_percentage} className="h-2" />
                                                        
                                                        <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
                                                            <span>Current: {kpi.current_value} {kpi.unit}</span>
                                                            <span>Target: {kpi.target_value} {kpi.unit}</span>
                                                        </div>
                                                        
                                                        {kpi.assigned_user && (
                                                            <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                                                                <Users className="w-4 h-4" />
                                                                <span>Assigned to: {kpi.assigned_user.name}</span>
                                                            </div>
                                                        )}
                                                        
                                                        <div className="flex items-center space-x-2 pt-2">
                                                            <Link href={`/kpis/${kpi.id}`}>
                                                                <Button variant="outline" size="sm">
                                                                    View Details
                                                                </Button>
                                                            </Link>
                                                            <Link href={`/milestones/create?kpi_id=${kpi.id}`}>
                                                                <Button variant="outline" size="sm">
                                                                    Add Milestone
                                                                </Button>
                                                            </Link>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="text-center py-8">
                                            <Target className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                                                No KPIs Yet
                                            </h3>
                                            <p className="text-gray-600 dark:text-gray-400 mb-4">
                                                Start tracking progress by adding KPIs to this pillar.
                                            </p>
                                            <Link href={`/kpis/create?pillar_id=${pillar.id}`}>
                                                <Button>
                                                    <Plus className="w-4 h-4 mr-2" />
                                                    Add First KPI
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
                        {/* Key Details */}
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.6, delay: 0.1 }}
                        >
                            <Card>
                                <CardHeader>
                                    <CardTitle>Key Details</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="flex items-center space-x-3">
                                        <Flag className="w-5 h-5 text-gray-400" />
                                        <div>
                                            <div className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                                Priority Level
                                            </div>
                                            <div className="text-sm text-gray-600 dark:text-gray-400">
                                                {pillar.priority_level ? 
                                                    pillar.priority_level.charAt(0).toUpperCase() + pillar.priority_level.slice(1) + ' Priority' : 
                                                    'Unknown Priority'
                                                }
                                            </div>
                                        </div>
                                    </div>

                                    {pillar.responsible_department && (
                                        <div className="flex items-center space-x-3">
                                            <Building className="w-5 h-5 text-gray-400" />
                                            <div>
                                                <div className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                                    Responsible Department
                                                </div>
                                                <div className="text-sm text-gray-600 dark:text-gray-400">
                                                    {pillar.responsible_department}
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {pillar.budget_allocation && (
                                        <div className="flex items-center space-x-3">
                                            <DollarSign className="w-5 h-5 text-gray-400" />
                                            <div>
                                                <div className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                                    Budget Allocation
                                                </div>
                                                <div className="text-sm text-gray-600 dark:text-gray-400">
                                                    ₦{Number(pillar.budget_allocation).toLocaleString()}
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {pillar.target_completion_date && (
                                        <div className="flex items-center space-x-3">
                                            <Calendar className="w-5 h-5 text-gray-400" />
                                            <div>
                                                <div className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                                    Target Completion
                                                </div>
                                                <div className="text-sm text-gray-600 dark:text-gray-400">
                                                    {new Date(pillar.target_completion_date).toLocaleDateString('en-US', {
                                                        weekday: 'long',
                                                        year: 'numeric',
                                                        month: 'long',
                                                        day: 'numeric'
                                                    })}
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        </motion.div>

                        {/* Quick Actions */}
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                        >
                            <Card>
                                <CardHeader>
                                    <CardTitle>Quick Actions</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                    <Link href={`/srap-pillars/${pillar.id}/edit`} className="block">
                                        <Button variant="outline" className="w-full justify-start">
                                            <Edit className="w-4 h-4 mr-2" />
                                            Edit Pillar
                                        </Button>
                                    </Link>
                                    
                                    <Link href={`/kpis/create?pillar_id=${pillar.id}`} className="block">
                                        <Button variant="outline" className="w-full justify-start">
                                            <Plus className="w-4 h-4 mr-2" />
                                            Add New KPI
                                        </Button>
                                    </Link>
                                    
                                    <Button variant="outline" className="w-full justify-start">
                                        <Download className="w-4 h-4 mr-2" />
                                        Export Report
                                    </Button>
                                    
                                    <Button variant="outline" className="w-full justify-start">
                                        <BarChart3 className="w-4 h-4 mr-2" />
                                        View Analytics
                                    </Button>
                                </CardContent>
                            </Card>
                        </motion.div>

                        {/* Metadata */}
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.6, delay: 0.3 }}
                        >
                            <Card>
                                <CardHeader>
                                    <CardTitle>Metadata</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-2 text-sm">
                                    <div className="flex justify-between">
                                        <span className="text-gray-600 dark:text-gray-400">Created:</span>
                                        <span className="text-gray-900 dark:text-white">
                                            {new Date(pillar.created_at).toLocaleDateString()}
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600 dark:text-gray-400">Last Updated:</span>
                                        <span className="text-gray-900 dark:text-white">
                                            {new Date(pillar.updated_at).toLocaleDateString()}
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600 dark:text-gray-400">Status:</span>
                                        <span className="text-gray-900 dark:text-white">
                                            {pillar.is_active ? 'Active' : 'Inactive'}
                                        </span>
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
