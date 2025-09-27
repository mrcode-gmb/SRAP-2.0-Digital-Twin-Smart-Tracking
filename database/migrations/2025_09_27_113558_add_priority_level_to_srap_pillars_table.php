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
            $table->enum('priority_level', ['low', 'medium', 'high', 'critical'])
                  ->default('medium')
                  ->after('responsible_department');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('srap_pillars', function (Blueprint $table) {
            $table->dropColumn('priority_level');
        });
    }
};
