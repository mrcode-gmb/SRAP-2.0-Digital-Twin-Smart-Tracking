<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // 1) Ensure 'staff' exists in the enum before mapping
        DB::statement("ALTER TABLE users MODIFY COLUMN role ENUM('admin','strategy_team','department_user','researcher','data_analyst','cybersecurity_specialist','ai_developer','data_officer','hod','staff') DEFAULT 'department_user'");

        // 2) Map all legacy roles (except admin, data_officer, hod) to 'staff'
        DB::statement("UPDATE users SET role = 'staff' WHERE role NOT IN ('admin','data_officer','hod','staff')");

        // 3) Restrict enum strictly to the four supported roles and set default to 'staff'
        DB::statement("ALTER TABLE users MODIFY COLUMN role ENUM('admin','data_officer','hod','staff') DEFAULT 'staff'");
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // 1) Allow legacy roles again (without 'staff')
        DB::statement("ALTER TABLE users MODIFY COLUMN role ENUM('admin','strategy_team','department_user','researcher','data_analyst','cybersecurity_specialist','ai_developer','data_officer','hod','staff') DEFAULT 'department_user'");

        // 2) Map 'staff' back to 'department_user' to fit the old enum
        DB::statement("UPDATE users SET role = 'department_user' WHERE role = 'staff'");

        // 3) Drop 'staff' from enum, restore original list
        DB::statement("ALTER TABLE users MODIFY COLUMN role ENUM('admin','strategy_team','department_user','researcher','data_analyst','cybersecurity_specialist','ai_developer','data_officer','hod') DEFAULT 'department_user'");
    }
};
