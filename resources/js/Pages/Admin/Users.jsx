import { Head } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { Users, UserPlus, Search, Filter, MoreHorizontal, Edit, Trash2, Shield } from 'lucide-react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/Components/ui/Card';
import { Button } from '@/Components/ui/Button';
import { Badge } from '@/Components/ui/Badge';
import { Input } from '@/Components/ui/Input';

export default function AdminUsers() {
    // Mock user data
    const users = [
        { id: 1, name: 'Abubakar Mohammed', email: 'abubakar@nitda.gov.ng', role: 'ai_developer', status: 'active', lastLogin: '2 hours ago' },
        { id: 2, name: 'Fatima Hassan', email: 'fatima@nitda.gov.ng', role: 'researcher', status: 'active', lastLogin: '1 day ago' },
        { id: 3, name: 'Ibrahim Yusuf', email: 'ibrahim@nitda.gov.ng', role: 'data_analyst', status: 'inactive', lastLogin: '3 days ago' },
        { id: 4, name: 'Khadija Abdullahi', email: 'khadija@nitda.gov.ng', role: 'cybersecurity_specialist', status: 'active', lastLogin: '5 minutes ago' },
        { id: 5, name: 'Musa Garba', email: 'musa@nitda.gov.ng', role: 'researcher', status: 'active', lastLogin: '1 hour ago' },
    ];

    const roleColors = {
        admin: 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300',
        researcher: 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300',
        data_analyst: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300',
        cybersecurity_specialist: 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-300',
        ai_developer: 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-300',
    };

    const roleNames = {
        admin: 'Administrator',
        researcher: 'Researcher',
        data_analyst: 'Data Analyst',
        cybersecurity_specialist: 'Cybersecurity Specialist',
        ai_developer: 'AI Developer',
    };

    return (
        <AuthenticatedLayout>
            <Head title="User Management - Admin" />

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
                                <Users className="w-8 h-8 mr-3 text-blue-600" />
                                User Management
                            </h1>
                            <p className="text-gray-600 dark:text-gray-400 mt-2">
                                Manage system users, roles, and permissions
                            </p>
                        </div>
                        <Button className="bg-blue-600 hover:bg-blue-700">
                            <UserPlus className="w-4 h-4 mr-2" />
                            Add User
                        </Button>
                    </div>
                </motion.div>

                {/* Stats Cards */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.1 }}
                    className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8"
                >
                    <Card>
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Users</p>
                                    <p className="text-3xl font-bold text-gray-900 dark:text-white">156</p>
                                </div>
                                <Users className="w-8 h-8 text-blue-600" />
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Active Users</p>
                                    <p className="text-3xl font-bold text-gray-900 dark:text-white">142</p>
                                </div>
                                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">New This Month</p>
                                    <p className="text-3xl font-bold text-gray-900 dark:text-white">24</p>
                                </div>
                                <UserPlus className="w-8 h-8 text-green-600" />
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Admin Users</p>
                                    <p className="text-3xl font-bold text-gray-900 dark:text-white">8</p>
                                </div>
                                <Shield className="w-8 h-8 text-red-600" />
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>

                {/* Users Table */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                >
                    <Card>
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <div>
                                    <CardTitle>System Users</CardTitle>
                                    <CardDescription>
                                        Manage user accounts and permissions
                                    </CardDescription>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <div className="relative">
                                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                                        <Input
                                            placeholder="Search users..."
                                            className="pl-10 w-64"
                                        />
                                    </div>
                                    <Button variant="outline" size="icon">
                                        <Filter className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead>
                                        <tr className="border-b border-gray-200 dark:border-gray-700">
                                            <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">User</th>
                                            <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">Role</th>
                                            <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">Status</th>
                                            <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">Last Login</th>
                                            <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {users.map((user, index) => (
                                            <motion.tr
                                                key={user.id}
                                                initial={{ opacity: 0, y: 20 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ duration: 0.4, delay: index * 0.1 }}
                                                className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50"
                                            >
                                                <td className="py-4 px-4">
                                                    <div className="flex items-center space-x-3">
                                                        <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                                                            <span className="text-white font-semibold text-sm">
                                                                {user.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                                                            </span>
                                                        </div>
                                                        <div>
                                                            <p className="font-medium text-gray-900 dark:text-white">{user.name}</p>
                                                            <p className="text-sm text-gray-500 dark:text-gray-400">{user.email}</p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="py-4 px-4">
                                                    <Badge className={roleColors[user.role]}>
                                                        {roleNames[user.role]}
                                                    </Badge>
                                                </td>
                                                <td className="py-4 px-4">
                                                    <div className="flex items-center space-x-2">
                                                        <div className={`w-2 h-2 rounded-full ${
                                                            user.status === 'active' ? 'bg-green-500' : 'bg-gray-400'
                                                        }`}></div>
                                                        <span className={`text-sm font-medium ${
                                                            user.status === 'active' 
                                                                ? 'text-green-700 dark:text-green-400' 
                                                                : 'text-gray-500 dark:text-gray-400'
                                                        }`}>
                                                            {user.status === 'active' ? 'Active' : 'Inactive'}
                                                        </span>
                                                    </div>
                                                </td>
                                                <td className="py-4 px-4">
                                                    <span className="text-sm text-gray-600 dark:text-gray-400">
                                                        {user.lastLogin}
                                                    </span>
                                                </td>
                                                <td className="py-4 px-4">
                                                    <div className="flex items-center space-x-2">
                                                        <Button variant="ghost" size="icon">
                                                            <Edit className="h-4 w-4" />
                                                        </Button>
                                                        <Button variant="ghost" size="icon">
                                                            <Trash2 className="h-4 w-4 text-red-600" />
                                                        </Button>
                                                        <Button variant="ghost" size="icon">
                                                            <MoreHorizontal className="h-4 w-4" />
                                                        </Button>
                                                    </div>
                                                </td>
                                            </motion.tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>
            </div>
        </AuthenticatedLayout>
    );
}
