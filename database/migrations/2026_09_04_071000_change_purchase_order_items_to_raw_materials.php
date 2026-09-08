<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('purchase_order_items', function (Blueprint $table) {
            $table->dropForeign(['product_id']);
            $table->renameColumn('product_id', 'raw_material_id');
        });

        Schema::table('purchase_order_items', function (Blueprint $table) {
            $table->foreign('raw_material_id')
                ->references('id')
                ->on('raw_materials');
        });
    }

    public function down(): void
    {
        Schema::table('purchase_order_items', function (Blueprint $table) {
            $table->dropForeign(['raw_material_id']);
            $table->renameColumn('raw_material_id', 'product_id');
        });

        Schema::table('purchase_order_items', function (Blueprint $table) {
            $table->foreign('product_id')
                ->references('id')
                ->on('products');
        });
    }
};
