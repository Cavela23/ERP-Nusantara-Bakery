<?php

namespace App\Http\Controllers;

use App\Models\BillOfMaterial;
use App\Models\Product;
use App\Models\RawMaterial;
use Illuminate\Http\Request;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class BillOfMaterialController extends Controller
{
    public function index(): Response
    {
        $products = Product::with('billOfMaterials')->get()->map(fn ($product) => [
            'id' => $product->id,
            'name' => $product->name,
            'sku' => $product->sku,
            'items_count' => $product->billOfMaterials->count(),
        ]);

        return Inertia::render('bill-of-materials/index', [
            'products' => $products,
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('bill-of-materials/create', [
            'products' => Product::whereDoesntHave('billOfMaterials')->get(['id', 'name', 'sku']),
            'rawMaterials' => RawMaterial::all(['id', 'name', 'sku', 'unit']),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'product_id' => ['required', 'exists:products,id'],
            'items' => ['required', 'array', 'min:1'],
            'items.*.raw_material_id' => ['required', 'exists:raw_materials,id', 'distinct'],
            'items.*.quantity_needed' => ['required', 'numeric', 'min:0.001'],
        ]);

        DB::transaction(function () use ($validated) {
            foreach ($validated['items'] as $item) {
                BillOfMaterial::create([
                    'product_id' => $validated['product_id'],
                    'raw_material_id' => $item['raw_material_id'],
                    'quantity_needed' => $item['quantity_needed'],
                ]);
            }
        });

        return to_route('bill-of-materials.index');
    }

    public function edit(Product $product): Response
    {
        return Inertia::render('bill-of-materials/edit', [
            'product' => $product->only('id', 'name', 'sku'),
            'items' => $product->billOfMaterials()->with('rawMaterial:id,name,sku,unit')->get(),
            'rawMaterials' => RawMaterial::all(['id', 'name', 'sku', 'unit']),
        ]);
    }

    public function update(Request $request, Product $product): RedirectResponse
    {
        $validated = $request->validate([
            'items' => ['required', 'array', 'min:1'],
            'items.*.raw_material_id' => ['required', 'exists:raw_materials,id', 'distinct'],
            'items.*.quantity_needed' => ['required', 'numeric', 'min:0.001'],
        ]);

        DB::transaction(function () use ($validated, $product) {
            $product->billOfMaterials()->delete();

            foreach ($validated['items'] as $item) {
                $product->billOfMaterials()->create([
                    'raw_material_id' => $item['raw_material_id'],
                    'quantity_needed' => $item['quantity_needed'],
                ]);
            }
        });

        return to_route('bill-of-materials.index');
    }

    public function destroy(Product $product): RedirectResponse
    {
        $product->billOfMaterials()->delete();

        return to_route('bill-of-materials.index');
    }
}