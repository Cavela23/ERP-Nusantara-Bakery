<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Http\RedirectResponse;
use App\Models\Product;
use App\Models\RawMaterial;
use App\Models\StockMovement;
use Inertia\Inertia;
use Inertia\Response;

class StockMovementController extends Controller
{
    //
    public function index(): Response
    {
        return Inertia::render('inventory/index', [
            'rawMaterials' => RawMaterial::all()->map(fn ($rm) => [
                'id' => $rm->id,
                'name' => $rm->name,
                'sku' => $rm->sku,
                'unit' => $rm->unit,
                'stock_min' => $rm->stock_min,
                'current_stock' => $rm->current_stock,
            ]),
            'products' => Product::all()->map(fn ($p) => [
                'id' => $p->id,
                'name' => $p->name,
                'sku' => $p->sku,
                'unit' => $p->unit,
                'stock_min' => $p->stock_min,
                'current_stock' => $p->current_stock,
            ]),
        ]);
    }

    public function history(): Response
    {
        return Inertia::render('inventory/history', [
            'movements' => StockMovement::with(['stockable', 'creator'])
                ->latest()
                ->paginate(20),
        ]);
    }
}
