<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\BranchController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\PurchaseOrderController;
use App\Http\Controllers\SuppliersController;
use App\Http\Controllers\RawMaterialController;
use App\Http\Controllers\StockMovementController;
use App\Http\Controllers\BillOfMaterialController;
use App\Http\Controllers\ProductionOrderController;
use App\Http\Controllers\DistributionController;
use App\Http\Controllers\SaleController;

Route::inertia('/', 'welcome')->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', [DashboardController::class, 'index'])->name('dashboard');

    Route::middleware('role:owner')->group(function () {
        Route::resource('products', ProductController::class)->except(['show']);
        Route::resource('categories', CategoryController::class)->except(['show']);
        Route::resource('suppliers', SuppliersController::class)->except(['show']);
        Route::resource('branches', BranchController::class)->except(['show']);
        Route::resource('raw-materials', RawMaterialController::class)
            ->except(['show'])
            ->parameters(['raw-materials' => 'rawMaterial']);
        Route::resource('bill-of-materials', BillOfMaterialController::class)
            ->except(['show'])
            ->parameters(['bill-of-materials' => 'product']);
    });

    Route::middleware('role:purchasing_staff|owner')->group(function () {
        Route::resource('purchasing', PurchaseOrderController::class)
            ->except(['show'])
            ->parameters(['purchasing' => 'purchaseOrder']);
        Route::post('purchasing/{purchaseOrder}/mark-as-ordered', [PurchaseOrderController::class, 'markAsOrdered'])
            ->name('purchasing.mark-as-ordered');
    });

    Route::middleware('role:staff_gudang|owner')->group(function () {
        Route::post('purchasing/{purchaseOrder}/receive', [PurchaseOrderController::class, 'receive'])
            ->name('purchasing.receive');
        Route::resource('distributions', DistributionController::class)->except(['show']);
        Route::post('distributions/{distribution}/mark-as-shipped', [DistributionController::class, 'markAsShipped'])
            ->name('distributions.mark-as-shipped');
        Route::post('distributions/{distribution}/mark-as-received', [DistributionController::class, 'markAsReceived'])
            ->name('distributions.mark-as-received');
        Route::get('inventory', [StockMovementController::class, 'index'])->name('inventory.index');
        Route::get('inventory/history', [StockMovementController::class, 'history'])->name('inventory.history');
    });

    Route::middleware('role:kepala_produksi|owner')->group(function () {
        Route::resource('production-orders', ProductionOrderController::class);
    });

    Route::middleware('role:kasir|owner')->group(function () {
        Route::resource('sales', SaleController::class)->only(['index', 'create', 'store']);
    });
});

require __DIR__.'/settings.php';
