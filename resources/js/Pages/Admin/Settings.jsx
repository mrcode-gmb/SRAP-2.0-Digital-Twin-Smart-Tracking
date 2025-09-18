import { Head } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { 
    Settings, 
    Database, 
    Shield,
    Bell,
    Globe,
    Users,
    Mail,
    Server,
    Key,
    Monitor,
    Palette,
    Clock,
    Save,
    RefreshCw
} from 'lucide-react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/Components/ui/Card';
import { Button } from '@/Components/ui/Button';
import { Badge } from '@/Components/ui/Badge';

export default function AdminSettings() {
    const settingsCategories = [
        {
            id: 'general',
            title: 'General Settings',
            description: 'Basic system configuration and preferences',
            icon: Settings,
            color: 'from-blue-500 to-blue-600',
            settings: [
                { name: 'System Name', value: 'SRAP 2.0 Digital Twin', type: 'text' },
                { name: 'Default Language', value: 'English', type: 'select' },
                { name: 'Timezone', value: 'UTC+1', type: 'select' },
                { name: 'Maintenance Mode', value: 'Disabled', type: 'toggle' }
            ]
        },
        {
            id: 'database',
            title: 'Database Configuration',
            description: 'Database connection and performance settings',
            icon: Database,
            color: 'from-green-500 to-green-600',
            settings: [
                { name: 'Connection Pool Size', value: '20', type: 'number' },
                { name: 'Query Timeout', value: '30s', type: 'text' },
                { name: 'Auto Backup', value: 'Enabled', type: 'toggle' },
                { name: 'Backup Frequency', value: 'Daily', type: 'select' }
            ]
        },
        {
            id: 'security',
            title: 'Security Settings',
            description: 'Authentication and security configurations',
            icon: Shield,
            color: 'from-red-500 to-red-600',
            settings: [
                { name: 'Two-Factor Auth', value: 'Required', type: 'select' },
                { name: 'Session Timeout', value: '24 hours', type: 'select' },
                { name: 'Password Policy', value: 'Strong', type: 'select' },
                { name: 'API Rate Limiting', value: 'Enabled', type: 'toggle' }
            ]
        },
        {
            id: 'notifications',
            title: 'Notification Settings',
            description: 'Email and system notification preferences',
            icon: Bell,
            color: 'from-yellow-500 to-yellow-600',
            settings: [
                { name: 'Email Notifications', value: 'Enabled', type: 'toggle' },
                { name: 'System Alerts', value: 'Enabled', type: 'toggle' },
                { name: 'Daily Reports', value: 'Enabled', type: 'toggle' },
                { name: 'Error Notifications', value: 'Admins Only', type: 'select' }
            ]
        }
    ];

    const systemStats = [
        {
            title: 'System Uptime',
            value: '99.98%',
            icon: Monitor,
            color: 'text-green-600'
        },
        {
            title: 'Active Users',
            value: '156',
            icon: Users,
            color: 'text-blue-600'
        },
        {
            title: 'Database Size',
            value: '2.4 GB',
            icon: Database,
            color: 'text-purple-600'
        },
        {
            title: 'API Calls/Day',
            value: '12.5K',
            icon: Globe,
            color: 'text-orange-600'
        }
    ];

    return (
        <AuthenticatedLayout>
            <Head title="System Settings - SRAP 2.0" />

            <div className="px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="mb-8"
                >
                    <div className="bg-gradient-to-r from-gray-600 to-gray-800 rounded-2xl p-8 text-white">
                        <div className="flex items-center justify-between">
                            <div>
                                <h1 className="text-3xl font-bold mb-2">System Settings</h1>
                                <p className="text-gray-200">
                                    Configure and manage system-wide settings and preferences
                                </p>
                            </div>
                            <div className="hidden md:block">
                                <Settings className="w-16 h-16 text-gray-300" />
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* System Stats */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.1 }}
                    className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8"
                >
                    {systemStats.map((stat, index) => {
                        const IconComponent = stat.icon;
                        return (
                            <Card key={stat.title} className="border-0 shadow-lg">
                                <CardContent className="p-6">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                                                {stat.title}
                                            </p>
                                            <p className="text-2xl font-bold text-gray-900 dark:text-white">
                                                {stat.value}
                                            </p>
                                        </div>
                                        <div className="p-3 bg-gray-100 dark:bg-gray-800 rounded-xl">
                                            <IconComponent className={`w-6 h-6 ${stat.color}`} />
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        );
                    })}
                </motion.div>

                {/* Action Buttons */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="flex flex-wrap gap-4 mb-8"
                >
                    <Button className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800">
                        <Save className="w-4 h-4 mr-2" />
                        Save All Changes
                    </Button>
                    <Button variant="outline">
                        <RefreshCw className="w-4 h-4 mr-2" />
                        Reset to Defaults
                    </Button>
                    <Button variant="outline">
                        <Database className="w-4 h-4 mr-2" />
                        Backup Settings
                    </Button>
                </motion.div>

                {/* Settings Categories */}
                <div className="space-y-8">
                    {settingsCategories.map((category, categoryIndex) => {
                        const IconComponent = category.icon;
                        return (
                            <motion.div
                                key={category.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: 0.3 + categoryIndex * 0.1 }}
                            >
                                <Card className="border-0 shadow-lg">
                                    <CardHeader className="pb-4">
                                        <div className="flex items-center space-x-4">
                                            <div className={`p-3 rounded-xl bg-gradient-to-r ${category.color} shadow-lg`}>
                                                <IconComponent className="w-6 h-6 text-white" />
                                            </div>
                                            <div>
                                                <CardTitle className="text-xl">{category.title}</CardTitle>
                                                <CardDescription className="text-gray-600 dark:text-gray-400">
                                                    {category.description}
                                                </CardDescription>
                                            </div>
                                        </div>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            {category.settings.map((setting, settingIndex) => (
                                                <div key={settingIndex} className="space-y-2">
                                                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                                        {setting.name}
                                                    </label>
                                                    {setting.type === 'text' && (
                                                        <input
                                                            type="text"
                                                            defaultValue={setting.value}
                                                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                        />
                                                    )}
                                                    {setting.type === 'number' && (
                                                        <input
                                                            type="number"
                                                            defaultValue={setting.value}
                                                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                        />
                                                    )}
                                                    {setting.type === 'select' && (
                                                        <select
                                                            defaultValue={setting.value}
                                                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                        >
                                                            <option value={setting.value}>{setting.value}</option>
                                                        </select>
                                                    )}
                                                    {setting.type === 'toggle' && (
                                                        <div className="flex items-center space-x-3">
                                                            <button
                                                                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                                                                    setting.value === 'Enabled' 
                                                                        ? 'bg-blue-600' 
                                                                        : 'bg-gray-200 dark:bg-gray-700'
                                                                }`}
                                                            >
                                                                <span
                                                                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                                                        setting.value === 'Enabled' 
                                                                            ? 'translate-x-6' 
                                                                            : 'translate-x-1'
                                                                    }`}
                                                                />
                                                            </button>
                                                            <Badge variant={setting.value === 'Enabled' ? 'default' : 'secondary'}>
                                                                {setting.value}
                                                            </Badge>
                                                        </div>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        );
                    })}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
