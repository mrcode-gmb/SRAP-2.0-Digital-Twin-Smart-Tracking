<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Department;

class DepartmentSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $departments = [
            [
                'name' => 'Information Technology',
                'code' => 'IT',
                'description' => 'Responsible for technology infrastructure, software development, and digital transformation initiatives.',
                'head_of_department' => null,
                'is_active' => true,
            ],
            [
                'name' => 'Cybersecurity',
                'code' => 'CYBER',
                'description' => 'Ensures digital security, data protection, and cybersecurity policy implementation.',
                'head_of_department' => null,
                'is_active' => true,
            ],
            [
                'name' => 'Digital Economy',
                'code' => 'DIGECO',
                'description' => 'Promotes digital economy initiatives, e-commerce, and digital financial services.',
                'head_of_department' => null,
                'is_active' => true,
            ],
            [
                'name' => 'Research & Development',
                'code' => 'RND',
                'description' => 'Conducts research on emerging technologies and innovation in digital transformation.',
                'head_of_department' => null,
                'is_active' => true,
            ],
            [
                'name' => 'Policy & Strategy',
                'code' => 'POLICY',
                'description' => 'Develops policies, strategies, and frameworks for digital transformation.',
                'head_of_department' => null,
                'is_active' => true,
            ],
            [
                'name' => 'Digital Literacy',
                'code' => 'DIGLIT',
                'description' => 'Promotes digital skills development and capacity building programs.',
                'head_of_department' => null,
                'is_active' => true,
            ],
            [
                'name' => 'Infrastructure Development',
                'code' => 'INFRA',
                'description' => 'Oversees digital infrastructure development and telecommunications.',
                'head_of_department' => null,
                'is_active' => true,
            ],
            [
                'name' => 'Data Analytics',
                'code' => 'DATA',
                'description' => 'Manages data analytics, business intelligence, and data governance.',
                'head_of_department' => null,
                'is_active' => true,
            ],
        ];

        foreach ($departments as $department) {
            Department::firstOrCreate(
                ['code' => $department['code']],
                $department
            );
        }
    }
}
