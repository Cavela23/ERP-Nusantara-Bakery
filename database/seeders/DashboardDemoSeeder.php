<?php

namespace Database\Seeders;

use App\Models\Branch;
use App\Models\Distribution;
use App\Models\Product;
use App\Models\ProductionOrder;
use App\Models\User;
use Illuminate\Database\Seeder;

class DashboardDemoSeeder extends Seeder
{
    public function run(): void
    {
        $user = User::where('email', 'test@example.com')->first()
            ?? User::factory()->create([
                'name' => 'Test User',
                'email' => 'test@example.com',
            ]);
        $product = Product::query()->orderBy('id')->first()
            ?? Product::factory()->create();
        $branch = Branch::firstOrCreate(
            ['name' => 'Cabang Demo'],
            ['address' => 'Lokasi data demo'],
        );

        $productionOrder = ProductionOrder::firstOrCreate(
            ['production_number' => 'DEMO-PRD-001'],
            [
                'product_id' => $product->id,
                'quantity' => 20,
                'production_date' => today(),
                'status' => 'completed',
                'notes' => 'Data demo dashboard',
                'created_by' => $user->id,
            ],
        );

        $product->stockMovements()->firstOrCreate(
            [
                'type' => 'in',
                'branch_id' => null,
                'reference_type' => 'production_order',
                'reference_id' => $productionOrder->id,
            ],
            [
                'quantity' => $productionOrder->quantity,
                'created_by' => $user->id,
                'notes' => 'Stok hasil produksi demo',
            ],
        );

        $shippedDistribution = Distribution::firstOrCreate(
            ['distribution_number' => 'DEMO-DIST-001'],
            [
                'branch_id' => $branch->id,
                'distribution_date' => today(),
                'status' => 'shipped',
                'notes' => 'Distribusi demo yang sudah dikirim',
                'created_by' => $user->id,
            ],
        );
        $shippedItem = $shippedDistribution->items()->firstOrCreate(
            ['product_id' => $product->id],
            ['quantity' => 6],
        );

        $product->stockMovements()->firstOrCreate(
            [
                'type' => 'out',
                'branch_id' => null,
                'reference_type' => 'distribution',
                'reference_id' => $shippedDistribution->id,
            ],
            [
                'quantity' => $shippedItem->quantity,
                'created_by' => $user->id,
                'notes' => 'Stok keluar warehouse untuk demo',
            ],
        );
        $product->stockMovements()->firstOrCreate(
            [
                'type' => 'in',
                'branch_id' => $branch->id,
                'reference_type' => 'distribution',
                'reference_id' => $shippedDistribution->id,
            ],
            [
                'quantity' => $shippedItem->quantity,
                'created_by' => $user->id,
                'notes' => 'Stok masuk cabang untuk demo',
            ],
        );

        $pendingDistribution = Distribution::firstOrCreate(
            ['distribution_number' => 'DEMO-DIST-002'],
            [
                'branch_id' => $branch->id,
                'distribution_date' => today(),
                'status' => 'pending',
                'notes' => 'Distribusi demo yang menunggu pengiriman',
                'created_by' => $user->id,
            ],
        );
        $pendingDistribution->items()->firstOrCreate(
            ['product_id' => $product->id],
            ['quantity' => 4],
        );
    }
}