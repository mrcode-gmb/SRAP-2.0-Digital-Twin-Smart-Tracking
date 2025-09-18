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
        Schema::create('alerts', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->text('message');
            $table->enum('type', ['deadline', 'performance', 'system', 'milestone', 'kpi_update', 'info', 'warning', 'error', 'success'])->default('info');
            $table->tinyInteger('priority')->default(3); // 1=Critical, 2=High, 3=Medium, 4=Low, 5=Info
            $table->string('alertable_type'); // Polymorphic relation (KPI, Milestone, etc.)
            $table->unsignedBigInteger('alertable_id');
            $table->json('recipients')->nullable(); // User IDs or roles to notify
            $table->boolean('is_read')->default(false);
            $table->boolean('email_sent')->default(false);
            $table->timestamp('triggered_at');
            $table->timestamp('acknowledged_at')->nullable();
            $table->unsignedBigInteger('acknowledged_by')->nullable();
            $table->json('metadata')->nullable(); // Additional alert data
            $table->timestamps();
            
            $table->foreign('acknowledged_by')->references('id')->on('users')->onDelete('set null');
            $table->index(['alertable_type', 'alertable_id']);
            $table->index(['is_read', 'priority']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('alerts');
    }
};
