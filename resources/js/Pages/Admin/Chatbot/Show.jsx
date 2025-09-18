import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import Modal from '@/Components/Modal';
import { Card, CardContent, CardHeader, CardTitle } from '@/Components/ui/Card';
import { Badge } from '@/Components/ui/Badge';
import { Button } from '@/Components/ui/Button';
import { 
    MessageCircle, 
    User, 
    Bot, 
    Clock, 
    ArrowLeft,
    ThumbsUp,
    ThumbsDown,
    BarChart3,
    Brain,
    Trash2,
    AlertTriangle
} from 'lucide-react';

export default function Show({ conversation, sessionConversations }) {
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleString();
    };

    const handleDelete = () => {
        setShowDeleteModal(true);
    };

    const confirmDelete = () => {
        router.delete(`/admin/chatbot/${conversation.id}`, {
            onSuccess: () => {
                // Redirect to chatbot index after successful deletion
                router.visit('/admin/chatbot');
            }
        });
    };

    const cancelDelete = () => {
        setShowDeleteModal(false);
    };

    const getConfidenceBadge = (confidence) => {
        // Handle both decimal (0.8) and percentage (80) formats
        const percentage = confidence > 1 ? confidence : Math.round(confidence * 100);
        
        if (confidence >= 0.8 || (confidence > 1 && confidence >= 80)) {
            return <Badge className="bg-green-100 text-green-800">High ({percentage}%)</Badge>;
        } else if (confidence >= 0.6 || (confidence > 1 && confidence >= 60)) {
            return <Badge className="bg-yellow-100 text-yellow-800">Medium ({percentage}%)</Badge>;
        } else {
            return <Badge className="bg-red-100 text-red-800">Low ({percentage}%)</Badge>;
        }
    };

    const getResponseTypeBadge = (type) => {
        const colors = {
            informational: 'bg-blue-100 text-blue-800',
            analytical: 'bg-purple-100 text-purple-800',
            actionable: 'bg-green-100 text-green-800',
            clarification: 'bg-orange-100 text-orange-800'
        };
        
        return <Badge className={colors[type] || 'bg-gray-100 text-gray-800'}>
            {type?.charAt(0).toUpperCase() + type?.slice(1) || 'Unknown'}
        </Badge>;
    };

    return (
        <AuthenticatedLayout>
            <Head title="Chatbot Conversation Details" />

            <div className="px-4 sm:px-6 lg:px-8">
                <div className="sm:flex sm:items-center">
                    <div className="sm:flex-auto">
                        <div className="flex items-center gap-3 mb-4">
                            <Link 
                                href={route('admin.chatbot.index')}
                                className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700"
                            >
                                <ArrowLeft className="w-4 h-4 mr-1" />
                                Back to Conversations
                            </Link>
                        </div>
                        <h1 className="text-2xl font-semibold text-gray-900">Conversation Details</h1>
                        <p className="mt-2 text-sm text-gray-700">
                            Session ID: <span className="font-mono text-xs bg-gray-100 px-2 py-1 rounded">{conversation.session_id}</span>
                        </p>
                    </div>
                    <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
                        <Button
                            onClick={handleDelete}
                            variant="destructive"
                            className="bg-red-600 hover:bg-red-700 text-white"
                        >
                            <Trash2 className="w-4 h-4 mr-2" />
                            Delete Conversation
                        </Button>
                    </div>
                </div>

                <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Main Conversation */}
                    <div className="lg:col-span-2">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <MessageCircle className="w-5 h-5" />
                                    Conversation Thread
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {sessionConversations.map((conv, index) => (
                                    <div key={conv.id} className="space-y-3">
                                        {/* User Message */}
                                        <div className="flex gap-3">
                                            <div className="flex-shrink-0">
                                                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                                                    <User className="w-4 h-4 text-blue-600" />
                                                </div>
                                            </div>
                                            <div className="flex-1">
                                                <div className="bg-blue-50 rounded-lg p-3">
                                                    <p className="text-sm text-gray-900">{conv.user_message}</p>
                                                </div>
                                                <p className="text-xs text-gray-500 mt-1">
                                                    {conv.user?.name || 'User'} • {formatDate(conv.created_at)}
                                                </p>
                                            </div>
                                        </div>

                                        {/* Bot Response */}
                                        <div className="flex gap-3">
                                            <div className="flex-shrink-0">
                                                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                                                    <Bot className="w-4 h-4 text-green-600" />
                                                </div>
                                            </div>
                                            <div className="flex-1">
                                                <div className="bg-green-50 rounded-lg p-3">
                                                    <p className="text-sm text-gray-900">{conv.bot_response}</p>
                                                </div>
                                                <div className="flex items-center gap-2 mt-1">
                                                    <p className="text-xs text-gray-500">
                                                        SRAP AI Assistant • {formatDate(conv.created_at)}
                                                    </p>
                                                    {conv.confidence_score && getConfidenceBadge(conv.confidence_score)}
                                                </div>
                                            </div>
                                        </div>

                                        {index < sessionConversations.length - 1 && (
                                            <div className="border-t border-gray-100 my-4"></div>
                                        )}
                                    </div>
                                ))}
                            </CardContent>
                        </Card>
                    </div>

                    {/* Conversation Metadata */}
                    <div className="space-y-6">
                        {/* Conversation Info */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <BarChart3 className="w-5 h-5" />
                                    Conversation Info
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div>
                                    <label className="text-sm font-medium text-gray-700">Intent</label>
                                    <p className="text-sm text-gray-900 mt-1">
                                        {conversation.intent || 'Not detected'}
                                    </p>
                                </div>

                                <div>
                                    <label className="text-sm font-medium text-gray-700">Response Type</label>
                                    <div className="mt-1">
                                        {getResponseTypeBadge(conversation.response_type)}
                                    </div>
                                </div>

                                <div>
                                    <label className="text-sm font-medium text-gray-700">Confidence Score</label>
                                    <div className="mt-1">
                                        {conversation.confidence_score ? getConfidenceBadge(conversation.confidence_score) : 'N/A'}
                                    </div>
                                </div>

                                <div>
                                    <label className="text-sm font-medium text-gray-700">IP Address</label>
                                    <p className="text-sm text-gray-900 mt-1 font-mono">
                                        {conversation.ip_address || 'Not recorded'}
                                    </p>
                                </div>

                                <div>
                                    <label className="text-sm font-medium text-gray-700">Created</label>
                                    <p className="text-sm text-gray-900 mt-1 flex items-center gap-1">
                                        <Clock className="w-3 h-3" />
                                        {formatDate(conversation.created_at)}
                                    </p>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Entities & Context */}
                        {(conversation.entities || conversation.context) && (
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Brain className="w-5 h-5" />
                                        Analysis Data
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    {conversation.entities && (
                                        <div>
                                            <label className="text-sm font-medium text-gray-700">Entities</label>
                                            <div className="mt-1">
                                                <pre className="text-xs bg-gray-50 p-2 rounded border overflow-x-auto">
                                                    {JSON.stringify(conversation.entities, null, 2)}
                                                </pre>
                                            </div>
                                        </div>
                                    )}

                                    {conversation.context && (
                                        <div>
                                            <label className="text-sm font-medium text-gray-700">Context</label>
                                            <div className="mt-1">
                                                <pre className="text-xs bg-gray-50 p-2 rounded border overflow-x-auto">
                                                    {JSON.stringify(conversation.context, null, 2)}
                                                </pre>
                                            </div>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        )}

                        {/* Session Stats */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Session Statistics</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-2">
                                    <div className="flex justify-between">
                                        <span className="text-sm text-gray-600">Total Messages:</span>
                                        <span className="text-sm font-medium">{sessionConversations.length}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-sm text-gray-600">Session Duration:</span>
                                        <span className="text-sm font-medium">
                                            {sessionConversations.length > 1 ? 
                                                `${Math.round((new Date(sessionConversations[sessionConversations.length - 1].created_at) - new Date(sessionConversations[0].created_at)) / (1000 * 60))} min` : 
                                                'Single message'
                                            }
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-sm text-gray-600">Avg Confidence:</span>
                                        <span className="text-sm font-medium">
                                            {sessionConversations.filter(c => c.confidence_score).length > 0 ?
                                                `${Math.round(sessionConversations.reduce((acc, c) => acc + (c.confidence_score || 0), 0) / sessionConversations.filter(c => c.confidence_score).length * 100)}%` :
                                                'N/A'
                                            }
                                        </span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
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
                            Are you sure you want to delete this conversation? This action cannot be undone and will remove all messages in this session.
                        </p>
                        <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                            <p className="text-sm font-medium text-gray-900">
                                Session: {conversation.session_id}
                            </p>
                            <p className="text-sm text-gray-600 mt-1">
                                {sessionConversations.length} message{sessionConversations.length !== 1 ? 's' : ''} will be deleted
                            </p>
                        </div>
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
        </AuthenticatedLayout>
    );
}
