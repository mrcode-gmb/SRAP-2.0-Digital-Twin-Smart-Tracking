<?php

namespace App\Http\Controllers;

use App\Models\Kpis;
use App\Models\SrapPillar;
use App\Models\Department;
use App\Models\Alert;
use App\Models\Milestone;
use App\Models\KpiProgress;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class DashboardController extends Controller
{
    public function index()
    {
        $user = Auth::user();
        
        // Get role-specific dashboard data
        $dashboardData = match($user->role) {
            'admin' => $this->getAdminDashboardData(),
            'strategy_team' => $this->getStrategyTeamDashboardData(),
            'department_user' => $this->getDepartmentUserDashboardData($user),
            'data_analyst' => $this->getDataAnalystDashboardData(),
            'data_officer' => $this->getDataOfficerDashboardData($user),
            'hod' => $this->getHodDashboardData($user),
            default => $this->getDefaultDashboardData()
        };

        return Inertia::render('Dashboard', $dashboardData);
    }

    private function getAdminDashboardData()
    {
        // Overall SRAP 2.0 metrics - Global KPI View
        $totalKpis = Kpis::active()->count();
        $completedKpis = Kpis::active()->where('status', 'completed')->count();
        $onTrackKpis = Kpis::active()->where('status', 'on_track')->count();
        $atRiskKpis = Kpis::active()->where('status', 'at_risk')->count();
        $behindKpis = Kpis::active()->where('status', 'behind')->count();
        
        // Global KPI Achievement Percentage
        $globalKpiAchievement = $totalKpis > 0 ? round(($completedKpis / $totalKpis) * 100, 2) : 0;
        
        // Pillar progress
        $pillarProgress = SrapPillar::active()->ordered()->get()->map(function ($pillar) {
            $totalKpis = $pillar->kpis()->active()->count();
            $completedKpis = $pillar->kpis()->active()->where('status', 'completed')->count();
            $progress = $totalKpis > 0 ? round(($completedKpis / $totalKpis) * 100, 2) : 0;
            
            return [
                'id' => $pillar->id,
                'name' => $pillar->name,
                'code' => $pillar->code,
                'color' => $pillar->color,
                'progress' => $progress,
                'total_kpis' => $totalKpis,
                'completed_kpis' => $completedKpis
            ];
        });

        // return $pillarProgress;

        // Recent alerts
    $recentAlerts = Alert::with(['alertable', 'acknowledgedBy'])
            ->unread()
            ->orderBy('triggered_at', 'desc')
            ->limit(10)
            ->get();

        // Upcoming milestones
        $upcomingMilestones = Milestone::with(['kpi', 'assignedUser'])
            ->upcoming(14)
            ->orderBy('due_date')
            ->limit(10)
            ->get();

        // Department performance
        $departmentPerformance = Department::active()
            ->withCount(['kpis', 'users'])
            ->get()
            ->map(function ($dept) {
                $completedKpis = $dept->kpis()->where('status', 'completed')->count();
                $progress = $dept->kpis_count > 0 ? round(($completedKpis / $dept->kpis_count) * 100, 2) : 0;
                
                return [
                    'id' => $dept->id,
                    'name' => $dept->name,
                    'code' => $dept->code,
                    'progress' => $progress,
                    'total_kpis' => $dept->kpis_count,
                    'completed_kpis' => $completedKpis,
                    'users_count' => $dept->users_count
                ];
            });

        return [
            'stats' => [
                'total_kpis' => $totalKpis,
                'completed_kpis' => $completedKpis,
                'on_track_kpis' => $onTrackKpis,
                'at_risk_kpis' => $atRiskKpis,
                'behind_kpis' => $behindKpis,
                'overall_progress' => $globalKpiAchievement,
                'global_kpi_achievement' => $globalKpiAchievement
            ],
            'pillarProgress' => $pillarProgress,
            'recentAlerts' => $recentAlerts,
            'upcomingMilestones' => $upcomingMilestones,
            'departmentPerformance' => $departmentPerformance,
            'chartData' => $this->getProgressChartData()
        ];
    }

    private function getStrategyTeamDashboardData()
    {
        // Strategic overview with focus on planning and coordination
        $totalKpis = Kpis::active()->count();
        $completedKpis = Kpis::active()->where('status', 'completed')->count();
        
        // Strategic milestones
        $strategicMilestones = Milestone::with(['kpi.pillar', 'assignedUser'])
            ->whereHas('kpi', function ($query) {
                $query->where('priority', 1); // High priority KPIs
            })
            ->upcoming(30)
            ->orderBy('due_date')
            ->get();

        // Risk assessment
        $riskAssessment = [
            'critical_delays' => Milestone::overdue()->count(),
            'at_risk_kpis' => Kpis::active()->where('status', 'at_risk')->count(),
            'behind_kpis' => Kpis::active()->where('status', 'behind')->count()
        ];

        return [
            'stats' => [
                'total_kpis' => $totalKpis,
                'completed_kpis' => $completedKpis,
                'overall_progress' => $totalKpis > 0 ? round(($completedKpis / $totalKpis) * 100, 2) : 0
            ],
            'strategicMilestones' => $strategicMilestones,
            'riskAssessment' => $riskAssessment,
            'pillarProgress' => $this->getPillarProgressData(),
            'chartData' => $this->getProgressChartData()
        ];
    }

    private function getDepartmentUserDashboardData($user)
    {
        // Department-specific dashboard
        $departmentKpis = Kpis::active()
            ->where('department_id', $user->department_id)
            ->get();

        $myMilestones = Milestone::with(['kpi'])
            ->where('assigned_to', $user->id)
            ->where('status', '!=', 'completed')
            ->orderBy('due_date')
            ->get();

        $recentProgress = KpiProgress::with(['kpi'])
            ->where('reported_by', $user->id)
            ->orderBy('created_at', 'desc')
            ->limit(10)
            ->get();

        return [
            'departmentKpis' => $departmentKpis,
            'myMilestones' => $myMilestones,
            'recentProgress' => $recentProgress,
            'stats' => [
                'my_kpis' => $departmentKpis->count(),
                'my_milestones' => $myMilestones->count(),
                'overdue_milestones' => $myMilestones->where('is_overdue', true)->count()
            ]
        ];
    }

    private function getDataAnalystDashboardData()
    {
        // Analytics-focused dashboard
        $progressTrends = $this->getProgressTrends();
        $performanceMetrics = $this->getPerformanceMetrics();
        $dataQuality = $this->getDataQualityMetrics();

        return [
            'progressTrends' => $progressTrends,
            'performanceMetrics' => $performanceMetrics,
            'dataQuality' => $dataQuality,
            'chartData' => $this->getAdvancedChartData()
        ];
    }

    private function getDefaultDashboardData()
    {
        return [
            'stats' => [
                'total_kpis' => Kpis::active()->count(),
                'completed_kpis' => Kpis::active()->where('status', 'completed')->count()
            ],
            'recentAlerts' => Alert::unread()->limit(5)->get()
        ];
    }

    private function getPillarProgressData()
    {
        return SrapPillar::active()->ordered()->get()->map(function ($pillar) {
            $totalKpis = $pillar->kpis()->active()->count();
            $completedKpis = $pillar->kpis()->active()->where('status', 'completed')->count();
            $progress = $totalKpis > 0 ? round(($completedKpis / $totalKpis) * 100, 2) : 0;
            
            return [
                'name' => $pillar->name,
                'progress' => $progress,
                'color' => $pillar->color
            ];
        });
    }

    private function getProgressChartData()
    {
        // Get monthly progress data for the last 12 months
        $monthlyData = collect();
        
        for ($i = 11; $i >= 0; $i--) {
            $date = now()->subMonths($i);
            $monthStart = $date->copy()->startOfMonth();
            $monthEnd = $date->copy()->endOfMonth();
            
            $completedInMonth = Kpis::active()
                ->where('status', 'completed')
                ->whereBetween('updated_at', [$monthStart, $monthEnd])
                ->count();
            
            $monthlyData->push([
                'month' => $date->format('M Y'),
                'completed' => $completedInMonth,
                'cumulative' => Kpis::active()->where('status', 'completed')->where('updated_at', '<=', $monthEnd)->count()
            ]);
        }
        
        return $monthlyData;
    }

    private function getProgressTrends()
    {
        // Implementation for progress trends analysis
        return [];
    }

    private function getPerformanceMetrics()
    {
        // Implementation for performance metrics
        return [];
    }

    private function getDataQualityMetrics()
    {
        // Implementation for data quality metrics
        return [];
    }

    private function getAdvancedChartData()
    {
        // Implementation for advanced chart data
        return [];
    }

    private function getDataOfficerDashboardData($user)
    {
        // Data Officer dashboard - focused on data entry and uploads
        $departmentKpis = Kpis::active()
            ->where('department_id', $user->department_id)
            ->with(['pillar', 'initiative'])
            ->get();

        $recentUploads = \App\Models\UploadedFile::where('uploaded_by', $user->id)
            ->orderBy('created_at', 'desc')
            ->limit(10)
            ->get();

        $pendingReports = $departmentKpis->filter(function($kpi) {
            return $kpi->status === 'in_progress' || $kpi->status === 'not_started';
        });

        return [
            'departmentKpis' => $departmentKpis,
            'recentUploads' => $recentUploads,
            'pendingReports' => $pendingReports,
            'stats' => [
                'total_kpis' => $departmentKpis->count(),
                'pending_reports' => $pendingReports->count(),
                'recent_uploads' => $recentUploads->count(),
                'completion_rate' => $departmentKpis->count() > 0 ? 
                    round(($departmentKpis->where('status', 'completed')->count() / $departmentKpis->count()) * 100, 2) : 0
            ]
        ];
    }

    private function getHodDashboardData($user)
    {
        // Head of Department dashboard - focused on approval and review
        $departmentKpis = Kpis::active()
            ->where('department_id', $user->department_id)
            ->with(['pillar', 'initiative', 'progress'])
            ->get();

        $pendingApprovals = \App\Models\KpiProgress::whereHas('kpi', function($query) use ($user) {
            $query->where('department_id', $user->department_id);
        })
        ->where('verified_by', null)
        ->orderBy('created_at', 'desc')
        ->limit(10)
        ->get();

        $departmentPerformance = [
            'total_kpis' => $departmentKpis->count(),
            'completed_kpis' => $departmentKpis->where('status', 'completed')->count(),
            'on_track_kpis' => $departmentKpis->where('status', 'on_track')->count(),
            'at_risk_kpis' => $departmentKpis->where('status', 'at_risk')->count(),
            'behind_kpis' => $departmentKpis->where('status', 'behind')->count(),
        ];

        return [
            'departmentKpis' => $departmentKpis,
            'pendingApprovals' => $pendingApprovals,
            'departmentPerformance' => $departmentPerformance,
            'stats' => [
                'total_kpis' => $departmentKpis->count(),
                'pending_approvals' => $pendingApprovals->count(),
                'completion_rate' => $departmentKpis->count() > 0 ? 
                    round(($departmentKpis->where('status', 'completed')->count() / $departmentKpis->count()) * 100, 2) : 0,
                'department_progress' => $departmentKpis->count() > 0 ? 
                    round(($departmentKpis->where('status', 'completed')->count() / $departmentKpis->count()) * 100, 2) : 0
            ]
        ];
    }
}
