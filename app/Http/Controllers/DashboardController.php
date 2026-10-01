<?php

namespace App\Http\Controllers;

use App\Models\Distribution;
use App\Models\Product;
use App\Models\ProductionOrder;
use App\Models\RawMaterial;
use App\Models\Sale;
use App\Models\SaleItem;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function index(): Response
    {
        $now = now();
        $salesThisMonth = Sale::query()
            ->whereMonth('sale_date', $now->month)
            ->whereYear('sale_date', $now->year);

        $lowStockAlerts = RawMaterial::all()
            ->map(fn (RawMaterial $material) => $this->makeStockAlert($material, 'bahan_baku'))
            ->concat(Product::all()->map(fn (Product $product) => $this->makeStockAlert($product, 'produk_jadi')))
            ->filter(fn (array $alert) => $alert['current_stock'] <= $alert['stock_min'])
            ->sortBy('severity')
            ->take(10)
            ->map(function (array $alert): array {
                unset($alert['severity']);

                return $alert;
            })
            ->values();

        return Inertia::render('dashboard', [
            'metrics' => [
                'revenueToday' => (float) Sale::query()
                    ->whereDate('sale_date', today())
                    ->sum('total_amount'),
                'revenueThisMonth' => (float) (clone $salesThisMonth)->sum('total_amount'),
                'transactionsThisMonth' => (clone $salesThisMonth)->count(),
                'quantitySoldThisMonth' => (float) SaleItem::query()
                    ->whereHas('sale', fn ($query) => $query
                        ->whereMonth('sale_date', $now->month)
                        ->whereYear('sale_date', $now->year))
                    ->sum('quantity'),
            ],
            'bestsellingProducts' => SaleItem::query()
                ->whereHas('sale', fn ($query) => $query
                    ->whereMonth('sale_date', $now->month)
                    ->whereYear('sale_date', $now->year))
                ->selectRaw('product_id, SUM(quantity) as total_qty')
                ->groupBy('product_id')
                ->orderByDesc('total_qty')
                ->limit(5)
                ->with('product:id,name,unit')
                ->get(),
            'lowStockAlerts' => $lowStockAlerts,
            'recentProductionOrders' => ProductionOrder::with('product:id,name,unit')
                ->latest()
                ->limit(5)
                ->get(),
            'activeDistributions' => Distribution::with('branch:id,name')
                ->whereIn('status', ['pending', 'shipped'])
                ->latest()
                ->limit(5)
                ->get(),
        ]);
    }

    /** @return array{name: string, current_stock: float, stock_min: float, unit: string|null, jenis: string, severity: float} */
    private function makeStockAlert(RawMaterial|Product $item, string $type): array
    {
        $currentStock = (float) $item->current_stock;
        $stockMin = (float) $item->stock_min;

        return [
            'name' => $item->name,
            'current_stock' => $currentStock,
            'stock_min' => $stockMin,
            'unit' => $item->unit,
            'jenis' => $type,
            'severity' => $stockMin > 0 ? $currentStock / $stockMin : $currentStock,
        ];
    }
}
