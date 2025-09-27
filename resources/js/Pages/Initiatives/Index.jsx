import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Search, Filter, Target, Calendar, Building2 } from 'lucide-react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/Components/ui/Card';
import { Button } from '@/Components/ui/Button';
import { Input } from '@/Components/ui/Input';
import { Badge } from '@/Components/ui/Badge';

export default function InitiativeIndex({ initiatives, pillars, departments, filters = {} }) {
    const [searchTerm, setSearchTerm] = useState(filters.search || '');
    const [selectedPillar, setSelectedPillar] = useState(filters.pillar || '');
    const [selectedDepartment, setSelectedDepartment] = useState(filters.department || '');

    const handleSearch = () => {
        router.get(route('initiatives.index'), {
            search: searchTerm,
            pillar: selectedPillar,
            department: selectedDepartment
        }, { preserveState: true });
    };

    const resetFilters = () => {
        setSearchTerm('');
        setSelectedPillar('');
        setSelectedDepartment('');
        router.get(route('initiatives.index'));
    };

    const getStatusColor = (status) => {
        const colors = {
            'on_track': 'bg-green-100 text-green-800',
            'in_progress': 'bg-blue-100 text-blue-800',
            'at_risk': 'bg-yellow-100 text-yellow-800',
            'delayed': 'bg-red-100 text-red-800',
            'completed': 'bg-gray-100 text-gray-800'
        };
        return colors[status] || 'bg-gray-100 text-gray-800';
    };

    const getPriorityColor = (priority) => {
        const colors = {
            1: 'bg-red-100 text-red-800',
            2: 'bg-yellow-100 text-yellow-800',
            3: 'bg-green-100 text-green-800'
        };
        return colors[priority] || 'bg-gray-100 text-gray-800';
    };

    return (
        <AuthenticatedLayout>
            <Head title="Strategic Initiatives" />

            <div className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
                {/* Header */}
                <motion.div 
                    initial={{ opacity: 0, y: -20 }} 
                    animate={{ opacity: 1, y: 0 }} 
                    className="mb-8"
                >
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                            <Target className="w-8 h-8 text-blue-600" />
                            <div>
                                <h1 className="text-3xl font-bold text-gray-900">Strategic Initiatives</h1>
                                <p className="text-gray-600">Manage and track NITDA's strategic initiatives</p>
                            </div>
                        </div>
                        <Link href={route('initiatives.create')}>
                            <Button className="flex items-center space-x-2">
                                <Plus className="w-4 h-4" />
                                <span>New Initiative</span>
                            </Button>
                        </Link>
                    </div>
                </motion.div>

                {/* Filters */}
                <motion.div 
                    initial={{ opacity: 0, y: 20 }} 
                    animate={{ opacity: 1, y: 0 }} 
                    transition={{ delay: 0.1 }}
                    className="mb-6"
                >
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center space-x-2">
                                <Filter className="w-5 h-5" />
                                <span>Filters</span>
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-700">Search</label>
                                    <div className="relative">
                                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                                        <Input
                                            type="text"
                                            placeholder="Search initiatives..."
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                            className="pl-10"
                                            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-700">Pillar</label>
                                    <select
                                        value={selectedPillar}
                                        onChange={(e) => setSelectedPillar(e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    >
                                        <option value="">All Pillars</option>
                                        {pillars.map((pillar) => (
                                            <option key={pillar.id} value={pillar.id}>
                                                {pillar.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-700">Department</label>
                                    <select
                                        value={selectedDepartment}
                                        onChange={(e) => setSelectedDepartment(e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    >
                                        <option value="">All Departments</option>
                                        {departments.map((department) => (
                                            <option key={department.id} value={department.id}>
                                                {department.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div className="flex items-end space-x-2">
                                    <Button onClick={handleSearch} className="flex-1">
                                        Apply Filters
                                    </Button>
                                    <Button onClick={resetFilters} variant="outline">
                                        Reset
                                    </Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>

                {/* Initiatives Grid */}
                <motion.div 
                    initial={{ opacity: 0 }} 
                    animate={{ opacity: 1 }} 
                    transition={{ delay: 0.2 }}
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                >
                    {initiatives.data.map((initiative, index) => (
                        <motion.div
                            key={initiative.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 * index }}
                        >
                            <Card className="h-full hover:shadow-lg transition-shadow duration-200">
                                <CardHeader>
                                    <div className="flex items-start justify-between">
                                        <div className="flex-1">
                                            <CardTitle className="text-lg line-clamp-2">
                                                {initiative.name}
                                            </CardTitle>
                                            <p className="text-sm text-gray-600 mt-1">
                                                {initiative.code}
                                            </p>
                                        </div>
                                        <Badge className={getStatusColor(initiative.status)}>
                                            {initiative.status.replace('_', ' ')}
                                        </Badge>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-gray-700 text-sm line-clamp-3 mb-4">
                                        {initiative.description}
                                    </p>

                                    <div className="space-y-3">
                                        <div className="flex items-center space-x-2 text-sm text-gray-600">
                                            <Target className="w-4 h-4" />
                                            <span>{initiative.pillar?.name}</span>
                                        </div>

                                        <div className="flex items-center space-x-2 text-sm text-gray-600">
                                            <Building2 className="w-4 h-4" />
                                            <span>{initiative.department?.name}</span>
                                        </div>

                                        <div className="flex items-center space-x-2 text-sm text-gray-600">
                                            <Calendar className="w-4 h-4" />
                                            <span>
                                                {new Date(initiative.start_date).toLocaleDateString()} - 
                                                {new Date(initiative.end_date).toLocaleDateString()}
                                            </span>
                                        </div>

                                        <div className="flex items-center justify-between">
                                            <Badge className={getPriorityColor(initiative.priority)}>
                                                Priority {initiative.priority}
                                            </Badge>
                                            <span className="text-sm font-medium text-gray-900">
                                                ₦{(initiative.budget / 1000000).toFixed(1)}M
                                            </span>
                                        </div>
                                    </div>

                                    <div className="mt-4 pt-4 border-t">
                                        <Link href={route('initiatives.show', initiative.id)}>
                                            <Button variant="outline" className="w-full">
                                                View Details
                                            </Button>
                                        </Link>
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>
                    ))}
                </motion.div>

                {/* Pagination */}
                {initiatives.links && (
                    <div className="mt-8 flex justify-center">
                        <div className="flex space-x-2">
                            {initiatives.links.map((link, index) => (
                                <Link
                                    key={index}
                                    href={link.url}
                                    className={`px-3 py-2 rounded-md text-sm ${
                                        link.active
                                            ? 'bg-blue-600 text-white'
                                            : 'bg-white text-gray-700 hover:bg-gray-50 border'
                                    }`}
                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                />
                            ))}
                        </div>
                    </div>
                )}

                {/* Empty State */}
                {initiatives.data.length === 0 && (
                    <motion.div 
                        initial={{ opacity: 0 }} 
                        animate={{ opacity: 1 }} 
                        className="text-center py-12"
                    >
                        <Target className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">No initiatives found</h3>
                        <p className="text-gray-600 mb-4">
                            {filters.search || filters.pillar || filters.department
                                ? 'Try adjusting your filters to see more results.'
                                : 'Get started by creating your first strategic initiative.'}
                        </p>
                        <Link href={route('initiatives.create')}>
                            <Button>
                                <Plus className="w-4 h-4 mr-2" />
                                Create Initiative
                            </Button>
                        </Link>
                    </motion.div>
                )}
            </div>
        </AuthenticatedLayout>
    );
}
