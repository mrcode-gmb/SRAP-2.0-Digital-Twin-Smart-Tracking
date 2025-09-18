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
        Schema::create('kpi_progress', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('kpi_id');
            $table->decimal('value', 15, 2);
            $table->decimal('percentage', 5, 2)->nullable(); // Auto-calculated percentage
            $table->date('reporting_date');
            $table->enum('entry_type', ['manual', 'upload', 'api', 'system'])->default('manual');
            $table->text('notes')->nullable();
            $table->string('source')->nullable(); // File name or data source
            $table->json('metadata')->nullable(); // Additional data like file info, validation status
            $table->unsignedBigInteger('reported_by');
            $table->timestamp('verified_at')->nullable();
            $table->unsignedBigInteger('verified_by')->nullable();
            $table->timestamps();
            
            $table->foreign('kpi_id')->references('id')->on('kpis')->onDelete('cascade');
            $table->foreign('reported_by')->references('id')->on('users');
            $table->foreign('verified_by')->references('id')->on('users')->onDelete('set null');
            
            $table->index(['kpi_id', 'reporting_date']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('kpi_progress');
    }
};
