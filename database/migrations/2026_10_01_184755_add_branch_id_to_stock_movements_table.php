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
        if (! Schema::hasColumn('stock_movements', 'branch_id')) {
            Schema::table('stock_movements', function (Blueprint $table) {
                $table->foreignId('branch_id')->nullable()->after('stockable_id')->constrained('branches');
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        if (Schema::hasColumn('stock_movements', 'branch_id')) {
            Schema::table('stock_movements', function (Blueprint $table) {
                $table->dropForeign(['branch_id']);
                $table->dropColumn('branch_id');
            });
        }
    }
};
