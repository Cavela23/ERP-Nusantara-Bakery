<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class RawMaterial extends Model
{
    //
    use HasFactory;

   protected $fillable = [
        'name',
        'sku',
        'unit',
        'price',
        'stock_min',
    ];

    protected $casts = [
        'stock_min' => 'decimal:3',
        'price' => 'decimal:2',
    ];

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
