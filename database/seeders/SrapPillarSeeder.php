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
                'name' => 'Digital Infrastructure',
                'code' => 'INFRA',
                'description' => 'Development and enhancement of digital infrastructure including broadband connectivity, data centers, and telecommunications networks.',
                'color' => '#3B82F6',
                'icon' => 'server',
                'target_completion_date' => '2030-12-31',
                'weight' => 25.0,
                'order_index' => 1,
                'is_active' => true,
            ],
            [
                'name' => 'Digital Skills & Literacy',
                'code' => 'SKILLS',
                'description' => 'Building digital skills and literacy across all segments of society through training programs and educational initiatives.',
                'color' => '#10B981',
                'icon' => 'graduation-cap',
                'target_completion_date' => '2030-12-31',
                'weight' => 20.0,
                'order_index' => 2,
                'is_active' => true,
            ],
            [
                'name' => 'Digital Economy',
                'code' => 'ECONOMY',
                'description' => 'Promoting digital economy growth through e-commerce, fintech, and digital financial services.',
                'color' => '#F59E0B',
                'icon' => 'trending-up',
                'target_completion_date' => '2030-12-31',
                'weight' => 20.0,
                'order_index' => 3,
                'is_active' => true,
            ],
            [
                'name' => 'Digital Government',
                'code' => 'GOVT',
                'description' => 'Digitalization of government services and processes to improve efficiency and citizen experience.',
                'color' => '#8B5CF6',
                'icon' => 'building',
                'target_completion_date' => '2030-12-31',
                'weight' => 15.0,
                'order_index' => 4,
                'is_active' => true,
            ],
            [
                'name' => 'Cybersecurity & Trust',
                'code' => 'CYBER',
                'description' => 'Ensuring cybersecurity and building trust in digital systems through robust security frameworks.',
                'color' => '#EF4444',
                'icon' => 'shield',
                'target_completion_date' => '2030-12-31',
                'weight' => 10.0,
                'order_index' => 5,
                'is_active' => true,
            ],
            [
                'name' => 'Innovation & Emerging Technologies',
                'code' => 'INNOVATION',
                'description' => 'Fostering innovation and adoption of emerging technologies like AI, IoT, and blockchain.',
                'color' => '#06B6D4',
                'icon' => 'lightbulb',
                'target_completion_date' => '2030-12-31',
                'weight' => 10.0,
                'order_index' => 6,
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
