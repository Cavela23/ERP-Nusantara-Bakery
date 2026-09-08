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
        Schema::create('categories', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->timestamps();
        });

        Schema::create('products', function (Blueprint $table) {
            $table->id();
        $table->string('name');
        $table->foreignId('category_id')->constrained('categories');
        $table->string('sku')->unique();
        $table->decimal('price', 12, 2);
        $table->string('unit')->default('pcs');
        $table->decimal('stock_min', 12, 3)->default(0);
        $table->timestamps();
        });
    }


    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('products', function (Blueprint $table) {
            $table->dropForeign(['category_id']);
            $table->dropUnique('products_sku_unique');
            $table->dropColumn([
                'name',
                'category_id',
                'sku',
                'price',
                'unit',
                'stock_min',
            ]);
        });

        Schema::dropIfExists('categories');
    }
};
