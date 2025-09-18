import React from 'react';
import { Head, Link } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/Components/ui/Card';
import { Badge } from '@/Components/ui/Badge';
import { Button } from '@/Components/ui/Button';
import { Progress } from '@/Components/ui/Progress';
import { 
    ArrowLeft, 
    Download, 
    TrendingUp, 
    TrendingDown, 
    DollarSign,
    Calendar,
    Target,
    BarChart3
} from 'lucide-react';

export default function Show({ auth, simulation }) {
    const results = simulation.prediction_result;
    const inputData = simulation.input_data;

    const getScenarioTypeColor = (type) => {
        const colors = {
            'what_if': 'bg-blue-100 text-blue-800',
            'budget_impact': 'bg-green-100 text-green-800',
            'timeline_change': 'bg-orange-100 text-orange-800',
            'resource_allocation': 'bg-purple-100 text-purple-800'
        };
        return colors[type] || 'bg-gray-100 text-gray-800';
    };

    const formatScenarioType = (type) => {
        return type.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
    };

    const formatPeriod = (period) => {
        return period.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
    };

    const getImpactColor = (impact) => {
        if (impact > 0) return 'text-green-600';
        if (impact < 0) return 'text-red-600';
        return 'text-gray-600';
    };

    const getImpactIcon = (impact) => {
        if (impact > 0) return <TrendingUp className="h-4 w-4" />;
        if (impact < 0) return <TrendingDown className="h-4 w-4" />;
        return <BarChart3 className="h-4 w-4" />;
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                        <Link
                            href={route('admin.scenarios.index')}
                            className="flex items-center text-gray-600 hover:text-gray-900"
                        >
                            <ArrowLeft className="h-4 w-4 mr-2" />
                            Back to Scenarios
                        </Link>
                        <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                            Scenario Simulation Results
                        </h2>
                    </div>
                    <Button variant="outline" size="sm">
                        <Download className="h-4 w-4 mr-2" />
                        Export Results
                    </Button>
                </div>
            }
        >
            <Head title="Scenario Results" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-6">
                    {/* Scenario Overview */}
                    <Card>
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <div>
                                    <CardTitle className="text-2xl">{inputData.name}</CardTitle>
                                    <CardDescription className="mt-2">
                                        {inputData.description || 'No description provided'}
                                    </CardDescription>
                                </div>
                                <Badge className={getScenarioTypeColor(inputData.scenario_type)}>
                                    {formatScenarioType(inputData.scenario_type)}
                                </Badge>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                <div className="flex items-center space-x-2">
                                    <Calendar className="h-5 w-5 text-gray-500" />
                                    <div>
                                        <p className="text-sm font-medium">Simulation Period</p>
                                        <p className="text-sm text-gray-600">{formatPeriod(inputData.simulation_period)}</p>
                                    </div>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <Target className="h-5 w-5 text-gray-500" />
                                    <div>
                                        <p className="text-sm font-medium">Confidence Score</p>
                                        <p className="text-sm text-gray-600">{Math.round(results.confidence * 100)}%</p>
                                    </div>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <BarChart3 className="h-5 w-5 text-gray-500" />
                                    <div>
                                        <p className="text-sm font-medium">KPIs Analyzed</p>
                                        <p className="text-sm text-gray-600">{Object.keys(results.kpi_impacts || {}).length}</p>
                                    </div>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <DollarSign className="h-5 w-5 text-gray-500" />
                                    <div>
                                        <p className="text-sm font-medium">Budget Impact</p>
                                        <p className="text-sm text-gray-600">
                                            {results.budget_analysis?.total_budget_change || 0}%
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Confidence Score */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Simulation Confidence</CardTitle>
                            <CardDescription>
                                How confident the AI model is in these predictions
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-2">
                                <div className="flex justify-between text-sm">
                                    <span>Confidence Level</span>
                                    <span className="font-medium">{Math.round(results.confidence * 100)}%</span>
                                </div>
                                <Progress value={results.confidence * 100} className="h-2" />
                                <p className="text-xs text-gray-500 mt-2">
                                    {results.confidence >= 0.8 ? 'High confidence - Results are highly reliable' :
                                     results.confidence >= 0.6 ? 'Medium confidence - Results are moderately reliable' :
                                     'Low confidence - Results should be interpreted with caution'}
                                </p>
                            </div>
                        </CardContent>
                    </Card>

                    {/* KPI Impacts */}
                    <Card>
                        <CardHeader>
                            <CardTitle>KPI Impact Analysis</CardTitle>
                            <CardDescription>
                                Projected impact on each Key Performance Indicator
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {Object.values(results.kpi_impacts || {}).map((kpi) => (
                                    <div key={kpi.kpi_id} className="border rounded-lg p-4">
                                        <div className="flex items-center justify-between mb-3">
                                            <h4 className="font-medium">{kpi.kpi_name}</h4>
                                            <div className={`flex items-center space-x-1 ${getImpactColor(kpi.projected_improvement)}`}>
                                                {getImpactIcon(kpi.projected_improvement)}
                                                <span className="text-sm font-medium">
                                                    {kpi.projected_improvement > 0 ? '+' : ''}{kpi.projected_improvement}%
                                                </span>
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                                            <div>
                                                <p className="text-gray-500">Budget Impact</p>
                                                <p className="font-medium">${kpi.budget_impact?.toLocaleString() || 0}</p>
                                            </div>
                                            <div>
                                                <p className="text-gray-500">Projected Improvement</p>
                                                <p className={`font-medium ${getImpactColor(kpi.projected_improvement)}`}>
                                                    {kpi.projected_improvement > 0 ? '+' : ''}{kpi.projected_improvement}%
                                                </p>
                                            </div>
                                            <div>
                                                <p className="text-gray-500">ROI Estimate</p>
                                                <p className={`font-medium ${getImpactColor(kpi.roi_estimate)}`}>
                                                    {kpi.roi_estimate > 0 ? '+' : ''}{kpi.roi_estimate}%
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Budget Analysis */}
                    {results.budget_analysis && (
                        <Card>
                            <CardHeader>
                                <CardTitle>Budget Analysis</CardTitle>
                                <CardDescription>
                                    Financial impact and resource allocation recommendations
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <h4 className="font-medium mb-3">Budget Summary</h4>
                                        <div className="space-y-2">
                                            <div className="flex justify-between">
                                                <span className="text-gray-600">Total Budget Change</span>
                                                <span className={`font-medium ${getImpactColor(results.budget_analysis.total_budget_change)}`}>
                                                    {results.budget_analysis.total_budget_change > 0 ? '+' : ''}
                                                    {results.budget_analysis.total_budget_change}%
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    <div>
                                        <h4 className="font-medium mb-3">Allocation Strategy</h4>
                                        {results.budget_analysis.allocation_strategy?.length > 0 ? (
                                            <div className="space-y-2">
                                                {results.budget_analysis.allocation_strategy.map((item, index) => (
                                                    <div key={index} className="text-sm">
                                                        <span className="text-gray-600">{item.area}: </span>
                                                        <span className="font-medium">{item.percentage}%</span>
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            <p className="text-sm text-gray-500">No specific allocation strategy provided</p>
                                        )}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {/* Simulation Parameters */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Simulation Parameters</CardTitle>
                            <CardDescription>
                                Input parameters used for this scenario simulation
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                <div>
                                    <p className="text-sm font-medium">Budget Change</p>
                                    <p className="text-sm text-gray-600">{inputData.parameters?.budget_change || 0}%</p>
                                </div>
                                <div>
                                    <p className="text-sm font-medium">Timeline Change</p>
                                    <p className="text-sm text-gray-600">{inputData.parameters?.timeline_change || 0}%</p>
                                </div>
                                <div>
                                    <p className="text-sm font-medium">Resource Change</p>
                                    <p className="text-sm text-gray-600">{inputData.parameters?.resource_change || 0}%</p>
                                </div>
                                <div>
                                    <p className="text-sm font-medium">Scope Change</p>
                                    <p className="text-sm text-gray-600">{inputData.parameters?.scope_change || 0}%</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Actions */}
                    <div className="flex justify-between">
                        <Link
                            href={route('admin.scenarios.index')}
                            className="inline-flex items-center px-4 py-2 bg-gray-300 border border-transparent rounded-md font-semibold text-xs text-gray-700 uppercase tracking-widest hover:bg-gray-400 focus:bg-gray-400 active:bg-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition ease-in-out duration-150"
                        >
                            Back to Scenarios
                        </Link>
                        <div className="space-x-2">
                            <Button variant="outline">
                                <Download className="h-4 w-4 mr-2" />
                                Export PDF
                            </Button>
                            <Link
                                href={route('admin.scenarios.create')}
                                className="inline-flex items-center px-4 py-2 bg-blue-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-blue-700 focus:bg-blue-700 active:bg-blue-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition ease-in-out duration-150"
                            >
                                Create New Scenario
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
