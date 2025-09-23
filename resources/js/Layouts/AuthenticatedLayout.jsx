import { useState } from 'react';
import { Link, usePage } from '@inertiajs/react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Home, 
    Users, 
    Database, 
    BarChart3, 
    Shield, 
    Bot, 
    Settings, 
    Bell, 
    Search,
    Menu,
    X,
    Sun,
    Moon,
    LogOut,
    User,
    ChevronDown,
    Zap,
    Target,
    Calendar,
    Layers,
    AlertTriangle,
    FileText,
    Upload,
    MessageSquare,
    TrendingUp,
    Brain
} from 'lucide-react';
import { ThemeProvider, useTheme } from '@/Components/ThemeProvider';
import { Badge } from '@/Components/ui/Badge';
import { Button } from '@/Components/ui/Button';
import { getRoleConfig } from '@/lib/utils';

function ThemeToggle() {
    const { theme, setTheme } = useTheme();
    
    return (
        <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
            className="w-9 h-9"
        >
            <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            <span className="sr-only">Toggle theme</span>
        </Button>
    );
}

function Sidebar({ isOpen, onClose, user }) {
    const roleConfig = getRoleConfig(user.role);
    
    const navigationItems = [
        { name: 'Dashboard', href: '/dashboard', icon: Home, current: true },
        
        // Core SRAP Management - Available to all users
        { name: 'KPI Management', href: '/kpis', icon: Target },
        { name: 'Milestones', href: '/milestones', icon: Calendar },
        { name: 'SRAP Pillars', href: '/srap-pillars', icon: Layers },
        
        // AI & Analytics
        { name: 'AI Predictions', href: '/admin/ai-predictions', icon: Brain },
        { name: 'Analytics', href: '/dashboard/analyst/analytics', icon: TrendingUp },
        
        // Admin Features
        ...(user.role === 'admin' ? [
            { name: 'Alerts', href: '/admin/alerts', icon: AlertTriangle },
            { name: 'Reports', href: '/admin/reports', icon: FileText },
            { name: 'User Management', href: '/admin/users', icon: Users },
            { name: 'Data Upload', href: '/admin/progress-upload', icon: Upload },
            { name: 'Chatbot', href: '/admin/chatbot', icon: MessageSquare },
            { name: 'Scenarios', href: '/admin/scenarios', icon: BarChart3 },
            { name: 'System Settings', href: '/dashboard/admin/settings', icon: Settings },
        ] : []),
        
        // Role-specific features
        ...(user.role === 'researcher' ? [
            { name: 'Data Upload', href: '/dashboard/researcher/upload', icon: Database },
            { name: 'Research Reports', href: '/dashboard/researcher/reports', icon: FileText },
        ] : []),
        ...(user.role === 'data_analyst' ? [
            { name: 'KPI Reports', href: '/dashboard/analyst/kpi', icon: Database },
        ] : []),
        ...(user.role === 'cybersecurity_specialist' ? [
            { name: 'Security Dashboard', href: '/dashboard/security/overview', icon: Shield },
            { name: 'API Monitoring', href: '/dashboard/security/api', icon: Database },
        ] : []),
        ...(user.role === 'ai_developer' ? [
            { name: 'AI Chatbot', href: '/dashboard/ai/chatbot', icon: Bot },
            { name: 'AI Models', href: '/dashboard/ai/models', icon: Database },
        ] : []),
        
        // Data Officer Features
        ...(user.role === 'data_officer' ? [
            { name: 'Upload Data', href: '/admin/progress-upload/create', icon: Upload },
            { name: 'My Uploads', href: '/admin/progress-upload', icon: FileText },
            { name: 'Upload History', href: '/dashboard/data-officer/reports', icon: Database },
        ] : []),
        
        // HOD Features
        ...(user.role === 'hod' ? [
            { name: 'Pending Approvals', href: '/dashboard/hod/approvals', icon: AlertTriangle },
            { name: 'Department Overview', href: '/dashboard/hod/department-overview', icon: BarChart3 },
            { name: 'Upload History', href: '/admin/progress-upload', icon: FileText },
        ] : []),
    ];

    return (
        <>
            {/* Desktop Sidebar - Always visible */}
            <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-64 lg:flex-col">
                <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700">
                    {/* Logo */}
                    <div className="flex h-16 items-center justify-center px-6 border-b border-gray-200 dark:border-gray-700">
                        <div className="flex items-center">
                            <Zap className="h-8 w-8 text-blue-600" />
                            <span className="ml-2 text-xl font-bold text-gray-900 dark:text-white">
                                SRAP 2.0
                            </span>
                        </div>
                    </div>

                    {/* User Info */}
                    <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                        <div className="flex items-center">
                            <div className="flex-shrink-0">
                                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                                    <span className="text-white font-semibold text-sm">
                                        {user.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                                    </span>
                                </div>
                            </div>
                            <div className="ml-3">
                                <p className="text-sm font-medium text-gray-900 dark:text-white">
                                    {user.name}
                                </p>
                                <Badge className="text-xs bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300">
                                    {user.role_display_name || user.role}
                                </Badge>
                            </div>
                        </div>
                    </div>

                    {/* Navigation */}
                    <nav className="flex-1 px-6 pb-4">
                        <ul className="space-y-1">
                            {navigationItems.map((item) => (
                                <li key={item.name ?? ''}>
                                    <Link
                                        href={item.href ?? '#'}
                                        className="group flex items-center px-3 py-2 text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white transition-colors"
                                    >
                                        <item.icon className="mr-3 h-5 w-5 flex-shrink-0" />
                                        {item.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </nav>
                </div>
            </div>

            {/* Mobile Sidebar */}
            <AnimatePresence>
                {isOpen && (
                    <>
                        {/* Overlay */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-gray-600 bg-opacity-75 z-20 lg:hidden"
                            onClick={onClose}
                        />
                        
                        {/* Mobile Sidebar */}
                        <motion.div
                            initial={{ x: -300 }}
                            animate={{ x: 0 }}
                            exit={{ x: -300 }}
                            transition={{ type: "spring", damping: 25, stiffness: 200 }}
                            className="fixed inset-y-0 left-0 z-30 w-64 bg-white dark:bg-gray-900 shadow-xl lg:hidden"
                        >
                            <div className="flex h-full flex-col">
                                {/* Logo */}
                                <div className="flex h-16 items-center justify-between px-6 border-b border-gray-200 dark:border-gray-700">
                                    <div className="flex items-center">
                                        <Zap className="h-8 w-8 text-blue-600" />
                                        <span className="ml-2 text-xl font-bold text-gray-900 dark:text-white">
                                            SRAP 2.0
                                        </span>
                                    </div>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={onClose}
                                        className="lg:hidden"
                                    >
                                        <X className="h-5 w-5" />
                                    </Button>
                                </div>

                                {/* User Info */}
                                <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                                    <div className="flex items-center">
                                        <div className="flex-shrink-0">
                                            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                                                <span className="text-white font-semibold text-sm">
                                                    {user.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="ml-3">
                                            <p className="text-sm font-medium text-gray-900 dark:text-white">
                                                {user.name}
                                            </p>
                                            <Badge className="text-xs bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300">
                                                {user.role_display_name || user.role}
                                            </Badge>
                                        </div>
                                    </div>
                                </div>

                                {/* Navigation */}
                                <nav className="flex-1 px-6 pb-4">
                                    <ul className="space-y-1">
                                        {navigationItems.map((item) => (
                                            <li key={item.name ?? ''}>
                                                <Link
                                                    href={item.href ?? '#'}
                                                    className="group flex items-center px-3 py-2 text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white transition-colors"
                                                >
                                                    <item.icon className="mr-3 h-5 w-5 flex-shrink-0" />
                                                    {item.name ?? ''}
                                                </Link>
                                            </li>
                                        ))}
                                    </ul>
                                </nav>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </>
    );
}

function TopNavbar({ onMenuClick, user }) {
    const [showUserMenu, setShowUserMenu] = useState(false);

    return (
        <header className="bg-white dark:bg-gray-900 shadow-sm border-b border-gray-200 dark:border-gray-700">
            <div className="flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
                {/* Left side */}
                <div className="flex items-center">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={onMenuClick}
                        className="lg:hidden"
                    >
                        <Menu className="h-5 w-5" />
                    </Button>
                    
                    <div className="hidden lg:block">
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                            SRAP 2.0 Digital Twin – Smart Tracking
                        </h1>
                    </div>
                </div>

                {/* Right side */}
                <div className="flex items-center space-x-4">
                    {/* Search */}
                    <div className="hidden md:block">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search..."
                                className="pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>
                    </div>

                    {/* Notifications */}
                    <Button variant="ghost" size="icon" className="relative">
                        <Bell className="h-5 w-5" />
                        <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 rounded-full text-xs text-white flex items-center justify-center">
                            3
                        </span>
                    </Button>

                    {/* Theme Toggle */}
                    <ThemeToggle />

                    {/* User Menu */}
                    <div className="relative">
                        <Button
                            variant="ghost"
                            onClick={() => setShowUserMenu(!showUserMenu)}
                            className="flex items-center space-x-2"
                        >
                            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                                <span className="text-white font-semibold text-xs">
                                    {user.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                                </span>
                            </div>
                            <ChevronDown className="h-4 w-4" />
                        </Button>

                        <AnimatePresence>
                            {showUserMenu && (
                                <motion.div
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg border border-gray-200 dark:border-gray-700 z-50"
                                >
                                    <div className="py-1">
                                        <Link
                                            href="/profile"
                                            className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                                        >
                                            <User className="mr-3 h-4 w-4" />
                                            Profile
                                        </Link>
                                        <Link
                                            href="/logout"
                                            method="post"
                                            as="button"
                                            className="flex w-full items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                                        >
                                            <LogOut className="mr-3 h-4 w-4" />
                                            Sign out
                                        </Link>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </div>
        </header>
    );
}

export default function AuthenticatedLayout({ children }) {
    const user = usePage().props.auth.user;
    
    const [sidebarOpen, setSidebarOpen] = useState(false);

    return (
        <ThemeProvider defaultTheme="light" storageKey="nitda-theme">
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
                {/* Sidebar */}
                <Sidebar 
                    isOpen={sidebarOpen} 
                    onClose={() => setSidebarOpen(false)} 
                    user={user}
                />

                {/* Main content */}
                <div className="lg:pl-64">
                    {/* Top navbar */}
                    <TopNavbar 
                        onMenuClick={() => setSidebarOpen(true)} 
                        user={user}
                    />

                    {/* Page content */}
                    <main className="py-6">
                        {children}
                    </main>
                </div>
            </div>
        </ThemeProvider>
    );
}
