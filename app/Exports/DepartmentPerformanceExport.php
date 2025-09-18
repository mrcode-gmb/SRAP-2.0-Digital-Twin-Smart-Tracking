<?php

namespace App\Exports;

use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;
use Maatwebsite\Excel\Concerns\WithStyles;
use Maatwebsite\Excel\Concerns\ShouldAutoSize;
use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;

class DepartmentPerformanceExport implements FromCollection, WithHeadings, WithMapping, WithStyles, ShouldAutoSize
{
    protected $departments;

    public function __construct($departments)
    {
        $this->departments = $departments;
    }

    /**
    * @return \Illuminate\Support\Collection
    */
    public function collection()
    {
        return collect($this->departments);
    }

    /**
     * @return array
     */
    public function headings(): array
    {
        return [
            'ID',
            'Department Name',
            'Code',
            'Description',
            'Total KPIs',
            'Completed KPIs',
            'Active KPIs',
            'Average Progress %',
            'Head of Department',
            'Contact Email',
            'Budget Allocation',
            'Active',
            'Created At',
            'Updated At'
        ];
    }

    /**
     * @param $department
     * @return array
     */
    public function map($department): array
    {
        $totalKpis = $department->kpis->count();
        $completedKpis = $department->kpis->where('status', 'completed')->count();
        $activeKpis = $department->kpis->whereIn('status', ['active', 'on_track', 'at_risk'])->count();
        $avgProgress = $department->kpis->avg('progress_percentage') ?? 0;

        return [
            $department->id,
            $department->name,
            $department->code ?? 'N/A',
            $department->description ?? 'N/A',
            $totalKpis,
            $completedKpis,
            $activeKpis,
            number_format($avgProgress, 2) . '%',
            $department->head_of_department ?? 'N/A',
            $department->contact_email ?? 'N/A',
            $department->budget_allocation ?? 'N/A',
            $department->active ? 'Yes' : 'No',
            $department->created_at->format('Y-m-d H:i:s'),
            $department->updated_at->format('Y-m-d H:i:s')
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
