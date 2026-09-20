<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'category_id',
        'sku',
        'price',
        'unit',
        'stock_min',
    ];

    protected $casts = [
        'price' => 'decimal:2',
        'stock_min' => 'decimal:3',
    ];

    public function category()
    {
        return $this->belongsTo(Category::class);
    }

    public function billOfMaterials()
    {
        return $this->hasMany(BillOfMaterial::class);
    }
    
    public function stockMovements()
    {
        return $this->morphMany(StockMovement::class, 'stockable');
    }

    public function getCurrentStockAttribute()
    {
        $in = $this->stockMovements()->where('type', 'in')->sum('quantity');
        $out = $this->stockMovements()->where('type', 'out')->sum('quantity');
        
        return $in - $out;
    }
}