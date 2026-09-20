<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class BillOfMaterial extends Model
{
    protected $fillable = [
        'product_id',
        'raw_material_id',
        'quantity_needed',
    ];

    protected $casts = [
        'quantity_needed' => 'decimal:4',
    ];

    public function product()
    {
        return $this->belongsTo(Product::class);
    }

    public function rawMaterial()
    {
        return $this->belongsTo(RawMaterial::class);
    }
}
