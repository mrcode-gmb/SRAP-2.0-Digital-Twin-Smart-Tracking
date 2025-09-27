import { Head, useForm, Link } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { UserCog, ArrowLeft } from 'lucide-react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/Components/ui/Card';
import { Button } from '@/Components/ui/Button';
import { Input } from '@/Components/ui/Input';
import { Label } from '@/Components/ui/Label';

export default function EditUser({ user, departments }) {
    const { data, setData, put, processing, errors } = useForm({
        name: user.name || '',
        email: user.email || '',
        password: '',
        password_confirmation: '',
        role: user.role || '',
        department_id: user.department_id || ''
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        put(route('admin.users.update', user.id));
    };

    return (
        <AuthenticatedLayout>
            <Head title={`Edit User: ${user.name} - Admin`} />

            <div className="px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
                <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
                    <div className="flex items-center space-x-4">
                        <Link href={route('admin.users.index')}>
                            <Button variant="ghost" className="flex items-center text-gray-500 hover:text-gray-700">
                                <ArrowLeft className="w-4 h-4 mr-1" />
                                Back to Users
                            </Button>
                        </Link>
                        <div className="h-6 w-px bg-gray-300" />
                        <div className="flex items-center space-x-2">
                            <UserCog className="w-6 h-6 text-blue-600" />
                            <h1 className="text-2xl font-bold text-gray-900">Edit User: {user.name}</h1>
                        </div>
                    </div>
                </motion.div>

                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
                    <Card>
                        <CardHeader>
                            <CardTitle>User Information</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {/* Name Field */}
                                    <div className="space-y-2">
                                        <Label htmlFor="name">Full Name *</Label>
                                        <Input
                                            id="name"
                                            type="text"
                                            value={data.name}
                                            onChange={(e) => setData('name', e.target.value)}
                                            placeholder="Enter full name"
                                            className={errors.name ? 'border-red-500' : ''}
                                            required
                                        />
                                        {errors.name && <p className="text-sm text-red-600">{errors.name}</p>}
                                    </div>

                                    {/* Email Field */}
                                    <div className="space-y-2">
                                        <Label htmlFor="email">Email Address *</Label>
                                        <Input
                                            id="email"
                                            type="email"
                                            value={data.email}
                                            onChange={(e) => setData('email', e.target.value)}
                                            placeholder="Enter email address"
                                            className={errors.email ? 'border-red-500' : ''}
                                            required
                                        />
                                        {errors.email && <p className="text-sm text-red-600">{errors.email}</p>}
                                    </div>

                                    {/* Role Field */}
                                    <div className="space-y-2">
                                        <Label htmlFor="role">Role *</Label>
                                        <select
                                            id="role"
                                            value={data.role}
                                            onChange={(e) => setData('role', e.target.value)}
                                            className={`w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${errors.role ? 'border-red-500' : ''}`}
                                            required
                                        >
                                            <option value="">Select a role</option>
                                            <option value="admin">Administrator</option>
                                            <option value="manager">Manager</option>
                                            <option value="analyst">Data Analyst</option>
                                            <option value="researcher">Researcher</option>
                                            <option value="viewer">Viewer</option>
                                        </select>
                                        {errors.role && <p className="text-sm text-red-600">{errors.role}</p>}
                                    </div>

                                    {/* Department Field */}
                                    <div className="space-y-2">
                                        <Label htmlFor="department_id">Department</Label>
                                        <select
                                            id="department_id"
                                            value={data.department_id}
                                            onChange={(e) => setData('department_id', e.target.value)}
                                            className={`w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${errors.department_id ? 'border-red-500' : ''}`}
                                        >
                                            <option value="">Select a department</option>
                                            {departments.map((department) => (
                                                <option key={department.id} value={department.id}>
                                                    {department.name}
                                                </option>
                                            ))}
                                        </select>
                                        {errors.department_id && <p className="text-sm text-red-600">{errors.department_id}</p>}
                                    </div>
                                </div>

                                {/* Password Section */}
                                <div className="border-t pt-6">
                                    <h3 className="text-lg font-medium text-gray-900 mb-4">Change Password (Optional)</h3>
                                    <p className="text-sm text-gray-600 mb-4">Leave blank to keep current password</p>
                                    
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        {/* Password Field */}
                                        <div className="space-y-2">
                                            <Label htmlFor="password">New Password</Label>
                                            <Input
                                                id="password"
                                                type="password"
                                                value={data.password}
                                                onChange={(e) => setData('password', e.target.value)}
                                                placeholder="Enter new password"
                                                className={errors.password ? 'border-red-500' : ''}
                                            />
                                            {errors.password && <p className="text-sm text-red-600">{errors.password}</p>}
                                        </div>

                                        {/* Confirm Password Field */}
                                        <div className="space-y-2">
                                            <Label htmlFor="password_confirmation">Confirm New Password</Label>
                                            <Input
                                                id="password_confirmation"
                                                type="password"
                                                value={data.password_confirmation}
                                                onChange={(e) => setData('password_confirmation', e.target.value)}
                                                placeholder="Confirm new password"
                                                className={errors.password_confirmation ? 'border-red-500' : ''}
                                            />
                                            {errors.password_confirmation && <p className="text-sm text-red-600">{errors.password_confirmation}</p>}
                                        </div>
                                    </div>
                                </div>

                                {/* Submit Button */}
                                <div className="flex items-center justify-end space-x-4 pt-6 border-t">
                                    <Link href={route('admin.users.index')}>
                                        <Button type="button" variant="outline">
                                            Cancel
                                        </Button>
                                    </Link>
                                    <Button type="submit" disabled={processing}>
                                        {processing ? 'Updating...' : 'Update User'}
                                    </Button>
                                </div>
                            </form>
                        </CardContent>
                    </Card>
                </motion.div>
            </div>
        </AuthenticatedLayout>
    );
}
