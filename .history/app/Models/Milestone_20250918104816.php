<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\MorphMany;
use App\Models\Kpis;

// /**
//  * @mixin IdeHelperMilestone
//  */
class Milestone extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'description',
        'kpi_id',
        'due_date',
        'completed_date',
        'status',
        'completion_percentage',
        'notes',
        'deliverables',
        'assigned_to',
        'created_by'
    ];

    protected $casts = [
        'due_date' => 'date',
        'completed_date' => 'date',
        'deliverables' => 'array',
    ];

    public function kpi(): BelongsTo
    {
        return $this->belongsTo(Kpis::class);
    }

    public function assignedUser(): BelongsTo
    {
        return $this->belongsTo(User::class, 'assigned_to');
    }

    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function alerts(): MorphMany
    {
        return $this->morphMany(Alert::class, 'alertable');
    }

    public function getIsOverdueAttribute()
    {
        return $this->due_date < now() && $this->status !== 'completed';
    }

    public function getStatusColorAttribute()
    {
        return match($this->status) {
            'completed' => 'green',
            'in_progress' => 'blue',
            'overdue' => 'red',
            default => 'gray'
        };
    }

    public function scopeOverdue($query)
    {
        return $query->where('due_date', '<', now())
                    ->where('status', '!=', 'completed');
    }

    public function scopeUpcoming($query, $days = 7)
    {
        return $query->whereBetween('due_date', [now(), now()->addDays($days)])
                    ->where('status', '!=', 'completed');
    }
}
