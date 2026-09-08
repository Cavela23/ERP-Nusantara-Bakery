<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (Schema::hasColumn('purchase_order_items', 'product_id')) {
            Schema::table('purchase_order_items', function (Blueprint $table) {
                $table->dropForeign(['product_id']);
                $table->dropColumn('product_id');
                $table->foreignId('raw_material_id')->after('purchase_order_id')->constrained('raw_materials');
            });
        }
    }

    public function down(): void
    {
        if (Schema::hasColumn('purchase_order_items', 'raw_material_id')) {
            Schema::table('purchase_order_items', function (Blueprint $table) {
                $table->dropForeign(['raw_material_id']);
                $table->dropColumn('raw_material_id');
                $table->foreignId('product_id')->after('purchase_order_id')->constrained('products');
            });
        }
    }
};
