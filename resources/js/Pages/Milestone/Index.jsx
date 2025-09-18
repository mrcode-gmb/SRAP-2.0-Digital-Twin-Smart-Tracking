import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
    Plus, 
    Search, 
    Filter, 
    MoreHorizontal, 
    Edit, 
    Trash2, 
    Eye,
    Calendar,
    Clock,
    AlertTriangle,
    CheckCircle,
    Target,
    User,
    Flag
} from 'lucide-react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/Components/ui/Card';
import { Button } from '@/Components/ui/Button';
import { Badge } from '@/Components/ui/Badge';
import { Progress } from '@/Components/ui/Progress';

export default function MilestoneIndex({ milestones, kpis, filters }) {
    const [searchTerm, setSearchTerm] = useState(filters?.search || '');
    const [selectedKpi, setSelectedKpi] = useState(filters?.kpi || '');
    const [selectedStatus, setSelectedStatus] = useState(filters?.status || '');

    const handleSearch = () => {
        router.get('/milestones', {
            search: searchTerm,
            Kpis: selectedKpi,
            status: selectedStatus
        }, {
            preserveState: true,
            preserveScroll: true
        });
    };

    const handleDelete = (milestone) => {
        if (confirm(`Are you sure you want to delete "${milestone.title}"?`)) {
            router.delete(`/milestones/${milestone.id}`);
        }
    };

    const getStatusBadge = (milestone) => {
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

    const getStatusIcon = (milestone) => {
        const progress = milestone.completion_percentage;
        const isOverdue = new Date(milestone.due_date) < new Date() && progress < 100;
        
        if (isOverdue) {
            return <AlertTriangle className="w-5 h-5 text-red-500" />;
        } else if (progress >= 100) {
            return <CheckCircle className="w-5 h-5 text-green-500" />;
        } else if (progress > 0) {
            return <Clock className="w-5 h-5 text-blue-500" />;
        } else {
            return <Target className="w-5 h-5 text-gray-500" />;
        }
    };

    const getPriorityBadge = (priority) => {
        if (!priority) {
            return <Badge className="bg-gray-100 text-gray-800">Unknown</Badge>;
        }
        
        const colors = {
            low: 'bg-gray-100 text-gray-800',
            medium: 'bg-yellow-100 text-yellow-800',
            high: 'bg-orange-100 text-orange-800',
            critical: 'bg-red-100 text-red-800'
        };
        
        return <Badge className={colors[priority] || 'bg-gray-100 text-gray-800'}>
            {priority.charAt(0).toUpperCase() + priority.slice(1)}
        </Badge>;
    };

    const getDaysUntilDue = (dueDate) => {
        const today = new Date();
        const due = new Date(dueDate);
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
            <Head title="Milestone Management" />

            <div className="px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="mb-8"
                >
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                                Milestone Management
                            </h1>
                            <p className="mt-2 text-gray-600 dark:text-gray-400">
                                Track and manage milestones for SRAP 2.0 KPIs
                            </p>
                        </div>
                        <div className="mt-4 sm:mt-0">
                            <Link href="/milestones/create">
                                <Button className="flex items-center gap-2">
                                    <Plus className="w-4 h-4" />
                                    Add New Milestone
                                </Button>
                            </Link>
                        </div>
                    </div>
                </motion.div>

                {/* Filters */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.1 }}
                    className="mb-6"
                >
                    <Card>
                        <CardContent className="p-6">
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Search Milestones
                                    </label>
                                    <div className="relative">
                                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                                        <input
                                            type="text"
                                            placeholder="Search by title or description..."
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        KPI
                                    </label>
                                    <select
                                        value={selectedKpi}
                                        onChange={(e) => setSelectedKpi(e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    >
                                        <option value="">All KPIs</option>
                                        {kpis?.map(kpi => (
                                            <option key={kpi.id} value={kpi.id}>
                                                {kpi.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Status
                                    </label>
                                    <select
                                        value={selectedStatus}
                                        onChange={(e) => setSelectedStatus(e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    >
                                        <option value="">All Status</option>
                                        <option value="completed">Completed</option>
                                        <option value="in_progress">In Progress</option>
                                        <option value="not_started">Not Started</option>
                                        <option value="overdue">Overdue</option>
                                    </select>
                                </div>
                                <div className="flex items-end">
                                    <Button onClick={handleSearch} className="w-full">
                                        <Filter className="w-4 h-4 mr-2" />
                                        Apply Filters
                                    </Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>

                {/* Milestone Grid */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6"
                >
                    {milestones?.data?.map((milestone, index) => (
                        <motion.div
                            key={milestone.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.2 + index * 0.1 }}
                        >
                            <Card className="hover:shadow-lg transition-all duration-300 border-0 shadow-md">
                                <CardHeader className="pb-3">
                                    <div className="flex items-start justify-between">
                                        <div className="flex items-center space-x-3">
                                            {getStatusIcon(milestone)}
                                            <div>
                                                <CardTitle className="text-lg font-semibold line-clamp-2">
                                                    {milestone.title}
                                                </CardTitle>
                                                <div className="flex items-center space-x-2 mt-1">
                                                    {getStatusBadge(milestone)}
                                                    {getPriorityBadge(milestone.priority)}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="relative">
                                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                                <MoreHorizontal className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4">
                                        <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                                            {milestone.description}
                                        </p>
                                        
                                        {/* Progress */}
                                        <div>
                                            <div className="flex items-center justify-between text-sm mb-2">
                                                <span className="text-gray-600 dark:text-gray-400">Progress</span>
                                                <span className="font-bold text-gray-900 dark:text-white">
                                                    {milestone.completion_percentage}%
                                                </span>
                                            </div>
                                            <Progress value={milestone.completion_percentage} className="h-2" />
                                        </div>

                                        {/* KPI Info */}
                                        <div className="flex items-center space-x-2 text-sm">
                                            <Target className="w-4 h-4 text-gray-400" />
                                            <span className="text-gray-600 dark:text-gray-400">
                                                {milestone.kpi?.title}
                                            </span>
                                            <Badge variant="outline" className="text-xs">
                                                {milestone.kpi?.pillar?.code}
                                            </Badge>
                                        </div>

                                        {/* Due Date */}
                                        <div className="flex items-center justify-between text-sm">
                                            <div className="flex items-center space-x-2">
                                                <Calendar className="w-4 h-4 text-gray-400" />
                                                <span className="text-gray-600 dark:text-gray-400">
                                                    Due: {new Date(milestone.due_date).toLocaleDateString()}
                                                </span>
                                            </div>
                                            <span className={`text-xs font-medium ${
                                                new Date(milestone.due_date) < new Date() && milestone.completion_percentage < 100
                                                    ? 'text-red-600'
                                                    : 'text-gray-500'
                                            }`}>
                                                {getDaysUntilDue(milestone.due_date)}
                                            </span>
                                        </div>

                                        {/* Assigned User */}
                                        {milestone.assigned_user && (
                                            <div className="flex items-center space-x-2 text-sm">
                                                <User className="w-4 h-4 text-gray-400" />
                                                <span className="text-gray-600 dark:text-gray-400">
                                                    {milestone.assigned_user.name}
                                                </span>
                                            </div>
                                        )}

                                        {/* Actions */}
                                        <div className="flex items-center space-x-2 pt-2">
                                            <Link href={`/milestones/${milestone.id}`}>
                                                <Button variant="outline" size="sm" className="flex-1">
                                                    <Eye className="w-4 h-4 mr-2" />
                                                    View
                                                </Button>
                                            </Link>
                                            <Link href={`/milestones/${milestone.id}/edit`}>
                                                <Button variant="outline" size="sm" className="flex-1">
                                                    <Edit className="w-4 h-4 mr-2" />
                                                    Edit
                                                </Button>
                                            </Link>
                                            <Button 
                                                variant="outline" 
                                                size="sm" 
                                                onClick={() => handleDelete(milestone)}
                                                className="text-red-600 hover:text-red-700"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>
                    ))}
                </motion.div>

                {/* Empty State */}
                {(!milestones?.data || milestones.data.length === 0) && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="text-center py-12"
                    >
                        <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                            No Milestones Found
                        </h3>
                        <p className="text-gray-600 dark:text-gray-400 mb-6">
                            Get started by creating your first milestone to track progress.
                        </p>
                        <Link href="/milestones/create">
                            <Button>
                                <Plus className="w-4 h-4 mr-2" />
                                Create Your First Milestone
                            </Button>
                        </Link>
                    </motion.div>
                )}

                {/* Pagination */}
                {milestones?.links && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.3 }}
                        className="mt-8 flex justify-center"
                    >
                        <div className="flex space-x-2">
                            {milestones.links.map((link, index) => (
                                <Link
                                    key={index}
                                    href={link.url ?? '#'}
                                    className={`px-3 py-2 text-sm rounded-lg ${
                                        link.active
                                            ? 'bg-blue-600 text-white'
                                            : 'bg-white text-gray-700 hover:bg-gray-50 border'
                                    }`}
                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                />
                            ))}
                        </div>
                    </motion.div>
                )}
            </div>
        </AuthenticatedLayout>
    );
}
