<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use App\Models\Kpis;

/**
 * @mixin IdeHelperUser
 */
class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'role',
        'department_id',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    /**
     * Get the user's role display name.
     */
    public function department()
    {
        return $this->belongsTo(Department::class);
    }

    public function createdKpis()
    {
        return $this->hasMany(Kpis::class, 'created_by');
    }

    public function assignedMilestones()
    {
        return $this->hasMany(Milestone::class, 'assigned_to');
    }

    public function kpiProgress()
    {
        return $this->hasMany(KpiProgress::class, 'reported_by');
    }

    public function verifiedProgress()
    {
        return $this->hasMany(KpiProgress::class, 'verified_by');
    }

    public function alerts()
    {
        return $this->hasMany(Alert::class, 'acknowledged_by');
    }

    public function reports()
    {
        return $this->hasMany(Report::class, 'generated_by');
    }

    public function aiPredictions()
    {
        return $this->hasMany(AiPrediction::class, 'requested_by');
    }

    public function chatbotConversations()
    {
        return $this->hasMany(ChatbotConversation::class);
    }

    public function getRoleDisplayNameAttribute(): string
    {
        return match($this->role) {
            'admin' => 'Administrator',
            'data_officer' => 'Data Officer',
            'hod' => 'Head of Department',
            'staff' => 'Staff',
            default => 'Staff',
        };
    }

    /**
     * Check if user has a specific role.
     */
    public function hasRole(string $role): bool
    {
        return $this->role === $role;
    }

    public function scopeActive($query)
    {
        return $query->whereNotNull('email_verified_at');
    }

    /**
     * Check if user has any of the given roles.
     */
    public function hasAnyRole(array $roles): bool
    {
        return in_array($this->role, $roles);
    }
}
