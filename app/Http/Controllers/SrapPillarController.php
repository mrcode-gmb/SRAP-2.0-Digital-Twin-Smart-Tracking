<?php

namespace App\Http\Controllers;

use App\Models\SrapPillar;
use App\Models\Kpis;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class SrapPillarController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $query = SrapPillar::withCount(['kpis', 'activeKpis'])
            ->with(['kpis' => function ($q) {
                $q->select('id', 'pillar_id', 'current_value', 'target_value')
                  ->selectRaw('ROUND((current_value / target_value) * 100, 2) as progress_percentage');
            }])
            ->orderBy('code', 'asc');

        // Apply filters
        if ($request->filled('search')) {
            $query->where(function ($q) use ($request) {
                $q->where('name', 'like', '%' . $request->search . '%')
                  ->orWhere('code', 'like', '%' . $request->search . '%')
                  ->orWhere('description', 'like', '%' . $request->search . '%');
            });
        }

        if ($request->filled('status')) {
            $query->where('is_active', $request->status === 'active');
        }

        $pillars = $query->paginate(12)->withQueryString();

        // Calculate overall progress for each pillar
        foreach ($pillars as $pillar) {
            $totalKpis = $pillar->kpis->count();
            if ($totalKpis > 0) {
                $averageProgress = $pillar->kpis->avg('progress_percentage');
                $pillar->overall_progress = round($averageProgress, 2);
            } else {
                $pillar->overall_progress = 0;
            }
        }

        return Inertia::render('SrapPillar/Index', [
            'pillars' => $pillars,
            'filters' => $request->only(['search', 'status'])
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('SrapPillar/Create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'code' => 'required|string|max:10|unique:srap_pillars,code',
            'description' => 'required|string',
            'objectives' => 'nullable|string',
            'success_metrics' => 'nullable|string',
            'target_completion_date' => 'nullable|date',
            'budget_allocation' => 'nullable|numeric|min:0',
            'responsible_department' => 'nullable|string|max:255',
            'priority_level' => 'required|in:low,medium,high,critical',
            'is_active' => 'boolean'
        ]);

        $pillar = SrapPillar::create($validated);

        return redirect()->route('srap-pillars.show', $pillar)
            ->with('success', 'SRAP Pillar created successfully!');
    }

    /**
     * Display the specified resource.
     */
    public function show(SrapPillar $srapPillar)
    {
        $srapPillar->load([
            'kpis' => function ($query) {
                $query->with(['assignedUser', 'department'])
                      ->selectRaw('*, ROUND((current_value / target_value) * 100, 2) as progress_percentage')
                      ->orderBy('created_at', 'desc');
            },
            'kpis.milestones' => function ($query) {
                $query->orderBy('due_date', 'asc')->limit(5);
            }
        ]);

        // Calculate pillar statistics
        $totalKpis = $srapPillar->kpis->count();
        $completedKpis = $srapPillar->kpis->where('progress_percentage', '>=', 100)->count();
        $onTrackKpis = $srapPillar->kpis->whereBetween('progress_percentage', [75, 99])->count();
        $atRiskKpis = $srapPillar->kpis->where('progress_percentage', '<', 75)->count();
        $overallProgress = $totalKpis > 0 ? round($srapPillar->kpis->avg('progress_percentage'), 2) : 0;

        return Inertia::render('SrapPillar/Show', [
            'pillar' => $srapPillar,
            'statistics' => [
                'total_kpis' => $totalKpis,
                'completed_kpis' => $completedKpis,
                'on_track_kpis' => $onTrackKpis,
                'at_risk_kpis' => $atRiskKpis,
                'overall_progress' => $overallProgress
            ]
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(SrapPillar $srapPillar)
    {
        return Inertia::render('SrapPillar/Edit', [
            'pillar' => $srapPillar
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, SrapPillar $srapPillar)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'code' => 'required|string|max:10|unique:srap_pillars,code,' . $srapPillar->id,
            'description' => 'required|string',
            'objectives' => 'nullable|string',
            'success_metrics' => 'nullable|string',
            'target_completion_date' => 'nullable|date',
            'budget_allocation' => 'nullable|numeric|min:0',
            'responsible_department' => 'nullable|string|max:255',
            'priority_level' => 'required|in:low,medium,high,critical',
            'is_active' => 'boolean'
        ]);

        $srapPillar->update($validated);

        return redirect()->route('srap-pillars.show', $srapPillar)
            ->with('success', 'SRAP Pillar updated successfully!');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(SrapPillar $srapPillar)
    {
        // Check if pillar has associated KPIs
        if ($srapPillar->kpis()->count() > 0) {
            return redirect()->route('srap-pillars.index')
                ->with('error', 'Cannot delete pillar with associated KPIs. Please reassign or delete KPIs first.');
        }

        $srapPillar->delete();

        return redirect()->route('srap-pillars.index')
            ->with('success', 'SRAP Pillar deleted successfully!');
    }
}
