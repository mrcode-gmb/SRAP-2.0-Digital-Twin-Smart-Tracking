import { Head, useForm, router } from '@inertiajs/react';
import { useState } from 'react';
import { motion } from 'framer-motion';
import toast, { Toaster } from 'react-hot-toast';
import { 
    Play, 
    Save, 
    Plus, 
    Trash2, 
    Settings,
    Target,
    TrendingUp,
    Calendar,
    Users
} from 'lucide-react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/Components/ui/Card';
import { Button } from '@/Components/ui/Button';
import { Input } from '@/Components/ui/Input';
import { Badge } from '@/Components/ui/Badge';

export default function Create() {
    const [scenarios, setScenarios] = useState([]);
    const [activeScenario, setActiveScenario] = useState(null);

    const { data, setData, post, processing, errors } = useForm({
        name: '',
        description: '',
        scenario_type: '',
        simulation_period: '',
        parameters: {
            budget_change: 0,
            timeline_change: 0,
            resource_change: 0,
            scope_change: 0
        },
        target_kpis: [],
        duration_months: 6
    });

    const handleCreateScenario = (e) => {
        e.preventDefault();
        
        router.post(route('admin.scenarios.simulate'), data, {
            onSuccess: (response) => {
                toast.success('Scenario created successfully!');
                setData({
                    name: '',
                    description: '',
                    scenario_type: '',
                    simulation_period: '',
                    parameters: {
                        budget_change: 0,
                        timeline_change: 0,
                        resource_change: 0,
                        scope_change: 0
                    },
                    target_kpis: [],
                    duration_months: 6
                });
            },
            onError: (errors) => {
                console.log(errors)
                toast.error('Failed to create scenario. Please check your inputs.');
            }
        });
    };

    const addParameter = () => {
        setData('parameters', {
            ...data.parameters,
            [`custom_${Date.now()}`]: 0
        });
    };

    const removeParameter = (key) => {
        const newParams = { ...data.parameters };
        delete newParams[key];
        setData('parameters', newParams);
    };

    const updateParameter = (key, value) => {
        setData('parameters', {
            ...data.parameters,
            [key]: parseFloat(value) || 0
        });
    };

    const scenarioTypes = [
        {
            name: 'Budget Optimization',
            description: 'Analyze impact of budget changes on project outcomes',
            icon: TrendingUp,
            color: 'bg-blue-500'
        },
        {
            name: 'Timeline Acceleration',
            description: 'Simulate faster project delivery scenarios',
            icon: Calendar,
            color: 'bg-green-500'
        },
        {
            name: 'Resource Scaling',
            description: 'Test different resource allocation strategies',
            icon: Users,
            color: 'bg-purple-500'
        },
        {
            name: 'Risk Mitigation',
            description: 'Evaluate risk reduction measures',
            icon: Target,
            color: 'bg-red-500'
        }
    ];

    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
                        Create Scenario Simulation
                    </h2>
                    <Badge variant="outline" className="text-sm">
                        SRAP 2.0 Planning
                    </Badge>
                </div>
            }
        >
            <Head title="Create Scenario - SRAP 2.0" />
            <Toaster position="top-right" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        
                        {/* Scenario Types */}
                        <div className="lg:col-span-1">
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Settings className="w-5 h-5" />
                                        Scenario Types
                                    </CardTitle>
                                    <CardDescription>
                                        Choose a scenario template to get started
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                    {scenarioTypes.map((type, index) => {
                                        const IconComponent = type.icon;
                                        return (
                                            <motion.div
                                                key={index}
                                                whileHover={{ scale: 1.02 }}
                                                className="p-4 border rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800"
                                                onClick={() => setData('name', type.name)}
                                            >
                                                <div className="flex items-start gap-3">
                                                    <div className={`p-2 rounded-lg ${type.color} text-white`}>
                                                        <IconComponent className="w-4 h-4" />
                                                    </div>
                                                    <div className="flex-1">
                                                        <h4 className="font-medium text-gray-900 dark:text-white">
                                                            {type.name}
                                                        </h4>
                                                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                                            {type.description}
                                                        </p>
                                                    </div>
                                                </div>
                                            </motion.div>
                                        );
                                    })}
                                </CardContent>
                            </Card>
                        </div>

                        {/* Scenario Creation Form */}
                        <div className="lg:col-span-2">
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Plus className="w-5 h-5" />
                                        Create New Scenario
                                    </CardTitle>
                                    <CardDescription>
                                        Define scenario parameters and simulation settings
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <form onSubmit={handleCreateScenario} className="space-y-6">
                                        
                                        {/* General Error Display */}
                                        {Object.keys(errors).length > 0 && (
                                            <div className="bg-red-50 border border-red-200 rounded-md p-4">
                                                <div className="flex">
                                                    <div className="ml-3">
                                                        <h3 className="text-sm font-medium text-red-800">
                                                            Please fix the following errors:
                                                        </h3>
                                                        <div className="mt-2 text-sm text-red-700">
                                                            <ul className="list-disc pl-5 space-y-1">
                                                                {Object.entries(errors).map(([field, message]) => (
                                                                    <li key={field}>
                                                                        {field.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}: {message}
                                                                    </li>
                                                                ))}
                                                            </ul>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                        {/* Basic Information */}
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                    Scenario Name
                                                </label>
                                                <Input
                                                    type="text"
                                                    value={data.name}
                                                    onChange={(e) => setData('name', e.target.value)}
                                                    placeholder="Enter scenario name"
                                                    className="w-full"
                                                    required
                                                />
                                                {errors.name && (
                                                    <p className="text-red-500 text-sm mt-1">{errors.name}</p>
                                                )}
                                            </div>
                                            
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                    Duration (Months)
                                                </label>
                                                <Input
                                                    type="number"
                                                    value={data.duration_months}
                                                    onChange={(e) => setData('duration_months', parseInt(e.target.value))}
                                                    placeholder="6"
                                                    min="1"
                                                    max="24"
                                                    className="w-full"
                                                />
                                                {errors.duration_months && (
                                                    <p className="text-red-500 text-sm mt-1">{errors.duration_months}</p>
                                                )}
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                Description
                                            </label>
                                            <textarea
                                                value={data.description}
                                                onChange={(e) => setData('description', e.target.value)}
                                                placeholder="Describe the scenario objectives and expected outcomes"
                                                rows="3"
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                            />
                                            {errors.description && (
                                                <p className="text-red-500 text-sm mt-1">{errors.description}</p>
                                            )}
                                        </div>

                                        {/* Scenario Configuration */}
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                    Scenario Type *
                                                </label>
                                                <select
                                                    value={data.scenario_type}
                                                    onChange={(e) => setData('scenario_type', e.target.value)}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                                    required
                                                >
                                                    <option value="">Select scenario type</option>
                                                    <option value="what_if">What-If Analysis</option>
                                                    <option value="budget_impact">Budget Impact</option>
                                                    <option value="timeline_change">Timeline Change</option>
                                                    <option value="resource_allocation">Resource Allocation</option>
                                                </select>
                                                {errors.scenario_type && (
                                                    <p className="text-red-500 text-sm mt-1">{errors.scenario_type}</p>
                                                )}
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                    Simulation Period *
                                                </label>
                                                <select
                                                    value={data.simulation_period}
                                                    onChange={(e) => setData('simulation_period', e.target.value)}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                                    required
                                                >
                                                    <option value="">Select simulation period</option>
                                                    <option value="3_months">3 Months</option>
                                                    <option value="6_months">6 Months</option>
                                                    <option value="1_year">1 Year</option>
                                                    <option value="2_years">2 Years</option>
                                                </select>
                                                {errors.simulation_period && (
                                                    <p className="text-red-500 text-sm mt-1">{errors.simulation_period}</p>
                                                )}
                                            </div>
                                        </div>

                                        {/* Parameters */}
                                        <div>
                                            <div className="flex items-center justify-between mb-4">
                                                <h4 className="text-lg font-medium text-gray-900 dark:text-white">
                                                    Simulation Parameters
                                                </h4>
                                                <Button
                                                    type="button"
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={addParameter}
                                                >
                                                    <Plus className="w-4 h-4 mr-2" />
                                                    Add Parameter
                                                </Button>
                                            </div>
                                            
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                {Object.entries(data.parameters).map(([key, value]) => (
                                                    <div key={key} className="flex items-center gap-2">
                                                        <div className="flex-1">
                                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                                                {key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                                                            </label>
                                                            <Input
                                                                type="number"
                                                                value={value}
                                                                onChange={(e) => updateParameter(key, e.target.value)}
                                                                placeholder="0"
                                                                step="0.1"
                                                                className="w-full"
                                                            />
                                                            {errors.parameters && errors.parameters[key] && (
                                                                <p className="text-red-500 text-sm mt-1">{errors.parameters[key]}</p>
                                                            )}
                                                        </div>
                                                        {key.startsWith('custom_') && (
                                                            <Button
                                                                type="button"
                                                                variant="outline"
                                                                size="sm"
                                                                onClick={() => removeParameter(key)}
                                                                className="mt-6"
                                                            >
                                                                <Trash2 className="w-4 h-4" />
                                                            </Button>
                                                        )}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Action Buttons */}
                                        <div className="flex items-center justify-end gap-3 pt-6 border-t">
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
                                                className="flex items-center gap-2"
                                            >
                                                <Save className="w-4 h-4" />
                                                {processing ? 'Creating...' : 'Create Scenario'}
                                            </Button>
                                        </div>
                                    </form>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
