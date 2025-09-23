import React, { useState, useEffect } from 'react';
import { Head, useForm, usePage, router } from '@inertiajs/react';
import { motion } from 'framer-motion';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { useToast } from '@/Contexts/ToastContext';
import { 
    CheckCircle, 
    XCircle, 
    Clock, 
    User, 
    Calendar, 
    FileText,
    AlertTriangle,
    Target,
    Database,
    Eye
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/Components/ui/Card';
import { Button } from '@/Components/ui/Button';
import { Badge } from '@/Components/ui/Badge';
import { Textarea } from '@/Components/ui/Textarea';

export default function HODApprovals({ auth }) {
    const { showSuccess, showError } = useToast();
    const [pendingApprovals, setPendingApprovals] = useState([]);
    const [loading, setLoading] = useState(true);
    const [rejectionReason, setRejectionReason] = useState('');
    const [selectedEntry, setSelectedEntry] = useState(null);

    // Fetch pending approvals
    useEffect(() => {
        fetchPendingApprovals();
    }, []);

    const fetchPendingApprovals = async () => {
        try {
            const response = await fetch('/admin/progress-upload/pending-approvals', {
                headers: {
                    'X-Requested-With': 'XMLHttpRequest',
                }
            });
            const data = await response.json();
            setPendingApprovals(data.data || []);
        } catch (error) {
            showError('Failed to fetch pending approvals');
        } finally {
            setLoading(false);
        }
    };

    const handleApprove = async (progressId) => {
        try {
            const response = await fetch(`/admin/progress-upload/${progressId}/approve`, {
                method: 'POST',
                headers: {
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').content,
                    'Content-Type': 'application/json',
                }
            });
            
            const result = await response.json();
            
            if (response.ok) {
                showSuccess('Progress entry approved successfully');
                fetchPendingApprovals(); // Refresh the list
            } else {
                showError(result.error || 'Failed to approve entry');
            }
        } catch (error) {
            showError('Failed to approve entry');
        }
    };

    const handleReject = async (progressId) => {
        if (!rejectionReason.trim()) {
            showError('Please provide a rejection reason');
            return;
        }

        try {
            const response = await fetch(`/admin/progress-upload/${progressId}/reject`, {
                method: 'POST',
                headers: {
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').content,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    rejection_reason: rejectionReason
                })
            });
            
            const result = await response.json();
            
            if (response.ok) {
                showSuccess('Progress entry rejected');
                setSelectedEntry(null);
                setRejectionReason('');
                fetchPendingApprovals(); // Refresh the list
            } else {
                showError(result.error || 'Failed to reject entry');
            }
        } catch (error) {
            showError('Failed to reject entry');
        }
    };

    const getStatusBadge = (status) => {
        const variants = {
            pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
            verified: 'bg-green-100 text-green-800 border-green-200',
            rejected: 'bg-red-100 text-red-800 border-red-200'
        };
        
        return variants[status] || variants.pending;
    };

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="Pending Approvals - HOD Dashboard" />

            <div className="py-6">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="mb-8">
                        <div className="flex items-center justify-between">
                            <div>
                                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                                    Pending Approvals
                                </h1>
                                <p className="mt-2 text-gray-600 dark:text-gray-400">
                                    Review and approve KPI progress submissions from your department
                                </p>
                            </div>
                            <div className="flex items-center space-x-2">
                                <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
                                    <Clock className="w-4 h-4 mr-1" />
                                    {pendingApprovals.length} Pending
                                </Badge>
                            </div>
                        </div>
                    </div>

                    {/* Statistics Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                        <Card>
                            <CardContent className="p-6">
                                <div className="flex items-center">
                                    <div className="p-2 bg-yellow-100 rounded-lg">
                                        <Clock className="h-6 w-6 text-yellow-600" />
                                    </div>
                                    <div className="ml-4">
                                        <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Pending Approval</p>
                                        <p className="text-2xl font-bold text-gray-900 dark:text-white">{pendingApprovals.length}</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                        
                        <Card>
                            <CardContent className="p-6">
                                <div className="flex items-center">
                                    <div className="p-2 bg-green-100 rounded-lg">
                                        <CheckCircle className="h-6 w-6 text-green-600" />
                                    </div>
                                    <div className="ml-4">
                                        <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Approved Today</p>
                                        <p className="text-2xl font-bold text-gray-900 dark:text-white">0</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                        
                        <Card>
                            <CardContent className="p-6">
                                <div className="flex items-center">
                                    <div className="p-2 bg-blue-100 rounded-lg">
                                        <Target className="h-6 w-6 text-blue-600" />
                                    </div>
                                    <div className="ml-4">
                                        <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Department KPIs</p>
                                        <p className="text-2xl font-bold text-gray-900 dark:text-white">-</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Pending Approvals List */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center">
                                <AlertTriangle className="w-5 h-5 mr-2 text-yellow-600" />
                                Submissions Requiring Approval
                            </CardTitle>
                            <CardDescription>
                                Review KPI progress data submitted by Data Officers
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            {loading ? (
                                <div className="text-center py-8">
                                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                                    <p className="mt-2 text-gray-600 dark:text-gray-400">Loading pending approvals...</p>
                                </div>
                            ) : pendingApprovals.length === 0 ? (
                                <div className="text-center py-8">
                                    <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
                                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                                        No Pending Approvals
                                    </h3>
                                    <p className="text-gray-600 dark:text-gray-400">
                                        All submissions have been reviewed. Great work!
                                    </p>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {pendingApprovals.map((entry) => (
                                        <motion.div
                                            key={entry.id}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                                        >
                                            <div className="flex items-start justify-between">
                                                <div className="flex-1">
                                                    <div className="flex items-center space-x-3 mb-2">
                                                        <h4 className="text-lg font-medium text-gray-900 dark:text-white">
                                                            {entry.kpi?.name || 'KPI Progress Update'}
                                                        </h4>
                                                        <Badge className={getStatusBadge(entry.verification_status)}>
                                                            {entry.verification_status}
                                                        </Badge>
                                                    </div>
                                                    
                                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600 dark:text-gray-400">
                                                        <div className="flex items-center">
                                                            <User className="w-4 h-4 mr-1" />
                                                            {entry.reported_by?.name || 'Unknown'}
                                                        </div>
                                                        <div className="flex items-center">
                                                            <Calendar className="w-4 h-4 mr-1" />
                                                            {new Date(entry.reporting_date).toLocaleDateString()}
                                                        </div>
                                                        <div className="flex items-center">
                                                            <Target className="w-4 h-4 mr-1" />
                                                            Value: {entry.value}
                                                        </div>
                                                        <div className="flex items-center">
                                                            <Database className="w-4 h-4 mr-1" />
                                                            {entry.source}
                                                        </div>
                                                    </div>
                                                    
                                                    {entry.notes && (
                                                        <div className="mt-2 p-2 bg-gray-100 dark:bg-gray-700 rounded text-sm">
                                                            <strong>Notes:</strong> {entry.notes}
                                                        </div>
                                                    )}
                                                </div>
                                                
                                                <div className="flex space-x-2 ml-4">
                                                    <Button
                                                        onClick={() => handleApprove(entry.id)}
                                                        className="bg-green-600 hover:bg-green-700 text-white"
                                                        size="sm"
                                                    >
                                                        <CheckCircle className="w-4 h-4 mr-1" />
                                                        Approve
                                                    </Button>
                                                    <Button
                                                        onClick={() => setSelectedEntry(entry)}
                                                        variant="outline"
                                                        className="border-red-300 text-red-600 hover:bg-red-50"
                                                        size="sm"
                                                    >
                                                        <XCircle className="w-4 h-4 mr-1" />
                                                        Reject
                                                    </Button>
                                                </div>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Rejection Modal */}
                    {selectedEntry && (
                        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md mx-4">
                                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                                    Reject Submission
                                </h3>
                                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                                    Please provide a reason for rejecting this KPI progress submission:
                                </p>
                                <Textarea
                                    value={rejectionReason}
                                    onChange={(e) => setRejectionReason(e.target.value)}
                                    placeholder="Enter rejection reason..."
                                    className="mb-4"
                                    rows={3}
                                />
                                <div className="flex space-x-3">
                                    <Button
                                        onClick={() => handleReject(selectedEntry.id)}
                                        className="bg-red-600 hover:bg-red-700 text-white flex-1"
                                    >
                                        Reject
                                    </Button>
                                    <Button
                                        onClick={() => {
                                            setSelectedEntry(null);
                                            setRejectionReason('');
                                        }}
                                        variant="outline"
                                        className="flex-1"
                                    >
                                        Cancel
                                    </Button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
