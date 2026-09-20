<?php

namespace App\Http\Controllers;

use App\Models\PurchaseOrder;
use App\Models\PurchaseOrderItem;
use App\Models\RawMaterial;
use App\Models\Supplier;
use Illuminate\Http\Request;
use Illuminate\Http\RedirectResponse;
use Illuminate\Validation\Rule;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class PurchaseOrderController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
        return Inertia::render('purchasing/index', [
            'purchaseOrders' => PurchaseOrder::with('supplier')->latest('order_date')->paginate(15),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
        return Inertia::render('purchasing/create', [
            'suppliers' => Supplier::all(['id', 'name']),
            'rawMaterials' => RawMaterial::all(['id', 'name', 'sku', 'price', 'unit']),
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
        $validated = $request -> validate([
            'supplier_id' => ['required', 'exists:suppliers,id'],
            'order_date' => ['required', 'date'],
            'expected_date' => ['nullable', 'date', 'after_or_equal:order_date'],
            'notes' => ['nullable', 'string'],
            'items' => ['required', 'array', 'min:1'],
            'items.*.raw_material_id' => ['required', 'exists:raw_materials,id'],
            'items.*.quantity' => ['required', 'numeric', 'min:0.001'],
            'items.*.unit_price' => ['required', 'numeric', 'min:0'],
        ]);

        DB::transaction(function () use ($validated, $request) {
            $totalAmount = collect($validated['items'])
                ->sum(fn ($item) => $item['quantity'] * $item['unit_price']);

            $po = PurchaseOrder::create([
                'po_number' => $this->generatePoNumber(),
                'supplier_id' => $validated['supplier_id'],
                'order_date' => $validated['order_date'],
                'expected_date' => $validated['expected_date'] ?? null,
                'status' => 'draft',
                'notes' => $validated['notes'] ?? null,
                'total_amount' => $totalAmount,
                'created_by' => $request->user()->id,
            ]);

            foreach ($validated['items'] as $item) {
                $po->items()->create([
                    'raw_material_id' => $item['raw_material_id'],
                    'quantity' => $item['quantity'],
                    'unit_price' => $item['unit_price'],
                    'subtotal' => $item['quantity'] * $item['unit_price'],
                ]);
            }
        });

        return to_route('purchasing.index');
    }

    public function markAsOrdered(PurchaseOrder $purchaseOrder): RedirectResponse
    {
        if ($purchaseOrder->status !== 'draft') {
            abort(400, 'Hanya PO berstatus draft yang bisa ditandai sebagai dipesan.');
        }

        $purchaseOrder->update(['status' => 'ordered']);

        return to_route('purchasing.index')->with(
            'success',
            'PO telah ditandai sebagai dipesan.',
        );
    }

    public function receive(PurchaseOrder $purchaseOrder): RedirectResponse
    {
        if ($purchaseOrder->status !== 'ordered') {
            abort(400, 'PO harus berstatus ordered untuk bisa diterima.');
        }

        DB::transaction(function () use ($purchaseOrder) {
            $purchaseOrder->load('items.rawMaterial');

            foreach ($purchaseOrder->items as $item) {
                $item->rawMaterial->stockMovements()->create([
                    'type' => 'in',
                    'quantity' => $item->quantity,
                    'reference_type' => 'purchase_order',
                    'reference_id' => $purchaseOrder->id,
                    'created_by' => auth()->id(),
                ]);
            }

            $purchaseOrder->update(['status' => 'received']);
        });

        return to_route('purchasing.index')->with(
            'success',
            'Barang berhasil diterima dan stok telah diperbarui.',
        );
    }

    private function generatePoNumber(): string
    {
        $date = now()->format('Ymd');
        $count = PurchaseOrder::whereDate('created_at', now())->count() + 1;

        return "PO-{$date}-" . str_pad($count, 3, '0', STR_PAD_LEFT);
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
    public function edit(PurchaseOrder $purchaseOrder): Response
    {
        return Inertia::render('purchasing/edit', [
            'purchaseOrder' => $purchaseOrder->load('items'),
            'suppliers' => Supplier::all(['id', 'name']),
            'rawMaterials' => RawMaterial::all(['id', 'name', 'sku', 'price', 'unit']),
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, PurchaseOrder $purchaseOrder): RedirectResponse
    {
        if ($purchaseOrder->status === 'received') {
            abort(403, 'PO yang sudah diterima tidak dapat diubah.');
        }

        $validated = $request->validate([
            'supplier_id' => ['required', 'exists:suppliers,id'],
            'order_date' => ['required', 'date'],
            'expected_date' => ['nullable', 'date', 'after_or_equal:order_date'],
            'notes' => ['nullable', 'string'],
            'items' => ['required', 'array', 'min:1'],
            'items.*.raw_material_id' => ['required', 'exists:raw_materials,id'],
            'items.*.quantity' => ['required', 'numeric', 'min:0.001'],
            'items.*.unit_price' => ['required', 'numeric', 'min:0'],
        ]);

        DB::transaction(function () use ($validated, $purchaseOrder) {
            $totalAmount = collect($validated['items'])
                ->sum(fn ($item) => $item['quantity'] * $item['unit_price']);

            $purchaseOrder->update([
                'supplier_id' => $validated['supplier_id'],
                'order_date' => $validated['order_date'],
                'expected_date' => $validated['expected_date'] ?? null,
                'notes' => $validated['notes'] ?? null,
                'total_amount' => $totalAmount,
            ]);

            $purchaseOrder->items()->delete();

            foreach ($validated['items'] as $item) {
                $purchaseOrder->items()->create([
                    'raw_material_id' => $item['raw_material_id'],
                    'quantity' => $item['quantity'],
                    'unit_price' => $item['unit_price'],
                    'subtotal' => $item['quantity'] * $item['unit_price'],
                ]);
            }
        });

        return to_route('purchasing.index');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(PurchaseOrder $purchaseOrder): RedirectResponse
    {
        if ($purchaseOrder->status === 'received') {
            abort(403, 'PO yang sudah diterima tidak dapat dihapus.');
        }

        $purchaseOrder->delete();

        return to_route('purchasing.index');
    }
}
