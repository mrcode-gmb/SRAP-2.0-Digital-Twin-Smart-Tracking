<?php

namespace App\Exports;

use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;
use Maatwebsite\Excel\Concerns\WithStyles;
use Maatwebsite\Excel\Concerns\ShouldAutoSize;
use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;
use PhpOffice\PhpSpreadsheet\Style\Fill;
use PhpOffice\PhpSpreadsheet\Style\Font;

class AiPredictionExport implements FromCollection, WithHeadings, WithMapping, WithStyles, ShouldAutoSize
{
    protected $predictions;

    public function __construct($predictions)
    {
        $this->predictions = $predictions;
    }

    /**
     * @return \Illuminate\Support\Collection
     */
    public function collection()
    {
        return $this->predictions;
    }

    /**
     * @return array
     */
    public function headings(): array
    {
        return [
            'ID',
            'Type',
            'Model',
            'Confidence',
            'Status',
            'Date',
            'Predicted Risk',
            'Risk Score',
            'Success Probability',
            'Expected Completion',
            'Recommendations',
            'Requested By',
            'Notes'
        ];
    }

    /**
     * @param mixed $prediction
     * @return array
     */
    public function map($prediction): array
    {
        // Parse prediction result JSON
        $predictionResult = is_string($prediction->prediction_result) 
            ? json_decode($prediction->prediction_result, true) 
            : $prediction->prediction_result;

        $riskLevel = $predictionResult['risk_level'] ?? $prediction->risk_level ?? 'Unknown';
        $riskScore = $predictionResult['risk_score'] ?? $prediction->risk_score ?? 'N/A';
        $successProbability = $predictionResult['success_probability'] ?? 'N/A';
        $expectedCompletion = $predictionResult['expected_completion'] ?? 'N/A';
        $recommendations = isset($predictionResult['recommendations']) 
            ? (is_array($predictionResult['recommendations']) 
                ? implode('; ', $predictionResult['recommendations']) 
                : $predictionResult['recommendations'])
            : 'N/A';

        return [
            $prediction->id,
            ucfirst(str_replace('_', ' ', $prediction->prediction_type)),
            $prediction->model_version ?? 'SRAP1.0_v1.0',
            $prediction->confidence_score ? number_format($prediction->confidence_score, 1) . '%' : 'N/A',
            ucfirst($prediction->status),
            $prediction->created_at->format('Y-m-d H:i:s'),
            ucfirst($riskLevel),
            is_numeric($riskScore) ? $riskScore . '%' : $riskScore,
            is_numeric($successProbability) ? $successProbability . '%' : $successProbability,
            $expectedCompletion,
            $recommendations,
            $prediction->requestedBy->name ?? 'Unknown',
            $prediction->notes ?? 'N/A'
        ];
    }

    /**
     * @param Worksheet $sheet
     * @return array
     */
    public function styles(Worksheet $sheet)
    {
        return [
            // Style the first row as header
            1 => [
                'font' => [
                    'bold' => true,
                    'color' => ['argb' => 'FFFFFF'],
                ],
                'fill' => [
                    'fillType' => Fill::FILL_SOLID,
                    'startColor' => ['argb' => '4F46E5'], // Indigo background
                ],
            ],
        ];
    }
}
