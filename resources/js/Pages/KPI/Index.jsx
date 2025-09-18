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
    AlertTriangle,
    CheckCircle,
    Calendar,
    User,
    Building
} from 'lucide-react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/Components/ui/Card';
import { Button } from '@/Components/ui/Button';
import { Badge } from '@/Components/ui/Badge';
import { Progress } from '@/Components/ui/Progress';

export default function KPIIndex({ kpis, pillars, departments, filters }) {
    const [searchTerm, setSearchTerm] = useState(filters?.search || '');
    const [selectedPillar, setSelectedPillar] = useState(filters?.pillar || '');
    const [selectedStatus, setSelectedStatus] = useState(filters?.status || '');

    const handleSearch = () => {
        router.get('/kpis', {
            search: searchTerm,
            pillar: selectedPillar,
            status: selectedStatus
        }, {
            preserveState: true,
            preserveScroll: true
        });
    };

    const handleDelete = (kpi) => {
        if (confirm(`Are you sure you want to delete "${kpi.title}"?`)) {
            router.delete(`/kpis/${kpi.id}`);
        }
    };

    const getStatusBadge = (kpi) => {
        const progress = kpi.progress_percentage;
        if (progress >= 100) {
            return <Badge className="bg-green-100 text-green-800">Completed</Badge>;
        } else if (progress >= 75) {
            return <Badge className="bg-blue-100 text-blue-800">On Track</Badge>;
        } else if (progress >= 50) {
            return <Badge className="bg-yellow-100 text-yellow-800">In Progress</Badge>;
        } else {
            return <Badge className="bg-red-100 text-red-800">At Risk</Badge>;
        }
    };

    const getStatusIcon = (kpi) => {
        const progress = kpi.progress_percentage;
        if (progress >= 100) {
            return <CheckCircle className="w-5 h-5 text-green-500" />;
        } else if (progress >= 75) {
            return <TrendingUp className="w-5 h-5 text-blue-500" />;
        } else if (progress >= 50) {
            return <Target className="w-5 h-5 text-yellow-500" />;
        } else {
            return <AlertTriangle className="w-5 h-5 text-red-500" />;
        }
    };

    return (
        <AuthenticatedLayout>
            <Head title="KPI Management" />

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
                                KPI Management
                            </h1>
                            <p className="mt-2 text-gray-600 dark:text-gray-400">
                                Monitor and manage Key Performance Indicators for SRAP 2.0
                            </p>
                        </div>
                        <div className="mt-4 sm:mt-0">
                            <Link href="/kpis/create">
                                <Button className="flex items-center gap-2">
                                    <Plus className="w-4 h-4" />
                                    Add New KPI
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
                                        Search KPIs
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
                                        SRAP Pillar
                                    </label>
                                    <select
                                        value={selectedPillar}
                                        onChange={(e) => setSelectedPillar(e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    >
                                        <option value="">All Pillars</option>
                                        {pillars?.map(pillar => (
                                            <option key={pillar.id} value={pillar.id}>
                                                {pillar.name}
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
                                        <option value="on_track">On Track</option>
                                        <option value="in_progress">In Progress</option>
                                        <option value="at_risk">At Risk</option>
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

                {/* KPI Grid */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6"
                >
                    {kpis?.data?.map((kpi, index) => (
                        <motion.div
                            key={kpi.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.2 + index * 0.1 }}
                        >
                            <Card className="hover:shadow-lg transition-all duration-300 border-0 shadow-md">
                                <CardHeader className="pb-3">
                                    <div className="flex items-start justify-between">
                                        <div className="flex items-center space-x-3">
                                            {getStatusIcon(kpi)}
                                            <div>
                                                <CardTitle className="text-lg font-semibold line-clamp-2">
                                                    {kpi.title}
                                                </CardTitle>
                                                <div className="flex items-center space-x-2 mt-1">
                                                    {getStatusBadge(kpi)}
                                                    <Badge variant="outline" className="text-xs">
                                                        {kpi.pillar?.code}
                                                    </Badge>
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
                                            {kpi.description}
                                        </p>

                                        {/* Progress */}
                                        <div>
                                            <div className="flex items-center justify-between text-sm mb-2">
                                                <span className="text-gray-600 dark:text-gray-400">Progress</span>
                                                <span className="font-bold text-gray-900 dark:text-white">
                                                    {kpi.progress_percentage}%
                                                </span>
                                            </div>
                                            <Progress value={kpi.progress_percentage} className="h-2" />
                                        </div>

                                        {/* KPI Values */}
                                        <div className="grid grid-cols-2 gap-4 text-sm">
                                            <div>
                                                <span className="text-gray-600 dark:text-gray-400">Current</span>
                                                <p className="font-bold text-gray-900 dark:text-white">
                                                    {kpi.current_value} {kpi.unit}
                                                </p>
                                            </div>
                                            <div>
                                                <span className="text-gray-600 dark:text-gray-400">Target</span>
                                                <p className="font-bold text-gray-900 dark:text-white">
                                                    {kpi.target_value} {kpi.unit}
                                                </p>
                                            </div>
                                        </div>

                                        {/* Meta Info */}
                                        <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 pt-2 border-t">
                                            <div className="flex items-center">
                                                <Building className="w-3 h-3 mr-1" />
                                                {kpi.department?.name}
                                            </div>
                                            <div className="flex items-center">
                                                <Calendar className="w-3 h-3 mr-1" />
                                                Due: {new Date(kpi.target_date).toLocaleDateString()}
                                            </div>
                                        </div>

                                        {/* Actions */}
                                        <div className="flex items-center space-x-2 pt-2">
                                            <Link href={`/kpis/${kpi.id}`}>
                                                <Button variant="outline" size="sm" className="flex-1">
                                                    <Eye className="w-4 h-4 mr-2" />
                                                    View
                                                </Button>
                                            </Link>
                                            <Link href={`/kpis/${kpi.id}/edit`}>
                                                <Button variant="outline" size="sm" className="flex-1">
                                                    <Edit className="w-4 h-4 mr-2" />
                                                    Edit
                                                </Button>
                                            </Link>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => handleDelete(kpi)}
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
                {(!kpis?.data || kpis.data.length === 0) && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="text-center py-12"
                    >
                        <Target className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                            No KPIs Found
                        </h3>
                        <p className="text-gray-600 dark:text-gray-400 mb-6">
                            Get started by creating your first KPI to track performance.
                        </p>
                        <Link href="/kpis/create">
                            <Button>
                                <Plus className="w-4 h-4 mr-2" />
                                Create Your First KPI
                            </Button>
                        </Link>
                    </motion.div>
                )}

                {/* Pagination */}
                {kpis?.links && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.3 }}
                        className="mt-8 flex justify-center"
                    >
                        <div className="flex space-x-2">
                            {/* {kpis.links.map((link, index) => (
                                <Link
                                    key={index}
                                    href={link.url}
                                    className={`px-3 py-2 text-sm rounded-lg ${
                                        link.active
                                            ? 'bg-blue-600 text-white'
                                            : 'bg-white text-gray-700 hover:bg-gray-50 border'
                                    }`}
                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                />
                            ))} */}
                            {kpis.links.map((link, index) => (
                                link.url ? (
                                    <Link
                                        key={index}
                                        href={link.url}
                                        className={`px-3 py-2 text-sm rounded-lg ${link.active
                                                ? 'bg-blue-600 text-white'
                                                : 'bg-white text-gray-700 hover:bg-gray-50 border'
                                            }`}
                                        dangerouslySetInnerHTML={{ __html: link.label }}
                                    />
                                ) : (
                                    <span
                                        key={index}
                                        className="px-3 py-2 text-sm rounded-lg text-gray-400 bg-gray-100 cursor-not-allowed"
                                        dangerouslySetInnerHTML={{ __html: link.label }}
                                    />
                                )
                            ))}

                        </div>
                    </motion.div>
                )}
            </div>
        </AuthenticatedLayout>
    );
}
