<?php

namespace App\Http\Controllers;

use App\Models\Kpis;
use App\Models\SrapPillar;
use App\Models\Department;
use App\Models\Initiative;
use App\Models\KpiProgress;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;

class GlobalDashboardController extends Controller
{
    /**
     * Display the global dashboard with filters
     */
    public function index(Request $request)
    {
        // Get filter parameters
        $pillarFilter = $request->get('pillar');
        $departmentFilter = $request->get('department');
        $initiativeFilter = $request->get('initiative');
        $statusFilter = $request->get('status');

        // Build base query
        $kpiQuery = Kpis::active()->with(['pillar', 'department', 'initiative']);

        // Apply filters
        if ($pillarFilter) {
            $kpiQuery->where('pillar_id', $pillarFilter);
        }
        if ($departmentFilter) {
            $kpiQuery->where('department_id', $departmentFilter);
        }
        if ($initiativeFilter) {
            $kpiQuery->where('initiative_id', $initiativeFilter);
        }
        if ($statusFilter) {
            $kpiQuery->where('status', $statusFilter);
        }

        $filteredKpis = $kpiQuery->get();

        // Calculate global metrics
        $globalMetrics = $this->calculateGlobalMetrics($filteredKpis);

        // Get pillar breakdown
        $pillarBreakdown = $this->getPillarBreakdown($pillarFilter);

        // Get department performance
        $departmentPerformance = $this->getDepartmentPerformance($departmentFilter);

        // Get initiative progress
        $initiativeProgress = $this->getInitiativeProgress($initiativeFilter);

        // Get traffic light status distribution
        $trafficLightData = $this->getTrafficLightData($filteredKpis);

        return Inertia::render('GlobalDashboard', [
            'globalMetrics' => $globalMetrics,
            'pillarBreakdown' => $pillarBreakdown,
            'departmentPerformance' => $departmentPerformance,
            'initiativeProgress' => $initiativeProgress,
            'trafficLightData' => $trafficLightData,
            'filters' => [
                'pillars' => SrapPillar::active()->ordered()->get(),
                'departments' => Department::active()->get(),
                'initiatives' => Initiative::active()->get(),
                'selected' => $request->only(['pillar', 'department', 'initiative', 'status'])
            ]
        ]);
    }

    /**
     * Calculate global KPI metrics
     */
    private function calculateGlobalMetrics($kpis)
    {
        $totalKpis = $kpis->count();
        $completedKpis = $kpis->where('status', 'completed')->count();
        $onTrackKpis = $kpis->where('status', 'on_track')->count();
        $atRiskKpis = $kpis->where('status', 'at_risk')->count();
        $behindKpis = $kpis->where('status', 'behind')->count();

        // Global KPI Achievement Percentage
        $globalAchievement = $totalKpis > 0 ? round(($completedKpis / $totalKpis) * 100, 2) : 0;

        // Calculate weighted progress if weights are available
        $weightedProgress = 0;
        $totalWeight = 0;
        foreach ($kpis as $kpi) {
            $progress = $kpi->progress_percentage;
            $weight = $kpi->weight ?? 1;
            $weightedProgress += ($progress * $weight);
            $totalWeight += $weight;
        }
        $weightedAchievement = $totalWeight > 0 ? round($weightedProgress / $totalWeight, 2) : 0;

        return [
            'total_kpis' => $totalKpis,
            'completed_kpis' => $completedKpis,
            'on_track_kpis' => $onTrackKpis,
            'at_risk_kpis' => $atRiskKpis,
            'behind_kpis' => $behindKpis,
            'global_achievement' => $globalAchievement,
            'weighted_achievement' => $weightedAchievement,
            'completion_rate' => $globalAchievement
        ];
    }

    /**
     * Get pillar breakdown with traffic light colors
     */
    private function getPillarBreakdown($pillarFilter = null)
    {
        $query = SrapPillar::active()->ordered();
        
        if ($pillarFilter) {
            $query->where('id', $pillarFilter);
        }

        return $query->get()->map(function ($pillar) {
            $kpis = $pillar->kpis()->active()->get();
            $totalKpis = $kpis->count();
            $completedKpis = $kpis->where('status', 'completed')->count();
            $onTrackKpis = $kpis->where('status', 'on_track')->count();
            $atRiskKpis = $kpis->where('status', 'at_risk')->count();
            $behindKpis = $kpis->where('status', 'behind')->count();

            $progress = $totalKpis > 0 ? round(($completedKpis / $totalKpis) * 100, 2) : 0;

            // Determine traffic light status
            $trafficLight = $this->determineTrafficLightStatus($progress, $atRiskKpis, $behindKpis, $totalKpis);

            return [
                'id' => $pillar->id,
                'name' => $pillar->name,
                'code' => $pillar->code,
                'color' => $pillar->color,
                'progress' => $progress,
                'total_kpis' => $totalKpis,
                'completed_kpis' => $completedKpis,
                'on_track_kpis' => $onTrackKpis,
                'at_risk_kpis' => $atRiskKpis,
                'behind_kpis' => $behindKpis,
                'traffic_light' => $trafficLight
            ];
        });
    }

    /**
     * Get department performance
     */
    private function getDepartmentPerformance($departmentFilter = null)
    {
        $query = Department::active()->withCount(['kpis']);
        
        if ($departmentFilter) {
            $query->where('id', $departmentFilter);
        }

        return $query->get()->map(function ($dept) {
            $kpis = $dept->kpis()->active()->get();
            $totalKpis = $kpis->count();
            $completedKpis = $kpis->where('status', 'completed')->count();
            $progress = $totalKpis > 0 ? round(($completedKpis / $totalKpis) * 100, 2) : 0;

            $atRiskKpis = $kpis->where('status', 'at_risk')->count();
            $behindKpis = $kpis->where('status', 'behind')->count();
            $trafficLight = $this->determineTrafficLightStatus($progress, $atRiskKpis, $behindKpis, $totalKpis);

            return [
                'id' => $dept->id,
                'name' => $dept->name,
                'code' => $dept->code,
                'progress' => $progress,
                'total_kpis' => $totalKpis,
                'completed_kpis' => $completedKpis,
                'traffic_light' => $trafficLight
            ];
        });
    }

    /**
     * Get initiative progress
     */
    private function getInitiativeProgress($initiativeFilter = null)
    {
        $query = Initiative::active()->with(['pillar']);
        
        if ($initiativeFilter) {
            $query->where('id', $initiativeFilter);
        }

        return $query->get()->map(function ($initiative) {
            $kpis = $initiative->kpis()->active()->get();
            $totalKpis = $kpis->count();
            $completedKpis = $kpis->where('status', 'completed')->count();
            $progress = $totalKpis > 0 ? round(($completedKpis / $totalKpis) * 100, 2) : 0;

            $atRiskKpis = $kpis->where('status', 'at_risk')->count();
            $behindKpis = $kpis->where('status', 'behind')->count();
            $trafficLight = $this->determineTrafficLightStatus($progress, $atRiskKpis, $behindKpis, $totalKpis);

            return [
                'id' => $initiative->id,
                'name' => $initiative->name,
                'code' => $initiative->code,
                'pillar' => $initiative->pillar->name,
                'progress' => $progress,
                'total_kpis' => $totalKpis,
                'completed_kpis' => $completedKpis,
                'traffic_light' => $trafficLight,
                'status' => $initiative->status
            ];
        });
    }

    /**
     * Get traffic light data distribution
     */
    private function getTrafficLightData($kpis)
    {
        $green = 0; // On Track
        $yellow = 0; // Delayed
        $red = 0; // Off Track

        foreach ($kpis->groupBy('status') as $status => $statusKpis) {
            $count = $statusKpis->count();
            switch ($status) {
                case 'completed':
                case 'on_track':
                    $green += $count;
                    break;
                case 'at_risk':
                    $yellow += $count;
                    break;
                case 'behind':
                    $red += $count;
                    break;
                default:
                    // not_started, in_progress - could be yellow or green depending on timeline
                    $yellow += $count;
                    break;
            }
        }

        return [
            'green' => $green,
            'yellow' => $yellow,
            'red' => $red,
            'total' => $kpis->count()
        ];
    }

    /**
     * Determine traffic light status based on progress and risk factors
     */
    private function determineTrafficLightStatus($progress, $atRiskCount, $behindCount, $totalCount)
    {
        if ($totalCount === 0) return 'gray';

        $riskPercentage = (($atRiskCount + $behindCount) / $totalCount) * 100;

        if ($progress >= 80 && $riskPercentage <= 10) {
            return 'green'; // On Track
        } elseif ($progress >= 60 || $riskPercentage <= 30) {
            return 'yellow'; // Delayed
        } else {
            return 'red'; // Off Track
        }
    }

    /**
     * Export global dashboard data
     */
    public function export(Request $request)
    {
        // Implementation for exporting dashboard data as Excel/PDF
        // This would use Laravel Excel or similar package
        return response()->json(['message' => 'Export functionality to be implemented']);
    }
}
