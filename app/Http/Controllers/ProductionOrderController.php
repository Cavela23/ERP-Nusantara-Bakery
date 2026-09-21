<?php

namespace App\Http\Controllers;

use App\Models\ProductionOrder;
use App\Models\Product;
use App\Models\StockMovement;
use Illuminate\Http\Request;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class ProductionOrderController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(): Response
    {
        //
        return Inertia::render('production-orders/index', [
            'productionOrders' => ProductionOrder::with('product', 'creator')
            ->latest('production_date')
            ->paginate(15),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(): Response
    {
        $products = Product::has('billOfMaterials')
            ->with('billOfMaterials.rawMaterial')
            ->get(['id', 'name', 'sku', 'unit']);

        $products = $products->map(function ($product) {
            return [
                'id' => $product->id,
                'name' => $product->name,
                'sku' => $product->sku,
                'unit' => $product->unit,
                'bill_of_materials' => $product->billOfMaterials->map(fn ($bom) => [
                    'raw_material_name' => $bom->rawMaterial->name,
                    'raw_material_unit' => $bom->rawMaterial->unit,
                    'quantity_needed' => $bom->quantity_needed,
                    'current_stock' => $bom->rawMaterial->current_stock,
                ]),
            ];
        });

        return Inertia::render('production-orders/create', [
            'products' => $products,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request): RedirectResponse
    {
        //
        $validated = $request->validate([
            'product_id' => ['required', 'exists:products,id'],
            'quantity' => ['required', 'numeric', 'min:0.001'],
            'production_date' => ['required', 'date'],
            'notes' => ['nullable', 'string'],
        ]);

        $product = Product::with('billOfMaterials.rawMaterial')->findOrFail($validated['product_id']);

        $insufficientItems = [];

        foreach ($product->billOfMaterials as $bom) {
            $needed = $bom->quantity_needed * $validated['quantity'];
            $available = $bom->rawMaterial->current_stock;

            if ($available < $needed) {
                $insufficientItems[] = sprintf(
                    '%s (butuh %s %s, tersedia %s %s)',
                    $bom->rawMaterial->name,
                    $needed,
                    $bom->rawMaterial->unit,
                    $available,
                    $bom->rawMaterial->unit,
                );
            }
        }

        if (! empty($insufficientItems)) {
            return redirect()->back()->withErrors([
                'stock' => 'Stok bahan baku tidak mencukupi: ' . implode(', ', $insufficientItems),
            ]);
        }

        DB::transaction(function () use ($validated, $product, $request) {
            $productionOrder = ProductionOrder::create([
                'production_number' => $this->generateProductionNumber(),
                'product_id' => $validated['product_id'],
                'quantity' => $validated['quantity'],
                'production_date' => $validated['production_date'],
                'status' => 'completed',
                'notes' => $validated['notes'] ?? null,
                'created_by' => $request->user()->id,
            ]);

            foreach ($product->billOfMaterials as $bom) {
                $bom->rawMaterial->stockMovements()->create([
                    'type' => 'out',
                    'quantity' => $bom->quantity_needed * $validated['quantity'],
                    'reference_type' => 'production_order',
                    'reference_id' => $productionOrder->id,
                    'created_by' => $request->user()->id,
                ]);
            }
            $product->stockMovements()->create([
                'type' => 'in',
                'quantity' => $validated['quantity'],
                'reference_type' => 'production_order',
                'reference_id' => $productionOrder->id,
                'created_by' => $request->user()->id,
            ]);
        });

         return to_route('production-orders.index')->with('success', 'Produksi berhasil dicatat dan stok telah diperbarui.');
    }

    private function generateProductionNumber(): string
    {
        $date = now()->format('Ymd');
        $count = ProductionOrder::whereDate('created_at', now())->count() + 1;

        return "PRD-{$date}-" . str_pad($count, 3, '0', STR_PAD_LEFT);
    }

    /**
     * Display the specified resource.
     */
    public function show(ProductionOrder $productionOrder): Response
    {
        return Inertia::render('production-orders/show', [
            'productionOrder' => $productionOrder->load('product', 'creator'),
            'materialsUsed' => StockMovement::where('reference_type', 'production_order')
                ->where('reference_id', $productionOrder->id)
                ->where('type', 'out')
                ->with('stockable')
                ->get(),
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
