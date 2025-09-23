<?php

namespace App\Http\Controllers;

use App\Models\Initiative;
use App\Models\SrapPillar;
use App\Models\Department;
use App\Models\Kpis;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;

class InitiativeController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $query = Initiative::with(['pillar', 'department', 'creator', 'kpis']);

        // Apply filters
        if ($request->filled('pillar')) {
            $query->where('pillar_id', $request->pillar);
        }

        if ($request->filled('department')) {
            $query->where('department_id', $request->department);
        }

        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        if ($request->filled('search')) {
            $query->where(function($q) use ($request) {
                $q->where('name', 'like', '%' . $request->search . '%')
                  ->orWhere('code', 'like', '%' . $request->search . '%')
                  ->orWhere('description', 'like', '%' . $request->search . '%');
            });
        }

        $initiatives = $query->orderBy('created_at', 'desc')->paginate(15);

        return Inertia::render('Initiatives/Index', [
            'initiatives' => $initiatives,
            'pillars' => SrapPillar::active()->ordered()->get(),
            'departments' => Department::active()->get(),
            'filters' => $request->only(['pillar', 'department', 'status', 'search'])
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('Initiatives/Create', [
            'pillars' => SrapPillar::active()->ordered()->get(),
            'departments' => Department::active()->get()
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'code' => 'required|string|max:50|unique:initiatives',
            'description' => 'required|string',
            'pillar_id' => 'required|exists:srap_pillars,id',
            'department_id' => 'nullable|exists:departments,id',
            'start_date' => 'required|date',
            'end_date' => 'required|date|after:start_date',
            'priority' => 'required|integer|between:1,3',
            'budget' => 'nullable|numeric|min:0',
            'lead_agency' => 'nullable|string|max:255',
            'status' => 'required|in:not_started,in_progress,on_track,at_risk,behind,completed'
        ]);

        $validated['created_by'] = Auth::id();

        $initiative = Initiative::create($validated);

        return redirect()->route('initiatives.show', $initiative)
            ->with('success', 'Initiative created successfully.');
    }

    /**
     * Display the specified resource.
     */
    public function show(Initiative $initiative)
    {
        $initiative->load(['pillar', 'department', 'creator', 'kpis.progress']);

        return Inertia::render('Initiatives/Show', [
            'initiative' => $initiative,
            'kpis' => $initiative->kpis()->with(['progress', 'milestones'])->get()
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Initiative $initiative)
    {
        return Inertia::render('Initiatives/Edit', [
            'initiative' => $initiative,
            'pillars' => SrapPillar::active()->ordered()->get(),
            'departments' => Department::active()->get()
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Initiative $initiative)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'code' => 'required|string|max:50|unique:initiatives,code,' . $initiative->id,
            'description' => 'required|string',
            'pillar_id' => 'required|exists:srap_pillars,id',
            'department_id' => 'nullable|exists:departments,id',
            'start_date' => 'required|date',
            'end_date' => 'required|date|after:start_date',
            'priority' => 'required|integer|between:1,3',
            'budget' => 'nullable|numeric|min:0',
            'lead_agency' => 'nullable|string|max:255',
            'status' => 'required|in:not_started,in_progress,on_track,at_risk,behind,completed'
        ]);

        $initiative->update($validated);

        return redirect()->route('initiatives.show', $initiative)
            ->with('success', 'Initiative updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Initiative $initiative)
    {
        // Check if initiative has linked KPIs
        if ($initiative->kpis()->count() > 0) {
            return back()->with('error', 'Cannot delete initiative with linked KPIs. Please remove KPI links first.');
        }

        $initiative->delete();

        return redirect()->route('initiatives.index')
            ->with('success', 'Initiative deleted successfully.');
    }

    /**
     * Link KPIs to initiative
     */
    public function linkKpis(Request $request, Initiative $initiative)
    {
        $validated = $request->validate([
            'kpi_ids' => 'required|array',
            'kpi_ids.*' => 'exists:kpis,id'
        ]);

        Kpis::whereIn('id', $validated['kpi_ids'])
            ->update(['initiative_id' => $initiative->id]);

        return back()->with('success', 'KPIs linked to initiative successfully.');
    }

    /**
     * Unlink KPI from initiative
     */
    public function unlinkKpi(Initiative $initiative, Kpis $kpi)
    {
        $kpi->update(['initiative_id' => null]);

        return back()->with('success', 'KPI unlinked from initiative successfully.');
    }
}
