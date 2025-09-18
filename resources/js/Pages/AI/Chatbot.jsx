import { Head } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { Bot, Send, Mic, Settings, Download, MessageSquare } from 'lucide-react';
import { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/Components/ui/Card';
import { Button } from '@/Components/ui/Button';
import { Badge } from '@/Components/ui/Badge';
import { Input } from '@/Components/ui/Input';

export default function AIChatbot() {
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([
        { id: 1, type: 'bot', content: 'Hello! I\'m your AI assistant. How can I help you today?', timestamp: '10:30 AM' },
        { id: 2, type: 'user', content: 'Can you analyze the latest research data?', timestamp: '10:31 AM' },
        { id: 3, type: 'bot', content: 'I\'d be happy to help analyze your research data. Could you please specify which dataset you\'d like me to examine? I can help with statistical analysis, pattern recognition, and generating insights.', timestamp: '10:31 AM' },
    ]);

    const chatbotStats = [
        { name: 'Total Conversations', value: 1247, icon: MessageSquare },
        { name: 'Accuracy Rate', value: 94.8, icon: Bot },
        { name: 'Response Time', value: 1.2, icon: Settings },
        { name: 'User Satisfaction', value: 4.7, icon: Settings },
    ];

    const testScenarios = [
        { name: 'Data Analysis Query', description: 'Test chatbot\'s ability to analyze datasets', status: 'passed' },
        { name: 'Research Assistance', description: 'Evaluate research methodology suggestions', status: 'passed' },
        { name: 'Complex Calculations', description: 'Test mathematical computation capabilities', status: 'warning' },
        { name: 'Natural Language Processing', description: 'Assess language understanding accuracy', status: 'passed' },
    ];

    const handleSendMessage = () => {
        if (message.trim()) {
            const newMessage = {
                id: messages.length + 1,
                type: 'user',
                content: message,
                timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            };
            setMessages([...messages, newMessage]);
            setMessage('');
            
            // Simulate bot response
            setTimeout(() => {
                const botResponse = {
                    id: messages.length + 2,
                    type: 'bot',
                    content: 'Thank you for your message. I\'m processing your request and will provide a detailed response shortly.',
                    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                };
                setMessages(prev => [...prev, botResponse]);
            }, 1000);
        }
    };

    return (
        <AuthenticatedLayout>
            <Head title="AI Chatbot Testing - AI Developer" />

            <div className="px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="mb-8"
                >
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center">
                                <Bot className="w-8 h-8 mr-3 text-blue-600" />
                                AI Chatbot Testing
                            </h1>
                            <p className="text-gray-600 dark:text-gray-400 mt-2">
                                Test and monitor AI chatbot performance and capabilities
                            </p>
                        </div>
                        <div className="flex items-center space-x-2">
                            <Button variant="outline">
                                <Settings className="w-4 h-4 mr-2" />
                                Configure
                            </Button>
                            <Button className="bg-blue-600 hover:bg-blue-700">
                                <Download className="w-4 h-4 mr-2" />
                                Export Logs
                            </Button>
                        </div>
                    </div>
                </motion.div>

                {/* Chatbot Stats */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.1 }}
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
                >
                    {chatbotStats.map((stat, index) => (
                        <Card key={stat.name} className="hover:shadow-md transition-shadow">
                            <CardContent className="p-6">
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">
                                        {stat.name}
                                    </h3>
                                    <stat.icon className="w-6 h-6 text-blue-600" />
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-3xl font-bold text-gray-900 dark:text-white">
                                        {stat.value}{stat.name.includes('Rate') || stat.name.includes('Satisfaction') ? '%' : stat.name.includes('Time') ? 's' : ''}
                                    </span>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </motion.div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Chat Interface */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="lg:col-span-2"
                    >
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center">
                                    <MessageSquare className="w-5 h-5 mr-2" />
                                    Chat Interface
                                </CardTitle>
                                <CardDescription>
                                    Test the AI chatbot with real-time conversations
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                {/* Chat Messages */}
                                <div className="h-96 overflow-y-auto mb-4 p-4 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800/50">
                                    <div className="space-y-4">
                                        {messages.map((msg, index) => (
                                            <motion.div
                                                key={msg.id}
                                                initial={{ opacity: 0, y: 20 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ duration: 0.3, delay: index * 0.1 }}
                                                className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}
                                            >
                                                <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                                                    msg.type === 'user' 
                                                        ? 'bg-blue-600 text-white' 
                                                        : 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-600'
                                                }`}>
                                                    <p className="text-sm">{msg.content}</p>
                                                    <p className={`text-xs mt-1 ${
                                                        msg.type === 'user' ? 'text-blue-100' : 'text-gray-500 dark:text-gray-400'
                                                    }`}>
                                                        {msg.timestamp}
                                                    </p>
                                                </div>
                                            </motion.div>
                                        ))}
                                    </div>
                                </div>

                                {/* Message Input */}
                                <div className="flex items-center space-x-2">
                                    <Input
                                        type="text"
                                        placeholder="Type your message..."
                                        value={message}
                                        onChange={(e) => setMessage(e.target.value)}
                                        onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                                        className="flex-1"
                                    />
                                    <Button variant="outline" size="sm">
                                        <Mic className="w-4 h-4" />
                                    </Button>
                                    <Button onClick={handleSendMessage} size="sm" className="bg-blue-600 hover:bg-blue-700">
                                        <Send className="w-4 h-4" />
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>

                    {/* Test Scenarios */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6, delay: 0.3 }}
                    >
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center">
                                    <Settings className="w-5 h-5 mr-2" />
                                    Test Scenarios
                                </CardTitle>
                                <CardDescription>
                                    Automated testing results
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {testScenarios.map((scenario, index) => (
                                        <motion.div
                                            key={scenario.name}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ duration: 0.4, delay: index * 0.1 }}
                                            className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg"
                                        >
                                            <div className="flex items-center justify-between mb-2">
                                                <h4 className="font-medium text-gray-900 dark:text-white">
                                                    {scenario.name}
                                                </h4>
                                                <Badge className={
                                                    scenario.status === 'passed'
                                                        ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300'
                                                        : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300'
                                                }>
                                                    {scenario.status}
                                                </Badge>
                                            </div>
                                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                                {scenario.description}
                                            </p>
                                        </motion.div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                </div>

                {/* Performance Metrics */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                    className="mt-8"
                >
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center">
                                <Bot className="w-5 h-5 mr-2" />
                                Performance Metrics
                            </CardTitle>
                            <CardDescription>
                                Detailed analytics and performance indicators
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                                    <h4 className="font-medium text-blue-800 dark:text-blue-300 mb-2">
                                        Response Quality
                                    </h4>
                                    <p className="text-2xl font-bold text-blue-900 dark:text-blue-200 mb-1">94.8%</p>
                                    <p className="text-sm text-blue-700 dark:text-blue-400">
                                        Average accuracy across all interactions
                                    </p>
                                </div>
                                <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                                    <h4 className="font-medium text-green-800 dark:text-green-300 mb-2">
                                        Learning Progress
                                    </h4>
                                    <p className="text-2xl font-bold text-green-900 dark:text-green-200 mb-1">+12%</p>
                                    <p className="text-sm text-green-700 dark:text-green-400">
                                        Improvement in response quality this month
                                    </p>
                                </div>
                                <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-200 dark:border-purple-800">
                                    <h4 className="font-medium text-purple-800 dark:text-purple-300 mb-2">
                                        Model Version
                                    </h4>
                                    <p className="text-2xl font-bold text-purple-900 dark:text-purple-200 mb-1">v2.1.3</p>
                                    <p className="text-sm text-purple-700 dark:text-purple-400">
                                        Latest stable release with enhanced NLP
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>
            </div>
        </AuthenticatedLayout>
    );
}
