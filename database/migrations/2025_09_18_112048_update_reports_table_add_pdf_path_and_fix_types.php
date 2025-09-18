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
        Schema::table('reports', function (Blueprint $table) {
            // Add pdf_path column
            $table->string('pdf_path')->nullable()->after('file_path');
            
            // Update type enum to match controller expectations
            $table->dropColumn('type');
        });
        
        Schema::table('reports', function (Blueprint $table) {
            $table->enum('type', ['kpi_summary', 'pillar_progress', 'department_performance', 'milestone_status', 'comprehensive'])
                  ->default('kpi_summary')
                  ->after('description');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('reports', function (Blueprint $table) {
            $table->dropColumn('pdf_path');
            $table->dropColumn('type');
        });
        
        Schema::table('reports', function (Blueprint $table) {
            $table->enum('type', ['monthly', 'quarterly', 'annual', 'custom'])
                  ->default('monthly')
                  ->after('description');
        });
    }
};
