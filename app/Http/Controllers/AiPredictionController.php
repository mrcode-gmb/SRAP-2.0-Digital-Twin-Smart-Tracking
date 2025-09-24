<?php

namespace App\Http\Controllers;

use App\Models\AiPrediction;
use App\Models\Kpis;
use App\Models\Milestone;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Http;
use Inertia\Inertia;
use PhpOffice\PhpSpreadsheet\IOFactory;

class AiPredictionController extends Controller
{
    /**
     * Display AI predictions dashboard
     */
    public function index(Request $request)
    {
        $query = AiPrediction::with('requestedBy:id,name,email')
            ->select([
                'id', 'prediction_type', 'target_type', 'target_id', 
                'confidence_score', 'prediction_date', 'status', 
                'model_version', 'notes', 'requested_by', 
                'created_at', 'updated_at'
            ])
            ->orderBy('created_at', 'desc');

        // Filter by prediction type
        if ($request->filled('type')) {
            $query->where('prediction_type', $request->type);
        }

        // Filter by status
        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        $predictions = $query->paginate(20)->withQueryString();
        
        $stats = [
            'total_predictions' => AiPrediction::count(),
            'completed_predictions' => AiPrediction::where('status', 'completed')->count(),
            'avg_confidence' => round(AiPrediction::where('status', 'completed')->avg('confidence_score') ?? 0, 2),
            'recent_predictions' => AiPrediction::whereDate('created_at', '>=', now()->subDays(7))->count()
        ];

        return Inertia::render('AiPrediction/Index', [
            'predictions' => $predictions,
            'stats' => $stats,
            'filters' => $request->only(['type', 'status'])
        ]);
    }

    /**
     * Manual risk prediction for single input
     */
    public function manualPredict(Request $request)
    {
        $validated = $request->validate([
            'progress' => 'required|numeric|min:0|max:100',
            'budget_utilization' => 'required|numeric|min:0|max:100',
            'delay_days' => 'required|numeric|min:0',
            'engagement_score' => 'required|numeric|min:0|max:100'
        ]);

        try {
            // Call Flask API or use internal prediction logic
            $predictionData = $this->generateRiskPredictionFromInputs($validated);
            
            $prediction = AiPrediction::create([
                'prediction_type' => 'manual_risk_prediction',
                'target_type' => 'manual_input',
                'target_id' => null,
                'input_data' => $validated,
                'prediction_result' => $predictionData,
                'confidence_score' => $predictionData['confidence'],
                'prediction_date' => now(),
                'model_version' => 'SRAP_Risk_Predictor_v1.0',
                'status' => 'completed',
                'notes' => 'Manual risk prediction',
                'requested_by' => Auth::id()
            ]);

            return response()->json([
                'success' => true,
                'prediction_id' => $prediction->id,
                'results' => $predictionData
            ]);
            
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Bulk prediction from uploaded file
     */
    public function bulkPredict(Request $request)
    {
        $request->validate([
            'file' => 'required|file|mimes:xlsx,xls,csv|max:10240'
        ]);


        
        try {
            $file = $request->file('file');
            $predictions = $this->processBulkFile($file);
            
            $bulkPrediction = AiPrediction::create([
                'prediction_type' => 'bulk_risk_prediction',
                'target_type' => 'bulk_upload',
                'target_id' => null,
                'input_data' => ['file_name' => $file->getClientOriginalName(), 'records_count' => count($predictions)],
                'prediction_result' => ['predictions' => $predictions],
                'confidence_score' => collect($predictions)->avg('confidence'),
                'prediction_date' => now(),
                'model_version' => 'SRAP_Risk_Predictor_v1.0',
                'status' => 'completed',
                'notes' => 'Bulk risk prediction from uploaded file',
                'requested_by' => Auth::id()
            ]);

            return response()->json([
                'success' => true,
                'prediction_id' => $bulkPrediction->id,
                'results' => $predictions,
                'download_url' => route('ai-predictions.download', $bulkPrediction->id)
            ]);
            
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Generate KPI performance prediction
     */
    public function predictKpiPerformance(Request $request)
    {
        $validated = $request->validate([
            'kpi_id' => 'required|exists:kpis,id',
            'prediction_horizon' => 'required|in:1_month,3_months,6_months,1_year',
            'include_external_factors' => 'boolean'
        ]);

        $kpi = Kpis::with(['progress', 'pillar', 'department'])->findOrFail($validated['kpi_id']);
        
        try {
            $predictionData = $this->generateKpiPrediction($kpi, $validated);
            
            $prediction = AiPrediction::create([
                'prediction_type' => 'kpi_performance',
                'target_type' => 'kpi',
                'target_id' => $kpi->id,
                'input_data' => [
                    'kpi_data' => $kpi->toArray(),
                    'parameters' => $validated
                ],
                'prediction_result' => $predictionData,
                'confidence_score' => $predictionData['confidence'],
                'prediction_date' => now(),
                'model_version' => 'SRAP_KPI_Predictor_v2.1',
                'status' => 'completed',
                'notes' => "KPI performance prediction for: {$kpi->title}",
                'requested_by' => Auth::id()
            ]);

            return response()->json([
                'success' => true,
                'prediction_id' => $prediction->id,
                'results' => $predictionData
            ]);
            
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Generate milestone completion prediction
     */
    public function predictMilestoneCompletion(Request $request)
    {
        $validated = $request->validate([
            'milestone_id' => 'required|exists:milestones,id',
            'consider_dependencies' => 'boolean',
            'include_risk_factors' => 'boolean'
        ]);

        $milestone = Milestone::with(['kpi.pillar', 'assignedUser'])->findOrFail($validated['milestone_id']);
        
        try {
            $predictionData = $this->generateMilestonePrediction($milestone, $validated);
            
            $prediction = AiPrediction::create([
                'prediction_type' => 'milestone_completion',
                'target_type' => 'milestone',
                'target_id' => $milestone->id,
                'input_data' => [
                    'milestone_data' => $milestone->toArray(),
                    'parameters' => $validated
                ],
                'prediction_result' => $predictionData,
                'confidence_score' => $predictionData['confidence'],
                'prediction_date' => now(),
                'model_version' => 'SRAP_Milestone_Predictor_v1.8',
                'status' => 'completed',
                'notes' => "Milestone completion prediction for: {$milestone->name}",
                'requested_by' => Auth::id()
            ]);

            return response()->json([
                'success' => true,
                'prediction_id' => $prediction->id,
                'results' => $predictionData
            ]);
            
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Process bulk file upload for predictions
     */
    private function processBulkFile($file)
    {
        $predictions = [];
        $extension = $file->getClientOriginalExtension();
        
        try {
            if (in_array($extension, ['xlsx', 'xls'])) {
                // Process Excel file
                $spreadsheet = IOFactory::load($file->getPathname());
                $worksheet = $spreadsheet->getActiveSheet();
                $rows = $worksheet->toArray();
                
                // Skip header row
                array_shift($rows);
                
                foreach ($rows as $index => $row) {
                    if (count($row) >= 4 && !empty($row[0])) {
                        $inputs = [
                            'progress' => floatval($row[0] ?? 0),
                            'budget_utilization' => floatval($row[1] ?? 0),
                            'delay_days' => floatval($row[2] ?? 0),
                            'engagement_score' => floatval($row[3] ?? 0)
                        ];
                        
                        $prediction = $this->generateRiskPredictionFromInputs($inputs);
                        $prediction['row_id'] = $index + 2; // +2 because we skipped header and arrays are 0-indexed
                        $prediction['inputs'] = $inputs;
                        
                        $predictions[] = $prediction;
                    }
                }
            } elseif ($extension === 'csv') {
                // Process CSV file
                $csvData = file_get_contents($file->getPathname());
                $rows = array_map('str_getcsv', explode("\n", $csvData));
                
                // Skip header row
                array_shift($rows);
                
                foreach ($rows as $index => $row) {
                    if (count($row) >= 4 && !empty($row[0])) {
                        $inputs = [
                            'progress' => floatval($row[0] ?? 0),
                            'budget_utilization' => floatval($row[1] ?? 0),
                            'delay_days' => floatval($row[2] ?? 0),
                            'engagement_score' => floatval($row[3] ?? 0)
                        ];
                        
                        $prediction = $this->generateRiskPredictionFromInputs($inputs);
                        $prediction['row_id'] = $index + 2;
                        $prediction['inputs'] = $inputs;
                        
                        $predictions[] = $prediction;
                    }
                }
            }
            
            return $predictions;
            
        } catch (\Exception $e) {
            throw new \Exception('Error processing file: ' . $e->getMessage());
        }
    }

    /**
     * Generate risk prediction from input parameters
     */
    private function generateRiskPredictionFromInputs($inputs)
    {
        $progress = $inputs['progress'];
        $budgetUtilization = $inputs['budget_utilization'];
        $delayDays = $inputs['delay_days'];
        $engagementScore = $inputs['engagement_score'];
        
        // Calculate risk score using weighted algorithm
        $progressWeight = 0.3;
        $budgetWeight = 0.25;
        $delayWeight = 0.3;
        $engagementWeight = 0.15;
        
        $progressRisk = max(0, (100 - $progress) / 100);
        $budgetRisk = max(0, ($budgetUtilization - 80) / 20);
        $delayRisk = min(1, $delayDays / 30);
        $engagementRisk = max(0, (70 - $engagementScore) / 70);
        
        $riskScore = ($progressRisk * $progressWeight) + 
                    ($budgetRisk * $budgetWeight) + 
                    ($delayRisk * $delayWeight) + 
                    ($engagementRisk * $engagementWeight);
        
        $riskScore = min(1, max(0, $riskScore)) * 100;
        
        // Determine risk level
        if ($riskScore >= 70) {
            $riskLevel = 'High';
            $predictedOutcome = 'At Risk';
        } elseif ($riskScore >= 40) {
            $riskLevel = 'Medium';
            $predictedOutcome = 'Needs Attention';
        } else {
            $riskLevel = 'Low';
            $predictedOutcome = 'On Track';
        }
        
        return [
            'risk_score' => round($riskScore, 2),
            'risk_level' => $riskLevel,
            'predicted_outcome' => $predictedOutcome,
            'confidence' => 0.85,
            'factors' => [
                'progress_impact' => round($progressRisk * 100, 1),
                'budget_impact' => round($budgetRisk * 100, 1),
                'delay_impact' => round($delayRisk * 100, 1),
                'engagement_impact' => round($engagementRisk * 100, 1)
            ],
            'recommendations' => $this->generateRecommendations($riskLevel, $inputs)
        ];
    }

    /**
     * Generate recommendations based on risk level and inputs
     */
    private function generateRecommendations($riskLevel, $inputs)
    {
        $recommendations = [];
        
        if ($inputs['progress'] < 50) {
            $recommendations[] = 'Accelerate progress - consider additional resources';
        }
        
        if ($inputs['budget_utilization'] > 80) {
            $recommendations[] = 'Monitor budget closely - approaching limit';
        }
        
        if ($inputs['delay_days'] > 7) {
            $recommendations[] = 'Address delays immediately - implement recovery plan';
        }
        
        if ($inputs['engagement_score'] < 60) {
            $recommendations[] = 'Improve stakeholder engagement - schedule regular check-ins';
        }
        
        if ($riskLevel === 'High') {
            $recommendations[] = 'Escalate to management - immediate intervention required';
        }
        
        return $recommendations ?: ['Continue monitoring progress'];
    }

    /**
     * Generate risk assessment prediction
     */
    public function predictRiskAssessment(Request $request)
    {
        $validated = $request->validate([
            'scope' => 'required|in:department,pillar,overall',
            'scope_id' => 'nullable|integer',
            'risk_categories' => 'array',
            'time_horizon' => 'required|in:1_month,3_months,6_months'
        ]);

        try {
            $predictionData = $this->generateRiskPrediction($validated);
            
            $prediction = AiPrediction::create([
                'prediction_type' => 'risk_assessment',
                'target_type' => $validated['scope'],
                'target_id' => $validated['scope_id'],
                'input_data' => $validated,
                'prediction_result' => $predictionData,
                'confidence_score' => $predictionData['confidence'],
                'prediction_date' => now(),
                'model_version' => 'SRAP_Risk_Analyzer_v3.0',
                'status' => 'completed',
                'notes' => "Risk assessment for {$validated['scope']} scope",
                'requested_by' => Auth::id()
            ]);

            return response()->json([
                'success' => true,
                'prediction_id' => $prediction->id,
                'results' => $predictionData
            ]);
            
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Generate trend analysis prediction
     */
    public function predictTrendAnalysis(Request $request)
    {
        $validated = $request->validate([
            'analysis_type' => 'required|in:performance_trends,resource_utilization,budget_efficiency',
            'data_points' => 'required|array',
            'forecast_period' => 'required|in:3_months,6_months,1_year'
        ]);

        try {
            $predictionData = $this->generateTrendPrediction($validated);
            
            $prediction = AiPrediction::create([
                'prediction_type' => 'trend_analysis',
                'target_type' => 'system_wide',
                'target_id' => null,
                'input_data' => $validated,
                'prediction_result' => $predictionData,
                'confidence_score' => $predictionData['confidence'],
                'prediction_date' => now(),
                'model_version' => 'SRAP_Trend_Analyzer_v2.5',
                'status' => 'completed',
                'notes' => "Trend analysis: {$validated['analysis_type']}",
                'requested_by' => Auth::id()
            ]);

            return response()->json([
                'success' => true,
                'prediction_id' => $prediction->id,
                'results' => $predictionData
            ]);
            
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Show prediction details
     */
    public function show(AiPrediction $prediction)
    {
        $prediction->load('requester');
        
        return Inertia::render('Admin/AI/Show', [
            'prediction' => $prediction
        ]);
    }

    /**
     * Integrate with external AI services (placeholder)
     */
    public function integrateExternalAI(Request $request)
    {
        $validated = $request->validate([
            'service' => 'required|in:openai,azure_ml,aws_sagemaker,google_ai',
            'model' => 'required|string',
            'input_data' => 'required|array',
            'prediction_type' => 'required|string'
        ]);

        // Placeholder for external AI service integration
        $mockResponse = $this->mockExternalAIResponse($validated);
        
        $prediction = AiPrediction::create([
            'prediction_type' => $validated['prediction_type'],
            'target_type' => 'external_ai',
            'target_id' => null,
            'input_data' => $validated['input_data'],
            'prediction_result' => $mockResponse,
            'confidence_score' => $mockResponse['confidence'] ?? 0.85,
            'prediction_date' => now(),
            'model_version' => $validated['service'] . '_' . $validated['model'] . '_v1.0',
            'status' => 'completed',
            'notes' => "External AI prediction via {$validated['service']}",
            'requested_by' => Auth::id()
        ]);

        return response()->json([
            'success' => true,
            'prediction_id' => $prediction->id,
            'results' => $mockResponse
        ]);
    }

    /**
     * Generate KPI prediction using AI algorithms
     */
    private function generateKpiPrediction($kpi, $parameters)
    {
        // Placeholder AI prediction logic
        $horizon = $parameters['prediction_horizon'];
        $currentValue = $kpi->current_value;
        $targetValue = $kpi->target_value;
        $progressRate = $kpi->progress_percentage / 100;
        
        // Simple trend-based prediction
        $trendFactor = $this->calculateTrendFactor($kpi->progress);
        $seasonalityFactor = $this->calculateSeasonalityFactor();
        $externalFactor = $parameters['include_external_factors'] ? 0.95 : 1.0;
        
        $projectedValue = $currentValue * $trendFactor * $seasonalityFactor * $externalFactor;
        $achievementProbability = min(95, max(5, ($projectedValue / $targetValue) * 100));
        
        return [
            'projected_value' => round($projectedValue, 2),
            'target_achievement_probability' => round($achievementProbability, 1),
            'confidence' => 0.78,
            'risk_factors' => [
                'Resource constraints' => 0.3,
                'External dependencies' => 0.2,
                'Timeline pressure' => 0.15
            ],
            'recommendations' => [
                'Monitor progress weekly',
                'Consider resource reallocation if trend continues',
                'Implement early warning system'
            ],
            'prediction_horizon' => $horizon,
            'model_insights' => [
                'trend_strength' => 'moderate',
                'volatility' => 'low',
                'data_quality' => 'good'
            ]
        ];
    }

    /**
     * Generate milestone prediction
     */
    private function generateMilestonePrediction($milestone, $parameters)
    {
        $completionPercentage = $milestone->completion_percentage;
        $daysToDeadline = $milestone->due_date ? now()->diffInDays($milestone->due_date, false) : 30;
        $riskFactor = $parameters['include_risk_factors'] ? 0.85 : 1.0;
        
        $completionProbability = min(95, max(5, 
            ($completionPercentage + ($daysToDeadline > 0 ? 20 : -30)) * $riskFactor
        ));
        
        $estimatedCompletionDate = now()->addDays(
            max(1, $daysToDeadline * (100 - $completionPercentage) / 100)
        );
        
        return [
            'completion_probability' => round($completionProbability, 1),
            'estimated_completion_date' => $estimatedCompletionDate->format('Y-m-d'),
            'days_variance' => round($estimatedCompletionDate->diffInDays($milestone->due_date, false)),
            'confidence' => 0.82,
            'risk_assessment' => [
                'schedule_risk' => $daysToDeadline < 7 ? 'high' : 'medium',
                'resource_risk' => 'medium',
                'dependency_risk' => $parameters['consider_dependencies'] ? 'medium' : 'low'
            ],
            'critical_path_impact' => $this->calculateCriticalPathImpact($milestone),
            'recommendations' => [
                'Increase resource allocation if behind schedule',
                'Monitor dependencies closely',
                'Prepare contingency plans'
            ]
        ];

        return $predictions[$type] ?? $predictions['risk_assessment'];
    }

    /**
     * Generate trend prediction
     */
    private function generateTrendPrediction($parameters)
    {
        $analysisType = $parameters['analysis_type'];
        $forecastPeriod = $parameters['forecast_period'];
        
        return [
            'trend_direction' => 'upward',
            'trend_strength' => 'moderate',
            'confidence' => 0.80,
            'forecast_data' => [
                'next_month' => ['value' => 85, 'confidence' => 0.9],
                'next_quarter' => ['value' => 88, 'confidence' => 0.8],
                'next_year' => ['value' => 92, 'confidence' => 0.7]
            ],
            'key_drivers' => [
                'Process improvements',
                'Technology adoption',
                'Team efficiency gains'
            ],
            'anomaly_detection' => [
                'detected_anomalies' => 2,
                'anomaly_types' => ['seasonal_deviation', 'performance_spike']
            ],
            'analysis_type' => $analysisType,
            'forecast_period' => $forecastPeriod
        ];
    }

    /**
     * Download bulk prediction results
     */
    public function download($id)
    {
        $prediction = AiPrediction::findOrFail($id);
        
        if ($prediction->prediction_type !== 'bulk_risk_prediction') {
            abort(404, 'Download not available for this prediction type');
        }
        
        $results = $prediction->prediction_result['predictions'] ?? [];
        
        $csvData = "Row ID,Progress,Budget Utilization,Delay Days,Engagement Score,Risk Score,Risk Level,Predicted Outcome\n";
        
        foreach ($results as $result) {
            $inputs = $result['inputs'];
            $csvData .= sprintf(
                "%d,%s,%s,%s,%s,%s,%s,%s\n",
                $result['row_id'],
                $inputs['progress'],
                $inputs['budget_utilization'],
                $inputs['delay_days'],
                $inputs['engagement_score'],
                $result['risk_score'],
                $result['risk_level'],
                $result['predicted_outcome']
            );
        }
        
        $filename = 'bulk_prediction_results_' . $prediction->id . '_' . now()->format('Y-m-d_H-i-s') . '.csv';
        
        return response($csvData)
            ->header('Content-Type', 'text/csv')
            ->header('Content-Disposition', 'attachment; filename="' . $filename . '"');
    }

    /**
     * Mock external AI service response
     */
    private function mockExternalAIResponse($parameters)
    {
        return [
            'service' => $parameters['service'],
            'model' => $parameters['model'],
            'prediction' => 'Mock AI prediction result',
            'confidence' => 0.85,
            'processing_time_ms' => rand(100, 500),
            'api_version' => '2024.1',
            'tokens_used' => rand(50, 200)
        ];
    }

    /**
     * Helper methods for calculations
     */
    private function calculateTrendFactor($progressData)
    {
        // Simplified trend calculation
        return 1.05; // 5% positive trend
    }

    private function calculateSeasonalityFactor()
    {
        // Simplified seasonality factor
        return 1.02; // 2% seasonal adjustment
    }

    private function calculateCriticalPathImpact($milestone)
    {
        return [
            'is_critical' => true,
            'impact_score' => 8.5,
            'affected_milestones' => 3
        ];
    }
}
