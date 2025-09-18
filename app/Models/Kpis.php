<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\MorphMany;
use App\Models\SrapPillar;
use App\Models\Department;
use App\Models\User;
use App\Models\Milestone;
use App\Models\KpiProgress;
use App\Models\Alert;

/**
 * @mixin IdeHelperKpis
 */
class Kpis extends Model
{
    use HasFactory;
    
    protected $table = 'kpis'; // stays the same unless your table name is different

    protected $fillable = [
        'name',
        'code',
        'description',
        'pillar_id',
        'department_id',
        'assigned_to',
        'measurement_type',
        'target_value',
        'current_value',
        'unit',
        'frequency',
        'start_date',
        'end_date',
        'status',
        'priority',
        'weight',
        'metadata',
        'is_active',
        'created_by'
    ];

    protected $casts = [
        'target_value' => 'decimal:2',
        'current_value' => 'decimal:2',
        'weight' => 'decimal:2',
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

    public function assignedUser(): BelongsTo
    {
        return $this->belongsTo(User::class, 'assigned_to');
    }

    public function milestones(): HasMany
    {
        return $this->hasMany(Milestone::class, 'kpi_id');
    }

    public function progress(): HasMany
    {
        return $this->hasMany(KpiProgress::class, 'kpi_id');
    }

    public function alerts(): MorphMany
    {
        return $this->morphMany(Alert::class, 'alertable');
    }

    public function getProgressPercentageAttribute()
    {
        if ($this->target_value == 0) return 0;
        return min(100, round(($this->current_value / $this->target_value) * 100, 2));
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
