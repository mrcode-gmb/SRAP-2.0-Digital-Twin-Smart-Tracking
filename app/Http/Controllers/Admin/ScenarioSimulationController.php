<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Kpis;
use App\Models\SrapPillar;
use App\Models\Department;
use App\Models\Milestone;
use App\Models\AiPrediction;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class ScenarioSimulationController extends Controller
{
    /**
     * Display scenario simulation dashboard
     */
    public function index(Request $request)
    {
        $query = AiPrediction::where('prediction_type', 'scenario_simulation')
            ->with('requester')
            ->orderBy('created_at', 'desc');

        // Apply filters
        if ($request->filled('search')) {
            $query->where('notes', 'like', '%' . $request->search . '%');
        }

        if ($request->filled('type')) {
            $query->whereJsonContains('input_data->scenario_type', $request->type);
        }

        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        $scenarios = $query->paginate(12)->through(function ($prediction) {
            $inputData = $prediction->input_data;
            return [
                'id' => $prediction->id,
                'name' => $inputData['name'] ?? 'Unnamed Scenario',
                'description' => $inputData['description'] ?? '',
                'type' => $inputData['scenario_type'] ?? 'unknown',
                'status' => $prediction->status,
                'parameters' => $inputData['parameters'] ?? [],
                'created_at' => $prediction->created_at,
                'last_run_at' => $prediction->created_at,
                'results' => $prediction->prediction_result,
                'confidence_score' => $prediction->confidence_score
            ];
        });
        
        return Inertia::render('Admin/Scenarios', [
            'scenarios' => $scenarios,
            'filters' => $request->only(['search', 'type', 'status'])
        ]);
    }

    /**
     * Create new scenario simulation
     */
    public function create()
    {
        $kpis = Kpis::active()->with('pillar')->get(['id', 'name', 'pillar_id']);
        $pillars = SrapPillar::active()->get(['id', 'name']);
        $departments = Department::active()->get(['id', 'name']);
        
        return Inertia::render('Admin/Scenarios/Create', [
            'kpis' => $kpis,
            'pillars' => $pillars,
            'departments' => $departments
        ]);
    }

    /**
     * Store a newly created scenario
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'parameters' => 'required|array',
            'target_kpis' => 'nullable|array',
            'target_kpis.*' => 'exists:kpis,id',
            'duration_months' => 'required|integer|min:1|max:24'
        ]);

        try {
            // Create scenario as AI prediction record
            $scenario = AiPrediction::create([
                'prediction_type' => 'scenario_template',
                'target_type' => 'scenario_config',
                'target_id' => null,
                'input_data' => $validated,
                'prediction_result' => [
                    'status' => 'created',
                    'ready_for_simulation' => true
                ],
                'confidence_score' => null,
                'prediction_date' => now(),
                'model_version' => 'SRAP_Scenario_Template_v1.0',
                'status' => 'pending',
                'notes' => 'Scenario template: ' . $validated['name'],
                'requested_by' => Auth::id()
            ]);

            return redirect()->route('admin.scenarios.show', $scenario->id)
                ->with('success', 'Scenario created successfully!');
            
        } catch (\Exception $e) {
            return back()->withErrors(['error' => 'Failed to create scenario: ' . $e->getMessage()]);
        }
    }

    /**
     * Run scenario simulation
     */
    public function simulate(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'scenario_type' => 'required|in:what_if,budget_impact,timeline_change,resource_allocation',
            'parameters' => 'required|array',
            'target_kpis' => 'nullable|array',
            'target_kpis.*' => 'exists:kpis,id',
            'simulation_period' => 'required|in:3_months,6_months,1_year,2_years'
        ]);

        try {
            $results = $this->runSimulation($validated);
            
            // Store simulation results as AI prediction
            $prediction = AiPrediction::create([
                'prediction_type' => 'scenario_simulation',
                'target_type' => 'multiple_kpis',
                'target_id' => null,
                'input_data' => $validated,
                'prediction_result' => $results,
                'confidence_score' => $results['confidence'] ?? 0.75,
                'prediction_date' => now(),
                'model_name' => 'SRAP_Scenario_Engine',
                'model_version' => '1.0',
                'status' => 'completed',
                'notes' => 'Scenario simulation: ' . $validated['name'],
                'requested_by' => Auth::id()
            ]);

            return redirect()->route('admin.scenarios.show', $prediction->id)
                ->with('success', 'Scenario simulation completed successfully!');
            
        } catch (\Exception $e) {
            return back()->withErrors(['error' => 'Simulation failed: ' . $e->getMessage()]);
        }
    }

    /**
     * Show simulation results
     */
    public function show(AiPrediction $simulation)
    {
        if ($simulation->prediction_type !== 'scenario_simulation') {
            abort(404, 'Simulation not found');
        }
        
        $simulation->load('requester');
        
        return Inertia::render('Admin/Scenarios/Show', [
            'simulation' => $simulation
        ]);
    }

    /**
     * Compare multiple scenarios
     */
    public function compare(Request $request)
    {
        $validated = $request->validate([
            'simulation_ids' => 'required|array|min:2|max:4',
            'simulation_ids.*' => 'exists:ai_predictions,id'
        ]);

        $simulations = AiPrediction::whereIn('id', $validated['simulation_ids'])
            ->where('prediction_type', 'scenario_simulation')
            ->with('requester')
            ->get();

        $comparison = $this->generateComparison($simulations);
        
        return Inertia::render('Admin/Scenarios/Compare', [
            'simulations' => $simulations,
            'comparison' => $comparison
        ]);
    }

    /**
     * Export simulation results
     */
    public function export(AiPrediction $simulation, $format = 'pdf')
    {
        if ($simulation->prediction_type !== 'scenario_simulation') {
            abort(404, 'Simulation not found');
        }

        // This would generate PDF/Excel export of simulation results
        return back()->with('info', 'Export functionality will be implemented.');
    }

    /**
     * Run the actual simulation logic
     */
    private function runSimulation(array $parameters)
    {
        $scenarioType = $parameters['scenario_type'];
        $simulationPeriod = $parameters['simulation_period'];
        $targetKpis = $parameters['target_kpis'] ?? [];
        $params = $parameters['parameters'];

        // Get baseline data
        $baselineData = $this->getBaselineData($targetKpis);
        
        // Run simulation based on type
        switch ($scenarioType) {
            case 'what_if':
                $results = $this->runWhatIfSimulation($baselineData, $params, $simulationPeriod);
                break;
            case 'budget_impact':
                $results = $this->runBudgetImpactSimulation($baselineData, $params, $simulationPeriod);
                break;
            case 'timeline_change':
                $results = $this->runTimelineChangeSimulation($baselineData, $params, $simulationPeriod);
                break;
            case 'resource_allocation':
                $results = $this->runResourceAllocationSimulation($baselineData, $params, $simulationPeriod);
                break;
            default:
                throw new \Exception('Invalid scenario type');
        }

        return $results;
    }

    /**
     * What-if scenario simulation
     */
    private function runWhatIfSimulation($baseline, $params, $period)
    {
        $results = [
            'scenario_type' => 'what_if',
            'confidence' => 0.75,
            'period' => $period,
            'projections' => [],
            'impact_analysis' => [],
            'recommendations' => []
        ];

        // Simulate impact of parameter changes
        foreach ($baseline as $kpiId => $kpiData) {
            $impactFactor = $params['impact_factor'] ?? 1.1;
            $projectedValue = $kpiData['current_value'] * $impactFactor;
            
            $results['projections'][$kpiId] = [
                'kpi_id' => $kpiId,
                'kpi_name' => $kpiData['name'],
                'current_value' => $kpiData['current_value'],
                'projected_value' => $projectedValue,
                'change_percentage' => (($projectedValue - $kpiData['current_value']) / $kpiData['current_value']) * 100,
                'target_achievement' => ($projectedValue / $kpiData['target_value']) * 100
            ];
        }

        $results['impact_analysis'] = [
            'positive_impacts' => count(array_filter($results['projections'], fn($p) => $p['change_percentage'] > 0)),
            'negative_impacts' => count(array_filter($results['projections'], fn($p) => $p['change_percentage'] < 0)),
            'overall_improvement' => array_sum(array_column($results['projections'], 'change_percentage')) / count($results['projections'])
        ];

        $results['recommendations'] = [
            'Focus on KPIs with highest positive impact potential',
            'Monitor KPIs showing negative trends closely',
            'Consider resource reallocation to maximize gains'
        ];

        return $results;
    }

    /**
     * Budget impact simulation
     */
    private function runBudgetImpactSimulation($baseline, $params, $period)
    {
        $budgetChange = $params['budget_change_percentage'] ?? 0;
        $allocation = $params['budget_allocation'] ?? [];
        
        $results = [
            'scenario_type' => 'budget_impact',
            'confidence' => 0.80,
            'period' => $period,
            'budget_analysis' => [
                'total_budget_change' => $budgetChange,
                'allocation_strategy' => $allocation
            ],
            'kpi_impacts' => [],
            'roi_projections' => []
        ];

        // Calculate impact on each KPI based on budget changes
        foreach ($baseline as $kpiId => $kpiData) {
            $budgetImpact = $budgetChange * 0.6; // Assume 60% efficiency
            $projectedImprovement = $budgetImpact > 0 ? $budgetImpact * 0.8 : $budgetImpact * 1.2;
            
            $results['kpi_impacts'][$kpiId] = [
                'kpi_id' => $kpiId,
                'kpi_name' => $kpiData['name'],
                'budget_impact' => $budgetImpact,
                'projected_improvement' => $projectedImprovement,
                'roi_estimate' => $projectedImprovement > 0 ? $projectedImprovement / abs($budgetChange) : 0
            ];
        }

        return $results;
    }

    /**
     * Timeline change simulation
     */
    private function runTimelineChangeSimulation($baseline, $params, $period)
    {
        $timelineChange = $params['timeline_change_months'] ?? 0;
        
        return [
            'scenario_type' => 'timeline_change',
            'confidence' => 0.70,
            'period' => $period,
            'timeline_impact' => [
                'acceleration_months' => abs($timelineChange),
                'direction' => $timelineChange > 0 ? 'acceleration' : 'delay',
                'feasibility_score' => $this->calculateFeasibilityScore($timelineChange)
            ],
            'milestone_adjustments' => $this->calculateMilestoneAdjustments($timelineChange),
            'resource_requirements' => $this->calculateResourceRequirements($timelineChange)
        ];
    }

    /**
     * Resource allocation simulation
     */
    private function runResourceAllocationSimulation($baseline, $params, $period)
    {
        $allocation = $params['resource_allocation'] ?? [];
        
        return [
            'scenario_type' => 'resource_allocation',
            'confidence' => 0.85,
            'period' => $period,
            'allocation_strategy' => $allocation,
            'efficiency_gains' => $this->calculateEfficiencyGains($allocation),
            'bottleneck_analysis' => $this->identifyBottlenecks($allocation)
        ];
    }

    /**
     * Get baseline data for simulation
     */
    private function getBaselineData($kpiIds = [])
    {
        $query = Kpis::active();
        
        if (!empty($kpiIds)) {
            $query->whereIn('id', $kpiIds);
        }
        
        return $query->get()->mapWithKeys(function ($kpi) {
            return [$kpi->id => [
                'name' => $kpi->name,
                'current_value' => $kpi->current_value,
                'target_value' => $kpi->target_value,
                'progress_percentage' => $kpi->progress_percentage
            ]];
        })->toArray();
    }

    /**
     * Get available simulation scenarios
     */
    private function getAvailableScenarios()
    {
        return [
            [
                'id' => 'what_if',
                'name' => 'What-If Analysis',
                'description' => 'Analyze the impact of changing key parameters',
                'icon' => 'TrendingUp',
                'complexity' => 'Medium'
            ],
            [
                'id' => 'budget_impact',
                'name' => 'Budget Impact',
                'description' => 'Simulate effects of budget changes on KPI performance',
                'icon' => 'DollarSign',
                'complexity' => 'High'
            ],
            [
                'id' => 'timeline_change',
                'name' => 'Timeline Adjustment',
                'description' => 'Model impact of accelerating or delaying milestones',
                'icon' => 'Clock',
                'complexity' => 'Medium'
            ],
            [
                'id' => 'resource_allocation',
                'name' => 'Resource Optimization',
                'description' => 'Optimize resource distribution across departments',
                'icon' => 'Users',
                'complexity' => 'High'
            ]
        ];
    }

    /**
     * Get recent simulations
     */
    private function getRecentSimulations()
    {
        return AiPrediction::where('prediction_type', 'scenario_simulation')
            ->with('requester')
            ->orderBy('created_at', 'desc')
            ->limit(10)
            ->get();
    }

    /**
     * Generate comparison between simulations
     */
    private function generateComparison($simulations)
    {
        // Implementation for comparing multiple scenarios
        return [
            'summary' => 'Comparison analysis of ' . $simulations->count() . ' scenarios',
            'best_scenario' => $simulations->first()->id,
            'key_differences' => [],
            'recommendations' => []
        ];
    }

    /**
     * Helper methods for simulation calculations
     */
    private function calculateFeasibilityScore($timelineChange)
    {
        return max(0, min(100, 80 - abs($timelineChange) * 5));
    }

    private function calculateMilestoneAdjustments($timelineChange)
    {
        return ['adjustment_factor' => $timelineChange * 0.1];
    }

    private function calculateResourceRequirements($timelineChange)
    {
        return ['additional_resources' => abs($timelineChange) * 0.15];
    }

    private function calculateEfficiencyGains($allocation)
    {
        return ['estimated_gain' => 15];
    }

    private function identifyBottlenecks($allocation)
    {
        return ['bottlenecks' => ['Resource constraints', 'Timeline dependencies']];
    }
}
