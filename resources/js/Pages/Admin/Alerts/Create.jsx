import { useState } from 'react';
import { Head, useForm } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { 
    AlertTriangle, 
    ArrowLeft, 
    Save,
    Mail,
    Target,
    Calendar,
    Info
} from 'lucide-react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Button } from '@/Components/ui/Button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/Components/ui/Card';
import { Badge } from '@/Components/ui/Badge';
// import { Alert, AlertDescription } from '@/Components/ui/AlertDescription';

export default function Create({ kpis = [], milestones = [] }) {
    const [selectedType, setSelectedType] = useState('system');
    
    const { data, setData, post, processing, errors } = useForm({
        title: '',
        message: '',
        type: 'system',
        priority: 3,
        alertable_type: '',
        alertable_id: '',
        recipients: [],
        send_email: false,
        metadata: {}
    });

    const alertTypes = [
        { value: 'deadline', label: 'Deadline Alert', icon: Calendar, color: 'orange' },
        { value: 'performance', label: 'Performance Alert', icon: Target, color: 'red' },
        { value: 'system', label: 'System Alert', icon: Info, color: 'blue' },
        { value: 'milestone', label: 'Milestone Alert', icon: Calendar, color: 'green' },
        { value: 'kpi_update', label: 'KPI Update', icon: Target, color: 'purple' }
    ];

    const priorityLevels = [
        { value: 1, label: 'Critical', color: 'red' },
        { value: 2, label: 'High', color: 'orange' },
        { value: 3, label: 'Medium', color: 'yellow' },
        { value: 4, label: 'Low', color: 'green' },
        { value: 5, label: 'Info', color: 'blue' }
    ];

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('admin.alerts.store'));
    };

    const addRecipient = () => {
        setData('recipients', [...data.recipients, '']);
    };

    const updateRecipient = (index, email) => {
        const newRecipients = [...data.recipients];
        newRecipients[index] = email;
        setData('recipients', newRecipients);
    };

    const removeRecipient = (index) => {
        const newRecipients = data.recipients.filter((_, i) => i !== index);
        setData('recipients', newRecipients);
    };

    return (
        <AuthenticatedLayout>
            <Head title="Create Alert" />
            
            <div className="px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => window.history.back()}
                                className="flex items-center space-x-2"
                            >
                                <ArrowLeft className="h-4 w-4" />
                                <span>Back</span>
                            </Button>
                            <div>
                                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                                    Create Alert
                                </h1>
                                <p className="text-gray-600 dark:text-gray-400 mt-1">
                                    Create a new system alert or notification
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Basic Information */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Alert Details</CardTitle>
                            <CardDescription>
                                Provide the basic information for the alert
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            {/* Title */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Alert Title *
                                </label>
                                <input
                                    type="text"
                                    value={data.title}
                                    onChange={(e) => setData('title', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="Enter alert title..."
                                />
                                {errors.title && (
                                    <p className="mt-1 text-sm text-red-600">{errors.title}</p>
                                )}
                            </div>

                            {/* Message */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Alert Message *
                                </label>
                                <textarea
                                    value={data.message}
                                    onChange={(e) => setData('message', e.target.value)}
                                    rows={4}
                                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="Enter detailed alert message..."
                                />
                                {errors.message && (
                                    <p className="mt-1 text-sm text-red-600">{errors.message}</p>
                                )}
                            </div>

                            {/* Alert Type */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                                    Alert Type *
                                </label>
                                <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
                                    {alertTypes.map((type) => (
                                        <button
                                            key={type.value}
                                            type="button"
                                            onClick={() => {
                                                setData('type', type.value);
                                                setSelectedType(type.value);
                                            }}
                                            className={`p-3 border-2 rounded-lg text-left transition-colors ${
                                                data.type === type.value
                                                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                                                    : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'
                                            }`}
                                        >
                                            <div className="flex items-center space-x-2">
                                                <type.icon className={`h-4 w-4 text-${type.color}-600`} />
                                                <span className="text-sm font-medium">{type.label}</span>
                                            </div>
                                        </button>
                                    ))}
                                </div>
                                {errors.type && (
                                    <p className="mt-1 text-sm text-red-600">{errors.type}</p>
                                )}
                            </div>

                            {/* Priority */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                                    Priority Level *
                                </label>
                                <div className="flex space-x-3">
                                    {priorityLevels.map((priority) => (
                                        <button
                                            key={priority.value}
                                            type="button"
                                            onClick={() => setData('priority', priority.value)}
                                            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                                                data.priority === priority.value
                                                    ? `bg-${priority.color}-100 text-${priority.color}-800 border-2 border-${priority.color}-500`
                                                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 border-2 border-transparent hover:border-gray-300'
                                            }`}
                                        >
                                            {priority.label}
                                        </button>
                                    ))}
                                </div>
                                {errors.priority && (
                                    <p className="mt-1 text-sm text-red-600">{errors.priority}</p>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Related Entity */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Related Entity (Optional)</CardTitle>
                            <CardDescription>
                                Link this alert to a specific KPI or Milestone
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {/* Entity Type */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Entity Type
                                </label>
                                <select
                                    value={data.alertable_type}
                                    onChange={(e) => {
                                        setData('alertable_type', e.target.value);
                                        setData('alertable_id', '');
                                    }}
                                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="">Select entity type...</option>
                                    <option value="App\Models\Kpis">KPI</option>
                                    <option value="App\Models\Milestone">Milestone</option>
                                </select>
                            </div>

                            {/* Entity Selection */}
                            {data.alertable_type && (
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        {data.alertable_type.includes('Kpi') ? 'Select KPI' : 'Select Milestone'}
                                    </label>
                                    <select
                                        value={data.alertable_id}
                                        onChange={(e) => setData('alertable_id', e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    >
                                        <option value="">Select {data.alertable_type.includes('Kpi') ? 'KPI' : 'Milestone'}...</option>
                                        {data.alertable_type.includes('Kpi') 
                                            ? kpis.map((kpi) => (
                                                <option key={kpi.id} value={kpi.id}>{kpi.name}</option>
                                            ))
                                            : milestones.map((milestone) => (
                                                <option key={milestone.id} value={milestone.id}>{milestone.name}</option>
                                            ))
                                        }
                                    </select>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Email Notifications */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center space-x-2">
                                <Mail className="h-5 w-5" />
                                <span>Email Notifications</span>
                            </CardTitle>
                            <CardDescription>
                                Configure email notifications for this alert
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {/* Send Email Toggle */}
                            <div className="flex items-center space-x-2">
                                <input
                                    type="checkbox"
                                    id="send_email"
                                    checked={data.send_email}
                                    onChange={(e) => setData('send_email', e.target.checked)}
                                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                />
                                <label htmlFor="send_email" className="text-sm text-gray-700 dark:text-gray-300">
                                    Send email notifications
                                </label>
                            </div>

                            {/* Recipients */}
                            {data.send_email && (
                                <div>
                                    <div className="flex items-center justify-between mb-2">
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                            Email Recipients
                                        </label>
                                        <Button
                                            type="button"
                                            variant="outline"
                                            size="sm"
                                            onClick={addRecipient}
                                        >
                                            Add Email
                                        </Button>
                                    </div>
                                    
                                    <div className="space-y-2">
                                        {data.recipients.map((email, index) => (
                                            <div key={index} className="flex space-x-2">
                                                <input
                                                    type="email"
                                                    value={email}
                                                    onChange={(e) => updateRecipient(index, e.target.value)}
                                                    className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                    placeholder="Enter email address..."
                                                />
                                                <Button
                                                    type="button"
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => removeRecipient(index)}
                                                >
                                                    Remove
                                                </Button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Submit Button */}
                    <div className="flex justify-end space-x-4">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => window.history.back()}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            disabled={processing}
                            className="flex items-center space-x-2"
                        >
                            <Save className="h-4 w-4" />
                            <span>{processing ? 'Creating...' : 'Create Alert'}</span>
                        </Button>
                    </div>
                </form>
            </div>
        </AuthenticatedLayout>
    );
}
