<?php

namespace Tests\Feature;

use App\Models\BillOfMaterial;
use App\Models\Branch;
use App\Models\Distribution;
use App\Models\Product;
use App\Models\RawMaterial;
use App\Models\User;
use Illuminate\Foundation\Testing\DatabaseTransactions;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class BranchStockFlowTest extends TestCase
{
    use DatabaseTransactions;

    public function test_production_distribution_and_sales_use_warehouse_and_branch_stock(): void
    {
        $user = User::factory()->create();
        $this->actingAs($user);

        $branch = Branch::create(['name' => 'Cabang Tujuan']);
        $otherBranch = Branch::create(['name' => 'Cabang Kosong']);
        $product = Product::factory()->create();
        $rawMaterial = RawMaterial::factory()->create();

        BillOfMaterial::create([
            'product_id' => $product->id,
            'raw_material_id' => $rawMaterial->id,
            'quantity_needed' => 0.5,
        ]);

        $rawMaterial->stockMovements()->create([
            'type' => 'in',
            'quantity' => 10,
            'branch_id' => null,
            'created_by' => $user->id,
        ]);

        $this->post(route('production-orders.store'), [
            'product_id' => $product->id,
            'quantity' => 10,
            'production_date' => today()->toDateString(),
        ])->assertRedirect(route('production-orders.index'));

        $this->post(route('distributions.store'), [
            'branch_id' => $branch->id,
            'distribution_date' => today()->toDateString(),
            'items' => [[
                'product_id' => $product->id,
                'quantity' => 6,
            ]],
        ])->assertRedirect(route('distributions.index'));

        $distribution = Distribution::query()->latest('id')->firstOrFail();

        $this->post(route('distributions.mark-as-shipped', $distribution))
            ->assertRedirect(route('distributions.index'));

        $this->assertSame(4.0, (float) $product->stockMovements()
            ->whereNull('branch_id')
            ->where('type', 'in')
            ->sum('quantity') - (float) $product->stockMovements()
            ->whereNull('branch_id')
            ->where('type', 'out')
            ->sum('quantity'));
        $this->assertSame(6.0, (float) $product->currentStockAtBranch($branch->id));
        $this->assertSame(0.0, (float) $product->currentStockAtBranch($otherBranch->id));
        $productIndex = Product::query()->where('id', '<', $product->id)->count();

        $this->get(route('sales.create'))
            ->assertInertia(fn (Assert $page) => $page
                ->component('sales/create')
                ->where("products.{$productIndex}.stock_by_branch.{$branch->id}", 6));

        $this->get(route('inventory.index'))
            ->assertInertia(fn (Assert $page) => $page
                ->component('inventory/index')
                ->where("products.{$productIndex}.current_stock", 4));

        $this->post(route('sales.store'), [
            'branch_id' => $branch->id,
            'sale_date' => today()->toDateString(),
            'items' => [[
                'product_id' => $product->id,
                'quantity' => 5,
                'unit_price' => 10000,
            ]],
        ])->assertRedirect(route('sales.index'));

        $this->assertSame(1.0, (float) $product->currentStockAtBranch($branch->id));

        $this->from(route('sales.create'))
            ->post(route('sales.store'), [
                'branch_id' => $otherBranch->id,
                'sale_date' => today()->toDateString(),
                'items' => [[
                    'product_id' => $product->id,
                    'quantity' => 1,
                    'unit_price' => 10000,
                ]],
            ])
            ->assertSessionHasErrors('stock');
    }
}