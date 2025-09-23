<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\SrapPillar;
use App\Models\Initiative;
use App\Models\Kpis;
use App\Models\Department;
use App\Models\User;

class Srap2DataSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create SRAP 2.0 Pillars
        $pillars = [
            [
                'name' => 'Digital Infrastructure',
                'code' => 'PILLAR_1',
                'description' => 'Development and enhancement of digital infrastructure to support Nigeria\'s digital transformation',
                'color' => '#3B82F6',
                'order_index' => 1,
                'weight' => 12.5
            ],
            [
                'name' => 'Digital Skills and Literacy',
                'code' => 'PILLAR_2',
                'description' => 'Building digital skills and literacy across all segments of society',
                'color' => '#10B981',
                'order_index' => 2,
                'weight' => 12.5
            ],
            [
                'name' => 'Digital Government',
                'code' => 'PILLAR_3',
                'description' => 'Transforming government services through digital technologies',
                'color' => '#F59E0B',
                'order_index' => 3,
                'weight' => 12.5
            ],
            [
                'name' => 'Digital Economy',
                'code' => 'PILLAR_4',
                'description' => 'Fostering a thriving digital economy and innovation ecosystem',
                'color' => '#EF4444',
                'order_index' => 4,
                'weight' => 12.5
            ],
            [
                'name' => 'Digital Society',
                'code' => 'PILLAR_5',
                'description' => 'Creating an inclusive digital society for all Nigerians',
                'color' => '#8B5CF6',
                'order_index' => 5,
                'weight' => 12.5
            ],
            [
                'name' => 'Trust and Security',
                'code' => 'PILLAR_6',
                'description' => 'Ensuring cybersecurity, privacy, and trust in digital systems',
                'color' => '#06B6D4',
                'order_index' => 6,
                'weight' => 12.5
            ],
            [
                'name' => 'Digital Transformation Technologies',
                'code' => 'PILLAR_7',
                'description' => 'Leveraging emerging technologies for digital transformation',
                'color' => '#EC4899',
                'order_index' => 7,
                'weight' => 12.5
            ],
            [
                'name' => 'Indigenous Content Development',
                'code' => 'PILLAR_8',
                'description' => 'Promoting local content creation and digital innovation',
                'color' => '#84CC16',
                'order_index' => 8,
                'weight' => 12.5
            ]
        ];

        foreach ($pillars as $pillarData) {
            SrapPillar::create($pillarData);
        }

        // Get created pillars
        $digitalInfra = SrapPillar::where('code', 'PILLAR_1')->first();
        $digitalSkills = SrapPillar::where('code', 'PILLAR_2')->first();
        $digitalGov = SrapPillar::where('code', 'PILLAR_3')->first();
        $digitalEconomy = SrapPillar::where('code', 'PILLAR_4')->first();
        $digitalSociety = SrapPillar::where('code', 'PILLAR_5')->first();
        $trustSecurity = SrapPillar::where('code', 'PILLAR_6')->first();
        $digitalTech = SrapPillar::where('code', 'PILLAR_7')->first();
        $indigenousContent = SrapPillar::where('code', 'PILLAR_8')->first();

        // Create sample departments
        $departments = [
            ['name' => 'National Information Technology Development Agency', 'code' => 'NITDA'],
            ['name' => 'Ministry of Communications and Digital Economy', 'code' => 'FMCDE'],
            ['name' => 'Nigerian Communications Commission', 'code' => 'NCC'],
            ['name' => 'Galaxy Backbone Limited', 'code' => 'GBB'],
            ['name' => 'National Identity Management Commission', 'code' => 'NIMC'],
        ];

        foreach ($departments as $deptData) {
            Department::create(array_merge($deptData, [
                'description' => 'Government agency responsible for digital transformation initiatives',
                'is_active' => true
            ]));
        }

        $nitda = Department::where('code', 'NITDA')->first();
        $fmcde = Department::where('code', 'FMCDE')->first();

        // Create admin user
        $admin = User::create([
            'name' => 'System Administrator',
            'email' => 'admin@srap2.gov.ng',
            'password' => bcrypt('password'),
            'role' => 'admin',
            'department_id' => $nitda->id,
            'email_verified_at' => now()
        ]);

        // Create Initiatives for each pillar
        $initiatives = [
            // Pillar 1: Digital Infrastructure
            [
                'name' => 'National Broadband Infrastructure Development',
                'code' => 'INIT_001',
                'description' => 'Expand broadband infrastructure to achieve 70% coverage by 2025',
                'pillar_id' => $digitalInfra->id,
                'department_id' => $nitda->id,
                'start_date' => '2024-01-01',
                'end_date' => '2025-12-31',
                'status' => 'in_progress',
                'priority' => 1,
                'budget' => 50000000000,
                'lead_agency' => 'NITDA',
                'created_by' => $admin->id
            ],
            [
                'name' => '5G Network Deployment',
                'code' => 'INIT_002',
                'description' => 'Deploy 5G networks in major cities across Nigeria',
                'pillar_id' => $digitalInfra->id,
                'department_id' => $fmcde->id,
                'start_date' => '2024-06-01',
                'end_date' => '2026-12-31',
                'status' => 'in_progress',
                'priority' => 1,
                'budget' => 30000000000,
                'lead_agency' => 'NCC',
                'created_by' => $admin->id
            ],
            // Pillar 2: Digital Skills
            [
                'name' => 'Digital Skills Training Program',
                'code' => 'INIT_003',
                'description' => 'Train 10 million Nigerians in digital skills by 2025',
                'pillar_id' => $digitalSkills->id,
                'department_id' => $nitda->id,
                'start_date' => '2024-01-01',
                'end_date' => '2025-12-31',
                'status' => 'on_track',
                'priority' => 1,
                'budget' => 15000000000,
                'lead_agency' => 'NITDA',
                'created_by' => $admin->id
            ],
            // Pillar 3: Digital Government
            [
                'name' => 'Government Digital Services Platform',
                'code' => 'INIT_004',
                'description' => 'Digitize 80% of government services by 2025',
                'pillar_id' => $digitalGov->id,
                'department_id' => $nitda->id,
                'start_date' => '2024-01-01',
                'end_date' => '2025-12-31',
                'status' => 'in_progress',
                'priority' => 1,
                'budget' => 25000000000,
                'lead_agency' => 'NITDA',
                'created_by' => $admin->id
            ],
            // Pillar 4: Digital Economy
            [
                'name' => 'Startup Nigeria Initiative',
                'code' => 'INIT_005',
                'description' => 'Support 1000 tech startups and create 500,000 jobs',
                'pillar_id' => $digitalEconomy->id,
                'department_id' => $nitda->id,
                'start_date' => '2024-01-01',
                'end_date' => '2025-12-31',
                'status' => 'on_track',
                'priority' => 1,
                'budget' => 20000000000,
                'lead_agency' => 'NITDA',
                'created_by' => $admin->id
            ]
        ];

        foreach ($initiatives as $initData) {
            Initiative::create($initData);
        }

        // Create KPIs for each initiative
        $broadbandInit = Initiative::where('code', 'INIT_001')->first();
        $fiveGInit = Initiative::where('code', 'INIT_002')->first();
        $skillsInit = Initiative::where('code', 'INIT_003')->first();
        $govServicesInit = Initiative::where('code', 'INIT_004')->first();
        $startupInit = Initiative::where('code', 'INIT_005')->first();

        $kpis = [
            // Broadband Infrastructure KPIs
            [
                'name' => 'National Broadband Coverage',
                'code' => 'KPI_001',
                'description' => 'Percentage of national territory covered by broadband infrastructure',
                'pillar_id' => $digitalInfra->id,
                'initiative_id' => $broadbandInit->id,
                'department_id' => $nitda->id,
                'measurement_type' => 'percentage',
                'target_value' => 70.00,
                'current_value' => 45.50,
                'unit' => '%',
                'frequency' => 'quarterly',
                'start_date' => '2024-01-01',
                'end_date' => '2025-12-31',
                'status' => 'in_progress',
                'priority' => 1,
                'weight' => 2.0,
                'created_by' => $admin->id
            ],
            [
                'name' => 'Fiber Optic Cable Deployment',
                'code' => 'KPI_002',
                'description' => 'Kilometers of fiber optic cables deployed',
                'pillar_id' => $digitalInfra->id,
                'initiative_id' => $broadbandInit->id,
                'department_id' => $nitda->id,
                'measurement_type' => 'number',
                'target_value' => 50000.00,
                'current_value' => 32000.00,
                'unit' => 'km',
                'frequency' => 'monthly',
                'start_date' => '2024-01-01',
                'end_date' => '2025-12-31',
                'status' => 'on_track',
                'priority' => 2,
                'weight' => 1.5,
                'created_by' => $admin->id
            ],
            // 5G Network KPIs
            [
                'name' => '5G Base Stations Deployed',
                'code' => 'KPI_003',
                'description' => 'Number of 5G base stations deployed nationwide',
                'pillar_id' => $digitalInfra->id,
                'initiative_id' => $fiveGInit->id,
                'department_id' => $fmcde->id,
                'measurement_type' => 'number',
                'target_value' => 5000.00,
                'current_value' => 1200.00,
                'unit' => 'stations',
                'frequency' => 'monthly',
                'start_date' => '2024-06-01',
                'end_date' => '2026-12-31',
                'status' => 'in_progress',
                'priority' => 1,
                'weight' => 2.0,
                'created_by' => $admin->id
            ],
            // Digital Skills KPIs
            [
                'name' => 'Citizens Trained in Digital Skills',
                'code' => 'KPI_004',
                'description' => 'Number of Nigerian citizens trained in digital skills',
                'pillar_id' => $digitalSkills->id,
                'initiative_id' => $skillsInit->id,
                'department_id' => $nitda->id,
                'measurement_type' => 'number',
                'target_value' => 10000000.00,
                'current_value' => 3500000.00,
                'unit' => 'people',
                'frequency' => 'monthly',
                'start_date' => '2024-01-01',
                'end_date' => '2025-12-31',
                'status' => 'on_track',
                'priority' => 1,
                'weight' => 3.0,
                'created_by' => $admin->id
            ],
            [
                'name' => 'Digital Literacy Centers Established',
                'code' => 'KPI_005',
                'description' => 'Number of digital literacy centers established nationwide',
                'pillar_id' => $digitalSkills->id,
                'initiative_id' => $skillsInit->id,
                'department_id' => $nitda->id,
                'measurement_type' => 'number',
                'target_value' => 1000.00,
                'current_value' => 650.00,
                'unit' => 'centers',
                'frequency' => 'quarterly',
                'start_date' => '2024-01-01',
                'end_date' => '2025-12-31',
                'status' => 'on_track',
                'priority' => 2,
                'weight' => 1.5,
                'created_by' => $admin->id
            ],
            // Digital Government KPIs
            [
                'name' => 'Government Services Digitized',
                'code' => 'KPI_006',
                'description' => 'Percentage of government services available digitally',
                'pillar_id' => $digitalGov->id,
                'initiative_id' => $govServicesInit->id,
                'department_id' => $nitda->id,
                'measurement_type' => 'percentage',
                'target_value' => 80.00,
                'current_value' => 55.00,
                'unit' => '%',
                'frequency' => 'quarterly',
                'start_date' => '2024-01-01',
                'end_date' => '2025-12-31',
                'status' => 'in_progress',
                'priority' => 1,
                'weight' => 2.5,
                'created_by' => $admin->id
            ],
            // Digital Economy KPIs
            [
                'name' => 'Tech Startups Supported',
                'code' => 'KPI_007',
                'description' => 'Number of technology startups supported through various programs',
                'pillar_id' => $digitalEconomy->id,
                'initiative_id' => $startupInit->id,
                'department_id' => $nitda->id,
                'measurement_type' => 'number',
                'target_value' => 1000.00,
                'current_value' => 420.00,
                'unit' => 'startups',
                'frequency' => 'quarterly',
                'start_date' => '2024-01-01',
                'end_date' => '2025-12-31',
                'status' => 'on_track',
                'priority' => 1,
                'weight' => 2.0,
                'created_by' => $admin->id
            ],
            [
                'name' => 'Digital Jobs Created',
                'code' => 'KPI_008',
                'description' => 'Number of digital economy jobs created',
                'pillar_id' => $digitalEconomy->id,
                'initiative_id' => $startupInit->id,
                'department_id' => $nitda->id,
                'measurement_type' => 'number',
                'target_value' => 500000.00,
                'current_value' => 180000.00,
                'unit' => 'jobs',
                'frequency' => 'quarterly',
                'start_date' => '2024-01-01',
                'end_date' => '2025-12-31',
                'status' => 'in_progress',
                'priority' => 1,
                'weight' => 2.5,
                'created_by' => $admin->id
            ]
        ];

        foreach ($kpis as $kpiData) {
            Kpis::create($kpiData);
        }

        $this->command->info('SRAP 2.0 data seeded successfully!');
    }
}
