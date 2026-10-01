<?php

namespace App\Http\Controllers;

use App\Models\Branch;
use App\Models\Product;
use App\Models\Sale;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Http\RedirectResponse;

class SaleController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(): Response
    {
        return Inertia::render('sales/index', [
            'sales' => Sale::with(['branch:id,name', 'creator:id,name'])
                ->latest('sale_date')
                ->latest('id')
                ->paginate(15),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(): Response
    {
        $branches = Branch::all(['id', 'name']);
        $products = Product::all(['id', 'name', 'sku', 'price', 'unit'])
            ->map(function (Product $product) use ($branches) {
                $stockByBranch = [];

                foreach ($branches as $branch) {
                    $stockByBranch[$branch->id] = $product->currentStockAtBranch($branch->id);
                }

                return [
                'id' => $product->id,
                'name' => $product->name,
                'sku' => $product->sku,
                'price' => $product->price,
                'unit' => $product->unit,
                    'stock_by_branch' => $stockByBranch,
                ];
            });

        return Inertia::render('sales/create', [
            'branches' => $branches,
            'products' => $products,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'branch_id' => ['required', 'exists:branches,id'],
            'sale_date' => ['required', 'date'],
            'items' => ['required', 'array', 'min:1'],
            'items.*.product_id' => ['required', 'exists:products,id'],
            'items.*.quantity' => ['required', 'numeric', 'min:0.001'],
            'items.*.unit_price' => ['required', 'numeric', 'min:0'],
        ]);

        $products = Product::whereIn(
            'id',
            collect($validated['items'])->pluck('product_id')->unique(),
        )->get()->keyBy('id');

        $insufficientItems = [];
        $requestedByProduct = collect($validated['items'])->groupBy('product_id');

        foreach ($requestedByProduct as $productId => $items) {
            $product = $products->get($productId);
            $requestedQuantity = $items->sum('quantity');
            $availableQuantity = $product->currentStockAtBranch($validated['branch_id']);

            if ($availableQuantity < $requestedQuantity) {
                $insufficientItems[] = sprintf(
                    '%s (butuh %s, tersedia %s di cabang ini)',
                    $product->name,
                    $requestedQuantity,
                    $availableQuantity,
                );
            }
        }

        if (! empty($insufficientItems)) {
            return redirect()->back()->withErrors([
                'stock' => 'Stok produk di cabang tidak mencukupi: ' . implode(', ', $insufficientItems),
            ]);
        }

        DB::transaction(function () use ($validated, $request, $products) {
            $totalAmount = collect($validated['items'])
                ->sum(fn ($item) => $item['quantity'] * $item['unit_price']);

            $sale = Sale::create([
                'sale_number' => $this->generateSaleNumber(),
                'branch_id' => $validated['branch_id'],
                'sale_date' => $validated['sale_date'],
                'total_amount' => $totalAmount,
                'created_by' => $request->user()->id,
            ]);

            foreach ($validated['items'] as $item) {
                $sale->items()->create([
                    'product_id' => $item['product_id'],
                    'quantity' => $item['quantity'],
                    'unit_price' => $item['unit_price'],
                    'subtotal' => $item['quantity'] * $item['unit_price'],
                ]);

                $products->get($item['product_id'])->stockMovements()->create([
                    'type' => 'out',
                    'quantity' => $item['quantity'],
                    'branch_id' => $validated['branch_id'],
                    'reference_type' => 'sale',
                    'reference_id' => $sale->id,
                    'created_by' => $request->user()->id,
                ]);
            }
        });

        return to_route('sales.index')->with('success', 'Transaksi berhasil dicatat dan stok cabang telah diperbarui.');
    }

    private function generateSaleNumber(): string
    {
        $date = now()->format('Ymd');
        $count = Sale::whereDate('created_at', now())->count() + 1;

        return 'SALE-' . $date . '-' . str_pad($count, 3, '0', STR_PAD_LEFT);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
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
