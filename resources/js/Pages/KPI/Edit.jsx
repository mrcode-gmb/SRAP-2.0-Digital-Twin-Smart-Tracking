import { Head, useForm, router } from '@inertiajs/react';
import { motion } from 'framer-motion';
import toast, { Toaster } from 'react-hot-toast';
import { 
    Save, 
    ArrowLeft, 
    Target,
    Calendar,
    Building,
    User,
    FileText,
    TrendingUp
} from 'lucide-react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/Components/ui/Card';
import { Button } from '@/Components/ui/Button';
import { Badge } from '@/Components/ui/Badge';

export default function KPIEdit({ kpi, pillars, departments, users }) {
    const { data, setData, put, processing, errors } = useForm({
        name: kpi.name || '',
        description: kpi.description || '',
        pillar_id: kpi.pillar_id || '',
        department_id: kpi.department_id || '',
        assigned_to: kpi.assigned_to || '',
        target_value: kpi.target_value || '',
        current_value: kpi.current_value || '0',
        unit: kpi.unit || '',
        target_date: kpi.end_date ? kpi.end_date.split('T')[0] : '',
        frequency: kpi.frequency || 'monthly',
        calculation_method: kpi.calculation_method || '',
        data_source: kpi.data_source || '',
        baseline_value: kpi.baseline_value || '',
        baseline_date: kpi.baseline_date ? kpi.baseline_date.split('T')[0] : '',
        weight: kpi.weight || '1',
        is_active: kpi.is_active ?? true
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        put(`/kpis/${kpi.id}`, {
            onSuccess: () => {
                toast.success('KPI updated successfully!');
            },
            onError: (errors) => {
                toast.error('Failed to update KPI. Please check the form for errors.');
            }
        });
    };

    return (
        <AuthenticatedLayout>
            <Head title={`Edit Kpis: ${kpi.name}`} />

            <div className="px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
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
                    
                    <div className="flex items-center space-x-4">
                        <div className="p-3 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl shadow-lg">
                            <Target className="w-8 h-8 text-white" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                                Edit KPI
                            </h1>
                            <p className="text-gray-600 dark:text-gray-400">
                                Update the details for: {kpi.name}
                            </p>
                        </div>
                    </div>
                </motion.div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Basic Information */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.1 }}
                    >
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <FileText className="w-5 h-5" />
                                    Basic Information
                                </CardTitle>
                                <CardDescription>
                                    Update the core details of your KPI
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        KPI Title *
                                    </label>
                                    <input
                                        type="text"
                                        value={data.name}
                                        onChange={(e) => setData('name', e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        placeholder="e.g., Digital Literacy Rate"
                                        required
                                    />
                                    {errors.name && (
                                        <p className="mt-1 text-sm text-red-600">{errors.name}</p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Description *
                                    </label>
                                    <textarea
                                        value={data.description}
                                        onChange={(e) => setData('description', e.target.value)}
                                        rows={3}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        placeholder="Describe what this KPI measures and its importance..."
                                        required
                                    />
                                    {errors.description && (
                                        <p className="mt-1 text-sm text-red-600">{errors.description}</p>
                                    )}
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            SRAP Pillar *
                                        </label>
                                        <select
                                            value={data.pillar_id}
                                            onChange={(e) => setData('pillar_id', e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            required
                                        >
                                            <option value="">Select a pillar</option>
                                            {pillars?.map(pillar => (
                                                <option key={pillar.id} value={pillar.id}>
                                                    {pillar.name} ({pillar.code})
                                                </option>
                                            ))}
                                        </select>
                                        {errors.pillar_id && (
                                            <p className="mt-1 text-sm text-red-600">{errors.pillar_id}</p>
                                        )}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            Department *
                                        </label>
                                        <select
                                            value={data.department_id}
                                            onChange={(e) => setData('department_id', e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            required
                                        >
                                            <option value="">Select a department</option>
                                            {departments?.map(dept => (
                                                <option key={dept.id} value={dept.id}>
                                                    {dept.name}
                                                </option>
                                            ))}
                                        </select>
                                        {errors.department_id && (
                                            <p className="mt-1 text-sm text-red-600">{errors.department_id}</p>
                                        )}
                                    </div>
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
                            </CardContent>
                        </Card>
                    </motion.div>

                    {/* Measurement Details */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                    >
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <TrendingUp className="w-5 h-5" />
                                    Measurement Details
                                </CardTitle>
                                <CardDescription>
                                    Update how this KPI is measured and tracked
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            Current Value *
                                        </label>
                                        <input
                                            type="number"
                                            step="0.01"
                                            value={data.current_value}
                                            onChange={(e) => setData('current_value', e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            required
                                        />
                                        {errors.current_value && (
                                            <p className="mt-1 text-sm text-red-600">{errors.current_value}</p>
                                        )}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            Target Value *
                                        </label>
                                        <input
                                            type="number"
                                            step="0.01"
                                            value={data.target_value}
                                            onChange={(e) => setData('target_value', e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            required
                                        />
                                        {errors.target_value && (
                                            <p className="mt-1 text-sm text-red-600">{errors.target_value}</p>
                                        )}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            Unit *
                                        </label>
                                        <input
                                            type="text"
                                            value={data.unit}
                                            onChange={(e) => setData('unit', e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            placeholder="e.g., %, count, score"
                                            required
                                        />
                                        {errors.unit && (
                                            <p className="mt-1 text-sm text-red-600">{errors.unit}</p>
                                        )}
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            Target Date *
                                        </label>
                                        <input
                                            type="date"
                                            value={data.target_date}
                                            onChange={(e) => setData('target_date', e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            required
                                        />
                                        {errors.target_date && (
                                            <p className="mt-1 text-sm text-red-600">{errors.target_date}</p>
                                        )}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            Measurement Frequency *
                                        </label>
                                        <select
                                            value={data.frequency}
                                            onChange={(e) => setData('frequency', e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            required
                                        >
                                            <option value="daily">Daily</option>
                                            <option value="weekly">Weekly</option>
                                            <option value="monthly">Monthly</option>
                                            <option value="quarterly">Quarterly</option>
                                            <option value="annually">Annually</option>
                                        </select>
                                        {errors.frequency && (
                                            <p className="mt-1 text-sm text-red-600">{errors.frequency}</p>
                                        )}
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Calculation Method
                                    </label>
                                    <textarea
                                        value={data.calculation_method}
                                        onChange={(e) => setData('calculation_method', e.target.value)}
                                        rows={2}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        placeholder="Describe how this KPI is calculated..."
                                    />
                                    {errors.calculation_method && (
                                        <p className="mt-1 text-sm text-red-600">{errors.calculation_method}</p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Data Source
                                    </label>
                                    <input
                                        type="text"
                                        value={data.data_source}
                                        onChange={(e) => setData('data_source', e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        placeholder="e.g., Survey data, System reports, Manual input"
                                    />
                                    {errors.data_source && (
                                        <p className="mt-1 text-sm text-red-600">{errors.data_source}</p>
                                    )}
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            Baseline Value
                                        </label>
                                        <input
                                            type="number"
                                            step="0.01"
                                            value={data.baseline_value}
                                            onChange={(e) => setData('baseline_value', e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        />
                                        {errors.baseline_value && (
                                            <p className="mt-1 text-sm text-red-600">{errors.baseline_value}</p>
                                        )}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            Baseline Date
                                        </label>
                                        <input
                                            type="date"
                                            value={data.baseline_date}
                                            onChange={(e) => setData('baseline_date', e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        />
                                        {errors.baseline_date && (
                                            <p className="mt-1 text-sm text-red-600">{errors.baseline_date}</p>
                                        )}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            Weight (1-10)
                                        </label>
                                        <input
                                            type="number"
                                            min="1"
                                            max="10"
                                            value={data.weight}
                                            onChange={(e) => setData('weight', e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        />
                                        {errors.weight && (
                                            <p className="mt-1 text-sm text-red-600">{errors.weight}</p>
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
                                    <label htmlFor="is_active" className="ml-2 block text-sm text-gray-900 dark:text-white">
                                        Active KPI (uncheck to deactivate)
                                    </label>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>

                    {/* Actions */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.3 }}
                        className="flex items-center justify-end space-x-4"
                    >
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => router.visit(`/kpis/${kpi.id}`)}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            disabled={processing}
                            className="flex items-center gap-2"
                        >
                            <Save className="w-4 h-4" />
                            {processing ? 'Updating...' : 'Update KPI'}
                        </Button>
                    </motion.div>
                </form>
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
                            primary: '#4ade80',
                            secondary: '#000',
                        },
                    },
                    error: {
                        duration: 4000,
                        theme: {
                            primary: '#ef4444',
                            secondary: '#000',
                        },
                    },
                }}
            />
        </AuthenticatedLayout>
    );
}
