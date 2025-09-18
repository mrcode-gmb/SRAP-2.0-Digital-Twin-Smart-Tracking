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
        Schema::create('ai_predictions', function (Blueprint $table) {
            $table->id();
            $table->string('prediction_type'); // 'kpi_forecast', 'risk_assessment', 'scenario_analysis'
            $table->string('target_type'); // 'kpi', 'pillar', 'overall'
            $table->unsignedBigInteger('target_id')->nullable();
            $table->json('input_data'); // Historical data used for prediction
            $table->json('prediction_result'); // AI model output
            $table->decimal('confidence_score', 5, 2)->nullable();
            $table->date('prediction_date');
            $table->date('forecast_period_start')->nullable();
            $table->date('forecast_period_end')->nullable();
            $table->string('model_version')->nullable();
            $table->json('parameters')->nullable(); // Model parameters used
            $table->enum('status', ['pending', 'processing', 'completed', 'failed'])->default('pending');
            $table->text('notes')->nullable();
            $table->unsignedBigInteger('requested_by');
            $table->timestamps();
            
            $table->foreign('requested_by')->references('id')->on('users');
            $table->index(['prediction_type', 'target_type']);
            $table->index(['prediction_date', 'status']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('ai_predictions');
    }
};
