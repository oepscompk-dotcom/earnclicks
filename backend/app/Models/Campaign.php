<?php

namespace App\Models;

use App\Enums\CampaignStatus;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class Campaign extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'advertiser_id',
        'name',
        'platform',
        'task_type',
        'task_url',
        'reward_per_task',
        'total_budget',
        'spent',
        'daily_limit',
        'total_tasks',
        'completed_tasks',
        'status',
        'countries',
        'gender',
        'age_min',
        'age_max',
        'start_date',
        'end_date',
        'instructions',
        'is_featured',
    ];

    protected function casts(): array
    {
        return [
            'reward_per_task' => 'float',
            'total_budget' => 'float',
            'spent' => 'float',
            'daily_limit' => 'integer',
            'total_tasks' => 'integer',
            'completed_tasks' => 'integer',
            'countries' => 'array',
            'age_min' => 'integer',
            'age_max' => 'integer',
            'start_date' => 'date',
            'end_date' => 'date',
            'is_featured' => 'boolean',
        ];
    }

    public function advertiser(): BelongsTo
    {
        return $this->belongsTo(User::class, 'advertiser_id');
    }

    public function tasks(): HasMany
    {
        return $this->hasMany(Task::class);
    }

    public function submissions(): HasMany
    {
        return $this->hasMany(TaskSubmission::class);
    }

    public function isPending(): bool
    {
        return $this->status === CampaignStatus::PENDING;
    }

    public function isApproved(): bool
    {
        return $this->status === CampaignStatus::APPROVED;
    }

    public function isPaused(): bool
    {
        return $this->status === CampaignStatus::PAUSED;
    }

    public function canAcceptTasks(): bool
    {
        return $this->isApproved()
            && $this->completed_tasks < $this->total_tasks
            && $this->spent < $this->total_budget
            && $this->start_date->lte(now())
            && $this->end_date->gte(now());
    }

    public function getCompletionPercentageAttribute(): float
    {
        if ($this->total_tasks === 0) return 0;
        return round(($this->completed_tasks / $this->total_tasks) * 100, 1);
    }

    public function getRemainingBudgetAttribute(): float
    {
        return $this->total_budget - $this->spent;
    }
}
