<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Alert;
use App\Models\Kpis;
use App\Models\Milestone;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Mail;
use Inertia\Inertia;

class AlertController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        
        $query = Alert::with(['alertable', 'acknowledgedBy'])
            ->orderBy('triggered_at', 'desc');

        // Filter by type
        if ($request->filled('type')) {
            $query->where('type', $request->type);
        }

        // Filter by priority
        if ($request->filled('priority')) {
            $query->where('priority', $request->priority);
        }

        // Filter by read status
        if ($request->filled('read_status')) {
            if ($request->read_status === 'unread') {
                $query->whereNull('read_at');
            } else {
                $query->whereNotNull('read_at');
            }
        }

        $alerts = $query->paginate(20)->withQueryString();

        return Inertia::render('Admin/Alerts', [
            'alerts' => $alerts,
            'filters' => $request->only(['type', 'priority', 'read_status'])
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $kpis = Kpis::active()->get(['id', 'name']);
        $milestones = Milestone::with('kpi:id,name')->get(['id', 'name', 'kpi_id']);

        return Inertia::render('Admin/Alerts/Create', [
            'kpis' => $kpis,
            'milestones' => $milestones
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
    
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'message' => 'required|string',
            'type' => 'required|in:deadline,performance,system,milestone,kpi_update',
            'priority' => 'required|integer|between:1,5',
            'alertable_type' => 'nullable|string',
            'alertable_id' => 'nullable|integer',
            'recipients' => 'nullable|array',
            'recipients.*' => 'email',
            'send_email' => 'boolean',
            'metadata' => 'nullable|array'
        ]);

        $alert = Alert::create([
            'title' => $validated['title'],
            'message' => $validated['message'],
            'type' => $validated['type'],
            'priority' => $validated['priority'],
            'alertable_type' => $request->alertable_type ?? null,
            'alertable_id' => $validated['alertable_id'] ?? null,
            'recipients' => $validated['recipients'] ?? [],
            'triggered_at' => now(),
            'metadata' => $validated['metadata'] ?? []
        ]);

        // Send email notifications if requested
        if ($validated['send_email'] && !empty($validated['recipients'])) {
            $this->sendEmailNotifications($alert, $validated['recipients']);
        }

        return redirect()->route('admin.alerts.index')
            ->with('success', 'Alert created successfully.');
    }

    /**
     * Display the specified resource.
     */
    public function show(Alert $alert)
    {
        $alert->load(['alertable', 'acknowledgedBy']);

        // Mark as read if not already
        if (!$alert->read_at) {
            $alert->update(['read_at' => now()]);
        }

        return Inertia::render('Admin/Alerts/Show', [
            'alert' => $alert
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Alert $alert)
    {
        $kpis = Kpis::active()->get(['id', 'name']);
        $milestones = Milestone::with('kpi:id,name')->get(['id', 'name', 'kpi_id']);

        return Inertia::render('Admin/Alerts/Edit', [
            'alert' => $alert,
            'kpis' => $kpis,
            'milestones' => $milestones
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Alert $alert)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'message' => 'required|string',
            'type' => 'required|in:deadline,performance,system,milestone,kpi_update',
            'priority' => 'required|integer|between:1,5',
            'recipients' => 'nullable|array',
            'recipients.*' => 'email',
            'metadata' => 'nullable|array'
        ]);

        $alert->update($validated);

        return redirect()->route('admin.alerts.index')
            ->with('success', 'Alert updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Alert $alert)
    {
        $alert->delete();

        return redirect()->route('admin.alerts.index')
            ->with('success', 'Alert deleted successfully.');
    }

    /**
     * Mark alert as acknowledged
     */
    public function acknowledge(Alert $alert)
    {
        $alert->update([
            'acknowledged_at' => now(),
            'acknowledged_by' => Auth::id()
        ]);

        return back()->with('success', 'Alert acknowledged.');
    }

    /**
     * Mark multiple alerts as read
     */
    public function markAsRead(Request $request)
    {
        $validated = $request->validate([
            'alert_ids' => 'required|array',
            'alert_ids.*' => 'integer|exists:alerts,id'
        ]);

        Alert::whereIn('id', $validated['alert_ids'])
            ->whereNull('read_at')
            ->update(['read_at' => now()]);

        return back()->with('success', 'Alerts marked as read.');
    }

    /**
     * Get unread alerts count for notifications
     */
    public function getUnreadCount()
    {
        $count = Alert::unread()->count();
        
        return response()->json(['count' => $count]);
    }

    /**
     * Send email notifications for alert
     */
    private function sendEmailNotifications(Alert $alert, array $recipients)
    {
        // Implementation for sending email notifications
        // This would integrate with Laravel's Mail system
        foreach ($recipients as $email) {
            // Mail::to($email)->send(new AlertNotification($alert));
        }

        $alert->update(['email_sent' => true]);
    }

    /**
     * Create automatic alerts based on KPI/Milestone conditions
     */
    public static function createAutomaticAlerts()
    {
        // Check for overdue milestones
        $overdueMilestones = Milestone::overdue()->get();
        foreach ($overdueMilestones as $milestone) {
            Alert::firstOrCreate([
                'alertable_type' => Milestone::class,
                'alertable_id' => $milestone->id,
                'type' => 'deadline',
                'title' => 'Overdue Milestone: ' . $milestone->name
            ], [
                'message' => "Milestone '{$milestone->name}' is overdue. Due date was {$milestone->due_date->format('Y-m-d')}.",
                'priority' => 1,
                'triggered_at' => now()
            ]);
        }

        // Check for at-risk KPIs
        $atRiskKpis = Kpis::where('status', 'at_risk')->get();
        foreach ($atRiskKpis as $kpi) {
            Alert::firstOrCreate([
                'alertable_type' => Kpis::class,
                'alertable_id' => $kpi->id,
                'type' => 'performance',
                'title' => 'KPI At Risk: ' . $kpi->name
            ], [
                'message' => "KPI '{$kpi->name}' is at risk of not meeting targets.",
                'priority' => 2,
                'triggered_at' => now()
            ]);
        }
    }
}
