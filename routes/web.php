<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\PurchaseOrderController;
use App\Http\Controllers\SuppliersController;

Route::inertia('/', 'welcome')->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::inertia('dashboard', 'dashboard')->name('dashboard');
    Route::resource('products', ProductController::class) -> except(['show']);
    Route::resource('categories', CategoryController::class) -> except(['show']);
    Route::resource('suppliers', SuppliersController::class) -> except(['show']);
    Route::resource('purchasing', PurchaseOrderController::class)
        ->except(['show'])
        ->parameters(['purchasing' => 'purchaseOrder']);
    Route::resource('raw-materials', \App\Http\Controllers\RawMaterialController::class)
        ->except(['show'])
        ->parameters(['raw-materials' => 'rawMaterial']);
});

require __DIR__.'/settings.php';
