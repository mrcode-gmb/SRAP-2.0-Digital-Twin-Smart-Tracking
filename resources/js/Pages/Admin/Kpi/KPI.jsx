import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
    Target,
    Plus,
    Edit,
    Trash2,
    Eye,
    Filter,
    Search,
    Download,
    RefreshCw,
    TrendingUp,
    TrendingDown,
    Minus,
    CheckCircle,
    AlertTriangle,
    Clock,
    Users,
    BarChart3
} from 'lucide-react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/Components/ui/Card';
import { Button } from '@/Components/ui/Button';
import { Badge } from '@/Components/ui/Badge';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';
import DangerButton from '@/Components/DangerButton';

export default function KPI({ kpis = [], pillars = [], departments = [], filters = {}, statuses = {} }) {
    const [searchTerm, setSearchTerm] = useState(filters.search || '');
    const [selectedStatus, setSelectedStatus] = useState(filters.status || '');
    const [selectedPillar, setSelectedPillar] = useState(filters.pillar || '');
    const [selectedDepartment, setSelectedDepartment] = useState(filters.department || '');

    // Handle paginated KPI data
    const displayKpis = kpis?.data || kpis || [];
    
    // Sample KPI data if none provided
    const sampleKpis = displayKpis.length > 0 ? displayKpis : [
        {
            id: 1,
            name: 'Broadband Penetration Rate',
            code: 'KPI-001',
            description: 'Percentage of households with broadband internet access',
            current_value: 65.2,
            target_value: 70.0,
            unit: '%',
            status: 'on_track',
            priority: 'high',
            pillar: { name: 'ICT Infrastructure', color: 'blue' },
            department: { name: 'ICT Infrastructure' },
            assigned_user: { name: 'John Doe' },
            progress_percentage: 93.1,
            last_updated: '2 hours ago'
        },
        {
            id: 2,
            name: 'Digital Literacy Rate',
            code: 'KPI-002',
            description: 'Percentage of population with basic digital skills',
            current_value: 42.8,
            target_value: 60.0,
            unit: '%',
            status: 'at_risk',
            priority: 'high',
            pillar: { name: 'Digital Economy', color: 'green' },
            department: { name: 'Digital Economy' },
            assigned_user: { name: 'Jane Smith' },
            progress_percentage: 71.3,
            last_updated: '4 hours ago'
        },
        {
            id: 3,
            name: 'Cybersecurity Incidents',
            code: 'KPI-003',
            description: 'Number of reported cybersecurity incidents per month',
            current_value: 12,
            target_value: 15,
            unit: 'incidents',
            status: 'exceeding',
            priority: 'critical',
            pillar: { name: 'Cybersecurity', color: 'red' },
            department: { name: 'Cybersecurity' },
            assigned_user: { name: 'Mike Johnson' },
            progress_percentage: 125.0,
            last_updated: '1 hour ago'
        }
    ];

    const finalKpis = displayKpis.length > 0 ? displayKpis : sampleKpis;

    const getStatusColor = (status) => {
        switch (status) {
            case 'completed':
                return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
            case 'on_track':
                return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
            case 'at_risk':
                return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
            case 'behind':
                return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
            case 'exceeding':
                return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-300';
            default:
                return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
        }
    };

    const getPriorityColor = (priority) => {
        switch (priority) {
            case 'critical':
                return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
            case 'high':
                return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300';
            case 'medium':
                return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
            case 'low':
                return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
            default:
                return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
        }
    };

    const getTrendIcon = (current, target) => {
        const percentage = (current / target) * 100;
        if (percentage >= 100) return <TrendingUp className="w-4 h-4 text-green-500" />;
        if (percentage >= 80) return <TrendingUp className="w-4 h-4 text-blue-500" />;
        if (percentage >= 60) return <Minus className="w-4 h-4 text-yellow-500" />;
        return <TrendingDown className="w-4 h-4 text-red-500" />;
    };

    const handleDelete = (kpiId, kpiName) => {
        if (confirm(`Are you sure you want to delete "${kpiName}"? This action cannot be undone.`)) {
            router.delete(route('admin.kpis.destroy', kpiId), {
                onSuccess: () => {
                    // Optionally show success message
                },
                onError: (errors) => {
                    alert('Error deleting KPI: ' + Object.values(errors).join(', '));
                }
            });
        }
    };

    const handleSearch = () => {
        router.get(route('admin.kpis.index'), {
            search: searchTerm,
            status: selectedStatus,
            pillar: selectedPillar,
            department: selectedDepartment
        }, { preserveState: true });
    };

    const clearFilters = () => {
        setSearchTerm('');
        setSelectedStatus('');
        setSelectedPillar('');
        setSelectedDepartment('');
        router.get(route('admin.kpis.index'));
    };

    // Summary statistics
    const totalKpis = kpis?.total || finalKpis.length;
    const onTrackKpis = finalKpis.filter(kpi => kpi.status === 'on_track').length;
    const atRiskKpis = finalKpis.filter(kpi => kpi.status === 'at_risk').length;
    const completedKpis = finalKpis.filter(kpi => kpi.status === 'completed').length;

    return (
        <AuthenticatedLayout>
            <Head title="KPI Management - SRAP 2.0" />

            <div className="px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="mb-8"
                >
                    <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-2xl p-8 text-white">
                        <div className="flex items-center justify-between">
                            <div>
                                <h1 className="text-3xl font-bold mb-2">KPI Management</h1>
                                <p className="text-blue-100">
                                    Manage and monitor Key Performance Indicators for NITDA SRAP 2.0
                                </p>
                            </div>
                            <div className="hidden md:block">
                                <Target className="w-16 h-16 text-blue-200" />
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
                    <Card className="border-0 shadow-lg">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total KPIs</p>
                                    <p className="text-3xl font-bold text-gray-900 dark:text-white">{totalKpis}</p>
                                </div>
                                <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-xl">
                                    <Target className="w-6 h-6 text-blue-600" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-0 shadow-lg">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">On Track</p>
                                    <p className="text-3xl font-bold text-gray-900 dark:text-white">{onTrackKpis}</p>
                                </div>
                                <div className="p-3 bg-green-100 dark:bg-green-900 rounded-xl">
                                    <CheckCircle className="w-6 h-6 text-green-600" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-0 shadow-lg">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">At Risk</p>
                                    <p className="text-3xl font-bold text-gray-900 dark:text-white">{atRiskKpis}</p>
                                </div>
                                <div className="p-3 bg-yellow-100 dark:bg-yellow-900 rounded-xl">
                                    <AlertTriangle className="w-6 h-6 text-yellow-600" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-0 shadow-lg">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Completed</p>
                                    <p className="text-3xl font-bold text-gray-900 dark:text-white">{completedKpis}</p>
                                </div>
                                <div className="p-3 bg-emerald-100 dark:bg-emerald-900 rounded-xl">
                                    <Clock className="w-6 h-6 text-emerald-600" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>

                {/* Actions and Filters */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-8"
                >
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                        <div className="flex flex-col sm:flex-row gap-4 flex-1">
                            {/* Search */}
                            <div className="relative flex-1 max-w-md">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                                <input
                                    type="text"
                                    placeholder="Search KPIs..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>

                            {/* Filters */}
                            <div className="flex gap-2">
                                <select
                                    value={selectedStatus}
                                    onChange={(e) => setSelectedStatus(e.target.value)}
                                    className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="">All Status</option>
                                    <option value="on_track">On Track</option>
                                    <option value="at_risk">At Risk</option>
                                    <option value="behind">Behind</option>
                                    <option value="completed">Completed</option>
                                    <option value="exceeding">Exceeding</option>
                                </select>

                                <Button variant="outline" onClick={handleSearch}>
                                    <Filter className="w-4 h-4 mr-2" />
                                    Filter
                                </Button>

                                <Button variant="outline" onClick={clearFilters}>
                                    Clear
                                </Button>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-2">
                            <Button variant="outline">
                                <Download className="w-4 h-4 mr-2" />
                                Export
                            </Button>
                            <Button variant="outline">
                                <RefreshCw className="w-4 h-4 mr-2" />
                                Refresh
                            </Button>
                            <Link href={route('admin.kpis.create')}>
                                <PrimaryButton>
                                    <Plus className="w-4 h-4 mr-2" />
                                    Add KPI
                                </PrimaryButton>
                            </Link>
                        </div>
                    </div>
                </motion.div>

                {/* KPIs Grid */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.3 }}
                    className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6"
                >
                    {finalKpis.map((kpi, index) => (
                        <motion.div
                            key={kpi.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
                        >
                            <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 h-full">
                                <CardContent className="p-6">
                                    {/* Header */}
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="flex-1">
                                            <div className="flex items-center space-x-2 mb-2">
                                                <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                                                    {kpi.name}
                                                </h3>
                                                {getTrendIcon(kpi.current_value, kpi.target_value)}
                                            </div>
                                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                                                {kpi.code}
                                            </p>
                                            <div className="flex flex-wrap gap-2 mb-3">
                                                <Badge className={getStatusColor(kpi.status)}>
                                                    {kpi.status.replace('_', ' ')}
                                                </Badge>
                                                <Badge className={getPriorityColor(kpi.priority)}>
                                                    {kpi.priority}
                                                </Badge>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Description */}
                                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
                                        {kpi.description}
                                    </p>

                                    {/* Values */}
                                    <div className="space-y-3 mb-4">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                                                    {kpi.current_value}{kpi.unit}
                                                </p>
                                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                                    Target: {kpi.target_value}{kpi.unit}
                                                </p>
                                            </div>
                                        </div>

                                        {/* Progress Bar */}
                                        <div className="space-y-2">
                                            <div className="flex justify-between text-sm">
                                                <span className="text-gray-600 dark:text-gray-400">Progress</span>
                                                <span className="font-medium text-gray-900 dark:text-white">
                                                    {Math.round((kpi.current_value / kpi.target_value) * 100)}%
                                                </span>
                                            </div>
                                            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                                                <div
                                                    className={`h-2 rounded-full transition-all duration-500 ${
                                                        kpi.status === 'exceeding' ? 'bg-emerald-500' :
                                                        kpi.status === 'completed' ? 'bg-green-500' :
                                                        kpi.status === 'on_track' ? 'bg-blue-500' :
                                                        kpi.status === 'at_risk' ? 'bg-yellow-500' : 'bg-red-500'
                                                    }`}
                                                    style={{ width: `${Math.min((kpi.current_value / kpi.target_value) * 100, 100)}%` }}
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Meta Info */}
                                    <div className="space-y-2 mb-4 text-sm text-gray-600 dark:text-gray-400">
                                        {kpi.pillar && (
                                            <div className="flex items-center">
                                                <BarChart3 className="w-4 h-4 mr-2" />
                                                <span>{kpi.pillar.name}</span>
                                            </div>
                                        )}
                                        {kpi.assigned_user && (
                                            <div className="flex items-center">
                                                <Users className="w-4 h-4 mr-2" />
                                                <span>{kpi.assigned_user.name}</span>
                                            </div>
                                        )}
                                        <div className="flex items-center">
                                            <Clock className="w-4 h-4 mr-2" />
                                            <span>Updated {kpi.last_updated}</span>
                                        </div>
                                    </div>

                                    {/* Actions */}
                                    <div className="flex gap-2 pt-4 border-t border-gray-200 dark:border-gray-700">
                                        <Link href={route('admin.kpis.show', kpi.id)} className="flex-1">
                                            <SecondaryButton className="w-full">
                                                <Eye className="w-4 h-4 mr-2" />
                                                View
                                            </SecondaryButton>
                                        </Link>
                                        <Link href={route('admin.kpis.edit', kpi.id)} className="flex-1">
                                            <SecondaryButton className="w-full">
                                                <Edit className="w-4 h-4 mr-2" />
                                                Edit
                                            </SecondaryButton>
                                        </Link>
                                        <DangerButton
                                            onClick={() => handleDelete(kpi.id, kpi.name)}
                                            className="px-3"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </DangerButton>
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>
                    ))}
                </motion.div>

                {/* Empty State */}
                {finalKpis.length === 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.3 }}
                        className="text-center py-12"
                    >
                        <Target className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                            No KPIs Found
                        </h3>
                        <p className="text-gray-600 dark:text-gray-400 mb-6">
                            Get started by creating your first KPI to track performance metrics.
                        </p>
                        <Link href={route('admin.kpis.create')}>
                            <PrimaryButton>
                                <Plus className="w-4 h-4 mr-2" />
                                Create First KPI
                            </PrimaryButton>
                        </Link>
                    </motion.div>
                )}
            </div>
        </AuthenticatedLayout>
    );
}
