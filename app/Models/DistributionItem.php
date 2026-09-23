<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class DistributionItem extends Model
{
    use HasFactory;

    protected $fillable = [
        'distribution_id',
        'product_id',
        'quantity',
    ];

    protected $casts = [
        'quantity' => 'decimal:3',
    ];

    public function distribution()
    {
        return $this->belongsTo(Distribution::class);
    }

    public function product()
    {
        return $this->belongsTo(Product::class);
    }
}
