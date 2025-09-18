<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Department;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Get department IDs
        $itDept = Department::where('code', 'IT')->first();
        $cyberDept = Department::where('code', 'CYBER')->first();
        $dataDept = Department::where('code', 'DATA')->first();
        $policyDept = Department::where('code', 'POLICY')->first();
        $rndDept = Department::where('code', 'RND')->first();

        $users = [
            [
                'name' => 'System Administrator',
                'email' => 'admin@nitda.gov.ng',
                'password' => Hash::make('password123'),
                'role' => 'admin',
                'department_id' => $itDept?->id,
                'email_verified_at' => now(),
            ],
            [
                'name' => 'Dr. Kashifu Inuwa',
                'email' => 'dg@nitda.gov.ng',
                'password' => Hash::make('password123'),
                'role' => 'admin',
                'department_id' => $policyDept?->id,
                'email_verified_at' => now(),
            ],
            [
                'name' => 'Sarah Johnson',
                'email' => 'sarah.johnson@nitda.gov.ng',
                'password' => Hash::make('password123'),
                'role' => 'strategy_team',
                'department_id' => $policyDept?->id,
                'email_verified_at' => now(),
            ],
            [
                'name' => 'Michael Chen',
                'email' => 'michael.chen@nitda.gov.ng',
                'password' => Hash::make('password123'),
                'role' => 'researcher',
                'department_id' => $rndDept?->id,
                'email_verified_at' => now(),
            ],
            [
                'name' => 'Aisha Abdullahi',
                'email' => 'aisha.abdullahi@nitda.gov.ng',
                'password' => Hash::make('password123'),
                'role' => 'data_analyst',
                'department_id' => $dataDept?->id,
                'email_verified_at' => now(),
            ],
            [
                'name' => 'David Okonkwo',
                'email' => 'david.okonkwo@nitda.gov.ng',
                'password' => Hash::make('password123'),
                'role' => 'cybersecurity_specialist',
                'department_id' => $cyberDept?->id,
                'email_verified_at' => now(),
            ],
            [
                'name' => 'Fatima Ibrahim',
                'email' => 'fatima.ibrahim@nitda.gov.ng',
                'password' => Hash::make('password123'),
                'role' => 'ai_developer',
                'department_id' => $itDept?->id,
                'email_verified_at' => now(),
            ],
            [
                'name' => 'John Adebayo',
                'email' => 'john.adebayo@nitda.gov.ng',
                'password' => Hash::make('password123'),
                'role' => 'department_user',
                'department_id' => $itDept?->id,
                'email_verified_at' => now(),
            ],
            [
                'name' => 'Grace Okoro',
                'email' => 'grace.okoro@nitda.gov.ng',
                'password' => Hash::make('password123'),
                'role' => 'researcher',
                'department_id' => $rndDept?->id,
                'email_verified_at' => now(),
            ],
            [
                'name' => 'Ahmed Hassan',
                'email' => 'ahmed.hassan@nitda.gov.ng',
                'password' => Hash::make('password123'),
                'role' => 'data_analyst',
                'department_id' => $dataDept?->id,
                'email_verified_at' => now(),
            ],
        ];

        foreach ($users as $user) {
            User::firstOrCreate(
                ['email' => $user['email']],
                $user
            );
        }
    }
}
