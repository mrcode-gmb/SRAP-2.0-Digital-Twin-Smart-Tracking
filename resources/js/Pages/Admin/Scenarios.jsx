import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
    Plus, 
    Search, 
    Filter, 
    BarChart3,
    Play,
    Download,
    Eye,
    Trash2,
    TrendingUp,
    Calendar,
    Target
} from 'lucide-react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/Components/ui/Card';
import { Button } from '@/Components/ui/Button';
import { Badge } from '@/Components/ui/Badge';

export default function AdminScenarios({ scenarios, filters }) {
    const [searchTerm, setSearchTerm] = useState(filters?.search || '');
    const [selectedType, setSelectedType] = useState(filters?.type || '');
    const [selectedStatus, setSelectedStatus] = useState(filters?.status || '');

    const handleSearch = () => {
        router.get('/admin/scenarios', {
            search: searchTerm,
            type: selectedType,
            status: selectedStatus
        }, {
            preserveState: true,
            preserveScroll: true
        });
    };

    const handleRunSimulation = (scenario) => {
        router.post('/admin/scenarios/simulate', {
            scenario_id: scenario.id
        });
    };

    const handleExport = (scenario, format = 'pdf') => {
        window.open(`/admin/scenarios/${scenario.id}/export/${format}`, '_blank');
    };

    const handleDelete = (scenario) => {
        if (confirm(`Are you sure you want to delete "${scenario.name}"?`)) {
            router.delete(`/admin/scenarios/${scenario.id}`);
        }
    };

    const getStatusBadge = (status) => {
        const colors = {
            completed: 'bg-green-100 text-green-800',
            running: 'bg-yellow-100 text-yellow-800',
            failed: 'bg-red-100 text-red-800',
            draft: 'bg-gray-100 text-gray-800'
        };
        
        return <Badge className={colors[status] || 'bg-gray-100 text-gray-800'}>
            {status.charAt(0).toUpperCase() + status.slice(1)}
        </Badge>;
    };

    const getTypeBadge = (type) => {
        const colors = {
            what_if: 'bg-blue-100 text-blue-800',
            budget_impact: 'bg-green-100 text-green-800',
            timeline_adjustment: 'bg-yellow-100 text-yellow-800',
            resource_allocation: 'bg-purple-100 text-purple-800'
        };
        
        return <Badge className={colors[type] || 'bg-gray-100 text-gray-800'}>
            {type.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
        </Badge>;
    };

    return (
        <AuthenticatedLayout>
            <Head title="Scenario Management" />

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
                                Scenario Management
                            </h1>
                            <p className="mt-2 text-gray-600 dark:text-gray-400">
                                Create and run what-if scenarios for SRAP 2.0 planning
                            </p>
                        </div>
                        <div className="mt-4 sm:mt-0">
                            <Link href="/admin/scenarios/create">
                                <Button className="flex items-center gap-2">
                                    <Plus className="w-4 h-4" />
                                    Create Scenario
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
                                        Search Scenarios
                                    </label>
                                    <div className="relative">
                                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                                        <input
                                            type="text"
                                            placeholder="Search scenarios..."
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Type
                                    </label>
                                    <select
                                        value={selectedType}
                                        onChange={(e) => setSelectedType(e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    >
                                        <option value="">All Types</option>
                                        <option value="what_if">What-If Analysis</option>
                                        <option value="budget_impact">Budget Impact</option>
                                        <option value="timeline_adjustment">Timeline Adjustment</option>
                                        <option value="resource_allocation">Resource Allocation</option>
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
                                        <option value="running">Running</option>
                                        <option value="failed">Failed</option>
                                        <option value="draft">Draft</option>
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

                {/* Scenarios Grid */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6"
                >
                    {scenarios?.data?.map((scenario, index) => (
                        <motion.div
                            key={scenario.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.2 + index * 0.1 }}
                        >
                            <Card className="hover:shadow-lg transition-all duration-300 border-0 shadow-md h-full">
                                <CardHeader className="pb-3">
                                    <div className="flex items-start justify-between">
                                        <div className="flex items-center space-x-3">
                                            <BarChart3 className="w-6 h-6 text-blue-500" />
                                            <div>
                                                <CardTitle className="text-lg font-semibold line-clamp-2">
                                                    {scenario.name}
                                                </CardTitle>
                                                <div className="flex items-center space-x-2 mt-1">
                                                    {getTypeBadge(scenario.type)}
                                                    {getStatusBadge(scenario.status)}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4">
                                        <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-3">
                                            {scenario.description}
                                        </p>
                                        
                                        {/* Scenario Details */}
                                        <div className="space-y-2 text-sm">
                                            {scenario.parameters && (
                                                <div className="flex items-center space-x-2">
                                                    <Target className="w-4 h-4 text-gray-400" />
                                                    <span className="text-gray-600 dark:text-gray-400">
                                                        {Object.keys(scenario.parameters).length} parameters
                                                    </span>
                                                </div>
                                            )}
                                            
                                            <div className="flex items-center space-x-2">
                                                <Calendar className="w-4 h-4 text-gray-400" />
                                                <span className="text-gray-600 dark:text-gray-400">
                                                    Created: {new Date(scenario.created_at).toLocaleDateString()}
                                                </span>
                                            </div>
                                            
                                            {scenario.last_run_at && (
                                                <div className="flex items-center space-x-2">
                                                    <TrendingUp className="w-4 h-4 text-gray-400" />
                                                    <span className="text-gray-600 dark:text-gray-400">
                                                        Last run: {new Date(scenario.last_run_at).toLocaleDateString()}
                                                    </span>
                                                </div>
                                            )}
                                        </div>

                                        {/* Results Summary */}
                                        {scenario.results && (
                                            <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                                                <div className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                                    Latest Results
                                                </div>
                                                <div className="text-sm text-gray-600 dark:text-gray-400">
                                                    Impact Score: {scenario.results.impact_score || 'N/A'}
                                                </div>
                                            </div>
                                        )}

                                        {/* Actions */}
                                        <div className="flex items-center space-x-2 pt-2">
                                            <Link href={`/admin/scenarios/${scenario.id}`}>
                                                <Button variant="outline" size="sm" className="flex-1">
                                                    <Eye className="w-4 h-4 mr-2" />
                                                    View
                                                </Button>
                                            </Link>
                                            {scenario.status !== 'running' && (
                                                <Button 
                                                    variant="outline" 
                                                    size="sm" 
                                                    onClick={() => handleRunSimulation(scenario)}
                                                    className="flex-1"
                                                >
                                                    <Play className="w-4 h-4 mr-2" />
                                                    Run
                                                </Button>
                                            )}
                                            {scenario.status === 'completed' && (
                                                <Button 
                                                    variant="outline" 
                                                    size="sm" 
                                                    onClick={() => handleExport(scenario)}
                                                >
                                                    <Download className="w-4 h-4" />
                                                </Button>
                                            )}
                                            <Button 
                                                variant="outline" 
                                                size="sm" 
                                                onClick={() => handleDelete(scenario)}
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
                {(!scenarios?.data || scenarios.data.length === 0) && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="text-center py-12"
                    >
                        <BarChart3 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                            No Scenarios Found
                        </h3>
                        <p className="text-gray-600 dark:text-gray-400 mb-6">
                            Create your first scenario to analyze different planning options.
                        </p>
                        <Link href="/admin/scenarios/create">
                            <Button>
                                <Plus className="w-4 h-4 mr-2" />
                                Create First Scenario
                            </Button>
                        </Link>
                    </motion.div>
                )}

                {/* Pagination */}
                {scenarios?.links && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.3 }}
                        className="mt-8 flex justify-center"
                    >
                        <div className="flex space-x-2">
                            {scenarios.links.map((link, index) => (
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
