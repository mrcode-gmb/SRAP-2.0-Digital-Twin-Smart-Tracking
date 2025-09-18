<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use App\Models\Kpis;

/**
 * @mixin IdeHelperSrapPillar
 */
class SrapPillar extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'code',
        'description',
        'color',
        'icon',
        'target_completion_date',
        'order_index',
        'weight',
        'priority_level',
        'is_active'
    ];

    protected $casts = [
        'weight' => 'decimal:2',
        'is_active' => 'boolean',
    ];

    public function kpis(): HasMany
    {
        return $this->hasMany(Kpis::class, 'pillar_id');
    }

    public function activeKpis(): HasMany
    {
        return $this->hasMany(Kpis::class, 'pillar_id')->where('is_active', true);
    }

    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    public function scopeOrdered($query)
    {
        return $query->orderBy('order_index');
    }

    public function getProgressPercentageAttribute()
    {
        $totalKpis = $this->kpis()->count();
        if ($totalKpis === 0) return 0;
        
        $completedKpis = $this->kpis()->where('status', 'completed')->count();
        return round(($completedKpis / $totalKpis) * 100, 2);
    }
}
