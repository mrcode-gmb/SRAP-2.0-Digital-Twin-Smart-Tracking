<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use App\Models\Kpis;

/**
 * @mixin IdeHelperKpiProgress
 */
class KpiProgress extends Model
{
    use HasFactory;

    protected $table = 'kpi_progress';

    protected $fillable = [
        'kpi_id',
        'value',
        'percentage',
        'reporting_date',
        'entry_type',
        'notes',
        'source',
        'metadata',
        'reported_by',
        'verified_at',
        'verified_by',
        'verification_status',
        'rejection_reason'
    ];

    protected $casts = [
        'value' => 'decimal:2',
        'percentage' => 'decimal:2',
        'reporting_date' => 'date',
        'metadata' => 'array',
        'verified_at' => 'datetime',
    ];

    public function kpi(): BelongsTo
    {
        return $this->belongsTo(Kpis::class, 'kpi_id');
    }

    public function reporter(): BelongsTo
    {
        return $this->belongsTo(User::class, 'reported_by');
    }

    public function verifier(): BelongsTo
    {
        return $this->belongsTo(User::class, 'verified_by');
    }

    public function getIsVerifiedAttribute()
    {
        return !is_null($this->verified_at);
    }

    public function scopeVerified($query)
    {
        return $query->whereNotNull('verified_at');
    }

    public function scopeUnverified($query)
    {
        return $query->whereNull('verified_at');
    }

    public function scopeByDateRange($query, $start, $end)
    {
        return $query->whereBetween('reporting_date', [$start, $end]);
    }

    public function scopePending($query)
    {
        return $query->where('verification_status', 'pending');
    }

    public function scopeRejected($query)
    {
        return $query->where('verification_status', 'rejected');
    }

    public function reportedBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'reported_by');
    }
}
