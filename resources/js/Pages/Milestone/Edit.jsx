import { Head, Link, useForm } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { 
    ArrowLeft, 
    Save, 
    Calendar, 
    Target, 
    User, 
    Flag,
    FileText,
    CheckSquare,
    GitBranch
} from 'lucide-react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/Components/ui/Card';
import { Button } from '@/Components/ui/Button';
import { Badge } from '@/Components/ui/Badge';

export default function MilestoneEdit({ milestone, kpis, users }) {
    const { data, setData, put, processing, errors } = useForm({
        title: milestone.title || '',
        description: milestone.description || '',
        kpi_id: milestone.kpi_id || '',
        assigned_to: milestone.assigned_to || '',
        due_date: milestone.due_date || '',
        priority: milestone.priority || 'medium',
        completion_percentage: milestone.completion_percentage || 0,
        deliverables: milestone.deliverables || '',
        success_criteria: milestone.success_criteria || '',
        dependencies: milestone.dependencies || '',
        is_active: milestone.is_active ?? true
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        put(`/milestones/${milestone.id}`);
    };

    const priorityOptions = [
        { value: 'low', label: 'Low', color: 'bg-gray-100 text-gray-800' },
        { value: 'medium', label: 'Medium', color: 'bg-yellow-100 text-yellow-800' },
        { value: 'high', label: 'High', color: 'bg-orange-100 text-orange-800' },
        { value: 'critical', label: 'Critical', color: 'bg-red-100 text-red-800' }
    ];

    return (
        <AuthenticatedLayout>
            <Head title={`Edit Milestone: ${milestone.title}`} />

            <div className="px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="mb-8"
                >
                    <div className="flex items-center space-x-4 mb-4">
                        <Link href={`/milestones/${milestone.id}`}>
                            <Button variant="outline" size="sm">
                                <ArrowLeft className="w-4 h-4 mr-2" />
                                Back to Milestone
                            </Button>
                        </Link>
                    </div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                        Edit Milestone
                    </h1>
                    <p className="mt-2 text-gray-600 dark:text-gray-400">
                        Update milestone details and progress
                    </p>
                </motion.div>

                {/* Form */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.1 }}
                >
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Basic Information */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center space-x-2">
                                    <FileText className="w-5 h-5" />
                                    <span>Basic Information</span>
                                </CardTitle>
                                <CardDescription>
                                    Update the essential details for your milestone
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Milestone Title *
                                    </label>
                                    <input
                                        type="text"
                                        value={data.title}
                                        onChange={(e) => setData('title', e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        placeholder="Enter milestone title..."
                                        required
                                    />
                                    {errors.title && (
                                        <p className="mt-1 text-sm text-red-600">{errors.title}</p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Description *
                                    </label>
                                    <textarea
                                        value={data.description}
                                        onChange={(e) => setData('description', e.target.value)}
                                        rows={4}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        placeholder="Describe the milestone objectives and scope..."
                                        required
                                    />
                                    {errors.description && (
                                        <p className="mt-1 text-sm text-red-600">{errors.description}</p>
                                    )}
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            Associated KPI *
                                        </label>
                                        <select
                                            value={data.kpi_id}
                                            onChange={(e) => setData('kpi_id', e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            required
                                        >
                                            <option value="">Select a KPI</option>
                                            {kpis?.map(kpi => (
                                                <option key={kpi.id} value={kpi.id}>
                                                    {kpi.name} ({kpi.pillar?.code})
                                                </option>
                                            ))}
                                        </select>
                                        {errors.kpi_id && (
                                            <p className="mt-1 text-sm text-red-600">{errors.kpi_id}</p>
                                        )}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            Assigned To
                                        </label>
                                        <select
                                            value={data.assigned_to}
                                            onChange={(e) => setData('assigned_to', e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        >
                                            <option value="">Select a user</option>
                                            {users?.map(user => (
                                                <option key={user.id} value={user.id}>
                                                    {user.name} ({user.email})
                                                </option>
                                            ))}
                                        </select>
                                        {errors.assigned_to && (
                                            <p className="mt-1 text-sm text-red-600">{errors.assigned_to}</p>
                                        )}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Timeline & Priority */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center space-x-2">
                                    <Calendar className="w-5 h-5" />
                                    <span>Timeline & Priority</span>
                                </CardTitle>
                                <CardDescription>
                                    Update the timeline and priority level for this milestone
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            Due Date *
                                        </label>
                                        <input
                                            type="date"
                                            value={data.due_date}
                                            onChange={(e) => setData('due_date', e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            required
                                        />
                                        {errors.due_date && (
                                            <p className="mt-1 text-sm text-red-600">{errors.due_date}</p>
                                        )}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            Priority *
                                        </label>
                                        <select
                                            value={data.priority}
                                            onChange={(e) => setData('priority', e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            required
                                        >
                                            {priorityOptions.map(option => (
                                                <option key={option.value} value={option.value}>
                                                    {option.label}
                                                </option>
                                            ))}
                                        </select>
                                        {errors.priority && (
                                            <p className="mt-1 text-sm text-red-600">{errors.priority}</p>
                                        )}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            Progress (%)
                                        </label>
                                        <input
                                            type="number"
                                            min="0"
                                            max="100"
                                            value={data.completion_percentage}
                                            onChange={(e) => setData('completion_percentage', parseInt(e.target.value) || 0)}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        />
                                        {errors.completion_percentage && (
                                            <p className="mt-1 text-sm text-red-600">{errors.completion_percentage}</p>
                                        )}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Additional Details */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center space-x-2">
                                    <CheckSquare className="w-5 h-5" />
                                    <span>Additional Details</span>
                                </CardTitle>
                                <CardDescription>
                                    Update context and requirements for this milestone
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Deliverables
                                    </label>
                                    <textarea
                                        value={data.deliverables}
                                        onChange={(e) => setData('deliverables', e.target.value)}
                                        rows={3}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        placeholder="List the expected deliverables for this milestone..."
                                    />
                                    {errors.deliverables && (
                                        <p className="mt-1 text-sm text-red-600">{errors.deliverables}</p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Success Criteria
                                    </label>
                                    <textarea
                                        value={data.success_criteria}
                                        onChange={(e) => setData('success_criteria', e.target.value)}
                                        rows={3}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        placeholder="Define what success looks like for this milestone..."
                                    />
                                    {errors.success_criteria && (
                                        <p className="mt-1 text-sm text-red-600">{errors.success_criteria}</p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Dependencies
                                    </label>
                                    <textarea
                                        value={data.dependencies}
                                        onChange={(e) => setData('dependencies', e.target.value)}
                                        rows={3}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        placeholder="List any dependencies or prerequisites..."
                                    />
                                    {errors.dependencies && (
                                        <p className="mt-1 text-sm text-red-600">{errors.dependencies}</p>
                                    )}
                                </div>

                                <div className="flex items-center">
                                    <input
                                        type="checkbox"
                                        id="is_active"
                                        checked={data.is_active}
                                        onChange={(e) => setData('is_active', e.target.checked)}
                                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                    />
                                    <label htmlFor="is_active" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                                        Active milestone (can be tracked and updated)
                                    </label>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Actions */}
                        <div className="flex items-center justify-end space-x-4">
                            <Link href={`/milestones/${milestone.id}`}>
                                <Button variant="outline">
                                    Cancel
                                </Button>
                            </Link>
                            <Button type="submit" disabled={processing}>
                                <Save className="w-4 h-4 mr-2" />
                                {processing ? 'Updating...' : 'Update Milestone'}
                            </Button>
                        </div>
                    </form>
                </motion.div>
            </div>
        </AuthenticatedLayout>
    );
}
