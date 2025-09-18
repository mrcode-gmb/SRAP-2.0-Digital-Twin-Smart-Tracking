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
        Schema::create('kpis', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('code')->unique();
            $table->text('description');
            $table->unsignedBigInteger('pillar_id');
            $table->unsignedBigInteger('department_id')->nullable();
            $table->string("assigned_to")->nullable();
            $table->enum('measurement_type', ['percentage', 'number', 'currency', 'ratio']);
            $table->decimal('target_value', 15, 2);
            $table->decimal('current_value', 15, 2)->default(0);
            $table->string('unit')->nullable();
            $table->enum('frequency', ['daily', 'weekly', 'monthly', 'quarterly', 'annually']);
            $table->date('start_date');
            $table->date('end_date');
            $table->enum('status', ['not_started', 'in_progress', 'on_track', 'at_risk', 'behind', 'completed'])->default('not_started');
            $table->integer('priority')->default(3); // 1=High, 2=Medium, 3=Low
            $table->decimal('weight', 5, 2)->default(1.0);
            $table->json('metadata')->nullable(); // For storing additional KPI-specific data
            $table->boolean('is_active')->default(true);
            $table->unsignedBigInteger('created_by');
            $table->timestamps();
            
            $table->foreign('pillar_id')->references('id')->on('srap_pillars')->onDelete('cascade');
            $table->foreign('department_id')->references('id')->on('departments')->onDelete('set null');
            $table->foreign('created_by')->references('id')->on('users');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('kpis');
    }
};
