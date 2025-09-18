import { Head, Link, usePage } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { 
    Users, 
    Database, 
    BarChart3, 
    Shield, 
    Bot, 
    Settings,
    Upload,
    FileText,
    TrendingUp,
    Activity,
    Zap,
    Clock,
    CheckCircle,
    AlertTriangle,
    Target,
    AlertCircle,
    ArrowUpRight,
    ArrowDownRight,
    Bell,
    Calendar,
    Eye,
    Cpu,
    Globe,
    Sparkles,
    PieChart,
    LineChart
} from 'lucide-react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/Components/ui/Card';
import { Button } from '@/Components/ui/Button';
import { Badge } from '@/Components/ui/Badge';
import { Progress } from '@/Components/ui/Progress';
import { getRoleConfig } from '@/lib/utils';

export default function Dashboard() {
    const { auth, stats, pillarProgress, recentAlerts, upcomingMilestones, departmentPerformance, chartData } = usePage().props;
    const user = auth.user;
    const roleConfig = getRoleConfig(user.role);

    // Get current time for greeting
    const currentHour = new Date().getHours();
    const getGreeting = () => {
        if (currentHour < 12) return 'Good morning';
        if (currentHour < 17) return 'Good afternoon';
        return 'Good evening';
    };

    // Role-based welcome messages
    const getRoleMessage = () => {
        switch(user.role) {
            case 'admin':
                return 'Manage your digital ecosystem with precision and control.';
            case 'researcher':
                return 'Drive innovation through data-driven research insights.';
            case 'data_analyst':
                return 'Transform raw data into actionable intelligence.';
            case 'cybersecurity_specialist':
                return 'Safeguard our digital infrastructure with advanced security.';
            case 'ai_developer':
                return 'Build the future with intelligent AI solutions.';
            default:
                return 'Welcome to your intelligent dashboard experience.';
        }
    };

    // KPI Stats Data - use real data from controller or fallback to mock data
    const kpiStats = stats ? [
        {
            title: 'Total KPIs',
            value: stats.total_kpis?.toString() || '0',
            change: '+12%',
            trend: 'up',
            color: 'blue',
            icon: Target
        },
        {
            title: 'On Track',
            value: stats.on_track_kpis?.toString() || '0',
            change: '+8%',
            trend: 'up',
            color: 'green',
            icon: CheckCircle
        },
        {
            title: 'At Risk',
            value: stats.at_risk_kpis?.toString() || '0',
            change: '-5%',
            trend: 'down',
            color: 'yellow',
            icon: AlertTriangle
        },
        {
            title: 'Completed',
            value: stats.completed_kpis?.toString() || '0',
            change: '+23%',
            trend: 'up',
            color: 'purple',
            icon: Activity
        }
    ] : [
        {
            title: 'Total KPIs',
            value: '247',
            change: '+12%',
            trend: 'up',
            color: 'blue',
            icon: Target
        },
        {
            title: 'On Track',
            value: '189',
            change: '+8%',
            trend: 'up',
            color: 'green',
            icon: CheckCircle
        },
        {
            title: 'At Risk',
            value: '34',
            change: '-5%',
            trend: 'down',
            color: 'yellow',
            icon: AlertTriangle
        },
        {
            title: 'Completed',
            value: '156',
            change: '+23%',
            trend: 'up',
            color: 'purple',
            icon: Activity
        }
    ];

    // Latest Updates/Alerts
    const latestUpdates = [
        {
            id: 1,
            type: 'success',
            title: 'Q3 Research Data Successfully Uploaded',
            description: '2,450 new data points processed',
            time: '2 minutes ago',
            icon: Database
        },
        {
            id: 2,
            type: 'warning',
            title: 'API Response Time Alert',
            description: 'Analytics API showing 15% slower response',
            time: '15 minutes ago',
            icon: AlertCircle
        },
        {
            id: 3,
            type: 'info',
            title: 'AI Model Training Completed',
            description: 'New predictive model ready for deployment',
            time: '1 hour ago',
            icon: Bot
        },
        {
            id: 4,
            type: 'success',
            title: 'Security Scan Completed',
            description: 'No vulnerabilities detected in latest scan',
            time: '3 hours ago',
            icon: Shield
        }
    ];

    // Role-based quick access shortcuts
    const getQuickAccessShortcuts = () => {
        const shortcuts = {
            admin: [
                {
                    title: 'Manage Users',
                    description: 'User accounts & permissions',
                    icon: Users,
                    color: 'from-blue-500 to-blue-600',
                    href: '/dashboard/admin/users'
                },
                {
                    title: 'System Settings',
                    description: 'Configure system parameters',
                    icon: Settings,
                    color: 'from-gray-500 to-gray-600',
                    href: '/dashboard/admin/settings'
                }
            ],
            researcher: [
                {
                    title: 'Upload Data',
                    description: 'Import research datasets',
                    icon: Upload,
                    color: 'from-green-500 to-green-600',
                    href: '/dashboard/researcher/upload'
                },
                {
                    title: 'Research Reports',
                    description: 'Generate analysis reports',
                    icon: FileText,
                    color: 'from-orange-500 to-orange-600',
                    href: '/dashboard/researcher/reports'
                }
            ],
            data_analyst: [
                {
                    title: 'View KPI Charts',
                    description: 'Interactive analytics dashboard',
                    icon: BarChart3,
                    color: 'from-purple-500 to-purple-600',
                    href: '/dashboard/analyst/analytics'
                },
                {
                    title: 'Performance Metrics',
                    description: 'Track key indicators',
                    icon: TrendingUp,
                    color: 'from-teal-500 to-teal-600',
                    href: '/dashboard/analyst/kpi'
                }
            ],
            cybersecurity_specialist: [
                {
                    title: 'Check API Security',
                    description: 'Monitor security status',
                    icon: Shield,
                    color: 'from-red-500 to-red-600',
                    href: '/dashboard/security/overview'
                },
                {
                    title: 'Threat Detection',
                    description: 'Real-time security alerts',
                    icon: Eye,
                    color: 'from-yellow-500 to-yellow-600',
                    href: '/dashboard/security/api'
                }
            ],
            ai_developer: [
                {
                    title: 'AI Insights',
                    description: 'Test chatbot performance',
                    icon: Bot,
                    color: 'from-cyan-500 to-cyan-600',
                    href: '/dashboard/ai/chatbot'
                },
                {
                    title: 'Model Training',
                    description: 'Manage AI models',
                    icon: Cpu,
                    color: 'from-indigo-500 to-indigo-600',
                    href: '/dashboard/ai/models'
                }
            ]
        };

        return shortcuts[user.role] || [];
    };

    const quickAccessShortcuts = getQuickAccessShortcuts();

    // Mock project stats data
    const projectStats = [
        { name: 'Total Projects', value: '24', change: '+12%', changeType: 'increase' },
        { name: 'Active Users', value: '156', change: '+8%', changeType: 'increase' },
        { name: 'Data Points', value: '2.4M', change: '+23%', changeType: 'increase' },
        { name: 'System Uptime', value: '99.9%', change: '0%', changeType: 'neutral' }
    ];

    return (
        <AuthenticatedLayout>
            <Head title="SRAP 2.0 Digital Twin – Smart Tracking" />

            <div className="px-4 sm:px-6 lg:px-8">
                {/* Hero Header Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="mb-8"
                >
                    <div className="relative bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 rounded-3xl p-8 lg:p-12 text-white overflow-hidden">
                        {/* Animated background elements */}
                        <div className="absolute inset-0 overflow-hidden">
                            <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl"></div>
                            <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl"></div>
                            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl"></div>
                        </div>
                        
                        <div className="relative z-10">
                            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                                <div className="mb-6 lg:mb-0">
                                    <motion.div
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ duration: 0.6, delay: 0.2 }}
                                        className="flex items-center mb-4"
                                    >
                                        <Sparkles className="w-8 h-8 text-cyan-400 mr-3" />
                                        <h1 className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-white to-cyan-200 bg-clip-text text-transparent">
                                            SRAP 2.0 Digital Twin
                                        </h1>
                                    </motion.div>
                                    
                                    <motion.p
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ duration: 0.6, delay: 0.3 }}
                                        className="text-xl text-blue-200 mb-2"
                                    >
                                        Smart Tracking Dashboard
                                    </motion.p>
                                    
                                    <motion.p
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ duration: 0.6, delay: 0.4 }}
                                        className="text-gray-300 mb-6"
                                    >
                                        AI-powered dashboard for monitoring NITDA's Strategic Roadmap & Action Plan
                                    </motion.p>
                                    
                                    <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.6, delay: 0.5 }}
                                        className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20"
                                    >
                                        <h2 className="text-2xl font-semibold mb-2">
                                            {getGreeting()}, {user.name.split(' ')[0]}! 👋
                                        </h2>
                                        <p className="text-blue-200 mb-4">
                                            {getRoleMessage()}
                                        </p>
                                        <div className="flex flex-wrap items-center gap-4">
                                            <Badge className="bg-gradient-to-r from-cyan-500 to-blue-500 text-white border-0 px-4 py-2">
                                                {roleConfig.name || user.role}
                                            </Badge>
                                            <div className="flex items-center text-gray-300">
                                                <Clock className="w-4 h-4 mr-2" />
                                                Last login: Today at 9:30 AM
                                            </div>
                                        </div>
                                    </motion.div>
                                </div>
                                
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ duration: 0.8, delay: 0.3 }}
                                    className="hidden lg:block"
                                >
                                    <div className="relative">
                                        <div className="w-32 h-32 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-full flex items-center justify-center">
                                            <Globe className="w-16 h-16 text-white" />
                                        </div>
                                        <div className="absolute -top-2 -right-2 w-8 h-8 bg-green-400 rounded-full flex items-center justify-center">
                                            <div className="w-3 h-3 bg-white rounded-full animate-pulse"></div>
                                        </div>
                                    </div>
                                </motion.div>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* KPI Stats Overview */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.1 }}
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
                >
                    {kpiStats.map((stat, index) => {
                        const IconComponent = stat.icon;
                        const colorClasses = {
                            blue: 'from-blue-500 to-blue-600 text-blue-50',
                            green: 'from-green-500 to-green-600 text-green-50',
                            yellow: 'from-yellow-500 to-yellow-600 text-yellow-50',
                            purple: 'from-purple-500 to-purple-600 text-purple-50'
                        };
                        
                        return (
                            <motion.div
                                key={stat.title}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: 0.1 + index * 0.1 }}
                            >
                                <Card className="relative overflow-hidden bg-white dark:bg-gray-800 border-0 shadow-lg hover:shadow-xl transition-all duration-300 group">
                                    <CardContent className="p-6">
                                        <div className="flex items-center justify-between mb-4">
                                            <div className={`p-3 rounded-xl bg-gradient-to-r ${colorClasses[stat.color]} shadow-lg`}>
                                                <IconComponent className="w-6 h-6" />
                                            </div>
                                            <div className={`flex items-center text-sm font-medium ${
                                                stat.trend === 'up' ? 'text-green-600' : 'text-red-600'
                                            }`}>
                                                {stat.trend === 'up' ? (
                                                    <ArrowUpRight className="w-4 h-4 mr-1" />
                                                ) : (
                                                    <ArrowDownRight className="w-4 h-4 mr-1" />
                                                )}
                                                {stat.change}
                                            </div>
                                        </div>
                                        <div>
                                            <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                                                {stat.title}
                                            </h3>
                                            <p className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
                                                {stat.value}
                                            </p>
                                            <p className="text-xs text-gray-500 dark:text-gray-400">
                                                vs last period
                                            </p>
                                        </div>
                                    </CardContent>
                                    
                                    {/* Hover effect */}
                                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
                                </Card>
                            </motion.div>
                        );
                    })}
                </motion.div>

                {/* SRAP Pillar Progress */}
                {pillarProgress && pillarProgress.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.15 }}
                        className="mb-8"
                    >
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                            SRAP 2.0 Pillar Progress
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {pillarProgress.map((pillar, index) => (
                                <motion.div
                                    key={pillar.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.6, delay: 0.15 + index * 0.1 }}
                                >
                                    <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                                        <CardHeader className="pb-3">
                                            <div className="flex items-center justify-between">
                                                <CardTitle className="text-lg font-semibold">
                                                    {pillar.name}
                                                </CardTitle>
                                                <Badge 
                                                    className="text-xs"
                                                    style={{ backgroundColor: pillar.color }}
                                                >
                                                    {pillar.code}
                                                </Badge>
                                            </div>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="space-y-4">
                                                <div className="flex items-center justify-between text-sm">
                                                    <span className="text-gray-600 dark:text-gray-400">Progress</span>
                                                    <span className="font-bold text-gray-900 dark:text-white">
                                                        {pillar.progress}%
                                                    </span>
                                                </div>
                                                <Progress 
                                                    value={pillar.progress} 
                                                    className="h-3"
                                                    style={{ 
                                                        '--progress-background': pillar.color,
                                                        '--progress-foreground': pillar.color 
                                                    }}
                                                />
                                                <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                                                    <span>{pillar.completed_kpis} completed</span>
                                                    <span>{pillar.total_kpis} total KPIs</span>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                )}

                {/* Role-Based Quick Access Shortcuts */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="mb-8"
                >
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                        Quick Access
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {quickAccessShortcuts.map((shortcut, index) => {
                            const IconComponent = shortcut.icon;
                            return (
                                <motion.div
                                    key={shortcut.title}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.6, delay: 0.2 + index * 0.1 }}
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                >
                                    <Link href={shortcut.href}>
                                        <Card className="relative overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer border-0 shadow-lg group">
                                            <CardContent className="p-6">
                                                <div className="flex items-center space-x-4">
                                                    <div className={`p-4 rounded-xl bg-gradient-to-r ${shortcut.color} shadow-lg`}>
                                                        <IconComponent className="w-6 h-6 text-white" />
                                                    </div>
                                                    <div className="flex-1">
                                                        <h3 className="font-bold text-gray-900 dark:text-white mb-2 text-lg">
                                                            {shortcut.title}
                                                        </h3>
                                                        <p className="text-sm text-gray-600 dark:text-gray-400">
                                                            {shortcut.description}
                                                        </p>
                                                    </div>
                                                    <ArrowUpRight className="w-5 h-5 text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300 transition-colors" />
                                                </div>
                                            </CardContent>
                                            
                                            {/* Hover effect */}
                                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
                                        </Card>
                                    </Link>
                                </motion.div>
                            );
                        })}
                    </div>
                </motion.div>

                {/* Latest Updates & Alerts */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.3 }}
                    className="mb-8"
                >
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                            Latest Updates
                        </h2>
                        <Button variant="outline" size="sm" className="flex items-center gap-2">
                            <Bell className="w-4 h-4" />
                            View All
                        </Button>
                    </div>
                    
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {latestUpdates.map((update, index) => {
                            const IconComponent = update.icon;
                            const typeColors = {
                                success: 'from-green-500 to-green-600 text-green-50',
                                warning: 'from-yellow-500 to-yellow-600 text-yellow-50',
                                info: 'from-blue-500 to-blue-600 text-blue-50',
                                error: 'from-red-500 to-red-600 text-red-50'
                            };
                            
                            return (
                                <motion.div
                                    key={update.id}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
                                >
                                    <Card className="hover:shadow-lg transition-all duration-300 border-0 shadow-md">
                                        <CardContent className="p-6">
                                            <div className="flex items-start space-x-4">
                                                <div className={`p-3 rounded-xl bg-gradient-to-r ${typeColors[update.type]} shadow-lg flex-shrink-0`}>
                                                    <IconComponent className="w-5 h-5" />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center justify-between mb-2">
                                                        <h3 className="font-semibold text-gray-900 dark:text-white text-sm">
                                                            {update.title}
                                                        </h3>
                                                        <Badge variant="secondary" className="text-xs">
                                                            {update.time}
                                                        </Badge>
                                                    </div>
                                                    <p className="text-sm text-gray-600 dark:text-gray-400">
                                                        {update.description}
                                                    </p>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </motion.div>
                            );
                        })}
                    </div>
                </motion.div>

                {/* Interactive Widgets */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                    className="grid grid-cols-1 lg:grid-cols-3 gap-6"
                >
                    {/* System Status Widget */}
                    <Card className="border-0 shadow-lg">
                        <CardHeader className="pb-3">
                            <CardTitle className="flex items-center text-lg">
                                <Globe className="w-5 h-5 mr-2 text-green-500" />
                                System Status
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-gray-600 dark:text-gray-400">API Services</span>
                                    <div className="flex items-center">
                                        <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
                                        <span className="text-sm font-medium text-green-600">Online</span>
                                    </div>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-gray-600 dark:text-gray-400">Database</span>
                                    <div className="flex items-center">
                                        <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
                                        <span className="text-sm font-medium text-green-600">Healthy</span>
                                    </div>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-gray-600 dark:text-gray-400">Security</span>
                                    <div className="flex items-center">
                                        <div className="w-2 h-2 bg-yellow-500 rounded-full mr-2 animate-pulse"></div>
                                        <span className="text-sm font-medium text-yellow-600">Monitoring</span>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Quick Stats Widget */}
                    <Card className="border-0 shadow-lg">
                        <CardHeader className="pb-3">
                            <CardTitle className="flex items-center text-lg">
                                <Zap className="w-5 h-5 mr-2 text-purple-500" />
                                Performance
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-gray-600 dark:text-gray-400">Response Time</span>
                                    <span className="text-sm font-bold text-gray-900 dark:text-white">142ms</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-gray-600 dark:text-gray-400">Throughput</span>
                                    <span className="text-sm font-bold text-gray-900 dark:text-white">2.4k/min</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-gray-600 dark:text-gray-400">Error Rate</span>
                                    <span className="text-sm font-bold text-green-600">0.02%</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Upcoming Tasks Widget */}
                    <Card className="border-0 shadow-lg">
                        <CardHeader className="pb-3">
                            <CardTitle className="flex items-center text-lg">
                                <Calendar className="w-5 h-5 mr-2 text-blue-500" />
                                Upcoming
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-3">
                                <div className="flex items-start space-x-3">
                                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                                    <div>
                                        <p className="text-sm font-medium text-gray-900 dark:text-white">Q4 Review</p>
                                        <p className="text-xs text-gray-500 dark:text-gray-400">Tomorrow, 2:00 PM</p>
                                    </div>
                                </div>
                                <div className="flex items-start space-x-3">
                                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                                    <div>
                                        <p className="text-sm font-medium text-gray-900 dark:text-white">Data Backup</p>
                                        <p className="text-xs text-gray-500 dark:text-gray-400">Friday, 11:00 PM</p>
                                    </div>
                                </div>
                                <div className="flex items-start space-x-3">
                                    <div className="w-2 h-2 bg-purple-500 rounded-full mt-2"></div>
                                    <div>
                                        <p className="text-sm font-medium text-gray-900 dark:text-white">Model Training</p>
                                        <p className="text-xs text-gray-500 dark:text-gray-400">Next Week</p>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>
            </div>
        </AuthenticatedLayout>
    );
}
