<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\PurchaseOrderController;
use App\Http\Controllers\SuppliersController;
use App\Http\Controllers\RawMaterialController;
use App\Http\Controllers\StockMovementController;
use App\Http\Controllers\BillOfMaterialController;
use App\Http\Controllers\ProductionOrderController;

Route::inertia('/', 'welcome')->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::inertia('dashboard', 'dashboard')->name('dashboard');
    Route::resource('products', ProductController::class) -> except(['show']);
    Route::resource('categories', CategoryController::class) -> except(['show']);
    Route::resource('suppliers', SuppliersController::class) -> except(['show']);
    Route::resource('purchasing', PurchaseOrderController::class)
        ->except(['show'])
        ->parameters(['purchasing' => 'purchaseOrder']);
    Route::post('purchasing/{purchaseOrder}/receive', [PurchaseOrderController::class, 'receive'])
        ->name('purchasing.receive');
    Route::post('purchasing/{purchaseOrder}/mark-as-ordered', [PurchaseOrderController::class, 'markAsOrdered'])
        ->name('purchasing.mark-as-ordered');
    Route::resource('raw-materials', \App\Http\Controllers\RawMaterialController::class)
        ->except(['show'])
        ->parameters(['raw-materials' => 'rawMaterial']);
    Route::resource('bill-of-materials', BillOfMaterialController::class)
        ->except(['show'])
        ->parameters(['bill-of-materials' => 'product']);
    Route::get('inventory', [StockMovementController::class, 'index'])->name('inventory.index');
    Route::get('inventory/history', [StockMovementController::class, 'history'])->name('inventory.history');
    Route::resource('production-orders', ProductionOrderController::class);
});

require __DIR__.'/settings.php';
