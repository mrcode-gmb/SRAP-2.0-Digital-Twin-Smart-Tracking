<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Milestone;
use App\Models\Kpis;
use App\Models\User;

class MilestoneSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Get KPI and User IDs
        $broadbandKpi = Kpis::where('code', 'INFRA-001')->first();
        $dataCenterKpi = Kpis::where('code', 'INFRA-002')->first();
        $digitalLiteracyKpi = Kpis::where('code', 'SKILLS-001')->first();
        $ictGraduatesKpi = Kpis::where('code', 'SKILLS-002')->first();
        $digitalEconomyKpi = Kpis::where('code', 'ECONOMY-001')->first();
        $ecommerceKpi = Kpis::where('code', 'ECONOMY-002')->first();
        $govtServicesKpi = Kpis::where('code', 'GOVT-001')->first();
        $cyberResponseKpi = Kpis::where('code', 'CYBER-001')->first();
        $aiProjectsKpi = Kpis::where('code', 'INNOVATION-001')->first();

        $admin = User::where('role', 'admin')->first();
        $researcher = User::where('role', 'researcher')->first();
        $analyst = User::where('role', 'data_analyst')->first();
        $cyberSpecialist = User::where('role', 'cybersecurity_specialist')->first();
        $aiDeveloper = User::where('role', 'ai_developer')->first();

        $milestones = [
            // Broadband Infrastructure Milestones
            [
                'name' => 'Complete National Fiber Backbone Phase 1',
                'description' => 'Complete the first phase of national fiber optic backbone infrastructure covering major cities',
                'kpi_id' => $broadbandKpi?->id,
                'assigned_to' => $researcher?->id,
                'due_date' => '2026-06-30',
                'completion_percentage' => 35,
                'deliverables' => json_encode([
                    'Fiber optic cables installed in 12 major cities',
                    'Network operation centers established',
                    'Quality assurance testing completed'
                ]),
                'notes' => 'Priority: High. Success criteria: Minimum 10Gbps capacity, 99.9% uptime, Coverage of 60% urban population. Dependencies: Land acquisition approvals, Equipment procurement, Contractor agreements',
                'created_by' => $admin?->id ?? 1,
            ],
            [
                'name' => 'Rural Broadband Expansion Program',
                'description' => 'Extend broadband connectivity to rural and underserved communities',
                'kpi_id' => $broadbandKpi?->id,
                'assigned_to' => $researcher?->id,
                'due_date' => '2027-12-31',
                'completion_percentage' => 15,
                'deliverables' => json_encode([
                    'Broadband access points in 500 rural communities',
                    'Mobile network towers',
                    'Community training centers'
                ]),
                'notes' => 'Priority: Medium. Success criteria: Minimum 25Mbps download speed, Affordable pricing plans, 80% population coverage. Dependencies: Regulatory approvals, Funding allocation, Partnership agreements with telcos',
                'created_by' => $admin?->id ?? 1,
            ],

            // Data Center Milestones
            [
                'name' => 'Establish Tier III Data Centers',
                'description' => 'Build and operationalize Tier III data centers in key economic zones',
                'kpi_id' => $dataCenterKpi?->id,
                'assigned_to' => $researcher?->id,
                'due_date' => '2026-12-31',
                'completion_percentage' => 25,
                'deliverables' => json_encode([
                    '3 Tier III data centers',
                    'Disaster recovery sites',
                    'Cloud infrastructure'
                ]),
                'notes' => 'Priority: High. Success criteria: 99.982% uptime, 150MW total capacity, International certifications. Dependencies: Site preparation, Power infrastructure, Cooling systems, Security measures',
                'created_by' => $admin?->id ?? 1,
            ],

            // Digital Literacy Milestones
            [
                'name' => 'National Digital Skills Training Program',
                'description' => 'Launch comprehensive digital skills training program for citizens',
                'kpi_id' => $digitalLiteracyKpi?->id,
                'assigned_to' => $analyst?->id,
                'due_date' => '2025-12-31',
                'completion_percentage' => 60,
                'deliverables' => json_encode([
                    'Training curriculum',
                    'Online learning platform',
                    'Certification system'
                ]),
                'notes' => 'Priority: High. Success criteria: 500,000 citizens trained annually, 80% completion rate, Industry-recognized certificates. Dependencies: Curriculum development, Platform development, Trainer recruitment',
                'created_by' => $admin?->id ?? 1,
            ],
            [
                'name' => 'Digital Literacy Assessment Framework',
                'description' => 'Develop standardized framework for measuring digital literacy levels',
                'kpi_id' => $digitalLiteracyKpi?->id,
                'assigned_to' => $analyst?->id,
                'due_date' => '2025-09-30',
                'completion_percentage' => 80,
                'deliverables' => json_encode([
                    'Assessment methodology',
                    'Testing platform',
                    'Reporting dashboard'
                ]),
                'notes' => 'Priority: Medium. Success criteria: Standardized metrics, Automated reporting, Quarterly assessments. Dependencies: Research completion, Platform development, Pilot testing',
                'created_by' => $admin?->id ?? 1,
            ],

            // Digital Economy Milestones
            [
                'name' => 'E-commerce Regulatory Framework',
                'description' => 'Establish comprehensive regulatory framework for e-commerce operations',
                'kpi_id' => $digitalEconomyKpi?->id,
                'assigned_to' => $analyst?->id,
                'due_date' => '2025-08-31',
                'completion_percentage' => 70,
                'deliverables' => json_encode([
                    'E-commerce regulations',
                    'Consumer protection guidelines',
                    'Tax framework'
                ]),
                'notes' => 'Priority: High. Success criteria: Legal compliance, Industry adoption, Consumer confidence increase. Dependencies: Stakeholder consultations, Legal reviews, Parliamentary approval',
                'created_by' => $admin?->id ?? 1,
            ],

            // Government Digital Services Milestones
            [
                'name' => 'Digital Identity System Implementation',
                'description' => 'Deploy national digital identity system for government services',
                'kpi_id' => $govtServicesKpi?->id,
                'assigned_to' => $cyberSpecialist?->id,
                'due_date' => '2026-03-31',
                'completion_percentage' => 40,
                'deliverables' => json_encode([
                    'Digital ID platform',
                    'Biometric verification system',
                    'API integrations'
                ]),
                'notes' => 'Priority: Critical. Success criteria: 50 million registered users, 99.9% system availability, Secure authentication. Dependencies: Privacy regulations, Security audits, System integration testing',
                'created_by' => $admin?->id ?? 1,
            ],

            // Cybersecurity Milestones
            [
                'name' => 'National Cybersecurity Operations Center',
                'description' => 'Establish 24/7 cybersecurity monitoring and response center',
                'kpi_id' => $cyberResponseKpi?->id,
                'assigned_to' => $cyberSpecialist?->id,
                'due_date' => '2025-12-31',
                'completion_percentage' => 50,
                'deliverables' => json_encode([
                    'SOC infrastructure',
                    'Threat intelligence platform',
                    'Incident response team'
                ]),
                'notes' => 'Priority: Critical. Success criteria: 24/7 monitoring, <2 hour response time, 95% threat detection rate. Dependencies: Equipment procurement, Staff training, Threat intelligence feeds',
                'created_by' => $admin?->id ?? 1,
            ],

            // AI/Innovation Milestones
            [
                'name' => 'Government AI Strategy Implementation',
                'description' => 'Deploy AI solutions across key government departments',
                'kpi_id' => $aiProjectsKpi?->id,
                'assigned_to' => $aiDeveloper?->id,
                'due_date' => '2026-06-30',
                'completion_percentage' => 20,
                'deliverables' => json_encode([
                    'AI governance framework',
                    'Pilot AI projects',
                    'Training programs'
                ]),
                'notes' => 'Priority: Medium. Success criteria: 10 successful AI implementations, 30% efficiency improvement, Ethical AI compliance. Dependencies: AI policy approval, Data infrastructure, Skills development',
                'created_by' => $admin?->id ?? 1,
            ],
        ];

        foreach ($milestones as $milestone) {
            Milestone::firstOrCreate(
                [
                    'name' => $milestone['name'],
                    'kpi_id' => $milestone['kpi_id']
                ],
                $milestone
            );
        }
    }
}
