<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\AiPrediction;
use App\Models\Kpis;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;
use Inertia\Inertia;
use Maatwebsite\Excel\Facades\Excel;
use Carbon\Carbon;

class AiPredictionController extends Controller
{
    private $flaskApiUrl = 'https://aqtris.com/smart-tracking'; // Flask API URL
    

    /**
     * Display AI prediction dashboard
     */
    public function index(Request $request)
    {
        $query = AiPrediction::with(['requestedBy']);

        // Apply filters
        if ($request->filled('search')) {
            $query->where('prediction_type', 'like', '%' . $request->search . '%')
                  ->orWhere('target_type', 'like', '%' . $request->search . '%');
        }

        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        if ($request->filled('prediction_type')) {
            $query->where('prediction_type', $request->prediction_type);
        }

        if ($request->filled('date_from')) {
            $query->whereDate('created_at', '>=', $request->date_from);
        }

        if ($request->filled('date_to')) {
            $query->whereDate('created_at', '<=', $request->date_to);
        }

        $predictions = $query->orderBy('created_at', 'desc')->paginate(15);

        // Get summary statistics including risk level counts
        $stats = [
            'total_predictions' => AiPrediction::count(),
            'completed' => AiPrediction::where('status', 'completed')->count(),
            'pending' => AiPrediction::where('status', 'pending')->count(),
            'processing' => AiPrediction::where('status', 'processing')->count(),
            'failed' => AiPrediction::where('status', 'failed')->count(),
            // Risk level counts (case-insensitive)
            'high_risk' => AiPrediction::whereRaw('LOWER(risk_level) = ?', ['high'])->count(),
            'medium_risk' => AiPrediction::whereRaw('LOWER(risk_level) = ?', ['medium'])->count(),
            'low_risk' => AiPrediction::whereRaw('LOWER(risk_level) = ?', ['low'])->count(),
        ];

        // Transform predictions to include risk level from prediction_result JSON
        $predictions->getCollection()->transform(function ($prediction) {
            $predictionResult = is_string($prediction->prediction_result) 
                ? json_decode($prediction->prediction_result, true) 
                : $prediction->prediction_result;
            
            $prediction->risk_level = $predictionResult['risk_level'] ?? 'Unknown';
            $prediction->risk_score = $predictionResult['risk_score'] ?? null;
            
            return $prediction;
        });

        return Inertia::render('Admin/AiPrediction/Index', [
            'predictions' => $predictions,
            'stats' => $stats,
            'filters' => $request->only(['search', 'status', 'prediction_type', 'date_from', 'date_to'])
        ]);
    }

    /**
     * Show manual prediction form
     */
    public function create()
    {
        $kpis = Kpis::select('id', 'name', 'current_value', 'target_value')
            ->where('status', '!=', 'completed')
            ->orderBy('name')
            ->get();

        return Inertia::render('Admin/AiPrediction/Create', [
            'kpis' => $kpis
        ]);
    }

    /**
     * Store manual prediction
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'kpi_id' => 'required|exists:kpis,id',
            'progress' => 'required|numeric|min:0|max:100',
            'budget_utilization' => 'required|numeric|min:0|max:200',
            'delay_days' => 'required|integer|min:0',
            'stakeholder_engagement_score' => 'required|numeric|min:0|max:10',
            'ai_predicted_success' => 'required|numeric|min:0|max:100',
        ]);

        try {
            // Call Flask API for prediction
            $response = Http::withHeaders([
                'Content-Type' => 'application/json',
            ])->post($this->flaskApiUrl . '/predict_api', [
                'progress' => $validated['progress'],
                'budget' => $validated['budget_utilization'],
                'delay' => $validated['delay_days'],
                'engagement' => $validated['stakeholder_engagement_score'],
                'success' => $validated['ai_predicted_success'],
            ]);

            if (!$response->successful()) {
                throw new \Exception('AI prediction service unavailable');
            }

            // Flask API now returns JSON like: {"predicted_risk": "High", "status": "success"}
            $responseData = $response->json();

            if (!isset($responseData['predicted_risk'])) {
                throw new \Exception('Invalid response from AI service');
            }

            $riskLevel = $responseData['predicted_risk']; // "High", "Medium", or "Low"
            
            // Calculate risk score based on level
            $riskScore = match ($riskLevel) {
                'Low' => 30,
                'Medium' => 60,
                'High' => 90,
                default => 50,
            };

            $prediction = AiPrediction::create([
                'user_id'               => auth()->id(),
                'prediction_type'       => 'manual_risk_prediction',
                'target_type'           => 'kpi',
                'target_id'             => $validated['kpi_id'],
                'input_data'            => $validated,
                'prediction_result'     => [
                    'risk_level'   => $riskLevel,
                    'risk_score'   => $riskScore,
                    'predicted_outcome' => $this->generatePredictedOutcome($riskLevel, $riskScore),
                    'success_probability' => $this->calculateSuccessProbability($riskScore),
                    'expected_completion' => $this->estimateCompletion($validated),
                    'recommendations' => $this->generateRecommendations($riskLevel, $validated),
                ],
                'risk_score'            => $riskScore,
                'risk_level'            => strtolower($riskLevel),
                'confidence_score'      => $responseData['confidence'] ?? 85.0,
                'prediction_date'       => now()->toDateString(),
                'forecast_period_start' => null,
                'forecast_period_end'   => null,
                'model_version'         => 'SRAP1.0_v1.0',
                'parameters'            => [
                    'framework' => 'Flask AI service',
                    'source'    => 'NITDA MVP',
                ],
                'status'                => 'completed',
                'notes'                 => 'Manual prediction generated successfully',
                'requested_by'          => auth()->id(),
            ]);

            return redirect()->route('admin.ai-predictions.show', $prediction)
                ->with('success', 'Risk prediction completed successfully');


        } catch (\Exception $e) {
            return back()->with('error', 'Prediction failed: ' . $e->getMessage())
                ->withInput();
        }
    }


    /**
     * Show prediction details
     */
    public function show(AiPrediction $aiPrediction)
    {
        $aiPrediction->load(['kpi', 'user']);

        return Inertia::render('Admin/AiPrediction/Show', [
            'prediction' => $aiPrediction
        ]);
    }

    /**
     * Handle bulk file upload prediction
     */
    public function bulkPredict(Request $request)
{
    $validated = $request->validate([
        'file' => 'required|file|mimes:xlsx,xls,csv|max:10240',
        'overwrite_existing' => 'boolean'
    ]);

    try {
        $file = $request->file('file');
        $filename = time() . '_' . $file->getClientOriginalName();
        $filePath = $file->storeAs('ai-predictions', $filename);

        // Send file to Flask API
        $response = Http::timeout(60)
            ->attach('file', file_get_contents($file), $file->getClientOriginalName())
            ->post($this->flaskApiUrl . '/predict_file_api');

        if (!$response->successful()) {
            throw new \Exception('AI prediction service unavailable. Please try again later.');
        }

        $data = $response->json();
        if ($data['status'] !== 'success') {
            throw new \Exception($data['message'] ?? 'Invalid response from AI service.');
        }
        
        // Store each prediction row in DB
        $lastPrediction = null;
        foreach ($data['predictions'] as $row) {
            // Calculate risk score if you want (optional)
            $riskLevel = $row['Predicted_Risk'] ?? 'Medium';
            $riskScore = match ($riskLevel) {
                'Low'    => 30,   // 30%
                'Medium' => 60,   // 60%
                'High'   => 90,   // 90%
                default  => 50,
            };
            
            $lastPrediction = AiPrediction::create([
                'user_id'               => auth()->id(),
                'prediction_type'       => 'bulk_risk_assessment',
                'target_type'           => 'kpi',
                'target_id'             => null, // Bulk predictions may not have specific KPI
                'input_data'            => [
                    'progress'       => $row['Progress (%)'],
                    'budget'         => $row['Budget_Utilization (%)'],
                    'delay'          => $row['Delay_Days'],
                    'engagement'     => $row['Stakeholder_Engagement_Score'],
                    'success_rate'   => $row['AI_Predicted_Success (%)'],
                ],
                'prediction_result'     => [
                    'risk_level'     => $riskLevel,
                    'risk_score'     => $riskScore,
                    'predicted_outcome' => $this->generatePredictedOutcome($riskLevel, $riskScore),
                    'success_probability' => $this->calculateSuccessProbability($riskScore),
                    'expected_completion' => $this->estimateCompletion([
                        'delay_days' => $row['Delay_Days'],
                        'stakeholder_engagement_score' => $row['Stakeholder_Engagement_Score']
                    ]),
                    'recommendations' => $this->generateRecommendations($riskLevel, [
                        'delay_days' => $row['Delay_Days'],
                        'stakeholder_engagement_score' => $row['Stakeholder_Engagement_Score']
                    ]),
                ],
                'confidence_score'      => 0.85, // you can pull from model if returned
                'prediction_date'       => now()->toDateString(),
                'forecast_period_start' => null,
                'forecast_period_end'   => null,
                'model_version'         => 'SRAP1.0_v1.0',
                'parameters'            => [
                    'framework' => 'Flask AI service',
                    'source'    => 'NITDA MVP',
                ],
                'status'                => 'completed',
                'file_path'             => $filePath,
                'notes'                 => 'Bulk prediction imported from file',
                'requested_by'          => auth()->id(),
            ]);
        }
        

        // Redirect to the last prediction's show page, or index if no predictions
        if ($lastPrediction) {
            return redirect()->route('admin.ai-predictions.show', $lastPrediction)
                ->with('success', 'Bulk prediction completed successfully! ' . count($data['predictions']) . ' predictions created.');
        } else {
            return redirect()->route('admin.ai-predictions.index')
                ->with('success', 'Bulk prediction completed successfully! ' . count($data['predictions']) . ' predictions created.');
        }

    } catch (\Exception $e) {
        return back()->with('error', 'Bulk prediction failed: ' . $e->getMessage());
    }
}


    /**
     * Delete prediction
     */
    public function destroy(AiPrediction $aiPrediction)
    {
        try {
            // Delete associated file if exists
            if ($aiPrediction->file_path && Storage::exists($aiPrediction->file_path)) {
                Storage::delete($aiPrediction->file_path);
            }

            $aiPrediction->delete();

            return redirect()->route('admin.ai-predictions.index')
                ->with('success', 'Prediction deleted successfully');

        } catch (\Exception $e) {
            return back()->with('error', 'Failed to delete prediction: ' . $e->getMessage());
        }
    }

    /**
     * Export predictions to Excel
     */
    public function export(Request $request)
    {
        $query = AiPrediction::with(['kpi', 'user']);

        // Apply same filters as index
        if ($request->filled('search')) {
            $query->whereHas('kpi', function($q) use ($request) {
                $q->where('name', 'like', '%' . $request->search . '%');
            });
        }

        if ($request->filled('risk_level')) {
            $query->where('risk_level', $request->risk_level);
        }

        if ($request->filled('date_from')) {
            $query->whereDate('created_at', '>=', $request->date_from);
        }

        if ($request->filled('date_to')) {
            $query->whereDate('created_at', '<=', $request->date_to);
        }

        $predictions = $query->orderBy('created_at', 'desc')->get();

        $filename = 'ai_predictions_' . now()->format('Y-m-d_H-i-s') . '.xlsx';

        return Excel::download(new \App\Exports\AiPredictionExport($predictions), $filename);
    }

    /**
     * Determine risk level based on score
     */
    private function determineRiskLevel($score)
    {
        if ($score >= 7) return 'High';
        if ($score >= 4) return 'Medium';
        return 'Low';
    }

    /**
     * Validate bulk upload file format and content
     */
    private function validateBulkUploadFile($file)
    {
        $extension = strtolower($file->getClientOriginalExtension());
        
        if (!in_array($extension, ['xlsx', 'xls', 'csv'])) {
            throw new \Exception('Invalid file format. Please upload an Excel (.xlsx, .xls) or CSV (.csv) file.');
        }
        
        // Check file size (10MB max)
        if ($file->getSize() > 10 * 1024 * 1024) {
            throw new \Exception('File size too large. Maximum allowed size is 10MB.');
        }
        
        try {
            // Try to read the file to validate structure
            if ($extension === 'csv') {
                $handle = fopen($file->getRealPath(), 'r');
                $header = fgetcsv($handle);
                fclose($handle);
                
                if (!$header || count($header) < 5) {
                    throw new \Exception('Invalid CSV format. Please ensure your file has at least 5 columns matching the template.');
                }
            } else {
                // For Excel files, use a basic validation
                $data = Excel::toArray([], $file);
                if (empty($data) || empty($data[0]) || count($data[0][0] ?? []) < 5) {
                    throw new \Exception('Invalid Excel format. Please ensure your file has at least 5 columns matching the template.');
                }
            }
        } catch (\Exception $e) {
            if (strpos($e->getMessage(), 'Invalid') === 0) {
                throw $e;
            }
            throw new \Exception('Unable to read file. Please check the file format and try again.');
        }
    }
    
    /**
     * Parse prediction results from Flask HTML response
     */
    private function parsePredictionResults($htmlResponse)
    {
        $predictions = [];
        
        // Use DOMDocument to parse HTML
        $dom = new \DOMDocument();
        @$dom->loadHTML($htmlResponse);
        
        // Look for table rows with prediction data
        $tables = $dom->getElementsByTagName('table');
        if ($tables->length > 0) {
            $table = $tables->item(0);
            $rows = $table->getElementsByTagName('tr');
            
            // Skip header row, start from index 1
            for ($i = 1; $i < $rows->length; $i++) {
                $row = $rows->item($i);
                $cells = $row->getElementsByTagName('td');
                
                if ($cells->length >= 6) {
                    $predictions[] = [
                        'progress' => floatval($cells->item(0)->textContent),
                        'budget_utilization' => floatval($cells->item(1)->textContent),
                        'delay_days' => intval($cells->item(2)->textContent),
                        'stakeholder_engagement_score' => floatval($cells->item(3)->textContent),
                        'ai_predicted_success' => floatval($cells->item(4)->textContent),
                        'predicted_risk' => trim($cells->item(5)->textContent)
                    ];
                }
            }
        }
        
        // If no table found, try to parse from text format
        if (empty($predictions)) {
            $lines = explode("\n", strip_tags($htmlResponse));
            foreach ($lines as $line) {
                if (preg_match('/(\d+\.?\d*)\s+(\d+\.?\d*)\s+(\d+)\s+(\d+\.?\d*)\s+(\d+\.?\d*)\s+(Low|Medium|High)/', $line, $matches)) {
                    $predictions[] = [
                        'progress' => floatval($matches[1]),
                        'budget_utilization' => floatval($matches[2]),
                        'delay_days' => intval($matches[3]),
                        'stakeholder_engagement_score' => floatval($matches[4]),
                        'ai_predicted_success' => floatval($matches[5]),
                        'predicted_risk' => trim($matches[6])
                    ];
                }
            }
        }
        
        return $predictions;
    }
    
    /**
     * Generate predicted outcome based on risk level
     */
    private function generatePredictedOutcome($riskLevel, $riskScore)
    {
        return match($riskLevel) {
            'Low' => 'KPI likely to meet targets with minimal intervention',
            'Medium' => 'KPI may face challenges but achievable with proper monitoring',
            'High' => 'KPI at significant risk of missing targets - immediate action required',
            default => 'Outcome uncertain - requires further analysis'
        };
    }

    /**
     * Calculate success probability
     */
    private function calculateSuccessProbability($riskScore)
    {
        // Inverse relationship: higher risk = lower success probability
        return max(10, 100 - $riskScore);
    }

    /**
     * Estimate completion timeline
     */
    private function estimateCompletion($validated)
    {
        $delayDays = (int) ($validated['delay_days'] ?? 0);
        $baseDate = now()->addDays(30); // Base 30 days
        
        // Add delay impact
        $adjustedDate = $baseDate->addDays($delayDays);
        
        return $adjustedDate->toDateString();
    }

    /**
     * Generate AI recommendations
     */
    private function generateRecommendations($riskLevel, $validated)
    {
        $recommendations = [];
        
        // Base recommendations by risk level
        switch($riskLevel) {
            case 'High':
                $recommendations[] = 'Immediate escalation to senior management required';
                $recommendations[] = 'Conduct emergency stakeholder meeting';
                $recommendations[] = 'Reassess resource allocation and timeline';
                break;
            case 'Medium':
                $recommendations[] = 'Increase monitoring frequency to weekly';
                $recommendations[] = 'Review and optimize current processes';
                $recommendations[] = 'Consider additional resource allocation';
                break;
            case 'Low':
                $recommendations[] = 'Continue current approach with regular monitoring';
                $recommendations[] = 'Document best practices for replication';
                break;
        }

        // Add specific recommendations based on input data
        if ((float) ($validated['stakeholder_engagement_score'] ?? 0) < 7) {
            $recommendations[] = 'Improve stakeholder engagement through regular communication';
        }
        
        if ((int) ($validated['delay_days'] ?? 0) > 10) {
            $recommendations[] = 'Implement accelerated timeline recovery plan';
        }

        return $recommendations;
    }

    /**
     * Get prediction template
     */
    public function downloadTemplate()
    {
        $headers = [
            'Progress (%)',
            'Budget_Utilization (%)',
            'Delay_Days',
            'Stakeholder_Engagement_Score',
            'AI_Predicted_Success (%)'
        ];

        $sampleData = [
            [75, 85, 5, 8.5, 82],
            [45, 120, 15, 6.2, 55],
            [90, 95, 0, 9.1, 95],
        ];

        $filename = 'ai_prediction_template.xlsx';
        
        return Excel::download(new \App\Exports\AiPredictionTemplateExport($headers, $sampleData), $filename);
    }

}
