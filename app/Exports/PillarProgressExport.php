<?php

namespace App\Exports;

use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;
use Maatwebsite\Excel\Concerns\WithStyles;
use Maatwebsite\Excel\Concerns\ShouldAutoSize;
use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;

class PillarProgressExport implements FromCollection, WithHeadings, WithMapping, WithStyles, ShouldAutoSize
{
    protected $pillars;

    public function __construct($pillars)
    {
        $this->pillars = $pillars;
    }

    /**
    * @return \Illuminate\Support\Collection
    */
    public function collection()
    {
        return collect($this->pillars);
    }

    /**
     * @return array
     */
    public function headings(): array
    {
        return [
            'ID',
            'Pillar Name',
            'Code',
            'Description',
            'Total KPIs',
            'Completed KPIs',
            'On Track KPIs',
            'At Risk KPIs',
            'Behind KPIs',
            'Progress %',
            'Weight',
            'Order Index',
            'Color',
            'Active',
            'Created At',
            'Updated At'
        ];
    }

    /**
     * @param $pillar
     * @return array
     */
    public function map($pillar): array
    {
        $totalKpis = $pillar->kpis->count();
        $completedKpis = $pillar->kpis->where('status', 'completed')->count();
        $onTrackKpis = $pillar->kpis->where('status', 'on_track')->count();
        $atRiskKpis = $pillar->kpis->where('status', 'at_risk')->count();
        $behindKpis = $pillar->kpis->where('status', 'behind')->count();
        $progress = $totalKpis > 0 ? round(($completedKpis / $totalKpis) * 100, 2) : 0;

        return [
            $pillar->id,
            $pillar->name,
            $pillar->code,
            $pillar->description,
            $totalKpis,
            $completedKpis,
            $onTrackKpis,
            $atRiskKpis,
            $behindKpis,
            $progress . '%',
            $pillar->weight,
            $pillar->order_index,
            $pillar->color,
            $pillar->active ? 'Yes' : 'No',
            $pillar->created_at->format('Y-m-d H:i:s'),
            $pillar->updated_at->format('Y-m-d H:i:s')
        ];
    }

    /**
     * @param Worksheet $sheet
     * @return array
     */
    public function styles(Worksheet $sheet)
    {
        return [
            1 => ['font' => ['bold' => true]],
        ];
    }
}
