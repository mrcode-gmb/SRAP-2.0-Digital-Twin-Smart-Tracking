<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * @mixin IdeHelperReport
 */
class Report extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'description',
        'type',
        'format',
        'period',
        'start_date',
        'end_date',
        'status',
        'file_path',
        'pdf_path',
        'excel_path',
        'filters',
        'metadata',
        'generated_by',
        'generated_at',
        'download_count'
    ];

    protected $casts = [
        'start_date' => 'date',
        'end_date' => 'date',
        'filters' => 'array',
        'metadata' => 'array',
        'generated_at' => 'datetime',
    ];

    public function generator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'generated_by');
    }

    public function getIsReadyAttribute()
    {
        return $this->status === 'completed';
    }

    public function getStatusColorAttribute()
    {
        return match($this->status) {
            'completed' => 'green',
            'generating' => 'blue',
            'failed' => 'red',
            default => 'gray'
        };
    }

    public function scopeCompleted($query)
    {
        return $query->where('status', 'completed');
    }

    public function scopeByType($query, $type)
    {
        return $query->where('type', $type);
    }

    public function scopeByPeriod($query, $start, $end)
    {
        return $query->whereBetween('period_start', [$start, $end]);
    }
}
