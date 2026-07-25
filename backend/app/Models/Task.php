<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Task extends Model
{
    use HasFactory;

    protected $fillable = [
        'campaign_id',
        'title',
        'description',
        'platform',
        'task_type',
        'reward',
        'status',
        'max_submissions',
        'current_submissions',
    ];

    protected function casts(): array
    {
        return [
            'reward' => 'float',
            'max_submissions' => 'integer',
            'current_submissions' => 'integer',
        ];
    }

    public function campaign(): BelongsTo
    {
        return $this->belongsTo(Campaign::class);
    }

    public function submissions(): HasMany
    {
        return $this->hasMany(TaskSubmission::class);
    }

    public function isAvailable(): bool
    {
        return $this->status === 'active'
            && $this->current_submissions < $this->max_submissions;
    }
}
