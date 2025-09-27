import { Head, useForm, Link } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { UserPlus, ArrowLeft } from 'lucide-react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/Components/ui/Card';
import { Button } from '@/Components/ui/Button';
import { Input } from '@/Components/ui/Input';
import { Label } from '@/Components/ui/Label';

export default function CreateUser({ departments }) {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
        role: '',
        department_id: ''
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('admin.users.store'));
    };

    return (
        <AuthenticatedLayout>
            <Head title="Create User - Admin" />

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
                            <UserPlus className="w-6 h-6 text-blue-600" />
                            <h1 className="text-2xl font-bold text-gray-900">Create New User</h1>
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
                                    <div className="space-y-2">
                                        <Label htmlFor="name">Full Name *</Label>
                                        <Input
                                            id="name"
                                            type="text"
                                            value={data.name}
                                            onChange={(e) => setData('name', e.target.value)}
                                            placeholder="Enter full name"
                                            className={errors.name ? 'border-red-500' : ''}
                                        />
                                        {errors.name && <p className="text-sm text-red-600">{errors.name}</p>}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="email">Email Address *</Label>
                                        <Input
                                            id="email"
                                            type="email"
                                            value={data.email}
                                            onChange={(e) => setData('email', e.target.value)}
                                            placeholder="Enter email address"
                                            className={errors.email ? 'border-red-500' : ''}
                                        />
                                        {errors.email && <p className="text-sm text-red-600">{errors.email}</p>}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="password">Password *</Label>
                                        <Input
                                            id="password"
                                            type="password"
                                            value={data.password}
                                            onChange={(e) => setData('password', e.target.value)}
                                            placeholder="Enter password (min 8 characters)"
                                            className={errors.password ? 'border-red-500' : ''}
                                        />
                                        {errors.password && <p className="text-sm text-red-600">{errors.password}</p>}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="password_confirmation">Confirm Password *</Label>
                                        <Input
                                            id="password_confirmation"
                                            type="password"
                                            value={data.password_confirmation}
                                            onChange={(e) => setData('password_confirmation', e.target.value)}
                                            placeholder="Confirm password"
                                            className={errors.password_confirmation ? 'border-red-500' : ''}
                                        />
                                        {errors.password_confirmation && <p className="text-sm text-red-600">{errors.password_confirmation}</p>}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="role">Role *</Label>
                                        <select
                                            id="role"
                                            value={data.role}
                                            onChange={(e) => setData('role', e.target.value)}
                                            className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.role ? 'border-red-500' : ''}`}
                                        >
                                            <option value="">Select a role</option>
                                            <option value="admin">Administrator</option>
                                            <option value="strategy_team">Strategy Team</option>
                                            <option value="department_user">Department User</option>
                                            <option value="data_analyst">Data Analyst</option>
                                            <option value="cybersecurity_specialist">Cybersecurity Specialist</option>
                                            <option value="ai_developer">AI Developer</option>
                                            <option value="hod">Head of Department</option>
                                            <option value="data_officer">Data Officer</option>
                                        </select>
                                        {errors.role && <p className="text-sm text-red-600">{errors.role}</p>}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="department_id">Department</Label>
                                        <select
                                            id="department_id"
                                            value={data.department_id}
                                            onChange={(e) => setData('department_id', e.target.value)}
                                            className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.department_id ? 'border-red-500' : ''}`}
                                        >
                                            <option value="">No Department</option>
                                            {departments?.map((dept) => (
                                                <option key={dept.id} value={dept.id}>
                                                    {dept.name}
                                                </option>
                                            ))}
                                        </select>
                                        {errors.department_id && <p className="text-sm text-red-600">{errors.department_id}</p>}
                                    </div>
                                </div>

                                <div className="flex items-center justify-end space-x-4 pt-6 border-t">
                                    <Link href={route('admin.users.index')}>
                                        <Button type="button" variant="outline">Cancel</Button>
                                    </Link>
                                    <Button type="submit" disabled={processing} className="bg-blue-600 hover:bg-blue-700">
                                        {processing ? (
                                            <>
                                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                                Creating...
                                            </>
                                        ) : (
                                            <>
                                                <UserPlus className="w-4 h-4 mr-2" />
                                                Create User
                                            </>
                                        )}
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
