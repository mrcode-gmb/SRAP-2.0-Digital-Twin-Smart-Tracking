import React, { useState } from 'react';
import { Head, Link, router, usePage } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/Components/ui/Card';
import { Button } from '@/Components/ui/Button';
import { Badge } from '@/Components/ui/Badge';
import { 
    ArrowLeft, 
    MessageSquare, 
    Send, 
    Bot,
    User,
    Sparkles,
    Clock,
    CheckCircle
} from 'lucide-react';

export default function Create({ auth, userConversations }) {
    const { props } = usePage();
    const [message, setMessage] = useState('');
    const [conversation, setConversation] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [sessionId, setSessionId] = useState(null);
    const [selectedSession, setSelectedSession] = useState(null);

    const handleSendMessage = async (e) => {
        e.preventDefault();
        
        if (!message.trim() || isLoading) return;

        const userMessage = message.trim();
        setMessage('');
        setIsLoading(true);

        // Add user message to conversation
        const newUserMessage = {
            id: Date.now(),
            message: userMessage,
            type: 'user',
            timestamp: new Date()
        };
        setConversation(prev => [...prev, newUserMessage]);

        // Get CSRF token from meta tag or page props
        const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || 
                         props.csrf_token || 
                         window.Laravel?.csrfToken;
        
        console.log('CSRF Token:', csrfToken ? 'Found' : 'Not found');
        console.log('Route:', route('admin.chatbot.message'));
        
        if (!csrfToken) {
            console.error('CSRF token not found');
            throw new Error('CSRF token not found');
        }
        
        try {
            const response = await fetch(route('admin.chatbot.message'), {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': csrfToken,
                    'Accept': 'application/json',
                    'X-Requested-With': 'XMLHttpRequest'
                },
                body: JSON.stringify({
                    message: userMessage,
                    session_id: sessionId
                }),
                credentials: 'same-origin'
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            
            if (!sessionId && data.session_id) {
                setSessionId(data.session_id);
            }

            // Add bot response to conversation
        const botMessage = {
                id: Date.now() + 1,
                message: data.message,
                type: 'bot',
                timestamp: new Date(),
                intent: data.intent,
                confidence: data.confidence,
                suggestions: data.suggestions || []
            };
            setConversation(prev => [...prev, botMessage]);

        } catch (error) {
            console.error('Error sending message:', error);
            const errorMessage = {
                id: Date.now() + 1,
                message: 'Sorry, I encountered an error. Please try again.',
                type: 'bot',
                timestamp: new Date(),
                error: true
            };
            setConversation(prev => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSuggestionClick = (suggestion) => {
        setMessage(suggestion);
    };

    const formatTime = (timestamp) => {
        return new Date(timestamp).toLocaleTimeString([], { 
            hour: '2-digit', 
            minute: '2-digit' 
        });
    };

    const loadConversationHistory = async (sessionIdToLoad) => {
        try {
            const response = await fetch(route('admin.chatbot.history', sessionIdToLoad));
            if (response.ok) {
                const history = await response.json();
                const formattedHistory = history.map(conv => ([
                    {
                        id: `user-${conv.id}`,
                        message: conv.user_message,
                        type: 'user',
                        timestamp: new Date(conv.created_at)
                    },
                    {
                        id: `bot-${conv.id}`,
                        message: conv.bot_response,
                        type: 'bot',
                        timestamp: new Date(conv.created_at),
                        intent: conv.intent,
                        confidence: conv.confidence_score
                    }
                ])).flat();
                
                setConversation(formattedHistory);
                setSessionId(sessionIdToLoad);
                setSelectedSession(sessionIdToLoad);
            }
        } catch (error) {
            console.error('Error loading conversation history:', error);
        }
    };

    const startNewConversation = () => {
        setConversation([]);
        setSessionId(null);
        setSelectedSession(null);
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                        <Link
                            href={route('admin.chatbot.index')}
                            className="flex items-center text-gray-600 hover:text-gray-900"
                        >
                            <ArrowLeft className="h-4 w-4 mr-2" />
                            Back to Conversations
                        </Link>
                        <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                            New Chatbot Conversation
                        </h2>
                    </div>
                </div>
            }
        >
            <Head title="New Chatbot Conversation" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                        {/* Conversation History Sidebar */}
                        <div className="lg:col-span-1">
                            <Card className="h-[600px] flex flex-col">
                                <CardHeader>
                                    <CardTitle className="text-lg">Your Conversations</CardTitle>
                                    <Button 
                                        onClick={startNewConversation}
                                        className="w-full mt-2"
                                        variant={!selectedSession ? "default" : "outline"}
                                    >
                                        <MessageSquare className="w-4 h-4 mr-2" />
                                        New Chat
                                    </Button>
                                </CardHeader>
                                <CardContent className="flex-1 overflow-y-auto p-4">
                                    <div className="space-y-2">
                                        {userConversations?.map((conv) => (
                                            <button
                                                key={conv.session_id}
                                                onClick={() => loadConversationHistory(conv.session_id)}
                                                className={`w-full text-left p-3 rounded-lg border transition-colors ${
                                                    selectedSession === conv.session_id 
                                                        ? 'bg-blue-50 border-blue-200' 
                                                        : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
                                                }`}
                                            >
                                                <div className="text-sm font-medium text-gray-900 truncate">
                                                    {conv.last_message?.substring(0, 30)}...
                                                </div>
                                                <div className="text-xs text-gray-500 mt-1">
                                                    {conv.message_count} messages • {new Date(conv.created_at).toLocaleDateString()}
                                                </div>
                                            </button>
                                        ))}
                                        {(!userConversations || userConversations.length === 0) && (
                                            <div className="text-center py-8 text-gray-500">
                                                <MessageSquare className="w-8 h-8 mx-auto mb-2 opacity-50" />
                                                <p className="text-sm">No conversations yet</p>
                                            </div>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Chat Interface */}
                        <div className="lg:col-span-3">
                            <Card className="h-[600px] flex flex-col">
                        <CardHeader>
                            <div className="flex items-center space-x-3">
                                <div className="flex items-center justify-center w-10 h-10 bg-blue-100 rounded-full">
                                    <Bot className="w-5 h-5 text-blue-600" />
                                </div>
                                <div>
                                    <CardTitle className="flex items-center space-x-2">
                                        <span>SRAP 2.0 Digital Twin Assistant</span>
                                        <Badge variant="secondary" className="bg-green-100 text-green-800">
                                            <CheckCircle className="w-3 h-3 mr-1" />
                                            Online
                                        </Badge>
                                    </CardTitle>
                                    <CardDescription>
                                        Ask me about KPIs, milestones, reports, and more
                                    </CardDescription>
                                </div>
                            </div>
                        </CardHeader>

                        {/* Chat Messages */}
                        <CardContent className="flex-1 flex flex-col overflow-hidden">
                            <div className="flex-1 overflow-y-auto space-y-4 mb-4 pr-2">
                                {conversation.length === 0 && (
                                    <div className="text-center py-8">
                                        <Sparkles className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                                        <h3 className="text-lg font-medium text-gray-900 mb-2">
                                            Start a conversation
                                        </h3>
                                        <p className="text-gray-600 mb-6">
                                            I can help you with KPI management, milestone tracking, report generation, and more.
                                        </p>
                                        <div className="flex flex-wrap gap-2 justify-center">
                                            {[
                                                'Show KPI dashboard',
                                                'Generate progress report',
                                                'Check milestone status',
                                                'View recent alerts'
                                            ].map((suggestion) => (
                                                <Button
                                                    key={suggestion}
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => handleSuggestionClick(suggestion)}
                                                    className="text-sm"
                                                >
                                                    {suggestion}
                                                </Button>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {conversation.map((msg) => (
                                    <div
                                        key={msg.id}
                                        className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}
                                    >
                                        <div className={`flex space-x-3 max-w-[80%] ${msg.type === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                                            <div className={`flex items-center justify-center w-8 h-8 rounded-full flex-shrink-0 ${
                                                msg.type === 'user' 
                                                    ? 'bg-blue-600' 
                                                    : msg.error 
                                                        ? 'bg-red-100' 
                                                        : 'bg-gray-100'
                                            }`}>
                                                {msg.type === 'user' ? (
                                                    <User className="w-4 h-4 text-white" />
                                                ) : (
                                                    <Bot className={`w-4 h-4 ${msg.error ? 'text-red-600' : 'text-gray-600'}`} />
                                                )}
                                            </div>
                                            <div className={`rounded-lg p-3 ${
                                                msg.type === 'user'
                                                    ? 'bg-blue-600 text-white'
                                                    : msg.error
                                                        ? 'bg-red-50 text-red-800 border border-red-200'
                                                        : 'bg-gray-100 text-gray-900'
                                            }`}>
                                                <p className="text-sm whitespace-pre-wrap">{msg.message}</p>
                                                <div className="flex items-center justify-between mt-2">
                                                    <span className={`text-xs ${
                                                        msg.type === 'user' ? 'text-blue-100' : 'text-gray-500'
                                                    }`}>
                                                        <Clock className="w-3 h-3 inline mr-1" />
                                                        {formatTime(msg.timestamp)}
                                                    </span>
                                                    {msg.confidence && (
                                                        <span className="text-xs text-gray-500">
                                                            {Math.round(msg.confidence * 100)}% confidence
                                                        </span>
                                                    )}
                                                </div>
                                                {msg.suggestions && msg.suggestions.length > 0 && (
                                                    <div className="mt-3 flex flex-wrap gap-2">
                                                        {msg.suggestions.map((suggestion, index) => (
                                                            <Button
                                                                key={index}
                                                                variant="outline"
                                                                size="sm"
                                                                onClick={() => handleSuggestionClick(suggestion)}
                                                                className="text-xs h-7"
                                                            >
                                                                {suggestion}
                                                            </Button>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}

                                {isLoading && (
                                    <div className="flex justify-start">
                                        <div className="flex space-x-3 max-w-[80%]">
                                            <div className="flex items-center justify-center w-8 h-8 bg-gray-100 rounded-full">
                                                <Bot className="w-4 h-4 text-gray-600" />
                                            </div>
                                            <div className="bg-gray-100 rounded-lg p-3">
                                                <div className="flex space-x-1">
                                                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                                                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                                                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Message Input */}
                            <form onSubmit={handleSendMessage} className="flex space-x-2">
                                <input
                                    type="text"
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                    placeholder="Type your message..."
                                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    disabled={isLoading}
                                />
                                <Button
                                    type="submit"
                                    disabled={!message.trim() || isLoading}
                                    className="px-4 py-2"
                                >
                                    <Send className="w-4 h-4" />
                                </Button>
                            </form>
                        </CardContent>
                    </Card>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
