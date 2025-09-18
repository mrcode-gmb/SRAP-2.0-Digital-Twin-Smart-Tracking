<?php

namespace App\Http\Controllers;

use App\Models\Milestone;
use App\Models\Kpis;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class MilestoneController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $query = Milestone::with(['kpi.pillar', 'assignedUser'])
            ->orderBy('due_date', 'asc');

        // Apply filters
        if ($request->filled('search')) {
            $query->where(function ($q) use ($request) {
                $q->where('title', 'like', '%' . $request->search . '%')
                  ->orWhere('description', 'like', '%' . $request->search . '%');
            });
        }

        if ($request->filled('kpi')) {
            $query->where('kpi_id', $request->kpi);
        }

        if ($request->filled('status')) {
            switch ($request->status) {
                case 'completed':
                    $query->where('completion_percentage', '>=', 100);
                    break;
                case 'in_progress':
                    $query->whereBetween('completion_percentage', [1, 99]);
                    break;
                case 'not_started':
                    $query->where('completion_percentage', 0);
                    break;
                case 'overdue':
                    $query->where('due_date', '<', now())
                          ->where('completion_percentage', '<', 100);
                    break;
            }
        }

        $milestones = $query->paginate(12)->withQueryString();
        $kpis = Kpis::active()->with('pillar')->get();
        return Inertia::render('Milestone/Index', [
            'milestones' => $milestones,
            'kpis' => $kpis,
            'filters' => $request->only(['search', 'kpi', 'status'])
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(Request $request)
    {
        $kpis = Kpis::active()->with('pillar')->get(['id', 'name', 'pillar_id']);
        $users = User::active()->get(['id', 'name', 'email']);
        $selectedKpi = $request->get('kpi_id');

        return Inertia::render('Milestone/Create', [
            'kpis' => $kpis,
            'users' => $users,
            'selectedKpi' => $selectedKpi
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'kpi_id' => 'required|exists:kpis,id',
            'assigned_to' => 'nullable|exists:users,id',
            'due_date' => 'required|date|after:today',
            'priority' => 'required|in:low,medium,high,critical',
            'completion_percentage' => 'required|integer|min:0|max:100',
            'deliverables' => 'nullable|string',
            'success_criteria' => 'nullable|string',
            'dependencies' => 'nullable|string',
            'is_active' => 'boolean'
        ]);

        $milestone = Milestone::create([
            ...$validated,
            'created_by' => Auth::id()
        ]);

        return redirect()->route('milestones.show', $milestone)
            ->with('success', 'Milestone created successfully!');
    }

    /**
     * Display the specified resource.
     */
    public function show(Milestone $milestone)
    {
        $milestone->load(['kpi.pillar', 'assignedUser', 'creator']);

        return Inertia::render('Milestone/Show', [
            'milestone' => $milestone
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Milestone $milestone)
    {
        $kpis = Kpis::active()->with('pillar')->get(['id', 'name', 'pillar_id']);
        $users = User::active()->get(['id', 'name', 'email']);

        return Inertia::render('Milestone/Edit', [
            'milestone' => $milestone,
            'kpis' => $kpis,
            'users' => $users
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Milestone $milestone)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'kpi_id' => 'required|exists:kpis,id',
            'assigned_to' => 'nullable|exists:users,id',
            'due_date' => 'required|date',
            'priority' => 'required|in:low,medium,high,critical',
            'completion_percentage' => 'required|integer|min:0|max:100',
            'deliverables' => 'nullable|string',
            'success_criteria' => 'nullable|string',
            'dependencies' => 'nullable|string',
            'is_active' => 'boolean'
        ]);

        $milestone->update($validated);

        return redirect()->route('milestones.show', $milestone)
            ->with('success', 'Milestone updated successfully!');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Milestone $milestone)
    {
        $milestone->delete();

        return redirect()->route('milestones.index')
            ->with('success', 'Milestone deleted successfully!');
    }
}
