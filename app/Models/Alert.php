<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\MorphTo;

/**
 * @mixin IdeHelperAlert
 */
class Alert extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'message',
        'type',
        'priority',
        'alertable_type',
        'alertable_id',
        'recipients',
        'is_read',
        'email_sent',
        'triggered_at',
        'acknowledged_at',
        'acknowledged_by',
        'metadata'
    ];

    protected $casts = [
        'recipients' => 'array',
        'metadata' => 'array',
        'is_read' => 'boolean',
        'email_sent' => 'boolean',
        'triggered_at' => 'datetime',
        'acknowledged_at' => 'datetime',
    ];

    public function alertable(): MorphTo
    {
        return $this->morphTo();
    }

    public function acknowledgedBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'acknowledged_by');
    }

    public function getPriorityColorAttribute()
    {
        return match($this->priority) {
            'critical' => 'red',
            'high' => 'orange',
            'medium' => 'yellow',
            'low' => 'blue',
            default => 'gray'
        };
    }

    public function getTypeColorAttribute()
    {
        return match($this->type) {
            'error' => 'red',
            'warning' => 'yellow',
            'success' => 'green',
            'info' => 'blue',
            default => 'gray'
        };
    }

    public function scopeUnread($query)
    {
        return $query->where('is_read', false);
    }

    public function scopeByPriority($query, $priority)
    {
        return $query->where('priority', $priority);
    }

    public function scopeByType($query, $type)
    {
        return $query->where('type', $type);
    }

    public function scopeRecent($query, $days = 7)
    {
        return $query->where('triggered_at', '>=', now()->subDays($days));
    }
}
