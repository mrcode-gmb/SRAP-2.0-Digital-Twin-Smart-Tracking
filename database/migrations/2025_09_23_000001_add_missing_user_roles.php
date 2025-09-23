<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // Update the enum to include new roles
        DB::statement("ALTER TABLE users MODIFY COLUMN role ENUM('admin', 'strategy_team', 'department_user', 'researcher', 'data_analyst', 'cybersecurity_specialist', 'ai_developer', 'data_officer', 'hod') DEFAULT 'department_user'");
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Remove the new roles
        DB::statement("ALTER TABLE users MODIFY COLUMN role ENUM('admin', 'strategy_team', 'department_user', 'researcher', 'data_analyst', 'cybersecurity_specialist', 'ai_developer') DEFAULT 'department_user'");
    }
};
