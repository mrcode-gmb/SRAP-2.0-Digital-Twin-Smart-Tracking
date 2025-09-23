<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Kpis;
use App\Models\SrapPillar;
use App\Models\Department;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\Rule;

class KpiController extends Controller
{
    public function index(Request $request)
    {
        $query = Kpis::with(['pillar', 'department', 'creator'])
            ->when($request->search, function ($query, $search) {
                $query->where('name', 'like', "%{$search}%")
                      ->orWhere('code', 'like', "%{$search}%")
                      ->orWhere('description', 'like', "%{$search}%");
            })
            ->when($request->pillar_id, function ($query, $pillarId) {
                $query->where('pillar_id', $pillarId);
            })
            ->when($request->department_id, function ($query, $departmentId) {
                $query->where('department_id', $departmentId);
            })
            ->when($request->status, function ($query, $status) {
                $query->where('status', $status);
            })
            ->orderBy('created_at', 'desc');

        $kpis = $query->paginate(15)->withQueryString();

        return Inertia::render('Admin/Kpi/KPI', [
            'kpis' => $kpis,
            'pillars' => SrapPillar::active()->ordered()->get(),
            'departments' => Department::active()->get(),
            'filters' => $request->only(['search', 'pillar_id', 'department_id', 'status']),
            'statuses' => [
                'not_started' => 'Not Started',
                'in_progress' => 'In Progress',
                'on_track' => 'On Track',
                'at_risk' => 'At Risk',
                'behind' => 'Behind',
                'completed' => 'Completed'
            ]
        ]);
    }

    public function create()
    {
        return Inertia::render('Admin/Kpi/Create', [
            'pillars' => SrapPillar::active()->ordered()->get(),
            'initiatives' => \App\Models\Initiative::active()->with('pillar')->get(),
            'departments' => Department::active()->get(),
            'users'=> User::where('role', '!=', 'admin')->active()->get(),
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'code' => 'required|string|max:50|unique:kpis,code',
            'description' => 'required|string',
            'assigned_to'=> 'required|exists:users,id',
            'pillar_id' => 'required|exists:srap_pillars,id',
            'initiative_id' => 'nullable|exists:initiatives,id',
            'department_id' => 'nullable|exists:departments,id',
            'measurement_type' => 'required|in:percentage,number,currency,ratio',
            'target_value' => 'required|numeric|min:0',
            'current_value'=> 'required|numeric|min:0',
            'unit' => 'nullable|string|max:50',
            'frequency' => 'required|in:daily,weekly,monthly,quarterly,annually',
            'start_date' => 'required|date',
            'end_date' => 'required|date|after:start_date',
            'priority' => 'required|integer|min:1|max:3',
            'weight' => 'required|numeric|min:0|max:100',
            "baseline_value" => 'required|numeric|min:0',
            "baseline_date" => 'required|date',
        ]);

        $validated['created_by'] = Auth::id();
        $validated['status'] = 'not_started';
        $validated['current_value']= $request->current_value;

        $kpi = Kpis::create($validated);

        return redirect()->route('admin.kpis.show', $kpi)
            ->with('success', 'KPI created successfully.');
    }

    public function show(Kpis $kpi)
    {
        $kpi->load(['pillar', 'department', 'creator', 'milestones.assignedUser', 'progress.reporter']);
        
        $progressData = $kpi->progress()
            ->orderBy('reporting_date', 'desc')
            ->limit(12)
            ->get();

        return Inertia::render('Admin/Kpi/Show', [
            'kpi' => $kpi,
            'progressData' => $progressData,
            'milestones' => $kpi->milestones()->with('assignedUser')->get(),
        ]);
    }

    public function edit(Kpis $kpi)
    {
        return Inertia::render('Admin/Kpi/Edit', [
            'kpi' => $kpi,
            'pillars' => SrapPillar::active()->ordered()->get(),
            'departments' => Department::active()->get(),
        ]);
    }

    public function update(Request $request, Kpis $kpi)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'code' => ['required', 'string', 'max:50', Rule::unique('kpis')->ignore($kpi->id)],
            'description' => 'required|string',
            'pillar_id' => 'required|exists:srap_pillars,id',
            'department_id' => 'nullable|exists:departments,id',
            'measurement_type' => 'required|in:percentage,number,currency,ratio',
            'target_value' => 'required|numeric|min:0',
            'current_value' => 'required|numeric|min:0',
            'unit' => 'nullable|string|max:50',
            'frequency' => 'required|in:daily,weekly,monthly,quarterly,annually',
            'start_date' => 'required|date',
            'end_date' => 'required|date|after:start_date',
            'status' => 'required|in:not_started,in_progress,on_track,at_risk,behind,completed',
            'priority' => 'required|integer|min:1|max:3',
            'weight' => 'required|numeric|min:0|max:100',
            'is_active' => 'boolean',
        ]);

        $kpi->update($validated);

        return redirect()->route('admin.kpis.show', $kpi)
            ->with('success', 'KPI updated successfully.');
    }

    public function destroy(Kpis $kpi)
    {
        $kpi->delete();

        return redirect()->route('admin.kpis.index')
            ->with('success', 'KPI deleted successfully.');
    }

    public function updateProgress(Request $request, Kpis $kpi)
    {
        $validated = $request->validate([
            'value' => 'required|numeric|min:0',
            'reporting_date' => 'required|date',
            'notes' => 'nullable|string',
        ]);

        $validated['kpi_id'] = $kpi->id;
        $validated['reported_by'] = Auth::id();
        $validated['entry_type'] = 'manual';
        $validated['percentage'] = min(100, ($validated['value'] / $kpi->target_value) * 100);

        $kpi->progress()->create($validated);
        
        // Update current value
        $kpi->update(['current_value' => $validated['value']]);

        return back()->with('success', 'Progress updated successfully.');
    }
}
