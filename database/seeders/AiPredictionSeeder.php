<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\AiPrediction;
use App\Models\User;
use Carbon\Carbon;

class AiPredictionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $users = User::all();
        $userId = $users->isNotEmpty() ? $users->first()->id : 1;

        $predictions = [
            [
                'prediction_type' => 'manual_risk_prediction',
                'target_type' => 'manual_input',
                'target_id' => null,
                'input_data' => [
                    'progress' => 75,
                    'budget_utilization' => 68,
                    'delay_days' => 5,
                    'engagement_score' => 82
                ],
                'prediction_result' => [
                    'risk_score' => 28.5,
                    'risk_level' => 'low',
                    'confidence' => 89,
                    'factors' => [
                        'progress_impact' => 7.5,
                        'budget_impact' => 0,
                        'delay_impact' => 10,
                        'engagement_impact' => 4.5
                    ],
                    'recommendations' => [
                        'Monitor project timeline closely',
                        'Maintain current engagement levels'
                    ],
                    'predicted_outcome' => 'Success likely'
                ],
                'confidence_score' => 89,
                'prediction_date' => Carbon::now()->subDays(1),
                'model_version' => 'SRAP_Risk_Predictor_v1.0',
                'status' => 'completed',
                'notes' => 'Manual risk prediction for project assessment',
                'requested_by' => $userId
            ],
            [
                'prediction_type' => 'bulk_risk_prediction',
                'target_type' => 'bulk_upload',
                'target_id' => null,
                'input_data' => [
                    'file_name' => 'project_data_batch1.xlsx',
                    'records_count' => 15
                ],
                'prediction_result' => [
                    'predictions' => [
                        [
                            'row_id' => 1,
                            'risk_score' => 45.2,
                            'risk_level' => 'medium',
                            'predicted_outcome' => 'Monitor closely'
                        ],
                        [
                            'row_id' => 2,
                            'risk_score' => 22.8,
                            'risk_level' => 'low',
                            'predicted_outcome' => 'Success likely'
                        ]
                    ]
                ],
                'confidence_score' => 85,
                'prediction_date' => Carbon::now()->subDays(3),
                'model_version' => 'SRAP_Risk_Predictor_v1.0',
                'status' => 'completed',
                'notes' => 'Bulk risk prediction from uploaded file',
                'requested_by' => $userId
            ],
            [
                'prediction_type' => 'kpi_performance',
                'target_type' => 'App\\Models\\Admin\\Kpi',
                'target_id' => 1,
                'input_data' => [
                    'kpi_id' => 1,
                    'prediction_horizon' => '3_months',
                    'include_external_factors' => true
                ],
                'prediction_result' => [
                    'predicted_value' => 87,
                    'confidence_interval' => [82, 92],
                    'trend' => 'upward',
                    'risk_factors' => [
                        'Budget constraints',
                        'Resource availability'
                    ],
                    'recommendations' => [
                        'Increase monitoring frequency',
                        'Allocate additional resources'
                    ]
                ],
                'confidence_score' => 78,
                'prediction_date' => Carbon::now()->subDays(5),
                'model_version' => 'KPI_Performance_Predictor_v2.1',
                'status' => 'completed',
                'notes' => 'KPI performance prediction for broadband penetration',
                'requested_by' => $userId
            ],
            [
                'prediction_type' => 'milestone_completion',
                'target_type' => 'App\\Models\\Milestone',
                'target_id' => 1,
                'input_data' => [
                    'milestone_id' => 1,
                    'current_progress' => 65,
                    'consider_dependencies' => true
                ],
                'prediction_result' => [
                    'completion_probability' => 0.82,
                    'estimated_completion_date' => Carbon::now()->addDays(25)->format('Y-m-d'),
                    'risk_level' => 'low',
                    'blocking_factors' => [
                        'Pending approvals',
                        'Technical challenges'
                    ],
                    'mitigation_strategies' => [
                        'Fast-track approval process',
                        'Engage technical experts'
                    ]
                ],
                'confidence_score' => 91,
                'prediction_date' => Carbon::now()->subWeek(),
                'model_version' => 'Milestone_Predictor_v1.5',
                'status' => 'completed',
                'notes' => 'Milestone completion prediction for digital infrastructure',
                'requested_by' => $userId
            ],
            [
                'prediction_type' => 'manual_risk_prediction',
                'target_type' => 'manual_input',
                'target_id' => null,
                'input_data' => [
                    'progress' => 45,
                    'budget_utilization' => 95,
                    'delay_days' => 20,
                    'engagement_score' => 60
                ],
                'prediction_result' => [
                    'risk_score' => 72.5,
                    'risk_level' => 'high',
                    'confidence' => 94,
                    'factors' => [
                        'progress_impact' => 16.5,
                        'budget_impact' => 6.0,
                        'delay_impact' => 40,
                        'engagement_impact' => 10.0
                    ],
                    'recommendations' => [
                        'Implement delay mitigation strategies',
                        'Review budget allocation and cost optimization',
                        'Improve stakeholder engagement and communication',
                        'Accelerate progress tracking and milestone completion'
                    ],
                    'predicted_outcome' => 'Intervention required'
                ],
                'confidence_score' => 94,
                'prediction_date' => Carbon::now()->subDays(2),
                'model_version' => 'SRAP_Risk_Predictor_v1.0',
                'status' => 'completed',
                'notes' => 'High-risk project requiring immediate attention',
                'requested_by' => $userId
            ],
            [
                'prediction_type' => 'trend_analysis',
                'target_type' => 'system_wide',
                'target_id' => null,
                'input_data' => [
                    'analysis_type' => 'performance_trend',
                    'forecast_period' => '6_months',
                    'include_seasonality' => true
                ],
                'prediction_result' => [
                    'trend_direction' => 'upward',
                    'trend_strength' => 'moderate',
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
                    ]
                ],
                'confidence_score' => 80,
                'prediction_date' => Carbon::now()->subDays(4),
                'model_version' => 'Trend_Analyzer_v3.0',
                'status' => 'completed',
                'notes' => 'System-wide trend analysis for SRAP performance',
                'requested_by' => $userId
            ]
        ];

        foreach ($predictions as $prediction) {
            AiPrediction::create($prediction);
        }
    }
}
