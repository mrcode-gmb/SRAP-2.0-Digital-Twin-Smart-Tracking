<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * @mixin IdeHelperAiPrediction
 */
class AiPrediction extends Model
{
    use HasFactory;

    protected $fillable = [
        'prediction_type',
        'target_type',
        'target_id',
        'input_data',
        'prediction_result',
        'confidence_score',
        'prediction_date',
        'forecast_period_start',
        'forecast_period_end',
        'model_version',
        'parameters',
        'status',
        'notes',
        'requested_by'
    ];

    protected $casts = [
        'input_data' => 'array',
        'prediction_result' => 'array',
        'parameters' => 'array',
        'confidence_score' => 'decimal:2',
        'prediction_date' => 'date',
        'forecast_period_start' => 'date',
        'forecast_period_end' => 'date',
    ];

    public function requester(): BelongsTo
    {
        return $this->belongsTo(User::class, 'requested_by');
    }

    public function getConfidenceLevelAttribute()
    {
        if ($this->confidence_score >= 90) return 'Very High';
        if ($this->confidence_score >= 75) return 'High';
        if ($this->confidence_score >= 60) return 'Medium';
        if ($this->confidence_score >= 40) return 'Low';
        return 'Very Low';
    }

    public function scopeCompleted($query)
    {
        return $query->where('status', 'completed');
    }

    public function scopeByType($query, $type)
    {
        return $query->where('prediction_type', $type);
    }

    public function scopeRecent($query, $days = 30)
    {
        return $query->where('prediction_date', '>=', now()->subDays($days));
    }
}
