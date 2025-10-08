import { useState, useEffect } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import { motion } from 'framer-motion';
import {
    Activity,
    Shield,
    Users,
    BarChart3,
    Zap,
    Globe,
    ArrowRight,
    CheckCircle,
    Star,
    ArrowUpRight,
    LineChart,
    Clock,
    TrendingUp,
    Database,
    Lock,
    Wifi,
    Brain,
    Target,
    Award,
    MessageSquare,
    UserCheck,
    Building2,
    ChevronDown,
    MapPin,
    Phone,
    Mail,
    Facebook,
    Twitter,
    Linkedin,
    Youtube,
    AlertTriangle,
    Upload,
    Calendar,
    Bell,
    Moon,
    Sun,
    Network,
    User,
    LogOut,
    Settings,
    FileText,
    UserCog,
    PieChart,
    Cpu,
    Bot
} from 'lucide-react';
import { Button } from '@/Components/ui/Button';
import { Card, CardContent } from '@/Components/ui/Card';
import { Badge } from '@/Components/ui/Badge';

export default function Welcome({ auth, laravelVersion, phpVersion }) {
    const [darkMode, setDarkMode] = useState(false);
    const [currentTime, setCurrentTime] = useState(new Date());
    const [showNotifications, setShowNotifications] = useState(false);

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentTime(new Date());
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    const getGreeting = () => {
        const hour = currentTime.getHours();
        if (hour < 12) return 'Good Morning';
        if (hour < 17) return 'Good Afternoon';
        return 'Good Evening';
    };

    const getRoleDisplayName = (role) => {
        const roleNames = {
            admin: 'Administrator',
            researcher: 'Researcher',
            data_analyst: 'Data Analyst',
            cybersecurity_specialist: 'Cybersecurity Specialist',
            ai_developer: 'AI Developer'
        };
        return roleNames[role] || 'User';
    };

    const getRoleBasedMessage = (role) => {
        const messages = {
            admin: 'Monitor system performance and manage NITDA strategic initiatives',
            researcher: 'Upload research data and track SRAP implementation progress',
            data_analyst: 'Analyze KPI trends and generate insights for strategic decisions',
            cybersecurity_specialist: 'Ensure API security and monitor system compliance',
            ai_developer: 'Develop AI insights and predictive models for NITDA KPIs'
        };
        return messages[role] || 'Welcome to NITDA SRAP 2.0 Digital Twin Dashboard';
    };

    const getRoleShortcuts = (role) => {
        const shortcuts = {
            admin: [
                { title: 'Manage Users', href: '/admin/users', icon: UserCog, description: 'User management & permissions' },
                { title: 'System Settings', href: '/dashboard/admin/settings', icon: Settings, description: 'Configure dashboard settings' },
                { title: 'Reports Overview', href: '/admin/reports', icon: FileText, description: 'View all system reports' }
            ],
            researcher: [
                { title: 'Upload Data', href: '/dashboard/researcher/upload', icon: Upload, description: 'Upload research datasets' },
                { title: 'My Reports', href: '/dashboard/researcher/reports', icon: FileText, description: 'View uploaded reports' },
                { title: 'Data Analysis', href: '/dashboard/researcher/analysis', icon: BarChart3, description: 'Analyze research data' }
            ],
            data_analyst: [
                { title: 'View KPI Charts', href: '/dashboard/analyst/analytics', icon: PieChart, description: 'Interactive KPI visualizations' },
                { title: 'Analytics Dashboard', href: '/dashboard/analyst/kpi', icon: LineChart, description: 'Advanced analytics tools' },
                { title: 'Generate Reports', href: '/dashboard/analyst/reports', icon: FileText, description: 'Create analytical reports' }
            ],
            cybersecurity_specialist: [
                { title: 'API Security Status', href: '/dashboard/security/overview', icon: Lock, description: 'Monitor API security' },
                { title: 'Threat Analysis', href: '/dashboard/security/api', icon: Shield, description: 'Security threat monitoring' },
                { title: 'Compliance Check', href: '/dashboard/security/compliance', icon: CheckCircle, description: 'System compliance status' }
            ],
            ai_developer: [
                { title: 'AI Insights', href: '/dashboard/ai/chatbot', icon: Brain, description: 'AI-powered analytics' },
                { title: 'Model Training', href: '/dashboard/ai/models', icon: Cpu, description: 'Train predictive models' },
                { title: 'AI Dashboard', href: '/dashboard/ai/dashboard', icon: Bot, description: 'AI system overview' }
            ]
        };
        return shortcuts[role] || [];
    };

    const kpiStats = [
        { title: 'Total KPIs', value: '47', change: '+5 this month', trend: 'up', color: 'blue', icon: Target },
        { title: 'KPIs On Track', value: '32', change: '+12% vs last quarter', trend: 'up', color: 'green', icon: CheckCircle },
        { title: 'At Risk KPIs', value: '8', change: '-3 from last month', trend: 'down', color: 'yellow', icon: AlertTriangle },
        { title: 'Completed KPIs', value: '7', change: '+2 this quarter', trend: 'up', color: 'purple', icon: TrendingUp }
    ];

    const latestUpdates = [
        {
            title: 'Broadband Infrastructure Report Uploaded',
            description: 'Q3 broadband penetration data analysis completed',
            time: '15 minutes ago',
            type: 'success',
            icon: Upload
        },
        {
            title: 'AI Alert: Digital Literacy KPI at Risk',
            description: 'Current progress 23% below target for Q4',
            time: '1 hour ago',
            type: 'warning',
            icon: AlertTriangle
        },
        {
            title: 'NITDA Strategic Meeting Reminder',
            description: 'Monthly SRAP review meeting tomorrow at 10:00 AM',
            time: '2 hours ago',
            type: 'info',
            icon: Calendar
        },
        {
            title: 'Cybersecurity Compliance Check Completed',
            description: 'All systems passed security audit successfully',
            time: '4 hours ago',
            type: 'success',
            icon: Shield
        }
    ];

    const notifications = [
        { title: 'New KPI data available', time: '5 min ago', type: 'info' },
        { title: 'System maintenance scheduled', time: '1 hour ago', type: 'warning' },
        { title: 'Monthly report generated', time: '2 hours ago', type: 'success' }
    ];

    const handleLogout = () => {
        router.post('/logout');
    };

    return (
        <>
            <Head title="SRAP 2.0 - Digital Twin Dashboard" />

            <div className={`min-h-screen transition-colors duration-300 ${darkMode ? 'dark' : ''}`}>
                {/* Animated Background */}
                <div className="fixed inset-0 bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-blue-900">
                    <div className="absolute inset-0 opacity-30">
                        {/* Floating Elements */}
                        <motion.div
                            className="absolute top-20 left-20 w-32 h-32 bg-blue-200 dark:bg-blue-800 rounded-full opacity-20"
                            animate={{ y: [-20, 20, -20], rotate: [0, 180, 360] }}
                            transition={{ duration: 8, repeat: Infinity }}
                        />
                        <motion.div
                            className="absolute top-40 right-32 w-24 h-24 bg-purple-200 dark:bg-purple-800 rounded-full opacity-20"
                            animate={{ y: [20, -20, 20], rotate: [360, 180, 0] }}
                            transition={{ duration: 6, repeat: Infinity }}
                        />
                        <motion.div
                            className="absolute bottom-32 left-40 w-28 h-28 bg-green-200 dark:bg-green-800 rounded-full opacity-20"
                            animate={{ y: [-15, 15, -15], x: [-10, 10, -10] }}
                            transition={{ duration: 7, repeat: Infinity }}
                        />
                    </div>
                </div>

                {/* Header Section */}
                <header className="relative z-10 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-700">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex items-center justify-between h-16">
                            {/* Logo and Title */}
                            <div className="flex items-center space-x-4">
                                <motion.div
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    className="flex items-center space-x-3"
                                >
                                    <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center p-1 shadow-sm">
                                        <img
                                            src="/logo-removebg-preview.png"
                                            alt="NITDA Logo"
                                            className="w-8 h-8 object-contain"
                                        />
                                    </div>
                                    <div>
                                        <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                                            SRAP 2.0 Digital Twin
                                        </h1>
                                        <p className="text-sm text-gray-600 dark:text-gray-400">
                                            AI-powered dashboard for monitoring NITDA's Strategic Roadmap & Action Plan
                                        </p>
                                    </div>
                                </motion.div>
                            </div>

                            {/* Right Side - Notifications, Dark Mode, Profile */}
                            <div className="flex items-center space-x-4">
                                {/* Notifications Bell */}
                                <div className="relative">
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => setShowNotifications(!showNotifications)}
                                        className="relative p-2"
                                    >
                                        <Bell className="w-5 h-5" />
                                        <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse"></span>
                                    </Button>

                                    {/* Notifications Dropdown */}
                                    {showNotifications && (
                                        <motion.div
                                            initial={{ opacity: 0, y: -10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-50"
                                        >
                                            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                                                <h3 className="font-semibold text-gray-900 dark:text-white">Notifications</h3>
                                            </div>
                                            <div className="max-h-64 overflow-y-auto">
                                                {notifications.map((notification, index) => (
                                                    <div key={index} className="p-3 border-b border-gray-100 dark:border-gray-700 last:border-b-0 hover:bg-gray-50 dark:hover:bg-gray-700">
                                                        <p className="text-sm font-medium text-gray-900 dark:text-white">{notification.title}</p>
                                                        <p className="text-xs text-gray-500 dark:text-gray-400">{notification.time}</p>
                                                    </div>
                                                ))}
                                            </div>
                                        </motion.div>
                                    )}
                                </div>

                                {/* Dark Mode Toggle */}
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => setDarkMode(!darkMode)}
                                    className="p-2"
                                >
                                    {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                                </Button>

                                {/* Profile Section */}
                                {auth.user ? (
                                    <div className="flex items-center space-x-3">
                                        <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                                            <User className="w-4 h-4 text-white" />
                                        </div>
                                        <div className="hidden md:block">
                                            <p className="text-sm font-medium text-gray-900 dark:text-white">
                                                {auth.user.name}
                                            </p>
                                            <p className="text-xs text-gray-500 dark:text-gray-400">
                                                {getRoleDisplayName(auth.user.role)}
                                            </p>
                                        </div>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={handleLogout}
                                            className="p-2"
                                        >
                                            <LogOut className="w-4 h-4" />
                                        </Button>
                                    </div>
                                ) : (
                                    <div className="flex items-center space-x-2">
                                        <Link href="/login">
                                            <Button variant="ghost" size="sm">Login</Button>
                                        </Link>
                                        <Link href="/register">
                                            <Button size="sm">Register</Button>
                                        </Link>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </header>

                {/* Main Content */}
                <main className="relative z-10">
                    {/* Hero Section */}
                    <section className="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8">
                        <div className="max-w-4xl mx-auto text-center">
                            <motion.div
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.8 }}
                                className="mb-8"
                            >
                                <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 bg-clip-text text-transparent mb-6">
                                    SRAP 2.0
                                </h1>
                                <h2 className="text-2xl md:text-4xl font-semibold text-gray-800 dark:text-gray-200 mb-6">
                                    Digital Twin Dashboard
                                </h2>
                                <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-400 mb-8 leading-relaxed">
                                    AI-powered platform for monitoring Nigeria's Strategic Roadmap & Action Plan
                                </p>
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3, duration: 0.8 }}
                                className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12"
                            >
                                {auth.user ? (
                                    <Link href="/dashboard">
                                        <Button size="lg" className="px-8 py-4 text-lg bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                                            Go to Dashboard
                                            <ArrowUpRight className="ml-2 w-5 h-5" />
                                        </Button>
                                    </Link>
                                ) : (
                                    <>
                                        <Link href="/login">
                                            <Button size="lg" className="px-8 py-4 text-lg bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                                                Get Started
                                                <ArrowUpRight className="ml-2 w-5 h-5" />
                                            </Button>
                                        </Link>
                                        <Link href="/register">
                                            <Button variant="outline" size="lg" className="px-8 py-4 text-lg">
                                                Learn More
                                            </Button>
                                        </Link>
                                    </>
                                )}
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.6, duration: 0.8 }}
                                className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center"
                            >
                                <div>
                                    <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">47</div>
                                    <div className="text-sm text-gray-600 dark:text-gray-400">Total KPIs</div>
                                </div>
                                <div>
                                    <div className="text-3xl font-bold text-green-600 dark:text-green-400">32</div>
                                    <div className="text-sm text-gray-600 dark:text-gray-400">On Track</div>
                                </div>
                                <div>
                                    <div className="text-3xl font-bold text-yellow-600 dark:text-yellow-400">8</div>
                                    <div className="text-sm text-gray-600 dark:text-gray-400">At Risk</div>
                                </div>
                                <div>
                                    <div className="text-3xl font-bold text-purple-600 dark:text-purple-400">7</div>
                                    <div className="text-sm text-gray-600 dark:text-gray-400">Completed</div>
                                </div>
                            </motion.div>
                        </div>
                    </section>

                    {/* About Section */}
                    <section className="py-20 px-4 sm:px-6 lg:px-8">
                        <div className="max-w-6xl mx-auto">
                            <motion.div
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.8 }}
                                viewport={{ once: true }}
                                className="text-center mb-16"
                            >
                                <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
                                    About SRAP 2.0
                                </h2>
                                <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto leading-relaxed">
                                    Nigeria's Strategic Roadmap & Action Plan (SRAP) 2.0 Digital Twin is an innovative
                                    AI-powered platform designed to monitor, analyze, and optimize the implementation
                                    of Nigeria's digital transformation initiatives.
                                </p>
                            </motion.div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                <motion.div
                                    initial={{ opacity: 0, y: 30 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.8, delay: 0.1 }}
                                    viewport={{ once: true }}
                                    className="text-center"
                                >
                                    <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
                                        <Target className="w-8 h-8 text-white" />
                                    </div>
                                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Mission</h3>
                                    <p className="text-gray-600 dark:text-gray-400">
                                        To accelerate Nigeria's digital transformation through data-driven insights
                                        and intelligent monitoring of strategic initiatives.
                                    </p>
                                </motion.div>

                                <motion.div
                                    initial={{ opacity: 0, y: 30 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.8, delay: 0.2 }}
                                    viewport={{ once: true }}
                                    className="text-center"
                                >
                                    <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
                                        <Globe className="w-8 h-8 text-white" />
                                    </div>
                                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Vision</h3>
                                    <p className="text-gray-600 dark:text-gray-400">
                                        To position Nigeria as a leading digital economy in Africa through
                                        innovative technology solutions and strategic planning.
                                    </p>
                                </motion.div>

                                <motion.div
                                    initial={{ opacity: 0, y: 30 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.8, delay: 0.3 }}
                                    viewport={{ once: true }}
                                    className="text-center"
                                >
                                    <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-6">
                                        <Zap className="w-8 h-8 text-white" />
                                    </div>
                                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Impact</h3>
                                    <p className="text-gray-600 dark:text-gray-400">
                                        Empowering stakeholders with real-time analytics and AI-driven
                                        recommendations for optimal decision-making.
                                    </p>
                                </motion.div>
                            </div>
                        </div>
                    </section>

                    {/* Features Section */}
                    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-gray-800/50">
                        <div className="max-w-6xl mx-auto">
                            <motion.div
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.8 }}
                                viewport={{ once: true }}
                                className="text-center mb-16"
                            >
                                <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
                                    Key Features
                                </h2>
                                <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
                                    Discover the powerful capabilities that make SRAP 2.0 the ultimate
                                    platform for digital transformation monitoring.
                                </p>
                            </motion.div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                {[
                                    {
                                        icon: BarChart3,
                                        title: "Real-time Analytics",
                                        description: "Monitor KPIs and performance metrics in real-time with advanced analytics and visualization tools."
                                    },
                                    {
                                        icon: Brain,
                                        title: "AI-Powered Insights",
                                        description: "Leverage artificial intelligence to predict trends, identify risks, and optimize strategic decisions."
                                    },
                                    {
                                        icon: Shield,
                                        title: "Secure & Compliant",
                                        description: "Enterprise-grade security with role-based access control and compliance monitoring."
                                    },
                                    {
                                        icon: Users,
                                        title: "Multi-Role Dashboard",
                                        description: "Customized interfaces for administrators, researchers, analysts, and security specialists."
                                    },
                                    {
                                        icon: Database,
                                        title: "Data Integration",
                                        description: "Seamlessly integrate data from multiple sources for comprehensive analysis and reporting."
                                    },
                                    {
                                        icon: Network,
                                        title: "API Connectivity",
                                        description: "Robust API infrastructure for third-party integrations and data exchange."
                                    }
                                ].map((feature, index) => (
                                    <motion.div
                                        key={index}
                                        initial={{ opacity: 0, y: 30 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.8, delay: index * 0.1 }}
                                        viewport={{ once: true }}
                                        className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-lg hover:shadow-xl transition-all duration-300"
                                    >
                                        <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center mb-6">
                                            <feature.icon className="w-6 h-6 text-white" />
                                        </div>
                                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                                            {feature.title}
                                        </h3>
                                        <p className="text-gray-600 dark:text-gray-400">
                                            {feature.description}
                                        </p>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    </section>

                    {/* CTA Section */}
                    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800">
                        <div className="max-w-4xl mx-auto text-center">
                            <motion.div
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.8 }}
                                viewport={{ once: true }}
                            >
                                <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                                    Ready to Transform Nigeria's Digital Future?
                                </h2>
                                <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
                                    Join the SRAP 2.0 Digital Twin platform and be part of Nigeria's
                                    digital transformation journey.
                                </p>
                                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                    {auth.user ? (
                                        <Link href="/dashboard">
                                            <Button size="lg" className="px-8 py-4 text-lg bg-white text-blue-600 hover:bg-gray-100">
                                                Access Dashboard
                                                <ArrowUpRight className="ml-2 w-5 h-5" />
                                            </Button>
                                        </Link>
                                    ) : (
                                        <>
                                            <Link href="/register">
                                                <Button size="lg" className="px-8 py-4 text-lg bg-white text-blue-600 hover:bg-gray-100">
                                                    Get Started
                                                    <ArrowUpRight className="ml-2 w-5 h-5" />
                                                </Button>
                                            </Link>
                                            <Link href="/login">
                                                <Button variant="outline" size="lg" className="px-8 py-4 text-lg border-white text-white hover:bg-white hover:text-blue-600">
                                                    Sign In
                                                </Button>
                                            </Link>
                                        </>
                                    )}
                                </div>
                            </motion.div>
                        </div>
                    </section>

                    {/* FAQ Section */}
                    <motion.section
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 1.0 }}
                        className="py-20 bg-gray-50 dark:bg-gray-900/50"
                    >
                        <div className="container mx-auto px-6">
                            <div className="text-center mb-16">
                                <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
                                    Frequently Asked Questions
                                </h2>
                                <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                                    Get answers to common questions about SRAP 2.0 Digital Twin platform
                                </p>
                            </div>

                            <div className="max-w-4xl mx-auto space-y-6">
                                {[
                                    {
                                        question: "What is SRAP 2.0 Digital Twin?",
                                        answer: "SRAP 2.0 Digital Twin is Nigeria's comprehensive digital transformation tracking platform that provides real-time monitoring, analytics, and insights for the Strategic Roadmap and Action Plan implementation."
                                    },
                                    {
                                        question: "Who can access the platform?",
                                        answer: "The platform supports multiple user roles including Admin Users, Researchers, Data Analysts, Security Officers, and AI Chatbot users, each with tailored dashboards and permissions."
                                    },
                                    {
                                        question: "What kind of data does the platform track?",
                                        answer: "The platform tracks KPIs across digital infrastructure, digital literacy, innovation hubs, broadband penetration, cybersecurity metrics, and AI implementation progress."
                                    },
                                    {
                                        question: "Is the platform secure?",
                                        answer: "Yes, SRAP 2.0 implements advanced security protocols, role-based access control, encrypted data transmission, and comprehensive audit trails to ensure data security and compliance."
                                    },
                                    {
                                        question: "How often is the data updated?",
                                        answer: "The platform provides real-time data updates with automated synchronization from various government agencies and partner organizations across Nigeria."
                                    },
                                    {
                                        question: "Can I integrate external data sources?",
                                        answer: "Yes, the platform offers robust API connectivity for seamless integration with external systems, databases, and third-party applications."
                                    }
                                ].map((faq, index) => (
                                    <motion.div
                                        key={index}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.1 * index }}
                                        className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden"
                                    >
                                        <details className="group">
                                            <summary className="flex items-center justify-between p-6 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white pr-4">
                                                    {faq.question}
                                                </h3>
                                                <ChevronDown className="w-5 h-5 text-gray-500 group-open:rotate-180 transition-transform duration-200" />
                                            </summary>
                                            <div className="px-6 pb-6">
                                                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                                                    {faq.answer}
                                                </p>
                                            </div>
                                        </details>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    </motion.section>

                    {/* Contact Us Section */}
                    <motion.section
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 1.2 }}
                        className="py-20 bg-gradient-to-br from-blue-600 to-purple-700"
                    >
                        <div className="container mx-auto px-6">
                            <div className="max-w-6xl mx-auto">
                                <div className="text-center mb-16">
                                    <h2 className="text-4xl font-bold text-white mb-4">
                                        Get in Touch
                                    </h2>
                                    <p className="text-xl text-blue-100 max-w-2xl mx-auto">
                                        Have questions or need support? Our team is here to help you succeed with SRAP 2.0
                                    </p>
                                </div>

                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                                    {/* Contact Information */}
                                    <div className="space-y-8">
                                        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
                                            <div className="flex items-center space-x-4 mb-4">
                                                <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                                                    <MapPin className="w-6 h-6 text-white" />
                                                </div>
                                                <div>
                                                    <h3 className="text-lg font-semibold text-white">Address</h3>
                                                    <p className="text-blue-100">NITDA Headquarters, Plot 28 Port Harcourt Crescent, Off Gimbiya Street, Area 11, Garki, Abuja</p>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
                                            <div className="flex items-center space-x-4 mb-4">
                                                <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                                                    <Phone className="w-6 h-6 text-white" />
                                                </div>
                                                <div>
                                                    <h3 className="text-lg font-semibold text-white">Phone</h3>
                                                    <p className="text-blue-100">+234 9 461 0005</p>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
                                            <div className="flex items-center space-x-4 mb-4">
                                                <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                                                    <Mail className="w-6 h-6 text-white" />
                                                </div>
                                                <div>
                                                    <h3 className="text-lg font-semibold text-white">Email</h3>
                                                    <p className="text-blue-100">info@nitda.gov.ng</p>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
                                            <div className="flex items-center space-x-4 mb-4">
                                                <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                                                    <Clock className="w-6 h-6 text-white" />
                                                </div>
                                                <div>
                                                    <h3 className="text-lg font-semibold text-white">Business Hours</h3>
                                                    <p className="text-blue-100">Monday - Friday: 8:00 AM - 5:00 PM</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Contact Form */}
                                    <div className="bg-white/10 backdrop-blur-sm rounded-lg p-8">
                                        <h3 className="text-2xl font-bold text-white mb-6">Send us a Message</h3>
                                        <form className="space-y-6">
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                <div>
                                                    <label className="block text-sm font-medium text-white mb-2">First Name</label>
                                                    <input
                                                        type="text"
                                                        className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-lg text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white/50"
                                                        placeholder="Your first name"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-white mb-2">Last Name</label>
                                                    <input
                                                        type="text"
                                                        className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-lg text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white/50"
                                                        placeholder="Your last name"
                                                    />
                                                </div>
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-white mb-2">Email</label>
                                                <input
                                                    type="email"
                                                    className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-lg text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white/50"
                                                    placeholder="your.email@example.com"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-white mb-2">Subject</label>
                                                <input
                                                    type="text"
                                                    className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-lg text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white/50"
                                                    placeholder="What's this about?"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-white mb-2">Message</label>
                                                <textarea
                                                    rows="4"
                                                    className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-lg text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white/50 resize-none"
                                                    placeholder="Tell us more about your inquiry..."
                                                ></textarea>
                                            </div>
                                            <Button className="w-full bg-white text-blue-600 hover:bg-gray-100 font-semibold py-3">
                                                Send Message
                                            </Button>
                                        </form>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.section>

                    {/* Partners/Stakeholders Section */}
                    <motion.section
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 1.4 }}
                        className="py-20 bg-white dark:bg-gray-900"
                    >
                        <div className="container mx-auto px-6">
                            <div className="text-center mb-16">
                                <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
                                    Key Stakeholders & Partners
                                </h2>
                                <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                                    Collaborating with leading organizations to drive Nigeria's digital transformation
                                </p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                                {[
                                    { name: "Federal Ministry of Communications and Digital Economy", role: "Policy Framework" },
                                    { name: "Nigerian Communications Commission (NCC)", role: "Regulatory Oversight" },
                                    { name: "Galaxy Backbone Limited", role: "Infrastructure Support" },
                                    { name: "National Bureau of Statistics", role: "Data Analytics" },
                                    { name: "Central Bank of Nigeria", role: "Digital Payment Systems" },
                                    { name: "Nigerian Inter-Bank Settlement System", role: "Financial Technology" },
                                    { name: "Academic Institutions", role: "Research & Development" },
                                    { name: "Private Sector Partners", role: "Innovation & Implementation" }
                                ].map((partner, index) => (
                                    <motion.div
                                        key={index}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.1 * index }}
                                        className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6 text-center hover:shadow-lg transition-shadow"
                                    >
                                        <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                                            <Building2 className="w-8 h-8 text-white" />
                                        </div>
                                        <h3 className="font-semibold text-gray-900 dark:text-white mb-2">{partner.name}</h3>
                                        <p className="text-sm text-gray-600 dark:text-gray-400">{partner.role}</p>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    </motion.section>
                </main>

                {/* Footer */}
                <motion.section
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.6 }}
                    className='bg-gray-900 bg-gray-900'
                >
                    <footer className="relative z-10 bg-gray-900 text-white">
                        <div className="container bg-gray-900 mx-auto px-6 py-12">
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                                {/* Company Info */}
                                <div className="space-y-4">
                                    <div className="flex items-center space-x-2">
                                        <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                                            <Activity className="w-5 h-5 text-white" />
                                        </div>
                                        <span className="text-xl font-bold">SRAP 2.0</span>
                                    </div>
                                    <p className="text-gray-400 text-sm leading-relaxed">
                                        Nigeria's Strategic Roadmap and Action Plan 2.0 Digital Twin - Driving digital transformation across the nation.
                                    </p>
                                    <div className="flex space-x-4">
                                        <a href="#" className="text-gray-400 hover:text-white transition-colors">
                                            <Facebook className="w-5 h-5" />
                                        </a>
                                        <a href="#" className="text-gray-400 hover:text-white transition-colors">
                                            <Twitter className="w-5 h-5" />
                                        </a>
                                        <a href="#" className="text-gray-400 hover:text-white transition-colors">
                                            <Linkedin className="w-5 h-5" />
                                        </a>
                                        <a href="#" className="text-gray-400 hover:text-white transition-colors">
                                            <Youtube className="w-5 h-5" />
                                        </a>
                                    </div>
                                </div>

                                {/* Quick Links */}
                                <div>
                                    <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
                                    <ul className="space-y-2">
                                        <li><Link href="/dashboard" className="text-gray-400 hover:text-white transition-colors">Dashboard</Link></li>
                                        <li><Link href="/login" className="text-gray-400 hover:text-white transition-colors">Login</Link></li>
                                        <li><Link href="/register" className="text-gray-400 hover:text-white transition-colors">Register</Link></li>
                                        <li><a href="#about" className="text-gray-400 hover:text-white transition-colors">About</a></li>
                                        <li><a href="#features" className="text-gray-400 hover:text-white transition-colors">Features</a></li>
                                        <li><a href="#contact" className="text-gray-400 hover:text-white transition-colors">Contact</a></li>
                                    </ul>
                                </div>

                                {/* Resources */}
                                <div>
                                    <h3 className="text-lg font-semibold mb-4">Resources</h3>
                                    <ul className="space-y-2">
                                        <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Documentation</a></li>
                                        <li><a href="#" className="text-gray-400 hover:text-white transition-colors">API Reference</a></li>
                                        <li><a href="#" className="text-gray-400 hover:text-white transition-colors">User Guide</a></li>
                                        <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Training Materials</a></li>
                                        <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Support Center</a></li>
                                        <li><a href="#" className="text-gray-400 hover:text-white transition-colors">System Status</a></li>
                                    </ul>
                                </div>

                                {/* Contact Info */}
                                <div>
                                    <h3 className="text-lg font-semibold mb-4">Contact Info</h3>
                                    <div className="space-y-3">
                                        <div className="flex items-start space-x-3">
                                            <MapPin className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" />
                                            <p className="text-gray-400 text-sm">
                                                NITDA Headquarters<br />
                                                Plot 28 Port Harcourt Crescent<br />
                                                Area 11, Garki, Abuja
                                            </p>
                                        </div>
                                        <div className="flex items-center space-x-3">
                                            <Phone className="w-5 h-5 text-gray-400" />
                                            <p className="text-gray-400 text-sm">+234 9 461 0005</p>
                                        </div>
                                        <div className="flex items-center space-x-3">
                                            <Mail className="w-5 h-5 text-gray-400" />
                                            <p className="text-gray-400 text-sm">info@nitda.gov.ng</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="border-t border-gray-800 mt-12 pt-8">
                                <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
                                    <p className="text-gray-400 text-sm">
                                        © 2025 NITDA - National Information Technology Development Agency. All rights reserved.
                                    </p>
                                    <div className="flex space-x-6">
                                        <a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">Privacy Policy</a>
                                        <a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">Terms of Service</a>
                                        <a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">Cookie Policy</a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </footer>
                </motion.section>
            </div>
        </>
    );
}

