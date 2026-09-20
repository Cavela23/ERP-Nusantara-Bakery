<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class StockMovement extends Model
{
    //
    use hasFactory;

    protected $fillable = [
        'stockable_type',
        'stockable_id',
        'type',
        'quantity',
        'reference_type',
        'reference_id',
        'notes',
        'created_by'
    ];

    protected $casts = [
        'quantity' => 'decimal:3',
    ];
    
    public function stockable()
    {
        return $this->morphTo();
    }

    public function creator()
    {
        return $this->belongsTo(User::class, 'created_by');
    }
}
