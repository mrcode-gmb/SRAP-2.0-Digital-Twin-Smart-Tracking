import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
    Plus, 
    Search, 
    Filter, 
    Bell,
    AlertTriangle,
    CheckCircle,
    Clock,
    Eye,
    Trash2,
    MoreHorizontal
} from 'lucide-react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/Components/ui/Card';
import { Button } from '@/Components/ui/Button';
import { Badge } from '@/Components/ui/Badge';

export default function AdminAlerts({ alerts, filters }) {
    const [searchTerm, setSearchTerm] = useState(filters?.search || '');
    const [selectedType, setSelectedType] = useState(filters?.type || '');
    const [selectedStatus, setSelectedStatus] = useState(filters?.status || '');

    const handleSearch = () => {
        router.get('/admin/alerts', {
            search: searchTerm,
            type: selectedType,
            status: selectedStatus
        }, {
            preserveState: true,
            preserveScroll: true
        });
    };

    const handleAcknowledge = (alert) => {
        router.post(`/admin/alerts/${alert.id}/acknowledge`);
    };

    const handleDelete = (alert) => {
        if (confirm(`Are you sure you want to delete this alert?`)) {
            router.delete(`/admin/alerts/${alert.id}`);
        }
    };

    const getAlertIcon = (type) => {
        switch (type) {
            case 'critical':
                return <AlertTriangle className="w-5 h-5 text-red-500" />;
            case 'warning':
                return <Clock className="w-5 h-5 text-yellow-500" />;
            case 'info':
                return <Bell className="w-5 h-5 text-blue-500" />;
            default:
                return <Bell className="w-5 h-5 text-gray-500" />;
        }
    };

    const getAlertBadge = (type) => {
        const colors = {
            critical: 'bg-red-100 text-red-800',
            warning: 'bg-yellow-100 text-yellow-800',
            info: 'bg-blue-100 text-blue-800'
        };
        
        return <Badge className={colors[type] || 'bg-gray-100 text-gray-800'}>
            {type.charAt(0).toUpperCase() + type.slice(1)}
        </Badge>;
    };

    const getStatusBadge = (isAcknowledged) => {
        return isAcknowledged 
            ? <Badge className="bg-green-100 text-green-800">Acknowledged</Badge>
            : <Badge className="bg-orange-100 text-orange-800">Pending</Badge>;
    };

    return (
        <AuthenticatedLayout>
            <Head title="Alert Management" />

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
                                Alert Management
                            </h1>
                            <p className="mt-2 text-gray-600 dark:text-gray-400">
                                Monitor and manage system alerts and notifications
                            </p>
                        </div>
                        <div className="mt-4 sm:mt-0">
                            <Link href="/admin/alerts/create">
                                <Button className="flex items-center gap-2">
                                    <Plus className="w-4 h-4" />
                                    Create Alert
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
                                        Search Alerts
                                    </label>
                                    <div className="relative">
                                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                                        <input
                                            type="text"
                                            placeholder="Search alerts..."
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
                                        <option value="critical">Critical</option>
                                        <option value="warning">Warning</option>
                                        <option value="info">Info</option>
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
                                        <option value="pending">Pending</option>
                                        <option value="acknowledged">Acknowledged</option>
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

                {/* Alerts List */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="space-y-4"
                >
                    {alerts?.data?.map((alert, index) => (
                        <motion.div
                            key={alert.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.6, delay: 0.2 + index * 0.1 }}
                        >
                            <Card className="hover:shadow-lg transition-all duration-300">
                                <CardContent className="p-6">
                                    <div className="flex items-start justify-between">
                                        <div className="flex items-start space-x-4">
                                            {getAlertIcon(alert.type)}
                                            <div className="flex-1">
                                                <div className="flex items-center space-x-3 mb-2">
                                                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                                        {alert.title}
                                                    </h3>
                                                    {getAlertBadge(alert.type)}
                                                    {getStatusBadge(alert.is_acknowledged)}
                                                </div>
                                                <p className="text-gray-600 dark:text-gray-400 mb-3">
                                                    {alert.message}
                                                </p>
                                                <div className="flex items-center space-x-4 text-sm text-gray-500">
                                                    <span>Created: {new Date(alert.created_at).toLocaleDateString()}</span>
                                                    {alert.kpi && (
                                                        <span>Kpis: {alert.kpi.title}</span>
                                                    )}
                                                    {alert.milestone && (
                                                        <span>Milestone: {alert.milestone.title}</span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            {!alert.is_acknowledged && (
                                                <Button 
                                                    variant="outline" 
                                                    size="sm"
                                                    onClick={() => handleAcknowledge(alert)}
                                                >
                                                    <CheckCircle className="w-4 h-4 mr-2" />
                                                    Acknowledge
                                                </Button>
                                            )}
                                            <Link href={`/admin/alerts/${alert.id}`}>
                                                <Button variant="outline" size="sm">
                                                    <Eye className="w-4 h-4 mr-2" />
                                                    View
                                                </Button>
                                            </Link>
                                            <Button 
                                                variant="outline" 
                                                size="sm" 
                                                onClick={() => handleDelete(alert)}
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
                {(!alerts?.data || alerts.data.length === 0) && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="text-center py-12"
                    >
                        <Bell className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                            No Alerts Found
                        </h3>
                        <p className="text-gray-600 dark:text-gray-400 mb-6">
                            No alerts match your current filters.
                        </p>
                        <Link href="/admin/alerts/create">
                            <Button>
                                <Plus className="w-4 h-4 mr-2" />
                                Create Alert
                            </Button>
                        </Link>
                    </motion.div>
                )}

                {/* Pagination */}
                {alerts?.links && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.3 }}
                        className="mt-8 flex justify-center"
                    >
                        <div className="flex space-x-2">
                            {alerts.links.map((link, index) => (
                                <Link
                                    key={index}
                                    href={link.url ?? ''}
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
