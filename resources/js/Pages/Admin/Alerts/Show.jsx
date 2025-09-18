import React from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/Components/ui/Card';
import { Badge } from '@/Components/ui/Badge';
import { Button } from '@/Components/ui/Button';
import { 
    ArrowLeft,
    AlertTriangle,
    CheckCircle,
    Info,
    XCircle,
    Clock,
    User,
    Calendar,
    Eye,
    EyeOff,
    Bell,
    BellOff
} from 'lucide-react';

export default function Show({ alert }) {
    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleString();
    };

    const getPriorityBadge = (priority) => {
        if (!priority || typeof priority !== 'string') {
            return <Badge className="bg-gray-100 text-gray-800">Unknown</Badge>;
        }
        
        const colors = {
            critical: 'bg-red-100 text-red-800',
            high: 'bg-orange-100 text-orange-800',
            medium: 'bg-yellow-100 text-yellow-800',
            low: 'bg-blue-100 text-blue-800'
        };
        
        return <Badge className={colors[priority] || 'bg-gray-100 text-gray-800'}>
            {priority.charAt(0).toUpperCase() + priority.slice(1)}
        </Badge>;
    };

    const getTypeBadge = (type) => {
        if (!type || typeof type !== 'string') {
            return <Badge className="bg-gray-100 text-gray-800">Unknown</Badge>;
        }
        
        const colors = {
            error: 'bg-red-100 text-red-800',
            warning: 'bg-yellow-100 text-yellow-800',
            success: 'bg-green-100 text-green-800',
            info: 'bg-blue-100 text-blue-800'
        };
        
        return <Badge className={colors[type] || 'bg-gray-100 text-gray-800'}>
            {type.charAt(0).toUpperCase() + type.slice(1)}
        </Badge>;
    };

    const getTypeIcon = (type) => {
        switch (type) {
            case 'error':
                return <XCircle className="w-6 h-6 text-red-600" />;
            case 'warning':
                return <AlertTriangle className="w-6 h-6 text-yellow-600" />;
            case 'success':
                return <CheckCircle className="w-6 h-6 text-green-600" />;
            case 'info':
                return <Info className="w-6 h-6 text-blue-600" />;
            default:
                return <Bell className="w-6 h-6 text-gray-600" />;
        }
    };

    const handleAcknowledge = () => {
        router.post(`/admin/alerts/${alert.id}/acknowledge`, {}, {
            onSuccess: () => {
                // Refresh the page to show updated status
                router.reload();
            }
        });
    };

    const handleMarkAsRead = () => {
        router.post('/admin/alerts/mark-read', {
            alert_ids: [alert.id]
        }, {
            onSuccess: () => {
                router.reload();
            }
        });
    };

    return (
        <AuthenticatedLayout>
            <Head title="Alert Details" />

            <div className="px-4 sm:px-6 lg:px-8">
                <div className="sm:flex sm:items-center">
                    <div className="sm:flex-auto">
                        <div className="flex items-center gap-3 mb-4">
                            <Link 
                                href={route('admin.alerts.index')}
                                className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700"
                            >
                                <ArrowLeft className="w-4 h-4 mr-1" />
                                Back to Alerts
                            </Link>
                        </div>
                        <h1 className="text-2xl font-semibold text-gray-900">Alert Details</h1>
                        <p className="mt-2 text-sm text-gray-700">
                            View and manage alert information
                        </p>
                    </div>
                    <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none space-x-3">
                        {!alert.is_read && (
                            <Button
                                onClick={handleMarkAsRead}
                                variant="outline"
                            >
                                <Eye className="w-4 h-4 mr-2" />
                                Mark as Read
                            </Button>
                        )}
                        {!alert.acknowledged_at && (
                            <Button
                                onClick={handleAcknowledge}
                                className="bg-blue-600 hover:bg-blue-700 text-white"
                            >
                                <CheckCircle className="w-4 h-4 mr-2" />
                                Acknowledge
                            </Button>
                        )}
                    </div>
                </div>

                <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Main Alert Content */}
                    <div className="lg:col-span-2">
                        <Card>
                            <CardHeader>
                                <div className="flex items-start gap-3">
                                    <div className="flex-shrink-0">
                                        {getTypeIcon(alert.type)}
                                    </div>
                                    <div className="flex-1">
                                        <CardTitle className="text-xl">{alert.title}</CardTitle>
                                        <div className="flex items-center gap-2 mt-2">
                                            {getTypeBadge(alert.type)}
                                            {getPriorityBadge(alert.priority)}
                                            {alert.is_read ? (
                                                <Badge className="bg-green-100 text-green-800">
                                                    <Eye className="w-3 h-3 mr-1" />
                                                    Read
                                                </Badge>
                                            ) : (
                                                <Badge className="bg-gray-100 text-gray-800">
                                                    <EyeOff className="w-3 h-3 mr-1" />
                                                    Unread
                                                </Badge>
                                            )}
                                            {alert.acknowledged_at && (
                                                <Badge className="bg-blue-100 text-blue-800">
                                                    <CheckCircle className="w-3 h-3 mr-1" />
                                                    Acknowledged
                                                </Badge>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="prose max-w-none">
                                    <p className="text-gray-700 whitespace-pre-wrap">
                                        {alert.message}
                                    </p>
                                </div>

                                {/* Metadata */}
                                {alert.metadata && Object.keys(alert.metadata).length > 0 && (
                                    <div className="mt-6">
                                        <h4 className="text-sm font-medium text-gray-900 mb-3">Additional Information</h4>
                                        <div className="bg-gray-50 rounded-lg p-4">
                                            <pre className="text-sm text-gray-600 overflow-x-auto">
                                                {JSON.stringify(alert.metadata, null, 2)}
                                            </pre>
                                        </div>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>

                    {/* Alert Metadata */}
                    <div className="space-y-6">
                        {/* Alert Information */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Info className="w-5 h-5" />
                                    Alert Information
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div>
                                    <label className="text-sm font-medium text-gray-700">Priority</label>
                                    <div className="mt-1">
                                        {getPriorityBadge(alert.priority)}
                                    </div>
                                </div>

                                <div>
                                    <label className="text-sm font-medium text-gray-700">Type</label>
                                    <div className="mt-1">
                                        {getTypeBadge(alert.type)}
                                    </div>
                                </div>

                                <div>
                                    <label className="text-sm font-medium text-gray-700">Triggered At</label>
                                    <p className="text-sm text-gray-900 mt-1 flex items-center gap-1">
                                        <Clock className="w-3 h-3" />
                                        {formatDate(alert.triggered_at)}
                                    </p>
                                </div>

                                <div>
                                    <label className="text-sm font-medium text-gray-700">Email Sent</label>
                                    <p className="text-sm text-gray-900 mt-1">
                                        {alert.email_sent ? (
                                            <Badge className="bg-green-100 text-green-800">Yes</Badge>
                                        ) : (
                                            <Badge className="bg-gray-100 text-gray-800">No</Badge>
                                        )}
                                    </p>
                                </div>

                                <div>
                                    <label className="text-sm font-medium text-gray-700">Created</label>
                                    <p className="text-sm text-gray-900 mt-1 flex items-center gap-1">
                                        <Calendar className="w-3 h-3" />
                                        {formatDate(alert.created_at)}
                                    </p>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Recipients */}
                        {alert.recipients && alert.recipients.length > 0 && (
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <User className="w-5 h-5" />
                                        Recipients
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-2">
                                        {alert.recipients.map((recipient, index) => (
                                            <div key={index} className="text-sm text-gray-700">
                                                {recipient}
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        )}

                        {/* Acknowledgment Info */}
                        {alert.acknowledged_at && (
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <CheckCircle className="w-5 h-5" />
                                        Acknowledgment
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div>
                                        <label className="text-sm font-medium text-gray-700">Acknowledged By</label>
                                        <p className="text-sm text-gray-900 mt-1">
                                            {alert.acknowledged_by?.name || 'Unknown User'}
                                        </p>
                                    </div>

                                    <div>
                                        <label className="text-sm font-medium text-gray-700">Acknowledged At</label>
                                        <p className="text-sm text-gray-900 mt-1 flex items-center gap-1">
                                            <Clock className="w-3 h-3" />
                                            {formatDate(alert.acknowledged_at)}
                                        </p>
                                    </div>
                                </CardContent>
                            </Card>
                        )}

                        {/* Related Object */}
                        {alert.alertable_type && (
                            <Card>
                                <CardHeader>
                                    <CardTitle>Related Object</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-2">
                                        <div>
                                            <label className="text-sm font-medium text-gray-700">Type</label>
                                            <p className="text-sm text-gray-900 mt-1">
                                                {alert.alertable_type.split('\\').pop()}
                                            </p>
                                        </div>
                                        <div>
                                            <label className="text-sm font-medium text-gray-700">ID</label>
                                            <p className="text-sm text-gray-900 mt-1 font-mono">
                                                {alert.alertable_id}
                                            </p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        )}
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
