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
        Schema::create('chatbot_conversations', function (Blueprint $table) {
            $table->id();
            $table->string('session_id');
            $table->unsignedBigInteger('user_id')->nullable();
            $table->text('user_message')->nullable();
            $table->text('bot_response')->nullable();
            $table->string('intent')->nullable(); // Detected user intent
            $table->json('entities')->nullable(); // Extracted entities (KPI names, dates, etc.)
            $table->decimal('confidence_score', 5, 2)->nullable();
            $table->string('response_type')->default('text'); // 'text', 'chart', 'table', 'file'
            $table->json('context')->nullable(); // Conversation context
            $table->boolean('is_helpful')->nullable(); // User feedback
            $table->text('feedback')->nullable();
            $table->string('ip_address')->nullable();
            $table->timestamps();
            
            $table->foreign('user_id')->references('id')->on('users')->onDelete('set null');
            $table->index(['session_id', 'created_at']);
            $table->index(['user_id', 'created_at']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('chatbot_conversations');
    }
};
