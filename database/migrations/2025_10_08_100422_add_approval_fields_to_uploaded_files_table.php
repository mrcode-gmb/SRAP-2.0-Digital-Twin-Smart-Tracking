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
        Schema::table('uploaded_files', function (Blueprint $table) {
            $table->unsignedBigInteger('approved_by')->nullable()->after('processed_at');
            $table->timestamp('approved_at')->nullable()->after('approved_by');
            $table->unsignedBigInteger('rejected_by')->nullable()->after('approved_at');
            $table->timestamp('rejected_at')->nullable()->after('rejected_by');
            $table->text('rejection_reason')->nullable()->after('rejected_at');
            
            $table->foreign('approved_by')->references('id')->on('users')->onDelete('set null');
            $table->foreign('rejected_by')->references('id')->on('users')->onDelete('set null');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('uploaded_files', function (Blueprint $table) {
            $table->dropForeign(['approved_by']);
            $table->dropForeign(['rejected_by']);
            $table->dropColumn(['approved_by', 'approved_at', 'rejected_by', 'rejected_at', 'rejection_reason']);
        });
    }
};
