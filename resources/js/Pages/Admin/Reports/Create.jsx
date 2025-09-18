import { Head, useForm, router } from '@inertiajs/react';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
    Save, 
    ArrowLeft, 
    FileText,
    Calendar,
    Building,
    Target,
    Filter,
    Download,
    BarChart3,
    PieChart,
    TrendingUp
} from 'lucide-react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/Components/ui/Card';
import { Button } from '@/Components/ui/Button';
import { Badge } from '@/Components/ui/Badge';

export default function Create({ kpis, pillars, departments }) {
    const { data, setData, post, processing, errors } = useForm({
        title: '',
        description: '',
        type: 'kpi_summary',
        format: 'pdf',
        kpi_ids: [],
        pillar_ids: [],
        department_ids: [],
        date_range: 'current_month',
        custom_start_date: '',
        custom_end_date: '',
        include_charts: true,
        include_analysis: true,
        include_recommendations: false
    });

    const [selectedKpis, setSelectedKpis] = useState([]);
    const [selectedPillars, setSelectedPillars] = useState([]);
    const [selectedDepartments, setSelectedDepartments] = useState([]);

    const handleSubmit = (e) => {
        e.preventDefault();
        
        // Update form data with selected items
        setData({
            ...data,
            kpi_ids: selectedKpis,
            pillar_ids: selectedPillars,
            department_ids: selectedDepartments
        });

        post(route('admin.reports.store'));
    };

    const handleKpiToggle = (kpiId) => {
        const updated = selectedKpis.includes(kpiId)
            ? selectedKpis.filter(id => id !== kpiId)
            : [...selectedKpis, kpiId];
        setSelectedKpis(updated);
    };

    const handlePillarToggle = (pillarId) => {
        const updated = selectedPillars.includes(pillarId)
            ? selectedPillars.filter(id => id !== pillarId)
            : [...selectedPillars, pillarId];
        setSelectedPillars(updated);
    };

    const handleDepartmentToggle = (departmentId) => {
        const updated = selectedDepartments.includes(departmentId)
            ? selectedDepartments.filter(id => id !== departmentId)
            : [...selectedDepartments, departmentId];
        setSelectedDepartments(updated);
    };

    const reportTypes = [
        { value: 'kpi_summary', label: 'KPI Summary Report', icon: BarChart3, description: 'Overview of all KPI performance' },
        { value: 'pillar_progress', label: 'Pillar Progress Report', icon: TrendingUp, description: 'Progress by SRAP pillars' },
        { value: 'department_performance', label: 'Department Performance', icon: Building, description: 'Performance by department' },
        { value: 'milestone_status', label: 'Milestone Status Report', icon: Target, description: 'Current milestone progress' },
        { value: 'comprehensive', label: 'Comprehensive Report', icon: FileText, description: 'Complete analysis with all data' }
    ];

    const dateRanges = [
        { value: 'current_month', label: 'Current Month' },
        { value: 'last_month', label: 'Last Month' },
        { value: 'current_quarter', label: 'Current Quarter' },
        { value: 'last_quarter', label: 'Last Quarter' },
        { value: 'current_year', label: 'Current Year' },
        { value: 'custom', label: 'Custom Range' }
    ];

    return (
        <AuthenticatedLayout>
            <Head title="Create Report" />

            <div className="px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="mb-8"
                >
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => router.visit('/admin/reports')}
                                className="flex items-center space-x-2"
                            >
                                <ArrowLeft className="h-4 w-4" />
                                <span>Back to Reports</span>
                            </Button>
                            <div>
                                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                                    Create New Report
                                </h1>
                                <p className="text-gray-600 dark:text-gray-400 mt-1">
                                    Generate custom reports for KPI analysis and tracking
                                </p>
                            </div>
                        </div>
                    </div>
                </motion.div>

                <form onSubmit={handleSubmit} className="space-y-8">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Main Form */}
                        <div className="lg:col-span-2 space-y-6">
                            {/* Basic Information */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: 0.1 }}
                            >
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Report Information</CardTitle>
                                        <CardDescription>
                                            Basic details about your report
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                Report Title *
                                            </label>
                                            <input
                                                type="text"
                                                value={data.title}
                                                onChange={(e) => setData('title', e.target.value)}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                placeholder="Enter report title"
                                                required
                                            />
                                            {errors.title && (
                                                <p className="text-red-600 text-sm mt-1">{errors.title}</p>
                                            )}
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                Description
                                            </label>
                                            <textarea
                                                value={data.description}
                                                onChange={(e) => setData('description', e.target.value)}
                                                rows={3}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                placeholder="Brief description of the report"
                                            />
                                        </div>
                                    </CardContent>
                                </Card>
                            </motion.div>

                            {/* Report Type */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: 0.2 }}
                            >
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Report Type</CardTitle>
                                        <CardDescription>
                                            Choose the type of report to generate
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            {reportTypes.map((type) => {
                                                const Icon = type.icon;
                                                return (
                                                    <button
                                                        key={type.value}
                                                        type="button"
                                                        onClick={() => setData('type', type.value)}
                                                        className={`p-4 border-2 rounded-lg text-left transition-colors ${
                                                            data.type === type.value
                                                                ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                                                                : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'
                                                        }`}
                                                    >
                                                        <div className="flex items-start space-x-3">
                                                            <Icon className="h-5 w-5 text-blue-600 mt-0.5" />
                                                            <div>
                                                                <div className="font-medium">{type.label}</div>
                                                                <div className="text-sm text-gray-500 mt-1">{type.description}</div>
                                                            </div>
                                                        </div>
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    </CardContent>
                                </Card>
                            </motion.div>

                            {/* Date Range */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: 0.3 }}
                            >
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Date Range</CardTitle>
                                        <CardDescription>
                                            Select the time period for the report
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                Time Period
                                            </label>
                                            <select
                                                value={data.date_range}
                                                onChange={(e) => setData('date_range', e.target.value)}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            >
                                                {dateRanges.map((range) => (
                                                    <option key={range.value} value={range.value}>
                                                        {range.label}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>

                                        {data.date_range === 'custom' && (
                                            <div className="grid grid-cols-2 gap-4">
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                        Start Date
                                                    </label>
                                                    <input
                                                        type="date"
                                                        value={data.custom_start_date}
                                                        onChange={(e) => setData('custom_start_date', e.target.value)}
                                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                        End Date
                                                    </label>
                                                    <input
                                                        type="date"
                                                        value={data.custom_end_date}
                                                        onChange={(e) => setData('custom_end_date', e.target.value)}
                                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                    />
                                                </div>
                                            </div>
                                        )}
                                    </CardContent>
                                </Card>
                            </motion.div>
                        </div>

                        {/* Sidebar */}
                        <div className="space-y-6">
                            {/* Format Options */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: 0.4 }}
                            >
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Format & Options</CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                Output Format
                                            </label>
                                            <select
                                                value={data.format}
                                                onChange={(e) => setData('format', e.target.value)}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            >
                                                <option value="pdf">PDF Report</option>
                                                <option value="excel">Excel Spreadsheet</option>
                                                <option value="both">Both PDF & Excel</option>
                                            </select>
                                        </div>

                                        <div className="space-y-3">
                                            <div className="flex items-center space-x-2">
                                                <input
                                                    type="checkbox"
                                                    id="include_charts"
                                                    checked={data.include_charts}
                                                    onChange={(e) => setData('include_charts', e.target.checked)}
                                                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                                />
                                                <label htmlFor="include_charts" className="text-sm text-gray-700 dark:text-gray-300">
                                                    Include Charts & Graphs
                                                </label>
                                            </div>

                                            <div className="flex items-center space-x-2">
                                                <input
                                                    type="checkbox"
                                                    id="include_analysis"
                                                    checked={data.include_analysis}
                                                    onChange={(e) => setData('include_analysis', e.target.checked)}
                                                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                                />
                                                <label htmlFor="include_analysis" className="text-sm text-gray-700 dark:text-gray-300">
                                                    Include Analysis
                                                </label>
                                            </div>

                                            <div className="flex items-center space-x-2">
                                                <input
                                                    type="checkbox"
                                                    id="include_recommendations"
                                                    checked={data.include_recommendations}
                                                    onChange={(e) => setData('include_recommendations', e.target.checked)}
                                                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                                />
                                                <label htmlFor="include_recommendations" className="text-sm text-gray-700 dark:text-gray-300">
                                                    Include Recommendations
                                                </label>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </motion.div>

                            {/* Actions */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: 0.5 }}
                            >
                                <Card>
                                    <CardContent className="p-6">
                                        <div className="space-y-3">
                                            <Button
                                                type="submit"
                                                disabled={processing}
                                                className="w-full flex items-center justify-center space-x-2"
                                            >
                                                <Save className="h-4 w-4" />
                                                <span>{processing ? 'Generating...' : 'Generate Report'}</span>
                                            </Button>

                                            <Button
                                                type="button"
                                                variant="outline"
                                                onClick={() => router.visit('/admin/reports')}
                                                className="w-full"
                                            >
                                                Cancel
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        </div>
                    </div>
                </form>
            </div>
        </AuthenticatedLayout>
    );
}