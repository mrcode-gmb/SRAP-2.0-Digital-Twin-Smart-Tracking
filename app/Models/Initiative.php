<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

/**
 * @mixin IdeHelperInitiative
 */
class Initiative extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'code',
        'description',
        'pillar_id',
        'department_id',
        'start_date',
        'end_date',
        'status',
        'priority',
        'budget',
        'lead_agency',
        'metadata',
        'is_active',
        'created_by'
    ];

    protected $casts = [
        'budget' => 'decimal:2',
        'metadata' => 'array',
        'is_active' => 'boolean',
        'start_date' => 'date',
        'end_date' => 'date',
    ];

    public function pillar(): BelongsTo
    {
        return $this->belongsTo(SrapPillar::class, 'pillar_id');
    }

    public function department(): BelongsTo
    {
        return $this->belongsTo(Department::class);
    }

    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function kpis(): HasMany
    {
        return $this->hasMany(Kpis::class, 'initiative_id');
    }

    public function activeKpis(): HasMany
    {
        return $this->hasMany(Kpis::class, 'initiative_id')->where('is_active', true);
    }

    public function getProgressPercentageAttribute()
    {
        $totalKpis = $this->kpis()->count();
        if ($totalKpis === 0) return 0;
        
        $completedKpis = $this->kpis()->where('status', 'completed')->count();
        return round(($completedKpis / $totalKpis) * 100, 2);
    }

    public function getStatusColorAttribute()
    {
        return match($this->status) {
            'completed' => 'green',
            'on_track' => 'blue',
            'at_risk' => 'yellow',
            'behind' => 'red',
            default => 'gray'
        };
    }

    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    public function scopeByStatus($query, $status)
    {
        return $query->where('status', $status);
    }

    public function scopeByPriority($query, $priority)
    {
        return $query->where('priority', $priority);
    }
}
