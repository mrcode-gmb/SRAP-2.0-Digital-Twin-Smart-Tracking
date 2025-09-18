import { Head, Link, router } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { 
    ArrowLeft, 
    Edit, 
    Trash2, 
    Calendar, 
    Target, 
    User, 
    Flag,
    CheckCircle,
    Clock,
    AlertTriangle,
    FileText,
    CheckSquare,
    GitBranch,
    Download,
    BarChart3
} from 'lucide-react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/Components/ui/Card';
import { Button } from '@/Components/ui/Button';
import { Badge } from '@/Components/ui/Badge';
import { Progress } from '@/Components/ui/Progress';

export default function MilestoneShow({ milestone }) {
    const handleDelete = () => {
        if (confirm(`Are you sure you want to delete "${milestone.title}"?`)) {
            router.delete(`/milestones/${milestone.id}`);
        }
    };

    const getStatusBadge = () => {
        const progress = milestone.completion_percentage;
        const isOverdue = new Date(milestone.due_date) < new Date() && progress < 100;
        
        if (isOverdue) {
            return <Badge className="bg-red-100 text-red-800">Overdue</Badge>;
        } else if (progress >= 100) {
            return <Badge className="bg-green-100 text-green-800">Completed</Badge>;
        } else if (progress > 0) {
            return <Badge className="bg-blue-100 text-blue-800">In Progress</Badge>;
        } else {
            return <Badge className="bg-gray-100 text-gray-800">Not Started</Badge>;
        }
    };

    const getStatusIcon = () => {
        const progress = milestone.completion_percentage;
        const isOverdue = new Date(milestone.due_date) < new Date() && progress < 100;
        
        if (isOverdue) {
            return <AlertTriangle className="w-6 h-6 text-red-500" />;
        } else if (progress >= 100) {
            return <CheckCircle className="w-6 h-6 text-green-500" />;
        } else if (progress > 0) {
            return <Clock className="w-6 h-6 text-blue-500" />;
        } else {
            return <Target className="w-6 h-6 text-gray-500" />;
        }
    };

    const getPriorityBadge = () => {
        if (!milestone.priority) {
            return <Badge className="bg-gray-100 text-gray-800">Unknown</Badge>;
        }
        
        const colors = {
            low: 'bg-gray-100 text-gray-800',
            medium: 'bg-yellow-100 text-yellow-800',
            high: 'bg-orange-100 text-orange-800',
            critical: 'bg-red-100 text-red-800'
        };
        
        return <Badge className={colors[milestone.priority] || 'bg-gray-100 text-gray-800'}>
            {milestone.priority.charAt(0).toUpperCase() + milestone.priority.slice(1)}
        </Badge>;
    };

    const getDaysUntilDue = () => {
        const today = new Date();
        const due = new Date(milestone.due_date);
        const diffTime = due - today;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        if (diffDays < 0) {
            return `${Math.abs(diffDays)} days overdue`;
        } else if (diffDays === 0) {
            return 'Due today';
        } else if (diffDays === 1) {
            return 'Due tomorrow';
        } else {
            return `${diffDays} days left`;
        }
    };

    return (
        <AuthenticatedLayout>
            <Head title={milestone.title} />

            <div className="px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="mb-8"
                >
                    <div className="flex items-center space-x-4 mb-4">
                        <Link href="/milestones">
                            <Button variant="outline" size="sm">
                                <ArrowLeft className="w-4 h-4 mr-2" />
                                Back to Milestones
                            </Button>
                        </Link>
                    </div>
                    
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between">
                        <div className="flex items-start space-x-4">
                            {getStatusIcon()}
                            <div>
                                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                                    {milestone.title}
                                </h1>
                                <div className="flex items-center space-x-3 mt-2">
                                    {getStatusBadge()}
                                    {getPriorityBadge()}
                                    {!milestone.is_active && (
                                        <Badge variant="outline">Inactive</Badge>
                                    )}
                                </div>
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
                            <Link href={`/milestones/${milestone.id}/edit`}>
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
                                        {milestone.description}
                                    </p>
                                </CardContent>
                            </Card>
                        </motion.div>

                        {/* Progress */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                        >
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center space-x-2">
                                        <BarChart3 className="w-5 h-5" />
                                        <span>Progress Tracking</span>
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4">
                                        <div>
                                            <div className="flex items-center justify-between mb-2">
                                                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                                    Completion Progress
                                                </span>
                                                <span className="text-2xl font-bold text-gray-900 dark:text-white">
                                                    {milestone.completion_percentage}%
                                                </span>
                                            </div>
                                            <Progress value={milestone.completion_percentage} className="h-3" />
                                        </div>
                                        
                                        <div className="grid grid-cols-2 gap-4 pt-4">
                                            <div className="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                                                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                                                    {getDaysUntilDue()}
                                                </div>
                                                <div className="text-sm text-gray-600 dark:text-gray-400">
                                                    Time Status
                                                </div>
                                            </div>
                                            <div className="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                                                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                                                    {milestone.priority ? 
                                                        milestone.priority.charAt(0).toUpperCase() + milestone.priority.slice(1) : 
                                                        'Unknown'
                                                    }
                                                </div>
                                                <div className="text-sm text-gray-600 dark:text-gray-400">
                                                    Priority Level
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>

                        {/* Deliverables */}
                        {milestone.deliverables && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: 0.3 }}
                            >
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="flex items-center space-x-2">
                                            <CheckSquare className="w-5 h-5" />
                                            <span>Deliverables</span>
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="prose dark:prose-invert max-w-none">
                                            <p className="whitespace-pre-wrap">{milestone.deliverables}</p>
                                        </div>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        )}

                        {/* Success Criteria */}
                        {milestone.success_criteria && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: 0.4 }}
                            >
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="flex items-center space-x-2">
                                            <Target className="w-5 h-5" />
                                            <span>Success Criteria</span>
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="prose dark:prose-invert max-w-none">
                                            <p className="whitespace-pre-wrap">{milestone.success_criteria}</p>
                                        </div>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        )}

                        {/* Dependencies */}
                        {milestone.dependencies && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: 0.5 }}
                            >
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="flex items-center space-x-2">
                                            <GitBranch className="w-5 h-5" />
                                            <span>Dependencies</span>
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="prose dark:prose-invert max-w-none">
                                            <p className="whitespace-pre-wrap">{milestone.dependencies}</p>
                                        </div>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        )}
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
                                        <Calendar className="w-5 h-5 text-gray-400" />
                                        <div>
                                            <div className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                                Due Date
                                            </div>
                                            <div className="text-sm text-gray-600 dark:text-gray-400">
                                                {new Date(milestone.due_date).toLocaleDateString('en-US', {
                                                    weekday: 'long',
                                                    year: 'numeric',
                                                    month: 'long',
                                                    day: 'numeric'
                                                })}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center space-x-3">
                                        <Target className="w-5 h-5 text-gray-400" />
                                        <div>
                                            <div className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                                Associated KPI
                                            </div>
                                            <div className="text-sm text-gray-600 dark:text-gray-400">
                                                {milestone.kpi?.title}
                                            </div>
                                            {milestone.kpi?.pillar && (
                                                <Badge variant="outline" className="text-xs mt-1">
                                                    {milestone.kpi.pillar.name}
                                                </Badge>
                                            )}
                                        </div>
                                    </div>

                                    {milestone.assigned_user && (
                                        <div className="flex items-center space-x-3">
                                            <User className="w-5 h-5 text-gray-400" />
                                            <div>
                                                <div className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                                    Assigned To
                                                </div>
                                                <div className="text-sm text-gray-600 dark:text-gray-400">
                                                    {milestone.assigned_user.name}
                                                </div>
                                                <div className="text-xs text-gray-500">
                                                    {milestone.assigned_user.email}
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    <div className="flex items-center space-x-3">
                                        <Flag className="w-5 h-5 text-gray-400" />
                                        <div>
                                            <div className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                                Priority
                                            </div>
                                            <div className="text-sm text-gray-600 dark:text-gray-400">
                                                {milestone.priority ? 
                                                    milestone.priority.charAt(0).toUpperCase() + milestone.priority.slice(1) + ' Priority' : 
                                                    'Unknown Priority'
                                                }
                                            </div>
                                        </div>
                                    </div>
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
                                    <Link href={`/milestones/${milestone.id}/edit`} className="block">
                                        <Button variant="outline" className="w-full justify-start">
                                            <Edit className="w-4 h-4 mr-2" />
                                            Edit Milestone
                                        </Button>
                                    </Link>
                                    
                                    {milestone.kpi && (
                                        <Link href={`/kpis/${milestone.kpi.id}`} className="block">
                                            <Button variant="outline" className="w-full justify-start">
                                                <Target className="w-4 h-4 mr-2" />
                                                View Associated KPI
                                            </Button>
                                        </Link>
                                    )}
                                    
                                    <Button variant="outline" className="w-full justify-start">
                                        <Download className="w-4 h-4 mr-2" />
                                        Export Details
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
                                            {new Date(milestone.created_at).toLocaleDateString()}
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600 dark:text-gray-400">Last Updated:</span>
                                        <span className="text-gray-900 dark:text-white">
                                            {new Date(milestone.updated_at).toLocaleDateString()}
                                        </span>
                                    </div>
                                    {milestone.creator && (
                                        <div className="flex justify-between">
                                            <span className="text-gray-600 dark:text-gray-400">Created By:</span>
                                            <span className="text-gray-900 dark:text-white">
                                                {milestone.creator.name}
                                            </span>
                                        </div>
                                    )}
                                    <div className="flex justify-between">
                                        <span className="text-gray-600 dark:text-gray-400">Status:</span>
                                        <span className="text-gray-900 dark:text-white">
                                            {milestone.is_active ? 'Active' : 'Inactive'}
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
