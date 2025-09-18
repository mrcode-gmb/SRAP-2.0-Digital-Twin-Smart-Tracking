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
        Schema::table('ai_predictions', function (Blueprint $table) {
            $table->decimal('risk_score', 5, 2)->nullable()->after('prediction_result');
            $table->enum('risk_level', ['Low', 'Medium', 'High'])->nullable()->after('risk_score');
            $table->foreignId('kpi_id')->nullable()->after('id')->constrained('kpis')->onDelete('set null');
            $table->foreignId('user_id')->nullable()->after('kpi_id')->constrained()->onDelete('cascade');
            $table->string('file_path')->nullable()->after('notes');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('ai_predictions', function (Blueprint $table) {
            $table->dropColumn(['risk_score', 'risk_level', 'kpi_id', 'user_id', 'file_path']);
        });
    }
};
