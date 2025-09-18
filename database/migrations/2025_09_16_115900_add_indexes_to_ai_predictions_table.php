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
            $table->index(['created_at', 'status']);
            $table->index(['prediction_type', 'status']);
            $table->index(['status', 'confidence_score']);
            $table->index('requested_by');
            $table->index('prediction_date');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('ai_predictions', function (Blueprint $table) {
            $table->dropIndex(['created_at', 'status']);
            $table->dropIndex(['prediction_type', 'status']);
            $table->dropIndex(['status', 'confidence_score']);
            $table->dropIndex(['requested_by']);
            $table->dropIndex(['prediction_date']);
        });
    }
};
