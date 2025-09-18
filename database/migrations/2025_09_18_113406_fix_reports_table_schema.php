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
            // Add missing columns that the controller expects
            $table->string('period')->nullable()->after('format');
            $table->date('start_date')->nullable()->after('period');
            $table->date('end_date')->nullable()->after('start_date');
            
            // Remove old columns that are not used
            $table->dropColumn(['period_start', 'period_end']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('reports', function (Blueprint $table) {
            $table->dropColumn(['period', 'start_date', 'end_date']);
            $table->date('period_start')->after('format');
            $table->date('period_end')->after('period_start');
        });
    }
};
