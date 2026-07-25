<?php

namespace App\Models;

use App\Enums\SubmissionStatus;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class TaskSubmission extends Model
{
    use HasFactory;

    protected $fillable = [
        'task_id',
        'user_id',
        'campaign_id',
        'proof_url',
        'proof_type',
        'status',
        'admin_note',
        'ip_address',
        'device_info',
        'verified_at',
        'reward_amount',
    ];

    protected function casts(): array
    {
        return [
            'verified_at' => 'datetime',
            'reward_amount' => 'float',
        ];
    }

    public function task(): BelongsTo
    {
        return $this->belongsTo(Task::class);
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function campaign(): BelongsTo
    {
        return $this->belongsTo(Campaign::class);
    }

    public function isPending(): bool
    {
        return $this->status === SubmissionStatus::PENDING;
    }

    public function isApproved(): bool
    {
        return $this->status === SubmissionStatus::APPROVED;
    }

    public function isRejected(): bool
    {
        return $this->status === SubmissionStatus::REJECTED;
    }
}
