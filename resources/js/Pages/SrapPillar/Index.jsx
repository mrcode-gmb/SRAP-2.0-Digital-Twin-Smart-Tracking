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
    Target,
    TrendingUp,
    Calendar,
    DollarSign,
    Building,
    Flag,
    CheckCircle,
    AlertTriangle,
    Clock
} from 'lucide-react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/Components/ui/Card';
import { Button } from '@/Components/ui/Button';
import { Badge } from '@/Components/ui/Badge';
import { Progress } from '@/Components/ui/Progress';

export default function SrapPillarIndex({ pillars, filters }) {
    const [searchTerm, setSearchTerm] = useState(filters?.search || '');
    const [selectedStatus, setSelectedStatus] = useState(filters?.status || '');

    const handleSearch = () => {
        router.get('/srap-pillars', {
            search: searchTerm,
            status: selectedStatus
        }, {
            preserveState: true,
            preserveScroll: true
        });
    };

    const handleDelete = (pillar) => {
        if (confirm(`Are you sure you want to delete "${pillar.name}"?`)) {
            router.delete(`/srap-pillars/${pillar.id}`);
        }
    };

    const getPriorityBadge = (priority) => {
        if (!priority) return null;
        
        const colors = {
            low: 'bg-gray-100 text-gray-800',
            medium: 'bg-yellow-100 text-yellow-800',
            high: 'bg-orange-100 text-orange-800',
            critical: 'bg-red-100 text-red-800'
        };
        
        return <Badge className={colors[priority]}>{priority.charAt(0).toUpperCase() + priority.slice(1)}</Badge>;
    };

    const getProgressColor = (progress) => {
        if (progress >= 90) return 'text-green-600';
        if (progress >= 75) return 'text-blue-600';
        if (progress >= 50) return 'text-yellow-600';
        return 'text-red-600';
    };

    const getProgressIcon = (progress) => {
        if (progress >= 90) return <CheckCircle className="w-5 h-5 text-green-500" />;
        if (progress >= 75) return <TrendingUp className="w-5 h-5 text-blue-500" />;
        if (progress >= 50) return <Clock className="w-5 h-5 text-yellow-500" />;
        return <AlertTriangle className="w-5 h-5 text-red-500" />;
    };

    return (
        <AuthenticatedLayout>
            <Head title="SRAP Pillar Management" />

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
                                SRAP Pillar Management
                            </h1>
                            <p className="mt-2 text-gray-600 dark:text-gray-400">
                                Manage and track progress across all SRAP 2.0 strategic pillars
                            </p>
                        </div>
                        <div className="mt-4 sm:mt-0">
                            <Link href="/srap-pillars/create">
                                <Button className="flex items-center gap-2">
                                    <Plus className="w-4 h-4" />
                                    Add New Pillar
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
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Search Pillars
                                    </label>
                                    <div className="relative">
                                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                                        <input
                                            type="text"
                                            placeholder="Search by name, code, or description..."
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        />
                                    </div>
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
                                        <option value="active">Active</option>
                                        <option value="inactive">Inactive</option>
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

                {/* Pillar Grid */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6"
                >
                    {pillars?.data?.map((pillar, index) => (
                        <motion.div
                            key={pillar.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.2 + index * 0.1 }}
                        >
                            <Card className="hover:shadow-lg transition-all duration-300 border-0 shadow-md h-full">
                                <CardHeader className="pb-3">
                                    <div className="flex items-start justify-between">
                                        <div className="flex items-center space-x-3">
                                            {getProgressIcon(pillar.overall_progress)}
                                            <div>
                                                <div className="flex items-center space-x-2 mb-1">
                                                    <Badge variant="outline" className="text-xs font-mono">
                                                        {pillar.code}
                                                    </Badge>
                                                    {getPriorityBadge(pillar.priority_level)}
                                                </div>
                                                <CardTitle className="text-lg font-semibold line-clamp-2">
                                                    {pillar.name}
                                                </CardTitle>
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
                                        <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-3">
                                            {pillar.description}
                                        </p>
                                        
                                        {/* Progress */}
                                        <div>
                                            <div className="flex items-center justify-between text-sm mb-2">
                                                <span className="text-gray-600 dark:text-gray-400">Overall Progress</span>
                                                <span className={`font-bold ${getProgressColor(pillar.overall_progress)}`}>
                                                    {pillar.overall_progress}%
                                                </span>
                                            </div>
                                            <Progress value={pillar.overall_progress} className="h-2" />
                                        </div>

                                        {/* KPI Stats */}
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="text-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                                                <div className="text-xl font-bold text-gray-900 dark:text-white">
                                                    {pillar.kpis_count}
                                                </div>
                                                <div className="text-xs text-gray-600 dark:text-gray-400">
                                                    Total KPIs
                                                </div>
                                            </div>
                                            <div className="text-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                                                <div className="text-xl font-bold text-gray-900 dark:text-white">
                                                    {pillar.active_kpis_count}
                                                </div>
                                                <div className="text-xs text-gray-600 dark:text-gray-400">
                                                    Active KPIs
                                                </div>
                                            </div>
                                        </div>

                                        {/* Additional Info */}
                                        <div className="space-y-2 text-sm">
                                            {pillar.responsible_department && (
                                                <div className="flex items-center space-x-2">
                                                    <Building className="w-4 h-4 text-gray-400" />
                                                    <span className="text-gray-600 dark:text-gray-400">
                                                        {pillar.responsible_department}
                                                    </span>
                                                </div>
                                            )}
                                            
                                            {pillar.budget_allocation && (
                                                <div className="flex items-center space-x-2">
                                                    <DollarSign className="w-4 h-4 text-gray-400" />
                                                    <span className="text-gray-600 dark:text-gray-400">
                                                        ₦{Number(pillar.budget_allocation).toLocaleString()}
                                                    </span>
                                                </div>
                                            )}

                                            {pillar.target_completion_date && (
                                                <div className="flex items-center space-x-2">
                                                    <Calendar className="w-4 h-4 text-gray-400" />
                                                    <span className="text-gray-600 dark:text-gray-400">
                                                        Target: {new Date(pillar.target_completion_date).toLocaleDateString()}
                                                    </span>
                                                </div>
                                            )}
                                        </div>

                                        {/* Status Badge */}
                                        <div className="flex items-center justify-between">
                                            <Badge className={pillar.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                                                {pillar.is_active ? 'Active' : 'Inactive'}
                                            </Badge>
                                        </div>

                                        {/* Actions */}
                                        <div className="flex items-center space-x-2 pt-2">
                                            <Link href={`/srap-pillars/${pillar.id}`}>
                                                <Button variant="outline" size="sm" className="flex-1">
                                                    <Eye className="w-4 h-4 mr-2" />
                                                    View
                                                </Button>
                                            </Link>
                                            <Link href={`/srap-pillars/${pillar.id}/edit`}>
                                                <Button variant="outline" size="sm" className="flex-1">
                                                    <Edit className="w-4 h-4 mr-2" />
                                                    Edit
                                                </Button>
                                            </Link>
                                            <Button 
                                                variant="outline" 
                                                size="sm" 
                                                onClick={() => handleDelete(pillar)}
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
                {(!pillars?.data || pillars.data.length === 0) && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="text-center py-12"
                    >
                        <Target className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                            No SRAP Pillars Found
                        </h3>
                        <p className="text-gray-600 dark:text-gray-400 mb-6">
                            Get started by creating your first strategic pillar to organize your KPIs.
                        </p>
                        <Link href="/srap-pillars/create">
                            <Button>
                                <Plus className="w-4 h-4 mr-2" />
                                Create Your First Pillar
                            </Button>
                        </Link>
                    </motion.div>
                )}

                {/* Pagination */}
                {pillars?.links && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.3 }}
                        className="mt-8 flex justify-center"
                    >
                        <div className="flex space-x-2">
                            {pillars.links.map((link, index) => (
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
