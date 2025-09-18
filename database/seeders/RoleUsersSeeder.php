<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class RoleUsersSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create sample users for each role
        $users = [
            [
                'name' => 'Admin User',
                'email' => 'admin@nitda.gov.ng',
                'password' => Hash::make('password123'),
                'role' => 'admin',
                'email_verified_at' => now(),
            ],
            [
                'name' => 'Research Specialist',
                'email' => 'researcher@nitda.gov.ng',
                'password' => Hash::make('password123'),
                'role' => 'researcher',
                'email_verified_at' => now(),
            ],
            [
                'name' => 'Data Analyst',
                'email' => 'analyst@nitda.gov.ng',
                'password' => Hash::make('password123'),
                'role' => 'data_analyst',
                'email_verified_at' => now(),
            ],
            [
                'name' => 'Security Expert',
                'email' => 'security@nitda.gov.ng',
                'password' => Hash::make('password123'),
                'role' => 'cybersecurity_specialist',
                'email_verified_at' => now(),
            ],
            [
                'name' => 'AI Developer',
                'email' => 'ai@nitda.gov.ng',
                'password' => Hash::make('password123'),
                'role' => 'ai_developer',
                'email_verified_at' => now(),
            ],
        ];

        foreach ($users as $userData) {
            User::firstOrCreate(
                ['email' => $userData['email']],
                $userData
            );
        }

        $this->command->info('Sample users created successfully!');
        $this->command->info('Login credentials:');
        $this->command->info('Admin: admin@nitda.gov.ng / password123');
        $this->command->info('Researcher: researcher@nitda.gov.ng / password123');
        $this->command->info('Data Analyst: analyst@nitda.gov.ng / password123');
        $this->command->info('Security: security@nitda.gov.ng / password123');
        $this->command->info('AI Developer: ai@nitda.gov.ng / password123');
    }
}
