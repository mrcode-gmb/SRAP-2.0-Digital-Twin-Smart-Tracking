<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use App\Models\Kpis;

/**
 * @mixin IdeHelperDepartment
 */
class Department extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'code',
        'description',
        'head_of_department',
        'contact_email',
        'contact_phone',
        'is_active'
    ];

    protected $casts = [
        'is_active' => 'boolean',
    ];

    public function users(): HasMany
    {
        return $this->hasMany(User::class);
    }

    public function kpis(): HasMany
    {
        return $this->hasMany(Kpis::class);
    }

    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }
}
