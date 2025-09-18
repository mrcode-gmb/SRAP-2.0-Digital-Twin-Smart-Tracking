<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * @mixin IdeHelperChatbotConversation
 */
class ChatbotConversation extends Model
{
    use HasFactory;

    protected $fillable = [
        'session_id',
        'user_id',
        'user_message',
        'bot_response',
        'intent',
        'entities',
        'confidence_score',
        'response_type',
        'context',
        'is_helpful',
        'feedback',
        'ip_address'
    ];

    protected $casts = [
        'entities' => 'array',
        'context' => 'array',
        'confidence_score' => 'decimal:2',
        'is_helpful' => 'boolean',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function scopeBySession($query, $sessionId)
    {
        return $query->where('session_id', $sessionId);
    }

    public function scopeWithFeedback($query)
    {
        return $query->whereNotNull('is_helpful');
    }

    public function scopePositiveFeedback($query)
    {
        return $query->where('is_helpful', true);
    }

    public function scopeRecent($query, $days = 7)
    {
        return $query->where('created_at', '>=', now()->subDays($days));
    }
}
