import { Head, Link, useForm } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { 
    ArrowLeft, 
    Save, 
    Target, 
    FileText,
    Calendar,
    DollarSign,
    Building,
    Flag
} from 'lucide-react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/Components/ui/Card';
import { Button } from '@/Components/ui/Button';

export default function SrapPillarCreate() {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        code: '',
        description: '',
        objectives: '',
        success_metrics: '',
        target_completion_date: '',
        budget_allocation: '',
        responsible_department: '',
        priority_level: 'medium',
        is_active: true
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post('/srap-pillars');
    };

    const priorityOptions = [
        { value: 'low', label: 'Low' },
        { value: 'medium', label: 'Medium' },
        { value: 'high', label: 'High' },
        { value: 'critical', label: 'Critical' }
    ];

    return (
        <AuthenticatedLayout>
            <Head title="Create SRAP Pillar" />

            <div className="px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
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
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                        Create New SRAP Pillar
                    </h1>
                    <p className="mt-2 text-gray-600 dark:text-gray-400">
                        Add a new strategic pillar to organize and track your KPIs
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
                                    Provide the essential details for your SRAP pillar
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            Pillar Name *
                                        </label>
                                        <input
                                            type="text"
                                            value={data.name}
                                            onChange={(e) => setData('name', e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            placeholder="Enter pillar name..."
                                            required
                                        />
                                        {errors.name && (
                                            <p className="mt-1 text-sm text-red-600">{errors.name}</p>
                                        )}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            Pillar Code *
                                        </label>
                                        <input
                                            type="text"
                                            value={data.code}
                                            onChange={(e) => setData('code', e.target.value.toUpperCase())}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono"
                                            placeholder="e.g., SRAP-01"
                                            maxLength="10"
                                            required
                                        />
                                        {errors.code && (
                                            <p className="mt-1 text-sm text-red-600">{errors.code}</p>
                                        )}
                                    </div>
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
                                        placeholder="Describe the pillar's purpose and scope..."
                                        required
                                    />
                                    {errors.description && (
                                        <p className="mt-1 text-sm text-red-600">{errors.description}</p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Strategic Objectives
                                    </label>
                                    <textarea
                                        value={data.objectives}
                                        onChange={(e) => setData('objectives', e.target.value)}
                                        rows={3}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        placeholder="List the key objectives this pillar aims to achieve..."
                                    />
                                    {errors.objectives && (
                                        <p className="mt-1 text-sm text-red-600">{errors.objectives}</p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Success Metrics
                                    </label>
                                    <textarea
                                        value={data.success_metrics}
                                        onChange={(e) => setData('success_metrics', e.target.value)}
                                        rows={3}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        placeholder="Define how success will be measured for this pillar..."
                                    />
                                    {errors.success_metrics && (
                                        <p className="mt-1 text-sm text-red-600">{errors.success_metrics}</p>
                                    )}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Management Details */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center space-x-2">
                                    <Target className="w-5 h-5" />
                                    <span>Management & Timeline</span>
                                </CardTitle>
                                <CardDescription>
                                    Set management and timeline details for this pillar
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            Responsible Department
                                        </label>
                                        <input
                                            type="text"
                                            value={data.responsible_department}
                                            onChange={(e) => setData('responsible_department', e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            placeholder="e.g., Digital Economy Department"
                                        />
                                        {errors.responsible_department && (
                                            <p className="mt-1 text-sm text-red-600">{errors.responsible_department}</p>
                                        )}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            Priority Level *
                                        </label>
                                        <select
                                            value={data.priority_level}
                                            onChange={(e) => setData('priority_level', e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            required
                                        >
                                            {priorityOptions.map(option => (
                                                <option key={option.value} value={option.value}>
                                                    {option.label}
                                                </option>
                                            ))}
                                        </select>
                                        {errors.priority_level && (
                                            <p className="mt-1 text-sm text-red-600">{errors.priority_level}</p>
                                        )}
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            Target Completion Date
                                        </label>
                                        <input
                                            type="date"
                                            value={data.target_completion_date}
                                            onChange={(e) => setData('target_completion_date', e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        />
                                        {errors.target_completion_date && (
                                            <p className="mt-1 text-sm text-red-600">{errors.target_completion_date}</p>
                                        )}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            Budget Allocation (₦)
                                        </label>
                                        <input
                                            type="number"
                                            min="0"
                                            step="0.01"
                                            value={data.budget_allocation}
                                            onChange={(e) => setData('budget_allocation', e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            placeholder="0.00"
                                        />
                                        {errors.budget_allocation && (
                                            <p className="mt-1 text-sm text-red-600">{errors.budget_allocation}</p>
                                        )}
                                    </div>
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
                                        Active pillar (can have KPIs assigned and be tracked)
                                    </label>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Actions */}
                        <div className="flex items-center justify-end space-x-4">
                            <Link href="/srap-pillars">
                                <Button variant="outline">
                                    Cancel
                                </Button>
                            </Link>
                            <Button type="submit" disabled={processing}>
                                <Save className="w-4 h-4 mr-2" />
                                {processing ? 'Creating...' : 'Create Pillar'}
                            </Button>
                        </div>
                    </form>
                </motion.div>
            </div>
        </AuthenticatedLayout>
    );
}
