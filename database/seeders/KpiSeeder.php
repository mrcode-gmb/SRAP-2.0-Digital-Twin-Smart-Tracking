<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Kpis;
use App\Models\SrapPillar;
use App\Models\Department;
use App\Models\User;

class KpiSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Get pillar and department IDs
        $infraPillar = SrapPillar::where('code', 'INFRA')->first();
        $skillsPillar = SrapPillar::where('code', 'SKILLS')->first();
        $economyPillar = SrapPillar::where('code', 'ECONOMY')->first();
        $govtPillar = SrapPillar::where('code', 'GOVT')->first();
        $cyberPillar = SrapPillar::where('code', 'CYBER')->first();
        $innovationPillar = SrapPillar::where('code', 'INNOVATION')->first();

        $itDept = Department::where('code', 'IT')->first();
        $cyberDept = Department::where('code', 'CYBER')->first();
        $dataDept = Department::where('code', 'DATA')->first();
        $policyDept = Department::where('code', 'POLICY')->first();
        $rndDept = Department::where('code', 'RND')->first();
        $infraDept = Department::where('code', 'INFRA')->first();
        $digeconoMy = Department::where('code', 'DIGECO')->first();

        $admin = User::where('role', 'admin')->first();

        $kpis = [
            // Digital Infrastructure KPIs
            [
                'name' => 'Broadband Penetration Rate',
                'code' => 'INFRA-001',
                'description' => 'Percentage of population with access to broadband internet connectivity',
                'pillar_id' => $infraPillar?->id,
                'department_id' => $infraDept?->id,
                'measurement_type' => 'percentage',
                'target_value' => 70.00,
                'current_value' => 45.30,
                'unit' => '%',
                'frequency' => 'quarterly',
                'start_date' => '2025-01-01',
                'end_date' => '2030-12-31',
                'status' => 'in_progress',
                'priority' => 1,
                'weight' => 3.0,
                'created_by' => $admin?->id ?? 1,
            ],
            [
                'name' => 'Data Center Capacity',
                'code' => 'INFRA-002',
                'description' => 'Total data center capacity in megawatts across Nigeria',
                'pillar_id' => $infraPillar?->id,
                'department_id' => $itDept?->id,
                'measurement_type' => 'number',
                'target_value' => 500.00,
                'current_value' => 180.50,
                'unit' => 'MW',
                'frequency' => 'annually',
                'start_date' => '2025-01-01',
                'end_date' => '2030-12-31',
                'status' => 'in_progress',
                'priority' => 2,
                'weight' => 2.5,
                'created_by' => $admin?->id ?? 1,
            ],

            // Digital Skills & Literacy KPIs
            [
                'name' => 'Digital Literacy Rate',
                'code' => 'SKILLS-001',
                'description' => 'Percentage of population with basic digital skills',
                'pillar_id' => $skillsPillar?->id,
                'department_id' => $policyDept?->id,
                'measurement_type' => 'percentage',
                'target_value' => 80.00,
                'current_value' => 35.20,
                'unit' => '%',
                'frequency' => 'annually',
                'start_date' => '2025-01-01',
                'end_date' => '2030-12-31',
                'status' => 'in_progress',
                'priority' => 1,
                'weight' => 3.0,
                'created_by' => $admin?->id ?? 1,
            ],
            [
                'name' => 'ICT Graduates per Year',
                'code' => 'SKILLS-002',
                'description' => 'Number of ICT graduates from Nigerian institutions annually',
                'pillar_id' => $skillsPillar?->id,
                'department_id' => $rndDept?->id,
                'measurement_type' => 'number',
                'target_value' => 50000.00,
                'current_value' => 28500.00,
                'unit' => 'graduates',
                'frequency' => 'annually',
                'start_date' => '2025-01-01',
                'end_date' => '2030-12-31',
                'status' => 'on_track',
                'priority' => 2,
                'weight' => 2.0,
                'created_by' => $admin?->id ?? 1,
            ],

            // Digital Economy KPIs
            [
                'name' => 'Digital Economy GDP Contribution',
                'code' => 'ECONOMY-001',
                'description' => 'Percentage contribution of digital economy to national GDP',
                'pillar_id' => $economyPillar?->id,
                'department_id' => $digeconoMy?->id,
                'measurement_type' => 'percentage',
                'target_value' => 25.00,
                'current_value' => 12.80,
                'unit' => '%',
                'frequency' => 'annually',
                'start_date' => '2025-01-01',
                'end_date' => '2030-12-31',
                'status' => 'in_progress',
                'priority' => 1,
                'weight' => 3.5,
                'created_by' => $admin?->id ?? 1,
            ],
            [
                'name' => 'E-commerce Transaction Volume',
                'code' => 'ECONOMY-002',
                'description' => 'Annual e-commerce transaction volume in billions of Naira',
                'pillar_id' => $economyPillar?->id,
                'department_id' => $digeconoMy?->id,
                'measurement_type' => 'currency',
                'target_value' => 15000.00,
                'current_value' => 5200.00,
                'unit' => 'Billion NGN',
                'frequency' => 'annually',
                'start_date' => '2025-01-01',
                'end_date' => '2030-12-31',
                'status' => 'in_progress',
                'priority' => 2,
                'weight' => 2.5,
                'created_by' => $admin?->id ?? 1,
            ],

            // Digital Government KPIs
            [
                'name' => 'Government Services Digitized',
                'code' => 'GOVT-001',
                'description' => 'Percentage of government services available digitally',
                'pillar_id' => $govtPillar?->id,
                'department_id' => $policyDept?->id,
                'measurement_type' => 'percentage',
                'target_value' => 90.00,
                'current_value' => 42.50,
                'unit' => '%',
                'frequency' => 'quarterly',
                'start_date' => '2025-01-01',
                'end_date' => '2030-12-31',
                'status' => 'in_progress',
                'priority' => 1,
                'weight' => 2.8,
                'created_by' => $admin?->id ?? 1,
            ],

            // Cybersecurity & Trust KPIs
            [
                'name' => 'Cybersecurity Incidents Response Time',
                'code' => 'CYBER-001',
                'description' => 'Average response time to cybersecurity incidents in hours',
                'pillar_id' => $cyberPillar?->id,
                'department_id' => $cyberDept?->id,
                'measurement_type' => 'number',
                'target_value' => 2.00,
                'current_value' => 8.50,
                'unit' => 'hours',
                'frequency' => 'monthly',
                'start_date' => '2025-01-01',
                'end_date' => '2030-12-31',
                'status' => 'at_risk',
                'priority' => 1,
                'weight' => 3.0,
                'created_by' => $admin?->id ?? 1,
            ],

            // Innovation & Emerging Technologies KPIs
            [
                'name' => 'AI/ML Projects Implemented',
                'code' => 'INNOVATION-001',
                'description' => 'Number of AI/ML projects successfully implemented in government',
                'pillar_id' => $innovationPillar?->id,
                'department_id' => $rndDept?->id,
                'measurement_type' => 'number',
                'target_value' => 100.00,
                'current_value' => 15.00,
                'unit' => 'projects',
                'frequency' => 'quarterly',
                'start_date' => '2025-01-01',
                'end_date' => '2030-12-31',
                'status' => 'not_started',
                'priority' => 2,
                'weight' => 2.0,
                'created_by' => $admin?->id ?? 1,
            ],
        ];

        foreach ($kpis as $kpi) {
            Kpis::firstOrCreate(
                ['code' => $kpi['code']],
                $kpi
            );
        }
    }
}
