<?php

namespace App\Exports;

use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;
use Maatwebsite\Excel\Concerns\WithStyles;
use Maatwebsite\Excel\Concerns\ShouldAutoSize;
use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;
use Illuminate\Support\Collection;

class KpiReportExport implements FromCollection, WithHeadings, WithMapping, WithStyles, ShouldAutoSize
{
    protected $kpis;

    public function __construct($kpis)
    {
        $this->kpis = $kpis;
    }

    /**
    * @return \Illuminate\Support\Collection
    */
    public function collection()
    {
        return collect($this->kpis);
    }

    /**
     * @return array
     */
    public function headings(): array
    {
        return [
            'ID',
            'Name',
            'Description',
            'SRAP Pillar',
            'Department',
            'Status',
            'Priority',
            'Target Value',
            'Current Value',
            'Progress %',
            'Unit',
            'Frequency',
            'Start Date',
            'End Date',
            'Created By',
            'Created At',
            'Updated At'
        ];
    }

    /**
     * @param $kpi
     * @return array
     */
    public function map($kpi): array
    {
        return [
            $kpi->id,
            $kpi->name,
            $kpi->description,
            $kpi->pillar->name ?? 'N/A',
            $kpi->department->name ?? 'N/A',
            ucfirst($kpi->status),
            $kpi->priority,
            $kpi->target_value,
            $kpi->current_value,
            $kpi->progress_percentage . '%',
            $kpi->unit,
            ucfirst($kpi->frequency),
            $kpi->start_date?->format('Y-m-d'),
            $kpi->end_date?->format('Y-m-d'),
            $kpi->creator->name ?? 'N/A',
            $kpi->created_at->format('Y-m-d H:i:s'),
            $kpi->updated_at->format('Y-m-d H:i:s')
        ];
    }

    /**
     * @param Worksheet $sheet
     * @return array
     */
    public function styles(Worksheet $sheet)
    {
        return [
            // Style the first row as bold text.
            1 => ['font' => ['bold' => true]],
        ];
    }
}
