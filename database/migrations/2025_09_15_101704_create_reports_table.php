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
        Schema::create('reports', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->text('description')->nullable();
            $table->enum('type', ['monthly', 'quarterly', 'annual', 'custom'])->default('monthly');
            $table->enum('format', ['pdf', 'excel', 'both'])->default('pdf');
            $table->date('period_start');
            $table->date('period_end');
            $table->enum('status', ['pending', 'generating', 'completed', 'failed'])->default('pending');
            $table->string('file_path')->nullable();
            $table->string('excel_path')->nullable();
            $table->json('filters')->nullable(); // Pillars, departments, KPIs to include
            $table->json('metadata')->nullable(); // Additional report configuration
            $table->unsignedBigInteger('generated_by');
            $table->timestamp('generated_at')->nullable();
            $table->integer('download_count')->default(0);
            $table->timestamps();
            
            $table->foreign('generated_by')->references('id')->on('users');
            $table->index(['type', 'status']);
            $table->index(['period_start', 'period_end']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('reports');
    }
};
