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
        // Create SRAP 2.0 Pillars - Official 8 Pillars
        $pillars = [
            [
                'name' => 'Foster Digital Literacy and Cultivate Talents',
                'code' => 'PILLAR_1',
                'description' => 'Developing digital skills and cultivating talent for the digital economy.',
                'color' => '#3B82F6',
                'icon' => 'users',
                'target_completion_date' => '2030-12-31',
                'order_index' => 1,
                'weight' => 12.5,
                'priority_level' => 'high',
                'is_active' => true
            ],
            [
                'name' => 'Build a Robust Technology Research Ecosystem',
                'code' => 'PILLAR_2',
                'description' => 'Establishing and strengthening technology research capabilities and innovation ecosystems.',
                'color' => '#10B981',
                'icon' => 'flask',
                'target_completion_date' => '2030-12-31',
                'order_index' => 2,
                'weight' => 12.5,
                'priority_level' => 'high',
                'is_active' => true
            ],
            [
                'name' => 'Strengthen Policy Implementation and Legal Framework',
                'code' => 'PILLAR_3',
                'description' => 'Developing and implementing robust policies and legal frameworks for digital transformation.',
                'color' => '#F59E0B',
                'icon' => 'scale',
                'target_completion_date' => '2030-12-31',
                'order_index' => 3,
                'weight' => 12.5,
                'priority_level' => 'medium',
                'is_active' => true
            ],
            [
                'name' => 'Promote Inclusive Access to Digital Infrastructure and Services',
                'code' => 'PILLAR_4',
                'description' => 'Ensuring inclusive access to digital infrastructure and services for all citizens.',
                'color' => '#8B5CF6',
                'icon' => 'wifi',
                'target_completion_date' => '2030-12-31',
                'order_index' => 4,
                'weight' => 12.5,
                'priority_level' => 'high',
                'is_active' => true
            ],
            [
                'name' => 'Strengthen Cybersecurity and Enhance Digital Trust',
                'code' => 'PILLAR_5',
                'description' => 'Building robust cybersecurity frameworks and enhancing trust in digital systems.',
                'color' => '#EF4444',
                'icon' => 'shield',
                'target_completion_date' => '2030-12-31',
                'order_index' => 5,
                'weight' => 12.5,
                'priority_level' => 'critical',
                'is_active' => true
            ],
            [
                'name' => 'Nurture an Innovative and Entrepreneurial Ecosystem',
                'code' => 'PILLAR_6',
                'description' => 'Fostering innovation and entrepreneurship in the digital economy.',
                'color' => '#06B6D4',
                'icon' => 'lightbulb',
                'target_completion_date' => '2030-12-31',
                'order_index' => 6,
                'weight' => 12.5,
                'priority_level' => 'medium',
                'is_active' => true
            ],
            [
                'name' => 'Forge Strategic Partnerships and Collaboration',
                'code' => 'PILLAR_7',
                'description' => 'Building strategic partnerships and collaborations for digital transformation initiatives.',
                'color' => '#84CC16',
                'icon' => 'users',
                'target_completion_date' => '2030-12-31',
                'order_index' => 7,
                'weight' => 12.5,
                'priority_level' => 'medium',
                'is_active' => true
            ],
            [
                'name' => 'Cultivate a Vibrant Organisational Culture and an Agile Workforce in NITDA',
                'code' => 'PILLAR_8',
                'description' => 'Developing organizational culture and building an agile workforce within NITDA.',
                'color' => '#F97316',
                'icon' => 'building-2',
                'target_completion_date' => '2030-12-31',
                'order_index' => 8,
                'weight' => 12.5,
                'priority_level' => 'high',
                'is_active' => true
            ]
        ];

        foreach ($pillars as $pillarData) {
            SrapPillar::create($pillarData);
        }

        // Get created pillars
        $digitalLiteracy = SrapPillar::where('code', 'PILLAR_1')->first();
        $techResearch = SrapPillar::where('code', 'PILLAR_2')->first();
        $policyLegal = SrapPillar::where('code', 'PILLAR_3')->first();
        $digitalAccess = SrapPillar::where('code', 'PILLAR_4')->first();
        $cybersecurity = SrapPillar::where('code', 'PILLAR_5')->first();
        $innovationEcosystem = SrapPillar::where('code', 'PILLAR_6')->first();
        $partnerships = SrapPillar::where('code', 'PILLAR_7')->first();
        $orgCulture = SrapPillar::where('code', 'PILLAR_8')->first();

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

        // Create Initiatives - NITDA Strategic Initiatives
        $initiatives = [
            // Pillar 8: Cultivate a Vibrant Organisational Culture and an Agile Workforce in NITDA
            [
                'name' => 'Behavioural Mindset and Cultural Reorientation',
                'code' => 'INIT_001',
                'description' => 'Achieve cultural transformation by 2025 to establish a psychologically safe organisation, enhancing collaboration, creativity, and effectiveness.',
                'pillar_id' => $orgCulture->id,
                'department_id' => $nitda->id,
                'start_date' => '2024-01-01',
                'end_date' => '2025-12-31',
                'status' => 'in_progress',
                'priority' => 1,
                'budget' => 2000000000,
                'lead_agency' => 'NITDA',
                'created_by' => $admin->id
            ],
            [
                'name' => 'Performance and Productivity Enhancement',
                'code' => 'INIT_002',
                'description' => 'Aim to improve NITDA\'s performance and productivity by 2027, through continuous improvement in the Performance Management System.',
                'pillar_id' => $orgCulture->id,
                'department_id' => $nitda->id,
                'start_date' => '2024-01-01',
                'end_date' => '2027-12-31',
                'status' => 'in_progress',
                'priority' => 1,
                'budget' => 3000000000,
                'lead_agency' => 'NITDA',
                'created_by' => $admin->id
            ],
            [
                'name' => 'Learning Culture Promotion',
                'code' => 'INIT_003',
                'description' => 'Foster a culture of continuous learning and skill development, keeping the workforce adaptable and well-equipped for technological advancements.',
                'pillar_id' => $orgCulture->id,
                'department_id' => $nitda->id,
                'start_date' => '2024-01-01',
                'end_date' => '2030-12-31',
                'status' => 'on_track',
                'priority' => 1,
                'budget' => 5000000000,
                'lead_agency' => 'NITDA',
                'created_by' => $admin->id
            ],
            [
                'name' => 'Adoption of Global Best Practices',
                'code' => 'INIT_004',
                'description' => 'Align NITDA\'s operations with international standards for optimal service delivery, ensuring the Agency remains competitive and relevant.',
                'pillar_id' => $orgCulture->id,
                'department_id' => $nitda->id,
                'start_date' => '2024-01-01',
                'end_date' => '2026-12-31',
                'status' => 'in_progress',
                'priority' => 1,
                'budget' => 1500000000,
                'lead_agency' => 'NITDA',
                'created_by' => $admin->id
            ]
        ];

        foreach ($initiatives as $initData) {
            Initiative::create($initData);
        }

        // Create KPIs for each initiative
        $culturalInit = Initiative::where('code', 'INIT_001')->first();
        $performanceInit = Initiative::where('code', 'INIT_002')->first();
        $learningInit = Initiative::where('code', 'INIT_003')->first();
        $bestPracticesInit = Initiative::where('code', 'INIT_004')->first();

        $kpis = [
            // Behavioural Mindset and Cultural Reorientation KPIs
            [
                'name' => 'Employee Psychological Safety Index',
                'code' => 'KPI_001',
                'description' => 'Measure of psychological safety within NITDA organization',
                'pillar_id' => $orgCulture->id,
                'initiative_id' => $culturalInit->id,
                'department_id' => $nitda->id,
                'measurement_type' => 'percentage',
                'target_value' => 85.00,
                'current_value' => 65.00,
                'unit' => '%',
                'frequency' => 'quarterly',
                'start_date' => '2024-01-01',
                'end_date' => '2025-12-31',
                'status' => 'in_progress',
                'priority' => 1,
                'weight' => 3.0,
                'created_by' => $admin->id
            ],
            [
                'name' => 'Collaboration Effectiveness Score',
                'code' => 'KPI_002',
                'description' => 'Assessment of cross-departmental collaboration effectiveness',
                'pillar_id' => $orgCulture->id,
                'initiative_id' => $culturalInit->id,
                'department_id' => $nitda->id,
                'measurement_type' => 'percentage',
                'target_value' => 80.00,
                'current_value' => 58.00,
                'unit' => '%',
                'frequency' => 'quarterly',
                'start_date' => '2024-01-01',
                'end_date' => '2025-12-31',
                'status' => 'in_progress',
                'priority' => 2,
                'weight' => 2.5,
                'created_by' => $admin->id
            ],
            // Performance and Productivity Enhancement KPIs
            [
                'name' => 'Overall Performance Management Score',
                'code' => 'KPI_003',
                'description' => 'Aggregate performance score from the Performance Management System',
                'pillar_id' => $orgCulture->id,
                'initiative_id' => $performanceInit->id,
                'department_id' => $nitda->id,
                'measurement_type' => 'percentage',
                'target_value' => 90.00,
                'current_value' => 72.00,
                'unit' => '%',
                'frequency' => 'quarterly',
                'start_date' => '2024-01-01',
                'end_date' => '2027-12-31',
                'status' => 'in_progress',
                'priority' => 1,
                'weight' => 3.0,
                'created_by' => $admin->id
            ],
            [
                'name' => 'Productivity Improvement Rate',
                'code' => 'KPI_004',
                'description' => 'Year-over-year productivity improvement percentage',
                'pillar_id' => $orgCulture->id,
                'initiative_id' => $performanceInit->id,
                'department_id' => $nitda->id,
                'measurement_type' => 'percentage',
                'target_value' => 25.00,
                'current_value' => 12.00,
                'unit' => '%',
                'frequency' => 'annually',
                'start_date' => '2024-01-01',
                'end_date' => '2027-12-31',
                'status' => 'in_progress',
                'priority' => 1,
                'weight' => 2.5,
                'created_by' => $admin->id
            ],
            // Learning Culture Promotion KPIs
            [
                'name' => 'Employee Training Participation Rate',
                'code' => 'KPI_005',
                'description' => 'Percentage of employees participating in continuous learning programs',
                'pillar_id' => $orgCulture->id,
                'initiative_id' => $learningInit->id,
                'department_id' => $nitda->id,
                'measurement_type' => 'percentage',
                'target_value' => 95.00,
                'current_value' => 78.00,
                'unit' => '%',
                'frequency' => 'quarterly',
                'start_date' => '2024-01-01',
                'end_date' => '2030-12-31',
                'status' => 'on_track',
                'priority' => 1,
                'weight' => 2.0,
                'created_by' => $admin->id
            ],
            [
                'name' => 'Skills Development Index',
                'code' => 'KPI_006',
                'description' => 'Measure of workforce skill advancement and technological adaptability',
                'pillar_id' => $orgCulture->id,
                'initiative_id' => $learningInit->id,
                'department_id' => $nitda->id,
                'measurement_type' => 'percentage',
                'target_value' => 85.00,
                'current_value' => 68.00,
                'unit' => '%',
                'frequency' => 'quarterly',
                'start_date' => '2024-01-01',
                'end_date' => '2030-12-31',
                'status' => 'on_track',
                'priority' => 2,
                'weight' => 2.0,
                'created_by' => $admin->id
            ],
            // Adoption of Global Best Practices KPIs
            [
                'name' => 'International Standards Compliance Rate',
                'code' => 'KPI_007',
                'description' => 'Percentage of operations aligned with international standards',
                'pillar_id' => $orgCulture->id,
                'initiative_id' => $bestPracticesInit->id,
                'department_id' => $nitda->id,
                'measurement_type' => 'percentage',
                'target_value' => 90.00,
                'current_value' => 65.00,
                'unit' => '%',
                'frequency' => 'quarterly',
                'start_date' => '2024-01-01',
                'end_date' => '2026-12-31',
                'status' => 'in_progress',
                'priority' => 1,
                'weight' => 2.5,
                'created_by' => $admin->id
            ],
            [
                'name' => 'Service Delivery Quality Score',
                'code' => 'KPI_008',
                'description' => 'Assessment of service delivery quality and competitiveness',
                'pillar_id' => $orgCulture->id,
                'initiative_id' => $bestPracticesInit->id,
                'department_id' => $nitda->id,
                'measurement_type' => 'percentage',
                'target_value' => 88.00,
                'current_value' => 71.00,
                'unit' => '%',
                'frequency' => 'quarterly',
                'start_date' => '2024-01-01',
                'end_date' => '2026-12-31',
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
