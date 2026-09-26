<?php

namespace App\Http\Controllers;

use App\Models\Branch;
use App\Models\Distribution;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class DistributionController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(): Response
    {
        return Inertia::render('distributions/index', [
            'distributions' => Distribution::with('branch', 'creator')
                ->latest('distribution_date')
                ->paginate(15),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(): Response
    {
        $products = Product::all(['id', 'name', 'sku', 'unit'])
            ->map(fn ($product) => [
                'id' => $product->id,
                'name' => $product->name,
                'sku' => $product->sku,
                'unit' => $product->unit,
                'current_stock' => $product->current_stock,
            ]);

        return Inertia::render('distributions/create', [
            'branches' => Branch::all(['id', 'name']),
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
            'distribution_date' => ['required', 'date'],
            'notes' => ['nullable', 'string'],
            'items' => ['required', 'array', 'min:1'],
            'items.*.product_id' => ['required', 'exists:products,id'],
            'items.*.quantity' => ['required', 'numeric', 'min:0.001'],
        ]);

        DB::transaction(function () use ($validated, $request) {
            $distribution = Distribution::create([
                'distribution_number' => $this->generateDistributionNumber(),
                'branch_id' => $validated['branch_id'],
                'distribution_date' => $validated['distribution_date'],
                'status' => 'pending',
                'notes' => $validated['notes'] ?? null,
                'created_by' => $request->user()->id,
            ]);

            foreach ($validated['items'] as $item) {
                $distribution->items()->create([
                    'product_id' => $item['product_id'],
                    'quantity' => $item['quantity'],
                ]);
            }
        });

        return to_route('distributions.index');
    }

    public function markAsShipped(Distribution $distribution): RedirectResponse
    {
        if ($distribution->status !== 'pending') {
            abort(400, 'Distribusi hanya bisa dikirim jika berstatus pending.');
        }

        $distribution->load('items.product');

        $insufficientItems = [];

        foreach ($distribution->items as $item) {
            if ($item->product->current_stock < $item->quantity) {
                $insufficientItems[] = sprintf(
                    '%s (butuh %s, tersedia %s)',
                    $item->product->name,
                    $item->quantity,
                    $item->product->current_stock,
                );
            }
        }

        if (! empty($insufficientItems)) {
            return redirect()->back()->withErrors([
                'stock' => 'Stok produk tidak mencukupi: ' . implode(', ', $insufficientItems),
            ]);
        }

        DB::transaction(function () use ($distribution) {
            foreach ($distribution->items as $item) {
                $item->product->stockMovements()->create([
                    'type' => 'out',
                    'quantity' => $item->quantity,
                    'reference_type' => 'distribution',
                    'reference_id' => $distribution->id,
                    'created_by' => auth()->id(),
                ]);
            }

            $distribution->update(['status' => 'shipped']);
        });

        return to_route('distributions.index')->with(
            'success',
            'Distribusi telah ditandai dikirim dan stok produk telah diperbarui.',
        );
    }

    public function markAsReceived(Distribution $distribution): RedirectResponse
    {
        if ($distribution->status !== 'shipped') {
            abort(400, 'Distribusi harus berstatus shipped untuk bisa dikonfirmasi diterima.');
        }

        $distribution->update(['status' => 'received']);

        return to_route('distributions.index')->with(
            'success',
            'Distribusi telah dikonfirmasi diterima.',
        );
    }

    private function generateDistributionNumber(): string
    {
        $date = now()->format('Ymd');
        $count = Distribution::whereDate('created_at', now())->count() + 1;

        return 'DIST-' . $date . '-' . str_pad($count, 3, '0', STR_PAD_LEFT);
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
