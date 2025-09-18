import { Head, Link, router } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import toast, { Toaster } from 'react-hot-toast';
import Modal from '@/Components/Modal';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/Components/ui/Card';
import { Badge } from '@/Components/ui/Badge';
import { Button } from '@/Components/ui/Button';
import { 
    Plus, 
    Search, 
    ThumbsUp,
    ThumbsDown,
    AlertTriangle,
    MessageCircle,
    MessageSquare,
    User,
    Clock,
    Eye,
    Trash2,
    Filter,
    BarChart3,
    Bot,
    Calendar
} from 'lucide-react';

export default function AdminChatbot({ conversations, filters, flash }) {
    const [searchTerm, setSearchTerm] = useState(filters?.search || '');
    const [selectedStatus, setSelectedStatus] = useState(filters?.status || '');
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [conversationToDelete, setConversationToDelete] = useState(null);

    // Handle flash messages
    useEffect(() => {
        if (flash?.success) {
            toast.success(flash.success);
        }
        if (flash?.error) {
            toast.error(flash.error);
        }
    }, [flash]);

    const handleSearch = () => {
        router.get('/admin/chatbot', {
            search: searchTerm,
            status: selectedStatus
        }, {
            preserveState: true,
            preserveScroll: true
        });
    };

    const handleDelete = (conversation) => {
        setConversationToDelete(conversation);
        setShowDeleteModal(true);
    };

    const confirmDelete = () => {
        if (conversationToDelete) {
            router.delete(`/admin/chatbot/${conversationToDelete.id}`, {
                onSuccess: () => {
                    toast.success('Conversation deleted successfully!');
                    setShowDeleteModal(false);
                    setConversationToDelete(null);
                },
                onError: () => {
                    toast.error('Failed to delete conversation. Please try again.');
                    setShowDeleteModal(false);
                    setConversationToDelete(null);
                }
            });
        }
    };

    const cancelDelete = () => {
        setShowDeleteModal(false);
        setConversationToDelete(null);
    };

    const getStatusBadge = (status) => {
        if (!status) return <Badge className="bg-gray-100 text-gray-800">Unknown</Badge>;
        
        const colors = {
            active: 'bg-green-100 text-green-800',
            completed: 'bg-blue-100 text-blue-800',
            archived: 'bg-gray-100 text-gray-800'
        };
        
        return <Badge className={colors[status] || 'bg-gray-100 text-gray-800'}>
            {status.charAt(0).toUpperCase() + status.slice(1)}
        </Badge>;
    };

    const getFeedbackIcon = (feedback) => {
        if (feedback === 'positive') return <ThumbsUp className="w-4 h-4 text-green-500" />;
        if (feedback === 'negative') return <ThumbsDown className="w-4 h-4 text-red-500" />;
        return null;
    };

    return (
        <AuthenticatedLayout>
            <Head title="Chatbot Management" />

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
                                Chatbot Management
                            </h1>
                            <p className="mt-2 text-gray-600 dark:text-gray-400">
                                Monitor and manage AI chatbot conversations and feedback
                            </p>
                        </div>
                        <div className="mt-4 sm:mt-0">
                            <Link href="/admin/chatbot/create">
                                <Button className="flex items-center gap-2">
                                    <Plus className="w-4 h-4" />
                                    New Conversation
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
                                        Search Conversations
                                    </label>
                                    <div className="relative">
                                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                                        <input
                                            type="text"
                                            placeholder="Search conversations..."
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
                                        <option value="completed">Completed</option>
                                        <option value="archived">Archived</option>
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

                {/* Conversations List */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="space-y-4"
                >
                    {conversations?.data?.map((conversation, index) => (
                        <motion.div
                            key={conversation.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.6, delay: 0.2 + index * 0.1 }}
                        >
                            <Card className="hover:shadow-lg transition-all duration-300">
                                <CardContent className="p-6">
                                    <div className="flex items-start justify-between">
                                        <div className="flex items-start space-x-4">
                                            <div className="flex-shrink-0">
                                                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                                                    <Bot className="w-5 h-5 text-blue-600" />
                                                </div>
                                            </div>
                                            <div className="flex-1">
                                                <div className="flex items-center space-x-3 mb-2">
                                                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                                        Conversation #{conversation.id}
                                                    </h3>
                                                    {getStatusBadge(conversation.status)}
                                                    {conversation.feedback && getFeedbackIcon(conversation.feedback)}
                                                </div>
                                                
                                                <div className="space-y-2">
                                                    <div className="flex items-center space-x-2">
                                                        <User className="w-4 h-4 text-gray-400" />
                                                        <span className="text-sm text-gray-600 dark:text-gray-400">
                                                            User: {conversation.user?.name || 'Anonymous'}
                                                        </span>
                                                    </div>
                                                    
                                                    <div className="flex items-center space-x-2">
                                                        <MessageSquare className="w-4 h-4 text-gray-400" />
                                                        <span className="text-sm text-gray-600 dark:text-gray-400">
                                                            {conversation.messages_count} messages
                                                        </span>
                                                    </div>
                                                    
                                                    <div className="flex items-center space-x-2">
                                                        <Calendar className="w-4 h-4 text-gray-400" />
                                                        <span className="text-sm text-gray-600 dark:text-gray-400">
                                                            Started: {new Date(conversation.created_at).toLocaleDateString()}
                                                        </span>
                                                    </div>
                                                </div>
                                                
                                                {conversation.last_message && (
                                                    <div className="mt-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                                                        <p className="text-sm text-gray-700 dark:text-gray-300 line-clamp-2">
                                                            Last message: {conversation.last_message}
                                                        </p>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                        
                                        <div className="flex items-center space-x-2">
                                            <Link href={`/admin/chatbot/${conversation.id}`}>
                                                <Button variant="outline" size="sm">
                                                    <Eye className="w-4 h-4 mr-2" />
                                                    View
                                                </Button>
                                            </Link>
                                            <Button 
                                                variant="outline" 
                                                size="sm" 
                                                onClick={() => handleDelete(conversation)}
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
                {(!conversations?.data || conversations.data.length === 0) && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="text-center py-12"
                    >
                        <Bot className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                            No Conversations Found
                        </h3>
                        <p className="text-gray-600 dark:text-gray-400 mb-6">
                            No chatbot conversations match your current filters.
                        </p>
                        <Link href="/admin/chatbot/create">
                            <Button>
                                <Plus className="w-4 h-4 mr-2" />
                                Start Conversation
                            </Button>
                        </Link>
                    </motion.div>
                )}

                {/* Pagination */}
                {conversations?.links && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.3 }}
                        className="mt-8 flex justify-center"
                    >
                        <div className="flex space-x-2">
                            {conversations.links.map((link, index) => (
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

            {/* Delete Confirmation Modal */}
            <Modal show={showDeleteModal} onClose={cancelDelete} maxWidth="md">
                <div className="p-6">
                    <div className="flex items-center mb-4">
                        <div className="flex-shrink-0">
                            <AlertTriangle className="w-6 h-6 text-red-600" />
                        </div>
                        <div className="ml-3">
                            <h3 className="text-lg font-medium text-gray-900">
                                Delete Conversation
                            </h3>
                        </div>
                    </div>
                    
                    <div className="mb-6">
                        <p className="text-sm text-gray-600">
                            Are you sure you want to delete this conversation? This action cannot be undone.
                        </p>
                        {conversationToDelete && (
                            <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                                <p className="text-sm font-medium text-gray-900">
                                    Session: {conversationToDelete.session_id}
                                </p>
                                <p className="text-sm text-gray-600 mt-1">
                                    {conversationToDelete.user_message?.substring(0, 100)}
                                    {conversationToDelete.user_message?.length > 100 ? '...' : ''}
                                </p>
                            </div>
                        )}
                    </div>
                    
                    <div className="flex justify-end space-x-3">
                        <Button
                            variant="outline"
                            onClick={cancelDelete}
                        >
                            Cancel
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={confirmDelete}
                            className="bg-red-600 hover:bg-red-700 text-white"
                        >
                            <Trash2 className="w-4 h-4 mr-2" />
                            Delete Conversation
                        </Button>
                    </div>
                </div>
            </Modal>

            {/* Toast Notifications */}
            <Toaster
                position="top-right"
                toastOptions={{
                    duration: 4000,
                    style: {
                        background: '#363636',
                        color: '#fff',
                    },
                    success: {
                        duration: 3000,
                        style: {
                            background: '#10b981',
                            color: '#fff',
                        },
                    },
                    error: {
                        duration: 5000,
                        style: {
                            background: '#ef4444',
                            color: '#fff',
                        },
                    },
                }}
            />
        </AuthenticatedLayout>
    );
}
