<?php

namespace App\Exports;

use Maatwebsite\Excel\Concerns\WithMultipleSheets;

class ComprehensiveReportExport implements WithMultipleSheets
{
    protected $data;

    public function __construct($data)
    {
        $this->data = $data;
    }

    /**
     * @return array
     */
    public function sheets(): array
    {
        return [
            'KPI Summary' => new KpiReportExport($this->data['kpis']),
            'Pillar Progress' => new PillarProgressExport($this->data['pillars']),
            'Department Performance' => new DepartmentPerformanceExport($this->data['departments']),
            'Milestone Status' => new MilestoneStatusExport($this->data['milestones']),
        ];
    }
}
