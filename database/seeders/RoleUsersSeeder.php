<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use App\Models\Department;

class RoleUsersSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Pick a default department for sample users (INFRA preferred)
        $defaultDept = Department::where('code', 'INFRA')->first()
            ?? Department::first();
        $defaultDeptId = $defaultDept?->id;

        // Create sample users for supported roles only
        $users = [
            [
                'name' => 'Admin User',
                'email' => 'admin@nitda.gov.ng',
                'password' => Hash::make('password123'),
                'role' => 'admin',
                'email_verified_at' => now(),
            ],
            [
                'name' => 'Data Officer',
                'email' => 'dataofficer@nitda.gov.ng',
                'password' => Hash::make('password123'),
                'role' => 'data_officer',
                'email_verified_at' => now(),
            ],
            [
                'name' => 'Head of Department',
                'email' => 'hod@nitda.gov.ng',
                'password' => Hash::make('password123'),
                'role' => 'hod',
                'email_verified_at' => now(),
            ],
            [
                'name' => 'Staff User',
                'email' => 'staff@nitda.gov.ng',
                'password' => Hash::make('password123'),
                'role' => 'staff',
                'email_verified_at' => now(),
            ],
        ];

        foreach ($users as $userData) {
            $user = User::firstOrCreate(
                ['email' => $userData['email']],
                $userData
            );

            // Assign department to DO/HOD/Staff if available
            if ($defaultDeptId && in_array($user->role, ['data_officer', 'hod', 'staff'])) {
                if ($user->department_id !== $defaultDeptId) {
                    $user->department_id = $defaultDeptId;
                    $user->save();
                }
            }
        }

        $this->command->info('Sample users created successfully!');
        $this->command->info('Login credentials:');
        $this->command->info('Admin: admin@nitda.gov.ng / password123');
        $this->command->info('Data Officer: dataofficer@nitda.gov.ng / password123');
        $this->command->info('HOD: hod@nitda.gov.ng / password123');
        $this->command->info('Staff: staff@nitda.gov.ng / password123');
    }
}
