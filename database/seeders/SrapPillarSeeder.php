<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\SrapPillar;

class SrapPillarSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $pillars = [
            [
                'name' => 'Foster Digital Literacy and Cultivate Talents',
                'code' => 'DIGITAL_LITERACY',
                'description' => 'Building digital skills and literacy across all segments of society while cultivating talents for the digital economy.',
                'color' => '#3B82F6',
                'icon' => 'graduation-cap',
                'target_completion_date' => '2030-12-31',
                'weight' => 12.5,
                'order_index' => 1,
                'is_active' => true,
            ],
            [
                'name' => 'Build a Robust Technology Research Ecosystem',
                'code' => 'TECH_RESEARCH',
                'description' => 'Establishing and strengthening technology research capabilities and innovation ecosystems.',
                'color' => '#10B981',
                'icon' => 'flask',
                'target_completion_date' => '2030-12-31',
                'weight' => 12.5,
                'order_index' => 2,
                'is_active' => true,
            ],
            [
                'name' => 'Strengthen Policy Implementation and Legal Framework',
                'code' => 'POLICY_LEGAL',
                'description' => 'Developing and implementing robust policies and legal frameworks for digital transformation.',
                'color' => '#F59E0B',
                'icon' => 'scale',
                'target_completion_date' => '2030-12-31',
                'weight' => 12.5,
                'order_index' => 3,
                'is_active' => true,
            ],
            [
                'name' => 'Promote Inclusive Access to Digital Infrastructure and Services',
                'code' => 'DIGITAL_ACCESS',
                'description' => 'Ensuring inclusive access to digital infrastructure and services for all citizens.',
                'color' => '#8B5CF6',
                'icon' => 'wifi',
                'target_completion_date' => '2030-12-31',
                'weight' => 12.5,
                'order_index' => 4,
                'is_active' => true,
            ],
            [
                'name' => 'Strengthen Cybersecurity and Enhance Digital Trust',
                'code' => 'CYBERSECURITY',
                'description' => 'Building robust cybersecurity frameworks and enhancing trust in digital systems.',
                'color' => '#EF4444',
                'icon' => 'shield',
                'target_completion_date' => '2030-12-31',
                'weight' => 12.5,
                'order_index' => 5,
                'is_active' => true,
            ],
            [
                'name' => 'Nurture an Innovative and Entrepreneurial Ecosystem',
                'code' => 'INNOVATION_ECOSYSTEM',
                'description' => 'Fostering innovation and entrepreneurship in the digital economy.',
                'color' => '#06B6D4',
                'icon' => 'lightbulb',
                'target_completion_date' => '2030-12-31',
                'weight' => 12.5,
                'order_index' => 6,
                'is_active' => true,
            ],
            [
                'name' => 'Forge Strategic Partnerships and Collaboration',
                'code' => 'PARTNERSHIPS',
                'description' => 'Building strategic partnerships and collaborations for digital transformation initiatives.',
                'color' => '#84CC16',
                'icon' => 'users',
                'target_completion_date' => '2030-12-31',
                'weight' => 12.5,
                'order_index' => 7,
                'is_active' => true,
            ],
            [
                'name' => 'Cultivate a Vibrant Organisational Culture and an Agile Workforce in NITDA',
                'code' => 'ORG_CULTURE',
                'description' => 'Developing organizational culture and building an agile workforce within NITDA.',
                'color' => '#F97316',
                'icon' => 'building-2',
                'target_completion_date' => '2030-12-31',
                'weight' => 12.5,
                'order_index' => 8,
                'is_active' => true,
            ],
        ];

        foreach ($pillars as $pillar) {
            SrapPillar::firstOrCreate(
                ['code' => $pillar['code']],
                $pillar
            );
        }
    }
}
