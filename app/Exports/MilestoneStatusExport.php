<?php

namespace App\Exports;

use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;
use Maatwebsite\Excel\Concerns\WithStyles;
use Maatwebsite\Excel\Concerns\ShouldAutoSize;
use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;

class MilestoneStatusExport implements FromCollection, WithHeadings, WithMapping, WithStyles, ShouldAutoSize
{
    protected $milestones;

    public function __construct($milestones)
    {
        $this->milestones = $milestones;
    }

    /**
    * @return \Illuminate\Support\Collection
    */
    public function collection()
    {
        return collect($this->milestones);
    }

    /**
     * @return array
     */
    public function headings(): array
    {
        return [
            'ID',
            'Milestone Name',
            'KPI',
            'SRAP Pillar',
            'Status',
            'Priority',
            'Completion %',
            'Start Date',
            'Due Date',
            'Completed At',
            'Assigned To',
            'Dependencies',
            'Deliverables Count',
            'Notes',
            'Created At',
            'Updated At'
        ];
    }

    /**
     * @param $milestone
     * @return array
     */
    public function map($milestone): array
    {
        $deliverables = is_array($milestone->deliverables) ? $milestone->deliverables : [];
        $dependencies = is_array($milestone->dependencies) ? implode(', ', $milestone->dependencies) : 'None';

        return [
            $milestone->id,
            $milestone->name,
            $milestone->kpi->name ?? 'N/A',
            $milestone->kpi->pillar->name ?? 'N/A',
            $milestone->status,
            ucfirst($milestone->priority ?? 'medium'),
            $milestone->completion_percentage . '%',
            $milestone->start_date?->format('Y-m-d') ?? 'Not set',
            $milestone->due_date?->format('Y-m-d') ?? 'Not set',
            $milestone->completed_at?->format('Y-m-d') ?? 'Not completed',
            $milestone->assignedUser->name ?? 'Unassigned',
            $dependencies,
            count($deliverables),
            $milestone->notes ?? 'No notes',
            $milestone->created_at->format('Y-m-d H:i:s'),
            $milestone->updated_at->format('Y-m-d H:i:s')
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
