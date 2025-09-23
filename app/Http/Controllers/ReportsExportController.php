<?php

namespace App\Http\Controllers;

use App\Models\Kpis;
use App\Models\SrapPillar;
use App\Models\Department;
use App\Models\Initiative;
use App\Models\KpiProgress;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Response;
use Maatwebsite\Excel\Facades\Excel;
use Barryvdh\DomPDF\Facade\Pdf;

class ReportsExportController extends Controller
{
    /**
     * Export global KPI progress report
     */
    public function exportGlobalReport(Request $request)
    {
        $format = $request->get('format', 'excel'); // excel or pdf
        $filters = $request->only(['pillar', 'department', 'initiative', 'status']);
        
        // Get filtered data
        $data = $this->getGlobalReportData($filters);
        
        if ($format === 'pdf') {
            return $this->exportToPdf($data, 'global-kpi-report');
        } else {
            return $this->exportToExcel($data, 'global-kpi-report');
        }
    }

    /**
     * Export pillar-specific report
     */
    public function exportPillarReport(Request $request, $pillarId)
    {
        $format = $request->get('format', 'excel');
        $pillar = SrapPillar::findOrFail($pillarId);
        
        $data = $this->getPillarReportData($pillar);
        
        $filename = 'pillar-' . $pillar->code . '-report';
        
        if ($format === 'pdf') {
            return $this->exportToPdf($data, $filename);
        } else {
            return $this->exportToExcel($data, $filename);
        }
    }

    /**
     * Export department-specific report
     */
    public function exportDepartmentReport(Request $request, $departmentId)
    {
        $format = $request->get('format', 'excel');
        $department = Department::findOrFail($departmentId);
        
        $data = $this->getDepartmentReportData($department);
        
        $filename = 'department-' . $department->code . '-report';
        
        if ($format === 'pdf') {
            return $this->exportToPdf($data, $filename);
        } else {
            return $this->exportToExcel($data, $filename);
        }
    }

    /**
     * Export initiative-specific report
     */
    public function exportInitiativeReport(Request $request, $initiativeId)
    {
        $format = $request->get('format', 'excel');
        $initiative = Initiative::findOrFail($initiativeId);
        
        $data = $this->getInitiativeReportData($initiative);
        
        $filename = 'initiative-' . $initiative->code . '-report';
        
        if ($format === 'pdf') {
            return $this->exportToPdf($data, $filename);
        } else {
            return $this->exportToExcel($data, $filename);
        }
    }

    /**
     * Get global report data
     */
    private function getGlobalReportData($filters)
    {
        $query = Kpis::active()->with(['pillar', 'department', 'initiative', 'progress']);

        // Apply filters
        if (!empty($filters['pillar'])) {
            $query->where('pillar_id', $filters['pillar']);
        }
        if (!empty($filters['department'])) {
            $query->where('department_id', $filters['department']);
        }
        if (!empty($filters['initiative'])) {
            $query->where('initiative_id', $filters['initiative']);
        }
        if (!empty($filters['status'])) {
            $query->where('status', $filters['status']);
        }

        $kpis = $query->get();

        // Calculate summary statistics
        $totalKpis = $kpis->count();
        $completedKpis = $kpis->where('status', 'completed')->count();
        $globalAchievement = $totalKpis > 0 ? round(($completedKpis / $totalKpis) * 100, 2) : 0;

        // Group by pillars
        $pillarData = $kpis->groupBy('pillar.name')->map(function ($pillarKpis, $pillarName) {
            $total = $pillarKpis->count();
            $completed = $pillarKpis->where('status', 'completed')->count();
            $progress = $total > 0 ? round(($completed / $total) * 100, 2) : 0;

            return [
                'name' => $pillarName,
                'total_kpis' => $total,
                'completed_kpis' => $completed,
                'progress' => $progress,
                'kpis' => $pillarKpis->map(function ($kpi) {
                    return [
                        'name' => $kpi->name,
                        'code' => $kpi->code,
                        'target_value' => $kpi->target_value,
                        'current_value' => $kpi->current_value,
                        'progress_percentage' => $kpi->progress_percentage,
                        'status' => $kpi->status,
                        'department' => $kpi->department->name ?? 'N/A',
                        'initiative' => $kpi->initiative->name ?? 'N/A'
                    ];
                })
            ];
        });

        return [
            'title' => 'SRAP 2.0 Global KPI Progress Report',
            'generated_at' => now()->format('Y-m-d H:i:s'),
            'filters' => $filters,
            'summary' => [
                'total_kpis' => $totalKpis,
                'completed_kpis' => $completedKpis,
                'global_achievement' => $globalAchievement
            ],
            'pillar_data' => $pillarData
        ];
    }

    /**
     * Get pillar-specific report data
     */
    private function getPillarReportData($pillar)
    {
        $kpis = $pillar->kpis()->active()->with(['department', 'initiative', 'progress'])->get();
        
        $totalKpis = $kpis->count();
        $completedKpis = $kpis->where('status', 'completed')->count();
        $progress = $totalKpis > 0 ? round(($completedKpis / $totalKpis) * 100, 2) : 0;

        return [
            'title' => 'SRAP 2.0 Pillar Report: ' . $pillar->name,
            'pillar' => $pillar,
            'generated_at' => now()->format('Y-m-d H:i:s'),
            'summary' => [
                'total_kpis' => $totalKpis,
                'completed_kpis' => $completedKpis,
                'progress' => $progress
            ],
            'kpis' => $kpis->map(function ($kpi) {
                return [
                    'name' => $kpi->name,
                    'code' => $kpi->code,
                    'target_value' => $kpi->target_value,
                    'current_value' => $kpi->current_value,
                    'progress_percentage' => $kpi->progress_percentage,
                    'status' => $kpi->status,
                    'department' => $kpi->department->name ?? 'N/A',
                    'initiative' => $kpi->initiative->name ?? 'N/A'
                ];
            })
        ];
    }

    /**
     * Get department-specific report data
     */
    private function getDepartmentReportData($department)
    {
        $kpis = $department->kpis()->active()->with(['pillar', 'initiative', 'progress'])->get();
        
        $totalKpis = $kpis->count();
        $completedKpis = $kpis->where('status', 'completed')->count();
        $progress = $totalKpis > 0 ? round(($completedKpis / $totalKpis) * 100, 2) : 0;

        return [
            'title' => 'SRAP 2.0 Department Report: ' . $department->name,
            'department' => $department,
            'generated_at' => now()->format('Y-m-d H:i:s'),
            'summary' => [
                'total_kpis' => $totalKpis,
                'completed_kpis' => $completedKpis,
                'progress' => $progress
            ],
            'kpis' => $kpis->map(function ($kpi) {
                return [
                    'name' => $kpi->name,
                    'code' => $kpi->code,
                    'target_value' => $kpi->target_value,
                    'current_value' => $kpi->current_value,
                    'progress_percentage' => $kpi->progress_percentage,
                    'status' => $kpi->status,
                    'pillar' => $kpi->pillar->name,
                    'initiative' => $kpi->initiative->name ?? 'N/A'
                ];
            })
        ];
    }

    /**
     * Get initiative-specific report data
     */
    private function getInitiativeReportData($initiative)
    {
        $kpis = $initiative->kpis()->active()->with(['pillar', 'department', 'progress'])->get();
        
        $totalKpis = $kpis->count();
        $completedKpis = $kpis->where('status', 'completed')->count();
        $progress = $totalKpis > 0 ? round(($completedKpis / $totalKpis) * 100, 2) : 0;

        return [
            'title' => 'SRAP 2.0 Initiative Report: ' . $initiative->name,
            'initiative' => $initiative,
            'generated_at' => now()->format('Y-m-d H:i:s'),
            'summary' => [
                'total_kpis' => $totalKpis,
                'completed_kpis' => $completedKpis,
                'progress' => $progress
            ],
            'kpis' => $kpis->map(function ($kpi) {
                return [
                    'name' => $kpi->name,
                    'code' => $kpi->code,
                    'target_value' => $kpi->target_value,
                    'current_value' => $kpi->current_value,
                    'progress_percentage' => $kpi->progress_percentage,
                    'status' => $kpi->status,
                    'pillar' => $kpi->pillar->name,
                    'department' => $kpi->department->name ?? 'N/A'
                ];
            })
        ];
    }

    /**
     * Export data to Excel
     */
    private function exportToExcel($data, $filename)
    {
        return Excel::download(new \App\Exports\KpiReportExport($data), $filename . '.xlsx');
    }

    /**
     * Export data to PDF
     */
    private function exportToPdf($data, $filename)
    {
        $pdf = Pdf::loadView('reports.kpi-report', $data);
        return $pdf->download($filename . '.pdf');
    }
}
