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
        Schema::table('srap_pillars', function (Blueprint $table) {
            // Only add fields that don't exist yet
            $table->text('objectives')->nullable()->after('description');
            $table->decimal('budget_allocation', 15, 2)->nullable()->after('target_completion_date');
            $table->string('responsible_department')->nullable()->after('budget_allocation');
            $table->text('success_metrics')->nullable()->after('responsible_department');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('srap_pillars', function (Blueprint $table) {
            $table->dropColumn([
                'objectives',
                'budget_allocation',
                'responsible_department',
                'success_metrics'
            ]);
        });
    }
};
