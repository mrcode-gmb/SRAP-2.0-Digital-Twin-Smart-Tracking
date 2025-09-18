<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Report;
use App\Models\Kpis;
use App\Models\SrapPillar;
use App\Models\Department;
use App\Models\Milestone;
use App\Exports\KpiReportExport;
use App\Exports\PillarProgressExport;
use App\Exports\DepartmentPerformanceExport;
use App\Exports\MilestoneStatusExport;
use App\Exports\ComprehensiveReportExport;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Barryvdh\DomPDF\Facade\Pdf;
use Maatwebsite\Excel\Facades\Excel;
use Inertia\Inertia;

class ReportController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $query = Report::with('generator')
            ->orderBy('created_at', 'desc');

        // Filter by type
        if ($request->filled('type')) {
            $query->where('type', $request->type);
        }

        // Filter by status
        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        // Filter by period
        if ($request->filled('period')) {
            $query->where('period', $request->period);
        }

        $reports = $query->paginate(20)->withQueryString();

        return Inertia::render('Admin/Reports', [
            'reports' => $reports,
            'filters' => $request->only(['type', 'status', 'period'])
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $kpis = Kpis::active()->get(['id', 'name']);
        $pillars = SrapPillar::active()->get(['id', 'name']);
        $departments = Department::active()->get(['id', 'name']);

        return Inertia::render('Admin/Reports/Create', [
            'kpis' => $kpis,
            'pillars' => $pillars,
            'departments' => $departments
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'type' => 'required|in:kpi_summary,pillar_progress,department_performance,milestone_status,comprehensive',
            'format' => 'required|in:pdf,excel,both',
            'date_range' => 'required|in:current_month,last_month,current_quarter,last_quarter,current_year,custom',
            'custom_start_date' => 'nullable|date',
            'custom_end_date' => 'nullable|date|after_or_equal:custom_start_date',
            'kpi_ids' => 'nullable|array',
            'pillar_ids' => 'nullable|array',
            'department_ids' => 'nullable|array',
            'include_charts' => 'boolean',
            'include_analysis' => 'boolean',
            'include_recommendations' => 'boolean'
        ]);

        // Calculate date range
        $dateRange = $this->calculateDateRange($validated['date_range'], $validated['custom_start_date'] ?? null, $validated['custom_end_date'] ?? null);

        $report = Report::create([
            'title' => $validated['title'],
            'description' => $validated['description'],
            'type' => $validated['type'],
            'format' => $validated['format'],
            'period' => $validated['date_range'],
            'start_date' => $dateRange['start'],
            'end_date' => $dateRange['end'],
            'filters' => [
                'kpi_ids' => $validated['kpi_ids'] ?? [],
                'pillar_ids' => $validated['pillar_ids'] ?? [],
                'department_ids' => $validated['department_ids'] ?? [],
                'include_charts' => $validated['include_charts'] ?? true,
                'include_analysis' => $validated['include_analysis'] ?? true,
                'include_recommendations' => $validated['include_recommendations'] ?? false
            ],
            'status' => 'pending',
            'generated_by' => Auth::id(),
            'metadata' => [
                'created_at' => now()->toISOString()
            ]
        ]);

        // Generate report immediately
        try {
            $this->generateReport($report);
            return redirect()->route('admin.reports.show', $report)
                ->with('success', 'Report created and generated successfully.');
        } catch (\Exception $e) {
            $report->update(['status' => 'failed', 'error_message' => $e->getMessage()]);
            return redirect()->route('admin.reports.index')
                ->with('error', 'Report created but generation failed: ' . $e->getMessage());
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(Report $report)
    {
        return Inertia::render('Admin/Reports/Show', [
            'report' => $report->load('generator')
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Report $report)
    {
        $kpis = Kpis::active()->get(['id', 'name']);
        $pillars = SrapPillar::active()->get(['id', 'name']);
        $departments = Department::active()->get(['id', 'name']);

        return Inertia::render('Admin/Reports/Edit', [
            'report' => $report,
            'kpis' => $kpis,
            'pillars' => $pillars,
            'departments' => $departments
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Report $report)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'type' => 'required|in:kpi_summary,pillar_progress,department_performance,milestone_status,comprehensive',
            'format' => 'required|in:pdf,excel,both',
            'period' => 'required|in:weekly,monthly,quarterly,yearly,custom',
            'start_date' => 'nullable|date',
            'end_date' => 'nullable|date|after_or_equal:start_date',
            'filters' => 'nullable|array'
        ]);

        $report->update($validated);

        return redirect()->route('admin.reports.index')
            ->with('success', 'Report updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Report $report)
    {
        // Delete associated files
        if ($report->pdf_path && Storage::exists($report->pdf_path)) {
            Storage::delete($report->pdf_path);
        }
        if ($report->excel_path && Storage::exists($report->excel_path)) {
            Storage::delete($report->excel_path);
        }

        $report->delete();

        return redirect()->route('admin.reports.index')
            ->with('success', 'Report deleted successfully.');
    }

    /**
            $this->generateReport($report);
            
            return back()->with('success', 'Report generated successfully.');
        } catch (\Exception $e) {
            return back()->with('error', 'Failed to generate report: ' . $e->getMessage());
        }
    }

    /**
     * Download report file
     */
    public function download(Report $report, $format)
    {
        if (!in_array($format, ['pdf', 'excel'])) {
            abort(400, 'Invalid format');
        }

        $path = $format === 'pdf' ? $report->pdf_path : $report->excel_path;
        
        if (!$path || !Storage::exists($path)) {
            abort(404, 'Report file not found');
        }

        $report->increment('download_count');

        return Storage::download($path, $report->title . '.' . ($format === 'pdf' ? 'pdf' : 'xlsx'));
    }

    /**
     * Regenerate failed report
     */
    public function regenerate(Report $report)
    {
        if ($report->status !== 'failed') {
            return redirect()->back()->with('error', 'Only failed reports can be regenerated.');
        }

        try {
            $report->update([
                'status' => 'pending',
                'pdf_path' => null,
                'excel_path' => null,
                'generated_at' => null
            ]);

            $this->generateReport($report);

            return redirect()->back()->with('success', 'Report regeneration started successfully.');
        } catch (\Exception $e) {
            return redirect()->back()->with('error', 'Failed to regenerate report: ' . $e->getMessage());
        }
    }

    /**
     * Generate report based on type and format
     */
    private function generateReport(Report $report)
    {
        $report->update(['status' => 'generating']);

        $data = $this->getReportData($report);

        // Generate PDF if required
        if (in_array($report->format, ['pdf', 'both'])) {
            $pdfPath = $this->generatePdfReport($report, $data);
            $report->update(['pdf_path' => $pdfPath]);
        }

        // Generate Excel if required
        if (in_array($report->format, ['excel', 'both'])) {
            $excelPath = $this->generateExcelReport($report, $data);
            $report->update(['excel_path' => $excelPath]);
        }

        $report->update([
            'status' => 'completed',
            'generated_at' => now()
        ]);
    }

    /**
     * Get report data based on type
     */
    private function getReportData(Report $report)
    {
        $startDate = $report->start_date;
        $endDate = $report->end_date;
        $filters = $report->filters ?? [];

        switch ($report->type) {
            case 'kpi_summary':
                $kpis = $this->getKpiSummaryData($startDate, $endDate, $filters);
                return [
                    'kpis' => $kpis,
                    'total_kpis' => $kpis->count(),
                    'active_kpis' => $kpis->whereIn('status', ['active', 'on_track'])->count(),
                    'completed_kpis' => $kpis->where('status', 'completed')->count(),
                    'avg_progress' => $kpis->avg('progress_percentage') ?? 0
                ];
            case 'pillar_progress':
                $pillars = $this->getPillarProgressData($startDate, $endDate, $filters);
                return [
                    'pillars' => $pillars,
                    'total_kpis' => $pillars->sum('kpis_count'),
                    'overall_progress' => $pillars->avg('progress_percentage') ?? 0
                ];
            case 'department_performance':
                $departments = $this->getDepartmentPerformanceData($startDate, $endDate, $filters);
                return [
                    'departments' => $departments,
                    'total_kpis' => $departments->sum('kpis_count'),
                    'avg_performance' => $departments->avg('avg_progress') ?? 0,
                    'active_departments' => $departments->where('kpis_count', '>', 0)->count()
                ];
            case 'milestone_status':
                $milestones = $this->getMilestoneStatusData($startDate, $endDate, $filters);
                return [
                    'milestones' => $milestones,
                    'total_milestones' => $milestones->count(),
                    'completed_milestones' => $milestones->where('status', 'Completed')->count(),
                    'in_progress_milestones' => $milestones->where('status', 'In Progress')->count(),
                    'overdue_milestones' => $milestones->where('due_date', '<', now())->where('status', '!=', 'Completed')->count()
                ];
            case 'comprehensive':
                return $this->getComprehensiveData($startDate, $endDate, $filters);
            default:
                return [];
        }
    }

    /**
     * Generate PDF report
     */
    private function generatePdfReport(Report $report, array $data)
    {
        $pdf = Pdf::loadView('reports.pdf.' . $report->type, [
            'report' => $report,
            'data' => $data,
            'generated_at' => now()
        ]);

        $filename = 'reports/' . $report->id . '_' . time() . '.pdf';
        Storage::put($filename, $pdf->output());

        return $filename;
    }

    /**
     * Generate Excel report
     */
    private function generateExcelReport(Report $report, array $data)
    {
        $exportClass = match($report->type) {
            'kpi_summary' => new KpiReportExport($data['kpis']),
            'pillar_progress' => new PillarProgressExport($data['pillars']),
            'department_performance' => new DepartmentPerformanceExport($data['departments']),
            'milestone_status' => new MilestoneStatusExport($data['milestones']),
            'comprehensive' => new ComprehensiveReportExport($data),
            default => new KpiReportExport($data['kpis'] ?? $data)
        };

        $filename = 'reports/' . $report->id . '_' . time() . '.xlsx';
        Excel::store($exportClass, $filename);

        return $filename;
    }

    /**
     * Get KPI summary data
     */
    private function getKpiSummaryData($startDate, $endDate, array $filters)
    {
        $query = Kpis::with(['pillar', 'department', 'progress'])
            ->whereBetween('created_at', [$startDate, $endDate]);

        if (isset($filters['pillar_ids'])) {
            $query->whereIn('pillar_id', $filters['pillar_ids']);
        }

        if (isset($filters['department_ids'])) {
            $query->whereIn('department_id', $filters['department_ids']);
        }

        return $query->get();
    }

    /**
     * Get pillar progress data
     */
    private function getPillarProgressData($startDate, $endDate, array $filters)
    {
        return SrapPillar::with(['kpis' => function($query) use ($startDate, $endDate) {
            $query->whereBetween('created_at', [$startDate, $endDate]);
        }])->get()->map(function($pillar) {
            $pillar->progress_percentage = $pillar->kpis->avg('progress_percentage') ?? 0;
            $pillar->kpis_count = $pillar->kpis->count();
            $pillar->completed_kpis = $pillar->kpis->where('status', 'completed')->count();
            return $pillar;
        });
    }

    /**
     * Get department performance data
     */
    private function getDepartmentPerformanceData($startDate, $endDate, array $filters)
    {
        return Department::with(['kpis' => function($query) use ($startDate, $endDate) {
            $query->whereBetween('created_at', [$startDate, $endDate]);
        }])->get()->map(function($department) {
            $department->kpis_count = $department->kpis->count();
            $department->completed_kpis = $department->kpis->where('status', 'completed')->count();
            $department->active_kpis = $department->kpis->whereIn('status', ['active', 'on_track', 'at_risk'])->count();
            $department->avg_progress = $department->kpis->avg('progress_percentage') ?? 0;
            return $department;
        });
    }

    /**
     * Get milestone status data
     */
    private function getMilestoneStatusData($startDate, $endDate, array $filters)
    {
        return Milestone::with(['kpi.pillar', 'assignedUser'])
            ->whereBetween('due_date', [$startDate, $endDate])
            ->get();
    }

    /**
     * Get comprehensive report data
     */
    private function getComprehensiveData($startDate, $endDate, array $filters)
    {
        $kpis = $this->getKpiSummaryData($startDate, $endDate, $filters);
        $pillars = $this->getPillarProgressData($startDate, $endDate, $filters);
        $departments = $this->getDepartmentPerformanceData($startDate, $endDate, $filters);
        $milestones = $this->getMilestoneStatusData($startDate, $endDate, $filters);

        return [
            'kpis' => $kpis,
            'pillars' => $pillars,
            'departments' => $departments,
            'milestones' => $milestones,
            'total_kpis' => $kpis->count(),
            'total_milestones' => $milestones->count(),
            'overall_progress' => $kpis->avg('progress_percentage') ?? 0
        ];
    }

    /**
     * Calculate date range based on period
     */
    private function calculateDateRange($period, $customStart = null, $customEnd = null)
    {
        $now = now();
        
        switch ($period) {
            case 'current_month':
                return [
                    'start' => $now->startOfMonth()->toDateString(),
                    'end' => $now->endOfMonth()->toDateString()
                ];
            case 'last_month':
                return [
                    'start' => $now->subMonth()->startOfMonth()->toDateString(),
                    'end' => $now->endOfMonth()->toDateString()
                ];
            case 'current_quarter':
                return [
                    'start' => $now->startOfQuarter()->toDateString(),
                    'end' => $now->endOfQuarter()->toDateString()
                ];
            case 'last_quarter':
                return [
                    'start' => $now->subQuarter()->startOfQuarter()->toDateString(),
                    'end' => $now->endOfQuarter()->toDateString()
                ];
            case 'current_year':
                return [
                    'start' => $now->startOfYear()->toDateString(),
                    'end' => $now->endOfYear()->toDateString()
                ];
            case 'custom':
                return [
                    'start' => $customStart ?? $now->subMonth()->toDateString(),
                    'end' => $customEnd ?? $now->toDateString()
                ];
            default:
                return [
                    'start' => $now->subMonth()->toDateString(),
                    'end' => $now->toDateString()
                ];
        }
    }
}
