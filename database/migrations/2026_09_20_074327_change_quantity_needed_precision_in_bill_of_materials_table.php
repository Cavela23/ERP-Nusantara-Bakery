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
        Schema::table('bill_of_materials', function (Blueprint $table) {
            $table->decimal('quantity_needed', 12, 4)->change();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('bill_of_materials', function (Blueprint $table) {
            $table->decimal('quantity_needed', 12, 3)->change();
        });
    }
};
