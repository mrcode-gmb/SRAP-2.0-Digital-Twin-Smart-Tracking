<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->enum('role', ['admin', 'strategy_team', 'department_user', 'researcher', 'data_analyst', 'cybersecurity_specialist', 'ai_developer'])
                  ->default('department_user')
                  ->after('email');
            $table->unsignedBigInteger('department_id')->nullable()->after('role');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn(['role', 'department_id']);
        });
    }
};
